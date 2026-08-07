---
type: Doc
title: Reusable architecture review template
actor: codex-orchestrator
timestamp: '2026-08-07T14:18:25.402Z'
---
# Reusable architecture review template

Template version: `1.0`  
Approval is version-specific and recorded in a separate review record that names this document's exact head version.  
Domain model: `research/architecture-review-domain-model`

## 1. Decision card

This top section must let a new reader answer within 30–60 seconds:

- **Target:** component/package/project, exact source revision, branch/tag, clean-state provenance, runtime/platform, built/distributed artifact identity.
- **Purpose and scope authority:** why the target exists; authoritative goal/spec; explicit non-goals and frozen work.
- **Review status and owner:** draft/in review/approved/applied; reviewers and dates; evidence cutoff; target drift since cutoff.
- **Applicability profile:** library, CLI/process, stateful, concurrent/distributed, security-sensitive, published package/plugin, UI/server, or other.
- **Verdict:** approved, approved with caveats, changes recommended, changes required, or incomplete.
- **Decision summary:** blocking findings, highest-leverage next action, unresolved dissent, and material coverage limits.

No aggregate architecture score. Consequence, confidence, and action priority remain independent.

## 2. Review contract and stopping rule

State:

- objective and the decision this review must enable;
- target boundary: owned code, consumed dependencies, generated/vendored content, build scripts, tests, configuration, operational artifacts, and public surfaces included/excluded;
- supported environments/modes and which were empirically available;
- time/evidence budget and safe-probe constraints;
- confidentiality/disclosure lane;
- amendment rule: after template freeze, discovered rubric defects are recorded separately and do not silently change evaluation rules. A nonmaterial improvement is deferred to the next version. A material defect blocks the affected review area, creates a new template version, and requires affected applicability/evidence to be rerun or explicitly reported under the old version; preserve both versions and an impact map;
- stopping rule: freeze the material capability/risk universe from the purpose, system, threat, and requirement models before implementation review. The review ends when every in-scope material item in that frozen universe has a disposition and claims meet evidence thresholds. Newly discovered material risks amend the inventory visibly and are dispositioned before completion. Finding count is never a completion metric.

Before public persistence, triage any security issue: if exploitable by someone other than the victim and present on a publicly released revision (including `main` where `main` is the release channel), route technical detail privately and keep only a redacted routing note in public records.

## 3. Applicability and risk profile

Mark every review module and cross-cutting artifact `required`, `sampled`, `not applicable` with one-sentence rationale, or `not assessed` with blocker/residual risk.

- `sampled` records the bounded population, selection method, why the sample represents the material risk, and residual unsampled risk.
- `not applicable` means the behavior/boundary is genuinely absent or unreachable under the frozen target and threat models. Frozen, unsupported, no-auth-by-design, or non-goal status is not by itself N/A when reachable behavior remains.
- `not assessed` is an explicit coverage gap. Any unassessed applicable material security boundary or other material obligation forces the target verdict to `incomplete`.

Suggested profiles:

| Profile | Typical required modules |
|---|---|
| Pure library/module | purpose, domain/contracts, design/SOLID, compatibility, tests/testability, maintainability, dead-code/simplification assessment |
| CLI/process adapter | baseline plus argv/input, output/error/exit channels, subprocess/environment, resources, portability |
| Stateful/persistent | baseline plus identity/version, atomicity, corruption, migration, recovery |
| Concurrent/distributed | stateful plus consistency/durability, source of truth, read/write visibility, partitions/degraded authority, delivery/order/deduplication, clock/lease assumptions, CAS/locks, idempotence, retry/timeout, partial failure, reconciliation |
| Security-sensitive host | trust model, authorization, credentials, path/process/network, unsafe defaults, containment |
| Published package/plugin | dependency/supply chain, generated/built artifact parity, install/update/rollback, provenance |
| UI/server host | protocol/lifecycle, trust/sandbox, browser/origin controls, backpressure, disconnect/replay |

Paper-test the profile mechanism against one simple pure library and one stateful/distributed adapter before approving a new template version. Orphan checklist items that map to neither an obligation nor an applicable risk are removed.

## 4. Target freeze and system model

### 4.1 Target identity

Record exact SHA/version, branch/tag, dirty state, runtime/toolchain, lockfile/dependency state, build channel, generated inputs, artifact digest/contents, and evidence date. If target bytes change, invalidate or explicitly historical-label affected evidence.

### 4.2 Purpose-to-authority trace

Use the domain model graph:

`purpose -> capability -> surface -> [adapter/orchestrator]* -> authority+`

Adapter/orchestrator roles may be absent; authorities may be plural with owned responsibilities. State/resources are governed by named authorities, while dependencies and boundaries can attach throughout the graph. Cross-boundary invariants identify one semantic owner plus enforcement/agreement at irreducible points.

Create a table with one row per material capability:

| Capability/obligation | Source | Public surfaces | Authority/authorities and owned responsibilities | State/resources/dependencies/boundaries | Success/error/resource contract | Failure/containment/recovery | Verification |
|---|---|---|---|---|---|---|---|

Inventory trust/process/package/persistence/representation boundaries, external effects, state stores, and resources. A claim that an authority is canonical requires a bounded inventory of every writer/interpreter and alternate public path.

### 4.3 Change and failure models

- Trace applicable representative changes: a routine feature change, a cross-cutting contract change, and a failure-policy change. Count independent decisions and authorities, not only touched files; mark an absent change class N/A with rationale.
- For stateful/workflow targets, model at least one read and one mutation/workflow across preconditions, validation, irreversible effects, commit point(s), receipt, interruption, cleanup, retry, and recovery. For pure/stateless targets, model one representative operation and error path and mark inapplicable state-transition fields N/A.

## 5. Evidence protocol

### 5.1 Evidence sources, conclusion basis, and grades

Record orthogonal dimensions rather than one mixed label:

- evidence source/method: `static source`, `test/gate`, `runtime probe`, `measurement`, or `historical record`;
- conclusion basis: `reasoned`, `empirically reproduced`, `machine-enforced`, or an explicitly named combination.

- **E0:** pattern/hypothesis without complete causal trace; candidate only.
- **E1:** exact revision-bound references plus complete causal trace, contract, reachability, assumptions, limitations, and counterevidence search.
- **E2:** E1 plus deterministic bounded reproduction, fault injection, targeted red probe, regression test, or artifact-level probe with expected/observed result.
- **E3:** E2 independently reproduced or enforced by a stable automated gate on the exact revision/artifact.

All published findings require E1. Critical/high findings should reach E2 when a safe probe is possible; otherwise record why, lower confidence if warranted, and require independent cross-review. A green gate proves only the states and artifact it actually exercises.

Empirical records name command/probe, cwd, runtime/platform, target SHA/artifact, exact exit status/result, controls, cleanup, and limitations. Historical evidence is never presented as current without revalidation.

Negative/exclusive claims use class-specific evidence. `missing`, `only`, and `canonical` name the search universe, surfaces/writers/interpreters, alternate mechanisms, and dynamic registration checked. `dead` and `unused` additionally cover build/generated/runtime/public-contract and migration reachability. `unbounded` resource/latency claims trace a reachable input to allocation/wait and show that no governing bound, backpressure, cancellation, or lifecycle limit intervenes.

### 5.2 Assurance disposition

For each applicable obligation use: `meets declared contract within stated evidence bounds`, `survived sampled probes`, `concern`, `material gap`, `not applicable`, or `not assessed`.

Every positive disposition cites the exact bounded obligation, evidence grade, scope, and residual limits. Reserve `proven` for an explicitly bounded property with a stated proof oracle and normally E3 machine enforcement.

Tests/assurance may additionally use `strong`, `partial`, `indirect`, `absent`, or `unknown` per requirement. Unknown is not absent and neither is averaged away.

### 5.3 Finding schema

Each finding includes:

- ID/status/title/category and violated obligation/invariant;
- exact target revision/artifact and affected capabilities/surfaces;
- owning architectural cause; symptoms grouped beneath it;
- trigger/prerequisites/actor or failure condition; boundary and causal trace;
- expected versus observed behavior;
- impact, exposure/likelihood, blast radius, detectability, recoverability;
- evidence sources, conclusion basis, grade/references, and positive/negative controls;
- counterevidence, false-positive alternatives, uncertainty, dissent;
- severity/consequence with rationale;
- confidence with rationale;
- action priority/horizon with rationale;
- recommendation at the correct owning layer, deterministic validation strategy, remediation risks, and residual risk;
- disclosure lane.

Candidate statuses: candidate, confirmed, refuted, accepted risk, fixed pending validation, fixed/validated, or not applicable.

### 5.4 Severity, confidence, priority

Severity anchors:

- `critical`: low-complexity compromise or fault with broad catastrophic confidentiality, integrity, availability, authority, or unrecoverable destructive impact;
- `high`: substantial unauthorized access, boundary escape, credential compromise, destructive integrity loss, or major reliability failure under feasible conditions;
- `medium`: meaningful bounded impact, significant prerequisites/user interaction, unsafe default, material recoverable data/availability loss, or reliable supported-mode denial of service;
- `low`: limited concrete impact, difficult prerequisites, localized recoverable failure, or defense-in-depth weakness with a real property at stake;
- `informational`: hardening/clarity/opportunity without demonstrated security, correctness, or reliability impact.

Classify using concrete impact, exposure, prerequisites, persistence, blast radius, detectability, and recoverability. Do not lower severity because confidence is low.

Confidence: `high` (complete path/no material unknown, normally E2/E3 or convergent evidence), `medium` (strong path with one material unresolved assumption), or `low` (plausible/partial trace with substantial uncertainty).

Priority is independent: `now`, `next`, `planned`, `monitor`, or `no action`, considering harm, reachability, detectability, change frequency/amplification, remediation leverage/cost, confidence, and residual risk.

### 5.5 Survived attacks and refutations

Record survived probes beside findings: hypothesis, targeted invariant/boundary, exact scope, method, controls, safe observed behavior, evidence grade, and residual coverage limits. Refutations cite the invalidated premise/evidence and remain searchable; they are not silently deleted.

## 6. Review modules

### 6.1 Purpose, requirements, and scope coherence

- Do implementation and public promises serve the scope authority and current users?
- Are capabilities, non-goals, supported modes, and quality attributes explicit?
- Are recommendations proportionate to the cost of inaction and inside scope?
- Do public docs/help/generated references agree with reachable behavior?

### 6.2 Domain model, cohesion, coupling, and SOLID

- Is domain vocabulary stable across code, outputs, docs, tests, and adapters?
- Does each module/authority group one set of invariants and reasons to change? Large files and fan-in/fan-out are signals, not findings.
- Assess compile-time, runtime, data/schema, temporal/order, operational/environmental, capability/permission, and cognitive coupling.
- **SRP:** identify actual invariant/reason to change; do not equate size with responsibility.
- **OCP:** require a demonstrated variation axis before adding abstraction.
- **LSP:** where implementations are interchangeable, test semantic values, errors, ordering, side effects, idempotence, concurrency, timing, and resources—not type shape alone.
- **ISP:** consumers depend only on needed cohesive capabilities without gratuitous micro-interfaces.
- **DIP:** high-level policy depends on domain-shaped stable boundaries; dependency injection is justified by ownership/variation/fault control, not mockability alone.
- Do dependency directions follow stability and authority, including ambient filesystem/environment/process dependencies?
- Are semantic authorities owned once and projections derived/agreement-tested?
- Do representative changes expose semantic duplication or merely legitimate projection fan-out?

### 6.3 API, compatibility, and error contracts

- Are preconditions, outputs, side effects, ordering, commit points, postconditions, resource bounds, and retry semantics observable?
- Can callers distinguish absent, invalid, conflict, unauthorized, transient, partial, internal, no-op, and success outcomes where recovery differs?
- Are raw-byte/protocol channels protected from diagnostics?
- Are compatibility/version-skew/migration/deprecation policies explicit for persisted data, protocols, config, generated artifacts, and external consumers?
- Are shared contracts tested through one owning primitive plus every irreducible public projection?

### 6.4 Security and trust boundaries

Create an asset/actor/trust-boundary/privileged-sink/invariant inventory and an entrypoint matrix tracing:

`source -> parse -> canonicalize -> validate -> authorize -> side effect -> output`

Declare the bounded universe of externally influenced entrypoints, actor capabilities/principals, trust states/boundaries, alternate public adapters, and privileged sinks before sampling. Every reachable source-to-sink path must be traced and dispositioned or placed in a justified equivalence class whose members share the same authority and controls. Unassessed applicable material rows force an `incomplete` verdict.

Required domains, each dispositioned:

1. input validation, encoding, ambiguity, size, and one correct canonicalization domain;
2. filesystem/path containment after canonical resolution, permissions, links, pre-existing targets, atomic create/replace/delete, and check/use races;
3. subprocess executable resolution, argument vectors, flag injection, inherited PATH/env/cwd/fds, signals, timeouts, output bounds, cleanup;
4. network activation, URL/scheme/userinfo/redirect/proxy/TLS, bind/Host/Origin/CORS/CSRF/token controls, limits, cancellation, retry/replay;
5. credential creation, location/modes/scope/precedence/transport/revocation/deletion and redaction from every channel;
6. authentication principal and authorization owner, default deny, target/action/version/exact-byte binding, capability expansion, stale grants, confused deputy, revocation/revalidation;
7. TOCTOU, CAS/lock scope/ownership, multi-process behavior, ABA/replacement, bounded re-read/re-decide retries, crash leftovers;
8. unsafe defaults, explicit network/publication/destructive opt-in, least authority, malformed/degraded config, fail-open/closed choices;
9. denial-of-service/resource bounds before allocation/parsing, slow peers/children, queues/backpressure/cancellation/cleanup;
10. dependencies, lockfile/lifecycle scripts, generated/vendored artifacts, workspace-to-package boundary, tarball allowlist, runtime dependency claims, provenance/update/rollback;
11. disclosure triage before public persistence.

Security probes use disposable scratch state, synthetic credentials, positive/negative controls, and never production or third-party targets.

### 6.5 Reliability, fault tolerance, and recovery

- For each material mutation/workflow, identify state, validation, external reads, decision, irreversible effects, commit, receipt, and cleanup; inject/reason about faults at each window.
- Define intent identity and exact replay, retry-after-unknown-outcome, deduplication, bounded retry/deadline/backoff, and preservation of full caller intent.
- Define atomic observer/unit; verify CAS/version binding, partial receipts, compensation/resume, and revalidation at commit.
- Analyze lost updates, stale reads, TOCTOU, ABA, lock ordering/deadlock/starvation/leakage, and the true concurrency domain (call/event loop/process/user/host/filesystem/remote).
- Bound network/process/lock/watch/filesystem waits; propagate cancellation and clean owned resources truthfully.
- Handle crash/corruption/orphaned temp/stale cache/missing owner/version-skew; recovery reconstructs from durable authority and cannot bypass refusal.
- Isolate faults and destructive targets; degraded operation must not broaden target or authority.
- Emit actionable, bounded, secret-safe outcomes distinguishing success, no-op, degradation, partial work, retryable failure, and terminal failure.
- For stateful/distributed targets, state applicable consistency and durability guarantees, source(s) of truth and split-state authority, read/write visibility, partition/degraded-mode behavior, delivery/order/deduplication semantics, and clock/lease assumptions.

### 6.6 Tests, coverage relevance, and testability

Produce four connected artifacts:

1. classified test inventory with exact gate reachability;
2. requirement-risk-test matrix with residual gaps;
3. architectural testability/side-effect-seam assessment;
4. prioritized test gaps and false-confidence/survived-attack records.

For each material assurance claim record requirement/risk/surface, test level, exact test/gate, oracle, real/fake boundary, negative/fault dimensions, environment, sensitivity evidence, coverage quality, and residual risk.

- Classify pure unit, component, adapter integration, contract, agreement/parity, subprocess CLI, E2E journey, package/install, migration/compatibility, operability/recovery.
- Verify test discovery/globs/build prerequisites/skips; a matching test file or green command does not prove reachability.
- Judge meaningful oracles and inputs; reject assertion-free, type/boolean-only, “did not throw,” broad status-only, unreviewed snapshot, and mock-copy evidence unless that is the whole contract.
- Allocate by risk: owning-layer decision tests, real boundary integrations, agreement tests for projections, a small set of user journeys.
- Assess seams for controlled inputs/faults/observation/cleanup and real-boundary proof. Avoid dependency injection solely for mocks.
- Review deterministic temp/ports/env/cwd/clock/randomness, parallel safety, cleanup, fixtures/goldens provenance, contract-checked fakes, and interaction-vs-outcome assertions.
- Cover filesystem, subprocess, network, package/install, lifecycle, concurrency, and time faults as applicable; every fault test asserts both failure outcome and post-failure state.
- Use branch coverage as a decision map, mutation testing as named survivor evidence, and property tests for grammars/state invariants—not scalar targets.
- Audit flakes, retries, quarantine, duration/resource outliers, omitted globs/skips, stale artifacts, masked exit statuses, shared globals, and source-vs-shipped-artifact gaps. Any quarantine records the unprotected contract/risk, owner, issue, expiry, and replacement plan.
- For high-risk contracts, strong assurance normally needs owning-layer evidence, one real public boundary, relevant negative/fault behavior, and proof the test turns red when the contract breaks.

### 6.7 Performance and resource behavior

- Establish promised input/concurrency bounds before judging.
- Analyze complexity, materialization/streaming, remote round trips/batching, output caps, decompression/expansion, regex/parser behavior, caches, queues, descriptors, processes, sockets, timers, watchers, and temp disk.
- Require representative measurement or direct complexity/resource proof; intuition, LOC, or a fast happy path is not enough.
- State tradeoffs where slower behavior buys atomicity, correctness, or containment.

### 6.8 Operability, observability, and human/agent legibility

- Can an operator identify target, outcome, partial work, retryability, evidence, and next action without replaying full logs?
- Are stop/cancel/redirect controls real and exercised for unattended or long-lived work?
- Are logs/envelopes/receipts/metrics consistent, correlated, bounded, progressively disclosed, and secret-safe?
- Are degraded-but-not-erroring states (stale/truncated/partial/time-boxed) visible?
- For agent-human systems, do session handoffs, attribution, confidence/provenance, and error-propagation checkpoints prevent stale or wrong conclusions becoming silent premises?

### 6.9 Build, dependencies, distribution, and portability

- Are direct/transitive dependencies necessary, pinned, auditable, and aligned with license/supply-chain policy?
- Do build/generation/drift gates prove exact inputs and artifacts without hidden workspace/source-tree leakage?
- Does the exact installed artifact work in clean/offline/supported runtime environments with both documented entry points?
- Are package contents, executable modes, runtime dependencies, source maps/secrets, version/manifests, update behavior, rollback/revocation, and provenance correct?
- Test supported OS/filesystem/path case/separators/symlinks, locale/timezone/encoding, permissions, temp/home/config relocation, shell/PATH/cwd/TTY/network assumptions as applicable.

### 6.10 Maintainability, documentation, dead code, and simplification

- Can a new maintainer locate purpose, entrypoint, authorities, invariants, state, failure behavior, and tests through progressive disclosure?
- Do stable non-obvious reasons live near code while transient review history stays outside it?
- Are generated/public docs tied to one source or agreement-tested?
- Are configuration precedence, migrations/deprecations, and dependency ownership explicit?
- Review navigation via a representative change task rather than subjective impressions.

Dead-code/deletion claims must:

1. bound source, dynamic imports/registries, build scripts, package exports, generated assets, docs/commands, tests, and external compatibility;
2. trace build/runtime/public reachability and historical migration obligations;
3. identify deletion benefit (authority/state/branch/dependency/cognitive/build cost removed);
4. name tests/docs/artifacts removed atomically and a red/acceptance check.

Elegance means the minimum authorities, state transitions, translations, and concepts needed for the contract. Options include delete, collapse into the authority, inline a proven one-off, parameterize a demonstrated variation, isolate compatibility, or preserve intentional redundancy for stated reliability/security reasons.

## 7. Cross-cutting matrices and probes

The final review includes each applicable artifact below, inline or linked; every omitted artifact carries an explicit N/A rationale:

- capability/surface/authority/contract/evidence trace;
- boundary/entrypoint/privileged-sink security matrix;
- requirement/risk/test/oracle/residual-gap matrix;
- mutation/workflow failure timeline for stateful/workflow targets, or representative operation/error timeline for pure/stateless targets;
- representative change-amplification traces;
- dependency/authority map and any cycles/ambient dependencies;
- negative/exclusive-claim audit;
- survived attacks, refutations, limitations, and dissent.

Probe selection is risk-driven. Prefer bounded deterministic scratch probes with positive and negative controls. Re-run a sampled subset of existing gates and one representative red probe instead of rebuilding every assurance claim without cause.

## 8. Synthesis and recommendation rules

- Deduplicate only when owner, violated obligation/invariant, and causal mechanism are materially the same. Use owner as a grouping field, not a uniqueness key; one authority may have multiple distinct findings.
- Preserve distinct domain impacts, counterevidence, and minority positions.
- Distinguish correctness/security findings from reliability risk, maintainability debt, and optional simplification.
- Recommend the smallest targeted intervention that moves enforcement to the correct owner or improves a material feedback loop.
- Every recommendation names intended owner/layer, observable acceptance criterion, test/probe level, rollout/compatibility risk, and residual risk.
- A review may legitimately conclude with no material findings.

## 9. Approval gate for the template

A reusable template version is approved only when:

- security, testing/testability, architecture/design/reliability, and skeptic reviewers assess the exact version;
- every core/profile module has applicability semantics and N/A rationale;
- forward/reverse traceability, representative applicable change, applicable failure/operation timeline, semantic substitution, negative-claim, symptom/cause, dissent, progressive-disclosure, cross-project profile, stopping, and proportionality tests pass;
- evidence grades, finding schema, severity/confidence/priority separation, counterevidence, amendment handling, revision drift, and private disclosure are frozen;
- no blocking reviewer finding remains. Approval is version-specific.

## 10. Post-use retrospective

After each substantial use, record review cost, fields that changed a decision, uniquely found defects, false positives, omissions, duplicated work, and disagreements. Promote validated improvements and retire fields that repeatedly add no decision value. The template is a versioned hypothesis, not a checklist that may only grow.

[uses domain model](../research/architecture-review-domain-model.md)

[governed by plan](../plans/cli-architecture-review.md)

[supports task](../tasks/cli-architecture-review.md)
