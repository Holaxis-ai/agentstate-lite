---
type: Plan
title: >-
  sync verb design: git porcelain, four rules, the awareness cursor (build HOLDS
  for its consumer)
timestamp: '2026-07-07T18:02:14.174Z'
---
# sync verb — design (git porcelain + the awareness cursor)

Design pinned 2026-07-07 while the build HOLDS: sync's first live consumer is the founders'
shared in-repo bundle, which lands after Brian's skill-location change + the scrubbed port
(see [docs/call-2026-07-07-bundle-in-repo](../docs/call-2026-07-07-bundle-in-repo.md) and
the port scrub audit (private board archive)). Spec lineage:
[tasks/git-sharing](../tasks/git-sharing.md) Tier 1 (the migration script is the harvested
spec). Do not build before the consumer exists.

## Shape

`aslite sync [--dir|--remote…no: git tier only] [--pull-only]` — shell out to SYSTEM git:

1. detect: bundle inside a git worktree? (`git rev-parse`) — if not, definitive structured
   answer, exit 0 semantics per AXI (a non-repo bundle has "nothing to sync", not an error).
2. commit: **pathspec-limited to the bundle folder only** — never `add -A`, never touch the
   user's staged code. Auto-message carries the actor (`board: <actor> — N docs`).
3. `git pull --rebase`, then push.
4. Envelope: `{committed, pulled, pushed, conflicts[]}` — counts + conflicted doc IDS with
   suggested resolution commands. Definitive empty: `sync: nothing to sync`. Idempotent.

## The four rules (constitution-level)

1. **Git is an OPTIONAL runtime dependency.** Only sync (and the hook's pull) touch it;
   every core command works with no git installed. Git-missing is a structured error naming
   the requirement, never a crash. Local-first = network AND git can both be absent.
2. **Path-scoped, always.** The bundle lives inside the user's code repo; sweeping up their
   staged changes is the unforgivable footgun.
3. **AXI at the boundary.** No raw git output on stdout, ever. `GIT_TERMINAL_PROMPT=0` so an
   auth problem is a structured error, never a hung agent (same bug class as the day-one
   stdin hang). Conflicts translate to doc ids + commands.
4. **Command layer only (gate 3).** The engine never learns git exists; FilesystemBackend
   stays byte-oriented. A git-backed `versions()` adapter remains a separate future
   decision, neither needed nor foreclosed.

## The awareness cursor (ships WITH sync — it is why sync exists)

Awareness = attributed-changes-since-cursor. In the git tier the cursor is a commit SHA and
git IS the change feed: `git diff --name-status <last-seen>..HEAD -- <bundle-path>` mapped
to doc ids + frontmatter actors. Mechanism:

- last-seen SHA per machine in `~/.agentstate/` (untracked, 0600 discipline).
- SessionStart hook: fail-soft fast-forward pull → render "since your last session:
  N docs changed — <actor>: <ids>" in the home view → advance cursor.
- Same derivation feeds the human activity feed (plans/ui-orientation-brief) — one
  primitive, two faces. This is engine gap 2's git-tier implementation; the D1 `seq`
  implementation waits for the live tier.

## Conflict model (honest tier semantics)

One OKF doc = one file → git 3-way merge resolves different-doc concurrency automatically
(the common case). Same-doc concurrent edits = a CAS conflict arriving at sync time instead
of write time; surface doc-granular with resolution guidance. Escalation when write-time
enforcement is actually needed: `serve` as a shared head (e.g. over a tailnet) or the frozen
worker — config changes, not builds. Tiers stack; git stays the durable source of truth.

## Real-time ladder (parked, with wake conditions)

1. Poll faster (ui server / cron pulls 30–60s) — near-free, probably sufficient. Wake: the
   founders actually working simultaneously.
2. Shared enforced head for hot docs/claims — existing machinery. Wake: same-doc collisions
   observed in practice (respect the null hypothesis: canonical's leases sometimes ADDED
   friction).
3. Push/SSE (`changes-since` wire route; Durable Objects on CF) — the only new build. Wake:
   a real live-orchestration workflow that needs sub-second reaction. Note agents are
   pull-shaped; the realistic push consumer is the human UI, covered cheaper by (1).

## Non-goals

No daemon · no auto-commit-per-write (defer; sync batches) · no git submodules/subtrees ·
no embedded git library (system git inherits the user's auth for free — the whole point) ·
no cross-repo multi-bundle orchestration.
