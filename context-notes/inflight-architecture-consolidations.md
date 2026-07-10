---
type: Context Note
title: >-
  In flight: sync-establish + mutation-boundary (two architecture
  consolidations)
actor: mike/claude
timestamp: '2026-07-10T03:48:10.771Z'
---
# Summary

Two architecture PRs are being **built right now** (branches `feat/sync-establish` and
`feat/mutation-boundary`). Both are *consolidations* — give a load-bearing invariant one authority so
it can't drift — not rewrites. They follow the [invariant-ownership design](../designs/invariant-ownership-and-change-contracts.md)
(buildlist #1 and #3). **If you touch `sync`/`git.ts` or the core mutation/`doc`/`kind`/`link` paths,
coordinate — don't start work that collides with these branches.**

## #1 — `feat/sync-establish`: a new project can stand up a shared board

Today a fresh `init` + `sync` prints `sync: nothing to sync` and creates nothing; the only board-create
path was the founders-only, being-removed `--migrate`. That is the keystone gap (a new project can't
begin collaborating).

**Product model, locked:** `init` = create a **local** bundle (unchanged, still first-class for solo
use); `sync` = **establish OR join** a shared board; `--migrate` = temporary transition machinery
(coexists, deleted later).

**Key safety decision:** creating a board from nothing requires an explicit **`sync --establish`** flag.
Bare `sync` must NOT auto-establish — solo agents run `sync` reflexively (the taught end-of-session
sync), so auto-establishing would **silently publish a private local bundle to origin**. Combos 2–4
(publish a local-only board / join a remote board / ongoing sync) stay bare `sync`. The `.gitignore`
entry for the folder is an **announced, uncommitted working-tree append** — never a commit to the code
branch (the one deliberate softening of "sync touches only the board"). The README/gen-skill
"commit the folder" reframe rides this PR (deferred here from #32).

## #2 — `feat/mutation-boundary`: one versioned mutation boundary

The read→decide→CAS→retry loop is duplicated across 5 sites (`appendLog`, `regenerateIndex`,
`mutateDoc`×2, `addLink`). Extract to one core primitive (`versionedMutation`) that **re-runs the domain
decision against every attempt's fresh read and CASes with that attempt's version** — the structural
fix that makes stale-decision bugs impossible. This uncovered and fixes **two live defects on main**:

- **Defect A (data loss):** `kind field add/remove` does an UNVERSIONED read-modify-write with no CAS —
  two concurrent field edits silently lose one. Real lost-update bug; fixed by routing through
  `mutateDoc` patch (independent, ships first).
- **Defect B:** `doc write`'s schema-loss and blank-body refusals evaluate a stale upfront peek, not the
  version-matched snapshot. Fixed by moving them into the coupled `buildCandidate`.

`promote`/`delete`/`new` stay single-shot (conflict terminal by design — a retry there would re-commit
stale bytes). Adversarial tests are designed to fail on main first, pass with the fix.

## Locked decisions (were flagged "founder decisions"; all engineering calls, made)
`--establish` flag name; `--replace-links` becomes CAS-coupled (never clobbers under a stale read);
`link add` keeps no kind validation; `kind field` keeps no timestamp refresh; convention parity is a
recipe-vs-fixture contract, not a live board-drift gate.

Path for both: builder → orchestrator review → independent adversarial review → PR (each its own unit).
