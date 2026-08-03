---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  Implement P5A: build/pack once candidate, exact-tarball verifier, staged state
  machine, and no-rebuild finalizer.
actor: claude-main-p5a
timestamp: '2026-08-03T21:31:39.217Z'
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
