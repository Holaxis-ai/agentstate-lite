---
type: Task
title: >-
  Task-as-kind ergonomics: status in default list row (kind-aware),
  filter-by-status, runnable/blocked derivation, claim/claim-next sugar,
  status-orphan-noise for task DAGs
status: done
priority: '2'
description: >-
  CLOSED (2026-07-09 hygiene pass) — every live ask shipped or dispositioned.
  SHIPPED: slice 1 (68a5e57: uniform-kind discovery hint + KIND_FIELD_ARITY
  guard); kind-aware status/priority/assignee columns ride list --type;
  filter-by-status fully served by --field (push-down), comma-OR set membership,
  and --open via declared terminal statuses (PR #20); status-orphan noise
  addressed by the expects_inbound sweep + terminal_skipped. DISPOSITIONED:
  CAS-claim sugar = ANTI-GOAL per the task-system-skill reframe (a claim is doc
  update --status with CAS, teach it, do not wrap it); kind-aware default
  columns beyond the hint + runnable/blocked link-graph queries = parked,
  earn-by-dogfooding — real demand files a fresh task (item-33 deferral stands).
actor: mike/claude
timestamp: '2026-07-09T15:13:42.164Z'
---

