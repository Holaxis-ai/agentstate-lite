---
type: Plan
title: Revision 3 T3.5 candidate-acceptance Plan R4
actor: codex-precompact-v3-t35-planner
timestamp: '2026-08-03T22:19:03.420Z'
---
# Revision 3 T3.5 candidate-acceptance Plan R4 — immutable candidate and executable rail

**Status:** R4 review candidate. G0 and implementation remain blocked. No T3.5 code starts until this exact Plan passes independent product/acceptance and adversarial-skeptic review. R4 narrowly incorporates the exact R3 FAIL reviews `context-notes/precompact-v3-t35-plan-accept-r3@sha256:1632c52273ab9a4aafb6d7bd342dee6f8bfc82ca14b77097381763c1e4a2c934` and `context-notes/precompact-v3-t35-plan-skeptic-r3@sha256:a348bf7f680bb089a48a919dbcbf6ebaf865d876198b105dfa18ebdcdd27507d`; all surviving R3 architecture and gates remain unchanged.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make the transition from reviewed source to L3 PASS one replay-resistant executable chain over a single package/helper/harness identity; this serves the ultimate goal by making real compaction continuity an empirically adjudicated property rather than an operator convention.

## Frozen inputs, host finding, and scope

Implementation must read these exact accepted inputs before work:

- `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`;
- `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`;
- `context-notes/precompact-v3-orientation` at the version current when the builder claims work;
- the two original FAIL reviews, both exact R2 FAIL reviews recorded by R3, and the two exact R3 FAIL reviews named above;
- `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`; and
- `context-notes/precompact-v3-g0-readiness@sha256:164c7868f43ae268184a6f4714c7236d7b3bc5cc997e2de6d57229d1acafd68e` as superseded background.

The readiness note's former behind-main fact is closed. At plan revision time, `origin/main` is an ancestor of the feature branch and `packages/cli/package.json` is `0.1.0-pre.3`. Current feature HEAD is `36c741a8173832d75d61a7ab138b5219c4415c66`; that is not the future freeze SHA. Freeze must receive the later exact T3.5/T4-reviewed SHA out of band.

T3.5 is test and acceptance infrastructure. It does not add a production helper receipt channel and does not change the five-event lifecycle authority. If implementation needs any `packages/cli/src/**` behavior change, new `hook diagnose` fields, different hook JSON, or a helper-side acceptance output, stop: the affected T3 production unit requires tests and renewed independent exact-SHA T3 review before this plan can resume.

The host note has two deliberately separate conclusions. Its isolated component proves exact 2.1.220 command+args exec form, independent stdin, sibling parallel start and join, passive zero-output observation, failure observability, and a flushed post-writer-success/pre-join debug record. Its **overall verdict is FAIL** because a normal-auth fallback changed real `~/.claude.json`; first real model response is **BLOCKED_AUTH** because isolated auth reached an API billing failure and normal relocated auth failed. R4 uses the isolated primitive component only, treats the global drift as a negative isolation finding, bans real HOME/global-auth fallback, and does not claim a first model response from this probe.

The addendum proves that no retained host record maps a silent handler completion to its command/args independently of output or settings order. R4 therefore does **not** use opaque hook ids, output shape, settings order, or the flushed debug record to synchronize `L0_SESSIONSTART_CONTINUE_FALSE`. That case uses the sequential wrapper specified below. If implementation cannot preserve that wrapper contract without production changes, it removes the case and returns the accepted design/plan to review; it must not resurrect the racy sibling or add a production completion marker under T3.5.

### P35H fixture/parser contract

P35H is an evidence-disposition gate, not an overall host PASS. It pins the exact host-note head above and sanitized summary fixture SHA-256 `dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`. Before H0, the host-evidence owner derives and reviews a content-free repository fixture set containing: a manifest with source evidence digests and every normalization; exact sanitized `hook_started`/`hook_response` JSONL rows; exact relevant success/error debug-line shapes; parallel/join timing rows; and the zero-output ambiguity counterexample. Each fixture file has a manifest digest and unknown fields reject.

The parser accepts only the exact pinned 2.1.220 row keys, types, event/session relations, exit/outcome/output schema, and timestamp/order constraints. It exposes handler command identity only where the host record itself carries command/args; it never joins an opaque id to settings position or recognizes a silent handler from output. Fake Claude replays these fixture shapes. Any needed record not present in this fixture is a Plan blocker requiring new isolated host evidence, not a permissive parser branch.

## One executable authority and concrete file seams

One self-contained Node executable owns the acceptance rail:

- `scripts/handoff-candidate.mjs` — source executable and the exact file copied into every candidate as `harness/handoff-candidate.mjs`. It exports pure functions for tests, has an import guard, uses only Node built-ins, and implements `freeze`, `verify-existing`, `campaign create`, `stage prepare`, `stage run`, `stage finalize`, `stage verify-attestation`, `stage cleanup`, `assertion write`, `observer record`, `fault sequential-precompact`, and `oracle act`. Copied mode refuses `freeze` and `campaign create` accepts only a sealed candidate.
- `scripts/verify-npm-package.mjs` — refactored to call the package-contract/environment/install primitives exported by `scripts/handoff-candidate.mjs`; it retains its current local/release build-and-pack entry points. There is no second npm install policy.
- `scripts/handoff-candidate.test.mjs` — schema, path, transaction, verifier, attestation, replay, privacy, passive-observer, state-machine, fake-PTY, and command-graph tests; add it explicitly to root `test:scripts`.
- `scripts/fixtures/handoff-candidate/fake-claude.mjs` — deterministic PTY host fixture emitting exact lifecycle, transcript, debug-log, timeout, and sub-agent shapes.
- `scripts/fixtures/handoff-candidate/claude-2.1.220-hook-capabilities/` — reviewed sanitized fixture and manifest derived from host evidence `dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`, pinning exact stream/debug schemas for exec-form start/response, success/error, parallel/join timing, and the known inability to identify a silent handler by command/args. The strict parser rejects invented fields, opaque-id/order identity inference, and non-fixture record shapes.
- `packages/cli/test/fixtures/handoff/live-harness.mjs` — removed after its T0 isolation tests are migrated to the one executable. It must not remain as a second apparent live authority.
- `packages/cli/test/handoff-harness.test.ts` and `packages/cli/test/support/handoff-harness.ts` — point their isolation/fault/receipt contracts at `scripts/handoff-candidate.mjs`; production authority tests remain unchanged.

The executable is the only writer of candidate manifests, campaign/attempt ledgers, lane specifications, R0/Q0 assertions, server identity records, raw observer rows, action logs, and stage attestations. Shell snippets, tmux conventions, reviewers, and prose cannot synthesize or amend those objects. Reviewers supply bounded rubric answers and evidence paths only through the exact authority-emitted `assertion write` command; the authority canonicalizes and creates the assertion.

## Candidate manifest and filesystem contract

### Strict manifest schema

Canonical JSON is UTF-8, LF-terminated, recursively key-sorted, and rejects unknown or missing keys. Schema `agentstate-lite-handoff-candidate/v1` contains exactly:

- `schema`;
- `source`: `commit` (40 lowercase hex and equal to out-of-band reviewed SHA), `tree_oid`, `git_object_format`, `origin_main_commit`, `package_name`, `package_version`;
- `artifact.tarball`: normalized candidate-relative `path`, `sha256`, and normalized npm pack receipt (`filename`, SHA-1 `shasum`, SRI `integrity`, `size`, `unpacked_size`, and exact sorted file rows);
- `artifact.helper`: normalized relative `path`, `sha256`;
- `harness`: normalized relative `path`, copied bytes `sha256`, source Git blob OID;
- `host.claude`: realpath, SHA-256, reported version, platform, architecture, owner uid, regular-file mode;
- `toolchain.node`, `toolchain.npm`, `toolchain.tmux`, `toolchain.git`, and `toolchain.ps`: exact executable realpath, SHA-256, reported version where applicable; npm records the exact CLI file executed by the exact Node executable, and ps is fixed to `/bin/ps` with the Darwin liveness schema below;
- `compatibility_contracts`: the exact installed CLI identity object; and
- `created_at`: RFC3339 UTC.

All digests except Git OIDs use `sha256:<64 lowercase hex>`. The manifest contains no repository/source-worktree path, candidate absolute path, project path, lane path, auth material, transcript/card text, gate result, or its own digest. `manifest/candidate.sha256` is exactly `<64hex>  candidate.json\n`. Every gate receives `sha256:<64hex>` out of band and proves expected digest = sidecar = actual manifest bytes.

Manifest relative paths reject empty/dot/dot-dot segments, backslashes, absolute forms, duplicate separators, non-normalized forms, control bytes, and any realpath escape.

### Exact candidate tree and modes

The only successful tree is:

```text
artifacts/<npm-receipt-filename>.tgz       0400
artifacts/agentstate-lite.mjs              0500
harness/handoff-candidate.mjs              0500
manifest/candidate.json                    0400
manifest/candidate.sha256                  0400
```

The candidate root and three directories are 0500. All entries are owned by the invoking uid; every regular file has `nlink === 1`; no hard link, symlink, socket, device, FIFO, or extra entry is permitted. The harness realpath must equal its manifest-relative candidate path and its bytes must equal both manifest SHA-256 and source Git blob content.

The caller supplies a leaf path named `/private/tmp/aslite-precompact-v3-candidate.<52-lowercase-base32>` which must be **absent**. `freeze` validates the exact parent/name and atomically creates the leaf with `mkdir(0700)`. The lstat chain is fixed: `/`, `/private`, and `/private/tmp` must be real root-owned directories, `/private/tmp` must have the sticky bit, and no component may be a symlink. An existing path of any type rejects before build. There is no unobservable “previously used but emptied” claim. Later verifiers require the final modes and full allowlist.

### Transactional freeze state machine

`freeze --candidate-root <absent-leaf> --expected-source-sha <40hex> --claude-bin <exact-path>` has states `ABSENT -> BUILDING -> VALIDATED -> SEALED`; any interruption is `INVALID`.

1. `ABSENT`: validate the leaf's absence and ancestors; exact HEAD equals expected SHA; tracked/untracked status empty; `origin/main` is an ancestor; capture HEAD, tree, package, tracked modes/content, toolchain, and host tuple; atomically `mkdir(0700)` the leaf. Failure to create it is a content-free rejection before build.
2. `BUILDING`: create private subdirectories; invoke exactly once with exact argv the Node executable plus `packages/cli/build.mjs npm-package`; invoke exactly once the exact npm CLI through that Node executable with `npm pack --json --ignore-scripts --pack-destination <candidate>/artifacts` from `packages/cli`; copy (never link) final `dist/agentstate-lite.mjs` and `scripts/handoff-candidate.mjs`.
3. Re-check exact HEAD, tree, package, clean tracked/untracked status, `origin/main` ancestry, and tracked modes/content after generation/build/pack/copies. Any difference publishes neither manifest nor sidecar.
4. `VALIDATED`: validate npm receipt/file allowlist/runtime-dependency contract; hash all candidate bytes; run the same existing-package verifier against the staged tarball in a fresh external lane-local install root; compare both aliases and copied helper; validate the to-be-written canonical manifest.
5. Write `candidate.json` by same-directory temp+rename, then publish `candidate.sha256` last by temp+rename. Apply final modes directories-last; lstat/hash the complete allowlist again. Only then is state `SEALED` and a sanitized stdout freeze receipt emits manifest digest/source/artifact/harness/host hashes.

A crash or injected failure may leave a private partial path, but no valid sidecar. Any existing target is permanently refused; a retry is a new G0 attempt with a new caller-supplied absent leaf satisfying the exact name grammar. Calling `freeze` twice on one path rejects before a second build. No mutable receipt is stored in the candidate.

## One existing-package verifier, with pre/post enforcement

The factored verifier accepts only an already-existing tarball and has no authority path to build, pack, test, package verification, or source import. The enforceable process claim is deliberately narrow: the authority emits and records the exact top-level Node+npm argv and environment below. R4 does not claim portable observation of every real npm descendant.

Every invocation creates a fresh external 0700 verification root with lane-local HOME, USERPROFILE, XDG config, npm prefix/cache, and empty npmrc. Environment is allowlisted; inherited `npm_config_*`, npm lifecycle/workspace settings, host PATH bins, and network defaults are removed. It invokes exact Node + exact npm CLI with:

```text
npm install --global --prefix <prefix> --offline --ignore-scripts --no-audit --no-fund <existing-tarball>
```

It validates the normalized pack receipt and exact tarball allowlist/runtime-dependency contract. Both `aslite` and `agentstate-lite` must resolve inside the prefix to the same installed `dist/agentstate-lite.mjs`; no host PATH fallback is possible. Both aliases execute `version --json` and must agree on package/version, reviewed source SHA, `dirty:false`, `npm-package`, artifact SHA, runtime realpath, and compatibility contracts. Installed bytes must equal the copied helper.

The tarball must declare no runtime/optional/peer dependencies. One shared manifest validator, used by both `handoff-candidate.mjs` and `verify-npm-package.mjs`, pins the exact install-triggered forbidden script set for the manifest-pinned npm: `preinstall`, `install`, `postinstall`, `prepublish`, `preprepare`, `prepare`, and `postprepare`; it also rejects `binding.gyp` or any package shape that would trigger implicit `node-gyp rebuild`. The current publish-only `prepublishOnly` script is explicitly allowed and remains subject to `--ignore-scripts` during this install.

V0 supplies one fixture for every forbidden key, the implicit native-build case, allowed `prepublishOnly`, dependency rejection, and hostile canaries. The real proof is exactly: the local-tarball install succeeds with `--offline`, an empty lane cache/npmrc, and an unreachable configured registry, so it has no network dependency; it does not claim that no network attempt occurred. It also proves forbidden/implicit scripts are rejected by the shared validator, `--ignore-scripts` leaves canaries absent, no source path/import appears in argv/environment/resolution, and all source build outputs remain unchanged. Mock command-runner tests may assert descendants for unit coverage but are never cited as evidence about real npm descendants or network attempts.

`verify-existing` snapshots candidate and pinned host/toolchain immediately before verification and immediately afterward. Every `stage prepare` calls it into a fresh prefix; `stage run` repeats byte/mode/host checks immediately before launch; `stage finalize` calls it again into a different fresh prefix immediately before any PASS. Mid-stage mutation of manifest, tarball, helper, harness, mode/tree, Claude, Node, npm, tmux, git, or `/bin/ps` prevents PASS.

## Campaign-authoritative stage and attestation chain

### Closed stage/case set

Stages are `R0`, `Q0`, `L0`, `L1`, `L2`, `L3`. Cases are:

- `R0_EXACT_ARTIFACT_REVIEW`;
- `Q0_ADVERSARIAL_ARTIFACT_QA`;
- `L0_PRECOMPACT_MANUAL_BLOCK`, `L0_PRECOMPACT_AUTO_BLOCK`, `L0_SESSIONSTART_CONTINUE_FALSE`, `L0_MISSING_HELPER`, `L0_NONEXECUTABLE_HELPER`, `L0_HELPER_TIMEOUT`, and `L0_AGGREGATE`;
- `L1_MANUAL_MAIN_TWO_GENERATIONS_OVERSIZED`;
- `L2_AUTOMATIC_MAIN`;
- `L3_REAL_SUBAGENT`.

R0 has no predecessor. Q0 requires exact R0 PASS. Each L0 subcase requires exact Q0 PASS; `L0_AGGREGATE` requires the Q0 digest and exactly one distinct PASS for all six subcases. L1 requires the aggregate, L2 requires L1, and L3 requires L2.

### Private campaign ledger and consumption state

The immutable candidate remains static. Mutable replay authority lives outside it in one authority-owned campaign root `/private/tmp/aslite-precompact-v3-campaign.<256-bit-base32>`, atomically created 0700 by `campaign create` from an absent authority-generated path after sealed-candidate verification. Its 0600 canonical `agentstate-lite-handoff-campaign-ledger/v1` is the sole registry for campaign id, candidate/manifest/source/host/toolchain tuple, monotonic revision, previous-ledger digest, attempts, predecessor-consumption slots, owned tmux servers, terminal state, and timestamps.

Every ledger mutation uses one crash-atomic same-filesystem lock protocol. The contender first creates a unique `locks/owners/<256-bit-nonce>.json` with `O_CREAT|O_EXCL`, fully writes canonical owner bytes, fsyncs the file and owners directory, chmods 0400, and reads them back. The immutable record binds schema, campaign id, expected current revision/digest, actor/operation, PID, pinned-ps process-start identity, uid, executable digest, nonce, control/server reservation facts, and creation time. Only then does `link(owner-file, locks/current)` atomically acquire the absent canonical lock. The canonical path can therefore never expose partial owner bytes.

Acquisition/release/recovery lstat both links and require the same device/inode, canonical owner digest, uid, modes, regular-file type, and expected link count. Release unlinks only the verified canonical link and fsyncs the lock directory; the immutable unique owner file remains as audit history. Recovery uses manifest-pinned `/bin/ps` only, with SHA-256 rechecked before/after and exact argv `/bin/ps -p <decimal-pid> -o pid= -o lstart= -o uid= -o comm=` under `LC_ALL=C` and `TZ=UTC`. The strict Darwin parser accepts exactly one LF-terminated row matching leading space + exact decimal PID + `Sun|Mon|Tue|Wed|Thu|Fri|Sat`, exact English month, two-column day, `HH:MM:SS YYYY`, decimal uid, and nonempty command, with only ps field-separator whitespace. Exit 0 requires that row; exit 1 with zero stdout is the only absent-PID form; all stderr, other exits, empty/multiple/malformed rows, uid/command mismatch, or digest drift fail closed. Same PID plus same start identity is live; absent PID or a different start is the dead-owner/PID-reuse case. Recovery may unlink only after rechecking canonical dev/ino/digest and a second identical ps result. PID reuse, owner-file substitution, and a new owner racing recovery cannot steal a live lock.

Ledger publication is history-before-current. Revision zero is a complete canonical ledger with no predecessor. For every revision, the authority writes the immutable content-addressed history blob with `O_EXCL` (or verifies an identical pre-existing blob), fsyncs it, fsyncs the history directory, then writes/fsyncs a same-directory current temp, renames it over current, fsyncs the campaign directory, and reads back current plus the required history chain. A crash before current rename leaves a harmless immutable orphan which may be reused only if byte-identical to the same CAS transition. A campaign with current missing—including revision-zero history without current—or current referencing missing/mismatched history is quarantined `LEDGER_HISTORY_INCOMPLETE`, never promoted/repaired, never advances, and may only be reaped; retry uses a new campaign. Stale revision/digest is `STALE_CAMPAIGN`.

The authority—not the caller—generates the campaign id, every UUIDv4 attempt id, every 256-bit runner challenge, lane/session ids, campaign/lane leaf names, and every subsequent command. (The G0 candidate leaf remains caller-supplied and atomically created as specified above.) `stage prepare` receives the campaign path plus stage/case; manifest and predecessor identities come from the ledger. Under one CAS it reserves a fresh attempt and consumes the exact predecessor edge. Consumption policy is closed: R0 consumes the campaign root slot; Q0 consumes R0 once; Q0 exposes exactly six named one-use fan-out slots for the six L0 cases; the aggregate consumes all six case PASS digests once; L1, L2, and L3 each have one successor slot. An opened slot never becomes unused.

L0 execution is serialized: the ledger has one nullable `live_l0_attempt`, and at most one of the six cases may be `OPEN`, `RUNNING`, or `FINALIZING`. A case must finalize PASS, reap its exact server/socket, and CAS-clear the live slot before the next named slot opens. Concurrent prepares race on that CAS and one rejects. Any L0 FAIL or BLOCKED closes the campaign after its own exact reaping; because no sibling can be open, running, or finalizing, there is no sibling cancellation state. Retry starts a new campaign only after the old campaign's complete reserved socket set is absent. Concurrent prepare, same-attempt/fresh-root, stale predecessor, duplicate case, cross-campaign, and caller-selected-id attacks cannot advance.

### Lane spec

`stage prepare` order is fixed: (1) verify sealed candidate/source/host/toolchain and exact campaign history/current; (2) validate real/global path exclusions and take the bounded protected sentinel snapshot; (3) reject unsafe/unreadable/over-limit sentinels with no attempt; (4) verify predecessor, one-use slot, campaign active state, and for L0 `live_l0_attempt:null`; only then (5) acquire the crash-atomic lock and perform the single consumption/attempt CAS. Auth is not checked here because it is not supplied until run. No lane root, id, challenge, or consumed slot exists before steps 1-4 succeed.

After the CAS, `stage prepare` creates an absent authority-generated lane root and one 0600 canonical `agentstate-lite-handoff-lane-spec/v1`. It contains:

- stage/case, attempt id, a runner-generated 256-bit challenge and its digest, manifest/source/artifact/harness/host hashes, predecessor digests;
- exact isolated directory layout and its path hash;
- exact Claude realpath/argv, cwd, allowlisted environment names, installed prefix helper, settings digest, session UUID, nullable expected agent identity rule, time/turn/pressure bounds;
- ordered actions with sequence, prerequisite evidence predicate, exact input bytes/argv, deadline, expected/forbidden next states;
- exact fault transitions and terminal cleanup policy;
- lane-unique canaries, forbidden canaries, exact compaction-driving input, exact next-action argv/command, and expected structural result;
- required event sequence and all oracles.

Raw spec values remain 0600 in the lane. The sanitized attestation exposes only their digest and booleans/counts/hashes.

### R0/Q0 challenge-bound assertions

R0 and Q0 use strict, create-only, authority-written schemas `agentstate-lite-handoff-review-assertion/v1` and `agentstate-lite-handoff-qa-assertion/v1`; unknown/missing keys, duplicate rows, free-form verdicts, or oversized fields reject. `stage prepare` emits the exact `assertion write` command and closed rubric. The authority fills bindings from the ledger/spec rather than trusting caller values: stage/case, campaign/attempt id, challenge digest, manifest digest, source SHA, installed-prefix inventory digest, reviewer/QA actor identifier, declared non-builder role, row-set version, per-row verdict, bounded evidence digest list, closed reason, overall verdict, and creation time.

R0 rows are exactly `SOURCE_AND_SCOPE`, `MANIFEST_ARTIFACT_IDENTITY`, `PRODUCTION_CONTRACT_UNCHANGED`, `INSTALLED_CANDIDATE_ACTIONS`, and `REQUIRED_RED_SAMPLE`. Q0 rows are exactly `CANDIDATE_MUTATIONS`, `INSTALL_AND_ISOLATION_ATTACKS`, `ATTESTATION_AND_REPLAY_ATTACKS`, `PRIVACY_AND_PROTECTED_STATE`, and `REQUIRED_RED_SAMPLE`. Every PASS row needs at least one authority-ingested evidence digest; the red rows bind the installed-candidate empirical action log and observed failing oracle. The authority creates the assertion sidecar last and immediately consumes its digest in finalization; stale attempt/challenge/candidate/source/prefix/actor/row evidence rejects.

This mechanism proves only `reviewer_asserted_pass` or `qa_asserted_pass` for an exact challenge-bound rubric. It does not prove that the human is independent or that the semantic judgment is true. Selecting a genuinely independent non-builder reviewer/QA actor and checking role separation remains an explicit orchestration trust gate before finalization; without that trust decision the campaign does not advance.

### Stage attestation

`stage finalize` creates once, outside the candidate, canonical `agentstate-lite-handoff-stage-attestation/v1` plus sidecar. It binds campaign/stage/case, attempt id, challenge digest, manifest/source/tarball/helper/harness/host/toolchain digests, predecessor and consumed-slot digests, lane-root hash, pre/post installed-prefix inventory digests, lane-spec/action-log/raw-evidence/event-sequence/protected-snapshot digests, optional exact R0/Q0 assertion digest and honest assertion result, tmux cleanup proof, verdict, closed reason, and UTC completion time. It contains no absolute lane path or raw identity/content/auth.

For `L0_SESSIONSTART_CONTINUE_FALSE`, the attestation additionally binds the installed child-helper and wrapper digests, prior/active/restored settings digests, exact child argv/env/cwd/stdin/helper/marker digest, stdin-finish/pipe-EOF/close/exit/no-signal/no-timeout predicates, pre/post diagnose and inventory digests, physical key derivation, byte-derived head/generation versions, guarded generation before/after digests, ordered wrapper trace, restored-ready receipt, `acceptance_wrapper_delegated_precompact:true`, `direct_managed_precompact_registration:false`, and `lane_tainted:true`. Other fault cases bind the tabled mutation/restoration inventories.

The attestation JSON is written to a never-before-existing temp, fsynced, renamed to its final absent path, read back, and only then is its digest sidecar created with `O_EXCL`, fsynced, and read back. Interruption before sidecar leaves an invalid attempt; the campaign closes and cannot reuse it. Finalization then CAS-records the digest and terminal attempt state in the ledger. `stage verify-attestation` requires ledger history and rejects wrong/missing/consumed predecessor, skipped stage, duplicate L0 case, same-lane replay, cross-campaign/manifest/case copy, duplicate attempt/challenge, missing/duplicate/reordered event ids, artifact/host drift, and any mutable/unknown field.

R0 source review is read-only at the manifest SHA. The stage runner emits the exact checkout/read commands and candidate-facing empirical actions. Q0 and every executable R0/Q0 attack resolve the helper only from the fresh installed prefix; no TypeScript import, `dist` rebuild, or source helper is accepted. R0's required red sample mutates an oracle fixture against installed candidate evidence and observes the oracle fail; it does not rebuild source.

## Repository-owned real-Claude PTY protocol

Private live operation is limited to providing one nonempty isolated `ANTHROPIC_API_KEY` environment variable and invoking the machine-emitted `stage` command. No real-HOME login, `~/.claude.json`, global credential, keychain, normal-auth retry, `CLAUDE_CODE_OAUTH_TOKEN`, or fallback auth path is permitted; adding another auth mode requires a new exact-host isolation probe and Plan review. The host-capability probe did not establish valid isolated auth, so an eventual real live attempt may terminate `BLOCKED_AUTH`. The executable owns tmux, trust/key-approval detection and input, prompts, `/compact`, pressure, sub-agent instructions, faults, capture, timeouts, and cleanup. No human chooses timing, wording, command, or evidence.

`stage run` creates a dedicated tmux server socket below the lane using the manifest-pinned tmux realpath. It launches the manifest-pinned Claude realpath, never PATH, with exact argv:

```text
--session-id <lane-session-uuid>
--debug-file <lane>/raw/claude-debug.log
--ax-screen-reader
--dangerously-skip-permissions
```

It runs from the isolated project with relocated HOME/USERPROFILE/XDG/CLAUDE_CONFIG_DIR/CODEX_HOME/OpenCode root, lane journal, `AGENTSTATE_LITE_NO_AUTOPULL=1`, and only the stage-declared compaction controls. The auth transport is honest: the operator, acceptance runner, dedicated tmux server, Claude process, and exact Claude-spawned managed-hook/observer/sequential-wrapper process tree may transiently possess the one secret in process environment/memory. The runner spawns the absent dedicated tmux server with the required nonsecret allowlist plus exactly one permitted auth variable; Claude and its hook tree may inherit it. Acceptance-owned descendant spawns construct the narrowest feasible environment: in particular, the sequential wrapper child explicitly removes `ANTHROPIC_API_KEY` and all unsupported auth variables while retaining the exact managed contract. R4 makes no claim that the host strips auth before launching hooks.

The value is never put in argv, tmux commands, disk, settings, spec, ledger, logs, receipts, attestations, or errors. Tmux pane bytes, Claude debug bytes, transcript JSONL, observer rows, journal evidence, and action log remain 0600 under `raw/` and are leak-scanned. R35 uses a distinct nonsecret inheritance canary to record which exact host-spawned hook processes inherit the parent environment; that canary is evidence about inheritance only and is never used to infer secret scrubbing.

Static candidate, predecessor, path, real/global HOME, fallback-auth-source, and protected-sentinel checks occur before `stage prepare` consumes a slot. The secret itself is supplied only to `stage run`; immediately before any tmux reservation/spawn, run rejects missing/empty/multiple/unsupported auth variables. That already-open attempt becomes `BLOCKED_AUTH`, is finalized/reaped without tmux, and closes the campaign. After launch, unknown auth UI, authentication/billing failure, or inability to receive a real model response has the same terminal result. The runner never retries against normal user auth.

For auto cases, the exact environment is `CLAUDE_CODE_AUTO_COMPACT_WINDOW=5000` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=10`, the controls that produced the accepted installed-host probe. The pressure fixture is 32 deterministic 4096-byte chunks. The runner sends at most 24 pressure actions and waits at most 240 seconds for main auto compaction. L3 gives a real sub-agent the machine-authored prompt and chunk work under the same bounded window, allowing at most 40 tool actions and 300 seconds. Failure to observe any PreCompact within those bounds is BLOCKED; observing PreCompact and then violating the rail is FAIL.

The runner advances only when machine predicates over observer/debug/transcript/action evidence pass. Omitted, substituted, or reordered PTY input is `ACTION_PROTOCOL_DRIFT`.

### Owned tmux server and crash recovery

Before spawn, one durable ledger CAS reserves an authority-generated server id and exact socket below the 0700 attempt root in state `RESERVED_NO_SERVER_RECORD`. The private path, owner, absent-socket premise, tmux digest, intended session id, and auth-variable name are recorded before any server can exist. The authority spawns the pinned tmux binary only on that socket. After socket appearance it queries only that server and CAS-transitions to `IDENTIFIED_SERVER` with create-only `agentstate-lite-handoff-tmux-server/v1`: campaign/attempt/server ids, socket path hash/lstat, tmux digest, server PID and pinned-ps process-start tuple, uid, session id, start time, and `auth_env_name_present:true` without the value. It never attaches to, updates, or pattern-kills another server.

`stage cleanup` is the named idempotent reaper and process termination precedes ledger bookkeeping. From either reservation state it reads the already-durable exact private socket reservation without acquiring the mutation lock. If the socket exists with the required private-root uid/type/path premise, it invokes only the pinned tmux binary with that exact socket and `kill-server`, then waits boundedly for socket disappearance; if absent, termination is already satisfied. This rule deliberately does not require a PID record in `RESERVED_NO_SERVER_RECORD`. In `IDENTIFIED_SERVER` it additionally uses pinned ps to prove the exact PID/start is gone. Only after process/socket absence does cleanup recover/acquire the crash-atomic campaign lock and CAS-record the cleanup proof/state. Thus an auth-bearing server is killable even when lock bookkeeping is wedged.

`stage prepare`, `stage run`, and `stage finalize` perform a pre/post reaper pass; finalize cannot emit PASS/BLOCKED/FAIL sidecar until every reserved server/socket is absent and cleanup proof is recorded. A SIGKILL may leave the reserved server alive until the next reaper invocation, but it cannot be forgotten or certified clean. Red tests kill at owner-file write/fsync/link, history-blob fsync/current rename/readback, reservation CAS, tmux spawn before socket, socket before PID capture, PID capture before server-record CAS, kill-server before cleanup CAS, auth inheritance, every PTY action, observer/wrapper work, and finalization. Two cleanup passes require exact process/socket absence plus either a coherent terminal ledger or explicit non-advancing quarantine.

## Chosen passive event producer

The evidence producer is explicitly **lane-local foreign observer hooks**, not a production helper side channel.

After the isolated installed candidate runs `aslite hook install --scope project`, `stage prepare` structurally adds one foreign exec-form handler for PreCompact, SessionStart, PostCompact, Stop, and SubagentStop. Each uses exact pinned Node as `command` and exact candidate `harness/handoff-candidate.mjs observer record ...` argv; there is no shell. Managed reinstall/status must preserve these foreign objects byte-for-byte.

Claude's official hook contract and the pinned component fixture establish that matching handlers start in parallel and the host joins their synchronous responses before advancing. Therefore observer order within one event is never used to order or identify the managed sibling; one observer durably records before returning, and monotonic rows across distinct lifecycle events preserve host order. The earlier real lifecycle probe established `PreCompact -> SessionStart(compact) -> PostCompact -> first response -> Stop`; the capability probe did **not** establish a first model response. See [Claude Code hook execution](https://code.claude.com/docs/en/hooks-guide).

The observer reads exact stdin bytes, returns no stdout/stderr and exit 0, and never changes journal/settings/transcript. Under a lane-local exclusive sequence lock it writes a 0600 raw input file and 0600 strict metadata with UUID event id, monotonic integer sequence, event/source/trigger, full session id, nullable full agent id, canonical transcript realpath and byte checkpoint/hash, hook-input digest, manifest digest, attempt/lane ids, producer realpath/digest, and Node digest. Finalization computes each raw-record digest and the ordered aggregate. Observer failure remains passive but makes finalization FAIL `EVENT_EVIDENCE_MISSING`.

Because observer and managed hook are parallel, observer rows prove host event occurrence, not managed completion. The strict pinned-host parser may corroborate exact event/output/outcome records but may not map a silent response to command/args by opaque id, output length, or settings order. Normal managed-effect proof instead combines exact settings digest, installed-helper status/diagnosis, exact transcript checkpoints, content-addressed private journal bytes, and live canary/action consequences; block outputs may additionally use their exact nonempty candidate reason. For the oversized oracle, finalization uses diagnose's exact generation/version to read only that 0600 lane generation, requires its byte hash/version, `truncated:true`, `renderedLength === renderedBody.length < 8000`, and literal current-prompt/next-action presence. No journal content enters an attestation.

### Deterministic SessionStart corruption wrapper

`L0_SESSIONSTART_CONTINUE_FALSE` does not use a parallel fault sibling. After installed candidate `hook install`, the authority proves `hook status` ready, captures the exact project settings bytes/digest, and CAS-replaces only the managed PreCompact shell-string entry `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1 <installed-helper> hook run` with one lane-local exec-form wrapper: exact pinned Node plus exact candidate `harness/handoff-candidate.mjs fault sequential-precompact` args and timeout. Matchers, every SessionStart/PostCompact/Stop/SubagentStop managed entry, and every foreign observer entry remain byte-identical. During this deliberate substitution, the exact status contract is `events.PreCompact:false`, `rail_ready:false`, `reason:"HOOK_HELPER_UNHEALTHY"`; no more specific reason is expected.

Before the child exists, the wrapper uses exact pinned Node + installed helper `hook diagnose --json` with runtime/cwd/full session and agent identity derived from the validated event. It requires `reason:"HANDOFF_NOT_FOUND"`, expected project/execution keys, and a physical inventory with no head and no generation entries. Physical keys are executable-owned and fixed to `<AGENTSTATE_LITE_HANDOFF_ROOT>/projects/<projectKey>/executions/<executionKey>/head` and `.../generations/<generation>`; every segment is normalized, nonsymlinked, inside the 0700 lane root, and matches returned identity keys.

The wrapper then spawns exact pinned Node with argv `<installed-helper> hook run`, no shell, exact isolated-project cwd, and the identical validated stdin bytes. The closed child environment is the lane-spec values for relocated HOME/USERPROFILE/XDG/CLAUDE_CONFIG_DIR, TMPDIR, handoff root, locale, `AGENTSTATE_LITE_NO_AUTOPULL=1`, and `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1`; it removes `ANTHROPIC_API_KEY`, every unsupported auth/npm/workspace variable, and wrapper-only values. Exact key/value and stdin/helper/cwd/managed-marker digests are recorded. Direct pinned-Node invocation intentionally bypasses only the installed shebang after `verify-existing` proved those exact helper bytes and readiness.

Child success requires successful stdin write plus `end`, both stdout/stderr EOFs, the child `close` event, `exitCode === 0`, `signal === null`, exact bounded stdout bytes `{}\n`, exact zero stderr, and no timeout or buffer overflow. Timeout/overflow kills the exact child and still drains/settles both pipes; no corruption can occur. `exit` alone is never a completion predicate.

After child success, the wrapper reruns exact diagnose and requires `reason:"OK"`, the same project/execution keys, exactly one new selected head and exactly one generation, and no other journal object. It reads the physical head/generation bytes, strictly parses their pinned schemas, requires their embedded identities/generation to match diagnose, and requires diagnose `headVersion`/`generationVersion` to equal the SHA-256 versions derived from those exact bytes. This fresh-root delta proves this child caused the selected generation; refresh/no-op/pre-existing selection cannot pass.

While the host still holds this PreCompact event and no other lane writer exists, the wrapper rechecks the expected head and generation path/version/digest, creates a same-directory corrupt temp with `O_CREAT|O_EXCL`, writes/fsyncs it, rechecks the expected-before head/generation again, atomically renames over only that generation, fsyncs the directory, and reads back the intentional corrupt bytes/digest. Any stale/no-op/head race, wrong path, unexpected object, or before-version mismatch prevents replacement. A separate create-only fault record binds every before/after byte/version and step timestamp; it is not the mutation guard. Only then does the wrapper emit the captured `{}\n` unchanged and exit 0. Any predicate mismatch emits no success output, exits nonzero, and is `FAULT_PROTOCOL_DRIFT`.

The normal managed SessionStart handler must then receive `source=compact`, detect the corrupt prepared generation, and return the exact `continue:false` schema/reason. After evidence capture the authority CAS-restores the exact prior PreCompact settings bytes, proves all foreign objects unchanged, and requires `hook status` ready. The corrupted journal is deliberately tainted and disposable; it is not described as reversible or reused. Other L0 lanes and L1-L3 retain the normal managed PreCompact entry and prove its real host execution.

H0 scheduler tests pin the exact host fixture/parser and enumerate: pre-existing head/generation, refresh/no-op, generation visible before child completion, child stall after final read-back, stdout/stderr bytes after `exit`, late pipe close, stdin error, signal, nonzero, missing/extra/reordered/overflow output, timeout racing close, helper/wrapper/env/cwd/stdin/marker/settings drift, mutation before `close`+EOF, stale head/generation CAS, wrong path, corruption failure, duplicate/delayed/invented debug rows, observer finishing first/last, and managed SessionStart failure. Only trace order `pre HANDOFF_NOT_FOUND/empty -> child close+EOF+exit-0/exact {} -> post OK/one fresh selected generation -> guarded corruption -> unchanged output -> real SessionStart halt` satisfies the case. The attestation says `acceptance_wrapper_delegated_precompact:true` and `direct_managed_precompact_registration:false` for this lane; other lanes prove direct registration. If this cannot be preserved without production changes, T3 is reopened or the lane is removed; debug identity inference is forbidden.

## Exact live cases and outcome oracles

### Common canary and next-action oracle

The runner generates distinct tokens for goal/task, constraint, evidence-backed decision, deliberate unknown reason, current prompt, exact next action, sibling/main forbidden value, transcript/privacy, and auth/privacy. Tokens appear in the raw lane spec only.

For L1-L3 it proves:

1. required tokens occur in pre-compaction transcript evidence and nowhere in the `/compact` input, deterministic pressure inputs, or PostCompact summary;
2. the first visible assistant message strictly after SessionStart(compact) contains every required exact token; a later response never repairs failure;
3. that same assistant message contains a Bash tool-use whose command exactly equals the machine-emitted `oracle act` command;
4. `oracle act` create-only writes the expected 0600 challenge result, and transcript tool-use/result plus file digest agree;
5. forbidden sibling/main values are absent; and
6. for L1 the prepared record is truncated below 8000 while current prompt and next action survive.

### L0

- Manual and auto PreCompact block: activate an unsafe lane journal before the event; require real matching PreCompact, candidate debug output with the exact content-free block reason, no compact SessionStart/PostCompact, no new model response attributable to compaction, and unchanged candidate/protected state.
- SessionStart halt: the sequential wrapper must prove exact candidate-helper exit-0/`{}\n`, then corruption, then unchanged output; require real SessionStart(source=compact), the normal managed SessionStart's exact `continue:false` content-free reason, no first post-compact assistant response within 15 seconds, restored settings/status ready, and a tainted/closed journal.
- Missing/non-executable/timeout helper: mutate only the lane installed prefix/settings as specified; require candidate `hook status` reports `rail_ready:false` with the exact launch-boundary reason, pinned-parser host evidence records missing/non-executable/10-second timeout behavior, and no receipt calls it candidate fail-closed execution. Restore/inventory the mutation before terminal finalization.
- `L0_AGGREGATE` PASS exists only when all six distinct subcases PASS on the same Q0/candidate/host tuple.

### Closed fault cleanup table

| Fault case | Mutated object | Evidence checkpoint | Terminal cleanup/state |
|---|---|---|---|
| manual/auto unsafe block | lane-local journal fixture | before/after journal digest, exact candidate block output, absent downstream events | journal retained tainted/closed; external state unchanged |
| SessionStart corruption | managed PreCompact settings entry, then exact lane generation | ready-before, unready-wrapper, child success, before/after generation, real halt | settings CAS-restored and ready; journal retained tainted/closed |
| missing helper | fresh installed-prefix helper pathname | status/host failure/inventory digests | exact bytes/mode/path restored; prefix tainted/closed |
| non-executable helper | fresh installed-prefix helper mode | status/host failure/inventory digests | exact mode restored; prefix tainted/closed |
| timeout helper | managed entry in isolated settings | pre/post settings and exact 10-second host outcome | exact settings CAS-restored and status ready; lane closed |

Every fault is lane-local. Evidence is captured before restoration. Cleanup uses expected-digest CAS; mismatch or failed restoration is `FAULT_CLEANUP_FAILED`, prevents a valid terminal sidecar, closes the campaign, and leaves the lane quarantined for manual inspection. No production candidate, real-user setting, or other lane is repaired or mutated.

### L1

One main session performs two real manual compactions. The first uses an oversized card and the common oracle. Stop must record response observation. The second requires a different selected generation, retention of the first generation, the same full main session identity, and a second valid first-response/action oracle. Foreign hooks/settings remain exact.

### L2

No manual preparation or `/compact` is sent. Bounded pressure must produce PreCompact(trigger=auto), SessionStart(source=compact), PostCompact(trigger=auto), first response, and Stop in order for one full main identity. The common oracle, project/execution continuity, private placement, and retained generation are mandatory.

### L3

The exact main prompt instructs one real sub-agent to consume the deterministic chunks and complete its machine-authored task. Require stable non-null full `agent_id` across PreCompact, SessionStart(compact), PostCompact, first response, and SubagentStop; no main/sibling canary; common first-response/action oracle; and sub-agent generation/observation under its exact identity. Fixture-only ids cannot PASS.

## Verdict and closed reasons

Verdicts are exactly `PASS`, `FAIL`, or `BLOCKED_PENDING_VERIFICATION`. PASS reason is `ALL_ASSERTIONS_SATISFIED` only.

BLOCKED reasons are limited to `PTY_UNAVAILABLE`, `BLOCKED_AUTH`, `PINNED_HOST_UNAVAILABLE`, `AUTO_COMPACTION_NOT_OBSERVED_WITHIN_BOUND`, and `SUBAGENT_COMPACTION_NOT_OBSERVED_WITHIN_BOUND`. They represent inability to exercise the required isolated host journey and stop shipping. `BLOCKED_AUTH` is the expected honest result until one valid isolated API-key path produces a real model response without protected-state drift.

FAIL reasons are closed: `REVIEW_REJECTED`, `QA_REJECTED`, `CANDIDATE_DRIFT`, `SOURCE_DRIFT`, `TOOLCHAIN_DRIFT`, `INSTALL_IDENTITY_MISMATCH`, `PREDECESSOR_INVALID`, `STALE_CAMPAIGN`, `REPLAY_OR_DUPLICATE_ATTEMPT`, `PROTECTED_STATE_CHANGED`, `AUTH_OR_CONTENT_LEAK`, `ACTION_PROTOCOL_DRIFT`, `FAULT_PROTOCOL_DRIFT`, `FAULT_CLEANUP_FAILED`, `TMUX_CLEANUP_FAILED`, `EVENT_EVIDENCE_MISSING`, `EVENT_SEQUENCE_INVALID`, `IDENTITY_CONTINUITY_INVALID`, `CANARY_PROVENANCE_INVALID`, `FIRST_RESPONSE_ORACLE_FAILED`, `NEXT_ACTION_ORACLE_FAILED`, `HANDOFF_STATE_ORACLE_FAILED`, `FOREIGN_HOOK_CHANGED`, `HOOK_OUTPUT_INVALID`, and `UNEXPECTED_MODEL_RESPONSE`.

Invalid schema/digest/predecessor input creates no attestation and exits with a content-free rejection. Once a real journey is invoked, missing downstream events after observed PreCompact, rejected hook output, wrong identity/generation, response after `continue:false`, privacy/global mutation, or oracle failure is FAIL, not BLOCKED.

## Protected snapshots and privacy

The shared snapshot algorithm records sorted relative path, type, uid, mode, symlink target, size, and streaming SHA-256 for every regular file in its declared bounded sets; absent/present is explicit. An unavailable, unreadable, over-limit, symlinked, wrong-owner, or structurally unexpected protected set is content-free prepare rejection `PROTECTED_SCOPE_UNAVAILABLE` **before** the attempt/consumption CAS and creates no attestation. It is not mapped to an undeclared BLOCKED reason. Pre/post protected sets are:

- immutable candidate tree;
- source worktree exact HEAD/tree/status/tracked modes;
- real user Claude `settings.json`, `settings.local.json`, global hook directory, and `~/.claude.json` outside relocated lane config (not unrelated transcript/history trees);
- real user Codex/OpenCode hook/config files and hook directories;
- real `~/.agentstate` credential files and `~/.agentstate/handoffs/v1`;
- real user npmrc bytes plus a closed real-npm-cache sentinel inventory: cache-root lstat, exact top-level name/type/uid/mode/size/mtime rows, and present/absent metadata for `_cacache`, `_cacache/index-v5`, `_cacache/content-v2`, `_logs`, and `_update-notifier-last-checked`; no recursive real-cache content hash;
- explicit outside-canary roots; and
- lane foreign settings bytes before fault activation and after restoration.

All acceptance-owned processes construct minimal allowlisted environments and lane-local homes/config/cache/prefix; exact host-spawned hooks have the honest transient auth allowance above. Npm env/argv must name only the lane cache; any real cache path is rejection. The runner recursively scans candidate, manifest/sidecar, campaign/lane files, process argv capture, action/debug/stdout/stderr, attestations, retained logs, and lane outputs for the real auth bytes plus distinct transcript/card/global/privacy canaries. Raw evidence is 0600 and stays in the lane. Candidate/attestation/errors remain content-free. A leak is FAIL and no PASS attestation is emitted.

## Red-first implementation graph and gates

| Unit | Role | Depends on | Work / exact gate |
|---|---|---|---|
| P35H | host-evidence owner | exact host note `sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb` | accept only the isolated exec-form/independent-stdin/parallel+join/passive/failure component PASS; record overall FAIL, real `~/.claude.json` drift, `BLOCKED_AUTH`, no first model response, and silent-handler identity NOT PROVEN; approve sequential wrapper, never debug identity inference |
| P35 | product/acceptance reviewer + adversarial skeptic | this exact Plan + P35H | both independently PASS before code |
| F0 | QA-infrastructure builder | P35 | add red manifest/path/mode/freeze transaction tests, including absent-leaf atomic create, existing-path refusal before build, real public `freeze` twice, and build/pack/copy/manifest/sidecar killpoints |
| F1 | candidate builder | F0 red | implement strict codec/filesystem/transactional one-build-one-pack freeze; F0 green only |
| V0 | verifier test builder | F1 | add red existing-tarball, exact top-level argv, shared pinned-npm forbidden install-script set, allowed `prepublishOnly`, implicit binding.gyp rejection, ignore-scripts canaries, dependency-free offline empty-cache success/no-network-dependency, no-source/no-output-mutation, alias/helper identity, and pre/post drift tests |
| V1 | verifier builder | V0 red | factor current npm primitives and implement `verify-existing`; current package verifier and V0 green |
| A0 | attestation QA builder | V1 | add red atomic owner-file+hard-link lock, exact ps/PID-reuse recovery, revision-zero/history-before-current/orphan/quarantine, serialized L0/concurrent prepare, replay/predecessor, strict R0-Q0 assertion, sidecar interruption, protected-sentinel, and privacy tests |
| A1 | attestation builder | A0 red | implement campaign/create-only assertion/prepare/finalize/verify chain and closed verdict mapping; A0 green |
| H0 | live-protocol QA builder | A1 | add red pinned-host fixture/parser, fake-Claude/tmux observer, pre/post-diagnose fresh-generation causation, child close+EOF/stdin/env/output and guarded-corruption scheduler, serialized L0, pre-tmux auth failure, inheritance canary, both tmux reservation states and every crash/reaper gap, per-fault cleanup, action/event/canary/response/timeout tests |
| H1 | live-harness builder | H0 red | implement repository-owned tmux runner, passive foreign observer, sequential wrapper, exact oracles, cleanup/reaper; remove T0 skeleton; H0 green |
| I35 | integrator | F1+V1+A1+H1 | only interface reconciliation; focused suites, privacy scans, CLI suite, typecheck/build, package/generator checks, full `npm run check`, clean intended diff |
| R35 | independent exact-SHA reviewer | I35 | review exact T3.5/T4 SHA; inspect real hard-link lock/history, both tmux reservation/reaper states, wrapper causation/close/CAS, auth inheritance canary, shared npm validator and candidate modes/bytes; sample install, make one lock/reaper or wrapper oracle red, and repeat only isolated host primitive smoke—no real/global auth fallback |
| G0 | candidate freezer | R35 PASS | permission-approved full gate on reviewed SHA, then exactly one successful `freeze`; post-seal `verify-existing`; hand off digest out of band |

Role independence is mandatory: no builder reviews their own unit. Review is a hard dependency before QA/live stages. Any T3.5 repair after R35 creates a new SHA and repeats R35. Any source/artifact/harness/manifest change after G0 restarts G0 -> R0 -> Q0 -> L0 -> L1 -> L2 -> L3.

## Measurable T3.5 acceptance

Before G0, all of the following must be green on the exact R35 SHA:

1. unknown/missing manifest, campaign/history, lock-owner, lane-spec, assertion, event, server-record, and attestation keys reject;
2. ancestor/symlink/escape/backslash/hard-link/extra-file/uid/mode attacks reject, and freeze alone atomically creates an absent target; any existing target rejects before build;
3. successful public freeze records exactly one npm-package build and one exact pack argv; second call and every partial path refuse without another build;
4. build-time tracked mutation, HEAD/tree/package/origin change, or interruption at build/pack/copy/manifest/sidecar publishes no valid sidecar;
5. one shared pinned-npm validator rejects the seven install-triggered script keys and implicit binding.gyp, allows current publish-only `prepublishOnly`, and real local-tarball install succeeds offline/empty-cache with no network dependency, absent script canaries, no source resolution, and unchanged outputs—without claims about network attempts or descendants;
6. fresh offline install reuses current package contract, both aliases resolve to one prefix helper, and exact identity/helper bytes agree;
7. byte or mode mutation between preflight/postflight for every candidate file and every pinned host/toolchain executable prevents PASS;
8. canonical lock is never partial; owner death/PID reuse/malformed ps/racing recovery cannot steal a live lock; history is durable before current, and orphan/current-missing crashes either recover identically or quarantine without advancement;
9. concurrent prepare, wrong/skipped/consumed/stale/cross-campaign predecessor, caller-selected/duplicate id or challenge, duplicate case, and incomplete L0 cannot advance; at most one L0 is live and it finalizes/reaps before the next opens;
10. empty/arbitrary/stale/cross-attempt R0/Q0 assertions reject; exact rubric rows and evidence bind current attempt/challenge/manifest/source/prefix, and attestations say only reviewer/QA asserted PASS;
11. interrupted assertion/attestation publication leaves no valid sidecar and closes the attempt;
12. the pinned 2.1.220 parser accepts only reviewed schemas and explicitly rejects invented debug shape, opaque-id/output/order handler identity, duplicates, and delayed/reordered records;
13. wrapper tests require pre-child HANDOFF_NOT_FOUND/empty inventory, stdin finish, both EOFs, close, exit-0/no signal/exact `{}\n`, post-child OK/one fresh byte-validated head+generation, and expected-before guarded corruption; stale/noop/race/wrong-path/late-output cases never mutate;
14. fake host proves exact argv/env/PTY action order and each action substitution/omission/reorder fails;
15. observer rows prove strict full identity/event schema and reject mixed/gapped/duplicate/reordered evidence;
16. canary in driving prompt/PostCompact, tokens only in a later response, mentioned-but-not-executed action, wrong tool command/result, and sibling/main leakage all fail;
17. every `RESERVED_NO_SERVER_RECORD`/`IDENTIFIED_SERVER` killpoint is reaped by exact private socket before bookkeeping; two cleanup passes leave no process/socket and a coherent terminal or quarantined non-advancing ledger;
18. missing/invalid auth before tmux and later auth/API failure close the open attempt/campaign as `BLOCKED_AUTH`; the nonsecret canary records inheritance without claiming secret scrubbing, and auth never serializes to argv/disk/log;
19. real HOME/global auth fallback and any real `~/.claude.json` or npm sentinel drift reject/fail; no first model response is claimed without live evidence;
20. fake L2/L3 pre-event inability maps only to closed BLOCKED reasons, post-PreCompact rail loss maps FAIL, protected/leak scans stay clean, existing suites and `npm run check` pass, and worktree/status/diff are clean.

Only then may the orchestrator record the exact reviewed SHA as `--expected-source-sha` and begin G0. T3.5 may repeat the isolated no-model host primitive smoke at R35, but no candidate lifecycle acceptance or L0-L3 claim occurs before the frozen R0/Q0/L0-L3 chain.
