---
type: Plan
title: OKF extension-evolution architecture review plan
actor: codex-standards-po
timestamp: '2026-08-05T22:35:08.656Z'
---
# Decision card

- **What this is:** the execution and evidence contract for a multi-agent standards/architecture review.
- **Current state:** domain model ready; standards research and local option design can now diverge independently.
- **Next:** complete both specialist contracts, synthesize against one matrix, then submit the exact recommendation to adversarial review.
- **Blocking:** none. Upstream #272 may remain unanswered; the plan requires a local decision path under uncertainty.
- **Entry point:** parent task `tasks/okf-extension-evolution-architecture`; specialists claim their named Task docs with distinct actors.

# Purpose and goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: produce a standards-grounded, adversarially reviewed extension-evolution recommendation that turns future OKF collisions into a predictable governance and migration process.

The workflow deliberately separates a **divergent phase** (standards evidence and local architecture options developed independently) from a **convergent phase** (one explicit synthesis matrix), followed by an independent adversarial gate. The [shared domain model](../research/okf-extension-evolution-domain-model.md) is the vocabulary contract, not a preferred solution.

# Team and specialist contracts

## S1 — standards evolution researcher

- **Task:** [research evolution patterns in FHIR and comparable standards](../tasks/okf-extension-evolution-standards-research.md).
- **Input boundary:** shared domain model; upstream OKF specification/issues; no access to the architecture-options agent's recommendation before submitting the first complete evidence artifact.
- **Mandatory cases:**
  - FHIR: extension identity, `modifierExtension`, profiles/`StructureDefinition`, canonical/version handling, unknown extension behavior, compatibility/conversion across releases, and implementer obligations.
  - At least three useful comparators chosen for distinct mechanisms, with preference for OpenAPI specification extensions, Kubernetes API groups/versions and CRD conversion, JSON Schema dialect/vocabulary identifiers, XML namespaces, or another mature standard justified by relevance.
  - OKF's actual current extension/profile/version language, including issues #212, #239, #240, and #272 where relevant; distinguish merged normative text from open proposals/discussion.
- **Output:** `research/okf-extension-evolution-standards-patterns` (`type: Research`).
- **Required structure:** source/edition table; per-standard mechanism; implementer evolution workflow; failure modes; cross-standard pattern table; applicability and non-applicability to markdown/YAML OKF; unresolved questions; confidence.
- **Completion test:** every claimed mechanism has primary-source support; every agentstate-lite takeaway is labeled inference; at least one tempting analogy is explicitly rejected as inapplicable or too costly.

## S2 — extension architecture options designer

- **Task:** [design OKF and Kind extension-evolution options](../tasks/okf-extension-evolution-architecture-options.md).
- **Input boundary:** shared domain model, current audit/design, relevant source/code contracts, and current OKF text. The first option set must be produced without consuming S1's conclusions, preserving independent framing.
- **Mandatory option families (may be combined, but not silently):**
  1. current unqualified top-level fields plus diagnostics/collision registry;
  2. prefixed wire keys;
  3. nested extension envelope with stable identifiers;
  4. qualified Kind and/or field identities;
  5. profiles and profile declarations;
  6. logical-to-serialized mappings selected by standards/profile version;
  7. explicit version-aware migration and compatibility registry;
  8. a minimal “do not standardize an extension mechanism yet” posture as the cost baseline.
- **Output:** `designs/okf-extension-evolution-options` (`type: Design`).
- **Required structure:** normalized option cards; composition assumptions; generic-unaware-consumer behavior; mapping across all collision classes; new-authoring and installed-base migration; offline/registry behavior; governance; implementation seams; tradeoffs; falsifiers.
- **Completion test:** each option is represented in its strongest reasonable form; no option relies on value guessing, indefinite dual truth, or an unavailable online authority; combinations name which component solves which collision class.

## S3 — product/standards synthesizer (parent orchestrator)

- **Task:** [define an evolution-safe OKF extension architecture](../tasks/okf-extension-evolution-architecture.md).
- **Inputs:** exact S1 and S2 artifacts plus the shared model and existing empirical audit. Record their document versions before synthesis.
- **Output:** `designs/okf-extension-evolution-recommendation` (`type: Design`) and, if a durable choice is made, a separate Decision doc or clearly labeled decision section per parent judgment.
- **Required contents:** recommendation in one page before detail; invariants; selected and rejected mechanisms; collision-class playbook; declared compatibility matrix; field/Kind/profile identity model; migration state machine; governance; phased adoption; upstream asks; risks; non-goals; test/validation implications; explicit remaining human decisions.
- **Completion test:** the decision can be applied to a novel hypothetical collision without founder interpretation, and the recommendation identifies at least one insight produced by combining S1 and S2 rather than simply selecting one artifact.

## S4 — independent adversarial reviewer

- **Task:** [adversarially review the exact recommendation](../tasks/okf-extension-evolution-adversarial-review.md).
- **Independence:** do not participate in S3 drafting; review the exact persisted recommendation version, not a summary.
- **Output:** `reviews/okf-extension-evolution-recommendation` (`type: Review`) with verdict `PASS`, `FAIL`, or `CONDITIONAL`, finding severity, empirical/reasoned label, attack transcript, survived attacks, and required repairs.
- **Completion test:** no unresolved high-severity finding; any repair receives exact re-review before parent acceptance.

# Dependencies and phase transitions

1. **Orient/model — complete when reviewed for usability:** domain model and this plan are persisted.
2. **Diverge:** S1 and S2 run independently in parallel from the shared model. Neither waits for the other.
3. **Cross-read/refine:** after both initial artifacts are frozen with versions, S1 annotates architecture misuse of standards evidence and S2 annotates applicability constraints or uncovered option consequences. Corrections are incorporated with change notes; convergence is now explicit.
4. **Synthesize:** S3 builds the collision-by-mechanism matrix and decision record using the method below.
5. **Review:** S4 attacks the exact S3 artifact. FAIL/CONDITIONAL with required repairs routes to S3 repair and exact re-review.
6. **Close:** parent updates the parent Task with outcome, links, caveats, and next implementation/upstream units. This architecture review does not itself modify source code or migrate bundles.

No downstream conclusion should treat an unreviewed specialist inference as normative. Source claims and local design inferences remain separately labeled through synthesis.

# Synthesis method

## Step 1: normalize evidence

Create an evidence ledger with columns: claim ID, standard/edition, normative strength (`MUST`, `SHOULD`, permitted, descriptive), primary source, exact section, publication/status/date, specialist inference, confidence, and downstream decisions that depend on it. Open proposals and issue comments cannot be promoted to normative rules.

## Step 2: normalize options

Represent each option or explicit composition with the same card:

- semantic and wire identity;
- declaration/discovery path;
- generic unaware-consumer behavior;
- ownership/precedence/conflict rule;
- version and dependency pinning;
- offline/unavailable-registry behavior;
- behavior for read, preserve, validate, create, mutate, migrate, and export;
- installed-base transition and downgrade;
- implementation owner/seam;
- governance and extension-graduation story;
- known failure modes and falsifier.

## Step 3: collision coverage matrix

For each C1–C14 class from the domain model, record four separate cells per candidate: **prevent**, **detect**, **handle at runtime**, and **migrate**. “Namespace solves collisions” is insufficient unless the cells state what it does not solve. Include at least these concrete instances: v0.2 `status`, a future core `type: Task`, scalar-to-object adoption, reserved-prefix adoption, date-shape normalization, `generated.at`/`verified`, conflicting profiles, and interrupted/concurrent migration.

## Step 4: decision criteria

Score or explicitly rank candidates against:

1. no silent semantic reinterpretation by generic consumers;
2. truthful core conformance and operation-specific capability claims;
3. future collision resistance across fields, Kinds, and locations;
4. unknown-data and representation fidelity;
5. deterministic composition/ownership without online dependency;
6. explicit, resumable, reversible/CAS-safe migration;
7. author/agent ergonomics and progressive disclosure;
8. fit with one parser, one Kind registry, and one shared mutation boundary;
9. interoperability and alignment with OKF direction;
10. governance/decentralization burden;
11. installed-base cost and downgrade behavior;
12. proportionality for current ecosystem scale.

If criteria are weighted, publish weights before scoring and report sensitivity: whether a plausible alternate weighting changes the recommendation. A candidate that violates a hard invariant is rejected rather than rescued by aggregate score.

## Step 5: combine mechanisms explicitly

The final answer may be layered—for example, one identity mechanism, one ergonomic mapping, and one migration protocol. For every selected component, state the collision classes and actors it serves. Remove any component whose marginal benefit does not exceed its implementation/governance cost.

## Step 6: recommendation under upstream uncertainty

Give both:

- the durable recommendation based on current evidence; and
- a decision table for plausible upstream outcomes (normative profile mechanism, namespaced extension guidance, global key reservation without an extension syntax, or no timely answer).

Upstream response may change interoperability choices but cannot relax truthful version claims, preservation, or explicit migration.

# Evidence standard

- Prefer primary, authoritative sources: normative specifications, official implementation/migration guides, release policy, conformance test docs, and merged repository text. Technical research must not rely on secondary summaries when primary sources are available.
- Pin the standards edition/version, page/section, URL, access date, and proposal/merged status. For GitHub evidence, pin a commit when the wording may move.
- Separate **normative fact**, **documented implementation practice**, **empirical local finding**, and **design inference** in both prose and tables.
- Use direct quotations only when exact normative language matters; keep them short and pair with interpretation. Paraphrase otherwise.
- For empirical agentstate-lite claims, provide a reproducible command/fixture and pinned commit or cite the existing audit. Never generalize one fixture into an ecosystem claim.
- Record negative evidence carefully: “not found in reviewed sections” is not “the standard forbids/does not support.” List the search scope.
- Every conclusion consumed by synthesis carries confidence (`high`, `medium`, `low`) and source IDs. Low-confidence conclusions cannot alone establish a hard invariant.
- Compare standards by problem/constraint, not by copying surface syntax. State why healthcare resource exchange, API descriptions, cluster APIs, or schema dialects do or do not transfer to offline markdown bundles.
- Treat open OKF issues (#212, #239, #240, #272) as stakeholder/proposal evidence, not settled contract.
- Make evidence progressively disclosable: top-line pattern, direct citation, then detailed notes. A new agent should not need conversation history.

# Adversarial review rubric

The reviewer must attempt each attack against the exact synthesized design and identify which invariant or mechanism contains it:

1. **Unaware consumer:** a generic v0.2 consumer sees the proposed workflow state; can it mistake it for core lifecycle?
2. **Future core adoption:** OKF v0.3 adopts a currently custom field, Kind/type token, prefix, body heading, or nested path.
3. **Invalid-core laundering:** an invalid core value is reinterpreted as a producer extension based on its value.
4. **Extension graduation:** legacy custom and new core representations coexist or disagree.
5. **Conflicting contracts:** two profiles/recipes/extensions claim the same logical or serialized coordinate.
6. **Unavailable authority:** the registry/profile URL is offline, mutable, duplicated, or taken over; the bundle must remain safe and legible.
7. **Mixed versions:** one bundle contains legacy, target, and unknown-future documents or receives content from multiple producers.
8. **Interrupted migration:** conversion stops between documents or fields and is resumed by another process.
9. **Concurrent mutation:** a document changes after migration read and before write; stale transforms must not land.
10. **Downgrade/round-trip:** an older or unaware tool reads and rewrites target data without extension semantics.
11. **Shape loss:** scalar/object/list and date-only/datetime distinctions survive or fail loudly.
12. **Cross-field staleness:** a mutation changes generated content while verification/provenance claims remain.
13. **Identity ambiguity:** human-friendly aliases, prefixes, Kind names, or recipe sources resolve to different authorities.
14. **Operational overclaim:** a tool that can parse/preserve is presented as able to validate/author/migrate.
15. **Human burden:** routine evolution still requires founder judgment or manual per-document decisions without a decision procedure.

## Verdict rules

- **FAIL:** any path permits silent semantic reinterpretation, dishonest version claims, silent lossy migration, unresolved competing sources of truth, or non-resumable/concurrency-unsafe transformation.
- **CONDITIONAL:** no hard invariant fails, but a material mechanism, governance decision, or evidence claim is underspecified; required repairs must be enumerated.
- **PASS:** hard invariants survive; remaining risks are explicit and proportionate; evidence and inferences are traceable; the collision playbook can resolve at least two novel cases not used to design it.

The report must label findings **empirical** or **reasoned**, cite the attacked artifact version, and list survived attacks so approval is calibrated. A repair invalidates the prior PASS until exact re-review.

# Deliverable acceptance

The team succeeds when the final recommendation satisfies every acceptance criterion in the shared domain model, closes the parent Task's requested scope, and leaves a durable procedure that future agents can apply without reconstructing this conversation. It must also state what remains undecided and which future evidence would trigger reconsideration.

Confidence in this plan is high for decomposition and reviewability. The selected mechanism remains intentionally open pending independent evidence and option analysis.
