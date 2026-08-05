---
type: Review
title: Adversarial review of OKF extension evolution recommendation
actor: codex-standards-reviewer
timestamp: '2026-08-05T23:00:55.333Z'
---
# Exact-version adversarial review

## Decision card

- **Target:** `designs/okf-extension-evolution-recommendation` at exact version `sha256:226214f3ab5d302cffa4ceb57d9fa3965cf1aaf4d2bce065348949cd376cc600`.
- **Verdict:** **CONDITIONAL**.
- **Why:** the layered identity/wire/profile/capability/migration architecture survives every semantic-collision attack, but the migration commit boundary is underspecified for a fresh legacy or unaware writer that does not consult the new semantic gate. Per-document CAS plus a root CAS does not by itself close the bundle-wide verification-to-root-flip race. The planned upstream-outcome decision table is also absent.
- **Blocking repair:** define the migration fence and target-commit protocol at the architectural level, including the compatibility boundary for old/unaware writers and the exact revision set protected through the root flip.
- **Exact re-review:** required after repair. Do not accept a repaired design under this verdict without reviewing its new exact version.
- **Confidence:** high in the verdict and the layered backbone; medium-high in the migration-race finding because the exact enforcement mechanism remains intentionally below this design's level; high that the upstream-outcome table is a missing deliverable rather than a semantic flaw.

## Purpose and review boundary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: determine independently whether the frozen recommendation prevents silent semantic corruption and supports honest, recoverable standards evolution.

This review attacks the exact persisted design, not its summary. It consumed the shared domain model, architecture plan, both independently frozen specialist artifacts, and both exact cross-reviews. It does not re-run the standards research or edit the recommendation. Findings are reasoned architecture findings unless explicitly labeled empirical.

The review distinguishes a design that **permits** unsafe behavior from one that expresses a correct invariant but leaves a material enforcement boundary underspecified. The latter is why the verdict is CONDITIONAL rather than FAIL: the design requires a write gate and root flip last, but it has not yet shown that the gate protects the complete target proof from a writer outside the new mutation-aware cohort.

## Findings

### F1 — The migration fence does not yet close the legacy-writer/root-flip race

- **Severity:** High
- **Label:** Reasoned
- **Affected classes:** C10, C12, C13; secondarily C7-C9 if the late write changes representation or invariants.
- **Attacked claims:** “every semantic mutator must honor the persisted gate,” per-document CAS conversion, full-target verification, and root contract flip last.

The design correctly observes that per-document CAS only rejects a stale transform and that a fresh writer can reintroduce a source coordinate after conversion. Its response is a persisted gate consulted by every semantic mutator. That contains current, cooperative write surfaces, but the exact design also acknowledges older/unaware tools. A legacy binary can read a freshly converted document while the root still advertises v0.1 and write a source coordinate without knowing that a new migration-state document exists.

There is then a bundle-wide time-of-check/time-of-commit window:

1. migration verifies document A as target-only;
2. a legacy writer writes source-form data to A using a fresh per-document revision;
3. verification finishes elsewhere;
4. the root index CAS succeeds because the legacy write did not change the root revision;
5. the bundle now honestly passed each individual CAS yet falsely claims the target contract.

The design's intent rejects this outcome, but the proposed primitives do not yet state what prevents it. Root CAS protects the root only; per-document CAS protects one transform only. “Every mutator honors the gate” is not an enforceable compatibility statement until the design distinguishes supported migration-aware writers from older/unaware writers and names the authority that fences writes across the verification and commit interval.

**Required repair:** add an architectural migration-commit invariant with all of the following properties:

1. A migration epoch/fence is established before transformation at the lowest common write authority available for the supported deployment shape. Every supported semantic write must carry or validate that epoch/contract, not merely read a best-effort status document.
2. Target verification binds an exact set of affected document revisions plus the relevant root/contract revision. The root flip occurs while the same fence remains effective, or through a commit protocol that rejects any drift in that revision set.
3. A backend or operating mode that cannot exclude or detect old/unaware writers must require an explicit quiescent maintenance mode and must not claim concurrent-safe migration. This is a truthful capability distinction, not an implementation failure.
4. Old binaries, manual filesystem edits, and other non-participating writers are explicitly outside the supported migration-write cohort. Observed drift returns the migration to `in_progress`/`verifying` and prevents or invalidates the root flip; it is never silently accepted.
5. The fence is released only after target commit and a final protected audit. Failure/abort retains enough source bytes and epoch state to resume or restore without selecting a different transform.

This does not require one universal implementation. A server/backend may provide an admission epoch; a local filesystem mode may require a process-external exclusive maintenance lock plus quiescence. The design must state the guarantee and downgrade honestly when the environment cannot provide it.

### F2 — The required upstream-outcome decision table is missing

- **Severity:** Medium
- **Label:** Reasoned / deliverable conformance
- **Affected classes:** C1, C5, C6, C11, C12, C14.

The architecture plan explicitly requires a decision table for at least: a normative profile mechanism, namespaced extension guidance, global key reservation without extension syntax, and no timely upstream answer. The recommendation contains good upstream asks, falsifiers, and a provisional envelope, but no single table specifies what agentstate-lite does under each outcome.

This matters because profile selection and extension serialization are currently non-normative in OKF. Without the table, a later implementer still has to infer whether to adopt a profile key, retain the provisional anchor, choose flat prefixed fields, or continue v0.1-only writes. That reintroduces avoidable founder/maintainer judgment precisely at the upstream uncertainty boundary.

**Required repair:** add a compact table that states, for each plausible upstream outcome:

- which declaration mechanism is normative versus agentstate-lite-local;
- which wire lane is selected and why;
- which identity/capability/migration layers remain unchanged;
- what evidence triggers adoption or relocation;
- whether a migration is required before the target conformance claim;
- what agentstate-lite does if upstream supplies profiles but no collision-safe wire lane.

The expected policy is already latent in the design: profiles never authorize core-key overloading; an upstream reserved lane replaces only the provisional wire mapping; a producer-prefix reservation may select the flat fallback after tooling tests; and no timely answer permits a clearly non-normative, migratable local anchor only after the prototype gates pass.

## Fifteen-case attack transcript

| # | Attack | Result | Containing invariant/mechanism |
| --- | --- | --- | --- |
| 1 | Generic v0.2 consumer sees workflow `todo` | **Survived.** Workflow state is placed in a disjoint extension lane; top-level `status` remains core lifecycle. | Invariants 1, 3, 7; isolated wire lane; profile is not safety boundary. |
| 2 | OKF v0.3 adopts a custom field, `Task`, prefix, heading, or nested path | **Survived.** The edition diff classifies C1/C5/C6, core wins, unsafe target writing stops, and a versioned relocation is required before claim flip. The provisional anchor is explicitly migratable. | Collision ledger, qualified IDs, logical-to-wire mapping, O7 lifecycle. |
| 3 | `status: todo` is laundered into the extension by value | **Survived.** The design expressly forbids value-based ownership. Under v0.2 it remains invalid/unsupported core data. | Invariants 1, 6; C1/C2 response. |
| 4 | Legacy extension graduates into core and both values coexist/disagree | **Survived.** IDs remain distinct, equivalence requires an authorized declaration, target is single-written, and disagreement blocks completion. | Invariants 7, 8, 13, 15; C10 procedure. |
| 5 | Two profiles/extensions claim one logical or wire coordinate | **Survived.** Registry compilation returns compatible, incompatible, or unresolved; no load-order precedence exists. | Invariants 5-8; C11 response. |
| 6 | Definition URL is offline, mutable, duplicated, or taken over | **Survived with explicit residual risk.** Existing bundles resolve exact embedded/shipped definitions and digests offline; substitution is a hard error. Publisher trust/authority transfer remains an acknowledged governance risk, not silent latest-version lookup. | Invariant 14; offline resolver; C14 policy. |
| 7 | Bundle contains legacy, target, and unknown-future documents | **Survived subject to F1.** Root remains on source edition during mixed storage; unknown material can be inspected/preserved, semantic authoring is capability-gated, and target claim waits for no-legacy verification. The late legacy-writer window still needs the repaired fence. | Operation matrix, migration state machine, root flip last. |
| 8 | Migration stops and another process resumes | **Survived subject to F1.** Transform identity, checkpoints, source/result revisions, rollback bytes, and durable states make resumption deterministic. Cross-writer fencing through commit still needs repair. | Invariant 11; journal/state model. |
| 9 | Document changes after migration read and before write | **Survived.** Per-document expected revision rejects the stale transform; conflict stays pending for fresh classification. | CAS invariant and checkpoint outcome. |
| 10 | Older/unaware tool reads and rewrites target data | **Survived as an honest compatibility boundary.** The design does not promise opaque preservation from every writer, distinguishes raw transport from semantic support, and requires empirical capability claims. It should use F1's supported-writer boundary during migration. | Invariants 9, 10, 14; operation-specific support. |
| 11 | Scalar/object/list or date-only/datetime shape is lost | **Survived.** Parser/codec fixtures and a fail-closed migration gate are prerequisites; exact lexical fidelity is not falsely promised after parsed mutation. | C3/C7 response; prototype gates 3 and 6. |
| 12 | Mutation leaves `generated.at`, verification, or provenance stale | **Survived.** Constraints are compiled and the one shared mutation candidate invalidates or recomputes affected evidence before CAS. | C9 response; invariant 5; revision-scoped evidence. |
| 13 | Alias, prefix, Kind token, or recipe source resolves to another authority | **Survived.** Stable semantic IDs are separate from aliases and recipe provenance; ambiguity fails rather than selecting by order. Local and portable scope are distinct. | Invariants 2, 4, 6, 13; C5/C14 response. |
| 14 | Parser/preserver is advertised as validator/writer/migrator | **Survived.** Capabilities are explicitly operation-specific and unresolved required semantics block affected semantic operations. | Invariant 10; capability matrix; C12 response. |
| 15 | Routine evolution still needs founder judgment | **Survived except F2.** C1-C14 classification and the matched decision procedure resolve ordinary cases without per-document invention. Upstream uncertainty still lacks the promised decision table. | Generated release artifacts, collision playbook, phased adoption. |

## Additional required attacks

| Attack | Result |
| --- | --- |
| Profile-unaware consumer | Survived: wire isolation, not the profile, prevents core reinterpretation. |
| Fresh legacy writer during migration | **Conditional: F1.** Cooperative current writers are gated; non-participating old writers and the verification/commit race need an explicit fence/capability boundary. |
| Semantic ID vs definition version vs digest | Survived: exact coordinate is `(semantic ID, definition version, digest)` and document CAS revision remains separate. |
| Multiple available versions | Survived: multiple versions may coexist; unequal content at the same ID/version is an integrity error; one active binding is selected deterministically. |
| Bundle-local vs portable scope | Survived: local IDs make no global claim; graduation mints a new portable identity and relation. |
| Required support by operation | Survived: raw read/preserve, interpret, validate, create, mutate, migrate, and export are separate. Requiredness comes from trusted definitions, not arbitrary instances. |
| Parser fidelity | Survived: the wire syntax cannot freeze or migration start until shape/round-trip fixtures establish the promised capability. |
| Executable-definition trust | Survived: mappings are declarative by default; executable validators/converters require exact code identity and explicit trust behind shared mutation authority. |
| Compatibility-envelope authority | Survived: compatibility/quarantine data is archival and non-writable, never a second truth. |
| Validation evidence | Survived semantically; F1 requires the final migration evidence to bind the protected full revision set through commit. Ordinary evidence is revision- and contract-scoped and invalidated/recomputed by mutation. |
| Extension graduation | Survived: only recognized authorities can publish binding equivalence within stated scope, with bounded legacy-read retirement. |
| Implementation/governance proportionality | Survived: Phase 0 contains the immediate risk cheaply; qualified identity and wire syntax are staged; global URIs are not forced onto local throwaway Kinds; exact syntax waits for empirical/upstream evidence. |

## C1-C14 coverage audit

| Class | Verdict | Reason |
| --- | --- | --- |
| C1 exact coordinate | Pass | Core wins; custom meaning relocates to an isolated lane; no value guessing. |
| C2 semantic narrowing | Pass | New definition version and explicit value mapping/manual refusal. |
| C3 shape/cardinality | Pass | Versioned codec, declared loss/inverse, parser gate. |
| C4 scope | Pass | Scoped logical identity and mapped relocation. |
| C5 Kind/type | Pass | Authority-qualified Kind identity and ambiguous-alias refusal. |
| C6 reserved location | Pass | Edition diff, provisional-anchor acknowledgment, relocation mapping. |
| C7 representation/parser | Pass | One parser; no migration before representation fidelity is proven. |
| C8 default/absence | Pass | Absence/default is modeled explicitly; `stable` is not inferred from legacy workflow state. |
| C9 cross-field invariant | Pass | Shared mutation enforces or invalidates coupled assertions. |
| C10 graduation/duplicate truth | Pass subject to F1 | Distinct IDs, declared equivalence, bounded dual-read/single-write; commit fence needs clarification. |
| C11 multi-contract | Pass | Compatible/incompatible/unresolved composition; never last-wins. |
| C12 false conformance | Pass subject to F1/F2 | Operation gates are honest, but the final root claim must be protected from late legacy drift and upstream policy must be explicit. |
| C13 migration state | **Conditional** | Journal, CAS, rollback, and state machine are strong; bundle-wide commit fencing is underspecified. |
| C14 authority/identifier | Pass with acknowledged residual governance | Exact pins prevent silent substitution; authority transfer/trust remains an explicit future policy choice. |

## Novel-collision application test

The playbook was applied to two cases not used to design the original `status` response:

1. **OKF v0.3 reserves `conventions/` for a different core facility.** This is C6 plus C12/C13. The edition ledger detects the prefix collision before authoring; the core reservation wins; custom definition documents receive a new extension-owned location through a versioned mapping; target authoring remains blocked until parser/path/link behavior and migration exist; existing bundles stay on their source contract; a write-gated CAS migration relocates definitions and references; the root contract flips only after absence of the legacy location is verified. No founder-specific rule is required.
2. **Two installed publishers both expose the short Kind alias `Incident` but use different canonical IDs and link vocabularies.** This is C5+C11+C14. Both exact definitions may resolve offline, but the alias is ambiguous and semantic authoring fails. The operator/profile selects or renames a scoped alias; qualified wire type tokens remain distinct; install order and field values never choose. Existing documents migrate only under an explicit source binding. No global rename convention is invented on the spot.

Both cases are mechanically resolvable under the design. This supports the recommendation's central claim that the taxonomy and layered registry are reusable scaffolding rather than a one-off `status` patch.

## Survived claims and strengths

1. Custom conventions are genuinely different from core through authority class, canonical identity, and serialized ownership—not merely a moniker.
2. The design preserves one parser, one semantic registry, and one mutation authority.
3. Profiles compose and select semantics but never excuse core-coordinate overload.
4. Canonical identity is offline-resolvable and independent of wire spelling or network availability.
5. Unknown handling is both operation-specific and limited to trusted definitions; the design avoids an unrestricted FHIR-style modifier veto.
6. Installed-base change is explicit, loss-aware, dual-read/single-write, CAS-journaled, and root-flip-last.
7. Local definitions remain lightweight; portable definitions pay the authority/version/digest governance cost.
8. Provisional nested YAML, URI map keys, and `x-agentstate-lite` are correctly treated as hypotheses with falsifiers rather than standards-derived facts.
9. The immediate v0.1 writer guard and collision ledger are proportionate and can ship before the durable wire decision.
10. The recommendation correctly rejects rename-only, prefix-only, profile-only, migration-only, indefinite dual-write, value inference, and online-resolution approaches.

## Required re-review contract

A repaired recommendation must receive exact-version re-review. The re-review may be focused on:

1. whether F1's migration epoch/fence, protected revision set, legacy-writer compatibility boundary, and commit/abort behavior close the late-write scenario without overclaiming unsupported modes;
2. whether F2's upstream-outcome table supplies a deterministic policy for profile-only, reserved-lane, reserved-prefix, and no-answer outcomes;
3. whether the repair preserves the existing identity, operation, parser, offline, and proportionality invariants without introducing a second registry or mutation authority.

No external source dispute requires new standards research. The required changes are architecture precision and decision completeness.

## Evidence

- [Target recommendation](../designs/okf-extension-evolution-recommendation.md)
- [Shared collision domain model](../research/okf-extension-evolution-domain-model.md)
- [Architecture/review plan](../plans/okf-extension-evolution-architecture.md)
- [Frozen standards research](../research/okf-extension-evolution-standards-patterns.md)
- [Frozen architecture options](../designs/okf-extension-evolution-options.md)
- [Standards applicability cross-review](./okf-extension-evolution-standards-applicability.md)
- [Standards cross-review of options](./okf-extension-evolution-options-standards.md)
- [FHIR R5 Extensibility](https://hl7.org/fhir/R5/extensibility.html)
- [FHIR R5 Version Management](https://hl7.org/fhir/R5/versions.html)
- [Kubernetes CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
- [JSON Schema Core 2020-12](https://json-schema.org/draft/2020-12/json-schema-core)
- [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)
- [Namespaces in XML 1.0](https://www.w3.org/TR/2009/REC-xml-names-20091208/)

## Confidence and limits

- **High confidence:** the recommendation's semantic architecture survives; no path authorizes value guessing, load-order precedence, network-required interpretation, lossy undeclared conversion, indefinite dual truth, or profile-based core reinterpretation.
- **High confidence:** F1 is material because document CAS and root CAS protect different objects and the design explicitly asks to handle fresh legacy writers.
- **Medium-high confidence:** the appropriate repair is an architectural fence/commit invariant rather than one implementation. Exact mechanics vary across filesystem and remote backends.
- **High confidence:** F2 is required by the plan and prevents future upstream uncertainty from becoming ad hoc policy.
- **Empirical limit:** no code was changed or runtime migration exercised; this is a design review. The future implementation must test true multi-process interruption and concurrent legacy-writer cases on each claimed backend.
