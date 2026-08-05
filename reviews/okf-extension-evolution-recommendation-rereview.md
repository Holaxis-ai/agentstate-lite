---
type: Review
title: Exact repair re-review of OKF extension evolution recommendation
actor: codex-standards-reviewer
timestamp: '2026-08-05T23:04:39.750Z'
---
# Exact repair re-review

## Decision card

- **Target:** `designs/okf-extension-evolution-recommendation` at exact version `sha256:efa470dccbe2fe1aa8d5c06f17603e9ae6cd1a520715159c2a562e6507fde378`.
- **Prior review:** `reviews/okf-extension-evolution-recommendation` at `sha256:48d08834cd9976f69f73b5395807ca14617f7b71a74ff4cf7cfb99c0a9713ca2` with verdict CONDITIONAL.
- **Verdict:** **PASS**.
- **Repairs:** F1 migration-fence/commit-boundary repair passes; F2 upstream-outcome decision-table repair passes.
- **Regression check:** no regression found in the previously survived identity, wire-isolation, profile, capability, offline-resolution, parser, executable-trust, compatibility-envelope, validation-evidence, graduation, or proportionality invariants.
- **Further exact re-review:** not required unless the design changes again.
- **Confidence:** high.

## Scope and method

This review inspected the exact repaired artifact and compared it with the previously reviewed bytes. The substantive changes are confined to:

1. hard invariant 16 and the existing-v0.1 migration procedure;
2. explicit cooperative-client versus authoritative write-fence semantics;
3. target verification/activation/abort rules;
4. a seven-row upstream-outcome decision table;
5. corresponding risk and prototype acceptance language.

The re-review reran the original F1/F2 attacks and sampled all previously survived invariants. It did not edit the design or review implementation code.

## F1 repair — PASS

### Required property: supported write authority owns a migration epoch/fence

**Pass.** The design now distinguishes the cooperative-client layer from the authoritative guarantee. Current semantic mutators consult the persisted state, while supported concurrent migration additionally requires a backend/server write authority that enforces the bundle epoch at every write boundary, rejects absent/stale epochs, and rejects incompatible client contracts.

This no longer claims that a Markdown marker can control an old binary. The generic write fence may be implemented below semantic mapping without making storage adapters interpret OKF fields; it is a concurrency/admission capability, while semantic classification remains in the one registry/mutation authority.

### Required property: direct-file fallback is truthfully quiescent

**Pass.** Direct-filesystem operation explicitly requires an operator-enforced quiescent maintenance window because legacy binaries and manual edits can ignore metadata. If neither a backend fence nor provable quiescence is available, automated online migration and target activation are unsupported.

That is the correct capability boundary. It does not overclaim that local files can prevent arbitrary external writes, and it preserves local-first operation by permitting an offline exclusive migration rather than requiring a service.

### Required property: verified revision set is protected through activation

**Pass.** Verification now persists the complete affected document-ID/revision set or equivalent authenticated snapshot. Commit proceeds only while the fence/quiescence remains effective and that complete set is unchanged. The root contract and migration epoch change last, within the same protected interval.

This closes the earlier time-of-check/time-of-commit scenario: a late write either is rejected by the epoch authority, violates the quiescent operating contract, or changes the protected set and prevents activation.

### Required property: drift, audit, release, and abort are explicit

**Pass.** Pre-commit drift returns the migration to `in_progress`/`verifying`. A final audit of root and protected target revisions occurs before releasing the fence and enabling target-compatible writers. Failure/abort retains epoch, transform identity, checkpoints, and rollback bytes until the source contract is fully restored or the same migration resumes.

The design also states that an incompatible post-cutover legacy writer is outside the supported contract and must either be prevented by the write-domain policy or diagnosed as conformance regression. It no longer relies on frontmatter to force cooperation.

### F1 adversarial transcript

1. Document A is verified at revision `r1`.
2. A fresh legacy writer attempts source-form revision `r2` before root activation.
3. Under an epoch-enforcing backend the write lacks/stales the epoch and is rejected. Under direct-file operation, such concurrent activity violates the required quiescent window; if observed, the revision set changes.
4. The protected-set comparison fails, so commit returns to verification rather than flipping the root.
5. If no drift occurs, root/profile activation and migration-epoch commit happen while the fence/quiescence remains held.
6. The final audit runs before release. A crash retains the committing epoch and rollback state for deterministic recovery.

No reviewed path now allows the root target claim to succeed over a different document snapshot than the one verified.

## F2 repair — PASS

The new table covers every required upstream branch and states declaration/wire choice, unchanged local layers, evidence threshold, and migration-before-claim behavior.

| Outcome | Re-review result |
| --- | --- |
| Normative extension container plus profile declaration | Pass: adopts both only after normative text/tool tests; provisional coordinates migrate before target claim. |
| Normative profile only, no isolated lane | Pass: uses profile for contract selection but retains isolated local wire; explicitly forbids profile-authorized core-key overload. |
| Reserved producer prefix/namespace lane | Pass: prefix can anchor nested or authority-bound flat representation after empirical tests; canonical identity remains independent. |
| Global producer-key reservation/registry only | Pass: registration supplies ownership, not semantic definition or conformance; local definitions/mappings remain pinned. |
| Machine-readable core registry/change policy only | Pass: improves collision/capability compilation without changing the local extension claim. |
| Core retracts/renames `status` | Pass: exact new edition is reclassified; custom identity is not silently collapsed back into the bare key; simplification is a separate migration. |
| No timely answer | Pass: honest v0.1 writes remain the default; any local v0.2 target is explicitly provisional, tested, offline-pinned, and relocatable. |

The table prevents an implementer from inferring that upstream profile support, namespace registration, or a core registry solves more than it actually does. Every branch preserves the invariant identity/capability/mapping/migration layers and requires migration before making a claim that depends on a new wire/declaration mechanism.

## Regression audit of previously survived invariants

| Invariant area | Result | Evidence in repaired design |
| --- | --- | --- |
| Generic profile-unaware safety | Pass | Producer workflow remains outside core `status`; profiles never authorize overload. |
| Core/custom/local authority classes | Pass | Three-tier identity model unchanged. |
| Stable semantic ID vs version/digest/revision | Pass | Exact definition tuple and CAS revision separation unchanged. |
| Multiple available definition versions | Pass | Coexistence allowed; same ID/version with unequal content remains integrity error; one active binding. |
| Local vs portable scope | Pass | Local identity remains lightweight/nonportable; graduation mints portable identity. |
| One parser/registry/mutation authority | Pass | Repair adds a generic write-domain fence, not a second semantic registry, parser, or mapper. |
| Operation-specific required support | Pass | Read/preserve/interpret/validate/create/mutate/migrate/export distinctions unchanged. |
| Parser and shape fidelity | Pass | Migration still refuses until date/scalar/nested/list fixtures prove target behavior. |
| Executable-definition trust | Pass | Declarative default and explicit exact-code trust boundary unchanged. |
| Offline resolution | Pass | Exact embedded/shipped definitions remain authoritative; network cannot substitute latest. |
| No value guessing/load order | Pass | Ownership and composition remain declaration-driven; invalid core values are not laundered. |
| Single authoritative representation | Pass | Dual-read/single-write and disagreement failure unchanged; compatibility data remains archival. |
| Validation evidence | Pass strengthened | Target evidence now binds the protected complete revision set through commit. |
| Extension graduation | Pass | Distinct IDs, authorized equivalence, migration, support horizon, and retirement unchanged. |
| Proportionality | Pass | Phase 0 remains low-cost; the stronger fence is required only for migration/concurrent activation, with quiescence as the local fallback. |

## Verdict rationale

The repaired design no longer permits or overclaims any of the hard-failure paths from the plan:

- no silent core reinterpretation;
- no dishonest target claim over a drifting storage snapshot;
- no lossy undeclared migration;
- no indefinite competing truth;
- no non-resumable conversion;
- no load-order or value-based ownership;
- no network-required interpretation.

The remaining wire spelling, authority-transfer policy, and bundle-copy identity questions are explicitly staged human/product decisions with falsifiers. They do not undermine the overall approach or require founder judgment for routine collision handling.

## Residual implementation obligations

PASS is for the architecture, not implementation evidence. A later implementation must prove:

1. the exact supported-write-authority epoch behavior for each backend that claims concurrent migration;
2. true multi-process late legacy-writer rejection and revision-set drift detection;
3. direct-filesystem maintenance-window UX and refusal when quiescence is not established;
4. crash recovery in `committing` and `failed/aborting` states;
5. final protected audit before fence release;
6. the full previously listed parser, unknown-preservation, mapping, graduation, and multi-surface agreement fixtures.

Until those tests exist, the implementation must not advertise concurrent-safe migration merely because this design defines it.

## Evidence

- [Repaired recommendation](../designs/okf-extension-evolution-recommendation.md)
- [Prior conditional review](./okf-extension-evolution-recommendation.md)
- [Shared collision domain model](../research/okf-extension-evolution-domain-model.md)
- [Architecture plan](../plans/okf-extension-evolution-architecture.md)
- [Standards applicability cross-review](./okf-extension-evolution-standards-applicability.md)
- [Standards cross-review of options](./okf-extension-evolution-options-standards.md)

## Confidence

- **High:** F1 is closed at the architecture level without pretending direct files can enforce a cooperative protocol.
- **High:** F2 is closed for every required upstream outcome.
- **High:** no regression is present in the frozen design's surviving semantic invariants; the repair is additive and makes C12/C13 stronger.
- **Medium-high:** a generic backend epoch can coexist with storage-semantic ignorance; exact API placement remains an implementation design decision and must be reviewed then.
