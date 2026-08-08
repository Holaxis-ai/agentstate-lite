---
type: Context Note
title: Architecture review template v1.1 testing and portability review
actor: review-method-testing
timestamp: '2026-08-08T15:03:27.009Z'
---
# Summary

**APPROVE** the repaired exact convention and template. The initial candidate received
`CHANGES_REQUIRED`; the complete initial findings remain below as review history. The repaired bytes
resolve all five blockers and the authoring clarification without closing the OKF vocabulary,
requiring a global family registry, or making the convention/inventory mandatory.

Final approved-by-this-review artifacts:

- `conventions/review@sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`;
- `reviews/architecture-review-template-v1.1@sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`.

Initial changed candidate artifacts:

- `conventions/review@sha256:cd91040314f5feca01a11e53f7784e4435d22780e816f23d5fe9c0c56844100f`;
- `reviews/architecture-review-template-v1.1@sha256:91bf042022c1da49021ae9d8a20272941c0452f85c5f187274920a39f94ba48d`;
- governing plan `plans/architecture-review-record-alignment@sha256:b6ccec33c9daee7182a188916e6a898fdd83618372b0e1da83a59e896b6fc534`;
- migration evidence `research/architecture-review-artifact-inventory` as observed at the review
  cutoff; it was not treated as runtime authority.

The project ultimate goal is a human-visible, conflict-safe, local-first shared memory. My proximate
goal was to determine whether this reusable method has bounded, meaningful oracles while remaining
permissive for sparse and unfamiliar OKF content. The user's explicit robustness requirement was
treated as a primary acceptance condition, not an edge-case test.

# Initial blocking changes (resolved in the final exact bytes)

## T1 — Scope the inventory-independence oracle and remove project-local method dependencies

The template says deleting a migration inventory changes “no runtime result,” while the same
template directly links `[uses migration inventory]` and the local alignment Task. Literal deletion
necessarily changes generic bundle queries and link resolution, so this oracle cannot pass as
written. It also makes a supposedly reusable method carry project-local dependencies into another
package/project.

Required repair:

- remove the migration-inventory and local method-Task links from the reusable method, or move them
  to this version's approval/release-provenance Review;
- describe inventories generically and conditionally inside the method; and
- scope the executable oracle to Review-portfolio classification, family grouping, Review/Review
  Request rows, and rendered verdict/navigation results. It must not claim that deleting an
  ordinary OKF document leaves every possible bundle query unchanged.

Source-template lineage may remain in the version approval record. If retained in the method, it
must be explicitly labeled local provenance rather than a portable dependency.

## T2 — Make open-world relation interpretation decidable without closing the vocabulary

The method simultaneously says arbitrary relation labels remain first-class and says the effective
conclusion is the unique applicable leaf. The underlying OKF graph preserves label, direction, and
target; it does not identify which arbitrary Review-to-Review edges mean succession. Treating every
Review edge as succession would incorrectly absorb approval, evidence, navigation, and extension
relations. Treating only today's example strings as succession would hardcode one project's
vocabulary.

Required repair:

- define effective-leaf analysis over **explicitly classified succession edges**, not all Review
  edges;
- say how a bundle or record declares that classification using ordinary OKF content (the mechanism
  may be a documented local label mapping or an explicit relation in the Review body; it must not be
  a global closed enum);
- keep unknown relations visible but unclassified, and render effective state as `unknown` or
  `ambiguous` when classification is absent or conflicting; and
- apply multiple-parent/cycle/leaf assertions only to the classified succession subgraph. Never
  infer succession from type, folder, title, timestamp, `role`, or link direction alone.

This preserves OKF flexibility while giving QA a real oracle.

## T3 — Correct the cap/partial-failure visibility oracle

The QA matrix combines capped/partial query results with an assertion that every record and edge
remains visible or unresolved. Under a real cap, omitted rows are neither visible nor unresolved;
under a partial failure, completeness is unknown. A green check can therefore only be obtained by
quietly weakening the words.

Required repair:

- when pagination/exhaustive traversal exists, assert eventual visibility after all pages;
- otherwise require explicit `shown`, `total`/unknown, `truncated`/incomplete state, and a next action;
- distinguish dangling/unresolved graph targets from rows omitted by a cap; and
- require partial query failure to suppress completeness/effective-leaf claims while preserving
  whatever bounded data was actually returned.

## T4 — Separate internal closure of the declared universe from real-world completeness

The stopping rule says every material item in the frozen universe must have a disposition, but it
does not nominate one controlling coverage ledger or state what an executable check can and cannot
prove. The matrices are excellent evidence structures, yet an implementation can duplicate or
quietly omit an item across them and still claim closure.

Required repair:

- require each review to nominate one review-authored coverage ledger (inline or linked, with any
  project-appropriate representation) containing stable local item IDs, source/rationale,
  applicability, disposition, evidence reference, and open blocker/residual risk;
- make other matrices projections or references to that ledger rather than competing authorities;
- define the mechanical stopping oracle as “every row in the declared ledger is dispositioned and
  every applicable material gap is reflected in the verdict”; and
- state that this proves internal closure only. Completeness of the declared universe remains a
  reasoned claim challenged by the independent specialist/skeptic review, not something a script
  can prove.

This adds an oracle without forcing a global schema, fixed heading, or project-specific fixture.

## T5 — Pass the method's own progressive-disclosure test

The candidate is 34,511 bytes / 437 lines. Its “Decision card” begins at line 93, after 5,643 bytes
of method infrastructure, despite calling itself the top section. A first-time user cannot orient
to the review target, status, verdict, next action, and limits in the intended 30–60 seconds when a
filled report follows this order.

Required repair: put the filled Review decision card first, before family/migration mechanics, or
add a genuinely short method decision card at the top and explicitly require generated Reviews to
lead with their target decision card. Detailed graph rules can remain drill-down guidance.

# Important compatibility clarification

The convention accurately keeps metadata **values** open and preserves imported unknown fields on
unrelated updates, but the kind-aware `doc update` surface rejects authoring an undeclared field.
Empirically, `custom_interop` survived a title/verdict update, while
`doc update --custom_interop ...` exited 2 and recommended changing the Kind. The method/convention
should state this distinction and name the portable extension path: evolve the local convention or
use the raw byte/CAS import-edit path. Do not imply that declaring a Kind makes arbitrary new field
names directly authorable through every kind-aware command.

This is not a request for a closed schema or a new engine mechanic. It is necessary calibration of
the actual opt-in Kind behavior.

# Empirical evidence

Disposable bundles under `/private/tmp` used the repository's current `./aslite`; no project IDs or
known review families were fixture inputs.

| Probe | Observed result |
| --- | --- |
| Promote exact convention into a recipe-free bundle with `--strict` | Exact version `cd910…`; one Kind, required field only `title`, ten optional open-valued fields, no enum/headings. |
| `new "Review" alpha --title ...` with convention | Exit 0; created `reviews/alpha`, proving preferred placement without making the folder an OKF validity boundary. |
| Raw minimal/external Reviews outside `reviews/` | Visible in `list --type Review`; unfamiliar role/verdict/status/target values and HTML-like metadata were preserved; zero malformed/kind warnings. |
| Same records without any convention | Visible and valid; `new "Review"` exited 2 as expected because no Kind exists. Generic OKF/import remains the authoring path. |
| Known-field update of imported Review | Exit 0 and preserved undeclared `custom_interop` bytes. |
| Attempt to author undeclared field through `doc update` | Exit 2; existing field remained intact. |
| Open vocabulary update (`--verdict brand-new-vocabulary`) | Exit 0. |
| Dangling relative link | Surfaced by `status` as unresolved; record remained visible. |
| Multiple parents, a cycle, a self-edge, and an unfamiliar relation label | All edges were preserved exactly by `link list/show`; the base graph correctly made no lifecycle inference. |
| Delete disposable migration inventory | Review query/cardinality remained unchanged in both convention modes; generic bundle state necessarily changed because a Research document was deleted. |

# Survived attacks

- **Sparse/unknown records:** a minimal external Review, unfamiliar values, a target string from an
  unfamiliar type system, missing timestamps, and an undeclared field remained valid and visible.
- **Preferred path vs validity:** `new` used `reviews/`, while an external Review elsewhere remained
  first-class.
- **Convention optionality:** discovery did not depend on the convention; only the convenience
  creation command did.
- **Inventory non-authority at the query layer:** deleting the inventory did not change Review
  discovery/cardinality.
- **No hidden enum:** new lifecycle/verdict vocabulary was accepted.
- **No data loss on ambiguous graphs:** arbitrary labels, multiple parents, cycles, and self-edges
  were preserved rather than silently normalized.
- **Unknown-field preservation:** a supported-field update retained the imported unknown field.
- **Test guidance:** section 6.6 strongly distinguishes gate reachability, meaningful oracles,
  real/fake boundaries, fault dimensions, red sensitivity, post-failure state, and source-vs-shipped
  artifact gaps. It avoids scalar coverage as assurance and is suitable for meaningful unit and
  integration test review after applicability is declared.
- **Negative claims:** `missing`, `only`, `canonical`, `dead`, `unused`, and `unbounded` have
  class-specific bounded-universe requirements rather than keyword/search-only evidence.
- **False-confidence controls:** evidence grades, `not assessed`, independent confidence, explicit
  residual limits, survived attacks, refutations, and the prohibition on aggregate architecture
  scores all survived review.

# Residual risk and QA boundary

- The disposable CLI probes did not execute a Review Portfolio View. HTML escaping, live
  add/update/delete, pagination/caps, and injected partial bridge failure require the independent QA
  harness on the exact View bytes; raw CLI preservation is not evidence of safe browser rendering.
- No automated check can prove that a declared risk universe contains every real material risk.
  The repaired method must keep that epistemic boundary explicit.
- `new "Review"` intentionally depends on an installed convention. Cross-project guidance must say
  that conventions-free OKF bundles remain supported and use generic document/import paths.
- The candidate's breadth can create review cost for small libraries. Applicability/N/A,
  proportionality, and the post-use retirement loop are good mitigations; actual use should measure
  which fields change decisions rather than allowing the method to grow monotonically.

# Final exact-byte re-review

**APPROVE** `conventions/review@sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`
and `reviews/architecture-review-template-v1.1@sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`.

Resolution evidence:

- **T1 resolved:** project-local inventory and method-Task links were removed. Inventory deletion is
  now scoped to portfolio classification/grouping/rows/verdict-navigation, while generic bundle
  query/link changes are explicitly outside the oracle.
- **T2 resolved:** succession is an explicit successor-to-predecessor subgraph. Other projects may
  map a different exact label through ordinary OKF content. Unknown relations stay visible and
  unclassified; approvals, support, and arbitrary links do not enter verdict currentness. Missing
  classification, multiple predecessors/successors, cycles, self-edges, and applicability conflict
  fail closed to unknown/ambiguous/incomplete rather than selecting a winner.
- **T3 resolved:** capped results require exhaustive pagination or honest
  `shown`/`total`/`truncated`/next-action disclosure. Omitted rows are distinguished from unresolved
  targets, and partial query failure suppresses completeness/effective-verdict claims.
- **T4 resolved:** one review-authored ledger is the stopping authority; other matrices reference
  its stable local IDs. Mechanical closure is explicitly limited to declared rows, while material-
  universe completeness remains a reasoned specialist/skeptic claim.
- **T5 resolved:** a short method card starts at line 14, states purpose, workflow, stopping scope,
  safe degradation, and the exact-version gate. It explicitly requires every filled report to put
  its completed Decision card first.
- **Authoring clarification resolved:** both artifacts distinguish permissive consumption and
  preservation of unknown imported fields from kind-aware authoring. Convention evolution and the
  raw-document promote/CAS path are named without treating unknown content as invalid.

No flexibility regression was found. The convention still requires only `title`, declares no enums
or body headings, and explicitly permits other Review methods to use peer panels, quorum decisions,
multiple scoped roots, or no synthesis. A fresh recipe-free scratch bundle strict-promoted the
repaired convention at its exact hash, imported an external Review with unfamiliar fields/values,
created a new open-valued Review under `reviews/`, and reported zero malformed or Kind warnings.

Independent QA still owns View-byte execution, HTML escaping, live add/update/delete,
pagination/caps, and injected partial bridge failure. That is an evidence-stage boundary, not a
remaining template blocker.

[governed by plan](../plans/architecture-review-record-alignment.md)

[reviews convention](../conventions/review.md)

[reviews template candidate](../reviews/architecture-review-template-v1.1.md)

[completes assigned task](../tasks/architecture-review-template-v1-1-testing-review.md)
