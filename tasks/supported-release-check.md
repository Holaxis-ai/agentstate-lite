---
type: Task
title: Add rollback-aware supported-release check
status: in_progress
priority: '1'
description: >-
  ADVERSARIAL QA PASS at exact PR #208 SHA
  32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9 with high confidence and no findings.
  Focused suite 36/36; independent loopback peers closed with zero active
  connections for overflow/timeout/declared-oversize/redirect; exact JSON/TOON
  bytes and exit 0/1/2 passed; recursive
  cwd/HOME/npm/integration/preference/bundle snapshots remained identical.
  Evidence: context-notes/pr-208-adversarial-qa-32108c3. Next gate: full
  repository check at the same SHA.
actor: codex-supported-release-check
assignee: codex-supported-release-check
timestamp: '2026-08-05T19:16:56.528Z'
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
