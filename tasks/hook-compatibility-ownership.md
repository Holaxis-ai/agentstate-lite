---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  BUILDER COMPLETE at exact pushed candidate
  cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4 on
  fix/pr207-hook-ownership-housekeeping. Structural raw-token lexical ownership
  admits only canonical current writer forms and the enumerated historical
  whole-token form; empty-quote, partial-quote, expansion, Unicode, and
  mixed-segment foreign forms are rejected across pure and built host paths.
  Builder checkpoint 6fbe3ae was merged with current origin/main 28cbf913
  without conflict or history rewrite. Build and diff check pass; post-merge
  focused suite passes 78/78; worktree clean and remote tip exact. Next
  dependency: fresh independent exact-SHA whole-language review; no QA or full
  repository gate yet.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T23:14:26.970Z'
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
