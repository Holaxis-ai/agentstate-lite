---
type: Task
title: Make the CLI local-first by default while preserving the explicit HTTP on-ramp
status: done
priority: '1'
description: >-
  Shipped in PR #47: https://github.com/Holaxis-ai/agentstate-lite/pull/47


  Merge commit: 518a9ed25fd98b5d6a2d07e5be5b7684474fab7a

  Reviewed head: b83a27ce639393a72c1ba9d7fd842591fd7785ae


  Bare bundle commands now resolve only local targets; HTTP activates only
  through explicit --remote <url>. AGENTSTATE_LITE_REMOTE produces actionable
  migration guidance rather than selecting a backend, and URI-shaped
  .agentstate.json bindings no longer activate HTTP or degrade into local paths.
  Local-path bindings, conventional discovery, explicit --dir, explicit
  --remote, RemoteBackend, serve, local UI, ui --remote, git sync, server,
  Worker, and credential internals remain.


  Independent review rejected earlier candidates for empty-flag target fallback
  and URI-versus-filesystem classification gaps. Both were closed and pinned by
  direct and built tests before approval of the exact merged head.


  Fresh isolated QA passed full unpiped npm run check: CLI 851, core 250, server
  5, UI 78, viewer 4, Worker 117, scripts 15, Playwright 14/14 first attempt.
  Adversarial resolution, explicit reference-server remote, local and remote UI,
  sync under hostile legacy env, documentation truth, standard smoke, and
  standalone npm tarball checks passed. No bot-owned plugin artifacts or
  manifests were included; post-merge automation owns regeneration.
actor: codex
timestamp: '2026-07-13T01:27:10.851Z'
---
[depends on](retire-hosted-control-plane-cli.md)
