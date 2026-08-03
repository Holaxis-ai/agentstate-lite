---
type: Context Note
title: Revision 3 T3.5 pre-freeze plan skeptic review
actor: codex-precompact-v3-t35-skeptic
timestamp: '2026-08-03T21:20:58.885Z'
---
# Summary

Adversarial review of `context-notes/precompact-v3-g0-readiness` at exact version `sha256:164c7868f43ae268184a6f4714c7236d7b3bc5cc997e2de6d57229d1acafd68e`: **FAIL**, confidence 0.97.

The T3.5 direction is within the accepted revision-3 design. The structural split between a sole `freeze` writer and read/install-only `verify-existing`, an out-of-band expected manifest digest, a copied self-verifying harness, isolated lane installs, and sanitized digest-bound receipts is the right architecture. It also correctly refuses to start G0 while the current T0 harness remains isolation-only.

The prescription is not yet complete or test-first enough to prevent source/artifact/harness/host drift through R0, Q0, and L0-L3. Six enforcement contracts remain underspecified. They must be added to the T3.5 acceptance criteria and red-test sequence before implementation.

Current read-only facts: the implementation worktree is clean at `05466678ea25c3d4d43043c20969aaad3f52dd6b`; current `origin/main` is already an ancestor and package version is `0.1.0-pre.3`, so the readiness note's former behind-main blocker has since been cleared. `scripts/handoff-candidate.mjs` is still absent. `packages/cli/test/fixtures/handoff/live-harness.mjs:1-3,117-140` still identifies itself as the T0 isolation-only skeleton and has no candidate binding.

## Blocking plan gaps and required repairs

### 1. Freeze is not pinned to the already-reviewed SHA and has no post-build source proof

The proposed `freeze` arguments contain candidate root and Claude path, but not the exact T3.5/T4-reviewed source SHA. “Clean HEAD” is insufficient: any later clean commit could be frozen without first repeating the required source review. The current npm-package build samples HEAD/status inside `currentSourceFacts()` (`packages/cli/scripts/build-bundle.mjs:45-80`), while `build.mjs` generates inputs before bundling (`packages/cli/build.mjs:38-46`); the prescription does not require a second HEAD/status/tree check after generation, build, pack, helper copy, and harness copy.

Repair:

- `freeze` must require an out-of-band `--expected-source-sha <40hex>` from the exact T3.5/T4 review and compare it to HEAD both before and after all build/pack/copy work.
- Assert before and after: exact HEAD, clean tracked/untracked status, `origin/main` ancestry, package name/version, and no tracked mode/content change. If any differs, publish no manifest.
- Require a fresh canonical empty candidate root. Refuse reuse/nonempty roots. Stage outputs privately, atomically publish the manifest/sidecar last, and make a partial or failed root permanently invalid; a retry uses a new root rather than silently performing a second candidate build/pack.
- Red tests must call real `freeze` twice, interrupt/fail it at build/pack/copy/manifest boundaries, and prove only a fully completed fresh root can become a candidate. The injected runner must record exactly one `build.mjs npm-package` and exactly one `npm pack --json --ignore-scripts --pack-destination …` for a successful candidate.

### 2. Existing-tarball install verification must reuse the repository's isolated npm contract

“Clean offline install” is too loose to guarantee zero rebuild, zero user-global/npm state, and no PATH fallback. The repository already owns the necessary mechanics in `scripts/verify-npm-package.mjs:205-247,289-330`: empty user config, lane-local cache/home/prefix, `--offline --ignore-scripts --no-audit --no-fund`, isolated PATH resolution, tarball contract validation, and both aliases reporting one identity. T3.5 should extract/reuse those primitives rather than create a parallel verifier.

Repair:

- Every `verify-existing`/R0/Q0/live install must use a fresh lane-local HOME, npm prefix, npm cache, empty npmrc, and a minimal allowlisted environment. Invoke the exact npm CLI with the exact Node executable; never inherit user npm config/cache or contact the network.
- Verify the normalized npm pack receipt and tarball allowlist/runtime-dependency contract, not just the outer tarball hash.
- Resolve both `aslite` and `agentstate-lite` inside the isolated prefix; require both realpaths to the same installed `dist/agentstate-lite.mjs`, and require those bytes to equal the copied helper and manifest digest. No host PATH fallback is permitted.
- Execute `version --json` through both aliases and require exact equality for package/version, source SHA, `dirty:false`, `npm-package`, artifact SHA, runtime realpath, and compatibility contracts.
- The zero-build test must observe process descendants or a strict command authority, not only top-level runner calls; package lifecycle scripts are disabled explicitly.

### 3. Candidate filesystem and immutability policy is incomplete

Candidate-relative non-symlink artifact paths do not define a safe candidate boundary. The plan does not specify root/ancestor ownership, hard links, exact file-to-mode mapping, directory modes, or a complete allowlist check after freezing. Removing write bits alone is advisory and does not detect a same-inode helper/harness copy.

Repair:

- Canonicalize and lstat the candidate root and every ancestor; require the fresh `/private/tmp` root to be a real, owned directory with no symlink component. For every manifest path reject empty/dot/backslash/absolute/escaping/non-normalized forms, symlinks in any descendant, and realpaths outside the candidate.
- Require real copied files, not hard links (`nlink === 1` for candidate files), and exact allowlisted output paths only.
- Declare exact final modes: private read/traverse-only directories, 0400 data/manifest/tarball/sidecar, and 0500 helper/harness (or an equally explicit reviewed mapping). Verify owner and modes after chmod and during every later verification. Include root, ancestor, symlink, hard-link, extra-file, and mode-flip tests.
- Define the manifest self-reference precisely: the manifest contains the copied harness SHA-256 and the source commit's harness Git blob OID; it does not contain its own digest. `candidate.sha256` is canonical sidecar text, while every gate receives the manifest digest out of band and checks expected digest = sidecar = actual bytes. The harness must hash its own candidate copy and require its realpath to equal the manifest-relative harness path.
- Do not store a mutable freeze/gate receipt in the candidate unless its exact path and digest are themselves covered. Prefer a sanitized stdout freeze receipt carried out of band.

### 4. Verification is pre-launch only; it does not close mid-lane artifact/host drift

The harness is required to verify candidate and host before Claude launch, but a final receipt merely repeats manifest facts. A byte/mode/host change during a long automatic or sub-agent journey could therefore receive a PASS receipt based on stale preflight evidence.

Repair:

- Snapshot and verify the exact candidate allowlist, manifest, tarball, helper, harness, modes, and host tuple both immediately before launch and immediately before emitting PASS. A drifted postflight emits only a content-free failure and no PASS receipt.
- Invoke Claude by the manifest's exact realpath, never PATH. Check executable regular-file/mode/owner facts plus SHA-256, reported version, platform, and architecture at both boundaries.
- Either remove Node/npm versions from the manifest or make them real readiness keys: record and verify exact Node executable realpath/digest/version and npm CLI realpath/digest/version at freeze and in every install lane.
- Add mutation-between-preflight-and-postflight tests for manifest, tarball, helper, harness, candidate modes/tree, and Claude tuple. Preflight-only byte-flip tests are not sufficient.

### 5. Lane receipts do not yet enforce the full R0→Q0→L0→L1→L2→L3 chain or replay resistance

Required test 6 covers only L0-L3 even though the accepted plan requires the same artifact through R0 and Q0. A caller-supplied lane id plus manifest digest rejects cross-lane copies but not a stale receipt replayed under the same lane id, and no predecessor binding enforces gate order.

Repair:

- Define a strict lane/subcase enum covering R0, Q0, every L0 negative subcase, L1, L2, and L3. Test every lane type, not only four live fixtures.
- Each lane starts with an out-of-band unique attempt/challenge id and, except R0, the exact predecessor PASS-receipt digest. The final create-only 0600 receipt binds schema, lane/subcase, attempt id, manifest/source/tarball/helper/harness/host digests, predecessor digest, event-receipt sequence digest, and pre/post inventory digests.
- Store lane receipts outside the immutable candidate. Bind the canonical lane root by a hash rather than exposing an absolute path in a supposedly counts/hashes/reasons-only receipt.
- Reject wrong predecessor, skipped/out-of-order lane, duplicate attempt, same-lane stale receipt, cross-lane receipt, changed manifest, and duplicate/missing/reordered event receipt ids. Add one aggregate L0 PASS only after every required L0 subcase PASS is bound.

### 6. Auth, global-state, and privacy evidence lacks an explicit scope and canary test

“Before/after inventories” is not executable until the protected paths and byte/mode/symlink algorithm are enumerated. The current skeleton checks one outside canary and prepares an allowlisted launch environment (`live-harness.mjs:40-56,78-125,144-158`), but that alone does not prove user-global Claude settings, user agentstate credentials/journal, repository state, npm config/cache, and the immutable candidate were untouched. The prescription also says auth stays in the environment without requiring a canary scan of errors/logs/receipts.

Repair:

- Define protected pre/post snapshots for the candidate tree, source worktree status/HEAD, user-global Claude config/settings, user-global agentstate credentials/handoff root, user npm config/cache sentinels, and explicit outside canaries. Snapshot path set, type, mode, symlink target, size, and content hash; absent→present is a change.
- Spawn npm, helper, and Claude from minimal allowlisted environments with lane-local HOME/XDG/CLAUDE_CONFIG_DIR/npmrc/cache/prefix. Inject only the named auth variable at the final Claude spawn; never serialize its value.
- Use distinct transcript/card/auth/global canaries and recursively scan candidate files, manifest/sidecar, stdout/stderr, sanitized receipts, and any retained logs. Raw live evidence, if retained for acceptance oracles, stays 0600 below the lane and is not copied into candidate or receipt.
- Tests must prove an auth canary and project/repository path cannot appear in manifest or receipts, error paths remain content-free, and protected global snapshots are byte/mode identical after success and failure.

## Test-first sequencing repair

The note lists good tests, but it does not make the red-first dependency explicit. Replace the single T3.5 implementation block with reviewed phases:

1. Freeze manifest/path/mode/one-build tests and failure fixtures land red against the absent command/current skeleton.
2. Implement only the strict manifest codec and transactional freeze authority until those tests pass.
3. Existing-install/no-build/helper-alias/host pre-post tests land red.
4. Implement `verify-existing` by factoring the current package-verification primitives; no parallel npm policy.
5. R0/Q0/L0-L3 lane-chain, replay, privacy, and protected-inventory tests land red.
6. Extend the copied harness and receipt codec until they pass; then run focused/full gates and independent exact-SHA review before G0.

Each implementation step depends on its red test step. The final reviewer must inspect the real command graph and candidate modes/bytes, not only mocked runner counts.

## What survives skepticism

- T3.5 is a feedback/candidate-integrity unit, not an unauthorized production lifecycle redesign.
- Freeze versus verify-existing is the correct authority split.
- `npm pack --ignore-scripts` after exactly one npm-package build is the correct pack boundary.
- An out-of-band expected manifest digest avoids trusting the candidate's sidecar alone.
- Separate tarball, helper, copied-harness, source, and exact Claude tuple identities are necessary and correctly recognized.
- Keeping mutable lane results out of the manifest is correct.
- Fresh `/private/tmp` lane roots, isolated Claude config/home/project/bundle/journal, and sanitized receipts are correct foundations.
- The exact G0 rule that no build/test/package-verification command runs after freeze is correct.

After the six contract repairs and red-first sequencing are incorporated, the prescription is suitable for a new exact-version plan review. Until then, G0 remains blocked and no candidate should be frozen.
