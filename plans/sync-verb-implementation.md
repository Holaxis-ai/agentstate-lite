---
type: Plan
title: >-
  sync verb v2 — binding implementation plan (U0 harness → U6 skill; U5
  migration Mike-gated)
timestamp: '2026-07-07T21:09:30.183Z'
---
# sync verb v2.2 — canonical implementation plan

**Canonical. Vetted Phase B by 4 panel reviewers + orchestrator (all CONFIRM after
adjudication); supersedes the layered revisions.** Every unit below is stated in full with
all amendment layers (base + UX v2.1 + hardening v2.2) and the Phase B adjudications (A–I)
already folded in — a builder never needs layer archaeology. Design:
[plans/sync-verb](../plans/sync-verb.md). Evidence base:
[research/sync-verb-review](../research/sync-verb-review.md) (two-round panel; verified
command shapes + acceptance criteria are BINDING). String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) (the message pack;
moments referenced below by letter). Architecture decision (Mike gates the migration only):
[decisions/board-branch-sync](../decisions/board-branch-sync.md).

## Standing gates (honored by every unit)

- **Git optional** — a git-less bundle gets zero awareness by design.
- **Path-scoped by CONSTRUCTION** — the `board` branch contains only the bundle; sync
  physically cannot touch user code.
- **AXI at the boundary** — structured TOON envelopes, capped exit taxonomy (0/1/4/5), NO
  raw git output on stdout EVER.
- **Command layer only** — `packages/core` NEVER learns git exists. New code lives only in
  `cli/src/git.ts`, `cli/src/cursor.ts`, `cli/src/commands/sync.ts`, `cli/src/home.ts`,
  `cli/src/errors.ts`, `cli/src/reference.ts`, and the new hook subcommand.
- **Per-unit gate ALWAYS Builder → Reviewer (independent subagent) → QA** — never
  Build → QA. QA = full `npm run check` + the two-clone e2e + gate-1 AXI watch-points. Ship
  each unit on its own branch + PR; Brian merges.

## Global porcelain invariants (every git op in U1/U3/U4/U5)

- Always `git -C <worktree>`; env scrubbed: unset GIT_DIR / GIT_WORK_TREE /
  GIT_INDEX_FILE (inherited values override `-C` — reproduced by the panel);
  GIT_TERMINAL_PROMPT=0; GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10';
  per-op timeout.
- **EXPLICIT refs everywhere — `origin/board`, NEVER `@{u}`.** The migration machine's
  subtree-split branch has no tracking config (empirical), so `@{u}` is undefined on
  exactly that machine. `rebase origin/board`, `merge --ff-only origin/board`,
  `show origin/board:<path>`.
- Worktree internals via `git rev-parse --git-path` — in a linked worktree `.git` is a
  FILE, never assume a directory.
- Rename detection OFF (`-M` omitted): doc identity IS its path; add+delete is the true
  story.
- No raw git on stdout. `classifyGitError` is the chokepoint — maps STABLE signals (not
  localized prose where avoidable) to the capped taxonomy.

## Units

### U0 — test harness (BLOCKS ALL)

NEW `packages/cli/test/git-harness.ts`: helpers that build scratch repo topologies
hermetically — bare origin + two clones; provision `board` branch + linked worktree; plant
fixtures: dirty non-bundle tree, staged code, new/modified/deleted docs, divergent
histories, dangling cursor SHA, **stale mid-rebase state**, and (adjudication B) a
**concurrent-sync / held-`index.lock` fixture** (a second git process holding the worktree
lock). Acceptance: consumed by ≥2 downstream suites; runs hermetically under
`npm test -w agentstate-lite`. Rationale: the standing feedback-infrastructure gate — no
porcelain iteration loop before a fast, dependable git harness exists. **Deps: none.**

### U1 — git porcelain layer

NEW `packages/cli/src/git.ts`: ONE spawn wrapper enforcing the global porcelain invariants,
plus ops:

- **isProvisioned / provisionBoardWorktree** — SELF-HEAL, all empirically grounded:
  `git fetch origin` BEFORE referencing `board`; worktree absent but `origin/board` exists →
  `git worktree add .agentstate-lite board` (self-healing clone); a pre-existing NON-EMPTY
  `.agentstate-lite/` is resolved-or-refused with guidance, never a blind `worktree add`;
  "already checked out" = idempotent success; no git repo at all → caller emits definitive
  `sync: nothing to sync`, exit 0.
- **stageAndCommit** — `git add -A` → commit; skip when `git diff --cached --quiet`
  (idempotent no-op). Commit message via argv / `-F -` (NO shell interpolation). Grammar:
  stable `board:` prefix; single-doc subject `board: <actor> — updated <id>`; multi-doc
  `board: <actor> — N docs` (NEVER "1 docs"); multi-actor `board: N docs from M actors`
  (subject names the actor only when exactly one); the per-doc verb-kind-id list goes in
  the commit BODY (so `git log board` carries the activity feed) but is **NEVER parsed
  back**.
- **fetchRebase** — `git fetch origin` → `git rebase origin/board`. **Conflict boundary
  (adjudication A): DETECT ONLY.** Collect conflicted ids via
  `diff --name-only --diff-filter=U`, then `git rebase --abort` cleanly — ZERO data
  movement, NO ours/theirs logic in U1, worktree left pristine. (The converging keep/export
  mechanic is U3b, which builds ON these primitives.)
- **push** — `git push origin board`.
- **ffPull** — `git fetch origin` → `git merge --ff-only origin/board`, swallowing every
  nonzero exit (the fail-soft matrix: not-a-repo, no-upstream, detached HEAD, divergence,
  dirty refusal, auth/network).
- **changesSince(cursor)** — enriched `{docId, actor, verb, kind, title}[]`. **Actor is
  read PER-DOC FROM FRONTMATTER, never from the commit subject (adjudication F).** Two-dot
  diff `<token>..HEAD` (snapshot-to-snapshot; requires object existence, not ancestry),
  guarded by `git cat-file -e <token>^{commit}`.
- **unpushedCount** — local board commits ahead of `origin/board`.
- **detectStaleRebase / abortStaleRebase** — a rebase already in progress
  (`rev-parse --git-path rebase-merge` exists) is detectable and abortable. (Consumed at
  SYNC ENTRY per adjudication C, not inside fetchRebase.)

NEW in `errors.ts`: `classifyGitError` mirroring `classifyBundleError` — DISTINCT codes:
- **GIT_MISSING** (exit 1) and **NO_UPSTREAM** (exit 1) — the FORBIDDEN/LAST_ADMIN
  distinct-code-shared-exit pattern.
- **GIT_BUSY** (exit 1, adjudication B) — `index.lock` present / another git process. The
  U1 op returns a STRUCTURED RETRY envelope (never a raw git strand).
- AUTH (exit 4) vs network (exit 1) — documented BEST-EFFORT (GitHub returns "not found"
  for unauthorized-private — clean separation is impossible).
- unresolved conflict → CONFLICT (exit 5). Precondition failures (detached HEAD, no
  upstream) are structured errors naming the state.

**Tests [deps: U0]:** staged-code-untouched; unstaged-user-code-untouched (any branch);
new/modified/deleted-doc-committed; env-leak override (GIT_DIR set → `-C` still wins);
ff-only swallow matrix; **conflict → detect+collect+clean-abort, worktree pristine, NO
export file**; GIT_BUSY structured-retry envelope against the U0 concurrent-sync fixture;
non-empty-dir refusal; already-checked-out idempotence; commit-grammar strings (incl.
never-"1 docs", multi-actor); changesSince actor-from-frontmatter (a commit whose subject
names actor X but whose doc frontmatter names Y attributes to Y).

### U2 — cursor + awareness state module

NEW `packages/cli/src/cursor.ts`: opaque `{tier, token}` cursor (git tier = SHA; the future
D1 tier ships `{tier:"d1", token:<seq>}` behind the SAME `changesSince` interface, keeping
the CLI tier-agnostic). Keyed per BUNDLE (repo remote URL + subpath; fallback: absolute
bundle root — NOT per-machine). Atomic 0600/0700 writes reusing `credentials.ts` machinery
(O_EXCL temp → chmod → rename). This ONE module also owns the **awareness cache** and the
**board-pending marker** — cursor + cache + marker under one per-bundle key, same atomic
discipline; the marker is timestamped and refreshed by every pull step. Existence guard +
re-anchor: `git cat-file -e` before diffing; on miss → re-anchor to HEAD and report
"delta unavailable (history rewritten)" — NEVER a silent skip, never fatal. The enriched
`changesSince` (actor PER-DOC FROM FRONTMATTER, adjudication F) is THE single feed producer
for both faces AND the future activity feed. `home` treats absent/stale/malformed
cache-or-marker as null inside its existing double-guard — marker absence ALONE never
produces "run init".

**Tests [deps: U0]:** dangling-SHA re-anchor honest note; cross-bundle isolation (two
bundles, distinct keys); atomic-write/permissions (0600/0700); enriched-delta shape
(actor sourced from frontmatter).

### U3a — the `sync` command, core flow

Replace the NOT_IMPLEMENTED exit-2 stub in `packages/cli/src/commands/sync.ts`. Flow
(`--pull-only` skips commit + push):

0. **entry self-heal (adjudication C):** a stale mid-rebase state found at sync ENTRY
   (crash/kill mid-run) is aborted BEFORE the commit step — a wedged worktree kills the
   commit step first, so the heal must precede it.
1. **provision** (via U1 self-heal).
2. **commit** (stageAndCommit; skip-empty).
3. **pull** — full sync: `rebase origin/board`. `--pull-only`: `merge --ff-only
   origin/board` (NEVER rebase — a dirty board worktree can't strand it; full sync commits
   first, so its rebase always starts clean).
4. **push.**
5. **envelope + awareness cache write.**

Envelope (`cap()` convention): `{committed, pulled, pushed, conflicts{shown,total,rows}}`.
Message-pack strings are the CONTRACT (test-pinned):

- **(a) clean sync:** `sync: {committed:N, pushed:N, pulled:N, actor:<a>, incoming:{shown,
  total, rows:[{verb,kind,id,title,actor}…]}}`.
- **(b) TWO DISTINCT empty states:** no git repo → `sync: nothing to sync`; clean+current →
  `sync: already up to date`. The receipt is the point.
- **Conflict outcome (adjudication A — U3a INTERIM):** the U1 detect+clean-abort, then a
  structured CONFLICT(5) with the interim string **"doc X changed on both sides — nothing
  was changed on either side; conflict resolution ships in the next update"**. NO export
  file at U3a. (This guard is written IN this task's brief; U3b replaces it with the
  converging mechanic.)
- **(d) push-fail after commit** → PARTIAL envelope LEADING with safety: **"committed to
  the board locally — your work is saved. The push failed (offline or auth); re-run sync
  when you're back online or your access is restored."** (adjudication D adds the
  access-restored clause). exit 4 (auth) / 1 (network), same message.
- **(f) git missing** → GIT_MISSING/exit 1 "sync needs git, which isn't installed on this
  machine"; **no upstream** → NO_UPSTREAM/exit 1 "the board branch isn't linked to a remote
  yet — sync can't share it" + migrate/teammate help.

Update `reference.ts` usage/summary (drift gates regenerate both SKILL.md channels).
Produces the awareness cache U4 consumes.

**Tests [deps: U1, U2]:** end-to-end two-clone founder scenario (A writes docs → sync → B
`sync --pull-only` sees the attributed delta); idempotent re-run; both empty states; the
INTERIM conflict guard (exit 5, pristine worktree, interim string, NO export file); **FULL
sync (with a pending commit) against a planted stale-rebase fixture heals at entry then
completes (adjudication C)**; push-fail partial envelope (string (d)); exit taxonomy
0/1/4/5; commit-grammar moments; string-pinned pack moments (a), (b), (d), (f).

### U3b — conflict resolution + `--show-incoming`

Ships the CONVERGING conflict mechanic, REPLACING U3a's interim guard. It REPLACES v1/v2.0's
abort-and-retry, which the round-2 skeptic proved infinite-loops (`git rebase` replays
ORIGINAL commits, so abort → doc-update-fix → re-sync re-hits the identical conflict).

**WARNING — rebase INVERTS ours/theirs.** During `rebase origin/board` you replay your local
commits ONTO origin/board, so HEAD/stage-2 ("ours") is the UPSTREAM version and stage-3
("theirs") is YOUR local commit's version. This inversion is exactly why the mechanic uses
EXPLICIT refs (`origin/board`, `:3:`) and never `--ours`/`--theirs`.

**Exact verified sequence (state verbatim; test-pinned).** Per conflicted `<path>`:

1. `git show :3:<path> > <export-file>` — FIRST. (`:3:` = theirs-in-rebase = YOUR local
   version → this is "yours saved".)
2. `git checkout origin/board -- <path>` — keep the UPSTREAM (teammate's) version.
3. `git add -- <path>`.

Then advance the rebase non-interactively:

- `GIT_EDITOR=true GIT_SEQUENCE_EDITOR=true git rebase --continue`

**LOOP** the whole per-path block + continue until `git rev-parse --git-path rebase-merge`
is GONE (multiple local commits can each stop the rebase). The worktree is NEVER left
mid-state; non-conflicted local changes still land.

Exit CONFLICT(5) with the per-doc string (adjudication D) **"teammate's version kept; yours
saved at <path> — reconcile with doc update"**. Reconcile = `doc update` with the merged
body (a NEW write on top); then sync pushes cleanly. Converges in ONE pass, loses nothing.

- **Amended pack (c) (adjudication D):** the phrase "nothing was overwritten" is DROPPED;
  conflict rows carry `{id, kind, title, yours, theirs}` plus the export path per doc; help
  chain `sync --show-incoming <id>` → `doc update <id> --body-file <file>` → `sync`.
- **`sync --show-incoming <id>`:** prints the upstream version via
  `git show origin/board:<path>` in canonical markdown with FULL doc-read semantics
  (truncation + `--out` hatch; `--out -` routes the envelope to STDERR per gate-1); renders
  deleted-upstream as a STATE, not a fatal. **Staleness is a conscious deferral
  (adjudication G): output is labeled "as of last fetch"** — no implicit fetch.

**BINDING convergence test [deps: U3a]:** follow the documented chain (show-incoming →
doc update → sync) and assert ALL THREE: (i) landed content == origin/board's version,
(ii) the export file is BYTE-IDENTICAL to the local version, (iii) the teammate's version
is NOT clobbered in a two-founder e2e. Plus: multi-commit loop terminates
(rebase-merge gone); deleted-upstream show-incoming state.

### U4 — SessionStart integration

**ONE SessionStart hook command (adjudication E — architect's ruling, unconditional).**
`hook install` wires ONE new bin SUBCOMMAND that does pull-then-render IN-PROCESS (portable
across Claude Code, Codex, AND OpenCode — the gate-1 three-runtime requirement; builder
names the subcommand consistent with `reference.ts` conventions). The command: time-boxed
best-effort pull (provision if needed → fetch → ff-only merge `origin/board` → write
awareness cache + timestamped marker + advance cursor) and THEN render home. **Pull budget
≤ 7s total, connect ≤ 5s, under the 10s hook timeout; GUARANTEED fall-through to the home
render** — home ALWAYS renders the last-known cache INSTANTLY (stale-instant fallback is
explicit) and NEVER blocks on the network; the pull refreshes the cache for the NEXT render
when it loses the time box. `home.ts` stays fs-only/offline/instant; its structural
offline-guarantee test must stay green UNTOUCHED. No inter-entry ordering dependency exists
(single entry). `hook install` remains the wiring path; U5/U6 PROMPT founders to re-run
`hook install`.

home reads the cache fs-only and renders "since your last session: N docs changed —
<actor>: <ids>" (moment (e)). **BACKSTOP counts BOTH unpushed board commits AND uncommitted
board changes** (catches the agent that never ran sync at all, not just the failed-push
one): "M local board commits not yet pushed — run sync when online." Human-face render: one
line per doc `mike · updated Task "…"`; clean → `board: up to date`; offline →
"board sync offline — showing last known state". **CURSOR HONESTY (decided trade-off):** the
since-line is labeled by MACHINE reality ("since this machine last synced"), self-authored
changes are FILTERED from the human count, and the actor phrase is built from the ACTUAL
actors (never assumes one teammate). True cross-machine per-person state defers to the
hosted tier.

**FIRST-CONTACT / no-bundle fallback** becomes board-aware via the fs-only marker: when
`origin/board` exists it says "board not yet provisioned — run `aslite sync`", NEVER
"run init" (a founder must be unable to init a divergent second bundle by following our own
hint).

**Tests [deps: U3a]:** home offline-guarantee test unchanged + green; time-box fall-through
(a slow/hung pull still renders home within budget); cache render (moment (e), strings
test-pinned); backstop both-count; divergent-second-bundle footgun (board-on-origin →
"run sync" never "init"); machine-honest since-line + self-authored filtering; actor phrase
from actual actors.

### U5 — migration of THIS repo's bundle (HUMAN-GATED: Mike)

The current bundle is committed on main. `sync --migrate` (guarded, never on the everyday
path; requires `--yes`; idempotent → "already migrated"): `git subtree split -P
.agentstate-lite -b board` (preserves the folder's history), **`git push -u origin board`**
(the `-u` is load-bearing — the split branch has no tracking config), remove the folder from
main's tree + gitignore it; both founders' machines provision worktrees on their next sync.
**PRECONDITIONS:** every founder syncs (at minimum commits) board state first; `--migrate`
REFUSES if uncommitted board changes exist. **Migration NEVER executes any `git clean`
(adjudication H)** — the `git clean -fdx` line exists ONLY as rollout-note copy (see COMMS).

**COMMS:** a one-time heads-up ships in the PRE-migration rollout note (the reassurance
lives here; the post-migration first render is backup) — after `git pull`,
`.agentstate-lite/` briefly disappears from main and is re-created on the next aslite
command; nothing is lost; from then on `aslite sync`, not `git pull`, updates the board. The
"you may notice a `board` branch in GitHub — never merge it into main" aside gains one line:
`git clean -fdx` on main removes the board checkout (recoverable — re-provisions from
origin; unpushed board commits are why you sync first). **Prompt founders to re-run
`hook install` (adjudication E).**

**RECORDS DISCIPLINE:** updates tasks/git-sharing + docs/core so "git pull IS the sharing
mechanism" never outlives the mechanism. No user-facing string contains
"worktree"/"linked"/"subtree".

**[deps: U3a; GATE: Mike confirms [decisions/board-branch-sync](../decisions/board-branch-sync.md)
before execution on this repo.]**

### U6 — skill + docs truth pass

`gen-skill.mjs`: typical flow ENDS with `sync` ("recording work isn't done until it's
shared"); Workspaces section teaches "shared with teammates via aslite sync" and NO
branch/worktree mechanics; `sync` is taught as the SETUP verb for existing projects (init =
greenfield only); `init` run inside a git repo prints an fs-only hint ("if this project
shares a board, run sync instead" — detected by `.git` up-tree, NO git binary invoked); the
ONE "you may notice a `board` branch" aside; the founder one-sentence: "`aslite sync` shares
your board — commits your changes, pulls your teammate's, pushes yours, touching nothing but
the board." **Prompt founders to re-run `hook install` (adjudication E).** Plugin version
bump in BOTH manifests — **the builder checks main's current version FIRST** (marketplace.json
is 1.0.11 at planning time; the plugin.json manifest must be verified and both bumped
together). README quickstart re-read against new behavior. USER-FACING LANGUAGE RULE holds
throughout: no "worktree"/"linked"/"subtree".

**[deps: U3b, U4 — U6 teaches the FULL user-facing surface, so it describes shipped conflict
+ SessionStart behavior, not just core.]**

## Binding acceptance criteria (unit-close = all test-pinned)

- A conflicted sync NEVER leaves the worktree mid-rebase (U3a aborts clean; U3b completes).
- User code — staged or unstaged, any branch — is untouched across every sync path.
- New, modified, AND deleted docs all cross the wire.
- `home()`'s offline-guarantee test unchanged and green; the SessionStart pull falls through
  to the render within budget.
- Dangling cursor → honest re-anchor note; never a silent skip, never fatal.
- Every git failure lands structured with taxonomy codes (incl. GIT_BUSY); no raw git on
  stdout.
- CONVERGENCE (U3b): the documented chain clears the conflict in one pass; export
  byte-identical to local; teammate not clobbered.

## Critical path & parallelism

`U0 → (U1 ∥ U2) → U3a → { U3b ∥ U4 ∥ U5(Mike-gated) } → U6`

- U0 blocks everything. U1 and U2 run in PARALLEL after U0.
- U3a is the critical-path centerpiece (needs U1 + U2). Once U3a merges, U3b, U4, and U5 run
  in PARALLEL (U4's ff-only pull needs only U3a's cache production, not the conflict path;
  U5 needs only the command; U3b isolates the highest-risk convergence mechanic behind its
  own review gate).
- U6 waits on U3b + U4 (documents the full surface).
- Longest chain: `U0 → U1(or U2) → U3a → U3b(or U4) → U6`.

## Task decomposition (board)

The nine task docs (eight sync units + the independent `tasks/roadmap-recipe`) are
`contains`-linked from [roadmap-items/local-first-loop](../roadmap-items/local-first-loop.md)
(roadmap-recipe from [roadmap-items/claims-provenance](../roadmap-items/claims-provenance.md)),
with `depends on` edges per the graph above. The top-level `roadmap` doc and
`tasks/git-sharing` are untouched (git-sharing stays in_progress; U5 closes it). The U3
split (U3a core / U3b conflict) is the one grain change from the base plan — justified by
isolating the highest-risk convergence gate and by unlocking the U3b ∥ U4 ∥ U5 parallelism
above.

## Open decisions carried

- **Mike's confirmation gates U5 ONLY** (migration on this repo); U0–U4 and U6 build now.
- Hook wiring: RESOLVED (adjudication E) — unconditional single in-process pull-then-render
  subcommand.
- Conflict staging: RESOLVED (adjudication A) — U3a interim guard → U3b converging mechanic.
