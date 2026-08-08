---
type: Task
title: Prevent context loss across agent compaction
status: in_progress
priority: '1'
description: >-
  Authoritative runtime-neutral lifecycle task for durable context checkpoints;
  absorbs session-end capture and supersedes the Claude-only pilot.
actor: codex-compaction-orchestrator
timestamp: '2026-08-08T17:05:02.412Z'
---
# Reconciliation and implementation policy

This Task is the single product owner for compaction and session-boundary checkpoint behavior. It
absorbs the ordinary-stop concern from [session-end capture](../tasks/session-end-capture.md) and
supersedes the independent [revision-3 Claude pilot](../tasks/pre-compact-multi-session.md). The
pilot's designs, reviews, prototypes, and host probes remain useful research evidence, but they do
not prescribe the production architecture.

The implementation must be runtime-neutral at its core:

- agentstate-lite owns the checkpoint document contract, session/agent identity, freshness state,
  synthesis requirements, restoration behavior, loop bounds, and visible failure receipts;
- runtime integrations are thin capability adapters that translate a host lifecycle event into
  that shared protocol;
- a portable mechanism is preferred whenever it can satisfy the invariant honestly;
- Claude-specific hooks such as `PreCompact`, `Stop`, or `SubagentStop` may be used only for a
  lifecycle constraint that is actually unique to Claude or unavailable through the portable
  mechanism, and the Claude-specific behavior must remain inside its adapter;
- exact-host tmux controllers, private brokers, or host probes are not production dependencies
  merely because they were useful in exploring Claude behavior; and
- when Codex, Claude Code, or OpenCode lacks a required lifecycle capability, the product reports
  an explicit degraded mode rather than simulating guarantees it cannot provide.

The design phase must identify each required invariant first, then select the smallest portable
mechanism that satisfies it. Any host-specific exception must name the host constraint, explain why
the shared mechanism is insufficient, and receive design review as an exception.

# Current progress and next action

The competing task records were reconciled on 2026-08-08. The next action is to research the actual
lifecycle capabilities of Codex, Claude Code, and OpenCode, express the required behavior as a
runtime-neutral domain model and invariant set, then produce an independently reviewed design. The
research should reuse prior Claude pilot evidence selectively without assuming its architecture.

# Purpose and goals

**Ultimate goal:** Make agent work durable and recoverable across turns, compactions, sessions, and
agent handoffs without depending on a human to notice that context needs to be saved.

**Proximate goal:** Design and ship a lifecycle mechanism that prevents substantive, unpersisted
agent context from being silently lost during compaction.

This serves the ultimate goal by turning context preservation from a prompt-following convention
into an afforded and verifiable part of the agent lifecycle.

# Problem

Compaction can discard the agent's current system model, decisions, unresolved assumptions,
review state, and intended next action. The repository currently asks agents to write
`context-notes/pre-compact-main` or `context-notes/pre-compact-{agent_id}`, but that safeguard
depends on the agent remembering to act before an event it may not control. In the observed
2026-07-29 session, compaction occurred while the current `pre-compact-main` note was five days
stale. Other phase notes allowed recovery, but the required checkpoint had not been written.

A command-only compaction hook that merely copies tasks, Git state, and existing notes would not
solve the important part of the problem: those facts are already externalized, while the agent's
unwritten understanding is what compaction can destroy.

# Candidate solution to evaluate

Treat context preservation as a small lifecycle protocol rather than a transcript summarization
feature:

1. Mark a session or agent as having potentially unsaved context after substantive work.
2. At the earliest reliable lifecycle boundary before context can be lost, check whether a current
   checkpoint exists. Prefer a shared mechanism; map host hooks to this boundary only where needed.
3. If the checkpoint is stale and the runtime can continue the same agent, request a concise
   synthesis while it still has its working context. The checkpoint should capture the current
   system model, goals, decisions, evidence, blockers, review/QA gates, unverified assumptions, and
   next action—not merely repeat task metadata.
4. Let the agent stop only after the checkpoint is current, with explicit loop prevention.
5. Map pre-compaction and compact/resume events onto the shared freshness and restoration protocol.
   A Claude `PreCompact` hook is one possible adapter, not the protocol itself.
6. Keep deterministic external-state capture (bundle state, Git/worktree identity, tests, agents,
   and artifacts) as supporting evidence, not as a substitute for agent-authored synthesis.

This is a starting hypothesis, not a mandated design. The design phase may adopt it, refine it, or
choose a different architecture if that architecture better prevents silent context loss.

# Scope and design questions

- Review current Codex, Claude Code, and OpenCode lifecycle capabilities and their exact behavior
  for `Stop`, `PreCompact`, post-compact/resume, interruption, API failure, and subagent shutdown.
- Treat ordinary session-end capture as one lifecycle case within this checkpoint protocol; do not
  create a separate checkpoint store or competing product owner.
- Define the domain model for checkpoint freshness, including session/agent identity, dirty versus
  current state, the unit of substantive work, note identity, and the evidence that makes a
  checkpoint current.
- Decide how the same-agent synthesis is requested where a runtime supports continuation hooks,
  and what honest degraded behavior applies where it does not.
- Prevent infinite continuation loops, checkpoint churn on trivial turns, duplicate knowledge
  stores, transcript-format coupling, and silent failures.
- Define how root agents and subagents use distinct notes and how handoffs become discoverable.
- Determine whether stale checkpoints should block compaction, warn and continue, or follow a
  bounded fallback policy when automatic compaction is already required for the session to proceed.
- Preserve existing foreign hooks and keep install, upgrade, status, and uninstall behavior
  idempotent across supported runtimes.

# Acceptance criteria

1. **Research and evaluation:** The implementation begins with a written evaluation of the
   candidate solution and credible alternatives against the actual lifecycle semantics of each
   supported runtime. The evaluation identifies unsupported assumptions and recommends a design;
   it does not treat this task body as an implementation specification.
2. **Reviewed design:** A design artifact describes the whole lifecycle, components, state
   transitions, timing/ordering dependencies, external state, failure behavior, privacy/security
   implications, and invariants. It implements the recorded consolidation of
   `tasks/session-end-capture` and documents every justified host-specific adapter. The design
   receives an independent review before implementation.
3. **Meaningful preservation:** The selected design causes substantive current understanding to be
   persisted before it can be lost. Success is not defined as copying or summarizing only facts
   that were already present in tasks, Git, or other external artifacts.
4. **Low-intervention operation:** Normal use does not require Brian to remember a command, watch
   the token window, or manually ask the agent to checkpoint. Trivial read-only turns do not create
   noisy note churn.
5. **Lifecycle coverage:** Manual compaction, automatic compaction, ordinary main-agent stop,
   compact-time continuation/resume, and supported subagent lifecycles have explicit behavior.
   User interruption, API failure, hook timeout/failure, and runtimes missing a required hook have
   documented, honest degraded behavior.
6. **Safety and liveness:** The implementation cannot continue an agent indefinitely. It has a
   bounded retry/loop-prevention rule, makes failures visible, and does not block a session forever
   when a checkpoint cannot be written.
7. **Single source of durable state:** Checkpoints are ordinary documents in the project's
   agentstate-lite bundle. The solution does not introduce a second task, memory, or knowledge
   store. Existing `pre-compact-main` / `pre-compact-{agent_id}` conventions are either retained or
   migrated explicitly.
8. **Hook management:** `aslite hook install`, `status`, and `uninstall` manage the new lifecycle
   behavior idempotently while preserving unrelated user hooks and supporting upgrades from the
   existing SessionStart-only installation.
9. **Tests first and regression coverage:** Automated tests cover hook configuration merging,
   upgrades, idempotent reinstall/uninstall, dirty-to-checkpoint-to-stop behavior, already-current
   behavior, loop prevention, automatic and manual pre-compaction behavior, compact-time reload,
   failures, and multi-agent note separation. Behavioral harnesses prove the same-agent
   continuation where runtimes expose it. New behavior has parent-red provenance where applicable.
10. **Cross-runtime validation:** Codex and Claude Code are exercised end to end with forced
    compaction or the closest deterministic lifecycle harness. OpenCode support is implemented and
    tested if its lifecycle can uphold the design's invariants; otherwise the limitation and
    fallback are explicit.
11. **Documentation:** Agent instructions and CLI/help text explain what is automatic, what is
    persisted, how freshness is determined, how to inspect/disable the behavior, and what happens
    on failure without overstating access to an agent's private working memory.
12. **Quality gates:** The implementation passes the repository's full test suite, then receives
    independent code review followed by adversarial QA. Findings are resolved before the task is
    marked done.
13. **Closure evidence:** The completed task records the accepted design, exact implementation
    commit, automated-test results, end-to-end receipts for each supported runtime, known
    limitations, and any follow-up tasks.
