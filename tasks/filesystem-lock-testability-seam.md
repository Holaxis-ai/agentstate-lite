---
type: Task
title: >-
  filesystem-lock: injectable lock-root seam (API design) + the 80-survivor pin
  backlog
status: in_progress
priority: '2'
description: >-
  HANDOFF-READY (suggested owner: the codex line — they built the module in PR
  #77). API-DESIGN FINDING from the core survivor triage (PR #99): the
  unsafe-lock-root refusal cluster (ensurePrivateLockRoot's
  wrong-owner/mode/symlink arms) is UNTESTABLE today because
  filesystemMutationLockRoot derives the root from process-global state — a test
  exercising the refusals must chmod the SHARED per-user namespace and races
  every parallel test. This is the repo's named recurring class: move the
  invariant into an owning primitive — add an injectable lock-root option
  (constructor/opts seam, default unchanged) so refusal arms become
  unit-testable against a scratch root. Then burn down the module's ranked pin
  backlog: 80 remaining A-class survivors, led by the parseOwner leniency chain
  (malformed-owner acceptance arms). Full per-mutant rows: board blob
  artifacts/core-mutation-triage-2026-07-18.jsonl (grep filesystem-lock, class
  A). Context: the module's 154 survivors were calibrated REAL (not attribution
  artifacts); 32 worst already pinned in #99. Constraints: seam is additive-only
  (default behavior byte-identical; the TMPDIR-stability comment's reasoning
  must survive); tier = ordinary (one review); pins follow #99's red-proof
  discipline (mutant applied -> test fails -> restore -> green). CLAIMED
  2026-07-18 by codex after PR #99 merged (d7633e8). Implementing the additive
  lock-root seam, a narrow pure ownership-validation test seam for the otherwise
  unrepresentable foreign-owner arm, and table-driven pins for the ranked
  filesystem-lock survivors. IMPLEMENTED for independent review in PR #100 at
  exact SHA dfe865bc64f11a88f909fe59138005ac43d667fc. The additive
  options.lockRoot seam preserves the default /tmp derivation and rejects roots
  inside portableRoot; pure internal validators make foreign-owner and
  malformed-owner policies deterministic. Scoped Stryker on filesystem-lock.ts:
  275 killed + 5 timed out of 308 (90.91%); 76/80 task-listed A rows detected,
  with four reclassified equivalent (pid type guard subsumed by
  Number.isSafeInteger, timestamp type guard subsumed by Number.isFinite,
  broadened object predicate converges through field validation, rollback force
  flag unobservable under swallowed cleanup failure). Full npm run check passed
  on the exact SHA. Remaining closure: one independent review, then merge and
  mark done.
actor: codex
timestamp: '2026-07-18T14:59:04.303Z'
---
[depends on](core-survivor-triage.md)
