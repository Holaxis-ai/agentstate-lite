---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  CHANGES REQUESTED on PR #204 (codex team review, 7 P1s: GHA template injection
  via ${{ }} interpolation, no-checkout jobs, node20-vs-npm-stage toolchain, npm
  11.15 stage output/download contracts, unenforced provenance chain, missing
  actions:read, and the release-environment auto-creation hole that voids the
  double-gate claim — plus rm-path and dirty:false safety bugs). CODEX TEAM OWNS
  THE FIX ROUND on the open PR. PR description's safety claim corrected. Prior
  internal gate (Builder->review->QA) validated logic but not platform contracts
  — the platform-verification gap is theirs to close. Branch
  feat/npm-staged-release-automation, reviewed head 631c39c.
actor: claude-main-p5a
timestamp: '2026-08-04T00:34:55.585Z'
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
