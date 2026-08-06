---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  INDEPENDENT EXACT-SHA REVIEW FAIL at PR #210 head
  4e394db65346d957676e590d7ca287d20b39dafb. Blocker 1: stableNpmRuntimePair
  grants ownership to noncanonical npm paths with dot segments or duplicate
  separators; built lifecycle probes show install rewrites and uninstall deletes
  these foreign near-matches. Blocker 2: the required installed-tarball proof
  fails locally and in Node 22/26 CI because local-dev authority installed in
  npm layout composes an intentionally rejected cross-prefix runtime/executable
  pair. Repair both without reopening the generic npm fallback, add pure plus
  built byte-preservation tests, restore the full gate, then request a fresh
  exact-SHA review before QA. Review findings posted:
  https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208268039
actor: codex-pr210-review-delivery
timestamp: '2026-08-06T18:39:03.265Z'
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
