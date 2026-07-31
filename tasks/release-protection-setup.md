---
type: Task
title: Configure and prove release protection prerequisites
status: todo
priority: '1'
description: >-
  Execute P5S: reviewed repository/npm protection configuration before the first
  live release tag.
actor: openai/codex
timestamp: '2026-07-31T21:26:27.946Z'
---
# Goal

Record the external protection/trusted-publisher configuration that must exist before the first live release tag. This is P5S.

# Acceptance

- Reviewed sanitized receipt covers protected main checks/review, immutable `v*`, no-bypass ref-restricted environment, stage-only trusted publisher, both maintainers' 2FA/recovery, and immutable releases.
- Code preflight fails when observable evidence is missing.
- Receipt says the first E7A stage—not configuration save—is the empirical OIDC proof; fallback credential is revoked only after success.

# Gate

Brian/Mike setup → independent release/security receipt Review → observable-setting preflight red/green proof. No live tag before completion.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](npm-staged-release-automation.md)

[depends on](release-protection-bot-bridge.md)
