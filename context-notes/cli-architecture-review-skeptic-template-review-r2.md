---
type: Context Note
title: 'Skeptic review r2: reusable architecture template'
description: >-
  Version-specific APPROVE verdict after all round-one blockers were resolved
  and both reuse paper tests passed.
actor: architecture-skeptic
timestamp: '2026-08-07T14:17:30.493Z'
---
# Summary

Version-specific verdict: **APPROVE** `reviews/architecture-review-template` at `sha256:ae71e64c39d2fdcdf54a65ba332c0ef9723dde9fb7ae4c85191af388ecd6cf88` and `research/architecture-review-domain-model` at `sha256:1c6e207c1c7a7f29daf19119e350ab6c2ca3ff20476126929cb9a25acfd62293` for freeze before application.

All eight blocking round-one issues and all three nonblocking wording issues are substantively corrected in the operative template/domain rules. The pure-library and stateful/distributed paper tests now pass without fabricated roles, empty mandatory failure artifacts, mandatory negative claims, or false deficiencies. No regression reintroduces aggregate scoring, finding quotas, unconditional SOLID, unbounded assurance language, owner-only deduplication, silent material amendments, or an open-ended stopping universe.

Two nonblocking cross-document cleanup issues remain: the domain model's abbreviated concurrent/distributed profile list does not repeat all obligations that the template makes mandatory, and plan step 9 still summarizes all negative claims as `bounded-search` audits instead of referring to class-specific evidence. The exact template itself is explicit and governs application, so these do not block approval; align or de-duplicate the summaries in the next edit to prevent future drift.

No `packages/cli` finding was investigated or asserted.

# Round-one blocker disposition

| ID | Disposition | Exact revision-2 evidence |
|---|---|---|
| R1 linear/singular authority | Resolved | Domain `Core relationship` and template §4.2 now define a graph with optional adapters/orchestrators, plural authorities with owned responsibilities, governed state/resources, and dependencies/boundaries on any node or edge. |
| R2 failure artifacts bypass N/A | Resolved | Template §3 applies disposition semantics to every module and artifact; §4.3 gives stateful versus pure/stateless paths; §7 accepts each applicable artifact or N/A; §9 requires applicable timelines. |
| R3 unbounded `proven adequate` | Resolved | Template §5.2 uses `meets declared contract within stated evidence bounds`; each positive disposition cites obligation, grade, scope, and residual limits; `proven` is reserved for a bounded oracle, normally E3. |
| R4 deduplication by owner | Resolved | Template §8 and plan step 8 require materially matching owner, violated obligation/invariant, and causal mechanism; owner is only a grouping field. |
| R5 material amendment path | Resolved | Template §2 and plan step 5 distinguish deferred nonmaterial changes from material defects that block the area, create a version, preserve both versions/impact map, and force rerun or old-version labeling. |
| R6 unbounded stopping universe | Resolved | Template §2 freezes the material capability/risk universe from purpose/system/threat/requirement models and visibly amends/dispositions newly discovered material risks. Plan acceptance mirrors it. |
| R7 distributed contract gap | Resolved | Template §3 and §6.5 require consistency/durability, source and split-state authority, visibility, partitions/degraded behavior, delivery/order/deduplication, and clock/lease assumptions. |
| R8 mandatory dead-code proof | Resolved | Pure profile now requires a dead-code/simplification assessment; §6.10 makes exhaustive reachability obligations conditional on asserting dead/deletion claims. |
| R9 mixed evidence axes | Resolved | Template §5.1 separates evidence source/method from conclusion basis and carries both into the finding schema. |
| R10 generic negative-claim proof | Resolved in governing artifacts | Template §5.1 and domain `Negative and exclusivity claims` specify distinct evidence for missing/only/canonical, dead/unused, and unbounded resource/latency claims. Plan shorthand should be aligned, but it does not replace the frozen evidence protocol. |
| R11 detection as containment | Resolved | Domain core text says detection exposes, containment/fault isolation bounds blast radius, and recovery restores/resumes/reconciles; `Containment / fault isolation` is a defined term. |

# Paper tests

## A. Small pure deterministic library — PASS

Hypothetical target: one deterministic byte-normalization function with no I/O, ambient state, alternate implementation, process/network boundary, or independent installed artifact.

- The capability graph now connects purpose -> capability -> API surface -> semantic authority directly. Optional adapter/orchestrator is absent; state/resources are `none` or bounded input/output memory; dependencies are named separately.
- Required: purpose/contracts, API compatibility, cohesion/coupling, conditional SOLID, unit/property evidence, maintainability, and representative operation/error behavior.
- Sampled: dead-code/simplification assessment with population/method/residual risk. No `dead` claim means no exhaustive deletion proof.
- N/A with rationale: stateful mutation/atomicity/recovery, concurrency/distribution, host authorization/credentials/network, CLI/subprocess, UI/server, and independent package installation when absent.
- §4.3 uses one operation/error path rather than inventing mutation, commit, receipt, or recovery. §7 permits explicit N/A for inapplicable matrices and timelines.
- OCP, LSP, ISP, and DIP do not create deficiencies when variation/substitution/interfaces/injection are absent.

Empty-field result: none falsely required. Row-level state, containment, and recovery cells may say `N/A — pure/stateless; invalid input returns the documented error result`, which is an informative disposition rather than rubric padding.

## B. Stateful/distributed adapter — PASS

Hypothetical target: a remote document adapter with local cache, version/CAS writes, authentication, bounded retries, partial network failure, and server-owned durable history.

- The graph records plural responsibility: server authority owns durable state/CAS/history; client authority owns cache, retry/deadline, credential selection, and representation policy.
- Required: target/dependency/artifact identity, state/resources/boundaries, stateful/concurrent/distributed, security as applicable, reliability/failure timeline, API/error contracts, fault-injection evidence, performance/resources, portability, and maintainability.
- The profile now forces explicit source of truth, consistency/durability, read/write visibility, split-state and partition authority, delivery/order/deduplication, and clock/lease assumptions. Unused clocks/leases can be N/A with rationale.
- Failure windows cover preflight, remote commit, unknown outcome, local cache update, receipt, retry, reconciliation, and containment.
- Distinct cache-staleness and retry-duplication causes remain separate unless owner, invariant, and mechanism all match.
- Unused CLI/UI/package mechanics are cleanly N/A without weakening distributed obligations.

Empty/ambiguous-field result: none blocking. `Authority/authorities and owned responsibilities` and `State/resources/dependencies/boundaries` accommodate the plural topology; failure/containment/recovery distinguishes visibility from blast-radius control and repair.

# New issues

## N1 — Domain reuse-profile summary lags the template

- Severity: low
- Blocking: no
- Location: domain model `Reuse profiles`, concurrent/distributed bullet
- Description: the domain summary lists ordering, CAS/locks, idempotence, retries/timeouts, partial failure, and reconciliation, but omits the consistency/durability/source-of-truth/visibility/partition/delivery/clock obligations now required by template §§3 and 6.5.
- Suggested change: mirror the template list or state that template §3 is the sole profile authority and keep the domain model to vocabulary/relationships.

## N2 — Plan QA shorthand still says all negative claims receive bounded-search audits

- Severity: low
- Blocking: no
- Location: plan step 9
- Description: `unbounded` resource/latency claims need a reachable input-to-allocation/wait proof, not merely bounded search. The template/domain correctly define class-specific evidence, so the plan shorthand is stale rather than governing.
- Suggested change: replace with `receive their frozen class-specific evidence and counterevidence audits`.

# Survived checks

- Exact target/artifact and revision-drift rules remain intact.
- Module and artifact dispositions distinguish required, representative sampled coverage, absent/unreachable N/A, and explicit not-assessed gaps.
- No aggregate score; consequence, confidence, and priority remain independent.
- No finding or coverage quota; zero material findings remains valid.
- Conditional SOLID retains demonstrated variation, semantic substitution, cohesive interfaces, and domain-owned dependency boundaries.
- Positive assurance is bounded; green gates prove only exercised states/artifacts.
- Evidence axes, E0–E3 grades, controls, counterevidence, refutations, and survived attacks remain explicit.
- Symptom-to-cause synthesis retains multiple findings per authority when invariants or mechanisms differ.
- Material amendments version and rerun affected work; target-byte drift invalidates or historical-labels evidence.
- Frozen material risk/capability universe makes stopping operational while visible discoveries can amend it.
- Distributed consistency/failure semantics and class-specific negative claims are present in the operative template.
- Detection, containment, and recovery are distinct in both taxonomy and capability trace.
- Dead-code proof is claim-triggered; simplification remains proportionate.
- Private disclosure routing precedes public persistence.
- Post-use retrospective can retire low-value rubric fields.

# Dissent preserved

1. Aggregate architecture scores remain prohibited by default.
2. `Proven` remains reserved for bounded oracle-backed properties; ordinary positive assurance must state evidence limits.
3. Dead-code proof is triggered only by a dead/unused/deletion claim.
4. Completeness is coverage of a frozen material capability/risk universe, not checklist fill rate.
5. Approval never depends on finding count, module count, rubric fill rate, or numeric coverage targets.

# Confidence and limits

Confidence: high. Every round-one blocker maps to explicit revision-2 wording, and both contrasting paper targets now reach honest completion. The two new issues are cross-document summary drift; the operative template remains unambiguous.

This review assessed only the named template, domain model, and updated plan. It did not inspect package behavior, run tests, mutate source/git, contact the network, sync the bundle, or begin phase-two findings.
