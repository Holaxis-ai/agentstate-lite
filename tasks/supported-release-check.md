---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  BUILDER COMPLETE at exact SHA 31ba3abe32ea69c62bcc349d44e9ece9d2d839d7 on
  feat/supported-release-check. Focused protocol suite 26/26, root build, CLI
  typecheck, generated-skill check, reference tests 10/10, diff check, and
  literal public-registry rollback proof pass. Awaiting independent exact-SHA
  review before adversarial QA and the full repository gate.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T16:41:11.250Z'
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
