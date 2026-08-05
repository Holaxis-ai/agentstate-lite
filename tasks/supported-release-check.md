---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  MERGE READY: PR #208 exact SHA 32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9 passed
  independent re-review, adversarial registry/output/no-write QA with no
  findings, GitHub Node 20/22/26 checks, and the final local full npm run check.
  The first full run had one unrelated load-sensitive session-start timing
  failure; it passed isolated and in the complete rerun, with no source change.
  Final evidence: context-notes/pr-208-final-gate-32108c3. Awaiting Brian-owned
  merge; close this task after the merge receipt.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T19:26:42.254Z'
---
# Goal

Implement rollback-aware `aslite version --check [--tag latest|next]` against the fixed public npm policy without mutation. This is U3.

# Acceptance

- Protocol endpoint, 2s/1MiB/no-redirect/no-retry bounds and exact JSON/state/exit schema.
- Exact dist-tag target controls current/forward/rollback/deprecated/unavailable results and version-pinned command.
- Fake registry covers malformed, hostile, oversized, offline, timeout, tag movement, and deprecation precedence.
- No npm, integration, bundle, or preference mutation; identity remains present on structured unavailable.

# Gate

Builder → independent exact-SHA Review → adversarial registry/output/no-write QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
