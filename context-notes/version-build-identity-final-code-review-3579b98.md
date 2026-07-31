---
type: Context Note
title: 'Final code review: source transaction 3579b98 — changes requested'
actor: openai/reviewer
timestamp: '2026-07-31T23:02:22.581Z'
---
# Summary

Verdict: CHANGES_REQUESTED for exact SHA `3579b987e9f893b7b5cc4f3d9f83880e29fe19cb`.

Severity count: 0 blockers, 1 major, 0 minors. No code edits were made during review.

The two findings against `a71866b` are closed, and the marketplace source-snapshot correction is structurally sound and executable. However, the cumulative PR-owned npm skill projection is stale and the repository's mandatory targeted drift gate fails. The branch cannot proceed to QA/full gate until that generated npm artifact is updated.

## Major finding

### M1 — PR-owned npm `SKILL.md` is stale and omits `version`

Location: `packages/cli/SKILL.md:100-107`.

The cumulative source authority `packages/cli/src/reference.ts:197-216` now declares the Session commands in this order:

1. `version [--json]`
2. `session-start [--dir <path>]`
3. hook
4. skill

But `packages/cli/SKILL.md` still starts the Session section at `session-start` and contains no `version [--json]` entry.

Direct gate evidence:

    npm run check:skill -w @holaxis/aslite

exits 1:

    packages/cli/SKILL.md is stale — run node scripts/gen-skill.mjs --target npm to regenerate.

This is not a bot-owned marketplace artifact. Repository policy explicitly keeps the plugin-target SKILL, committed plugin bundle, and paired plugin manifests bot-owned on merge, while the npm-target `packages/cli/SKILL.md` remains PR-generated and `check:skill` is part of the root PR gate. Regenerate only the npm target and commit its resulting diff; do not add the bot-owned plugin SKILL/bundle/manifests.

This is major because the shipped npm skill would omit the new public identity command and the required PR gate deterministically fails.

## Closed prior findings

- Ordered adjacency: `packages/cli/test/help-index-cli-integration.test.ts` now uses one newline-spanning regex scoped to `Session:`, requiring the complete `version` line immediately followed by `session-start`. An independent oracle returned `good=true`, `movedBefore=false`, `intervening=false`.
- EOF whitespace: the extra blank line in `packages/cli/src/commands/version.ts` is removed. `git diff --check origin/main...HEAD` exits 0.

## Marketplace source transaction review

The source-fact ownership repair matches the recorded system model:

- `run({ source = currentSourceFacts() })` samples at function entry before any generator write.
- `run` passes the same object to `regenerateArtifacts(paths, { source })`.
- `regenerateArtifacts` passes it to `buildPluginBundle({ source })`.
- `buildPluginBundle` samples on entry when standalone, then prepares inputs and passes the exact source to `buildCliBundle(..., { artifactChannel: "marketplace-legacy", source })`.
- `check-skill-bundle.mjs` samples before `prepareCliBundleInputs()` and explicitly supplies that snapshot to its scratch build.
- A fixture spy asserts object identity across `run -> regenerate`.
- The real repo-tied two-pass test exercises the complete production chain with one snapshot. Pass one changed artifacts and bumped both manifests once; pass two reported `changed:false` and retained both post-pass-one versions.
- The deterministic real-build proof uses explicit `dirty:true`, produces byte-identical bundles, executes one, and asserts the public identity source remains the exact supplied dirty-true object.
- The workflow actor guard remains exact and tested: `if: github.actor != 'github-actions[bot]'`. This remains load-bearing because source commit H cannot equal the later bot wrapper commit B.
- PR artifact policy is unchanged: the cumulative code diff contains none of the plugin-target SKILL, committed plugin executable, paired plugin manifests, or marketplace JSON. The serialized default-build proof confirmed root `npm run build` leaves `plugins/` and `.claude-plugin/` byte- and mode-identical. Root `check` still excludes the two bot-owned drift gates.

## Passed evidence at exact SHA

All checks used a clean detached worktree at exact `3579b987e9f893b7b5cc4f3d9f83880e29fe19cb`:

- Root `npm run build`: passed.
- Root `npm run typecheck`: passed.
- Focused build-identity/version/MCP/help integration tests: 22/22 passed.
- Serialized `npm run test:scripts`: 65/65 passed, including real regeneration convergence, actor-guard pin, dirty-true proof, and default-build no-write policy.
- `npm run verify:npm-package`: passed for `@holaxis/aslite@0.1.0-pre.2`, 30 files, zero runtime dependencies, both bins, offline workflow.
- Built identity reported exact source commit `3579b987e9f893b7b5cc4f3d9f83880e29fe19cb` with `dirty:false`.
- `git diff --check origin/main...HEAD`: passed.
- Worktree remained free of tracked changes.

Failed evidence:

- `npm run check:skill -w @holaxis/aslite`: failed because the npm-target generated SKILL is stale.

The final full repository gate was deliberately not run; it is reserved until Review and QA approve. Its `check:skill` stage is already proven red here.

## Goal status

Proximate goal: prove that the cumulative I1 branch has one honest, deterministic source-identity transaction and complete agreeing projections.

Progress: the code and marketplace transaction satisfy that model, but the npm skill projection does not yet agree with the command authority. A new exact SHA with only the npm-target regeneration requires focused re-review before QA/full gate.

## References

- [[tasks/version-build-identity]]
- [[plans/version-string-channel-identity]]
- [[context-notes/version-build-identity-code-review-723ea52]]
- [[context-notes/version-build-identity-qa-723ea52]]
- [[context-notes/version-build-identity-final-code-review-a71866b]]
- [[context-notes/version-build-identity-marketplace-regeneration-system-model]]
- [[context-notes/version-build-identity-marketplace-regeneration-loop-a71866b]]
- [[context-notes/version-build-identity-final-review-orientation-3579b98]]
