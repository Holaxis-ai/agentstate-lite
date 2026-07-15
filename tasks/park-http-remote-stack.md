---
type: Task
title: Extract hosted control-plane units behind the OSS wire boundary
status: in_progress
priority: '2'
description: >-
  Hosted extraction is implemented and ready to merge as a two-phase boundary
  change. Publication of @agentstate-lite/core and @agentstate-lite/server is no
  longer a prerequisite for shrinking OSS; it is a prerequisite only for
  reviving the hosted implementation as a runnable product.


  Preservation completed:

  - The former Cloudflare Worker/D1/R2/auth package is in the verified-private
  frozen repository Holaxis-ai/agentstate-hosted-reference.

  - Only its public subtree history is reachable; the local pre-public archive
  was not copied.

  - Migrations, tests, configuration, retired hosted account-command clients,
  auth-wire types, provenance, and a revival checklist are preserved.

  - Common private-key/token patterns were scanned before push; no matches were
  found.


  OSS removal is ready PR #68 at exact commit 1a919d0:

  - Deletes packages/worker and retired hosted control-plane CLI/auth-wire
  sources.

  - Removes Cloudflare/Workerd/Wrangler dependencies and Worker build targets.

  - Keeps StorageBackend, RemoteBackend, bearer auth, explicit --remote, the
  reference server, serve, local UI/Pages, and git sync public.

  - Adds an executable boundary test preventing hosted source/dependencies from
  drifting back.

  - Independent review found and drove fixes for stale deleted-login guidance
  and an invalid PATH assumption; a focused regression test covers the supported
  AGENTSTATE_LITE_API_KEY and same-invocation recovery path.


  Independent exact-SHA review APPROVED with no remaining findings. Build,
  typecheck, every workspace unit/integration suite, the full UI browser gate
  (14/14), all script/package/boundary proofs (22/22; boundary 3/3), skill
  drift, package dry-run/install smoke, and diff checks pass. Awaiting merge;
  task remains in progress until the public removal lands.
actor: mike/codex
timestamp: '2026-07-15T19:09:36.827Z'
---
[depends on](default-cli-local-only.md)

[depends on](publish-core-package.md)

[depends on](resolve-local-ui-server-boundary.md)

[depends on](publish-server-package.md)
