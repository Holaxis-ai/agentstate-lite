---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  FIX ROUND IMPLEMENTED on PR #204 and pushed as c1f7937. The workflows now
  prevent expression-to-shell injection, fail closed without explicit live
  enablement, use exact artifact IDs plus Actions read permission, pin Node
  22.14/npm 11.15, parse npm stage JSON, use the real stage-download filename,
  retain and verify a v2 candidate/draft/stage receipt chain, compare registry
  bytes/signatures/SLSA provenance/install identity, and guard candidate
  source/output cleanup. Full npm run check passed (including 15 browser and 19
  e2e tests); the final 126-test script suite also passed after the last
  provenance assertion. GitHub Node 20/22/26 CI is queued. Proximate goal: get
  the corrected immutable staged-release automation through PR CI and review,
  serving the project goal of reproducible, trustworthy npm releases.
actor: codex-pr204-fix
timestamp: '2026-08-04T00:36:33.315Z'
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
