---
type: Task
title: >-
  Decompose alreadyShared (interrupted-establish crash-recovery) —
  behavior-frozen
description: >-
  From TWO complexity analyses (Mike-shared 2026-07-19), each VERIFIED against
  the code this session. SCOPE — behavior-frozen decomposition of alreadyShared
  (packages/cli/src/commands/sync/establish-committed.ts:323-417, ~95 lines),
  the one function where branch density genuinely hurts readability (~5/10): a
  nested if(localBranchExists CLEANUP)/else if(marker){deep ladder}/else mixing
  state detection, marker-provenance classification
  (contained/lost-race/unverifiable/shallow), the createRemovalCommit
  clear-mutation, and record/note assembly. Arms: shallow, lost-race,
  unverifiable, offline, tree-changed, detached-head, contained-clear, each x
  {--yes,!--yes}. FOLDED IN (analysis #2 finding 1): its signature is six bare
  positionals (top, inv, mode, yes, fetchOk, stdout) with TWO adjacent booleans
  (yes/fetchOk) — transposable in principle, though VERIFIED only ONE call site
  (establish-committed.ts:282), so latent not active. Convert to an options/deps
  object as part of this same touch (the codebase convention — HomeDeps etc.);
  note establish.ts's similar multi-positional signature as a sibling to convert
  in the same spirit. CONTAINED, MILD, DEFERRED (shelf, not queue) —
  parity-contract tier: (1) characterize every arm with fixtures capturing
  PRE-change emitted records/notes/errors; (2) extract a marker-provenance
  classifier + state detector + the clear-mutation, options-object signature;
  (3) byte-identical outcomes. Parent:
  roadmap-items/change-surface-simplification. --- DECLINED CANDIDATES
  (evaluated, NOT filed, recorded so they aren't re-litigated): (a) docUpdate
  (update.ts:209-436) — long but delegated to mutateDoc + cohesive
  parseDocUpdateArgs; refactoring = churn, no signal. (b) Deep-ish ../../
  relative imports (9 each in doc/update.ts, doc/write.ts) — analysis itself
  calls it 'not pathological'; normal two-level-folder importing, no correctness
  angle; a barrel trades one indirection for another. (c) Wide board-git barrel
  breadth (home.ts/establish.ts import many symbols) — LEGITIMATE coupling (the
  CLI genuinely uses many git primitives); the guarded cost (rename → edit
  import lists) is low-frequency + IDE-rename-assisted; the import boundary is
  clean. At most a watch-item if primitive renames become frequent.
actor: mike/claude
status: todo
timestamp: '2026-07-20T01:22:28.461Z'
---
Evaluation discipline across six flagged smells in two analyses: agreed on the one function where branch density measurably hurts (+ its transposable-boolean signature, folded), declined the four that were cohesive, non-pathological, or legitimate coupling. Restraint stance: ships only if/when it earns a builder.
