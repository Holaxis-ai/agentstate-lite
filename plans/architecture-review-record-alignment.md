---
type: Plan
title: Align architecture-review records and discovery
actor: codex-orchestrator
timestamp: '2026-08-08T14:36:54.000Z'
---
# Ultimate and proximate goals

**Ultimate goal:** agentstate-lite is a human-visible, conflict-safe, local-first shared memory in which durable conclusions are easy to find, correctly typed, and linked to the evidence and work they govern.

**Proximate goal:** make every architecture-review initiative discoverable through one canonical `Review` record while preserving exact historical artifacts; this serves the ultimate goal by removing placement-by-instinct and preventing review conclusions from disappearing into handoff notes or finding inventories.

# Recommended artifact model

Use a **review-family graph**, with one mandatory canonical node and role-specific supporting records:

`Review Request? -> canonical Review -> {specialist evidence, Findings, approval/addenda} -> Tasks/Decisions`

| Artifact | Canonical purpose | Placement rule |
| --- | --- | --- |
| `Review Request` | A named human is asked to decide a specific question. It owns the request lifecycle, not the analysis. | `review-requests/`; use only when a human judgment is actually required. |
| `Review` | The durable, verdict-bearing report for one frozen target or one explicit amendment/re-review. Every architecture-review family has exactly one canonical synthesis Review. | `reviews/`; decision card first, exact target/evidence cutoff, verdict, findings, next actions, provenance and limitations. |
| `Finding` | One atomic evidence-backed claim, including confirmed, refuted, observed/deferred, or fixed dispositions. It is not a substitute for the review's scope, stopping rule, or overall verdict. | `findings/`; reachable from a canonical Review. |
| `Context Note` | Orientation, handoff, phase evidence, drafts, reviewer working notes, or orchestration reflection. It may support a Review but must not be the only durable final verdict. | `context-notes/`; linked as evidence from the canonical Review when material. |
| `Research` / `Design` | Reusable analysis or proposed architecture being reviewed. | Existing semantic folder; linked as input, never relabeled as the review outcome. |
| `Approval` / addendum / re-review | A verdict on exact Review bytes, or an explicit later evidence layer. Preserve the original report and target. | `reviews/<family>-approval`, `-addendum`, or `-rereview`; always link the exact reviewed version. |
| `Task` / `Decision` / `Claim` | Remediation, adopted choice, or lifecycle assertion produced by review. | Existing semantic folder; never used as the only review synthesis. |
| External PR/report | Source evidence with external provenance. | Referenced by URL plus commit/blob/digest from a bundle Review; do not silently treat an external file as the bundle's canonical review record. |

Naming convention for new work:

- canonical: `reviews/<subject>-architecture-review` or a more specific stable subject name;
- specialist verdict: `reviews/<family>-<security|testing|design|reliability|skeptic>` when it independently issues a verdict;
- atomic claim: `findings/<family>-<finding-slug>`;
- approval/amendment: `reviews/<family>-approval|addendum|rereview`;
- working evidence: `context-notes/<family>-<phase>-<actor-or-date>`.

The title or the presence of the word “review” does not determine the type. Role in the graph does.

For new `Review` records, use this recommended frontmatter vocabulary consistently:

- `status`: `draft`, `in_review`, `final`, or `superseded`;
- `role`: `synthesis`, `specialist`, `approval`, `addendum`, or `rereview`;
- `verdict`: `pending`, `approved`, `approved_with_caveats`, `changes_recommended`, `changes_required`, `incomplete`, or `refuted`;
- `verdict_subject` to say whether the judgment applies to the reviewed target, the Review artifact, a repair, or another explicitly named subject;
- `family` as an optional routing hint for a multi-record family; direct OKF links remain the relationship authority;
- `target`, `target_version`, `evidence_cutoff`, `template_version`, and `owner` as provenance fields.

These fields remain optional and open-valued in the initial Kind so legacy and externally authored Reviews stay valid. Template v1.1 requires applicable provenance and an explicit verdict subject on newly authored Reviews, recommends the named lifecycle/role/verdict vocabulary without closing future values, and requires new supporting Reviews to link their canonical synthesis when one exists. Lifecycle `status` and target `verdict` stay separate. Artifact approval never implies target approval. A standalone Review needs no `family`; a conflicting family hint and graph link is an ambiguity to surface, not a reason to guess.

A canonical synthesis is the stable family root, not a mutable “latest” document. Addenda and re-reviews form an immutable forward graph using recommended plain-link labels such as `part of review`, `amends review`, `rereviews`, or `approves report`. The currently effective conclusion is the unique applicable leaf for a named target/evidence line; ambiguity or branching is rendered as such rather than resolved by timestamp. Frozen predecessors are never rewritten to mark them superseded.

# Flexibility and OKF constraints

The alignment layer is additive bundle content, not a new engine or closed registry. The infrastructure must remain useful in unfamiliar OKF bundles:

- the Review convention requires only `title`, uses `reviews/` only as the preferred creation path, declares optional metadata without closed enums, and has no required headings;
- plain relative Markdown links and live graph queries remain authoritative; recommended relationship labels improve consistency but unknown labels, types, fields, values, cycles, and multiple parents remain readable;
- the frozen migration inventory is audit evidence only and is never consulted by the runtime View;
- the View queries live `Review Request` and `Review` documents, preserves raw unknown values and edge labels, and never special-cases project ids, package names, titles, filename stems, or known families;
- missing conventions, missing metadata, dangling targets, caps, and partial failures degrade visibly rather than hiding records or inventing a verdict; and
- portability is tested in a scratch bundle without the migration inventory and both with and without Review conventions.

# Current-state baseline

- The bundle contains 14 `type: Review` documents under `reviews/`, but declares no `Review` kind. Consequently `aslite new "Review" ...` fails and correct placement depends on operator memory.
- The approved architecture-review template and domain model already define review content and finding quality, but do not make artifact placement or family navigation mechanically obvious.
- Six declared `Review Request` records have a supported human-decision workflow.
- The registered `pages-registry/reviews` View displays only `Review Request` records; completed `Review` reports are absent from the review UI.
- Mike's architecture-smell team produced one synthesis and four atomic investigations under `findings/`, plus a `context-notes/` handoff and tasks. The records are well linked, but the family has no canonical `Review` node.
- The verdict-bearing `reviews/mcp-view-security-model-unification` is frozen as `type: Design Review`, and `context-notes/architecture-domain-model-review-2026-07-13` is the sole final verdict for its target. Each lacks a canonical `Review` node and needs a thin wrapper rather than retyping or copying the source.
- The CLI architecture-review family is already structurally sound: canonical report, exact-version approval, addendum, and linked specialist evidence. Its frozen documents must not be rewritten merely to satisfy a new convention.
- Several older context notes have review-like titles. Some are legitimate working/gate evidence already governed by a canonical Review; others may be the only durable verdict. They require role-based inventory, not filename-based bulk migration.

# Migration principles

1. **No moves or rewrites of frozen artifacts.** Create a thin canonical Review wrapper only when a family lacks one. Outbound links from the wrapper supply backlinks without changing historical bytes.
2. **One synthesis, many evidence nodes.** Do not duplicate specialist prose into the canonical Review; summarize disposition and link exact evidence.
3. **Findings are normalized claims, not folders for whole reviews.** A Finding may synthesize other Findings, but an architecture-review initiative still needs a Review decision card and overall verdict.
4. **Context notes remain context notes when they are phase evidence.** Promote by wrapper only when a note is the sole durable conclusion; do not retype every reviewer gate or handoff.
5. **Versions remain explicit.** Approval and amendment records name exact Review versions, target revisions, artifacts, and evidence cutoff. Later evidence creates an addendum or re-review rather than silently updating an approved report.
6. **No metric-derived backlog.** Alignment changes representation and discovery; it does not reopen refuted findings or create remediation tasks from file size, complexity, clone, or coverage scores.
7. **Security disclosure remains split.** Public Review records carry only disclosure-safe findings and routing markers; private advisory mechanics never enter the shared bundle.
8. **Interoperability beats normalization.** Metadata and recommended edge labels guide new work but do not invalidate sparse, unfamiliar, or legacy OKF records. The View preserves unknown values and relations losslessly.
9. **Disclosure preflight comes first.** Before persisting an inventory row, wrapper summary, or View projection, screen the source for the repository's private-advisory threshold. Public records carry only safe conclusions, public provenance, and neutral routing markers.
10. **Authority and freshness are distinct.** The inventory distinguishes frozen current bytes, mutable current heads, and historical digest citations. Tasks and Plans may advance; a historical citation is not falsely presented as the current linked bytes.

# Implementation plan

| Step | Deliverable | Owner role | Depends on | Parallelism |
| --- | --- | --- | --- | --- |
| A. Disclosure-screen and freeze inventory | After public/private-lane preflight, take a mechanical census of: every `type: Review` anywhere, every document under `reviews/` regardless of type, every `Review Request`, every `Finding`, and every Context Note matching declared overall-verdict/architecture-target signals. Title terms may nominate Context Note candidates but never classify them. Apply the written five-part content/graph inclusion test to every candidate and create `research/architecture-review-artifact-inventory` with an inclusion/exclusion reason, target/version, canonical candidate, link gaps, and version class (frozen current bytes, mutable current head, or historical digest citation). The inventory is audit evidence only. | Information architect + security reviewer | none | The mechanical collections can be enumerated in parallel after the disclosure rule is fixed; candidate classification waits for the full census. |
| B. Define the convention | Minimal `Review` kind at `conventions/review`: required `title`, preferred path `reviews/`; optional open-valued `status`, `role`, `verdict`, `verdict_subject`, `family`, `target`, `target_version`, `evidence_cutoff`, `template_version`, and `owner`. Declare no enum closure or required headings. Keep recommended relationship labels in guidance so unknown free-text links remain first-class OKF edges. | Domain-model owner | A | Convention drafting and View data-contract design may proceed in parallel after the inventory shape is known. |
| C. Version the template | Create architecture-review template v1.1 as a new exact-version artifact, adding the placement/family model, verdict-subject rule, immutable succession graph, naming, wrapper rule, multi-target provenance, disclosure preflight, portability rules, and Review/Finding/Context Note distinction. Run specialist and skeptic review; do not mutate approved v1.0. | Review-method owner + security/testing/design reviewers + skeptic | B | Specialist reviews fan out, then synthesize/approve. |
| D. Pilot current families | 1) designate the existing CLI report as canonical without changing it; verify its approval/addendum/evidence graph and distinguish artifact approval from target verdict. 2) create `reviews/architectural-smell-investigation` as a thin canonical Review linking PR #224 provenance, Mike's synthesis, four Findings, handoff, accepted/refuted dispositions, and exactly the two existing promoted task IDs. 3) create a disclosure-safe thin wrapper for the frozen MCP `Design Review`. 4) create a chronology-aware wrapper for the domain-model review that preserves the earlier technical changes-requested verdict and links the later approved human Review Request as the effective outcome. | Migration owner + original review owners | B; may use draft C | The three missing-family wrappers can run independently; CLI remains the unchanged positive control. |
| E. Align remaining families | Classify existing Review docs and legacy candidates by content and graph. Treat the two graph-disconnected pre-compaction Reviews as two explicit exact-target initiatives unless evidence justifies a wrapper. Record inclusions and exclusions for review-like Context Notes; leave phase gates and historical evidence in place. Create no duplicate findings or tasks. | Migration owner | D (pilot establishes pattern) | Families can be processed in parallel from a frozen inventory. |
| F. Make discovery self-enforcing | Evolve the existing `pages-registry/reviews` View in place into a Review portfolio. Keep its id, entry, and `bundle-read` grant; show Review Requests and Reviews as distinct lifecycles; use live queries and graph edges only; preserve unknown values/relations; use shared document rendering; and expose caps, partial data, and legacy metadata honestly. | View owner | B and D | UI implementation can start after the pilot data contract; finalization waits for E's edge cases. |
| G. Reviewer gate | Independent reviewer audits exact artifact hashes, family cardinality, wrapper thinness, type semantics, disclosure safety, and absence of duplicate backlog. Reject any migration that changes a frozen Review or makes a context note the new authority by copying prose. | Independent reviewer/skeptic | C, D, E, F | none |
| H. QA and close | Run bundle status/kind/link checks and exercise `new "Review"`. In scratch bundles, run the portability matrix both with and without the Review convention and with and without the migration inventory: minimal Reviews outside the preferred prefix; unknown fields/values/relations; multiple parents; cycles/self-edges; dangling targets; unfamiliar types; HTML-like metadata; caps; partial query failure; and live add/update/delete. Assert every record/edge remains visible or explicitly unresolved, ambiguity is surfaced, no title/timestamp/folder inference occurs, and deleting the inventory changes no query/list/detail result. Then sample every migrated family, update the umbrella task, and sync. | QA | G | none |

# Acceptance criteria

- A declared minimal `Review` kind makes `aslite new "Review" ...` place new records under `reviews/` without making any existing Review malformed.
- A minimal `{type: Review, title}` record, unknown metadata values, arbitrary edge labels, and a Review outside the preferred prefix remain readable and discoverable; the convention is guidance, not an OKF validity fork.
- The approved template v1.0 and every exact-version Review/approval named by existing records retain their original hashes.
- Template v1.1 explicitly defines the artifact model, naming, family graph, amendment rule, and disclosure lane, and has its own exact-version approval.
- Template v1.1 separates record lifecycle, verdict, and verdict subject; it defines stable-root/immutable-leaf semantics without requiring a closed family registry.
- Every architecture-review initiative in the frozen inventory is reachable from exactly one canonical Review synthesis; standalone amendments/re-reviews link their canonical family.
- Every accepted/refuted architecture Finding is reachable from a canonical Review, and every remediation Task is traceable to the finding/review that justified it.
- Alignment creates zero new Findings and zero remediation Tasks; Mike's promoted remediation identity remains exactly `tasks/registered-view-launch-authority-consolidation` and `tasks/core-import-direction-gate`.
- No `Context Note` is the sole durable final verdict for an architecture-review initiative. Phase evidence and reviewer gates may remain Context Notes when linked from a canonical Review.
- Mike's architecture-smell family is discoverable as a Review without moving or rewriting its synthesis, four Findings, handoff, or tasks.
- The frozen MCP `Design Review` and architecture-domain-model Context Note are discoverable through thin canonical Review wrappers without copying their substantive or disclosure-sensitive detail.
- The CLI family remains byte-stable and is discoverable together with its approval and PR #224 reconciliation addendum.
- The Review Portfolio surface distinguishes pending human requests from completed/in-progress reports and lets a new reader reach verdict, target, findings, and next action within two navigation steps.
- The portfolio works without the migration inventory and without hardcoded project identities; sparse/unknown records, arbitrary relations, cycles, missing targets, caps, and partial failures remain visible with honest ambiguity/incompleteness markers.
- Bundle status introduces no new malformed docs, unresolved links, link-type violations, or missing expected links; any pre-existing debt is reported separately.
- Disclosure preflight passes before public inventory/wrapper/View publication, and no wrapper copies private-lane mechanics.
- Independent review passes before QA; QA records exact commands, versions, sampled families, and residual legacy exceptions.

# Risks and non-goals

- **Schema overreach:** a strict Review kind, closed enum, or mandatory relationship vocabulary would invalidate or hide flexible OKF content. Keep the initial kind minimal and open-valued; the approved template carries the rich method as guidance.
- **Wrapper proliferation:** only create a wrapper where no canonical Review exists. Existing well-formed Review families do not get redundant indexes.
- **False migration by title:** intermediate notes containing “review” remain evidence unless they own the final verdict.
- **Approval confusion:** an agent-team Review and a named-human Review Request are different workflows; do not collapse their lifecycle fields.
- **Manifest authority:** the migration inventory is evidence, not a runtime registry. Deleting it must not break discovery.
- **Scope:** this plan aligns records and discovery. It does not redo the reviews, change application architecture, resolve their remediation tasks, or expose private security details.

# Recommended sequence and stopping rule

Execute A -> B -> C, then pilot D. Proceed to bulk alignment E and portfolio F only if the pilot demonstrates faster discovery without duplicate authorities. G is a hard dependency before H. Stop when every frozen initiative has one canonical Review path and the acceptance criteria pass; do not chase uniform filenames or rewrite history for cosmetic consistency.

# Existing authorities and pilot inputs

- [Approved architecture-review template v1.0](../reviews/architecture-review-template.md)
- [Template exact-version approval](../reviews/architecture-review-template-approval.md)
- [Architecture-review domain model](../research/architecture-review-domain-model.md)
- [Canonical CLI architecture review](../reviews/cli-package-architecture-review.md)
- [CLI review approval](../reviews/cli-package-architecture-review-approval.md)
- [CLI/PR #224 reconciliation addendum](../reviews/cli-package-architecture-review-pr224-reconciliation.md)
- [Mike-team architectural-smell synthesis](../findings/architectural-smell-investigation-synthesis.md)
- [Mike-team handoff note](../context-notes/architectural-smell-audit-handoff.md)
- [Current Review Requests View](../pages-registry/reviews.md)
