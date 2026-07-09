// Tests for `sync --migrate` (U5, plans/sync-verb-implementation §U5, as amended by
// decisions/board-branch-sync rider 1 — FILES NOT HISTORY — and the 2026-07-09 PR-shaped-removal
// adjudication). Everything runs in SCRATCH topologies via the U0 harness — the real repo's board
// is never touched (the migration of THIS repo is a separate, human-timed act).
//
// The suite pins:
//   • the full migration e2e: committed-folder repo → `--migrate --yes` → board branch on origin
//     with the bundle at its ROOT and exactly ONE commit (files-not-history, rider 1), tracking
//     config set (`push -u` — load-bearing), the removal+gitignore commit prepared on a local
//     `board-migration` branch (NOT pushed; current branch, working tree, index all untouched);
//   • the BOTH-WORLDS window semantics (test-pinned per the adjudication): board live on origin,
//     folder still tracked on main as a frozen snapshot, sync on such a clone refusing with the
//     structured non-empty-dir guidance;
//   • the completion journey on BOTH clones, literally running the receipt's emitted commands
//     (verbatim-execution pin): push the migration branch, merge, `git pull`, then `sync`
//     provisions LOUDLY and the docs are intact — the full vanish-reappear cycle;
//   • preview (no --yes): a pinned dry-run that mutates NOTHING;
//   • idempotence: re-run and teammate-run both report "already migrated" (exit 0);
//   • the refusal on uncommitted board changes (naming them; nothing mutated) + the other
//     structured refusals (no repo, no committed folder, detached HEAD, stray board branch);
//   • no forbidden vocabulary ("worktree"/"linked"/"subtree") in any new user-facing string.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { sync } from "../src/commands/sync.js";
import {
  GITIGNORE_ENTRY,
  MIGRATE_ALREADY,
  MIGRATE_DONE,
  MIGRATE_PREVIEW,
  MIGRATION_BRANCH,
  bothWorldsLine,
  previewRecord,
  rolloutNote,
  withIgnoreEntry,
} from "../src/commands/sync-migrate.js";
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

// ── scaffolding (mirrors sync.test.ts) ────────────────────────────────────────

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
    await withHome(home, () => sync(argv, { stdout: (s: string) => void chunks.push(s) }));
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
  const home = await mkdtemp(path.join(tmpdir(), "aslite-migrate-test-home-"));
  return { home, cleanup: () => rm(home, { recursive: true, force: true }) };
}

/** Every ref/branch/tree fact asserted to prove NOTHING was mutated by a preview/refusal. */
function assertPristine(topo: TwoCloneTopology, repoRoot: string, preHead: string): void {
  assert.equal(gitTry(repoRoot, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0, true, "no local board branch");
  assert.equal(
    gitTry(repoRoot, ["rev-parse", "--verify", "--quiet", `refs/heads/${MIGRATION_BRANCH}`]).status !== 0,
    true,
    "no migration branch",
  );
  assert.equal(gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0, true, "no board on origin");
  assert.equal(git(repoRoot, ["rev-parse", "HEAD"]).trim(), preHead, "HEAD unchanged");
  assert.equal(existsSync(path.join(repoRoot, BUNDLE_DIR, "index.md")), true, "committed folder intact");
}

const FORBIDDEN = /worktree|linked|subtree/i;

// ── pure string tests ─────────────────────────────────────────────────────────

test("migrate strings: pinned constants, rollout note, and no forbidden vocabulary", () => {
  assert.equal(MIGRATE_PREVIEW, "preview — nothing has been changed; re-run with --yes to execute");
  assert.equal(MIGRATE_ALREADY, "already migrated — a board branch already exists on origin");
  assert.equal(MIGRATE_DONE, "the board branch is live on origin — push the migration branch and open its PR to finish");
  assert.equal(MIGRATION_BRANCH, "board-migration");
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

  // Forbidden-vocabulary sweep over every user-facing migrate string.
  const preview = previewRecord(INV, "main");
  const everything = JSON.stringify({ preview, note, both, MIGRATE_PREVIEW, MIGRATE_ALREADY, MIGRATE_DONE });
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

test("sync --migrate without --yes: pinned preview, nothing mutated", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    const rec = await runSyncJson(home, ["--migrate", "--dir", topo.a.root]);
    assert.deepEqual(rec, previewRecord(INV, "main"));
    assert.equal(rec.migrate, MIGRATE_PREVIEW);
    assertPristine(topo, topo.a.root, preHead);
    assert.equal(git(topo.a.root, ["status", "--porcelain"]).trim(), "", "working tree untouched");
    assert.doesNotMatch(JSON.stringify(rec), FORBIDDEN);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── the full migration + both clones' vanish-reappear journey ────────────────

test("sync --migrate --yes: files-not-history board branch, PR-shaped removal, both-worlds window, and the full two-clone journey", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home: homeA, cleanup: cleanupA } = await tempHome();
  const { home: homeB, cleanup: cleanupB } = await tempHome();
  try {
    // Staged user code must survive the migration untouched (plumbing-only removal commit).
    const stagedPath = await plantStagedUserCode(topo.a);
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    const preOriginMain = git(topo.origin, ["rev-parse", "refs/heads/main"]).trim();

    const rec = await runSyncJson(homeA, ["--migrate", "--yes", "--dir", topo.a.root]);

    // Receipt strings pinned.
    assert.equal(rec.migrated, MIGRATE_DONE);
    assert.equal(rec.pushed, "origin/board (tracking set)");
    assert.equal(rec.removal_branch, MIGRATION_BRANCH);
    assert.equal(rec.both_worlds, bothWorldsLine("main"));
    assert.deepEqual(rec.tell_your_teammates, rolloutNote(INV, "main"));
    const steps = rec.next_steps as string[];
    assert.equal(steps.length, 3);
    assert.equal(steps[0], `push the migration branch: git push -u origin ${MIGRATION_BRANCH}`);
    assert.match(steps[1]!, new RegExp(`open a PR from '${MIGRATION_BRANCH}' into 'main'`));
    assert.match(steps[2]!, /'git pull', then '.* sync'/);
    assert.doesNotMatch(JSON.stringify(rec), FORBIDDEN);

    // Board branch on origin, exactly ONE commit (rider 1: files, not history — a fresh root).
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

    // PR-shaped removal: ONE commit on the local migration branch; main/current branch untouched.
    const removalSha = (rec.removal_commit as string).trim();
    assert.equal(git(topo.a.root, ["rev-parse", `refs/heads/${MIGRATION_BRANCH}`]).trim(), removalSha);
    assert.equal(git(topo.a.root, ["rev-parse", `${MIGRATION_BRANCH}~1`]).trim(), preHead, "exactly one commit on top of main");
    const removalTree = git(topo.a.root, ["ls-tree", "--name-only", MIGRATION_BRANCH]);
    assert.doesNotMatch(removalTree, /\.agentstate-lite/, "folder removed from the migration branch's tree");
    const gitignore = git(topo.a.root, ["show", `${MIGRATION_BRANCH}:.gitignore`]);
    assert.match(gitignore, /^\.agentstate-lite\/$/m, "gitignore entry present");
    assert.equal(git(topo.a.root, ["rev-parse", "HEAD"]).trim(), preHead, "current branch did not move");
    assert.equal(git(topo.a.root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), "main", "still on main");
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${MIGRATION_BRANCH}`]).status !== 0,
      true,
      "migration branch NOT pushed",
    );
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/main"]).trim(), preOriginMain, "origin main untouched");
    // Staged user code untouched, still staged.
    const staged = git(topo.a.root, ["diff", "--cached", "--name-only"]);
    assert.match(staged, new RegExp(stagedPath.replace("/", "\\/")));
    assert.equal(existsSync(path.join(topo.a.root, BUNDLE_DIR, "index.md")), true, "folder still on disk (frozen snapshot)");

    // BOTH-WORLDS window semantics (test-pinned, per the adjudication): the folder is a frozen
    // snapshot main still tracks, so a plain `sync` on this clone refuses with the structured
    // non-empty-dir guidance rather than adopting or clobbering anything.
    const during = await runSync(homeA, ["--dir", topo.a.root, "--json"]);
    assert.equal(during.err?.code, "RUNTIME");
    assert.match(during.err!.message, /is not the shared board checkout — move it aside/);

    // COMPLETION — literally run the receipt's emitted chain (verbatim-execution pin).
    // 1. "git push -u origin board-migration" (from next_steps[0]).
    git(topo.a.root, ["push", "-u", "origin", MIGRATION_BRANCH]);
    // 2. Merge the PR (simulated: ff-merge into main and push — the working tree's folder
    //    vanishes here, exactly the moment the rollout note describes).
    git(topo.a.root, ["merge", "--ff-only", MIGRATION_BRANCH]);
    git(topo.a.root, ["push", "origin", "main"]);
    assert.equal(existsSync(path.join(topo.a.root, BUNDLE_DIR)), false, "folder vanished from A after the merge");
    // 3. "'git pull', then 'sync'" on clone A: provisions LOUDLY, docs intact.
    const afterA = await runSyncJson(homeA, ["--dir", topo.a.root]);
    assert.match(String(afterA.provisioned), /materialized from origin\/board/);
    assert.match(await readBoardFile(topo.a, "tasks/seed-one.md"), /Seed one/);

    // The OTHER founder's journey (clone B): pull → folder gone → sync provisions loudly → intact.
    assert.equal(existsSync(path.join(topo.b.root, BUNDLE_DIR, "index.md")), true, "B still has the folder pre-pull");
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

test("sync --migrate --yes is idempotent: re-run and teammate-run both report already migrated (exit 0)", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    await runSyncJson(home, ["--migrate", "--yes", "--dir", topo.a.root]);
    const boardSha = git(topo.origin, ["rev-parse", "refs/heads/board"]).trim();

    // Re-run on the migrating clone: exit 0, pinned string, nothing changes.
    const again = await runSyncJson(home, ["--migrate", "--yes", "--dir", topo.a.root]);
    assert.equal(again.migrate, MIGRATE_ALREADY);
    assert.match(String(again.note), /still carries the committed \.agentstate-lite\/ folder/);
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), boardSha);

    // Teammate's clone (folder still committed, hasn't pulled): already migrated, nothing mutated.
    const preHeadB = git(topo.b.root, ["rev-parse", "HEAD"]).trim();
    const teammate = await runSyncJson(home, ["--migrate", "--yes", "--dir", topo.b.root]);
    assert.equal(teammate.migrate, MIGRATE_ALREADY);
    assert.match(String(teammate.note), /pull it, then run/);
    assert.equal(git(topo.b.root, ["rev-parse", "HEAD"]).trim(), preHeadB);
    assert.equal(
      gitTry(topo.b.root, ["rev-parse", "--verify", "--quiet", "refs/heads/board"]).status !== 0,
      true,
      "no local board branch created on B",
    );
    assert.equal(
      gitTry(topo.b.root, ["rev-parse", "--verify", "--quiet", `refs/heads/${MIGRATION_BRANCH}`]).status !== 0,
      true,
      "no migration branch created on B",
    );
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── refusals ──────────────────────────────────────────────────────────────────

test("sync --migrate refuses on uncommitted board changes, naming them; nothing mutated", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    const preHead = git(topo.a.root, ["rev-parse", "HEAD"]).trim();
    await writeFile(path.join(topo.a.board, "tasks", "seed-one.md"), "---\ntype: Task\ntitle: dirty\n---\n# dirty\n");
    await writeFile(path.join(topo.a.board, "stray-note.md"), "---\ntype: Note\ntitle: new\n---\n# new\n");

    for (const argv of [["--migrate", "--yes"], ["--migrate"]]) {
      const { err } = await runSync(home, [...argv, "--dir", topo.a.root, "--json"]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err!.message, /migration refused: \.agentstate-lite\/ has uncommitted changes/);
      const uncommitted = (err!.details as { uncommitted: { total: number; rows: Array<{ path: string }> } }).uncommitted;
      assert.equal(uncommitted.total, 2);
      const paths = uncommitted.rows.map((r) => r.path).sort();
      assert.deepEqual(paths, [".agentstate-lite/stray-note.md", ".agentstate-lite/tasks/seed-one.md"]);
      assert.match(err!.help ?? "", /sync --migrate --yes$/);
      assertPristine(topo, topo.a.root, preHead);
    }
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

test("sync --migrate structured refusals: no repo, no committed folder, detached HEAD, stray board branch", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  const bare = await mkdtemp(path.join(tmpdir(), "aslite-migrate-norepo-"));
  try {
    // Not a git repository.
    const noRepo = await runSync(home, ["--migrate", "--yes", "--dir", bare, "--json"]);
    assert.equal(noRepo.err?.code, "RUNTIME");
    assert.match(noRepo.err!.message, /not inside a git repository/);

    // A repo with an origin remote but no committed folder anywhere.
    const plain = path.join(bare, "plain");
    git(bare, ["init", "-b", "main", "plain"]);
    await writeFile(path.join(plain, "README.md"), "# no board here\n");
    git(plain, ["add", "-A"]);
    git(plain, ["commit", "-m", "initial"]);
    git(plain, ["remote", "add", "origin", topo.origin]); // any resolvable remote without a board branch
    const noFolder = await runSync(home, ["--migrate", "--yes", "--dir", plain, "--json"]);
    assert.equal(noFolder.err?.code, "RUNTIME");
    assert.match(noFolder.err!.message, /no committed \.agentstate-lite\/ folder on the current branch — nothing to migrate/);

    // Detached HEAD.
    git(topo.a.root, ["checkout", "--detach"]);
    const detached = await runSync(home, ["--migrate", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(detached.err?.code, "RUNTIME");
    assert.match(detached.err!.message, /detached HEAD/);
    git(topo.a.root, ["checkout", "main"]);

    // A stray local `board` branch that is NOT an interrupted-migration remnant.
    git(topo.a.root, ["branch", "board", "main"]);
    const stray = await runSync(home, ["--migrate", "--yes", "--dir", topo.a.root, "--json"]);
    assert.equal(stray.err?.code, "RUNTIME");
    assert.match(stray.err!.message, /a local 'board' branch already exists and does not match the committed folder/);
    git(topo.a.root, ["branch", "-D", "board"]);

    // No forbidden vocabulary in any of the refusal strings.
    for (const e of [noRepo.err, noFolder.err, detached.err, stray.err]) {
      assert.doesNotMatch(`${e!.message} ${e!.help ?? ""}`, FORBIDDEN);
    }
  } finally {
    await topo.cleanup();
    await cleanup();
    await rm(bare, { recursive: true, force: true });
  }
});

test("sync --migrate recovers an interrupted run: a matching single-root local board branch is reused", async () => {
  const topo = await makeCommittedFolderTopology();
  const { home, cleanup } = await tempHome();
  try {
    // Simulate the crash window: the root commit + branch exist locally, but nothing was pushed.
    const treeSha = git(topo.a.root, ["rev-parse", `HEAD:${BUNDLE_DIR}`]).trim();
    const orphanSha = git(topo.a.root, ["commit-tree", treeSha, "-m", "board: interrupted run"]).trim();
    git(topo.a.root, ["branch", "board", orphanSha]);

    const rec = await runSyncJson(home, ["--migrate", "--yes", "--dir", topo.a.root]);
    assert.equal(rec.migrated, MIGRATE_DONE);
    assert.equal((rec.board_commit as string).trim(), orphanSha, "the interrupted run's root commit is reused");
    assert.equal(git(topo.origin, ["rev-parse", "refs/heads/board"]).trim(), orphanSha);
  } finally {
    await topo.cleanup();
    await cleanup();
  }
});

// ── flag combos ───────────────────────────────────────────────────────────────

test("sync --migrate flag combinations are structured USAGE errors", async () => {
  const { home, cleanup } = await tempHome();
  try {
    for (const [argv, pattern] of [
      [["--migrate", "--pull-only"], /--migrate and --pull-only cannot be combined/],
      [["--migrate", "--show-incoming", "tasks/x"], /--migrate and --show-incoming cannot be combined/],
      [["--migrate", "--out", "f"], /--out only applies to sync --show-incoming/],
      [["--yes"], /--yes only applies to sync --migrate/],
    ] as Array<[string[], RegExp]>) {
      const { err } = await runSync(home, [...argv, "--json"]);
      assert.equal(err?.code, "USAGE", argv.join(" "));
      assert.match(err!.message, pattern);
    }
  } finally {
    await cleanup();
  }
});
