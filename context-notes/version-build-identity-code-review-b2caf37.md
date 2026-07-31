---
type: Context Note
title: 'Independent code review: immutable build identity b2caf37 — changes requested'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T21:58:31.815Z'
---
# Summary

**Verdict: CHANGES_REQUESTED.** Exact commit `b2caf37a6ee84152dfabe39c6938ef3101aff2bf` was reviewed against parent `8b7cefe8ca5c5df5527296fbd77bc17f4d31288c` in isolated detached worktree `/private/tmp/aslite-build-identity-review.fHPbgz`. No code was edited. There are zero blockers, three major findings, and one minor finding. Approval is withheld because I1 requires no blocker/major before QA.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable. Proximate review goal: verify the one-offline-owner I1 identity contract before QA. The implementation has a sound central static identity shape and several strong agreement tests, but currently overclaims launch certainty, leaves explicit build callers unmigrated, and breaks the required npm package proof on macOS.

# Major findings

## M1 — path layout is promoted to certain source-launch evidence

**Empirical and reasoned.** `packages/cli/src/build-identity.ts:216-218` classifies any executable path ending in `.ts` or merely containing `/src/` as `launch_mode: source`, `launch_confidence: certain`. The normative protocol section 1 says path layout may support an explicitly inferred launch mode but never upgrades it to certain.

The classifier is not just theoretical: copying the exact built bundled `.mjs` bytes to `/private/tmp/aslite-launch-evidence.Vtidq8/src/copied-bundle.mjs` and running `version --json` produced:

`"launch_mode":"source","launch_confidence":"certain"`

The artifact was a baked `local-dev` bundle, not a source launch. This violates the fail-closed evidence contract and makes public identity state a false fact. Fix by requiring evidence beyond layout for `certain`, or report `inferred`/unknown; add the copied-bundle-under-src adversarial fixture and correct the existing source-path expectation at `packages/cli/test/build-identity.test.ts:73-80`.

## M2 — six bundle build call sites omit the now-required flavor

**Empirical and reasoned.** `packages/cli/build.mjs:33-36` now rejects any invocation without `local-dev|npm-package`, but six standalone integration-test bootstrap hooks still call `node build.mjs` without the mandatory input:

- `packages/cli/test/help-index-cli-integration.test.ts:29`
- `packages/cli/test/kind-completing-command-cli-integration.test.ts:36`
- `packages/cli/test/session-start.test.ts:93`
- `packages/cli/test/catalog-cli-integration.test.ts:17`
- `packages/cli/test/doc-cli-integration.test.ts:55`
- `packages/cli/test/local-only-cli-integration.test.ts:19`

A clean exact-SHA run of the first standalone test failed immediately with `Error: usage: node build.mjs local-dev|npm-package`, and all eight cases in that file failed. The aggregate package test masks this by prebuilding dist. I1 explicitly requires every bundle-producing caller to carry explicit flavor evidence; complete the call-site migration and preserve the intended standalone-build path.

## M3 — required npm package verifier fails on macOS canonical paths

**Empirical.** `scripts/verify-npm-package.mjs:310` compares the identity owner’s canonical real path with an uncanonicalized scratch path. `currentExecutableRealPath` canonicalizes through `realpathSync` at `packages/cli/src/invocation.ts:46-51`; macOS resolves `/var/folders/...` to `/private/var/folders/...`, while `installedEntrypoint` retains the former spelling.

Running the focused package gate on exact `b2caf37`:

`npm run verify:npm-package`

failed exit 1 with actual `/private/var/folders/.../dist/agentstate-lite.mjs` versus expected `/var/folders/.../dist/agentstate-lite.mjs`. This is a required I1/package acceptance gate, not a cosmetic test. Compare canonical paths (or use the same resolver) and retain a regression assertion that works across symlinked system path prefixes.

# Minor finding

## m1 — built MCP initialize version is not pinned end to end

**Reasoned coverage gap.** `packages/cli/test/mcp.test.ts:50-62` proves only that command wiring passes source-run `cliVersion()` into an injected `startServer`. The actual built stdio handshake test connects at `packages/cli/test/mcp-stdio.test.ts:65` but never asserts `client.getServerVersion()?.version`; it proceeds directly to tools. The I1 Plan explicitly requires the MCP initialize server version to agree with built CLI identity. Add an assertion comparing the built client handshake version to the built `version --json` package version so bundling/default regressions cannot survive.

# Survived attacks and sampled evidence

- Dependency install from the lockfile succeeded in the isolated worktree.
- Root build succeeded after following the repository requirement to build sibling workspaces first.
- CLI typecheck passed.
- Focused identity/home/skill/MCP suite passed 67/67 after the root build:
  `build-identity.test.ts`, `version.test.ts`, `home.test.ts`, `mcp.test.ts`, `mcp-stdio.test.ts`, and `skill-command.test.ts`.
- The tests prove baked version authority, stale adjacent-manifest diagnostics, same-SemVer byte differentiation, mandatory core bundler flavor validation, local and legacy flavor projection, both version aliases, home identity, skill running version, runtime hash, and injected MCP wiring.
- `git status --short` stayed free of tracked modifications in the exact-SHA worktree.
- Full repository QA was intentionally not run because Review found majors; it remains downstream after repair and re-review.

# Required next gate

Repair M1-M3, add the MCP handshake assertion, commit a new exact SHA, and request independent re-review before focused package/agreement QA. Because M1 is an evidence-overclaim, the Plan’s rule makes dedicated QA mandatory after Review approves the corrected SHA.

[reviewed task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[implementation plan](../plans/version-string-channel-identity.md)
