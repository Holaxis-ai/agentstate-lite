---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  REVIEW FIXES PUSHED on PR #208 at exact SHA
  32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9. Early rejected responses now
  abort/cancel streams with cancellation-unit and live streaming-socket
  regressions; built-help integration matches the new version syntax. Focused
  fix suite 36/36, CLI typecheck, root build, and diff check pass. Resolution
  comment:
  https://github.com/Holaxis-ai/agentstate-lite/pull/208#issuecomment-5195041516.
  Awaiting independent exact-SHA re-review before adversarial QA/full gate.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T17:24:36.982Z'
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
