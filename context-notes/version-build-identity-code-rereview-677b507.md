---
type: Context Note
title: 'Independent code re-review: immutable build identity 677b507 — approved'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T22:04:33.879Z'
---
# Summary

**Verdict: APPROVED.** Exact corrected commit `677b5077edfe4e6bf82624a45432fbd4e1689c78` was re-reviewed in the isolated detached worktree `/private/tmp/aslite-build-identity-review.fHPbgz`, both as the repair diff from `b2caf37` and cumulatively from original parent `8b7cefe`. No code was edited. All three prior majors and the prior minor are closed. No new blocker, major, or minor finding was found.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable. Proximate review goal: verify the corrected I1 identity owner is ready for its required dedicated QA. The corrected SHA now meets that Review gate.

# Prior-finding closure

## M1 closed — evidence precedence and inference ceiling

`packages/cli/src/build-identity.ts:216-230` now evaluates npx, PATH, and direct realpath evidence before layout; `.ts`/`src` layout is used only afterward and returns `source/inferred`, never certain. This matches normative protocol section 1.

The adversarial unit at `packages/cli/test/build-identity.test.ts:73-93` pins both source-layout inference and a copied bundle under `src` with stronger direct evidence. A separate real-artifact probe copied exact-677b507 `packages/cli/dist/agentstate-lite.mjs` to `/private/tmp/aslite-launch-rereview.deOLVU/src/copied-bundle.mjs`; `version --json` correctly returned `launch_mode: direct`, `launch_confidence: certain`, and source commit `677b5077edfe4e6bf82624a45432fbd4e1689c78`.

## M2 closed — explicit flavor at every standalone caller

All six prior bootstrap locations now pass `local-dev` explicitly:

- `packages/cli/test/help-index-cli-integration.test.ts:29`
- `packages/cli/test/kind-completing-command-cli-integration.test.ts:36`
- `packages/cli/test/session-start.test.ts:93`
- `packages/cli/test/catalog-cli-integration.test.ts:17`
- `packages/cli/test/doc-cli-integration.test.ts:55`
- `packages/cli/test/local-only-cli-integration.test.ts:19`

A repository-wide search found no remaining no-flavor `build.mjs` caller among CLI tests/scripts. Core bundler call sites remain explicit `local-dev`, `npm-package`, or `marketplace-legacy`.

## M3 closed — canonical macOS package-proof paths

`scripts/verify-npm-package.mjs:310-322` now canonicalizes the installed executable once with `realpath` and compares both runtime `executable_path` and home `bin` against that canonical path. The exact focused command `npm run verify:npm-package` passed on macOS, including the former `/var` versus `/private/var` case, both bin aliases, npm-package flavor, runtime SHA, home/skill/hook/offline package journey, and package allowlist.

## Prior minor closed — built MCP initialize version

`packages/cli/test/mcp-stdio.test.ts:66-68` now asserts `client.getServerVersion()?.version === cliVersion()` immediately after the built CLI handshake. This pins the actual initialize server version rather than only injected command wiring.

# Cumulative regression scan and sampled evidence

- Root exact-SHA build passed.
- CLI exact-SHA typecheck passed.
- Focused identity/version/MCP suite passed 17/17, including built stdio.
- Focused installed-tarball package proof passed: 30 files, zero runtime dependencies, both bins, offline workflow.
- Real copied-bundle-under-src adversarial probe passed.
- `git diff --check` found no repair whitespace error.
- The detached worktree had no tracked modification.
- The repair changes only the four reviewed boundaries and their tests; cumulative inspection found no new unowned version projection, build flavor ambiguity, fail-open source fact, marketplace loop change, or schema drift.
- Full repository QA was intentionally not run because this stage is Review, not QA.

# Gate disposition

Review approves exact `677b507` with zero blocker/major. Dedicated QA is mandatory next under the I1 Plan because the first review found launch evidence upgraded beyond what could be proven. QA should target real launch/path ambiguity and package projections, then the full repository gate may run if QA passes.

[reviewed task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[implementation plan](../plans/version-string-channel-identity.md)

[prior changes-requested review](version-build-identity-code-review-b2caf37.md)
