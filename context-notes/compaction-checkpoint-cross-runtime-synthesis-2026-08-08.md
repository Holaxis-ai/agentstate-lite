---
type: Context Note
title: Cross-runtime compaction checkpoint research synthesis
description: >-
  Converged lifecycle facts, support tiers, and design constraints across Codex,
  Claude Code, and OpenCode.
actor: codex-compaction-orchestrator
timestamp: '2026-08-08T17:30:04.220Z'
---
# Summary

The 2026-08-08 capability research supports one runtime-neutral protocol with unequal support tiers,
not three separate architectures.

## Converged facts

- Codex 0.147.0 and Claude Code 2.1.226 both expose manual/automatic compaction boundaries,
  successful root/subagent stop continuation, and compact-sourced startup context before the next
  model request.
- Neither host can ask the same context bearer to synthesize directly from `PreCompact`. Same-bearer
  semantic capture must happen proactively through bounded `Stop`/`SubagentStop` continuation or
  another earlier same-bearer protocol.
- `PreCompact` can guard freshness and delay/block, but failure behavior and competing-handler
  ordering still need bounded isolated probes. It must not become an unbounded liveness gate.
- Codex and Claude expose useful lineage and subagent identifiers, but neither exposes a complete,
  unique active-carrier identity. Simultaneous resume can therefore require an explicit ambiguous
  state rather than heuristic restoration.
- Both provide a post-compaction injection opportunity, but host acceptance is only `DELIVERED`,
  never proof that the model consumed or acted on the checkpoint.
- OpenCode 1.2.15/1.18.15 uses a hidden tool-less compaction agent and has no same-original-bearer
  synthesis or reliable pre-stop boundary. Strict semantic capture is unsupported. Its awaited
  `experimental.chat.system.transform` can conditionally restore an already-current checkpoint,
  while inspectable/manual recovery remains supported.
- Ungraceful interruption, API failure, host crash, or process kill cannot guarantee last-moment
  synthesis on any host. The design must retain the last confirmed checkpoint and report the gap.
- Existing agentstate-lite hook installation already provides a safe extension seam: durable
  absolute launch authority, exact ownership, foreign-config preservation, status, upgrade, and
  uninstall. It does not yet manage the wider lifecycle or checkpoint state.

## Design constraints carried forward

1. Preserve strict same-bearer semantic synthesis. Do not relabel transcripts, host summaries, or
   OpenCode's compaction agent output as fulfilled capture.
2. Keep shared schema, subject identity, revision/freshness, CAS, persistence, selection, receipts,
   retry bounds, and degradation in one core.
3. Confine host code to event/payload/limit/config translation. No Claude journal, tmux broker,
   OpenCode hidden-model conversation, or host-owned checkpoint schema.
4. Define explicit support tiers: full/conditional capture+restore for evidenced Codex/Claude
   journeys; restore-only and inspectable/manual for OpenCode until a same-bearer primitive exists.
5. Solve the tension between reliable dirtiness and low churn. The design must explain how a turn
   becomes an exact context revision, how trivial turns can confirm “unchanged” without creating a
   new semantic note, how a forgotten checkpoint is enforced, and what runtime/bundle writes occur
   on every turn.
6. Treat lineage identity and carrier-execution identity separately. When concurrency cannot be
   resolved exactly, automatic restore is ineligible rather than “latest wins.”
7. Bound payloads below host limits with shared serialization; never rely on host spill/truncation
   to preserve required sections.
8. Keep ungraceful loss, delivery, and effect receipts honest and non-destructive.
9. Version-gate adapter support and make deterministic lifecycle/failure probes implementation
   prerequisites only for the selected paths, not a new exact-host proof architecture.

## Evidence

- [domain model](../designs/compaction-checkpoint-domain-model.md)
- [Codex capabilities](../research/compaction-checkpoint-codex-capabilities.md)
- [Claude Code capabilities](../research/compaction-checkpoint-claude-capabilities.md)
- [OpenCode capabilities](../research/compaction-checkpoint-opencode-capabilities.md)
- [current implementation baseline](compaction-checkpoint-current-architecture-2026-08-08.md)

**Ultimate goal:** Make agent work durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Convert the shared facts into one reviewed design that remains portable and
honest where host capabilities differ.
