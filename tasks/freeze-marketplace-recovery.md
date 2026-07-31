---
type: Task
title: Freeze and prove final marketplace recovery
status: todo
priority: '1'
description: >-
  Execute F9: immutable downloadable recovery release and independent isolated
  proof.
actor: openai/codex
timestamp: '2026-07-31T21:26:29.053Z'
---
# Goal

Freeze and independently prove the final marketplace state before documentation or deletion relies on it. This is F9.

# Acceptance

- Immutable non-latest `marketplace-recovery-<plugin-version>` release binds exact source/archive/checksum/instructions.
- Independent reviewer retrieves from GitHub rather than the worktree; recovery QA installs/runs it in isolation.
- Brian or Mike confirms it as the final emergency boundary; no updater advances it.

# Gate

Release operation → independent retrieval Review → recovery QA → Brian/Mike confirmation → immutable publication.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](self-discovered-upgrade-proof.md)
