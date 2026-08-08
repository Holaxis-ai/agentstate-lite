---
type: Context Note
title: Codex compaction checkpoint research result
actor: codex-checkpoint-codex-researcher
timestamp: '2026-08-08T17:25:33.918Z'
---
# Summary

Codex runtime capability research is structurally complete for all 17 rows of the shared
compaction-checkpoint matrix.

**Ultimate goal:** Make agent context durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Establish version-scoped Codex lifecycle, identity, synthesis, restoration, and
failure facts without selecting production architecture. This serves the ultimate goal by defining
the honest support envelope a thin Codex adapter can expose to the runtime-neutral protocol.

# Durable result

- Research artifact: `research/compaction-checkpoint-codex-capabilities`
- Artifact version at completion:
  `sha256:768fd86f3ae58b7539a344fb10ec1837153a21c40fd9300eccf1eaa4a18b524f`
- Target: Codex CLI 0.147.0, arm64 macOS 26.6 build 25G72, researched 2026-08-08.
- Evidence: current official OpenAI Hooks/App Server/CLI/config/changelog documentation; isolated
  installed-binary version, feature, help, executable-hash, and generated-schema inspection; read-only
  agentstate-lite hook reconciler/test inspection. No authenticated lifecycle run or live config
  mutation occurred.

# Current system model

Codex 0.147.0 documents both manual and automatic `PreCompact`/`PostCompact` events and a
compact-sourced `SessionStart` before the next model request, including immediate automatic mid-turn
continuation. This supersedes the old SessionStart-only assumption. The established partial order is
`PreCompact < compaction < PostCompact` and
`compaction < SessionStart(compact) < next model request`; relative `PostCompact` versus
`SessionStart` order remains unspecified.

`PreCompact` is a command boundary, not a model-synthesis channel. Same-bearer continuation exists
instead at root `Stop` and `SubagentStop`, where a new prompt can continue the same flow and
`stop_hook_active` permits an at-most-once guard. Therefore the strongest honest envelope is
proactive stop-time semantic capture plus compaction-time validation/delay and exact pre-next-request
restore. Automatic compaction after newer uncheckpointed work remains degraded; transcript scraping
or deterministic external state cannot satisfy semantic synthesis.

Hook and App Server identities are not interchangeable by name. Hook `session_id` (parent id for
subagent hooks), App Server `thread.id`, `thread.sessionId`, `forkedFromId`, `turn_id`, and subagent
`agent_id` are evidence fields whose exact subject mapping needs a trace. `cwd` is not a canonical
project id, and no carrier-execution id is documented.

Hook launch/completion can be observed through App Server and the installed hook run schema, but no
model-consumption/causal acknowledgment exists. Host output spilling is approximate and cannot be
the shared protocol's deterministic size contract.

# Unverified assumptions and next evidence

1. Total order among concurrent handler completion, `PostCompact`, compact `SessionStart`, and the
   first continued request.
2. Compaction-event behavior for timeout, missing executable, arbitrary nonzero exit, malformed
   JSON, and conflicting handler decisions.
3. Stable mapping among hook/App Server ids across compact, fresh-process resume, forks, concurrent
   resume, and sibling subagent lifetimes.
4. Deterministic automatic-compaction and subagent harnesses.
5. Stop behavior under `turn/interrupt`, process kill, API failure, and host timeout.
6. Exact bounded-context encoding, Unicode, truncation, and required-section preservation.
7. Full hook process environment, credential, network, and sandbox inheritance.
8. Lifecycle-wide agentstate-lite install/status/upgrade/disable/uninstall preservation and readiness;
   the current implementation proves this structurally only for its existing SessionStart entry.

# Handoff

Use the research artifact as a capability/evidence input to cross-runtime reconciliation. Do not
promote conditional rows to support claims without the listed isolated probes, do not equate hook
launch with synthesis or delivery with model use, and keep host event names within the Codex adapter.
No production architecture was selected.
