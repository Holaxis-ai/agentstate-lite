---
type: Task
title: Make the CLI local-first by default while preserving the explicit HTTP on-ramp
status: in_progress
priority: '1'
description: >-
  PR 2 of the local-first CLI simplification.


  Behavioral claim: bare bundle commands resolve only local targets. Explicit
  --remote <url> remains the sole HTTP activation path and stays fully
  functional.


  Scope:

  - Preserve explicit --remote and RemoteBackend for bundle commands.

  - Remove AGENTSTATE_LITE_REMOTE as an ambient backend selector.

  - Reject URL-valued .agentstate.json bindings with a deterministic migration
  message directing users to explicit --remote; preserve local-path bindings.

  - Update the directly affected help, generated skill/reference text, and tests
  so resolution precedence is explicit and truthful.

  - Keep explicit --dir, local discovery, local-path bindings, local ui,
  artifact verbs, git sync, server, Worker, auth/credential internals, and core
  behavior unchanged.


  Evidence required:

  - A bare command cannot be redirected by AGENTSTATE_LITE_REMOTE.

  - URL bindings fail clearly rather than silently selecting HTTP.

  - Explicit --remote passes a real reference-server round trip.

  - Local discovery and local-path binding regressions stay green.

  - Full Builder -> independent Reviewer -> QA sequence.


  Non-goals:

  - Do not remove ui --remote in this PR; that is a distinct follow-up surface.

  - Do not add a generic profile or extension framework.

  - Do not delete RemoteBackend, the wire protocol, server, Worker, credentials,
  or git sync.
actor: codex
timestamp: '2026-07-13T00:37:09.163Z'
---
[depends on](retire-hosted-control-plane-cli.md)
