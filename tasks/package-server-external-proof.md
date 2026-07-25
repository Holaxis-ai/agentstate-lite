---
type: Task
title: Prove @agentstate-lite/server as an external packed dependency
status: in_progress
priority: '1'
description: >-
  Implemented in draft PR #161
  (https://github.com/Holaxis-ai/agentstate-lite/pull/161), commit 549e4ae. The
  test-only proof packs core and server, installs both tarballs into a clean
  scratch project with no monorepo resolution, typechecks public imports, and
  runs a packaged RemoteBackend -> createRouterForBackend -> MemoryBackend
  workflow covering document write/read, CAS conflict, history, and binary
  blobs. It also rejects unintended package files, source imports,
  workspace-package leakage, and symlinked installs. Registered in test:scripts.
  Verification: standalone proof green; deliberate installed-consumer assertion
  reversal failed red as expected and was restored; full scripts gate 52/52. No
  runtime, publication, naming/version, hosted code, or test-kit export change.
  Exact-SHA CI is running.
actor: mike/codex
timestamp: '2026-07-25T04:01:26.442Z'
---
[depends on](package-core-external-proof.md)
