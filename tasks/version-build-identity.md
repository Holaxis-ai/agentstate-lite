---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T23:14:27.569Z'
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

# Outcome

Implementation is PR-ready at exact SHA `d5d2f3f2dd37472f612e5b287f449a1c0b942285` on pushed branch `feat/version-build-identity`. The canonical package version remains `0.1.0-pre.2`.

The CLI now has one baked immutable identity authority and a complete offline `version` envelope. One-line aliases, home/session-start, npm skill, MCP initialize, package verification, runtime path/hash/launch evidence, adjacent-manifest drift, and all explicit build flavors agree. Source execution explicitly registers and hashes `src/index.ts`. Marketplace generation owns one pre-write source snapshot, so honest commit/dirty evidence remains deterministic without weakening the load-bearing bot actor guard. PR-owned `packages/cli/SKILL.md` is current; bot-owned marketplace artifacts and manifests are intentionally absent from the branch diff.

Independent exact-SHA Review approved `d5d2f3f` with 0 blockers, 0 majors, and 0 minors. Dedicated final adversarial QA passed the same SHA with 0 findings: runtime/install matrix, 76/76 focused identity/home/skill/MCP/help tests, 65/65 marketplace/distribution/package script tests, direct npm package proof, honest `dirty:true`, and one-bump-then-no-op regeneration.

The final repository-wide `npm run check` passed on the exact SHA: build, typecheck, all workspace tests, script/distribution tests, npm package verifier (`0.1.0-pre.2`, 30 files, zero runtime dependencies, both bins, offline workflow), npm skill drift, 8 browser tests, and 19 UI/security E2E tests.

Task remains `in_progress` only for Brian-owned PR creation and merge; the implementation/review/QA/gate work is complete.

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[approved re-review](../context-notes/version-build-identity-code-rereview-677b507.md)

[QA rejection that found entry-path authority](../context-notes/version-build-identity-qa-677b507.md)

[executable-path system model](../context-notes/version-build-identity-executable-path-system-model.md)

[approved review at 723ea52](../context-notes/version-build-identity-code-review-723ea52.md)

[QA pass at 723ea52](../context-notes/version-build-identity-qa-723ea52.md)

[marketplace regeneration system model](../context-notes/version-build-identity-marketplace-regeneration-system-model.md)

[independent regeneration-loop analysis](../context-notes/version-build-identity-marketplace-regeneration-loop-a71866b.md)

[final approved review](../context-notes/version-build-identity-final-code-rereview-d5d2f3f.md)

[final QA pass](../context-notes/version-build-identity-final-qa-d5d2f3f.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
