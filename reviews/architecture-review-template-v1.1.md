---
type: Doc
title: Reusable architecture review template v1.1
actor: review-method-builder
timestamp: '2026-08-08T15:00:41.223Z'
---
# Reusable architecture review template v1.1

Template version: `1.1`  
Approval is version-specific and recorded in a separate Review that names this document's exact head version. This draft is not approved until that gate passes.  
Derived from frozen template v1.0 at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`; v1.0 remains unchanged and approved for its historical uses.  
Domain model: `research/architecture-review-domain-model`

## Method card (read first)

- **Purpose:** produce an evidence-bound architecture verdict whose scope, subject, limits, and
  resulting work remain durable and independently reviewable.
- **Use:** select an applicability profile, freeze the target and evidence cutoff, model the system
  and threat/requirement universe, investigate applicable modules, synthesize findings, and pass
  specialist, skeptic, and QA gates.
- **Report-first rule:** every filled review report begins with its completed **Decision card** as
  the first body section, before record-topology or method detail, so a reader can orient in 30–60
  seconds.
- **Record model:** ordinary open-world OKF documents and links; the Review Kind requires only a
  title. Optional metadata aids interoperability but is not identity, authorization, or currentness
  authority.
- **Stopping authority:** one review-authored coverage ledger with stable local IDs; mechanical
  closure proves only disposition of that declared ledger, while universe completeness remains a
  reasoned claim challenged by specialist and skeptic review.
- **Safe degradation:** missing applicability, classified succession, complete pagination, or query
  results suppresses completeness and effective-verdict claims; ambiguity is shown, never guessed.
- **Version gate:** approval is exact-version-specific and follows builder, specialist/security,
  testing/testability, architecture/reliability, skeptic, and independent QA review.

## 0. Reviewed artifact graph and open-world record contract

An architecture review is a graph of ordinary OKF records, not a mandatory monolithic document or
closed registry:

Semantically, a synthesis Review is reachable from its request, supporting evidence, findings,
later conclusions, and resulting work. Stored links need not point in that visual direction: a
later successor is immutable and therefore points **outbound to its exact immediate predecessor**;
the predecessor discovers later records through derived backlinks.

| Artifact | Role |
|---|---|
| `Review Request` | A named-human request lifecycle. It is not an agent Review synthesis. |
| canonical `Review` | The stable family root and durable overall verdict for a frozen target/evidence line. |
| specialist `Review` or Context Note | Domain assessment or phase evidence; link the canonical synthesis when one exists. |
| `Finding` | One atomic evidence-backed claim and disposition, reachable from the synthesis. |
| approval/addendum/rereview `Review` | Exact-byte approval or immutable later evidence/conclusion layer. |
| `Task` / `Decision` / `Claim` | Work, adopted choice, or lifecycle assertion produced by the review. |
| external report/PR | Source evidence named by URL plus commit/blob/digest; never silently treated as the bundle's canonical record. |

### 0.1 Optional metadata, identity, and verdict subject

The Review Kind requires only `title`; all other metadata is open-valued and optional so sparse,
legacy, and externally authored OKF records remain valid. New Reviews should use the following when
applicable, without treating the suggested values as an enum:

- record lifecycle `status` (for example `draft`, `in_review`, or `final`);
- record `role` (for example `synthesis`, `specialist`, `approval`, `addendum`, `rereview`);
- `verdict` plus mandatory-in-v1.1 prose/frontmatter `verdict_subject`, explicitly distinguishing a
  judgment about the target, Review artifact, repair, plan, or other named subject;
- optional `family` routing hint for a multi-record family;
- primary `target`, `target_version`, `evidence_cutoff`, `template_version`, and record steward
  `owner`.

Artifact approval never implies approval of the reviewed target. A conditional verdict maps to
blocking or non-blocking language based on its actual conditions; `approved_with_caveats` carries no
mandatory pre-acceptance repair.

Imported or external lifecycle values, including `superseded`, remain visible but are never
currentness or approval authority. `approved` belongs in `verdict` with a named subject; `applied`
belongs in linked remediation/work evidence. `actor`, `owner`, reviewer, assignee, and similar
identity metadata are attribution or coordination hints unless a separate authenticated system
proves identity and authority; the OKF fields themselves never grant it.

A method-authored Review with a verdict but no `verdict_subject` cannot be `final` and is reported
as incomplete. Sparse, legacy, and externally authored Reviews remain valid OKF content. Unknown
imported fields and values are preserved on unrelated updates. Kind-aware `doc update` rejects
authoring undeclared field names: evolve the local convention or use raw-document promote/CAS for a
new structured field rather than assuming arbitrary flags are portable.

### 0.2 Classified succession, stable root, and effective terminus

Plain relative Markdown links are the relationship authority. A `family` value is only a routing
hint. A standalone Review needs neither a family hint nor a family root beyond itself. Supporting
Reviews may link the synthesis for navigation, but only an **explicitly classified succession
edge** participates in target-verdict currentness.

For this method, a conforming successor:

1. points outbound to its exact immediate predecessor with the recommended explicit link label
   `succeeds review` and targets that predecessor's exact Review document;
2. repeats the applicable target/evidence line—target identity and version/digest, evidence cutoff
   or evidence class, and any applicable multi-target row ID; and
3. carries a target-level `verdict_subject` and explicit verdict when it enters or changes that
   target-verdict chain.

A project may use another succession label only when the successor or filled report explicitly maps
that exact label to the succession role and declares the same successor-to-predecessor direction.
This author-declared relationship profile is ordinary OKF content, not a closed Kind enum. Unknown
relations remain visible but unclassified. `part of review`, approval, support/evidence, navigation,
and unknown relations never enter the classified target-verdict succession subgraph; a record using
one of them enters only through a separate classified succession edge meeting all three rules.

Within one exact target/evidence line, the **stable root** is the classified node with no outbound
succession edge to a predecessor. Because stored edges run successor to predecessor, the
**effective terminus** is the unique applicable node with no inbound classified successor backlink.
Do not rewrite frozen predecessors or use `status: superseded`. A node with multiple classified
predecessors, a predecessor with multiple applicable successors, a cycle/self-edge, missing or
conflicting target/evidence applicability, conflicting label mappings, or more than one possible
root/terminus makes currentness `unknown`, `ambiguous`, or `incomplete`. Never choose by arbitrary
links, `family`, type, role, path, title, status, timestamp, or link direction alone.

### 0.3 Multi-target and cross-revision provenance

`target` and `target_version` identify the primary target only. When evidence spans source commits,
built artifacts, external report revisions, repairs, or later current-main investigations, add a
table naming every target/evidence class, exact revision or digest, chronology, conclusion supported,
and whether it is a frozen current bundle head, mutable current head, or historical digest citation.
Never flatten distinct revision classes into one misleading version.

### 0.4 Thin-wrapper test for frozen legacy records

Create a thin canonical Review wrapper only when all five are true:

1. the source freezes a bounded architecture/design target or exact revision;
2. it issues the overall reusable verdict rather than a specialist, QA, implementation, or handoff verdict;
3. the verdict should remain independently discoverable after the originating task/session;
4. no canonical Review synthesis is reachable through the live graph; and
5. a wrapper improves discovery without copying findings, inventing authority, or creating work.

A wrapper contains decision/provenance/navigation only. It links exact source bytes and preserves
chronology; substantive findings stay in the frozen source. It is a deterministic projection, not a
new interpretation: name every exact source revision/digest, copy the source verdict and
`verdict_subject`, record any structure-preserving categorical mapping, and state explicit source
precedence. Source bytes prevail on disagreement. Multiple source verdicts must agree under the
declared mapping; conflict or a mapping that needs substantive judgment yields `incomplete` and
requires a newly reviewed synthesis rather than a thin wrapper. Title, prefix, and filename never
decide classification.

### 0.5 Runtime non-authority and unfamiliar OKF content

An optional migration or classification inventory is disclosure-screened audit evidence, not a
family registry. Runtime portfolio Views must derive classification, family grouping, Review and
Review Request rows, and rendered verdict/navigation from live documents and graph edges, with the
same portfolio results if an inventory is absent or deleted. Deleting an ordinary inventory may
still change generic whole-bundle queries and link resolution; that is outside this scoped oracle.
They preserve unknown fields, values, relation labels, and target types. Minimal Reviews, Reviews
outside the preferred prefix, dangling targets, partial queries, and capped results remain visible
with honest unknown/ambiguous/incomplete markers. No project id, package name, known family, title
keyword, filename stem, or timestamp may become hidden runtime authority.

Caps use pagination until eventual visibility, or disclose `shown`, `total` (or unknown), and
`truncated`/`incomplete` plus a next action. Rows omitted by a cap are not mislabeled unresolved;
`unresolved` is reserved for present graph references whose target cannot be resolved. A partial
query preserves bounded returned data but suppresses portfolio-completeness and effective-verdict
claims.

## 1. Decision card

Every filled review report puts this completed card first. It must let a new reader answer within
30–60 seconds:

- **Target:** component/package/project, exact source revision, branch/tag, clean-state provenance, runtime/platform, built/distributed artifact identity.
- **Purpose and scope authority:** why the target exists; authoritative goal/spec; explicit non-goals and frozen work.
- **Review lifecycle and coordination:** `draft`, `in_review`, or `final`; owner/reviewers and dates
  as advisory attribution; evidence cutoff; target drift since cutoff.
- **Record identity:** synthesis/supporting role, optional family hint, canonical link when applicable, and template version.
- **Applicability profile:** library, CLI/process, stateful, concurrent/distributed, security-sensitive, published package/plugin, UI/server, or other.
- **Verdict and subject:** approved, approved with caveats, changes recommended, changes required, incomplete, or another explicit value—plus whether it judges the target, report bytes, repair, plan, or another named subject.
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
- one review-authored coverage ledger, inline or linked, as the stopping authority. Give every item a
  stable local ID, source/rationale, applicability, disposition, evidence reference, and open
  blocker/residual risk; other matrices project or reference these IDs rather than becoming
  competing coverage authorities; and
- stopping rule: freeze the material capability/risk universe from the purpose, system, threat, and
  requirement models before implementation review. Mechanical closure means every row in the
  declared ledger is dispositioned and every applicable material gap is reflected in the verdict.
  This proves internal closure only; completeness of the declared universe is a reasoned claim
  challenged by independent specialist and skeptic review. Newly discovered material risks amend
  the ledger visibly and are dispositioned before completion. Finding count is never a completion
  metric.

Before **any** public persistence—including Context Notes, Tasks, artifacts/blobs, inventories,
wrappers, Findings, Reviews, and View projections—triage each security issue. If exploitable by
someone other than the victim and present on a publicly released revision (including `main` where
`main` is the release channel), route technical detail privately and keep only a redacted routing
note in public records. If exploitability or public-release applicability is unresolved, default to
the private lane until triage resolves it. A wrapper never republishes source mechanics merely to
improve navigation.

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

## 9. Method review and portability QA gate

Changing this reusable method is its own reviewed unit:

1. a builder produces one exact candidate without changing an approved predecessor;
2. security, testing/testability, architecture/design/reliability, and skeptic reviewers inspect the
   exact bytes from distinct roles;
3. the builder resolves blockers and reviewers re-review the exact repaired candidate;
4. independent QA exercises the candidate and convention in a disposable bundle; and
5. an approval Review names the exact candidate, source template, reviewer evidence, and QA evidence.

Scratch QA runs with and without the Review convention and with and without an optional migration
inventory. Its fixture matrix includes a minimal `{type: Review, title}` outside the preferred
prefix; unknown imported fields, values, statuses, and relations; unfamiliar target types; an
explicit succession mapping and successor-to-predecessor link; approval/support leaves; competing
successors; multiple predecessors; cycles/self-edges; missing target/evidence applicability;
dangling targets; HTML-like metadata; caps; partial query failure; and live add/update/delete.

Assert that present records and edges remain visible or explicitly unresolved/ambiguous; no
title/timestamp/folder/status/family inference occurs; inventory deletion leaves Review-portfolio
classification, family grouping, Review/Review Request rows, and rendered verdict/navigation
unchanged; and `new "Review"` creates a minimal Review under `reviews/` when the convention is
present. Without the convention, generic OKF import/promotion remains supported even though
kind-aware `new "Review"` is unavailable. A known-field update preserves an imported unknown field,
while authoring a new undeclared field through kind-aware update is expected to fail until the
convention evolves or raw-document promote/CAS is used.

For caps, exhaust pagination and assert eventual visibility, or require honest `shown`,
`total`/unknown, `truncated`/`incomplete`, and a next action; omitted rows are not called unresolved.
Injected partial failure preserves returned bounded data but suppresses completeness and
effective-verdict claims. Succession assertions operate only on explicitly classified edges and
fail closed for ambiguity, cycles, competing successors/predecessors, or missing applicability.

## 10. Approval gate for the template

A reusable template version is approved only when:

- security, testing/testability, architecture/design/reliability, and skeptic reviewers assess the exact version;
- every core/profile module has applicability semantics and N/A rationale;
- forward/reverse traceability, representative applicable change, applicable failure/operation timeline, semantic substitution, negative-claim, symptom/cause, dissent, progressive-disclosure, cross-project profile, stopping, and proportionality tests pass;
- evidence grades, finding schema, severity/confidence/priority separation, counterevidence, amendment handling, revision drift, and private disclosure are frozen;
- no blocking reviewer finding remains. Approval is version-specific;
- the open-world convention requires only title, declares no closed enums/links/headings, and does
  not invalidate sparse or unfamiliar OKF records;
- the five-part wrapper test, stable-root/effective-terminus semantics, verdict subject, multi-target
  provenance, disclosure preflight, and inventory non-authority rules survive specialist review; and
- the scratch portability matrix passes with exact commands and residual limitations recorded.

## 11. Post-use retrospective

After each substantial use, record review cost, fields that changed a decision, uniquely found defects, false positives, omissions, duplicated work, and disagreements. Promote validated improvements and retire fields that repeatedly add no decision value. The template is a versioned hypothesis, not a checklist that may only grow.

[uses domain model](../research/architecture-review-domain-model.md)

[derived from frozen v1.0](architecture-review-template.md)

[governed by alignment plan](../plans/architecture-review-record-alignment.md)
