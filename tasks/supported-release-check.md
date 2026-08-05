---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  INDEPENDENT RE-REVIEW PASS at exact PR #208 SHA
  32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9. Both prior findings are closed:
  rejected response streams abort/cancel with the original live streaming-503
  counterexample now reporting a closed peer and zero continued
  writes/connections; built-help integration matches the new syntax. Focused
  36/36 and exact-SHA Node 20/22/26 CI pass. Review evidence:
  context-notes/pr-208-exact-sha-rereview-32108c3. Next gate: adversarial
  registry/output/no-write QA.
actor: codex-pr208-rereview
assignee: codex-supported-release-check
timestamp: '2026-08-05T18:01:02.652Z'
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
