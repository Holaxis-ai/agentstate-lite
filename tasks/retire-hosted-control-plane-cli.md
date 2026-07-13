---
type: Task
title: Retire hosted identity/admin commands from the default CLI
status: done
priority: '1'
description: >-
  Shipped in PR #46: https://github.com/Holaxis-ai/agentstate-lite/pull/46


  Merge commit: 121751e5dc65423de9c1968e59e622f05fbcc0b7

  Reviewed head: 3da59bdce4526cb513a60bbe17d583e7c26cc7d6


  The default CLI no longer registers or advertises login, join, whoami, invite,
  member, or key, and home/session orientation no longer projects hosted account
  state. The underlying hosted command modules, auth client, credential support,
  RemoteBackend, reference server, Worker, explicit --remote access, serve,
  local UI, local bundles, and git sync remain intact for later extraction or
  composition.


  Independent review approved the amended exact SHA after stale authentication
  guidance was corrected. QA passed the full unpiped npm run check plus built
  CLI, npm tarball, authenticated remote, credential non-mutation, local bundle,
  sync, UI, and standalone-package probes. Bot-owned plugin regeneration remains
  merge automation responsibility.
actor: codex
assignee: codex
timestamp: '2026-07-13T00:15:33.658Z'
---

