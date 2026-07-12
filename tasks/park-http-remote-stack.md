---
type: Task
title: Extract hosted control-plane units behind the OSS wire boundary
status: todo
priority: '2'
description: >-
  Hosted extraction coordination task.


  Boundary decision: `packages/server` stays OSS as the shared
  wire/router/reference-server authority. The moveable private unit is
  `packages/worker` plus D1/R2, Cloudflare deployment, identity/auth, and future
  tenancy/billing/admin surfaces.


  Preserve in OSS:

  - `StorageBackend`, RemoteBackend, explicit `--remote`, and the versioned wire
  protocol/spec.

  - `@agentstate-lite/server`, consumed by local UI and the private Worker
  package.

  - Local CLI, Pages, artifact verbs, and the entire git `sync` tier.


  Prerequisites:

  - Publish/version `@agentstate-lite/core`.

  - Publish/version `@agentstate-lite/server` against that core contract.

  - Retire or relocate hosted identity/admin commands from the default everyday
  CLI surface without destroying the future SaaS client path.

  - Define a non-destructive private-repository migration for Worker code,
  migrations, deployment configuration, and production operational history.


  Acceptance:

  - Private Worker repository consumes published OSS packages; no source-only
  cross-repo imports or copied router.

  - Local UI and explicit OSS remote client continue passing real wire
  round-trips.

  - Production deployment/data is not destroyed by extraction.

  - Documentation states the two-repository boundary honestly.


  This coordination task should decompose into small PRs; it does not authorize
  a one-shot repository rewrite.
actor: codex
timestamp: '2026-07-12T22:57:49.306Z'
---
[depends on](default-cli-local-only.md)

[depends on](publish-core-package.md)

[depends on](resolve-local-ui-server-boundary.md)

[depends on](publish-server-package.md)
