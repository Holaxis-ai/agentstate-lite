---
type: Plan
title: >-
  PR 183 review fixes: preserve identity, restore gate and marketplace
  convergence
actor: openai/codex
timestamp: '2026-07-31T23:45:19.877Z'
---
# Summary

Resolve PR #183 review findings without weakening immutable runtime identity. Separate strict release construction from ordinary local package verification; introduce one narrow, fail-closed marketplace comparison normalizer that ignores only baked source commit/dirty fields; restore provenance-only generated output before CI decides whether to bump; correct launch-evidence precedence; and read package identity from one manifest authority.

# Problem and acceptance

The implementation made runtime identity exact but accidentally coupled developer verification and marketplace content/version decisions to ambient Git provenance. Acceptance requires all of the following:

- `npm run check` and `npm run verify:npm-package` succeed with tracked or untracked in-progress changes and outside Git, while reporting a non-publishable local-dev artifact honestly.
- `prepublishOnly` retains strict `npm-package` construction and rejects unknown/dirty source with an actionable remedy.
- `build:plugin-bundle` followed immediately by `check:plugin-bundle` succeeds even though raw source facts differ.
- Marketplace runtime artifacts keep their complete source identity; only content/drift comparison normalizes commit/dirty.
- A doc-only or provenance-only main change produces no plugin artifact commit or version bump.
- A bot commit retrigger converges structurally even under a PAT or unexpected actor; actor filtering is optimization only.
- Real executable/code, package-version, artifact-channel, skill, or reference changes remain visible and bump exactly once.
- Malformed, missing-after-migration, or multiply occurring identity literals fail closed or compare raw; normalization cannot hide code drift.
- Concrete managed-PATH/direct launch evidence outranks npm environment hints; an actual `_npx` executable path remains `npx-inferred`.
- Baked package name and version come from one validated `package.json` read; runtime parsing can retain a valid renamed package identity.

# Implementation plan

## A. Comparison authority — Builder

Create one shared bundle-comparison primitive under `packages/cli/scripts/`. It recognizes exactly one esbuild-emitted baked identity assignment, normalizes only `source.commit` and `source.dirty`, and returns comparison bytes/status. It rejects duplicate or marker-present-but-malformed assignments. A legacy bundle with no marker remains raw so the first identity-bearing migration is detected.

Tests pin: source-only equality; code/package/channel differences remain unequal; malformed/duplicate fail closed; legacy-to-identity differs.

## B. Marketplace producer/checker/CI — Builder

Use A in `check-skill-bundle.mjs` instead of raw byte equality. Use A in `ci-version-bundle.mjs` for `bundleChanged`. When raw bytes changed but normalized bytes did not, restore the pre-run bundle before returning so `git status` is clean and workflow commit logic cannot publish provenance-only churn.

Update workflow/script comments to make structural convergence authoritative and the actor guard an optimization. Extend fixture and real tests to prove source-only no-op/restoration, no manifest bump, bot-retrigger convergence with a different source snapshot, one real content bump, and no default-build writes.

## C. Local versus release package proof — Builder

Add explicit verifier modes. Root `verify:npm-package` and root `check` use `--local`, build a `local-dev` tarball, and assert local-dev identity. Package `prepublishOnly` uses `--release`, builds `npm-package`, and retains the exact-clean refusal. Unknown/missing mode is usage failure.

Improve strict build errors with observed source state and exact remedy. Tests run the local proof while a temporary untracked file exists and assert it succeeds; focused policy tests assert release mode/channel selection and the strict actionable refusal. Update CLAUDE.md and the CLI README to distinguish local package-contract proof from publishability proof.

## D. Remaining identity correctness — Builder

Reorder launch classification: concrete `_npx` path, then managed PATH/direct evidence, then npm environment inference, then source/layout inference. Add adversarial tests for a global managed bin inside an npm-exec subshell and a true `_npx` path.

Read and validate package name and version once from `packages/cli/package.json` in the builder. Generalize the baked parser/source fallback to preserve a valid manifest-sourced package name while still failing closed on malformed names. Add rename/malformed tests.

# Dependencies and parallelism

- A precedes B.
- C and D are independent of A/B and may be implemented in parallel conceptually, but the primary builder owns all edits to avoid shared-file races.
- All implementation items precede independent Review.
- Review approval precedes adversarial QA.
- QA approval precedes the full repository gate and branch push.

# Review and QA gates

Independent Review checks the cumulative diff at one exact SHA, especially normalizer cardinality/fail-closed behavior, restoration of provenance-only output, strict release/local-mode separation, launch precedence, and package-name authority.

Adversarial QA reproduces the original F1/F2 commands, simulates provenance-only and real-content CI runs, verifies a retrigger under a non-default actor cannot loop, corrupts/duplicates the marker, runs local proof outside/inside Git where practical, runs strict release refusal on dirty/unknown source, and reruns the complete runtime identity/install matrix.

Final gate: focused tests, serialized script/distribution suite, `npm run check` on a deliberately dirty tree and then on the exact clean commit, plugin build/check round trip in isolation, and remote CI checks after push.

[reorientation](../context-notes/version-build-identity-pr183-review-reorientation.md)

[task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)
