---
type: Context Note
title: 'Retrospective: aslite prerelease orchestration'
actor: anthropic/claude
timestamp: '2026-07-21T14:04:09.948Z'
---
# Summary

Orchestration retrospective for the aslite npm-prerelease unit (PR #134 + stacked PR2),
recorded for future units of this shape.

- Pattern: Sequential Pipeline backbone (plan -> build -> review+QA in parallel -> fix rounds)
  with Generator-Critic loops; persistent named agents (one builder per PR, one reviewer, one
  QA) reused across rounds — kept context, cut re-orientation cost roughly to zero after
  round 1.
- What worked: plan review BEFORE build caught the two costliest traps (HOOK_MARKER mismatch,
  shared PKG constant) at zero code cost. Review red-probes earned their keep every round —
  including catching a safety test that was not actually red-testable (the mutation survived
  the full suite). QA harness reuse (kept shell fixtures) made re-verification rounds cheap
  and fast. The external review round after PR-open still found 3 real defects my internal
  ladder missed (symlink write-through, member-level validation, path-dependent tests) —
  evidence BOTH layers are earning their place; none of the stages had a zero find-rate.
- What didn't: my internal QA attacked symlinks at the SKILL level in PR2 but nobody attacked
  file symlinks on the HOOK targets in PR1 — the external reviewer found it. Lesson: when a
  primitive (atomicWriteFileSync) is shared across consumers, the attack matrix must run per
  CONSUMER, not per feature that introduced it.
- Next time: seed the QA matrix from the primitive's full consumer list; add "run the suite
  from a marker-free path" to the standard gate for anything whose recognition logic touches
  path substrings.
