---
type: Design
title: Evolution-safe OKF extension architecture
description: >-
  Recommended identity, wire-isolation, profile, collision, capability, and
  migration policy for OKF extensions and agentstate-lite Kind conventions
actor: codex-main
timestamp: '2026-08-05T22:55:47.779Z'
---
# Evolution-safe OKF extension architecture

## Decision card

- **Decision:** adopt a layered extension contract. Core OKF definitions, portable producer definitions, and bundle-local definitions must be different semantic classes; portable Kinds and fields receive authority-qualified, versioned identities; custom instance data occupies a mechanically separate extension lane; profiles compose those definitions; logical-to-wire mappings preserve author ergonomics; and incompatible changes use an explicit, resumable migration.
- **Immediate posture:** keep existing bundles and authoring at OKF v0.1, reject unsupported v0.2 write claims, and add a versioned collision/capability ledger. Do not eagerly rename `status` or silently reinterpret existing documents.
- **Durable posture:** core owns every coordinate defined by the selected OKF edition. Extensions own only their declared isolated coordinates. A short name such as `Task` or `status` is an alias, never the durable identity or the ownership rule.
- **Provisional wire recommendation:** use one nested producer-owned envelope containing canonical extension entries until OKF reserves a normative extension point. Validate this choice against real YAML/Markdown tools before freezing the spelling; retain a flat authority-prefixed form as the fallback.
- **Confidence:** high in the identity, capability, collision, and migration layers; medium in the exact YAML envelope syntax; low until upstream answers the exact root profile and reserved extension-point questions.

## Purpose and goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish an evolution-safe extension and migration policy so upstream OKF changes cannot silently change the meaning of agentstate-lite data.

This recommendation synthesizes the shared [collision taxonomy](../research/okf-extension-evolution-domain-model.md), the independent [standards comparison](../research/okf-extension-evolution-standards-patterns.md), and the independent [architecture option analysis](./okf-extension-evolution-options.md). It is an architecture and governance decision, not a detailed implementation plan.

## Direct answers

### Should custom Kind conventions be visibly or truly different from core OKF conventions?

**Yes—both visibly and structurally.** A different label alone helps readers but does not prevent a generic consumer from applying core meaning to the same YAML coordinate. A namespace alone prevents some name collisions but does not define version compatibility, composition, or migration. The design needs three separations:

1. **Definition class:** OKF core definitions, portable producer definitions, and bundle-local definitions are different registry roles and governance domains. Core definitions come from the pinned OKF edition; they are not ordinary bundle-editable Kind conventions. New producer definitions should declare an explicit role such as `Kind Convention` or `Extension Definition`, while the current generic `Convention` form remains a backward-compatible input during transition.
2. **Semantic identity:** every portable Kind, logical field, profile, and extension has a canonical authority-qualified ID plus an exact definition version or digest. Bundle-local definitions have an explicitly local identity tied to the bundle contract and convention document. Short names are scoped aliases.
3. **Serialized ownership:** producer data is written in a reserved extension lane rather than at a core coordinate. An authority-qualified logical field mapped back onto top-level `status` would still be unsafe under OKF v0.2.

This means “custom” is not merely a naming convention. It is a different authority class with different identity, wire ownership, versioning, and migration rules.

### Should collision patterns have matched solutions?

**Yes.** Treat the current `status` conflict as the first instance of a general compatibility system, not as a one-off rename. Each standards release should generate a collision report over a stable taxonomy, an operation-specific support matrix, a compiled mapping contract, and a migration-availability report. The response is then selected by collision class rather than maintainer memory.

### How should implementers adapt as OKF evolves?

Adoption should be a declared transition: inventory and classify the change; publish and pin the target definitions; compile composition; introduce dual-read/single-write behavior; make loss explicit; CAS-rewrite stored documents with a durable journal; verify the full target; flip the active root contract last; and retire the legacy reader only after the support window and storage audit are complete.

That pattern is more important than copying any one standard's syntax.

## The recommended contract model

### 1. Three authority tiers

| Tier | Identity | Who may change it | Portability claim |
| --- | --- | --- | --- |
| OKF core | `(OKF edition, normative coordinate or rule)` | OKF governance | Portable under that edition |
| Portable extension/Kind | canonical publisher-controlled URI or equivalent + immutable version/digest | named publisher authority | Portable when the exact definition is available |
| Bundle-local extension/Kind | `(bundle contract, convention document, local name/version)` | bundle owner | Deliberately local; no global equivalence implied |

Recipe names and installation sources are provenance, not semantic authority. Human aliases are bindings, not identities. If a local definition later becomes portable, mint a new portable identity and publish an equivalence/migration relation; do not silently upgrade the local identity's scope.

### 2. One compiled semantic registry

Keep one parser, one registry, and one mutation authority. The registry should compile the selected OKF edition plus pinned profile/extension/Kind definitions into:

- canonical Kind and logical-field identities;
- scoped human aliases and serialized type tokens;
- exact definition versions/digests and local resolution sources;
- one write coordinate and any bounded legacy-read coordinates for each logical field;
- shape, cardinality, value-domain, absence/default, and cross-field constraints;
- required versus optional understanding by operation;
- conflicts, operation capabilities, and available migrations.

Registry compilation fails for semantic authoring when definitions disagree or aliases/coordinates are ambiguous. Raw reading and opaque preservation may remain available. Load order, recipe order, and path order are never semantic precedence.

Multiple available versions of one stable semantic ID are normal. The exact definition coordinate is `(semantic ID, definition version, digest)`: unequal content claiming the same ID and version is an integrity error, while a profile selects one exact active binding or a deterministic locally pinned compatible choice. Incompatible versions may not simultaneously own the same active logical or wire coordinate.

Mappings and constraints should be declarative by default. Bundle-provided executable validators or converters do not become trusted merely because they resolve offline; executable semantics require an explicit trust decision and exact code identity, and still run behind the shared mutation/migration authority.

### 3. Separate logical identity from wire representation

The CLI may continue to offer ergonomic, Kind-scoped commands such as `new Task --status todo`. Internally that alias resolves to a logical workflow-state identity. Under a v0.1 source contract it may decode legacy top-level `status`; under a v0.2 target contract it maps to an isolated extension coordinate. The OKF lifecycle field is a different logical field mapped to top-level `status`.

Value inspection never decides ownership. `status: todo` under a v0.2 claim is invalid or unsupported core data; it is not automatically laundered into an extension because its value resembles the old workflow enum.

### 4. Reserve a custom wire lane

The preferred durable structure is one reserved extension envelope whose entries are keyed by canonical extension identity and pin their definition version. The exact spelling remains provisional:

```yaml
type: holaxis.ai/agentstate-lite/Task
status: stable
x-agentstate-lite:
  profile:
    id: https://holaxis.ai/agentstate-lite/profiles/work-tracking
    version: "1"
  extensions:
    https://holaxis.ai/agentstate-lite/extensions/task-workflow:
      version: "1"
      values:
        workflow_state: todo
```

Here top-level `status` is unambiguously OKF lifecycle. The custom workflow value is opaque to a generic OKF consumer but identifiable and interpretable by an aware consumer. The qualified `type` token makes a portable custom Kind visibly non-core while remaining an ordinary unknown OKF type to a generic reader.

The outer `x-agentstate-lite` anchor is only a provisional producer-owned coordinate; agentstate-lite does not thereby own every nested extension's semantics. If OKF defines a normative extension container later, the logical identities stay stable and only the wire mapping plus migration target changes.

The whole example—including URI-as-map-key—is illustrative syntax, not the identity policy. A list of entries with explicit `id`/`version`, a scoped alias table, or another representation can implement the same contract. The prototype must choose based on preservation, duplicate handling, deterministic ordering, and query/edit ergonomics.

Likewise, `status: stable` is an illustrative valid v0.2 core assertion, not something derivable from legacy workflow `status`. A real migration must deliberately choose whether to rely on v0.2's absent-to-stable default, materialize `stable`, request classification, or declare the target unsupported.

A flat producer-prefixed key is the fallback if empirical tooling shows nested unknown mappings are not preserved reliably or query ergonomics cannot be centralized cleanly. Flat prefixes must still bind to an authority and version; `x-status` alone is not sufficient identity.

### 5. Profiles compose; they do not create safety

A profile/contract set declares:

- base OKF edition;
- included Kind and extension IDs and exact versions/digests;
- aliases, mappings, constraints, dependencies, and invariants;
- which unknown definitions are required for which operations;
- compatibility policy and available migration targets.

Profiles are valuable for reproducibility, validation, and composition. They cannot make a producer meaning safe at a coordinate that the base standard already owns: a profile-unaware v0.2 consumer will still interpret top-level `status` as lifecycle. Wire isolation must come first.

Profiles may be optional for a simple one-authority local bundle, but the compiled contract must still be explicit. When multiple profiles apply, their claims must have a satisfiable intersection; “last profile wins” is forbidden.

For multiple profiles, producers satisfy the compatible intersection of active constraints and consumers recognize the union of declared alternatives they support. Compilation reports `compatible`, `incompatible`, or `unresolved`; an unresolved composition is not silently treated as compatible or resolved by load order.

### 6. Unknown handling is operation-specific

Support claims are made separately for `read`, `opaque-preserve`, `interpret`, `validate`, `create`, `mutate`, `migrate`, and `export`.

- Raw read, list, copy, and byte-preserving transport may continue with unknown optional extensions.
- Interpretation and validation require the exact relevant local definition.
- A semantic mutation proceeds only if every unknown required semantic that could affect correctness is understood; otherwise it fails closed or explicitly invalidates an affected assertion according to the trusted contract.
- Migration and export require a declared target mapping and loss policy.

An instance cannot grant an arbitrary extension the power to disable all tooling. Required support comes from a pinned, trusted definition/profile and is scoped to the operations it can affect.

Isolation guarantees only that an unknown additive/non-modifying extension does not alter OKF core interpretation. It does not make every semantic operation safe, and it does not guarantee that every unaware writer will preserve the data. OKF's preservation obligation is a `SHOULD`; opaque round-trip is therefore a separate empirical capability that agentstate-lite must test and claim precisely.

### 7. Identity must resolve offline

Canonical URIs are identifiers, not runtime network dependencies. Deterministic resolution is:

1. exact definition embedded in the bundle;
2. exact built-in definition/digest shipped with the implementation;
3. unavailable.

A network registry may advertise or retrieve an explicitly requested snapshot, but it may not silently substitute “latest.” Conflicting content for the same canonical ID/version/digest is a hard integrity error. When the definition is unavailable, raw read and opaque preservation can continue; semantic authoring and migration cannot.

## Hard invariants

1. The selected OKF edition owns its core coordinates, value domains, defaults, shapes, and cross-field rules.
2. Core definition, extension definition, Kind, profile, recipe, logical field, wire coordinate, CLI alias, and document revision are separate concepts.
3. A generic edition-aware but profile-unaware consumer must never interpret producer data as a core assertion.
4. Core, portable extension, and local extension definitions have explicit and different authority classes.
5. One semantic registry compiles all active contracts; one parser and one shared mutation path implement them.
6. Human aliases resolve to exactly one identity in context or fail as ambiguous.
7. Each logical field has one authoritative write coordinate in a selected contract.
8. Transition may dual-read but must single-write; disagreeing old and new representations are an error, not precedence.
9. Unknown-field preservation is not evidence of semantic compatibility.
10. Semantic mutation may not overclaim support merely because generic parsing succeeded.
11. Migration is explicit, loss-aware, idempotent, CAS-protected, resumable, and observable to completion.
12. The root OKF/profile claim changes only after every target invariant and absence-of-legacy check succeeds.
13. Retired semantic identifiers are never reassigned to unrelated meanings.
14. Runtime network access is never required to interpret, validate, author, or migrate an already-resolved bundle.
15. Compatibility or quarantined source data can prevent loss, but it is archival and non-authoritative; it never becomes a second writable truth.

## Collision taxonomy and matched responses

| Class | Pattern | Detection | Primary response | Migration response |
| --- | --- | --- | --- | --- |
| C1 | Exact coordinate ownership (`status`) | Diff core coordinates against every active write coordinate | Core wins; relocate custom meaning to its extension lane; never inspect values to decide ownership | Dual-read legacy, single-write target, remove legacy in the same CAS write |
| C2 | Value-domain or semantic narrowing | Compare meaning, enum/range, and compatibility classification | New definition version and explicit logical mapping; invalid core remains a core error | Deterministic value map, or manual/lossy refusal |
| C3 | Shape or cardinality change | Schema/codec diff plus round-trip fixtures | Versioned codec and compatible target coordinate | Convert only with declared loss/inverse policy |
| C4 | Scope change | Compare path/container/Kind scope | Scoped logical identity and target relocation | Move through an explicit mapping; no contextual guessing |
| C5 | Kind/type identity collision | Core/extension type-token and alias registry | Authority-qualified Kind identity; short alias only when unique | Rename type token plus affected references/conventions |
| C6 | Reserved location collision | Diff filenames, prefixes, headings, path segments, link tokens, and root keys | Reserve disjoint extension space; refuse unsafe target | Relocate through versioned mapping |
| C7 | Representation/parser collision | Parse/emit/reparse and scalar-shape fixtures | Fix the one parser/serializer or refuse semantic writes | No migration until required shape fidelity is proven |
| C8 | Default or absence change | Compare presence/default contracts | Explicit absence semantics in definition/mapping | Materialize or remove values deliberately |
| C9 | Cross-field invariant change | Dependency/invariant diff and mutation validation | Enforce or invalidate in the shared mutation candidate | Recompute/invalidate in the same CAS transformation |
| C10 | Extension graduation or duplicate truth | Equivalence/replacement declarations and both-form scan | Keep old/new IDs distinct; publish equivalence or non-equivalence | Bounded dual-read, single-write core target; disagreement requires review |
| C11 | Multi-contract disagreement | Compile ownership and constraint intersection | Reject incompatible composition; never select by load order | Operator chooses compatible set or explicit remap |
| C12 | False conformance/version claim | Operation-specific capability matrix and actual validation | Reject unsupported create/mutate/export claims | Flip the claim only after target verification |
| C13 | Mixed or concurrent migration state | Durable journal, per-document revisions/outcomes, old/new scan | Block normal semantic writes during active migration | Resumable CAS state machine with checkpoints and rollback basis |
| C14 | Identifier/authority collision | ID/version/digest and alias-binding integrity checks | Canonical authority-qualified IDs; local IDs clearly local | Explicit re-identification; never silently rebind |

### Decision procedure for every standards change

1. Diff the new edition's fields, types, value domains, shapes, defaults, reserved locations, and cross-field invariants against the compiled registry.
2. Classify every applicable C1-C14 pattern. One change can belong to several classes.
3. Resolve ownership from the declared source and target contracts—not from field values, software version, or load order.
4. Select or create a safe target identity and wire mapping. Repair parser fidelity and shared invariants before migration where required.
5. Update the operation capability matrix. A readable mapping does not by itself prove safe mutation.
6. Publish a migration entry naming source, target, transform version/digest, preconditions, loss/manual cases, verification, rollback basis, and retirement policy.
7. Execute the migration state machine and flip the root contract last.
8. Retire the old writer and eventually the old reader only when storage audit and support policy allow it.

## Evolution and migration lifecycle

### New authoring

Bundle open resolves the root OKF edition and exact local contract/profile set. The registry compiles identities, aliases, mappings, constraints, capabilities, and conflicts. Authoring operates on logical fields; the shared mutation boundary decodes the old form, applies the logical patch, validates, writes exactly one target representation, updates edition-specific invariants, and performs CAS. An unresolved semantic contract blocks authoring but does not prevent raw inspection.

### Existing v0.1 bundles

1. Stay on v0.1 until a target writer and named migration exist. Do not eagerly rename `status` now.
2. Preflight every affected document and classify source form, ownership, target, shape/loss, current revision, and ambiguity.
3. Pin rollback bytes/history, source/target contracts, dependencies, and transform digest.
4. CAS-enter a persistent write-gated migration state.
5. Transform each document from a fresh revision; write target and delete legacy in one CAS operation; checkpoint result.
6. Keep root `okf_version: "0.1"` while documents are mixed. Generic consumers therefore continue to interpret legacy bare fields under their source edition while new extension-envelope data remains opaque.
7. Verify target constraints, unknown preservation, scalar shapes, cross-field invariants, expected counts, and absence of legacy/dual coordinates.
8. CAS-flip root version/profile last, then unblock target authoring.
9. Retain bounded legacy-read support and diagnostics; never resume legacy writes.

Migration states should at least distinguish `idle`, `planned`, `in_progress`, `verifying`, `committing`, `complete`, and `failed/aborting`. A checkpoint records document ID, source revision, result revision, transform identity, outcome, and diagnostic. A content hash without restorable bytes is not a rollback strategy.

Every semantic mutator must honor the persisted gate. Per-document CAS rejects stale revisions but cannot stop a fresh legacy writer from reintroducing a source coordinate after reading a converted head; the shared write/version gate is the local-first substitute for centralized admission control.

## What the standards contribute

- **FHIR:** extensions have canonical authority-owned identifiers and formal definitions; profiles constrain a base and compose extensions; modifier semantics demonstrate operation-sensitive fail-closed behavior; packages and explicit inter-version maps separate definition distribution from conversion; maturity levels define different change budgets. Useful lesson: identity, profile, capability, and conversion are separate. Do not copy the healthcare-specific modifier system wholesale. See [FHIR extensibility](https://hl7.org/fhir/R5/extensibility.html), [defining extensions](https://hl7.org/fhir/R5/defining-extensions.html), [profiling](https://hl7.org/fhir/R5/profiling.html), and [version management](https://hl7.org/fhir/R5/versions.html).
- **Kubernetes:** group/version/kind separates custom APIs; served and storage versions are distinct; changing the storage version does not rewrite old objects; conversion, stored-object migration, verification, and delayed removal form an observable lifecycle. Useful lesson: adopt the state machine, not its online conversion-webhook topology. See [API groups/versioning](https://kubernetes.io/docs/reference/using-api/), [CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/), and [deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/).
- **JSON Schema:** dialects declare vocabularies by URI and distinguish required from optional support; canonical IDs need not be fetched from the network. Useful lesson: a profile can negotiate capabilities, but declarations do not repair two meanings at one key. See [JSON Schema Core 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).
- **OpenAPI:** `x-` provides a recognizable extension lane and its registry associates namespaces with owners. Useful lesson: reserve visible custom space, but a prefix alone supplies neither semantic identity nor migration. See [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) and the [namespace registry](https://spec.openapis.org/registry/namespace/).
- **XML Namespaces/Web architecture:** expanded name `(namespace URI, local name)` is the identity while a prefix is only a scoped alias; namespace version policy remains a separate concern. Useful lesson: separate authority identity from ergonomic spelling. See [Namespaces in XML](https://www.w3.org/TR/2009/REC-xml-names-20091208/) and [Web Architecture on versioning/extensibility](https://www.w3.org/TR/2004/REC-webarch-20041215/#versioning-and-extensibility).

Across these systems, implementers adapt through explicit contracts and staged support rather than assuming that parsing a new version implies semantic compatibility.

## Governance policy

Every core, portable extension, profile, and Kind definition should declare a maturity/status with an allowed-change budget. The exact labels and time windows require product/upstream agreement, but the rules should include:

- experimental/local definitions may change quickly, but incompatible meaning still receives a new version and migration;
- stable portable definitions do not change existing identifiers, coordinates, or meanings incompatibly in place; additions must follow declared unknown-support rules;
- deprecation names a replacement and precedes retirement by a published support window;
- withdrawn identifiers are never recycled;
- extension graduation into core publishes equivalence/non-equivalence, conversion, and retirement policy;
- definition identity, profile version, OKF edition, migration version, product version, and document CAS revision remain distinct axes;
- conformance declarations select validators; they do not substitute for validation evidence.

Each definition authority also declares its version-comparison algorithm; SemVer is not assumed. Validation evidence is revision-scoped and records the contract digest, validator/tool version, time, scope, and relevant document/root revisions. Semantic mutation invalidates or recomputes affected evidence. It must not overload OKF's existing `verified` field unless a separate standards/product decision explicitly assigns that meaning.

Only a recognized authority may publish a binding equivalence for extension graduation: the extension authority, the core authority within its own target contract, or a profile/local migration authority whose limited scope is explicit. The governing policy must also set a bounded legacy-read and deprecation horizon.

Each supported OKF or profile release should generate four artifacts from one compatibility source:

1. C1-C14 collision/identity report;
2. operation-specific capability matrix;
3. compiled identity/mapping/invariant registry with offline dependency closure;
4. migration table marked `automatic`, `manual`, or `unsupported`, including loss, rollback, and verification evidence.

That makes known collision patterns executable release gates rather than institutional memory.

## Phased adoption

### Phase 0 — contain the current risk

- Continue honest v0.1 authoring and generic/opaque v0.2 reading.
- Reject initialization or mutation that would falsely claim an unsupported OKF writer edition.
- Establish the core-coordinate/capability ledger and classify the current `status`, date-shape, provenance-invariant, and version-claim failures.
- Make no bulk field rename and no automatic v0.2 migration.

### Phase 1 — establish identities and contracts without rewriting data

- Separate core, portable, and local definition classes in the registry model.
- Assign canonical IDs/versions to built-in portable Kinds and logical fields; record current short tokens as scoped legacy aliases.
- Define the profile/contract and operation-capability model, offline definition resolution, collision compiler, and extension-graduation rules.
- Capture existing bundle-local conventions as explicit local identities before any migration.

### Phase 2 — validate the wire decision and upstream alignment

- Prototype nested-envelope and flat-prefixed representations against real parsers, round trips, queries, hand editing, exports, and generic OKF consumers.
- Prefer the nested envelope if it passes preservation and ergonomics gates; otherwise select authority-prefixed flat keys without weakening canonical identity or migration rules.
- Ask upstream to reserve an extension lane and settle profile/version declaration semantics before freezing the final spelling.

### Phase 3 — implement the target writer and migration control plane

- Introduce logical-to-wire mapping, operation gates, shared invariants, and a CAS migration catalog/state machine through the existing parser/registry/mutation seams.
- Ship target authoring and the v0.1-to-target migration together.
- Run explicit operator-approved migrations; flip bundle claims only after verification.

### Phase 4 — normalize governance and ecosystem distribution

- Publish maturity/change policy, support windows, extension packages, validation evidence, and compatibility reports.
- Add upstream edition diffs and representative third-party extension fixtures to release gates.
- Retire legacy readers only after the published window and zero-legacy storage audit.

## Upstream OKF asks

1. Reserve a normative producer-extension lane or a durable producer-prefix policy that future core editions promise not to claim.
2. Define whether and where a bundle/document declares a profile or contract, how unknown profiles behave, and whether support requirements may be scoped by operation.
3. Publish machine-readable core coordinates, value domains, shapes, defaults, reserved locations, and cross-field invariants per edition.
4. Clarify compatibility promises: what may change in a minor release, how deprecation/removal works, and how breaking historical changes are represented.
5. Define a convention for authority-qualified custom Kind/extension identities and extension graduation into core, including equivalence and replacement metadata.
6. Specify implementer obligations during mixed-version storage migration and distinguish read/transport compatibility from safe authoring/mutation.

agentstate-lite should not wait for every answer before installing the identity, collision, capability, and migration abstractions. It should avoid freezing the exact top-level extension/profile spelling until upstream either reserves one or declines to do so.

## Rejected approaches

- **Rename `status` and stop:** fixes C1 once, but leaves all other collision classes and future renames unmanaged.
- **Different `Convention` moniker only:** useful recognition, no wire safety or version/migration semantics.
- **Prefix every field only:** valuable fallback lane, but weak owner identity, noisy composition, and no schema/migration contract.
- **Profiles only:** aware tools can disambiguate, generic consumers still apply core meaning to shared coordinates.
- **Namespace/URI identity only:** identifies meaning but remains unsafe when mapped to a core coordinate.
- **Migration machinery only:** repeatedly cleans up collisions after they occur without preventing the next one.
- **Value-based inference:** silently changes ownership and makes invalid core values appear valid producer data.
- **Indefinite dual-write:** creates two potentially disagreeing truths and makes retirement unverifiable.
- **Online definition/conversion dependency:** conflicts with local-first reproducibility and turns reads/writes into availability and trust failures.
- **Wholesale FHIR modifier semantics:** too strong and domain-specific for generic Markdown knowledge; retain only trusted, operation-scoped fail-closed behavior.

## Risks and falsifiers

- If common YAML/Markdown tools drop or alter nested unknown mappings, use flat authority-prefixed fields as the wire lane while keeping all other layers.
- If logical query/update UX cannot hide nested paths through one registry/accessor without duplicating semantics, simplify the target representation before implementation.
- A provisional outer anchor can itself collide. Treat it as migratable and continue pursuing an upstream reservation.
- Authority transfer, abandoned namespaces, signing, and digest trust are unresolved governance risks. Exact local pins prevent silent substitution but do not establish publisher trust.
- Bundle-local IDs may become unstable across copy/fork/merge. Require explicit re-homing or define a durable bundle identity before promising local-ID portability.
- Write-gated migrations pause normal semantic writes. The UX must make preflight, progress, resume, conflict, rollback, and completion obvious.
- If several real future collisions are fully handled by the immediate ledger and no alternate wire form is needed, defer envelope rollout; do not weaken identity or truthful-capability invariants.
- If OKF publishes a stronger normative extension mechanism, adopt its wire/profile syntax and preserve the logical IDs, mappings, collision taxonomy, and migration lifecycle.

## Prototype and acceptance gates before freezing syntax

1. A v0.2 generic consumer never reads workflow `todo` as OKF lifecycle `status`.
2. An aware consumer round-trips core status and custom workflow state independently.
3. Unknown optional extension entries survive read/copy/unrelated semantic mutation as promised.
4. Unknown required semantics block only affected operations and do not block raw inspection/transport.
5. Duplicate canonical ID with different content, ambiguous alias, incompatible profile composition, and duplicate write-coordinate claims all fail closed.
6. Date-only, datetime, nested mapping, list, scalar, and unknown-key round-trip fixtures establish representation guarantees.
7. Legacy and target values that disagree stop migration; no load-order or value-based precedence is used.
8. Interrupted and concurrent migrations resume safely with per-document CAS and never flip the root claim early.
9. Rollback restores source bytes/history, not merely hashes.
10. Offline resolution succeeds from pinned definitions and refuses missing or substituted definitions for semantic operations.
11. Extension-to-core graduation retains one logical view, single-writes target, detects duplicate truth, and retires only after storage audit.
12. Every supported backend and semantic write surface consults the same capability/mapping/invariant authority.

## Human decisions still required

The architecture recommends defaults but does not pretend the standards answer these product choices:

- final extension-envelope/profile spelling and whether to ship it before upstream reservation;
- canonical authority format and transfer/trust policy;
- exact definition type/moniker and backward-compatible representation of current `Convention` docs;
- bundle-local identity behavior under copy/fork/merge;
- whether profiles are bundle-wide or may vary by document;
- maturity labels and minimum support/deprecation windows;
- which operations form the stable capability vocabulary;
- policy for unrepresentable source data: compatibility envelope versus mandatory manual resolution.

The first two decisions should follow the wire-format prototype and upstream discussion. The remaining identity, collision, capability, and migration principles can be adopted now without committing to a speculative serialization.

## Recommendation summary

Make custom conventions truly different from core through **authority class, canonical identity, and serialized ownership**. Use a profile to bind definitions and aliases, not to excuse core-key overloading. Compile every standard change through a C1-C14 collision ledger and operation-capability matrix. Evolve stored data with a named, loss-aware, dual-read/single-write, CAS-journaled migration whose root conformance claim changes last.

For the current issue, stay on honest v0.1 writes, add the writer-version guard and collision report, and do not rename data yet. In parallel, prototype a qualified Kind identity plus nested extension envelope and seek an upstream reserved extension point. This resolves the immediate risk while building a repeatable adaptation path for the next OKF change.
