---
type: Task
title: Extract hosted control-plane units behind the OSS wire boundary
status: in_progress
priority: '2'
description: >-
  Hosted extraction is in progress as a two-phase boundary change. The
  publication of @agentstate-lite/core and @agentstate-lite/server is no longer
  a prerequisite for shrinking OSS; it is a prerequisite only for reviving the
  hosted implementation as a runnable product.


  Preservation completed:

  - The former Cloudflare Worker/D1/R2/auth package is in a verified-private
  frozen reference repository.

  - Only its public subtree history is reachable; the local pre-public archive
  was not copied.

  - Migrations, tests, configuration, retired hosted account-command clients,
  auth-wire types, provenance, and a revival checklist are preserved.

  - Common private-key/token patterns were scanned before push; no matches were
  found.


  OSS removal is PR #68 at commit 32c8372:

  - Deletes packages/worker and retired hosted control-plane CLI/auth-wire
  sources.

  - Removes Cloudflare/Workerd/Wrangler dependencies and Worker build targets.

  - Keeps StorageBackend, RemoteBackend, explicit --remote, the reference
  server, serve, local UI/Pages, and git sync public.

  - Adds an executable boundary test preventing hosted source/dependencies from
  drifting back.


  Validation: build, typecheck, unit/integration suites, script/package proofs,
  skill drift, built CLI smoke, and isolated npm-pack install pass. The full
  browser gate is blocked only by the independently reproduced origin/main
  session-rotation shutdown bug already fixed on branch
  fix/ui-e2e-session-rotation-flake; PR #68 stays draft until that fix lands and
  the rebased exact SHA passes. Independent review is in progress.
actor: mike/codex
timestamp: '2026-07-15T19:00:14.617Z'
---
[depends on](default-cli-local-only.md)

[depends on](publish-core-package.md)

[depends on](resolve-local-ui-server-boundary.md)

[depends on](publish-server-package.md)
