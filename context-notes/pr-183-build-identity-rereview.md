---
type: Context Note
title: 'Re-review of PR #183 at 0bd2f17 — all findings fixed, approved'
actor: claude/reviewer
timestamp: '2026-08-01T00:39:11.634Z'
---
# Summary

Re-review of PR #183 at exact SHA `0bd2f17` (fix commit `0bd2f17` on top of the reviewed
`d5d2f3f`). All six findings from [[pr-183-build-identity-review]] are fixed. APPROVED.

CI green on the exact SHA: gate (node 22), gate (node 26), built-CLI smoke (node 20).

# Verification performed

Empirical, at `0bd2f17`, on a clean checkout:

- F1 — `touch scratch-untracked-probe.txt && npm run verify:npm-package` now exits 0 (was: hard
  failure). Receipt: `verified local @holaxis/aslite@0.1.0-pre.2 ... dirty=true`. The proof stayed
  runnable AND the identity stayed honest — dirty is reported, not suppressed.
- F2 — `npm run build:plugin-bundle` immediately followed by `npm run check:plugin-bundle` now
  prints "skill bundle is up to date", exit 0 (was: "stale" every time). The write dirties the tree,
  and the comparator absorbs exactly that.
- F3/F4 — `npm run test:scripts`: 71/71 pass, including the new fixture test that a source-only
  regeneration is RESTORED (no bump, no bot commit) and the real-build test proving two real
  esbuild outputs with different commit stamps are byte-different but content-equal.
- F5/F6 — fixed in `launchEvidence` (cache-path evidence first, then PATH/direct certainty, then
  ambient npm env) and in `build-bundle.mjs` (package name read from the manifest, validated).

# Design assessment of the fix

The chosen mechanism is the right one: `bundle-identity-comparison.mjs` normalizes ONLY
`source.commit`/`source.dirty` in the single esbuild-emitted identity assignment, and
`ci-version-bundle.mjs` RESTORES the prior artifact when nothing else changed. That restores
structural loop-safety (the actor guard is a cheap optimization again), un-breaks the local drift
gate, and stops per-merge version bumps — while every shipped artifact keeps its full honest
provenance. Cardinality-checked and fail-closed: duplicate markers or an unrecognized shape throw
rather than silently hiding drift; a marker-less legacy bundle stays raw so the first
identity-bearing artifact is a real migration.

The one coupling worth knowing about — the comparator keys off esbuild's internal
`define_ASLITE_BUILD_IDENTITY_default` symbol name — is pinned by a REAL-build test, so an esbuild
rename fails the PR gate instead of silently reverting to strict byte comparison.

# Residual nits (non-blocking, not defects)

- `build-bundle.mjs` builds the identity literal whose exact shape `bundle-identity-comparison.mjs`
  parses; neither file points at the other. A one-line cross-reference would save a future
  maintainer a confusing "assignment shape is invalid" failure.
- When SKILL.md changes but the bundle only source-drifted, the shipped artifact keeps the older
  commit stamp under a new plugin version. Honest (the SHA identifies the bytes exactly) but worth
  knowing during support triage.
- The strict `npm-package` construction path now runs only at `prepublishOnly`; the build-time
  guard is unit-tested, but no gate exercises the full `--release` journey.

[reviews](../tasks/version-build-identity.md)
