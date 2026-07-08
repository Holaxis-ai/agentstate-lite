// Tests for `sync` (U3a, plans/sync-verb-implementation §U3a) — the git-tier sync command's core
// flow: entry self-heal, provision, commit, pull, push, envelope, the INTERIM conflict guard, and
// the awareness cache/cursor write U4 will consume.
//
// Two layers, mirroring the codebase's own convention (status.ts/home.ts export pure helpers for
// direct unit testing; git-backed behavior is exercised over the U0 harness):
//
//   1. Pure-function unit tests (no git, no filesystem) for the message-pack string builders and
//      the swallow/classification mappers — fast, and pin the exact strings directly.
//   2. Integration tests over `git-harness.ts`'s real scratch topologies, driving `sync()` itself.
//      Per-clone cursor/cache/marker state lives under `~/.agentstate/sync/` (U2), which is a
//      REAL per-machine directory — so a two-clone scenario simulating two DIFFERENT founders
//      must scope EACH clone's HOME separately (mirrors `auth-cli.test.ts`'s `withHome`), never
//      share one HOME between two clones the way a single-founder test safely can.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  buildConflictMessage,
  cap,
  conflictLabel,
  ffSwallowToError,
  isRawPathEntry,
  originDocsBetween,
  pushFailureMessage,
  singleActor,
  sync,
  toDeltaRows,
  toIncomingRows,
  PUSH_FAIL_SAFETY_MESSAGE,
} from "../src/commands/sync.js";
import { CliError } from "../src/errors.js";
import type { DocChange } from "../src/git.js";
import { readSyncState, bundleKey } from "../src/cursor.js";
import {
  boardHead,
  commitBoard,
  divergeSameDoc,
  gitTry,
  isMidRebase,
  makeTwoCloneTopology,
  modifyBoardDoc,
  originBoardHead,
  pushBoard,
  wedgeMidRebase,
  writeBoardDoc,
  git,
} from "./git-harness.js";

// ── test scaffolding ───────────────────────────────────────────────────────────

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

/** Capture everything `sync()` writes to its injected stdout, joined as one string. */
function captureStdout(): { stdout: (s: string) => void; text: () => string } {
  const chunks: string[] = [];
  return { stdout: (s: string) => chunks.push(s), text: () => chunks.join("") };
}

/** Run `sync(argv)` under an isolated per-call HOME (a distinct "machine"). Returns captured stdout. */
async function runSync(home: string, argv: string[]): Promise<{ out: string; err?: CliError }> {
  const cap = captureStdout();
  try {
    await withHome(home, () => sync(argv, { stdout: cap.stdout }));
    return { out: cap.text() };
  } catch (err) {
    if (err instanceof CliError) return { out: cap.text(), err };
    throw err;
  }
}

async function tempHomes(n: number): Promise<{ homes: string[]; cleanup: () => Promise<void> }> {
  const homes = await Promise.all(
    Array.from({ length: n }, () => mkdtemp(path.join(tmpdir(), "agentstate-lite-sync-test-home-"))),
  );
  return { homes, cleanup: async () => Promise.all(homes.map((h) => rm(h, { recursive: true, force: true }))).then(() => undefined) };
}

function docChange(partial: Partial<DocChange> & Pick<DocChange, "docId" | "verb">): DocChange {
  return { kind: "Note", title: partial.docId, actor: "unknown", ...partial };
}

// ── pure-function unit tests ───────────────────────────────────────────────────

test("cap: shows all rows under the limit; caps + reports total over it; 0 means unlimited", () => {
  const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(cap(rows, 20), { shown: 3, total: 3, rows });
  assert.deepEqual(cap(rows, 2), { shown: 2, total: 3, rows: rows.slice(0, 2) });
  assert.deepEqual(cap(rows, 0), { shown: 3, total: 3, rows });
  assert.deepEqual(cap([], 20), { shown: 0, total: 0, rows: [] });
});

test("buildConflictMessage: singular doc, EXACT test-pinned string", () => {
  assert.equal(
    buildConflictMessage(["tasks/seed-one"]),
    "doc tasks/seed-one changed on both sides — nothing was changed on either side; " +
      "conflict resolution ships in the next update",
  );
});

test("buildConflictMessage: a reserved-file entry (log.md) never renders as 'doc log.md' (lesson 2)", () => {
  assert.equal(isRawPathEntry("log.md"), true);
  assert.equal(isRawPathEntry("tasks/seed-one"), false);
  assert.equal(conflictLabel("log.md"), "log.md");
  assert.equal(conflictLabel("tasks/seed-one"), "doc tasks/seed-one");
  const msg = buildConflictMessage(["log.md"]);
  assert.ok(!msg.includes("doc log.md"), `expected no "doc log.md" in: ${msg}`);
  assert.ok(msg.startsWith("log.md changed on both sides"));
});

test("buildConflictMessage: multiple ids join with a comma, each labeled by its own kind", () => {
  const msg = buildConflictMessage(["tasks/seed-one", "log.md"]);
  assert.equal(
    msg,
    "doc tasks/seed-one, log.md changed on both sides — nothing was changed on either side; " +
      "conflict resolution ships in the next update",
  );
});

test("ffSwallowToError: git-missing / no-upstream reuse the EXACT test-pinned wording (message pack f)", () => {
  const missing = ffSwallowToError("git-missing", "agentstate-lite");
  assert.equal(missing.code, "GIT_MISSING");
  assert.equal(missing.exitCode, 1);
  assert.equal(missing.message, "sync needs git, which isn't installed on this machine");

  const noUpstream = ffSwallowToError("no-upstream", "agentstate-lite");
  assert.equal(noUpstream.code, "NO_UPSTREAM");
  assert.equal(noUpstream.exitCode, 1);
  assert.equal(noUpstream.message, "the board branch isn't linked to a remote yet — sync can't share it");
  assert.ok(noUpstream.help && noUpstream.help.length > 0, "no-upstream carries a fixing hint");
});

test("ffSwallowToError: auth is exit 4, network/busy/dirty/diverged classify sensibly", () => {
  assert.equal(ffSwallowToError("auth", "aslite").exitCode, 4);
  assert.equal(ffSwallowToError("auth", "aslite").code, "AUTH_REQUIRED");
  assert.equal(ffSwallowToError("network", "aslite").exitCode, 1);
  assert.equal(ffSwallowToError("network", "aslite").code, "TRANSIENT");
  assert.equal(ffSwallowToError("busy", "aslite").code, "GIT_BUSY");
  assert.equal(ffSwallowToError("diverged", "aslite").code, "CONFLICT");
  assert.equal(ffSwallowToError("diverged", "aslite").exitCode, 5);
  assert.equal(ffSwallowToError("dirty", "aslite").code, "RUNTIME");
  assert.equal(ffSwallowToError("totally-unknown-reason", "aslite").code, "RUNTIME");
});

test("pushFailureMessage: AUTH_REQUIRED and TRANSIENT get the EXACT pinned safety string (message pack d)", () => {
  const auth = new CliError("AUTH_REQUIRED", "git push was denied access to the remote");
  const network = new CliError("TRANSIENT", "git push could not reach the remote — offline; retry");
  assert.equal(pushFailureMessage(auth), PUSH_FAIL_SAFETY_MESSAGE);
  assert.equal(pushFailureMessage(network), PUSH_FAIL_SAFETY_MESSAGE);
  assert.equal(
    PUSH_FAIL_SAFETY_MESSAGE,
    "committed to the board locally — your work is saved. The push failed (offline or auth); " +
      "re-run sync when you're back online or your access is restored.",
  );
});

test("pushFailureMessage: any OTHER push-failure code still reassures, with its own classified message", () => {
  const busy = new CliError("GIT_BUSY", "another git process is using this repository — retry once it finishes");
  const msg = pushFailureMessage(busy);
  assert.notEqual(msg, PUSH_FAIL_SAFETY_MESSAGE, "not the auth/network-specific exact string");
  assert.ok(msg.startsWith("committed to the board locally — your work is saved."));
  assert.ok(msg.includes(busy.message));
});

test("singleActor: one actor across all committed docs, none when multiple (or zero) docs", () => {
  const one = [docChange({ docId: "a", verb: "added", actor: "mike" }), docChange({ docId: "b", verb: "updated", actor: "mike" })];
  const two = [docChange({ docId: "a", verb: "added", actor: "mike" }), docChange({ docId: "b", verb: "updated", actor: "brian" })];
  assert.equal(singleActor(one), "mike");
  assert.equal(singleActor(two), undefined);
  assert.equal(singleActor([]), undefined);
});

test("toIncomingRows / toDeltaRows: project DocChange into each consumer's own row shape", () => {
  const changes = [docChange({ docId: "tasks/x", verb: "added", kind: "Task", title: "X", actor: "mike" })];
  assert.deepEqual(toIncomingRows(changes), [{ verb: "added", kind: "Task", id: "tasks/x", title: "X", actor: "mike" }]);
  assert.deepEqual(toDeltaRows(changes), [{ docId: "tasks/x", verb: "added", kind: "Task", title: "X", actor: "mike" }]);
});

// ── integration tests over the U0 git harness ──────────────────────────────────

test("sync: no git repo at all -> the definitive 'nothing to sync' empty state, exit 0", async () => {
  const { homes, cleanup } = await tempHomes(1);
  const plainDir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-sync-test-plain-"));
  try {
    const { out, err } = await runSync(homes[0]!, ["--dir", plainDir]);
    assert.equal(err, undefined);
    assert.equal(out, "sync: nothing to sync\n");
  } finally {
    await cleanup();
    await rm(plainDir, { recursive: true, force: true });
  }
});

test("sync: a git repo with no board branch anywhere (local or origin) is ALSO 'nothing to sync'", async () => {
  const { homes, cleanup } = await tempHomes(1);
  const lone = await mkdtemp(path.join(tmpdir(), "agentstate-lite-sync-test-lone-"));
  try {
    git(lone, ["init", "-b", "main"]);
    const { out, err } = await runSync(homes[0]!, ["--dir", lone]);
    assert.equal(err, undefined);
    assert.equal(out, "sync: nothing to sync\n");
  } finally {
    await cleanup();
    await rm(lone, { recursive: true, force: true });
  }
});

test("sync: two-clone founder e2e — A writes+syncs (full), B --pull-only sees the attributed delta, both idempotent", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    await writeBoardDoc(topo.a, "notes/founder", { frontmatter: { type: "Note", title: "Founder note", actor: "mike" }, body: "# hi\n" });

    const first = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(first.err, undefined, first.err?.message);
    assert.match(first.out, /committed: 1/);
    assert.match(first.out, /pushed: 1/);
    assert.match(first.out, /actor: mike/);
    // Finding 2: A is the AUTHOR of notes/founder, not a recipient of it — A's own receipt must
    // report pulled:0 and must NOT list its own just-committed doc as "incoming" (nothing arrived
    // FROM ORIGIN this run; see the dedicated finding-2 regression test below for the isolated case).
    assert.match(first.out, /pulled: 0/);
    assert.ok(!first.out.includes("notes/founder"), "A's own authored doc must not appear as its own incoming");

    // Idempotent re-run on A: nothing new, definitive "already up to date".
    const again = await runSync(homeA!, ["--dir", topo.a.root]);
    assert.equal(again.out, "sync: already up to date\n");

    // B's FIRST-EVER sync (no stored cursor yet) — must still see the attributed delta, not an
    // empty one, since the diff baseline falls back to B's own pre-sync HEAD.
    const bFirst = await runSync(homeB!, ["--dir", topo.b.root, "--pull-only"]);
    assert.equal(bFirst.err, undefined, bFirst.err?.message);
    assert.match(bFirst.out, /committed: 0/);
    assert.match(bFirst.out, /pushed: 0/);
    assert.match(bFirst.out, /pulled: 1/);
    assert.match(bFirst.out, /notes\/founder/);
    assert.match(bFirst.out, /mike/);

    // Idempotent re-run on B: nothing new.
    const bAgain = await runSync(homeB!, ["--dir", topo.b.root, "--pull-only"]);
    assert.equal(bAgain.out, "sync: already up to date\n");

    // The awareness cache/cursor really landed under B's own home (U4's future read path).
    const key = bundleKey({ remoteUrl: topo.origin, subpath: "" });
    const state = await readSyncState(key, homeB!);
    assert.ok(state.cursor, "B's cursor was written");
    assert.equal(state.cursor!.token, boardHead(topo.b));
    assert.equal(state.cache?.unpushedCount, 0);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: INTERIM conflict guard — exit 5, pristine worktree, the exact string, NO export file", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    // `divergeSameDoc` already COMMITS both sides (A pushes; B commits LOCALLY but does not push)
    // — so B arrives at `sync` with a real, already-committed, unpushed divergent commit. This
    // means `stageAndCommit` is a skip-empty no-op here (nothing new to stage) and `fetchRebase`
    // hits the SAME-DOC conflict directly on its own first attempt.
    const div = await divergeSameDoc(topo);
    const beforeHead = boardHead(topo.b);
    assert.equal(gitTry(topo.b.board, ["status", "--porcelain"]).stdout, "", "sanity: B's divergent edit is already committed, not left dirty");

    const result = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected a thrown CliError");
    assert.equal(result.err!.code, "CONFLICT");
    assert.equal(result.err!.exitCode, 5);
    assert.equal(
      result.err!.message,
      `doc ${div.docId} changed on both sides — nothing was changed on either side; ` +
        `conflict resolution ships in the next update`,
    );

    // Worktree pristine: no mid-rebase state left behind, and NOTHING moved — B's board HEAD is
    // exactly where it was (the rebase was cleanly aborted, not partially applied), and no export
    // file was created anywhere (U3a builds none; U3b is what adds that mechanic).
    assert.equal(isMidRebase(topo.b), false);
    assert.equal(boardHead(topo.b), beforeHead, "nothing was changed on either side — B's HEAD is untouched");
    assert.equal(gitTry(topo.b.board, ["status", "--porcelain"]).stdout, "", "worktree is clean after the clean rebase --abort");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: commit-then-conflict — the run's OWN commit lands, then the envelope composes the safety framing with the EXACT interim string", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [, homeB] = homes;
  try {
    // A commits + pushes a change to the shared seed doc.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nA's version.\n" });
    commitBoard(topo.a, "board: alice — updated tasks/seed-one");
    pushBoard(topo.a);
    const originAfterA = originBoardHead(topo);

    // B edits the SAME doc but does NOT commit. Unlike the pure-guard test above (where
    // divergeSameDoc pre-commits both sides and stageAndCommit no-ops), sync's own commit step
    // must land B's work THIS run (committedThisRun = true) BEFORE the rebase hits the conflict —
    // the most common real entry into a conflict: a founder's `doc update` leaves uncommitted
    // changes and sync sweeps them up.
    await modifyBoardDoc(topo.b, "tasks/seed-one", { body: "# Seed one\n\nB's conflicting version.\n" });
    assert.notEqual(gitTry(topo.b.board, ["status", "--porcelain"]).stdout, "", "sanity: B's edit is UNCOMMITTED before sync");
    const beforeHead = boardHead(topo.b);

    const result = await runSync(homeB!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected a thrown CliError");
    assert.equal(result.err!.code, "CONFLICT");
    assert.equal(result.err!.exitCode, 5);
    // The composite, pinned EXACTLY: safety framing first — made TRUE by the commit asserted
    // below — then the interim-guard string passes through UNCHANGED as the suffix.
    assert.equal(
      result.err!.message,
      "committed to the board locally — your work is saved. " +
        "doc tasks/seed-one changed on both sides — nothing was changed on either side; " +
        "conflict resolution ships in the next update",
    );
    assert.ok(JSON.stringify(result.err!.details ?? {}).includes("tasks/seed-one"), "conflict rows carry the doc id");

    // "your work is saved" is TRUE: sync's own commit landed and survived the aborted rebase.
    const afterHead = boardHead(topo.b);
    assert.notEqual(afterHead, beforeHead, "sync committed B's work this run");
    assert.match(git(topo.b.board, ["show", "HEAD:tasks/seed-one.md"]), /B's conflicting version/);

    // And every interim-guard invariant holds on the composite path too: clean abort, pristine
    // worktree, nothing moved on either side (origin untouched, no export file anywhere).
    assert.equal(isMidRebase(topo.b), false);
    assert.equal(gitTry(topo.b.board, ["status", "--porcelain"]).stdout, "", "worktree pristine after the clean abort");
    assert.equal(originBoardHead(topo), originAfterA, "origin/board untouched by B's conflicted sync");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: push-fail after a successful commit -> PARTIAL envelope leading with safety, exit 1, work stays committed locally", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  try {
    await writeBoardDoc(topo.a, "notes/pushfail", { frontmatter: { type: "Note", title: "Push fail", actor: "brian" }, body: "# x\n" });

    // Deterministic push failure: a rejecting pre-receive hook on the bare origin (no network
    // flakiness needed). classifyGitError has no specific pattern for a hook rejection, so this
    // exercises the GENERALIZED (non-auth/network) branch of pushFailureMessage — see that
    // function's own unit test above for the auth/network EXACT-string case.
    const hookPath = path.join(topo.origin, "hooks", "pre-receive");
    await import("node:fs/promises").then((fs) =>
      fs.writeFile(hookPath, "#!/bin/sh\necho 'rejecting all pushes (test fixture)' >&2\nexit 1\n", { mode: 0o755 }),
    );

    const before = boardHead(topo.a);
    const result = await runSync(homes[0]!, ["--dir", topo.a.root]);
    assert.ok(result.err, "expected a thrown (handled) CliError");
    assert.equal(result.err!.exitCode, 1);
    assert.match(result.out, /^warning:/);
    assert.match(result.out, /committed to the board locally — your work is saved\./);
    assert.match(result.out, /committed: 1/);
    assert.match(result.out, /pushed: 0/);

    // The commit really landed locally, just never reached origin.
    const after = boardHead(topo.a);
    assert.notEqual(after, before, "a new local commit was made");
    assert.equal(originBoardHead(topo), before, "origin never received it");

    // Recovery: remove the hook, re-run — should push cleanly now (no "already up to date": a
    // real push of the previously-stuck commit happens).
    await import("node:fs/promises").then((fs) => fs.rm(hookPath));
    const recovered = await runSync(homes[0]!, ["--dir", topo.a.root]);
    assert.equal(recovered.err, undefined, recovered.err?.message);
    assert.match(recovered.out, /committed: 0/);
    assert.match(recovered.out, /pushed: 1/);
    assert.equal(originBoardHead(topo), after);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: a stale mid-rebase state at ENTRY self-heals (adjudication C) before reaching its terminal outcome", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(2);
  const [homeA, homeB] = homes;
  try {
    // Plant a real same-doc divergence and ACTUALLY wedge B's board worktree mid-rebase (a
    // crash/kill mid-run) — the exact U0 fixture built for this.
    const div = await wedgeMidRebase(topo);
    assert.equal(isMidRebase(topo.b), true, "sanity: really wedged");

    const result = await runSync(homeB!, ["--dir", topo.b.root]);

    // The self-heal must have run BEFORE anything else: the worktree is never left mid-rebase,
    // regardless of the outcome below.
    assert.equal(isMidRebase(topo.b), false, "self-healed — never left stuck mid-rebase");

    // The underlying divergence is REAL (same doc, both sides), so a fresh rebase attempt hits it
    // again immediately after healing — "heals at entry then completes" means the command reaches
    // a well-defined terminal outcome (this interim conflict receipt), never hangs or re-wedges.
    // (Flagged in the builder report: this is the documented interpretation of "completes" given
    // the only available U0 fixture for this scenario is a genuine same-doc divergence.)
    assert.ok(result.err, "expected a thrown CliError");
    assert.equal(result.err!.code, "CONFLICT");
    assert.equal(result.err!.exitCode, 5);
    assert.ok(result.err!.message.includes(div.docId));
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: git-missing exit taxonomy — a broken PATH surfaces GIT_MISSING/exit 1 with the exact message", async () => {
  const { homes, cleanup } = await tempHomes(1);
  const plainDir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-sync-test-nogit-"));
  const originalPath = process.env.PATH;
  try {
    process.env.PATH = ""; // no `git` binary resolvable
    const { err } = await runSync(homes[0]!, ["--dir", plainDir]);
    assert.ok(err, "expected a thrown CliError");
    assert.equal(err!.code, "GIT_MISSING");
    assert.equal(err!.exitCode, 1);
    assert.equal(err!.message, "sync needs git, which isn't installed on this machine");
  } finally {
    process.env.PATH = originalPath;
    await cleanup();
    await rm(plainDir, { recursive: true, force: true });
  }
});

test("sync: exit taxonomy sanity — CONFLICT=5, GIT_MISSING/handled-push-fail=1 (already covered above), USAGE=2 for a bad --limit", async () => {
  const { homes, cleanup } = await tempHomes(1);
  try {
    const { err } = await runSync(homes[0]!, ["--limit", "-1"]);
    assert.ok(err);
    assert.equal(err!.code, "USAGE");
    assert.equal(err!.exitCode, 2);
  } finally {
    await cleanup();
  }
});

// ── cold-review findings (post-hoc regression tests) ───────────────────────────

test("sync: FINDING 1 regression — a pre-migration repo's PLAIN .agentstate-lite dir is never mistaken for a board worktree; a wedged PARENT rebase is left completely untouched", async () => {
  // Reproduces the exact vulnerability the reviewer found: `.agentstate-lite` as a plain directory
  // committed on `main` (THIS project's own on-disk shape today, before U5 ever runs) has no `.git`
  // of its own — `git -C .agentstate-lite rev-parse --git-path rebase-merge` used to walk UP into
  // the PARENT repo's shared git dir, so the self-heal probe would find (and abort!) the user's OWN
  // in-progress rebase on `main`, entirely unrelated to sync.
  const repo = await mkdtemp(path.join(tmpdir(), "agentstate-lite-sync-test-finding1-"));
  const { homes, cleanup } = await tempHomes(1);
  try {
    git(repo, ["init", "-b", "main"]);
    await mkdir(path.join(repo, ".agentstate-lite"), { recursive: true });
    await writeFile(path.join(repo, ".agentstate-lite", "index.md"), '---\nokf_version: "0.1"\n---\n');
    git(repo, ["add", "-A"]);
    git(repo, ["commit", "-m", "initial (pre-migration bundle committed on main)"]);

    // Wedge the MAIN repo (NOT .agentstate-lite) mid-rebase via a real conflicting history.
    git(repo, ["checkout", "-b", "feature"]);
    await writeFile(path.join(repo, "conflict.txt"), "feature version\n");
    git(repo, ["add", "-A"]);
    git(repo, ["commit", "-m", "feature change"]);
    git(repo, ["checkout", "main"]);
    await writeFile(path.join(repo, "conflict.txt"), "main version\n");
    git(repo, ["add", "-A"]);
    git(repo, ["commit", "-m", "main change"]);
    const r = gitTry(repo, ["rebase", "feature"]);
    assert.notEqual(r.status, 0, "sanity: this rebase is expected to conflict");
    const rebaseMergePath = git(repo, ["rev-parse", "--git-path", "rebase-merge"]).trim();
    const wedgedPath = path.resolve(repo, rebaseMergePath);
    assert.ok(existsSync(wedgedPath), "sanity: the PARENT repo is really wedged mid-rebase");

    await runSync(homes[0]!, ["--dir", repo]);

    assert.ok(existsSync(wedgedPath), "the parent repo's rebase state must be COMPLETELY UNTOUCHED");
  } finally {
    await cleanup();
    await rm(repo, { recursive: true, force: true });
  }
});

test("sync: FINDING 2 regression — an authoring-only full sync reports pulled:0 and never lists its own committed doc as incoming", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  try {
    await writeBoardDoc(topo.a, "notes/self-authored", {
      frontmatter: { type: "Note", title: "Self authored", actor: "mike" },
      body: "# x\n",
    });

    const result = await runSync(homes[0]!, ["--dir", topo.a.root]);
    assert.equal(result.err, undefined, result.err?.message);
    assert.match(result.out, /committed: 1/);
    assert.match(result.out, /pushed: 1/);
    assert.match(result.out, /pulled: 0/);
    assert.ok(!result.out.includes("notes/self-authored"), "the self-authored doc must never appear as its own incoming");

    // Direct unit coverage of the underlying primitive too: diffing origin/board against ITSELF
    // (nothing fetched) always yields an empty result, regardless of local commit history.
    assert.deepEqual(originDocsBetween(topo.a.board, "HEAD", "HEAD"), []);
    assert.deepEqual(originDocsBetween(topo.a.board, null, "HEAD"), []);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: the central happy path — a genuine local commit AND a real remote doc both land in one full sync, correctly attributed", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  try {
    // Replicates divergeDifferentDoc's shape (A edits+pushes tasks/seed-one; B has an unpushed
    // local commit on the DIFFERENT tasks/seed-two — no content conflict) WITHOUT that fixture's
    // own trailing `fetchBoard(topo.b)` call — that fetch would let B "already know" about A's
    // push BEFORE sync() ever runs, making sync's own fetch a no-op and defeating the point of this
    // test: THIS sync call's own fetch must be what pulls tasks/seed-one in.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# tasks/seed-one\n\nchanged by A\n" });
    commitBoard(topo.a, "board: A edits tasks/seed-one", { author: { name: "alice", email: "alice@example.invalid" } });
    pushBoard(topo.a);

    await modifyBoardDoc(topo.b, "tasks/seed-two", { body: "# tasks/seed-two\n\nchanged by B\n" });
    commitBoard(topo.b, "board: B edits tasks/seed-two", { author: { name: "bob", email: "bob@example.invalid" } });

    // B ALSO has a genuinely NEW, uncommitted doc — THIS sync run's own commit step must create it.
    await writeBoardDoc(topo.b, "notes/b-own", {
      frontmatter: { type: "Note", title: "B's own note", actor: "brian" },
      body: "# hi\n",
    });

    const result = await runSync(homes[0]!, ["--dir", topo.b.root]);
    assert.equal(result.err, undefined, result.err?.message);
    assert.match(result.out, /committed: 1/, "only notes/b-own is NEW this run");
    assert.match(result.out, /pushed: 2/, "notes/b-own PLUS the pre-existing unpushed tasks/seed-two commit");
    assert.match(result.out, /pulled: 1/, "only tasks/seed-one arrived from origin");
    assert.match(result.out, /actor: brian/, "the local commit's own actor");
    assert.match(result.out, /tasks\/seed-one/, "the real incoming doc");
    assert.ok(!result.out.includes("notes/b-own"), "B's own new doc must not appear as incoming");
    assert.ok(!result.out.includes("tasks/seed-two"), "B's PRE-EXISTING committed doc must not appear as incoming either");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("sync: FINDING 3 — a commit that lands, then a fetch failure, still gets the safety framing + an honest cache write (stranded-commit path)", async () => {
  const topo = await makeTwoCloneTopology();
  const { homes, cleanup } = await tempHomes(1);
  try {
    // B is already provisioned (the topology's default) — break its origin AFTER provisioning, so
    // THIS run's commit step (purely local) still succeeds, and only the fetch/rebase step fails.
    // provisionBoardWorktree short-circuits to "already" for an already-provisioned worktree
    // WITHOUT re-fetching, so the broken URL is never touched until fetchRebase's own throwing fetch.
    const badOrigin = "/nonexistent-origin-path-xyz";
    git(topo.b.root, ["remote", "set-url", "origin", badOrigin]);
    await writeBoardDoc(topo.b, "notes/stranded", {
      frontmatter: { type: "Note", title: "Stranded", actor: "brian" },
      body: "# x\n",
    });

    const before = boardHead(topo.b);
    const result = await runSync(homes[0]!, ["--dir", topo.b.root]);
    assert.ok(result.err, "expected a thrown CliError");
    assert.match(result.err!.message, /committed to the board locally — your work is saved/);
    const after = boardHead(topo.b);
    assert.notEqual(after, before, "the commit genuinely landed locally despite the fetch failure");

    // The cache was written with honest (post-commit) backstop counts BEFORE the throw.
    const key = bundleKey({ remoteUrl: badOrigin, subpath: "" });
    const state = await readSyncState(key, homes[0]!);
    assert.ok(state.cache, "cache was written despite the thrown error");
    assert.equal(state.cache!.unpushedCount, 1, "the stranded commit is honestly reflected as unpushed");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});
