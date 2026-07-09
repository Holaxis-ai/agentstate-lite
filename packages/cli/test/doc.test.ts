/**
 * `doc write`/`doc update`/`doc read` — usability findings F1 and F3, plus the new `doc update`
 * patch verb.
 *
 * F1 (P1, data loss): `doc write` on an EXISTING doc with a non-empty body, given NO body source at
 * all (no --body, no --body-file, no piped stdin), used to silently persist an EMPTY body. It now
 * refuses (USAGE) unless the caller supplies SOME body source — --body (even --body ""), --body-file
 * (even pointing at an empty file), or a real NON-EMPTY stdin pipe — or passes --blank-body to opt in
 * deliberately. A brand-new doc with no body source stays allowed (empty body is a valid creation).
 *
 * Round-review fix (P1, BLOCKING): the guard above was bypassed in agent harnesses, where stdin is
 * commonly a character device with `isTTY === undefined` — the old `process.stdin.isTTY`-only check
 * misread that as "there's a pipe", read `""`, and handed the guard an EXPLICIT empty body source,
 * reproducing the exact silent blanking F1 closes. `defaultReadStdin` now fstats fd 0 and only reads
 * for a FIFO or a regular file; belt-and-braces on top, an EMPTY stdin read no longer counts as
 * explicit at all (only non-empty piped content does). See `doc-cli-integration.test.ts` for the
 * dedicated BUILT-CLI integration test that reproduces the agent-harness shape directly (a subprocess
 * with stdin redirected from `/dev/null`) — the class of test whose absence let the bug ship.
 *
 * `doc update <id>` is the field-level patch verb: only the fields actually passed change; everything
 * else — including the body when neither --body, --body-file, nor a non-empty piped stdin body is
 * given — is preserved. It writes via the SAME versioned-read -> mutate -> compare-and-swap-write
 * pattern `link add` proves (`link.test.ts`), with a bounded conflict retry, and is now idempotent: a
 * repeated patch that changes nothing (ignoring the timestamp) converges to `changed:false` without
 * writing or refreshing the timestamp.
 *
 * F3 (P2, bundle pollution): `doc read --out <path>` for a LOCAL bundle, where the resolved --out
 * path lands INSIDE the open bundle's root, now carries a loud `warning` field on the receipt whose
 * wording matches what actually happens next: a non-reserved `.md` target is re-ingested as a
 * duplicate concept on the next bundle walk; a reserved filename (`index.md`/`log.md`) instead
 * CLOBBERS that file; a non-`.md` target is inert (no warning). The write is still allowed in every
 * case — a deliberate in-bundle copy or reserved-file re-export is conceivable.
 *
 * Runs command functions in-process (no subprocess) against a real temp filesystem bundle, mirroring
 * `link.test.ts`/`kinds.test.ts`'s pattern. The CAS-retry test additionally boots a real
 * `@agentstate-lite/server` `serve()` instance over a `MemoryBackend` bundle, mirroring
 * `remote.test.ts`'s multi-writer convergence tests (real enforced CAS, unlike the degenerate
 * filesystem adapter's best-effort CAS).
 *
 * Test-authoring note: a body-less `doc write`/`doc update` call with NO `readStdin` override falls
 * through to `defaultReadStdin`, which reads REAL `process.stdin` and hangs under `node --test`
 * (mirrors `kinds.test.ts`'s identical note). Every such call below passes an explicit `readStdin`
 * override — `async () => undefined` to simulate no real input at all (TTY / character device / fstat
 * error — F1's "nothing given" case), `async () => ""` to simulate a real but EMPTY pipe (also
 * "nothing given", post round-review), or `async () => "<content>"` to simulate a real NON-EMPTY pipe.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  initBundle,
  writeDoc,
  readDoc,
  readDocVersioned,
  docVersions,
  loadKinds,
  parseLinks,
  MemoryBackend,
  CONVENTION_TYPE,
  type Bundle,
} from "@agentstate-lite/core";
import { serve, type ServerHandle } from "@agentstate-lite/server";

import { doc, type DocCliDeps } from "../src/commands/doc.js";
import { mutateDoc } from "../src/mutate.js";
import { CliError } from "../src/errors.js";
import { cliInvocation } from "../src/invocation.js";
import { applyRecipe } from "../src/recipes.js";
import { CONTEXT_NOTES_RECIPE } from "../src/recipe-source.js";

const OLD_TS = "2020-01-01T00:00:00.000Z";
const T = "2026-07-01T00:00:00.000Z";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-doc-test-"));
}

/** A fresh temp OKF bundle (no kinds seeded). */
async function makeBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  await initBundle(dir);
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/** A fresh bundle with the Context Note kind applied (mirrors `kinds.test.ts`'s helper). */
async function makeSeededBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  await initBundle(dir);
  await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/**
 * A fresh bundle carrying a `Task` kind convention shaped like the deployed lite bundle's real one:
 * `path: "tasks/"`, required `[title, status]`, optional `[priority, assignee, description]`,
 * `values.status` an enum — mirrors `kinds.test.ts`'s enum-convention fixture pattern.
 */
async function makeTaskBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  await initBundle(dir);
  await writeDoc(
    { root: dir },
    {
      id: "conventions/task",
      frontmatter: {
        type: CONVENTION_TYPE,
        title: "Task",
        governs: "Task",
        path: "tasks/",
        fields: {
          required: ["title", "status"],
          optional: ["priority", "assignee", "description"],
          values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] },
        },
        timestamp: T,
      },
      body: "A trackable unit of work.",
    },
  );
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/**
 * Run `doc` in-process, capturing + parsing its `--json` stdout. Defaults `readStdin` to the
 * "interactive TTY, nothing piped" case (`undefined`) so a body-less call never touches real stdin —
 * override it per-test (e.g. `readStdin: async () => ""`) to simulate an actual pipe.
 */
async function runDoc(argv: string[], deps: Partial<DocCliDeps> = {}): Promise<Record<string, unknown>> {
  let out = "";
  await doc([...argv, "--json"], { stdout: (s) => (out += s), readStdin: async () => undefined, ...deps });
  return JSON.parse(out) as Record<string, unknown>;
}

/** Boot the reference server over `bundle` (a real socket listener, ephemeral port). */
async function bootServerOverBundle(bundle: Bundle): Promise<{ url: string; close: () => Promise<void> }> {
  const handle: ServerHandle = await serve({ bundle, port: 0 });
  return { url: `http://${handle.host}:${handle.port}`, close: () => handle.close() };
}

// ── F1: doc write's body-blanking guard ─────────────────────────────────────────────────────────

test("doc write F1: refuses to blank an EXISTING doc's non-empty body when NO body source is given (USAGE, exit 2)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Original body." },
    );

    await assert.rejects(
      () => doc(["write", "concepts/a", "--type", "Concept", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /body source/);
        assert.match(err.message, /--blank-body/);
        assert.match(err.message, /doc update/);
        return true;
      },
    );

    // Nothing was touched — the original body survives.
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "Original body.\n");
  } finally {
    await cleanup();
  }
});

test("doc write F1: --blank-body deliberately blanks an EXISTING doc's body (exit 0)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Original body." },
    );

    const result = await runDoc(["write", "concepts/a", "--type", "Concept", "--blank-body", "--dir", dir]);
    assert.equal(result.doc, "written");

    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "\n");
  } finally {
    await cleanup();
  }
});

test("doc write F1: a NEW doc with no body source is still allowed (empty body is a valid creation)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    const result = await runDoc(["write", "concepts/brand-new", "--type", "Concept", "--dir", dir]);
    assert.equal(result.doc, "written");

    const saved = await readDoc({ root: dir }, "concepts/brand-new");
    assert.equal(saved.body, "\n");
  } finally {
    await cleanup();
  }
});

test("doc write F1: an EXISTING doc whose body is ALREADY empty can be re-written with no body source (nothing at risk)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/empty", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "" });
    const result = await runDoc(["write", "concepts/empty", "--type", "Concept", "--dir", dir]);
    assert.equal(result.doc, "written");
  } finally {
    await cleanup();
  }
});

test("doc write F1: --body \"\" is an EXPLICIT (empty) source and does not require --blank-body", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." },
    );
    const result = await runDoc(["write", "concepts/a", "--type", "Concept", "--body", "", "--dir", dir]);
    assert.equal(result.doc, "written");
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "\n");
  } finally {
    await cleanup();
  }
});

test("doc write F1 (round-review, flips prior behavior): a real but EMPTY stdin pipe does NOT count as an explicit source — still refuses without --blank-body", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." },
    );
    // readStdin resolving to "" (not undefined) simulates a REAL pipe carrying EMPTY content. The
    // ORIGINAL F1 guard treated any real pipe — even an empty one — as an explicit source; the
    // round-review belt-and-braces fix instead treats an empty pipe the SAME as no input at all,
    // since an agent harness's redirected-but-dataless stdin can be indistinguishable from a
    // deliberate empty pipe. Only --body ""/--body-file/a NON-EMPTY pipe count as explicit now.
    await assert.rejects(
      () =>
        doc(["write", "concepts/a", "--type", "Concept", "--dir", dir, "--json"], {
          readStdin: async () => "",
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.match(err.message, /body source/);
        return true;
      },
    );
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "Original body.\n");
  } finally {
    await cleanup();
  }
});

test("doc write F1: a real NON-EMPTY stdin pipe IS an explicit source and does not require --blank-body", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." },
    );
    const result = await runDoc(["write", "concepts/a", "--type", "Concept", "--dir", dir], {
      readStdin: async () => "Piped replacement.",
    });
    assert.equal(result.doc, "written");
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "Piped replacement.\n");
  } finally {
    await cleanup();
  }
});

// ── Link-drop guard: a --body/--body-file full replace must not silently drop outbound links ──────
//
// SHORT-TERM guard (roadmap-items/link-model-body-safe supersedes it with preserve-by-default): OKF
// cross-links live IN the body, so a full-body replace silently drops them unless the new body
// happens to repeat them. Fires ONLY on real loss — an existing link SURVIVES (no refusal) when the
// new body still carries a link to the same resolved target with the same text, which is what the
// ordinary `doc read` -> edit -> `doc update --body` round trip produces (the anti-over-fire case).

test("doc update --body: refuses when the new body would DROP an existing outbound link (USAGE, exit 2), names it, and leaves the doc UNCHANGED", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "b", frontmatter: { type: "Concept", title: "B", timestamp: OLD_TS }, body: "Target." },
    );
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );

    await assert.rejects(
      () => doc(["update", "a", "--body", "New prose, no links.", "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /drop 1 outbound link/);
        assert.match(err.message, /'ref' -> b/);
        assert.match(err.message, /--replace-links/);
        return true;
      },
    );

    // Unchanged: same body, same single outbound link.
    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "Intro.\n\n[ref](b.md)\n");
    assert.deepEqual(
      parseLinks({ root: dir }, after).map((l) => ({ to: l.to, text: l.text })),
      [{ to: "b", text: "ref" }],
    );
  } finally {
    await cleanup();
  }
});

test("doc update --body --replace-links: proceeds and deliberately drops the link", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );

    const result = await runDoc(["update", "a", "--body", "New prose, no links.", "--replace-links", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "New prose, no links.\n");
    assert.equal(parseLinks({ root: dir }, after).length, 0);
  } finally {
    await cleanup();
  }
});

test("doc update --body: a read-modify-write whose new body STILL contains the existing link does NOT false-refuse (anti-over-fire)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );

    // Edit the prose but keep the exact same link markdown — the normal doc-read -> edit -> doc-update
    // cycle, since `doc read` returns the body WITH its links.
    const result = await runDoc([
      "update",
      "a",
      "--body",
      "Rewritten intro with more detail.\n\n[ref](b.md)\n",
      "--dir",
      dir,
    ]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "Rewritten intro with more detail.\n\n[ref](b.md)\n");
    assert.deepEqual(
      parseLinks({ root: dir }, after).map((l) => ({ to: l.to, text: l.text })),
      [{ to: "b", text: "ref" }],
    );
  } finally {
    await cleanup();
  }
});

test("doc update: a FIELD-ONLY patch (no --body) is unaffected by the link-drop guard — no --replace-links needed, link preserved", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );

    const result = await runDoc(["update", "a", "--tag", "reviewed", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "Intro.\n\n[ref](b.md)\n");
    assert.equal(parseLinks({ root: dir }, after).length, 1);
  } finally {
    await cleanup();
  }
});

test("doc update --body-file: same guard behavior — refuses a dropping replace, proceeds with --replace-links", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );
    const bodyFile = path.join(dir, "new-body.md");
    await writeFile(bodyFile, "New prose from a file, no links.", "utf8");

    await assert.rejects(
      () => doc(["update", "a", "--body-file", bodyFile, "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /drop 1 outbound link/);
        return true;
      },
    );
    assert.equal((await readDoc({ root: dir }, "a")).body, "Intro.\n\n[ref](b.md)\n");

    const result = await runDoc(["update", "a", "--body-file", bodyFile, "--replace-links", "--dir", dir]);
    assert.equal(result.doc, "updated");
    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "New prose from a file, no links.\n");
    assert.equal(parseLinks({ root: dir }, after).length, 0);
  } finally {
    await cleanup();
  }
});

test("doc write --body on an existing linked doc: same guard — refuses a dropping replace (USAGE, exit 2), proceeds with --replace-links", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Intro.\n\n[ref](b.md)\n" },
    );

    await assert.rejects(
      () => doc(["write", "a", "--type", "Concept", "--body", "Blind overwrite, no links.", "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /drop 1 outbound link/);
        return true;
      },
    );
    assert.equal((await readDoc({ root: dir }, "a")).body, "Intro.\n\n[ref](b.md)\n");

    const result = await runDoc([
      "write",
      "a",
      "--type",
      "Concept",
      "--body",
      "Blind overwrite, no links.",
      "--replace-links",
      "--dir",
      dir,
    ]);
    assert.equal(result.doc, "written");
    const after = await readDoc({ root: dir }, "a");
    assert.equal(after.body, "Blind overwrite, no links.\n");
    assert.equal(parseLinks({ root: dir }, after).length, 0);
  } finally {
    await cleanup();
  }
});

test("doc write: a NEW doc (no existing doc) is unaffected by the link-drop guard — nothing to lose", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    const result = await runDoc(["write", "concepts/brand-new", "--type", "Concept", "--body", "Fresh, no links.", "--dir", dir]);
    assert.equal(result.doc, "written");
  } finally {
    await cleanup();
  }
});

// ── doc write --actor (API consistency with doc update/delete) ─────────────────────────────────────

test("doc write --actor '' (blank): USAGE (exit 2)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await assert.rejects(
      () =>
        doc(["write", "concepts/a", "--type", "Concept", "--body", "b", "--actor", "", "--dir", dir, "--json"], {
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /empty value/);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc write --actor: accepted over a filesystem bundle (no crash)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    const result = await runDoc(["write", "concepts/a", "--type", "Concept", "--actor", "alice", "--dir", dir]);
    assert.equal(result.doc, "written");
  } finally {
    await cleanup();
  }
});

test("doc write --actor: recorded in version history on a PERSISTING backend (MemoryBackend, mutate-level thread-through proof)", async () => {
  const bundle: Bundle = { root: "mem://doc-write-actor-test", backend: new MemoryBackend() };
  const registry = await loadKinds(bundle);
  const result = await mutateDoc({
    bundle,
    id: "concepts/a",
    mode: "overwrite",
    registry,
    strict: false,
    helpOnKindReject: "kinds",
    actor: "alice",
    buildCandidate: () => ({ frontmatter: { type: "Concept", timestamp: T }, body: "b" }),
    errors: {},
  });
  assert.ok(result.doc);
  const history = await docVersions(bundle, "concepts/a");
  assert.equal(history[0]!.actor, "alice");
});

// ── --actor persists into frontmatter (sync attribution — adjudication F / PR#13 item 3) ─────────

test("doc write --actor: persists the actor as the doc's OWN frontmatter field (the per-doc attribution sync reads)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await runDoc(["write", "concepts/attributed", "--type", "Concept", "--body", "b", "--actor", "alice", "--dir", dir]);
    const saved = await readDoc({ root: dir }, "concepts/attributed");
    assert.equal(saved.frontmatter.actor, "alice");
  } finally {
    await cleanup();
  }
});

test("doc write WITHOUT --actor: no actor frontmatter field appears (absent stays absent — no default, no env fallback)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await runDoc(["write", "concepts/plain", "--type", "Concept", "--body", "b", "--dir", dir]);
    const saved = await readDoc({ root: dir }, "concepts/plain");
    assert.ok(!("actor" in saved.frontmatter), "no actor key must be persisted when --actor was not given");
  } finally {
    await cleanup();
  }
});

test("doc write overwrite WITHOUT --actor: an existing actor field is dropped (full replace) and honestly reported in dropped_fields", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await runDoc(["write", "concepts/a", "--type", "Concept", "--body", "b", "--actor", "alice", "--dir", dir]);
    const result = await runDoc(["write", "concepts/a", "--type", "Concept", "--body", "b2", "--dir", dir]);
    assert.ok((result.dropped_fields as string[]).includes("actor"), "the dropped actor is surfaced, never silent");
    const saved = await readDoc({ root: dir }, "concepts/a");
    assert.ok(!("actor" in saved.frontmatter), "doc write is a full replace — the un-resupplied actor is gone");
  } finally {
    await cleanup();
  }
});

// ── doc update ───────────────────────────────────────────────────────────────────────────────────

test("doc update: patches ONE field, preserving the body and every other field verbatim, refreshes timestamp", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      {
        id: "concepts/a",
        frontmatter: {
          type: "Concept",
          title: "Old Title",
          description: "Old description",
          resource: "https://example.com/thing",
          tags: ["x", "y"],
          timestamp: OLD_TS,
        },
        body: "Body content that must survive.",
      },
    );

    const before = Date.now();
    const result = await runDoc(["update", "concepts/a", "--title", "New Title", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.type, "Concept");

    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.frontmatter.title, "New Title");
    assert.equal(after.frontmatter.description, "Old description");
    assert.equal(after.frontmatter.resource, "https://example.com/thing");
    assert.deepEqual(after.frontmatter.tags, ["x", "y"]);
    assert.equal(after.body, "Body content that must survive.\n");

    const ts = after.frontmatter.timestamp as string;
    assert.notEqual(ts, OLD_TS, "timestamp must refresh by default (a patch is a meaningful change)");
    assert.ok(Date.parse(ts) >= before);
  } finally {
    await cleanup();
  }
});

test("doc update --tag: REPLACES the whole tag set, not adds to it", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", tags: ["x", "y"], timestamp: OLD_TS }, body: "Body." },
    );
    await runDoc(["update", "concepts/a", "--tag", "z", "--dir", dir]);
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.deepEqual(after.frontmatter.tags, ["z"]);
  } finally {
    await cleanup();
  }
});

test("doc update: --body replaces the body while leaving frontmatter fields untouched", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "T", timestamp: OLD_TS }, body: "Old body." },
    );
    await runDoc(["update", "concepts/a", "--body", "New body.", "--dir", dir]);
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "New body.\n");
    assert.equal(after.frontmatter.title, "T");
  } finally {
    await cleanup();
  }
});

test("doc update: accepts a NON-EMPTY piped stdin body (previously silently dropped)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "T", timestamp: OLD_TS }, body: "Old body." },
    );
    let out = "";
    await doc(["update", "concepts/a", "--dir", dir, "--json"], {
      stdout: (s) => (out += s),
      readStdin: async () => "Piped patch body.",
    });
    const result = JSON.parse(out) as Record<string, unknown>;
    assert.equal(result.doc, "updated");
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "Piped patch body.\n");
    assert.equal(after.frontmatter.title, "T"); // untouched
  } finally {
    await cleanup();
  }
});

test("doc update: an EMPTY piped stdin body does NOT count as a patch field (mirrors doc write's belt-and-braces rule) — no other field given is still USAGE", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    await assert.rejects(
      () => doc(["update", "concepts/a", "--dir", dir, "--json"], { readStdin: async () => "" }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        return true;
      },
    );
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "Body.\n");
  } finally {
    await cleanup();
  }
});

test("doc update: idempotent — an identical repeated patch converges to changed:false, no write, unchanged timestamp on disk", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "T", tags: ["x"], timestamp: OLD_TS }, body: "Body." },
    );
    // First patch: a REAL change — title differs, timestamp refreshes.
    const first = await runDoc(["update", "concepts/a", "--title", "T2", "--dir", dir]);
    assert.equal(first.doc, "updated");
    assert.equal(first.changed, true);
    const afterFirst = await readDoc({ root: dir }, "concepts/a");
    const tsAfterFirst = afterFirst.frontmatter.timestamp;
    assert.notEqual(tsAfterFirst, OLD_TS);

    // Second, IDENTICAL patch: --title T2 again is a true no-op — converges to changed:false,
    // does NOT write, does NOT refresh the timestamp a second time.
    const second = await runDoc(["update", "concepts/a", "--title", "T2", "--dir", dir]);
    assert.equal(second.doc, "updated");
    assert.equal(second.changed, false);
    assert.equal(second.timestamp, tsAfterFirst);

    const afterSecond = await readDoc({ root: dir }, "concepts/a");
    assert.equal(afterSecond.frontmatter.timestamp, tsAfterFirst, "timestamp must NOT refresh on a true no-op patch");
    assert.equal(afterSecond.frontmatter.title, "T2");
    assert.deepEqual(afterSecond.frontmatter.tags, ["x"]);
    assert.equal(afterSecond.body, "Body.\n");
  } finally {
    await cleanup();
  }
});

test("doc update --keep-timestamp: preserves the existing timestamp instead of refreshing it", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "Old", timestamp: OLD_TS }, body: "Body." },
    );
    const result = await runDoc(["update", "concepts/a", "--title", "New", "--keep-timestamp", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.timestamp, OLD_TS);
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.frontmatter.timestamp, OLD_TS);
  } finally {
    await cleanup();
  }
});

test("doc update: absent doc is NOT_FOUND (exit 6)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await assert.rejects(
      () => doc(["update", "concepts/nope", "--title", "X", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "NOT_FOUND");
        assert.equal(err.exitCode, 6);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc update: no patchable field at all is a USAGE error (exit 2) — nothing to do", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    await assert.rejects(
      () => doc(["update", "concepts/a", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
    // --keep-timestamp alone is a modifier, not a patch field — still USAGE.
    await assert.rejects(
      () => doc(["update", "concepts/a", "--keep-timestamp", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc update: kind-aware — patching a doc's type onto a governed kind validates the RESULT (warn-by-default, --strict rejects)", async () => {
  const { dir, cleanup } = await makeSeededBundle();
  try {
    // No title — will violate the seeded Context Note kind (requires title + timestamp) the moment
    // its type is patched onto "Context Note". The body carries the seeded kind's declared
    // `# Summary` section so this test isolates the missing-title warning.
    await writeDoc({ root: dir }, { id: "concepts/needs-title", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "# Summary\n\nA note-shaped body.\n" });

    const warned = await runDoc(["update", "concepts/needs-title", "--type", "Context Note", "--dir", dir]);
    assert.equal(warned.doc, "updated");
    const warnings = warned.warnings as Array<Record<string, unknown>>;
    assert.equal(warnings.length, 1);
    assert.equal(warnings[0]!.field, "title");

    // The doc WAS updated despite the warning (warn-by-default is non-blocking).
    const after = await readDoc({ root: dir }, "concepts/needs-title");
    assert.equal(after.frontmatter.type, "Context Note");
  } finally {
    await cleanup();
  }
});

test("doc update --strict: upgrades a non-empty warning set to a USAGE error (exit 2), does NOT write", async () => {
  const { dir, cleanup } = await makeSeededBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/needs-title", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "" });

    await assert.rejects(
      () =>
        doc(["update", "concepts/needs-title", "--type", "Context Note", "--strict", "--dir", dir, "--json"], {
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /does not satisfy the 'Context Note' kind/);
        return true;
      },
    );

    // Rejected before writing: the type is still the original.
    const after = await readDoc({ root: dir }, "concepts/needs-title");
    assert.equal(after.frontmatter.type, "Concept");
  } finally {
    await cleanup();
  }
});

// ── FACET 2: `doc update --<field>` patches kind-declared fields ───────────────────────────────

test("doc update: status transition via a kind-declared --<field> flag — the headline recipe (--dir)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", priority: "high", timestamp: OLD_TS }, body: "" },
    );

    const result = await runDoc(["update", "tasks/x", "--status", "done", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "done");
    // No silent data loss (F1 class): title and priority survive untouched.
    assert.equal(after.frontmatter.title, "Ship it");
    assert.equal(after.frontmatter.priority, "high");
  } finally {
    await cleanup();
  }
});

test("doc update: status transition via a kind-declared --<field> flag over --remote (MemoryBackend, real enforced CAS)", async () => {
  const bundle: Bundle = { root: "mem://doc-update-kind-field-remote", backend: new MemoryBackend() };
  await writeDoc(bundle, {
    id: "conventions/task",
    frontmatter: {
      type: CONVENTION_TYPE,
      title: "Task",
      governs: "Task",
      path: "tasks/",
      fields: {
        required: ["title", "status"],
        optional: ["priority", "assignee", "description"],
        values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] },
      },
      timestamp: T,
    },
    body: "A trackable unit of work.",
  });
  await writeDoc(bundle, {
    id: "tasks/x",
    frontmatter: { type: "Task", title: "Ship it", status: "in_progress", priority: "high", timestamp: OLD_TS },
    body: "",
  });
  const server = await bootServerOverBundle(bundle);
  try {
    const result = await runDoc(["update", "tasks/x", "--status", "done", "--remote", server.url]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);

    const after = await readDoc(bundle, "tasks/x");
    assert.equal(after.frontmatter.status, "done");
    assert.equal(after.frontmatter.title, "Ship it");
    assert.equal(after.frontmatter.priority, "high");
  } finally {
    await server.close();
  }
});

test("doc update: multiple kind-declared fields patched in one call", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "todo", timestamp: OLD_TS }, body: "" },
    );

    const result = await runDoc(["update", "tasks/x", "--status", "blocked", "--priority", "low", "--dir", dir]);
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "blocked");
    assert.equal(after.frontmatter.priority, "low");
    assert.equal(after.frontmatter.title, "Ship it");
  } finally {
    await cleanup();
  }
});

test("doc update: a standard field and a kind field together — strict mode (triggered by the kind field) still writes when valid", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Old title", status: "todo", timestamp: OLD_TS }, body: "" },
    );

    const result = await runDoc(["update", "tasks/x", "--title", "New title", "--status", "done", "--dir", dir]);
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.title, "New title");
    assert.equal(after.frontmatter.status, "done");
  } finally {
    await cleanup();
  }
});

test("doc update: repeated identical kind-field patch converges to changed:false with an unchanged on-disk timestamp", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", timestamp: OLD_TS }, body: "" },
    );

    const first = await runDoc(["update", "tasks/x", "--status", "done", "--dir", dir]);
    assert.equal(first.changed, true);
    const afterFirst = await readDoc({ root: dir }, "tasks/x");
    const tsAfterFirst = afterFirst.frontmatter.timestamp;
    assert.notEqual(tsAfterFirst, OLD_TS);

    const second = await runDoc(["update", "tasks/x", "--status", "done", "--dir", dir]);
    assert.equal(second.changed, false);

    const afterSecond = await readDoc({ root: dir }, "tasks/x");
    assert.equal(afterSecond.frontmatter.timestamp, tsAfterFirst, "a no-op kind-field patch must not bump the on-disk timestamp");
  } finally {
    await cleanup();
  }
});

test("doc update: an out-of-enum kind-field value is STRICT-by-default (rejects even without --strict), exit 2, no write", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", timestamp: OLD_TS }, body: "" },
    );

    await assert.rejects(
      () => doc(["update", "tasks/x", "--status", "frobnicate", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /does not satisfy the 'Task' kind/);
        assert.match(err.message, /frobnicate/);
        return true;
      },
    );

    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "in_progress");
  } finally {
    await cleanup();
  }
});

test("doc update: an unknown kind-field flag (e.g. a typo) rejects with USAGE, exit 2, listing declared fields; no write", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", timestamp: OLD_TS }, body: "" },
    );

    await assert.rejects(
      () => doc(["update", "tasks/x", "--sttatus", "done", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /unknown field\(s\) for kind 'Task'/);
        assert.match(err.message, /sttatus/);
        assert.match(err.message, /status/);
        return true;
      },
    );

    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "in_progress");
  } finally {
    await cleanup();
  }
});

test("doc update: a kind-declared --<field> flag on an UNGOVERNED type rejects with USAGE, exit 2; no write", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/plain", frontmatter: { type: "Concept", title: "Plain", timestamp: OLD_TS }, body: "" },
    );

    await assert.rejects(
      () => doc(["update", "concepts/plain", "--status", "done", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /no kind governs type 'Concept'/);
        return true;
      },
    );

    const after = await readDoc({ root: dir }, "concepts/plain");
    assert.equal(after.frontmatter.status, undefined);
  } finally {
    await cleanup();
  }
});

test("doc update: a STANDARD-only patch that violates a governing kind stays warn-by-default (non-regression)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    // Missing `status` (a required field) — but the patch below only touches --description, a
    // standard field, so strict-by-default (triggered only by kind FIELD flags) must NOT engage.
    await writeDoc(
      { root: dir },
      { id: "tasks/needs-status", frontmatter: { type: "Task", title: "Ship it", timestamp: OLD_TS }, body: "" },
    );

    const result = await runDoc(["update", "tasks/needs-status", "--description", "X", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);
    const warnings = result.warnings as Array<Record<string, unknown>> | undefined;
    assert.ok(warnings && warnings.length > 0, "expected a warn-by-default kind warning, not a rejection");
  } finally {
    await cleanup();
  }
});

test("doc update: --body \"\" (explicit empty) still works as a body source alongside the parseArgs token-walk", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." });

    const result = await runDoc(["update", "concepts/a", "--body", "", "--dir", dir]);
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.body, "\n");
  } finally {
    await cleanup();
  }
});

// ── parser-migration coverage: `doc update` retired its hand-rolled parser onto a token-walked `parseArgs` ──

test("doc update: a shell-glued kind-field token names the token, not a positional-count error (parser-migration regression)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "todo", timestamp: OLD_TS }, body: "" },
    );

    // A shell-quoting mistake landing `--status todo` as ONE argv element used to be silently
    // absorbed by the hand-rolled parser's positional bucket and misdirected into a ">1 positional"
    // error — the parseArgs token-walk now names the glued token instead.
    await assert.rejects(
      () => doc(["update", "tasks/x", "--status todo", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /status todo/);
        assert.doesNotMatch(err.message, /positionals/);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc update: a standard value flag with no value (final argv token) is a clean USAGE, not a crash or silent corruption (parser-migration regression)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    // Under parseArgs `strict:false`, a configured `type:"string"` option given no value as the LAST
    // argv token comes back as boolean `true` (parseArgs does NOT throw). The retired hand-roll's
    // takeValue() rejected this with "requires a value"; the token-walk MUST reproduce that. Reading
    // the boolean back would either silently persist `title:true` (exit 0 — corruption) or crash a
    // later `.trim()` on `--expected-version`/`--actor` (RUNTIME, off the capped taxonomy). Each flag
    // is placed LAST so parseArgs can't greedily consume a following token as its value.
    for (const flag of ["--title", "--description", "--type", "--body", "--body-file", "--tag", "--expected-version", "--actor"]) {
      await assert.rejects(
        () => doc(["update", "tasks/x", "--dir", dir, "--json", flag], { readStdin: async () => undefined }),
        (err: unknown) => {
          assert.ok(err instanceof CliError, `${flag}: expected CliError, got ${String(err)}`);
          assert.equal(err.code, "USAGE", `${flag}: code`);
          assert.equal(err.exitCode, 2, `${flag}: exitCode`);
          assert.ok(
            err.message.includes(`${flag} requires a value`),
            `${flag}: message was "${err.message}"`,
          );
          return true;
        },
      );
    }
  } finally {
    await cleanup();
  }
});

test("doc write over an existing doc WARNS about dropped frontmatter fields — never silent (cold-start study r3)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "T", status: "todo", timestamp: OLD_TS }, body: "b" },
    );
    // A full doc write that does not re-supply `status` drops it (doc write is a full replace) — the
    // receipt must surface that, not silently regress the field a prior `new`/`doc update` set.
    const result = await runDoc(["write", "tasks/x", "--type", "Task", "--title", "T", "--body", "b", "--dir", dir]);
    assert.deepEqual(result.dropped_fields, ["status"]);
    assert.match(result.note as string, /doc update/);
  } finally {
    await cleanup();
  }
});

test("doc update on a Convention doc signposts the schema-edit path, not a dead-end (cold-start study r3)", async () => {
  const { dir, cleanup } = await makeTaskBundle(); // seeds conventions/task (type Convention, governs Task)
  try {
    await assert.rejects(
      () => doc(["update", "conventions/task", "--optional", "due", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.match(err.message, /no kind governs type 'Convention'/);
        assert.match(err.message, /kind field/); // points at the dedicated schema-edit command
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc write REFUSES to overwrite a kind convention — it would silently drop the schema and un-declare the kind (cold-start study #3)", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      {
        id: "conventions/widget",
        frontmatter: { type: CONVENTION_TYPE, governs: "Widget", fields: { required: ["title"] }, timestamp: T },
        body: "A widget kind.",
      },
    );
    // `doc write` carries no governs/fields flags — a full overwrite would drop them, killing the kind.
    await assert.rejects(
      () =>
        doc(
          ["write", "conventions/widget", "--type", "Convention", "--title", "W", "--body", "clobber", "--dir", dir],
          { readStdin: async () => undefined },
        ),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /kind convention/);
        assert.match(err.message, /Widget/);
        assert.match(err.message, /doc update/);
        return true;
      },
    );
    // The convention survived intact — its governing kind is still declared.
    const conv = await readDoc({ root: dir }, "conventions/widget");
    assert.equal(conv.frontmatter.governs, "Widget");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("doc update: a repeated kind-declared --<field> becomes an array", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      {
        id: "conventions/widget",
        frontmatter: {
          type: CONVENTION_TYPE,
          title: "Widget",
          governs: "Widget",
          path: "widgets/",
          fields: { required: ["title"], optional: ["label"] },
          timestamp: T,
        },
        body: "A labeled thing.",
      },
    );
    await writeDoc(
      { root: dir },
      { id: "widgets/x", frontmatter: { type: "Widget", title: "X", timestamp: OLD_TS }, body: "" },
    );

    const result = await runDoc(["update", "widgets/x", "--label", "a", "--label", "b", "--dir", dir]);
    assert.equal(result.changed, true);

    const after = await readDoc({ root: dir }, "widgets/x");
    assert.deepEqual(after.frontmatter.label, ["a", "b"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

/**
 * CAS retry, not regressed: N concurrent `doc update`s to the SAME doc through one real server over
 * a `MemoryBackend` bundle (real enforced compare-and-swap, unlike the degenerate filesystem
 * adapter's best-effort CAS — see `remote.test.ts`'s identical convergence-test rationale). Every
 * writer's patch is independent (each sets a distinct --title), so every individual call must land
 * (`doc: "updated"`) within `doc update`'s bounded retry budget, none exhausting it into STALE_HEAD.
 * Writer count is 5 to match `DOC_UPDATE_MAX_ATTEMPTS = 5` (doc.ts) for the same worst-case-4-
 * conflicts-per-writer reasoning `remote.test.ts` documents for `link add` — do not raise the writer
 * count without also reasoning about the retry budget.
 */
test("doc update: CAS retry — N concurrent updates to the SAME doc through one server (MemoryBackend: real enforced CAS) all land, exit 0", async () => {
  const bundle: Bundle = { root: "mem://doc-update-cas-test", backend: new MemoryBackend() };
  await writeDoc(bundle, { id: "shared", frontmatter: { type: "Concept", title: "Shared", timestamp: T }, body: "Shared body." });
  const server = await bootServerOverBundle(bundle);
  try {
    const writers = ["W1", "W2", "W3", "W4", "W5"];
    const results = await Promise.all(
      writers.map(async (w) => {
        let out = "";
        await doc(["update", "shared", "--title", w, "--remote", server.url, "--json"], {
          stdout: (s) => (out += s),
          readStdin: async () => undefined,
        });
        return JSON.parse(out) as Record<string, unknown>;
      }),
    );
    for (const r of results) {
      assert.equal(r.doc, "updated", `expected every concurrent update to land, got ${JSON.stringify(r)}`);
    }
    const finalDoc = await readDoc(bundle, "shared");
    assert.ok(writers.includes(finalDoc.frontmatter.title as string), "final title must be one of the writers' values");
  } finally {
    await server.close();
  }
});

// ── Tier-1 Fork C: `doc update --expected-version` (hard CAS) + `--actor` ──────────────────────

test("doc update --expected-version: happy path — patch succeeds when the token matches the current version", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const { version } = await readDocVersioned({ root: dir }, "tasks/x");
    const result = await runDoc(["update", "tasks/x", "--status", "done", "--expected-version", version, "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);
    const saved = await readDoc({ root: dir }, "tasks/x");
    assert.equal(saved.frontmatter.status, "done");
  } finally {
    await cleanup();
  }
});

test("doc update --expected-version: a STALE token is STALE_HEAD (exit 5) with {expected,actual} details, and does NOT write", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const { version: v1 } = await readDocVersioned({ root: dir }, "tasks/x");
    // Mutate out-of-band so v1 is now stale.
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "in_progress", timestamp: T }, body: "" });
    const { version: v2 } = await readDocVersioned({ root: dir }, "tasks/x");
    assert.notEqual(v1, v2);

    await assert.rejects(
      () => doc(["update", "tasks/x", "--status", "done", "--expected-version", v1, "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "STALE_HEAD");
        assert.equal(err.exitCode, 5);
        assert.deepEqual(err.details, { expected: v1, actual: v2 });
        return true;
      },
    );
    // Untouched by the rejected patch.
    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "in_progress");
  } finally {
    await cleanup();
  }
});

test("doc update --expected-version '' (blank): USAGE (exit 2), never a silent unconditional update", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    await assert.rejects(
      () => doc(["update", "tasks/x", "--status", "done", "--expected-version", "", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /empty value/);
        return true;
      },
    );
    // A blank CAS token must never patch unconditionally — the doc survives untouched.
    const after = await readDoc({ root: dir }, "tasks/x");
    assert.equal(after.frontmatter.status, "todo");
  } finally {
    await cleanup();
  }
});

test("doc update --actor '' (blank): USAGE (exit 2)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    await assert.rejects(
      () => doc(["update", "tasks/x", "--status", "done", "--actor", "", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /empty value/);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc update --expected-version DISABLES the bounded retry (hard CAS): without a token a benign concurrent bump is retried and succeeds; with a stale token it fails STALE_HEAD", async () => {
  // Without --expected-version: pre-existing bounded-retry behavior is unaffected — a regression guard.
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const result = await runDoc(["update", "tasks/x", "--status", "in_progress", "--dir", dir]);
    assert.equal(result.changed, true); // no token given -> succeeds via the normal (auto-retrying) path
  } finally {
    await cleanup();
  }
});

test("doc update --expected-version: matching-version no-op patch converges to changed:false, no write", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const { version } = await readDocVersioned({ root: dir }, "tasks/x");
    const result = await runDoc(["update", "tasks/x", "--status", "todo", "--keep-timestamp", "--expected-version", version, "--dir", dir]);
    assert.equal(result.changed, false);
  } finally {
    await cleanup();
  }
});

test("doc update --expected-version: a stale token on an otherwise-unchanged (no-op-shaped) patch STILL reports STALE_HEAD (premise checked before idempotency)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const { version: v1 } = await readDocVersioned({ root: dir }, "tasks/x");
    // Bump the version out-of-band (a body change — an unconditional write of byte-identical content
    // is itself a no-op and would never bump the version, per the engine's idempotent-write rule).
    // The PATCH below (status=todo, --keep-timestamp) does not touch the body, so it is still
    // no-op-SHAPED relative to whichever doc it lands on — the point is that v1 no longer matches
    // the CURRENT version, so the CAS premise must reject it before idempotency is even considered.
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "bumped" });
    await assert.rejects(
      () =>
        doc(["update", "tasks/x", "--status", "todo", "--keep-timestamp", "--expected-version", v1, "--dir", dir, "--json"], {
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "STALE_HEAD");
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc update --actor: recorded in version history on a PERSISTING backend (MemoryBackend, mutate-level thread-through proof)", async () => {
  const bundle: Bundle = { root: "mem://doc-update-actor-test", backend: new MemoryBackend() };
  await writeDoc(bundle, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
  const registry = await loadKinds(bundle);
  const result = await mutateDoc({
    bundle,
    id: "tasks/x",
    mode: "patch",
    onAbsent: "fail",
    registry,
    strict: false,
    helpOnKindReject: "kinds",
    actor: "alice",
    buildCandidate: (existing) => ({
      frontmatter: { ...existing!.frontmatter, status: "in_progress" },
      body: existing!.body,
    }),
    errors: {},
  });
  assert.equal(result.changed, true);
  const history = await docVersions(bundle, "tasks/x");
  assert.equal(history[0]!.actor, "alice");
});

test("doc update --actor: persists the actor into frontmatter over a filesystem bundle (the degenerate backend keeps no history — frontmatter IS the attribution)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const result = await runDoc(["update", "tasks/x", "--status", "done", "--actor", "alice", "--dir", dir]);
    assert.equal(result.doc, "updated");
    assert.equal(result.changed, true);
    const saved = await readDoc({ root: dir }, "tasks/x");
    assert.equal(saved.frontmatter.actor, "alice", "actor reached frontmatter — the per-doc source sync's enrichment reads");
  } finally {
    await cleanup();
  }
});

test("doc update --actor: OVERWRITES a previous actor; omitting --actor preserves the existing one verbatim", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", actor: "alice", timestamp: T }, body: "" },
    );
    // A later write by a different actor supersedes the attribution.
    await runDoc(["update", "tasks/x", "--status", "in_progress", "--actor", "bob", "--dir", dir]);
    let saved = await readDoc({ root: dir }, "tasks/x");
    assert.equal(saved.frontmatter.actor, "bob");
    // No --actor → the field is untouched (preserved by the patch, not cleared, not defaulted).
    await runDoc(["update", "tasks/x", "--status", "done", "--dir", dir]);
    saved = await readDoc({ root: dir }, "tasks/x");
    assert.equal(saved.frontmatter.actor, "bob");
  } finally {
    await cleanup();
  }
});

test("doc update --actor: an identical patch with the SAME actor stays a no-op (changed:false, no write, no timestamp refresh)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const first = await runDoc(["update", "tasks/x", "--status", "done", "--actor", "alice", "--dir", dir]);
    assert.equal(first.changed, true);
    const tsAfterFirst = (await readDoc({ root: dir }, "tasks/x")).frontmatter.timestamp;
    const again = await runDoc(["update", "tasks/x", "--status", "done", "--actor", "alice", "--dir", dir]);
    assert.equal(again.changed, false, "same content + same actor converges to a no-op, as before this feature");
    assert.equal((await readDoc({ root: dir }, "tasks/x")).frontmatter.timestamp, tsAfterFirst, "no timestamp refresh on the no-op");
  } finally {
    await cleanup();
  }
});

test("doc update --actor over --remote: succeeds AND persists actor into frontmatter through the wire (X-Actor threads separately; server is filesystem-backed so the on-disk doc is assertable)", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc({ root: dir }, { id: "tasks/x", frontmatter: { type: "Task", title: "X", status: "todo", timestamp: T }, body: "" });
    const server = await bootServerOverBundle({ root: dir });
    try {
      const result = await runDoc(["update", "tasks/x", "--status", "done", "--actor", "alice", "--remote", server.url]);
      assert.equal(result.doc, "updated");
      assert.equal(result.changed, true);
      // Reviewer issue 3: the server IS filesystem-backed over `dir`, so remote-path frontmatter
      // persistence is directly assertable — pinning the wire parity the unit exists for.
      const after = await readDoc({ root: dir }, "tasks/x");
      assert.equal(after.frontmatter.actor, "alice", "actor persisted into frontmatter through the remote path");
    } finally {
      await server.close();
    }
  } finally {
    await cleanup();
  }
});

// ── doc history: renders agent alongside actor when a backend recorded one ─────────────────────

test("doc history --remote: a revision recorded WITH agent renders both actor and agent; a revision with no agent omits the field", async () => {
  const bundle: Bundle = { root: "mem://doc-history-agent-test", backend: new MemoryBackend() };
  // Seed directly against the engine (bypassing the CLI's write path — the CLI never sends
  // X-Agent itself; only the auth'd worker manufactures it) so the backend's history carries a
  // real agent-attested revision, exactly the shape a worker-backed remote would hand back.
  await writeDoc(bundle, { id: "concepts/agented", frontmatter: { type: "Concept", timestamp: T }, body: "one" }, {
    actor: "root",
    agent: "collab-3",
  });
  await writeDoc(bundle, { id: "concepts/unagented", frontmatter: { type: "Concept", timestamp: T }, body: "one" }, {
    actor: "root",
  });

  const server = await bootServerOverBundle(bundle);
  try {
    const agented = await runDoc(["history", "concepts/agented", "--remote", server.url]);
    const agentedVersions = agented.versions as Array<{ actor: string; agent?: string }>;
    assert.equal(agentedVersions.length, 1);
    assert.equal(agentedVersions[0]!.actor, "root");
    assert.equal(agentedVersions[0]!.agent, "collab-3");

    const unagented = await runDoc(["history", "concepts/unagented", "--remote", server.url]);
    const unagentedVersions = unagented.versions as Array<{ actor: string; agent?: string }>;
    assert.equal(unagentedVersions.length, 1);
    assert.equal(unagentedVersions[0]!.actor, "root");
    assert.ok(!("agent" in unagentedVersions[0]!), "no agent recorded -> no agent field in the rendered row");
  } finally {
    await server.close();
  }
});

test("doc history over --dir (FilesystemBackend): reports actor (the file's OS owner) and NO agent — the filesystem backend persists neither --actor nor any agent", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: T }, body: "one" });
    const result = await runDoc(["history", "concepts/a", "--dir", dir]);
    const versions = result.versions as Array<{ actor: string; agent?: string }>;
    assert.equal(versions.length, 1);
    assert.ok(versions[0]!.actor, "the filesystem backend reports SOME actor (its OS-owner default)");
    assert.ok(!("agent" in versions[0]!), "a local --dir bundle never records an agent");
  } finally {
    await cleanup();
  }
});

test("doc history over --remote against serve() (no auth, a HISTORY-KEEPING backend): --actor threads through and stays actor, agent stays absent — the reference server never manufactures X-Agent", async () => {
  const bundle: Bundle = { root: "mem://doc-history-no-auth-test", backend: new MemoryBackend() };
  await writeDoc(bundle, { id: "concepts/x", frontmatter: { type: "Concept", timestamp: T }, body: "one" });
  const server = await bootServerOverBundle(bundle);
  try {
    await runDoc(["update", "concepts/x", "--title", "X", "--actor", "collab-3", "--remote", server.url]);
    const result = await runDoc(["history", "concepts/x", "--remote", server.url]);
    const versions = result.versions as Array<{ actor: string; agent?: string }>;
    assert.equal(versions[0]!.actor, "collab-3", "no auth -> --actor is still recorded as the plain actor");
    assert.ok(!("agent" in versions[0]!), "no auth means no withActor split -> agent stays absent");
  } finally {
    await server.close();
  }
});

// ── FACET 1: `doc read` shows kind-declared fields (detail view, Fork 3) ────────────────────────

test("doc read: default (no --out) render shows kind-declared fields alongside the standard ones", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", priority: "high", timestamp: T }, body: "Body." },
    );

    const result = await runDoc(["read", "tasks/x", "--dir", dir]);
    assert.equal(result.status, "in_progress");
    assert.equal(result.priority, "high");
    assert.equal(result.type, "Task");
    assert.equal(result.title, "Ship it");
    assert.equal(result.timestamp, T);
  } finally {
    await cleanup();
  }
});

test("doc read: stable key ordering — standard fields first, kind-declared fields after", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "in_progress", priority: "high", timestamp: T }, body: "Body." },
    );

    const result = await runDoc(["read", "tasks/x", "--dir", dir]);
    const keys = Object.keys(result);
    assert.equal(keys[0], "id");
    assert.equal(keys[1], "type");
    assert.equal(keys[2], "title");
    const timestampIdx = keys.indexOf("timestamp");
    const statusIdx = keys.indexOf("status");
    const priorityIdx = keys.indexOf("priority");
    assert.ok(timestampIdx >= 0 && statusIdx > timestampIdx, "status must appear after the standard fields");
    assert.ok(priorityIdx > timestampIdx, "priority must appear after the standard fields");
  } finally {
    await cleanup();
  }
});

test("doc read: body truncation + --out byte-channel pointer is preserved when kind fields are also present", async () => {
  const { dir, cleanup } = await makeTaskBundle();
  try {
    const bigBody = "x".repeat(1500); // > doc.ts's BODY_PREVIEW_LIMIT (1000)
    await writeDoc(
      { root: dir },
      { id: "tasks/x", frontmatter: { type: "Task", title: "Ship it", status: "blocked", timestamp: T }, body: bigBody },
    );

    const result = await runDoc(["read", "tasks/x", "--dir", dir]);
    assert.equal(result.body_truncated, true);
    assert.equal(result.body_chars, bigBody.length + 1); // stringifyDoc appends a trailing newline
    assert.deepEqual(result.help, [`${cliInvocation()} doc read tasks/x --out <file>`]);
    assert.equal(result.status, "blocked");
  } finally {
    await cleanup();
  }
});

test("doc read: a conventions-free bundle with only standard fields is byte-for-byte unaffected (no extra keys, no registry touched)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "A", description: "d", resource: "res://x", tags: ["t1"], timestamp: T }, body: "Body." },
    );

    const result = await runDoc(["read", "concepts/a", "--dir", dir]);
    // `head_version` is the store's content-addressed CAS token (surfaced on the read view so the
    // --expected-version workflow is discoverable) — NOT a kind/registry-injected field, so a
    // conventions-free bundle still touches no registry; the key set is otherwise exactly the standard one.
    assert.deepEqual(Object.keys(result), ["id", "type", "title", "description", "resource", "tags", "timestamp", "head_version", "body"]);
    assert.equal(result.type, "Concept");
    assert.equal(result.title, "A");
  } finally {
    await cleanup();
  }
});

test("doc read: a domain `version` frontmatter field is NOT shadowed by the CAS head token (surfaced as head_version)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc(
      { root: dir },
      { id: "specs/api", frontmatter: { type: "Spec", title: "API", version: "1.2.0", timestamp: T }, body: "Body." },
    );
    const result = await runDoc(["read", "specs/api", "--dir", dir]);
    // The doc's OWN declared version survives under `version`; the store's content-addressed CAS token
    // is the DISTINCT `head_version` (a SHA) — nothing silently dropped, and `doc read` agrees with
    // `list --fields version` on what "version" means for this doc.
    assert.equal(result.version, "1.2.0");
    assert.match(String(result.head_version), /^sha256:/);
  } finally {
    await cleanup();
  }
});

// ── `doc read --field <name>`: raw single-value output for scripting ───────────────────────────

test("doc read --field: a scalar frontmatter field prints ONLY the raw value + newline (no envelope, no quotes)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "Auth flow", timestamp: T }, body: "Body." });
    let out = "";
    await doc(["read", "concepts/a", "--field", "title", "--dir", dir], {
      stdout: (s) => (out += s),
      readStdin: async () => undefined,
    });
    assert.equal(out, "Auth flow\n");
  } finally {
    await cleanup();
  }
});

test("doc read --field id / --field type: the meta names resolve off the doc's path / frontmatter directly", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });

    let idOut = "";
    await doc(["read", "concepts/a", "--field", "id", "--dir", dir], { stdout: (s) => (idOut += s), readStdin: async () => undefined });
    assert.equal(idOut, "concepts/a\n");

    let typeOut = "";
    await doc(["read", "concepts/a", "--field", "type", "--dir", dir], { stdout: (s) => (typeOut += s), readStdin: async () => undefined });
    assert.equal(typeOut, "Concept\n");
  } finally {
    await cleanup();
  }
});

test("doc read --field head_version: the printed CAS token is usable directly as --expected-version in a follow-up write (end-to-end)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });

    let out = "";
    await doc(["read", "concepts/a", "--field", "head_version", "--dir", dir], {
      stdout: (s) => (out += s),
      readStdin: async () => undefined,
    });
    assert.equal(out.endsWith("\n"), true);
    const token = out.trim();
    assert.match(token, /^sha256:/);

    const result = await runDoc(["update", "concepts/a", "--title", "A2", "--expected-version", token, "--dir", dir]);
    assert.equal(result.changed, true);
    const after = await readDoc({ root: dir }, "concepts/a");
    assert.equal(after.frontmatter.title, "A2");
  } finally {
    await cleanup();
  }
});

test("doc read --field: a non-scalar (array) field prints compact single-line JSON, not TOON/multi-line", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", tags: ["one", "two"], timestamp: T }, body: "Body." });
    let out = "";
    await doc(["read", "concepts/a", "--field", "tags", "--dir", dir], {
      stdout: (s) => (out += s),
      readStdin: async () => undefined,
    });
    assert.equal(out, `${JSON.stringify(["one", "two"])}\n`);
  } finally {
    await cleanup();
  }
});

test("doc read --field: an ABSENT field routes its error to STDERR (not stdout), naming the field and listing the fields that DO exist, exit NOT_FOUND (6)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });
    let stdoutOut = "";
    let stderrOut = "";
    await assert.rejects(
      () =>
        doc(["read", "concepts/a", "--field", "nope", "--dir", dir, "--json"], {
          stdout: (s) => (stdoutOut += s),
          stderr: (s) => (stderrOut += s),
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "NOT_FOUND");
        assert.equal(err.exitCode, 6);
        assert.equal(err.handled, true); // the bin wrapper must not re-emit the envelope on stdout
        return true;
      },
    );
    assert.equal(stdoutOut, ""); // stdout stays reserved for the raw value even on failure
    assert.match(stderrOut, /nope/);
    assert.match(stderrOut, /title/); // self-correction: the fields that DO exist are listed
  } finally {
    await cleanup();
  }
});

test("doc read --field: a MISSING doc reports the same NOT_FOUND behavior as today (envelope on STDERR, exit 6)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    let stdoutOut = "";
    let stderrOut = "";
    await assert.rejects(
      () =>
        doc(["read", "concepts/nope", "--field", "title", "--dir", dir, "--json"], {
          stdout: (s) => (stdoutOut += s),
          stderr: (s) => (stderrOut += s),
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "NOT_FOUND");
        assert.equal(err.exitCode, 6);
        return true;
      },
    );
    assert.equal(stdoutOut, "");
    assert.match(stderrOut, /code: NOT_FOUND/);
  } finally {
    await cleanup();
  }
});

test("doc read --field combined with --out: USAGE (exit 2) — both reserve stdout for a single raw payload", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });
    await assert.rejects(
      () =>
        doc(["read", "concepts/a", "--field", "title", "--out", "./out.md", "--dir", dir, "--json"], {
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc read --field '' (blank): USAGE (exit 2), never silently falls back to the default full-record render", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });
    await assert.rejects(
      () => doc(["read", "concepts/a", "--field", "", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("doc read --field over --remote: parity with the identical field read locally via --dir", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: T }, body: "Body." });
    const server = await bootServerOverBundle({ root: dir });
    try {
      let localOut = "";
      await doc(["read", "concepts/a", "--field", "title", "--dir", dir], {
        stdout: (s) => (localOut += s),
        readStdin: async () => undefined,
      });
      let remoteOut = "";
      await doc(["read", "concepts/a", "--field", "title", "--remote", server.url], {
        stdout: (s) => (remoteOut += s),
        readStdin: async () => undefined,
      });
      assert.equal(remoteOut, localOut);
      assert.equal(remoteOut, "A\n");
    } finally {
      await server.close();
    }
  } finally {
    await cleanup();
  }
});

// ── F3: doc read --out bundle-pollution warning ─────────────────────────────────────────────────

test("doc read F3: --out resolving INSIDE the open bundle carries a loud `warning` field on the receipt (write still proceeds)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    const inBundleOut = path.join(dir, "exported-copy.md");

    const result = await runDoc(["read", "concepts/a", "--out", inBundleOut, "--dir", dir]);
    assert.equal(result.doc, "read");
    assert.equal(typeof result.warning, "string");
    assert.match(result.warning as string, /INSIDE this bundle/);
    assert.match(result.warning as string, /re-ingested/);
  } finally {
    await cleanup();
  }
});

test("doc read F3 (round-review precision fix): --out resolving to a RESERVED filename INSIDE the bundle warns about CLOBBERING it, not re-ingestion", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });

    // Reserved at ANY directory level — top-level index.md.
    const indexOut = path.join(dir, "index.md");
    const indexResult = await runDoc(["read", "concepts/a", "--out", indexOut, "--dir", dir]);
    assert.equal(typeof indexResult.warning, "string");
    assert.match(indexResult.warning as string, /CLOBBER/);
    assert.doesNotMatch(indexResult.warning as string, /re-ingested/);

    // Reserved at a NESTED directory level — sub/log.md ("any directory level", OKF §3.1). --out
    // never creates parent directories (mirrors `fs.writeFile`'s own contract), so create it first —
    // this test is exercising the WARNING classification, not directory creation.
    await mkdir(path.join(dir, "sub"), { recursive: true });
    const nestedLogOut = path.join(dir, "sub", "log.md");
    const logResult = await runDoc(["read", "concepts/a", "--out", nestedLogOut, "--dir", dir]);
    assert.equal(typeof logResult.warning, "string");
    assert.match(logResult.warning as string, /CLOBBER/);
    assert.doesNotMatch(logResult.warning as string, /re-ingested/);
  } finally {
    await cleanup();
  }
});

test("doc read F3 (round-review precision fix): --out resolving to a NON-.md path INSIDE the bundle carries NO warning (the bundle walk never looks at it)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    const inBundleNonMd = path.join(dir, "exported-copy.txt");

    const result = await runDoc(["read", "concepts/a", "--out", inBundleNonMd, "--dir", dir]);
    assert.equal(result.doc, "read");
    assert.equal("warning" in result, false);
  } finally {
    await cleanup();
  }
});

test("doc read F3: --out resolving OUTSIDE the open bundle carries NO warning", async () => {
  const { dir, cleanup } = await makeBundle();
  const outDir = await tempDir();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    const outsideOut = path.join(outDir, "exported.md");

    const result = await runDoc(["read", "concepts/a", "--out", outsideOut, "--dir", dir]);
    assert.equal(result.doc, "read");
    assert.equal("warning" in result, false);
  } finally {
    await cleanup();
    await rm(outDir, { recursive: true, force: true });
  }
});

test("doc read F3: --out - (stream mode) never carries the warning, even though no file lands inside the bundle to check", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    let stderrOut = "";
    await doc(["read", "concepts/a", "--out", "-", "--dir", dir, "--json"], {
      writeStdoutBytes: () => {},
      stderr: (s) => (stderrOut += s),
    });
    const receipt = JSON.parse(stderrOut) as Record<string, unknown>;
    assert.equal("warning" in receipt, false);
  } finally {
    await cleanup();
  }
});

test("doc read F3: a --remote bundle never carries the warning (bundle.root is a URL, not a filesystem path)", async () => {
  const dir = await tempDir();
  const outDir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    const server = await bootServerOverBundle({ root: dir });
    try {
      const out = path.join(outDir, "remote-copy.md");
      const result = await runDoc(["read", "concepts/a", "--out", out, "--remote", server.url]);
      assert.equal(result.doc, "read");
      assert.equal("warning" in result, false);
    } finally {
      await server.close();
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(outDir, { recursive: true, force: true });
  }
});

// ── doc delete (DELETE operation) ───────────────────────────────────────────────────────────────

test("doc delete: removes an existing doc — deleted:true, exit 0, and the doc is genuinely gone", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });

    const result = await runDoc(["delete", "concepts/a", "--dir", dir]);
    assert.equal(result.doc, "deleted");
    assert.equal(result.id, "concepts/a");
    assert.equal(result.deleted, true);
    assert.match((result.help as string[])[0]!, /\blist$/);

    await assert.rejects(() => readDoc({ root: dir }, "concepts/a"));
  } finally {
    await cleanup();
  }
});

test("doc delete: idempotent — an ABSENT id is SUCCESS (deleted:false), exit 0, never NOT_FOUND", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    const result = await runDoc(["delete", "concepts/never-existed", "--dir", dir]);
    assert.equal(result.deleted, false);

    // Re-delete an already-deleted doc is ALSO deleted:false, not an error.
    await writeDoc({ root: dir }, { id: "concepts/b", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "x" });
    await runDoc(["delete", "concepts/b", "--dir", dir]);
    const second = await runDoc(["delete", "concepts/b", "--dir", dir]);
    assert.equal(second.deleted, false);
  } finally {
    await cleanup();
  }
});

test("doc delete: a reserved id (index.md/log.md) is rejected USAGE (exit 2) BEFORE the bundle is even opened", async () => {
  await assert.rejects(
    () => doc(["delete", "index.md", "--dir", "/does/not/exist", "--json"], {}),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.equal(err.code, "USAGE");
      assert.equal(err.exitCode, 2);
      assert.match(err.message, /reserved file/i);
      return true;
    },
  );
  await assert.rejects(
    () => doc(["delete", "log.md", "--dir", "/does/not/exist", "--json"], {}),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.equal(err.code, "USAGE");
      return true;
    },
  );
});

test("doc delete: --expected-version CAS — a stale token is STALE_HEAD (exit 5) with {expected,actual} details, and does NOT delete; the current token succeeds", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "v1" });
    const { version: v1 } = await readDocVersioned({ root: dir }, "concepts/a");
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "v2" });
    const { version: v2 } = await readDocVersioned({ root: dir }, "concepts/a");
    assert.notEqual(v1, v2);

    await assert.rejects(
      () => doc(["delete", "concepts/a", "--expected-version", v1, "--dir", dir, "--json"], {}),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "STALE_HEAD");
        assert.equal(err.exitCode, 5);
        assert.deepEqual(err.details, { expected: v1, actual: v2 });
        return true;
      },
    );
    // Untouched by the rejected delete.
    assert.equal((await readDoc({ root: dir }, "concepts/a")).body.trim(), "v2");

    const result = await runDoc(["delete", "concepts/a", "--expected-version", v2, "--dir", dir]);
    assert.equal(result.deleted, true);
    await assert.rejects(() => readDoc({ root: dir }, "concepts/a"));
  } finally {
    await cleanup();
  }
});

test("doc delete: --expected-version '' (blank) is USAGE (exit 2), never a silent unconditional delete", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "keep" });
    await assert.rejects(
      () => doc(["delete", "concepts/a", "--expected-version", "", "--dir", dir, "--json"], {}),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /empty value/);
        return true;
      },
    );
    // A blank CAS token must never delete unconditionally — the doc survives.
    assert.equal((await readDoc({ root: dir }, "concepts/a")).body.trim(), "keep");
  } finally {
    await cleanup();
  }
});

test("doc delete: non-cascading — other docs' links to the deleted id are left exactly as written (no cleanup pass)", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await writeDoc({ root: dir }, { id: "concepts/target", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Target." });
    await writeDoc(
      { root: dir },
      { id: "concepts/source", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "See [Target](target.md)." },
    );

    await runDoc(["delete", "concepts/target", "--dir", dir]);

    // The source doc's link text is untouched — deleting the target does not rewrite it.
    const source = await readDoc({ root: dir }, "concepts/source");
    assert.match(source.body, /\[Target\]\(target\.md\)/);
  } finally {
    await cleanup();
  }
});

test("doc delete --remote: round-trip parity with the same operation run locally via --dir", async () => {
  const localDir = await tempDir();
  const remoteDir = await tempDir();
  try {
    await initBundle(localDir);
    await initBundle(remoteDir);
    for (const root of [localDir, remoteDir]) {
      await writeDoc({ root }, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Body." });
    }
    const server = await bootServerOverBundle({ root: remoteDir });
    try {
      const local = await runDoc(["delete", "concepts/a", "--dir", localDir]);
      const remote = await runDoc(["delete", "concepts/a", "--remote", server.url]);
      assert.equal(remote.deleted, local.deleted);
      assert.equal(remote.deleted, true);

      await assert.rejects(() => readDoc({ root: localDir }, "concepts/a"));
      await assert.rejects(() => readDoc({ root: remoteDir }, "concepts/a"));

      // Idempotent absent-delete parity too.
      const localAbsent = await runDoc(["delete", "concepts/a", "--dir", localDir]);
      const remoteAbsent = await runDoc(["delete", "concepts/a", "--remote", server.url]);
      assert.equal(localAbsent.deleted, false);
      assert.equal(remoteAbsent.deleted, false);
    } finally {
      await server.close();
    }
  } finally {
    await rm(localDir, { recursive: true, force: true });
    await rm(remoteDir, { recursive: true, force: true });
  }
});

// ── Corrupt existing-doc classification (RUNTIME/exit 1, not USAGE/exit 2) ────────────────────────

test("doc write/update over a doc with corrupt YAML → RUNTIME (exit 1), consistent with doc read", async () => {
  const { dir, cleanup } = await makeBundle();
  try {
    await mkdir(path.join(dir, "notes"), { recursive: true });
    // An unterminated YAML flow sequence — parseMarkdown throws MalformedDocumentError on read.
    await writeFile(path.join(dir, "notes", "bad.md"), "---\ntype: [unclosed\ntitle: bad\n---\nbody\n");

    // doc write reads the existing doc first (body-guard/CAS) → corrupt read must classify as RUNTIME,
    // NOT the USAGE default (a valid invocation hitting bad stored data is a data error, not misuse).
    await assert.rejects(
      () => doc(["write", "notes/bad", "--type", "Concept", "--body", "x", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "RUNTIME");
        assert.equal(err.exitCode, 1);
        assert.match(err.message, /malformed frontmatter in 'notes\/bad\.md'/);
        return true;
      },
    );

    // doc update patches by read-then-write → same classification through the shared mutate pipeline.
    await assert.rejects(
      () => doc(["update", "notes/bad", "--title", "New", "--dir", dir, "--json"], { readStdin: async () => undefined }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "RUNTIME");
        assert.equal(err.exitCode, 1);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

// ── Per-verb --help focus (AXI §10: each verb's help is its own, not the family manual) ───────────

test("each doc verb's --help is focused on THAT verb, not the whole family manual", async () => {
  const capture = async (argv: string[]): Promise<string> => {
    let out = "";
    await doc(argv, { stdout: (s) => (out += s), readStdin: async () => undefined });
    return out;
  };

  const writeHelp = await capture(["write", "--help"]);
  assert.match(writeHelp, /doc write —/);
  assert.match(writeHelp, /--blank-body/, "write help keeps its own flags");
  assert.match(writeHelp, /--replace-links/, "write help documents the link-drop guard's opt-in");
  assert.doesNotMatch(writeHelp, /doc history —|doc delete —/, "write help does not carry other verbs' manuals");

  const readHelp = await capture(["read", "--help"]);
  assert.match(readHelp, /doc read —/);
  assert.doesNotMatch(readHelp, /--blank-body/, "read help does not leak write-only flags");
  assert.doesNotMatch(readHelp, /doc delete —/);

  const deleteHelp = await capture(["delete", "--help"]);
  assert.match(deleteHelp, /doc delete —/);
  assert.doesNotMatch(deleteHelp, /--blank-body|--title/, "delete help stays minimal");

  // The bare `doc --help` remains the family INDEX (lists every verb, points at per-verb help).
  const familyHelp = await capture(["--help"]);
  assert.match(familyHelp, /doc write/);
  assert.match(familyHelp, /doc read/);
  assert.match(familyHelp, /doc <verb> --help/);
});
