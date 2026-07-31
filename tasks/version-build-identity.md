---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T21:49:03.807Z'
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

Builder → independent exact-SHA Review → focused agreement/package tests → full repository gate → Brian-owned PR/merge.

# Progress

Implementation is committed at exact SHA `b2caf37`. Identity-focused tests and TypeScript checks pass. Independent exact-SHA code review is in progress; repository/package QA remains intentionally pending until Review approves. The existing marketplace bot actor guard is now explicitly load-bearing because marketplace build identity embeds checkout SHA, and the workflow test pins that invariant.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
