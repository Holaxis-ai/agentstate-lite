---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  CLAIMED by codex-durable-hook on 2026-08-04. Build one durable npm
  hook-install contract: tokenized exact ownership and foreign-config safety
  plus PATH-independent execution under Codex GUI/minimal environments.
  Proximate goal: make npm-installed skill/hook integration reliably reach
  first-session orientation, serving the product goal of installable shared
  agent memory.
actor: codex-durable-hook
timestamp: '2026-08-04T21:54:12.788Z'
---
# Goal

Replace substring hook ownership with one tokenized semantic classifier shared by status, install, deduplication, and uninstall. This is C2H and protects foreign host configuration from accidental mutation.

# Acceptance

- Existing public booleans/command remain; compatibility evidence is additive.
- Every enumerated historical/current generated-compatible form is classified; foreign near-matches survive byte-identically.
- `durable_global` proof refuses real npm-exec/npx cache persistence without writes.
- Install and uninstall converge owned forms across all hosts/scopes and preserve unrelated/malformed/symlinked state per protocol.

# Gate

Builder → independent exact-SHA Review → adversarial install+uninstall byte-preservation QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
