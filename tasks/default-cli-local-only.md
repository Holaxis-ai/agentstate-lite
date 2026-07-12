---
type: Task
title: Make the CLI local-first by default while preserving the explicit HTTP on-ramp
status: todo
priority: '1'
description: >-
  PR 2 of the local-first CLI simplification.


  Behavioral claim: ordinary AgentState use resolves locally by default, while
  an explicit `--remote <url>` remains a functional OSS on-ramp to the future
  hosted service. “Local-first” does not mean closing the wire client.


  Scope:

  - Keep explicit `--remote` and `RemoteBackend` working for bundle commands.

  - Remove or deprecate ambient `AGENTSTATE_LITE_REMOTE` activation so a shell
  environment cannot silently redirect bare commands.

  - Stop URL-valued `.agentstate.json` bindings from silently changing a cloned
  project's default target. A future explicit `cloud connect` flow may introduce
  a separately named, deliberate connection record.

  - Remove `ui --remote` from the default local Page product unless the private
  SaaS interface explicitly chooses to consume it; this proxy is distinct from
  the generic RemoteBackend on-ramp.

  - Reframe top-level help, README, home, and generated skill around local
  bundles + git `sync`; document explicit `--remote` once as an advanced hosted
  connection path without making it the default product story.

  - Keep explicit `--dir`, local discovery, local-path bindings, local `ui`,
  local artifact verbs, and all git `sync` behavior unchanged.

  - Keep core/storage environment-agnostic.


  Evidence:

  - Bare commands remain local even when old ambient configuration is present,
  with a clear migration message rather than silent fallback.

  - Explicit `--remote` still passes real local/reference-server round-trip
  tests and backend parity tests.

  - URL-binding and environment transition behavior is deterministic and
  documented.

  - Local, Page UI, and git-sync regression tests remain green.

  - Generated help/skill lead with the local daily loop while retaining one
  discoverable hosted on-ramp.

  - Builder -> independent reviewer -> QA before merge.


  Non-goals:

  - Do not delete or disable `RemoteBackend`, explicit `--remote`, the wire
  protocol, server, Worker, auth code, credentials, or git `sync`.

  - Do not decide the final SaaS connection UX beyond preserving the explicit
  on-ramp.
actor: codex
timestamp: '2026-07-12T21:09:49.389Z'
---
[depends on](retire-hosted-control-plane-cli.md)
