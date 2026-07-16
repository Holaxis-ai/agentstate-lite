// Tests for `sync --establish` on a COMMITTED bundle folder — the hard case the verb absorbed
// from the retired `--migrate` spelling. Everything runs in SCRATCH topologies via the U0
// harness — the real repo's board is never touched.
//
// The suite carries the audited committed-case guards forward, plus the two findings the
// unification adjudicated:
//   • the full e2e: committed-folder repo → `--establish --yes` → board branch on origin with the
//     bundle at its ROOT and exactly ONE commit (files, not history), tracking config set
//     (`push -u` — load-bearing), the removal+gitignore commit prepared on a local
//     `board-cleanup` branch (NOT pushed; current branch, working tree, index all untouched);
//   • the BOTH-WORLDS window semantics (test-pinned): board live on origin, folder still tracked
//     on main as a frozen snapshot, sync on such a clone refusing with structured guidance;
//   • the completion journey on BOTH clones, literally running the receipt's emitted commands
//     (verbatim-execution pin): push the cleanup branch, merge, `git pull`, then `sync`
//     provisions LOUDLY and the docs are intact — the full vanish-reappear cycle;
//   • preview (no --yes): a pinned dry-run that mutates NOTHING;
//   • idempotence: re-run and teammate-run both report `already established` (exit 0);
//   • crash-window recovery keyed on the WRITE-TIME MARKER (the U5 delta-review LOW: a local
//     `board` branch is not provenance — a teammate who checked out the board branch during the
//     window must never be offered the recovery);
//   • a fully shared clone with leftover local crumbs gets ordinary already-established behavior,
//     never stale push-the-PR guidance (the Codex PR#26 finding, moot by structural routing);
//   • refusals: uncommitted board changes (naming them), behind-origin freshness, dead fetch,
//     `board/…` namespace, detached HEAD, stray board branch — nothing mutated by any of them;
//   • no forbidden vocabulary (worktree/linked/subtree, and no retired migration framing) in any
//     user-facing committed-case string.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { sync } from "../src/commands/sync.js";
import {
  CLEANUP_BRANCH,
  ESTABLISH_ALREADY,
  ESTABLISH_COMMITTED_ALREADY,
  ESTABLISH_COMMITTED_DONE,
  ESTABLISH_COMMITTED_PREVIEW,
  bothWorldsLine,
  committedNextSteps,
  committedPreviewRecord,
  rolloutNote,
} from "../src/commands/sync-establish.js";
import { GITIGNORE_ENTRY, withIgnoreEntry } from "../src/git.js";
import { CliError } from "../src/errors.js";
import { cliInvocation } from "../src/invocation.js";
import {
  BUNDLE_DIR,
  git,
  gitTry,
  makeCommittedFolderTopology,
  plantStagedUserCode,
  readBoardFile,
  type TwoCloneTopology,
} from "./git-harness.js";

const INV = cliInvocation();

// ── scaffolding (mirrors sync.test.ts / sync-establish.test.ts) ───────────────

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

async function runSync(home: string, argv: string[]): Promise<{ out: string; err?: CliError }> {
  const chunks: string[] = [];
  try {
    await withHome(home, () =>
      sync(argv, { stdout: (s: string) => void chunks.push(s), hookInstalled: () => true }),
    );
    return { out: chunks.join("") };
  } catch (err) {
    if (err instanceof CliError) return { out: chunks.join(""), err };
    throw err;
  }
}

/** Run `sync … --json` and parse the receipt (asserts no error was thrown). */
async function runSyncJson(home: string, argv: string[]): Promise<Record<string, unknown>> {
  const { out, err } = await runSync(home, [...argv, "--json"]);
  assert.equal(err, undefined, `expected success, got ${err?.code}: ${err?.message}`);
  return JSON.parse(out) as Record<string, unknown>;
}

async function tempHome(): Promise<{ home: string; cleanup: () => Promise<void> }> {
  const home = await mkdtemp(path.join(tmpdir(), "aslite-establish-committed-home-"));
  return { home, cleanup: () => rm(home, { recursive: true, force: true }) };
}

/** The committed case's crash-window marker (write-time provenance; see sync-establish.ts). */
function committedMarkerPath(root: string): string {
  return path.join(
    git(root, ["rev-parse", "--absolute-git-dir"]).trim(),
    "agentstate.establishCommittedShare",
  );
}

function plantCommittedMarker(root: string, commit: string): void {
  writeFileSync(committedMarkerPath(root), `${commit}\n`, { mode: 0o600 });
}

/**
 * Reproduce the EXACT crash state: root commit cut, local board branch created, board pushed with
 * -u, the crash marker written — and then the process died before the removal commit existed
 * anywhere. Returns the planted root sha.
 */
function plantCrashWindow(root: string): string {
  const treeSha = git(root, ["rev-parse", `HEAD:${BUNDLE_DIR}`]).trim();
  const rootSha = git(root, ["commit-tree", treeSha, "-m", "board: bundle shared from 'main' (files only)"]).trim();
  git(root, ["branch", "board", rootSha]);
  git(root, ["push", "-u", "origin", "board"]);
  plantCommittedMarker(root, rootSha);
  return rootSha;
}

/** Every ref/branch/tree fact asserted to prove NOTHING was mutated by a preview/refusal. */
function assertPristine(topo: TwoCloneTopology, repoRoot: string, preHead: string): void {
  assert.equal(gitTry(repoRoot, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0, true, "no local board branch");
  assert.equal(
    gitTry(repoRoot, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
    true,
    "no cleanup branch",
  );
  assert.equal(gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0, true, "no board on origin");
  assert.equal(git(repoRoot, ["rev-parse", "HEAD"]).trim(), preHead, "HEAD unchanged");
  assert.equal(existsSync(path.join(repoRoot, BUNDLE_DIR, "index.md")), true, "committed folder intact");
}

/** No worktree/linked/subtree vocabulary, and the retired migration framing stays dead. */
const FORBIDDEN = /worktree|linked|subtree|migrat/i;

// ── pure string tests ─────────────────────────────────────────────────────────

test("committed-case strings: pinned constants, rollout note, and no forbidden vocabulary", () => {
  assert.equal(ESTABLISH_COMMITTED_PREVIEW, "preview — nothing has been changed; re-run with --yes to execute");
  assert.equal(ESTABLISH_COMMITTED_ALREADY, "already established — a board branch already exists on origin");
  assert.equal(
    ESTABLISH_COMMITTED_DONE,
    "the board branch is live on origin — push the cleanup branch and open its PR to finish",
  );
  assert.equal(CLEANUP_BRANCH, "board-cleanup");
  assert.equal(GITIGNORE_ENTRY, ".agentstate-lite/");

  const note = rolloutNote(INV, "main");
  assert.equal(note.length, 5);
  assert.match(note[0]!, /disappears from 'main' — nothing is lost/);
  assert.match(note[1]!, /not 'git pull' — updates the board/);
  assert.match(note[2]!, /never merge it into 'main'/);
  // The `git clean -fdx` line is rollout-note COPY only — pinned here so its wording survives.
  assert.match(note[3]!, /^'git clean -fdx' on 'main' removes the board checkout \(recoverable/);
  assert.match(note[3]!, /unpushed board commits are why you sync first\)$/);
  assert.match(note[4]!, /hook install/);

  const both = bothWorldsLine("main");
  assert.match(both, /BOTH-WORLDS state/);
  assert.match(both, /FROZEN\s+SNAPSHOT/);
  assert.match(both, /never merge 'board' into 'main'/);

  // Forbidden-vocabulary sweep over every user-facing committed-case string.
  const preview = committedPreviewRecord(INV, "main");
  const steps = committedNextSteps(INV, "main");
  const everything = JSON.stringify({
    preview,
    note,
    both,
    steps,
    ESTABLISH_COMMITTED_PREVIEW,
    ESTABLISH_COMMITTED_ALREADY,
    ESTABLISH_COMMITTED_DONE,
  });
  assert.doesNotMatch(everything, FORBIDDEN);
});

test("withIgnoreEntry: appends once, idempotent, respects existing spellings", () => {
  const appended = withIgnoreEntry("node_modules/\n");
  assert.match(appended, /^node_modules\/\n\n#.*\n\.agentstate-lite\/\n$/s);
  assert.equal(withIgnoreEntry(appended), appended, "idempotent");
  for (const spelling of [".agentstate-lite", ".agentstate-lite/", "/.agentstate-lite", "/.agentstate-lite/"]) {
    assert.equal(withIgnoreEntry(`${spelling}\n`), `${spelling}\n`, `existing '${spelling}' respected`);
  }
  const fresh = withIgnoreEntry("");
  assert.equal(fresh.startsWith("#"), true, "no leading blank line in a fresh .gitignore");
  assert.match(fresh, /\.agentstate-lite\/\n$/);
});

// ── preview (no --yes): a dry run that mutates nothing ────────────────────────

test("sync --establish on a committed folder without --yes: pinned preview, nothing mutated", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    const rec = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.deepEqual(rec, committedPreviewRecord(INV, "main"));
    assert.equal(rec.establish, ESTABLISH_COMMITTED_PREVIEW);
    assertPristine(topo, topo.a.root, preHead);
    assert.equal(git(topo.a.root, ["status", "--porcelain"]).trim(), "", "working tree untouched");
    assert.doesNotMatch(JSON.stringify(rec), FORBIDDEN);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── the full establishment + both clones' vanish-reappear journey ─────────────

test("sync --establish --yes on a committed folder: files-not-history board branch, PR-shaped cleanup, both-worlds window, and the full two-clone journey", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home: homeA, cleanup: cleanupA } = await tempHome();
  const { home: homeB, cleanup: cleanupB } = await tempHome();
  try {
    // Staged user code must survive the establishment untouched (plumbing-only removal commit).
    const stagedPath = await plantStagedUserCode(topo.a);
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    const preOriginMain = git(topo.origin, ["rev-parse", "refs/heads/main"]).trim();

    const rec = await runSyncJson(homeA, ["--establish", "--yes", "--dir", topo.a.root]);

    // Receipt strings pinned.
    assert.equal(rec.established, ESTABLISH_COMMITTED_DONE);
    assert.equal(rec.pushed, "origin/board (tracking set)");
    assert.equal(rec.cleanup_branch, CLEANUP_BRANCH);
    assert.equal(rec.both_worlds, bothWorldsLine("main"));
    assert.deepEqual(rec.tell_your_teammates, rolloutNote(INV, "main"));
    const steps = rec.next_steps as string[];
    assert.equal(steps.length, 3);
    assert.equal(steps[0], `push the cleanup branch: git push -u origin ${CLEANUP_BRANCH}`);
    assert.match(steps[1]!, new RegExp(`open a PR from '${CLEANUP_BRANCH}' into 'main'`));
    assert.match(steps[2]!, /'git pull', then '.* sync'/);
    assert.doesNotMatch(JSON.stringify(rec), FORBIDDEN);

    // Board branch on origin, exactly ONE commit (files, not history — a fresh root).
    const boardSha = (rec.board_commit as string).trim();
    assert.equal(git(topo.a.root, ["rev-parse", "refs/heads/board"]).trim(), boardSha);
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), boardSha);
    assert.equal(git(topo.a.root, ["rev-list", "--count", "refs/heads/board"]).trim(), "1");
    // Bundle at the branch ROOT.
    const boardFiles = git(topo.a.root, ["ls-tree", "-r", "--name-only", "refs/heads/board"]);
    assert.match(boardFiles, /^index\.md$/m);
    assert.match(boardFiles, /^tasks\/seed-one\.md$/m);
    assert.doesNotMatch(boardFiles, /README\.md/, "board branch carries ONLY the bundle");
    // `push -u` was load-bearing: tracking config exists.
    assert.equal(git(topo.a.root, ["config", "branch.board.remote"]).trim(), "origin");
    assert.equal(git(topo.a.root, ["config", "branch.board.merge"]).trim(), "refs/heads/board");
    // The crash marker is cleared on the completed path.
    assert.equal(existsSync(committedMarkerPath(topo.a.root)), false, "marker cleared after success");

    // PR-shaped removal: ONE commit on the local cleanup branch; main/current branch untouched.
    const removalSha = (rec.cleanup_commit as string).trim();
    assert.equal(git(topo.a.root, ["rev-parse", `refs/heads/${CLEANUP_BRANCH}`]).trim(), removalSha);
    assert.equal(git(topo.a.root, ["rev-parse", `${CLEANUP_BRANCH}~1`]).trim(), preHead, "exactly one commit on top of main");
    const removalTree = git(topo.a.root, ["ls-tree", "--name-only", CLEANUP_BRANCH]);
    assert.doesNotMatch(removalTree, /\.agentstate-lite/, "folder removed from the cleanup branch's tree");
    const gitignore = git(topo.a.root, ["show", `${CLEANUP_BRANCH}:.gitignore`]);
    assert.match(gitignore, /^\.agentstate-lite\/$/m, "gitignore entry present");
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead, "current branch did not move");
    assert.equal(git(topo.a.root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), "main", "still on main");
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "cleanup branch NOT pushed",
    );
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/main"]).trim(), preOriginMain, "origin main untouched");
    // Staged user code untouched, still staged.
    const staged = git(topo.a.root, ["diff", "--cached", "--name-only"]);
    assert.match(staged, new RegExp(stagedPath.replace("/", "\\/")));
    assert.equal(existsSync(path.join(topo.a.root, BUNDLE_DIR, "index.md")), true, "folder still on disk (frozen snapshot)");

    // BOTH-WORLDS window semantics (test-pinned): the folder is a frozen snapshot main still
    // TRACKS, so a plain `sync` on this clone refuses with the window-aware guidance — NEVER the
    // generic "move it aside" advice, which would hand-build the phantom-modification →
    // checkout-restore → stale-push overlay the U5 reviewer proved.
    const during = await runSync(homeA, ["--dir", topo.a.root, "--json"]);
    assert.equal(during.err?.code, "RUNTIME");
    assert.match(during.err!.message, /the folder-removal \(cleanup\) PR hasn't merged yet, or this clone hasn't pulled it/);
    assert.doesNotMatch(during.err!.message, /move it aside/);
    assert.match(during.err!.help ?? "", /git pull/);

    // COMPLETION — literally run the receipt's emitted chain (verbatim-execution pin).
    // 1. "git push -u origin board-cleanup" (from next_steps[0]).
    git(topo.a.root, ["push", "-u", "origin", CLEANUP_BRANCH]);
    // 2. Merge the PR (simulated: ff-merge into main and push — the working tree's folder
    //    vanishes here, exactly the moment the rollout note describes).
    git(topo.a.root, ["merge", "--ff-only", CLEANUP_BRANCH]);
    git(topo.a.root, ["push", "origin", "main"]);
    assert.equal(existsSync(path.join(topo.a.root, BUNDLE_DIR)), false, "folder vanished from A after the merge");
    // 3. "'git pull', then 'sync'" on clone A: provisions LOUDLY, docs intact. Clone A
    // materializes from its OWN local `board` branch here (establishment itself created that
    // local branch before pushing it) — not literally "from origin/board" (that's clone B's
    // path below, which never created one locally).
    const afterA = await runSyncJson(homeA, ["--dir", topo.a.root]);
    assert.match(String(afterA.provisioned), /materialized from the local board branch/);
    assert.match(await readBoardFile(topo.a, "tasks/seed-one.md"), /Seed one/);

    // The OTHER teammate's journey (clone B): pull → folder gone → sync provisions loudly → intact.
    assert.equal(existsSync(path.join(topo.b.root, BUNDLE_DIR, "index.md")), true, "B still has the folder pre-pull");
    // Pre-pull, B's plain `sync` gets the same window refusal — never the mv advice.
    const preB = await runSync(homeB, ["--dir", topo.b.root, "--json"]);
    assert.equal(preB.err?.code, "RUNTIME");
    assert.match(preB.err!.message, /the folder-removal \(cleanup\) PR hasn't merged yet, or this clone hasn't pulled it/);
    // And B's --establish --yes at this point is the already-established state (c) with the
    // LANDED probe: the removal has reached origin/main, so the note says so truthfully.
    const bAlready = await runSyncJson(homeB, ["--establish", "--yes", "--dir", topo.b.root]);
    assert.equal(bAlready.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.match(String(bAlready.note), /already landed on 'main' — run 'git pull'/);
    git(topo.b.root, ["pull"]);
    assert.equal(existsSync(path.join(topo.b.root, BUNDLE_DIR)), false, "folder vanished from B after git pull");
    const afterB = await runSyncJson(homeB, ["--dir", topo.b.root]);
    assert.match(String(afterB.provisioned), /materialized from origin\/board/);
    assert.match(await readBoardFile(topo.b, "tasks/seed-one.md"), /Seed one/);
    // And B is genuinely syncing: an idempotent re-run reports the definitive empty state.
    const againB = await runSyncJson(homeB, ["--dir", topo.b.root]);
    assert.equal(againB.sync, "already up to date");
  } finally {
    await topo.cleanup();
    await cleanupA();
    await cleanupB();
  }
});

// ── idempotence ───────────────────────────────────────────────────────────────

test("sync --establish --yes is idempotent: re-run and teammate-run both report already established (exit 0)", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    const boardSha = git(topo.origin, ["rev-parse", "refs/heads/board"]).trim();

    // Re-run on the establishing clone: exit 0, pinned string, nothing changes. State (a) of the
    // already-established branching: the cleanup branch exists, so the note guides to the PR —
    // the happy path's lost-receipt affordance.
    const removalSha = git(topo.a.root, ["rev-parse", `refs/heads/${CLEANUP_BRANCH}`]).trim();
    const again = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(again.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.match(String(again.note), /already prepared on 'board-cleanup' — push it and open its PR/);
    assert.equal((again.next_steps as string[])[0], `push the cleanup branch: git push -u origin ${CLEANUP_BRANCH}`);
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), boardSha);
    assert.equal(git(topo.a.root, ["rev-parse", `refs/heads/${CLEANUP_BRANCH}`]).trim(), removalSha, "nothing recreated");

    // Teammate's clone (folder still committed, hasn't pulled, NO local evidence): state (c) —
    // already established, nothing mutated, and the note is TRUTHFUL about where the removal is
    // (the PR hasn't landed on origin/main yet — never asserts a PR this clone can't see).
    const preHeadB = git(topo.b.root, ["rev-parse", "HEAD"]).trim();
    const teammate = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.b.root]);
    assert.equal(teammate.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.match(String(teammate.note), /once the folder-removal lands on the default branch: 'git pull'/);
    assert.equal(git(topo.b.root, ["rev-parse", "HEAD"]).trim(), preHeadB);
    assert.equal(
      gitTry(topo.b.root, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0,
      true,
      "no local board branch created on B",
    );
    assert.equal(
      gitTry(topo.b.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "no cleanup branch created on B",
    );
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── the Codex PR#26 finding: no stale guidance on a fully shared clone ────────

test("a leftover local cleanup branch on a FULLY shared clone never resurrects push-the-PR guidance", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // Execute and complete the whole journey, deliberately KEEPING the local cleanup branch.
    await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    git(topo.a.root, ["merge", "--ff-only", CLEANUP_BRANCH]);
    git(topo.a.root, ["push", "origin", "main"]);
    assert.equal(existsSync(path.join(topo.a.root, BUNDLE_DIR)), false, "folder gone after the merge");
    assert.equal(gitTry(topo.a.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status, 0);

    // The folder is no longer committed, so --establish routes past the committed case entirely:
    // ordinary already-established behavior, never the stale "push it and open its PR" note.
    const rec = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(rec.establish, ESTABLISH_ALREADY);
    assert.match(String(rec.provisioned), /materialized from the local board branch/);
    assert.doesNotMatch(JSON.stringify(rec), /push it and open its PR/);
    assert.match(await readBoardFile(topo.a, "tasks/seed-one.md"), /Seed one/);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── refusals ──────────────────────────────────────────────────────────────────

test("committed-case establish refuses on uncommitted board changes, naming them; nothing mutated", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    await writeFile(path.join(topo.a.board, "tasks", "seed-one.md"), "---\ntype: Task\ntitle: dirty\n---\n# dirty\n");
    await writeFile(path.join(topo.a.board, "stray-note.md"), "---\ntype: Note\ntitle: new\n---\n# new\n");

    for (const argv of [["--establish", "--yes"], ["--establish"]]) {
      const { err } = await runSync(home, [...argv, "--dir", topo.a.root, "--json"]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err!.message, /establish refused: \.agentstate-lite\/ has uncommitted changes/);
      const uncommitted = (err!.details as { uncommitted: { total: number; rows: Array<{ path: string }> } }).uncommitted;
      assert.equal(uncommitted.total, 2);
      const paths = uncommitted.rows.map((r) => r.path).sort();
      assert.deepEqual(paths, [".agentstate-lite/stray-note.md", ".agentstate-lite/tasks/seed-one.md"]);
      assert.match(err!.help ?? "", /sync --establish --yes$/);
      assertPristine(topo, topo.a.root, preHead);
    }
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("committed-case structured refusals: detached HEAD and a stray local board branch", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // Detached HEAD (the committed folder is still at HEAD, so the committed case routes).
    git(topo.a.root, ["checkout", "--detach"]);
    const detached = await runSync(home, ["--establish", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(detached.err?.code, "RUNTIME");
    assert.match(detached.err!.message, /detached HEAD/);
    git(topo.a.root, ["checkout", "main"]);

    // A stray local `board` branch that is NOT an interrupted-run remnant.
    git(topo.a.root, ["branch", "board", "main"]);
    const stray = await runSync(home, ["--establish", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(stray.err?.code, "RUNTIME");
    assert.match(stray.err!.message, /a local 'board' branch already exists and does not match the committed folder/);
    git(topo.a.root, ["branch", "-D", "board"]);

    // No forbidden vocabulary in any of the refusal strings.
    for (const e of [detached.err, stray.err]) {
      assert.doesNotMatch(`${e!.message} ${e!.help ?? ""}`, FORBIDDEN);
    }
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("committed-case establish recovers an interrupted pre-push run: a matching single-root local board branch is reused", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // Simulate the pre-push crash: the root commit + branch exist locally, but nothing was pushed.
    const treeSha = git(topo.a.root, ["rev-parse", `HEAD:${BUNDLE_DIR}`]).trim();
    const orphanSha = git(topo.a.root, ["commit-tree", treeSha, "-m", "board: interrupted run"]).trim();
    git(topo.a.root, ["branch", "board", orphanSha]);

    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.established, ESTABLISH_COMMITTED_DONE);
    assert.equal((rec.board_commit as string).trim(), orphanSha, "the interrupted run's root commit is reused");
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), orphanSha);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── crash-window recovery: the WRITE-TIME MARKER is the discriminator ─────────

test("crash window (killed between push -u and the removal commit): re-run offers, --yes re-creates just the removal commit", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    const rootSha = plantCrashWindow(topo.a.root);
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();

    // Without --yes: the OFFER — and the already-established path never mutates under a bare run.
    const offer = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(offer.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.match(
      String(offer.note),
      /an interrupted establishment left the board branch pushed but no folder-removal commit — re-run/,
    );
    assert.match(String(offer.note), /--establish --yes/);
    assert.equal(
      gitTry(topo.a.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "the offer mutated nothing",
    );
    assert.equal(existsSync(committedMarkerPath(topo.a.root)), true, "the marker stays until recovery completes");

    // With --yes: the recovery re-creates JUST the removal commit and guides to the PR.
    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.match(String(rec.recovered), /it has been re-created on 'board-cleanup'/);
    const removalSha = (rec.cleanup_commit as string).trim();
    assert.equal(git(topo.a.root, ["rev-parse", `refs/heads/${CLEANUP_BRANCH}`]).trim(), removalSha);
    assert.equal(git(topo.a.root, ["rev-parse", `${CLEANUP_BRANCH}~1`]).trim(), preHead, "one commit on top of main");
    assert.doesNotMatch(git(topo.a.root, ["ls-tree", "--name-only", CLEANUP_BRANCH]), /\.agentstate-lite/);
    assert.match(git(topo.a.root, ["show", `${CLEANUP_BRANCH}:.gitignore`]), /^\.agentstate-lite\/$/m);
    assert.equal((rec.next_steps as string[])[0], `push the cleanup branch: git push -u origin ${CLEANUP_BRANCH}`);
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), rootSha, "board on origin untouched");
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead, "current branch untouched");
    assert.equal(existsSync(committedMarkerPath(topo.a.root)), false, "marker cleared after recovery");
    assert.doesNotMatch(JSON.stringify(rec), FORBIDDEN);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("the crash discriminator is NOT spoofable: a teammate's local board branch without the marker is never offered the recovery", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // A establishes fully; B (in the window) merely peeks at the shared board branch.
    await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    git(topo.b.root, ["fetch", "origin"]);
    git(topo.b.root, ["branch", "board", "origin/board"]);
    const preHeadB = git(topo.b.root, ["rev-parse", "HEAD"]).trim();

    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.b.root]);
    assert.equal(rec.establish, ESTABLISH_COMMITTED_ALREADY);
    assert.equal("recovered" in rec, false, "no recovery offered without this clone's own marker");
    assert.match(String(rec.note), /once the folder-removal lands on the default branch: 'git pull'/);
    assert.equal(
      gitTry(topo.b.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "no cleanup branch created on the teammate's clone",
    );
    assert.equal(git(topo.b.root, ["rev-parse", "HEAD"]).trim(), preHeadB, "B untouched");
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("crash recovery refuses when a DIFFERENT origin/board was published: the marker's snapshot must be contained", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // A's push crashed before landing (simulated: root commit + branch + marker, NO push) — then
    // B establishes for real. A's marker now names a snapshot origin/board does not contain.
    const treeSha = git(topo.a.root, ["rev-parse", `HEAD:${BUNDLE_DIR}`]).trim();
    const dates = { GIT_AUTHOR_DATE: "2005-04-07T22:13:13", GIT_COMMITTER_DATE: "2005-04-07T22:13:13" };
    const rootSha = git(topo.a.root, ["commit-tree", treeSha, "-m", "board: bundle shared from 'main' (files only)"], dates).trim();
    git(topo.a.root, ["branch", "board", rootSha]);
    plantCommittedMarker(topo.a.root, rootSha);
    await runSyncJson(home, ["--establish", "--yes", "--dir", topo.b.root]);

    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    const { err } = await runSync(home, ["--establish", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(err?.code, "CONFLICT");
    assert.match(err!.message, /does not contain this clone's interrupted establishment snapshot/);
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead);
    assert.equal(
      gitTry(topo.a.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "nothing recreated against a foreign board",
    );
    assert.equal(existsSync(committedMarkerPath(topo.a.root)), true, "the marker evidence is preserved");
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("crash recovery refuses when the committed folder changed after the interrupted push: newer board commits are never silently stranded", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    plantCrashWindow(topo.a.root);
    // The user commits MORE board changes on main after the crash — the pushed snapshot is stale.
    await writeFile(path.join(topo.a.board, "tasks", "after-crash.md"), "---\ntype: Task\ntitle: After\n---\n# After\n");
    git(topo.a.root, ["add", "-A"]);
    git(topo.a.root, ["commit", "-m", "board: post-crash board change on main"]);
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();

    const { err } = await runSync(home, ["--establish", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(err?.code, "CONFLICT");
    assert.match(err!.message, /would strand those newer board changes/);
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead);
    assert.equal(
      gitTry(topo.a.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${CLEANUP_BRANCH}`]).status !== 0,
      true,
      "no removal commit cut from a stale snapshot",
    );
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── behind-origin freshness guard + dead-fetch refusal ────────────────────────

test("behind-origin guard: a stale clone whose origin carries a teammate's board commit refuses; pull-then-establish carries it", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // The U5 reviewer's exact disaster setup: B pushes a board commit to main; A establishes UNPULLED.
    await writeFile(
      path.join(topo.b.board, "tasks", "from-b.md"),
      "---\ntype: Task\ntitle: From B\nactor: mike\n---\n# From B\n",
    );
    git(topo.b.root, ["add", "-A"]);
    git(topo.b.root, ["commit", "-m", "board: B adds a task"]);
    git(topo.b.root, ["push", "origin", "main"]);

    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    for (const argv of [["--establish", "--yes"], ["--establish"]]) {
      const { err } = await runSync(home, [...argv, "--dir", topo.a.root, "--json"]);
      assert.equal(err?.code, "RUNTIME", argv.join(" "));
      assert.match(err!.message, /'main' is behind origin\/main with board changes/);
      assert.match(err!.message, /strand a teammate's board commits/);
      assert.match(err!.help ?? "", /^git pull, then re-run/);
      assert.equal((err!.details as { behind_board_commits: number }).behind_board_commits, 1);
      assertPristine(topo, topo.a.root, preHead);
    }

    // The guard's whole point: pull first, and the teammate's doc IS on the board branch.
    git(topo.a.root, ["pull"]);
    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.established, ESTABLISH_COMMITTED_DONE);
    assert.match(git(topo.a.root, ["ls-tree", "-r", "--name-only", "refs/heads/board"]), /^tasks\/from-b\.md$/m);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("behind-origin on NON-board commits does not block establishment (the board tree is identical either way)", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    await writeFile(path.join(topo.b.root, "README.md"), "# demo project — updated by B\n");
    git(topo.b.root, ["add", "-A"]);
    git(topo.b.root, ["commit", "-m", "docs: B updates the README"]);
    git(topo.b.root, ["push", "origin", "main"]);

    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.established, ESTABLISH_COMMITTED_DONE);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("a dead fetch refuses the committed case outright (offline = no freshness, and the push would fail anyway)", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    git(topo.a.root, ["remote", "set-url", "origin", path.join(topo.dir, "nonexistent.git")]);
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    for (const argv of [["--establish", "--yes"], ["--establish"]]) {
      const { err } = await runSync(home, [...argv, "--dir", topo.a.root, "--json"]);
      assert.equal(err?.code, "TRANSIENT", argv.join(" "));
      assert.match(err!.message, /establish refused: could not reach 'origin'/);
      assert.equal((err!.details as { retryable: boolean }).retryable, true);
    }
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead);
    assert.equal(
      gitTry(topo.a.root, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0,
      true,
      "nothing mutated offline",
    );
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── board/… namespace D/F conflict ────────────────────────────────────────────

test("branches under board/… (remote or local) refuse the committed case by name; cleared, establishment proceeds", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // The EXACT shape this repo's own origin carried: a merged PR branch named board/<something>.
    git(topo.b.root, ["push", "origin", "main:refs/heads/board/sync-verb-tasks"]);

    const remoteCase = await runSync(home, ["--establish", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(remoteCase.err?.code, "RUNTIME");
    assert.match(remoteCase.err!.message, /branches named 'board\/…' exist/);
    assert.match(remoteCase.err!.message, /board\/sync-verb-tasks \(on origin\)/);
    assert.match(remoteCase.err!.help ?? "", /delete or rename these branches/);

    // A LOCAL offender is named too (same D/F class against refs/heads/board).
    git(topo.a.root, ["branch", "board/local-experiment"]);
    const localCase = await runSync(home, ["--establish", "--dir", topo.a.root, "--json"]);
    assert.equal(localCase.err?.code, "RUNTIME");
    assert.match(localCase.err!.message, /board\/local-experiment \(local\)/);

    // Clear both offenders → the same command completes (the establishment fetch prunes the stale
    // refs/remotes/origin/board/* tracking ref, so the push's own tracking-ref update is clean).
    git(topo.a.root, ["branch", "-D", "board/local-experiment"]);
    git(topo.b.root, ["push", "origin", ":refs/heads/board/sync-verb-tasks"]);
    const rec = await runSyncJson(home, ["--establish", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.established, ESTABLISH_COMMITTED_DONE);
    assert.equal(git(topo.origin, ["rev-list", "--count", "refs/heads/board"]).trim(), "1");
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── flag surface: the retired spelling and the --yes scope ────────────────────

test("--migrate is retired with a USAGE pointer at establish; --yes without --establish is USAGE", async () => {
  const { home, cleanup } = await tempHome();
  try {
    for (const argv of [["--migrate"], ["--migrate", "--yes"], ["--migrate", "--establish"]]) {
      const { err } = await runSync(home, [...argv, "--json"]);
      assert.equal(err?.code, "USAGE", argv.join(" "));
      assert.match(err!.message, /--migrate was retired/);
      assert.match(err!.message, /sync --establish/);
      assert.match(err!.help ?? "", /sync --establish$/);
    }
    const { err } = await runSync(home, ["--yes", "--json"]);
    assert.equal(err?.code, "USAGE");
    assert.match(err!.message, /--yes only applies to sync --establish/);
    assert.match(err!.help ?? "", /sync --establish --yes$/);
  } finally {
    await cleanup();
  }
});
