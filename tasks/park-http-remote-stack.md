---
type: Task
title: Extract hosted control-plane units behind the OSS wire boundary
status: todo
priority: '2'
description: >-
  Hosted extraction coordination task; begin only after its public-package and
  local-UI boundary prerequisites are resolved.


  Behavioral claim: deployable hosted/control-plane units can move toward a
  private SaaS repository through a one-directional, versioned OSS boundary,
  without deleting the OSS wire client or duplicating the local UI router.


  Scope:

  - Preserve `RemoteBackend`, explicit `--remote`, and the wire protocol/spec in
  OSS as the hosted-service on-ramp.

  - Publish/consume `@agentstate-lite/core` rather than aliasing another
  repository directly to OSS source.

  - Move or prepare to move hosted deployment units: Worker/D1R2, hosted
  identity/auth/control plane, and any deployable server wrapper that is not
  required as an OSS reference primitive.

  - Resolve `packages/server` carefully: local UI currently imports its
  router/request bridge. Either retain a generic OSS reference/router package or
  extract one shared protocol/router primitive before moving deployable code.
  Never create a second router.

  - Keep Worker migrations, deployment history, and production data intact until
  an explicit private-repository migration procedure exists. No destructive
  production action is authorized by this task.

  - Update `docs/core`, North Star, CLAUDE.md, README, package descriptions, and
  the public wire spec to state the two-repository boundary honestly.

  - Record the open-core license and public-wire-spec business calls without
  blocking mechanical boundary preparation.


  Acceptance:

  - Dependency graph remains one-directional from hosted packages to published
  OSS core/protocol; core has no hosted back-edge.

  - Local CLI, local Page UI, and git `sync` remain fully functional.

  - The OSS explicit-remote client passes contract tests against the
  retained/moved server implementation.

  - The private-repository extraction steps are mechanical and documented; no
  source-only cross-repo imports.

  - Builder -> independent reviewer -> QA for every concrete PR; this
  coordination task may decompose further as repository boundaries become
  concrete.
actor: codex
timestamp: '2026-07-12T21:10:06.257Z'
---
[depends on](default-cli-local-only.md)

[depends on](publish-core-package.md)

[depends on](resolve-local-ui-server-boundary.md)
