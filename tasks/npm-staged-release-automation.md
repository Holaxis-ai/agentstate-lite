---
type: Task
title: Build retained-artifact staged npm release automation
status: in_progress
priority: '1'
description: >-
  FIX IN PROGRESS on PR #204 after independent Codex review at 631c39c.
  Ownership transferred from the initial Claude implementation team to
  codex-pr204-fix to close workflow-input injection, fresh-runner/toolchain
  failures, real npm 11.15 stage receipt/download contracts, immutable
  artifact/draft/registry verification, cross-run permissions, pre-P5S disarm,
  and candidate output/source safety. Proximate goal: make the code-only
  retained-artifact release path executable and fail-closed; this serves the
  project goal by preventing ambiguous or unsafe npm releases.
actor: codex-pr204-fix
timestamp: '2026-08-04T00:11:38.334Z'
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
