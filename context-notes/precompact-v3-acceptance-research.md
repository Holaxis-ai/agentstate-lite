---
type: Context Note
title: 'Revision 3 acceptance research: compaction handoffs'
actor: codex-precompact-v3-acceptance
timestamp: '2026-08-03T17:43:43.739Z'
---
# Summary

status: completed

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: turn the revision-2 failure record into an executable revision-3 acceptance contract and dependency-ordered backlog; this serves the ultimate goal by making the compaction boundary independently buildable, reviewable, and adjudicable without trusting prose or component-only tests.

Decision card: ship a Claude Code-only pilot with one lifecycle authority, one managed runtime adapter, and a private per-machine handoff journal. No merge or release is acceptable without exact-installed-artifact manual AND automatic compaction evidence. Revision 2 remains rejected; none of its proposed global CLAUDE.md or handwritten hook diffs may be applied.

Current host observation (2026-08-03): Claude Code `2.1.220` is installed. The global configuration still has the legacy handwritten PreCompact/PostCompact scripts and an older SessionStart `printf` hook. The installed marketplace aslite reports Claude configured, Codex/OpenCode unconfigured; that is observation, not revision-3 evidence.

# Problem statement

## Bounded outcome

Deliver one managed Claude Code compaction-handoff rail that, for a main session or subagent:

1. derives one canonical execution identity from runtime namespace + full `session_id` + full `agent_id` when present;
2. persists a validated, immutable compaction generation and a recoverable pre-compaction checkpoint before compaction is allowed to proceed;
3. finalizes the generation from the supported PostCompact payload, including `compact_summary`, without treating PostCompact as a context-injection point;
4. restores only the exact full-identity generation through `SessionStart` with `source: compact`;
5. records delivery, then acknowledges availability to a completed model turn through a real later lifecycle event;
6. retires/collects only the exact generation/version through CAS, never by unconditional deletion; and
7. emits structured receipts at every transition so a human can see, stop, retry, and adjudicate the rail.

The state machine is `prepared -> finalized -> delivered -> acknowledged -> gc-eligible -> deleted`, with explicit `invalid` and `abandoned` states. Every transition is compare-and-swap guarded. A digest may name a file, but the full canonical identity is stored and compared on every read. Actor and coordination role are advisory metadata, not identity proofs.

## Executable acknowledgement

`SessionStart(source=compact)` reads the exact finalized generation, verifies full identity and version, emits it as model context, creates a delivery token, and CAS-transitions `finalized -> delivered`. The first subsequent `Stop` event for a main session, or `SubagentStop` for a subagent, must present the same runtime identity and delivery token from the local journal and CAS-transition `delivered -> acknowledged`. That later event proves a model turn completed after the SessionStart delivery boundary. It does not claim semantic understanding; the live canary separately proves the first post-compaction turn used the decision card.

If the process stops after delivery but before Stop/SubagentStop, the generation remains delivered-but-unacknowledged and is redelivered on resume. If it stops after acknowledgement, the acknowledgement receipt persists until bounded GC. No eager hard delete occurs.

## Firm placement recommendation

Store ephemeral handoff generations in a per-machine private journal under `~/.agentstate/handoffs/v1/`, with directory mode 0700 and record/blob mode 0600. Reuse the project’s CAS/mutation primitives, but never place these records in `.agentstate-lite/` and never send them through `aslite sync`.

Reason: compaction summaries and transcript recovery material can contain prompts, absolute paths, unpublished findings, or secrets. This project’s board may be shared publicly; putting ephemeral handoffs there adds privacy exposure, board conflicts, cross-host identity, and remote GC semantics to a unit whose claim is host-local session recovery. Store a project/bundle locator or digest in the private record; promote durable decisions into the project bundle through the normal attributed workflow. Cross-machine resume is explicitly unsupported in this pilot and is a future design, not an accidental partial feature.

## Non-goals

- No Codex or OpenCode compaction adapter; status must say `unsupported`, not imply parity.
- No public `aslite handoff` UX is required; a private subcommand/authority is sufficient.
- No board sync, cross-machine restore, remote handoff backend, orchestrator lease, or actor authentication.
- No transcript summarizer, second Markdown parser, second CAS implementation, or raw-YAML correctness boundary.
- No proof that the model semantically understood every restored fact; prove delivery plus a bounded live canary.
- No global hook mutation during build/review. Live installation uses an isolated Claude config first; user-global upgrade requires explicit operator action after the candidate passes.
- No marketplace manifest version bump or committed plugin-bundle rebuild in the PR; those remain bot-owned on merge.

# Required record and receipt contracts

The validated record must carry: schema version; runtime; full session id; full subagent id or null; canonical identity and path-safe digest; immutable generation id; trigger (`manual|auto`); cwd/project locator; transcript snapshot/hash or other explicitly chosen recoverable pre-compaction checkpoint; compact summary; decision-card fields (goal/task refs, last completed/current state, decisions with evidence, constraints/non-goals, blockers/open questions, loaded skills, exact next action); actor nullable; execution class derived mechanically (`main|subagent`); coordination role nullable; created/finalized/delivered/acknowledged/expires timestamps; state; and current version.

Every machine-readable receipt uses `aslite.compaction-handoff-receipt.v1` and includes: source commit; artifact SHA-256; Claude version; runtime; hook event; trigger; identity digest; generation id; record version; prior/new state; result/reason code; timestamp; journal class (`host-local-private`); and delivery-token digest when applicable. Receipts never include raw transcript, raw compact summary, full identity, or secrets in review/CI artifacts.

# Acceptance matrix

| Scenario | Expected result | Required evidence | Gate stage |
|---|---|---|---|
| First manual main compaction | PreCompact creates a validated immutable generation and durable write receipt before allowing compaction; PostCompact finalizes from its supported payload; SessionStart compact delivers exact context; first Stop acknowledges it. | Event/receipt sequence with one generation id and monotonic versions; canary decision card visible and used in first post-compact turn. | Adapter integration + live manual |
| First automatic main compaction | Same state sequence as manual with `trigger:auto`; no manual command or file edit prepares/restores it. | Installed-host transcript plus sanitized receipts proving actual auto trigger, not `/compact`. | Live automatic, distinct gate |
| Repeated compaction in one session | Each compaction creates a new immutable generation; generation N+1 cannot be blocked by or confused with N; only its own delivery is acknowledged. | Two complete sequences, distinct generation ids, exact current-pointer/CAS receipts, no ALREADY_EXISTS or stale restore. | Component + live manual repeat |
| Two concurrent main sessions | Full session identities create disjoint records and pointers; both restore their own canaries with no overwrite, sync conflict, or human selection. | Two simultaneously running installed Claude sessions; interleaved receipt log grouped by identity digest. | Adversarial QA + live concurrency |
| Concurrent main and subagent / sibling subagents | Canonical identity includes full parent session and full `agent_id`; main and each subagent remain disjoint; main Stop and subagent SubagentStop acknowledge only their own delivery. | Agreement table and a live or real-runtime harness with one main plus at least two subagents; exact identity comparisons. | Adapter integration + adversarial QA/live |
| Old-prefix collision adversary | IDs sharing the first 8/16 characters still produce distinct keys and restore correctly. | Deterministic fixture using `deadbeef-...` identities; red probe proving an id8 implementation fails the test. | Unit + exact-SHA review |
| Digest/path collision or identity mismatch | A key hit whose stored full identity differs from live identity fails closed; no content is exposed or overwritten. | Mocked digest collision/path-adversary test and structured `IDENTITY_MISMATCH` receipt. | Unit + adversarial QA |
| Stale consumer | A delivery/ack/GC operation carrying version V1 cannot alter generation at V2; the newer generation survives. | Multi-process CAS trace with `STALE_HEAD`/equivalent and a read proving V2 remains. | Unit + adversarial QA |
| Crash after prepare, before host compaction | Prepared generation remains recoverable/inspectable; retry is idempotent or creates a safely related new generation; compaction never silently proceeds after a failed durable prepare. | Fault-injection receipt and retry trace. | Fault harness + QA |
| Crash after compaction, before PostCompact finalize | Prepared record and transcript/checkpoint remain; next supported event reports incomplete state and does not present it as finalized decision-card context. | Killpoint trace and recovery/diagnostic receipt. | Fault harness + QA |
| Crash after finalize, before SessionStart delivery | Finalized generation is delivered on next compact/resume SessionStart for exact identity. | Killpoint trace; subsequent delivery receipt. | Fault harness + QA |
| Crash after delivery, before Stop/SubagentStop | Record remains delivered-unacknowledged and is safely redelivered; it is not GC’d as consumed. | Killpoint trace, repeated delivery count/token rotation policy, eventual acknowledgement. | Fault harness + QA/live |
| Crash after acknowledgement, before GC | Acknowledgement receipt remains; no redelivery; later bounded GC removes exact version only. | Killpoint and fake-clock GC trace. | Fault harness + QA |
| Malformed hook JSON/payload | Invalid JSON, wrong event, non-scalar/empty/whitespace identity, path-like ids, invalid trigger, oversize summary, invalid timestamps, or missing required decision-card fields never enter the trusted restore set. PreCompact blocks when safe checkpoint identity/persistence is impossible; later events emit explicit invalid diagnostics. | Per-field table tests, size-bound tests, structured reason codes, zero trusted writes. | Unit/agreement + QA |
| Missing dependency or moved executable | Adapter has no `jq`, GNU/BSD date, hostname, or PATH dependency beyond the managed executable/Node contract. Missing executable/runtime is reported by status and PreCompact fails closed rather than silently compacting. | Minimal-PATH installed-tarball test, absence of shell parsing, broken-command live/scratch probe. | Packaging + QA |
| Actor absent | Exact identity path still works; record stores actor null and status says unconfigured. Actor absence never collapses identities or activates fallback selection. | Unit and live payload without `AGENTSTATE_LITE_ACTOR`. | Unit + live manual |
| Role absent | Execution class derives from `agent_id` presence; coordination role remains null. Orchestrator discovery is not part of restore correctness. | Main/subagent fixtures with no manual role substitution. | Unit/agreement |
| Runtime identity absent | Automatic restore is disabled and PreCompact blocks; candidates are never auto-selected by recency, actor, hostname, or count=1. | Missing-id and singleton-candidate adversarial tests with explicit user-visible refusal. | Unit + QA |
| Expiry and GC | Expired records are excluded from restore. A named bounded sweep, invoked at SessionStart and explicit diagnostics, CAS-deletes only eligible exact versions; unacknowledged retention is 7 days and acknowledged diagnostic retention defaults to 24h. Clock-skew/invalid-date inputs fail closed. | Fake-clock boundary table, two-process stale GC attack, sweep receipt with examined/deleted/skipped counts. | Unit + QA |
| Board/local placement | No handoff record, blob, or receipt appears under project `.agentstate-lite/`, git diff, board branch, or sync change set; private path modes are 0700/0600. | Filesystem/sync integration proof and permissions/stat receipt. | Integration + exact-SHA review |
| Hook install/upgrade/status | Managed install atomically owns Claude PreCompact, PostCompact, SessionStart compact, Stop, and SubagentStop entries; upgrades the exact legacy shapes; preserves foreign hooks; reinstall is idempotent; uninstall removes only managed entries. Status reports installed version/command, stale/partial state, private journal path class, Claude supported, Codex/OpenCode unsupported. | Before/after golden configurations including current legacy scripts, duplicates, foreign hooks, malformed files, partial writes, reinstall/uninstall. | Unit + packaging + live preflight |
| Manual compaction | Exact installed candidate on Claude Code 2.1.220 or later runs `/compact`, emits all receipts, restores canary, acknowledges after first Stop, and leaves no active-session/global contamination in isolated harness. | `live-manual/manifest.json`, sanitized events/receipts, first-turn assertion, hook status, version identities. | Mandatory live gate |
| Automatic compaction | Exact installed candidate triggers real auto-compaction using isolated low-threshold configuration/workload, emits all receipts, restores canary, acknowledges, and reports trigger auto. | `live-auto/manifest.json`, token/trigger evidence, sanitized events/receipts, first-turn assertion. | Mandatory live gate, separate from manual |
| Unsupported runtimes | Codex/OpenCode status returns supported=false with reason and does not install compaction hooks or claim parity. Existing SessionStart board orientation may remain separately reported. | Status/install JSON and help snapshot per runtime. | Unit + review |
| Hook/component rail disagreement | Any missing stage, version mismatch, wrong identity, invalid transition, or unsupported hook output is a hard failure; component green cannot override it. | Receipt-chain validator exits nonzero on removed/reordered/forged stage. | All stages; live rail decisive |

# Implementation backlog

| ID | Task | Role | Dependencies | Parallelism / completion evidence |
|---|---|---|---|---|
| D0 | Confirm the decision-card source/checkpoint policy and the 7d/24h retention defaults. Placement is firm: per-machine private journal unless the human explicitly reopens cross-host scope. | Product owner + architect | none | Blocks implementation because checkpoint source changes the hook/state design. Decision recorded in bundle. |
| T1 | Specify canonical identity, immutable-generation state machine, record/receipt schemas, reason codes, privacy bounds, and transition invariants as code-facing fixtures. | Product/architecture engineer | D0 | Can run with T2 test design. Schema fixtures + transition table approved. |
| T2 | Build the fast feedback oracle first: deterministic runtime-event simulator, multi-process harness, fake clock, killpoints at every transition, receipt-chain validator, and legacy hook config fixtures. | QA infrastructure engineer | T1 interface draft | Starts before production implementation; builder proves tests red against revision-2/id8/unconditional-delete mutants. |
| T3 | Implement the single lifecycle authority and private journal: validation, identity, immutable generations/pointer CAS, permissions, delivery token, ack, retention, bounded GC. | Core/CLI builder | T1, T2 red oracle | May run parallel with T4 against mocked interface. Unit/property/concurrency tests included in same commit. |
| T4 | Implement Claude adapter subcommands for PreCompact, PostCompact, SessionStart compact, Stop, and SubagentStop; parse JSON in the managed executable and map events only to T3. | Runtime integration builder | T1, T2; mocked T3 contract | Parallel with T3; adapter agreement matrix and malformed-input tests. |
| T5 | Extend managed hook install/status/uninstall/upgrade and installed-tarball proof; distinguish board SessionStart support from Claude compaction support and explicit non-support elsewhere. | Distribution engineer | T4 | Golden config and package journey tests; no hand-edited global scripts or plugin artifact. |
| T6 | Update generated reference/help/skill/docs with truthful Claude-only support, private placement, privacy, recovery, diagnostics, and live-gate instructions. | Docs/product engineer | T1; stable T4/T5 interface | Parallel late; generated drift gates green. |
| T7 | Integrate T3-T6 on a feature branch from current origin/main, run targeted tests then `npm run check`, package exact artifact, and produce the evidence manifest. | Builder/integrator | T3-T6 | One coherent reviewed commit/SHA; clean worktree; no bot-owned bundle/manifests changed. |
| R1 | Independent exact-SHA code/design review; audit evidence provenance, sample tests, and probe at least one contract red. | Independent reviewer (not builder) | T7 | Mandatory gate before any QA. APPROVE or return findings to T3-T7; every fix creates a new SHA and restarts R1. |
| Q1 | Adversarial QA on the approved exact SHA: real multi-process races, killpoints, stale consumers/GC, legacy upgrades, missing dependency, malformed payload, privacy/path/symlink attacks, and unsupported runtimes. | Independent adversarial QA | R1 APPROVE | Mandatory after review. Any code change returns to R1 before QA resumes. |
| L1 | Install exact QA artifact into an isolated Claude config and run manual, repeated, concurrent, subagent, and automatic compaction journeys; validate receipt chains and canaries. | QA operator / live verifier | Q1 PASS | Distinct live rail. PASS, BLOCKED-PENDING-VERIFICATION, or FAIL; no substitution by component tests. |
| H1 | Push the feature branch and deliver paste-ready PR title/body with exact SHA, CI/package/review/QA/live receipts, caveats, rollback, and unsupported runtimes. Do not create the PR or merge. | Orchestrator/release handoff | L1 PASS | User owns PR/merge. |

# Exact-SHA review rubric

The reviewer must detach an isolated worktree at the candidate SHA and record `git rev-parse HEAD`, clean status, base SHA, candidate source commit from `aslite version --json`, and packaged artifact SHA-256.

APPROVE requires all of the following:

- The diff is one coherent Claude-only compaction-handoff claim and contains the risky mechanic with its tests.
- One authority owns identity, generation, validation, transitions, ack, retention, and GC; hooks are adapters only. No shell/YAML/prose duplicate can make policy decisions.
- Full identity is stored and compared after reads; actor/role/hostname/recency never authorize restore.
- Generation writes are immutable or equivalently safe; every pointer/state mutation and GC/retire operation is CAS guarded.
- SessionStart delivery plus later Stop/SubagentStop acknowledgement is executable and interruption-safe.
- Private journal placement, 0700/0600 modes, size bounds, redaction, path traversal and symlink handling are explicit and tested; sync cannot see the journal.
- Hook upgrade/status preserves foreign hooks, detects stale/partial/malformed installs, and reports Codex/OpenCode unsupported without breaking their existing board-orientation status.
- The reviewer audits builder evidence construction, reruns a targeted sample, and proves one load-bearing test red (for example id8 keying or removal of expected-version). CI/repository gate on the same SHA may be cited rather than rerun wholesale.
- Help/reference/generated skill text and package proof describe exactly the supported rail; no committed plugin bundle/version hand-bump appears.
- Findings are classified empirical/reasoned and survived attacks are listed. Approval does not imply the live gate passed unless the exact artifact receipts are also attached.

# Adversarial QA rubric

QA attacks what standing gates cannot reach:

1. True concurrent processes: two main sessions, main plus subagent, sibling subagents, interleaved prepare/finalize/deliver/ack/GC.
2. Kill the adapter after each durable write and before/after every transition; restart from the same and a different session identity.
3. Hold stale record/pointer versions while a newer generation advances, then attempt ack, retire, and GC.
4. Feed prefix-colliding, path-like, whitespace, wrong-type, oversized, truncated, corrupt-journal, and forged-delivery-token inputs.
5. Run with actor/role absent, minimal PATH, no jq/date/hostname, moved executable, read-only/full disk, and permission-denied journal.
6. Upgrade current legacy pre/post scripts and older SessionStart shapes; include duplicate managed hooks, foreign hooks, malformed settings, partial target failure, reinstall, and uninstall.
7. Use fake clock at exact retention boundaries, clock reversal, invalid expiry, and simultaneous GC/writer activity.
8. Assert no raw compact summary/transcript/full identity reaches stdout, CI artifacts, the project bundle, git diff, board branch, or sync.
9. Validate unsupported Codex/OpenCode paths are inert and truthfully diagnosed.
10. Execute installed Claude manual and automatic journeys; component simulation alone cannot close Q1/L1.

QA PASS requires no unresolved high/medium finding, all attacks surviving with receipts, and no code change after R1. Any repair creates a new SHA and restarts independent review before QA.

# Live gate and adjudication

Required evidence tree (external test artifact; raw transcripts remain private and are not attached):

```text
precompact-v3-evidence/<candidate-sha>/
  identity.json                 # git/base/source commit, artifact sha, node, claude version/path
  build-and-component.json      # exact commands, exit codes, CI URLs/log digests
  hook-status-before.json
  hook-install-receipt.json
  hook-status-after.json
  review.md                     # reviewer identity, exact SHA, verdict/findings/survived attacks
  qa.md                         # exact SHA, attack table, verdict
  live-manual/manifest.json
  live-manual/receipts.jsonl    # sanitized structured receipts only
  live-manual/assertions.json
  live-auto/manifest.json
  live-auto/receipts.jsonl
  live-auto/assertions.json
  receipt-chain-validation.json
  privacy-scan.json
```

`PASS`: repository/package gates passed on one exact SHA; R1 approved that SHA; Q1 passed unchanged; installed manual and real automatic compaction both completed on the same artifact and installed Claude version; receipt-chain validator and canary assertions pass; hook status is current; privacy scan is clean.

`BLOCKED-PENDING-VERIFICATION`: code/component/package/review/QA evidence is green, but a genuinely external condition prevents one or both installed-host live journeys (for example unavailable Claude authentication/service, inability to safely induce auto-compaction, or host runtime outage). The receipt names the missing journey, last successful stage, external condition, and exact retry command/harness. This verdict is not approval and blocks merge/release. An observed product/rail failure is never BLOCKED.

`FAIL`: any expected transition is absent/out of order; hook output is rejected; durable prepare or identity check fails open; wrong generation is restored/altered; manual or auto canary fails; exact SHA/artifact identities disagree; privacy leaks; a required test/gate fails; or evidence is missing/forged/stale. Return to builder, create a new SHA, then repeat Review -> QA -> live.

# Release handoff

The handoff must name: feature branch; base SHA from current `origin/main`; exact candidate SHA; pushed remote branch; clean status; source and artifact identities; `npm run check`/package/CI receipts; independent review verdict; adversarial QA verdict; both live manifests; receipt-chain/privacy results; user-visible behavior; migration/rollback (`hook uninstall` or reinstall prior release); private journal location/retention; Claude-only support; Codex/OpenCode unsupported; known caveats; and a paste-ready PR title/body. The orchestrator must not create the PR, merge, push main, modify user-global hooks, or claim release before the human gate.

# Issues requiring explicit resolution

1. **Decision-card source/checkpoint (blocks T1/T3/T4).** A hook can persist deterministically, but PreCompact does not itself receive a model-authored decision card. Recommended default: PreCompact durably snapshots the current transcript/checkpoint and blocks on failure; PostCompact finalizes from documented `compact_summary`; the record validator requires the bounded decision-card contract and marks a nonconforming summary invalid rather than trusted. If the live automatic compactor cannot reliably produce that card, add a proactively maintained checkpoint mechanism in a separate reviewed expansion or narrow the semantic claim with human approval. Do not silently parse free prose and call it validated.
2. **Retention default.** Recommend 7 days for unacknowledged/abandoned recovery and 24 hours after acknowledgement for diagnostics. Changing this is policy/config work but not architectural if retained as injectable time policy.
3. **Placement.** Firm recommendation is `~/.agentstate/handoffs/v1`, private and unsynced. Choosing project-board placement materially expands privacy, sync conflict, cross-host identity, and GC scope and should stop this PR for a new design review.
4. **Installed-version floor.** Live proof must record the exact installed Claude version and hooks contract. Support should be gated by observed fields/capabilities and status diagnostics, not a guessed version number alone.

# Notes

P04/P06 drove the adoption card, structured receipts, status/stop controls, and scenario table. P11/P12 drove the explicit delivery/ack boundary, full identity checks, immutable generations, and independent Review -> QA -> live propagation fences. Proportionality rejects a public command, cross-runtime parity, and board sharing until the Claude pilot proves use.

Tensions: diagnostic retention versus privacy (short private retention); fail-closed automatic compaction versus availability (an automatic recovery attempt can surface the underlying context-limit error, but silent loss is worse); semantic completeness versus deterministic hooks (validate and expose uncertainty rather than inventing structure); rigor versus throughput (live auto compaction is expensive but load-bearing and therefore non-substitutable).

Current official Claude hook contract used for this acceptance research: PreCompact receives manual/auto trigger and can block; PostCompact receives `compact_summary` but cannot control the result; SessionStart matcher/source `compact` can add model context; hooks firing inside subagents carry `agent_id`; Stop/SubagentStop provide the later lifecycle boundary. Final acceptance still depends on exact installed-host evidence, not documentation alone.

Exact bundle note id: `context-notes/precompact-v3-acceptance-research`.
