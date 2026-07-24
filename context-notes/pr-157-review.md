---
type: Context Note
title: 'PR #157 exact-SHA review'
actor: codex-pr157-reviewer
timestamp: '2026-07-24T13:54:10.236Z'
---
# Summary

Reviewed PR #157 (`Feat/phase2a name migration`) at exact head
`bf4d0f77ffe64f327e66722a56f2aaf4b25dab8f` against exact base
`2cb9e4aef288660c6eed2fedc9447ba3810deac5`.

Verdict: changes requested. One empirical P2 correctness/data-governance finding remains.

## Finding

`scripts/migrate-legacy-view-names.mjs:240-244,258-259,292-294,338-363` derives
`existingViewConvention` only from a query filtered to `type: Convention`. Therefore an existing
document at `conventions/view` with another type is invisible to the planning scan.

When the bundle also has a Page convention and Page stock:

1. dry-run claims `convention_swapped: "would_create"` and plans deletion of `conventions/page`;
2. the real convention CAS reads the non-convention occupant and correctly refuses to overwrite it,
   returning `convention_swapped: false`;
3. the deletion loop nevertheless deletes `conventions/page`;
4. the receipt has no warning, and the migrated `type: View` stock is left without a View convention.

The replacement must be confirmed present/created before Page-convention deletion, and a
non-convention occupant at `conventions/view` must be detected as a blocker in both dry-run and real
execution.

## Evidence

- Independent exact-head fixture: `conventions/view` as `type: Note`, `conventions/page` governing
  Page, and one Page registration.
- Dry-run result: `would_create`, Page convention scheduled for deletion, no warnings.
- Real result: `convention_swapped: false`, Page convention deleted, no warnings; remaining ids were
  only `conventions/view` and the migrated registration, with the occupant still `type: Note`.
- Committed script suite passed: 45/45.
- Frozen historical convention snapshots were byte-identical to the named repository revisions.
- `git diff --check` passed.
- GitHub CI at the exact head was green on Node 22, Node 26, and the built-CLI Node 20 smoke job.

No source or PR state was changed, and no GitHub review was submitted.

## Goal progress

The proximate goal—prevent an unsafe migration transition from entering the shared local-first
memory system—was achieved by identifying and reproducing the remaining blocker at the exact PR
head. The PR needs the occupied-path regression case and a fix before merge.
