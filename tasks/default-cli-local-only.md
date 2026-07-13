---
type: Task
title: Make the CLI local-first by default while preserving the explicit HTTP on-ramp
status: in_progress
priority: '1'
description: >-
  PR #47 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/47


  Behavioral result: bare bundle commands resolve only local targets. HTTP is
  activated only by explicit --remote <url>.


  Shipped candidate exact SHA: b83a27ce639393a72c1ba9d7fd842591fd7785ae

  Base: b5a586ff6f580655e17d29b091761dbd299e4769


  Scope:

  - AGENTSTATE_LITE_REMOTE no longer selects a backend; without an explicit
  target it produces actionable migration guidance.

  - URL- and URI-shaped .agentstate.json bindings no longer activate HTTP or
  degrade into local paths; users are directed to explicit --remote.

  - Local-path bindings, conventional discovery, explicit --dir, explicit
  --remote, RemoteBackend, serve, local UI, ui --remote, git sync, server,
  Worker, and credential internals remain.

  - Help, README, CLAUDE.md, and generated npm skill guidance are truthful.


  Review record:

  - Independent review rejected the first candidate because empty explicit
  remote values could fall through to local state and malformed URI bindings
  could be misclassified as paths.

  - Re-review found and closed a one-letter URI versus Windows-drive
  discriminator gap.

  - Independent reviewer approved exact SHA b83a27ce with no remaining findings.


  QA on approved exact SHA:

  - Fresh npm ci and full unpiped npm run check exit 0.

  - CLI 851, core 250, server 5, UI 78, viewer 4, Worker 117, scripts 15,
  Playwright 14/14 first attempt with no flakes.

  - Built adversarial transition/binding matrix, explicit reference-server
  remote, local and remote UI, sync under hostile legacy env, standard smoke,
  documentation truth scans, and standalone npm tarball all passed.

  - Candidate contains no bot-owned plugin artifact or manifest.


  Status remains in progress until PR #47 merges.
actor: codex
timestamp: '2026-07-13T01:21:47.911Z'
---
[depends on](retire-hosted-control-plane-cli.md)
