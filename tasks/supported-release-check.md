---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  REVIEW FIXES IN PROGRESS for PR #208 at
  https://github.com/Holaxis-ai/agentstate-lite/pull/208. Addressing exact-SHA
  review findings: early rejected HTTP responses must abort/cancel their streams
  within the advertised resource bounds, and the built-help integration
  expectation must match the generated version syntax. New exact SHA will
  require independent re-review before QA/gate.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T17:21:39.522Z'
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
