---
type: Plan
title: Align architecture-review records and discovery
actor: codex-orchestrator
timestamp: '2026-08-08T14:09:15.797Z'
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

For new `Review` records, use this minimal frontmatter vocabulary consistently:

- `status`: `draft`, `in_review`, `final`, or `superseded`;
- `role`: `synthesis`, `specialist`, `approval`, `addendum`, or `rereview`;
- `verdict`: `pending`, `approved`, `approved_with_caveats`, `changes_recommended`, `changes_required`, `incomplete`, or `refuted`;
- `target`, `target_version`, `evidence_cutoff`, `template_version`, and `owner` as provenance fields.

These fields remain optional in the initial Kind so legacy exact-version Reviews stay valid, but template v1.1 requires applicable fields on every newly authored canonical Review. Lifecycle `status` and target `verdict` stay separate.

# Current-state baseline

- The bundle contains 14 `type: Review` documents under `reviews/`, but declares no `Review` kind. Consequently `aslite new "Review" ...` fails and correct placement depends on operator memory.
- The approved architecture-review template and domain model already define review content and finding quality, but do not make artifact placement or family navigation mechanically obvious.
- Six declared `Review Request` records have a supported human-decision workflow.
- The registered `pages-registry/reviews` View displays only `Review Request` records; completed `Review` reports are absent from the review UI.
- Mike's architecture-smell team produced one synthesis and four atomic investigations under `findings/`, plus a `context-notes/` handoff and tasks. The records are well linked, but the family has no canonical `Review` node.
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

# Implementation plan

| Step | Deliverable | Owner role | Depends on | Parallelism |
| --- | --- | --- | --- | --- |
| A. Freeze inventory | `research/architecture-review-artifact-inventory`: every `Review`, review-like final context note, Finding family, Review Request, target/version, canonical-family candidate, and link gaps. Record hashes for approved/frozen artifacts. | Information architect | none | Can inventory existing `reviews/` and candidate context notes in parallel. |
| B. Define the convention | Minimal `Review` kind at `conventions/review`: required `title`, path `reviews/`; optional `status`, `role`, `verdict`, `target`, `target_version`, `evidence_cutoff`, `template_version`, and `owner`. Keep optional fields and no required headings so legacy exact-version Reviews remain conformant. | Domain-model owner | A | Convention drafting and View data-contract design may proceed in parallel after the inventory shape is known. |
| C. Version the template | Create architecture-review template v1.1 as a new exact-version artifact, adding this placement/family model, naming, wrapper rule, and Review/Finding/Context Note distinction. Run specialist and skeptic review; do not mutate approved v1.0. | Review-method owner + security/testing/design reviewers + skeptic | B | Specialist reviews fan out, then synthesize/approve. |
| D. Pilot the two current families | 1) designate the existing CLI report as canonical without changing it; verify its approval/addendum/evidence graph. 2) create `reviews/architectural-smell-investigation` as a thin canonical Review linking PR #224 provenance, Mike's synthesis, four Findings, handoff, accepted/refuted dispositions, and two follow-on tasks. | Migration owner + original review owners | B; may use draft C | The CLI and architecture-smell pilots can run independently. |
| E. Align remaining families | Group all existing Review docs into families; identify one canonical report per family. For any verdict-bearing context note with no canonical Review, create a wrapper. Leave supporting reviewer gates, handoffs, and historical evidence in place. Create no duplicate findings or tasks. | Migration owner | D (pilot establishes pattern) | Families can be processed in parallel from a frozen inventory. |
| F. Make discovery self-enforcing | Add a Review Portfolio View, or evolve the current Reviews View, so it shows both human Review Requests and completed/in-progress Review families with role/status/verdict/target/cutoff plus links to Findings and Tasks. Preserve the distinct request lifecycle visually. | View owner | B and D | UI implementation can start after the pilot data contract; finalization waits for E's edge cases. |
| G. Reviewer gate | Independent reviewer audits exact artifact hashes, family cardinality, wrapper thinness, type semantics, disclosure safety, and absence of duplicate backlog. Reject any migration that changes a frozen Review or makes a context note the new authority by copying prose. | Independent reviewer/skeptic | C, D, E, F | none |
| H. QA and close | Run bundle status/kind/link checks; exercise `new "Review"`; verify portfolio discovery; sample every family; update the umbrella task and sync. | QA | G | none |

# Acceptance criteria

- A declared minimal `Review` kind makes `aslite new "Review" ...` place new records under `reviews/` without making any existing Review malformed.
- The approved template v1.0 and every exact-version Review/approval named by existing records retain their original hashes.
- Template v1.1 explicitly defines the artifact model, naming, family graph, amendment rule, and disclosure lane, and has its own exact-version approval.
- Every architecture-review initiative in the frozen inventory is reachable from exactly one canonical Review synthesis; standalone amendments/re-reviews link their canonical family.
- Every accepted/refuted architecture Finding is reachable from a canonical Review, and every remediation Task is traceable to the finding/review that justified it.
- No `Context Note` is the sole durable final verdict for an architecture-review initiative. Phase evidence and reviewer gates may remain Context Notes when linked from a canonical Review.
- Mike's architecture-smell family is discoverable as a Review without moving or rewriting its synthesis, four Findings, handoff, or tasks.
- The CLI family remains byte-stable and is discoverable together with its approval and PR #224 reconciliation addendum.
- The Review Portfolio surface distinguishes pending human requests from completed/in-progress reports and lets a new reader reach verdict, target, findings, and next action within two navigation steps.
- Bundle status introduces no new malformed docs, unresolved links, link-type violations, or missing expected links; any pre-existing debt is reported separately.
- Independent review passes before QA; QA records exact commands, versions, sampled families, and residual legacy exceptions.

# Risks and non-goals

- **Schema overreach:** a strict Review kind would invalidate frozen documents. Keep the initial kind minimal; the approved template, not mandatory headings, carries the rich method.
- **Wrapper proliferation:** only create a wrapper where no canonical Review exists. Existing well-formed Review families do not get redundant indexes.
- **False migration by title:** intermediate notes containing “review” remain evidence unless they own the final verdict.
- **Approval confusion:** an agent-team Review and a named-human Review Request are different workflows; do not collapse their lifecycle fields.
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
