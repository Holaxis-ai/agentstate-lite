---
type: Context Note
title: 'Skeptic review r1: reusable architecture template'
description: >-
  Version-specific REVISE verdict on the exact architecture-review template and
  domain model, including pure-library and distributed-adapter paper tests.
actor: architecture-skeptic
timestamp: '2026-08-07T14:12:08.782Z'
---
# Summary

Version-specific verdict: **REVISE** `reviews/architecture-review-template` at `sha256:99ca713faaa4439830c548d83c37dcd2c07d44ca9bd82d8b9e377c50b3bc226c` and `research/architecture-review-domain-model` at `sha256:78016770fdd8fd481de46a8dd121de3859e981e3207f7033514a80dc90b0eeb4` before approving or applying them.

The draft strongly preserves conditional SOLID, no aggregate score, no finding quota, evidence grades, counterevidence, negative-claim scrutiny, target drift, private disclosure, proportionality, and post-use retirement. The blockers are exact wording and mechanics: a linear/singular authority model does not fit either simple targets or distributed capabilities; several universal requirements bypass module-level N/A semantics; `proven adequate` has no proof threshold; deduplication by owner can merge distinct causes; amendment handling does not say what happens when a rubric defect is material; and the stopping rule does not freeze the risk universe. The distributed profile also lacks an explicit consistency/durability/partition/delivery contract.

No `packages/cli` implementation finding was investigated or asserted.

# Issues

## R1 — Linear, singular authority relationship is not reusable

- Severity: high
- Blocking: yes
- Location: domain model `Core relationship`; template §§4.2 and 8
- Description: `purpose -> capability -> public surface -> orchestrator/adapter -> canonical authority -> state/dependency` reads as a mandatory linear chain, and the capability table has singular `Owning authority`. A pure function may have no adapter/orchestrator or mutable state. A distributed capability commonly crosses several authorities: for example, a server owns durable data/CAS semantics while a client adapter owns retry, cache, credential, or presentation policy. Dependencies also attach to any node; they are not merely downstream of the authority. Treating the model as linear pressures reviewers to invent roles or declare one false canonical owner.
- Required change: express the model as a graph with optional and plural nodes, e.g. `purpose -> capability -> surface -> [adapter/orchestrator]* -> authority+`, with state/resources governed by named authorities and dependencies/boundaries attachable throughout. Change the trace table to `Authority/authorities and owned responsibilities`. State explicitly that absent roles are valid and that cross-boundary invariants may require one semantic owner plus agreement/enforcement at irreducible points.

## R2 — Mandatory failure artifacts bypass N/A semantics

- Severity: high
- Blocking: yes
- Location: template §§4.3, 7, and 9
- Description: the draft unconditionally requires at least one read and one mutation/workflow failure model, then says the final review includes a mutation/workflow failure timeline and that the failure-timeline test must pass. A small deterministic pure library may have no stateful read, mutation, irreversible effect, receipt, retry, or recovery. Module-level applicability labels do not explicitly govern these cross-cutting mandates, so the paper test produces empty fields or a false deficiency.
- Required change: make each cross-cutting artifact conditional on target shape. For targets without reads/mutations, require one representative operation/error timeline and an explicit N/A rationale for absent state-transition fields. In §7 say `include each applicable matrix or an N/A rationale`; in §9 assess the failure timeline only where the stateful/workflow profile applies.

## R3 — `proven adequate` permits an unbounded assurance claim

- Severity: high
- Blocking: yes
- Location: template §5.2
- Description: `proven adequate` is an assurance disposition without a defined evidence grade or bounded proposition. E1 static reasoning, a green test, or sampled probes could be used to claim proof of an entire obligation. This conflicts with the draft's otherwise careful rule that a gate proves only exercised states/artifacts.
- Required change: replace it with `meets declared contract within stated evidence bounds` or reserve `proven` for a bounded property with an explicit proof oracle and normally E3 evidence. Every positive assurance disposition must cite its exact obligation, evidence grade, scope, and residual limits.

## R4 — Deduplication by owner can collapse distinct causes

- Severity: medium
- Blocking: yes
- Location: template §8; plan step 8
- Description: `Deduplicate by owning invariant/authority` is better than matching prose, but one authority can violate several unrelated invariants through different causal mechanisms. Owner identity alone is not a safe deduplication key and can erase separate triggers, impacts, or remedies.
- Required change: deduplicate only when owner, violated obligation/invariant, and causal mechanism are materially the same. Use owner as a grouping field, not a uniqueness key. Preserve one-to-many symptom grouping and many-distinct-findings-per-authority.

## R5 — Material template amendments have no resolution path

- Severity: medium
- Blocking: yes
- Location: template §§2 and 9; plan steps 5 and 7
- Description: the amendment rule correctly prevents silent mid-review changes, but it only says defects are recorded separately. It does not distinguish a nonmaterial improvement from a defect that invalidates coverage or evidence. Continuing under a known material rubric defect is not more consistent than silently editing the rubric.
- Required change: define amendment triage. Nonmaterial amendments are deferred to the next version. A material defect blocks the affected review area, creates a new template version, and requires affected applicability/evidence to be re-run or explicitly reported under the old version. Preserve both versions and an impact map.

## R6 — The stopping rule does not bound the risk universe

- Severity: medium
- Blocking: yes
- Location: template §2 and §9; plan acceptance criteria
- Description: `every applicable capability/risk has a disposition` is not operational until the review defines the risk universe and materiality threshold. There are indefinitely many imaginable risks, so the current wording can support either endless review or arbitrary declaration of completion.
- Required change: stop when every in-scope material capability and risk identified by the frozen purpose/system/threat/requirement model has a disposition, including `not assessed` with blocker/residual risk. Define how newly discovered material risks amend that inventory.

## R7 — Distributed profile does not require a consistency/durability/partition contract

- Severity: medium
- Blocking: yes
- Location: template §§3, 4.2, and 6.5; domain `Reuse profiles`
- Description: CAS, locks, ordering, retries, partial failure, and reconciliation are present, but the distributed paper target can complete the template without stating its promised consistency/durability model, partition behavior, delivery semantics, duplicate/out-of-order handling, clock/lease assumptions, or authority during split state. `State/dependencies` and generic failure fields do not make this obligation explicit.
- Required change: for stateful/distributed profiles require the applicable consistency and durability guarantees, source of truth, read/write visibility, partition/degraded-mode behavior, delivery/order/dedup semantics, and clock/lease assumptions. N/A remains valid for mechanisms the target does not use.

## R8 — `dead-code proof` is incorrectly required before a dead-code claim exists

- Severity: medium
- Blocking: yes
- Location: template §3 pure-library profile
- Description: `dead-code proof` as a typically required pure-library module suggests every review must prove an absence or exhaustively classify reachability. The detailed §6.10 rules correctly describe the evidence needed when making a deletion/dead-code claim; they should not create a mandatory negative claim.
- Required change: rename the profile item to `dead-code/simplification assessment`; require full reachability proof only when asserting `dead`, `unused`, or deletion safety. A bounded sample with no claim can be recorded as sampled.

## R9 — Evidence modes mix orthogonal dimensions

- Severity: medium
- Blocking: no
- Location: template §5.1
- Description: `reasoned`, `static`, `empirical`, `historical`, and `hybrid` are not one exclusive axis. Static source evidence still requires reasoning; an empirical reproduction can also be historical; `hybrid` hides which sources were combined.
- Required change: split into source/method (`static source`, `test/gate`, `runtime probe`, `measurement`, `historical record`) and conclusion basis (`reasoned`, `empirically reproduced`, `machine-enforced`, or combined). Continue recording exact provenance and limits.

## R10 — Negative-claim rule overgeneralizes one search recipe

- Severity: low
- Blocking: no
- Location: domain `Negative and exclusivity claims`; template §§5.1 and 9
- Description: the draft groups `missing`, `only`, `canonical`, `dead`, `unbounded`, and `unused` under a shared list including dynamic registration/build/public reachability. Those checks are appropriate for absence/exclusivity/dead-code claims but not necessarily for a resource-bound claim. An `unbounded` claim instead needs a reachable input-to-allocation/wait causal path and proof no governing bound intervenes.
- Required change: retain the strong general rule but say `applicable checks by claim class`; provide separate minimum evidence for absence/exclusivity/dead-code and resource/latency-bound claims.

## R11 — Detection is described as containment

- Severity: low
- Blocking: no
- Location: domain model `Core relationship`
- Description: `Detection and recovery contain those departures` conflates observability, containment, and recovery. Detection surfaces a departure; it does not limit blast radius. Recovery may restore state but is also distinct from containment.
- Required change: add/define containment or fault isolation and say detection exposes, containment bounds, and recovery restores/resumes/reconciles.

# Paper tests

## A. Small pure deterministic library

Hypothetical target: a source-only deterministic byte-normalization library exposing one pure function, no I/O, globals, external services, mutable state, installation workflow, or alternate implementation.

Useful required modules: decision card, purpose/contracts, API compatibility, cohesion/coupling, conditional SOLID, unit/property evidence, performance only against promised bounds, maintainability, and a sampled simplification/reachability assessment.

Honest N/A modules: CLI/process, stateful mutation/atomicity/recovery, distributed concurrency, security-host authorization/credentials/network, package installation if not distributed independently, and UI/server lifecycle.

Result: module-level `not applicable` semantics work and prevent many false deficiencies. Conditional OCP/LSP/ISP/DIP wording also survives: absent variants and seams do not become violations. The overall paper test nevertheless fails because §§4.3/7/9 still require a read and mutation/workflow failure timeline, while the pure-library profile says `dead-code proof` is typically required. The linear domain relationship also has empty adapter/orchestrator/state roles. These are template defects, not target deficiencies.

Fields that became empty or misleading: singular `Owning authority` is tolerable here but `orchestrator/adapter`, `State`, `Failure/recovery`, mutation `commit/receipt/recovery`, security matrix, and mandatory dead-code proof are empty. `N/A` should be expressly allowed at row/artifact level, not only module level.

## B. Stateful/distributed adapter

Hypothetical target: a remote document adapter with local cache, version/CAS writes, bounded retries, authentication, partial network failure, and server-owned durable history.

Useful required modules: target/artifact identity, purpose-to-authority map, state/version contracts, concurrency/distributed, security, reliability/failure windows, API/error contracts, testability/fault injection, performance/resource bounds, portability, and maintainability. CLI/process, UI, or package modules can be N/A if the adapter exposes none of those surfaces.

Result: applicability labels, evidence grades, failure timeline, idempotence/unknown-outcome analysis, partial receipts, cancellation, counterevidence, and revision drift work well. The test fails completeness because one capability has multiple legitimate authorities (server: durable state/CAS; client: cache/retry/credential policy), while the table asks for one. The template also permits completion without an explicit consistency/durability/partition/delivery contract. Deduplication by owner could merge independent cache-staleness and retry-duplication causes merely because both live in the adapter.

Fields that became ambiguous: singular authority, generic `State/dependencies`, combined `exposure/likelihood`, and `Failure/recovery` without consistency/durability responsibility. N/A semantics successfully prevent false deficiencies for absent process/UI/package mechanics, subject to fixing the unconditional cross-cutting matrices.

# Survived checks

- No aggregate score; consequence, confidence, and action priority are explicitly independent.
- No finding quota; zero material findings is valid.
- SOLID is conditional and avoids size, speculative variation, type-only substitution, interface fragmentation, and mockability-only DI traps.
- Evidence grades preserve revision, causal trace, controls, limitations, and counterevidence; green gates are correctly bounded.
- Negative/exclusive claims require more than one textual search.
- Finding schema separates symptoms from owning cause and preserves dissent/counterevidence.
- Revision drift invalidates or historical-labels affected evidence.
- Target freeze includes source, dependencies, generated inputs, and artifact identity.
- Private disclosure routing occurs before public persistence.
- Applicability includes `not assessed` plus blocker/residual risk rather than treating unknown as absent.
- Proportionality, progressive disclosure, amendment non-silence, survived attacks/refutations, and post-use field retirement are present.

# Dissent to preserve

1. Aggregate architecture scoring should remain prohibited by default, not merely optional.
2. `Proven adequate` should be removed or reserved for explicitly bounded machine-enforced properties.
3. Dead-code proof should be claim-triggered, not a universal pure-library obligation.
4. Completeness means coverage of a frozen material risk/capability universe, not an ever-growing checklist.
5. Approval must not depend on finding count, rubric fill rate, module count, or numeric coverage targets.

# Confidence and limits

Confidence: high in the blocking reuse/evidence issues because both paper targets produce direct contradictions with mandatory wording. Medium in the distributed-contract completeness issue because some reviewers could place those semantics in generic contract/state fields, but the current template does not require them explicitly.

This review assessed only the exact template, domain model, and updated plan. It did not inspect package behavior, run tests, mutate source/git, contact the network, or publish `packages/cli` findings.
