---
type: Context Note
title: 'CLI architecture review template: design and skeptic draft'
description: >-
  Reusable domain taxonomy, design/reliability/maintainability criteria,
  evidence thresholds, skeptical tests, and plan-gate recommendations produced
  before package findings.
actor: architecture-skeptic
timestamp: '2026-08-07T14:04:46.018Z'
---
# Summary

This note proposes the architecture-skeptic contribution to a reusable architecture-review template. It is deliberately target-neutral: it defines the domain model, design/reliability/maintainability criteria, evidence thresholds, prioritization rules, and skeptical tests that must be frozen before reviewing `packages/cli`. No `packages/cli` finding is asserted here.

Ultimate goal: agentstate-lite remains a plain-text, local-first, human-visible, conflict-safe memory system for one human and an agent fleet. Proximate goal: establish a reusable review frame that finds owning architectural causes rather than merely listing symptoms. This serves the ultimate goal by making quality assessment repeatable without creating a second authority or an unbounded process.

Minority positions to preserve during synthesis:

1. Do not produce an aggregate architecture score by default. It creates false precision, rewards checklist completion, and makes non-applicable categories look like deficiencies.
2. Do not require every rubric module for every target. Require an explicit applicability decision tied to the target's purpose, state model, trust boundaries, and deployment profile.
3. Treat SOLID as a set of conditional questions, not a compliance standard. Its useful concepts translate beyond objects, but some terms are inapplicable to functional modules, scripts, and stable one-implementation seams.
4. Do not call code dead, a behavior canonical, or an absence proven from a single search. Negative and exclusivity claims require stronger evidence than ordinary existence claims.
5. Prefer a small number of causal findings over many local style observations. A symptom belongs under the finding for the authority or invariant that owns it.

# A. Domain model and taxonomy

## A1. Review levels

The template should orient from purpose inward, not from files outward:

1. **Purpose and scope authority** define why the reviewed target exists, which outcomes matter, and which work is explicitly frozen or outside scope.
2. **Capabilities/use cases** are user- or system-visible outcomes the target must provide.
3. **Public surfaces/entry points** expose capabilities to callers, operators, processes, or other packages.
4. **Orchestration and policy** coordinate steps and make target-specific decisions without recreating lower-level semantics.
5. **Canonical authorities and adapters** own invariants or translate between an authority and an external surface.
6. **State, resources, and dependencies** make behavior durable or connect it to external actors and failure domains.
7. **Contracts and evidence** define what must remain true and how the review can know.

These are analytical roles, not a required directory layout. One module can legitimately play more than one role if its invariants remain cohesive and legible.

## A2. Terms

| Term | Definition | Key relationship/test |
|---|---|---|
| Review target | The exact component, package, service, revision, and reachable runtime surfaces being assessed. | Must be revision-frozen; distinguishes owned code from consumed dependencies. |
| Scope authority | The authoritative product/architecture record that decides goals, non-goals, and frozen work. | Every criterion and recommendation must trace to it or to a demonstrated risk. |
| Capability / use case | An outcome provided to a user or upstream system. | Realized by one or more public surfaces; should trace to an owning authority and verification. |
| Public surface / entry point | A supported API, CLI command, protocol endpoint, file format, configuration, hook, binary, or operator workflow. | Crosses a contract boundary and may expose the same capability through multiple projections. |
| Domain concept | A named entity, state, or operation in the problem space whose meaning should be stable across implementations. | Vocabulary should not silently change at adapter boundaries. |
| Invariant | A property that must hold across all valid states and transitions. | Must have one owning enforcement point or explicit agreement evidence across irreducible points. |
| Contract | Observable obligations for input, output, errors, side effects, ordering, timing, compatibility, and resource use. | More than a type signature; supports substitution and fault analysis. |
| Canonical authority | The single owning primitive for a behavior, state transition, identity rule, or interpretation. | Adapters delegate to it; projections derive from it; exclusivity must be proven across surfaces. |
| Policy | A context-dependent decision such as target choice, permission, retry, presentation, compatibility, or workflow. | Should live at the narrowest layer with the needed context, while semantic invariants remain below adapters. |
| Adapter | Translation between a public/external representation and a canonical authority. | Should not grow a parallel semantic implementation. |
| Orchestrator | Coordinates authoritative operations into a workflow and reports outcomes. | Owns sequence and compensation, not each operation's underlying semantics. |
| Projection | A derived view of authoritative state for a specific consumer. | Must be reproducible or agreement-tested; must not become an independent source of truth. |
| Seam | A deliberately stable boundary where implementations, environments, or policies may vary. | Justified by observed variation or testability need; not merely an interface-shaped file. |
| Dependency edge | A compile-time, runtime, data, temporal, operational, or capability reliance. | Direction should follow stability and authority; hidden ambient dependencies count. |
| Boundary | A transition between trust, ownership, process, package, persistence, protocol, or representation domains. | Requires explicit validation, error mapping, and lifecycle/resource contracts. |
| State | Durable or transient facts that affect later behavior. | Identify authority, lifecycle, version/identity, consistency, and reconstruction source. |
| Resource | A bounded external or runtime asset: memory, files, descriptors, processes, sockets, locks, CPU, network calls, or credentials. | Requires ownership, cleanup, and bounds. |
| Operation / transition | A read or mutation that moves the system between states or emits effects. | Define preconditions, commit point, postconditions, failure windows, and retry semantics. |
| Transaction / atomic unit | The smallest change set that must appear all-or-nothing to a defined observer. | May use rollback, compensation, or resumable partial completion when true atomicity is impossible. |
| Fault | An underlying adverse condition such as interruption, race, corruption, timeout, dependency failure, or invalid input. | Can activate a failure mode; not identical to the user-visible error. |
| Failure mode | How system behavior departs from its contract under a fault. | Has trigger, reachability, impact, detection, containment, and recovery dimensions. |
| Error contract | The typed/category/channel/exit/status and message obligations for a failure outcome. | Must preserve machine actionability and not corrupt reserved output channels. |
| Detection signal / observability | Evidence emitted so a caller or operator can distinguish success, no-op, partial completion, retryable failure, and terminal failure. | Must be correlated with target, actor/operation, and version where applicable without leaking secrets. |
| Recovery / reconciliation | A safe method to restore, resume, or converge state after failure. | Must not bypass the invariant that caused refusal; should preserve user data and disclose incomplete work. |
| Evidence unit | A source location, contract text, test, trace, measurement, reproduction, or bounded search supporting one claim. | Carries provenance, method, revision, limitations, and empirical/reasoned classification. |
| Symptom | A local observation such as duplication, awkward tests, inconsistent output, or repeated failures. | May be caused by a deeper ownership or contract problem; should not automatically become a separate finding. |
| Architectural cause | The violated or missing ownership, dependency, state, or contract rule that explains one or more symptoms. | Findings should be named for this cause and attach symptoms as evidence. |
| Finding | An evidence-backed claim that a reachable condition violates an obligation or creates material change/risk cost. | Includes expected vs actual, causal chain, impact, evidence, confidence, priority, and remedy acceptance test. |
| Debt / opportunity | A non-contractual maintainability or simplification improvement with explicit carrying cost or benefit. | Must not be inflated into a correctness finding. |
| Counterevidence | Evidence that narrows reachability, impact, or the claimed cause. | Mandatory for high-impact claims and disagreements. |
| Residual risk | Risk remaining after current controls and any proposed remediation. | Prevents recommendations from implying absolute safety. |

## A3. Relationship model

The core trace is:

`purpose -> capability -> public surface -> orchestrator/adapter -> canonical authority -> state/dependency`

Contracts govern every arrow. Invariants are owned by authorities and exercised by operations. Faults act on boundaries, dependencies, state, and resources; failure modes are the resulting contract departures. Detection and recovery contain those departures. Evidence supports or rebuts a finding. A finding identifies an architectural cause and attaches its symptoms; remediation changes the owning authority, contract, or boundary rather than patching each symptom unless the symptoms are genuinely independent.

# B. Reusable template structure

## B1. Decision card

The top page must let a new reader answer in under one minute:

- exact target and revision;
- purpose, scope authority, and non-goals;
- risk/applicability profile;
- review status and owner;
- blocking findings, highest-leverage next action, and unresolved disagreements;
- evidence cutoff and whether any target drift occurred after review began.

## B2. Applicability and risk profile

Before inspecting implementation, mark every module `required`, `sampled`, `not applicable`, or `not assessed`, with a one-sentence reason. Suggested profiles are composable:

- baseline library/module: design, contracts, maintainability, dead-code/simplification;
- CLI/process adapter: argument/input contracts, output/error channels, exit behavior, environment/portability, process/resource cleanup;
- stateful/persistent: identity/versioning, atomicity, recovery, corruption, migrations;
- concurrent/distributed: CAS/locking, ordering, idempotence, retry/timeout, partial failure, reconciliation;
- security-sensitive/host integration: trust boundaries, authorization, credentials, path/process/network behavior, unsafe defaults;
- published package/plugin: compatibility, dependency/supply chain, built-artifact parity, installation/upgrades;
- UI/server host: lifecycle, sandbox/trust, backpressure, client disconnect/replay, protocol compatibility.

Not-applicable is a reviewed conclusion, not a blank. Not-assessed is an explicit coverage gap.

## B3. System map and contract inventory

Inventory capabilities, public surfaces, authorities, state stores, dependencies, trust/process boundaries, and external effects. For each public surface, identify the authority it delegates to and the observable success/error/resource contract. Record duplicate-looking surfaces before deciding whether they are redundant or legitimate projections.

## B4. Evidence ledger

Each material claim records: exact revision; source/probe; method (`empirical`, `reasoned`, or `mixed`); observed result; contract/expectation; reachability; limitations; counterevidence; confidence; and which finding, if any, consumes it. Survived adversarial probes belong beside failures so approval remains calibrated.

## B5. Finding record

Each finding should contain:

- causal title and category;
- affected capabilities/surfaces and owning architectural cause;
- expected contract versus observed behavior;
- symptoms grouped under that cause;
- trigger, reachability, impact, exposure/likelihood, blast radius, detectability, and recoverability;
- evidence ledger references with empirical/reasoned labels;
- counterevidence, uncertainty, confidence, and dissent;
- priority/action horizon, not an aggregate quality score;
- remedy class and correct owning layer, without requiring a premature implementation design;
- a deterministic acceptance/red test where feasible, plus remediation risks and residual risk.

# C. Design and architecture criteria

## C1. Cohesion

- Does each module/authority group behavior that enforces the same invariants and changes for the same domain reason?
- Can its responsibility be named without `and`, except for inseparable steps in one state transition?
- Are related policy, state, and lifecycle rules local enough that a change does not require archaeology across unrelated modules?
- Are large files decomposed only where responsibilities diverge? File size alone is not evidence of low cohesion.
- Evidence: representative change traces, shared vocabulary/invariants, call/data locality, repeated co-change, and test construction. Avoid raw LOC thresholds.

## C2. Coupling

Assess compile-time, runtime, data/schema, temporal/order, operational/environmental, capability/permission, and cognitive coupling separately.

- Are dependencies explicit and minimal, or ambient through globals, filesystem layout, environment, process state, or undocumented ordering?
- Does a consumer depend on a stable contract or on incidental representation and lifecycle details?
- Are cycles or callbacks forcing lower-level modules to know higher-level workflows?
- Is high coupling inherent to an atomic workflow, or evidence of duplicated ownership?
- Record fan-in/fan-out only as an inventory signal; counts do not establish harmful coupling.

## C3. SOLID, conditionally applied

- **SRP:** Identify the actual reason to change and invariant owner. A module is not in violation merely because it has many functions, nor compliant merely because it is small.
- **OCP:** Ask whether a demonstrated variation axis can be added without modifying stable policy. Do not introduce abstraction for imagined variants; repeated variant edits or incompatible consumers are the evidence threshold.
- **LSP:** For interchangeable implementations, verify preservation of semantic contracts: values, errors, ordering, idempotence, concurrency, timing/resource bounds, and side effects. Type compatibility alone is insufficient.
- **ISP:** Do consumers depend only on operations/capabilities they need? Balance this against fragmentation and coordination cost; one cohesive interface can be preferable to many micro-interfaces.
- **DIP:** Does high-level/domain policy depend on stable abstractions rather than low-level mechanisms? Is the abstraction shaped and owned by domain needs? Dependency injection is not automatically beneficial for deterministic, pure, single-implementation code.

Mark any principle not applicable and explain why.

## C4. Dependency direction and canonical authorities

- Do outer adapters and hosts depend inward on semantic authorities, with mechanisms supplied through bounded seams?
- Are validation, mutation, identity, interpretation, authorization, and serialization rules owned once?
- Are projections derived rather than independently maintained?
- If duplication is irreducible across public surfaces, is there an agreement table/test covering every surface and contract row?
- Do package/import rules match runtime and data authority, or merely make the static graph look clean?
- A `canonical` claim requires an exhaustive public-surface inventory, call/import trace, and proof that no parallel writer/interpreter remains.

## C5. Change amplification and evolvability

Trace at least three representative changes: one routine feature change, one cross-cutting contract change, and one failure-policy change. Record files/packages/surfaces/tests/docs and teams/operators touched, plus whether changes are mechanical projections or independent judgments.

High span is not automatically harmful: a public contract may legitimately require many projections. The concern is repeated independent decisions, unsynchronized authorities, or disproportionate coordination risk. Distinguish expected fan-out from semantic duplication.

## C6. API, compatibility, and error contracts

- Are preconditions, outputs, side effects, ordering, commit point, and postconditions explicit?
- Are machine-facing errors typed/categorized with stable channels, statuses/exit codes, retryability, and bounded messages?
- Can callers distinguish absent, invalid, conflict, unauthorized, transient, partial, and internal failure where behavior differs?
- Are raw-byte or protocol channels protected from diagnostic contamination?
- Are compatibility/version-skew policies explicit for persisted data, protocols, generated artifacts, configuration, and external consumers?
- Are breaking changes and migrations discoverable, reversible where required, and exercised against real compatibility fixtures?

# D. Reliability, recovery, and resource criteria

## D1. State-transition and failure-window model

For every material mutation or multi-step workflow, document: starting state, validation, external reads, decision point, first irreversible effect, commit point(s), receipt, and cleanup. Probe faults before, during, and after each irreversible step. Success-path correctness alone is not reliability evidence.

## D2. Idempotence and retry safety

- Define the identity of an intent and the observable no-op result.
- Does exact replay after success remain a no-op? What about retry after an unknown outcome or partial completion?
- Are external side effects deduplicated or guarded by stable keys/versions?
- Does idempotence preserve the caller's full intent rather than collapsing semantically distinct operations that share a target?
- Are retries bounded by deadline/attempt count, limited to transient categories, backoff/jittered where distributed load matters, and safe from retry storms?

## D3. Atomicity, partial completion, and compensation

- What observer and unit define atomicity?
- Are multi-resource writes truly atomic, serialized, compensatable, or explicitly resumable?
- If partial completion is possible, does the receipt name completed and pending work without falsely reporting rollback?
- Can a rerun safely continue, and can an operator reconcile without bypassing global refusal or ownership checks?
- Are preflight checks invalidated by later writes (TOCTOU), and if so, is each commit guarded by the exact observed version?

## D4. Concurrency

- Analyze lost updates, duplicate effects, stale reads, TOCTOU, ABA, lock ordering/deadlock, starvation/fairness, lock leakage, and inter-process/inter-host behavior.
- Identify the concurrency domain: same call, event loop, process, user, host, filesystem, or remote multi-writer service.
- Are CAS/locks applied at the correct physical identity and held for the smallest safe interval?
- Are conflict retries bounded and do they re-read/re-decide rather than replay stale intent?
- Do crash-leftover locks fail safely with inspectable ownership, or can they be stolen/left permanent without a recovery policy?

## D5. Timeouts, cancellation, and external dependency faults

- Every network, process, lock, watch, or potentially unbounded filesystem wait needs an explicit bound or documented operator-controlled lifetime.
- Cancellation should propagate, terminate owned children where safe, release resources, and preserve a truthful outcome.
- Test unavailable dependencies, malformed/partial responses, disconnects, latency, version skew, and offline operation where promised.
- Distinguish deadline exceeded from user cancellation and dependency rejection when callers need different recovery.

## D6. Crash, corruption, and recovery

- Probe interruption before write, during temporary state, after durable state but before receipt, and during cleanup.
- Define behavior for torn/corrupt persisted state, orphaned temporaries, stale caches, missing ownership metadata, and invalid migrations.
- State whether each fault fails open or closed and why. Security/integrity boundaries normally require fail-closed; availability paths may justify bounded degradation.
- Recovery must be repeatable, data-preserving, and able to reconstruct authority from durable facts rather than optimistic caches.

## D7. Fault isolation and blast radius

- Can one target, document, plugin, request, workspace, or child process failure corrupt or block unrelated work?
- Are bulk workflows per-item isolated where semantics allow, with bounded concurrency and partial receipts?
- Are dangerous cleanup/delete targets resolved to exact identities before mutation?
- Does degraded operation silently broaden permissions, targets, or consistency assumptions?

## D8. Observability and operator actionability

- Emit structured outcomes that distinguish success, semantic no-op, warning/degradation, partial completion, retryable failure, and terminal failure.
- Include correlation, exact target, actor/operation identity, version/commit evidence, and next action where applicable; exclude secrets and sensitive payloads.
- Ensure logs, returned envelopes, persisted receipts, and metrics do not contradict one another.
- Observability is not correctness: a trace that explains an unsafe outcome does not make it safe.
- For agent consumers, keep output bounded and progressively disclosed rather than forcing full logs into context.

## D9. Performance and resource bounds

- Establish input-size and concurrency models before judging performance.
- Review algorithmic complexity, body/materialization behavior, remote round trips, batching, streaming, output caps, backpressure, cache growth/eviction, file descriptors, child processes, sockets, timers, and temporary disk use.
- Performance findings require a measurement under a representative bound or a direct complexity/resource proof; intuition and file size are insufficient.
- A fast happy path does not excuse unbounded worst cases. A slower path may be correct if it buys a required atomicity or trust guarantee; name the tradeoff.

# E. Maintainability, documentation, portability, and simplification

## E1. Maintainability and documentation

- Can a new maintainer locate purpose, entry point, authority, invariants, state, failure behavior, and tests through progressive disclosure?
- Do names use domain concepts consistently across code, output, docs, and tests?
- Are stable non-obvious reasons documented near code while review history and temporary adjudication stay outside it?
- Are public/reference docs generated from or agreement-tested against one authority when drift would be consequential?
- Do tests explain contracts and failure modes rather than mirror implementation structure?
- Is configuration explicit, validated once, and free from surprising ambient precedence?
- Is dependency upgrade, migration, deprecation, and compatibility ownership clear?
- Review cognitive load and navigation with a representative change task, not subjective impressions alone.

## E2. Portability and operability

- Test supported runtime versions, OS/filesystem semantics, path separators/case/symlinks, shell invocation, locale/time zone/encoding, permissions, temporary directories, home/config relocation, offline mode, and packaged/bundled execution as applicable.
- Distinguish development-tree success from installed-artifact success.
- Avoid assuming inherited `PATH`, cwd, interactive terminal, network, global git config, or write access beyond declared locations.
- A portability finding needs a supported-environment contract and an exact incompatibility, not a request to support every environment.

## E3. Dead code and simplification

Potential dead-code classes include unreachable implementations, unused exports/dependencies, stale compatibility branches, retired feature flags/constants, duplicate/superseded authorities, generated artifacts without consumers, and tests that only keep a retired path alive.

Evidence threshold for deletion:

1. bound the search universe (source, dynamic imports/registries, build scripts, package exports, generated assets, docs/commands, external/public compatibility);
2. trace runtime/build reachability, not just textual references;
3. identify why the path existed and whether migration/deprecation obligations remain;
4. show the benefit of deletion (removed authority/state/branch/dependency or measurable cognitive/build cost);
5. specify tests/docs/artifacts removed or changed atomically with it.

Elegance means minimal authorities, state transitions, translations, and concepts needed to satisfy the contract—not terse or clever code. Simplification choices include delete, collapse into the authority, inline an unvarying one-off, parameterize a proven variation axis, isolate compatibility at a boundary, or preserve intentional redundancy with a stated reliability/security reason.

# F. Evidence thresholds and prioritization

## F1. Claim-strength rules

- **Inventory/descriptive claim:** one exact source or runtime observation may suffice, with revision and scope.
- **Design concern:** requires either one direct contract/invariant violation or at least two independent signals plus a causal explanation.
- **Medium/high finding:** requires a reachable production path, exact code/contract evidence, impact analysis, counterevidence search, and a bounded empirical probe or executable agreement evidence where feasible. If empirical proof is impossible, mark it reasoned, lower confidence, explain the limit, and require independent cross-review before publication.
- **Absence claim:** requires a bounded exhaustive search and evaluation of alternate mechanisms/indirect consumers. `rg` returning zero is a lead, not proof.
- **Canonical/exclusive claim:** requires inventorying every relevant surface and writer/interpreter, not merely finding the intended authority.
- **Performance claim:** requires representative measurement or direct complexity/resource-bound proof.
- **Dead-code claim:** requires build/runtime/public-contract reachability analysis as described above.
- **Security-sensitive main-branch issue:** follow the private disclosure route; the public record may only state that a private process was invoked.

Empirical evidence can still be weak if the environment is unrepresentative or the probe misses a failure window. Reasoned evidence can be strong for a direct, deterministic contract contradiction. The method label does not substitute for an evidence-quality explanation.

## F2. Decision states instead of an aggregate score

For each applicable obligation use: `proven adequate`, `survived sampled probes`, `concern`, `material gap`, `not applicable`, or `not assessed`. Keep three independent dimensions for findings:

- consequence/impact and blast radius;
- evidence confidence;
- action priority/horizon.

Do not sum them. Priority should consider user harm/invariant importance, reachability/exposure, likelihood, detectability/recoverability, change frequency/amplification, remediation leverage, and confidence. Unknown values remain unknown rather than becoming arbitrary numbers. A lower-confidence high-impact hypothesis may justify a probe, not an immediate redesign.

# G. Skeptical tests for template completeness and reuse

The template is not approved until it passes these tests:

1. **Forward trace:** Every in-scope capability maps to a surface, authority, state/dependencies, success/error contract, failure behavior, and verification evidence.
2. **Reverse trace:** Every rubric question maps back to a product obligation, risk profile, or demonstrated carrying cost. Remove orphan checklist items.
3. **Representative change trace:** A routine change, cross-cutting contract change, and failure-policy change can be assessed without inventing new fields.
4. **Failure timeline:** At least one read and one mutation can be modeled across precondition, irreversible effects, commit, receipt, interruption, and recovery.
5. **Substitution test:** Where a seam exists, the template checks semantic—not merely typed—substitutability.
6. **Negative-claim test:** Absence, canonicality, and dead-code claims have explicit search universes and counterevidence requirements.
7. **Symptom/cause test:** Multiple local symptoms can be grouped under one authority/invariant without losing evidence; unrelated causes remain separate.
8. **Disagreement test:** Minority positions, counterevidence, and unresolved interpretations survive synthesis instead of being averaged away.
9. **Progressive-disclosure test:** A new reader can identify target, conclusion, next action, blockers, and evidence level in 30–60 seconds, then drill down.
10. **Cross-project profile test:** Apply the template on paper to one simple pure library and one stateful/distributed adapter. Modules can be omitted honestly without empty sections or false deficiencies.
11. **Stopping test:** The review can end with no material findings. Completion is coverage/evidence quality, not a quota of criticisms.
12. **Cost/proportionality test:** The expected cost of missing the targeted risk exceeds the cost of the review field/gate. Retire fields that never affect decisions across repeated uses.

# H. Skeptical critique of the review premise

- Architecture review is potentially unbounded. “Comprehensive” must mean complete against declared capabilities and applicable risks, not every quality attribute anyone can name.
- A broad rubric can manufacture work outside the product's frozen scope. Recommendations must pass the product's load-bearing-artifact test and name the cost of inaction.
- SOLID language can bias reviewers toward object-oriented decomposition and unnecessary interfaces. Translate each principle into observable ownership/contract questions and allow not-applicable.
- Numeric scores are especially weak across heterogeneous surfaces: a process launcher, pure parser adapter, sync workflow, and packaging script do not have commensurable reliability obligations.
- Large files, high fan-in, or many tests are inventory facts, not architecture findings. Splitting code can worsen cohesion and change amplification.
- Test counts and coverage percentages do not prove behavioral relevance. Conversely, missing a unit test does not prove an architecture problem if a stronger agreement or end-to-end contract owns the behavior.
- Security, reliability, and error-contract modules overlap. Synthesis must deduplicate by owning cause while preserving domain-specific impacts and private-disclosure constraints.
- Reusability can make the template too vague. Keep the domain-model and evidence core mandatory; make risk modules composable and version the template based on observed use.
- A template frozen before package inspection protects independence, but it can still encode the orchestrator's assumptions. Preserve the three specialist drafts and reviewer dissents as provenance.
- Do not make “findings found” a success metric. It incentivizes style complaints, speculative abstractions, and inflated severity.

# I. Recommended additions to the plan

1. **Target-freeze gate before phase 5:** confirm the exact review revision/SHA, clean-state provenance, intended branch, owned-code boundary, included generated/built artifacts, and dependency versions. The current orientation explicitly lists intended-branch status as unverified.
2. **Applicability/risk-profile gate before template approval:** specialists agree which modules are required/sampled/not applicable and record dissent. This prevents silent omission and checkbox scope growth.
3. **Evidence-protocol gate:** freeze the evidence ledger, negative-claim rules, empirical/reasoned labels, counterevidence requirement, and private security routing before any findings are drafted.
4. **Synthetic reuse check:** before freeze, paper-apply the template to a small pure library and a stateful/distributed adapter without inspecting `packages/cli` findings. Revise fields that are empty, ambiguous, or misleading.
5. **Symptom-to-owner deduplication gate during synthesis:** every material symptom attaches to an owning invariant/authority; duplicate findings across specialists are combined while distinct impacts and dissent are retained.
6. **Revision-drift gate before cross-review/QA:** if target bytes change after phase 5 begins, either restart affected evidence or freeze/report the original revision. Do not blend findings from multiple revisions.
7. **Negative-claim and completeness audit in QA:** independently audit all “missing,” “only,” “canonical,” “dead,” and “unbounded” claims and run the forward/reverse trace tests.
8. **Post-use template retrospective:** record false positives, fields that did not change a decision, defects uniquely found, and review cost. Evolve or retire template elements based on use rather than allowing permanent rubric growth.

# J. Phase-two probe ideas (not findings)

- Build a per-surface agreement table for target selection, output/error channels, mutation semantics, actor/version propagation, and local/remote behavior.
- Trace representative changes: add a command variant, change a shared error contract, and alter a conflict/retry policy; count independent decisions rather than touched files alone.
- Model failure timelines for one single-resource mutation and one multi-step sync/install workflow; inject interruption at every irreversible step.
- Exercise exact replay, retry-after-unknown-outcome, concurrent conflict, stale lock/ownership, timeout, cancellation, partial dependency response, and offline operation where applicable.
- Trace canonicality for parsing, mutation, target resolution, identity, host/install ownership, and generated-reference semantics across all entry points before using the word `canonical`.
- Bound negative searches for dynamic command registration, generated assets, package exports, scripts, fixtures, docs, and external compatibility before proposing deletion.
- Measure representative large-input memory/output, remote round trips, child-process/descriptor cleanup, watcher lifecycle, and cache bounds only after identifying promised bounds.

# Assumptions and risks

- This draft relies on the product/scope model in `docs/core`, `CLAUDE.md`, the current plan, and the orchestrator's orientation note; it does not assert that documentation and current code agree in every detail.
- The public file inventory was inspected only to identify target profiles. No implementation behavior was adjudicated.
- The current branch may not be the intended review basis; the plan must resolve this at the target-freeze gate.
- The largest template risk is process cost: without applicability and post-use retirement, a reusable rubric will accumulate fields faster than it accumulates decision value.
