---
type: Plan
title: >-
  board-git package: extract the git tier behind a BoardChannel seam (branch +
  in-tree modes)
actor: mike/claude
timestamp: '2026-07-15T23:59:00.000Z'
---
# board-git package: extract the git tier behind a BoardChannel seam

**Status: DRAFT v2 — local file, not yet promoted to the board.** v1 authored 2026-07-15 from
a source survey; v2 incorporates an independent design review (approve-with-changes) that
verified claims against the tree. Review deltas are marked ⟲.

## Why

Two goals, one unit of design (delivered as separate PRs):

1. **Boundary**: the git tier is the CLI's largest and highest-risk subsystem (destructive
   writes, migrations — the review-tier escalation class). Extracting it to a workspace
   package makes "core never learns git exists" a mechanical import-direction fact instead
   of a discipline, and gives the risk tier a clean review boundary. The shipped artifact is
   unchanged (esbuild inlines workspace packages, as core/server prove today).
2. **Flexibility**: the shared-board model is structurally hardwired to a dedicated `board`
   branch (linked worktree, `BOARD_BRANCH`/`BOARD_REF` in `git.ts`, worktree-signature
   provisioning, `sync --establish` converting TO branch mode). Product decision
   (2026-07-15): **in-tree mode — the bundle committed with code on the current branch —
   must be a supported option.**

## What exists that makes this feasible (review-verified)

- `git.ts` is a strict porcelain layer: ONE spawn wrapper (`runGit`) enforcing global
  invariants; exported ops are the only vocabulary the commands speak. No stray `'board'`
  literals outside the constants.
- `cursor.ts` is transport-opaque: `{tier, token}` cursors; unknown tiers round-trip.
- ⟲ BUT the seam is thinner than v1 claimed: `SyncCliDeps` is an output-channel seam only;
  `sync()` interleaves git steps with arg parsing, invocation-aware messages, and TOON
  rendering; and the dependency direction is already inverted in two places (`autopull.ts`
  and `commands/session-start.ts` both import engine helpers FROM `commands/sync.ts`).
  **PR A is a re-layering, not a mechanical move**, and is reviewed as such.

## Package design: `packages/board-git`

Private workspace (`@agentstate-lite/board-git`), esbuild-inlined. Publishing is a separate
decision; nothing here depends on it.

**Target module layout** (⟲ named so PR A's ~15 which-side-does-this-land judgment calls are
reviewable against a stated map, not discovered in diff):

| module | contents | from |
|---|---|---|
| `porcelain.ts` | `runGit` + ops; channel constants become `branch`-mode defaults | `git.ts` |
| `cursor.ts` | state store as a FACTORY (`createSyncStore({stateDir, writeAtomic})`) — today's free functions hardcode `credentialsDir`/`writeFileAtomic0600` at module scope, so injection is an API change touching all consumers | `cursor.ts` |
| `diff.ts` | ⟲ ONE consolidated `diffDocsBetween(dir, fromRef, toRef, prefix?)` absorbing `changesSince` AND `commands/sync.ts`'s documented duplicate (`originDocsBetween` + `nameStatusPairs` + `enrichDocChangeAt` — its own comment already asks for this promotion). Prefix-aware: strips the prefix BEFORE `conceptIdFromPath`/`isReservedFile` so `.agentstate-lite/index.md` still reads as reserved | `git.ts` + `commands/sync.ts` |
| `flow.ts` | the sync/establish engine steps, carved from the command bodies | `commands/sync*.ts` |
| `autopull.ts` | the staleness mechanic (branch mode only, see In-tree v1) | `autopull.ts` |
| `channel.ts` | `BoardChannel` detection (PR B) | new |
| `errors.ts` | `BoardGitError` + `classifyGitError` (PR A′, see below) | `cli/errors.ts` |

**Stays in the CLI**: command shells (`parseOrUsage` → ops → TOON render, exit mapping),
autopull call sites in board-reading commands, `home`/`session-start` rendering, and
everything injected via the deps object (bundle-root resolution, `hookInstalled`, actor
resolution, preview limits).

**⟲ Error taxonomy is its own explicit, gated step (the review's top finding).** The tier
today throws AND consumes `CliError` structurally (`ffPull` switches on `err.code`;
provisioning catches `code === "TRANSIENT"`), with exit codes and envelope strings pinned by
`test/error-boundary.test.ts`. So:
- **PR A** keeps importing `CliError` — the import-direction test ships with an explicit
  allowlist of exactly `cli/src/errors.ts`, documented as temporary.
- **PR A′** introduces `BoardGitError` in the package, removes the allowlist entry, and
  ships a **parity table test**: every `BoardGitError` code maps to the identical
  `CliErrorCode`/exit/envelope as before. Guard against the dual-class hazard (cli tests
  resolve workspace packages to built `dist` while the bundle aliases source): detection by
  structural type guard (`isBoardGitError`, name/code marker), never bare `instanceof`.

**⟲ Import-direction test is new machinery**, not the PR #68 lockfile scan: a
source-specifier walk over the package (no `cli/src/*` imports beyond the PR-A allowlist).
The allowlist anticipates the legal reverse edge: the CLI's discovery layer consumes the
package's `BUNDLE_DIR` constant.

## The BoardChannel seam

```ts
type BoardChannel =
  | { mode: "branch"; branch: string; remote: string } // defaults "board"/"origin" — today's behavior
  | { mode: "in-tree" }                                // bundle committed with code on the current branch
  | { mode: "local-only" }                             // present, neither provisioned nor tracked
```

**Detection, not configuration** (the `.agentstate.json` binding stays the one local-only
override). ⟲ Detection is a **local-state classifier that COMPOSES WITH — never replaces —
the provisioning state machine**: it runs AFTER `healStaleRebaseBeforeProvisioning` and the
worktree-repair path, and rule 1 keys on the WEAK structural signature (worktree machinery
owned by this repo's common dir), not `isProvisioned` — a wedged mid-rebase board must
classify as `branch`, or the heal pipeline regresses (this exact misclassification was
fixed over multiple review rounds; do not reintroduce it).

⟲ Full detection matrix (each row a deterministic test):

| local state | remote `origin/board` | channel |
|---|---|---|
| board worktree signature (incl. wedged/stale-pointer → heal/repair first) | any | `branch` |
| no worktree; conventional dir tracked on current branch; HEAD copy == pre-migration snapshot | exists | typed error, **pre-migration-window arm**: "git pull after the migration PR merges, then sync" (today's reviewer-proven guidance — a bare "move it aside" was proven dangerous here) |
| no worktree; conventional dir tracked on current branch | exists (genuinely dual) | typed error, **dual-board arm**: explicit choice guidance |
| no worktree; conventional dir tracked on current branch | absent/unknown | `in-tree` |
| no worktree; dir untracked/gitignored; local `board` branch exists | — | `branch` (join/provision path — `local_board`) |
| no worktree; dir untracked/gitignored | exists | `branch` (JOIN — the most common onboarding state; `sync` provisions) |
| no worktree; dir untracked/gitignored | absent | `local-only` |
| no git repo | — | `local-only` |

v1 scopes in-tree detection to the conventional `.agentstate-lite/` folder, not arbitrary
bound bundle paths.

## In-tree mode semantics: READ-SIDE ONLY (v1)

`sync`'s "touches nothing outside the board" invariant holds by construction in branch mode
(the worktree carries only the bundle, which is what makes `add -A` safe); it cannot survive
a write-side in-tree mode — pushing the current branch publishes code, the exact hazard that
retired the old `board:`-prefix path. Therefore:

- **Awareness**: rides the consolidated `diffDocsBetween` with prefix scoping. Doc ids are
  prefix-stripped; enrichment at the origin ref. ⟲ Attribution needs NO new mechanism —
  per-row actors already come from frontmatter deltas, never commit authors (adjudication F).
- ⟲ **Mode-scoped cursor**: tier `"git-intree"` (vs `"git"`), so a mode flip reads as a
  foreign cursor and takes the existing honest re-anchor path — otherwise a cursor minted in
  one mode survives the flip (`changesSince`'s guard is existence-only) and diffs across
  unrelated trees, reporting every code `.md` as board activity.
- ⟲ **Self-filtering (`selfActors`)**: today recorded only in sync's commit step and
  establish — neither runs in in-tree mode, so your own committed board writes would render
  as teammate activity. Decision: record self actors at the CLI MUTATION layer
  (`mutate.ts`), mode-agnostic. (Also mildly improves branch mode.)
- ⟲ **Backstops scoped**: `countUncommitted` is repo-wide `status --porcelain` and
  `unpushedCount` counts `origin/board..HEAD`; both grow `-- <prefix>` / upstream-ref
  variants for in-tree.
- ⟲ **Upstream selection is a decision table, never a guess**: tracking config
  (`@{upstream}`) if set → compare against it; no upstream, detached HEAD (CI/agent
  worktrees), or upstream on a different remote with no fetch → report nothing, honestly.
  Never assume `origin/<current-branch>`. The fetch itself is cost-neutral (branch mode
  already runs bare `git fetch --prune origin`) and never touches the working tree.
- **Freshness is fetch-and-report, never merge/rebase/checkout**: session-start's time-boxed
  step may fetch and refresh the awareness cache ("N board docs changed upstream — pull to
  get them"). The user's normal code pull is the delivery mechanism.
- ⟲ **No autopull in v1**: autopull's zero-spawn pre-gate (a binding documented invariant —
  it runs on EVERY non-triggering read) keys on the `.git`-FILE worktree signature; an
  in-tree bundle is a plain directory. In-tree awareness refreshes on session-start only;
  extending autopull needs a new fs-only heuristic and is deferred until wanted.
- **Write verbs refuse with guidance**: full `sync` exits structured — "this board rides
  your code branch; share it with your normal commit/push, or `sync --establish` to move it
  to a dedicated board branch." `--pull-only` degrades to fetch-and-report. `--establish`
  remains the one in-tree → branch conversion; its preflight copy treats a committed folder
  as a valid mode, not pre-establish ceremony.
- **`home`/`session-start` copy**: the board block's probe (`boardFirstContactLine`) gates
  on board REFS, which don't exist in-tree — in-tree needs its own probe and first-contact
  copy ("board rides this branch; pull normally").

Non-goals (v1): write-side in-tree sync; per-mode config; engine changes (core stays
git-ignorant; in-tree bundles already read/write fine today — this adds the awareness and
freshness value only).

## Sequencing (one claim per PR)

1. **Prerequisite (queued, not this unit)**: `tasks/sync-migrate-removal` — ~600 lines die;
   `sync-migrate.ts` is also `git.ts`'s heaviest importer. ⟲ Post-prerequisite extraction is
   ~4.4k lines (~23% of the CLI), not 5.0k.
2. **PR A — re-layering** (⟲ relabeled from "mechanical extraction"): create
   `packages/board-git` per the module map; fix the two inverted edges (autopull and
   session-start importing from `commands/sync.ts`); cursor becomes the injected factory;
   `CliError` import allowlisted; import-direction test ships in the same PR. ⟲ Test
   reality: `git-porcelain`/`git-harness`/`cursor` suites (~2.2k lines) move into the
   package; the sync/establish/autopull/session-start/home adversarial suites (~5.1k lines)
   exercise command entry points and STAY in the CLI, above the seam — stated, not hidden.
   Build wiring in the same PR: root `build`/`typecheck` workspace lists, esbuild alias map
   entry in `build-bundle.mjs` (keeps `npm pack` self-contained), package tsc build ordered
   before cli tests (they resolve workspace deps to `dist`). Expect a bot plugin bump on
   merge (bundle contents shuffle) — bot-owned, no PR action. Independent review required.
3. **PR A′ — error taxonomy**: `BoardGitError` + parity table test; allowlist entry removed.
4. **PR B — the BoardChannel seam**: constants → `branch`-mode defaults; detection ships
   with `branch`/`local-only` wired and the full matrix tested; `in-tree` detection returns
   a typed "recognized, not yet supported" state. Behavior unchanged for branch mode.
5. **PR C — in-tree read-side mode**: semantics above; adversarial tests: refusal paths,
   prefix-scoped awareness (incl. reserved-file ids), mode-flip cursor isolation,
   both ambiguity arms, no-upstream/detached degradation, session-start time-box under a
   dead remote. ⟲ Rides the npm-target SKILL.md regen (`SYNC_USAGE` copy changes;
   `check:skill` is PR-side).

## Risks / open questions

- Detection edges beyond the matrix: sparse checkouts, partially-tracked bundle folders,
  hand-deleted worktree with live cursor state. Each lands as a deterministic test with
  explicit guidance, or is named out-of-scope in PR B.
- In-tree self-identity via `mutate.ts` assumes board writes go through the CLI; docs edited
  by hand and committed will still read as teammate activity (accepted; matches the
  product's CLI-first stance).
- Naming: `board-git` (it is the board's git channel, not a generic git library).
