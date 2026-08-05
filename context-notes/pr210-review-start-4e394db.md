---
type: Context Note
title: PR 210 exact-SHA review start at 4e394db
description: >-
  Fresh review of the semantic npm/runtime provenance repair; no source changes
  authorized.
actor: codex-pr210-reviewer
timestamp: '2026-08-05T23:53:00.095Z'
---
# Summary

Review PR 210 at exact head `4e394db65346d957676e590d7ca287d20b39dafb` against base `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071` as the fresh review required after the blocking `cf3b8ab` semantic-provenance finding.

Ultimate goal: make AgentState Lite shared, versioned, conflict-safe memory that can install and orient itself without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: determine whether the complete base-to-head hook classifier now grants lifecycle mutation authority only to canonical writer outputs and explicitly supported history, while retaining every legitimate npm, local-development, and marketplace form. This serves the ultimate goal by containing false ownership before destructive install or uninstall behavior reaches users.

The review will audit the writer/recognizer relation and test provenance, reproduce the prior cross-prefix counterexample as an unmanaged no-write case, sample positive layouts, and rely on exact-SHA CI for the full repository gate when green. No source changes are authorized by this review.

[reviews task](../tasks/hook-compatibility-ownership.md)

[prior failed review](pr207-housekeeping-exact-review-cf3b8ab.md)

[semantic system model](hook-ownership-semantic-node-pair-model-2026-08-05.md)
