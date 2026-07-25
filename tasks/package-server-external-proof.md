---
type: Task
title: Prove @agentstate-lite/server as an external packed dependency
status: in_progress
priority: '1'
description: >-
  Implemented in PR #161
  (https://github.com/Holaxis-ai/agentstate-lite/pull/161), commit 549e4ae,
  ready to merge. The test-only proof packs core and server, installs both
  tarballs into a clean scratch project with no monorepo resolution, typechecks
  public imports, and runs a packaged RemoteBackend -> createRouterForBackend ->
  MemoryBackend workflow covering document write/read, CAS conflict, history,
  and binary blobs. It also rejects unintended package files, source imports,
  workspace-package leakage, and symlinked installs. Registered in test:scripts.
  Verification: standalone proof green; deliberate installed-consumer assertion
  reversal failed red as expected and was restored; full local scripts gate
  52/52; exact-SHA node 20 smoke and node 22/26 repository gates all green. No
  runtime, publication, naming/version, hosted code, or test-kit export change.
actor: mike/codex
timestamp: '2026-07-25T04:05:40.827Z'
---
[depends on](package-core-external-proof.md)
