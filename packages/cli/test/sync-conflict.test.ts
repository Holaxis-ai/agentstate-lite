// Tests for U3b (plans/sync-verb-implementation §U3b) — the CONVERGING conflict mechanic and the
// `sync --show-incoming <id>` conflict viewer, over the U0 git harness.
//
// The BINDING convergence acceptance test lives here: follow the documented reconcile chain
// (show-incoming → doc update --body-file → sync) and assert ALL THREE:
//   (i)   landed content == origin/board's version,
//   (ii)  the export file is BYTE-IDENTICAL to the local version,
//   (iii) the teammate's version is NOT clobbered in a two-founder e2e (their pushed content
//         survives on origin after the subsequent push).
// Plus: the multi-commit local stack terminates (the LOOP — rebase-merge gone), the reserved-file
// (log.md) conflict (kept-upstream + exported + verbatim label), non-conflicted docs in the same
// sync still landing, and the full show-incoming state/byte-channel matrix.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { sync, SHOW_INCOMING_AS_OF, SHOW_INCOMING_ABSENT_STATE } from "../src/commands/sync.js";
import { doc } from "../src/commands/doc.js";
import { CliError } from "../src/errors.js";
import { bundleKey, syncExportsDir } from "../src/cursor.js";
import {
  boardHead,
  commitBoard,
  deleteBoardDoc,
  fetchBoard,
  git,
  gitTry,
  isMidRebase,
  makeTwoCloneTopology,
  modifyBoardDoc,
  originBoardHead,
  pushBoard,
  readBoardFile,
  writeBoardDoc,
  type TwoCloneTopology,
} from "./git-harness.js";

// ── scaffolding (mirrors sync.test.ts; adds stderr + byte capture for --out -) ──

async function withHome<T>(home: string, run: () => Promise<T>): Promise<T> {
  const originalHome = process.env.HOME;
  const originalUserProfile = process.env.USERPROFILE;
  process.env.HOME = home;
  process.env.USERPROFILE = home;
  try {
    return await run();
  } finally {
    if (originalHome === undefined) delete process.env.HOME;
    else process.env.HOME = originalHome;
    if (originalUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = originalUserProfile;
  }
}

interface RunResult {
  out: string;
  errOut: string;
  bytes: Buffer;
  err?: CliError;
}

/** Run `sync(argv)` under an isolated HOME, capturing stdout, stderr, AND raw stdout bytes. */
async function runSync(home: string, argv: string[]): Promise<RunResult> {
  const out: string[] = [];
  const errOut: string[] = [];
  const byteChunks: Buffer[] = [];
  const deps = {
    stdout: (s: string) => void out.push(s),
    stderr: (s: string) => void errOut.push(s),
    writeStdoutBytes: (d: Uint8Array) => void byteChunks.push(Buffer.from(d)),
  };
  const result = (err?: CliError): RunResult => ({
    out: out.join(""),
    errOut: errOut.join(""),
    bytes: Buffer.concat(byteChunks),
    ...(err ? { err } : {}),
  });
  try {
    await withHome(home, () => sync(argv, deps));
    return result();
  } catch (err) {
    if (err instanceof CliError) return result(err);
    throw err;
  }
}

/** Run a `doc` subcommand (the reconcile chain's `doc update` step), capturing stdout. */
async function runDoc(argv: string[]): Promise<{ out: string; err?: CliError }> {
  const out: string[] = [];
  try {
    await doc(argv, { stdout: (s: string) => void out.push(s) });
    return { out: out.join("") };
  } catch (err) {
    if (err instanceof CliError) return { out: out.join(""), err };
    throw err;
  }
}

async function tempHomes(n: number): Promise<{ homes: string[]; cleanup: () => Promise<void> }> {
  const homes = await Promise.all(
    Array.from({ length: n }, () => mkdtemp(path.join(tmpdir(), "agentstate-lite-u3b-test-home-"))),
  );
  return {
    homes,
    cleanup: async () =>
      Promise.all(homes.map((h) => rm(h, { recursive: true, force: true }))).then(() => undefined),
  };
}

/** The export path sync uses for `relPath` in `topo`'s shared bundle under `home`. */
function exportPathFor(topo: TwoCloneTopology, home: string, relPath: string): string {
  return path.join(syncExportsDir(bundleKey({ remoteUrl: topo.origin, subpath: "" }), home), relPath);
}

/** Assert a board worktree ended a sync pristine: no mid-rebase state, no uncommitted changes. */
function assertPristine(repo: { name: string; board: string }, topoLabel: string): void {
  assert.equal(gitTry(repo.board, ["status", "--porcelain"]).stdout, "", `${topoLabel}: worktree clean`);
}

// ── the BINDING convergence acceptance test ─────────────────────────────────────

test("U3b BINDING: converge → show-incoming → doc update → sync — all three asserts, teammate never clobbered", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    // Founder A (the teammate) edits the shared doc, syncs it out.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nA's half of the story.\n" });
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);
    const aHead = originBoardHead(topo);

    // Founder B edits the SAME doc (uncommitted — sync's own commit step sweeps it up).
    await modifyBoardDoc(topo.b, "tasks/seed-one", { body: "# Seed one\n\nB's half of the story.\n" });
    const localBytes = await readBoardFile(topo.b, "tasks/seed-one.md");

    const conflicted = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(conflicted.err, "expected the CONFLICT(5) terminal envelope");
    assert.equal(conflicted.err!.code, "CONFLICT");
    assert.equal(conflicted.err!.exitCode, 5);
    assert.ok(
      conflicted.err!.message.startsWith("committed to the board locally — your work is saved."),
      "composite safety framing (this run committed B's version first)",
    );

    // (i) landed content == origin/board's version (the teammate's).
    const landed = git(topo.b.board, ["show", "HEAD:tasks/seed-one.md"]);
    const upstream = git(topo.b.board, ["show", "refs/remotes/origin/board:tasks/seed-one.md"]);
    assert.equal(landed, upstream, "(i) landed content is exactly origin/board's version");
    assert.match(landed, /A's half of the story/);

    // (ii) the export file is BYTE-IDENTICAL to B's local version.
    const exportPath = exportPathFor(topo, homeB!, "tasks/seed-one.md");
    assert.equal(await readFile(exportPath, "utf8"), localBytes, "(ii) export byte-identical to the local version");

    assert.equal(isMidRebase(topo.b), false, "rebase completed — never left mid-state");
    assertPristine(topo.b, "B after converge");

    // ── the documented reconcile chain ──
    // Step 1: view the kept incoming version (labeled "as of last fetch").
    const incoming = await runSync(homeB!, ["--show-incoming", "tasks/seed-one", "--dir", topo.b.root]);
    assert.equal(incoming.err, undefined, incoming.err?.message);
    assert.match(incoming.out, /A's half of the story/);
    assert.ok(incoming.out.includes(SHOW_INCOMING_AS_OF), 'labeled "as of last fetch"');

    // Step 2: write the MERGED body on top as a NEW doc update (a fresh write — CAS semantics).
    const mergedFile = path.join(homeB!, "merged-body.md");
    await writeFile(mergedFile, "# Seed one\n\nA's half of the story.\n\nB's half of the story.\n");
    const updated = await runDoc(["update", "tasks/seed-one", "--body-file", mergedFile, "--dir", topo.b.board]);
    assert.equal(updated.err, undefined, updated.err?.message);

    // Step 3: sync again — the conflict is CLEARED; the merged version pushes cleanly, exit 0.
    const cleared = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.equal(cleared.err, undefined, `the reconcile chain must clear the conflict: ${cleared.err?.message}`);
    assert.match(cleared.out, /committed: 1/);
    assert.match(cleared.out, /pushed: /);
    assertPristine(topo.b, "B after reconcile sync");

    // (iii) the teammate is NOT clobbered: A's pushed commit is still an ancestor of origin/board,
    // and the content that now lives on origin carries A's half too.
    assert.equal(
      gitTry(topo.origin, ["merge-base", "--is-ancestor", aHead, "board"]).status,
      0,
      "(iii) A's pushed commit survives in origin's board history",
    );
    const originContent = git(topo.origin, ["show", "board:tasks/seed-one.md"]);
    assert.match(originContent, /A's half of the story/, "(iii) A's content survives on origin");
    assert.match(originContent, /B's half of the story/, "the merged reconcile carries B's half as well");

    // And A can pull the merged result cleanly.
    const aPull = await runSync(homeA!, ["--dir", topo.a.root, "--pull-only"]);
    assert.equal(aPull.err, undefined, aPull.err?.message);
    assert.match(git(topo.a.board, ["show", "HEAD:tasks/seed-one.md"]), /B's half of the story/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── the LOOP: a multi-commit local stack stops the rebase more than once ────────

test("U3b: multi-commit local stack — the converging loop terminates, every conflicted doc kept-upstream + exported", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  const [homeB] = homes;
  try {
    // A pushes changes to BOTH docs.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nA rewrote one.\n" });
    await modifyBoardDoc(topo.a, "tasks/seed-two", { body: "# Seed two\n\nA rewrote two.\n" });
    commitBoard(topo.a, "board: alice — 2 docs", { author: { name: "alice", email: "alice@example.invalid" } });
    pushBoard(topo.a);
    const aHead = originBoardHead(topo);

    // B stacks TWO local commits, each touching one of the same docs — each replay stops the rebase.
    await modifyBoardDoc(topo.b, "tasks/seed-one", { body: "# Seed one\n\nB rewrote one.\n" });
    commitBoard(topo.b, "board: bob — updated tasks/seed-one", { author: { name: "bob", email: "bob@example.invalid" } });
    const bSeedOne = await readBoardFile(topo.b, "tasks/seed-one.md");
    await modifyBoardDoc(topo.b, "tasks/seed-two", { body: "# Seed two\n\nB rewrote two.\n" });
    commitBoard(topo.b, "board: bob — updated tasks/seed-two", { author: { name: "bob", email: "bob@example.invalid" } });
    const bSeedTwo = await readBoardFile(topo.b, "tasks/seed-two.md");

    const result = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected the CONFLICT(5) terminal envelope");
    assert.equal(result.err!.code, "CONFLICT");

    // The LOOP terminated: no rebase state left, worktree pristine, board converged onto A's tip
    // (both of B's commits became empty after keep-upstream and were dropped).
    assert.equal(isMidRebase(topo.b), false, "rebase-merge is GONE — the loop terminated");
    assertPristine(topo.b, "B after multi-stop converge");
    assert.equal(boardHead(topo.b), aHead, "both empty replays dropped — converged onto origin/board");

    // BOTH docs: upstream kept, local exported byte-identically; both rows reported.
    assert.match(git(topo.b.board, ["show", "HEAD:tasks/seed-one.md"]), /A rewrote one/);
    assert.match(git(topo.b.board, ["show", "HEAD:tasks/seed-two.md"]), /A rewrote two/);
    assert.equal(await readFile(exportPathFor(topo, homeB!, "tasks/seed-one.md"), "utf8"), bSeedOne);
    assert.equal(await readFile(exportPathFor(topo, homeB!, "tasks/seed-two.md"), "utf8"), bSeedTwo);
    const rows = (result.err!.details as { conflicts: { rows: Array<{ id?: string }> } }).conflicts.rows;
    assert.deepEqual(new Set(rows.map((r) => r.id)), new Set(["tasks/seed-one", "tasks/seed-two"]));
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── reserved-file conflict (log.md) ─────────────────────────────────────────────

test("U3b: a reserved-file (log.md) conflict — kept-upstream, exported, labeled VERBATIM (never 'doc log.md')", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    // Both sides rewrite log.md's tail differently (same region → a genuine content conflict).
    const base = await readBoardFile(topo.a, "log.md").catch(() => "");
    await writeFile(path.join(topo.a.board, "log.md"), `${base}- A's provenance line\n`);
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);

    await writeFile(path.join(topo.b.board, "log.md"), `${base}- B's provenance line\n`);
    const bLog = await readBoardFile(topo.b, "log.md");

    const result = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected the CONFLICT(5) terminal envelope");
    assert.equal(result.err!.code, "CONFLICT");
    assert.ok(result.err!.message.includes("log.md — teammate's version kept"), "verbatim label");
    assert.ok(!result.err!.message.includes("doc log.md"), "NEVER 'doc log.md'");

    // Kept-upstream + exported, identically to a concept doc.
    assert.match(git(topo.b.board, ["show", "HEAD:log.md"]), /A's provenance line/);
    const exportPath = exportPathFor(topo, homeB!, "log.md");
    assert.equal(await readFile(exportPath, "utf8"), bLog, "log.md export byte-identical to B's version");
    const rows = (result.err!.details as { conflicts: { rows: Array<Record<string, unknown>> } }).conflicts.rows;
    const logRow = rows.find((r) => r.path === "log.md");
    assert.ok(logRow, "the reserved entry reports `path`, not `id`");
    assert.equal(logRow!.yours, exportPath);
    assert.equal(logRow!.theirs, "kept");
    assert.equal(isMidRebase(topo.b), false);
    assertPristine(topo.b, "B after reserved-file converge");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── non-conflicted docs in the same sync still land ─────────────────────────────

test("U3b: non-conflicted docs in the SAME sync still land locally, and the NEXT sync pushes them (exit 0)", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nA's take.\n" });
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);
    const originAfterA = originBoardHead(topo);

    // B's ONE pending batch: a conflicting edit AND an unrelated brand-new doc.
    await modifyBoardDoc(topo.b, "tasks/seed-one", { body: "# Seed one\n\nB's take.\n" });
    await writeBoardDoc(topo.b, "notes/unrelated", {
      frontmatter: { type: "Note", title: "Unrelated", actor: "brian" },
      body: "# Unrelated\n\nno conflict here\n",
    });

    const result = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected the CONFLICT(5) terminal envelope");
    assert.equal(result.err!.code, "CONFLICT");

    // The non-conflicted doc LANDED: it survives at HEAD on top of origin/board's tip.
    assert.match(git(topo.b.board, ["show", "HEAD:notes/unrelated.md"]), /no conflict here/);
    assert.match(git(topo.b.board, ["show", "HEAD:tasks/seed-one.md"]), /A's take/);
    assert.equal(isMidRebase(topo.b), false);
    assertPristine(topo.b, "B after mixed-batch converge");
    // The conflicted run never pushes — origin is untouched until the reconciling sync.
    assert.equal(originBoardHead(topo), originAfterA, "origin untouched by the conflicted run");

    // The NEXT sync (no new edits — B accepts the kept version) pushes the landed work, exit 0.
    const next = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.equal(next.err, undefined, next.err?.message);
    assert.match(next.out, /pushed: 1/);
    assert.match(git(topo.origin, ["show", "board:notes/unrelated.md"]), /no conflict here/);
    assert.equal(
      gitTry(topo.origin, ["merge-base", "--is-ancestor", originAfterA, "board"]).status,
      0,
      "A's history survives on origin",
    );
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── `sync --show-incoming <id>` — the conflict viewer matrix ────────────────────

test("show-incoming: an existing upstream doc renders parsed frontmatter + body, labeled as of last fetch", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  const [homeB] = homes;
  try {
    const result = await runSync(homeB!, ["--show-incoming", "tasks/seed-one", "--dir", topo.b.root]);
    assert.equal(result.err, undefined, result.err?.message);
    assert.match(result.out, /tasks\/seed-one/);
    assert.match(result.out, /Task/);
    assert.match(result.out, /Seed one/);
    assert.match(result.out, /seed body/);
    assert.ok(result.out.includes(SHOW_INCOMING_AS_OF), 'labeled "as of last fetch"');
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("show-incoming: a doc that is NEW upstream (never pulled locally) renders from the last-fetched ref", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    await writeBoardDoc(topo.a, "notes/fresh", {
      frontmatter: { type: "Note", title: "Fresh from A", actor: "mike" },
      body: "# Fresh\n\nbrand new upstream\n",
    });
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);

    // B FETCHES (adjudication G: the viewer itself never fetches) but never pulls into the board.
    fetchBoard(topo.b);
    assert.equal(gitTry(topo.b.board, ["cat-file", "-e", "HEAD:notes/fresh.md"]).status !== 0, true, "sanity: not on B's board yet");

    const result = await runSync(homeB!, ["--show-incoming", "notes/fresh", "--dir", topo.b.root]);
    assert.equal(result.err, undefined, result.err?.message);
    assert.match(result.out, /brand new upstream/);
    assert.match(result.out, /Fresh from A/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("show-incoming: absent upstream (deleted, or never pushed) is an EXPECTED STATE — exit 0, honest state string", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    // Deleted upstream: A deletes seed-two and pushes; B fetches.
    await deleteBoardDoc(topo.a, "tasks/seed-two");
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);
    fetchBoard(topo.b);

    const deleted = await runSync(homeB!, ["--show-incoming", "tasks/seed-two", "--dir", topo.b.root]);
    assert.equal(deleted.err, undefined, "deleted-upstream is a STATE, not a fatal");
    assert.ok(deleted.out.includes(SHOW_INCOMING_ABSENT_STATE), `state string in: ${deleted.out}`);

    // Never-pushed (a doc that only exists locally) reads the same honest absence.
    await writeBoardDoc(topo.b, "notes/local-only", {
      frontmatter: { type: "Note", title: "Local only", actor: "brian" },
      body: "# local\n",
    });
    const localOnly = await runSync(homeB!, ["--show-incoming", "notes/local-only", "--dir", topo.b.root]);
    assert.equal(localOnly.err, undefined);
    assert.ok(localOnly.out.includes(SHOW_INCOMING_ABSENT_STATE));
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("show-incoming: --out <file> writes the raw upstream bytes; --out - streams bytes with the receipt on stderr", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  const [homeB] = homes;
  const outDir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-u3b-out-"));
  try {
    const upstream = git(topo.b.board, ["show", "refs/remotes/origin/board:tasks/seed-one.md"]);

    // --out <file>: raw bytes to disk, receipt on stdout.
    const outFile = path.join(outDir, "incoming.md");
    const toFile = await runSync(homeB!, ["--show-incoming", "tasks/seed-one", "--out", outFile, "--dir", topo.b.root]);
    assert.equal(toFile.err, undefined, toFile.err?.message);
    assert.equal(await readFile(outFile, "utf8"), upstream, "raw upstream bytes on disk");
    assert.match(toFile.out, /size_bytes/);

    // --out -: raw bytes on stdout's byte channel, receipt on STDERR, nothing else on stdout.
    const toStdout = await runSync(homeB!, ["--show-incoming", "tasks/seed-one", "--out", "-", "--dir", topo.b.root]);
    assert.equal(toStdout.err, undefined, toStdout.err?.message);
    assert.equal(toStdout.bytes.toString("utf8"), upstream, "byte stream is the raw doc");
    assert.equal(toStdout.out, "", "stdout carries ONLY the byte stream");
    assert.match(toStdout.errOut, /size_bytes/);
  } finally {
    await cleanup();
    await rm(outDir, { recursive: true, force: true });
    await topo.cleanup();
  }
});

test("show-incoming: --out - routes an ERROR envelope to STDERR (stdout stays pure) and exits handled", async () => {
  const { homes, cleanup } = await tempHomes(1);
  const lone = await mkdtemp(path.join(tmpdir(), "agentstate-lite-u3b-lone-"));
  try {
    // A repo with NO origin/board anywhere: the viewer's no-upstream error, in stream mode.
    git(lone, ["init", "-b", "main"]);
    const result = await runSync(homes[0]!, ["--show-incoming", "tasks/seed-one", "--out", "-", "--dir", lone]);
    assert.ok(result.err, "expected a thrown CliError");
    assert.equal(result.err!.code, "NO_UPSTREAM");
    assert.equal(result.err!.handled, true, "handled — the bin wrapper must not re-emit on stdout");
    assert.equal(result.out, "", "stdout stays pure");
    assert.equal(result.bytes.length, 0, "no bytes were streamed");
    assert.match(result.errOut, /NO_UPSTREAM/);
  } finally {
    await cleanup();
    await rm(lone, { recursive: true, force: true });
  }
});

test("show-incoming: a large upstream body TRUNCATES on the default render and points at the --out byte hatch", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    const bigBody = `# Big\n\n${"x".repeat(5000)}\n`;
    await writeBoardDoc(topo.a, "notes/big", {
      frontmatter: { type: "Note", title: "Big", actor: "mike" },
      body: bigBody,
    });
    const aSync = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(aSync.err, undefined, aSync.err?.message);
    fetchBoard(topo.b);

    const result = await runSync(homeB!, ["--show-incoming", "notes/big", "--dir", topo.b.root]);
    assert.equal(result.err, undefined, result.err?.message);
    assert.match(result.out, /body_truncated/);
    assert.ok(!result.out.includes("x".repeat(2000)), "the full body never hits stdout");
    assert.match(result.out, /--out/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("show-incoming: usage guards — empty id, --pull-only combination, --out without --show-incoming, no repo", async () => {
  const { homes, cleanup } = await tempHomes(1);
  const plain = await mkdtemp(path.join(tmpdir(), "agentstate-lite-u3b-plain-"));
  try {
    const empty = await runSync(homes[0]!, ["--show-incoming", "  ", "--dir", plain]);
    assert.equal(empty.err?.code, "USAGE");

    const combined = await runSync(homes[0]!, ["--show-incoming", "tasks/x", "--pull-only", "--dir", plain]);
    assert.equal(combined.err?.code, "USAGE");

    const strayOut = await runSync(homes[0]!, ["--out", "somewhere.md", "--dir", plain]);
    assert.equal(strayOut.err?.code, "USAGE");

    const noRepo = await runSync(homes[0]!, ["--show-incoming", "tasks/x", "--dir", plain]);
    assert.equal(noRepo.err?.code, "RUNTIME");
    assert.match(noRepo.err!.message, /not inside a git repository/);
  } finally {
    await cleanup();
    await rm(plain, { recursive: true, force: true });
  }
});
