/**
 * `doc write`'s F1 body-blanking guard, exercised against the BUILT CLI (`dist/agentstate-lite.mjs`)
 * over a real subprocess — NOT the in-process command function `doc.test.ts` calls directly.
 *
 * Round-review finding (P1, BLOCKING): the guard was bypassed in agent harnesses because
 * `defaultReadStdin` decided pipe-vs-no-input solely via `process.stdin.isTTY`. In-process tests that
 * inject a `readStdin` override (every test in `doc.test.ts`) never exercise `defaultReadStdin` at
 * all, so they could not have caught this — the bug only reproduces through the REAL adapter, reading
 * REAL `process.stdin` of a REAL child process, which is exactly what an agent harness hands a spawned
 * CLI. This file is that missing test class: it spawns the actual built binary with stdin redirected
 * from `/dev/null` (a character device — `isTTY === undefined`, neither a TTY nor a real pipe, the
 * precise agent-harness shape the live-verified bug reproduced in) and asserts the guard still fires.
 *
 * `test.before` builds the CLI once (`node build.mjs` in this package) so the test is self-contained
 * regardless of invocation order — no other test file in this package needs the built artifact, so
 * there is no existing "build once" convention to reuse (see CLAUDE.md's build/verify gate: `npm run
 * build` normally precedes `npm test` in `npm run check`, but a bare `npm test -w agentstate-lite`
 * does not build first).
 *
 * Platform note discovered while writing this file (see `hasRealStdinInput`'s comment in doc.ts):
 * `spawnSync(cmd, { input })`/`spawn(cmd, { stdio: ["pipe", …] })` feed a child's stdin through
 * Node's OWN "pipe" stdio implementation, which on macOS is an `AF_UNIX` socketpair, NOT a POSIX
 * FIFO — a genuinely different fd type from the FIFO a SHELL `|` operator creates. Both are exercised
 * below (a Node-piped test and a real `sh -c '… | …'` shell-piped test) since real agent harnesses
 * use both mechanisms.
 */
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

import { initBundle, writeDoc } from "@agentstate-lite/core";
import { commitBoard, makeTwoCloneTopology, pushBoard, writeBoardDoc } from "./git-harness.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const cliPackageRoot = path.resolve(here, "..");
const cliBin = path.join(cliPackageRoot, "dist", "agentstate-lite.mjs");

const OLD_TS = "2020-01-01T00:00:00.000Z";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-cli-integration-"));
}

// Build ONLY if the bundle is absent. The package's `test` script builds once up front, so under
// `npm test` / `npm run check` this is a no-op — which is what keeps two build-in-a-before-hook
// integration files from launching CONCURRENT `vite build`s that clobber packages/ui/dist (the
// node --test runner runs files in parallel). Building here still supports running THIS file alone.
before(() => {
  if (!existsSync(cliBin)) execFileSync("node", ["build.mjs"], { cwd: cliPackageRoot, stdio: "inherit" });
});

test("built CLI: raw doc-read channels route early missing-id and unknown-option envelopes only to stderr", () => {
  const cases = [
    ["doc", "read", "--body-out", "-"],
    ["doc", "read", "concepts/a", "--body-out=-", "--unknown"],
    ["doc", "read", "concepts/a", "--body-out", " - ", "--unknown"],
    ["doc", "read", "concepts/a", "--body-out= - ", "--unknown"],
    ["doc", "read", "concepts/a", "--out=-", "--unknown"],
    ["doc", "read", "concepts/a", "--out", " - ", "--unknown"],
    ["doc", "read", "concepts/a", "--out= - ", "--unknown"],
  ];
  for (const args of cases) {
    const result = spawnSync("node", [cliBin, ...args], {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
    assert.equal(result.status, 2, `expected USAGE exit 2 for ${args.join(" ")}`);
    assert.equal(result.stdout, "", "stdout remains a pure, empty byte channel on early failure");
    assert.match(result.stderr, /code: USAGE/);
    assert.equal((result.stderr.match(/code: USAGE/g) ?? []).length, 1, "the envelope is emitted exactly once");
  }
});

test("built CLI: doc write guard refuses to blank an EXISTING doc's body when stdin is redirected from /dev/null (agent-harness shape — no TTY, no real pipe, isTTY undefined)", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      { id: "concepts/a", frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS }, body: "Original body." },
    );

    // stdio: ["ignore", ...] redirects the child's stdin to /dev/null — a character device, exactly
    // the fd shape many agent harnesses hand a spawned process (not a TTY, not a real pipe/FIFO).
    const result = spawnSync(
      "node",
      [cliBin, "doc", "write", "concepts/a", "--type", "Concept", "--title", "New Title", "--dir", dir, "--json"],
      { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
    );

    assert.equal(
      result.status,
      2,
      `expected USAGE exit 2, got ${result.status}; stdout=${result.stdout} stderr=${result.stderr}`,
    );
    // Error envelopes render as TOON on stdout regardless of --json (output.ts: formatError never
    // sees per-invocation flags) — assert on the TOON shape, not JSON.parse.
    assert.match(result.stdout ?? "", /code: USAGE/);
    assert.match(result.stdout ?? "", /body source/);

    // Nothing was touched — the original body survives on disk.
    const after = await readFile(path.join(dir, "concepts", "a.md"), "utf8");
    assert.match(after, /Original body\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("built CLI: a REAL non-empty stdin pipe (Node child_process 'pipe' stdio) still works as an explicit body source and replaces an EXISTING doc's body", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      { id: "concepts/b", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." },
    );

    // `input` makes child_process feed this content to the child's stdin via its own "pipe" stdio
    // implementation — on this platform (macOS) that is a connected AF_UNIX socket, not a POSIX FIFO
    // (see `hasRealStdinInput`'s comment in doc.ts); this exercises that exact path, which is also
    // the shape many Node-based agent harnesses use to pipe real content into a spawned CLI.
    const result = spawnSync(
      "node",
      [cliBin, "doc", "write", "concepts/b", "--type", "Concept", "--dir", dir, "--json"],
      { input: "Piped replacement body.", encoding: "utf8" },
    );

    assert.equal(
      result.status,
      0,
      `expected exit 0, got ${result.status}; stdout=${result.stdout} stderr=${result.stderr}`,
    );
    const after = await readFile(path.join(dir, "concepts", "b.md"), "utf8");
    assert.match(after, /Piped replacement body\./);
    assert.doesNotMatch(after, /Original body\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("built CLI: a REAL shell pipe (printf 'x' | agentstate-lite …, a genuine POSIX FIFO) still works as an explicit body source", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      { id: "concepts/c", frontmatter: { type: "Concept", timestamp: OLD_TS }, body: "Original body." },
    );

    // Routed through `sh -c '… | …'` so the PIPE ITSELF is created by the shell (a genuine POSIX
    // FIFO on every platform), not by Node's own child_process stdio machinery — the literal
    // `printf 'x' | agentstate-lite …` shape the round-review handback asked to be verified live.
    const quotedDir = dir.replace(/'/g, "'\\''");
    const shellCmd = `printf '%s' 'Shell-piped body.' | node ${JSON.stringify(cliBin)} doc write concepts/c --type Concept --dir '${quotedDir}' --json`;
    const result = spawnSync("sh", ["-c", shellCmd], { encoding: "utf8" });

    assert.equal(
      result.status,
      0,
      `expected exit 0, got ${result.status}; stdout=${result.stdout} stderr=${result.stderr}`,
    );
    const after = await readFile(path.join(dir, "concepts", "c.md"), "utf8");
    assert.match(after, /Shell-piped body\./);
    assert.doesNotMatch(after, /Original body\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

/**
 * Live-incident repro: `doc update <id> --title … --description …` (a FIELD-ONLY patch, no
 * --body/--body-file) hung forever when stdin was an OPEN pipe/socket that was never written to and
 * never closed — the shape many agent harnesses hand a spawned process by default (a Node
 * `child_process` "pipe" fd 0 that the parent keeps its write end of, without writing or calling
 * `.end()`). `hasRealStdinInput` correctly reports this fd as a real data source (unlike the
 * character-device false positive the round-review fix above closes), so the old code's unconditional
 * stdin read for a body-less `doc update` blocked on an EOF that would never arrive. Uses real async
 * `spawn` (NOT `spawnSync`, which would block the test's own event loop) with a bounded timeout that
 * kills the child and fails the test if it doesn't exit in time — the affirmative "still hangs"
 * behavior was confirmed live against the pre-fix code before this test was added.
 */
test("built CLI: a FIELD-ONLY `doc update` (--title/--description, no --body/--body-file) never touches stdin — completes promptly even when stdin is an OPEN pipe that is never written to or closed", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      { id: "concepts/d", frontmatter: { type: "Concept", title: "Old Title", timestamp: OLD_TS }, body: "Original body." },
    );

    const child = spawn(
      "node",
      [
        cliBin,
        "doc",
        "update",
        "concepts/d",
        "--title",
        "New Title",
        "--description",
        "New desc",
        "--dir",
        dir,
        "--json",
      ],
      { stdio: ["pipe", "pipe", "pipe"] },
    );
    // Deliberately never write to child.stdin and never call .end() on it — the pipe's write end
    // stays open (held by this test process) for the child's entire lifetime, so a read-to-EOF on fd 0
    // would never complete.

    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    const BOUND_MS = 5000;
    const exitCode = await new Promise<number | null>((resolve, reject) => {
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`doc update did not exit within ${BOUND_MS}ms — it must not block on stdin here`));
      }, BOUND_MS);
      child.on("exit", (code) => {
        clearTimeout(timer);
        resolve(code);
      });
    });

    assert.equal(exitCode, 0, `expected exit 0, got ${exitCode}; stdout=${stdout}`);
    const result = JSON.parse(stdout) as Record<string, unknown>;
    assert.equal(result.changed, true);

    const after = await readFile(path.join(dir, "concepts", "d.md"), "utf8");
    assert.match(after, /title: New Title/);
    assert.match(after, /description: New desc/);
    // The body is untouched — stdin was never consumed as a body source for this field-only patch.
    assert.match(after, /Original body\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("built CLI: `doc update` with NO other field flags still accepts a real piped stdin body as a last-resort body source (preserves `cat body.md | … doc update <id>`)", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      { id: "concepts/e", frontmatter: { type: "Concept", title: "T", timestamp: OLD_TS }, body: "Original body." },
    );

    const result = spawnSync("node", [cliBin, "doc", "update", "concepts/e", "--dir", dir, "--json"], {
      input: "Piped patch body.",
      encoding: "utf8",
    });

    assert.equal(
      result.status,
      0,
      `expected exit 0, got ${result.status}; stdout=${result.stdout} stderr=${result.stderr}`,
    );
    const after = await readFile(path.join(dir, "concepts", "e.md"), "utf8");
    assert.match(after, /Piped patch body\./);
    assert.doesNotMatch(after, /Original body\./);
    assert.match(after, /title: T/); // untouched
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── the opportunistic-pull DEFAULT-WIRING pin (autopull fix round, MEDIUM 3) ────────────────────
//
// Every IN-PROCESS suite either injects the `autoPull` seam or runs under the suite-wide
// AGENTSTATE_LITE_NO_AUTOPULL=1 knob (packages/cli's test script) — so deleting the default
// `deps.autoPull ?? maybeAutoPull` binding in the read commands would still pass all of them.
// This test spawns the BUILT CLI with the knob explicitly DELETED from the child env, in a real
// two-clone topology, and requires the read ITSELF to have pulled the teammate's pushed doc —
// only the live default wiring can make that pass. The second half pins the documented knob
// semantics: "0" is a non-empty value, so it DISABLES too (the variable's PRESENCE is the
// switch). This file (the one place that builds the real CLI — a second concurrent `build.mjs`
// in another test file would race on dist/) is deliberately where this pin lives.

test("built CLI: default auto-pull wiring is LIVE — `list` pulls a stale board with the knob deleted from the child env; '0' still disables", async () => {
  const topo = await makeTwoCloneTopology();
  const childHomeA = await tempDir(); // isolated ~/.agentstate for the first child (no state → stale)
  const childHomeB = await tempDir(); // …and a separate one for the knob="0" child (also stale)
  try {
    await writeBoardDoc(topo.a, "tasks/wired-in", {
      frontmatter: { type: "Task", title: "Wired in", actor: "mike" },
      body: "# Wired in\n",
    });
    commitBoard(topo.a, "board: A adds tasks/wired-in");
    pushBoard(topo.a);

    const env = { ...process.env, HOME: childHomeA, USERPROFILE: childHomeA };
    delete env.AGENTSTATE_LITE_NO_AUTOPULL;
    const r = spawnSync("node", [cliBin, "list", "--dir", topo.b.board], {
      env,
      encoding: "utf8",
      timeout: 60_000,
    });
    assert.equal(r.status, 0, `expected exit 0, got ${r.status}; stdout=${r.stdout} stderr=${r.stderr}`);
    assert.match(
      r.stdout ?? "",
      /tasks\/wired-in/,
      "the DEFAULT-wired trigger must pull A's pushed doc into B before serving the read",
    );

    // Knob semantics: "0" is non-empty → disables. Fresh child HOME (no state → stale), so the
    // pull WOULD fire here if "0" were ever treated as falsey.
    await writeBoardDoc(topo.a, "tasks/knob-zero", {
      frontmatter: { type: "Task", title: "Knob zero", actor: "mike" },
      body: "# Knob zero\n",
    });
    commitBoard(topo.a, "board: A adds tasks/knob-zero");
    pushBoard(topo.a);

    const envZero = {
      ...process.env,
      HOME: childHomeB,
      USERPROFILE: childHomeB,
      AGENTSTATE_LITE_NO_AUTOPULL: "0",
    };
    const r2 = spawnSync("node", [cliBin, "list", "--dir", topo.b.board], {
      env: envZero,
      encoding: "utf8",
      timeout: 60_000,
    });
    assert.equal(r2.status, 0, `expected exit 0, got ${r2.status}; stdout=${r2.stdout} stderr=${r2.stderr}`);
    assert.match(r2.stdout ?? "", /tasks\/wired-in/, "B still serves what the first read pulled");
    assert.doesNotMatch(
      r2.stdout ?? "",
      /tasks\/knob-zero/,
      "AGENTSTATE_LITE_NO_AUTOPULL='0' must DISABLE the pull — presence is the switch",
    );
  } finally {
    await topo.cleanup();
    await rm(childHomeA, { recursive: true, force: true });
    await rm(childHomeB, { recursive: true, force: true });
  }
});
