---
type: Task
title: Prove @agentstate-lite/server as an external packed dependency
status: in_progress
priority: '1'
description: >-
  Add one test-only installed-tarball proof that packs core and server, installs
  both into a scratch project with no monorepo resolution, typechecks the public
  imports, and runs a RemoteBackend-to-createRouterForBackend round trip.
  Register it in the standing scripts gate. No publication, version/name change,
  hosted code, or test-kit export.
actor: mike/codex
timestamp: '2026-07-25T03:56:54.911Z'
---
[depends on](package-core-external-proof.md)
