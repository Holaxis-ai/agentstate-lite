---
type: Roadmap Item
title: 'Local-first CLI surface: park the HTTP remote/hosted stack'
status: active
description: >-
  DECIDED 2026-07-12 — the shipped product surface becomes a SINGLE local-first
  tier: local OKF bundles, the local Page UI, and git board sharing through
  `sync`.


  Terminology is load-bearing: “HTTP remote” means `--remote <url>` and the
  hosted/wire control plane. It does NOT mean a git remote. The entire git tier
  remains central: `sync`, the board branch, SessionStart pull, awareness, and
  ordinary git-based collaboration are kept.


  Remove from the default CLI surface:

  - HTTP bundle targeting through `--remote`, `AGENTSTATE_LITE_REMOTE`, and
  URL-valued project bindings.

  - Hosted identity/admin commands: `login`, `join`, `whoami`, `invite`,
  `member`, and `key`.

  - `ui --remote` and the public `serve` command.

  - Hosted/auth state and instructions in home, help, README, and generated
  skill output.


  Keep on main behind a non-default, tested boundary:

  - The `StorageBackend` seam and `RemoteBackend` adapter.

  - `packages/server`, the wire protocol, and their contract/parity tests.

  - `packages/worker`, D1/R2, and the deployed auth/control-plane
  implementation, frozen and dormant.

  - Auth/credential CLI implementation needed by an internal remote-enabled
  profile or future reactivation.


  Keep in the shipped CLI:

  - Local bundle discovery, explicit `--dir`, and local-path `.agentstate.json`
  bindings.

  - `sync` and the entire git-sharing tier.

  - Local `ui --dir` and bundle Pages.

  - Local `promote`, `pull`, `blobs`, and `delete`.

  - The server library code local UI uses internally; hiding the public `serve`
  command does not imply deleting that dependency.


  Architecture rule: one executable CLI capability/profile authority controls
  command registration, help/skill projection, and bundle-target resolution. Do
  not hand-maintain a “hidden” implementation through scattered comments or
  preserve it only on a branch. Default-surface tests must prove hosted
  affordances are absent/disabled, while an internal test path keeps the parked
  implementation callable enough to prevent silent rot.


  This supersedes the earlier removal proposal and the two-tier product framing
  recorded by `tasks/positioning`; those remain historical records. It is a
  scope transition from FROZEN-and-advertised to PARKED-and-not-shipped, not
  code deletion.


  Delivery sequence:

  1. Retire hosted identity/admin commands from the default CLI.

  2. Make the shipped CLI local-only by disabling HTTP bundle targets at one
  capability boundary and cleaning every shipped surface.

  3. Park the HTTP reference/deployment stack behind a non-default test/build
  boundary; slim the shipped bundle only if the separation is cheap and does not
  disturb local UI.
actor: codex
timestamp: '2026-07-12T20:02:08.494Z'
---
[contains](../tasks/deprecate-static-viewer.md)

[decision record](../tasks/positioning.md)

[contains](../tasks/retire-hosted-control-plane-cli.md)

[contains](../tasks/default-cli-local-only.md)

[contains](../tasks/park-http-remote-stack.md)
