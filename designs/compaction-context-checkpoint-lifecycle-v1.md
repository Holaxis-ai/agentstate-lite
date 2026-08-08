---
type: Design
title: Compaction context checkpoint lifecycle v1
actor: codex-checkpoint-design-architect
timestamp: '2026-08-08T17:43:01.021Z'
---
# Decision card

**Status:** v1 design candidate, ready for independent design review. This is a product and
protocol contract, not an implementation plan.

**Product promise:** when a supported runtime gives the same context bearer a successful turn
boundary, agentstate-lite requires that bearer to classify the turn as semantically changed or
unchanged. Changed work produces an immutable semantic checkpoint in the project bundle; unchanged
work advances only a small subject selector. Before compaction, a bounded guard checks freshness.
After compaction, exact current context is delivered only when subject lineage and carrier state are
unambiguous. Failures and unsupported journeys remain visible and never become false success.

**Selected architecture:** one runtime-neutral checkpoint core over the existing bundle/storage
seam; one mutable selector per exact checkpoint subject; immutable semantic generations; immutable
material failure/delivery receipts; and thin version-gated host adapters. Same-bearer assessment is
proactive during a turn only when a runtime proves a pre-model **Turn Ticket** channel. Otherwise,
or when the bearer forgets, `Stop`/`SubagentStop` requests exactly one same-bearer assessment
continuation. `PreCompact` is a freshness guard, never a semantic synthesizer.

**Ultimate goal:** make agent work durable across compactions, sessions, and handoffs without human
checkpoint reminders.

**Proximate goal:** define the smallest shared lifecycle that preserves strict same-bearer semantic
synthesis on capable hosts, gives OpenCode an honest restore-only tier, and is exact enough for a
later implementation plan without inventing architecture.

**Next action:** independent design review against the authoritative lifecycle task, domain-model
invariants, and empirical probe gates in this document.

**Blocking questions for Brian:** none. All selected choices are reversible protocol/configuration
choices. The design does not weaken the same-bearer invariant or authorize a new data store.

# Problem, promise, and non-goals

Compaction can remove the live system model, decisions, unresolved assumptions, review state, and
next action that have not yet reached durable project records. Existing `pre-compact-*` notes rely
on an agent remembering to write before an event it may not control. A command hook can copy Git,
task, or transcript facts, but cannot recover unwritten understanding held by the model. A useful
product must therefore create a same-bearer semantic checkpoint before loss, establish its exact
freshness with concurrency-safe evidence, and restore it only to the authorized continuation.

V1 promises automation only inside an evidenced support tier. It does not promise to read private
latent reasoning, recover work after a process has already died, prove that a model used injected
context, or make a locally written checkpoint cross-machine durable without a sharing channel.

Non-goals:

- transcript ingestion, host-summary promotion, or hidden-model summaries as semantic checkpoints;
- a private journal, daemon, tmux controller, broker, transcript database, or second task/memory
  store;
- automatic bundle sync/push from lifecycle hooks;
- heuristic `latest` restoration by actor, project, role, timestamp, or singleton candidate;
- blocking compaction indefinitely or retrying a model continuation more than once per obligation;
- automatic deletion of legacy notes or checkpoint history in v1;
- making host event names, payloads, or configuration shapes part of the shared domain.

# Support tiers and present classification

Support is declared per journey and exact runtime capability epoch, not once per brand name.

| Tier | Claim | Required capabilities |
|---|---|---|
| `CERTIFIED_CAPTURE_RESTORE` | Automatic same-bearer assessment, confirmed persistence, bounded pre-loss guard, and exact post-loss delivery are proven for the named journey. | Deterministic root/subagent lifecycle probes, exact identity mapping, failure matrix, size boundary, and configuration fixtures all pass for the exact runtime epoch. |
| `CONDITIONAL_CAPTURE_RESTORE` | The documented/source-inspected surfaces can satisfy the protocol, but one or more named empirical gates remain. Product status names those gates and never says certified. | Same-bearer Stop continuation, durable CAS, pre-loss signal, post-loss injection, and at least qualified lineage. |
| `RESTORE_ONLY` | An already-current checkpoint can be selected and delivered conditionally. No automatic semantic-capture claim is made. | Exact eligible subject mapping and a bounded awaited pre-model injection point. |
| `INSPECTABLE_MANUAL` | Checkpoints and receipts are readable and may be used manually; no automatic capture or authoritative restore selection. | Bundle access only. |
| `UNSUPPORTED` | The journey cannot meet a required invariant. | The missing invariant and strongest remaining manual behavior are shown. |

Current design-time classification:

| Runtime / journey | Tier | Honest boundary |
|---|---|---|
| Codex CLI 0.147.0 root ordinary stop, manual/automatic root compaction, compact restore | `CONDITIONAL_CAPTURE_RESTORE` | Documented Stop/PreCompact/SessionStart surfaces exist. Certification waits on Turn Ticket availability, event/failure ordering, identity correlation, size, and forced journey probes. Mid-turn automatic compaction with no prior assessment remains degraded unless the one-block return-to-bearer probe passes. |
| Codex 0.147.0 subagent stop | `CONDITIONAL_CAPTURE_RESTORE` for stop-time capture; restore unclaimed | `SubagentStop` continuation and `agent_id` exist, but subagent compaction/identity stability and restore order are unproved. |
| Claude Code 2.1.226 root ordinary stop, manual/automatic root compaction, compact restore | `CONDITIONAL_CAPTURE_RESTORE` | Stop/PreCompact/compact SessionStart surfaces exist. Certification waits on the same families of probes; simultaneous resume makes lineage-only selection ineligible. |
| Claude Code 2.1.226 subagent stop | `CONDITIONAL_CAPTURE_RESTORE` for stop-time capture; restore unclaimed | `SubagentStop` continuation exists, while child compaction event order and `agent_id` stability are unproved. |
| OpenCode 1.2.15 / stable 1.18.15 automatic semantic capture | `UNSUPPORTED` | Its hidden tool-less compaction agent is not the original bearer; post-hoc idle is not a reliable pre-stop boundary. Host summary output cannot satisfy S2. |
| OpenCode same versions exact checkpoint injection | `RESTORE_ONLY` after identity/size/failure probes | Awaited `experimental.chat.system.transform` can deliver an already-current capsule before a provider request. |
| OpenCode manual discovery | `INSPECTABLE_MANUAL` | Bundle checkpoints and receipts remain available without claiming automatic capture. |
| Ungraceful interruption, API failure, host crash, or kill on every runtime | Last-confirmed-checkpoint only | No last-moment guarantee is possible after the same bearer or helper cannot run. The gap is a visible degraded outcome. |

No runtime reaches `CERTIFIED_CAPTURE_RESTORE` until its exact-version probes pass. OpenCode must
not reach a full-capture tier until it exposes a proven same-original-bearer synthesis primitive.

# Alternatives considered

| Alternative | Disposition | Reason |
|---|---|---|
| Three host-specific checkpoint architectures | Rejected | Forks schema, freshness, concurrency, and failure truth. Host facts belong only in adapters. |
| Transcript extraction or host compaction summary | Rejected as fulfillment; allowed only as cited evidence | Violates strict same-bearer synthesis, depends on unstable/private formats, can lag in-memory state, and expands privacy exposure. |
| Full semantic checkpoint every turn | Rejected | Meets crash exposure better but creates large model, document, sync, and review churn even for trivial turns. |
| Purely last-moment capture at `PreCompact` | Rejected | Codex and Claude command callbacks cannot ask the still-live bearer to synthesize; OpenCode uses a different hidden bearer; crashes expose no boundary. |
| Agent remembers to checkpoint with no lifecycle enforcement | Rejected | Repeats the present failure mode. V1 enforces at Stop once. |
| One mutable latest checkpoint document | Rejected | Late writers can erase history; concurrency and restore provenance become ambiguous. |
| Immutable generations without a selector | Rejected | Finding the authoritative current generation would require recency or scanning heuristics. |
| Immutable generations plus one mutable subject selector | Selected | The selector is the exact CAS authority; generations retain semantic history and late writes cannot silently become current. |
| Persist an immutable receipt for every unchanged turn | Rejected | Produces one new document per trivial turn. V1 folds unchanged confirmation into the selector. |
| No bundle mutation for unchanged turns | Rejected for v1 | There would be no durable, exact evidence that the bearer assessed the current turn. Transcript markers or private ephemeral files would be a second/unstable authority. |
| Private journal, daemon, broker, tmux controller, transcript database | Rejected | Creates a second state system and host-specific operational dependency. |
| `latest wins` on resume or concurrent carrier ambiguity | Rejected | Violates exact-subject and no-ambiguous-premise invariants. Automatic restore fails closed. |

# Components and ownership

1. **Checkpoint Core** owns canonical identities, Turn Tickets, context revisions, assessment
   validation, immutable-generation construction, selector transitions, freshness, bounded retry
   policy, capsule serialization, restore selection, reason codes, and receipt schemas. It has no
   host names or filesystem assumptions.
2. **Existing bundle/storage seam** owns ordinary document read/write, expect-absent create,
   version tokens, actor attribution, read-back, and CAS conflicts. Filesystem, memory, and remote
   backends retain their existing meanings; checkpoint logic does not add another persistence path.
3. **Lifecycle dispatcher** is the single host-command entry point. It validates a normalized
   adapter event, calls the core, returns one bounded adapter decision, and writes only through the
   storage seam. It does not synthesize semantics.
4. **Host adapters** translate event/payload/limit/config facts into normalized events, extract
   evidenced identity inputs, deliver Turn Tickets and restore capsules, and report host acceptance.
   They do not own schema, selection, retry counts, or durable state.
5. **Hook configuration manager** extends the current exact token-and-shape ownership seam. It
   computes desired managed entries, preserves foreign configuration byte-for-byte, refuses
   malformed/ambiguous ownership, and reports partial installations.
6. **Status/receipt projector** derives subject freshness, adapter readiness, unsupported journeys,
   carrier ambiguity, last material failure, and durability scope without reading semantic bodies
   into logs.
7. **Operator controls** provide inspect, enable/disable, explicit retry, explicit manual restore,
   ambiguity resolution, migration inspection, and uninstall. Controls never delete checkpoint
   data as a side effect of uninstall.

# Logical identity and schemas

## Project, subject, carrier, and identifiers

Installation creates or adopts one ordinary bundle identity record with a random
`bundle_instance_id`. It travels with the bundle and is the project scope; cwd, repository name,
and actor are never project identity.

The canonical checkpoint subject tuple is:

```text
(bundle_instance_id,
 runtime_namespace = adapter-name + contract-major,
 continuity_kind + continuity_value,
 bearer_kind + bearer_value)
```

The document path uses
`subject_digest = sha256(canonical tuple)`. Raw opaque host identifiers need not be printed: stored
identity evidence contains their kind, salted digest using `bundle_instance_id`, source event, and
capability epoch. Root/subagent role and parent subject are metadata, not identity substitutes.

`carrier_execution_id` is deliberately separate. It must come from a host-proven execution value or
from an adapter-minted nonce that can be correlated across the exact boundary by a proven channel.
Lineage identifiers do not become carrier identifiers. If two live carriers can share the same
lineage and the adapter cannot distinguish them, `carrier_state=ambiguous` and automatic restore or
divergent commit is ineligible.

Identifiers:

- `turn_ticket_id`: 128-bit random opaque token bound to subject, carrier evidence, host turn token,
  and capability epoch. It is injected before model work only where that ordering is proven.
- `attempt_id`: `a-` plus a digest of subject, operation, Turn Ticket/boundary token, and retry
  ordinal. Replay produces the same logical attempt.
- `context_revision`: `r<monotonic subject sequence>-<digest>`. The core mints it only after a
  same-bearer `changed` verdict against the current selector version. Unchanged leaves it identical.
- `generation_id`: `g-` plus a digest of subject, context revision, attempt, and canonical semantic
  body. The same commit replay addresses the same immutable generation.
- storage version: the backend version of exact bytes; it is never a context revision.

## Mutable Checkpoint Subject State

Path: `checkpoint-subjects/<subject_digest>`. Type: `Checkpoint Subject State`. Exactly one per
subject.

Logical fields:

```yaml
protocol_version: 1
subject_digest: <sha256>
bundle_instance_id: <uuid>
runtime_namespace: <adapter/major>
continuity_evidence: { kind, value_digest, source, capability_epoch }
bearer_evidence: { kind, value_digest, role, parent_subject_digest? }
carrier_state: none | single | ambiguous | ended
carrier_evidence_digest: <digest?>
context_revision: <revision | baseline>
obligation: unknown | clean | dirty | checkpointing | degraded_dirty
current_generation_id: <id?>
current_generation_doc: <bundle-relative id?>
current_generation_storage_version: <version?>
current_durability_scope: local_backend | remote_backend | synced_snapshot
last_assessed_turn_digest: <digest?>
last_assessment: { verdict, attempt_id, boundary, completed_at, reason_code }
active_attempt: { id, operation, base_revision, retry_ordinal, started_at } | null
last_material_receipt: <bundle-relative id?>
migration_state: none | legacy_candidates_present | adopted
```

The body is content-minimal operational explanation and links to the selected generation and last
material receipt. The selector does not duplicate semantic synthesis.

## Immutable Context Checkpoint Generation

Path: `context-checkpoints/<subject_digest>/<generation_id>`. Type: `Context Checkpoint`.
Created expect-absent and never patched.

Logical frontmatter:

```yaml
protocol_version: 1
subject_digest: <sha256>
context_revision: <revision>
generation_id: <id>
predecessor_generation_id: <id?>
attempt_id: <id>
reason: proactive_turn | enforced_stop | manual_checkpoint
runtime_capability_epoch: <adapter/version/probe-set>
carrier_evidence_digest: <digest?>
created_at: <audit timestamp>
author_actor: <advisory actor>
durability_scope: <actual scope>
redaction_policy: project_safe_v1
truncation: none | disclosed
parent_subject_digest: <digest?>
```

Required body sections are: `System model`; `Ultimate and proximate goals`; `Completed and current
work`; `Decisions and evidence`; `Constraints and non-goals`; `Blockers and open questions`;
`Review/QA gates`; `Assumptions and unverified claims`; `Loaded skills/instructions`; `Exact next
action`; and `Durable references`. Unknowns are written explicitly. Raw transcript content is not a
valid replacement. A generation is eligible only if schema validation succeeds.

## Attempt

An attempt is a logical bounded operation embedded in the selector while active. It contains exact
subject, operation (`assess`, `commit`, `guard`, `restore`), base context revision, expected selector
storage version, Turn Ticket/boundary token digest, retry ordinal, start/deadline, and outcome. It is
not a second journal. Completed unchanged assessment is folded into `last_assessment`; generation
success is proven by generation plus selector; material failure/delivery gets a receipt document.

## Immutable material receipt

Path: `checkpoint-receipts/<subject_digest>/<attempt_id>-<stage>`. Type:
`Checkpoint Lifecycle Receipt`. Created expect-absent.

```yaml
protocol_version: 1
subject_digest: <sha256>
attempt_id: <id>
operation: assess | commit | guard | restore | migrate
context_revision: <revision?>
generation_id: <id?>
selector_storage_version: <version?>
generation_storage_version: <version?>
durability_scope: <scope?>
adapter: <name>
capability_epoch: <version/probe-set>
host_event_digest: <digest?>
outcome: confirmed | degraded | skipped | delivered | delivery_failed | superseded
reason_code: <closed vocabulary>
created_at: <audit timestamp>
payload_bytes: <integer?>
```

Its body contains bounded, redacted diagnostics and recovery guidance, never checkpoint semantics,
transcript excerpts, prompts, environment values, or raw host identifiers. `delivered` means the
supported host channel accepted the capsule; it never means consumed or causally used.

# Dirty detection, unchanged confirmation, and cost contract

The protocol cannot inspect latent semantic change. Its oracle is an explicit verdict from the same
context bearer. V1 makes that verdict mandatory and lifecycle-enforced.

## Normal proactive fast path

Where a host probe proves an event before each model turn that can inject bounded context and carry
stable subject/turn identity, the adapter delivers a Turn Ticket. The bearer is instructed to call
one shared assessment action before its final response:

- `unchanged(ticket, expected_selector_version)` means no continuation-relevant system model, goal,
  decision, constraint, blocker, review state, assumption, loaded operating instruction, or next
  action changed. The core CAS-updates only the subject selector: `last_assessed_turn`, verdict, and
  clean/unchanged currentness. Context revision and generation remain unchanged.
- `changed(ticket, expected_selector_version, synthesis)` means one of those semantic fields changed.
  The core mints revision `r+1`, validates and expect-absent creates an immutable generation, then
  CAS-updates the selector to that exact generation/version and read-backs both before `clean`.

At Stop, the adapter hashes the current host turn token and reads the selector. If it matches the
completed Turn Ticket and is `clean`, Stop is a read-only fast path and returns immediately.

This fast path is not claimed for Codex or Claude until a pre-model Turn Ticket surface, ordering,
and identity correlation are empirically proven. It is an optimization surface, not a relaxation of
enforcement.

## Forgotten/unavailable proactive assessment

If Stop/SubagentStop sees no matching completed assessment and `stop_hook_active` is false, it
requests exactly one continuation from the same bearer with a new attempt ID, exact subject/base
revision, required verdict, and bounded schema. The bearer performs `unchanged` or `changed` through
the shared action. The second Stop re-reads the selector.

If a matching confirmed assessment now exists, stopping proceeds. If the bearer omits/refuses the
action, validation/persistence fails, or the second Stop is already active, no third continuation is
requested. The core writes one material `assessment_failed` receipt, leaves
`obligation=degraded_dirty`, and allows the host boundary according to the bounded fallback. Host
caps such as Claude's eight blocks are backstops, never the shared loop guard.

## Exact costs and low-churn tradeoff

| Turn result | Model cost | Bundle read/write cost | Board/sync effect |
|---|---|---|---|
| Proactively assessed unchanged | No additional model request. | One selector read plus one small selector CAS. No generation or immutable receipt. | The selector file becomes locally dirty. Repeated unchanged turns overwrite that same file before sync; no hook commits, syncs, or pushes. A later `aslite sync` shares only the latest selector bytes, though a history-keeping remote backend may retain each CAS version. |
| Proactively assessed changed | No additional model request beyond the bearer composing the synthesis/tool call. | One selector read, one expect-absent generation create, one selector CAS, and final read-back. | One immutable generation plus selector diff remain for the user's normal bundle-sharing flow. No automatic sync. |
| Forgotten/unavailable proactive assessment, recovered | Exactly one extra same-bearer model continuation and its tool action. Prompt and response are bounded by the synthesis schema; wall time/token price are host/model dependent and must be measured. | Same writes as the eventual verdict; a host lacking a unique event token may also require one selector CAS to open the attempt. | Same as verdict. |
| Failed enforced assessment | At most one extra continuation. | One selector CAS and one immutable material failure receipt. | Visible local bundle dirtiness; no automatic sync. |

The intentional tradeoff is one small selector mutation per successfully completed turn in exchange
for exact durable unchanged evidence. V1 rejects both full-note churn and zero-write inference. The
acceptance gate measures p50/p95 local/remote selector latency and the additional model round-trip
rate; status reports the rate so a future reviewed version may optimize without weakening the
oracle. If this cost is rejected in review, the promise must be weakened explicitly rather than
silently dropping unchanged evidence.

# State and event flows

## Successful substantive root or subagent stop

1. Root and each subagent map to different exact subjects; child state may carry a parent-subject
   link but never shares the parent's selector.
2. The same bearer returns `changed` for its Turn Ticket or enforced Stop attempt.
3. Core reads selector/version `v`, validates base revision, creates immutable generation `g`
   expect-absent, then CAS-selects `g` against `v`.
4. Read-back must show selector -> exact `g` -> exact generation storage version and no newer
   revision. Only then does obligation become `clean`.
5. Stop replay observes the same turn digest and is a no-op. A subagent generation includes the
   parent subject link so parent/session orientation can discover the handoff; it never mutates the
   parent's currentness.

## Trivial unchanged turn

The same bearer explicitly returns `unchanged`. Core CAS-updates `last_assessment` and turn digest,
leaves revision/generation unchanged, and marks clean only if it was already clean for that revision.
An unchanged verdict cannot clean `dirty`, `unknown`, or `degraded_dirty` state caused by a failed
newer changed attempt; it must first be reconciled by a same-bearer changed checkpoint or explicit
operator action.

## Manual or automatic compaction

1. `PreCompact` maps to `loss_boundary_requested` and performs a bounded selector read.
2. If the exact subject is clean/current, guard allows compaction without writes except optional
   material audit configured for debugging.
3. If dirty/unknown/degraded, `PreCompact` never invents synthesis. It may block **once** only when a
   version-scoped probe proves that this trigger/mode returns control to the same bearer and a later
   Stop can run. The consumed boundary attempt is recorded in the selector, so a retry cannot loop.
4. Recovery-after-context-limit mode, missing capability evidence, second boundary attempt, or an
   expired deadline fails open: write one material `boundary_proceeded_without_current_checkpoint`
   receipt and allow compaction. The last confirmed generation remains selected.
5. Manual and auto triggers share core semantics; adapter differences exist only where empirical
   ordering/recovery behavior differs.

## Compact restoration

1. A proven post-loss/pre-model event opens restore for the exact subject and carrier evidence.
2. Core reads selector `v1`; rejects absent, invalid, stale, insufficient-durability, ambiguous
   carrier, or policy-ineligible state with a content-minimal skipped receipt.
3. Core reads the exact generation and version named by the selector, validates identity/schema,
   serializes a capsule under the adapter-provided proven budget, and re-reads selector as `v2`.
4. If `v1 != v2`, retry selection once; a second conflict skips delivery. No stale bytes are sent.
5. Adapter delivers through the proven channel. Acceptance writes `delivered`; rejection/timeout
   writes `delivery_failed`. Neither changes the selected generation or deletes anything.
6. Later work gets a new Turn Ticket and assessment regardless of delivery outcome. Only an explicit
   causal nonce/tool acknowledgement may add `effect_observed`; ordinary progress cannot.

## Resume, fork, and simultaneous carriers

- Resume may reuse a subject only when the adapter proves the host lineage mapping. A new carrier is
  registered separately. Missing carrier correlation makes automatic restore ineligible.
- Fork always creates a new continuity subject. If the host supplies an exact `forked_from` relation,
  the new selector may record ancestry and the first bearer may explicitly adopt/re-synthesize it;
  a parent checkpoint is not automatically current for the fork.
- Two carriers on one lineage register competing carrier evidence. If the host cannot uniquely
  identify them, the selector becomes `carrier_state=ambiguous`. Neither gets heuristic automatic
  restore or divergent changed commit. Existing confirmed checkpoints stay inspectable. Resolution
  requires a proven host identity transition or explicit operator choice that creates distinct
  subjects; recency never resolves it.

## Interruption, API failure, crash, and helper failure

- Ordinary successful Stop may enforce assessment. User interrupt, API failure, process kill, host
  crash, or machine loss may bypass it. Retain the last confirmed generation, mark the next observed
  state unknown/degraded, and report the uncheckpointed interval; do not claim last-moment capture.
- A missing/stale/disabled/untrusted helper, launch error, timeout, malformed output, CAS exhaustion,
  permission error, or failed read-back never clears dirty state. The adapter follows a strict local
  deadline, emits a redacted material receipt when it can, and fails open after the shared attempt
  budget so it cannot hang the host.
- If no helper ever runs, no receipt can be fabricated. `status` derives absence from installation
  and canary/readiness evidence and labels the interval unobserved.

# Liveness and loop proof

For each Stop obligation, `retry_ordinal` is either 0 or 1. Ordinal 0 may request one continuation;
ordinal 1 cannot. `stop_hook_active`/host equivalent is an additional guard. For each compaction
boundary, block budget is 0 or 1 and is durably consumed before returning a block; the next matching
attempt must allow/fail open. Restore selection retries CAS once and never asks the model to retry.
Every helper invocation has an adapter timeout no greater than the shared deadline.

Therefore no protocol path can create more than one Stop continuation, one compaction block, or two
restore selections for one obligation. A crash before recording a consumed attempt may cause replay,
but the host active flag and deterministic attempt ID make replay idempotent; where neither is
proven, that journey cannot advertise blocking support. All terminal outcomes are `clean`,
`degraded_dirty`, `skipped`, `delivered`, or `delivery_failed`; none waits forever by protocol.

# CAS, concurrency, and durability

Generation creation is expect-absent. Selector changes use fresh read-decide-CAS. Changed commit is
two-phase by necessity: create immutable generation, then CAS selector. A crash or CAS loss after
creation leaves an unselected generation, which is never auto-restored. If replay finds the same
generation already selected, it is idempotent success. If another generation/revision won, the late
generation is `superseded`; core re-reads and does not overwrite or semantically merge.

Restore uses selector-generation-selector validation. Selector CAS is the only authority for
currentness. Backend history is useful evidence but not required to choose current state.

Durability scopes are literal:

- `local_backend`: confirmed read-after-write in the currently resolved local bundle; no power-loss
  or cross-machine assertion beyond backend guarantees;
- `remote_backend`: confirmed by the remote storage contract at the named endpoint/principal;
- `synced_snapshot`: separately evidenced board-channel visibility. Lifecycle hooks never run sync,
  so this scope is not gained merely by local write.

Same-machine compaction may accept `local_backend`. Cross-machine resume requires that exact selector
and generation to be present at the target's required scope. Offline local operation remains fully
valid with an honest local-only receipt.

# Privacy, payloads, retention, and migration

The default `project_safe_v1` synthesis policy excludes transcripts, chain-of-thought/private
reasoning, credentials, secret values, full environment, raw prompts, raw tool output, and content
already durable unless its meaning/rationale is not otherwise captured. It favors references and
hashes. The checkpoint inherits the bundle's visibility; install/status/documentation must state
that a shared/public bundle can share semantic checkpoint content. The operator can disable
automatic semantic persistence per project without removing orientation hooks.

Receipt/log/status output is content-free. Raw host IDs are digested in shared documents; exact
values remain only in adapter input memory for comparison. Failure messages never echo generation
bodies. Temporary spill files are not part of the design and host spill/truncation is not accepted
as successful delivery.

The shared capsule serializer uses ordered mandatory fields: protocol/subject/generation/revision,
goals, concise system model, decisions/constraints, blockers/assumptions, gates, and exact next
action. Adapter supplies a proven direct-injection byte budget. Initial safe ceilings are at most
2,048 UTF-8 bytes for Codex (below the documented approximate 2,500-token spill threshold by the
byte-count upper bound) and 8,192 UTF-8 bytes for Claude (below 10,000 characters); OpenCode gets no
numeric claim until probed. These are conservative design ceilings, not observed maxima. Required
fields use deterministic quotas. If they cannot all fit, delivery fails visibly; host file-preview
fallback or silent field omission is not success. Full generation remains inspectable.

V1 performs no automatic hard deletion. Current and superseded generations and material receipts
remain ordinary bundle documents; `status` reports superseded/unselected retention candidates.
Future pruning must be explicit, CAS-guarded, never delete the selected generation or only
recoverable predecessor, and receive separate review. This favors recoverability over bounded disk
growth while the product learns actual churn.

Legacy `context-notes/pre-compact-main` and session-scoped variants remain readable but are never
automatically `CURRENT` under v1. Migration inventory records candidates. The first new exact-subject
checkpoint may cite a legacy note as evidence only after the same bearer re-synthesizes current
meaning; it does not copy/rename legacy bytes as authoritative state. No legacy document is deleted.

# Installation, upgrade, status, disable, and uninstall

Installation extends, rather than replaces, the current managed lifecycle entry. For each host it:

1. proves a durable absolute launcher and compatible protocol version;
2. computes all managed event/plugin entries for the supported capability epoch;
3. structurally classifies existing entries with the same exact ownership token-and-shape authority;
4. writes the complete configuration change atomically where the host permits, preserving every
   foreign byte/key/order that is outside the managed entry; and
5. records no support tier stronger than installed plus runtime-probed readiness.

Upgrade recognizes only exact prior managed shapes, migrates the SessionStart-only installation to
the dispatcher, and is idempotent. Changed/familiar-looking foreign entries are not adopted. A
malformed configuration causes refusal with no mutation. OpenCode continues exact-byte ownership of
its generated plugin; a foreign collision at that path requires operator resolution.

`status` separates:

- installed bytes/configuration;
- executable/schema compatibility;
- event-specific readiness and last canary epoch;
- journey support tier and missing probe gates;
- each subject's clean/dirty/unknown/degraded and carrier ambiguity;
- last material receipt, selected generation, actual durability scope, and legacy candidates.

Disable leaves documents intact and marks automated capture/restore off. Uninstall removes only
structurally proven managed entries/files, preserves all foreign configuration, and never deletes
selectors, generations, receipts, policy, or legacy notes. Data removal is a separate explicit
operation outside v1.

# Test seams and acceptance mapping

## Runtime-neutral deterministic seams

- Pure state-transition tables cover unknown/clean/dirty/checkpointing/degraded, revision guards,
  unchanged restrictions, retry budgets, and closed reason codes.
- Dual/tri-backend agreement tests cover expect-absent generation creation, selector CAS, crash
  between generation and selector, late-writer loss, replay, final read-back, and restore's
  selector-generation-selector race.
- Serializer tests cover canonical bytes, mandatory quotas, Unicode, escaping, exact boundary,
  redaction, no semantic bodies in receipts, and failure when required fields cannot fit.
- Recorded normalized adapter fixtures cover duplicate/out-of-order events without needing a model.
- Configuration fixtures cover absent, exact managed, old managed, duplicate, foreign, mixed,
  malformed, disabled, moved executable, upgrade, and uninstall with byte preservation.
- Semantic oracle journey gives the live bearer a canary available only in its working context, not
  in tasks/Git/transcript-driving prompt; a valid generation must preserve its meaning. External
  state-only capture must fail the oracle.

## Minimum empirical probe gates

**Codex 0.147.0:** prove pre-model Turn Ticket injection or accept the one-continuation fallback;
trace manual and forced automatic compaction with managed plus foreign handlers; run allow/block,
generic nonzero, malformed, timeout, missing-helper, and competing-handler cases; prove root and two
sibling one-shot Stop continuations; correlate hook/App Server lineage, fork, resume, and concurrent
resume; sweep direct payload boundaries; compare ordinary stop, interrupt, API failure, and kill.

**Claude Code 2.1.226:** the same Turn Ticket and semantic canary gates; trace PreCompact,
PostCompact, and compact SessionStart for manual/forced automatic journeys; distinguish proactive
auto from API-limit recovery for block behavior; exercise parallel/duplicate handlers; sweep
9,999/10,000/10,001 character host behavior while retaining the lower shared budget; prove root and
two siblings, child compaction identity, resume/fork/simultaneous resume, interruption/failure/kill,
and helper drift.

**OpenCode 1.2.15 and 1.18.15:** do not probe toward full capture while S2 remains strict. Prove
awaited system-transform injection precedes provider request; bound resolve/reject/hang and helper
failure locally; prove session/project/parent/fork/restart/duplicate-resume identity; demonstrate the
`session.compacted` async race is not an ordering dependency; sweep payloads with an instrumented
provider; re-run the matrix before any V2 support claim.

## Acceptance-criterion mapping

| Authoritative criterion | Design mechanism / proof |
|---|---|
| Meaningful preservation | Same-bearer changed verdict plus required semantic schema and canary oracle; transcripts/external state rejected as fulfillment. |
| Low intervention / low churn | Turn Ticket proactive fast path; exactly-one Stop enforcement; one selector CAS on unchanged, no generation/receipt doc, no automatic sync. |
| Lifecycle coverage | Explicit ordinary root/subagent, manual/auto compact, compact restore, resume/fork/concurrency, ungraceful loss, and helper failure flows. |
| Safety/liveness | Exact subject, CAS authority, one continuation, one block, one restore retry, deadlines, and visible fail-open degradation. |
| Single durable state | Selector/generations/receipts are ordinary bundle docs over the existing storage seam. |
| Hook management | Exact ownership, atomic desired shape, foreign preservation, partial readiness, data-preserving uninstall. |
| Tests first | Pure state/serializer/storage/config seams plus parent-red lifecycle harnesses and semantic oracle. |
| Cross-runtime honesty | Codex/Claude conditional pending probes; OpenCode restore-only/manual and capture unsupported. |
| Documentation/closure | Status vocabulary, cost disclosure, durability/privacy limits, receipt evidence, and task outcome required before shipping. |

# Host-exception ledger

| Host-specific mechanism | Shared invariant served | Why portable mechanism is insufficient | Adapter-local containment / gate |
|---|---|---|---|
| Codex `Stop` / `SubagentStop`, `stop_hook_active` | S2, S7, C4 | Same-bearer continuation is host control flow. | Adapter maps to one shared assessment attempt; probe root/siblings and malformed/failure behavior. |
| Codex `PreCompact(trigger)`, `PostCompact`, compact `SessionStart` | Boundary guard and pre-model restore | Event/order/output shapes are host-specific. | Adapter emits normalized boundary/restore events; unknown relative order is not used. One-block policy waits for failure probes. |
| Codex parallel hook execution and approximate spill threshold | S9, P5 | Shared core cannot alter host aggregation. | Idempotent/CAS adapter; conservative 2,048-byte capsule; competing-handler probes. |
| Claude `Stop` / `SubagentStop`, `stop_hook_active`, eight-block cap | S2, S7 | Same-bearer continuation/cap are Claude controls. | Shared one-attempt rule remains authoritative; cap is only backstop. |
| Claude `PreCompact` proactive-vs-recovery behavior and compact `SessionStart` 10,000-char channel | L3, S5, P5 | Recovery blocking and direct context limits differ from other hosts. | Adapter maps mode and enforces shared fail-open; 8,192-byte ceiling; failure/order probes. |
| Claude simultaneous resume with shared `session_id` | S1, S5, C5-C7 | Host lineage is not a unique carrier. | Adapter reports ambiguity; core disables automatic restore/commit. No session-id mutex. |
| OpenCode awaited `experimental.chat.system.transform` | Restore delivery only | It is the only proven pre-provider awaited injection point; async compacted events can race. | Adapter asks core for exact capsule synchronously under local deadline. No capture semantics. |
| OpenCode `experimental.session.compacting` and hidden compaction agent | Boundary observation only | The host offers no original-bearer synthesis. | Adapter may invalidate/report; it never promotes hidden summary. Automatic capture remains unsupported. |
| OpenCode sequential unbounded named hooks | S7, L3 | Host supplies no timeout/fail-open contract. | Adapter-local deadline and bounded output; resolve/reject/hang probes. |
| Per-host configuration format and ownership marker | S9 | Host config locations/shapes differ irreducibly. | Existing exact ownership classifiers remain the only mutation authority; shared desired capabilities feed them. |

Every exception translates a proven host constraint. None owns semantic schema, selector logic,
storage, revisioning, retries, restoration eligibility, or retention. An unproved exception remains
a probe gate and cannot raise the advertised support tier.

# Review focus and residual risks

Independent review should challenge four deliberate tradeoffs: (1) one small selector mutation per
turn and its board-noise cost; (2) whether a proven Turn Ticket channel exists on Codex/Claude or the
fallback would add one model continuation per turn; (3) conservative fail-closed carrier ambiguity,
which can sacrifice automatic restore for safety; and (4) no automatic retention cleanup in v1.

Residual limitations are explicit: ungraceful loss can discard work since the last confirmed
generation; a same bearer can mistakenly claim unchanged and there is no latent-state oracle;
cross-machine visibility depends on an actual sharing channel; delivery is not consumption; and
version drift removes certification until probes are rerun. These limitations are not repaired by
transcript parsing, recency, or stronger marketing language.
