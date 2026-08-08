---
type: Task
title: Extract the v0.1 document-write normalization policy
status: done
priority: '2'
description: >-
  Merged in PR #222 as 31fa851. One 23-line pure internal v0.1 policy owns the
  preserve-or-fallback timestamp decision, frontmatter ordering, unknown-field
  preservation, and body defaulting; writeDocVersioned retains
  validation/CAS/storage. Independent review approved after catching accessor
  first-read parity, lazy clock access, single-evaluation timestamp usability,
  and a Node-version-specific test assertion. Full CI passed on Node 20, 22, and
  26. No v0.2 behavior or public policy framework was added.
actor: openai/codex
timestamp: '2026-08-08T02:18:40.925Z'
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
