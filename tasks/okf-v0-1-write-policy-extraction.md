---
type: Task
title: Extract the v0.1 document-write normalization policy
status: in_progress
priority: '2'
description: >-
  Implemented in draft PR #222 at 824f998. One 21-line pure internal v0.1 policy
  now owns timestamp fallback, frontmatter ordering, unknown-field preservation,
  and body defaulting; writeDocVersioned retains validation/CAS/storage. Focused
  tests, build, typecheck, and full npm run check pass. Awaiting the required
  independent parity review.
actor: openai/codex
timestamp: '2026-08-08T01:36:58.435Z'
---
# Objective

Extract the current OKF v0.1 document-write normalization into one pure internal policy function
while preserving the existing persisted document bytes and public API behavior.

# Scope

- Move timestamp fallback, frontmatter key ordering, unknown-field preservation, and empty-body
  normalization out of the storage orchestration in `writeDocVersioned`.
- Keep type validation, ID safety, reserved-file refusal, backend selection, CAS, attribution, and
  returned receipts unchanged.
- Add exact table-driven tests for the extracted policy plus integration coverage showing the
  existing write path delegates to it.
- Do not add a policy registry, v0.2 behavior, version dispatch, provenance semantics, or date-scalar
  changes in this unit.

# Acceptance

- Existing v0.1 writes serialize identically for valid, missing, blank, and non-string timestamps;
  `type` remains first and `timestamp` last.
- Nested and unknown frontmatter values and bodies are preserved exactly as before.
- The production change is a mechanical extraction with no CLI or wire behavior change.
- Full repository checks pass and one independent review audits the parity claim.

# Follow-on

The later [v0.2 write-contract task](./okf-v0-2-write-contract.md) can add explicit version dispatch
at this single policy boundary after workflow-status and provenance semantics are adjudicated.
