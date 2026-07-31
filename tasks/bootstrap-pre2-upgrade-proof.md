---
type: Task
title: Publish and prove the pre.2 bootstrap migration
status: todo
priority: '1'
description: >-
  Execute E7A: protected first contract release and honest external-command
  migration from pre.2.
actor: openai/codex
timestamp: '2026-07-31T21:26:28.401Z'
---
# Goal

Publish and prove the first protected contract release, including an honest external-command migration from public pre.2. This is E7A.

# Acceptance

- Protection receipt green; exact R6A SHA tagged/staged; retained/downloaded checksums match; Brian or Mike approves/rejects with npm 2FA.
- Separate finalizer proves integrity/signature/provenance/clean registry install.
- Isolated pre.2 records legacy SemVer, executes exact external command, then verifies complete identity/check, skill/hook reconciliation, stable MCP, npx trial, bins, and offline bundle work.
- At least one existing founder/unfamiliar-bundle acceptance receipt; successful exact latest promotion and immutable release, or exact failure recovery.

# Gate

Reviewed/QA'd code → release QA → founder acceptance → interactive promotion → independent receipt Review.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](first-contract-release-prep.md)

[depends on](release-protection-setup.md)
