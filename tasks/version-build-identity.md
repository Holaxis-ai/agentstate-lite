---
type: Task
title: One immutable build/runtime identity authority
status: in_progress
priority: '1'
description: 'Implement I1: exact offline build/runtime identity and agreeing projections.'
actor: openai/codex
timestamp: '2026-07-31T22:18:14.356Z'
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

Review approved `677b507`, but dedicated QA rejected it because a real unbundled launch of `src/index.ts` reported and hashed imported helper `src/invocation.ts`. Per the persistent-problem escalation rule, the full bundled/source executable-resolution system and invariants were modeled before another fix. Exact SHA `723ea52` implements the structural correction: `src/index.ts` explicitly registers its own canonical entry before dispatch, and every existing consumer reads that one path authority. The real QA reproduction now reports and hashes `src/index.ts`; focused identity/MCP/hook tests pass 15/15 and CLI typecheck passes. Exact-SHA Review of `723ea52` is in progress; dedicated QA must rerun after approval.

The existing marketplace bot actor guard remains explicitly load-bearing because marketplace build identity embeds checkout SHA, and the workflow test pins that invariant.

[initial code review](../context-notes/version-build-identity-code-review-b2caf37.md)

[approved re-review](../context-notes/version-build-identity-code-rereview-677b507.md)

[QA rejection](../context-notes/version-build-identity-qa-677b507.md)

[executable-path system model](../context-notes/version-build-identity-executable-path-system-model.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)
