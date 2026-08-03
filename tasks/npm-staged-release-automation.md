---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  BUILT + gate-verified; branch feat/npm-staged-release-automation @ 631c39c
  PUSHED, PR-ready, awaiting Brian's PR/merge (no live release action in this
  unit). Gate: Builder (npm run check exit 0) -> independent release/security
  review (pass-with-caveats) -> adversarial dry-run QA (found + verified-closed
  a HIGH shell-injection vector: execFile+validators, 45 bypass shapes
  rejected). Reconciler documented-not-wired (operator-trust boundary explicit);
  2 pre-live follow-ups tracked in tasks/p5a-pre-live-hardening. No live
  tag/publish path on merge or bare tag push. Records:
  context-notes/review-p5a-release-security,
  context-notes/qa-p5a-release-automation.
actor: claude-main-p5a
timestamp: '2026-08-03T23:35:29.557Z'
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
