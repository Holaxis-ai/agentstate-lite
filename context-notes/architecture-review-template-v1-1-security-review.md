---
type: Context Note
title: Architecture review template v1.1 security and reliability review
actor: review-method-security
timestamp: '2026-08-08T15:03:04.871Z'
---
# Summary

**Final verdict: APPROVE.** The initial candidate required three narrow authority repairs. All three
are resolved in the exact repaired convention and template identified below, with no regression to
open-world OKF flexibility. The original findings remain in this note as the review trail.

**Ultimate goal:** preserve agentstate-lite as human-visible, conflict-safe, local-first shared memory whose durable conclusions remain findable, correctly typed, and evidence-linked.

**Proximate goal:** make the reusable Review method safe under sparse, unfamiliar, and conflicting OKF content; this serves the ultimate goal by preventing open metadata and graph links from becoming accidental authorization or verdict authority.

## Exact repaired-artifact re-review

- Review convention: `conventions/review` at `sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`.
- Template candidate: `reviews/architecture-review-template-v1.1` at `sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`.
- Re-review scope: only initial blockers SR-1 through SR-3 plus a regression check of the Kind's
  open-world contract.

### Resolution

- **SR-1 resolved.** Lifecycle examples are now only `draft`, `in_review`, and `final`.
  `approved` is a verdict with an explicit subject, `applied` belongs in linked work/evidence, and
  imported `superseded` remains visible but cannot establish approval or currentness.
- **SR-2 resolved.** The generic Kind now explicitly owns no topology or current-verdict algorithm.
  The architecture-review method defines successor-to-predecessor direction, an explicit classified
  succession edge, repeated target/evidence applicability, and a target-level verdict subject.
  Support, approval, navigation, and unfamiliar relations do not enter the target-verdict chain;
  competing/missing/conflicting applicability fails closed as unknown, ambiguous, or incomplete.
- **SR-3 resolved.** Actor/owner/reviewer/assignee metadata is explicitly advisory absent a separate
  authenticated system. A method-authored verdict without `verdict_subject` cannot be final.
  Disclosure preflight now covers every public persistence surface named in the finding and defaults
  unresolved exploitability/release applicability to the private lane.

### Flexibility regression check

The repaired convention still requires only `title`, declares no enum or link vocabulary, and
requires no headings. It explicitly permits other Review methods to use peer panels, quorum
decisions, multiple scoped roots, or no synthesis. Unknown imported fields, values, statuses,
relations, and target types remain valid and visible. The architecture method recommends
`succeeds review` but permits an author-declared alternative mapping, so safety does not depend on a
closed relation enum.

In the existing disposable bundle, promoting the exact repaired convention retained one Kind with
only `title` required, zero kind warnings, the prior minimal Review, the off-prefix unfamiliar
Review, its HTML-like and unknown fields, and its custom unresolved edge. `shasum -a 256` matched
both repaired versions exactly.

**No remaining blocker.** Independent portability QA still owns the full browser escaping,
pagination/partial-query, classified-succession, and live-update matrix; that is normal downstream
evidence, not a defect found in this scoped re-review.

## Initial exact review subject

- Review convention: `conventions/review` at `sha256:cd91040314f5feca01a11e53f7784e4435d22780e816f23d5fe9c0c56844100f`.
- Template candidate: `reviews/architecture-review-template-v1.1` at `sha256:91bf042022c1da49021ae9d8a20272941c0452f85c5f187274920a39f94ba48d`.
- Approved alignment plan: `plans/architecture-review-record-alignment` at `sha256:b6ccec33c9daee7182a188916e6a898fdd83618372b0e1da83a59e896b6fc534`.
- Migration inventory: `research/architecture-review-artifact-inventory` at `sha256:5aad2d2e466fe2fe51e96185aeafd57c6ddb3021164db05ceeb1a11d13050d28`.
- Frozen predecessor: `reviews/architecture-review-template` at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`; its approval remained `sha256:c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead`.

No product vulnerability was found or published. These are method-level authority and disclosure findings suitable for the public board.

## Initial required changes (resolved by the repaired versions above)

### SR-1 — Keep lifecycle state separate from judgment and succession

**Evidence: reasoned, exact bytes.** Section 0.1 correctly says `status` is record lifecycle and `verdict` is judgment, but the Decision Card later recommends `draft/in review/approved/applied`. `approved` and `applied` are judgment/workflow meanings, not lifecycle states. Section 0.1 also offers `superseded` while sections 0.2 and the convention prohibit rewriting frozen predecessors merely to mark them superseded.

**Required repair:** use lifecycle-only examples such as `draft`, `in_review`, and `final`. If `superseded` remains as an interoperability example, state that it may be preserved from legacy/external content but is never the authority for effective-conclusion selection. Approval belongs in a Review verdict whose `verdict_subject` names the report/template/target; application/remediation belongs in linked work or evidence. Unknown statuses remain valid raw content.

**Acceptance probe:** an unfamiliar status remains visible, but neither it nor a `status: approved` value is interpreted as target approval or as a succession edge.

### SR-2 — Define a fail-closed applicability rule before saying “unique effective leaf”

**Evidence: reasoned, exact bytes.** The convention and template say the effective conclusion is the unique applicable leaf, while links and relation labels are intentionally open-world. They do not fully define which edges are succession edges, their semantic direction, or why an approval/support Review is excluded from the target-verdict chain. A generic traversal could therefore treat `approves report`, `part of review`, or another unfamiliar edge as succession, or could silently choose a leaf from incomplete metadata.

**Required repair:** state that no generic consumer may infer a current/effective verdict from arbitrary edges, `family`, path, title, status, or time. A method-conformant successor must explicitly name its immediate predecessor, repeat the applicable target/evidence line, and state a target-level `verdict_subject` when it changes the target conclusion. Approval, specialist, wrapper, and evidence records do not enter the target-verdict succession chain unless they explicitly issue that target-level judgment. Unknown relation labels remain visible but non-authoritative. Missing applicability data, competing roots/successors, multiple parents, cycles, or conflicting target/evidence lines yields `unknown`, `ambiguous`, or `incomplete`—never an inferred winner.

This is a prose-level safety contract, not a request for a closed link enum or mandatory engine schema.

**Acceptance probe:** fixtures containing an approval leaf, an unfamiliar relation, two successor candidates, a missing target version, and a stale `family` hint must expose the graph but return no silently selected target verdict.

### SR-3 — Make identity and disclosure uncertainty explicitly fail safe

**Evidence: reasoned, exact bytes.** The convention properly says `owner` is a steward rather than an authenticated principal or authorization grant, and the security module requires explicit authentication/authorization owners. The template does not give the same warning for advisory `actor`, reviewer, or assignee metadata. Its disclosure preflight routes an issue privately when public-release status is known, but does not say what happens while exploitability or release presence is unresolved.

**Required repair:** state that `actor`, `owner`, reviewer, assignee, and similar record metadata are attribution/coordination hints unless a separate authenticated system proves otherwise; they never grant authority. State that unresolved public-release applicability defaults to the private disclosure lane until triage resolves it. The preflight applies to every public persistence surface, including Context Notes, Tasks, artifacts/blobs, inventories, wrappers, Findings, Reviews, and View projections; public records retain only a redacted routing note. New method-conformant Reviews that carry a verdict but omit `verdict_subject` cannot be called final and must surface as incomplete, while sparse/external Reviews remain valid OKF content.

**Acceptance probe:** missing `verdict_subject`, advisory actor names resembling privileged users, and unknown release state do not produce approval, authorization, or public technical disclosure.

## Survived attacks and empirical evidence

- **Exact-byte provenance survived.** `shasum -a 256` over bytes exported with `doc read --out` matched all five versions named above. The v1.0 template and approval were unchanged.
- **Minimal creation survived.** In disposable bundle `/private/tmp/aslite-review-method-security.RxUxmS`, promoting the exact convention yielded one Kind with only `title` required. `new Review minimal --title ...` created `reviews/minimal` without body headings and `status` reported zero kind warnings.
- **Open-world interoperability survived.** A promoted `type: Review` at `elsewhere/unfamiliar` used HTML-like title/verdict-subject strings, unfamiliar `status`/`verdict`, an unknown extension field, and a custom link to an unfamiliar missing target. `list --fields ...` preserved every raw value, `link show` preserved the edge label, and `status` surfaced the target as unresolved rather than dropping the record or inferring a family.
- **Inventory non-authority survived the sampled path.** The disposable bundle contained the convention but no migration inventory; Kind discovery and Review creation worked unchanged.
- **Trust model breadth survived.** The candidate explicitly inventories input, path, subprocess, network, credential, authentication/authorization, TOCTOU/concurrency, unsafe-default, resource, supply-chain, and disclosure boundaries; unassessed material security obligations force `incomplete`.
- **Reliability depth survived.** The candidate requires commit-point/fault-window analysis, intent identity, retry-after-unknown-outcome, CAS/version binding, partial receipts, cancellation, cleanup, corruption recovery, bounded resources, and degraded-mode authority.

The HTML-like metadata was inspected through structured CLI output, not rendered in a browser. Output escaping and the full cycle/multiple-parent/live-update matrix remain for independent portability QA after repair.

## Residual risk after repair

- Because relation labels remain open-world, human-authored semantics can still be vague. The safe contract is therefore “show and mark ambiguous,” not automatic universal succession inference.
- The template is intentionally broad. Its applicability profiles, explicit `not applicable` rationale, proportionality rule, and post-use retirement mechanism are the controls against checklist accretion; post-use evidence is still needed to show those controls work.
- A public board can never hold private vulnerability mechanics safely. The method can enforce routing discipline, but repository/private-advisory access control remains external to OKF content.

## Final disposition

**APPROVE** `conventions/review@sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`
and `reviews/architecture-review-template-v1.1@sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`
for the independent portability QA gate. SR-1 through SR-3 are resolved without required enums,
required headings, runtime inventory/family authority, or title/path/timestamp inference.

[assigned task](../tasks/architecture-review-template-v1-1-security-review.md)

[reviewed convention](../conventions/review.md)

[reviewed template](../reviews/architecture-review-template-v1.1.md)

[governing plan](../plans/architecture-review-record-alignment.md)

[inventory evidence](../research/architecture-review-artifact-inventory.md)
