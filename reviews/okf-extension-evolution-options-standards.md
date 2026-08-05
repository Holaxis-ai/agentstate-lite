---
type: Review
title: Standards cross-review of OKF extension evolution options
description: >-
  Exact-head review of the architecture options against FHIR, OpenAPI,
  Kubernetes, JSON Schema, XML, and OKF evidence.
actor: codex-standards-research
timestamp: '2026-08-05T22:53:25.062Z'
---
# Decision card

- **Reviewed artifact:** `designs/okf-extension-evolution-options` at exact head `sha256:6574d4daf58f6c9d73fdb64c1dc6a794ecb8da281389825c6003ccef2dc767c1`.
- **Verdict:** **Pass with caveats.** The layered architecture is well aligned with the comparative standards evidence and is suitable as a synthesis input. No finding requires discarding the option set.
- **Required before final recommendation:** correct the unknown-field preservation claim; constrain generic-ignorability to non-modifying semantics; allow multiple versions of one canonical identity while rejecting conflicting active bindings; add required/optional support per operation; and make version/change-budget policy explicit.
- **Blocking findings:** none for cross-review or synthesis, provided the required synthesis constraints below are applied.
- **Confidence:** high in the identity/profile/operation/migration backbone; medium in the provisional nested YAML representation and its exact anchor/key syntax.

# Review scope and method

This review attacks the frozen options artifact using the independently frozen primary-source comparison in [the standards-pattern research](../research/okf-extension-evolution-standards-patterns.md). It tests four questions:

1. Does the artifact attribute stronger normative guarantees to a standard than the source provides?
2. Does it transfer a mechanism without transferring the implementer obligations that make the mechanism safe?
3. Does it mistake a candidate serialization syntax for an identity, compatibility, or governance policy?
4. Which claims survive comparison across FHIR R5, OpenAPI 3.2.0, Kubernetes API/CRD evolution, JSON Schema Draft 2020-12, XML Namespaces 1.0, and the pinned OKF v0.2 text?

Evidence labels:

- **Normative fact** refers to the cited standard's own requirement or permission.
- **Documented platform contract/practice** refers to official Kubernetes procedures/policies.
- **Architecture policy** refers to a deliberate agentstate-lite rule. Local policy may use strong language without becoming a claim about another standard.
- **Review inference** is the resulting constraint on synthesis.

The architecture artifact correctly labels open OKF issues as non-normative and does not claim that its CAS state machine, one-registry rule, or local-first resolver is mandated by an external standard. Those are legitimate local architecture policies.

# Verdict

**Pass with caveats.**

The principal recommendation survives: immediate write-version gating and collision diagnostics, followed by a layered contract combining qualified semantic identity, isolated wire representation, explicit profiles, logical-to-wire mappings, and resumable migration. This is materially stronger than a prefix-only or migration-only response and matches the cross-standard evidence.

The caveats are not cosmetic. Two statements currently overstate what an unaware consumer guarantees, one registry rule would reject a normal multi-version situation, and the model needs an explicit required/optional support classification. The provisional YAML example must also remain an example, not harden into policy merely because it visually resembles OpenAPI, FHIR, or XML mechanisms.

# Findings summary

| ID | Severity | Disposition | Finding |
| --- | --- | --- | --- |
| S1 | High | Required synthesis correction | OKF v0.2 says consumers **SHOULD** preserve unknown fields on round trip, not that preservation is unconditionally required. O2/O3 and migration prose overstate the guarantee. |
| S2 | High | Required synthesis correction | A nested unknown extension is not always safe to ignore. Generic-ignorability applies only to non-modifying semantics; required support must be declared per operation and affected scope. |
| S3 | High | Required synthesis correction | Same canonical ID with different definition versions is normal evolution, not automatically a registry conflict. Conflict is unequal content at the same `(ID, version)` or incompatible simultaneous active bindings. |
| S4 | Medium-high | Required synthesis constraint | OpenAPI's `x-` convention has normative force only inside OAS. `x-agentstate-lite` is an unreserved OKF coordinate and must remain a provisional mapping with relocation support. |
| S5 | Medium | Required synthesis constraint | The design assumes “semantic versioning” in one option, but the standards do not provide a universal comparison algorithm. Definition version, compatibility policy, maturity, and support window must be explicit. |
| S6 | Medium | Required synthesis constraint | URI-as-YAML-map-key is candidate syntax, not the standards-derived identity policy. Canonical identity must remain independent of whether it is encoded as a key or a value. |
| S7 | Medium | Nonblocking omission | The artifact has operation-specific capabilities but not a clear producer-intersection/consumer-union rule for multiple profiles and not a recorded inconclusive composition result. |
| S8 | Medium | Nonblocking omission | Conformance declarations select contracts but do not prove instance conformance. The final design should persist or invalidate validation evidence separately. |
| S9 | Low | Governance gap | Graduation and deprecation behavior is sound, but authority to publish equivalence and minimum support windows remains unspecified. |
| S10 | Low | Wording/UX caveat | The target example's `status: stable` is a core lifecycle assertion/default policy, not merely a namespace demonstration; migration must classify this C8 decision explicitly. |

# Detailed findings

## S1 — Unknown-field preservation is a SHOULD, not a guaranteed transport invariant

**Severity:** High; required correction before the final recommendation is stated.

**Artifact claim under attack.** The current-system discussion says OKF “requires consumers to preserve unknown keys on round-trip,” and O2/O3 repeatedly say a generic consumer “preserves” unknown custom fields or an envelope.

**Normative fact.** OKF v0.2 says consumers **SHOULD** preserve unknown fields when reading and writing and **MUST NOT** reject a document because it has unknown fields. These are different obligations. [OKF v0.2 §§4.1 and related consumer rules](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md)

**Normative comparison.** FHIR similarly says unknown non-modifier extensions should not cause rejection and should be preserved when possible, otherwise they can be ignored. It does not promise that every conforming workflow returns identical opaque extension data. [FHIR R5 Extensibility §2.1.5.0.3](https://hl7.org/fhir/R5/extensibility.html)

**Review inference.** Replace unconditional language with two capability claims:

- an edition-aware consumer must not reinterpret an isolated unknown coordinate as a known core coordinate;
- opaque round-trip preservation is a distinct, testable operation capability, not a universal consequence of the syntax.

The design should retain empirical round-trip tests for representative YAML tools and gate semantic writers that cannot preserve the unknown structures they touch. O3 still improves collision isolation, but it cannot guarantee survival through every unaware writer.

## S2 — “Unknown envelope can be ignored safely” is only true for non-modifying semantics

**Severity:** High; required semantic constraint.

**Artifact claim under attack.** O3 says a generic consumer “may ignore all custom behavior safely.” Elsewhere, unavailable definitions cause all interpret/validate/create/mutate/migrate operations to stop, but the extension contract does not explicitly classify required versus optional support or the operations/fields it affects.

**Normative fact.** FHIR distinguishes ordinary extensions from modifier extensions. A processor must not silently process affected content if an unknown modifier can qualify or negate its meaning. A mere transporter that preserves the complete resource is different from a semantic processor. FHIR also warns that an unknown ordinary extension can become invalid after its containing element is modified. [FHIR R5 Extensibility §§2.1.5.0.2-.3](https://hl7.org/fhir/R5/extensibility.html)

**Normative fact.** JSON Schema's `$vocabulary` declaration marks a vocabulary required or optional for processing. An implementation that does not understand a required vocabulary must refuse schema processing; it can continue for an optional vocabulary under the specified fallback. [JSON Schema Draft 2020-12 Core §§4.3.3 and 8.1](https://json-schema.org/draft/2020-12/json-schema-core)

**Review inference.**

1. The generic-safety claim must be scoped: an isolated extension can be ignored without corrupting **OKF core interpretation only if it does not modify, negate, or redefine core semantics**.
2. Each extension/profile definition must declare support requirements per operation such as transport, inspect, validate, create, mutate field/body, migrate, and export, plus the affected logical scope.
3. Unknown optional semantics can remain opaque for unrelated operations.
4. Unknown required semantics must block only the affected semantic operation, unless safe dependency analysis cannot be established—in which case conservative blocking is justified.
5. A semantic mutation must not blindly preserve an unknown assertion that the mutation might invalidate.

This preserves the artifact's operation-specific principle while avoiding both extremes: blanket acceptance and blanket refusal. It also avoids copying FHIR's arbitrary instance-level `modifierExtension` mechanism wholesale; requiredness belongs in trusted, versioned definitions/profiles.

## S3 — Multiple versions of one canonical identity must be representable

**Severity:** High; required registry correction.

**Artifact claim under attack.** O3 says “duplicate same-ID/different-version” entries fail registry compilation. O4 similarly says duplicate canonical IDs with unequal definitions fail, without clearly limiting the rule to the same version or one active binding.

**Normative fact.** FHIR canonical references can identify a canonical artifact as `url|version`. The stable canonical URL identifies the logical artifact across versions; a version selects a particular definition. Unequal content at the same URL and version is an integrity error, but multiple versions of one canonical URL are expected. [FHIR R5 References §2.1.3.0.6](https://hl7.org/fhir/R5/references.html)

**Documented platform contract.** Kubernetes routinely serves multiple versions of one API group/resource and designates one storage version while conversions relate the versions. [Kubernetes API overview](https://kubernetes.io/docs/reference/using-api/) and [CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)

**Review inference.** The registry should distinguish:

- **available definition:** many versions of one canonical logical ID may coexist in the package/cache;
- **exact identity:** unequal content claiming the same `(canonical ID, version)` is a hard integrity error;
- **active binding:** a profile or operation must resolve an exact version or deterministic locally pinned selection;
- **composition conflict:** incompatible versions cannot simultaneously own the same active logical/wire coordinate unless a declared compatibility/conversion rule makes the composition meaningful.

This change strengthens, rather than weakens, O4/O5/O6. Version selection becomes explicit without confusing normal evolution with identifier corruption.

## S4 — OpenAPI `x-` is precedent for reserved syntax, not an OKF reservation

**Severity:** Medium-high; required caveat in the recommendation.

**Artifact claim under attack.** O2/O3 use `x-agentstate-lite` as a producer anchor and sometimes call it producer-owned, while also acknowledging that OKF has not reserved the lane.

**Normative fact.** OpenAPI extension keys begin with `x-` because the OpenAPI specification defines that patterned extension field at designated objects and reserves portions of the namespace. The OpenAPI Initiative also maintains a namespace registry. [OAS 3.2.0 §5](https://spec.openapis.org/oas/v3.2.0.html) and [OpenAPI Namespace Registry](https://spec.openapis.org/registry/namespace/)

**Review inference.** The analogy transfers only after a format reserves the lane. Under current OKF, `x-agentstate-lite` is an implementation-chosen coordinate that is non-core at v0.2, not a permanently producer-owned namespace. The artifact already recognizes this; synthesis must preserve the qualification and require:

- a current-edition collision ledger;
- an explicit mapping version and relocation migration;
- an upstream request for a reserved extension point or producer namespace policy;
- no claim that `x-` itself proves authority or future collision freedom.

This is not a reason to reject O3. It is why O3 must be paired with O4/O6/O7 and kept at medium confidence until empirical and upstream evidence improves.

## S5 — Version comparison, maturity, and support windows need explicit policy

**Severity:** Medium; required governance constraint.

**Artifact claim under attack.** O3 says the entry authority owns “semantic versioning,” and the example carries `version: "1"`. The design otherwise separates several version axes well, but it does not define a version-comparison algorithm, maturity levels, or minimum deprecation/support windows.

**Normative fact.** FHIR canonical resources do not have to use semantic versioning and can declare a `versionAlgorithm[x]`. FHIR's own release numbering has compatibility rules that differ from generic SemVer. FHIR also assigns maturity/status per artifact and protects normative identifiers from incompatible reuse. [FHIR R5 References §2.1.3.0.6](https://hl7.org/fhir/R5/references.html) and [FHIR Version Management §2.1.7](https://hl7.org/fhir/R5/versions.html)

**Documented platform contract.** Kubernetes assigns alpha/beta/stable support guarantees and time/release windows; removals and significant changes require version transitions under its deprecation policy. [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)

**Review inference.** Replace assumed semantic versioning with a declared version algorithm/compatibility policy. Define independent axes for OKF edition, canonical definition version, profile version, logical product version, migration version, and document CAS revision. Add maturity-specific allowed-change budgets, minimum deprecation windows, and a rule that retired identifiers are never recycled for unrelated meaning.

The artifact's existing exact pin/digest, deprecation-horizon, and successor-link ideas survive; they need this policy envelope.

## S6 — Canonical URI as a YAML mapping key is syntax, not identity policy

**Severity:** Medium; required to keep the recommendation representation-neutral until prototyped.

**Artifact claim under attack.** The target example keys `extensions` directly by a canonical URI and says that the ID owns the subtree.

**Normative fact.** FHIR stores the extension canonical URI as the `Extension.url` value; XML derives an expanded name from a namespace binding plus local name; JSON Schema uses URI-identified dialects/vocabularies. None establishes URI-as-YAML-map-key as the general portability mechanism. [FHIR defining extensions](https://hl7.org/fhir/R5/defining-extensions.html), [Namespaces in XML 1.0 §§2-6](https://www.w3.org/TR/2009/REC-xml-names-20091208/), [JSON Schema Core §§4.3.3 and 8](https://json-schema.org/draft/2020-12/json-schema-core)

**Review inference.** Preserve the canonical identity rule, but treat key-versus-value layout as a wire choice. A mapping keyed by URI, a list of records with explicit `id` and `version`, or a scoped alias table can all implement the policy. Select among them using:

- YAML parser/emitter and duplicate-key behavior;
- query/path ergonomics;
- deterministic ordering;
- round-trip preservation across representative tools;
- ease of carrying version, digest, required-support flags, and provenance.

The syntax must not become the only place authority, version, or requiredness is represented.

## S7 — Multi-profile obligations need an explicit producer/consumer rule

**Severity:** Medium; nonblocking omission.

**Artifact behavior.** The compiler rejects incompatible logical/wire claims and refuses semantic authoring while permitting raw preservation. This is directionally correct.

**Normative fact.** FHIR states that a producer subject to multiple profiles must satisfy their intersection while consumers are expected to support the union of acceptable instances; profiles may be incompatible. It also requires each profile to define what `MustSupport` means in context. [FHIR R5 Profiling §§5.1.0.22 and .26](https://hl7.org/fhir/R5/profiling.html)

**Review inference.** The synthesis should spell out:

- producer obligations are the satisfiable intersection of active constraints;
- consumer recognition is the union of declared alternatives/capabilities;
- “unknown/inconclusive composition” is different from “proven incompatible”;
- list/load order never resolves either state;
- each support flag has operation-specific meaning.

The options artifact already rejects order-based precedence and therefore survives; this addition makes the composition contract operational.

## S8 — Profile/conformance declaration is not validation evidence

**Severity:** Medium; nonblocking because the design already calls for validation.

**Normative fact.** FHIR `meta.profile` is an assertion and can be wrong. Applications should validate content rather than deriving meaning solely from the tag. [FHIR R5 Resource §§2.1.27.5.3.7 and .9.2](https://hl7.org/fhir/R5/resource.html)

**Review inference.** A root profile/contract declaration selects definitions, mappings, and validators; it does not prove the bundle or document conforms. Persist validation evidence separately with validator version, contract digest, time, scope, and relevant document/root revisions. A semantic mutation invalidates or recomputes evidence for affected constraints.

The artifact's full-target verification, invariant checks, and capability gates survive. The final model should simply keep declaration state and evidence state distinct under C12.

## S9 — Graduation needs an adjudication authority and support horizon

**Severity:** Low; governance gap.

**Artifact behavior.** The graduation procedure correctly keeps extension and core IDs distinct, requires explicit equivalence/non-equivalence, single-writes the core target, fails conflicting duplicate values, and never repurposes the old ID.

**Standards evidence.** FHIR protects canonical identifiers and uses deprecation/withdrawal rules; Kubernetes requires staged deprecation, conversion, storage migration, and removal only after old stored versions are gone. [FHIR Version Management §2.1.7](https://hl7.org/fhir/R5/versions.html); [Kubernetes CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)

**Review inference.** Synthesis should state who may publish a binding equivalence: original extension authority, core authority, profile authority, or a local migration authority. It should also set the minimum bounded legacy-read/deprecation window. These are governance decisions, not answers supplied by syntax.

## S10 — The illustrative core `status` value is a migration policy choice

**Severity:** Low; wording/UX caveat.

The example uses `status: stable` alongside custom workflow state. Under OKF v0.2, `status` is a core lifecycle value and absence also defaults to `stable`. [OKF v0.2 §5.4](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md)

**Review inference.** The example is valid syntax, but a migration from v0.1 workflow `status` has no source assertion about OKF lifecycle. The migration catalog must explicitly decide whether to accept the v0.2 absent→stable default, materialize `stable`, ask for classification, or keep the target unsupported. This is C8, not a namespace detail.

# Required synthesis constraints

The final synthesis should treat the following as acceptance constraints:

1. Quote OKF's unknown-field obligations accurately: unknown fields do not justify rejection; preservation is a SHOULD and an operation capability that must be tested.
2. Limit custom extension semantics to additive/non-modifying behavior when claiming profile-unaware OKF processing is safe.
3. Declare required/optional support per operation and affected scope in trusted extension/profile definitions.
4. On semantic mutation, preserve an unknown extension only when the operation cannot invalidate it; otherwise refuse or apply an explicit invalidation policy.
5. Permit many available versions of one canonical ID. Reject unequal content at one exact `(ID, version)` and incompatible simultaneous active bindings.
6. Keep canonical authority identity, definition version, profile binding, serialized coordinate, CLI alias, and document CAS revision separate.
7. Do not assume SemVer. Declare version comparison, allowed changes by maturity, deprecation windows, and never-reuse rules.
8. Treat `x-agentstate-lite`, nesting, URI map keys, and the target YAML example as provisional wire mappings, not standards-granted ownership.
9. Keep URI resolution offline-capable and content-integrity checked; canonical identity must not imply a runtime network fetch.
10. Make profile composition produce one of compatible, incompatible, or unresolved; never use load order as precedence.
11. Separate conformance declarations from revision-scoped validation evidence.
12. Preserve the explicit migration lifecycle: source/target/mapping versions, loss policy, dual-read/single-write, per-document CAS/checkpoints, stored-form audit, root flip last, and delayed retirement.
13. For extension graduation, preserve distinct identities and require an authorized equivalence/transform plus a support horizon.
14. Keep the artifact's empirical falsifiers for nested YAML preservation and query ergonomics before fixing the final wire representation.

# Claims that survived standards attack

The following claims are strongly supported and should be carried forward:

1. **Profiles are not the collision-isolation boundary.** A profile-aware producer cannot make an overloaded core coordinate safe for an unaware core consumer. FHIR profiles constrain a base; extensions add content under separate canonical identity. [FHIR profiling and defining extensions](https://hl7.org/fhir/R5/profiling.html)
2. **Identity precedes representation.** Canonical authority-qualified identity, definition version, alias, and wire coordinate are distinct. This converges across FHIR canonical URLs, Kubernetes group/version/kind, JSON Schema URI identifiers, and XML expanded names.
3. **Core and custom coordinates should be mechanically distinct.** OpenAPI demonstrates the value of a reserved lexical lane; XML and Kubernetes demonstrate owner-qualified identity. Prefixes alone are insufficient, but disjoint space is necessary.
4. **Short aliases can remain ergonomic.** XML prefixes and Kubernetes short presentation names show that compact bindings can coexist with qualified identity so long as binding scope is explicit and ambiguity fails.
5. **URI identity need not be a network dependency.** FHIR, JSON Schema, and XML distinguish stable identifier from retrievable locator. Bundle-local definitions and caches are the right local-first adaptation.
6. **Values never determine ownership.** Version/profile declarations and identity bindings select semantics. An invalid core value remains invalid core data; it is not laundered into an extension.
7. **Conflicting definitions must not resolve by load order.** JSON Schema and FHIR treat duplicate exact identifiers as integrity/editorial errors; FHIR profile composition can be incompatible.
8. **Operation-specific capability is the right unit.** Transport, interpretation, validation, creation, mutation, migration, and export have different knowledge requirements. FHIR modifier handling provides the strongest precedent.
9. **Separate version axes are necessary.** OpenAPI separates specification and described-API versions; FHIR separates canonical definition and instance history versions; Kubernetes separates API/storage versions from object revisions.
10. **The staged migration model is a sound local adaptation.** Kubernetes' served/storage lifecycle establishes that changing the selected storage/default version does not migrate stored objects. Per-document CAS, checkpoints, verification, and root flip last are appropriate agentstate-lite mechanisms.
11. **Dual-read/single-write and no indefinite dual truth are sound.** They support incremental adoption while keeping one target representation authoritative.
12. **Graduation requires explicit equivalence and retirement.** Extension and new core identity should not be silently collapsed or repurposed.
13. **Conformance claims require validation.** The artifact's target-contract validation and full verification are necessary; the profile declaration alone is insufficient.
14. **The immediate O0/O1 safety posture is proportionate.** Refusing unsupported v0.2 writes and shipping collision/capability diagnostics is justified independently of the eventual wire syntax.
15. **Rejecting live conversion webhooks is correct.** Kubernetes' state machine transfers; its online API-server topology does not fit an offline repository bundle.
16. **Not copying FHIR `modifierExtension` wholesale is correct.** The transferable principle is fail-closed affected processing, not an unrestricted instance-level veto field.

# Explicit analogy disposition

| Analogy | Disposition | Reason |
| --- | --- | --- |
| FHIR canonical extension URL → qualified extension/Kind identity | Accept | Solves authority identity and versioned definition lookup; compatible with offline caches. |
| FHIR profile → OKF profile/contract set | Accept with adaptation | Useful for constraints, dependencies, and support declarations; not a wire namespace or proof of conformance. |
| FHIR modifierExtension → arbitrary critical OKF extension marker | Reject | Safety-critical fixed-model mechanism does not transfer wholesale; requiredness belongs in trusted operation-specific definitions. |
| OpenAPI `x-` → `x-agentstate-lite` | Accept only provisionally | Recognizable lane, but OKF has not reserved or registered it. |
| Kubernetes group/version/kind → qualified Kind identity | Accept | Strong direct identity analogue. |
| Kubernetes live conversion webhook → OKF runtime dependency | Reject | Violates local-first availability and trust constraints. |
| Kubernetes served/storage lifecycle → OKF migration state | Accept with adaptation | State-machine and stored-version audit transfer; API-server topology does not. |
| JSON Schema required/optional vocabularies → extension capability declaration | Accept | Strong precedent for refusing processing only when required semantics are unknown. |
| XML namespace prefix → YAML prefixed key as identity | Reject | Prefix is only an alias; canonical binding/authority must remain explicit. |
| URI used as YAML mapping key → canonical semantic identity | Reject as equivalence | It is one encoding choice, not the identity mechanism itself. |

# Confidence

- **High:** pass-with-caveats verdict; O4/O5/O6/O7 backbone; profile-not-safety-boundary; offline canonical identity; operation-specific capability; explicit migration; findings S1-S4.
- **Medium-high:** maturity/version-policy constraint and exact conflict rule for coexisting versions.
- **Medium:** nested envelope as a provisional target; required/optional operation taxonomy; composition satisfiability boundary.
- **Low until empirical/upstream evidence:** exact outer anchor, URI-as-key layout, root profile declaration, bundle-local identity behavior through fork/copy/merge.

# Residual evidence limits

- The standards support the identity and lifecycle properties, not one exact Markdown/YAML schema.
- OpenAPI provides weak migration precedent; it should not be used to validate O6/O7.
- FHIR's modifier safety is stronger and more domain-specific than normal knowledge metadata; only the processing principle transfers.
- Kubernetes is centralized and online; only its version/storage/deprecation sequence transfers.
- The local source-seam claims in the options artifact were not re-audited during this cross-review; this review addresses standards validity, not code feasibility.
- Upstream OKF issues remain proposals. None establishes a normative profile key, producer prefix, or extension container.

# Source references

- [Frozen standards research](../research/okf-extension-evolution-standards-patterns.md)
- [OKF v0.2 at reviewed commit](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md)
- [FHIR R5 Extensibility](https://hl7.org/fhir/R5/extensibility.html)
- [FHIR R5 Defining Extensions](https://hl7.org/fhir/R5/defining-extensions.html)
- [FHIR R5 Profiling](https://hl7.org/fhir/R5/profiling.html)
- [FHIR R5 Canonical References](https://hl7.org/fhir/R5/references.html)
- [FHIR R5 Version Management](https://hl7.org/fhir/R5/versions.html)
- [OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)
- [Kubernetes API overview](https://kubernetes.io/docs/reference/using-api/)
- [Kubernetes deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
- [Kubernetes CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
- [JSON Schema Draft 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core)
- [Namespaces in XML 1.0, Third Edition](https://www.w3.org/TR/2009/REC-xml-names-20091208/)
- [Architecture of the World Wide Web §4.2](https://www.w3.org/TR/2004/REC-webarch-20041215/#versioning-and-extensibility)

[reviewed options artifact](../designs/okf-extension-evolution-options.md)

[reviews exact artifact](../designs/okf-extension-evolution-options.md)

[applies standards evidence](../research/okf-extension-evolution-standards-patterns.md)
