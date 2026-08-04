---
type: Context Note
title: C2S adversarial QA at cd3d330
actor: codex-c2s-qa
timestamp: '2026-08-04T01:30:39.769Z'
---
# Summary

Verdict: **PASS**. Adversarial QA against exact reviewed SHA `cd3d330a069419b9746bc007d8aedf10666c2c78` found no unexplained discrepancy. C2S may advance to the primary agent's repository/package gate.

## Goals

Ultimate goal: make AgentState Lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet, with operational discipline encoded in the harness.

Proximate goal: independently exercise the C2S owned/unmanaged/legacy/partial/no-write, durable-global, and literal PATH MCP boundaries at the exact reviewed SHA. This serves the ultimate goal by preventing installed instructions, selected executable bytes, and MCP identity from silently diverging or allowing unsafe target mutation.

## Preconditions

- Read `AGENTS.md`, `CLAUDE.md`, the agentstate-lite skill, `docs/core`, `tasks/skill-mcp-compatibility`, section 4 of `designs/version-update-protocols`, the C2S section of `plans/version-string-channel-identity`, the C2S domain model/test matrix/implementation plan, the blocked `0fa253f` review, and the PASS `cd3d330` re-review.
- Initial `git rev-parse HEAD` returned `cd3d330a069419b9746bc007d8aedf10666c2c78`.
- Initial `git status --porcelain=v2 --branch` contained only branch metadata and no worktree entries.

## Exact command evidence

1. `npm run build > /private/tmp/c2s-qa-build-cd3d330.log 2>&1` — exit 0.
2. `AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-concurrency=1 --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/skill-compatibility.test.ts ./packages/cli/test/install-authority.test.ts ./packages/cli/test/skill-command.test.ts ./packages/cli/test/skill-distribution.test.ts ./packages/cli/test/skill-resolver.test.ts ./packages/cli/test/version.test.ts ./packages/cli/test/mcp.test.ts ./packages/cli/test/mcp-stdio.test.ts > /private/tmp/c2s-qa-focused-cd3d330.log 2>&1` — 113 passed, 0 failed.
3. `node --test --test-concurrency=1 --import ./packages/cli/test/ts-loader.mjs /private/tmp/c2s-adversarial-extra-cd3d330.test.mjs > /private/tmp/c2s-qa-extra-cd3d330.log 2>&1` — 6 passed, 0 failed. The harness and every fixture lived under `/private/tmp` or `os.tmpdir()`; it did not edit repository source or tests.
4. `AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-concurrency=1 --test-name-pattern='failed persistent-install authority preflight' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/skill-command.test.ts > /private/tmp/c2s-qa-both-host-refusal.log 2>&1` — 1 selected test passed, 0 failed.
5. `AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-concurrency=1 --test-name-pattern='literal PATH' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/mcp-stdio.test.ts > /private/tmp/c2s-qa-literal-path-mcp.log 2>&1` — 1 selected test passed, 0 failed.
6. `npm run check:skill -w @holaxis/aslite > /private/tmp/c2s-qa-check-skill-cd3d330.log 2>&1` — exit 0.
7. Final `git rev-parse HEAD; git status --short; git status --porcelain=v2 --branch` returned the same exact SHA and only branch metadata: the worktree remained clean.

## Survived attacks

### Owned, legacy, partial, and no-write

- Current Manifest v2 installed into both hosts, reported `current`, reinstalled byte-stably with `changed:false`, uninstalled only manifested assets, preserved a foreign sibling skill, and made the second uninstall idempotent.
- Valid provenance-only changes (`version` and `source_identity`) remained `current` and status was byte-read-only.
- Same-version, self-consistent installed-byte drift with an updated receipt digest reported `stale` with `asset_drift`, then explicit install converged.
- A higher installed compatibility contract reported `newer_contract`; explicit install refused the downgrade and preserved the complete target snapshot. Explicit uninstall remained bounded to managed content.
- Exact legacy ownership reported `legacy_receipt`; refresh changed only the receipt. A union legacy transition with an obsolete survivor and one missing current asset remained owned-stale and converged to exact current v2.
- Wrong package, installer near-match/npx marker, unknown schema, malformed JSON, no manifest, forward traversal, Windows backslash traversal, NUL traversal, duplicate/unsafe paths, and a manifest symlink never established ownership. Install and uninstall left target lstat kinds, modes, symlink targets, and bytes unchanged.
- Foreign extras and debris-looking foreign names caused refusal with exact target preservation.

### Durable-global authority

- The exact supported POSIX global prefix/bin/package layout produced `durable_global`.
- PATH shadow, explicit npm-prefix mismatch, bin outside prefix, PATH miss, broken/unresolved shim, missing/non-absolute prefix, `npm_command=exec`, `npm_lifecycle_event=npx`, and concrete `_npx` cache executable evidence all failed closed as `unknown`.
- The command-level authority refusal ran before either host target changed: a pre-existing Claude sentinel was byte-identical and no Codex target was created.

### MCP

- The repository's literal PATH test launched `aslite mcp`, completed initialize, matched `serverInfo.version` to the same PATH command's `version --json`, and preserved its host-config sentinel.
- The independent harness strengthened this to a PATH containing only symlinked `aslite` and `node`, then preserved both Claude JSON and Codex TOML version-keyed cache-path sentinels byte-for-byte while the initialize/version agreement passed.

## Findings and scope

- Blocking findings: none.
- Non-blocking findings: none.
- Full `npm run check` was intentionally not run; the primary agent owns that final gate per the QA assignment.
- No source, repository test, task status, branch, commit, or tracked worktree state was modified.
