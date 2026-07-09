---
type: Research
title: >-
  sync verb design review — two-round panel record (v1 red flags; v2.1 delta;
  v2.2 adjudications)
timestamp: '2026-07-07T20:05:39.343Z'
---
# sync verb design review — 4-agent panel findings (2026-07-07)

Dialectic review of the v1 sync design: four epistemically isolated reviewers (adversarial
skeptic, git-mechanics specialist with empirical scratch-repo verification on git 2.39.5,
architecture/scope, consumer advocate). Unanimous shape: sound approach, NOT buildable as
written. This record is the evidence base for the v2 revision
([plans/sync-verb](../plans/sync-verb.md)) and the binding plan
([plans/sync-verb-implementation](../plans/sync-verb-implementation.md)).

## Red flags (convergent findings first)

1. **(3/4 reviewers; empirical) `git pull --rebase` on the shared branch fails or corrupts
   in the common case.** Refuses on ANY unstaged change anywhere; `--autostash` can write
   conflict markers into the user's uncommitted CODE files and exit 0 (reproduced); the
   whole-branch rebase replays the founders' own code commits; a doc conflict strands the
   entire repo mid-rebase, pushing agents into the raw-marker editing the skill forbids.
2. **(empirical) v1's `git commit -- <path>` silently drops NEW docs.** Pathspec commits
   only pick up tracked files — a freshly created task/note syncs "successfully" and never
   leaves the machine. Fix verified: `git add -A -- <path>` then pathspec commit, leaving
   the user's unrelated staged code intact.
3. **(2/4, disjoint evidence) SessionStart pull violates home()'s structural OFFLINE
   GUARANTEE** (home.ts:10-21, "never fetches") under the 10s hook timeout — and the hook
   surface installs exactly ONE command today. Fix: a separate `sync --pull-only` hook step
   caching awareness state to a file; home stays fs-only and instant.
4. **(3/4) The cursor-as-SHA has no error branch** — history rewrites (incl. sync's own
   rebase) dangle it → `fatal: Invalid revision range` (reproduced). Fix: `git cat-file -e`
   existence guard, re-anchor with an honest "delta unavailable (history rewritten)" note,
   per-BUNDLE keying (not per-machine), opaque `{tier, token}` shape for the future D1 seq
   tier.
5. **(consumer advocate) The push half of the loop has no trigger.** Only pulling is
   automated; writes rot locally unless an agent remembers a verb the skill never mentions;
   commit-succeeded-push-failed is invisible to the human. Fix: skill typical-flow +
   unit-close triggers, and SessionStart reports unpushed local board commits.

Also carried: GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE env leakage overrides `-C` (reproduced —
scrub them); no cross-process lock (index.lock races between agents and the user's own
git); exit-code mapping unpinned (git-missing→1, auth→4, conflict→5; a conflicted run must
EXIT 5, never 0-with-an-array); GIT_TERMINAL_PROMPT=0 doesn't cover SSH prompts (add
GIT_SSH_COMMAND BatchMode) and auth-vs-missing-repo is only a coarse stderr heuristic;
detached HEAD / no-upstream unhandled; rename detection is threshold-based (decision:
doc identity == path, so A+D without `-M` is semantically correct).

## Survived attack (calibration)

git-as-the-change-feed core bet; one-doc-one-file 3-way merge for different-doc
concurrency; two-dot diff for awareness; GIT_TERMINAL_PROMPT=0 killing the hang class;
the detect step's AXI semantics; gate-3 engine git-blindness; scope cleanliness vs
docs/core; the `board:` commit prefix as a stable filter contract.

## Verified command shapes (scratch-repo-confirmed)

All with env scrubbed + `git -C <dir>`, GIT_TERMINAL_PROMPT=0, GIT_SSH_COMMAND BatchMode:
detect `rev-parse --is-inside-work-tree`; preconditions `symbolic-ref -q HEAD` /
`rev-parse --abbrev-ref @{u}` / dirty-tree `status --porcelain`; commit `add -A` →
`commit -m "board: <actor> — N docs"` (skip on `diff --cached --quiet`); conflict path
`diff --name-only --diff-filter=U` → `rebase --abort` → report; cursor
`cat-file -e <token>^{commit}` → `diff --name-status <token>..HEAD`; SessionStart
`fetch` + `merge --ff-only @{u}` swallowing every nonzero exit.

## Outcome

The whole-branch entanglement (flag 1) motivated v2's architecture change — dedicated
board branch + linked worktree, see
[decisions/board-branch-sync](../decisions/board-branch-sync.md). Flags 2–5 fixes carried
into v2 verbatim.

## Round 2 (2026-07-07) — delta re-review of v2.1 by the same four reviewers

Verdicts: skeptic sound-with-red-flags · git-mechanic pass-with-caveats (empirical) ·
architect pass-with-caveats · consumer advocate serves-intent-with-gaps. UNANIMOUS: the
board-branch + worktree architecture is structurally right — it closed all of round 1's
architectural flags by construction (worktree index isolation survived dedicated attack:
staged/unstaged/other-branch code, inherited GIT_DIR). Remaining risk moved entirely into
conflict resolution, provisioning/migration, and ordering.

### Ship-blockers (multi-reviewer convergence)

1. **Conflict resolution did not converge (skeptic proof, consumer scene, mechanic's
   related empirics).** `git rebase` replays ORIGINAL commits, not final content: after
   abort → `doc update` fix-on-top → re-sync, the original conflicting commit replays
   first and re-hits the identical conflict. Infinite loop. v2.2 adjudicates the
   CAS-semantics mechanic: complete the sync by keeping the UPSTREAM version of each
   conflicted doc, EXPORT the local version to a file named in the envelope, finish the
   rebase (never left mid-state), and reconcile via `doc update` as a NEW write on top —
   converges in one pass, loses nothing. Convergence is an acceptance test.
2. **First-contact ordering was asserted, not mechanized (skeptic, architect, consumer,
   mechanic — four angles).** Two SessionStart entries have no cross-runtime ordering
   guarantee; home must never block on network; on a hooks-not-installed fresh clone our
   own skill's `init` guidance creates the divergent second bundle. v2.2: ONE SessionStart
   command (time-boxed best-effort pull → write cache → render; home reads last-known,
   never waits on network); the SKILL teaches `sync` as the setup verb for existing
   projects (init = greenfield only); `init` gains an FS-only hint when run inside a git
   repo (no git-binary dependency — checks for .git up-tree).
3. **Migration data-loss window + broken upstream (skeptic, mechanic empirical).**
   Founder B's uncommitted board edits are deleted by the post-migration `git pull`;
   AND the migrating machine's `subtree split` board branch has NO upstream — every
   `@{u}` op fails on exactly that machine. v2.2: migration PRECONDITION "all founders
   sync first" + refuses on uncommitted board changes; `git push -u origin board`; and
   the design switches from `@{u}` to EXPLICIT `origin/board` refs everywhere (immune to
   tracking-config divergence between the two provisioning paths).

### Hardening folded into v2.2 (single-reviewer, verified or convention-grounded)

Provision self-heal guards (fetch before referencing board; pre-existing non-empty dir;
"already checked out" = idempotent success — all empirical); `--pull-only` on a dirty
board worktree contradiction resolved (pull-only = ff-only merge semantics, matching
SessionStart; full sync commits first so the rebase always starts clean); crash-mid-sync
self-heal (stale rebase state detected at start → abort); `--show-incoming` reads
`origin/board:<path>`, renders "deleted upstream" as a state not a fatal, inherits
doc-read's full byte-channel contract (`--out -` envelope → stderr); awareness cache +
board-pending marker get the cursor's exact discipline (~/.agentstate/, per-bundle key,
atomic 0600/0700, timestamped, home swallows-to-null); single source of truth — the
enriched `changesSince(cursor) → {docId, actor, verb, kind, title}` is THE feed producer,
commit bodies are a human mirror, never parsed; commit via argv/`-F -` (no shell
interpolation); multi-actor batches attribute per-doc (subject names the actor only when
single); distinct error codes GIT_MISSING / NO_UPSTREAM (both exit 1); SessionStart
backstop counts BOTH unpushed commits AND uncommitted board changes (the never-synced
agent case); string fixes ("back online or your access is restored"; actor phrase built
from actual actors); records discipline — U5/U6 update tasks/git-sharing + docs/core so
the shipped record never contradicts the shipped mechanism; `git clean -fdx` note in the
"you may notice" aside. AUTH-vs-network classification documented as best-effort stderr
heuristic (GitHub returns "not found" for unauthorized-private — clean separation is
impossible).

### Accepted trade-off (named, not fixed)

Per-machine cursor: "since your last session" on a second machine replays what the person
already saw elsewhere. Cross-machine per-person state is out of scope for the git tier;
v2.2 takes the two cheap honesty moves — the human render is labeled by machine reality
("since this machine last synced") and self-authored changes are filtered from the human
count — and defers true per-person awareness to the hosted tier.

### Process note

The git-mechanic disclosed that a failed `cd` briefly ran its scratch commands against
the real repo (one stray local commit on the working branch, never pushed); it
self-reverted and the orchestrator independently verified the repo clean (status empty,
HEAD at the pushed tip, no stray files/branches/stashes). Recorded here because honest
incident disclosure is the behavior we want from review agents.
