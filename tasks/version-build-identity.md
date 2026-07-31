---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T23:46:30.561Z'
---
# Goal

Implement the offline `BuildIdentityV1` authority and exact `aslite version` projections so every running artifact reports one byte-distinguishing identity. This is I1 in the approved Plan and the first enforceable layer of the npm support contract.

# Acceptance

- Exact protocol JSON/TOON envelope; one-line `--version` retained.
- Explicit build flavor/source input at every bundle producer; missing evidence fails closed.
- Runtime file SHA/path/launch evidence and adjacent-manifest drift are honest.
- Home, skill running version, MCP server version, aliases, and package verifier agree.
- Local development and marketplace production/drift workflows retain their documented usability and structural convergence.
- Stale-dist, same-SemVer/different-byte, npx/global ambiguity, plugin/local/npm, missing-evidence, dirty-tree gate, and identity-normalized drift tests pass.

# Gate

Builder → independent exact-SHA Review → dedicated evidence QA → focused agreement/package tests → full repository gate → Brian-owned merge.

# Current review state

PR #183 is open at `d5d2f3f`, but its earlier PR-ready conclusion and zero-finding review/QA claims are superseded. Brian's PR review approved the runtime identity and requested changes in the build/CI/drift surroundings.

F1 and F2 are independently reproduced at the exact PR SHA in an isolated worktree: an untracked file makes the local npm package proof fail through the strict `npm-package` clean-source guard, and `build:plugin-bundle` followed immediately by `check:plugin-bundle` reports false drift after the writer changes ambient provenance. F3/F4 follow from raw commit-sensitive comparison: doc-only commits bump and rewrite the marketplace artifact, while loop safety depends on the current actor/token configuration. F5/F6 are confirmed statically: npm environment inference outranks concrete managed-PATH evidence, and package name is hardcoded while version comes from the manifest.

The whole producer/gate/checker/automation system and invariants were re-modeled before another fix. The proposed repair preserves full runtime identity while: separating local package-contract verification from strict release construction; normalizing only source commit/dirty in marketplace comparison; restoring provenance-only generated output before CI commit detection; making convergence structural again; correcting launch precedence; and sourcing baked package name/version from one manifest read. Independent plan review is in progress. No repair code has been written yet.

[PR review reorientation](../context-notes/version-build-identity-pr183-review-reorientation.md)

[repair plan](../plans/version-build-identity-pr183-review-fixes.md)

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[approved re-review](../context-notes/version-build-identity-code-rereview-677b507.md)

[QA rejection that found entry-path authority](../context-notes/version-build-identity-qa-677b507.md)

[executable-path system model](../context-notes/version-build-identity-executable-path-system-model.md)

[approved review at 723ea52](../context-notes/version-build-identity-code-review-723ea52.md)

[QA pass at 723ea52](../context-notes/version-build-identity-qa-723ea52.md)

[marketplace regeneration system model](../context-notes/version-build-identity-marketplace-regeneration-system-model.md)

[independent regeneration-loop analysis](../context-notes/version-build-identity-marketplace-regeneration-loop-a71866b.md)

[prior final review, now superseded for build/CI surfaces](../context-notes/version-build-identity-final-code-rereview-d5d2f3f.md)

[prior final QA, now superseded for build/CI surfaces](../context-notes/version-build-identity-final-qa-d5d2f3f.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
