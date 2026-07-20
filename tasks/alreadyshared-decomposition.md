---
type: Task
title: >-
  Decompose alreadyShared (interrupted-establish crash-recovery) —
  behavior-frozen
description: >-
  From a complexity analysis (Mike-shared 2026-07-19), VERIFIED against the code
  this session. alreadyShared
  (packages/cli/src/commands/sync/establish-committed.ts:323-417, ~95 lines) is
  the one function in the tree where branch density genuinely hurts readability
  (~5/10): a nested if(localBranchExists CLEANUP)/else if(marker){deep
  if/else-if ladder}/else that mixes FOUR concerns in one body — state
  detection, marker-provenance classification (contained / lost-race /
  unverifiable / shallow), the one git clear-mutation (createRemovalCommit +
  branch), and record/note assembly. The nested arms handle shallow-repo,
  lost-race, contained-marker, offline, tree-changed, and detached-head cases
  inline, each with a --yes vs !--yes fork. CONTAINED (one file, one narrow
  purpose: crash-recovery of an interrupted committed-establish), so a
  hard-to-follow function, NOT a system-wide god function — hence MILD and
  DEFERRED, not urgent. RISK NOTE: this is interrupted-state recovery code — the
  class where a careless refactor introduces a recovery bug that's hard to test.
  So this is a PARITY-CONTRACT-tier unit: (1) characterize the current arms with
  fixture tests FIRST — {shallow, lost-race, unverifiable-marker, offline,
  tree-changed, detached-head, contained-clear} x {--yes, !--yes} — capturing
  exact emitted records/notes/errors from the PRE-change code; (2) extract by
  responsibility (a marker-provenance classifier returning a typed verdict, a
  state detector, the clear-mutation) so the top-level reads as a flat decision
  over named states; (3) outcomes byte-identical, fixtures as the frozen
  contract. No behavior change. Priority low. Parent:
  roadmap-items/change-surface-simplification (candidate shelf, alongside the
  trigger-gated porcelain decomposition). PAIRED CANDIDATE DECLINED: the same
  analysis flagged docUpdate (update.ts:209-436, ~227 lines) — evaluated and NOT
  filed. Verified it's validation gates + ONE delegated mutateDoc call
  (buildCandidate closure; mutateDoc owns the read-decide-CAS-retry loop), and
  parseDocUpdateArgs (~120 lines) is a cohesive single-purpose grammar walk.
  Long-but-cohesive, not a god function; refactoring it would be churn with no
  demand signal. Recorded so it isn't re-litigated.
actor: mike/claude
status: todo
timestamp: '2026-07-20T01:18:33.426Z'
---
Evaluation discipline: agreed on the one function where branch density measurably hurts (and where readability underwrites correctness confidence in a recovery path); declined the one the analysis itself exonerated. Restraint stance: this ships only if/when it earns a builder — it's shelf, not queue.
