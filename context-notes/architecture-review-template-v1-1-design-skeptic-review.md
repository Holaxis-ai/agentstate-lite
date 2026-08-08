---
type: Context Note
title: Architecture-review template v1.1 design and skeptic review
actor: review-method-skeptic
timestamp: '2026-08-08T15:03:39.134Z'
---
# Summary

**CHANGES_REQUIRED.** The minimal Kind is demonstrably permissive, but the family/currentness method is not yet determinate enough to be a reusable authority. Four blocking contradictions could make a generic Review portfolio infer the wrong root or conclusion, and they would be expensive to repair after more review families depend on them.

Reviewed exact artifacts:

- `conventions/review` at `sha256:cd91040314f5feca01a11e53f7784e4435d22780e816f23d5fe9c0c56844100f`;
- `reviews/architecture-review-template-v1.1` at `sha256:91bf042022c1da49021ae9d8a20272941c0452f85c5f187274920a39f94ba48d`;
- source template v1.0 at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`;
- governing plan at `sha256:b6ccec33c9daee7182a188916e6a898fdd83618372b0e1da83a59e896b6fc534`;
- inventory at `sha256:5aad2d2e466fe2fe51e96185aeafd57c6ddb3021164db05ceeb1a11d13050d28`.

The findings are disclosure-safe design/method issues; no private security mechanics are involved.

## Blocking findings

### B1 — Stored edge direction and effective-leaf semantics are under-specified

The template's conceptual graph points from the canonical Review to approvals/addenda/rereviews, while both the convention and template say a supporting Review links the canonical root. Frozen predecessors also cannot be rewritten. Therefore a later immutable record must link backward to an earlier/root record, but the phrase “immutable forward graph” does not define whether “forward” means temporal precedence, Markdown edge direction, or backlink traversal.

The effective leaf is consequently not mechanically defined. `part of review`, `amends review`, `rereviews`, and `approves report` have different semantics, but all are presented as optional readable labels in an open vocabulary. A consumer cannot calculate one applicable leaf from arbitrary links without either hardcoding an undocumented closed subset or treating unrelated Review citations as succession edges.

Required repair:

1. State the stored direction explicitly: a new addendum/rereview links the exact predecessor and the stable root; the root discovers later records through derived backlinks.
2. Define a small **recognized, non-closed relationship profile** with direction and precedence semantics. Unknown labels remain visible first-class edges but are not silently interpreted as family membership or succession.
3. Define “applicable leaf” only over explicit succession edges and an exact verdict subject/target evidence line. Missing or conflicting semantics remain ungrouped/ambiguous.
4. Make the conceptual diagram distinguish semantic reachability from stored link direction.

This preserves OKF's open-world graph while making the supported method deterministic.

### B2 — Generic Review convention and architecture-review template duplicate—and over-broaden—family authority

`conventions/review` says every multi-record family has one synthesis root and a unique effective leaf. The architecture-specific template repeats that rule. This creates two authorities that can drift, and it applies an architecture-review succession model to every generic `type: Review` record in the bundle. Other legitimate Review workflows may use peer panels, quorum decisions, multiple scoped roots, or no synthesis record.

Required repair: choose one owner. The generic convention should own only the minimal Review record contract and field meanings. The versioned architecture-review template should own the one-root/succession/wrapper method. A generic portfolio must display unfamiliar Review graphs without declaring them malformed merely because they do not follow the architecture-review profile. If a generic family contract is truly intended, define and test it as a separate reusable profile rather than duplicating it in prose.

### B3 — Lifecycle vocabulary contradicts immutable succession

The new metadata guidance suggests `status: superseded`, but the same section says frozen predecessors are never rewritten to mark them superseded. The decision card separately describes Review status as `draft/in review/approved/applied`, which conflicts with the earlier `draft/in_review/final/superseded` examples and mixes record lifecycle, judgment, and remediation state.

Required repair: use one lifecycle vocabulary everywhere—prefer `draft`, `in_review`, `final`—and derive currentness from explicit succession edges. Keep `approved` under `verdict` with a mandatory verdict subject; keep `applied` in remediation/task state. If `superseded` remains, constrain it to mutable pre-freeze drafts and state that it is never a source of effective-conclusion authority.

### B4 — Thin wrappers cannot both carry the canonical verdict and “invent no authority” without a projection rule

The template defines the canonical Review as the durable overall verdict, then says a thin wrapper contains a decision but must not invent authority. Merely linking frozen source bytes creates a navigation record; restating a normalized verdict creates a new interpretation. The current rule does not say which is authoritative when the wrapper's categorical verdict and source prose diverge.

Required repair: declare a wrapper to be a provenance/navigation projection of one exact source verdict. If it carries a normalized `verdict`, require an explicit exact-source digest, verdict subject, deterministic mapping note, and source precedence on disagreement. If mapping needs substantive judgment, create a new reviewed synthesis rather than calling it a thin wrapper. This also keeps wrapper proliferation and semantic drift bounded.

## Non-blocking clarification

The open-field guarantee should distinguish permissive OKF consumption from Kind-aware CLI authoring. In a disposable bundle, an externally authored Review outside `reviews/` with `mystery_field` and unfamiliar role/verdict values remained readable and queryable. A standard `doc update --title` preserved the unknown field. However `doc update --future_field x` correctly exited 2 because Kind-aware dynamic fields must first be declared. Portability QA should assert unknown-field ingestion and round-trip preservation, not imply that arbitrary new `--field` flags bypass a bundle's Kind convention.

## Survived attacks

- **Minimality:** empirical. The exact convention required only `title`; `new Review sparse-created` created `reviews/sparse-created` with no body sections or optional metadata.
- **Path flexibility:** empirical. A raw `type: Review` promoted at `odd/legacy` remained discoverable by `list --type Review`.
- **Open values and unknown fields:** empirical. Unfamiliar `role`, `verdict`, and `mystery_field` values produced zero Kind warnings and survived a normal update.
- **No closed relationship schema:** reasoned from exact bytes. The convention declares no typed-link restriction, so arbitrary relation labels and target types remain OKF edges.
- **Inventory non-authority:** reasoned. Neither exact candidate refers to inventory rows as runtime configuration; the template explicitly requires with/without-inventory QA.
- **Proportionality and cross-project reuse:** reasoned. Profiles, sampling, N/A/not-assessed, cost/evidence budgets, and post-use retirement keep the comprehensive review rubric adaptable once the family semantics above are repaired.
- **Single engine/graph authority:** survived. The candidates use ordinary documents and derived OKF links; they introduce no parser, registry, backlink store, or mutation engine.

## Residual risk after repair

- Open-world metadata means generic consumers will sometimes display “unknown/ungrouped” rather than compute an effective conclusion. That is the correct safe degradation, not a defect.
- Exact target/version fields are scalar hints while multi-target provenance remains a body table; consumers must not overstate machine-verifiable completeness.
- The method is intentionally comprehensive. Its post-use retrospective must actually retire low-value fields, or checklist growth will erode reuse despite the profile mechanism.
- A version number such as `template_version: 1.1` is not an exact-byte identity. New reviews should also link/name the exact approved template digest when method provenance matters.

## Verdict

Do not approve these exact candidate bytes. Repair B1–B4, keep the minimal schema unchanged unless a repair genuinely needs another optional hint, then request exact-version re-review. The empirical open-world behavior should remain a positive control.

[governing plan](../plans/architecture-review-record-alignment.md)

[inventory](../research/architecture-review-artifact-inventory.md)

[Review convention](../conventions/review.md)

[template v1.1 candidate](../reviews/architecture-review-template-v1.1.md)

[assigned review task](../tasks/architecture-review-template-v1-1-design-skeptic-review.md)

# Exact repaired-artifact re-review

**APPROVE.** Re-reviewed only the previously blocking method issues against:

- `conventions/review` at `sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`;
- `reviews/architecture-review-template-v1.1` at `sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`.

All four blockers are resolved:

1. **Succession direction/currentness:** the template now distinguishes semantic reachability from stored direction. A successor links outbound to its immediate predecessor using `succeeds review` or an explicit author-declared equivalent mapping. Only classified succession edges participate; support, approval, navigation, and unknown edges do not. Root and effective terminus are defined over outbound predecessor edges and inbound successor backlinks, with branches, multiple predecessors, cycles, missing applicability, and conflicting mappings failing closed as unknown/ambiguous/incomplete.
2. **Generic-vs-method ownership:** the generic Kind explicitly defines no family topology or current-verdict algorithm and permits peer panels, quorum methods, scoped roots, or no synthesis. The versioned architecture-review template alone owns its stable-root/succession/wrapper method. This removes duplicate authority and avoids imposing one architecture-specific topology on unfamiliar Reviews.
3. **Lifecycle vocabulary:** both artifacts use `draft`, `in_review`, and `final` for record lifecycle. `approved` is a verdict with a named subject; `applied` belongs to work evidence. Imported `superseded` remains preserved but cannot establish currentness or approval, and frozen predecessors are not rewritten.
4. **Wrapper projection:** a thin wrapper now names every exact source, copies subject/verdict under a declared structure-preserving mapping, states source precedence, and becomes incomplete on disagreement or substantive mapping. A genuinely interpretive synthesis requires its own review rather than masquerading as a wrapper.

The unknown-field distinction is also explicit: permissive import/round-trip preservation does not imply arbitrary Kind-aware authoring flags. This is aligned with the actual CLI contract.

## Repaired-candidate flexibility probe

Empirical scratch-bundle checks against the repaired convention passed:

- `new Review sparse --title Sparse` created `reviews/sparse` with only the required title;
- a raw Review outside the preferred prefix with an unknown field, `future-status`, `peer-panel` role, unfamiliar verdict, and arbitrary link remained readable and queryable;
- a standard title update preserved every imported unknown value;
- `status` reported zero malformed records, zero Kind warnings, zero link-type violations, and zero conformance debt; the deliberately dangling unknown relation remained honestly unresolved; and
- `kinds` showed exactly one required field, ten optional open-valued fields, no enums, no sections, and no typed-link closure.

No flexibility regression was found. Sparse/unfamiliar OKF records remain valid, generic consumers are instructed not to infer topology, and the architecture method obtains determinism through classified ordinary links rather than a closed registry.

## Final verdict

**APPROVE** these exact repaired bytes for design-principles and skeptic scope. No blocker from the original review remains. Residual open-world behavior is appropriately fail-safe: an unfamiliar or incomplete graph may be ungrouped or lack an effective-verdict claim, but it remains visible and valid.
