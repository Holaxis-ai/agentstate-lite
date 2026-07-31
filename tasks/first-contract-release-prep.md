---
type: Task
title: Prepare the first contract-bearing prerelease
status: todo
priority: '1'
description: >-
  Execute R6A source PR for the first compatible identity/update contract
  release.
actor: openai/codex
timestamp: '2026-07-31T21:26:28.180Z'
---
# Goal

Prepare the first compatible contract-bearing prerelease in one reviewed source commit. This is R6A; expected version is `0.1.0-pre.3` unless implementation review finds a breaking contract.

# Acceptance

- Package/lockfile/version and candidate-carried generated skill/help/docs/release notes agree.
- The exact external pre.2 bootstrap command is named honestly; no claim says pre.2 can self-discover.
- No future commit SHA is committed or release side effect performed.

# Gate

Builder → independent exact-SHA contract/provenance Review → exact-candidate dry-run QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](hook-compatibility-ownership.md)

[depends on](skill-mcp-compatibility.md)

[depends on](supported-release-check.md)

[depends on](orientation-update-notice.md)

[depends on](npm-staged-release-automation.md)
