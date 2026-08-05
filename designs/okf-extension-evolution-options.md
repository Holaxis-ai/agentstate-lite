---
type: Design
title: OKF extension-evolution architecture options
description: >-
  Independent comparison of identity, wire-isolation, profile, mapping, and
  migration mechanisms across collision classes C1-C14
actor: codex-okf-architect
timestamp: '2026-08-05T22:47:01.835Z'
---
# Decision card

- **What this is:** an independent architecture option set for separating OKF core semantics from agentstate-lite and bundle-local Kind semantics as either side evolves.
- **Current state:** the current implementation is an honest OKF v0.1 writer and permissive v0.2 reader/transporter, but its unqualified Kind fields and Kind tokens have no durable authority identity or version-aware wire mapping.
- **Preliminary recommendation:** immediately gate unsupported OKF write claims and add collision diagnostics; durably combine qualified semantic identities, one nested producer-owned extension envelope, version/profile-selected logical-to-wire mappings, and an explicit CAS-safe migration/compatibility catalog. Profiles describe composition but are not the collision-isolation boundary.
- **Next:** freeze this artifact, then cross-read the independent standards-pattern research and revise only where primary-source evidence changes applicability or syntax.
- **Blocking:** none. Current OKF has no normative profile or extension-container mechanism, so the durable design must remain locally safe and offline-resolvable under upstream uncertainty.

# Purpose, goals, and evidence boundary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: give the parent standards review a source-grounded choice among extension identity, representation, composition, and migration mechanisms so future OKF changes cannot silently reinterpret agentstate-lite data.

This is the divergent S2 artifact defined by [the architecture plan](../plans/okf-extension-evolution-architecture.md). It uses the [shared domain model](../research/okf-extension-evolution-domain-model.md), current OKF text, the existing compatibility audit/design, and local source at commit `164ba7edb89c31678856020ee794f80530e6c276`. It deliberately does **not** consume `research/okf-extension-evolution-standards-patterns` before this initial option set is frozen.

Normative OKF facts below refer to v0.2 at upstream commit [`3fcbb9f`](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md), last changed 2026-07-24. Open issues are proposal/stakeholder evidence, not normative rules.

# Current system model, grounded in source

| Concern | Current authority and behavior | Consequence for this decision |
| --- | --- | --- |
| YAML/Markdown | `packages/core/src/frontmatter.ts` is the one parser/serializer. It preserves unknown keys structurally, but normalizes top-level YAML `Date` objects to ISO datetime strings. | Any extension syntax must flow through this parser. Lexical/scalar-shape fidelity is a separate C7 problem; naming alone cannot solve it. |
| OKF writes | `writeDocVersioned` in `packages/core/src/bundle.ts` enforces non-empty `type`, preserves other keys, and unconditionally supplies/reorders legacy `timestamp`. `initBundle` accepts any `okfVersion` string. | Writer behavior is not selected by the declared OKF edition today. C12 needs a supported-writer gate and version-specific mutation policy. |
| Kind identity | `KindRegistry.kinds` in `packages/core/src/kinds.ts` is `Map<governs, KindConvention>`. `governs` is the literal `type` value; no authority, Kind version, logical ID, or alias is recorded. | `Task` is both human alias and complete Kind identity. C5/C14 cannot be prevented, only duplicate-detected inside one loaded bundle. |
| Convention discovery | `loadKinds` in `packages/core/src/kinds-load.ts` queries `type: Convention` under `conventions/`, keeps first-by-id for duplicate `governs`, and warns on the rest. It is loaded once by command adapters. | The registry is the right single compilation point for identity, mappings, and collision diagnostics. It should be extended, not paralleled. |
| Field identity | Convention `fields.required`, `optional`, `values`, and `terminal` are keyed by bare strings. `validateAgainstKind` reads `frontmatter[field]` directly. | A Kind field is currently both logical field and serialized coordinate. There is no place to express ownership, scope, shape, or edition-specific serialization. |
| Authoring | `new` sets `type: kind.governs` and copies each dynamic `--field` directly to the same top-level frontmatter key. `doc update` does the same after selecting the result Kind. | Ergonomic aliases can remain, but must resolve through a compiled logical-field mapping before validation and serialization. |
| Query/status | Query filters and list projections address top-level raw keys. Terminal/open and status views read the direct Kind field. | A nested target needs one shared coordinate accessor/projection function used by validation, query, terminal derivation, and presentation—not ad hoc dotted-path code in each command. |
| Mutation/concurrency | `mutateDocument` in `packages/core/src/document-mutation.ts` owns fresh read, candidate build, validation, semantic no-op, timestamp/actor, CAS retry, and receipt behavior. | Version-specific invariants, logical-to-wire materialization, and migration CAS must attach here or below it, never in a second CLI writer. |
| Recipes | `recipe-parser.ts` has recipe `id`, `version`, and source, rejects self-duplicate `governs`, then emits ordinary Convention docs. `applyRecipe` installs expect-absent and never upgrades or clobbers an existing convention. Recipe identity is not Kind semantic authority. | Recipe provenance can seed pinned definitions, but must not implicitly own global Kind/field names. Versioned upgrades require an explicit compatibility/migration contract. |
| Current empirical state | [The v0.2 audit](../research/okf-v0-2-compatibility-audit.md) found 336 `status` fields in 826 documents; only five matched v0.2 lifecycle values. Mutation also changed date-only shapes and left `generated.at`/verification relationships stale. | `status` is proven C1/C2/C4; date coercion is C7; provenance staleness is C9; arbitrary `--okf-version` is C12. A field-only namespace answer is incomplete. |

Current OKF v0.2 permits additional producer keys, requires consumers to preserve unknown keys on round-trip and not reject them, and leaves `type` values unregistered. It simultaneously gives `status` core lifecycle meaning and reserves root-index frontmatter for `okf_version`. Therefore an unknown, producer-owned coordinate can be safely opaque to a generic consumer, while a profile declaration alone cannot stop that consumer from applying core meaning to a shared `status` coordinate. The proposed `okf_profile` in [issue #212](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/212) remains open and also calls out the root-index metadata ambiguity.

# Hard invariants and comparison rules

These are rejection gates, not weighted preferences:

1. **Edition owns core meaning.** If a document declares or is interpreted under OKF v0.2, top-level `status` is the OKF lifecycle field. An invalid value is invalid/unsupported core data; it is never reclassified as a producer extension from its value.
2. **Identity precedes representation.** Core field, extension field, bundle-local field, Kind, profile, recipe, wire coordinate, and CLI alias are distinct identities even when some currently share a string.
3. **Unaware-consumer safety.** A durable target must not place a different producer meaning at a core coordinate an edition-aware/profile-unaware consumer will interpret.
4. **One semantic registry, one parser, one mutation authority.** Extend the compiled Kind registry and the shared mutation service. Do not introduce a second schema loader, YAML path, or write policy.
5. **Offline reproducibility.** All contracts needed to read, validate, author, or migrate are pinned and available in the bundle/tool distribution. A URI may identify; runtime network access may not be required to resolve.
6. **Operation-specific capability.** `read`, `opaque-preserve`, `interpret`, `validate`, `create`, `mutate`, `migrate`, and `export` are separate support claims.
7. **No indefinite dual truth.** Transition may dual-read legacy and target forms, but after target selection it single-writes. A document must not carry disagreeing authoritative representations.
8. **Migration is explicit state.** Normal mutation never silently becomes migration. Migration declares source/target contracts, transform version, progress, loss policy, and rollback basis, and uses per-document CAS.
9. **Shape and cross-field rules are first-class.** Namespace mechanisms do not waive C3/C7/C8/C9. Representation codecs and shared mutation invariants own those classes.
10. **Conflicts fail closed.** Two contracts claiming one semantic identity or serialized coordinate incompatibly prevent authoring/migration until resolved; load order never becomes semantic precedence.

The option matrices use `yes`, `partial`, or `no` in **Prevent**; **Detect** states when/how; **Runtime** states safe handling without rewriting; **Migrate** states whether the option itself supplies a deterministic transition.

# Normalized option cards

## O0 — Minimal wait/freeze posture

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Keep current bare `type`, Kind names, and top-level Kind fields. Keep bundle authoring at OKF v0.1. |
| Declaration/discovery | Current Convention docs and registry only. No new extension syntax. |
| Generic unaware consumer | Safe only because agentstate-lite does not emit the conflicting fields under a v0.2 write claim. A v0.1 consumer sees producer-defined fields. |
| Ownership/conflict | Declared OKF edition owns core fields. Unsupported writer editions are rejected. Known conflicts are documented, not resolved. |
| Versions/offline | No dependency beyond shipped v0.1 policy; fully offline. |
| Operations | Continue v0.1 read/write. Continue best-effort v0.2 read/transport with explicit caveats. Refuse v0.2 create/mutate/migrate. |
| New authoring / installed base | No data change. Existing bundles remain authoritative v0.1. |
| Implementation seam | Add the already-designed supported-write-version guard at `init` and all write entry points; status diagnostics may report future-version/known-collision exposure. |
| Governance | Track upstream and only reopen representation when a v0.2 writer is scheduled. |
| Tradeoff | Lowest cost and zero speculative migration, but accrues architectural debt and blocks honest v0.2 authoring. |
| Falsifier | Rejected once users need v0.2 authoring, another collision appears, or upstream remains unresolved long enough that waiting imposes more cost than a local extension contract. |

## O1 — Bare top-level fields plus a shipped collision/capability ledger

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Preserve current bare coordinates, but compile a ledger of core coordinates/types/locations by OKF edition plus every Kind-declared coordinate. |
| Declaration/discovery | Extend the one registry result with edition capability and collision findings. The ledger ships with the tool and is diffed on OKF upgrades. |
| Generic unaware consumer | Still unsafe if a producer meaning is emitted at a core coordinate. The strongest posture blocks such writes rather than warning after them. |
| Ownership/conflict | The declared edition has unconditional priority at core coordinates. A collision blocks authoring until a rename/mapping exists; value domains never arbitrate ownership. |
| Versions/offline | Ledger is versioned with the implementation and optionally mirrored as a pinned bundle contract. No runtime network. |
| Operations | Excellent detection and truthful capability reporting; cannot itself serialize both meanings when a collision is active. |
| New authoring / installed base | New non-colliding bare fields remain allowed. Existing conflicting bundles remain readable under their source edition; upgrades stop at preflight. |
| Implementation seam | Registry compile diagnostics; version-aware status report; supported-operation matrix at bundle open/mutation. |
| Governance | Every OKF release adds a reviewed coordinate diff and compatibility entry. Every portable recipe declares coordinates for preflight. |
| Tradeoff | High value as a safety net with modest cost, but detection is not isolation and manual renames recur. |
| Falsifier | Rejected as the durable representation if the first collision cannot be resolved without changing wire coordinates—which `status` already demonstrates. |

## O2 — Flat producer-prefixed wire names

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Every producer-owned key uses an allocated prefix (`x-agentstate-lite-workflow-state`); optionally prefix custom type tokens, path segments, headings, and link labels too. Prefix maps to a stable authority identifier. |
| Declaration/discovery | Convention docs declare prefix owner, version, and exact coordinates. Registry refuses duplicate prefix ownership. |
| Generic unaware consumer | Sees unknown top-level fields and preserves them; does not mistake workflow state for OKF lifecycle as long as the core key is absent. |
| Ownership/conflict | Prefix allocation partitions producers. It is social rather than globally collision-proof unless OKF reserves the convention or an authority registry exists. |
| Versions/offline | Prefix-to-authority bindings and definitions are pinned locally. Network lookup is optional discovery only. |
| Operations | Existing top-level query/update ergonomics mostly survive. Field evolution within one prefix still needs versions/mappings/codecs. |
| New authoring / installed base | New target uses only prefixed custom fields. Existing bare fields require explicit migration; transition dual-reads and single-writes prefix form. |
| Implementation seam | Smallest mapping change: logical alias → flat key in the existing registry/accessors. Query filtering remains shallow. |
| Governance | Authority owns prefix, collision scan, versioning, deprecation, and graduation aliases. Bundle-local prefixes must not be presented as portable. |
| Tradeoff | Simple and legible, but key proliferation, weak decentralized prefix ownership, and no natural grouping/version/composition boundary. |
| Falsifier | Rejected if OKF declines to reserve producer prefixes, if multiple extension authorities must compose frequently, or if prefix-to-authority ambiguity appears in real bundles. |

## O3 — Nested extension envelope with stable entry identifiers

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Custom data lives beneath one producer-owned anchor until OKF defines a normative extension point. Entries are keyed by canonical extension IDs and carry pinned versions; inner names are scoped to the entry. Example: `x-agentstate-lite.extensions[<canonical-id>].values.workflow_state`. |
| Declaration/discovery | The one registry compiles envelope entries from Convention/profile docs. Portable IDs are authority URIs; bundle-local IDs are explicitly relative to a bundle contract/convention and make no global interop claim. |
| Generic unaware consumer | Sees one unknown object, preserves it, and never reads inner workflow state as OKF lifecycle. A generic consumer may ignore all custom behavior safely. |
| Ownership/conflict | Canonical entry ID owns its subtree. Duplicate same-ID/different-version or incompatible constraints fail registry compilation. The outer anchor remains a provisional producer coordinate until upstream reserves an extension container. |
| Versions/offline | Definitions are embedded/pinned by version and digest; URI dereference is not required. Unknown entries are opaque-preserved. |
| Operations | Requires a shared nested-coordinate accessor for query, validation, projection, mutation, and export. Raw generic reads remain unchanged. |
| New authoring / installed base | New target writes only envelope form. Legacy fields are dual-read during migration, never dual-written. |
| Implementation seam | Extend `KindConvention` field descriptors and registry compilation; add one safe nested get/set/delete primitive consumed by `validateAgainstKind`, query selection, terminal derivation, `new`, and `mutateDocument`. |
| Governance | Entry authority owns semantic versioning and migrations. Envelope mechanism owner governs only serialization, not third-party extension semantics. |
| Tradeoff | Strong generic-consumer isolation and composition; more verbose YAML and added path-query ergonomics. The provisional anchor can itself collide without upstream reservation. |
| Falsifier | Rejected if representative YAML/OKF tools do not preserve nested unknown mappings reliably, or if shallow-query cost cannot be hidden behind the one registry/accessor without breaking portability. |

## O4 — Qualified Kind and logical-field identities

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Give every portable Kind and logical field a canonical authority-qualified ID and version; retain short aliases for CLI/display. Prefer visibly qualified `type` tokens for new portable Kinds. Bundle-local identities are `(bundle contract, convention id, local name)` and are never advertised as global. |
| Declaration/discovery | Convention docs declare `kind_id`, version, logical field IDs, aliases, and authority. Registry keys by canonical identity and separately indexes aliases/wire tokens. |
| Generic unaware consumer | Qualified `type` is safely an unknown type under OKF. Qualified semantic identity alone does **not** protect a bare top-level `status`; it must compose with O2/O3/O6. |
| Ownership/conflict | Duplicate canonical IDs with unequal definitions fail. Alias ambiguity is reported and never resolved by source/install order. |
| Versions/offline | Canonical identity remains stable; exact definition/version/digest is pinned locally. |
| Operations | Makes ownership, composition, diagnostics, migration, and graduation deterministic. It does not by itself choose serialized coordinates or transforms. |
| New authoring / installed base | New Kinds use qualified identity/type. Existing `Task` is a legacy alias mapped only under the declared source contract. |
| Implementation seam | Evolve `KindRegistry` from a single `governs` map into one compiled registry with canonical map plus unambiguous alias and wire indexes; public UX continues to accept short names when unique. |
| Governance | URI authority controls portable IDs. Local IDs may graduate only through an explicit new portable ID plus equivalence/migration declaration. |
| Tradeoff | Essential identity substrate with low wire commitment, but cannot satisfy unaware-consumer safety alone and introduces identity/version governance. |
| Falsifier | Rejected or simplified if no bundle ever composes independently published Kinds and qualified identities add no observable conflict-prevention value over a single fixed producer prefix. |

## O5 — Explicit profiles / contract sets

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | A profile names a base OKF edition, included Kind/extension IDs and versions, constraints, dependencies, mapping set, and compatibility policy. It does not inherently namespace wire data. |
| Declaration/discovery | Until OKF standardizes root metadata, store a profile as an ordinary pinned concept/convention contract and select it through an agentstate-owned non-core mechanism. If upstream adopts `okf_profile`, use it only under its final normative rules. |
| Generic unaware consumer | Ignores the profile. Therefore a profile cannot make `status: todo` safe under v0.2; selected mappings must place producer meaning elsewhere. |
| Ownership/conflict | Deterministic composition order is not enough: incompatible claims on one logical ID or wire coordinate fail profile compilation. No “last profile wins.” |
| Versions/offline | Canonical profile ID + immutable version/digest + embedded dependency closure. Remote registry is discovery/update only. |
| Operations | Strong validation/authoring contract and capability declaration. Interpretation is possible only when dependencies resolve locally; otherwise preserve and report unresolved. |
| New authoring / installed base | New bundles choose a profile deliberately. Existing implicit bundle conventions can be captured as a generated local profile before migration. |
| Implementation seam | Compile profiles into the same loaded registry; mutation receives the selected compiled contract. Do not teach the parser or backend about profiles. |
| Governance | Profile publisher declares base, dependency ranges or exact versions, conflict rules, deprecation, and migrations. Bundle operator approves upgrades. |
| Tradeoff | Excellent composition and reproducibility, but meaningful governance overhead and no generic-consumer isolation unless combined with O2/O3/O6. Root declaration is unsettled upstream. |
| Falsifier | Rejected as a required layer if actual bundles use exactly one authority/contract and profiles add no composition decision; rejected as a safety boundary whenever shared core-looking keys remain. |

## O6 — Version/profile-aware logical-to-serialized mappings

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | CLI aliases and logical field IDs map to serialized coordinates and codecs by explicit source/target contract. Example: Task alias `status` → logical workflow-state → v0.1 `status`, but v0.2 target → envelope `…values.workflow_state`; OKF lifecycle remains a separate logical field at top-level `status`. |
| Declaration/discovery | Convention/profile definitions declare coordinate path, shape/cardinality codec, presence/default policy, read aliases, and one write target per contract. Registry compilation proves uniqueness. |
| Generic unaware consumer | Safe only when the selected target mapping chooses an isolated coordinate. Mapping metadata itself cannot repair an unsafe target. |
| Ownership/conflict | Logical IDs own meanings; a compiler rejects two meanings mapped to one coordinate or two write targets for one meaning. Values never choose the mapping. |
| Versions/offline | Mapping tables and codecs are pinned with definitions and bundled. Selection uses declared OKF/profile/extension versions, never producer software guesswork. |
| Operations | Read may accept explicit legacy coordinates; create/mutate single-write the selected target; validate after logical decoding and before target encoding; export chooses a declared target or refuses lossy conversion. |
| New authoring / installed base | Preserves ergonomic `new Task --status todo` while changing wire form. Installed base needs O7 for progress, rollback, and concurrent transformation. |
| Implementation seam | Registry descriptors plus one coordinate accessor/codec; commands operate on logical fields, while `mutateDocument` materializes version-specific frontmatter and invariants. |
| Governance | Every mapping names source/target contracts, loss characteristics, inverse availability, and deprecation horizon. |
| Tradeoff | Best decoupling and future relocation story, but broader implementation surface across queries, status, help, and export; cannot alone coordinate migration. |
| Falsifier | Rejected if a representative mapping cannot be expressed without arbitrary executable code or if CLI/raw-wire ambiguity cannot be made legible in help and receipts. |

## O7 — Explicit compatibility and migration catalog/state machine

| Card field | Strongest reasonable form |
| --- | --- |
| Identity and wire | Catalog entries key `(source contract, target contract, transform version)` and include operation capabilities, coordinate conflicts, transforms, invariants, verification, and rollback requirements. |
| Declaration/discovery | Catalog compiles into the same semantic registry from shipped and bundle-pinned definitions. Active migration state is an ordinary product-owned OKF concept, updated with CAS. |
| Generic unaware consumer | During migration the root remains on the source OKF edition; transformed custom data is opaque extension data there. The root/active contract flips only after verification. |
| Ownership/conflict | Migration is chosen from declared contracts, never by inspecting whether a value “looks old.” Competing/ambiguous transforms fail preflight. |
| Versions/offline | Entire transform and dependency closure is local and digest-pinned. No migration begins if definitions or rollback basis are unavailable. |
| Operations | Preflight → enter write gate → per-doc read/classify/transform/CAS/checkpoint → verify complete target/no dual truth → CAS-flip bundle contract/version → unblock. Conflicts stay pending for a fresh read; blind retry is forbidden. |
| New authoring / installed base | New bundles skip migration and author target. Existing bundles remain readable; normal writes are blocked while migration is in progress, making interruption resumable without mixed-writer ambiguity. |
| Implementation seam | Add migration mode above the existing mutation/CAS primitives; reuse serializer and storage backend. A compatibility compiler augments the one registry rather than introducing schema authority elsewhere. |
| Governance | Each released contract change must classify compatibility, supply or explicitly omit a transform, state loss/manual decisions, and define rollback/verification. |
| Tradeoff | Solves installed-base and concurrency risk comprehensively, but has the highest control-plane/testing cost and cannot prevent poor new extension identities by itself. |
| Falsifier | Rejected or reduced if migrations are always atomic single-document operations with no installed base; otherwise any design lacking resumable state is falsified by the existing multi-agent/CAS requirements. |

# Collision coverage matrices

## O0 coverage — minimal wait/freeze

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 exact coordinate | Partial: refusing v0.2 writes prevents the known active collision from being emitted. | Manual audit/upstream watch. | Interpret source-edition `status`; preserve v0.2 opaquely without authoring. | No; deferred. |
| C2 semantic narrowing | Partial by staying on source contract. | Kind/core enum comparison when manually audited. | Source semantics only; no value guessing. | No. |
| C3 shape/cardinality | No. | Existing validator may notice Kind enum arity, not general shapes. | Best-effort opaque preservation. | No. |
| C4 scope | Partial by freeze. | Manual coordinate audit. | Source Kind scope only. | No. |
| C5 Kind/type | No future prevention. | Duplicate `governs` only within bundle. | Unknown types tolerated generically. | No. |
| C6 reserved location | No. | Upstream diff/manual review. | Refuse newly reserved targets once known. | No. |
| C7 parser/representation | No. | Existing audit/fixtures expose date loss. | Current mutation may normalize shape; cannot claim fidelity. | No. |
| C8 default/absence | Partial by avoiding target rules. | Manual semantic audit. | Source defaults only. | No. |
| C9 cross-field invariant | Partial: no v0.2 mutation. | Audit detects `generated.at`/`verified` risk. | v0.2 read-only. | No. |
| C10 graduation | No. | Manual upstream comparison. | Keep legacy as source-edition extension. | No. |
| C11 multi-contract | No. | Duplicate `governs` warning only. | First-by-id today is unsafe as precedence; strong posture refuses use. | No. |
| C12 version claim | Yes if the write-version guard is implemented. | Capability check before init/write. | Read/preserve may proceed; create/mutate refused. | Not applicable until target exists. |
| C13 migration state | Yes only by not starting migration. | N/A. | No mixed migration state. | No. |
| C14 authority ID | No. | Local duplicate name only. | Treat local names as local, not portable. | No. |

## O1 coverage — bare fields plus ledger

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | Partial: pre-write block, but no alternate coordinate. | Exact edition/core-vs-extension coordinate diff. | Refuse conflicting authoring; source read remains. | Manual rename required. |
| C2 | Partial. | Compare value domains/semantics declared in ledger. | Core meaning wins; invalid core reported, not laundered. | External mapping needed. |
| C3 | No structural isolation. | Declared shape/cardinality diff. | Preserve or refuse mutation when unsupported. | External codec needed. |
| C4 | No. | Scope metadata diff. | Fail ambiguous authoring. | External relocation needed. |
| C5 | Partial: block duplicate type claims. | Core/Kind token ledger. | Treat type as unresolved rather than select by order. | Rename/alias external. |
| C6 | Partial: block authoring into newly reserved space. | Reserved filename/prefix/path/heading/token diff. | Read/preserve where legal; mutation refuses. | External relocation. |
| C7 | No. | Parser-fidelity fixtures can be a ledger gate. | Fail writes lacking round-trip capability. | External representation fix. |
| C8 | No. | Explicit default/absence comparison. | Refuse ambiguous absence interpretation. | External explicit-value transform. |
| C9 | No. | Declared invariant diff if ledger models dependencies. | Mutation can be blocked pending invariant support. | External repair. |
| C10 | No. | Detect equivalent/overlapping names. | Core owns core coordinate; legacy remains separate. | External graduation mapping. |
| C11 | Partial: compile-time block. | Detect incompatible claims. | No last-wins; contract unresolved. | Profile/operator resolution required. |
| C12 | Yes. | Operation capability matrix. | Permit only supported operations. | Migration only if separately implemented. |
| C13 | No. | Can diagnose mixed coordinates. | Refuse writes in ambiguous mixed state. | No state machine. |
| C14 | Partial locally. | Duplicate authority/prefix/ID bindings in ledger. | Refuse ambiguous identity. | Rename/rebind manually. |

## O2 coverage — flat prefixes

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | Yes for prefixed custom fields if core respects/does not claim producer prefix. | Prefix/core-coordinate scan. | Generic ignores/preserves custom key; core key remains core. | Rename bare → prefixed explicitly. |
| C2 | Partial: separates core and producer domains, not producer-version narrowing. | Compare prefixed field versions/domains. | Apply pinned producer version or preserve opaque. | Needs value mapping. |
| C3 | No within a prefixed field. | Versioned shape declarations. | Refuse unsupported shape. | Needs codec. |
| C4 | Yes when field tokens encode producer/scope. | Detect same prefixed key claimed at two scopes. | Resolve from declared scope. | Move to new scoped key. |
| C5 | Partial only if type tokens are also prefixed. | Token registry. | Unknown prefixed types remain generic. | Rename type and convention. |
| C6 | Partial if paths/headings/links also prefixed; core can still reserve the prefix pattern. | Reserved-space diff. | Refuse newly conflicting output. | Rename/relocate. |
| C7 | No. | Parser fixtures. | Shape-preserving parser required separately. | Separate lexical transform. |
| C8 | No. | Versioned default declaration. | Pinned extension semantics. | Explicit absence transform. |
| C9 | No. | Dependency declarations optional. | Shared mutation hook required. | Separate invariant repair. |
| C10 | Partial: distinct old prefix/core coordinate avoids ambiguity. | Equivalence registry needed. | Read both only under explicit transition. | Rename/map, then remove legacy. |
| C11 | Partial: partitions publishers, not same-publisher profiles. | Duplicate target-key compilation. | Refuse incompatible composition. | Operator-selected remap. |
| C12 | No by itself. | Capability ledger required. | No inherent gate. | No. |
| C13 | No. | Can find both keys. | Dual-read possible; no progress authority. | Needs O7. |
| C14 | Partial/social. | Local prefix-owner duplicate check. | Refuse ambiguous binding. | Re-prefix all affected data. |

## O3 coverage — nested envelope

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | Yes for inner fields; outer-anchor collision remains provisional. | Core-vs-anchor and inner-entry ownership scan. | Generic preserves/ignores envelope; core key unambiguous. | Bare → envelope transform required. |
| C2 | Partial: isolates authorities, not version narrowing within one entry. | Entry-version/domain comparison. | Apply pinned version or preserve unknown entry. | Needs versioned value mapping. |
| C3 | Partial: core shape cannot collide with inner path; extension version can. | Entry schema diff. | Preserve unsupported entry; refuse aware mutation. | Needs codec. |
| C4 | Yes: subtree establishes extension scope. | Registry detects scope mismatch. | Resolve within entry contract. | Relocate into scoped subtree. |
| C5 | No unless composed with qualified type/Kind identity. | Envelope may carry Kind identity, but bare `type` can still collide. | Generic type behavior remains OKF-free-form. | Needs O4/O6. |
| C6 | Partial: one anchor reduces exposed surface; anchor/path reservation still possible. | Reserved-space diff. | Refuse affected target mapping. | Relocate envelope via O6/O7. |
| C7 | No. | Nested preservation fixtures are required. | Opaque preserve only if parser retains shape. | Separate representation repair. |
| C8 | Partial: entry version scopes defaults. | Schema declares presence/default. | Unknown entry stays opaque; aware reader applies pinned rules. | Explicit materialization transform. |
| C9 | No. | Contract can declare invariant, but mutation must enforce. | Shared mutation rule required. | Separate recalculation/invalidation. |
| C10 | Partial: legacy and core forms remain distinct. | Explicit equivalence/duplication check. | Conflict refuses; never choose by value. | Needs single-write graduation map. |
| C11 | Partial: authority entries coexist; logical conflicts remain. | Registry composes IDs and detects overlapping claims. | Preserve unresolved entries, refuse authoring. | Operator/profile resolution. |
| C12 | No by itself. | Contract capability needed. | No inherent writer gate. | No. |
| C13 | No state machine. | Detect legacy plus envelope duplicates. | Dual-read can be explicit, but mixed progress unresolved. | Needs O7. |
| C14 | Yes for entries with canonical authority IDs; outer anchor remains producer-owned. | Same-ID/different-definition digest check. | Refuse conflicting definition; preserve unknown IDs. | Re-identification requires explicit migration. |

## O4 coverage — qualified identities

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | No unless qualified field ID maps to a non-core wire coordinate. | Yes: two meanings no longer collapse semantically. | Still unsafe for unaware consumer at bare core key. | Needs O6/O7. |
| C2 | Partial: versioned semantic ID disambiguates domains. | Version/domain mismatch. | Select declared version, never value. | Mapping required. |
| C3 | No wire protection. | Versioned field shape comparison. | Refuse unsupported definition. | Codec required. |
| C4 | Yes semantically through qualified field scope. | Registry detects scope aliases. | Resolve canonical scoped ID. | Coordinate mapping required. |
| C5 | Yes for new qualified Kind/type identities. | Alias/token ambiguity check. | Generic tolerates qualified unknown type. | Legacy alias → qualified type. |
| C6 | No direct location protection. | Semantic ID survives coordinate collision detection. | Refuse unsafe mapping. | Relocate through mapping. |
| C7 | No. | Identity does not expose coercion. | Separate parser policy. | Separate. |
| C8 | Partial if versioned field contract declares absence. | Definition comparison. | Apply selected version. | Explicit-state mapping. |
| C9 | No. | Can identify which authority owns invariant. | Mutation support separate. | Separate. |
| C10 | Yes semantically: old and core IDs remain distinct/equatable explicitly. | Equivalence/duplicate declaration. | Declared precedence only. | Alias/equivalence-driven mapping needed. |
| C11 | Partial: incompatible canonical claims are clear. | Registry conflict compilation. | Refuse ambiguous aliases/composition. | Profile/operator resolution. |
| C12 | No. | Version identity supports capability lookup. | Gate separate. | No. |
| C13 | No. | Can label representations precisely. | No progress handling. | Needs O7. |
| C14 | Yes when canonical authorities are durable; local identities remain local. | Duplicate ID/digest mismatch. | Fail closed offline. | Explicit authority transition. |

## O5 coverage — profiles

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | No if profile retains shared core coordinate; yes only through selected safe mapping. | Profile compiler detects coordinate overlap. | Unaware consumer still misreads unsafe wire; aware writer must refuse. | Mapping catalog required. |
| C2 | Partial through constrained/versioned domains. | Profile validation. | Apply declared profile only when resolved. | Transform declaration required. |
| C3 | Partial through shape constraints. | Profile schema diff. | Preserve unresolved profile data; aware mutation refuses. | Codec required. |
| C4 | Partial through declared scopes. | Composition compiler. | Profile-aware resolution. | Relocation mapping. |
| C5 | Partial if profile qualifies Kind IDs; root declaration alone does not. | Vocabulary collision check. | Unknown profile/type handled generically. | Alias mapping. |
| C6 | No inherent isolation. | Profile/core reserved-space diff. | Refuse unsafe profile target. | Relocation mapping. |
| C7 | No. | Profile can require fidelity tests. | Parser capability still decisive. | Separate. |
| C8 | Yes within a complete profile contract. | Validate absence/default rules. | Apply pinned profile semantics. | Materialize/remove explicit state. |
| C9 | Partial: profile can declare cross-field rules. | Validation catches stale relation. | Shared mutation must enforce/derive. | Repair transform. |
| C10 | Partial: profile can declare equivalence/deprecation. | Detect simultaneous legacy/core claims. | Precedence declared, not inferred. | Needs O7 execution. |
| C11 | Yes at compilation if conflicts fail rather than order-win. | Dependency/coordinate/logical-ID conflict. | Unresolved profile disables authoring, preserves data. | Select compatible profile set. |
| C12 | Yes if profile carries operation capabilities and base edition. | Capability gate. | Permit supported operations only. | Migration entry required. |
| C13 | No execution state. | Profile mismatch/mixed representations detectable. | May dual-read by declaration. | Needs O7. |
| C14 | Partial with canonical profile IDs/digests. | Same-ID/different-content check. | Offline pinned copy wins only when exact digest declared. | Rebind explicitly. |

## O6 coverage — logical-to-wire mappings

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | Yes when target compiler refuses core overlap and selects isolated coordinate. | Compile all target coordinates against core edition. | Decode declared source; encode one target. | Supplies field transform, not progress state. |
| C2 | Yes when separate logical IDs/codecs are used. | Domain/meaning change in mapping diff. | No value-based ownership; invalid core remains core error. | Deterministic map or manual-loss refusal. |
| C3 | Partial/yes with declared shape codec. | Shape/cardinality compatibility check. | Decode supported shapes; opaque/refuse others. | Codec transforms if lossless/approved. |
| C4 | Yes through scoped logical IDs and target paths. | Compiler checks scope/coordinate uniqueness. | Context selects logical ID, not bare key. | Relocate. |
| C5 | Yes if `type` itself has a logical-to-wire mapping. | Type-token collision compilation. | Qualified logical Kind drives behavior. | Rename type plus references/conventions. |
| C6 | Yes for mapped coordinates once reserved-space ledger is current. | Target-path/reserved-location compile. | Refuse unsupported target. | Relocate all mapped artifacts. |
| C7 | Partial only when codec preserves lexical/scalar shape. | Round-trip fixtures per codec. | Refuse lossy write. | Representation transform explicit. |
| C8 | Yes with presence/default semantics in mapping. | Source/target absence comparison. | Logical value distinguishes absent/default. | Materialize/remove values explicitly. |
| C9 | No by mapping alone. | Mapping can name dependencies. | Mutation invariant hook required. | Recompute/invalidate transform. |
| C10 | Yes: equivalence maps distinct IDs to one target with declared precedence. | Both source/target present is conflict. | Dual-read, single-write target; disagreement fails. | Field transform available; O7 coordinates execution. |
| C11 | Yes at compiler if one coordinate/logical ID cannot have incompatible mappings. | Compile conflict. | Refuse authoring; preserve raw. | Operator selects/remaps. |
| C12 | Partial: mappings prove representation, not complete writer semantics. | Capability matrix must gate operation. | No overclaim if combined with O1/O5. | No progress state. |
| C13 | Partial: defines source/target and single-write rule. | Detect both/neither coordinates. | Deterministic per-document read. | Needs O7 resumability/CAS journal. |
| C14 | No without O4 authority identity. | Mapping compiler can see duplicate string IDs only. | Refuse ambiguity. | Re-identification external. |

## O7 coverage — compatibility/migration catalog

| Class | Prevent | Detect | Runtime | Migrate |
| --- | --- | --- | --- | --- |
| C1 | No new-wire isolation by itself. | Preflight core/extension coordinate diff. | Blocks unsafe target and normal writes during migration. | Yes when supplied an isolated target map. |
| C2 | No by itself. | Source/target semantic/domain classification. | Requires declared transform; never guesses from value. | Yes if deterministic; otherwise manual/refuse. |
| C3 | No. | Shape/cardinality preflight. | Preserve/refuse unsupported shape. | Codec + loss approval + verification. |
| C4 | No. | Scope diff. | Source contract remains authoritative until commit. | Relocate with declared mapping. |
| C5 | No. | Type/Kind identity diff. | Gate ambiguous documents. | Rename with registry/reference update. |
| C6 | No. | Reserved-space inventory. | Write gate prevents further use. | Relocate paths/coordinates with CAS. |
| C7 | No parser prevention. | Preflight round-trip test/shape inventory. | Refuse migration before fidelity exists. | Yes after parser/codec fix; verify exact shapes. |
| C8 | No. | Source/target default/absence diff. | Source semantics until final flip. | Explicit materialization/removal. |
| C9 | Partial through mandatory target invariant checks. | Pre/post dependency validation. | Migration gate prevents stale ordinary writes. | Recalculate/invalidate in same CAS candidate. |
| C10 | No identity creation. | Detect both forms/equivalence conflicts. | One representation authoritative per doc; conflict stops. | Yes: dual-read/single-write, remove legacy. |
| C11 | Partial: preflight refuses ambiguous contract set. | Full dependency/mapping composition check. | No migration starts; preserve current state. | Only after operator selects compatible target. |
| C12 | Yes through operation capability gate. | Source/target writer support preflight. | Root version flips last. | Yes, with truthful final claim. |
| C13 | Yes for ambiguity under normal operation. | CAS journal, per-doc classification, full verification. | Normal writes blocked; readers explicitly understand source/target states. | Yes: resumable, CAS-safe, rollback-gated. |
| C14 | No identity prevention. | Pinned ID/version/digest mismatch. | Refuse unavailable/ambiguous authority. | Explicit re-identification transform. |

# Preliminary recommendation: a layered contract, not one mechanism

No single option covers C1–C14. The strongest proportionate architecture is a staged composition:

| Layer | Selected mechanism | What it owns | What it does not own |
| --- | --- | --- | --- |
| Immediate safety | O0 write-version guard + O1 collision/capability ledger | Truthful claims, release-diff diagnostics, fail-closed unsupported writes. | No durable extension syntax. |
| Semantic identity | O4 qualified Kind and logical-field IDs | Authority, local-vs-portable scope, aliases, extension graduation identity. | Wire isolation or migration execution. |
| Wire isolation | O3 nested extension envelope; O2 only for the single outer producer anchor while upstream has no standard container | Keeps producer values out of core coordinates for profile-unaware consumers; contains multiple extension authorities. | Extension-version semantics and transforms. |
| Author ergonomics/evolution | O6 logical-to-wire mapping | Stable CLI/Kind concepts, edition/profile-selected coordinates/codecs, dual-read/single-write. | Bundle migration progress and rollback. |
| Composition | O5 pinned profiles/contract sets, optional where one contract suffices | Base edition, dependency closure, compatible composition, operation capabilities. | Generic-consumer safety; never licenses core-key overloading. |
| Installed base | O7 compatibility/migration catalog and state machine | Preflight, write gate, CAS transformation, checkpoints, verification, root flip, rollback basis. | New semantic identity or safe target syntax. |

### Recommended target shape

The exact spelling is provisional pending upstream, but the ownership structure should be fixed now:

```yaml
type: holaxis.ai/agentstate-lite/Task
status: stable
x-agentstate-lite:
  kind:
    id: https://holaxis.ai/agentstate-lite/kinds/task
    version: "1"
  extensions:
    https://holaxis.ai/agentstate-lite/extensions/task-workflow:
      version: "1"
      values:
        workflow_state: todo
```

Interpretation:

- `status` is unambiguously OKF lifecycle under v0.2.
- `type` is a visibly qualified but otherwise ordinary OKF type token, which generic consumers must tolerate.
- `x-agentstate-lite` is a provisional producer-owned serialization anchor, not a claim that agentstate-lite owns every nested extension's semantics.
- The canonical extension ID owns `workflow_state`; its pinned version determines the domain.
- The CLI may continue accepting Kind-scoped `--status todo` as an ergonomic alias, but help/receipts and the registry resolve it to the logical field `…/task-workflow#workflow_state`, not to raw top-level `status`. A distinct core-lifecycle logical field maps to top-level `status`.
- If OKF later defines a normative extension container, only the wire mapping and migration target change; semantic IDs and CLI aliases remain stable.

For a bundle-local convention, use an explicitly local identity tied to its convention document and bundle contract. Do not mint a credible-looking global URI merely to fill the field. If the convention becomes portable, mint a new authority-qualified ID, declare equivalence/deprecation, and migrate; do not silently reinterpret the local ID.

### Why not flat prefixes alone?

Flat prefixes are a viable low-cost target for one producer and may be a fallback if nested-map tooling proves poor. They are not the preferred durable model because the extension ecosystem already has multiple independently authored recipes and bundle-local conventions. A single envelope with canonical entry IDs makes authority, version, composition, opaque preservation, and future relocation explicit while limiting the exposed top-level collision surface to one anchor.

### Why profiles are not the safety boundary

A profile-aware writer can know that `status: todo` means workflow state; a generic v0.2 consumer cannot. The profile does not erase the core field's normative meaning. Profiles are selected for validation, composition, and mapping choice only after wire isolation establishes unaware-consumer safety.

# Collision-pattern playbook

Future agents should apply this decision procedure rather than inventing a fresh response per collision:

1. **Inventory the contract delta.** Diff the new OKF edition's core fields, types, value domains, shapes, defaults, reserved filenames/prefixes/sections/link tokens, and cross-field invariants against the compiled registry's exact serialized coordinates and semantic identities.
2. **Classify all applicable C1–C14 classes.** One event may be C1+C2+C4+C10+C12+C13, as `status` is. Record generic/profile-aware behavior separately.
3. **Assign ownership from declarations.** The target OKF edition owns its core coordinates. Extension IDs own only their isolated wire subtrees. Never inspect values to decide ownership.
4. **Choose a new target mapping.** For C1/C4/C5/C6, allocate or relocate to an extension-owned coordinate/type/location. For C2/C3/C8, define a versioned semantic/shape codec or mark conversion manual/lossy. For C7, repair parser fidelity before migration. For C9, add one shared mutation invariant. For C11/C14, refuse ambiguous composition/identity.
5. **Declare capability honestly.** A target mapping is not a writer. Update the operation matrix only when create/mutate/export invariants and fixtures exist.
6. **Publish a migration entry.** Name source contract, target contract, transformation version, inverse/rollback, loss policy, validation, and affected identities. Absence of a safe transform is an explicit `manual` or `unsupported`, never an implicit best effort.
7. **Run the migration state machine.** Preflight all data and dependencies; CAS-enter migration/write-gated mode; transform one document from a fresh revision; checkpoint; resume conflicts rather than overwrite; verify no old/new duplicates; flip root edition/active profile last; unblock normal writes.
8. **Retire one truth.** After commit, readers may retain a bounded legacy-read compatibility window, but writers emit only target. Diagnostics treat lingering legacy representation as migration debt, not an equal authority.

Pattern-to-primary-solution summary:

| Pattern family | Classes | Primary solution | Mandatory companion |
| --- | --- | --- | --- |
| Namespace/identity capture | C1, C4, C5, C6, C14 | Qualified IDs + isolated envelope/type/path mapping | Collision ledger and authority governance |
| Semantic/schema evolution | C2, C3, C8, C10 | Versioned logical field/Kind mappings and codecs | Explicit equivalence/loss policy and migration |
| Representation fidelity | C7 | One parser/serializer with lexical/shape-preserving fixtures | Migration refusal until fidelity is proven |
| Coupled assertions | C9 | Version-specific invariant at shared mutation boundary | Verification invalidation/recalculation in same candidate |
| Contract composition | C11 | Pinned profile/registry compiler with conflict refusal | Offline dependency closure |
| Truthful support | C12 | Operation-specific capability gate | Release fixtures across supported backends |
| Installed-base transition | C13 | Write-gated, resumable CAS migration state machine | Backup/rollback basis and full-target verification |

# New-authoring and installed-base policy

## New authoring

1. Bundle open resolves the root OKF edition plus active pinned contract/profile set locally.
2. The one registry compiles canonical Kind IDs, aliases, logical field IDs, wire mappings, shapes, dependencies, and mutation invariants. Any ambiguity blocks semantic authoring but not raw read/opaque preservation.
3. `new`/`doc update` accept human aliases in the context of a selected Kind. Help and receipts disclose the logical ID and target coordinate when the alias could be confused with a core field.
4. The shared mutation service decodes existing representation, applies the logical patch, validates logical constraints, materializes the single target representation, applies edition-specific clocks/invariants, and CAS-writes.
5. Raw `doc write` remains a dangerous full replacement. Under a profile/edition it must pass the same target-contract validation or explicitly operate as opaque transport; it may not bypass mappings by spelling a conflicting key.

## Existing v0.1 bundles

1. Stay v0.1 until the target writer and migration entry are shipped. Do not eagerly rename `status` now.
2. Generate a preflight report that classifies every affected document by source representation, target mapping, shape/loss, and current revision. Missing or ambiguous convention ownership stops migration.
3. Snapshot rollback material before transforming. A backend with retained history may satisfy this; the degenerate filesystem backend requires an exported byte snapshot or a provably reversible transform. A content hash without the bytes is not rollback.
4. CAS-enter a persisted migration state that blocks normal mutations. The state names source/target contracts and transform digest; another process can resume it but cannot silently select a different transform.
5. Transform each document from exactly one recognized source coordinate to exactly one target coordinate, delete the legacy coordinate in the same CAS write, and checkpoint the resulting revision. If both forms already exist, compare only under declared equivalence rules; disagreement requires human resolution.
6. Keep root `okf_version: "0.1"` during conversion. Thus a generic consumer treats new envelope data as producer extensions while remaining legacy docs retain v0.1 meaning. Do not flip to v0.2 while any `status: todo`-style legacy field remains.
7. Verify the complete target, cross-field invariants, unknown-field preservation, scalar shapes, and absence of dual truth. Then CAS-flip root version/profile and unblock target writer.
8. Older agentstate-lite releases are not promised semantic mutation of the target profile. Generic/older readers may preserve unknown data; a full-rewrite producer that discards it is outside semantic compatibility. Emit a minimum-writer diagnostic where possible, but do not pretend an unaware old binary can be forced to comply.

# Migration state model

| State | Allowed operations | Exit condition |
| --- | --- | --- |
| `idle` | Normal source-contract reads/writes. | Operator selects a supported target and preflight passes. |
| `planned` | Reads; no transform yet. Normal writes may continue only if preflight will be rerun. | Rollback bytes/strategy, transform digest, dependency closure, and affected set are pinned. |
| `in_progress` | Reads under explicit mixed representation rules; normal semantic mutations blocked; migration CAS writes only. | Every affected document is target-only or explicitly adjudicated; conflicts are pending, never overwritten. |
| `verifying` | Reads; normal writes remain blocked. | Full scan proves target validity, no legacy/dual coordinates, invariant freshness, and expected counts/hashes. |
| `committing` | No normal writes. | Root OKF/profile contract CAS-flips last, then state records final root revision. |
| `complete` | Normal target-contract reads/writes; legacy read support is diagnostic and time-bounded. | Superseded only by a new named migration. |
| `failed` / `aborting` | Normal writes blocked until operator resumes or rolls back from pinned bytes/history. | Source contract restored completely or migration resumes with the same transform identity. |

Per-document checkpoint fields need at least document ID, source revision, result revision, transform version, outcome (`converted`, `already_target`, `manual`, `conflict`, `failed`), and diagnostic. The state model may be projected as ordinary OKF documents/blobs, but it must be mutated through the same backend/CAS primitives and must not become a second definition of Kind semantics.

# Offline and governance policy

## Identity tiers

- **OKF core:** identified by edition plus normative coordinate/rule.
- **Portable extension/Kind:** canonical URI controlled by a durable publisher; immutable version or content digest; definition snapshot carried locally.
- **Bundle-local extension/Kind:** explicit local identity referencing the bundle contract and convention doc. It is valid and useful offline but makes no cross-bundle semantic claim.
- **Alias:** human-facing only. It resolves to exactly one canonical ID in a compiled contract or is rejected as ambiguous.
- **Recipe:** installation provenance. A recipe may carry definitions, but its name/source does not replace their semantic authority IDs.

## Definition resolution

Resolution order is deterministic and offline: exact definition embedded in the bundle → exact built-in definition/digest shipped with the implementation → unavailable. A network registry may advertise updates or retrieve a requested snapshot, but cannot silently substitute a mutable latest definition. If the exact contract is unavailable, raw read and opaque preservation may continue; interpret/validate/create/mutate/migrate do not.

## Composition

Profiles compose only if the registry compiler proves:

- one definition per canonical ID/version/digest;
- aliases are unambiguous in their declared scope;
- one write coordinate per logical field under the target contract;
- no two logical meanings occupy one coordinate;
- shape/default/invariant constraints are compatible;
- dependency versions resolve exactly or by a deterministic locally pinned choice.

Load order, recipe installation order, and path sort order are diagnostics/provenance, never semantic precedence. This intentionally replaces current `first-by-id wins` behavior for portable semantic conflicts while preserving tolerant raw discovery.

## Extension graduation

When OKF standardizes an extension concept:

1. Keep the legacy semantic ID distinct from the new core ID.
2. Publish an explicit equivalence or non-equivalence declaration with source/target editions.
3. If equivalent, map both reads to one logical concept during a bounded transition and single-write the core target; conflicting simultaneous values fail.
4. If only partially equivalent, require a transform with stated loss/manual fields or keep the extension separate.
5. Migrate and remove the legacy representation before declaring the new edition/profile active.
6. Deprecate the extension definition with a successor link; never repurpose its ID for the core definition.

## Release discipline

Every supported OKF or extension/profile release should produce four generated artifacts from one compatibility source:

1. coordinate/identity collision report over C1–C14;
2. operation-specific support matrix;
3. compiled mapping/invariant registry with offline dependency closure;
4. migration availability table (`automatic`, `manual`, `unsupported`) with rollback and validation evidence.

The generation path is a knowledge-ratchet: once a collision pattern is encoded, future standards upgrades fail in preflight rather than depending on a maintainer remembering `status`.

# Implementation seams and constraints

This artifact does not specify an implementation plan, but feasibility depends on using these existing seams:

1. **Parser:** keep `frontmatter.ts` as the sole YAML authority. Before nested-envelope migration, add exact round-trip/shape fixtures for nested dates, date-only scalars, lists, and unknown mappings. A mapping layer receives parsed values; it does not parse YAML.
2. **Registry:** evolve `KindConvention` field strings into descriptors while supporting legacy declarations. Compile canonical Kind/field IDs, aliases, coordinates, codecs, profile dependencies, and collision findings in the one registry load. If the public name changes from `KindRegistry`, it remains one object/authority.
3. **Accessor:** create one pure coordinate get/set/delete/project primitive. `validateAgainstKind`, `isTerminal`, query filtering/projection, help/receipts, `new`, and update use it. Direct `frontmatter[field]` access for logical Kind fields should disappear together, not piecemeal.
4. **Mutation:** `mutateDocument` owns contract selection, logical decode/patch/encode, target single-write, timestamp/`generated.at`, verification-staleness invariants, no-op comparison, and CAS. CLI adapters continue to own only argument and error presentation.
5. **Recipes:** extend recipe/Convention declarations to carry pinned identities and mappings; keep expect-absent installation. Recipe upgrade is a named migration, never an automatic overwrite of hand-edited conventions.
6. **Capability guard:** centralize supported write contracts in core/product policy. `init --okf-version`, `new`, `doc write/update`, View actions, remote mutation, promote-to-document, and future hosts consult the same operation matrix.
7. **Migration:** orchestrate above the shared mutation/backend primitives. Use reserved-file CAS for the final root flip and per-document CAS for transformations. Tests must include filesystem, memory, and reference-server behavior plus true interruption/concurrency cases.

This preserves one parser, one registry, and one shared mutation authority. It also keeps filesystem, memory, and remote storage adapters semantically ignorant of OKF profiles and mappings.

# Tradeoffs, falsifiers, and confidence

## Material costs

- Qualified IDs and profile pins impose governance that is excessive for purely local throwaway Kinds. The local identity tier is therefore deliberately lighter and must not claim portability.
- Nested fields complicate raw `--field` queries and human hand-editing compared with flat prefixed keys. The logical CLI must make the common path easy and preserve a raw-wire escape for inspection.
- Write-gated migration temporarily pauses normal agent writes. This is preferable to accepting ambiguous concurrent semantics, but operational UX must make resume/rollback obvious.
- A provisional `x-agentstate-lite` anchor is not protected by current OKF. The upstream ask should request a reserved extension point or producer-prefix policy. If upstream supplies one, migrate the anchor through the same mapping machinery.
- Exact byte preservation is not generally possible after YAML parse/serialize; semantic scalar-shape preservation is the minimum writer requirement. Where lexical identity matters, use raw byte transport and do not claim semantic mutation.

## Recommendation falsifiers

Reconsider the preferred composition if any of these occur:

1. Primary-source standards evidence shows a normative OKF extension mechanism with stronger generic-consumer guarantees; adopt its wire/declaration layer while retaining semantic IDs, mappings, and migration invariants.
2. An empirical tool matrix shows nested unknown mappings are commonly dropped or mangled while flat prefixed scalars survive. Prefer O2 flat keys, still with O4/O6/O7.
3. A prototype cannot make nested logical query/update/help behavior legible through one accessor/registry without duplicating semantics across commands. Simplify wire shape before implementation.
4. Bundle-local identity cannot remain stable through copy/fork/merge semantics. Require explicit re-homing on copy or introduce a durable bundle identifier before depending on local IDs across bundles.
5. The next several real collision cases are fully contained by the immediate ledger and never require alternate representation, making the envelope/profile overhead disproportionate. Keep O0/O1 longer, but do not weaken the hard invariants.
6. Upstream explicitly guarantees that producer prefixes can never become core and defines prefix ownership. O2 becomes a stronger, possibly preferable wire layer; stable IDs/mappings/migration remain useful.

## Confidence

- **High:** O0/O1 immediate guard/diagnostics; profiles alone cannot protect unaware consumers; identity must be separate from wire; C7/C9/C12/C13 require mechanisms beyond namespacing.
- **Medium-high:** O4+O6+O7 as the durable identity/evolution/migration backbone; it fits the current source seams directly.
- **Medium:** O3 nested envelope as the best provisional wire representation. It needs empirical round-trip/query ergonomics testing and comparison with the independent standards evidence.
- **Low until upstream answers:** exact root/profile declaration and exact outer extension-anchor spelling.

# Evidence and links

- [OKF v0.2 specification at reviewed commit](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md): §§4.1, 5.4, 11–13 establish unknown-key preservation, `status`, conformance, versioning, and v0.1 fallbacks.
- [Upstream profile proposal #212](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/212): open proposal and root-index metadata ambiguity; not normative.
- [Upstream minor-version compatibility issue #239](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/239): open producer concern about v0.2 breaking changes; not normative.
- [Upstream date-scalar issue #240](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/240): open representation ambiguity; not normative.
- [Upstream collision issue #272](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/272): concrete `status` producer collision; not normative.
- [Local compatibility audit](../research/okf-v0-2-compatibility-audit.md) and [existing stewardship design](./okf-compatibility-and-upstream-stewardship.md).
- Source seams reviewed at local commit `164ba7edb89c31678856020ee794f80530e6c276`: `packages/core/src/{frontmatter,kinds,kinds-load,document-mutation,bundle}.ts` and `packages/cli/src/{recipe-parser,recipes,mutate}.ts`, plus `commands/{new,doc/update,doc/write,init,kinds,list,status}.ts`.

