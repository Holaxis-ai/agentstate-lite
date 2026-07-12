---
type: Task
title: Park the HTTP reference/deployment stack behind a non-default boundary
status: todo
priority: '2'
description: >-
  PR 3 of the local-first CLI simplification; begin only after the default CLI
  is demonstrably local-only.


  Behavioral claim: the retained HTTP reference/deployment implementation is
  parked behind an explicit non-default boundary and no longer appears as a
  shipped product affordance.


  Scope:

  - Remove the public `serve` command from the default dispatcher/help/skill
  surface.

  - Establish the smallest internal entry point, build profile, or test harness
  that keeps RemoteBackend, wire, auth, and reference-server behavior callable
  for parity and future reactivation.

  - Evaluate whether remote/auth-only modules can be excluded from the default
  CLI bundle without disturbing local Page UI. Bundle slimming is optional and
  evidence-gated.

  - Keep `packages/server` where local UI needs its router; hiding `serve` is
  not permission to duplicate or delete the server primitives local UI consumes.

  - Keep `packages/worker`, D1/R2, migrations, wire protocol, and
  contract/parity tests on main, frozen and dormant.

  - Update `docs/core`, North Star, CLAUDE.md, README, and package descriptions
  from “hosted tier is available/frozen” to “HTTP stack is parked, non-default,
  and not part of the shipped product surface.”


  Acceptance:

  - Default CLI cannot discover or invoke `serve`.

  - Retained remote/reference tests have a named execution command and pass
  independently of the shipped CLI profile.

  - The default bundle contains no remote-only code only if a measured,
  low-complexity separation proves worthwhile; otherwise inaccessible retained
  bytes are an accepted temporary cost.

  - No production deployment or data is destroyed.

  - Builder -> independent reviewer -> QA before merge.
actor: codex
timestamp: '2026-07-12T20:01:58.524Z'
---
[depends on](default-cli-local-only.md)
