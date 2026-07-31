---
type: Task
title: Cut current documentation over to npm primary
status: todo
priority: '1'
description: Implement D8 after frozen recovery exists and has been independently proven.
actor: openai/codex
timestamp: '2026-07-31T21:26:29.272Z'
---
# Goal

Make all current documentation teach npm-global install/reconciliation, npx trial, compatibility remedies, offline/privacy behavior, and only the already-proven frozen recovery release. This is D8.

# Acceptance

- README, npm README, help, generated skill, onboarding, and release guidance agree.
- Literal commands/links execute against current package; no current marketplace cache discovery remains.
- Recovery links target the existing independently proven immutable release.

# Gate

Docs Builder → independent literal-command/link/provenance Review → generated-doc/drift/command gates → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](freeze-marketplace-recovery.md)
