---
type: Review
title: Standards-pattern applicability to agentstate-lite
description: >-
  Exact-version cross-review of standards evolution patterns against
  agentstate-lite architecture and collision taxonomy
actor: codex-okf-architect
timestamp: '2026-08-05T22:52:03.874Z'
---
# Review decision card

- **Target:** [OKF extension evolution: standards patterns](../research/okf-extension-evolution-standards-patterns.md) at exact version `sha256:77dfcfd41704372d5b36c41cf74055de8f609719de2c5fbc83beddb871040c6b`.
- **Comparator:** [OKF extension-evolution architecture options](../designs/okf-extension-evolution-options.md) at `sha256:6574d4daf58f6c9d73fdb64c1dc6a794ecb8da281389825c6003ccef2dc767c1`, plus source at `164ba7edb89c31678856020ee794f80530e6c276`.
- **Verdict:** **PASS WITH CAVEATS**. The standards artifact is accurate, appropriately evidence-labeled, covers all C1–C14 classes, rejects the most dangerous direct analogies, and strongly supports the independent architecture backbone. No blocking research defect survives.
- **Required synthesis action:** adopt the four-layer pattern, but add the local controls in findings A1–A9. In particular, a profile cannot protect an unaware consumer, CAS alone cannot stop a fresh legacy writer during migration, and a canonical semantic ID must remain distinct from its definition version.
- **Next:** parent synthesis should consume S1, S2, and this review as separate evidence: standards mechanisms, local options, and applicability constraints.

# Purpose and review method

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: determine whether the independently researched standards patterns transfer safely into agentstate-lite's Markdown/YAML, local-first, multi-agent architecture and identify constraints the final recommendation must add.

The review read the exact frozen artifact in full and checked:

1. the normative/practice/inference labels and rejected analogies;
2. the claimed transfer to current OKF and agentstate-lite;
3. every C1–C14 class;
4. generic OKF consumers unaware of profiles/extensions;
5. offline definition and conversion resolution;
6. current single parser, Kind registry, recipe pipeline, and shared mutation/CAS authority;
7. new authoring, installed-base, mixed/interrupted migration, and governance burden.

This is an applicability review, not a re-research of FHIR, OpenAPI, Kubernetes, JSON Schema, or XML, and it does not modify S1's artifact.

# Overall assessment

The artifact's central conclusion survives: mature standards do not offer one transferable syntax, but repeatedly separate **authority-qualified identity**, **declared active semantics**, **operation-specific unknown behavior**, and **explicit observable evolution**. This is materially stronger than “prefix custom keys” and aligns independently with S2's qualified identities, isolated envelope, logical-to-wire mapping, and migration catalog.

The research is unusually disciplined about analogy limits. It explicitly rejects live Kubernetes conversion webhooks, unrestricted FHIR-like modifier flags, XML prefixes as identity, OpenAPI `x-` as a complete evolution model, universal semantic-version assumptions, and network-dependent URI resolution. Those rejections make the evidence applicable to a local-first Markdown bundle instead of importing the comparators' deployment architectures.

The caveats are primarily **synthesis constraints**, not corrections to the evidence. S1 correctly leaves exact YAML, profile declaration, authority policy, and local migration mechanics undecided. The final recommendation must close those choices enough that future agents do not reintroduce ambiguity.

# Findings

No blocking finding remains.

| ID | Severity | Label | Finding | Consequence | Required synthesis constraint | C classes |
| --- | --- | --- | --- | --- | --- | --- |
| **A1** | High | Reasoned | The artifact supports a reserved extension lane and profiles, but current OKF v0.2 does not normatively reserve an extension container or permit arbitrary root-index profile metadata. A profile-aware tool can understand an overloaded key while a profile-unaware v0.2 consumer still applies core meaning. | Treating `okf_profile` or a manifest as the collision boundary would leave `status: todo` unsafe. A provisional `x-` anchor can also be claimed by future core unless upstream reserves a lane. | Profiles select validation/composition/mappings only. The target wire must keep producer meaning out of core coordinates. Until upstream defines a lane, use a visibly producer-owned anchor and record it as provisional/migratable; do not add profile keys to root-index frontmatter under an unsupported normative claim. | C1, C4, C6, C10, C12 |
| **A2** | High | Reasoned | S1 transfers Kubernetes' staged migration and adds CAS, but CAS protects a stale document revision—not the semantic contract used by a fresh concurrent writer. A legacy writer can read the newly converted head and validly reintroduce the old coordinate unless every write surface is gated or migration-aware. | Per-document CAS alone does not contain mixed/interrupted migration in a multi-agent bundle. Changing the advertised target early also exposes remaining `status: todo` documents to generic v0.2 interpretation. | CAS-enter a persisted migration/write-gated mode recognized by all current mutation surfaces. Normal semantic writes remain blocked or use the exact migration-aware registry until verification. Transform source-only → target-only in one CAS write; flip root `okf_version`/active contract last; unblock only after a complete no-legacy/no-dual-truth scan. | C10, C12, C13 |
| **A3** | Medium | Reasoned | The artifact usually separates canonical identity from version, but some Kubernetes-derived wording calls `authority/group + logical kind + definition version` the durable Kind identity. Those must be two related coordinates: stable semantic identity and exact versioned definition. | Folding version into identity makes compatible evolution, replacement, equality, and graduation harder to state and risks treating every revision as an unrelated Kind. | Define `semantic_id` as stable and authority-owned; define exact definition coordinate as `(semantic_id, definition_version, digest)`. Alias, wire token, profile version, migration version, implementation version, and document CAS revision remain separate. | C2, C5, C10, C12–C14 |
| **A4** | Medium | Empirical | S1 correctly identifies C7, but a “representation profile” cannot itself preserve shape. Current `frontmatter.ts` is the single YAML parser and normalizes top-level YAML `Date` values; the pinned audit demonstrates date-only/datetime loss and nested normalization effects on mutation. | An envelope or mapping could still corrupt opaque or target data on parse/serialize. Exact lexical round-trip is also stronger than the current document model can promise. | Repair and fixture the one parser/serializer before migration. State capability precisely: raw byte transport can preserve bytes; semantic mutation must preserve scalar/object/list and date-only/datetime shapes or fail; do not claim quote/comment/key-order fidelity after parsed mutation unless directly proven. | C3, C7, C12, C13 |
| **A5** | Medium | Reasoned | “Every non-core definition has an authority-qualified identity” is correct for portable semantics but disproportionate if it forces every bundle-local convention to mint a globally credible URI and publisher/version regime. | Local users could be pushed toward fake global identifiers or excessive registry governance, undermining bundle-local experimentation and recipe ergonomics. | Use two explicit tiers: portable IDs use durable authority URIs/package coordinates and pinned definitions; bundle-local IDs are scoped to a bundle contract plus convention document and make no cross-bundle claim. Graduation mints a new portable ID with explicit equivalence/migration. | C5, C11, C14 |
| **A6** | Medium | Reasoned | S1 recognizes executable-code supply-chain risk but leaves the mapping/invariant execution model open. Local availability does not imply trust: a bundle-authored profile could otherwise inject code into semantic reads/writes or migration. | A seemingly offline-safe registry could become an execution authority outside the View trust model and shared mutation boundary. | Initial mappings, shape codecs, and constraint intersection should be declarative. Any executable validator/converter must be shipped/trusted code or require an explicit trust decision with exact-byte/digest identity; it still executes behind the shared mutation/migration authority, never from the parser or backend. | C3, C9, C11–C14 |
| **A7** | Medium | Empirical | S1 proposes ordinary packaged files for definitions and manifests. Current semantics, however, compile once through `loadKinds`; recipes have install identity/version but do not confer Kind semantic authority, and first-by-id duplicate `governs` is only tolerant discovery behavior. | Adding a separate profile loader, schema engine, or migration registry would violate the one-registry invariant and could create conflicting precedence rules. | Extend one compiled semantic/Kind registry with canonical IDs, aliases, mappings, profile dependencies, capabilities, and collision findings. Recipes only deliver pinned definitions. Portable semantic conflicts fail compilation; install/path order never becomes precedence. | C1–C6, C8–C12, C14 |
| **A8** | Medium | Reasoned | S1's compatibility envelope is a valid loss-avoidance pattern, but unless its authority is constrained it can become a second live representation indefinitely. | A target document could carry a core value plus an opaque legacy value with unresolved disagreement, recreating C10/C13 under a safer-looking name. | A compatibility envelope is archival/quarantined source information or an explicit unsupported-loss record, not equal logical authority. The active mapping declares which representation is writable and authoritative. Graduation/migration remains dual-read and single-write; conflict prevents completion. | C3, C8–C10, C13 |
| **A9** | Low | Reasoned | The distinction between conformance assertion and proof survives, but “signed/dated validation evidence” is more mechanism than the present decision needs and must not be conflated with OKF v0.2 `verified`, whose semantics concern content verification. | Prematurely standardizing a signature/evidence system adds governance and could create another cross-field collision or false trust signal. | Require validation result, target contract, tool/version, time, and affected document revision in migration/test receipts. Defer signatures and do not reuse `verified` for schema/profile validation without a separate upstream/product decision. | C9, C12 |

# Collision coverage audit

| Class | S1 coverage | Applicability judgment for agentstate-lite |
| --- | --- | --- |
| **C1 exact coordinate** | Strong: canonical identity, reserved lane, profile composition, no value guessing. | **Pass with A1/A7:** final wire must actually be disjoint for unaware consumers, and one registry must compile ownership. |
| **C2 semantic narrowing** | Strong: versioned definitions, change classification, constraint intersection, explicit maps. | **Pass with A3:** semantic identity and definition version must remain separate. |
| **C3 shape/cardinality** | Strong: FHIR profiles/maps, compatibility envelope, loss accounting. | **Pass with A4/A6/A8:** declarative codecs, parser fidelity, and envelope non-authority must be explicit. |
| **C4 scope** | Strong: qualified identities and profile composition. | **Pass with A1/A7:** context/profile does not license core-coordinate overload; compiler owns scope. |
| **C5 Kind/type identity** | Strong: Kubernetes group/version/kind and XML/FHIR identity/alias separation. | **Pass with caveat:** portable custom Kinds should serialize a visibly qualified `type` token or otherwise keep generic `type` collision unambiguous; a profile-scoped short wire alias alone is unsafe for an unaware future core-type consumer. |
| **C6 reserved location** | Strong: OpenAPI lane, namespace rules, registry inventory. | **Pass with A1:** provisional outer anchor needs a compatibility/migration story until OKF reserves it. |
| **C7 representation/parser** | Covered explicitly and not falsely attributed to namespaces. | **Pass with A4:** enforcement belongs in the one parser/serializer plus fixtures, not only a profile declaration. |
| **C8 default/absence** | Strong: versioned contracts, required support, explicit transforms. | **Pass:** mapping descriptors must model missing/null/default distinctly. |
| **C9 cross-field invariant** | Strong: operation-specific unknown semantics, mutation revalidation, constraint composition. | **Pass with A6/A9:** declarative/trusted invariant enforcement at shared mutation; validation proof distinct from `verified`. |
| **C10 graduation/duplication** | Strong: replacement relation, dual-read/single-write, staged retirement. | **Pass with A2/A8:** root flip and write gate prevent migration mechanics from creating dual truth. |
| **C11 multi-contract** | Strong: FHIR intersection/union limits, JSON Schema vocabularies, explicit incompatible outcome. | **Pass with A5–A7:** local vs portable tiers, trusted definitions, one compiler, no order precedence. |
| **C12 conformance claim** | Strong: declaration is not proof, required/optional support, distinct version axes. | **Pass with A1/A3/A4/A9:** writer capability remains operation-specific and evidence must name exact document revision. |
| **C13 migration state** | Strong: observable phases, CAS journal, stored-representation audit. | **Pass with A2/A8:** CAS is necessary but not sufficient; normal writers must be gated and root contract flips last. |
| **C14 identifier/authority** | Strong: URI/group identity, offline resolution, digest conflict, authority-policy questions. | **Pass with A3/A5/A6:** stable ID vs version, local tier, and trust boundary are final-design requirements. |

All C1–C14 classes are addressed. The review found no omitted collision class, but A1–A9 constrain the exact transferred mechanisms.

# Required synthesis constraints

The parent recommendation should treat these as acceptance gates:

1. **Choose an unaware-consumer-safe wire target.** `status` under v0.2 is OKF lifecycle only. Portable custom Kind `type` values should be visibly qualified. Profiles never authorize alternate core meaning.
2. **Make the extension anchor provisional or normative.** If upstream reserves a container/prefix, use it. Otherwise use a producer-owned anchor with explicit compatibility-ledger coverage and a future relocation mapping.
3. **Keep identity axes separate.** Stable semantic ID, definition version/digest, wire coordinate, alias, profile version, recipe identity, migration version, implementation version, and document CAS revision are distinct.
4. **Support local and portable definitions differently.** Local scope is explicit and lightweight; portable scope pays the authority/version/digest governance cost.
5. **Resolve fully offline.** Exact bundled or shipped definition first; optional network discovery only. Same ID/version with a different digest is a hard definition error.
6. **Compile one registry.** It owns identity, aliases, coordinates, profile composition, required capabilities, conflict diagnostics, and mappings. Parser and storage remain unaware.
7. **Default mappings to declarative.** No bundle-provided executable code enters read/write/migration authority without an explicit trust mechanism.
8. **Prove affected-operation safety.** Unknown optional data is opaque-preserved. Unknown required semantics block semantic operations unless the compiled dependency model proves the operation cannot invalidate them. Given current whole-document serialization and C7, default conservative until that proof exists.
9. **Gate migration globally enough to stop fresh legacy writes.** Use the shared mutation boundary, checkpoint exact revisions, transform source-only to target-only, verify, flip root contract last, then unblock.
10. **Treat compatibility data as nonauthoritative.** It prevents loss; it does not become a second writable truth. Lossy/manual migrations remain explicit.
11. **Keep validation evidence proportionate.** Receipts and test fixtures precede signatures or new trust metadata. Do not overload OKF `verified`.

# Claims that survived review

1. **Evidence discipline survived.** Normative facts, official implementation practices, local facts, and agentstate inferences are consistently separated. Open OKF issues are never promoted to standard rules.
2. **Canonical identity + scoped alias survived.** This is strongly supported across independent standards and solves problems current bare `governs`/field strings cannot.
3. **Reserved/recognizable extension lane + authority identity survived.** S1 correctly rejects a naked prefix as sufficient.
4. **Profiles as composition/validation, not proof or identity, survived.** This aligns with the profile-unaware consumer attack.
5. **Operation-specific unknown handling survived.** Safe transport, interpretation, mutation, migration, and export are correctly distinct. The narrower fail-closed transfer from FHIR/JSON Schema is appropriate.
6. **URI identity without network dependency survived.** Bundled definitions, caches, exact versions/digests, and optional retrieval fit local-first operation.
7. **Explicit composition failure survived.** Two valid contracts need not compose; no last-installed/first-by-path precedence is acceptable.
8. **Dual-read/single-write with observable migration survived.** Kubernetes/FHIR provide strong lifecycle evidence, while S1 correctly rejects online webhook topology.
9. **Loss-aware conversion survived.** Silent coercion/deletion is rejected; mappings need source/target/version/preconditions and verification.
10. **Maturity/change budgets and never-reuse identity survived.** These reduce future manual judgment without requiring OKF to copy another standard's release numbering.
11. **Rejected analogies survived.** No unrestricted `modifierExtension`, live conversion service, fake XML namespace prefix, OpenAPI-only answer, or universal semantic-version assumption should enter the final design.

# Consequence for the preliminary S2 recommendation

S1 substantially confirms S2's layered recommendation rather than displacing it:

- O4 qualified identities is independently supported by FHIR canonical URLs, Kubernetes groups, XML expanded names, and JSON Schema IDs.
- O3's nested envelope is a plausible reserved-lane realization, but its exact outer spelling remains medium-confidence until upstream and empirical YAML/tooling evidence settle it.
- O5 profiles are valuable for dependency/composition/capability declarations but remain unsafe as the sole wire-collision mechanism.
- O6 logical-to-wire mappings are the local implementation of explicit conversion maps and versioned storage representations.
- O7's migration catalog must add the A2 write gate and final root flip to the generic staged lifecycle.
- O0/O1 remain the correct immediate posture because the durable mechanism is not implemented and current source still accepts arbitrary writer version claims.

The combined insight that neither artifact establishes alone is: **Kubernetes-style observable migration must be tightened for an offline multi-agent repository because there is no central API server to prevent a fresh legacy writer from reintroducing source semantics. The existing shared `mutateDocument` authority is therefore not merely an implementation convenience; it is the local substitute for admission control.**

# Confidence

- **Verdict confidence: high.** The target version was exact; the evidence labels and C1–C14 coverage are explicit; the local source seams are concrete.
- **High confidence findings:** A1, A2, and the one-registry/profile-unaware requirements. They follow directly from current OKF semantics and the mutation topology.
- **Medium confidence findings:** exact identity/version field model, local identity syntax, trust mechanism, and envelope authority. These are product-policy choices informed—but not determined—by the standards.
- **Remaining evidence need:** empirical nested-envelope round trips and query/update ergonomics; upstream answer on extension/profile declaration; prototype proof that the compiled registry/accessor can replace direct logical-field key access without duplicating semantics.

