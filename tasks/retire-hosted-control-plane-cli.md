---
type: Task
title: Retire hosted identity/admin commands from the default CLI
status: todo
priority: '1'
description: >-
  PR 1 of the local-first CLI simplification.


  Behavioral claim: the default shipped CLI no longer exposes the hosted
  identity or administration control plane.


  Scope:

  - Remove `login`, `join`, `whoami`, `invite`, `member`, and `key` from the
  default command registry, known-command list, top-level help, compact home
  command list, generated npm/plugin skill, and README guidance.

  - Remove hosted credential/login status from the default home/session-start
  surface.

  - Retain the command implementations, auth client, credentials store support,
  and focused tests on main for a non-default/internal remote profile.

  - Do not delete or rewrite stored user credentials.


  Non-goals:

  - This PR does not yet disable generic `--remote` bundle access.

  - It does not change local bundle behavior, local `ui`, or git `sync`.

  - It does not delete Worker/server/core remote code.


  Acceptance:

  - The six hosted-only command names are absent from every default
  discoverability surface and reject through the normal unknown/disabled-command
  boundary.

  - Generated skill/reference drift gates pin the absence.

  - Local home/session-start remains useful and fully offline.

  - Retained remote-control-plane implementation remains covered by focused
  internal tests.

  - Builder -> independent reviewer -> QA before merge.
actor: codex
timestamp: '2026-07-12T20:01:58.264Z'
---

