---
type: Design
title: Runtime-neutral compaction checkpoint domain model
actor: codex-checkpoint-domain-modeler
timestamp: '2026-08-08T17:11:55.535Z'
---
# Summary

This document defines the runtime-neutral domain for preserving an agent's substantive working context across compaction, stop, resume, and handoff boundaries. It is a vocabulary and invariant contract, not a production design. It intentionally leaves host mechanics and storage layout open.

The central model is: a collision-safe **checkpoint subject** accumulates a new **context revision** when **substantive work** changes its working understanding; a valid durable **checkpoint** covers one exact subject revision; a **loss-risk boundary** creates a bounded checkpoint obligation; and a later **restoration opportunity** may deliver only an exact, eligible checkpoint. Host event names such as Claude Code `PreCompact` and `SessionStart`, Codex compaction behavior, and OpenCode plugin events are adapter vocabulary, not shared product concepts.

Current status: domain model complete for cross-runtime research. Next action: runtime researchers should answer the capability-question matrix with official or empirical evidence and should not select an implementation while material questions remain unresolved.

Definition of done for this artifact: an independent researcher can identify the entities, determine whether a proposed host mechanism can satisfy the invariants, describe honest degraded behavior when it cannot, and report evidence without importing a host-specific architecture.

# Purpose, authority, and scope

**Ultimate goal:** Make agent work durable across compactions, sessions, and handoffs without human checkpoint reminders.

**Proximate goal:** Establish shared entities, states, transitions, invariants, and adapter questions before selecting mechanics. This serves the ultimate goal by preventing one runtime's hook vocabulary from silently becoming product architecture.

The authoritative product owner is the [compaction checkpoint lifecycle](../tasks/compaction-context-checkpoint-lifecycle.md). The binding [reconciliation decision](../decisions/compaction-context-checkpoint-reconciliation.md) assigns checkpoint schema, identity, freshness, synthesis, restoration, loop prevention, and error reporting to agentstate-lite, with thin host adapters. The canceled [Claude pilot](../tasks/pre-compact-multi-session.md) and its [revision-3 design](pre-compact-multi-session.md) are evidence only.

In scope: semantic preservation, identity, dirty/current relations, checkpoint and restoration lifecycles, bounded failure, privacy, durability, concurrency, and research questions for Codex, Claude Code, and OpenCode.

Out of scope: choosing a document-id layout, hook command, transcript parser, private journal, broker, controller, model prompt, retention interval, production schema syntax, or host-specific implementation.

# Modeling rules

1. Product concepts describe obligations and observable outcomes. Host concepts describe one runtime's way of signaling or fulfilling them.
2. Semantic state and transport state are separate. A hook firing does not prove a meaningful synthesis was persisted; a payload being delivered does not prove the model used it.
3. Freshness is a derived relation among an exact subject, its latest known context revision, a checkpoint, policy, and required durability scope. A timestamp alone cannot prove freshness.
4. Uncertainty is explicit. Missing identity, missing lifecycle events, or unverifiable ordering produce an honest degraded state, not a heuristic guarantee.
5. Checkpoints are ordinary documents in the project agentstate-lite bundle. Deterministic Git/task/test capture may support a checkpoint, but cannot substitute for agent-authored semantic synthesis.
6. Concurrency is normal: multiple root sessions, resumed carriers, and sibling subagents may work in the same project at once.

# Non-overlapping taxonomy

| Term | Definition | Explicitly not |
|---|---|---|
| Runtime family | A host product whose lifecycle and context surfaces an adapter targets, such as Codex, Claude Code, or OpenCode. | A session, model, checkpoint subject, or actor. |
| Host adapter | A thin translator between one runtime's evidenced lifecycle/identity/context surfaces and the shared protocol. | Owner of checkpoint semantics, storage policy, freshness, or selection. |
| Project scope | The one resolved agentstate-lite bundle whose work the checkpoint concerns, identified canonically enough to prevent cross-project restore. | Current working directory, repository name, or actor label unless proven canonical. |
| Continuity scope | The host-recognized logical work lineage within which a later context is permitted to restore an earlier checkpoint. It may span a compaction and, only if evidenced, a resume or process restart. | A raw host `session_id` by definition; a host id is input evidence from which the adapter maps continuity. |
| Context bearer | One logical agent context that can independently gain or lose working understanding: a root agent or one subagent. | The human actor, runtime process, model name, or orchestration role. |
| Checkpoint subject | The exact preservation namespace `(project scope, runtime namespace, continuity scope, context-bearer key)`. Every checkpoint and restoration attempt belongs to exactly one subject. | A globally newest note or an actor-scoped note. |
| Carrier execution | One live host execution currently carrying a subject's model context. A subject may acquire a new carrier after compaction/resume; concurrent carriers are possible and must contend safely. | The durable continuity scope itself. |
| Actor | Advisory attribution for a writer or tool. | Authentication, authorization, session identity, or a safe restore selector. |
| Context revision | An opaque, ordered or equality-comparable token representing the subject's latest known semantic working state. A checkpoint covers one exact revision. | Document storage version, Git commit, timestamp, or host message count. |
| Substantive-work event | Evidence that the subject's continuation-relevant understanding changed: system model, goal, decision and rationale, constraint, blocker, review/QA state, unverified assumption, or intended next action. | A lifecycle event, every tool call, or a read-only/trivial turn with no continuation-relevant change. |
| Dirty obligation | The fact that the latest known context revision is not yet covered by a confirmed eligible checkpoint. | An inference that a particular document is corrupt or expired. |
| Loss-risk boundary | An event after which some current working context may become unavailable, including compaction, ordinary stop, context replacement, or agent shutdown. | Necessarily an opportunity to run code before loss. |
| Checkpoint opportunity | A bounded interval before a loss-risk boundary during which the same context bearer can still synthesize and persistence can complete. | The loss boundary itself or a generic stop notification after context is gone. |
| Restoration opportunity | A point after context loss but before dependent substantive work where a host may accept exact checkpoint context for the same subject. | Proof that the model read or used delivered context. |
| Synthesis request | A bounded request to the same context bearer to externalize its current semantic working state. | Deterministic transcript extraction, existing task metadata, or an adapter-generated summary. |
| Semantic synthesis | The agent-authored continuation state: current system model, goals, completed/current work, decisions with evidence, constraints/non-goals, blockers/questions, review gates, assumptions, loaded skills, and exact next action. Unknown fields may be explicit. | A transcript dump or a copy of already durable external facts. |
| Evidence snapshot | Deterministic references or bounded facts about bundle state, Git/worktree, tests, agents, and artifacts that support or locate the synthesis. | The semantic synthesis itself. |
| Checkpoint | A schema-valid ordinary bundle document containing or referencing the semantic synthesis and exact subject/revision provenance. | A host-local journal record, transient prompt, log line, task record, or Git status dump. |
| Checkpoint generation | The logical immutable identity of one checkpoint result for one subject revision, independent of its physical document layout. | The mutable document storage version. |
| Storage version | The backend-provided CAS/version token for exact bytes. | Context revision or checkpoint generation. |
| Checkpoint receipt | Content-minimal evidence of attempted/confirmed persistence, including subject key, covered revision, generation, document id, storage version, durability scope, outcome, and reason. | The checkpoint's sensitive semantic content. |
| Durability scope | The visibility/recovery promise actually established by a successful write, for example same local bundle backend versus a separately evidenced shared/cross-machine scope. | An assumption that local persistence was synced or remotely visible. |
| Restore attempt | Exact selection, validation, and delivery of a checkpoint at one restoration opportunity. | Consumption acknowledgment or evidence of correct downstream behavior. |
| Delivery receipt | Evidence that the adapter's supported context channel accepted a bounded payload. | Proof of model comprehension, causal use, or successful continuation. |
| Degraded mode | An explicit, visible result when a required capability or guarantee is unavailable; it names what remains possible and what is no longer guaranteed. | Silent best effort represented as success. |

Host terms such as `PreCompact`, `PostCompact`, `SessionStart`, `Stop`, `SubagentStop`, plugin `sessionID`, hook exit codes, `continue:false`, transcript paths, scratchpads, and additional-context fields belong only in adapter mappings and evidence records.

# Identity and ownership

## Logical identity

The shared protocol requires every checkpoint subject component to be present and unambiguous before automatic restoration. An adapter may derive canonical opaque keys from host values, but it must retain enough provenance to detect collisions or a changed mapping. Root-versus-subagent role is metadata; the context-bearer key is what creates separation. Actor and “main/orchestrator” labels never substitute for it.

A runtime that cannot provide a stable continuity or context-bearer identity may still persist a human-inspectable checkpoint, but it cannot claim collision-safe automatic selection. “Choose the newest note for this actor/project” is a degraded discovery aid, not restoration.

## Entity ownership

| Entity or policy | Owner | Boundary |
|---|---|---|
| Checkpoint document contract and minimum semantic sections | Shared agentstate-lite protocol | Runtime adapters may supply host evidence but may not fork the schema. |
| Checkpoint subject identity contract and canonical comparison rules | Shared protocol | Adapters map evidenced host identifiers into the contract. |
| Context revision/dirty-current semantics | Shared protocol | Adapters report lifecycle and candidate substantive-work signals; they do not redefine “current.” |
| Synthesis requirement, size policy, and validation | Shared protocol | The context bearer supplies meaning; the adapter only requests/transports it. |
| Persistence, CAS, versions, and bundle document mutation | Existing agentstate-lite core/storage seam | No second journal, memory store, or task system. |
| Restore eligibility and exact checkpoint selection | Shared protocol | The adapter provides the current subject and delivery capability. |
| Retry/continuation budget and reason-code vocabulary | Shared protocol | Adapter timeouts may be stricter, but cannot create unbounded retries. |
| Host lifecycle event mapping, payload parsing, event ordering evidence, and context injection | Host adapter | Every mapping is version/evidence scoped and must report unsupported capabilities. |
| Hook/plugin configuration merge, install/status/uninstall, and preservation of unrelated host config | Host adapter plus existing CLI hook-management surface | Foreign entries remain untouched unless structurally proven managed. |
| Semantic synthesis content | Same context bearer that owns the working understanding | External deterministic evidence supports it; another process may not invent it. |
| Human interruption, inspection, disablement, and policy choices | Operator | The system must expose receipts and must remain stoppable. |

# Logical checkpoint contract

A checkpoint has these logical fields even if the eventual markdown schema represents them differently:

- protocol/schema version;
- exact checkpoint-subject identity and non-secret canonical provenance;
- checkpoint generation and covered context revision;
- creation boundary/reason and timestamps used as audit evidence, not sole freshness proof;
- author/carrier attribution distinct from identity;
- durability scope and storage-version receipt;
- semantic synthesis with: current system model; ultimate and proximate goals; last completed and current work; decisions and supporting evidence; constraints and non-goals; blockers and open questions; review/QA gates; assumptions and unverified claims; loaded skills or operating instructions; exact next action; and references to durable project artifacts;
- explicit unknowns rather than invented completeness;
- bounded evidence snapshot or references where useful;
- privacy/redaction and truncation disclosures; and
- predecessor/supersession information sufficient to reject stale concurrent completions.

Meaningful preservation requires the semantic synthesis. A checkpoint containing only Git status, tasks, existing notes, transcript excerpts, or host metadata is structurally valid evidence at most, not a fulfilled dirty obligation.

# Freshness model

Freshness is evaluated for one exact subject, restoration target, required durability scope, and current policy. It is not a mutable boolean stored on a note.

## Subject obligation states

| State | Meaning | Allowed next states |
|---|---|---|
| `UNKNOWN` | The protocol cannot establish the latest semantic revision or whether an eligible checkpoint covers it. | `CLEAN`, `DIRTY`, `DEGRADED_DIRTY`. |
| `CLEAN` | The latest known context revision is covered by a confirmed eligible checkpoint at the required durability scope. | `CLEAN`, `DIRTY`, `UNKNOWN`. |
| `DIRTY` | Substantive understanding newer than the last confirmed checkpoint is known to exist. | `CHECKPOINTING`, `DIRTY`, `DEGRADED_DIRTY`. |
| `CHECKPOINTING` | One bounded attempt is synthesizing/validating/persisting a snapshot of a named context revision. | `CLEAN`, `DIRTY`, `DEGRADED_DIRTY`. |
| `DEGRADED_DIRTY` | A bounded attempt failed or a required capability was unavailable; loss may proceed only under the documented fallback, with a visible failure receipt. | `CHECKPOINTING`, `DIRTY`, `UNKNOWN`. |

Transitions:

| From | Event/guard | To | Required effect |
|---|---|---|---|
| `UNKNOWN` or `CLEAN` | Substantive-work event creates revision `r` | `DIRTY` | Record that `r` is uncovered without writing a noisy checkpoint immediately unless the later design chooses proactive capture. |
| `CLEAN` | Trivial/read-only activity with no semantic change | `CLEAN` | No checkpoint churn. |
| `DIRTY` | Reliable checkpoint opportunity and budget available | `CHECKPOINTING` | Snapshot exact revision `r`; request same-bearer synthesis. |
| `CHECKPOINTING` | Valid write plus final version/read-back confirmation; no newer revision exists | `CLEAN` | Publish success receipt for generation covering `r`. |
| `CHECKPOINTING` | New substantive revision `r+1` appears before completion | `DIRTY` | The write for `r` may remain history but cannot clear the obligation for `r+1`. |
| `CHECKPOINTING` | Synthesis refusal, validation/write/CAS/timeout failure, or capability loss | `DEGRADED_DIRTY` | Publish content-minimal failure receipt; consume retry budget. |
| `DEGRADED_DIRTY` | Another evidenced opportunity within budget | `CHECKPOINTING` | Retry only according to shared bounded policy. |
| Any | Identity becomes missing/ambiguous or state provenance cannot be compared | `UNKNOWN` | Do not select heuristically or claim current. |

## Derived checkpoint freshness states

Evaluate in the precedence below so the states do not overlap. Secondary reason codes may preserve additional diagnoses.

| Precedence | State | Predicate |
|---:|---|---|
| 1 | `ABSENT` | No candidate exists for the exact subject. |
| 2 | `UNUSABLE` | Candidate bytes are unreadable, schema-invalid, corrupt, unsafe, or their identity provenance contradicts the subject. Identity-mismatched documents are never candidates. |
| 3 | `AMBIGUOUS` | More than one candidate could claim authority and no exact, concurrency-safe selection relation resolves them. |
| 4 | `INSUFFICIENT_DURABILITY` | Candidate is valid locally but unavailable at the restoration scope the operation requires. |
| 5 | `UNKNOWN` | Candidate and subject exist, but current context revision/dirtiness evidence cannot be compared honestly. |
| 6 | `STALE_WORK` | A newer substantive context revision than the checkpoint's covered revision is known. |
| 7 | `STALE_POLICY` | No newer work is known, but an explicit compatibility, age, migration, or retention policy makes the checkpoint ineligible. |
| 8 | `CURRENT` | Exact subject match, unique authoritative selection, schema validity, sufficient durability, covered latest-known revision, and policy eligibility all hold. |

Timestamp recency is supporting evidence only. “Most recent” does not convert `UNKNOWN` or `AMBIGUOUS` to `CURRENT`.

# Restoration model

Restoration transport is modeled separately from freshness and obligation.

| State | Meaning |
|---|---|
| `NOT_APPLICABLE` | No evidenced context-loss/restoration boundary requires injection. |
| `PENDING` | A restoration opportunity for an exact subject exists before dependent substantive work. |
| `SELECTING` | Shared logic is evaluating subject identity, freshness, policy, size, and durability. |
| `DELIVERED` | The host's supported context channel accepted the exact bounded payload and emitted a delivery receipt. This does not mean consumed. |
| `SKIPPED_INELIGIBLE` | No `CURRENT` checkpoint existed; the exact reason is visible. |
| `DELIVERY_FAILED` | Selection succeeded but transport, size, timeout, or host acceptance failed; the failure is visible and bounded. |
| `EFFECT_OBSERVED` | Optional stronger state reached only with evidence causally linking a later agent action to this delivery. Ordinary post-delivery activity is insufficient. |

Transition sequence:

1. An evidenced context replacement or resume creates `PENDING` for the adapter's exact subject.
2. Before the first dependent substantive model action, shared selection enters `SELECTING`.
3. Only freshness `CURRENT` may be delivered automatically. Other freshness states become `SKIPPED_INELIGIBLE` with a reason receipt.
4. Adapter acceptance of a bounded payload becomes `DELIVERED`; rejection, truncation that violates required sections, timeout, or launch failure becomes `DELIVERY_FAILED`.
5. A runtime-specific causal acknowledgment may establish `EFFECT_OBSERVED`. Without one, retain `DELIVERED` and never describe it as model consumption.
6. A later substantive-work event creates a new context revision and dirty obligation regardless of whether delivery was observed.

Restoration must not delete or “consume” a checkpoint merely because delivery was attempted. Retention/cleanup is a separate policy and must not make a failed or ambiguous delivery unrecoverable.

# Boundary mapping contract

Every adapter maps evidenced host behavior to these shared events:

| Shared event | Adapter must establish | If unavailable |
|---|---|---|
| `substantive_work_observed` | A trustworthy signal or protocol interaction that creates/updates context revision. | Report unknown/possibly dirty; research proactive fallback rather than assuming clean. |
| `checkpoint_opportunity_opened` | Same context bearer still has semantic state; persistence can finish; timeout/order are known. | No pre-loss guarantee; use explicit degraded mode or separately designed proactive capture. |
| `loss_boundary_requested` | Boundary type, trigger, whether it can be delayed, and maximum safe delay. | Never claim blocking. |
| `loss_boundary_completed` | Evidence that context was actually replaced/stopped, not merely requested. | Restoration remains not-applicable or unknown. |
| `restoration_opportunity_opened` | Exact subject mapping, context channel, ordering before model work, payload limit, timeout. | No automatic restoration guarantee; leave inspectable receipt/checkpoint. |
| `carrier_stopped` | Whether final same-bearer continuation is possible and how interruption differs from ordinary stop. | Bound attempt and report ungraceful loss. |
| `adapter_failure` | Launch, timeout, parse, schema, context-channel, or host-version failure. | Emit visible reason outside sensitive content; never simulate success. |

Manual and automatic compaction are trigger values on the same boundary type unless evidence shows materially different ordering or capabilities. Ordinary stop and subagent stop share the checkpoint protocol but may map to different capabilities. User kill, process crash, API failure, and host timeout are ungraceful-loss cases: no design can guarantee last-moment synthesis if no code or model can run, so research must determine whether proactive checkpointing is required.

# Invariants

## Safety

- **S1 Exact subject:** Automatic checkpoint selection/restoration requires exact project, runtime namespace, continuity, and context-bearer identity. Actor, role, recency, cwd, or a singleton candidate cannot substitute.
- **S2 Meaningful content:** A dirty obligation is fulfilled only by valid same-bearer semantic synthesis. Existing external state alone is insufficient.
- **S3 Confirmed currentness:** No state becomes `CLEAN` or `CURRENT` before schema validation, successful versioned persistence, and final confirmation at the claimed durability scope.
- **S4 Revision guard:** A checkpoint covering revision `r` cannot clear a newer `r+1` obligation, even if the write for `r` finishes later.
- **S5 No ambiguous premise:** Missing, corrupt, identity-mismatched, stale, or ambiguous checkpoints are never injected as authoritative context.
- **S6 Delivery honesty:** `DELIVERED` never means consumed or causally used without separate evidence.
- **S7 Bounded control:** Checkpoint requests, retries, host continuations, and boundary delays have shared finite limits. The system cannot continue or block an agent indefinitely.
- **S8 Adapter containment:** Host-specific event names, payloads, transcript formats, and configuration rules remain in adapters; they do not fork shared semantics.
- **S9 Foreign configuration:** Install/upgrade/status/uninstall mutate only structurally proven managed entries and preserve unrelated hooks/plugins exactly.
- **S10 Honest degradation:** An adapter never advertises a guarantee stronger than its version-scoped evidence.

## Liveness and operability

- **L1 Low intervention:** Normal checkpointing/restoration does not depend on a human reminder, token-window observation, or manual command.
- **L2 Low churn:** Trivial/read-only activity leaves `CLEAN` unchanged and does not create repeated notes.
- **L3 Bounded fallback:** A failed dirty checkpoint cannot block compaction/stop forever; after finite attempts the boundary follows a documented fallback and emits a visible failure receipt.
- **L4 Recoverability:** A failed attempt leaves the subject dirty/unknown so the next evidenced opportunity may retry; failure is not silently converted to clean.
- **L5 Operator control:** Users can inspect status/receipts, disable or remove managed behavior, and stop/redirection remains possible at reasonable cost.
- **L6 No mandatory daemon:** Time-based eligibility may be evaluated on access/event; the contract does not require a background process unless later evidence makes one necessary.

## Privacy and security

- **P1 One declared store:** Checkpoints are ordinary bundle documents and inherit that bundle's sharing/sync visibility. No hidden secondary journal or knowledge store is introduced.
- **P2 Visibility disclosure:** Documentation and receipts make clear that semantic checkpoint content may sync wherever the bundle syncs; local-only and shared durability claims remain distinct.
- **P3 Data minimization:** Default synthesis excludes raw transcripts and secrets not needed for continuation. Evidence uses references/hashes where content would add exposure without semantic value.
- **P4 Content-free telemetry:** Logs, status, hook errors, and receipts contain identifiers/hashes, sizes, versions, outcomes, and reason codes, not semantic checkpoint bodies.
- **P5 Bounded transport:** Restore payloads have deterministic size limits and disclose truncation; required semantic sections and exact next action cannot be silently dropped.
- **P6 No content leak on failure:** Invalid, corrupt, mismatched, or oversized checkpoint content is not echoed into errors or foreign host surfaces.

## Durability

- **D1 Bundle authority:** The project agentstate-lite bundle is the single durable authority for checkpoints. Git/sync is a sharing channel, not a second checkpoint model.
- **D2 Scoped guarantee:** Every success receipt states the actual durability scope. Same-backend read-after-write does not imply power-loss, cross-process, cross-machine, or synced durability unless the backend/channel proves it.
- **D3 Versioned confirmation:** Persistence carries a storage version/CAS receipt and verifies the exact selected bytes/version before claiming current.
- **D4 Failure visibility:** Validation, write, read-back, permission, backend, sync/visibility, and timeout failures remain visible and do not clear dirty state.
- **D5 Non-destructive delivery:** Restore attempts do not destroy the last recoverable checkpoint. Retention and migration require their own version-guarded rules.
- **D6 Explicit migration:** The deprecated fixed `context-notes/pre-compact-main` and interim session-scoped notes are retained, migrated, or retired by an explicit later plan; they are never silently treated as current under the new contract.

## Concurrency

- **C1 Namespace separation:** Concurrent root sessions and sibling subagents receive distinct checkpoint subjects; root/subagent role alone is not a unique key.
- **C2 CAS mutation:** Every contested checkpoint/head/selection mutation uses fresh read-decide-CAS semantics and handles conflicts explicitly.
- **C3 Stale completion containment:** A late synthesis or write for an older revision/generation cannot replace or clear a newer winner.
- **C4 Idempotent replay:** Replaying the same evidenced event or receipt is a no-op or the same logical result, not duplicate checkpoint churn.
- **C5 Exact restore:** There is no global-newest, project-newest, actor-newest, or “only candidate” automatic selection fallback.
- **C6 Independent bearers:** One subagent's stop/checkpoint/restore cannot alter another bearer or root's currentness. Parent-child handoff links may aid discovery but never collapse identities.
- **C7 Observable conflict:** CAS losers re-read and re-evaluate; conflict never becomes silent overwrite, silent clean state, or a guessed merge of semantic syntheses.

# Failure classes and minimum behavior

| Failure class | Examples | Required protocol result |
|---|---|---|
| Capability unavailable | No before-loss event, no same-agent continuation, no restore injection channel | Named degraded mode; state what is not guaranteed; investigate proactive/inspectable fallback. |
| Identity unavailable or unstable | Missing continuity id, changed id after resume, no subagent id | No automatic restore; persist only with qualified identity or present inspectable candidates without authority. |
| Boundary missed/ungraceful loss | User kill, crash, API failure, host timeout before helper launch | Do not claim last-moment preservation; retain last confirmed checkpoint and visible limitation. |
| Synthesis failure | Same bearer refuses, times out, or returns semantically incomplete output | Keep dirty; bounded retry/fallback; content-minimal receipt. |
| Persistence failure | Validation, permissions, backend, CAS exhaustion, read-back failure | Keep dirty; never mark current; visible receipt with safe diagnostics. |
| Concurrent displacement | New revision or generation wins during synthesis/write/restore | Old result remains stale/history; re-evaluate exact winner; never inject displaced result. |
| Restore ineligibility | Absent, stale, ambiguous, insufficient durability, incompatible schema | Skip automatic injection and expose exact reason. |
| Delivery failure | Payload rejected, truncated below requirements, timeout, adapter crash | `DELIVERY_FAILED`; checkpoint remains durable; no consumption claim. |
| Privacy violation risk | Unsafe content in logs, transcript scraping, wrong bundle visibility | Fail closed for the unsafe operation and emit redacted diagnostics. |
| Host/config drift | Runtime version changed, managed hook missing, foreign config malformed | Readiness false/degraded; preserve foreign bytes; require fresh evidence before support claim. |

# Shared-core versus host-adapter boundary

| Concern | Shared core/protocol | Host adapter |
|---|---|---|
| Vocabulary | Subject, revision, dirty/current, checkpoint, boundary, restoration, receipt, degraded mode | Concrete hook/plugin/event and host field names. |
| Identity | Required components, canonical comparison, collision/ambiguity rejection | Extract/map host session/thread/execution/subagent values; prove stability and limits. |
| Semantic capture | Required synthesis sections, unknown discipline, size/privacy policy | Invoke the same context bearer through an evidenced host continuation surface. |
| Persistence | Ordinary bundle docs, validation, CAS, storage versions, final confirmation | Pass host evidence; no alternate store. |
| Freshness | Derivation and precedence; context-revision guard | Signal host events and any trustworthy dirty/revision evidence. |
| Boundary policy | Bounded obligation, retry count, fallback reason vocabulary | Translate host timing, blocking/continuation fields, exit behavior, timeout. |
| Restore | Exact selection, eligibility, bounded payload, delivery receipt semantics | Inject using evidenced pre-model context channel and report acceptance/failure. |
| Observability | Content-free receipt schema and truthfulness | Capture host launch/order/version evidence without sensitive content. |
| Lifecycle install | Shared desired capabilities and managed-entry ownership contract | Merge concrete host config idempotently; preserve foreign entries; status actual readiness. |
| Testing | Common agreement scenarios and invariants | Deterministic host harnesses for manual/automatic compaction, stop, resume, interruption, and subagents. |

A host-specific exception is admissible only when it names the invariant, presents evidence that the portable mechanism cannot satisfy it on that host, confines the mechanism to the adapter, and receives independent design review.

# Capability-question matrix for runtime research

Statuses below are research starting points, not support claims. `Unknown` means no current evidence was established in this modeling phase. Historical Claude evidence is scoped to the canceled pilot and must be revalidated against the runtime version actually targeted.

| Capability question | Why it changes design | Codex starting status | Claude Code starting status | OpenCode starting status | Required evidence |
|---|---|---|---|---|---|
| Is there an event before manual compaction while the same model context is still available? | Determines last-moment synthesis. | Unknown. | Historical pilot observed `PreCompact`; current semantics/version must be revalidated. | Unknown. | Official contract plus forced manual-compaction trace with timestamps/order. |
| Is there an event before automatic compaction, and is it the same surface/order? | Prevents support based only on manual journeys. | Unknown. | Historical pilot observed automatic trigger on the same pre-event. | Unknown. | Deterministic context-pressure harness and event receipt. |
| Can the boundary be delayed/blocked, for how long, and what happens on timeout/invalid output/exit? | Sets safety versus liveness fallback. | Unknown. | Historical design assumed event-specific blocking/continue behavior; negative rail remained evidence-sensitive. | Unknown. | Empirical failure matrix: success, timeout, crash, malformed response, explicit block. |
| Can the same context bearer be continued exactly once to produce semantic synthesis? | A command-only hook cannot recover unwritten understanding. | Unknown. | Stop/continuation capabilities require fresh proof; prior pilot used different event mechanics. | Unknown. | End-to-end canary showing pre-loss-only semantic facts in persisted synthesis, with loop count. |
| Does ordinary root-agent stop offer a checkpoint opportunity distinct from forced/user interruption? | Unifies session-end capture without overclaiming crashes. | Unknown. | Host exposes stop-named events historically; whether same-bearer continuation is possible is material. | Unknown. | Official semantics plus normal stop, user interrupt, process kill, API failure comparison. |
| Do subagents receive before-loss/stop events with stable per-bearer identity and same-agent synthesis? | Required for separation and discoverable handoffs. | Unknown. | Historical pilot observed subagent event payloads; compaction continuity needs revalidation. | Unknown. | Root plus two sibling subagents; event/order/identity traces and collision tests. |
| Which opaque identifiers exist for project, continuity lineage, carrier execution, root, and subagent? | Determines exact subject key. | Unknown. | Historical `session_id`/`agent_id` evidence exists; stability boundaries remain host-scoped. | Existing adapter code has a `sessionID` for session-start caching, not proof of checkpoint identity. | Payload schemas plus concurrent/resume/compaction experiments; byte/length/stability rules. |
| Are continuity and bearer identifiers stable across compaction, resume, continuation, and process restart? | Decides whether automatic restoration can cross each boundary. | Unknown. | Not generalized from scratchpad or prior session ids. | Unknown. | Matrix of same-thread compaction, fresh-process resume, fork/branch, duplicate concurrent resume. |
| Is there a post-loss event before the first dependent model action? | Required for timely restoration. | Unknown. | Historical order included compact-sourced `SessionStart` before post-event/first response. | Unknown. | Forced compaction trace with a pre-only canary and first-response observation. |
| Can that event inject bounded context, and what are size/schema/escaping limits? | Determines transport and truncation contract. | Unknown. | Historical pilot used a documented additional-context channel and a size bound; revalidate. | Unknown. | Official schema plus boundary-size, Unicode, multiline, rejection, and truncation tests. |
| Can the adapter observe host acceptance separately from model use? Is causal acknowledgment possible? | Prevents `DELIVERED` from being mislabeled consumed. | Unknown. | Historical pilot found later stop observation was not nonce acknowledgment. | Unknown. | Payload/receipt trace; explicit negative proof where acknowledgment is absent. |
| What exact ordering and concurrency rules apply when multiple handlers/plugins exist? | Affects race safety and foreign-hook preservation. | Unknown. | Historical order evidence exists for one isolated configuration only. | Unknown. | Multi-handler trace, parallel/sequential rules, handler failure propagation. |
| What timeout, output, environment, cwd, stdin, credential, and network constraints apply? | Defines adapter isolation and readiness. | Unknown. | Prior probes found launch/auth/environment sensitivity; architecture conclusions are not inherited. | Unknown. | Official docs plus isolated process snapshots and negative tests. |
| Can lifecycle behavior be installed, upgraded, inspected, disabled, and uninstalled structurally while preserving foreign config? | Required operational safety. | Existing SessionStart hook support is not proof of new lifecycle surfaces. | Existing SessionStart support plus historical pilot evidence; new entries still need contract tests. | Existing SessionStart integration is not proof of compaction support. | Before/after byte fixtures for empty, existing managed, foreign, malformed, and upgrade cases. |
| Can manual, automatic, ordinary-stop, resume, interruption, and subagent journeys be forced deterministically in tests? | Determines whether a support claim has an oracle. | Unknown. | Some historical isolated harnesses exist but were candidate/version specific. | Unknown. | Repo-owned repeatable harness, exact runtime identity, event receipts, parent-red tests. |
| What sensitive data surfaces are exposed to hook/plugin code and logs? | Determines least-privilege synthesis and privacy controls. | Unknown. | Historical payload/transcript access may expose content; do not inherit private-journal solution. | Unknown. | Data-flow inventory, redaction tests, bundle visibility and log scans. |
| What happens when agentstate-lite is absent, stale, unhealthy, or not launched? | Bounds the guarantee's start point and readiness. | Unknown. | Historical work correctly distinguished helper launch from a helper that never ran. | Unknown. | Missing/moved executable, permission, timeout, version drift, and host-kill tests. |

# Material unresolved questions

Answers to these can materially change the eventual design and must not be guessed:

1. **Dirty evidence:** What portable event or explicit protocol establishes a new context revision without marking every trivial turn dirty? Can the agent declare substantive completion, must the host expose turn completion, or is proactive periodic synthesis needed?
2. **Identity lineage:** If a host changes session/execution ids on resume, what evidenced relation authorizes continuity without permitting cross-session restore? Is a host-provided parent/resume lineage available?
3. **Ungraceful boundaries:** Where no reliable pre-loss same-agent opportunity exists, should the portable fallback checkpoint after substantive turns, on a time/work budget, or only report that last-moment preservation is unsupported?
4. **Blocking policy:** When automatic compaction must proceed and the checkpoint is dirty, what finite retry/time budget balances semantic preservation with host liveness? Does manual compaction use the same bound?
5. **Document topology:** Should logical generations use one subject-scoped document, immutable generation docs plus a selector, or another ordinary-bundle layout? The choice must preserve C2-C7 and avoid fixed-id collision.
6. **Freshness evidence:** How are context revisions generated and persisted so crash/restart and concurrent carriers can compare them? What is the baseline when the adapter first observes an existing session?
7. **Durability target:** Is same-machine local bundle persistence sufficient for compaction, while cross-machine resume requires sync, or must a checkpoint block until a shared scope is confirmed? How is offline operation represented?
8. **Privacy default:** Which synthesis fields are safe in a bundle that may be shared publicly? Is there a project policy for redaction/visibility without creating a second store?
9. **Restore budget:** What bounded format preserves required meaning under each host's injection limit, and what outcome applies if mandatory sections cannot fit?
10. **Consumption semantics:** Is delivery receipt enough for product success, or does any host support causal acknowledgment/effect proof? What retention behavior is safe without it?
11. **Retention and migration:** How long do generations remain, who evaluates expiry, and how are deprecated fixed/session-scoped notes migrated without losing the last recoverable checkpoint?
12. **Subagent handoff discovery:** How does a parent learn that a child checkpoint exists while exact identities remain separate? Are typed links sufficient, and who writes them under interruption?
13. **Concurrent carriers:** Can the same logical continuity be resumed twice concurrently? If yes, do they become distinct context bearers/branches or contend on one subject revision stream?
14. **Semantic oracle:** What automated acceptance evidence proves synthesis preserved unwritten understanding rather than copying external state, without leaking test canaries into the driving prompt or logs?
15. **Host support threshold:** Which capability combinations qualify as full support, degraded capture-only, restore-only, inspectable/manual recovery, or unsupported?

# Research handoff contract

Each runtime researcher should return one row per capability question containing:

- answer: `yes`, `no`, `conditional`, or `unknown`;
- precise host/runtime version, executable/build identity where available, platform, and date;
- evidence class: official documentation, inspected source, or empirical trace;
- exact event order, timing, payload/identity fields, size/timeout limits, and failure behavior;
- whether the evidence covers root, subagent, manual compaction, automatic compaction, ordinary stop, interruption, resume, and concurrent execution;
- the shared invariant(s) the capability can or cannot satisfy;
- confidence and what remains unverified; and
- adapter vocabulary only in the mapping, never as a replacement for shared terms.

Researchers should distinguish “handler successfully invoked” from “host attempted to launch it,” “payload channel accepted” from “model used payload,” and “historically observed” from “supported on the target version.” If a capability is absent, report the strongest honest degraded behavior rather than proposing a host-specific architecture.

# Evidence and constraints carried forward

- The fixed `context-notes/pre-compact-main` id is deprecated because concurrent root sessions collide. Interim session-scoped notes are compatibility evidence, not the final identity contract.
- The canceled Claude pilot empirically observed one host event order and several concurrency, privacy, timeout, and readiness hazards. Its private journal, generation head, transcript card, tmux controller, broker, exact-host probe, and GC mechanics are not selected here.
- Historical Claude evidence indicates that post-compaction summary data may omit important earlier context and that deterministic external capture alone does not preserve unwritten understanding.
- Existing agentstate-lite core already provides ordinary bundle documents, versions, CAS, actor attribution, and a local-first storage seam. The eventual design should use those authorities rather than duplicate them.
- No current capability conclusion for Codex, Claude Code, or OpenCode is established by this artifact. Cross-runtime research is the next gate.
