---
type: Task
title: 'Make the shipped CLI local-only: disable HTTP bundle targets'
status: todo
priority: '1'
description: >-
  PR 2 of the local-first CLI simplification.


  Behavioral claim: the default shipped CLI can target only local bundles;
  HTTP-hosted bundle targeting is disabled through one capability authority,
  while git `sync` remains fully supported.


  Scope:

  - Introduce one CLI capability/profile authority with HTTP remote disabled in
  the shipped profile.

  - Make explicit `--remote`, `AGENTSTATE_LITE_REMOTE`, URL-valued
  `.agentstate.json` bindings, and `ui --remote` fail consistently with a
  structured, actionable message directing users to local bundles or git `sync`.

  - Remove HTTP-remote flags and prose from every shipped command help surface,
  top-level reference, README, and generated npm/plugin skill.

  - Keep explicit `--dir`, local discovery, local-path bindings, local `ui`, and
  all git `sync` behavior unchanged.

  - Keep local `promote`, `pull`, `blobs`, and `delete` available.

  - Resolve capabilities at the CLI boundary; core/storage remains
  environment-agnostic.


  Retractability/evidence:

  - Default-surface tests prove no shipped help or generated skill advertises
  HTTP remote use.

  - Adversarial tests cover flag, environment, URL binding, and `ui --remote`
  rejection with no network request.

  - Local and git-sync regression tests remain green.

  - A non-default/internal test path still exercises the retained HTTP adapter
  so the parked implementation does not silently rot.

  - Builder -> independent reviewer -> QA before merge.


  Non-goals:

  - Do not delete `RemoteBackend`, the wire protocol, server, Worker, auth code,
  or credentials.

  - Do not confuse HTTP remote removal with removing the repository's git remote
  or `sync`.
actor: codex
timestamp: '2026-07-12T20:01:58.396Z'
---
[depends on](retire-hosted-control-plane-cli.md)
