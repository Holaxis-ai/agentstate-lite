---
type: Context Note
title: C2S exact-SHA review — 681e285
actor: codex-c2s-reviewer
timestamp: '2026-08-04T19:23:27.957Z'
---
# Summary

Independent exact-SHA review of C2S at `681e285cd802c885f57a05d3109cf8eeb2fbe70d`: completed with PASS and no findings.

- Reviewer actor: codex-c2s-reviewer
- Base and merge-base: `c5c1876d14c9c7aeffdb0da37b598052f2fd1fa3`

## Goals

Ultimate goal: keep AgentState Lite shared, versioned, conflict-safe Markdown memory dependable for one human and an agent fleet.

Proximate goal: independently verify that the complete rebased C2S change preserves its compatibility contract and that stable MCP launch guidance remains human guidance rather than immutable authorization state. This serves the ultimate goal by preventing release and integration guidance from weakening durable or conflict-safe state boundaries.

## Findings

No findings.

## Contract assessment

- `STABLE_MCP_LAUNCH_GUIDANCE` has one executable source authority in `packages/cli/src/integration-guidance.js`; its declaration, CLI help, generated skill renderer, and release summary all consume that authority.
- The guidance is bounded and generic: use durable PATH command `aslite mcp`, manually replace legacy version-keyed configuration, verify with `aslite version --json`, and make no claim that AgentState Lite discovers or rewrites host MCP configuration.
- The release emitter appends guidance only in rendered Markdown. The retained JSON still serializes `built.receipt`; `buildStageReceipt` and the `aslite.stage-receipt.v2` trust-chain verifier are unchanged from the merged base.
- The rebased original C2S content is equivalent to the previously reviewed pre-rebase implementation except for upstream merged init work. The post-204 integration delta is confined to the shared JS authority/declaration, Markdown rendering, and its tests.
- Runtime JS and TypeScript declaration agree. Package bundling and generated-skill projections resolve the same authority. The release workflow pipes human Markdown to the job summary while persisting the separate receipt JSON artifact.

## Independent empirical evidence

All commands ran from an isolated `git archive` of the exact SHA unless noted.

- Release receipts plus workflow tests: 21/21 passed.
- Seven C2S CLI suites: 93/93 passed.
- CLI package build followed by typecheck: passed.
- Generated npm skill drift check: passed.
- `git diff --check origin/main...681e285`: passed.
- Local test runtime: Node v25.2.1.
- The first bare archive typecheck lacked the build-generated UI asset; after the repository gate order of build then typecheck, it passed. This was a test-fixture prerequisite, not a product failure.

## Reasoned and audited evidence

- Node 20 compatibility is covered by the repository built-CLI smoke job and package engine `>=20`; Node 22 is a full CI gate and the staged receipt emitter is pinned to Node 22.14. The changed ESM JS uses syntax supported by both. These runtimes were audited but not locally exercised in this review.
- The builder integration record for this exact SHA reports focused release, CLI distribution, typecheck, generated-skill, and retained-package verification gates passing. This review independently reproduced the focused behavioral and compiler gates above.

## Workspace integrity

No source files were changed. The pre-existing unrelated modified `CLAUDE.md` was left untouched.
