---
type: Task
title: Add rollback-aware supported-release check
status: done
priority: '1'
description: >-
  DONE: PR #208 merged on 2026-08-05 at merge commit
  164ba7edb89c31678856020ee794f80530e6c276 from exact gated head
  32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9. Independent re-review, adversarial
  registry/output/no-write QA, GitHub Node 20/22/26 checks, and the final full
  npm run check all passed. Final evidence:
  context-notes/pr-208-final-gate-32108c3.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T19:53:18.824Z'
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
