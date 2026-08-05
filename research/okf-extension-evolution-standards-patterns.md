---
type: Research
title: 'OKF extension evolution: standards patterns'
description: >-
  Primary-source comparison of extension identity, collision control,
  compatibility, and migration patterns relevant to OKF and agentstate-lite.
actor: codex-standards-research
timestamp: '2026-08-05T22:47:22.081Z'
---
# Standards-evolution patterns for OKF extensions

## Decision card

- **What:** Comparative standards research on extension identity, collision control, versioning, and migration in FHIR, OpenAPI, Kubernetes, JSON Schema, and XML Namespaces, interpreted against the current OKF v0.2 contract and agentstate-lite collision taxonomy.
- **Current:** Research artifact frozen independently of the architecture-options artifact. The strongest recurring pattern is a four-part contract: authority-qualified identity, an explicit declaration of supported semantics, operation-specific behavior for unknown material, and a staged migration with observable completion state.
- **Next:** Architecture should choose a concrete OKF serialization and governance model that realizes those four parts, then test it against C1-C14 and agentstate-lite's local-first/CAS constraints.
- **Blocked:** No research blocker. The standards do not supply one transferable syntax; the remaining choices are product-policy choices.
- **How to use:** Read sections 5 and 6 for the synthesis; use sections 1-4 as the evidence trail and section 7 as the decision backlog.

## Research boundary and evidence labels

This artifact compares mechanisms by the problem they solve, not by surface syntax. It does not treat an open issue, a proposal, or an analogy as normative authority.

- **Normative fact** means a requirement or permission stated by a published specification or standards recommendation using its own normative language.
- **Documented platform contract/practice** means an official project's published compatibility or implementation procedure, even where it is not a formal standards-body recommendation.
- **Empirical local fact** means observed behavior or counts from the pinned agentstate-lite audit or upstream issue evidence.
- **Design inference for agentstate-lite** is a conclusion drawn from those sources. It is not a claim that the source standard requires OKF to act the same way.

Collision identifiers C1-C14 refer to `research/okf-extension-evolution-domain-model`:

`C1` exact-coordinate ownership; `C2` value-domain/semantic narrowing; `C3` shape/cardinality; `C4` scope; `C5` Kind/type identity; `C6` reserved location; `C7` representation/parser; `C8` default/absence; `C9` cross-field invariant; `C10` extension graduation/duplication; `C11` multi-contract disagreement; `C12` conformance claim; `C13` migration state; `C14` identifier/authority.

## 1. Source and edition table

All sources were accessed 2026-08-05. Living documentation is identified as such; repository sources are commit-pinned where wording can move.

| ID | Standard / artifact | Edition, status, and date | Primary source and relevant section |
| --- | --- | --- | --- |
| O1 | Open Knowledge Format specification | v0.2 repository specification at commit `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96`, commit dated 2026-07-24; project specification, not a formal standards-body Recommendation | [OKF SPEC.md §§4.1, 5.4, 11-13](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md) |
| O2 | Upstream collision report | Issue #272, opened 2026-08-05; stakeholder and empirical evidence, explicitly non-normative | [knowledge-catalog issue #272](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/272) |
| O3 | Upstream profile proposal | Issue #212, opened 2026-07-20; proposal, explicitly non-normative | [knowledge-catalog issue #212](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/212) |
| O4 | Upstream version-policy report | Issue #239, opened 2026-07-28; issue analysis, explicitly non-normative | [knowledge-catalog issue #239](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/239) |
| O5 | Upstream YAML representation report | Issue #240, opened 2026-07-28; issue analysis, explicitly non-normative | [knowledge-catalog issue #240](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/240) |
| L1 | agentstate-lite compatibility audit | Local Research artifact, head `sha256:edb70d40371d2c6ef4c5c4320f83d7255faeaddb5a7a7c74851b355fd90674ba`, 2026-08-05 | `research/okf-v0-2-compatibility-audit` |
| F1 | HL7 FHIR Extensibility | FHIR R5 5.0.0, published 2023-03-26; FHIR R5 is mixed normative/STU and status is artifact-specific | [Extensibility §§2.1.5.0.2-.3](https://hl7.org/fhir/R5/extensibility.html) |
| F2 | HL7 FHIR Defining Extensions | FHIR R5 5.0.0; cited page marks its own maturity/status and uses normative conformance verbs | [Defining Extensions §2.1.5.1](https://hl7.org/fhir/R5/defining-extensions.html) |
| F3 | HL7 FHIR Profiling | FHIR R5 5.0.0; page-specific maturity/status | [Profiling §§5.1.0.9, .22, .26](https://hl7.org/fhir/R5/profiling.html) |
| F4 | HL7 FHIR Resource model | FHIR R5 5.0.0 | [Resource `meta.profile` §§2.1.27.5.3.7, .9.2](https://hl7.org/fhir/R5/resource.html) |
| F5 | HL7 FHIR References | FHIR R5 5.0.0 | [Canonical references §2.1.3.0.6](https://hl7.org/fhir/R5/references.html) |
| F6 | HL7 FHIR version support | FHIR R5 5.0.0; informative implementation guidance | [Managing FHIR Versions §2.1.8](https://fhir.hl7.org/fhir/versioning.html) |
| F7 | HL7 FHIR release and inter-version policy | FHIR R5 5.0.0; page identifies normative stability rules | [FHIR Version Management §2.1.7, especially .0.7](https://hl7.org/fhir/R5/versions.html) |
| F8 | HL7 FHIR Mapping Language | FHIR R5 5.0.0 | [Mapping Language](https://hl7.org/fhir/R5/mapping-language.html) |
| F9 | HL7 FHIR packages | FHIR R5 5.0.0 | [FHIR Packages](https://hl7.org/fhir/R5/packages.html) |
| A1 | OpenAPI Specification | OAS 3.2.0, published 2025-09-19 | [OAS 3.2.0 §§2.1, 4.1, 5](https://spec.openapis.org/oas/v3.2.0.html) |
| A2 | OpenAPI namespace registry | Official living registry, accessed 2026-08-05 | [OpenAPI Namespace Registry](https://spec.openapis.org/registry/namespace/) |
| K1 | Kubernetes API overview | Official versioned documentation advertising Kubernetes v1.36 at access time; living project documentation | [Kubernetes API Overview: API groups and versioning](https://kubernetes.io/docs/reference/using-api/) |
| K2 | Kubernetes deprecation policy | Official compatibility policy, living documentation for v1.36 at access time | [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) |
| K3 | CRD versioning and conversion | Official implementation procedure, living documentation for v1.36 at access time | [Versions in CustomResourceDefinitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) |
| J1 | JSON Schema Core | Draft 2020-12, 2022-06-16 publication of the 2020-12 meta-schema/vocabulary set | [JSON Schema Core §§4.3.3, 6.5, 8.1-8.2, 9.1.2](https://json-schema.org/draft/2020-12/json-schema-core) |
| X1 | Namespaces in XML 1.0 | Third Edition, W3C Recommendation, 2009-12-08 | [Namespaces in XML 1.0 §§2-6](https://www.w3.org/TR/2009/REC-xml-names-20091208/) |
| X2 | Architecture of the World Wide Web | Volume One, W3C Recommendation, 2004-12-15 | [Web Architecture §4.2: versioning and extensibility](https://www.w3.org/TR/2004/REC-webarch-20041215/#versioning-and-extensibility) |

### Current OKF baseline

**Normative/project-spec fact.** OKF v0.2 permits producer-specific additional keys. Consumers should preserve unknown keys during round trips and must not reject a document merely because it contains unknown fields. Type values are unregistered and unknown types are to be handled generically. `status` is a bare core field with a specified value set, while absence means `stable`. The root index may declare `okf_version`; an unknown version should receive best-effort treatment. [O1 §§4.1, 5.4, 12]

**Normative/project-spec fact.** OKF's stated version rule says minor releases contain backward-compatible additions and major releases may break compatibility. The same v0.2 document also describes deliberate breaking renames from earlier spellings. [O1 §§12-13] Issue #239 records this tension but does not itself change the specification. [O4]

**Empirical local fact.** The pinned agentstate-lite audit concludes that agentstate-lite is a permissive v0.2 reader/transporter but not yet a safe v0.2 author/mutator; generic reads preserve much unfamiliar frontmatter, while semantic writes remain the risk boundary. [L1]

**Empirical upstream issue fact.** Issue #272 reports that agentstate-lite already used `status` with lifecycle meanings outside the newly specified v0.2 value set and frames the broader ownership, compatibility, and migration problem. The issue's counts and recommendations are evidence about an implementation, not additions to the standard. [O2]

**Design inference for agentstate-lite.** The current permissive-unknown-field rule is valuable transport behavior, but it is not an ownership system. A bare key can remain parseable while changing meaning, default behavior, or legal values (C1, C2, C8). Version labels also cannot repair an already ambiguous coordinate unless semantic ownership and conversion are declared separately.

## 2. Per-standard mechanisms

### 2.1 FHIR: canonical definitions, profiles, modifier safety, and explicit inter-version conversion

#### Mechanism A: extension identity is canonical and authority-owned

**Normative fact.** A FHIR extension instance refers through its `url` to a formal `StructureDefinition`. Extension definitions may be published by any authority, and exchange parties must be able to obtain the definition. The root `Extension.url` is fixed to the extension's canonical URL; profiles slice extensions by that URL. Authors are instructed to search for and reuse an existing extension before defining a new one. [F2 §2.1.5.1]

**Normative fact.** FHIR canonical URLs are stable logical identifiers and can be referenced as `url|version`. The version in such a reference is the canonical resource's declared version, not the instance history identifier `meta.versionId`. A canonical URL is not necessarily a network fetch location, and implementations are expected to use registries/caches as part of resolution. If no version is supplied, selection of a version requires policy; canonical resources need not use semantic versioning and can declare a version-comparison algorithm. [F5 §2.1.3.0.6]

**Design inference for agentstate-lite.** A custom Kind or field convention needs a canonical identity that carries or resolves an authority, plus a separately addressable definition version (C1, C5, C14). A friendly YAML key is an alias or serialization coordinate, not sufficient identity. Resolution should prefer bundle-local packaged definitions and caches; using a URI as identity must not make normal use depend on the network.

#### Mechanism B: profiles constrain a base; extensions add content

**Normative fact.** A FHIR profile is a `StructureDefinition` identified by a canonical URL. It constrains an existing base definition; its changes must remain restrictions consistent with that base. Extensions are the mechanism for adding content that the base does not contain. Profiles can specify which extensions are expected or required and can add cardinalities and invariants. [F2 §2.1.5.1; F3 §5.1.0.9]

**Normative fact.** When multiple profiles apply, producers must satisfy their intersection while consumers are advised to support their union. Profiles can be mutually incompatible. `MustSupport` does not have one universal operational meaning; the profile must define what support means in its context. [F3 §§5.1.0.22, .26]

**Design inference for agentstate-lite.** A profile declaration can say which extension definitions, ranges, invariants, and support obligations compose for a bundle (C2-C4, C9, C11). But a profile name alone is not collision-proof field identity, and composition cannot be assumed safe: profile intersections need a compatibility check and an explicit incompatible result.

#### Mechanism C: unknown data behavior is based on semantic hazard and operation

**Normative fact.** FHIR separates ordinary `extension` from `modifierExtension`. A modifier extension changes, qualifies, or negates the meaning of its containing element. Applications that process a resource must check modifier extensions and may recognize them, reject them, limit themselves to rendering, request human review, or warn; they must not silently process affected content as though the modifier were absent. A mover that preserves a complete resource unchanged is not performing that semantic processing. [F1 §2.1.5.0.2]

**Normative fact.** An unknown non-modifier extension should not by itself cause rejection. It should be preserved when possible and may otherwise be ignored. However, when a system semantically modifies an element, FHIR advises removing unknown extensions that the edit may have invalidated rather than blindly retaining a potentially false statement. [F1 §2.1.5.0.3]

**Design inference for agentstate-lite.** Unknown handling should be an operation matrix, not one global flag: lossless read/list/copy can preserve opaque data; an operation may ignore an unknown optional convention if its result cannot depend on it; and a semantic mutation must refuse or explicitly invalidate unknown required semantics that could make the output false (C2, C8, C9, C11). This is more precise than both “reject every unknown thing” and “always preserve everything.”

#### Mechanism D: conformance claims are assertions, not proof

**Normative fact.** FHIR `meta.profile` records claims that an instance conforms to named `StructureDefinition` profiles. Servers can remove claims shown to be invalid and retain claims that are valid or not tested. The specification cautions that a profile tag can be false; applications should inspect or validate content rather than using the tag alone as the source of meaning. [F4 §§2.1.27.5.3.7, .9.2]

**Design inference for agentstate-lite.** A bundle's `profile` or `conforms_to` declaration should select validators and migration logic, but a tool must not infer that constraints hold solely because the declaration exists (C12). Validation results and the declaration are separate state.

#### Mechanism E: maturity and normative stability set different change budgets

**Normative fact.** FHIR assigns maturity and standards status per artifact. Draft and trial-use material can change incompatibly; normative material has stronger inter-version guarantees. Once an artifact is normative, computable identifiers and element names are protected; optional non-modifier elements may be added, and removals or URI changes are constrained. Deprecation precedes withdrawal, and withdrawn labels are not recycled for a different meaning. FHIR's release numbering has its own compatibility rules and is not identical to ordinary semantic versioning. [F7 §2.1.7]

**Design inference for agentstate-lite.** Governance should label the stability of core fields, extension definitions, profiles, and Kind conventions independently. “Versioned” is not enough: each maturity level needs an allowed-change budget, a deprecation period, and a rule that identifiers are never reassigned to unrelated semantics (C1, C2, C5, C10, C14).

#### Mechanism F: inter-version conversion is explicit and can use a lossless side channel

**Normative fact.** FHIR defines version-specific extension URLs to carry elements that cannot otherwise be represented in another release. Use of the corresponding cross-version extension in the same version is an error. Conversion still needs mapping knowledge—such as target cardinality—because an extension URL alone does not encode every transformation rule. FHIR publishes inter-version maps and a mapping language. [F7 §2.1.7.0.7; F8]

**Normative fact.** FHIR interactions are tied to a version, and clients must establish the server's version through its capability statement, media type, or other specified mechanisms. Contradictory version signals are an error rather than an invitation to guess. [F6 §2.1.8]

**Normative fact.** FHIR packages version distributable definitions and dependencies separately from the base standard; package manifests declare package versions and dependencies. [F9]

**Design inference for agentstate-lite.** Migration needs an explicit source contract, target contract, mapping version, and loss policy (C3, C8-C10, C13). When a target cannot express source information, either retain it in a clearly identified compatibility envelope or stop and report loss; never silently coerce. Standard version, profile version, extension-definition version, migration version, and document CAS revision are different axes.

### 2.2 OpenAPI: a reserved lexical extension lane and a namespace registry

#### Mechanism A: extensions occupy a recognizable reserved key pattern

**Normative fact.** OAS 3.2.0 allows specification extensions only where the relevant object says it may be extended. Extension fields begin with `x-` and may carry any JSON value. The `x-oai-` and `x-oas-` prefixes are reserved for OpenAPI Initiative use. The specification recommends extensions for experimentation. [A1 §§4.1, 5]

**Documented platform practice.** The OpenAPI Initiative maintains registries for extension namespaces and other values. A registered namespace lets a family of extension names be associated with an owner more predictably than independent bare `x-foo` keys. [A2]

**Design inference for agentstate-lite.** A visibly reserved extension lane makes custom material easy for people and generic tooling to recognize and prevents future core fields from casually occupying it (C1, C6). Authority-qualified prefixes or a canonical definition carried inside an extension envelope reduce producer-producer collisions (C14). A naked `x-status`, however, merely moves the collision into the extension lane; it does not identify who owns `status` or which semantics/version apply.

#### Mechanism B: standard version and described-API version are distinct

**Normative fact.** An OpenAPI document's required top-level `openapi` field declares the OAS version whose semantics tooling should use to interpret the document. It is distinct from `info.version`, which versions the described API. OAS defines its own major/minor/patch interpretation for the specification. [A1 §§2.1, 4.1]

**Design inference for agentstate-lite.** The OKF dialect version must remain distinct from the version of the knowledge product, Kind definition, extension package, or profile (C5, C12-C14). A single `version` field cannot safely stand for all of them.

#### Limit of the mechanism

**Normative absence / design observation.** OAS specifies the syntax and placement of extension keys but does not provide a general inter-version conversion protocol, unknown-extension preservation guarantee, or semantic composition algebra. [A1 §5]

**Design inference for agentstate-lite.** OpenAPI is evidence for recognizable reserved space and lightweight authority namespaces, not a complete evolution model. Copying only `x-` would address part of C1/C6/C14 while leaving C2-C5 and C8-C13 unresolved.

### 2.3 Kubernetes: group-qualified kinds, concurrently served versions, and storage migration

#### Mechanism A: group, version, and kind form an API identity boundary

**Documented platform contract.** Kubernetes APIs are divided into independently versioned API groups. A resource declares an `apiVersion` such as `example.com/v1` and a `kind`; the legacy core API is a special group. Version names also communicate stability levels such as alpha, beta, and stable. [K1]

**Documented platform contract.** Custom resources are not added as arbitrary fields to built-in resource APIs. A `CustomResourceDefinition` declares its own group, names/kind, and one or more versions. Within a CRD, one and only one version is the storage version while versions can independently be served to clients. [K3]

**Design inference for agentstate-lite.** A Kind's durable identity should be `authority/group + logical kind + definition version`, while a short `kind:` value can remain a resolved alias for ergonomics (C5, C14). Core and custom definitions can then be visibly and mechanically distinct without making human authoring depend on long URIs everywhere.

#### Mechanism B: stability levels control deprecation and removal

**Documented platform contract.** Kubernetes does not allow significant semantic changes or removal of API elements inside the same API version; removal requires a new group version. Its deprecation policy gives stability-specific support windows. Stable APIs remain for the major release; beta APIs receive specified release/time windows and migration instructions; alpha APIs may change or disappear more quickly. Objects must be able to round-trip across API versions served in the same release without information loss. [K2]

**Design inference for agentstate-lite.** Version/maturity rules should state what can change in place, how long old readers/writers remain supported, and what “round trip” means for each operation (C2-C4, C8-C10). A new meaning for an existing name belongs in a new definition version; deprecation documentation and a machine-readable replacement should precede removal.

#### Mechanism C: migration is an observable staged process

**Documented platform practice.** To evolve a CRD, an operator adds a new served version, selects a conversion strategy, migrates clients incrementally, rewrites stored objects to the chosen storage version, stops serving the old version, verifies the old version is absent from `status.storedVersions`, and only then removes it. Merely changing the storage-version flag does not rewrite existing objects: reads can convert to the requested version while stored bytes remain old until a write or migration occurs. [K3]

**Documented platform practice.** Kubernetes permits a no-op conversion only when schemas are equivalent; otherwise a conversion webhook must transform objects. The conversion endpoint is not a validation substitute, and conversion failures can disrupt reads and writes. [K3]

**Design inference for agentstate-lite.** An OKF migration should expose phases such as `declared`, `dual-read`, `new-write`, `rewriting`, `verified`, and `retired`, with counts/checkpoints and a durable list of representations still present (C10, C13). Changing a manifest default is not proof that every document was converted. Reads may project an old document into a new logical view, but only a CAS-protected write changes the stored representation.

#### Rejected direct analogy: live conversion webhooks

**Documented platform fact.** Kubernetes conversion webhooks are online services called by the API server during version conversion. [K3]

**Rejected analogy / design inference for agentstate-lite.** Do **not** copy the webhook architecture. agentstate-lite's ultimate goal requires a local-first, portable bundle that agents can use offline; a network conversion dependency would turn ordinary reads/writes into an availability and trust problem. Transfer the state-machine idea and deterministic conversion contract, but package conversion code/data locally and apply it through resumable CAS writes.

### 2.4 JSON Schema: dialects, vocabularies, required support, and identifier resolution

#### Mechanism A: a dialect declares a set of vocabularies

**Normative fact.** JSON Schema separates a dialect from the vocabularies that supply keyword syntax and semantics. A vocabulary is identified by a URI. A meta-schema's `$vocabulary` object maps vocabulary URIs to booleans: an implementation that does not understand a vocabulary marked `true` must refuse to process the schema; for one marked `false`, it should continue, subject to the specification's fallback behavior. [J1 §§4.3.3, 8.1]

**Normative fact.** `$schema` identifies the dialect/meta-schema for a schema resource and is normally placed at the root. When it is absent, dialect selection is implementation-defined. Vocabulary declarations are collected at the dialect's root rather than implicitly inherited through references. [J1 §8.1]

**Design inference for agentstate-lite.** A bundle profile can explicitly list extension definition URIs and mark each required-for-correct-processing or optional (C6, C11, C12, C14). Unknown required semantics should block the affected validation/mutation operation; unknown optional semantics can remain opaque. Absence of a declaration should not trigger value-based guessing—use a documented default profile or an explicit “undeclared” state.

#### Mechanism B: identifiers are canonical but not assumed fetchable

**Normative fact.** `$id` establishes a canonical URI for a schema resource. The core specification warns that a URI is an identifier and does not imply that implementations should download it; implementations are expected to know or preload URI-to-schema associations. Multiple inconsistent schema resources claiming the same URI should be treated as an error. [J1 §§8.2, 9.1.2]

**Design inference for agentstate-lite.** Authority identifiers and versions should be resolvable from a bundle/package registry without network access, and conflicting definitions for the same canonical coordinate must be a hard definition error (C1, C14). The registry is a resolution mechanism, not the source of identity.

#### Mechanism C: unknown keyword fallback has limits

**Normative fact.** Unknown JSON Schema keywords are generally collected as annotations. Extension keywords are recommended not to begin with `$`, reducing the risk of collision with current or future core keywords. [J1 §6.5]

**Design observation.** Vocabulary URIs identify semantic sets, but ordinary keyword spellings themselves are flat property names. The vocabulary mechanism therefore declares which semantic packages are active; it does not make two contradictory meanings for the same serialized keyword automatically composable. [J1 §§4.3.3, 8.1]

**Design inference for agentstate-lite.** A declaration layer helps detect C11 but cannot repair C1 after two packages write incompatible meanings to the same YAML coordinate. Serialized ownership still needs an unambiguous lane or alias-resolution rule. Composition validation must reject two active definitions that claim the same coordinate incompatibly.

### 2.5 XML Namespaces: expanded names prevent collisions; namespace policy handles evolution

#### Mechanism A: identity is the expanded name, not the prefix

**Normative fact.** XML Namespaces was designed so documents can mix markup vocabularies without name collisions. The durable expanded name is the pair of namespace name (a URI reference) and local name. Prefixes are scoped aliases bound to namespace names; they are not themselves the semantic authority. Namespace names are compared as strings and need not retrieve a schema. [X1 §§2-6]

**Normative fact.** The default namespace applies to unprefixed element names but not unprefixed attribute names. The `xml` and `xmlns` prefixes have reserved meanings. [X1 §§2, 6]

**Design inference for agentstate-lite.** Separate a compact, human-friendly alias from canonical authority-qualified identity (C1, C6, C14). The resolver must define scope and defaults precisely; a convention that visually resembles a namespace but lacks a binding table is only a prefix convention. YAML also has no native expanded-name data model, so OKF would need an explicit envelope, manifest binding, or canonical key convention rather than pretending XML namespace semantics arrive for free.

#### Mechanism B: namespace identity and version policy are separate choices

**Normative Web architecture guidance.** Formats should expose version information. Changing a namespace changes the expanded names and can force broad upgrades; retaining a namespace across compatible additions is viable only when the format has suitable extensibility points and an explicit change policy. Namespace owners should state that policy. [X2 §4.2]

**Design inference for agentstate-lite.** A new canonical namespace/authority is appropriate for an incompatible semantic fork, not every patch. Compatible versions can share a logical identity if definitions carry explicit versions and the authority publishes allowed-change rules (C2-C5, C10, C14). Namespacing prevents collision but does not, by itself, define backward compatibility or migration.

## 3. Implementer evolution workflow

The following is a **cross-standard design inference for agentstate-lite**, not a procedure mandated wholesale by any one source. It synthesizes FHIR's canonical definitions and conversion maps [F2, F5, F7-F9], Kubernetes' served/storage migration sequence [K2-K3], JSON Schema's required/optional vocabulary support [J1], XML's identity/change-policy separation [X1-X2], and OpenAPI's recognizable extension lane [A1-A2].

1. **Inventory and bind identity.** Resolve every active core, profile, Kind, and extension declaration to a canonical authority-qualified logical identifier plus an explicit definition version. Treat contradictory definitions at the same coordinate as an error. Do not classify ownership from values. Addresses C1, C5, C6, C14.
2. **Classify the change.** State whether the change is additive optional data, additive required semantics, restriction, rename/relocation, incompatible semantic change, graduation into core, or retirement. Record stability/maturity and an allowed-change budget. Addresses C2-C5, C8-C10.
3. **Publish the target contract before rewriting data.** Package the new definition, base dependency, profile rules, support requirement, invariants, replacement links, and deterministic conversion mapping locally. Give the migration itself an identifier/version. Addresses C2-C4, C8-C13.
4. **Check composition.** Compute whether all declared profiles/extensions can apply together: no two definitions may own the same serialized coordinate incompatibly; value domains/cardinalities/defaults/invariants must have a satisfiable intersection. Produce an explicit incompatible result instead of precedence-by-order. Addresses C1-C4, C8-C11.
5. **Introduce dual-read, single-write behavior.** Readers recognize old and new representations and expose one logical API. Writers emit the selected target representation only. Unknown optional data is transported; unknown required semantics block only operations whose correctness depends on them. Addresses C2, C8-C11.
6. **Make conversion loss explicit.** Each transform declares source/target versions, preconditions, reversible/irreversible fields, and a policy for information that has no target representation. Preserve such information in a canonical compatibility envelope or stop with a diagnostic; never silently discard it. Addresses C3, C8-C10, C13.
7. **Rewrite with CAS and a durable journal.** Migrate document by document using expected revisions, idempotent conversion, checkpoints, outcome counts, and retryable failures. A changed default or view is not a completed storage migration. Addresses C7, C10, C13.
8. **Verify semantic and representation invariants.** Reparse emitted YAML, validate target definitions and cross-field constraints, confirm round-trip behavior where promised, and audit that no old stored representations remain except explicitly quarantined failures. Addresses C2-C4, C7-C10, C12-C13.
9. **Retire in stages.** Stop old writes, then stop advertising/serving the old version, then remove conversion support only after the journal proves no old stored representation remains and the support window has elapsed. Never reuse the retired identity for another meaning. Addresses C1, C2, C5, C10, C13-C14.

This workflow makes implementer adaptation predictable: adopting a new standard/profile version is a declared compatibility transition with discoverable definitions, not a coordinated flag day or an instruction to “fix invalid values.”

## 4. Failure modes and matched responses

| Failure mode | Why a tempting mechanism is insufficient | Standards evidence | Matched architectural response | Collision classes |
| --- | --- | --- | --- | --- |
| Core later claims an existing custom bare key | Permissive unknown-field handling preserves bytes but cannot distinguish ownership | OKF unknown-field rule [O1]; XML expanded names [X1]; FHIR canonical URLs [F2] | Reserve bare core coordinates; put custom semantics behind authority-qualified identity; make aliases resolvable rather than semantic | C1, C6, C14 |
| Two extensions both use `x-status` | A lexical extension lane distinguishes custom from core, not one custom owner from another | OpenAPI extension syntax and registry [A1-A2] | Authority/group namespace plus canonical definition ID; reject duplicate coordinate claims in one profile | C1, C11, C14 |
| Same key, narrower values or changed default | Namespace alone does not define compatibility | FHIR profile constraints [F3]; Web architecture versioning guidance [X2] | Versioned definition with explicit base, value domain, absence/default semantics, and change classification | C2, C8 |
| Same key, different shape/cardinality/scope | Parsability can hide semantic incompatibility | FHIR profiles/extensions [F2-F3]; Kubernetes new API versions [K2-K3] | New definition version; deterministic mapping; composition satisfiability check; no in-place incompatible mutation | C3, C4, C11 |
| Custom Kind collides with a future core Kind | A short `kind` token has no owner | Kubernetes group/version/kind [K1-K3]; XML expanded names [X1] | Canonical Kind identity = authority/group + logical kind + version; short aliases are manifest-scoped conveniences | C5, C14 |
| YAML parser changes a scalar's type or spelling | Semantic namespaces do not control representation typing | Upstream YAML issue [O5] | Representation profile: quote-sensitive fields, parse/emit/reparse tests, canonicalization and byte/semantic loss diagnostics | C7 |
| Unknown convention affects the correctness of a mutation | Blind preservation can retain a now-false assertion; blanket rejection harms transport | FHIR modifier/non-modifier rules [F1]; JSON Schema required vocabularies [J1] | Operation-specific support requirement: preserve opaque transport; fail closed for affected semantic mutation; allow safe unrelated operations | C2, C8, C9, C11 |
| Extension graduates into core and both spellings coexist | Namespacing prevents initial collision but not duplicate truth | FHIR deprecation/identifier stability [F7]; Kubernetes storage migration [K2-K3] | Published replacement relation, one logical API, dual-read/single-write, conflict diagnostic when values disagree, staged retirement | C1, C10, C13 |
| Two profiles are each valid alone but incompatible together | A list of profile names does not imply a satisfiable intersection | FHIR multiple-profile rules [F3]; JSON Schema dialect/vocabulary declarations [J1] | Validate composed constraints and coordinate ownership; report incompatibility without order-dependent precedence | C2-C4, C8-C11 |
| Bundle declares conformance but data does not conform | Metadata claims are not proof | FHIR `meta.profile` caveat [F4] | Declaration selects validators; signed/dated validation evidence records actual result; mutators revalidate affected invariants | C12 |
| Default changes, but old objects remain stored | Serving/projecting the new form is not a storage migration | Kubernetes CRD storage-version procedure [K3] | Durable migration journal, stored-version audit, CAS rewrite, retirement gate | C10, C13 |
| Canonical URI is unavailable on the network | Treating identity as a locator creates availability failure | FHIR canonical resolution [F5]; JSON Schema identifiers [J1]; XML namespace names [X1] | Bundle/package registry and cache; network retrieval optional and policy-controlled; content digest can verify cached definition | C12, C14 |
| Two incompatible definitions claim the same URI/version | Registries cannot safely choose by arrival order | FHIR duplicate canonical coordinate guidance [F5]; JSON Schema duplicate identifier guidance [J1] | Hard definition-integrity error; require a new version/identity and preserve provenance | C1, C12, C14 |
| Migration cannot represent a source value in target | A rename script can silently lose information | FHIR cross-version extensions and mapping requirements [F7-F8] | Explicit loss map; compatibility envelope or stop; verification report and reversibility classification | C3, C8-C10, C13 |

### Rejected analogy: FHIR `modifierExtension` as a wholesale OKF feature

**Normative fact.** FHIR's modifier machinery is tied to safety-critical interpretation of a strongly defined healthcare resource model and imposes special obligations on processors. [F1]

**Rejected analogy / design inference for agentstate-lite.** Do **not** reproduce `modifierExtension` as an unrestricted author-selected YAML marker. That would let any custom field disable generic tooling and would be difficult for Markdown-first consumers to enforce consistently. Transfer the narrower principle: a versioned profile/extension definition—not an instance's self-assertion—declares which operations require understanding, and tools fail closed only for the affected semantic operation. Plain transport and inspection should remain possible.

## 5. Cross-standard pattern table

| Cross-standard pattern | Independent evidence | What it solves | What it does not solve | Design inference for agentstate-lite | C classes |
| --- | --- | --- | --- | --- | --- |
| Authority-qualified canonical identity, compact alias separate | FHIR canonical URLs [F2, F5]; Kubernetes API groups [K1-K3]; XML expanded names [X1]; JSON Schema URIs [J1] | Core/custom and producer/producer collision; durable reference | Semantic compatibility between versions | Give Kind/profile/extension definitions canonical `(authority, logical-id, version)` identities; resolve short aliases through manifest bindings | C1, C5, C6, C14 |
| Reserved extension lane | OpenAPI `x-` [A1]; XML reserved namespace bindings [X1]; JSON Schema advice around `$` [J1] | Recognizability; protection of core name space | Ownership among extensions; migration | Reserve a mechanically detectable custom envelope/location and reserve bare core fields for OKF | C1, C6 |
| Contract/declaration layer | FHIR profiles [F3-F4]; JSON Schema dialect/vocabulary declarations [J1]; OpenAPI `openapi` version [A1] | Selects semantics, validators, required capabilities | Proves that instances conform | Bundle manifest/profile declares base OKF version, active extensions/profiles, versions, required support; validate rather than trust | C2-C4, C8-C12 |
| Required vs optional unknown semantics | FHIR modifier/non-modifier behavior [F1]; JSON Schema `$vocabulary` booleans [J1] | Safe forward compatibility without blanket rejection | Exact operation policy unless specified | Define behavior per operation: transport, inspect, validate, mutate, migrate, export | C2, C8, C9, C11 |
| Separate version axes | FHIR canonical resource vs instance version [F5, F9]; OpenAPI spec vs API version [A1]; Kubernetes group version vs stored object revision [K1-K3] | Prevents one overloaded version from selecting multiple contracts | Version comparison rules | Distinguish OKF dialect, profile, extension/Kind schema, migration, logical product, and document CAS revision | C5, C10, C12-C14 |
| Stability-specific change budget | FHIR maturity/normative policy [F7]; Kubernetes alpha/beta/GA policy [K2]; Web architecture namespace policy [X2] | Predictable evolution and deprecation | Actual conversion | Publish allowed changes, support windows, replacement links, and never-reuse rules by maturity | C1-C5, C8, C10, C14 |
| Explicit conversion mapping | FHIR inter-version maps [F7-F8]; Kubernetes CRD conversion [K3] | Renames, reshaping, loss accounting | Proves all stored objects changed | Package deterministic mappings with source/target/mapping versions and loss policy | C2-C4, C8-C10, C13 |
| Dual-read, single-write, then retire | Kubernetes served/storage sequence [K3]; FHIR version-aware interaction [F6-F7] | Incremental adoption without flag day | Completion if storage is not audited | Present one logical API, emit target form, migrate stored documents, gate retirement on an audit | C10, C13 |
| Identity URI is not a network dependency | FHIR canonical resolution [F5]; JSON Schema `$id` [J1]; XML namespace URI [X1] | Portable stable identity | Definition distribution and trust | Store/cache definition packages locally; optional fetch; record digest/provenance | C12, C14 |
| Conformance assertion separate from validation | FHIR `meta.profile` [F4]; JSON Schema dialect selection vs processing [J1] | Avoids trusting self-declared compatibility | Validation cost | Declaration chooses contract; validation artifact records evidence; mutation invalidates/recomputes affected evidence | C9, C12 |
| Composition is explicit and may fail | FHIR multiple profiles [F3]; JSON Schema vocabulary sets [J1] | Multi-contract reasoning | Automatically reconciles incompatible coordinates | Check ownership and constraint intersection; reject unsatisfiable combinations; never use list order as precedence | C1-C4, C8-C11 |
| Migration completion is observable state | Kubernetes `storedVersions` and staged CRD evolution [K3] | Prevents premature retirement and mixed-storage ambiguity | Offline local implementation details | Store phase, counts, checkpoints, failures, source/target, CAS heads; migration is resumable and idempotent | C10, C13 |

### Overall architectural implication

**Design inference for agentstate-lite.** The comparison supports a layered answer rather than choosing “namespaces” or “migrations” alone:

1. **Identity layer:** core owns reserved bare coordinates; custom Kind/convention identity is authority-qualified and versioned; short names remain aliases.
2. **Contract layer:** a profile/manifest declares the base OKF version, active definitions, aliases, version constraints, invariants, and required/optional support.
3. **Operation layer:** unknown behavior is defined for transport, inspection, validation, semantic mutation, migration, and export separately.
4. **Evolution layer:** change classification, stability policy, deterministic mappings, dual-read/single-write, CAS rewrites, verification, and staged retirement.

None of the four replaces another. Identity prevents many collisions; the contract detects semantic disagreement; operation rules protect generic tools; migration resolves already-stored divergence.

## 6. Applicability and non-applicability to Markdown/YAML OKF

### Directly applicable

- **Design inference for agentstate-lite — canonical identity:** URIs/authority groups are representation-neutral. They can identify Kind, profile, and extension definitions even when instances remain Markdown with YAML frontmatter. Applicable to C1, C5, C14.
- **Design inference for agentstate-lite — compact aliases:** Human-friendly `kind:` values and short extension handles can be manifest-scoped aliases resolved to canonical identities, preserving ergonomics while making ownership deterministic. Applicable to C5, C14.
- **Design inference for agentstate-lite — reserved envelope:** YAML can provide a dedicated mapping or otherwise mechanically reserved location for extensions. This makes custom data recognizable and keeps future core fields out of that lane. The exact spelling is an architecture choice. Applicable to C1, C6.
- **Design inference for agentstate-lite — local definition packages:** FHIR/JSON Schema/XML all separate URI identity from network location. OKF bundles can carry cached definitions, profile metadata, migration maps, and digests under ordinary files. Applicable to C12, C14.
- **Design inference for agentstate-lite — profiles and support declarations:** A root manifest can select a dialect/profile and list required/optional extensions without changing Markdown bodies. Applicable to C2-C4, C8-C12.
- **Design inference for agentstate-lite — staged local migration:** Kubernetes' lifecycle maps well to repository files when conversion is deterministic, resumable, CAS-protected, and journaled rather than implemented as a live service. Applicable to C10, C13.
- **Design inference for agentstate-lite — validation at semantic write seams:** The local audit already identifies semantic mutation, not generic reading, as the main danger. Required-support and invariant checks can therefore concentrate on operations that change meaning. [L1] Applicable to C2, C8-C12.

### Applicable only after adaptation

- **FHIR modifier safety:** Keep the operation-specific fail-closed principle, but derive required support from trusted definitions/profiles and scope it to affected operations. Do not grant an arbitrary instance field global veto power.
- **Kubernetes served/storage versions:** Reinterpret “served” as readable/projectable logical versions and “storage” as the actual frontmatter representation. Use local packages and CLI transforms rather than an API server/webhook.
- **JSON Schema vocabularies:** Use vocabulary-like declarations for capability negotiation, but also add serialized-coordinate ownership checks because YAML keys remain flat.
- **XML namespaces:** Use the separation between canonical expanded identity and aliases; do not imitate prefixes without explicit bindings and scope. Be careful that YAML defaulting and merge behavior are different from XML namespace processing.
- **OpenAPI `x-`:** A visible marker is useful, but only in combination with an authority-qualified identity and versioned definition.

### Not directly applicable

- **Always-online definition discovery or conversion** conflicts with local-first operation and is unnecessary for URI-based identity.
- **FHIR's domain-specific clinical-safety obligations and narrative fallback** cannot be copied as universal OKF rules; OKF operations and risks differ.
- **Kubernetes' central API-server admission, etcd storage, and conversion webhook topology** is the wrong deployment architecture for a portable repository bundle.
- **XML prefix syntax as identity** is explicitly the wrong lesson even for XML, where prefixes are aliases. In YAML it would be even less well-founded without a binding mechanism.
- **OpenAPI extension syntax alone** is too weak to manage semantic changes or stored-data migration.
- **Assuming semantic versioning universally** is not supported by the comparators: FHIR defines its own release rules and canonical resources can use different version algorithms. agentstate-lite needs declared comparison/compatibility policy, not just dotted numbers. [F5, F7]

### Minimal architecture properties implied by the research

These are **design inferences for agentstate-lite**, deliberately short of prescribing exact YAML:

1. Core field/Kind names and the extension lane are disjoint by rule.
2. Every non-core semantic definition has an authority-qualified, immutable logical identity and explicit definition version.
3. Aliases are scoped bindings; they are never the ultimate identity.
4. A profile manifest declares base, active definitions, required support, version constraints, and composition rules.
5. Unknown behavior is operation-specific and defaults to safe transport plus fail-closed affected mutation.
6. Definition identity is resolvable offline; conflicting content at one identity/version is an error.
7. Changes have maturity-specific compatibility budgets and machine-readable replacements.
8. Migrations are versioned, deterministic, loss-aware, idempotent, CAS-protected, resumable, and observable to completion.
9. Conformance declarations select validation; they do not substitute for validation evidence.
10. Graduation from extension to core uses an explicit equivalence/replacement relation and a dual-read/single-write retirement sequence.

## 7. Unresolved questions

These are architecture/governance decisions that the cited standards illuminate but do not decide for OKF.

1. **Canonical syntax:** Should an extension value live under one reserved `extensions` mapping, in authority-qualified top-level keys, or in both a canonical form and authoring sugar? The answer should be tested for YAML parser portability and Markdown readability (C1, C6, C7, C14).
2. **Authority format:** Is authority a reverse-DNS name, URI, package coordinate, public-key-derived identifier, or a permitted set? How are authority transfers and abandoned authorities handled (C14)?
3. **Version binding:** Must every instance name an exact definition version, may profiles pin compatible ranges, or may aliases resolve through a lockfile? What is the offline deterministic resolution order (C12-C14)?
4. **Core vs custom Kind ergonomics:** Should core aliases be bare and custom aliases visibly qualified, or may a profile bind both to short names while tooling displays provenance? What ambiguity is acceptable at authoring time (C5, C14)?
5. **Required-support vocabulary:** Which operations are standardized—read, copy, index, validate, mutate field, mutate body, migrate, export—and how does a definition declare that an unknown convention affects each one (C2, C8, C9, C11)?
6. **Composition algebra:** Which constraints admit mechanical intersection, and which require a declared incompatibility? How are cross-field invariants referenced without executable-code supply-chain risk (C2-C4, C8-C11)?
7. **Graduation ownership:** Who declares that a custom definition and new core definition are equivalent or transformable? Can core publish the mapping without control of the original authority (C1, C10, C14)?
8. **Migration compatibility envelope:** Where should data that cannot yet be expressed in the target live, and which tools are obligated to preserve or surface it (C3, C8-C10, C13)?
9. **Trust and integrity:** Are definition packages signed, content-addressed, registry-reviewed, or merely provenance-recorded? What should happen when canonical identity matches but digest differs (C12, C14)?
10. **Support windows:** Which maturity levels exist for OKF core, community definitions, and local definitions, and what minimum deprecation window applies to each (C1-C5, C10)?
11. **Mixed bundles:** May a bundle contain documents governed by different profiles/dialects, or is one root profile authoritative? If mixed, where is the per-document binding and how is cross-link behavior defined (C4, C11-C12)?
12. **Legacy inference:** For pre-declaration bundles, what one-time import process maps ambiguous bare keys to explicit identities? Research strongly argues against continuous value-based guessing, but a user-confirmed migration inventory may still be needed (C1-C5, C8, C13-C14).

## 8. Confidence and evidence limits

| Finding | Confidence | Basis | Limit |
| --- | --- | --- | --- |
| Authority-qualified identity plus separate aliases is the most consistently supported collision-prevention pattern | **High** | Independent normative/project mechanisms in FHIR [F2, F5], Kubernetes [K1-K3], JSON Schema [J1], XML [X1] | Exact YAML representation remains an OKF design choice |
| A reserved custom lane should be paired with authority identity | **High** | OpenAPI demonstrates the lane [A1-A2]; FHIR/XML/Kubernetes demonstrate owner-qualified identity [F2, K1-K3, X1] | No comparator proves one best spelling for Markdown frontmatter |
| Unknown handling should depend on required semantics and operation | **High** | FHIR modifier/non-modifier rules [F1] and JSON Schema required/optional vocabulary declarations [J1] converge | OKF still must define its operation taxonomy and trust boundary |
| Conformance declaration must not be treated as proof | **High** | Direct FHIR warning [F4], reinforced by schema-processing separation [J1] | Validation evidence format is undecided |
| Multiple contracts need explicit compatibility/intersection checks | **High** | FHIR documents intersections/incompatibility [F3]; JSON Schema explicitly declares vocabulary sets [J1] | General satisfiability may require convention-specific validators |
| Dual-read/single-write plus observable stored migration is appropriate for OKF | **High** for lifecycle, **Medium** for exact phases | Kubernetes provides detailed official procedure [K3]; FHIR provides version-aware conversion [F6-F8] | Repository files lack a central server, so state and concurrency mechanisms must be adapted |
| URI identity can remain local-first | **High** | FHIR, JSON Schema, and XML explicitly separate identity from retrieval [F5, J1, X1] | Trust/distribution of cached definitions needs policy |
| Maturity-specific change budgets reduce implementer surprise | **High** | FHIR and Kubernetes publish different guarantees by stability [F7, K2]; Web architecture asks for namespace change policy [X2] | Appropriate OKF timelines and governance authority are undecided |
| A compatibility envelope is preferable to silent data loss | **High** as safety principle, **Medium** for its OKF form | FHIR cross-version extensions and explicit maps [F7-F8] | Envelope syntax, lifecycle, and user experience need prototyping |
| Existing agentstate-lite architecture can concentrate enforcement at semantic write seams | **Medium-High** | Pinned local compatibility audit [L1] | This research did not independently re-run the audit or inspect every mutator |

### Evidence gaps

- OpenAPI's mechanism is intentionally narrow; it offers little primary guidance on stored-instance migration or preservation of unknown extension values.
- Kubernetes documentation is living and versioned by the documentation site rather than commit-pinned here; the relevant lifecycle contract is clear, but future readers should re-check the advertised Kubernetes release.
- FHIR R5 has artifact-specific standards status. This artifact relies on the cited requirements and guidance, not on a claim that every FHIR page is uniformly normative.
- The local empirical finding is pinned to `research/okf-v0-2-compatibility-audit`; no new code-path inventory or mutation test was part of this subtask.
- No comparator eliminates governance: authority allocation, trust, support windows, and conflict adjudication remain policy decisions even when the technical identity model is sound.

## Frozen research conclusion

**Design inference for agentstate-lite.** The recommended standards-derived direction is not merely to prefix custom fields. Establish authority-qualified, versioned identities for custom Kinds and conventions; reserve a recognizable extension lane separate from OKF core; bind ergonomic aliases through an explicit profile/manifest; declare required versus optional support by operation; and manage every incompatible change or graduation through a staged, loss-aware, CAS-journaled migration. This combination maps across C1-C14 and preserves generic/local-first use. Prefix-only schemes, declaration-only profiles, and migration-only cleanup each leave major collision classes unaddressed.

[uses collision taxonomy](okf-extension-evolution-domain-model.md)

[fulfills research stage S1](../plans/okf-extension-evolution-architecture.md)
