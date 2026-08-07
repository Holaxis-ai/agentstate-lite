---
type: Research
title: Reusable architecture review domain model
actor: codex-orchestrator
timestamp: '2026-08-07T14:18:25.210Z'
---
# Architecture review domain model

Version: `1.0`. Approval is version-specific and recorded with the architecture-review template approval record.

## Purpose

This taxonomy gives reviewers one vocabulary for tracing a system from purpose to implementation and evidence. It is analytical rather than prescriptive: one module may play several roles when its invariants remain cohesive.

## Core relationship

Treat the target as a graph, not a mandatory linear chain:

`purpose -> capability -> surface -> [adapter/orchestrator]* -> authority+`

Roles in brackets are optional; authorities may be plural and must name the responsibility each owns. A pure function can connect its surface directly to one semantic authority. A distributed capability can have one server authority for durable state/CAS and a client authority for cache, credential, or retry policy. State and resources are governed by named authorities; dependencies and boundaries may attach to any node or edge. Cross-boundary invariants need one semantic owner plus explicit enforcement/agreement at irreducible points.

Contracts govern each edge. Invariants belong to named authorities. Operations move state or emit effects. Faults act on boundaries, dependencies, state, and resources; failure modes are observable departures from contract. Detection exposes departures, containment/fault isolation bounds blast radius, and recovery restores, resumes, or reconciles. Evidence supports or rebuts findings. A finding names the owning architectural cause and attaches local symptoms to it.

## Terms

| Term | Definition | Review test |
|---|---|---|
| Review target | Exact component, revision, runtime surfaces, built artifacts, and dependency boundary under review. | Is the target frozen and reproducible? |
| Scope authority | Product or architecture record that decides goals, non-goals, and frozen work. | Does each recommendation serve it or a demonstrated risk? |
| Capability | User- or system-visible outcome. | Can it be traced through a surface to an authority and evidence? |
| Public surface | Supported API, CLI command, protocol, file format, config, hook, binary, or operator workflow. | Is its success/error/side-effect contract explicit? |
| Domain concept | Stable entity, state, or operation in the problem vocabulary. | Does meaning survive adapter and representation boundaries? |
| Invariant | Property that must hold across all valid states/transitions. | Is enforcement owned once or agreement-tested across irreducible points? |
| Contract | Observable input, output, error, side-effect, ordering, compatibility, timing, and resource obligations. | Could a third party test semantic substitution? |
| Canonical authority | Owning primitive for behavior, identity, interpretation, state transition, or policy. | Do adapters delegate, and has exclusivity been bounded and proven? |
| Policy | Context-dependent choice such as target, authority, retry, compatibility, presentation, or workflow. | Does it live at the narrowest layer with required context? |
| Adapter | Translation between an external representation and an authority. | Does it avoid reimplementing semantics? |
| Orchestrator | Coordinator of authoritative operations and workflow outcomes. | Does it own sequence/compensation rather than lower-level semantics? |
| Projection | Consumer-specific derived view of authoritative state. | Is it reproducible or agreement-tested, never an independent authority? |
| Seam | Deliberate boundary where implementation, environment, or policy may vary. | Is variation real, or is the seam justified by a material fault/test boundary? |
| Dependency | Compile-time, runtime, data, temporal, operational, environmental, or capability reliance. | Is direction aligned with stability and authority, including ambient dependencies? |
| Boundary | Transition between trust, ownership, process, package, persistence, protocol, or representation domains. | Are validation, authorization, lifecycle, errors, and resources explicit? |
| Asset | Data, state, authority, availability, executable content, credential, or user resource that requires protection. | What harm follows from confidentiality, integrity, availability, or ownership loss? |
| Actor / principal | Human, process, service, or authenticated identity that initiates or receives an operation. | Is identity established, and is it distinct from advisory attribution? |
| Attacker capability | Concrete control or access available to an adversary, independent of identity labels. | Which inputs, files, processes, origins, credentials, timing, or network positions can the actor influence? |
| Trust assumption | Proposition relied on without enforcement inside the target. | Is it explicit, justified, and invalidated safely when false? |
| Trust boundary | Boundary across which identity, integrity, confidentiality, or authority assumptions change. | Are data and capabilities revalidated on crossing and before use? |
| Entry point | Externally influenced source or supported invocation path into the target. | Is every reachable source inventoried or placed in a justified equivalence class? |
| Privileged sink | Side effect or decision that can mutate/delete data, execute code, grant authority, expose credentials, publish, listen/connect, or cross ownership. | Is the complete source-to-sink path validated and authorized? |
| Authentication | Establishing the principal associated with an operation. | What evidence establishes identity, and where can it become stale or confused? |
| Authorization | Decision that a principal/capability may perform a specific action on a target/version. | Is it default-deny, correctly scoped, and revalidated at the commit point? |
| Security invariant | Protection property that must hold against stated actor capabilities and trust-boundary changes. | Is it enforced by a named authority and tested across every reachable path? |
| State | Durable or transient fact affecting later behavior. | Are authority, identity/version, lifecycle, consistency, and reconstruction source known? |
| Resource | Bounded file, memory, descriptor, process, socket, lock, CPU, credential, queue, or network use. | Are ownership, limits, cancellation, and cleanup defined? |
| Operation | Read or mutation that moves state or emits effects. | Are preconditions, commit point, postconditions, failure windows, and retry semantics known? |
| Atomic unit | Smallest change set that must appear all-or-nothing to a named observer. | If true atomicity is impossible, is compensation or resumable partial completion truthful? |
| Fault | Adverse condition such as invalid input, interruption, race, timeout, corruption, or dependency failure. | Can it be injected or reasoned about at the owning boundary? |
| Failure mode | Reachable contract departure caused by a fault. | Are trigger, impact, detection, containment, and recovery established? |
| Error contract | Stable failure type/category/channel/status/exit/message obligation. | Can callers distinguish outcomes that require different recovery? |
| Detection signal | Evidence distinguishing success, no-op, degradation, partial work, retryable failure, and terminal failure. | Is it actionable, correlated, bounded, and secret-safe? |
| Containment / fault isolation | Mechanism that limits the effects of a fault or compromise to an intended target, capability, process, or resource budget. | Does one failure remain within its declared blast radius? |
| Recovery | Safe restore, resume, rollback, compensate, or converge behavior. | Is it repeatable, data-preserving, and unable to bypass the original invariant? |
| Evidence unit | Revision-bound source, test, trace, measurement, reproduction, or bounded search supporting one claim. | Are method, provenance, limitations, and counterevidence recorded? |
| Symptom | Local observation such as duplication, awkward tests, inconsistent output, or repeated failures. | Is it grouped under an owning cause rather than inflated into its own finding? |
| Architectural cause | Missing or violated ownership, dependency, state, boundary, or contract rule. | Does changing it remove a class of symptoms? |
| Finding | Evidence-backed claim that a reachable condition violates an obligation or creates material risk/change cost. | Does it include consequence, confidence, priority, counterevidence, and acceptance test? |
| Opportunity | Non-contractual simplification or maintainability improvement with stated carrying cost/benefit. | Is it proportionate and not mislabeled as correctness? |
| Counterevidence | Evidence that narrows reachability, impact, or the proposed cause. | Was it actively sought for material claims? |
| Residual risk | Risk remaining after current controls or proposed remediation. | Is uncertainty preserved rather than implied away? |

## Negative and exclusivity claims

All negative/exclusivity claims require a declared universe, causal argument, and counterevidence, but minimum checks depend on claim class. `missing`, `only`, and `canonical` require alternate-mechanism, surface/writer/interpreter, and dynamic-registration checks. `dead` and `unused` additionally require build/generated/runtime/public-contract and migration reachability. `unbounded` resource/latency claims require a reachable input-to-allocation/wait path and proof that no governing bound, backpressure, cancellation, or lifecycle limit intervenes. A single text search can generate a hypothesis but cannot close one.

## Decision dimensions

Do not produce an aggregate architecture score. Keep these independent:

- consequence: impact and blast radius;
- confidence: strength and completeness of evidence;
- action priority: urgency and leverage after considering reachability, detectability, recoverability, change frequency, cost, and residual risk.

## Reuse profiles

All targets use the purpose, system-map, contract, evidence, maintainability, and finding core. Add composable profiles:

- pure library: semantic contracts, substitution, change amplification, API compatibility, unit/property evidence;
- CLI/process adapter: argv/stdin/stdout/stderr/exit contracts, environment, subprocesses, portability, cleanup;
- stateful/persistent: identity/version, atomicity, corruption, migrations, recovery;
- concurrent/distributed: consistency/durability, source of truth, read/write visibility, partition/degraded authority, delivery/order/deduplication, clock/lease assumptions, CAS/locks, idempotence, retries/timeouts, partial failure, reconciliation;
- security-sensitive host: threat boundaries, authorization, credentials, unsafe defaults, containment;
- published package/plugin: built-artifact parity, install/update/rollback, dependencies, provenance;
- UI/server host: lifecycle, protocol, trust/sandbox, backpressure, disconnect/replay.

Every profile/module/artifact is `required`, `sampled`, `not applicable` with rationale, or `not assessed` with a declared gap. `Sampled` names the population, method, and residual unsampled risk. `Not applicable` means absent or unreachable under the frozen target/threat models—not merely frozen, unsupported, or no-auth-by-design. `Not assessed` preserves the blocker and residual risk; an applicable material security gap makes the target verdict incomplete.
