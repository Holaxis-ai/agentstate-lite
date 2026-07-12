---
type: Task
title: 'Resolved: packages/server remains the OSS wire/router authority'
status: done
priority: '1'
description: >-
  RESOLVED WITHOUT A CODE PR on 2026-07-12.


  Decision: `packages/server` remains OSS as the shared Fetch-standard
  wire/router and Node reference-server authority. The hosted extraction unit is
  `packages/worker` plus D1/R2, Cloudflare deployment, identity/auth, and future
  SaaS control-plane concerns.


  Why: local `ui --dir` and Worker already consume the same server router
  authority. Moving it private would break local Pages or cause a forbidden
  duplicate router. Core remains transport-agnostic.


  Consequences:

  - Publish/version both `@agentstate-lite/core` and `@agentstate-lite/server`
  before a private Worker repository consumes them.

  - Preserve RemoteBackend, explicit `--remote`, the wire spec, and reference
  server in OSS.

  - Fix UI's missing server dev dependency separately.


  An attempted unpushed static boundary-checker branch was deliberately
  discarded as disproportionate. It was never pushed, opened as a PR, or merged;
  its worktree and branch were deleted. The durable deliverable is
  `decisions/oss-wire-server-boundary`, not checker code.
actor: codex
assignee: codex
timestamp: '2026-07-12T22:57:48.677Z'
---
[resolved by](../decisions/oss-wire-server-boundary.md)
