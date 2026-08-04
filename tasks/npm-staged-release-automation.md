---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  PR 204 exact head c1f7937 is OPEN, CLEAN, CI-green, and independently APPROVED
  at the supply-chain tier (context-notes/pr-204-exact-head-approval-c1f7937).
  Three review notes are explicitly non-blocking; leading-dash and
  signed-receipt work stays in tasks/p5a-pre-live-hardening before live
  enablement, not this merge. Status remains in_progress only for Brian-owned
  merge. Do not launch another full review or absorb compaction work unless the
  head changes; then review only the exact delta and affected safety claims.
actor: codex-pr204-scope-auditor
timestamp: '2026-08-04T19:11:51.670Z'
---
# Goal

Create and verify one exact npm candidate, stage it with OIDC, and finalize later from immutable identifiers without rebuilding. This is P5A.

# Acceptance

- Package verifier accepts retained tarball with no build/pack; release candidate builds/packs once after source gates.
- Candidate, draft-preparation, staging, and manual finalizer jobs use separate minimal permissions and exact run/draft/asset/artifact/stage IDs.
- Literal workflow proves tested tarball path is staged and finalization never rebuilds.
- State/mismatch/rerun/reject/rollback/prerelease/stable dry-run matrix and exact interactive commands pass.

# Gate

Builder → independent exact-SHA release/security Review → adversarial workflow QA → full repository/package gate → Brian-owned PR/merge. No live tag/publish in this code unit.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
