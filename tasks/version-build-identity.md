---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T22:59:59.719Z'
---
# Goal

Implement the offline `BuildIdentityV1` authority and exact `aslite version` projections so every running artifact reports one byte-distinguishing identity. This is I1 in the approved Plan and the first enforceable layer of the npm support contract.

# Acceptance

- Exact protocol JSON/TOON envelope; one-line `--version` retained.
- Explicit build flavor/source input at every bundle producer; missing evidence fails closed.
- Runtime file SHA/path/launch evidence and adjacent-manifest drift are honest.
- Home, skill running version, MCP server version, aliases, and package verifier agree.
- Stale-dist, same-SemVer/different-byte, npx/global ambiguity, plugin/local/npm, and missing-evidence tests pass.

# Gate

Builder → independent exact-SHA Review → dedicated evidence QA → focused agreement/package tests → full repository gate → Brian-owned PR/merge.

# Progress

The implementation reached exact SHA `3579b98` on `feat/version-build-identity`. Earlier exact-SHA Review approved `723ea52` and adversarial QA passed it after the executable-entry authority was corrected. The later full gate exposed two additional gate-level issues rather than runtime identity disagreement: the help-index smoke assertion did not account for the new first Session command, and marketplace regeneration resampled Git dirty state after writing its own tracked outputs.

Per the persistent-problem rule, the full marketplace producer/workflow/checker loop was modeled before the structural fix. Independent QA recommended one transaction-owned source snapshot. `3579b98` now captures commit/dirty evidence once before generation, propagates that exact object through the marketplace producer, reuses it across the convergence proof, and keeps the bot actor guard load-bearing for the new bot commit SHA. The smoke test now pins ordered adjacency, the standalone checker snapshots before preparation, `git diff --check` is clean, the help integration suite passes 8/8, and script/distribution tests pass 65/65 including the complete npm package proof.

Final independent exact-SHA Review of `3579b98` is in progress. Dedicated final QA and the full repository gate remain after approval; the branch has not been pushed and no PR has been opened.

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[approved re-review](../context-notes/version-build-identity-code-rereview-677b507.md)

[QA rejection that found entry-path authority](../context-notes/version-build-identity-qa-677b507.md)

[executable-path system model](../context-notes/version-build-identity-executable-path-system-model.md)

[approved review at 723ea52](../context-notes/version-build-identity-code-review-723ea52.md)

[QA pass at 723ea52](../context-notes/version-build-identity-qa-723ea52.md)

[marketplace regeneration system model](../context-notes/version-build-identity-marketplace-regeneration-system-model.md)

[independent regeneration-loop analysis](../context-notes/version-build-identity-marketplace-regeneration-loop-a71866b.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
