---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T17:30:59.304Z'
---
# Summary

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets, in plain text and owned by the user.

Proximate goal: design, implement, independently review, and adversarially validate revision 3 of multi-session compaction handoffs; this serves the ultimate goal by making the session-boundary rail itself executable, verifiable, and fail-closed.

Status: orientation complete; research and acceptance-definition phase starting. Revision 2 is rejected and its proposed global instruction and hook diffs must not be applied.

# Current system model

Claude Code invokes host lifecycle hooks with a full session_id and, inside subagents, agent_id. PreCompact can block but cannot inject agent context. PostCompact is side-effect-only. SessionStart with source compact can inject context for the first post-compaction model turn.

agentstate-lite already owns typed mutation, version receipts, CAS writes, expected-version deletion, kind conventions, recipes, hook installation, and cross-host hook status. Revision 3 should compose those authorities rather than reproducing them in shell and prose.

# Domain model

- runtime adapter: the host-specific translation from lifecycle payloads to the host-neutral handoff authority.
- canonical execution identity: a path-safe, collision-resistant identity derived from runtime plus full session identity plus full subagent identity when present.
- compaction generation: one handoff attempt within an execution identity; repeated compactions are distinct generations or explicit CAS replacements.
- handoff record: validated structured state sufficient to resume, including goal/task refs, decisions/evidence, constraints, blockers, loaded skills, and next action.
- lifecycle authority: one executable owner of identity validation, persistence, lookup, restoration receipt, consume, and GC policy.
- write receipt: proof that the intended generation was durably persisted before compaction may proceed.
- read receipt: exact record identity plus version returned to the restoring side.
- restore acknowledgement: evidence that restoration reached the first post-compaction model boundary before consume is allowed.
- consume: deletion or retirement of exactly the version restored; must fail closed against a newer generation.
- GC sweep: a named, bounded owner/trigger for expired abandoned generations, using validation and CAS.
- fallback candidate: an untrusted record surfaced when canonical identity is unavailable; never an automatic identity proof.
- role: advisory coordination metadata; not a unique orchestrator lease unless separately governed by CAS.
- local/shared placement: explicit policy for whether ephemeral handoffs live only on the host or participate in board sync.

# Acceptance boundary

Automated unit/agreement/adversarial tests are necessary but not sufficient. Acceptance requires exact installed-version manual and automatic compaction journeys proving the lifecycle rail invokes the authority, persists before compaction, restores through a supported model-context event, and consumes only the restored version. If the live rail cannot be exercised, the verdict is blocked-pending-verification.

# Unverified assumptions

- The best host-neutral shape and whether a private command remains private or becomes a public CLI verb.
- Whether PostCompact direct persistence or PreCompact fail-closed persistence best preserves a model-authored decision card.
- Which event identifier can safely distinguish repeated compaction generations.
- The exact isolated harness for automatic compaction without mutating the users active sessions.
- Runtime support beyond a Claude-only pilot; unsupported adapters must be labeled rather than inferred.

# References

- reviews/pre-compact-multi-session-team-2026-08-03
- designs/pre-compact-multi-session
- context-notes/review-precompact-codex-concurrency
- context-notes/review-precompact-codex-ecosystem
- context-notes/review-precompact-codex-skeptic
