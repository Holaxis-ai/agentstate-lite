---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T22:01:51.237Z'
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

Initial Review of `b2caf37` requested changes: path layout overclaimed source certainty, six standalone build hooks lacked explicit flavor, the macOS package proof compared a noncanonical path, and built MCP handshake agreement lacked a direct assertion. All findings are fixed in exact SHA `677b507`; focused identity/MCP tests and TypeScript checks pass. Exact-SHA re-review is in progress. Because the first finding was an evidence overclaim, dedicated QA is now mandatory after Review approval and before repository/package gates.

The existing marketplace bot actor guard is explicitly load-bearing because marketplace build identity embeds checkout SHA, and the workflow test pins that invariant.

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
