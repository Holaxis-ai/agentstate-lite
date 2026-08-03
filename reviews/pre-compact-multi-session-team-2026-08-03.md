---
type: Review
title: 'Team review: multi-session pre-compaction handoffs'
actor: codex-review-orchestrator
timestamp: '2026-08-03T17:01:44.738Z'
---
# Verdict

**FAIL — revise revision 2 before applying any proposed global instruction or hook changes.**

The architecture has a sound center: bind handoffs to an exact per-session identity, restore by exact lookup, and require human confirmation when identity is unavailable. Revision 2 is not operationally valid, however. Its load-bearing hook output is unsupported, and several lifecycle paths can lose, stale, or delete the wrong generation.

# Acceptance-criteria result

| Decision point | Result | Reason |
|---|---|---|
| Note identity | Fail | A raw first-eight-character prefix is probabilistic, accepts non-hex/path-like values, and can map distinct stable identities to one key. |
| Discovery on resume | Fail | Exact lookup is sound only with a full verified identity; the no-ID singleton fallback can still accept another similar session. |
| Cleanup and staleness | Fail | Expiry is only a filter, not implemented GC; unconditional deletion is not generation-safe. |
| Orchestrator distinguishability | Fail | Role is manual, non-unique, ephemeral, and not mechanically supplied by the hook. |
| Convention versus tooling | Fail | Correctness is split across prose, duplicated shell, raw YAML, and agent judgment; one executable authority is required. |
| Main/sub-agent reconciliation | Partial | Claude exposes session and sub-agent identity, but the truncated key and undefined runtime adapters do not provide one safe cross-runtime scheme. |

# Blocking findings

1. **The delivery rail does not work.** On installed Claude Code 2.1.220, PreCompact can block compaction but is not a context-injection point, and PostCompact is side-effect-only. Both current scripts return unsupported hookSpecificOutput.additionalContext. A real 2026-08-03 compaction transcript records schema-validation failures for both hooks. The design tested a manually executed heredoc, not the actual hook lifecycle. The current official contract instead supports context injection through SessionStart, including source compact: [Claude Code hooks](https://code.claude.com/docs/en/hooks).

2. **The identity mapping is not collision-free.** ID8 is implemented as the first eight raw characters, not eight validated hex digits. Distinct full identities with the same prefix collide, and a prefixed sub-agent identifier can devote much of the key to a common prefix. Exact reads also fail to compare stored full identity with the live full identity.

3. **Repeated compaction fails.** Promote without expected-version is expect-absent create. The team and orchestrator independently reproduced: first write succeeds; the second write to the same session key exits 5 ALREADY_EXISTS. An interrupted consume therefore strands stale state and prevents refresh.

4. **Consume is generation-unsafe.** An unconditional doc delete can remove a newer generation written after the consumer read the old one. The CLI already supports the correct primitive: delete with the exact read version so stale consumers fail closed.

5. **The fallback is not an identity proof.** A single candidate is not necessarily the resumed session; concurrent sessions may share actor, machine, role, task, and similar summaries. Without an independent identity anchor, every candidate remains untrusted and requires human confirmation.

6. **The artifact contract is not validated.** Raw promote preserves custom fields but the Context Note convention does not require or type-check session identity, scalar role, machine, actor, or expiry. Strict promotion therefore cannot establish the claimed handoff invariants.

7. **Expiry does not perform garbage collection.** No command, hook, daemon, status rule, or sync phase deletes expired notes. The claim that abandoned notes are GCd and cannot silt up is false as written.

8. **Lifecycle authority is split.** Key derivation, metadata, query behavior, role assignment, expiry filtering, restore, and consume are distributed across global prose, two shell sketches, raw Markdown, and agent discretion. This makes drift and partial execution likely at the exact boundary the system is meant to harden.

# What survived review

- Exact full-identity restore remains the right primary architecture.
- Claude documents session_id on both compaction events and agent_id for hooks inside sub-agents.
- The corrected non-empty jq selection avoids the bare pre-compact- key.
- First-time promotion preserves custom frontmatter; list filters compose correctly.
- Promote surfaces a same-key collision rather than silently overwriting it.
- Version-guarded deletion is already available.
- Human confirmation is safer than newest-by-recency when identity is unavailable.
- A Claude-only pilot is reasonable if Codex and OpenCode are explicitly marked unsupported rather than implied to share the same protocol.

# Required revision 3

1. Use supported lifecycle surfaces: a hook-owned persistence side effect, plus model-visible restoration through a documented context event such as SessionStart with source compact. Exercise the exact installed-version chain through real manual and automatic compaction.
2. Define one canonical, path-safe identity from full namespaced runtime/session/sub-agent identity. Validate it on write and compare the stored full identity after every read. Do not auto-demote to actor plus hostname.
3. Put write/read/select/consume mechanics behind one executable authority shared by both sides. A private helper is sufficient for the pilot; a public aslite handoff command may remain deferred.
4. Choose immutable per-compaction generations or a CAS upsert. Consume only with the version returned by the exact read, after a defined restoration acknowledgement.
5. Declare and validate a handoff schema. Require a compact decision card covering goal/task refs, current state, decisions and evidence, constraints/non-goals, blockers/open questions, loaded skills, and exact next action.
6. Define actor and role resolution mechanically. Treat orchestrator role as advisory unless a unique CAS-governed pointer or lease exists.
7. Implement a named GC owner and trigger, or remove the physical-GC claim. Decide explicitly whether handoffs are local ephemeral state or board-shared state.
8. Re-review with adversarial tests for manual/automatic and repeated compaction, interruption at every transition, prefix collisions, concurrent main/sub-agent sessions, malformed fields, missing dependencies, and sync conflicts.

# Team evidence

- [Concurrency and lifecycle review](../context-notes/review-precompact-codex-concurrency.md)
- [Cognitive-ecosystem review](../context-notes/review-precompact-codex-ecosystem.md)
- [Adversarial skeptic review](../context-notes/review-precompact-codex-skeptic.md)
- [Revision 2 under review](../designs/pre-compact-multi-session.md)
- [Parent task](../tasks/pre-compact-multi-session.md)

All three reviewers returned completed, high-confidence FAIL verdicts. No reviewer modified code, hooks, global files, the design, or task status.

# Minority position and synthesis

There is no minority verdict. The only material implementation nuance is surface area: the cognitive-ecosystem reviewer would defer a public CLI command while requiring a private single helper; the concurrency and skeptic reviewers favor a validated handoff command. The synthesis adopts the smallest shared requirement: **one executable authority is mandatory; making it public is not required for a Claude-only pilot.**

# Orchestration reflection

Pattern fit: dialectic fan-out/fan-in produced independent convergence and complementary findings. The concurrency reviewer established lifecycle/CAS counterexamples, the ecosystem reviewer exposed contract and intervention burden, and the skeptic expanded schema and portability attacks.

Decomposition quality: role boundaries were clear and no reviewer requested clarification. Context budgeting was sufficient; all reviewers used the same target and taxonomy without converging prematurely.

Aggregation: low friction. The repeated findings are convergence signals, not duplication. The main improvement for future design reviews is to validate external host lifecycle contracts before component-level command testing, because the prior review proved the pieces while missing that the rail could not invoke them.
