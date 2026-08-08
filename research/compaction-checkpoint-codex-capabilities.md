---
type: Research
title: Codex compaction checkpoint capabilities (0.147.0)
actor: codex-checkpoint-codex-researcher
timestamp: '2026-08-08T17:25:22.008Z'
---
# Result

Codex CLI 0.147.0 has first-class documented lifecycle hooks for both manual and automatic
compaction and a documented restore channel before the next model request. The old
"SessionStart-only" premise is no longer current. The supported partial order is:

```text
PreCompact < compaction < PostCompact
compaction < SessionStart(source=compact) < next model request
```

The documentation does not establish the relative order of `PostCompact` and compact-sourced
`SessionStart`, so this is a partial order, not a total order.

The material remaining gap is semantic capture. `PreCompact` runs an external command before loss,
but its plain stdout is ignored and its documented outputs can stop or warn; it has no documented
surface that asks the still-live model context to author a synthesis. `Stop` and `SubagentStop` can
continue the same root/subagent flow with a new prompt and expose `stop_hook_active` for a one-shot
guard, but that opportunity is attached to turn/subagent stop rather than compaction. Therefore
Codex 0.147.0 can provide a strong compaction boundary and restore transport, but compaction-time
same-bearer semantic capture is only conditionally supportable through earlier proactive capture.

This report answers every row of the shared capability matrix. It does not select a production
architecture. Runtime event names below are adapter evidence only; shared checkpoint meaning,
identity, freshness, persistence, and restoration remain runtime-neutral.

# Scope and runtime identity

- Research date: 2026-08-08.
- Installed runtime: `codex-cli 0.147.0` (official changelog release date 2026-08-07).
- Executable: `/opt/homebrew/Caskroom/codex/0.147.0/bin/codex`, reached through
  `/opt/homebrew/bin/codex`.
- Executable SHA-256:
  `19c4f144c5226a9f17c58e6f0fa854843b0f77a6eb420f40e2745a12f10f5d37`.
- Platform: Apple arm64, macOS 26.6 build 25G72.
- Installed feature inspection: `hooks` is `stable` and enabled; `multi_agent` and
  `remote_compaction_v2` are also listed as stable and enabled.
- Installed schema inspection: an isolated
  `codex app-server generate-json-schema --experimental` run includes `preCompact`,
  `postCompact`, `sessionStart`, `sessionEnd`, `subagentStart`, `subagentStop`, and `stop` in
  `HookEventName`; hook run status is `running | completed | failed | blocked | stopped`.
- Repository state was read only. No hook, runtime config, code, branch, or real Codex state was
  changed. No authenticated turn or lifecycle hook was fired.

# Evidence classes and sources

Claims are tagged so documented contracts are not conflated with installed-surface inspection or
empirical lifecycle behavior.

- **D-H (documented, current release behavior):** OpenAI [Hooks guide](https://learn.chatgpt.com/docs/hooks),
  especially [common input](https://learn.chatgpt.com/docs/hooks#common-input-fields),
  [common output](https://learn.chatgpt.com/docs/hooks#common-output-fields),
  [large output](https://learn.chatgpt.com/docs/hooks#large-hook-output),
  [`SessionStart`](https://learn.chatgpt.com/docs/hooks#sessionstart),
  [`SessionEnd`](https://learn.chatgpt.com/docs/hooks#sessionend),
  [`PreCompact`](https://learn.chatgpt.com/docs/hooks#precompact),
  [`PostCompact`](https://learn.chatgpt.com/docs/hooks#postcompact),
  [`SubagentStop`](https://learn.chatgpt.com/docs/hooks#subagentstop), and
  [`Stop`](https://learn.chatgpt.com/docs/hooks#stop). The guide explicitly says it is the release
  behavior reference and that linked `main` schemas may contain unreleased fields.
- **D-A (documented):** OpenAI [App Server guide](https://learn.chatgpt.com/docs/app-server),
  including thread start/resume/fork identity, `thread/compact/start`, `turn/interrupt`, and
  `hook/started` / `hook/completed` notifications.
- **D-CLI (documented):** OpenAI [CLI commands and workflows](https://learn.chatgpt.com/docs/developer-commands?surface=cli),
  including `codex resume`, `codex fork`, `/compact`, and `/fork`.
- **D-CFG (documented):** OpenAI [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
  and [advanced configuration](https://learn.chatgpt.com/docs/config-file/config-advanced), including
  config layers, project trust, hooks, and the distinct legacy `notify` surface.
- **D-CH (documented):** OpenAI [Codex changelog](https://learn.chatgpt.com/docs/changelog).
  It lists CLI 0.147.0 and records the earlier 0.145.0 changes for hook-output spilling and running
  compact-sourced `SessionStart` before turn continuation.
- **I-B (installed-surface inspection):** `codex --version`, `codex --help`,
  `codex features list`, executable metadata/hash, and installed app-server schemas generated under
  an isolated temporary `CODEX_HOME`. This proves exposed 0.147.0 surfaces, not event behavior.
- **I-R (repository inspection):** the current agentstate-lite implementation and tests,
  principally `packages/cli/src/commands/hook.ts` and
  `packages/cli/test/hook-reconciliation.test.ts` / `session-start.test.ts`. They establish
  structural, foreign-preserving management of the existing `SessionStart` entry, not of the new
  checkpoint lifecycle.
- **E (isolated empirical lifecycle observation):** none in this phase. No claim below treats docs,
  help text, feature output, or generated schemas as an observed hook firing. Deterministic probes
  are listed separately.

# Documented lifecycle and payload facts

## Compaction and restoration

- Both `PreCompact` and `PostCompact` expose `trigger: "manual" | "auto"`, plus the common
  `session_id`, nullable `transcript_path`, `cwd`, `hook_event_name`, `model`, and turn-scoped
  `turn_id`. `PreCompact` runs before compaction; `PostCompact` runs after it. Plain stdout is
  ignored for both. JSON may use the common control fields. `PreCompact` `continue:false` stops
  before compaction; `PostCompact` `continue:false` stops after it. [D-H]
- Root compaction causes `SessionStart` with `source:"compact"` before the next model request.
  Automatic compaction in the middle of a turn delivers the hook's added developer context to the
  immediate continuation. `continue:false` ends the turn without another model request. [D-H]
- `SessionStart` accepts plain stdout as developer context or JSON
  `hookSpecificOutput.additionalContext`. Its source values are `startup`, `resume`, `clear`, and
  `compact`. [D-H]
- App Server provides a deterministic manual trigger: `thread/compact/start` returns `{}`
  immediately and streams a `contextCompaction` item lifecycle on the same `threadId`. [D-A]

## Root and subagent continuation

- `Stop` receives `turn_id`, `stop_hook_active`, and nullable `last_assistant_message`. Exit 0
  requires JSON; plain text is invalid. `decision:"block"` (or exit code 2 with stderr reason)
  continues the flow by creating a new prompt that acts as a user prompt. A hook can gate on
  `stop_hook_active` to request only one continuation. Any matching `continue:false` wins over
  continuation decisions. [D-H]
- `SubagentStop` has the analogous continuation control and adds `agent_id`, `agent_type`, and
  nullable `agent_transcript_path`. Its continuation is described as continuing the subagent flow.
  `stop_hook_active` again tells whether it was already continued. [D-H]
- `SessionEnd` is advisory and cannot steer Codex or keep a thread open. It can run on archive or
  deletion of an open conversation, normal close, or after 30 minutes idle while not open in a
  connected client. It does not run for subagents. Switching away or `thread/unsubscribe` does not
  immediately end the session. [D-H]
- App Server's `turn/interrupt` deterministically requests cancellation and yields terminal turn
  status `interrupted`; the docs do not say that `Stop` runs on this path. [D-A]

## Hook execution and output

- All matching hooks from all active files/sources run. Multiple matching command hooks for the
  same event are launched concurrently, so one cannot prevent another from starting. Higher-layer
  hooks do not replace lower-layer hooks. [D-H]
- A command hook receives one JSON object on stdin and runs with the session `cwd`. Default timeout
  is 600 seconds for most hooks. `SessionEnd` defaults to 1 second and is capped at 3 seconds.
  `async` is parsed but unsupported; only command handlers run today. [D-H]
- Exit 0 with no output means success. For `Stop` and `SubagentStop`, exit-0 plain text is invalid.
  The guide does not provide a complete event-by-event contract for timeout, arbitrary nonzero exit,
  malformed JSON, launch failure, or competing `PreCompact` results; those remain probe gaps. [D-H]
- App Server emits `hook/started` and `hook/completed` with `threadId`, optional `turnId`, and a
  hook run summary. The installed 0.147.0 schema exposes run ids, event, scope, timestamps,
  duration, entries, source/display order, and final status. This distinguishes runtime acceptance
  and completion from model use, but supplies no model-consumption acknowledgment. [D-A, I-B]
- Model-visible output spills at roughly 2,500 tokens by default. Per-handler
  `additionalContextLimit` changes the approximate threshold; `0` sends all additional context.
  Oversized full output is written beneath `<temp_dir>/hook_outputs/<session_id>/<uuid>.txt`, while
  the model gets a head-and-tail preview and path; if file writing fails, it still gets a truncated
  preview. Limits are per handler and outputs from multiple hooks accumulate. [D-H]

## Identity facts

- Hook `session_id` is the current Codex session id; subagent hooks use the parent session id.
  Turn-scoped events have `turn_id`; subagent events have `agent_id`. `cwd` is available but is not
  documented as a canonical project identity. [D-H]
- App Server threads have `thread.id`. `thread/resume` with the recorded id returns that same thread
  id. A distinct `thread.sessionId` identifies the current live session-tree root: root threads use
  their own id, non-ephemeral forks keep the root session id, and clients are warned to read it rather
  than derive it. A non-ephemeral fork receives a new thread id and `forkedFromId`; an ephemeral fork
  receives a new thread id and, in the documented example, a new session id equal to itself. [D-A]
- The docs do not define a relation between hook `session_id` and App Server `thread.id` or
  `thread.sessionId`. They also do not provide an explicit carrier-execution id. Therefore names
  that look similar must not be equated without a trace. [D-H, D-A]
- Transcript paths are convenient but the transcript format is explicitly unstable. They cannot be
  the semantic contract or a stable identity source. [D-H]

# Capability matrix

## 1. Before manual compaction event

**Answer: yes. Confidence: high.** `PreCompact(trigger:"manual")` is documented to run before
Codex compacts the chat. It establishes a command opportunity while the runtime still holds the old
context, but the command receives metadata rather than the model's latent understanding. [D-H, I-B]

Relevant invariants: S8, S10, L3. Strongest honest degradation: if the hook is unavailable or fails,
report the boundary as missed and retain only the last confirmed checkpoint; do not infer semantic
capture from event launch.

## 2. Before automatic compaction event and same surface/order

**Answer: yes. Confidence: high for the documented contract; no empirical trace yet.** The same
`PreCompact` event has `trigger:"auto"` and is documented before compaction. Compact-sourced
`SessionStart` is also explicitly documented for automatic mid-turn compaction. [D-H, I-B]

Relevant invariants: S7, S8, S10, L1, L3. Gap: automatic pressure is not yet forced in a
version-pinned harness. Degraded mode: advertise documented-but-unverified automatic-boundary
support, not an empirically certified guarantee.

## 3. Delay/block semantics and timeout/error behavior

**Answer: conditional. Confidence: high for explicit control, medium for the failure envelope.**
`PreCompact` `continue:false` stops before compaction; `PostCompact` stops after it; compact
`SessionStart` `continue:false` ends the turn before the next request. Most hooks default to a very
large 600-second timeout. However the release guide does not completely specify what each
compaction event does on timeout, launch failure, arbitrary nonzero exit, malformed JSON, or
conflicting handlers. [D-H, I-B]

Relevant invariants: S7, L3-L5, D4. Degraded mode: use a stricter shared finite budget than the host
default; after one bounded failure, leave the subject dirty/degraded, emit a safe receipt, and allow
the boundary according to policy. Never claim boundary blocking is fail-closed until the negative
matrix is observed.

## 4. Same-bearer continuation exactly once for semantic synthesis

**Answer: conditional. Confidence: high.** `Stop` can continue the root flow with an automatic new
prompt, and `SubagentStop` can continue the subagent flow. `stop_hook_active` supplies the evidence
needed for an adapter to request at most one continuation. `PreCompact` itself has no documented
same-model continuation/synthesis output; its plain stdout is ignored and its only relevant control
is stopping before compaction. [D-H]

Relevant invariants: S2, S7, C4, L1-L3. Degraded mode: proactive same-bearer synthesis may be
requested at a prior `Stop`/`SubagentStop`; if work becomes dirty afterward or automatic compaction
arrives before such a stop, mark last-moment semantic capture unsupported and keep the obligation
dirty. External transcript parsing is evidence at most, not fulfillment.

## 5. Ordinary root stop versus interruption

**Answer: conditional. Confidence: medium-high.** Ordinary model stop exposes the steerable `Stop`
hook and one-shot continuation. `SessionEnd` exposes a later, advisory command opportunity at normal
close/archive/delete/idle but cannot continue the model and does not represent every UI transition.
App Server documents deterministic `turn/interrupt` cancellation but does not state that `Stop` or
`SessionEnd` runs before or after interruption. Process kill, crash, API failure, and host timeout
have no documented final same-bearer opportunity. [D-H, D-A]

Relevant invariants: S2, S7, S10, L3-L5. Degraded mode: promise semantic synthesis only for an
observed ordinary `Stop` path; treat interrupt/failure/kill as ungraceful loss retaining the last
confirmed checkpoint.

## 6. Subagent events, identity, and same-agent synthesis

**Answer: conditional. Confidence: medium-high.** `SubagentStart` and `SubagentStop` expose an
`agent_id` and `agent_type`; stop also exposes the subagent transcript path, last message, and
one-shot continuation state. This can separate sibling stop-time requests. No subagent-specific
compaction event or stability contract for `agent_id` across compaction, continuation, resume, or
process restart is documented. Subagent hooks' `session_id` is the parent's, not the bearer key.
[D-H, I-B]

Relevant invariants: S1-S2, C1, C4, C6. Degraded mode: exact per-subagent stop-time capture is
candidate support within one observed lifetime; automatic cross-boundary restore must remain off
when bearer identity stability is not evidenced.

## 7. Opaque identifiers for project, continuity, carrier, root, and subagent

**Answer: conditional. Confidence: high that the set is incomplete.** Available values are hook
`session_id`, `turn_id`, and subagent `agent_id`; App Server `thread.id`, `thread.sessionId`, and
`forkedFromId`; plus `cwd`. There is no documented canonical project id or carrier-execution id,
and the relation between hook and App Server session/thread identifiers is unspecified. `cwd`, role,
actor, and recency cannot fill the missing components. [D-H, D-A]

Relevant invariants: S1, S5, C1, C5-C6. Degraded mode: persist qualified, inspectable checkpoint
candidates with all observed provenance, but do not auto-select/restore until the complete exact
subject can be mapped.

## 8. Identifier stability across compact, resume, continuation, and restart

**Answer: conditional. Confidence: medium.** Resume is documented to reuse recorded `thread.id`.
Non-ephemeral fork creates a new thread id but retains the root `thread.sessionId`; ephemeral fork
creates a new session root. `Stop` continuation carries an active turn id and a continuation flag.
The docs do not explicitly promise hook `session_id` stability across compaction, identify a new
carrier after compaction/restart, define concurrent duplicate resume, or guarantee subagent id
stability. [D-H, D-A, D-CLI]

Relevant invariants: S1, S4-S5, C1-C7. Degraded mode: cross-process resume can use recorded
`thread.id` only after an adapter trace proves its relation to hook identity; forks must be distinct
checkpoint subjects even when `thread.sessionId` shares a root.

## 9. Post-loss event before first dependent model action

**Answer: yes. Confidence: high for root compaction.** A compact-sourced `SessionStart` runs after
root compaction and before the next model request, including the immediate continuation after
automatic mid-turn compaction. This is an evidenced restoration opportunity. The relative order
against `PostCompact` is not stated, and there is no parallel documented subagent-compaction
contract. [D-H]

Relevant invariants: S5-S6, S8, P5, C5. Degraded mode: if exact eligibility or bounded payload
construction fails, send no checkpoint content and report `DELIVERY_FAILED`/ineligible rather than
injecting a heuristic candidate.

## 10. Bounded context injection and encoding limits

**Answer: conditional. Confidence: high for the channel, medium for hard bounds.** `SessionStart`
can add developer context using plain stdout or structured `additionalContext`. The documented
spill threshold is approximate, defaults to 2,500 tokens per handler, and may be changed or disabled
with `0`. Oversize output becomes a head/tail preview plus a temp path; multiple hook outputs
accumulate. No release contract was found for exact byte/token accounting, Unicode normalization,
multiline escaping, or ensuring mandatory semantic sections survive spill. [D-H, D-CFG, I-B]

Relevant invariants: P3-P6, S5-S6. Degraded mode: the shared helper must impose its own deterministic
byte/schema budget and fail delivery if required sections do not fit; it must not rely on host spill
as valid checkpoint truncation.

## 11. Acceptance versus model use and causal acknowledgment

**Answer: conditional. Confidence: high.** App Server `hook/started` and `hook/completed`, plus the
installed hook run summary/status, can prove handler launch and completion separately from later
model execution. Compact-sourced `SessionStart` ordering proves accepted context is positioned
before the next request. No documented nonce acknowledgment, consumption receipt, or causal-effect
proof exists. [D-A, I-B]

Relevant invariants: S6, D4. Degraded mode: record at most `DELIVERED` when the hook/context channel
completes; never label it consumed or used. Keep checkpoints recoverable because delivery cannot
justify destructive retention.

## 12. Multiple handler ordering and concurrency

**Answer: conditional. Confidence: high.** All matching sources run and matching command handlers
for one event launch concurrently. One cannot prevent another from starting. For `Stop` and
`SubagentStop`, any `continue:false` takes precedence over continuation decisions. The docs do not
establish deterministic completion order, context aggregation order, relative ordering of
`PostCompact` versus compact `SessionStart`, or all conflict semantics for compaction hooks. The
installed schema exposes `displayOrder`, which is metadata, not proof of execution serialization.
[D-H, I-B]

Relevant invariants: S7, S9, C2-C4, C7. Degraded mode: adapters must be idempotent and CAS-safe and
must tolerate duplicate/concurrent calls; foreign handlers cannot be assumed to run before or after
the managed handler.

## 13. Timeout, output, environment, cwd, stdin, credentials, and network

**Answer: conditional. Confidence: high for documented fields, low for process inheritance.** One
JSON object arrives on stdin; commands run in session `cwd`; common ids/model/transcript metadata are
present; most hooks default to 600 seconds; output spilling is documented. Plugin hooks receive
plugin root/data variables. The official contract does not inventory the full inherited environment,
shell, PATH, credential variables, proxy/network access, sandboxing, or filesystem permissions for
hook commands. [D-H, D-CFG]

Relevant invariants: S7, P3-P6, L3-L5. Degraded mode: helpers must require no ambient credential or
network access for local checkpoint writes, use explicit paths, redact diagnostics, and report
readiness false when launch prerequisites are absent.

## 14. Structural install, upgrade, status, disable, and uninstall

**Answer: conditional. Confidence: high.** Codex provides mergeable user/project hook sources,
exact-hash trust, `/hooks` inspection/individual disablement, global `[features] hooks=false`, and
project trust gating. All matching sources coexist rather than override each other. Current
agentstate-lite code/tests structurally recognize and preserve foreign `SessionStart` entries and
refuse malformed shapes, but manage only the existing SessionStart behavior; they are not evidence
for Pre/PostCompact, Stop, SubagentStop, migration, or lifecycle-wide readiness. [D-H, D-CFG, I-R]

Relevant invariants: S9, D6, L5. Degraded mode: report current checkpoint lifecycle as uninstalled or
partial even when the legacy SessionStart hook is current. Require byte-preservation fixtures and
exact managed-entry ownership before any future lifecycle install claim.

## 15. Deterministic scenario harness

**Answer: conditional. Confidence: medium.** Manual root compaction can be forced by App Server
`thread/compact/start`; stored threads can be resumed or forked by id; in-flight turns can be
interrupted. These give deterministic entry points. No official deterministic mechanism was found
to force automatic context pressure, guarantee a root/subagent's semantic response, simulate API
failure, or exercise process kill while preserving an oracle. No repo-owned 0.147.0 hook receipt
harness exists yet. [D-A, D-CLI, I-R]

Relevant invariants: S10, L3-L4, C1-C7. Degraded mode: only manual-compaction/install-fixture support
can be certified initially; automatic, interruption, and subagent claims remain gated on their own
repeatable traces.

## 16. Sensitive data exposed to hooks and logs

**Answer: conditional. Confidence: high for the named-field inventory.** Hook code can receive
absolute `cwd`, transcript path, model, session/turn/subagent ids, submitted prompt, tool input and
response on other hook types, and last root/subagent assistant messages. Subagent hooks may receive a
subagent transcript path. Transcript content is reachable through the path while present. Oversized
hook output may be persisted in a temp file. App Server hook summaries contain output entries, so
errors/context can surface to connected clients. Full environment/credential inheritance remains
undocumented. [D-H, D-A]

Relevant invariants: P1-P6, D2, S5. Degraded mode: default to minimum semantic synthesis, never log
checkpoint bodies or transcript excerpts, avoid transcript parsing, hash/redact identity in
telemetry where feasible, and treat temp spilling as an additional disclosed exposure.

## 17. Missing, stale, unhealthy, or never-launched helper

**Answer: conditional. Confidence: medium-low.** Changed/untrusted non-managed hooks are skipped
until their exact definition is trusted; project-local hooks are skipped in untrusted projects;
hooks can be globally disabled; App Server exposes failed/stopped hook status and warning events.
`SessionEnd` explicitly reports timeout/error as hook failure. The release guide does not fully state
whether each compaction/restore boundary proceeds or stops for missing executables, permission
errors, malformed output, timeout, version mismatch, or host termination before launch. No isolated
agentstate-lite failure matrix was run. [D-H, D-A, D-CFG, I-B]

Relevant invariants: S3, S7, S10, L3-L5, D4. Degraded mode: readiness must be false/partial when the
helper is untrusted, disabled, missing, incompatible, or unobserved; an absent launch never creates a
receipt or clears dirty state. Retain the last confirmed checkpoint and surface a content-minimal
reason.

# Design implications without architecture selection

1. Codex no longer requires inferring compaction from a later startup. A thin adapter can map
   documented pre-loss, post-loss, and pre-next-request events while keeping the shared protocol
   independent of those names.
2. A compaction hook is not a semantic checkpoint. The runtime-neutral design must keep capture,
   persistence confirmation, and restore delivery separate; command execution alone cannot satisfy
   same-bearer semantic synthesis.
3. The strongest supported Codex envelope is currently: proactive same-bearer capture at a bounded
   `Stop`/`SubagentStop` opportunity; command-side validation/CAS persistence; pre-compaction
   freshness check and bounded delay; then exact compact-start restoration. Automatic compaction
   after uncheckpointed work remains an honest gap until a prior synthesis opportunity is assured.
   This is an envelope, not a chosen implementation.
4. Hook `session_id`, App Server `thread.id`, and `thread.sessionId` are separate evidence fields until
   a version-pinned trace relates them. Fork lineage must not collapse checkpoint subjects.
5. Host spill limits are unsuitable as the shared protocol's size contract. The shared layer needs a
   deterministic format/budget and explicit failure if required continuation state does not fit.
6. Hook completion can support a delivery receipt, but there is no basis for a consumed/used state.
7. Existing agentstate-lite hook reconciliation is valuable infrastructure but cannot be relabeled
   checkpoint-ready without lifecycle-wide ownership, migration, status, and failure tests.

# Deterministic probe gaps for the implementation plan

These are the minimum probes needed to promote conditional claims. They should use a pinned 0.147.0
binary, isolated temporary `CODEX_HOME` and bundle, no live user config, content-free event logs, and
an explicit timeout.

1. Trace manual compaction with two concurrent foreign/managed handlers and record timestamps for
   `PreCompact`, compaction item, `PostCompact`, compact `SessionStart`, hook completion, and first
   model request. Include success, `continue:false`, exit 2, arbitrary nonzero, timeout, missing
   executable, and malformed JSON.
2. Force automatic mid-turn pressure and assert the same event/order contract and immediate context
   injection. If pressure cannot be forced deterministically, leave automatic support documented
   but uncertified.
3. Run a canary known only to the live root bearer, request exactly one `Stop` continuation, persist
   synthesis, and prove `stop_hook_active` prevents a loop. Repeat for two sibling subagents and
   prove bearer isolation.
4. Record hook `session_id`, App Server `thread.id`/`thread.sessionId`, turn id, and subagent id across
   manual/automatic compact, continuation, fresh-process resume, non-ephemeral fork, ephemeral fork,
   and two concurrent resumes. Never store transcript content.
5. Exercise bounded context at below/at/above thresholds with Unicode and multiline JSON. Assert the
   helper's own hard budget, required-section preservation, truncation disclosure, and no body in
   errors/temp spill.
6. Compare ordinary `Stop`, `turn/interrupt`, process kill, API failure, and idle/normal
   `SessionEnd`; record which hooks actually launch and whether the same bearer can still synthesize.
7. Extend structural fixture tests across empty, existing managed, foreign, duplicate, changed,
   untrusted, disabled, malformed, upgrade, and uninstall configurations. Assert byte preservation
   for every foreign entry and readiness false when any required event is absent.

# Conclusion

Every capability row is answered for Codex CLI 0.147.0. The compaction and restoration surfaces are
documented strongly enough to supersede the prior SessionStart-only assumption. The support claim
must nevertheless remain conditional overall because semantic synthesis is available at stop-time,
not directly at the compaction hook, and because exact identity mapping and negative failure
behavior still require isolated traces. The honest degradation is to retain and restore only the
last version-confirmed exact-subject checkpoint, expose dirty/degraded state, and never substitute
transcript extraction, external state, recency, or hook launch for same-bearer semantic synthesis.
