---
type: Context Note
title: 'PR 183 review reorientation: identity versus gates and marketplace convergence'
actor: openai/codex
timestamp: '2026-07-31T23:39:43.667Z'
---
# Summary

PR #183 received a changes-requested review at `d5d2f3f`. The runtime identity is sound, but the surrounding developer gate and marketplace drift/version automation may no longer preserve their previous usability, convergence, and selective-bump properties. Prior review and QA conclusions are superseded for these build/CI surfaces until the findings below are reproduced, modeled, fixed or explicitly decided, reviewed, and retested.

# Ultimate and proximate goals

Ultimate goal: make agentstate-lite a durable, dependable local-first coordination tool whose distributed executables can be identified and supported exactly without degrading the repository workflows that produce and verify them.

Proximate goal: resolve PR #183 review findings by preserving honest runtime/build identity while restoring usable local gates, semantically correct marketplace drift detection, selective plugin versioning, and structurally bounded automation.

# Whole system

## Identity producer

- `packages/cli/scripts/build-bundle.mjs` reads package metadata and Git source facts, then bakes `BuildIdentityV1` into every artifact.
- `npm-package` currently requires an exact commit and `dirty:false`.
- `local-dev` and `marketplace-legacy` accept known dirty evidence.
- Runtime code validates the baked literal, hashes the actual executing file only on the explicit version path, and projects the authority into CLI, home, skill, MCP, and package receipts.

## Developer and release gates

- Root `npm run check` runs `verify:npm-package` after workspace and script tests.
- `verify:npm-package` currently builds an `npm-package` candidate directly from the ambient checkout.
- `prepublishOnly` and future protected release construction need strict clean/exact provenance.
- A local verification gate also needs to run during development, when the worktree is normally dirty or may not be a Git checkout.

## Marketplace producer and drift detector

- `build-plugin-bundle` writes the committed marketplace executable.
- `check-skill-bundle` rebuilds to scratch and byte-compares against the committed executable.
- `ci-version-bundle` regenerates executable, npm skill projection, and references, then bumps both plugin manifests when generated content differs.
- The generated executable now contains commit and dirty facts, so byte differences can represent provenance-only changes rather than shipped behavior/content changes.

## Automation loop

- A human main commit H triggers regeneration.
- The bot builds from H, commits generated output as B, and B necessarily has a different SHA.
- The current actor guard prevents the ordinary GitHub Actions bot from recursively rebuilding B.
- A future PAT or differently named automation actor may retrigger and evade that identity-specific guard.
- Structural convergence should remain true even if trigger-suppression configuration changes.

## Launch classification and package metadata

- `launchEvidence` combines concrete executable/PATH evidence with npm lifecycle hints.
- Suggestive npm-exec evidence must not outrank a concretely resolved managed executable.
- The build currently reads package version from `package.json` but hardcodes package name, creating two authorities for one manifest identity.

# Reported findings to verify

1. F1: one untracked file makes the local root/package proof fail because `npm-package` rejects `dirty:true`; the error lacks cause/remedy and the proof cannot run outside Git.
2. F2: build-plugin-bundle followed by check-plugin-bundle is red because ambient dirty/provenance facts differ; the straight-byte-compare comment is false.
3. F3: exact commit stamping makes the bot treat every main commit, including doc-only changes, as artifact drift and bump/invalidate the plugin cache.
4. F4: loop safety depends on the current actor name/token behavior instead of structural convergence.
5. F5: npm-exec inference may outrank concrete PATH/direct evidence.
6. F6: package name is hardcoded while version comes from the manifest.

# Invariants

- Runtime identity must remain honest and byte-distinguishing for the artifact actually running.
- Protected publication must fail closed unless exact clean source provenance is proven.
- Ordinary local verification must be runnable on an in-progress checkout without pretending that checkout is a publishable candidate.
- Marketplace drift/version decisions should react to shipped content or contract changes, not provenance-only stamp changes.
- The committed marketplace artifact may retain full honest provenance even if drift comparison normalizes designated identity fields.
- Drift normalization must be narrow, schema-aware, cardinality-checked, and fail closed; it must not hide executable code drift.
- Marketplace automation must converge structurally even if workflow actors/tokens change.
- Concrete launch evidence outranks environmental hints.
- Package name and version share one manifest authority.
- Bot-owned marketplace outputs remain outside human PR diffs unless the governing workflow itself requires a reviewed structural migration.

# Diagnostic plan

- Reproduce F1 and F2 at exact PR SHA in an isolated worktree.
- Trace `verify-npm-package`, drift comparison, and bot changed-detection boundaries.
- Test whether normalizing only the validated baked source commit/dirty fields preserves actual code-drift detection and exact runtime identity.
- Challenge the proposed normalization against schema/cardinality failure, same-SemVer/different-code, and loop convergence.
- Verify and address F5/F6 with focused unit tests.
- Route any implementation through independent exact-SHA Review, then adversarial QA, then the full repository gate.

[task](../tasks/version-build-identity.md)

[approved identity protocol](../designs/version-update-protocols.md)

[prior marketplace model](version-build-identity-marketplace-regeneration-system-model.md)

[prior regeneration analysis](version-build-identity-marketplace-regeneration-loop-a71866b.md)
