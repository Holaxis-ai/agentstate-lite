---
type: Review
title: Design review — compaction context checkpoint lifecycle v1
status: final
role: specialist
verdict: fail
verdict_subject: lifecycle design v1
family: compaction-context-checkpoint-lifecycle-v1
target: designs/compaction-context-checkpoint-lifecycle-v1
target_version: 'sha256:c042dda8878d96ed93bfb58827395e49400d330f449e91a2bca51f24d15c4f9b'
evidence_cutoff: '2026-08-08T17:54:54.000Z'
owner: codex-compaction-orchestrator
actor: codex-checkpoint-design-critic
timestamp: '2026-08-08T17:56:01.908Z'
---
# Decision card

- **Verdict:** **FAIL**.
- **Exact target:** [compaction context checkpoint lifecycle v1](../designs/compaction-context-checkpoint-lifecycle-v1.md) at `sha256:c042dda8878d96ed93bfb58827395e49400d330f449e91a2bca51f24d15c4f9b`.
- **Consequence:** implementation planning is blocked. The selected shared-core/adapter direction is sound, but the protocol does not yet prove whole-turn currentness, at-most-one continuation, exact carrier eligibility, or race-free restore.
- **One-way-door decision:** pending Brian. The design must not assume whether an upgrade may enable automatic semantic persistence into a shared/public bundle by default.
- **Smallest path to a passing revision:** repair the terminal-assessment, continuation-claim, selector/bootstrap, carrier-registration, restore-fencing, OpenCode-boundary, disable/re-enable, and measurable-cost contracts below; then repeat independent review against one exact design version.

This is a reasoned design review of the specified artifacts. It is not an empirical runtime probe and does not convert the design's named probe gates into evidence.

# Evidence reviewed

- [authoritative lifecycle task](../tasks/compaction-context-checkpoint-lifecycle.md) at `sha256:e7bff032a1723ff94ba138f75cd2698376f9279135e048d7518f9af37ee8eeee`
- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md) at `sha256:51ef57197ba2aec56959ef6f45392008daec130905830e2b4f5c20e9148f34fe`
- [cross-runtime synthesis](../context-notes/compaction-checkpoint-cross-runtime-synthesis-2026-08-08.md) at `sha256:6b600f4f0b9b56b77072b6b7e5c2c999124c2f455f47fb4fcb869db20a0a1b0c`
- [Codex capability research](../research/compaction-checkpoint-codex-capabilities.md) at `sha256:768fd86f3ae58b7539a344fb10ec1837153a21c40fd9300eccf1eaa4a18b524f`
- [Claude Code capability research](../research/compaction-checkpoint-claude-capabilities.md) at `sha256:606c3b2c7783fb5353c6f6283a77834c2360fa7a62a00f479dae8c23b9143993`
- [OpenCode capability research](../research/compaction-checkpoint-opencode-capabilities.md) at `sha256:42bae79aa4e990cc6c7bb714648d487d67500ba56392aca0c8fdb4d70b793744`

# Severity-ranked findings

## F1 — BLOCKER: a completed Turn Ticket action does not prove that the completed turn was assessed

**Design locations:** `Decision card / Selected architecture`; `Dirty detection, unchanged confirmation, and cost contract / Normal proactive fast path`; `Forgotten/unavailable proactive assessment`; `State and event flows / Successful substantive root or subagent stop`.

The fast path allows the bearer to call `changed` or `unchanged` before its final response, then lets Stop accept a matching ticket/turn digest. Neither the ticket nor the action proves that no continuation-relevant decision, blocker, constraint, next action, or other semantic state changed during model generation after the action. The enforced Stop continuation has the same gap: an in-turn tool action can be followed by additional model output before the second Stop. A stable host turn token identifies the turn but does not establish the terminal semantic cut within it.

The first-turn contract is also absent. The design does not define when a new subject and its ticket are created, what version an action supplies when no selector exists, how a ticket is stored or authenticated without an ephemeral second authority, or which durable state rejects an old/replayed ticket.

This violates meaningful-content/currentness invariants S2-S4, replay invariant C4, and authoritative acceptance criteria 3, 5, 6, and 9. It is missing architecture, not an empirical unknown that a Turn Ticket ordering probe alone can close.

**Smallest coherent repair:** define one mechanically terminal assessment cut. The adapter must prove that the same-bearer verdict/synthesis is the last semantic output covered by the stop obligation—for example, a nonce-bound terminal envelope observed by the Stop callback and persisted after the bearer has finished, or a host-proven terminal action that cannot be followed by model generation. Specify first-subject expect-absent creation, ticket issuance, durable/signed validation authority, single-use/replay behavior, and the exact state that the Stop callback compares. If neither target host exposes a terminal cut, remove the proactive-current-turn claim and advertise only the strongest previous-boundary/degraded behavior that can be proven.

**Required red proof:** create a turn that calls the assessment action and then changes its decision/next action before final completion. The protocol must reject the earlier assessment rather than stop clean.

## F2 — BLOCKER: the exactly-one continuation proof confuses idempotent state with idempotent host control flow

**Design locations:** `Forgotten/unavailable proactive assessment`; `Liveness and loop proof`; `CAS, concurrency, and durability`; Host-exception ledger rows for Codex and Claude Stop/SubagentStop.

The design says a crash before recording the consumed attempt may cause replay, then claims that `stop_hook_active` plus a deterministic attempt ID makes replay idempotent. A deterministic ID can deduplicate bundle writes; it cannot undo or deduplicate two model continuations already requested from the host. Codex and Claude research also says matching Stop handlers run in parallel. Two handlers can observe the same unclaimed selector and both return a continuation unless one wins a durable CAS claim before either returns. `stop_hook_active` protects a later Stop caused by continuation; it does not serialize parallel handlers on the original Stop.

The schema has `active_attempt`, but no normative prepare/claim/returned/terminal transition or loser behavior. The proof therefore cannot establish the shared bound under duplicate delivery, parallel managed entries, helper crash, or host retry. This violates S7, C2, C4, C7, and authoritative criterion 6.

**Smallest coherent repair:** specify a CAS-owned stop-obligation state machine. Exactly one helper may atomically claim the obligation before returning a block/continuation; every CAS loser must return non-continuing. Once claimed, replay must never request again, even if that means an uncertain crash yields zero continuations and a degraded receipt. Separate the truthful property `at most one requested continuation` from liveness (`one may successfully run`). Do not claim exactly-once delivery unless the host supplies a transactional/idempotency primitive.

**Required red proof:** two concurrent handlers plus crashes at every point before/after claim and before/after response construction must never produce two continuation prompts for one obligation.

## F3 — BLOCKER: carrier ambiguity is named but no carrier-registration protocol can detect it before restore or commit

**Design locations:** `Logical identity and schemas / Project, subject, carrier, and identifiers`; selector `carrier_state`; `Resume, fork, and simultaneous carriers`; `Liveness and loop proof`; `Minimum empirical probe gates`.

The tuple distinguishes lineage, bearer, and carrier correctly, but the design never defines how carriers register, renew, end, expire, or atomically make a subject ambiguous. An adapter-minted nonce is allowed only if correlated across an exact boundary, but no correlation channel or lifecycle is selected. Claude and OpenCode research establish that simultaneous carriers can share lineage and that no unique carrier-execution ID is exposed. A first carrier can therefore select and receive a checkpoint before a second carrier registers; later ambiguity cannot retract already delivered authoritative context. The same omission affects whether divergent `changed` commits are eligible.

This violates S1, S5, C1, C5-C7. Exact identity probes can reveal host facts, but they cannot invent the missing shared registration/exclusivity semantics.

**Smallest coherent repair:** add a normalized carrier registration/fencing state machine with CAS transitions, execution-nonce provenance, active-set or lease semantics, renewal/expiry/end rules, restart behavior, and an eligibility barrier that runs before selection or changed commit. Provide an exact per-host mapping table for root, child, compaction, resume, fork, and duplicate resume. If the host cannot prove exclusivity before the boundary, the subject is ambiguous by default and automatic restore/commit is unavailable.

**Required red proof:** start two carriers so the second registers immediately before, during, and immediately after the first restore selection. No schedule may deliver authoritative context to a carrier while exclusivity is unproved.

## F4 — HIGH: selector bootstrap, baseline freshness, confirmation ordering, and replay bytes are contradictory or absent

**Design locations:** `Mutable Checkpoint Subject State`; `Normal proactive fast path`; `Trivial unchanged turn`; `Successful substantive root or subagent stop`; `CAS, concurrency, and durability`; `Immutable material receipt`.

An assessment requires `expected_selector_version`, but new-subject creation and concurrent expect-absent behavior are unspecified. The selector admits `context_revision: baseline` and no generation, while the design both says unchanged can establish clean/unchanged currentness and says unchanged cannot clean `unknown`, `dirty`, or `degraded_dirty`. It never defines whether a baseline with no generation is current at a compaction guard or eligible for restore.

Changed commit is also internally inconsistent. The cost table promises one selector CAS, while the flow says the generation is selected and read back and “only then” obligation becomes clean. If the same CAS writes `clean`, durable state claims clean before final confirmation, contrary to S3. If a second CAS marks clean, the stated cost and conflict behavior are wrong.

Finally, deterministic generation/receipt IDs coexist with audit-time fields such as `created_at`. Replay can target the same immutable path with different bytes unless the first attempt timestamp is itself canonical durable input or existing bytes are read and validated. “Expect absent” alone is not an idempotence rule.

**Smallest coherent repair:** publish a complete transition table including bundle-identity creation, subject expect-absent bootstrap, baseline/no-generation semantics, new-turn ticket issuance, selector conflict losers, and exact derived freshness. Prefer deriving clean/current from confirmed selection evidence rather than storing a mutable boolean that needs a post-read-back write; otherwise specify the second CAS and correct the cost table. Canonicalize every immutable byte from durable attempt inputs and define same-ID existing-byte validation.

## F5 — HIGH: selector-generation-selector validation has a final time-of-check/time-of-delivery gap

**Design locations:** `State and event flows / Compact restoration`; `CAS, concurrency, and durability`; acceptance mapping for safety/liveness.

Reading selector `v1`, reading the generation, and rereading selector `v2` rejects changes during selection. It does not prevent a changed commit after `v2` and before or during host delivery. The statement “No stale bytes are sent” is therefore stronger than the mechanism. A post-delivery receipt can label the result superseded but cannot unsend stale authoritative context.

This violates S5 and C5 when another carrier or process can write the subject. It also creates P12-style semantic error propagation: a syntactically valid stale capsule can become the premise for later work without any operational failure.

**Smallest coherent repair:** either fence changed commits during a bounded restore lease recorded by CAS and honored by every writer, or weaken the invariant and product language to a point-in-time snapshot with an explicit superseded-after-selection outcome that is not called exact current restoration. Because the current contract requires exact current context, fencing is the coherent repair. Test a changed commit in every gap through host acceptance.

## F6 — HIGH and PENDING BRIAN: default activation can create an irreversible privacy disclosure; disable/re-enable and retention semantics are incomplete

**Design locations:** `Decision card / Blocking questions for Brian`; `Privacy, payloads, retention, and migration`; `Installation, upgrade, status, disable, and uninstall`.

The claim that no choice is a one-way door is false. Checkpoint bodies deliberately contain goals, system model, decisions, assumptions, blockers, and next action. They inherit bundle visibility. Although lifecycle hooks never sync, the user's next ordinary board sync can publish those immutable documents into a shared/public Git history. Uninstall does not delete them, V1 has no hard-deletion operation, and later pruning cannot retract public Git history. Enabling automatic persistence during a SessionStart-only upgrade without an explicit policy decision can therefore cause irreversible disclosure.

Disable/re-enable is also unspecified. Work performed while disabled can leave an old selector looking clean; a later reinstall or re-enable could restore that stale generation unless a policy epoch/barrier invalidates it. Legacy candidates are retained, but there is no initial activation transition that forces a current same-bearer synthesis before any old/baseline state can be treated as safe. Retention is unbounded, with no acceptance limit for generation/receipt growth and no description of Git-history persistence after local pruning.

This violates P1-P3, D5-D6, L5, and authoritative criteria 8 and 11.

**Smallest coherent repair:** leave the default-enablement question open until Brian decides it. The specific question is: **May hook install/upgrade enable automatic semantic checkpoint persistence by default for a project whose bundle may be shared/public, or must it require explicit per-project opt-in after visibility and irreversibility disclosure?** Add a persisted policy epoch; disabling/uninstalling closes the epoch and makes every subject unknown for later automatic restore; re-enable requires a fresh terminal assessment. Define activation/legacy bootstrap and a bounded retention/inspection policy, including the fact that deletion cannot erase already shared Git history.

## F7 — HIGH: OpenCode's RESTORE_ONLY tier lacks an exact restoration-boundary trigger, not merely identity probes

**Design locations:** support-tier table; `Compact restoration`; Host-exception ledger OpenCode rows; `Minimum empirical probe gates`.

OpenCode's awaited `experimental.chat.system.transform` runs before every provider request, not specifically after context loss. Its `session.compacted` event is asynchronous and can complete after the next transform; both research and design correctly reject it as an ordering dependency. The design does not define a synchronous transform-time query or monotonic compaction-generation marker that distinguishes “restore now” from an ordinary request, nor deduplication if the transform runs repeatedly. Exact subject identity is necessary but not sufficient to implement restore-only behavior.

This violates the restoration-opportunity contract, S5-S6, C4-C5, and support-tier marketing truth.

**Smallest coherent repair:** define and prove an exact transform-time loss-generation/restore-obligation source, bind delivery once to that generation and request, and define restart/replay behavior. If no synchronous source exists on the target OpenCode epochs, downgrade automatic OpenCode restore to `INSPECTABLE_MANUAL`; do not leave `RESTORE_ONLY` pending only identity/size/failure probes.

## F8 — MEDIUM: the per-turn selector and fallback-continuation cost gate is measurable but has no pass/fail budget

**Design locations:** `Exact costs and low-churn tradeoff`; support tiers; `Minimum empirical probe gates`; review-focus residual risks.

The design intentionally writes the selector on every successful turn. Codex/Claude research identifies no proven every-turn pre-model Turn Ticket channel; absent one, the chosen fallback may add one model continuation to every ordinary successful turn. The design says to measure p50/p95 latency and additional-round-trip rate, but supplies no acceptable thresholds and omits shared-board effects: permanent remote version history, ordinary-sync traffic, CAS conflicts, awareness noise, and interaction with dirty-board pull behavior. A measurement with no decision threshold cannot validate “low churn” or acceptable ease of use.

This does not force a different architecture, but it blocks support-tier and acceptance claims.

**Smallest coherent repair:** define go/no-go budgets before planning: maximum extra-continuation rate, p50/p95 local and remote latency, selector bytes/history growth, sync/conflict rate under duplicate resumes, and observable board/awareness impact. If no terminal proactive channel exists and the fallback exceeds budget, lower the automatic-capture promise or obtain an explicit product decision accepting the cost.

# Required-area disposition

| Review area | Disposition |
|---|---|
| Turn Ticket creation, correlation, replay, first turn, and authority | **Fail:** F1 and F4. |
| Unchanged selector semantics and shared-board churn | **Fail:** F4 and F8. |
| Exactly-one continuation liveness | **Fail:** F2. |
| Subject/lineage/bearer/carrier mapping | **Fail:** F3. |
| Generation/selector/receipt CAS and backend agreement | **Fail:** F4 and F5; backend agreement tests are well chosen after semantics are repaired. |
| PreCompact one-block/fail-open | **Conditionally sound:** PreCompact is correctly limited to a guard and recovery fail-open is appropriate, but its consumed-attempt state must use the repaired F2/F4 CAS protocol and remain uncertified until the named mode/failure probes pass. |
| Restore validation, bounds, and delivery honesty | **Mixed:** payload/delivery-versus-consumption language passes; exact-current delivery fails F5. |
| OpenCode restore-only | **Fail:** F7, in addition to F3 identity. |
| Privacy, retention, migration, disable/uninstall | **Fail:** F6. Foreign-config exact ownership and data-preserving uninstall are sound intentions. |
| Marketing tiers and one-way doors | **Fail:** Codex/Claude conditional tier is premature until F1-F5 close; OpenCode is overstated by F7; F6 requires Brian. |

# What survived review

- One shared core over ordinary bundle documents with thin, version-gated host adapters is the right architectural boundary.
- Strict same-bearer synthesis, rejection of transcript/host-summary substitution, and no heuristic newest-wins restore correctly preserve the domain invariants.
- Immutable semantic generations plus one CAS selector is a defensible topology once bootstrap, confirmation, and fencing are completed.
- Treating PreCompact as a bounded freshness guard rather than a semantic synthesizer is correct.
- The design is honest that local persistence is not sync, `DELIVERED` is not consumption, ungraceful death cannot guarantee last-moment capture, and OpenCode full capture is unsupported.
- Conservative payload ceilings, content-free receipts, exact foreign-config ownership, and non-destructive uninstall are appropriate directions.

# Gate and next action

The design verdict is **FAIL** and no implementation plan should be decomposed from this version. A generator should repair the smallest coherent protocol above, record Brian's pending activation ruling without guessing it, publish one new exact design version, and request independent re-review. The named empirical runtime probes remain necessary after architecture closes; they do not substitute for these repairs.
