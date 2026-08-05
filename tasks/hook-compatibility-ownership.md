---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  STRUCTURAL LEXICAL-ENVELOPE REPAIR COMPLETE, uncommitted. Shared raw-token
  ownership now admits only canonical current writer forms plus the enumerated
  historical whole-token form; empty-quote and partial-quote concatenation are
  rejected across pure and built host paths. Focused suites pass 78/78 and git
  diff --check passes. The attempted full repository gate produced only loopback
  listen EPERM failures because it ran inside a socket-restricted sandbox, then
  was terminated after open handles remained; this is invalid environmental
  evidence, not a code finding. Next dependency: one permitted sequential npm
  run check, then commit/push and fresh exact-SHA whole-language review.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T22:36:49.814Z'
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
