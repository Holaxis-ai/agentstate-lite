---
type: Context Note
title: C2S adversarial QA at 681e285
actor: codex-c2s-qa
timestamp: '2026-08-04T19:29:54.752Z'
---
# Summary

Status: **completed**. Verdict: **PASS** for exact reviewed SHA `681e285cd802c885f57a05d3109cf8eeb2fbe70d`. No unexplained discrepancy was found in the post-PR-204 release-receipt integration or the preserved C2S destructive-boundary contract.

## Goals

Ultimate goal: make AgentState Lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet.

Proximate goal: prove the post-PR-204 human release summary consumes the same stable-MCP guidance authority without contaminating immutable `aslite.stage-receipt.v2` state, while preserving the previously QA-proven C2S destructive-write and literal-PATH MCP boundaries. This serves the ultimate goal by keeping installed instructions, selected executable identity, MCP handshake identity, operator guidance, and release authorization state coherent but correctly separated.

## Discrepancies

`[]`

Blocking findings: none. Non-blocking findings: none.

## Exact execution environment

- Candidate source was extracted with `git archive 681e285cd802c885f57a05d3109cf8eeb2fbe70d` into `/private/tmp/c2s-qa-681e285.xNrdOB`.
- The archive used a symlink to the root `node_modules`; all builds, generated output, and tests ran inside the archive or isolated temp fixtures, never the shared source tree.
- Merged-base comparison used a separate `git archive c5c1876d14c9c7aeffdb0da37b598052f2fd1fa3` at `/private/tmp/c2s-qa-base-c5c1876.q4QyHS`.

## Actual receipt CLI and trust-chain evidence

The real command `node scripts/release-emit-receipt.mjs` was invoked with a complete conforming dry-run fixture: run/artifact/stage/draft identifiers, exact tag/version/source commit, tarball/integrity/manifest facts, two draft assets, and separate `--json-out /private/tmp/c2s-qa-681e285-stage-receipt.json`; stdout was captured independently at `/private/tmp/c2s-qa-681e285-summary.md`. Exit: 0.

- Human Markdown SHA-256: `42064f3329f9673ba21b512296bceeca43a5de4a73653014763de1bdbefb94f0`; 3,048 bytes.
- Retained JSON SHA-256: `c45a713949d33019eec900495f2030c4d56e74257870efb33591528b9b271cc3`; 1,291 bytes.
- Human Markdown contains `## Stable MCP launch` exactly once and ends with the exact shared `STABLE_MCP_LAUNCH_GUIDANCE` bytes.
- Retained JSON remains `aslite.stage-receipt.v2`, with top-level keys exactly `schema`, `state`, `prepared`, `draft`, `stage`. Its serialized bytes contain no `guidance`, configuration/config, path, scan, or rewrite claim.
- The same CLI fixture executed from merged base. Base and candidate retained JSON were byte-for-byte identical with the same SHA-256. Candidate human output was exactly `base.trimEnd() + "\n\n" + sharedGuidance + "\n"`: a 501-byte delta consisting only of two newlines plus the 499-byte authority.
- `scripts/release-receipts.mjs` has the same SHA-256 at base and candidate: `136393270b553b0893516743e00f5522a3598d8c62a7a3717a013889b8d08daa`. `release-receipts.mjs`, `release-state.mjs`, `release-verify-chain.mjs`, and `release-reconcile.mjs` are unchanged from base and contain no stable-MCP/guidance/config-path input.

## One-authority agreement

A `/private/tmp`-only Node test imported the exact shared authority plus `MCP_USAGE`, `VERSION_USAGE`, `renderNpm()`, `renderSkill()`, and the actual release summary.

- Agreement harness: 3/3 passed.
- The exact shared authority appeared once in each of five approved human surfaces: MCP help, version help, npm-generated skill, marketplace-generated skill, and release summary.
- The guidance names no `.claude`, `.codex`, `settings.json`, `mcp.json`, `config.toml`, or platform-specific host config path. Its only `scan`/`rewrite` occurrence is the negative claim: AgentState Lite does not scan or rewrite host MCP configuration.
- Freshly built `./aslite mcp --help` and `./aslite version --help` each contained the exact authority once (2/2 actual-help checks).

## Focused gates and counts

1. `npm run build` — PASS.
2. `npm run typecheck` — PASS after the required root build order.
3. `npm run check:skill -w @holaxis/aslite` — PASS.
4. `node --test --test-concurrency=1 scripts/release-receipts.test.mjs scripts/release-workflow.test.mjs` — 21/21 passed.
5. C2S focused suite over skill compatibility, install authority, skill command, skill distribution, version, MCP unit, and MCP stdio — 93/93 passed.
6. Independent release/authority agreement harness — 3/3 passed.
7. Targeted destructive-boundary rerun — 9/9 passed.
8. Targeted owned-parser/install-authority rerun — 8/8 passed.
9. Targeted literal-PATH MCP rerun — 1/1 passed.

The 9/9, 8/8, and 1/1 runs are selected adversarial reruns of cases also present in the 93-test suite; they are reported separately, not summed as unique coverage. Full `npm run check` was intentionally left to the primary agent.

## Survived boundary attacks

- Higher installed skill contract remained `newer_contract`; install refused downgrade without target mutation.
- Wrong package/installer and unsafe backslash/traversal manifest shapes never established ownership.
- Manifest symlink, target symlink, unmanifested extras, foreign temp/debris lookalikes, and outside-target paths caused refusal while preserving exact target/outside bytes.
- Persistent-install authority refusal occurred before either host changed: the existing host stayed byte-identical and no sibling host target was created.
- Durable-global classifier retained fail-closed rows for PATH shadow, prefix/layout mismatch, npm-exec/npx environment, and concrete `_npx` cache evidence.
- Literal PATH `aslite mcp` completed initialize, matched the same PATH command's `version --json`, and preserved the version-keyed host-config sentinel byte-for-byte.

## Workspace integrity

- Root HEAD remained `681e285cd802c885f57a05d3109cf8eeb2fbe70d`.
- Root `git status --short` remained exactly ` M CLAUDE.md`; `git diff --name-only` reported only `CLAUDE.md`; there were no staged paths.
- The unrelated root `CLAUDE.md` sentinel remained unchanged throughout: SHA-256 `d79ef81665c808102558082c79b02ff7b863d5a77e056ee3c9f693069f907d19`, mode `-rw-r--r--`, size 39,260 bytes, mtime `1785870945`.
- No repository source, tests, commit, branch, PR, or task status was modified.

## Confidence

High. Evidence combines a real receipt CLI execution, exact merged-base byte comparison, unchanged trust-chain authorities, direct one-authority agreement across all approved projections, built CLI help output, focused release/workflow regression, complete C2S focused regression, targeted destructive no-write cases, compiler/build/generation checks, and final workspace sentinels.
