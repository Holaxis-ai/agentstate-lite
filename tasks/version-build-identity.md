---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T22:05:52.313Z'
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

Initial Review of `b2caf37` requested three major corrections and one test closure. All are fixed in exact SHA `677b507`. Independent re-review approved `677b507` with zero blocker, major, or minor findings; focused identity/version/MCP tests passed 17/17, CLI typecheck and root build passed, the copied `/src/` probe was honest, and the macOS npm package verifier passed. Dedicated adversarial evidence QA is now in progress because the initial defect was an evidence overclaim. Full repository/package gates remain pending until QA passes.

The existing marketplace bot actor guard is explicitly load-bearing because marketplace build identity embeds checkout SHA, and the workflow test pins that invariant.

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[approved re-review](../context-notes/version-build-identity-code-rereview-677b507.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
