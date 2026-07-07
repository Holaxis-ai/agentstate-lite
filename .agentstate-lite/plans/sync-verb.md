---
type: Plan
title: >-
  sync verb v2.1: board branch + worktree, UX layer folded in (panel- and
  DevX-reviewed)
timestamp: '2026-07-07T19:50:35.976Z'
---
# sync verb — design v2 (board branch + linked worktree)

v2 pinned 2026-07-07, superseding v1 after the 4-agent panel review
([research/sync-verb-review](../research/sync-verb-review.md)) showed v1's shared-branch
porcelain unsafe in the common case. Architecture change recorded in
[decisions/board-branch-sync](../decisions/board-branch-sync.md) (Brian approved; Mike to
confirm before migration executes). The driving requirement, from Brian directly: sync must
touch ONLY `.agentstate-lite/`. Git cannot pull or push a folder on a shared branch —
those operations are branch-atomic — so folder scoping is achieved STRUCTURALLY: the
bundle lives on a dedicated `board` branch (branch root = bundle root) checked out as a
linked worktree at `.agentstate-lite/`, gitignored on main.

## What changed from v1 (each traced to a panel finding)

- v1's `git pull --rebase` on the shared branch refused on any unstaged change, could
  corrupt uncommitted user code via `--autostash` while exiting 0, rebased the founders'
  own code commits, and stranded the repo mid-rebase on conflict. Under the board
  worktree, sync physically cannot touch user code: the rebase replays only bundle
  commits, conflicts occur only in docs, and the worktree has its OWN index (no
  index.lock contention with the user's git).
- v1's pathspec commit silently dropped NEW (untracked) docs. v2 stages first: `add -A`
  inside the worktree, then commit.
- v1 folded the pull into the SessionStart home view, violating home()'s structural
  offline guarantee. v2 splits them (below).
- v1's cursor had no error branch. v2 specifies guard + re-anchor + honest reporting.
- v1 named no push trigger. v2 wires the loop's other half (below).

## Shape

`aslite sync [--pull-only]` — shell to SYSTEM git, always `git -C <worktree>`, env
scrubbed (unset GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE — inherited values override `-C`),
GIT_TERMINAL_PROMPT=0, GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10':

0. **provision**: worktree absent but `board` exists on origin → `git worktree add
   .agentstate-lite board` (self-healing clone). No git repo at all → definitive
   "sync: nothing to sync", exit 0. All worktree internals via `git rev-parse --git-path`
   (in a linked worktree `.git` is a FILE — never assume a directory).
1. **commit**: `git add -A` → `git commit -m "board: <actor> — N docs"`; skip when
   `git diff --cached --quiet` (idempotent no-op).
2. **pull**: `git fetch origin` → `git rebase @{u}` inside the worktree. On conflict:
   collect ids via `diff --name-only --diff-filter=U`, then `git rebase --abort` — NEVER
   leave the worktree mid-rebase — and exit CONFLICT(5) reporting both versions per doc
   with resolution routed through `doc update` (never hand-edited conflict markers).
3. **push** (`--pull-only` skips 1 and 3).
4. **Envelope**: `{committed, pulled, pushed, conflicts{shown,total,rows}}` (cap()
   convention); "sync: nothing to sync" exit 0. classifyGitError chokepoint: git-missing →
   RUNTIME(1) with help "install git", auth → AUTH(4), unresolved conflict → CONFLICT(5).
   No raw git output on stdout, ever. Precondition failures (detached HEAD, no upstream)
   are structured errors naming the state.

## The four rules (v1's, upgraded)

1. **Git optional** — unchanged. Stated plainly now: the awareness value lives in this
   tier; a git-less bundle gets zero awareness by design.
2. **Path-scoped, always** — now BY CONSTRUCTION (the synced branch contains only the
   bundle), not by per-command discipline.
3. **AXI at the boundary** — unchanged, plus the non-interactive guards above.
4. **Command layer only** — unchanged; the engine never learns git exists. Placement:
   new `cli/src/git.ts` + `cli/src/cursor.ts`; `packages/core` untouched.

## Awareness cursor

Keyed per BUNDLE (repo remote URL + subpath; fallback: absolute bundle root), stored in
`~/.agentstate/` with credentials.ts's atomic-write/0600 discipline, as an OPAQUE
`{tier: "git", token: <sha>}` — the future D1 tier ships `{tier: "d1", token: <seq>}`
behind the same `changesSince(cursor) → {docId, actor}[]` interface, keeping the CLI
surface tier-agnostic. Guard `git cat-file -e <token>^{commit}` before diffing; on miss,
re-anchor to HEAD and report "delta unavailable (history rewritten)" — never silently
skip unseen changes. Two-dot diff (snapshot-to-snapshot; requires object existence, not
ancestry).

## SessionStart (split, preserving home's offline guarantee)

A SEPARATE hook step runs `sync --pull-only`: `fetch` + `merge --ff-only @{u}` in the
worktree (fail-soft: swallows not-a-repo, no-upstream, detached HEAD, divergence, dirty
refusal, auth/network — every nonzero exit), computes the delta + unpushed-commit count,
CACHES both to a file, advances the cursor. `home()` stays fs-only/offline/instant and
renders from the cache: "since your last session: N docs changed — <actor>: <ids>" plus
the honesty backstop: "M local board commits not yet pushed — run sync when online."
Hook wiring is a named open decision: extend axi-sdk-js installSessionStartHooks for a
second managed entry, or `hook install --with-sync` (default: --with-sync — no external
dependency). The richer human render (verb + kind + title, chronological) belongs to the
activity feed (plans/ui-orientation-brief) consuming the SAME derivation — one primitive,
two faces.

## Push triggers (the loop's other half)

- The SKILL's typical flow and the unit-close convention end with `sync` — recording work
  is not done until it is shared.
- Optional Stop/SessionEnd hook mirroring the pull step.
- The SessionStart unpushed-count is the backstop when both were missed.

## Migration (one-time; the current bundle is committed on main)

`git subtree split -P .agentstate-lite -b board` (preserves the folder's history as the
branch), push `board`; remove the folder from main's tree + gitignore it; provision
worktrees per clone (or let sync self-provision). Scriptable; candidate `sync --migrate`.
Human-gated: runs on this repo only after Mike confirms the decision doc.

## Carried unchanged from v1

Conflict model (one doc = one file; git 3-way merges different-doc concurrency; same-doc
= CAS-conflict-at-sync-time; escalation to `serve` as a shared head or the frozen worker
is CONFIG, not build). Real-time ladder parked with wake conditions. Non-goals: no
daemon, no auto-commit-per-write, no submodules (the linked worktree is NOT a submodule —
same repo, no gitlink), no embedded git library (system git inherits the user's auth —
still the whole point), no cross-repo multi-bundle orchestration.

## UX layer (v2.1 — DevX pass; full record + message pack in [research/sync-verb-ux-review](../research/sync-verb-ux-review.md))

The strings in the UX review's message pack are the CONTRACT for implementation — moments
(a)–(f) ship as written there. Amendments to the sections above:

- **Provisioning (amends step 0 + SessionStart):** the SessionStart `sync --pull-only`
  step is the DESIGNATED provisioner and runs before `home` renders. `home`'s no-bundle
  fallback becomes board-aware via an FS-only cache marker: when `board` exists on origin
  it says "board not yet provisioned — run `aslite sync`", NEVER "run init". A founder
  with a board on origin must be unable to init a divergent second bundle by following
  our own hint.
- **Empty states (amends step 4):** two distinct strings — no git repo →
  `sync: nothing to sync`; clean and current → `sync: already up to date`. The receipt is
  the point.
- **Conflict path (amends step 2):** conflict rows carry `{id, kind, title, yours,
  theirs}`, and the design adds `sync --show-incoming <id>` — prints the upstream (@{u})
  version of a doc in canonical markdown with doc-read semantics (truncation + `--out`
  hatch) so resolution never needs raw git or hand-edited markers. Help chain:
  show-incoming → `doc update` → re-run `sync`.
- **Push-fail honesty (amends step 4):** partial envelope leads with safety
  ("committed to the board locally — your work is saved…"), exit class 4 (auth) / 1
  (network) unchanged for agents.
- **Awareness render (amends the cursor/SessionStart sections):** agent face = envelope
  rows `{verb, kind, id, title, actor}`; human face = one line per doc,
  `mike · updated Task "…"`; clean → `board: up to date`; offline → "showing last known
  state" note.
- **Commit grammar (amends step 1):** stable `board:` prefix preserved; single-doc
  subject `board: <actor> — updated <id>`; multi-doc `board: <actor> — N docs` (never
  "1 docs"); the per-doc verb-kind-id list goes in the commit BODY so `git log board`
  carries the activity feed without a re-derivation.
- **Migration comms (amends Migration):** U5 ships a one-time heads-up to both founders
  (rollout note + first post-migration render): after `git pull`, `.agentstate-lite/`
  briefly disappears from main and is re-created on the next aslite command — nothing is
  lost; from then on `aslite sync`, not `git pull`, updates the board. `sync --migrate`
  requires `--yes` and is idempotent ("already migrated").
- **User-facing language rule:** no "worktree"/"linked"/"subtree" in any user-facing
  string. The one founder-sentence: "`aslite sync` shares your board — commits your
  changes, pulls your teammate's, pushes yours, touching nothing but the board." The
  `board` branch gets exactly one prepared "you may notice" aside (docs + skill), so
  GitHub's branch list reads as designed, not surprise magic.
- **Deferred:** `sync --dry-run` (named; SessionStart already previews; build on demand).
