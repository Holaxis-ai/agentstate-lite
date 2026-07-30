---
type: Task
title: Prevent context loss across agent compaction
status: todo
priority: '1'
description: >-
  Design, implement, and validate lifecycle-driven checkpoints that preserve
  substantive agent context before compaction without relying on human
  intervention.
actor: codex-context-lifecycle
timestamp: '2026-07-30T00:00:28.989Z'
---
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
2. When the main agent is about to stop, use the runtime's `Stop` hook to check whether a current
   checkpoint exists.
3. If the checkpoint is stale, continue the same agent with an instruction to write a concise
   synthesis while it still has its working context. The checkpoint should capture the current
   system model, goals, decisions, evidence, blockers, review/QA gates, unverified assumptions, and
   next action—not merely repeat task metadata.
4. Let the agent stop only after the checkpoint is current, with explicit loop prevention.
5. Use `PreCompact` as a final freshness check for manual and automatic compaction, and use the
   compact/resume `SessionStart` path to load the checkpoint into the immediate continuation.
6. Keep deterministic external-state capture (bundle state, Git/worktree identity, tests, agents,
   and artifacts) as supporting evidence, not as a substitute for agent-authored synthesis.

This is a starting hypothesis, not a mandated design. The design phase may adopt it, refine it, or
choose a different architecture if that architecture better prevents silent context loss.

# Scope and design questions

- Review current Codex, Claude Code, and OpenCode lifecycle capabilities and their exact behavior
  for `Stop`, `PreCompact`, post-compact/resume, interruption, API failure, and subagent shutdown.
- Reconcile this work with `tasks/session-end-capture`; decide whether the two tasks should share
  one checkpoint protocol, be merged, or remain separate with a clear boundary.
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
   implications, and invariants. It explicitly resolves the relationship with
   `tasks/session-end-capture`. The design receives an independent review before implementation.
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
