---
type: Task
title: Implement the OKF v0.2 write contract after field adjudication
status: todo
priority: '2'
description: >-
  Add version-aware v0.2 mutation semantics and cross-backend proof after the
  workflow-status and provenance policy is decided.
actor: openai/codex
timestamp: '2026-08-08T02:28:30.446Z'
---
# Objective

Implement and prove a version-aware OKF v0.2 write contract after the workflow `status` mapping and
upstream posture are adjudicated.

# Required behavior

- Route v0.2 mutations through the shared mutation boundary.
- Advance `generated.at` on meaningful content changes while keeping v0.1 `timestamp` behavior
  stable.
- Preserve `generated.by` unless explicit valid provenance is supplied; never infer it from a CLI
  actor label.
- Preserve verification history while making current-content trust unambiguous.
- Preserve date-only scalar shapes such as `stale_after` and `sources[].last_modified`.
- Make freshness, recent-document, and filesystem-history consumers prefer `generated.at` for v0.2
  with a v0.1 fallback.
- Apply the adjudicated workflow-status/profile mapping without breaking existing Kind recipes.

# Proof

- Curated v0.1 and v0.2 fixtures.
- Create, read, no-op, mutate, conflict, and final-version-receipt agreement across local, memory,
  and reference-server backends.
- An upstream v0.2 example bundle remains semantically valid after an AgentState mutation.

# Dependency

This task depends on [the upstream producer report](./okf-upstream-producer-report.md) and the local
decision it informs. It is intentionally not a generic parser rewrite.

[depends on](okf-upstream-producer-report.md)

[depends on](okf-v0-1-write-policy-extraction.md)

[depends on](meaningful-change-time-lookup.md)
