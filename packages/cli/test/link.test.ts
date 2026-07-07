/**
 * `link add` timestamp-refresh semantics (external review finding P2).
 *
 * `timestamp` means "last meaningful change" (OKF + VISION). The engine
 * (`writeDoc`/`writeDocVersioned`) stays caller-controlled and preserves an existing
 * `frontmatter.timestamp` — that is proven in `@agentstate-lite/core`'s own tests and is
 * NOT re-tested here. What IS tested here is the CLI's `link add`, which is the bug this
 * finding identified: appending a cross-link is a meaningful change, so by default it must
 * refresh the timestamp on its outgoing write, EXCEPT on the idempotent no-op path (the
 * source already links to the target) where nothing is written at all.
 *
 * Runs the command function in-process (no subprocess) against a real temp filesystem
 * bundle, mirroring `packages/core/test`'s node:test + ts-loader pattern.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeDoc, readDoc } from "@agentstate-lite/core";
import { link } from "../src/commands/link.js";
import { CliError } from "../src/errors.js";

const OLD_TS = "2020-01-01T00:00:00.000Z";

/** A fresh temp OKF bundle with `concepts/a` and `concepts/b`, both stamped at OLD_TS. */
async function makeFixtureBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  const bundle = await initBundle(dir);
  await writeDoc(bundle, {
    id: "concepts/a",
    frontmatter: { type: "Concept", title: "A", timestamp: OLD_TS },
    body: "Body A.",
  });
  await writeDoc(bundle, {
    id: "concepts/b",
    frontmatter: { type: "Concept", title: "B", timestamp: OLD_TS },
    body: "Body B.",
  });
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/** Run `link add` in-process against `dir`, capturing stdout and decoding the `--json` envelope. */
async function linkAdd(dir: string, args: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await link(["add", ...args, "--dir", dir, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out);
}

/** Run `link show` in-process against `dir`, capturing stdout and decoding the `--json` envelope. */
async function linkShow(dir: string, args: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await link(["show", ...args, "--dir", dir, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out);
}

test("link add: refreshes the source timestamp by default (freshness reflects the change)", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    const before = new Date().getTime();
    const result = await linkAdd(dir, ["concepts/a", "concepts/b"]);
    assert.equal(result.changed, true);
    assert.equal(result.link, "added");

    const doc = await readDoc({ root: dir }, "concepts/a");
    const ts = doc.frontmatter.timestamp as string;
    assert.notEqual(ts, OLD_TS, "timestamp must advance past the stale value");
    const tsMs = Date.parse(ts);
    assert.ok(tsMs >= before, "refreshed timestamp must be ~now, not the old value");
    assert.match(doc.body, /\[concepts\/b\]\(b\.md\)/);
  } finally {
    await cleanup();
  }
});

test("link add --keep-timestamp: preserves the source's existing timestamp", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    const result = await linkAdd(dir, ["concepts/a", "concepts/b", "--keep-timestamp"]);
    assert.equal(result.changed, true);

    const doc = await readDoc({ root: dir }, "concepts/a");
    assert.equal(doc.frontmatter.timestamp, OLD_TS);
    assert.match(doc.body, /\[concepts\/b\]\(b\.md\)/);
  } finally {
    await cleanup();
  }
});

test("link add: a reserved-filename target (index/log) is rejected with a structured USAGE error, not silently written", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    for (const target of ["index", "log", "sub/index", "sub/log.md"]) {
      await assert.rejects(
        () => link(["add", "concepts/a", target, "--dir", dir, "--json"], { stdout: () => {} }),
        (err: unknown) => {
          assert.ok(err instanceof CliError, `expected a CliError for target '${target}'`);
          assert.equal(err.code, "USAGE");
          assert.equal(err.exitCode, 2);
          return true;
        },
      );
    }
    // The source doc was never touched by any of the rejected attempts.
    const doc = await readDoc({ root: dir }, "concepts/a");
    assert.equal(doc.body, "Body A.\n");
  } finally {
    await cleanup();
  }
});

test("link add: re-adding an already-present link is an idempotent no-op (no write, no timestamp refresh)", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    // First add: this legitimately refreshes the timestamp (a real body change).
    const first = await linkAdd(dir, ["concepts/a", "concepts/b"]);
    assert.equal(first.changed, true);
    const afterFirst = await readDoc({ root: dir }, "concepts/a");
    const refreshedTs = afterFirst.frontmatter.timestamp;

    // Second add of the SAME link: must converge to changed:false and must NOT touch the
    // timestamp again — re-adding an existing link is a true no-op.
    const second = await linkAdd(dir, ["concepts/a", "concepts/b"]);
    assert.equal(second.changed, false);
    assert.equal(second.link, "exists");

    const afterSecond = await readDoc({ root: dir }, "concepts/a");
    assert.equal(afterSecond.frontmatter.timestamp, refreshedTs);
    assert.equal(afterSecond.body, afterFirst.body);
  } finally {
    await cleanup();
  }
});

test("link show --limit caps the outbound/backlink lists; counts stay the true totals (A5)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, { id: "hub", frontmatter: { type: "Concept", title: "Hub", timestamp: OLD_TS }, body: "" });
    for (let i = 0; i < 4; i++) {
      await writeDoc(bundle, { id: `t${i}`, frontmatter: { type: "Concept", title: `T${i}`, timestamp: OLD_TS }, body: "" });
      await link(["add", "hub", `t${i}`, "--dir", dir, "--json"], { stdout: () => {} });
    }
    let out = "";
    await link(["show", "hub", "--limit", "2", "--dir", dir, "--json"], { stdout: (s) => (out += s) });
    const shown = JSON.parse(out) as Record<string, unknown>;
    assert.equal(shown.outbound_count, 4, "count is the true total");
    assert.equal((shown.outbound as unknown[]).length, 2, "outbound page is capped");
    const help = shown.help as string[];
    assert.ok(help.some((h) => /showing 2\/4 outbound/.test(h) && /--limit 0/.test(h)));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("link show: backlink rows carry the citing link's text (typed-edge reading v0, rung a)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, { id: "target", frontmatter: { type: "Concept", title: "Target", timestamp: OLD_TS }, body: "" });
    await writeDoc(bundle, { id: "citer", frontmatter: { type: "Concept", title: "Citer", timestamp: OLD_TS }, body: "" });
    await linkAdd(dir, ["citer", "target", "--text", "depends on"]);

    const shown = await linkShow(dir, ["target"]);
    assert.equal(shown.backlink_count, 1);
    assert.deepEqual(shown.backlinks, [{ from: "citer", text: "depends on" }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("link show --text: filters BOTH outbound links and backlinks to an exact text match; counts are the filtered totals (typed-edge reading v0, rung b)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  try {
    const bundle = await initBundle(dir);
    for (const id of ["hub", "t0", "t1", "citer"]) {
      await writeDoc(bundle, { id, frontmatter: { type: "Concept", title: id, timestamp: OLD_TS }, body: "" });
    }
    await linkAdd(dir, ["hub", "t0", "--text", "prereq"]);
    await linkAdd(dir, ["hub", "t1", "--text", "see also"]);
    await linkAdd(dir, ["citer", "hub", "--text", "prereq"]);

    const filtered = await linkShow(dir, ["hub", "--text", "prereq"]);
    assert.equal(filtered.text_filter, "prereq");
    assert.equal(filtered.outbound_count, 1, "outbound_count is the FILTERED total, not the true total (2)");
    assert.deepEqual((filtered.outbound as { to: string }[]).map((l) => l.to), ["t0"]);
    assert.equal(filtered.backlink_count, 1);
    assert.deepEqual(filtered.backlinks, [{ from: "citer", text: "prereq" }]);

    // A substring of "prereq" must NOT match — exact match only.
    const substring = await linkShow(dir, ["hub", "--text", "pre"]);
    assert.equal(substring.outbound_count, 0);
    assert.equal(substring.backlink_count, 0);

    // A filter matching nothing in either direction is a DEFINITIVE empty result, not an error.
    const empty = await linkShow(dir, ["hub", "--text", "no-such-relation"]);
    assert.equal(empty.outbound_count, 0);
    assert.deepEqual(empty.outbound, []);
    assert.equal(empty.backlink_count, 0);
    assert.deepEqual(empty.backlinks, []);
    const help = empty.help as string[];
    assert.ok(help.some((h) => /no links matched --text 'no-such-relation'/.test(h)));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("link show --text '' (empty/blank value): USAGE error, exit 2", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  try {
    await initBundle(dir);
    await assert.rejects(
      () => link(["show", "hub", "--text", "  ", "--dir", dir, "--json"], { stdout: () => {} }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("link show --text (no value at all): USAGE error, exit 2 — a bare parseArgs failure, not a bare TypeError", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-link-test-"));
  try {
    await initBundle(dir);
    await assert.rejects(
      () => link(["show", "hub", "--dir", dir, "--json", "--text"], { stdout: () => {} }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
