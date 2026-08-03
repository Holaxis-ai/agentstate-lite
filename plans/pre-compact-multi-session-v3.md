---
type: Plan
title: 'Revision 3 implementation plan: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:29:30.906Z'
---
# Revision 3 implementation plan — compaction handoffs

**Status:** review-revised draft. No production code begins until this exact plan and `designs/pre-compact-multi-session` pass all three independent plan reviewers.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: implement and independently prove the revision-3 Claude Code pilot on a feature branch and one digest-pinned artifact; this serves the ultimate goal by making compaction recovery executable, identity-safe, private, and self-cleaning without relying on operator intuition.

## Frozen domain model

Builders must first read exact versions of:

- `context-notes/precompact-v3-orientation`;
- `context-notes/precompact-v3-live-rail-probe`;
- `context-notes/precompact-v3-host-identity`;
- `designs/pre-compact-multi-session`;
- this plan and its final plan-gate review.

The installed-host evidence, not inferred hook ordering, is the lifecycle contract. The domain is: canonical project identity; complete execution identity; mutable project/execution-scoped head; generation-addressed records; process-level CAS/read-back durability; deterministic evidence card; prepare/delivery transcript checkpoints; informational non-causal response observation; content-free diagnosis/recovery; hard logical expiry plus event-driven physical GC including final heads; and digest-pinned support evidence.

## Roles and dependency graph

| Unit | Owner role | Depends on | Parallel work | Deliverable / gate |
|---|---|---|---|---|
| P0 Plan review | product/acceptance reviewer, lifecycle reviewer, adversarial skeptic | revised design + plan | three independent reviews | unanimous PASS or every blocker resolved and re-reviewed |
| T0 Feedback harness | QA-infrastructure builder | P0 | none; first implementation unit | event/transcript/store/process/live harnesses and revision-2/plan-gate red probes |
| T1 Authority/journal | core builder | T0 frozen interfaces | T2 in separate worktree | identities, head/generations, schema, extraction, transitions, recovery, GC and tests |
| T2 Claude adapter/install | runtime builder | T0 frozen interfaces | T1 in separate worktree | hidden hook command, event mapping, SessionStart ordering, structural hook management/readiness and tests |
| T3 Integration | integrator | T1 + T2 | none | reconcile only frozen seams; integration, privacy, and package tests |
| T4 Docs/generated surfaces | docs builder | T2 behavior frozen | late T3 tests | source help/reference/skill updates and generated checks |
| G0 Candidate freeze | integrator | T3 + T4 | none | targeted suites, full `npm run check`, package proof, clean candidate commit, immutable manifest/digest |
| R0 Exact-artifact Review | independent non-builder reviewer | G0 | none | exact source SHA and package/helper/harness digest PASS; repairs restart G0/R0 |
| Q0 Adversarial QA | independent QA | R0 PASS | none | same manifest digest only; repairs restart G0/R0 |
| L0 Host negative rail | live verifier | Q0 PASS | none | same artifact: manual+auto Pre blocks, SessionStart halt, missing helper, timeout |
| L1 Manual main journey | live verifier | L0 PASS | none | same artifact: real manual compaction and second generation |
| L2 Automatic main journey | live verifier | L1 PASS | none | same artifact: real context-pressure compaction |
| L3 Sub-agent journey | live verifier | L2 PASS | none | same artifact: real sub-agent compaction through SubagentStop |
| S0 Ship handoff | orchestrator | L3 PASS | none | push branch, sync bundle, paste-ready PR title/body; user opens PR |

Review is a hard dependency before QA. QA is a hard dependency before every live gate. A source, package, helper, harness, or manifest change after G0 restarts G0 → R0 → Q0 → L0 → L1 → L2 → L3. No merge or deploy occurs here.

## T0 — feedback infrastructure before implementation

Create tests and interfaces before the production loop:

- exact installed payload fixtures for PreCompact, SessionStart startup/resume/compact, PostCompact, Stop, and SubagentStop;
- transcript fixtures with main/sub-agent identities, canonical project changes, current prompt, required observed/unknown card slots, Skill calls, malformed JSONL, huge tool output, controls, and exact 8,000-character truncation boundaries;
- injectable clock, UUID, journal root, project resolver, transcript checkpoint, helper runner, and receipt-chain validator;
- filesystem/process harnesses for head/generation CAS, parallel publishers, orphan publication, corruption, exact-version recovery, fixed-expiry head detachment, a stale-Stop assertion that observation leaves deletion time unchanged, and killpoints after each read/write/read-back/delivery/response-observation/GC boundary;
- settings golden tables, including the currently installed foreign SessionStart `printf` whose payload mentions `agentstate-lite`, with exact foreign-object/string preservation assertions;
- red probes reproducing revision 2 and the first plan failure: unsupported Pre/Post context, id8 collision, no project namespace, repeated create-only failure, impossible self-version, single-slot retention loss, stale response observation, stale deletion, no-ID fallback, unvalidated schema, substring hook ownership, no GC, and content-bearing diagnostics;
- an opt-in live harness confined below a fresh exact `/private/tmp` root, with fresh `CLAUDE_CONFIG_DIR`, project, journal root, manifest directory, PTY/auth preflight, sanitized receipts, and before/after path inventories;
- host-fault fixtures for blocking both manual and automatic PreCompact, compact SessionStart `continue:false`, missing/non-executable helper, and a bounded timeout.

T0 gate: red probes fail against the rejected behavior for their intended reasons; new fixture APIs are reviewed/frozen; no test touches user-global settings, the real journal, or shared board.

## T1 — private authority and journal

Expected seams (exact file split may change only at plan gate):

- `packages/cli/src/handoff/identity.ts`
- `packages/cli/src/handoff/schema.ts`
- `packages/cli/src/handoff/transcript.ts`
- `packages/cli/src/handoff/store.ts`
- `packages/cli/src/handoff/authority.ts`
- focused tests and process fixtures under `packages/cli/test/`

Reuse project resolution, typed validation, versioned filesystem operations, and the existing CAS lock; do not add a YAML parser or competing CAS engine. Initialize the internal journal under `credentialsDir()/handoffs/v1`, verify 0700/private/non-symlink boundaries, and exclude it from project discovery/catalog/sync.

Implement:

- canonical real bundle-root tuple → full project key;
- full runtime/session/agent tuple → full execution key;
- physical project/execution head plus generation UUID records, with byte comparison of both stored identities after every read;
- strict head/generation schemas with storage version carried only in receipts/CAS arguments, never persisted in self-addressed content;
- deterministic eight-slot observed/unknown card extraction and disclosed bounded render;
- prepare and delivery transcript checkpoints; prepared refresh; new generation publication through create-then-head-CAS; losing orphan handling; delivery CAS plus head recheck; PostCompact audit; transcript-checkpoint response observation that does not change delivery state; stale-resume refusal; and bounded GC that can CAS-detach a fixed-expiry final head;
- exact-target content-free diagnosis and `hook recover` that quarantines raw corrupt/expired state and detaches the head only under supplied head/generation versions;
- content-free receipts and reason codes.

Important invariants:

- a new generation never overwrites an old generation record;
- a current generation is never restorable after fixed expiry; on the next authority invocation GC must win an exact head CAS before deleting it, with no scheduled-deletion claim if the authority never runs again;
- Stop/SubagentStop records response evidence but cannot change delivery state, suppress resume redelivery, claim nonce consumption, or authorize replacement/deletion;
- response-observation metadata never changes a generation's fixed prepare-derived deletion eligibility;
- delivery/observation ambiguity leaves state recoverable;
- journal writes claim process-level atomic/read-back behavior, not fsync crash durability;
- a different resolved project with the same Claude execution tuple cannot read or mutate the old project state.

T1 gate: domain/unit tests, true cross-process contention, injected transition failures, modes/symlink/privacy checks, mutation survivors for key comparison/head races/stale observation/GC/recovery, and no content inspection surface.

## T2 — Claude adapter, managed hooks, and readiness

Extend `packages/cli/src/commands/hook.ts` with private `run`, health, exact diagnosis, and exact recovery paths. The adapter only parses payloads and maps authority outcomes to event-valid JSON:

- PreCompact success or blocking result;
- compact/resume SessionStart additionalContext or top-level `continue:false`;
- side-effect-safe PostCompact/Stop/SubagentStop output.

For compact SessionStart, and resume with an eligible handoff, return only the bounded handoff result: do not invoke board pull, network work, or home rendering in that process. Startup, clear, and resume with no eligible fresh handoff retain ordinary best-effort board orientation.

Replace substring ownership detection with one start-anchored new marker/token grammar plus explicitly enumerated anchored legacy executable/subcommand forms. The command writer and recognizer share one grammar. Install/status/uninstall must:

- manage exactly one entry for each of five Claude events;
- deduplicate/remove only structurally recognized managed entries;
- preserve foreign JSON subtrees and command-string bytes, especially the installed foreign `printf` containing `agentstate-lite` text;
- preserve and warn about foreign legacy Pre/Post scripts;
- refuse malformed settings;
- preserve Codex/OpenCode SessionStart board behavior while reporting their compaction rail unsupported.

Install and status invoke the exact configured helper with a minimal PATH and bounded health/schema probe. Readiness checks command path/digest, executable permission, timeout, five-event registration, foreign coexistence, and the resolved Claude executable realpath, SHA-256, reported version, platform, and architecture. Status values are `verified_host`, `installed_unverified`, `not_installed`, or `unsupported_runtime`; only the exact verified host tuple plus a healthy helper yields `rail_ready:true`. Launch/timeout failures are truthfully host-bound and never counted as executable fail-closed behavior.

T2 gate: pure golden transforms, on-disk idempotency/migration/uninstall tests, exact installed-foreign preservation, moved/missing/non-executable helper tests, minimal-PATH/package tests, schema-invalid output tests, and writer/recognizer agreement.

## T3/T4 — integration, documentation, and packaging

Integrate builder commits into the isolated feature worktree. Resolve only frozen interface seams; behavior changes return to the relevant builder and tests. Prove the observed order, prepared refresh after declined compaction, SessionStart-before-PostCompact, absence of board/network work on handoff paths, fresh resume redelivery, stale resume refusal, new-generation publication after delivery, fixed-expiry final-head cleanup, retained bounded history, and exact-project separation.

Privacy scans must prove no journal or quarantine content appears in `.agentstate-lite`, git, sync inputs, catalog, home output, stdout/stderr, receipts, status, or candidate manifest. Source-owned help/reference/skill text must state the verified-host boundary, process-level durability, unsupported runtimes, diagnosis/recovery, and live acceptance. Regenerate bot-owned artifacts only with repository generators.

T3/T4 gate: targeted CLI/core/domain/integration tests, typecheck/build, package verification, generated-artifact checks, no unintended global/project writes, and clean intended diff.

## G0 — full verification and immutable candidate

G0 must complete before Review:

1. run all focused suites, cross-process tests, privacy scans, generated checks, package verification, and the repository's complete `npm run check` with required listener permissions;
2. create a clean candidate commit on `feat/precompact-handoff-v3`;
3. build and pack once from that commit; copy the exact packed artifact/helper/harness into an isolated immutable candidate directory;
4. write a private sanitized manifest containing source commit, tarball SHA-256, CLI version identity, helper path/digest, harness source revision/digest, resolved Claude executable realpath/digest/reported-version/platform/architecture, and creation time;
5. compute the manifest SHA-256 and verify a clean reinstall reproduces its declared identities without rebuilding.

The candidate directory and manifest never contain handoff payloads, transcript text, auth material, or project paths beyond sanitized isolated roots. Every later report records the same manifest digest. Repacking, rebuilding, patching, or editing the harness invalidates it.

## R0 — independent exact-artifact Review

An independent reviewer who did not build the reviewed unit checks a detached clean worktree at the manifest's source SHA and installs the already-packed artifact. The review reports file/line evidence and verifies manifest fields/digests before inspecting behavior.

Minimum rubric:

- one authority; adapter/settings prose contain no identity, selection, transition, recovery, or GC policy;
- exact canonical project and execution keys plus byte comparisons after every read;
- no persisted self-version; head/generation CAS and retention are coherent under interrupted publication;
- declined prepare refresh, prepare/delivery checkpoint freshness, delivery/head recheck, and response observation are generation/version safe;
- Stop observation cannot change delivery state or redelivery policy; current heads are protected only until exact-CAS fixed expiry;
- decision-card observed/unknown provenance, priority truncation, and output bound;
- content-free, exact-version corrupt recovery;
- private modes/paths/redaction and no fsync overclaim;
- structural hook ownership, exact foreign preservation, readiness truth, no board/network work on compact/fresh-resume output, and exact-host support boundary;
- one sampled load-bearing test is made red and seen failing.

Any repair produces a new source/package/manifest digest and restarts G0 then R0 before QA.

## Q0 — adversarial QA of the reviewed artifact

QA uses only the manifest-pinned package/helper/harness. Attack:

- concurrent main sessions, sibling subagents, old-prefix collisions, same execution identity under different projects, hostile/control identities, and concurrent publication;
- corrupt head/generation/convention bytes, mismatches, orphan records, exact-version recovery conflicts, disk-full/unwritable roots, clock skew, unsafe ownership/symlinks, and killpoints;
- malformed/truncated/oversized transcripts and summaries; required observed/unknown card fields; current-prompt/next-action truncation priority;
- stale/retried delivery, declined-compaction transcript advance, fresh/stale resume, PostCompact, concurrent stale Stop/SubagentStop, response-observation non-effects (including unchanged deletion time), final-head expiry, and GC;
- missing/moved/non-executable/timed-out helper, partial legacy installs, foreign commands containing managed words, and malformed settings;
- unsupported/unverified runtime truth and leakage into board, git, sync, logs, receipts, status, manifest, or global paths.

Run network/listener tests with the required execution permission; sandbox `EPERM` is not a product verdict. QA rejects silent trusted continuation without a valid current generation, wrong-generation/project mutation, invalid hook JSON, unbounded context, unsafe recovery/GC, privacy leakage, foreign-hook mutation, or support overclaim.

## L0–L3 — exact-host live acceptance

All live tests use the same packed artifact and harness digest from G0, a fresh temporary `CLAUDE_CONFIG_DIR`, scratch project/bundle/journal, pinned PTY/auth preflight, unique session identities, sanitized event receipts, and before/after inventories. They never install into user-global settings. Each gate first verifies manifest SHA-256 and aborts on drift.

### L0 — negative rail

- Invoke real PreCompact failures through Claude for both `trigger:manual` and a context-pressure `trigger:auto`; prove each blocks/cancels compaction with the candidate's content-free reason.
- Inject a missing/corrupt current generation at real `SessionStart(source=compact)` and prove top-level `continue:false` yields no first post-compaction model response and no unverified premise.
- Exercise missing/non-executable helper and bounded timeout. Record exact Claude behavior, require `rail_ready:false`, and confirm these host launch boundaries are not reported as helper fail-closed success.

### L1 — manual main session

Place unique values only in pre-compaction transcript fields: goal/task, constraint, evidence-backed decision, deliberate unknown reason, current prompt, and exact next command. Ensure values are absent from the `/compact`-driving prompt and PostCompact summary. Require:

1. PreCompact prepares a valid exact-project/main generation;
2. compact SessionStart injects only the bounded card and runs no board/network/render work;
3. the **first** assistant response reproduces all required pre-only canaries and follows the next action;
4. Stop records unambiguous response observation;
5. a second real manual compaction publishes a different head generation while retaining the first.

At least one manual fixture is oversized and proves disclosed truncation below 8,000 characters while preserving current prompt and exact next command.

### L2 — automatic main session

Use bounded real context pressure and the verified host controls to trigger `PreCompact(trigger:auto)` without manual preparation. Use distinct pre-only values and the same first-response oracle. Prove SessionStart/PostCompact ordering, response observation, project/execution continuity, private placement, and generation retention.

### L3 — real sub-agent session

Launch a real Claude sub-agent, force a genuine compaction with the bounded context window, and require one stable non-null `agent_id` across PreCompact, SessionStart(compact), PostCompact, first post-compaction response, and SubagentStop. The first response must reproduce sub-agent-only card values and use its exact next action. A sibling/main canary must not appear. Fixture-only identities do not satisfy this gate.

If the installed host cannot produce any required live journey, verdict is `BLOCKED-PENDING-VERIFICATION`; shipping stops. FAIL includes rejected/ignored hook output, missing or out-of-order transition, first-response canary loss, wrong project/identity/generation, unsafe state mutation, foreign/global mutation, privacy leak, or manifest drift.

## Branch, board, and release discipline

Work remains on `feat/precompact-handoff-v3`, based on `origin/main` `138a3c7c756e5fdb883a84b3c10611f92253033e`. Builders use isolated worktrees and descriptive commits without AI attribution. The orchestrator does not commit board/bundle writes; those go through `aslite sync` at phase boundaries after agents finish writing.

After L3 PASS, push only the feature branch and provide a paste-ready PR title/body. The user owns PR creation and merge. No deployment or main-branch push is authorized.
