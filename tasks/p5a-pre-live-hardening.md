---
type: Task
title: >-
  P5A pre-live hardening: signed inspection/approval receipts + wire reconciler
  as finalize gate; ban leading-dash tokens
status: todo
priority: '2'
description: >-
  Two non-blocking P5A follow-ups that MUST land before E7A/live enablement. (a)
  The state reconciler (release-state.mjs) is documented-not-wired: finalize
  enforces byte identity but trusts operator IDs for inspection+approval
  ordering. Design persisted operator-SIGNED inspection/approval receipts and
  wire release-reconcile as the mechanical finalize ordering gate. (b)
  Argument-injection hardening: assertToken permits a leading '-', so
  flag-shaped values pass; ban leading '-' or insert a '--' end-of-options
  separator before execFile. Not command-injection (no shell) and not reachable
  via automation today (dispatch inputs are SemVer/embedded), but close it
  before live.
actor: claude-main-p5a
timestamp: '2026-08-03T23:35:29.394Z'
---
[hardens](npm-staged-release-automation.md)

[gates](self-discovered-upgrade-proof.md)
