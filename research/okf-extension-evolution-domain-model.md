---
type: Research
title: OKF extension-evolution domain model
actor: codex-standards-po
timestamp: '2026-08-05T22:35:08.385Z'
---
# Decision card

- **What this is:** the shared vocabulary and problem boundary for the OKF extension-evolution architecture review.
- **Current state:** issue #272 demonstrates one real collision (`status`), but the general ownership and evolution policy is undecided.
- **Next:** standards research and local architecture-options work proceed independently from this model, then the parent task synthesizes them.
- **Blocked by:** no blocker; upstream clarification is evidence, not permission to model or choose a safe local posture.
- **How to use it:** preserve these terms and artifact identities in specialist outputs; explicitly mark any proposed change to the model.

# Purpose and problem statement

agentstate-lite uses OKF as its portable markdown serialization boundary and adds product-level Kind conventions, recipes, Views, workflow semantics, and mutation/concurrency behavior. OKF v0.1 permits producer-defined frontmatter. OKF v0.2 assigns a core document-lifecycle meaning to the already-used top-level key `status`. A v0.1 Task with `status: todo` therefore illustrates a general evolution hazard: a later standards edition can claim a serialized coordinate that an earlier conforming producer used for another meaning.

The architecture question is broader than renaming `status`: **how can a generic consumer, an extension-aware consumer, a producer, and a migration tool determine who owns each meaning, under which declared contract, without guessing from values or silently rewriting data?** The desired result must distinguish core and custom conventions enough to prevent or diagnose future collisions, while keeping agentstate-lite's Kind UX practical and its OKF conformance claims truthful.

This artifact does not choose namespacing, profiles, registries, or mappings. It defines the concepts and evidence boundaries needed to compare them.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: give the standards team one neutral model of ownership, identity, collision, compatibility, and migration so its recommendation can become durable scaffolding rather than a one-off response to `status`.

# Core taxonomy

## Authorities and contracts

| Term | Definition | Identity / scope | Not the same as |
| --- | --- | --- | --- |
| **OKF core convention** | A rule whose semantics and serialized representation are defined by a stated OKF edition. | `(OKF edition, normative rule or coordinate)` | A field that is merely common in current bundles. |
| **Producer extension** | Semantics introduced outside OKF core by a producer or extension publisher under an identifiable authority. | Stable extension identifier plus version; exact syntax is a design question. | An invalid value for a core field. |
| **Bundle-local convention** | A convention declared inside one bundle and applicable only under that bundle's contract. | Bundle identity plus local convention identity. | A globally interoperable extension merely because it uses a familiar name. |
| **Kind** | A logical document category selected by a document's `type` value and optionally governed by a Kind convention. | At minimum the serialized `type`; whether it needs a qualified identity is open. | The convention document that describes it. |
| **Kind convention** | agentstate-lite's current bundle-declared schema-like contract for one Kind: fields, values, sections, links, freshness, and path. | Convention document identity plus its `governs` target. | OKF core, or a separate parser/schema implementation. |
| **Profile** | A named contract that constrains, composes, or specializes a base standard for a use context. Its exact OKF semantics are currently unsettled. | Stable profile identifier and version, plus an explicit base edition. | A namespace by itself; a profile may constrain meaning without preventing an unaware consumer from misreading a shared key. |
| **Extension registry** | A discoverable catalog mapping stable extension identities to definitions, ownership, versions, and possibly serialization rules. | Registry authority plus entry identity/version. | The on-disk representation or a guarantee that every consumer can reach the registry. |
| **Namespace** | A mechanism that partitions identifiers or serialized coordinates by authority to reduce accidental collision. | Namespace identifier controlled by an authority. | A display prefix alone; collision resistance depends on stable ownership and comparison rules. |
| **Recipe** | A packaging/install mechanism that seeds content-free definitions such as Kind conventions. | Recipe source/name/version, if defined. | The semantic authority of every installed convention. Installation provenance and semantic identity may differ. |

## Meaning and representation

| Term | Definition | Example / diagnostic use |
| --- | --- | --- |
| **Logical field** | A product- or standard-level concept exposed to authors and code independently of how it is serialized. | Task workflow state as the logical concept currently surfaced as `status`. |
| **Semantic identity** | The stable identity of a meaning, including authority and scope. | “agentstate-lite Task workflow state” is different from “OKF document lifecycle” even if both serialize as `status`. |
| **Serialized coordinate** | The exact address in a document representation: key plus structural path and, where relevant, representation form. | Top-level YAML `status`; `generated.at`; a body heading; a relationship label. |
| **Wire name** | The textual key or token used at a serialized coordinate. | `status` is a wire name, not sufficient semantic identity. |
| **Value domain** | Allowed values and their meanings for one logical field under one contract. | `todo | in_progress | ...` versus `draft | stable | deprecated`. |
| **Shape** | Scalar/object/list form, cardinality, requiredness, and nested structure at a coordinate. | A later standard changing a formerly producer-used scalar location into an object. |
| **Mapping** | A version- and contract-aware rule between a logical field and one or more serialized coordinates. | Whether the CLI's logical workflow state remains ergonomic while its v0.2 wire location changes. |
| **Ownership resolution** | The deterministic procedure that identifies which authority defines a coordinate's meaning for a declared contract. | Must not infer ownership from whether a value happens to match an enum. |
| **Unaware consumer** | A consumer that understands the declared OKF edition but not a producer extension/profile. | The critical test for whether core-looking data can be silently misread. |
| **Aware consumer** | A consumer that recognizes and applies the relevant extension/profile contract. | May validate richer semantics without changing generic OKF interpretation. |
| **Opaque preservation** | Round-tripping an unrecognized construct without asserting that its semantics were understood or validated. | Current permissive read/transport of many v0.2 optional fields. |

## Versions and state transitions

| Term | Definition | Required distinction |
| --- | --- | --- |
| **Standards edition** | The OKF version whose normative contract a bundle declares. | `okf_version: 0.1` versus `0.2`. |
| **Version claim** | A producer's assertion that emitted content satisfies a particular standards edition. | Parsing an edition is not evidence that writes conform to it. |
| **Profile/extension version** | The revision of a non-core semantic contract. | Can evolve independently of OKF and must not be conflated with bundle version. |
| **Producer implementation version** | The software release performing a read, write, or migration. | Useful provenance; does not determine document semantics by itself. |
| **Document revision** | A content version used for concurrency/history, such as an agentstate-lite CAS token. | Protects writes from races; it is not a schema or standards version. |
| **Migration version/state** | The transformation recipe revision and per-bundle/per-document progress state. | Needed for resumption, audit, and rollback; not an OKF version. |
| **Feature support** | Operation-specific capability for an edition or extension. | Must be expressed as read, validate, preserve, create, mutate, migrate, or export—not one “supports v0.2” boolean. |
| **Forward compatibility** | An older implementation handles newer constructs according to an explicit policy, often opaque preservation plus diagnostics. | Does not imply it can author the newer edition. |
| **Backward compatibility** | A newer implementation continues to consume or emit older-contract data as promised. | May be read-only, write-compatible, or migration-based. |
| **Round-trip fidelity** | Parse and serialize without unintended byte, shape, or semantic loss. | Distinct from semantic validity; date-scalar shape is a current example. |
| **Semantic compatibility** | The same data retains the same intended meaning across the interaction. | Stronger than parse success or syntactic conformance. |
| **Migration** | An explicit transformation from a source contract to a target contract with declared preconditions, mapping, provenance, diagnostics, and failure behavior. | Ordinary mutation must not silently become migration. |
| **Dual-read / single-write** | A transition posture that accepts legacy and new representations but emits only the target representation after explicit contract selection. | Avoids maintaining two authoritative wire values indefinitely. This is a candidate invariant to evaluate, not a selected syntax. |

# Ownership layers

The research and design agents should model each rule at one primary layer, then state any cross-layer invariant:

1. **Representation layer:** Markdown/YAML syntax and scalar/collection shape.
2. **OKF core layer:** edition-defined documents, reserved locations, fields, and semantics.
3. **Profile layer:** named constraints/composition over a declared OKF base, if the eventual mechanism recognizes profiles.
4. **Extension-authority layer:** reusable producer or ecosystem semantics outside core.
5. **Bundle-local Kind layer:** conventions selected inside one bundle, possibly installed through recipes.
6. **Logical product layer:** ergonomic agentstate-lite commands/API concepts independent of wire spelling.
7. **Instance layer:** a particular bundle/document value and its document revision.
8. **Migration layer:** explicit transformation policy and progress from one declared contract to another.

These layers are not automatically a precedence order. A proposed architecture must define whether composition is legal, how conflicts are diagnosed, and which layer is allowed to choose serialization.

# Artifact identities the recommendation must preserve

| Artifact | Minimum identity tuple to evaluate | Why it matters |
| --- | --- | --- |
| Bundle contract | Bundle identity + OKF edition + declared profiles/extensions | Establishes interpretation context. |
| Document | Bundle identity + bundle-relative document ID/path | Keeps semantic identity separate from storage/backend location. |
| Kind | Owning authority/scope + logical Kind identifier + version (if evolvable) | Prevents a local `Task` from being mistaken for a standardized future `Task`. |
| Convention document | Document identity + convention type + governed Kind identity | The declaration is not identical to what it governs. |
| Logical field | Owning authority + Kind/global scope + logical name/identifier | Allows a stable CLI concept to map differently by target edition. |
| Serialized field | Standards/profile context + structural path + wire name | Detects exact and structural collisions. |
| Profile | Canonical identifier + version + base OKF edition | Enables reproducible interpretation and dependency checks. |
| Extension | Canonical authority + identifier + version | Distinguishes portable extensions from bundle-local names. |
| Recipe | Publisher/source + recipe identity + version/digest | Installation provenance must not substitute for semantic ownership. |
| Migration | Source contract + target contract + transformation version | Makes migration selection, resumption, and audit deterministic. |
| Instance revision | Backend + document identity + CAS/version token | Protects the transformation from concurrent writes. |

# Preliminary collision taxonomy

This is a diagnostic classification, not a one-class/one-fix commitment. One event may occupy several classes.

| Class | Collision pattern | Example / trigger | Later work must decide |
| --- | --- | --- | --- |
| **C1: exact coordinate ownership** | Core adopts a coordinate already used by an extension for another concept. | Top-level `status`. | Prevention mechanism; deterministic ownership and diagnostics. |
| **C2: value-domain or semantic narrowing** | The coordinate is shared or conceptually related, but a later contract changes allowed values or meanings. | Workflow values versus OKF lifecycle values; a formerly open enum becomes closed. | Whether specialization is legal; invalid-value behavior; migration mapping. |
| **C3: shape/cardinality collision** | A coordinate changes between scalar/object/list, optional/required, or single/multiple. | A producer scalar later standardized as a structured object. | Lossless preservation and explicit structural transformation. |
| **C4: scope collision** | A field changes from Kind-local to global, or vice versa. | A Kind-specific field name becomes a document-wide core field. | Scope-qualified identity and precedence. |
| **C5: Kind/type identity collision** | Core or another extension adopts the same `type`/Kind token with different semantics. | A future standardized `Task` versus a local `Task`. | Qualified Kind identity, aliases, or collision registry behavior. |
| **C6: reserved location collision** | A later edition reserves a file, path, prefix, body section, or relationship token used by an extension. | Future reservation under `conventions/` or a body heading. | Reserved-space governance and relocatable mappings. |
| **C7: representation/parser collision** | Syntax rules coerce or normalize a value differently from its intended representation. | YAML date-only scalar becoming a datetime on mutation. | Parser/serializer fidelity policy independent of semantic mapping. |
| **C8: default/absence collision** | Missing, null, empty, or defaulted values acquire a new meaning. | A new core default makes an omitted extension value semantically active. | Explicit-presence rules and migration of implicit states. |
| **C9: cross-field invariant collision** | A new rule ties fields together so an otherwise local mutation makes another assertion stale or false. | `generated.at` and historical `verified` claims. | Shared mutation-boundary invariants and trust invalidation/derivation. |
| **C10: extension graduation/duplication** | A producer concept is later standardized under the same or a different coordinate. | Both legacy extension and new core form may coexist. | Equivalence declaration, precedence, single source of truth, deprecation. |
| **C11: multi-contract disagreement** | Two declared profiles/extensions constrain the same logical field incompatibly. | Two installed recipes or profiles govern one Kind/coordinate. | Composition rules, conflict refusal, and authority resolution. |
| **C12: conformance-claim collision** | Bundle/version metadata claims a contract the writer does not implement. | `init --okf-version 0.2` followed by v0.1-shaped/semantically unsafe writes. | Capability gating and truthful operation-level support. |
| **C13: migration-state collision** | Mixed old/new representations, partial conversion, or concurrent writes leave ambiguous authority. | Interrupted bundle migration or indefinite dual-writing. | Atomicity granularity, resumability, CAS, audit, rollback, and readers during transition. |
| **C14: identifier/authority collision** | Two publishers choose the same namespace, profile, extension, or registry identifier. | Human-readable prefixes without durable ownership. | Canonical identity and delegation/registry governance. |

Each class must be analyzed along four axes: **detectability** (before write, at read, or only semantically), **blast radius** (field, Kind, document, bundle, ecosystem), **consumer awareness** (generic versus extension-aware), and **reversibility** (opaque preservation, mapped rewrite, or potentially lossy/manual adjudication).

# Actors and obligations

| Actor | Obligation to test in the final design |
| --- | --- |
| OKF maintainer / standards authority | Define core ownership, evolution promises, extension/profile hooks, and compatibility expectations. |
| Profile or extension publisher | Use stable identities, declare base/version/dependencies, publish definitions and migration guidance. |
| Recipe publisher | Package definitions without silently acquiring global semantic authority; surface version and provenance. |
| Bundle author/operator | Select contracts deliberately, see diagnostics, authorize explicit migrations, and retain control/rollback. |
| Core-aware generic consumer | Interpret core without treating unknown extension data as core or discarding it unnecessarily. |
| Extension-aware consumer | Resolve the declared extension/profile, apply its semantics, and report conflicts or unavailable definitions. |
| Producer/writer | Gate version claims by implemented write contracts; never infer field ownership from values. |
| Reader/transporter | Separate parse, preserve, validate, and interpret capabilities; avoid converting opaque data into an assertion. |
| Validator | Report which authority/contract each finding comes from and distinguish warning, invalid core, invalid extension, and unresolved contract. |
| Migration engine | Require explicit source/target, apply deterministic mappings with CAS, record progress/outcome, and fail safely. |
| Human reviewer | Decide unresolved equivalence or loss, examine evidence, and retain stop/redirect authority. |

# Decision boundaries and open questions

The team must not cross these boundaries implicitly:

- **Normative versus local:** what current OKF/FHIR/etc. actually require versus what agentstate-lite infers or proposes.
- **Logical API versus wire representation:** preserving the user-facing term `status` does not decide its serialized coordinate.
- **Core validity versus extension validity:** an unknown extension and an invalid core value require different handling.
- **Read/preserve versus interpret/validate versus author/migrate:** capability is operation-specific.
- **New authoring versus existing bundles:** a clean target representation does not by itself define a safe installed-base migration.
- **Mechanism versus policy:** namespaces, profiles, registries, and mappings are mechanisms; ownership, precedence, and failure behavior are policy.
- **Bundle-local versus portable ecosystem extension:** a convention that works in one bundle may lack stable global identity.
- **Detection versus repair:** identifying a collision does not authorize a rewrite.
- **Schema evolution versus content concurrency:** schema/version selection and CAS revision protection solve different problems and both may be required.
- **Upstream coordination versus local safety:** upstream answers inform interoperability, but agentstate-lite remains responsible for truthful claims and non-lossy behavior.

Questions later agents must answer rather than assume:

1. What must a generic, profile-unaware OKF consumer do with a core-looking key whose value is outside the edition's vocabulary?
2. Does OKF provide or intend a normative extension/profile identity and resolution mechanism? If not, what locally chosen representation remains valid and legible OKF?
3. Should Kind identity itself be qualified, only custom fields, both, or neither—and how does an unaware consumer observe the distinction?
4. Which collision classes can be prevented by namespace ownership, which require version-aware mapping, and which require explicit migration or human adjudication?
5. How are two profiles/extensions composed, and what happens when definitions are unavailable, duplicated, or incompatible?
6. Can extension definitions be applied offline and remain reproducible if a registry disappears or changes?
7. What is the downgrade/round-trip contract after a document or bundle adopts the target mechanism?
8. How are profile/extension versions declared and pinned separately from OKF edition and software version?
9. Which artifact owns aliases and equivalence declarations when an extension concept graduates into OKF core?
10. What is the minimum mechanism proportional to agentstate-lite's actual producer ecosystem, without baking founder judgment into every collision response?

# Acceptance criteria for the final recommendation

The final synthesis is acceptable only if it:

1. Gives core, profile/extension, bundle-local Kind, logical field, and wire coordinate distinct, queryable identities or explicitly justifies where identity is unnecessary.
2. Makes ownership deterministic from declared contracts, never from observed values.
3. Prevents or loudly detects collisions for fields, Kind/type values, structural locations, and cross-field invariants.
4. States behavior for generic unaware consumers and for missing/unresolvable extension definitions.
5. Uses an operation-specific support matrix and keeps OKF version claims truthful.
6. Preserves unknown data and scalar shape where possible without calling preservation semantic support.
7. Separates normal mutation from explicit, versioned, resumable, CAS-protected migration.
8. Defines transition behavior for legacy, target, mixed, interrupted, concurrent, and downgrade cases; avoids indefinite competing sources of truth.
9. Preserves an ergonomic logical Kind API even if wire mappings differ by contract.
10. Documents governance: identity ownership, versioning, composition, deprecation, extension graduation, and upstream asks.
11. Maps every collision class to prevention, detection, handling, and migration posture, with exceptions called out.
12. Is proportionate, local-first/offline-capable, independently testable, and implementable through the existing single parser/Kind registry/shared mutation boundary rather than a schema fork.

# Current evidence and uncertainty

Empirical local evidence is in [the v0.2 compatibility audit](./okf-v0-2-compatibility-audit.md). The existing product boundary and writer invariants are in [the compatibility design](../designs/okf-compatibility-and-upstream-stewardship.md). [Upstream issue #272](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/272) is a request for clarification, not a normative answer.

Confidence is high that the identity distinctions and collision classes expose the current problem space. Confidence is deliberately low on which standards mechanism should be adopted until the independent research and option analysis complete.
