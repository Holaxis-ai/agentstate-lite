---
type: Context Note
title: PR 214 independent review approval at a384ae0
actor: codex-pr214-review
timestamp: '2026-08-07T23:20:05.570Z'
---
# Summary

APPROVE PR #214 head `a384ae0262dc5c682d416225b6adb5815e05d839` on current base `e9e4b92d2726e1b8212e5245d5801152887a339e`, with one non-blocking regression-test hardening finding. The present repair is correct: the exact GitHub merge tree builds every current production sibling dist in dependency order and restores the fresh-checkout version-bundle regeneration path.

# Goals

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: independently determine whether the fresh-checkout version-bundle repair restores the bot-owned marketplace regeneration path at the owning build primitive and prevents the dependency-order failure class from recurring. This serves the ultimate goal by keeping the rollback distribution channel reproducible and current without manual artifact intervention.

# Exact integration boundary

- Feature head: `a384ae0262dc5c682d416225b6adb5815e05d839`, one commit above its original base `531c9df8ac7299f662d87862d270c7eb63f7dfab`.
- Current `main`: `e9e4b92d2726e1b8212e5245d5801152887a339e` after PR #213. The branch is three commits behind current main, but merges cleanly.
- GitHub merge ref: `8b39bf99197256b8a963dea3a1b489babe2d2e8e`; tree `f754212239bbeff9f20b4fede4729cf5c975ca0e`.
- A local merge with the same two parents produced the identical tree. The integrated diff is exactly two files: `packages/cli/scripts/embed-ui-assets.mjs` and `scripts/ci-version-bundle.test.mjs`. PR #213's onboarding files remain intact.

# Current behavior audit

- `buildUiDist` now builds core, then view-runtime, then invokes the UI build; the UI lifecycle prebuild builds markdown-renderer. This is the complete current production dependency closure.
- Ordering is load-bearing: view-runtime's TypeScript build consumes core's emitted declarations.
- The three bundle producers still converge through `prepareCliBundleInputs`; the workflow and versioning authority are untouched.
- No bot-owned manifest, committed bundle, generated SKILL, or reference is carried by the PR.
- Current GitHub main has no branch protection or repository ruleset, so the separately tracked direct-main protection bridge is not an immediate operational blocker.

# Finding — non-blocking test hardening

`scripts/ci-version-bundle.test.mjs:64-67` enumerates only `packages/ui`'s `dependencies`. Core is currently under `devDependencies` and is protected by two hardcoded assertions, but the claimed class-level guard does not catch a future production value import from any other workspace devDependency.

Empirical probe: added a production value import from the existing `@agentstate-lite/server` devDependency. The new named coverage test still passed. After removing server's generated dist to reproduce a fresh checkout, `npm run ci:version-bundle` failed resolving `@agentstate-lite/server`. This is the same masked-by-root-build failure shape the PR is intended to prevent.

Recommended follow-up: derive the required workspace set from production value imports, or cover both dependency maps with an explicit allowlist for type-only/test-only devDependencies. While touching the test comment, replace its stale `core/kinds` example with the current runtime import `core/page`.

This is non-blocking because every workspace dist the current UI production build resolves is covered, the exact fresh-checkout current-main merge succeeds, and the hosted repository gate is green.

# Evidence

- Exact current-main merge tree `npm ci`: pass.
- Exact fresh-checkout `npm run ci:version-bundle`: pass; built core → view-runtime → markdown-renderer/UI, embedded five assets, built the MCP App View and committed plugin bundle, synchronized SKILL/references, and computed the expected one-step `1.0.147 -> 1.0.148` catch-up.
- Main at `e9e4b92` reproduces the prior failure exactly: Rollup cannot resolve `@agentstate-lite/view-runtime/action-bridge` because view-runtime dist is absent.
- Required red probe: removing view-runtime from `UI_DIST_PREREQUISITE_WORKSPACES` makes the new named test fail with the intended actionable message; restoring it passes.
- `npm run test:scripts` with an isolated npm cache and external access: 130/130 pass. The earlier local attempt's only two failures were the machine's root-owned default npm cache.
- Hosted current-base PR checks: Node 20 built-CLI smoke, Node 22 gate, Node 26 gate all pass.
- Live workflow history confirms repeated deterministic failures through current main. The PR text's count of 12 is now stale (at least 15 consecutive failed runs are visible), but the catch-up remains one convergent regeneration/version bump.

# Verdict

APPROVE the exact current GitHub merge tree with the non-blocking dependency-class test hardening above. No rebase is required for correctness because the current-main merge result was reviewed directly and hosted checks passed; any head or base change invalidates this verdict.

[program plan](../plans/release-conventions-program.md)
[prior owning-primitive task](../tasks/plugin-regeneration-dependency-order.md)
[protection follow-up](../tasks/release-protection-bot-bridge.md)
