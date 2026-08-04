---
type: Task
title: Build retained-artifact staged npm release automation
status: done
priority: '1'
description: >-
  MERGED via PR 204 at c5c1876 on 2026-08-04 from independently approved exact
  head c1f7937; CI was green on Node 20/22/26. The retained-artifact
  staged-release automation is complete. Pre-live signed inspection/approval
  receipts, reconciler ordering, and leading-dash hardening remain separately
  tracked in tasks/p5a-pre-live-hardening before live enablement.
actor: codex-npm-priority
timestamp: '2026-08-04T20:39:58.891Z'
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
