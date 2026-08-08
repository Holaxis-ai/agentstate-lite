---
type: Context Note
title: Architecture-review alignment provenance and brittleness audit
actor: review-skeptic
timestamp: '2026-08-08T14:33:56.180Z'
---
# Summary

**Recommendation: NO-GO for the full A–H migration as currently written; CONDITIONAL GO after the blocking refinements below are folded into the implementation contract.** The plan at `sha256:93b15c755e7e9920350a9092403f4816b3030d15ed3c1411702f9f255fcf5435` has the right preservation instinct and a safe minimal `Review` convention, but it cannot yet prove its central claim: exactly one canonical review per family with an unambiguous current verdict. It lacks a stable family-routing hint and additive relation vocabulary, conflates artifact approval with target verdicts, has no immutable-chain rule for addenda/re-reviews, and leaves “review-like final context note” unbounded. A broad title probe finds 268 Context Notes containing `review`, `approval`, `accept`, or `verdict`; migrating that universe by judgment would create wrapper proliferation and inconsistent authority.

The infrastructure must remain plain OKF and open-world. `family` is an optional routing/grouping hint, not a semantic authority, authorization token, schema key, or runtime dependency. Canonical authority comes from the verdict-bearing Review plus explicit Markdown graph links; unfamiliar and sparse records remain readable. The Research inventory is migration/review evidence only: the View and normal bundle operations must still work if that inventory is absent.

This audit was read-only except for this note and its assigned Task. Evidence cutoff: `2026-08-08T14:27:57Z`.

# Attack results

## 1. Duplicate-authority and cardinality attack — BLOCKING

The proposed fields do not identify a review family, name a canonical Review, or declare typed relationships between synthesis, specialist, approval, addendum, and re-review records. `role=synthesis` is insufficient because the frozen legacy Reviews have no `role` and cannot be edited without invalidating exact-version approvals. The current graph uses inconsistent edge text (`approves report`, `packages/cli architecture review`, `Prior conditional review`, `Standards cross-review of options`), so neither the CLI nor OKF-extension family can be grouped reliably by an executable query.

The conflict is structural:

- preserving frozen bytes prevents adding `family`, `role`, or `status` to legacy Reviews;
- refusing wrappers for an already-good family prevents a new machine-readable family root;
- requiring a portfolio grouped by family nevertheless requires some durable mapping authority;
- title and filename inference is explicitly rejected by the plan and is not a stable substitute.

Required refinement: add optional `family` to the permissive Review convention so frozen legacy docs remain valid, but require it in template v1.1. Treat it only as a routing hint. Every new non-synthesis Review must also carry exactly one `part of review` link to its canonical synthesis and name that synthesis's exact version; that traversable link is the family authority. The frozen inventory may document legacy aliases for audit, but runtime must not depend on it or hardcode those mappings. Legacy records with no declared family/role remain visible as `legacy/unclassified`. Do not introduce a closed-world `Review Family` registry or a new engine-level family mechanism in this unit.

## 2. Canonical root versus effective verdict — BLOCKING

The plan treats one synthesis as canonical but does not define which record carries the currently effective conclusion after an addendum or re-review. This already matters:

- `reviews/cli-package-architecture-review` is the stable synthesis, while `reviews/cli-package-architecture-review-pr224-reconciliation` adds later evidence and explicitly says the original approval does not transfer.
- `reviews/okf-extension-evolution-recommendation-rereview` is the later exact repair verdict and links the earlier conditional review.

`status=superseded` cannot repair the frozen predecessor without changing its bytes. Required refinement: freeze the family root and represent current truth as an immutable forward chain. New supplemental Reviews must use typed `approves`, `amends`, or `supersedes` links to exact Review versions; the effective verdict is the unique leaf for the applicable target/evidence line. The portfolio must show both “canonical family root” and “effective/latest verdict”, not silently replace one with the other.

## 3. Verdict subject confusion — BLOCKING

The same `verdict` enum is proposed for target assessment, artifact approval, and amendment/rereview decisions. The CLI approval demonstrates why that is unsafe: the **report artifact is approved**, while the **reviewed target is incomplete and requires changes**. A portfolio that displays `approved` without its subject would materially misstate the architecture conclusion.

Required refinement: v1.1 must make verdict subject explicit. At minimum, define role-specific semantics and render `role`, `target`, and `target_version` beside every verdict. Prefer a `verdict_subject`/`target_kind` field or an equivalent typed rule. Portfolio top-level status must come only from the canonical/effective synthesis lane; approval verdicts are nested evidence and never become target approval.

## 4. Wrapper attack — CONDITIONAL PASS for Mike only

Mike's family genuinely lacks a `Review` while already containing an overall decision under `findings/architectural-smell-investigation-synthesis`. Exactly one thin Review entrypoint is justified. It must:

- cite PR #224 head `76ed593695d9f712b09e2734c50fa3117097b336`, survey target `31921ce157260c5b7245375503059bdd2c4a3bfe`, blob `cb86ca5e9ac69f2108bb90d0b919ccd4b67a9905`, and file SHA-256 `caa0293596d881283d757ca760ada3d482dd675eb711cac51975ca6d0cd67b5d`;
- separately cite the current-main investigation boundary `5806ece2c393f1c277f4a17a9006c1ba75eca86b` rather than presenting the two evidence dates as one target;
- link the exact synthesis, four atomic Findings, handoff, deprecated Claim, and exactly two promoted Tasks;
- repeat no causal rationale or private mechanics; use a compact decision card and delegate details to the frozen evidence;
- say explicitly that it is the family/discovery and overall-disposition authority, while each Finding remains the evidence authority for its own claim.

No other existing Review family should receive a Review wrapper merely to add metadata. That would duplicate a verdict-bearing authority. Legacy grouping needs the separate manifest/mapping mechanism above.

## 5. Inventory-universe attack — BLOCKING for bulk migration

The baseline is more heterogeneous than the plan states:

- 16 documents live under `reviews/`: 14 `Review`, one `Design Review`, and the v1.0 template typed `Doc`.
- `reviews/mcp-view-security-model-unification` is the sole `Design Review`; it is verdict-bearing and security-sensitive, but a `type: Review` query excludes it.
- a broad title-only probe finds 268 Context Notes containing review/approval/accept/verdict terms. Most are code-review rounds, QA/acceptance gates, starts, or phase evidence, not architecture-review initiatives.

Required refinement: freeze a bounded inclusion predicate before Step A. Include (a) `Review` and `Design Review` documents under `reviews/`, (b) explicit package/project architecture-review initiatives named by a plan/task or human request, and (c) a Context Note only when it contains the final architecture/design verdict, is linked to the reviewed target/owning work, and no Review/Design Review already owns that verdict. Exclude PR code-review rounds, QA/acceptance records, review-start/orientation notes, and specialist evidence already governed by a synthesis. The inventory must record the reason for inclusion/exclusion, not rely on a title.

## 6. Backlog-duplication attack — PASS with an identity check

Mike's family currently promotes exactly two implementation Tasks:

1. `tasks/registered-view-launch-authority-consolidation` (active and mutable; head observed as `sha256:b918e47e510ae8bbdbd8cec8f3faabc42a3395e2ad4aef80c18619e72189e131` at this audit cutoff), linked to the View Finding and synthesis.
2. `tasks/core-import-direction-gate` at `sha256:32e05881c15eb4662404d6c1859d56f7c0f7dff3eeaf307836a9a3caaf9553d0`, linked to the core Finding and synthesis.

`tasks/simplification-audit` is already done at `sha256:587fee03ef9d075287ab94b1214f9d40b027a251af3fd5280c95037223a78682`; it is the parent adjudication/ranking authority, not a third remediation unit. The other two Findings explicitly reject standalone tasks. The active View task changed during this audit, demonstrating that task hashes must not be treated as immutable review bytes.

Required invariant: create zero new Tasks while aligning records. Verify the promoted Task-ID set, not the total Task count or frozen Task hashes. Existing task owners may continue normal work.

## 6A. Three missing canonical families — ADJUDICATED

The taxonomy challenge is valid; three families need canonical treatment, but not identical handling:

1. **Mike architecture-smell family — create one thin canonical Review now.** This is the clean pilot described above.
2. **Legacy MCP/web View security-model family — create one thin canonical Review after disclosure preflight.** `reviews/mcp-view-security-model-unification@sha256:2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de` is a verdict-bearing `Design Review`, so a `type: Review` portfolio cannot discover it and its bytes cannot be retyped. The new Review must link the legacy Design Review as exact evidence, preserve its required-change verdict and private-routing boundary, and copy no sensitive mechanics.
3. **Kinds/domain-model architecture family — create one retrospective canonical Review only after the succession model is fixed.** `context-notes/architecture-domain-model-review-2026-07-13@sha256:ef7677811db36ed1b3faf26a6f1f6b5d6c61668feece468262fad99be04083bf` records the initial technical `changes_requested` verdict at `c92497a`/`69a0627`. The later `review-requests/kinds-and-descriptions-architecture@sha256:85d1aaf3967a4ded3492dc4a4f842ec572b9cc9c44b0e6a5122f00827e5df794` has a current human `approved` status after remediation, while its body deliberately retains the earlier changes-requested response. A blind wrapper would conflict with one of those epochs. The canonical Review must show both evidence strata, treat the Review Request as the human-decision authority, and make the later approval the effective family outcome without rewriting either source.

These are the only three wrapper candidates established by current evidence. Do not infer more from titles.

## 6B. Typed Review links — PASS; additive plain OKF

Typed `Review -> Finding`, `Review -> Task`, and `Review -> Context Note` links are safe if the exact relationship texts are new and role-specific. They remain ordinary relative Markdown links; the convention supplies optional lint and discovery, not closed-world enforcement or new runtime semantics. Empirical queries found zero existing Review edges named `part of review`, `has finding`, `produces task`, or `supported by context`, so declaring those relations will not reinterpret a current edge. Recommended vocabulary:

- `part of review -> Review` for every new non-synthesis Review (exactly one, with the canonical version recorded);
- `has finding -> Finding`;
- `produces task -> Task`;
- `supported by context -> Context Note`;
- add distinct typed relations for a legacy `Design Review`, `Review Request`, or `Claim` rather than a generic multi-type `evidence` edge.

Do not add inbound expectations or make these links mandatory in the permissive convention: that would create legacy debt. Template v1.1 plus reviewer/QA cardinality checks enforce them for new work. Link typing proves only source/target types; it does not prove multiplicity, exact versions, currentness, authorization, or truth, so those remain explicit validation obligations. Unknown edge text remains legal OKF and must continue to render literally.

## 6C. Flexibility and anti-brittleness attack — BLOCKING acceptance gate

The portfolio and convention must not turn this project's migration inventory into a second schema or hardcoded application model.

- **No inventory runtime dependency:** the View queries `Review Request` and `Review` directly and follows live edges. Deleting or withholding `research/architecture-review-artifact-inventory` in a scratch copy must not change whether records are listed or readable.
- **No hardcoded project IDs:** source contains no CLI/Mike/MCP/domain-model document IDs, family slugs, PR numbers, or current 6/14 counts. Those records appear only because they match generic type queries and live graph traversal.
- **No title/folder inference:** title substrings, filename stems, and `reviews/` location never determine role, family, currentness, or verdict.
- **Sparse and unknown are first-class:** missing `family`, `role`, `status`, `verdict`, provenance, or unfamiliar enum values render as undeclared/unknown and never disappear or crash. Unknown roles are unclassified; unknown statuses are displayed literally rather than forced through project-specific logic.
- **Kind-owned request lifecycle:** use `open:true` for Review Requests instead of duplicating terminal-status rules in View code.
- **Open-world families:** a scratch Review with a never-before-seen `family` appears without code changes; a Review without `family` still appears unclassified. A linked supporting Review joins through `part of review`; a free-text legacy edge remains visible without being promoted to authority.
- **Multi-target provenance:** `target`/`target_version` are routing summaries only. A Review spanning source revisions, built artifacts, external PRs, or multiple investigations carries a body-level provenance table; the runtime presents it through the shared document renderer rather than trying to normalize every target shape.

These are acceptance tests, not prose preferences. The implementation is brittle if any of them fail.

## 7. Frozen-byte and provenance attack — CONDITIONAL PASS

The key approved artifacts are currently byte-identical to their cited versions. Two mutable provenance inputs are not: the CLI report cites historical `plans/cli-architecture-review@sha256:f4f5e6...` and `tasks/cli-architecture-review@sha256:283b6d...`, while current heads are `sha256:496a0b...` and `sha256:3396c2...`. This is legitimate lifecycle drift, but the local filesystem backend cannot retrieve those cited historical versions through `doc read`.

Required refinement: the inventory must distinguish `frozen current bytes`, `mutable current head`, and `historical digest citation`. Do not claim every cited hash is locally retrievable. Preserve exact top-level review artifacts and evidence docs; allow tasks/plans to advance without implying that current links resolve to the historically cited bytes.

## 8. Security/disclosure attack — BLOCKING gate placement

The plan states a safe disclosure policy but places no explicit disclosure screen before the inventory and portfolio work. Both are public-board writes and can amplify a sensitive review by summarizing or surfacing it. The legacy `Design Review` already uses private-routing boundaries; alignment must not copy hidden mechanics into a wrapper or inventory.

Required refinement: add a disclosure preflight before any persisted inventory row, wrapper, or View card. Public artifacts may carry only disclosure-safe conclusions, exact public provenance, and routing markers. A candidate that may meet the private-advisory threshold is represented only by a neutral marker until privately disposed. The View must not synthesize excerpts from private-lane material.

## 9. Portfolio implementation attack — BLOCKING for Step F

The current View registry is `pages-registry/reviews@sha256:ecb6daba8740d5a2fb78714c45b85f70c2a37f642e01203ad2027b19d7879f55`; its blob is `pages/reviews.html@sha256:0033ec35eda298cd4045fb8775b269b21cce78a0e45019d095f29c19ea28dddc`. It queries only `Review Request`. It also detects navigable artifacts as retired `type: Page` rather than `type: View`, and implements a private Markdown renderer instead of using the shared bounded `render-document` bridge.

Required refinement: evolve the existing registered View rather than create a competing review surface; query Review Requests and Reviews generically without consulting the frozen inventory; use `type: View` for open-page navigation; use the shared renderer for document bodies; and keep request lifecycle visually distinct from target verdicts and artifact approvals. Do not promote the new blob until the data model is frozen.

# Exact preservation baseline

The following existing files under `reviews/` are the pre-migration byte baseline and must not be rewritten by alignment:

| ID | Type/role today | SHA-256 |
| --- | --- | --- |
| `reviews/architecture-review-template` | Doc/template v1.0 | `02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09` |
| `reviews/architecture-review-template-approval` | Review/approval | `c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead` |
| `reviews/cli-package-architecture-review` | Review/canonical synthesis | `d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14` |
| `reviews/cli-package-architecture-review-approval` | Review/approval | `353f0fb6880ce39af116943ecebfc5037a09bd466dbba88151bf3090f718e791` |
| `reviews/cli-package-architecture-review-pr224-reconciliation` | Review/addendum | `df2df0d994ce94f4a5a89d72315cf5f87175f45e41eac02fe3443bc25dbced52` |
| `reviews/mcp-view-security-model-unification` | Design Review | `2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de` |
| `reviews/okf-extension-evolution-options-standards` | Review/specialist | `2a82b93f00b6070bddb7970b2ccc150b773f72abe50e852c5c0432f3cc0ed090` |
| `reviews/okf-extension-evolution-recommendation` | Review/conditional synthesis | `48d08834cd9976f69f73b5395807ca14617f7b71a74ff4cf7cfb99c0a9713ca2` |
| `reviews/okf-extension-evolution-recommendation-rereview` | Review/rereview | `fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5` |
| `reviews/okf-extension-evolution-standards-applicability` | Review/specialist | `87cedc29d64e485802a0f14b58cfc75fb4bcf61cf3faeb3e0a3c5e16387aeaec` |
| `reviews/pr-187-project-directory-resolution` | Review | `35d9bd1736bc62cc42bd0128d2384e285bba492b84f0ca4334af80442988b26c` |
| `reviews/pre-compact-multi-session-team-2026-08-03` | Review/team synthesis | `e2081f3f9df3c0ec85908a684e24d700b8e0d6c187401278b44e81ecc7730925` |
| `reviews/pre-compact-multi-session-v3-plan-2026-08-03` | Review/plan gate | `f7c065ab383568a968564b84406df2a056b9bb42489dc88ec5462e4db32cc3c3` |
| `reviews/shared-view-document-rendering` | Review | `344faba806d8d4972a6292e05f8e3611ccab1c13fac304c4bd2939eb88af4c9c` |
| `reviews/transient-durable-view-unification` | Review | `2a7592d36a023a3d9062e6436b30fe3faf393e06f0d9cbbf2e5c538e074fd2f9` |
| `reviews/unified-portable-view-model` | Review | `b764c4589aada4d1783de3fe7c9c38feb917373ab3b184a222d49c7ba56b2113` |

Also freeze `research/architecture-review-domain-model@sha256:061758d30ed7cb406f4e48157470e742d48ec0a79aaced5fdf05b599e9f1c231` and Mike's disclosure-safe evidence records:

- `findings/architectural-smell-investigation-synthesis@sha256:7e0b3274aee6cca333c7ff640c75969586e0f32e2069114b1eb74b6d4e767cce`
- `findings/registered-view-launch-authority-investigation@sha256:eaa332484a88dfdbdbae293c772800e72beaa7b2e6b7fa4865f462fbdd1d17fd`
- `findings/core-import-direction-gate-investigation@sha256:82d862a7e3f38f62386ee096bccf6caf608c3a4cf93c7d5ebd53517628bb8c62`
- `findings/core-server-test-dependency-investigation@sha256:dbd63f65c666ced47e3fdcfbdd01206605c99f4149368b678496746bb321376f`
- `findings/cli-type-only-cycles-investigation@sha256:c84b9eb2157cf79771830802265b06b5f35782559c5b1991074318728d41c019`
- `context-notes/architectural-smell-audit-handoff@sha256:4fdf0f2361f2cc5892f165720e98564309bdde355bb8730114ab92892efb4bc5`
- `claims/architectural-smell-report-remediation@sha256:7fa7cba630bd8f6b6b7271e28be87068e3e00204b923426b01e86f529db4368a`

# Required implementation invariants and empirical checks

1. **No mutation invariant:** pre/post SHA-256 for every frozen ID above is identical. Use byte hashes, not timestamps or titles.
2. **Canonical cardinality:** the CLI family remains exactly the three existing Review documents; Mike's family gains exactly one Review and retains one synthesis Finding plus four atomic Findings; the legacy MCP Design Review family gains exactly one Review wrapper; the kinds/domain-model family gains exactly one chronology-aware Review after succession semantics are approved. No new Finding or Task is created for any family.
3. **Backlog identity:** Mike's promoted Task-ID set remains exactly `{tasks/registered-view-launch-authority-consolidation, tasks/core-import-direction-gate}`. `tasks/simplification-audit` remains the done parent authority, not remediation #3.
4. **Typed lifecycle:** every new v1.1 Review has `family`; every non-synthesis Review has exactly one `part of review` link naming the canonical exact version and, when applicable, exactly one `approves`, `amends`, or `supersedes` target with an exact version. No effective-verdict chain has more than one leaf for the same target/evidence line.
5. **Verdict safety:** target verdicts, report-artifact approvals, and request decisions are rendered in separate labeled lanes. A report approval cannot be counted as target approval.
6. **Legacy safety:** all 14 current `Review` docs and the one `Design Review` receive an explicit inventory disposition. Missing v1.1 metadata is labeled `legacy`, not inferred from title. Context Note candidates are evaluated only under the bounded inclusion predicate.
7. **Kind safety:** after adding the permissive Review convention, all 14 existing Reviews remain conformant; a scratch copy of the bundle proves `new "Review"` creates under `reviews/`. Do not create a probe document in the live bundle.
8. **Disclosure safety:** a security specialist reviews the exact persisted inventory/wrappers and the exact View blob before publication. The review records survived attacks as well as findings; no private mechanics or copied sensitive excerpts are present.
9. **View safety:** exercise a request, canonical synthesis, approval, addendum/rereview, Mike wrapper, Finding, Task, legacy Design Review, and empty/missing optional-field state. Verify two-navigation-step discovery, subscription refresh, shared rendering, and `type: View` navigation.
10. **Debt accounting:** capture `aslite status` before and after. The baseline at this audit was 0 malformed, 9 kind warnings, 6 unresolved links, 18 link-type violations, and 35 missing expected links. Alignment adds none; it does not claim to repair pre-existing debt.
11. **Inventory-independence:** in a scratch bundle, remove the Research inventory and confirm identical Review/Request ids in the portfolio; then add one sparse Review, one unknown-role Review, and one unfamiliar family and confirm all remain visible without source edits.
12. **No brittle constants:** static review of the exact View blob finds no project document IDs, known family slugs, title regexes, status terminal table, fixed corpus counts, or inventory-document reads.

# Necessary plan refinements

1. Bound the inventory universe and add explicit include/exclude reasons.
2. Add optional `family` to the permissive kind, require it in v1.1 as a routing hint, and require an exact `part of review` link for new non-synthesis Reviews. Keep any legacy mapping audit-only; do not make runtime depend on an inventory or add a closed-world family registry.
3. Define immutable canonical-root versus effective-verdict-chain semantics and typed relations.
4. Make verdict subject explicit and keep target, artifact, and human-request decisions separate.
5. Add `family`, additive typed canonical/succession relations, and role-specific field semantics to v1.1; keep the initial convention optional and open-world for legacy/foreign OKF compatibility.
6. Put disclosure screening before inventory persistence, wrapper drafting, and View rendering.
7. Treat review evidence as frozen but Tasks/Plans as mutable; distinguish current heads from historical digest citations.
8. Restrict the pilot to one Mike wrapper and zero CLI wrapper; then add exactly one disclosure-screened MCP legacy wrapper and one chronology-aware kinds/domain-model wrapper after the relevant blockers are resolved. Create zero Findings and zero Tasks.
9. Evolve the existing Review Requests View into the single portfolio surface only after the data model is approved; use the shared renderer and current `View` type.
10. Make independent review audit exact bytes, cardinality, chain leaves, disclosure, and task-ID identity before QA.

# Go/no-go

- **Steps B/C/D pilot:** GO after refinements 3, 4, 6, 7, and 8 are incorporated and the exact v1.1 draft is independently reviewed.
- **Steps A/E bulk migration:** NO-GO until the inventory predicate and link-authority/family-hint semantics are approved; the inventory remains evidence, never runtime configuration.
- **Step F portfolio:** NO-GO until family/effective-verdict semantics, sparse/unknown behavior, and inventory independence are executable, and the shared-rendering/security defects in the current View are addressed.
- **Steps G/H:** remain mandatory and must test the invariants above rather than rely on document titles.

[audits accepted plan](../plans/architecture-review-record-alignment.md)

[assigned task](../tasks/architecture-review-alignment-provenance-audit.md)

[approved template v1.0](../reviews/architecture-review-template.md)

[canonical CLI review](../reviews/cli-package-architecture-review.md)

[Mike synthesis](../findings/architectural-smell-investigation-synthesis.md)

[current Review Requests View](../pages-registry/reviews.md)
