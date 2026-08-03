---
type: Context Note
title: Revision 3 G0 candidate-freeze readiness audit
actor: codex-precompact-v3-g0-auditor
timestamp: '2026-08-03T21:15:07.539Z'
---
# Summary

Phase: G0/candidate-freeze readiness audit. Outcome: **BLOCKED before G0**. The T3 implementation is clean and reviewed, and the repository has strong build/package checks, but two pre-freeze conditions are not satisfied: the feature branch is four commits behind current `origin/main` (including the package version bump to `0.1.0-pre.3`), and the committed live harness is still the T0 isolation-only skeleton. It cannot bind L0-L3 to a manifest, tarball, installed helper, or harness digest. Freezing now would create a stale `0.1.0-pre.2` candidate whose downstream acceptance rail is not digest-enforced.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make G0 a one-way transition from a reviewed clean source SHA to one immutable package/helper/harness identity that every later reviewer and live lane can verify without rebuilding; this serves the ultimate goal by preventing acceptance evidence from drifting away from the implementation it claims to prove.

Audit actor: `codex-precompact-v3-g0-auditor`. Worktree inspected: `/private/tmp/aslite-precompact-v3.RLDTIZ/repo` at `579de4df5076f042282d0292db6ead0839f97ef3`. No repository files or host configuration were changed and no live Claude session was run.

## What is ready

- `packages/cli/build.mjs npm-package` already refuses anything except an exact clean 40-hex Git source with `dirty:false`, cleans `dist/`, prepares generated inputs, builds one self-contained executable, and records source/package/channel identity in the bundle.
- `npm pack --ignore-scripts` can package that already-built `dist` without triggering `prepublishOnly` or another build.
- `aslite version --json` exposes the installed executable digest, package/version, exact source commit, dirty bit, `npm-package` channel, runtime path, and compatibility contracts.
- `npm run check` is the complete PR-side repository gate. It includes root build/typecheck/workspace tests, script tests, local installed-tarball proof, generated npm-skill drift, MCP browser tests, and UI e2e. Its package proof is intentionally `local-dev` and deletes its scratch tarball.
- The focused revision-3 suites cover identity/schema, transcript extraction/truncation, authority/state machine, true-process contention/recovery/GC, frozen rejected contracts, harness isolation, five-event adapter/install/readiness, authority integration, command selection, host-root agreement, and SessionStart coexistence.
- Exact host identity is presently: Claude Code `2.1.220`, Darwin/arm64, realpath `/Users/brian/.local/share/claude/versions/2.1.220`, SHA-256 `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`.

## Blockers and accidental-rebuild risks

1. `feat/precompact-handoff-v3` is ahead 12 / behind 4 relative to `origin/main`. Upstream `5ee3829` includes `packages/cli/package.json` and lockfile version `0.1.0-pre.3` plus generated reference changes. Integrate upstream before the exact T4/T3.5 review. Any integration after G0 invalidates the source/package/manifest identity.
2. `packages/cli/test/fixtures/handoff/live-harness.mjs` declares schema `agentstate-lite-handoff-live-harness/v2` and phase `T0-isolation-only`. It only prepares isolated paths, inventories an outside canary, probes launch env, and checks PTY/auth/Claude identity. It neither reads a candidate manifest nor verifies/installs the existing tarball; its own source comment says candidate invocation remains downstream. Its current digest therefore cannot enforce the plan's “same artifact and harness” gate.
3. `scripts/verify-npm-package.mjs` always invokes a build, packs into a temporary directory, installs, then deletes the tarball. It has no verify-existing mode. `npm run verify:npm-package`, `npm run verify:npm-package:release`, `npm run check`, `npm test -w @holaxis/aslite`, or another `build.mjs` invocation after freeze would rebuild and violate the accepted one-candidate procedure.
4. `npm pack` without `--ignore-scripts` may run lifecycle scripts. Candidate packing must use `--ignore-scripts` and an explicit isolated `--pack-destination`.
5. A helper copied before the final `npm-package` build, a harness edited after its digest is recorded, or a clean install that falls through to another `aslite` on host `PATH` would produce false evidence. Byte comparison and isolated-prefix PATH resolution are mandatory.

## Minimal within-plan T3.5 prescription

Add reviewed test infrastructure before G0; this is not a production-policy redesign.

### Repository-owned harness/tooling

- Add a strict `agentstate-lite-handoff-candidate/v1` manifest codec with unknown-key rejection and candidate-relative, non-symlink paths. Required fields: source commit; package name/version/channel; tarball relative path/SHA-256/npm receipt; helper relative path/SHA-256; harness relative path/Git blob/SHA-256; exact Claude realpath/SHA-256/reported version/platform/architecture; Node/npm versions; creation time. The manifest never contains transcript/card/auth bytes or the repository/project path.
- Split candidate commands structurally into `freeze` and `verify-existing`. `freeze` is the sole code path permitted to run `build.mjs npm-package` and `npm pack --ignore-scripts`; it refuses a dirty or non-HEAD source. `verify-existing` accepts the manifest plus its expected SHA-256, may only hash/read/install/invoke the existing tarball, and cannot call build, pack, `npm test`, or package verification.
- Extend the copied live harness so every L0-L3 invocation requires `(candidate root, expected manifest digest, lane id)`. Before Claude launch it verifies the manifest sidecar, tarball/helper/harness bytes and modes, its own copied digest, exact current Claude tuple, and a clean install of the existing tarball into that lane's fresh isolated prefix. It must require both bin aliases to resolve inside that prefix and compare installed `version --json` plus installed executable bytes to the manifest.
- Bind every sanitized lane receipt to manifest digest, source SHA, tarball/helper/harness digests, host tuple, lane id, isolated root, event-sequence receipt ids, and before/after inventory digests. Receipt schemas expose only counts/hashes/reasons; no transcript, card, auth value, or journal content.
- Lane preparation retains the current fresh `/private/tmp` config/project/bundle/journal/home/outside-canary isolation. Verification fails if candidate bytes, outside canary, foreign settings, or any inventoried path outside the declared lane changes.

### Required T3.5 tests and acceptance

1. Golden manifest round-trip plus rejection of missing/extra fields, absolute or escaping paths, symlinked artifacts, bad modes, bad digest lengths, source/package/channel disagreement, and content-bearing fields.
2. Injected process-runner test proves `freeze` performs exactly one npm-package build and one `npm pack --ignore-scripts`; a second build/pack attempt is rejected.
3. Injected process-runner test proves `verify-existing`, lane prepare, and lane verify execute zero build/pack/test/package-verification commands.
4. Byte-flip each of manifest, tarball, helper, and copied harness; change expected manifest digest; alter helper execute mode; substitute a host binary on PATH; change Claude digest/version/arch. Every case must halt before Claude launch and emit a content-free drift reason.
5. Clean offline install of the existing tarball succeeds under a fresh prefix without rebuilding; both aliases resolve there; installed helper SHA equals copied helper SHA; `version --json` reports the manifest source SHA, `dirty:false`, `npm-package`, expected package/version, and exact artifact SHA.
6. At least one fixture per L0, L1, L2, and L3 proves the launch input and final receipt carry the same manifest digest and unique lane id; event receipt sequence and outside/candidate inventories are verified. A receipt copied from another lane or manifest is rejected.
7. Re-run the focused lane below, full CLI suite, root typecheck/build, package/generator checks, and privacy scans; independently review the exact T3.5/T4 SHA before G0.

The repository should own schemas, hashing/path policy, no-rebuild enforcement, existing-tarball install verification, lane binding, sanitized receipts, and deterministic tests. Private G0 orchestration should own the fresh `/private/tmp` candidate location, exact host resolution, permission-approved full check, the one authorized freeze invocation, 0400/0500 final modes, and out-of-band handoff of the manifest digest. Auth remains only in the isolated live runner environment and is never written to the manifest or receipt.

## Exact post-T3.5 G0 recipe

Run from the isolated integration worktree only after upstream integration, T4/T3.5 exact-SHA review PASS, installed dependencies, and a clean status.

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor origin/main HEAD
git diff --check
git status --porcelain=v1 --untracked-files=all

npm run build

AGENTSTATE_LITE_NO_AUTOPULL=1 AGENTSTATE_LITE_RUN_HANDOFF_RED_CONTRACTS=1 GIT_AUTHOR_NAME=test-suite GIT_AUTHOR_EMAIL=test-suite@example.invalid GIT_COMMITTER_NAME=test-suite GIT_COMMITTER_EMAIL=test-suite@example.invalid node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/handoff-identity-schema.test.ts ./packages/cli/test/handoff-transcript.test.ts ./packages/cli/test/handoff-authority.test.ts ./packages/cli/test/handoff-authority-process.test.ts ./packages/cli/test/handoff-rejected-contracts.test.ts ./packages/cli/test/handoff-harness.test.ts ./packages/cli/test/handoff-process-harness.test.ts ./packages/cli/test/hook-lifecycle.test.ts ./packages/cli/test/hook-authority-integration.test.ts ./packages/cli/test/hook-command-preference.test.ts ./packages/cli/test/host-config-root-agreement.test.ts ./packages/cli/test/session-start.test.ts

npm run check > /private/tmp/aslite-precompact-v3-g0-check.log 2>&1

git diff --check
git status --porcelain=v1 --untracked-files=all
git rev-parse HEAD
```

The `npm run check` process exit code is the verdict; inspect only a bounded failure tail. It needs the repository's required listener/browser execution permission. Do not pipe it through `tail` or `grep`.

After those commands pass, private orchestration creates a fresh exact candidate root and invokes the new reviewed freeze entry point exactly once:

```sh
mktemp -d /private/tmp/aslite-precompact-v3-candidate.XXXXXX
node scripts/handoff-candidate.mjs freeze --candidate-root <the-exact-mktemp-result> --claude-bin /Users/brian/.local/share/claude/versions/2.1.220 --json
node scripts/handoff-candidate.mjs verify-existing --candidate-root <the-exact-mktemp-result> --expected-manifest-sha256 <freeze-receipt-manifest-sha256> --json
```

`freeze` must produce only `artifacts/<tarball>`, `artifacts/agentstate-lite.mjs`, `harness/live-harness.mjs`, `manifest/candidate.json`, and `manifest/candidate.sha256` (plus a sanitized freeze receipt if the reviewed schema declares it). It then removes write bits. `verify-existing` performs the clean isolated offline reinstall and records no mutable gate status in the manifest. R0, Q0, and L0-L3 start by running `verify-existing` with the same out-of-band manifest digest; they install the existing tarball and never invoke a repository build or pack.

Until that T3.5 entry point and digest-bound harness exist and pass independent review, do not execute G0 or claim a candidate is frozen.
