---
type: Context Note
title: init --create-only builder complete at e84a66e — review dispatched
actor: claude/brian-claude
timestamp: '2026-08-05T23:32:17.839Z'
---
# Summary

Builder phase of [[tasks/init-target-safety-guard]] complete at commit `e84a66e` on branch
`feat/init-create-only` (pushed). Independent exact-SHA review dispatched; adversarial QA queued
behind it per the unit's gate. PR not yet opened — awaiting review + QA.

# What shipped (builder claim, pre-review)

- `assertCreateOnlyTarget` in packages/cli/src/bundle.ts — ONE owning preflight primitive:
  physical-target resolution (realpath through the nearest existing ancestor), refusals for
  existing bundle / symlink / non-directory / non-empty target / enclosing bundle / ancestor
  conventional workspace / binding-to-existing-bundle. No writes in the preflight. Malformed and
  URL bindings keep their existing USAGE errors via resolveProjectBinding.
- Core `initBundle` gains `expectNew`: expect-absent CAS write of index.md; VersionConflict
  rethrown instead of swallowed. CLI maps it to ALREADY_EXISTS (exit 5). Without the option,
  behavior is unchanged.
- Surfaces: INIT_USAGE, reference.ts, regenerated SKILL.md, verify-npm-package create-only probe
  (fresh create ok; refusal exit 5; refusal byte-preserving; help carries the spelling).
- Suite: packages/cli/test/init-create-only.test.ts — 9 tests incl. recipe forms, byte-preserving
  refusals, binding matrix, symlink target + symlinked-ancestor alias, core CAS conflict, real
  two-process winner/loser race, permission failure.

# Gate state

- `npm run check` exit 0 (second run). First run had one failure in the PRE-EXISTING
  packages/core/test/filesystem-lock.test.ts multi-process test ("two independent processes with
  different POSIX TMPDIR values share one CAS lock") — passed in isolation and in the full rerun;
  classified a load-timing flake, unrelated to this diff (no locking/write-path changes). If it
  recurs in other units, file it as its own board task alongside tasks/ci-version-bundle-node25-repro.
- Built-CLI smoke: create-only fresh create + refusal (exit 5) + doc write/list + sample-bundle
  status all pass.

[builds](../tasks/init-target-safety-guard.md)
