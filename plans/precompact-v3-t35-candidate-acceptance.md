---
type: Plan
title: Revision 3 T3.5 immutable candidate and executable acceptance rail
actor: codex-precompact-v3-t35-planner
timestamp: '2026-08-03T21:31:47.858Z'
---
# Revision 3 T3.5 plan — immutable candidate and executable acceptance rail

**Status:** review-revised implementation plan. G0 remains blocked. No T3.5 code starts until this exact Plan passes independent product/acceptance and adversarial-skeptic review. This plan incorporates the exact FAIL reviews `context-notes/precompact-v3-t35-plan-accept@sha256:e0bcd0091f6cc39b412b20a8cf4ea94bf4a20d2b822aea450997eed6316c7278` and `context-notes/precompact-v3-t35-plan-skeptic@sha256:552830be73f9e9a9cec0b949874e9c211efe248d7ebecbb7442860c0b4524dcd`.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make the transition from reviewed source to L3 PASS one replay-resistant executable chain over a single package/helper/harness identity; this serves the ultimate goal by making real compaction continuity an empirically adjudicated property rather than an operator convention.

## Frozen inputs and current fact correction

Implementation must read these exact accepted inputs before work:

- `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`;
- `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`;
- `context-notes/precompact-v3-orientation` at the version current when the builder claims work;
- the two FAIL reviews named above; and
- `context-notes/precompact-v3-g0-readiness@sha256:164c7868f43ae268184a6f4714c7236d7b3bc5cc997e2de6d57229d1acafd68e` as superseded background.

The readiness note's former behind-main fact is closed. At plan revision time, `origin/main` is an ancestor of the feature branch and `packages/cli/package.json` is `0.1.0-pre.3`. Current feature HEAD is `36c741a8173832d75d61a7ab138b5219c4415c66`; that is not the future freeze SHA. Freeze must receive the later exact T3.5/T4-reviewed SHA out of band.

T3.5 is test and acceptance infrastructure. It does not add a production helper receipt channel and does not change the five-event lifecycle authority. If implementation needs any `packages/cli/src/**` behavior change, new `hook diagnose` fields, different hook JSON, or a helper-side acceptance output, stop: the affected T3 production unit requires tests and renewed independent exact-SHA T3 review before this plan can resume.

## One executable authority and concrete file seams

One self-contained Node executable owns the acceptance rail:

- `scripts/handoff-candidate.mjs` — source executable and the exact file copied into every candidate as `harness/handoff-candidate.mjs`. It exports pure functions for tests, has an import guard, uses only Node built-ins, and implements `freeze`, `verify-existing`, `stage prepare`, `stage run`, `stage finalize`, `stage verify-attestation`, `observer record`, and `oracle act`. Copied mode refuses `freeze`.
- `scripts/verify-npm-package.mjs` — refactored to call the package-contract/environment/install primitives exported by `scripts/handoff-candidate.mjs`; it retains its current local/release build-and-pack entry points. There is no second npm install policy.
- `scripts/handoff-candidate.test.mjs` — schema, path, transaction, verifier, attestation, replay, privacy, passive-observer, state-machine, fake-PTY, and command-graph tests; add it explicitly to root `test:scripts`.
- `scripts/fixtures/handoff-candidate/fake-claude.mjs` — deterministic PTY host fixture emitting exact lifecycle, transcript, debug-log, timeout, and sub-agent shapes.
- `packages/cli/test/fixtures/handoff/live-harness.mjs` — removed after its T0 isolation tests are migrated to the one executable. It must not remain as a second apparent live authority.
- `packages/cli/test/handoff-harness.test.ts` and `packages/cli/test/support/handoff-harness.ts` — point their isolation/fault/receipt contracts at `scripts/handoff-candidate.mjs`; production authority tests remain unchanged.

The executable is the only writer of candidate manifests, lane specifications, raw observer rows, action logs, and stage attestations. Shell snippets, tmux conventions, reviewers, and prose cannot synthesize or amend those objects.

## Candidate manifest and filesystem contract

### Strict manifest schema

Canonical JSON is UTF-8, LF-terminated, recursively key-sorted, and rejects unknown or missing keys. Schema `agentstate-lite-handoff-candidate/v1` contains exactly:

- `schema`;
- `source`: `commit` (40 lowercase hex and equal to out-of-band reviewed SHA), `tree_oid`, `git_object_format`, `origin_main_commit`, `package_name`, `package_version`;
- `artifact.tarball`: normalized candidate-relative `path`, `sha256`, and normalized npm pack receipt (`filename`, SHA-1 `shasum`, SRI `integrity`, `size`, `unpacked_size`, and exact sorted file rows);
- `artifact.helper`: normalized relative `path`, `sha256`;
- `harness`: normalized relative `path`, copied bytes `sha256`, source Git blob OID;
- `host.claude`: realpath, SHA-256, reported version, platform, architecture, owner uid, regular-file mode;
- `toolchain.node`, `toolchain.npm`, `toolchain.tmux`, and `toolchain.git`: exact executable realpath, SHA-256, reported version; npm records the exact CLI file executed by the exact Node executable;
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

The root must be a new empty current-user-owned 0700 directory named `/private/tmp/aslite-precompact-v3-candidate.<random>`. The lstat chain is fixed: `/`, `/private`, and `/private/tmp` must be real root-owned directories, `/private/tmp` must have the sticky bit, and no component may be a symlink. Freeze refuses a nonempty or previously used root before invoking a build. Later verifiers require the final modes and full allowlist.

### Transactional freeze state machine

`freeze --candidate-root <root> --expected-source-sha <40hex> --claude-bin <exact-path>` has states `EMPTY -> BUILDING -> VALIDATED -> SEALED`; any interruption is `INVALID`.

1. `EMPTY`: require the exact empty root; exact HEAD equals expected SHA; tracked/untracked status empty; `origin/main` is an ancestor; capture HEAD, tree, package, tracked modes/content, toolchain, and host tuple.
2. `BUILDING`: create private subdirectories; invoke exactly once with exact argv the Node executable plus `packages/cli/build.mjs npm-package`; invoke exactly once the exact npm CLI through that Node executable with `npm pack --json --ignore-scripts --pack-destination <candidate>/artifacts` from `packages/cli`; copy (never link) final `dist/agentstate-lite.mjs` and `scripts/handoff-candidate.mjs`.
3. Re-check exact HEAD, tree, package, clean tracked/untracked status, `origin/main` ancestry, and tracked modes/content after generation/build/pack/copies. Any difference publishes neither manifest nor sidecar.
4. `VALIDATED`: validate npm receipt/file allowlist/runtime-dependency contract; hash all candidate bytes; run the same existing-package verifier against the staged tarball in a fresh external lane-local install root; compare both aliases and copied helper; validate the to-be-written canonical manifest.
5. Write `candidate.json` by same-directory temp+rename, then publish `candidate.sha256` last by temp+rename. Apply final modes directories-last; lstat/hash the complete allowlist again. Only then is state `SEALED` and a sanitized stdout freeze receipt emits manifest digest/source/artifact/harness/host hashes.

A crash or injected failure may leave private partial files, but no valid sidecar. Any nonempty root is permanently refused; a retry is a new G0 attempt with a new root. Calling `freeze` twice on one root must reject before a second build. No mutable receipt is stored in the candidate.

## One existing-package verifier, with pre/post enforcement

The factored verifier accepts only an already-existing tarball and cannot reach build, pack, test, package-verification, or source-import commands. It uses a strict command authority, and tests audit the complete descendant argv graph.

Every invocation creates a fresh external 0700 verification root with lane-local HOME, USERPROFILE, XDG config, npm prefix/cache, and empty npmrc. Environment is allowlisted; inherited `npm_config_*`, npm lifecycle/workspace settings, host PATH bins, and network defaults are removed. It invokes exact Node + exact npm CLI with:

```text
npm install --global --prefix <prefix> --offline --ignore-scripts --no-audit --no-fund <existing-tarball>
```

It validates the normalized pack receipt and exact tarball allowlist/runtime-dependency contract. Both `aslite` and `agentstate-lite` must resolve inside the prefix to the same installed `dist/agentstate-lite.mjs`; no host PATH fallback is possible. Both aliases execute `version --json` and must agree on package/version, reviewed source SHA, `dirty:false`, `npm-package`, artifact SHA, runtime realpath, and compatibility contracts. Installed bytes must equal the copied helper.

`verify-existing` snapshots candidate and pinned host/toolchain immediately before verification and immediately afterward. Every `stage prepare` calls it into a fresh prefix; `stage run` repeats byte/mode/host checks immediately before launch; `stage finalize` calls it again into a different fresh prefix immediately before any PASS. Mid-stage mutation of manifest, tarball, helper, harness, mode/tree, Claude, Node, npm, tmux, or git prevents PASS.

## Replay-resistant stage and attestation chain

### Closed stage/case set

Stages are `R0`, `Q0`, `L0`, `L1`, `L2`, `L3`. Cases are:

- `R0_EXACT_ARTIFACT_REVIEW`;
- `Q0_ADVERSARIAL_ARTIFACT_QA`;
- `L0_PRECOMPACT_MANUAL_BLOCK`, `L0_PRECOMPACT_AUTO_BLOCK`, `L0_SESSIONSTART_CONTINUE_FALSE`, `L0_MISSING_HELPER`, `L0_NONEXECUTABLE_HELPER`, `L0_HELPER_TIMEOUT`, and `L0_AGGREGATE`;
- `L1_MANUAL_MAIN_TWO_GENERATIONS_OVERSIZED`;
- `L2_AUTOMATIC_MAIN`;
- `L3_REAL_SUBAGENT`.

R0 has no predecessor. Q0 requires exact R0 PASS. Each L0 subcase requires exact Q0 PASS; `L0_AGGREGATE` requires the Q0 digest and exactly one distinct PASS for all six subcases. L1 requires the aggregate, L2 requires L1, and L3 requires L2.

### Lane spec

`stage prepare` requires a fresh lane root, stage/case, a caller-generated UUIDv4 attempt id, out-of-band manifest digest, and exact predecessor attestation paths/digests. It verifies the chain and creates one 0600 canonical `agentstate-lite-handoff-lane-spec/v1` containing:

- stage/case, attempt id, a runner-generated 256-bit challenge and its digest, manifest/source/artifact/harness/host hashes, predecessor digests;
- exact isolated directory layout and its path hash;
- exact Claude realpath/argv, cwd, allowlisted environment names, installed prefix helper, settings digest, session UUID, nullable expected agent identity rule, time/turn/pressure bounds;
- ordered actions with sequence, prerequisite evidence predicate, exact input bytes/argv, deadline, expected/forbidden next states;
- exact reversible fault transitions;
- lane-unique canaries, forbidden canaries, exact compaction-driving input, exact next-action argv/command, and expected structural result;
- required event sequence and all oracles.

Raw spec values remain 0600 in the lane. The sanitized attestation exposes only their digest and booleans/counts/hashes.

### Stage attestation

`stage finalize` creates once, outside the candidate, canonical `agentstate-lite-handoff-stage-attestation/v1` plus sidecar. It binds stage/case, attempt id, challenge digest, manifest/source/tarball/helper/harness/host/toolchain digests, predecessor digests, lane-root hash, pre/post installed-prefix inventory digests, lane-spec/action-log/raw-evidence/event-sequence/protected-snapshot digests, verdict, closed reason, and UTC completion time. It contains no absolute lane path or raw identity/content/auth.

An attempt id is create-only. A finalized or previously opened attempt cannot be reused. `stage verify-attestation` rejects wrong or missing predecessor, skipped stage, duplicate L0 case, same-lane replay, cross-manifest/case copy, duplicate attempt/challenge, missing/duplicate/reordered event ids, artifact/host drift, and any mutable/unknown field. A later stage starts only from the exact predecessor PASS digest supplied out of band.

R0 source review is read-only at the manifest SHA. The stage runner emits the exact checkout/read commands and candidate-facing empirical actions. R0's structured reviewer finding file may carry file/line evidence and PASS/FAIL, but the runner owns its digest and attestation. Q0 and every executable R0/Q0 attack resolve the helper only from the fresh installed prefix; no TypeScript import, `dist` rebuild, or source helper is accepted. R0's required red sample mutates an oracle fixture against installed candidate evidence and observes the oracle fail; it does not rebuild source.

## Repository-owned real-Claude PTY protocol

Private operation is limited to providing exactly one allowed auth variable (`ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`) and invoking the machine-emitted `stage` commands. The executable itself owns tmux, prompts, `/compact`, pressure, sub-agent instructions, faults, capture, timeouts, and cleanup. No human chooses timing, wording, command, or evidence.

`stage run` creates a dedicated tmux server socket below the lane using the manifest-pinned tmux realpath. It launches the manifest-pinned Claude realpath, never PATH, with exact argv:

```text
--session-id <lane-session-uuid>
--debug-file <lane>/raw/claude-debug.log
--ax-screen-reader
--dangerously-skip-permissions
```

It runs from the isolated project with relocated HOME/USERPROFILE/XDG/CLAUDE_CONFIG_DIR/CODEX_HOME/OpenCode root, lane journal, `AGENTSTATE_LITE_NO_AUTOPULL=1`, and only the stage-declared compaction controls. Auth is injected only into the final tmux/Claude process environment, never arguments/spec/log/receipt. Tmux pane bytes, Claude debug bytes, transcript JSONL, observer rows, journal evidence, and action log remain 0600 under `raw/`.

For auto cases, the exact environment is `CLAUDE_CODE_AUTO_COMPACT_WINDOW=5000` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=10`, the controls that produced the accepted installed-host probe. The pressure fixture is 32 deterministic 4096-byte chunks. The runner sends at most 24 pressure actions and waits at most 240 seconds for main auto compaction. L3 gives a real sub-agent the machine-authored prompt and chunk work under the same bounded window, allowing at most 40 tool actions and 300 seconds. Failure to observe any PreCompact within those bounds is BLOCKED; observing PreCompact and then violating the rail is FAIL.

The runner advances only when machine predicates over observer/debug/transcript/action evidence pass. Omitted, substituted, or reordered PTY input is `ACTION_PROTOCOL_DRIFT`. It kills its dedicated tmux server at terminal state and never attaches to another server/session.

## Chosen passive event producer

The evidence producer is explicitly **lane-local foreign observer hooks**, not a production helper side channel.

After the isolated installed candidate runs `aslite hook install --scope project`, `stage prepare` structurally adds one foreign exec-form handler for PreCompact, SessionStart, PostCompact, Stop, and SubagentStop. Each uses exact pinned Node as `command` and exact candidate `harness/handoff-candidate.mjs observer record ...` argv; there is no shell. Managed reinstall/status must preserve these foreign objects byte-for-byte.

Claude's official hook contract states that matching handlers run in parallel and the host waits for every matching handler before merging outputs and advancing. Therefore observer order within one event is not used to order the managed sibling, but one observer durably records before returning and the monotonic rows across distinct lifecycle events preserve host order. The prior real probe separately established `PreCompact -> SessionStart(compact) -> PostCompact -> first response -> Stop`. See [Claude Code hook execution](https://code.claude.com/docs/en/hooks-guide).

The observer reads exact stdin bytes, returns no stdout/stderr and exit 0, and never changes journal/settings/transcript. Under a lane-local exclusive sequence lock it writes a 0600 raw input file and 0600 strict metadata with UUID event id, monotonic integer sequence, event/source/trigger, full session id, nullable full agent id, canonical transcript realpath and byte checkpoint/hash, hook-input digest, manifest digest, attempt/lane ids, producer realpath/digest, and Node digest. Finalization computes each raw-record digest and the ordered aggregate. Observer failure remains passive but makes finalization FAIL `EVENT_EVIDENCE_MISSING`.

Because observer and managed hook are parallel, observer rows prove host event occurrence, not managed completion. Managed effect is independently corroborated by Claude debug hook output, exact transcript checkpoints, installed-helper status/diagnosis, and content-addressed private journal bytes. For the oversized oracle, finalization uses diagnose's exact generation/version to read only that 0600 lane generation, requires its byte hash/version, `truncated:true`, `renderedLength === renderedBody.length < 8000`, and literal current-prompt/next-action presence. No journal content enters an attestation.

Fault injection is a separate, explicitly named foreign fault handler only for `L0_SESSIONSTART_CONTINUE_FALSE`: it runs in parallel with PreCompact, waits boundedly for the candidate-managed generation, removes/corrupts that exact lane-local generation after prepare read-back, records its mutation, and returns before the host advances. This is deterministic because the host waits for all sibling handlers. It is not the passive recorder and exists in no other lane.

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
- SessionStart halt: successful candidate PreCompact plus the lane-local fault handler, then require SessionStart(source=compact), debug output `continue:false` with content-free reason, no first post-compact assistant response within 15 seconds, and no unverified premise.
- Missing/non-executable/timeout helper: mutate only the lane installed prefix/settings as specified; require candidate `hook status` reports `rail_ready:false` with the exact launch-boundary reason, Claude debug evidence records missing/non-executable/10-second timeout behavior, and no receipt calls it candidate fail-closed execution. Restore/inventory the mutation.
- `L0_AGGREGATE` PASS exists only when all six distinct subcases PASS on the same Q0/candidate/host tuple.

### L1

One main session performs two real manual compactions. The first uses an oversized card and the common oracle. Stop must record response observation. The second requires a different selected generation, retention of the first generation, the same full main session identity, and a second valid first-response/action oracle. Foreign hooks/settings remain exact.

### L2

No manual preparation or `/compact` is sent. Bounded pressure must produce PreCompact(trigger=auto), SessionStart(source=compact), PostCompact(trigger=auto), first response, and Stop in order for one full main identity. The common oracle, project/execution continuity, private placement, and retained generation are mandatory.

### L3

The exact main prompt instructs one real sub-agent to consume the deterministic chunks and complete its machine-authored task. Require stable non-null full `agent_id` across PreCompact, SessionStart(compact), PostCompact, first response, and SubagentStop; no main/sibling canary; common first-response/action oracle; and sub-agent generation/observation under its exact identity. Fixture-only ids cannot PASS.

## Verdict and closed reasons

Verdicts are exactly `PASS`, `FAIL`, or `BLOCKED_PENDING_VERIFICATION`. PASS reason is `ALL_ASSERTIONS_SATISFIED` only.

BLOCKED reasons are limited to `PTY_UNAVAILABLE`, `AUTH_UNAVAILABLE`, `PINNED_HOST_UNAVAILABLE`, `AUTO_COMPACTION_NOT_OBSERVED_WITHIN_BOUND`, and `SUBAGENT_COMPACTION_NOT_OBSERVED_WITHIN_BOUND`. They represent inability to exercise the required host journey and stop shipping.

FAIL reasons are closed: `REVIEW_REJECTED`, `QA_REJECTED`, `CANDIDATE_DRIFT`, `SOURCE_DRIFT`, `TOOLCHAIN_DRIFT`, `INSTALL_IDENTITY_MISMATCH`, `PREDECESSOR_INVALID`, `REPLAY_OR_DUPLICATE_ATTEMPT`, `PROTECTED_STATE_CHANGED`, `AUTH_OR_CONTENT_LEAK`, `ACTION_PROTOCOL_DRIFT`, `FAULT_PROTOCOL_DRIFT`, `EVENT_EVIDENCE_MISSING`, `EVENT_SEQUENCE_INVALID`, `IDENTITY_CONTINUITY_INVALID`, `CANARY_PROVENANCE_INVALID`, `FIRST_RESPONSE_ORACLE_FAILED`, `NEXT_ACTION_ORACLE_FAILED`, `HANDOFF_STATE_ORACLE_FAILED`, `FOREIGN_HOOK_CHANGED`, `HOOK_OUTPUT_INVALID`, and `UNEXPECTED_MODEL_RESPONSE`.

Invalid schema/digest/predecessor input creates no attestation and exits with a content-free rejection. Once a real journey is invoked, missing downstream events after observed PreCompact, rejected hook output, wrong identity/generation, response after `continue:false`, privacy/global mutation, or oracle failure is FAIL, not BLOCKED.

## Protected snapshots and privacy

The shared snapshot algorithm records sorted relative path, type, uid, mode, symlink target, size, and streaming SHA-256 for every regular file; absent/present is explicit. It refuses more than 500,000 entries or 10 GiB with BLOCKED before launch. Pre/post protected sets are:

- immutable candidate tree;
- source worktree exact HEAD/tree/status/tracked modes;
- real user Claude `settings.json`, `settings.local.json`, global hook directory, and `~/.claude.json` outside relocated lane config (not unrelated transcript/history trees);
- real user Codex/OpenCode hook/config files and hook directories;
- real `~/.agentstate` credential files and `~/.agentstate/handoffs/v1`;
- real user npmrc plus the complete real npm cache root;
- explicit outside-canary roots; and
- lane foreign settings bytes before fault activation and after restoration.

All npm/helper/Claude processes receive minimal allowlisted environments and lane-local homes/config/cache/prefix. Exactly one real auth value is held in memory and injected only at final Claude spawn. The runner recursively scans candidate, manifest/sidecar, action/debug/stdout/stderr, attestations, retained logs, and lane outputs for the real auth bytes plus distinct transcript/card/global/privacy canaries. Raw evidence is 0600 and stays in the lane. Candidate/attestation/errors remain content-free. A leak is FAIL and no PASS attestation is emitted.

## Red-first implementation graph and gates

| Unit | Role | Depends on | Work / exact gate |
|---|---|---|---|
| P35 | product/acceptance reviewer + adversarial skeptic | this exact Plan | both independently PASS before code |
| F0 | QA-infrastructure builder | P35 | add red manifest/path/mode/freeze transaction tests, including real public `freeze` twice and failure at build/pack/copy/manifest/sidecar boundaries |
| F1 | candidate builder | F0 red | implement strict codec/filesystem/transactional one-build-one-pack freeze; F0 green only |
| V0 | verifier test builder | F1 | add red existing-tarball, descendant zero-build, isolated npm, alias/helper identity, and pre/post drift tests |
| V1 | verifier builder | V0 red | factor current npm primitives and implement `verify-existing`; current package verifier and V0 green |
| A0 | attestation QA builder | V1 | add red strict lane/attestation/predecessor/replay/L0-aggregate/protected-snapshot/privacy tests |
| A1 | attestation builder | A0 red | implement prepare/finalize/verify chain and closed verdict mapping; A0 green |
| H0 | live-protocol QA builder | A1 | add red fake-Claude/tmux observer, action substitution/reorder, fault timing, event mix/gap/duplicate/order, canary provenance, first-response, next-action, auto timeout, and sub-agent timeout tests |
| H1 | live-harness builder | H0 red | implement repository-owned tmux runner, passive foreign observer, fault handler, exact oracles, cleanup; remove T0 skeleton; H0 green |
| I35 | integrator | F1+V1+A1+H1 | only interface reconciliation; focused suites, privacy scans, CLI suite, typecheck/build, package/generator checks, full `npm run check`, clean intended diff |
| R35 | independent exact-SHA reviewer | I35 | review exact T3.5/T4 SHA; inspect real command graph and candidate modes/bytes; sample existing-package install and make one oracle fixture red |
| G0 | candidate freezer | R35 PASS | permission-approved full gate on reviewed SHA, then exactly one successful `freeze`; post-seal `verify-existing`; hand off digest out of band |

Role independence is mandatory: no builder reviews their own unit. Review is a hard dependency before QA/live stages. Any T3.5 repair after R35 creates a new SHA and repeats R35. Any source/artifact/harness/manifest change after G0 restarts G0 -> R0 -> Q0 -> L0 -> L1 -> L2 -> L3.

## Measurable T3.5 acceptance

Before G0, all of the following must be green on the exact R35 SHA:

1. unknown/missing manifest, lane-spec, event, and attestation keys reject;
2. root ancestor/symlink/escape/backslash/hard-link/extra-file/uid/mode attacks reject;
3. a successful public freeze records exactly one npm-package build and one exact pack argv; second call on the root and every partial root refuse without another build;
4. build-time tracked mutation, HEAD/tree/package/origin change, or interruption publishes no valid sidecar;
5. verify/stage descendants contain zero build/pack/test/package-verification/source-helper commands;
6. fresh offline install reuses current package contract, both aliases resolve to one prefix helper, and exact identity/helper bytes agree;
7. byte or mode mutation between preflight/postflight for every candidate file and every pinned host/toolchain executable prevents PASS;
8. wrong/skipped/replayed/cross-manifest predecessor, duplicate attempt/challenge/case, and incomplete L0 cannot advance;
9. fake host proves exact argv/env/PTY action order and each action substitution/omission/reorder fails;
10. observer rows prove strict full identity/event schema and reject mixed/gapped/duplicate/reordered evidence;
11. canary in driving prompt/PostCompact, tokens only in later response, mentioned-but-not-executed action, wrong tool command/result, and sibling/main leakage all fail;
12. inability to trigger fake L2/L3 within bounds maps only to BLOCKED reasons; post-PreCompact rail loss maps FAIL;
13. success and every injected failure leave protected snapshots identical and leak scans clean;
14. existing handoff authority/lifecycle/process/rejected-contract suites remain green, full CLI suite passes, `npm run check` passes with its own exit code, and worktree/status/diff are clean.

Only then may the orchestrator record the exact reviewed SHA as `--expected-source-sha` and begin G0. No live Claude run is part of T3.5 implementation; real-host evidence begins only through the frozen R0/Q0/L0-L3 chain.
