---
type: Task
title: >-
  GATED: 'aslite view create' — one-command view authoring on the
  artifact-create pattern (needs founders' scope call)
status: blocked
priority: '2'
assignee: ''
description: >-
  SPECIFIED 2026-07-23 via two converged adversarial design reviews — full
  adjudication, ontology, and the six load-bearing conditions (A-F) live in
  designs/view-create; build to THAT, not to this summary.


  WHAT: 'aslite view create <name> --html <file> --bridge <cap>' — promote the
  blob under views/, write the type:View registry doc with entry auto-wired to
  the just-promoted key (structurally eliminating the dangling-entry mismatch),
  validating --bridge via a strict membership predicate EXPORTED FROM CORE next
  to resolveBridgeCapability (condition A: one constant, never a re-typed
  literal). Convention-optional exactly like artifact create; a DECLARED View
  convention remains the authoring authority (condition B). Write contract
  copied from commands/artifact.ts verbatim: blob-first, create-only CAS,
  orphan-naming on failure, collision-safe re-run id (condition E).


  GATE (why status=blocked): the founders' scope call the OKF review flagged —
  each such verb grows core's hardcoded convention-optional product-kind
  vocabulary by name (Artifact shipped it; View would continue it). Deliberate
  decision against docs/core required before building; do not unblock by
  momentum.


  REVIEW TIER: HIGH-RISK (security boundary), per condition C — 'bridge' decides
  bundle-data access, so this is Builder -> independent review -> adversarial
  QA, with the pinned adversarial test that a hand-edited bad bridge still
  fail-closes to none at serve time regardless of what the verb wrote.


  DONE WHEN: the verb exists per designs/view-create conditions A-F, the
  adversarial fail-close pin is in the same reviewed unit as the verb, and the
  test-agent authoring flow (which today takes 3 hand-coordinated commands) is
  one command.


  FRAMING FOR THE GATE DECISION (Brian, 2026-07-23 — the lumper/splitter
  principle): the framework should be lumper-minimalist; bundles/recipes are the
  splitter channel. Extension supports splitting cheaply and reversibly (a
  recipe declares a kind); lumping BACK requires phase-2-style surgery (the live
  Page->View program is the proof: 3 phases to un-split one name with 2 users).
  Therefore the bar for adding a CODE-privileged kind/verb is 'only when a
  mechanism forces it' — View clears it (the renderer must know what it may
  execute: a security boundary, not taxonomy). Weigh whether this verb continues
  the Artifact precedent or whether the ergonomics should ride the
  convention-gated path instead. The framework ships mechanisms; bundles ship
  taxonomies.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T22:29:21.392Z'
---
[designs/view-create](../designs/view-create.md)

[tasks/view-entry-dangling-lint](view-entry-dangling-lint.md)

[depends on](view-bridge-field-rename.md)
