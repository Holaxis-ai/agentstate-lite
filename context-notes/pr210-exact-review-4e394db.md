---
type: Context Note
title: PR 210 exact-SHA review at 4e394db
description: >-
  FAIL: noncanonical npm paths are falsely owned, and the installed-package
  verification gate is broken on Node 22/26.
actor: codex-pr210-reviewer
timestamp: '2026-08-06T00:01:26.721Z'
---
# Summary

Independent review of PR #210 at exact head `4e394db65346d957676e590d7ca287d20b39dafb` against base `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071`.

## Goals

- Ultimate goal: make AgentState Lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.
- Proximate goal: prove that the complete hook writer/recognizer language grants lifecycle mutation authority only to canonical writer outputs or explicitly supported history.

## Verdict

FAIL — two merge blockers remain.

## Finding 1 — noncanonical npm paths are falsely owned

`stableNpmRuntimePair` checks absolute paths, npm suffixes, and equality of the raw prefix slices, but does not require either decoded token to already be in the canonical path form produced by persistent npm authority. Commands containing dot segments or duplicate separators therefore classify as `current` even though `realpath`/normalization means the writer cannot emit them.

Exact-head probe:

`/opt/npm-a/../npm-b/bin/node /opt/npm-a/../npm-b/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start`

The classifier reported `current`; status reported installed/current; install rewrote the command; uninstall removed it. Equivalent `./`, duplicate-separator, and related noncanonical-prefix probes also classified current. This violates the byte-preservation contract for foreign near-matches.

Required repair: require npm runtime and executable path tokens to be canonical normalized forms before granting ownership, and add both pure-classifier and built lifecycle byte-preservation tests for dot segments and duplicate separators.

## Finding 2 — the required installed-package proof is broken

The exact PR checks are red on Node 22 and Node 26. Both fail `scripts/verify-npm-package.test.mjs` in the complete local proof. `npm run verify:npm-package` reproduces the failure locally at the exact head.

The local verification artifact is intentionally channel `local-dev` but installed into an npm layout. Persistent authority permits it as `local_dev`; the composed launch pairs the host Node runtime with the scratch-prefix npm executable. The repaired recognizer correctly rejects that cross-product as unowned, so `hook install` aborts its writer self-check with `RUNTIME` and the installed-tarball proof fails.

Required repair: reconcile the supported local-dev installed-tarball authority/writer contract without reopening the generic npm fallback that caused the original destructive ownership bug, then restore the Node 22/26 gates.

## Evidence

- PR head and remote ref remained `4e394db65346d957676e590d7ca287d20b39dafb` at verdict time.
- Parent red probe at `cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4` classified the original cross-prefix npm counterexample as current.
- Exact-head table confirmed same-prefix npm, local-dev, and marketplace generated forms remain current, while the original cross-prefix npm counterexample is unmanaged.
- `npm run build` passed.
- Focused pure compatibility/reconciliation tests passed.
- Sampled built-CLI writer-agreement and mismatched-pair tests passed.
- `git diff --check` passed.
- Node 20 built-CLI smoke passed; Node 22 and Node 26 full gates failed.

## Next state

Keep the task in progress. Repair both blockers, push a new head, and repeat independent exact-SHA review before adversarial QA and the full repository gate.

[task](../tasks/hook-compatibility-ownership.md)

[review start](pr210-review-start-4e394db.md)
