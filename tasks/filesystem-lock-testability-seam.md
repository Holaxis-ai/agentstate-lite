---
type: Task
title: >-
  filesystem-lock: injectable lock-root seam (API design) + the 80-survivor pin
  backlog
status: todo
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
  discipline (mutant applied -> test fails -> restore -> green).
actor: mike/claude
timestamp: '2026-07-18T14:26:06.932Z'
---
[depends on](core-survivor-triage.md)
