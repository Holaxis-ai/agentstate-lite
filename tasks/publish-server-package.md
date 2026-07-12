---
type: Task
title: Publish @agentstate-lite/server as the versioned OSS wire authority
status: todo
priority: '1'
description: >-
  Prerequisite for a private Worker/SaaS repository to consume the retained OSS
  wire authority without source aliases or copying.


  Behavioral claim: `@agentstate-lite/server` becomes a real, versioned,
  externally consumable OSS package after `@agentstate-lite/core` has an
  intentional public contract.


  Scope:

  - Publish the existing Fetch-standard router and Node
  reference-server/adapters as the one OSS wire authority.

  - Depend on a published compatible `@agentstate-lite/core` version rather than
  a workspace wildcard/source alias.

  - Define intentional exports and semver compatibility with the wire protocol.

  - Install a packed artifact into a scratch external project and prove router
  creation plus a representative RemoteBackend round-trip.

  - Keep hosted Worker/auth/deployment code out of this package.


  Acceptance:

  - External install/typecheck/runtime proof with no monorepo resolution.

  - Version compatibility with core and wire contract documented.

  - Local CLI/UI and Worker tests continue consuming the same package authority.

  - Builder -> independent reviewer -> QA before publication.
actor: codex
timestamp: '2026-07-12T22:57:38.817Z'
---
[depends on](publish-core-package.md)
