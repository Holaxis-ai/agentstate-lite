---
type: Task
title: Align architecture-review records and discovery
status: in_progress
priority: '2'
description: >-
  Introduce one canonical Review-family model, wrap misfiled verdicts without
  rewriting history, and make completed Reviews discoverable alongside Review
  Requests.
actor: codex-orchestrator
timestamp: '2026-08-08T17:31:41.707Z'
---
# Objective
Once the proposed architecture-review record-alignment plan is accepted, implement it so every review initiative has one canonical Review synthesis, supporting Findings and context remain correctly typed, and humans can discover requests and completed reports from the review surface.

# Plan
[Architecture-review record alignment](../plans/architecture-review-record-alignment.md)

Proposed plan version: `sha256:93b15c755e7e9920350a9092403f4816b3030d15ed3c1411702f9f255fcf5435`.

# Scope
Minimal Review convention; template v1.1 and approval; frozen inventory; CLI and architectural-smell pilots; remaining-family alignment; Review Portfolio discovery; independent review and QA.

# Acceptance criteria
The linked plan’s acceptance criteria are the contract. Existing approved/frozen review bytes must remain unchanged, no private security detail may enter the public bundle, and no finding may create a duplicate remediation task.

[depends on](architecture-review-alignment-taxonomy-audit.md)

[depends on](architecture-review-alignment-provenance-audit.md)

[depends on](architecture-review-alignment-portfolio-audit.md)

[depends on](architecture-review-alignment-qa.md)

# Authorized source expansion

Implementation reached exact View `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`; portability and provenance approve, but the independent security gate found a 32-selector bridge bound and an owning-parser identity-normalization defect. On 2026-08-08 the user explicitly authorized the robust source expansion: bounded View batching plus exact nonblank selector-ID preservation in `packages/view-runtime`, with source tests, independent code review, and QA. Work is tracked by [Repair Review portfolio bridge identity and scale boundaries](review-portfolio-bridge-identity-repair.md). See [the whole-system boundary note](../context-notes/architecture-review-alignment-view-command-system-model.md).

[depends on](review-portfolio-bridge-identity-repair.md)
