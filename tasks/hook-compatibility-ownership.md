---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  BUILDER REPAIR COMPLETE at exact pushed SHA
  4e394db65346d957676e590d7ca287d20b39dafb, now the head of PR #210:
  https://github.com/Holaxis-ai/agentstate-lite/pull/210. npm-shaped Node
  launches now require stableNpmRuntimePair; the generic absolute-Node path is
  limited to enumerated local-dev and marketplace layouts. The cross-prefix
  reproduction is unmanaged and preserved; source-focused tests pass 17/17, full
  focused suite 81/81, build and diff check pass, and the worktree/remote SHA
  match cleanly. No QA or full repository gate yet. Next dependency: fresh
  independent exact-SHA re-review at 4e394db; PR #210 is not merge-ready until
  review, QA, and final gate pass.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T23:58:01.009Z'
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
