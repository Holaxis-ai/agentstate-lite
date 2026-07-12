---
type: Task
title: Retire hosted identity/admin commands from the default CLI
status: in_progress
priority: '1'
description: >-
  PR #46 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/46


  Behavioral result: the default CLI no longer registers or advertises `login`,
  `join`, `whoami`, `invite`, `member`, or `key`. Hosted credential/account
  state is removed from home and SessionStart orientation. The underlying
  command modules, auth client, credential store support, and their direct tests
  remain on main for a future SaaS client/plugin.


  Preserved deliberately:

  - Explicit `--remote` bundle access and `serve`.

  - `AGENTSTATE_LITE_API_KEY` and already-provisioned stored per-origin
  credentials.

  - RemoteBackend, server, Worker, local UI, local bundles, and git `sync`.

  - Stored credential files: home/session neither read, project, rewrite, nor
  delete them.


  Review record:

  - Builder candidate was independently reviewed.

  - First review rejected stale AUTH_REQUIRED guidance that still recommended
  the now-unregistered `login` command and found missing npm-skill replacement
  guidance.

  - Amended exact SHA `3da59bdce4526cb513a60bbe17d583e7c26cc7d6` replaced that
  with supported environment/stored-key guidance through one shared npm/plugin
  skill renderer.

  - Independent rereview approved the amended SHA with no findings.


  QA on the approved exact SHA:

  - Full unpiped `npm run check` exit 0: CLI 845, core 250, server 5, UI 78,
  viewer 4, Worker 117, scripts 15, Playwright 14/14 first attempt.

  - Built CLI and npm tarball contain no retired default command surface.

  - Environment-key and stored-key authenticated remote round-trips passed;
  missing/wrong key errors are actionable without retired commands.

  - Credential FIFO/non-mutation probes, local bundle, sync, UI, and standalone
  package smoke passed.

  - Direct tests for the retained unregistered modules remain green.


  Status remains in progress until PR #46 merges. Bot-owned plugin
  bundle/version regeneration remains merge automation's responsibility.
actor: codex
assignee: codex
timestamp: '2026-07-12T23:28:47.947Z'
---

