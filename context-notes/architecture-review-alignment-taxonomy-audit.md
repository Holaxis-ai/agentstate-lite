---
type: Context Note
title: Architecture-review alignment taxonomy audit
actor: review-taxonomy
timestamp: '2026-08-08T14:28:53.877Z'
---
# Summary

**Verdict: revise the implementation contract before migration.** The proposed permissive `Review` convention is safe for the 14 existing `type: Review` documents if it requires only `title`, fixes the path at `reviews/`, makes every new metadata field optional, and declares no required headings. All 14 current Review documents already satisfy that minimal shape. The v1.0 template, domain model, CLI report, approval, and reconciliation addendum must remain byte-frozen at the exact versions below.

The current plan is missing one load-bearing discriminator: a stable review-family identity. `role` distinguishes synthesis, specialist, approval, addendum, and rereview, but it cannot say which synthesis those records belong to. Links are the semantic authority, but the old corpus uses many free-text relations and several frozen revisions cannot be amended. Add an optional `family` field to the permissive convention, require it in template v1.1 for every new Review, and require every new non-synthesis Review to carry one exact typed link to its canonical synthesis. Treat `family` as a routing/grouping hint and the link as the traversable authority.

The type inventory also contains two high-confidence legacy architecture-review families that the baseline count misses: `reviews/mcp-view-security-model-unification` is a verdict-bearing `Design Review`, not a `Review`; `context-notes/architecture-domain-model-review-2026-07-13` is an explicit final architecture review whose only verdict record is a Context Note. Mike's architectural-smell investigation is the third missing canonical Review family. These need thin, provenance-only Review wrappers if their frozen source records are not rewritten. A title search must not drive further migration: most review-titled Context Notes are implementation gates or specialist evidence already governed elsewhere.

## Corpus baseline

The audit observed:

- 14 `type: Review` documents, all titled and under `reviews/`;
- one verdict-bearing `type: Design Review` under `reviews/`;
- six `Review Request` documents, which are named-human decision workflows and not Review syntheses;
- five `Finding` documents, all in Mike's architectural-smell family;
- no declared `Review` kind;
- a current Review Request kind and lifecycle that should remain separate.

This baseline was taken with `./aslite status --limit 20`, `./aslite kinds`, typed `list` queries, and complete outbound/backlink inventories for `reviews/` and `findings/`. Status reported the pre-existing baseline of 9 kind warnings, 6 unresolved links, 18 link-type violations, and 35 missing expected links; none was created by this read-only audit.

## Existing Review families

| Family | Canonical synthesis/current ruling | Supporting records | Disposition |
| --- | --- | --- | --- |
| Architecture-review method v1.0 | No architecture-target synthesis is required. The method authority is the template `reviews/architecture-review-template` (`type: Doc`), with an exact approval Review. | `reviews/architecture-review-template-approval` | Keep as method governance. In v1.1 mark the approval `role: approval`; do not manufacture a synthesis wrapper for a template. |
| `packages/cli` | `reviews/cli-package-architecture-review` is the canonical synthesis; target verdict remains incomplete/changes required. | `reviews/cli-package-architecture-review-approval`; `reviews/cli-package-architecture-review-pr224-reconciliation`; linked specialist/evidence notes | Structurally sound and byte-frozen. The reconciliation is an addendum. No wrapper. |
| OKF extension evolution | `reviews/okf-extension-evolution-recommendation` is the family root synthesis; `reviews/okf-extension-evolution-recommendation-rereview` is the current PASS ruling over repaired target bytes. | `reviews/okf-extension-evolution-options-standards`; `reviews/okf-extension-evolution-standards-applicability` | Connected correctly by the rereview's link to the prior review. Classify specialists and rereview; no wrapper. |
| PR #187 project-directory resolution | `reviews/pr-187-project-directory-resolution` | Linked remediation task | One standalone synthesis. |
| Multi-session pre-compaction | `reviews/pre-compact-multi-session-team-2026-08-03` is the revision-2 team synthesis; `reviews/pre-compact-multi-session-v3-plan-2026-08-03` is a later PASS plan gate. | Three specialist context notes and revised design/plan | Both are Reviews, but the later gate has no graph edge to the prior synthesis and its exact bytes are already cited by implementation evidence. Do not rewrite it. The migration needs a thin family-alignment wrapper only if the portfolio must present these as one continuing initiative; otherwise inventory them as two exact-target initiatives and state that decision explicitly. Do not infer the family merely from the title. |
| Shared bounded document rendering | `reviews/shared-view-document-rendering` | Reviewed Design | One standalone synthesis. |
| Transient/durable View unification | `reviews/transient-durable-view-unification` | Reviewed Design and later implementation review evidence | One standalone synthesis. |
| Unified portable View model | `reviews/unified-portable-view-model` | Reviewed Design | One standalone synthesis. |
| MCP/web View security-model unification | No `type: Review` node. `reviews/mcp-view-security-model-unification` is the complete verdict-bearing synthesis but is typed `Design Review`. | Design and task backlinks | Add a thin canonical Review wrapper pointing to the frozen Design Review. Do not retype or copy its security details. |
| Mike's architectural-smell investigation | No `type: Review` node. `findings/architectural-smell-investigation-synthesis` currently carries the overall decision. | Four atomic Findings, handoff Context Note, deprecated backlog Claim, two promoted Tasks, CLI addendum | Add `reviews/architectural-smell-investigation` as the thin canonical synthesis Review. Preserve the Finding synthesis as evidence/adjudication and link all four atomic Findings, the handoff, claim, PR #224 provenance, and promoted Tasks. |
| Stable architecture domain model vs bundle state | No `type: Review` node. `context-notes/architecture-domain-model-review-2026-07-13` explicitly calls itself the final architecture review and records correctness findings against exact main revisions. | Its reviewed code/revision evidence | Add a thin canonical Review wrapper or deliberately exclude this pre-portfolio initiative with an explicit legacy policy. It is the clearest violation of “Context Note is not the sole durable final verdict.” |

The six `Review Request` records remain a separate request lifecycle: `board-placement` (`changes_requested`), `cadence-continuous-staging` (`canceled`), `kinds-and-descriptions-architecture` (`approved`), `onboarding-surfaces-mike-signoff` (`approved`), `personal-bundle-catalog-product` (`requested`), and `pre3-records-reconciliation` (`requested`). Their titles may say “review” or “architecture review,” but their type and named-human decision contract are authoritative.

## Context Note boundary and title-classification challenge

The following facts make title-based migration unsafe:

- `reviews/architecture-review-template` lives in `reviews/` but is a reusable `Doc`, not a review outcome.
- `reviews/mcp-view-security-model-unification` lives in `reviews/` and has a final verdict, but its type is `Design Review`.
- `findings/architectural-smell-investigation-synthesis` is typed `Finding` but carries Mike's family-level adjudication.
- `review-requests/kinds-and-descriptions-architecture` has “Architecture review” in its title but is a named-human `Review Request`.
- Hundreds of Context Notes contain “review,” “approval,” or “verdict”; most are exact-SHA code-review gates, QA evidence, specialist passes, or orchestration handoffs and should remain Context Notes.

Use this content-and-graph test for legacy Context Notes. A wrapper is warranted only when all are true:

1. the record freezes a bounded architecture/design target or exact revision;
2. it issues the overall reusable verdict for that target, not one specialist or implementation gate;
3. the verdict is expected to be found independently of the original task/session;
4. no canonical Review synthesis is reachable through its graph; and
5. a wrapper improves discovery without copying findings or creating work.

`context-notes/architecture-domain-model-review-2026-07-13` passes this test. `context-notes/board-git-package-review-2026-07-15`, `context-notes/storage-backend-contract-testkit-design-review`, `context-notes/home-surface-design-review`, `context-notes/doc-reader-design-review`, `context-notes/relreader-design-review`, and `context-notes/npm-quickstart-integration-architecture-codex` are **inventory candidates**, not automatic migrations: each is an explicit design/plan verdict, but each may be a phase gate whose accepted changes were folded into a Design/Plan and whose later implementation review owns closure. The migration owner must apply the five-part test and record inclusion/exclusion in the inventory. CLI specialist and exact-draft Context Notes are already governed by the CLI canonical Review and must not receive wrappers.

## Mike family exact evidence contract

The wrapper should distinguish three revision classes rather than flattening them into one `target_version`:

- PR #224 survey: PR head `76ed593695d9f712b09e2734c50fa3117097b336`, `ARCHITECTURE-SMELLS.md` Git blob `cb86ca5e9ac69f2108bb90d0b919ccd4b67a9905`, file SHA-256 `caa0293596d881283d757ca760ada3d482dd675eb711cac51975ca6d0cd67b5d`, surveying main `31921ce157260c5b7245375503059bdd2c4a3bfe`;
- four focused investigations: current-main evidence commit `5806ece2c393f1c277f4a17a9006c1ba75eca86b`;
- CLI reconciliation: the focused CLI report reviewed source `81b3c39ff252013e318b1a714b63430a24074d70`, while the reconciliation addendum records the cross-revision chronology.

Therefore `target` and `target_version` should be documented as primary routing fields, not a complete provenance model. Template v1.1 must require a body-level target/evidence table when a family spans multiple targets, revisions, or artifact digests.

## Review convention compatibility and required corrections

The convention can govern the old `type: Review` corpus without warnings under this contract:

- required field: `title` only;
- path: `reviews/`;
- optional fields: `status`, `role`, `verdict`, `family`, `target`, `target_version`, `evidence_cutoff`, `template_version`, `owner`;
- no required body headings;
- enum values may be declared for `status`, `role`, and `verdict` because old documents omit them;
- the convention body, not schema enforcement, states the stronger v1.1 authoring rules.

Required semantic clarifications for v1.1:

- `status` is record lifecycle (`draft`, `in_review`, `final`, `superseded`); `verdict` is judgment about the named target. Never use one as the other.
- `owner` means steward of the Review record/family, not code owner, target owner, reviewer identity, authentication, or authorization.
- `family` is a stable slug or canonical Review ID. It is required by template v1.1 but optional in the convention for legacy compatibility.
- `target`/`target_version` identify the primary target only. Multi-target provenance remains in the decision card/evidence table.
- `approved_with_caveats` means no blocking action; mandatory pre-acceptance repair maps to `changes_required`. A conditional verdict maps according to whether its conditions block acceptance.
- `superseded` must not justify rewriting a frozen Review. Currentness is normally expressed by a new addendum/rereview and a link; the portfolio derives the current leaf.
- `refuted` should be used only when the Review's target is a claim/hypothesis. Refuted Findings keep their own disposition and do not force the family verdict to `refuted`.

Add exact typed-link vocabulary for **new** Review records, while preserving legacy free-text edges:

- `part of review` -> `Review` for specialist/approval/addendum/rereview to canonical synthesis;
- `has finding` -> `Finding`;
- `produces task` -> `Task`;
- `supported by context` -> `Context Note`.

Existing frozen relations such as `approves report`, `uses approved template`, and descriptive evidence links remain valid legacy aliases. The portfolio and inventory must not assume those aliases establish family membership unless the frozen mapping names them explicitly.

## Frozen exact versions

Treat every pre-alignment artifact below as immutable input, whether or not another record currently cites its hash:

### Approved method and CLI family

- domain model: `research/architecture-review-domain-model` — `sha256:061758d30ed7cb406f4e48157470e742d48ec0a79aaced5fdf05b599e9f1c231`;
- template v1.0: `reviews/architecture-review-template` — `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`;
- template approval: `reviews/architecture-review-template-approval` — `sha256:c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead`;
- CLI synthesis: `reviews/cli-package-architecture-review` — `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14`;
- CLI approval: `reviews/cli-package-architecture-review-approval` — `sha256:353f0fb6880ce39af116943ecebfc5037a09bd466dbba88151bf3090f718e791`;
- CLI/PR #224 addendum: `reviews/cli-package-architecture-review-pr224-reconciliation` — `sha256:df2df0d994ce94f4a5a89d72315cf5f87175f45e41eac02fe3443bc25dbced52`.

### Other existing Reviews

- `reviews/okf-extension-evolution-options-standards` — `sha256:2a82b93f00b6070bddb7970b2ccc150b773f72abe50e852c5c0432f3cc0ed090`;
- `reviews/okf-extension-evolution-recommendation` — `sha256:48d08834cd9976f69f73b5395807ca14617f7b71a74ff4cf7cfb99c0a9713ca2`;
- `reviews/okf-extension-evolution-recommendation-rereview` — `sha256:fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5`;
- `reviews/okf-extension-evolution-standards-applicability` — `sha256:87cedc29d64e485802a0f14b58cfc75fb4bcf61cf3faeb3e0a3c5e16387aeaec`;
- `reviews/pr-187-project-directory-resolution` — `sha256:35d9bd1736bc62cc42bd0128d2384e285bba492b84f0ca4334af80442988b26c`;
- `reviews/pre-compact-multi-session-team-2026-08-03` — `sha256:e2081f3f9df3c0ec85908a684e24d700b8e0d6c187401278b44e81ecc7730925`;
- `reviews/pre-compact-multi-session-v3-plan-2026-08-03` — `sha256:f7c065ab383568a968564b84406df2a056b9bb42489dc88ec5462e4db32cc3c3`;
- `reviews/shared-view-document-rendering` — `sha256:344faba806d8d4972a6292e05f8e3611ccab1c13fac304c4bd2939eb88af4c9c`;
- `reviews/transient-durable-view-unification` — `sha256:2a7592d36a023a3d9062e6436b30fe3faf393e06f0d9cbbf2e5c538e074fd2f9`;
- `reviews/unified-portable-view-model` — `sha256:b764c4589aada4d1783de3fe7c9c38feb917373ab3b184a222d49c7ba56b2113`;
- legacy Design Review `reviews/mcp-view-security-model-unification` — `sha256:2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de`;
- context-only architecture review `context-notes/architecture-domain-model-review-2026-07-13` — `sha256:ef7677811db36ed1b3faf26a6f1f6b5d6c61668feece468262fad99be04083bf`.

### Mike family

- family synthesis Finding — `sha256:7e0b3274aee6cca333c7ff640c75969586e0f32e2069114b1eb74b6d4e767cce`;
- CLI type-only cycles — `sha256:c84b9eb2157cf79771830802265b06b5f35782559c5b1991074318728d41c019`;
- core import-direction gate — `sha256:82d862a7e3f38f62386ee096bccf6caf608c3a4cf93c7d5ebd53517628bb8c62`;
- core/server test dependency — `sha256:dbd63f65c666ced47e3fdcfbdd01206605c99f4149368b678496746bb321376f`;
- registered-View launch authority — `sha256:eaa332484a88dfdbdbae293c772800e72beaa7b2e6b7fa4865f462fbdd1d17fd`;
- handoff Context Note — `sha256:4fdf0f2361f2cc5892f165720e98564309bdde355bb8730114ab92892efb4bc5`;
- deprecated backlog Claim — `sha256:7fa7cba630bd8f6b6b7271e28be87068e3e00204b923426b01e86f529db4368a`.

## Recommended implementation contract

1. Freeze a machine-readable Research inventory before adding wrappers. Each row records `family`, candidate canonical Review, role, type, exact head version, primary target/version, current verdict record, and explicit inclusion/exclusion rationale for review-like Context Notes.
2. Add the minimal Review convention with `family` optional and the new typed link vocabulary. Prove compatibility by copying the bundle to scratch, adding the convention, running `status`, and showing zero delta in kind warnings for the 14 existing Reviews.
3. Create v1.1 as a new template artifact, never an update to v1.0. Require `family`, normalized lifecycle/verdict fields, canonical-link semantics, multi-target provenance, and the five-part legacy classification test.
4. Pilot three migrations: Mike (missing Review), MCP security-model unification (wrong legacy type), and architecture-domain-model review (sole final Context Note). Keep the CLI family unchanged as the positive control.
5. Resolve the pre-compaction pair explicitly: either two exact-target families or one wrapper-mediated continuing family. Do not title-group it silently.
6. Only after the pilot passes should the migration owner adjudicate the seven legacy Context Note candidates. Record exclusions; an exclusion is a taxonomy decision, not an omission.
7. Make the portfolio group new records by `family` plus canonical links, with an explicit frozen-legacy mapping from the inventory. It must not derive authority from filename stems, title keywords, folder alone, or timestamps.
8. Independent review must compare all frozen hashes above, prove exactly one synthesis per included family, and verify that wrapper bodies summarize only decision/provenance while findings remain in source records.

## Risks and objections

- **Blocking:** no family discriminator means the portfolio reintroduces title/prose inference and cannot mechanically prove one synthesis per family.
- **High:** `target_version` alone can erase the Mike family's multi-revision chronology and the CLI report's source-plus-built-artifact identity.
- **High:** blindly migrating review-titled Context Notes creates wrapper proliferation and turns phase gates into competing authorities.
- **Medium:** marking frozen Reviews `superseded` would invalidate exact-version approvals and downstream citations.
- **Medium:** treating `approved_with_caveats` as compatible with mandatory repairs obscures whether work blocks acceptance.
- **Medium:** the pre-compaction Reviews are semantically related but graph-disconnected; any automatic grouping would be an unverified inference.

## Confidence and validation

Confidence is **high** for convention backward compatibility, typed inventories, exact Review/Finding versions, the CLI/OKF/Mike family classifications, and the two missed legacy families. Confidence is **medium** for whether the broader design-review Context Notes deserve portfolio wrappers because that is a policy boundary the accepted plan does not yet make explicit. The five-part test and inventory inclusion rationale turn that ambiguity into a reviewable decision rather than a filename heuristic.

[implements alignment plan](../plans/architecture-review-record-alignment.md)

[audits assigned task](../tasks/architecture-review-alignment-taxonomy-audit.md)

[uses domain model](../research/architecture-review-domain-model.md)

[uses approved template](../reviews/architecture-review-template.md)
