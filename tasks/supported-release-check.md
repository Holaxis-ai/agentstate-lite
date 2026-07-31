---
type: Task
title: Add rollback-aware supported-release check
status: todo
priority: '1'
description: >-
  Implement U3: read-only exact npm dist-tag comparison and version-pinned
  reconciliation.
actor: openai/codex
timestamp: '2026-07-31T21:26:27.075Z'
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
