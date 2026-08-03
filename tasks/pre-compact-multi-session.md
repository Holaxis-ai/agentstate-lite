---
type: Task
title: >-
  Review the pre-compaction context-note design for multi-session safety (single
  fixed id collides)
status: blocked
priority: '2'
description: >-
  DESIGN VETTED, awaiting Brian's sign-off (2026-08-03). Team:
  Scout->Designer->2x Skeptic passes. designs/pre-compact-multi-session resolves
  all 6 decision points; skeptic verdict PASS-WITH-CAVEATS, every mechanism
  tested on the built CLI (write->read->consume loop, machine-scoped queries, jq
  id-derivation across 6 edge cases). Blocked on: Brian applying 3 proposed
  diffs (global CLAUDE.md + ~/.claude/hooks/pre-compact.sh + post-compact.sh) —
  no agent touches those. Open gap: session_id presence in PreCompact main
  payload + survival across --resume needs a live-compaction check; design
  degrades to a guarded best-effort fallback (detectable failure, not silent
  corruption) if absent. Evidence:
  context-notes/research-precompact-multisession,
  context-notes/review-precompact-multisession.
actor: claude-main-precompact
timestamp: '2026-08-03T15:48:46.991Z'
---
# Multi-session-safe pre-compaction context notes

## Problem

The pre-compaction handoff convention writes the MAIN agent's state to a SINGLE fixed id
`context-notes/pre-compact-main`. Sub-agents already scope per id (`pre-compact-{agent_id}`), but the
main agent does not. When MULTIPLE main-agent sessions run concurrently (a normal state here — several
sessions run at once), they COLLIDE on that one id: whoever writes last clobbers the others, or `sync`
converges and all-but-one are exported to a file and effectively lost. The failure is SILENT and costs
exactly what the note exists to prevent — handoff context across a compaction boundary. Brian hit the
adjacent symptom this session: trying to identify "the main orchestrator" among several live sessions.

## Goal

Review/redesign the pre-compaction handoff so it supports multiple concurrent sessions ELEGANTLY — no
collision, no silent loss, and a resuming session can reliably find ITS OWN note (and, when relevant,
discover the others).

## Decision points / AC to consider

1. **Note identity.** Per-session id (e.g. `pre-compact-{session_id}` or `pre-compact-main-{session_id}`).
   What is the stable session identifier — session id, machine, actor, or a composite? Ties directly to
   the per-person/per-session IDENTITY prerequisite already surfaced in `designs/user-notices` — same root
   need; solve them consistently.
2. **Discovery on resume.** With per-session ids, "read `pre-compact-main`" no longer works. A resuming
   session must find the RIGHT note — match on its own session/machine/actor, else fall back to the most
   recent. Define the deterministic lookup (list `pre-compact-*` + a pick rule).
3. **Cleanup / staleness.** Per-session notes accumulate. Need expiry or explicit supersede/consume so the
   store does not silt up with dead handoffs (mirror the expiry + self-cleaning stance from
   `designs/user-notices`). A resumed session should mark its own note consumed.
4. **Orchestrator distinguishability.** When several main sessions each hold a note, which is THE
   orchestrator's? Consider an explicit role marker so "find the main orchestrator" is a QUERY, not
   guesswork — the exact problem Brian hit this session.
5. **Convention vs tooling.** Today this is a pure CONVENTION documented in the global CLAUDE.md memory
   instructions (agents write via the generic doc path — no special command). Decide whether it stays
   convention-only or gets thin tooling (e.g. an `aslite` helper that writes/locates the per-session
   pre-compact note with the right id + expiry), and update the documented convention either way.
6. **Reconcile with the sub-agent scheme.** `pre-compact-{agent_id}` for sub-agents already exists; make
   the main-agent scheme consistent with (or identical to) it rather than a third pattern.

## Notes

- This is a coordination-SUBSTRATE correctness issue with a SILENT failure mode (lost handoff), so it is
  arguably P1 despite being filed P2 — Brian to confirm priority.
- The fix likely touches the DOCUMENTED convention (global CLAUDE.md memory instructions) as much as any
  code; the deliverable is a reviewed design, then the convention update (+ optional tooling).

## Related

- [user-notices](../designs/user-notices.md) — shared identity + expiry/self-cleaning stance
- [pre-compact-main](../context-notes/pre-compact-main.md) — the current single-id note; the live evidence of the flaw

[related](../designs/user-notices.md)

[related](../context-notes/pre-compact-main.md)
