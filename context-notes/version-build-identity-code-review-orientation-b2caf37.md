---
type: Context Note
title: 'Code review orientation: immutable build identity at b2caf37'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T21:50:17.120Z'
---
# Summary

- Exact review target: commit b2caf37, compared only with its parent, with no code edits.
- Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are diagnosable and safely upgradeable.
- Proximate goal: independently verify I1 provides one honest offline identity authority before QA; this serves the ultimate goal by preventing contradictory release identity across CLI, home, skill, MCP, and package surfaces.
- Gate boundary: Review before focused agreement/package QA. Approval requires no blocker or major finding.

# Governing contract

The normative source is designs/version-update-protocols section 1, together with decisions/version-update-contract and plans/version-string-channel-identity I1. Required evidence includes explicit local-dev, npm-package, and marketplace-legacy build inputs; clean npm-package enforcement; immutable baked version/source/channel; lazy actual-runtime SHA and resolved path; fail-closed launch confidence and unknown facts; adjacent-manifest diagnostics only; one-line aliases; exact version envelope; and agreeing home, skill, MCP, and package-verifier projections.

# Review approach

Inspect the exact parent diff in an isolated detached worktree, trace every build caller and projection to one owner, audit test provenance and the marketplace bot convergence invariant, then run only focused empirical samples plus one red probe where feasible. Record blocker, major, and minor findings with file-line evidence. Full repository QA remains downstream of this review.

# Assumptions under test

- Build flavor and source inputs cannot be omitted or inferred silently at a bundle-producing call.
- Runtime launch evidence does not confuse npx PATH injection with durable global installation.
- A stale adjacent package manifest cannot override baked running identity.
- Same SemVer but different executing bytes yields a different complete identity.
- Malformed or unavailable runtime/build facts become null or unknown without fabricated certainty.
- Marketplace identity stamping does not make the bot loop non-convergent.
