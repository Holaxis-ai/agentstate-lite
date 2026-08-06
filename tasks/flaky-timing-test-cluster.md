---
type: Task
title: Load-sensitive timing tests erode the full-suite gate signal
status: todo
priority: '2'
actor: claude/brian-claude
timestamp: '2026-08-06T00:06:09.238Z'
---
# Problem

Across the init-target-safety-guard unit's gate runs (builder + two review rounds, 2026-08-05), FOUR distinct timing-sensitive tests flaked exactly once each under full parallel suite load, every one passing in isolation and on rerun:

- packages/core/test/filesystem-lock.test.ts — 'two independent processes with different POSIX TMPDIR values share one CAS lock'
- packages/cli/test/session-start.test.ts — 'local-state swallow (diverged)' and 'session-start time-box: a black-holed remote is abandoned inside the budget' (budget assertion: 'took 7981ms')
- packages/cli/test/serve.test.ts (reviewer's run)
- packages/cli/test/session-start.test.ts — 'zero-at-the-fetch-boundary' (reviewer's run)

Two independent agents hit different members of the cluster in the same day. Each individual dismissal is defensible; the pattern is not — a gate whose failures are routinely explained away stops gating (the ladder-epistemics concern from CLAUDE.md applied to the suite itself).

# Direction

Candidates, not a decision: widen per-test budgets when under test-concurrency load; serialize the multi-process suites; or move wall-clock budget assertions onto injected clocks. Whatever ships should make a full-load pass deterministic rather than raising thresholds blindly.

# Provenance

Filed from the init-create-only unit's builder/review records: [[init-create-only-builder-e84a66e]], [[init-create-only-fix-a438c5f]] (reviewer finding C in round 2 asked for this task explicitly).
