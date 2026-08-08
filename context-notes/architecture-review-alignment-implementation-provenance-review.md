---
type: Context Note
title: Architecture-review alignment implementation provenance review
actor: review-alignment-provenance
timestamp: '2026-08-08T16:02:19.934Z'
---
# Summary

**CHANGES_REQUIRED for the integrated implementation.** The exact convention, template, three migration wrappers, frozen-byte preservation, cardinality, disclosure handling, and zero-new-remediation invariant are independently sound. The exact Review Portfolio View is not yet safe to approve: incomplete request/edge results and ambiguous Review graphs can be rendered as authoritative lifecycle or effective-verdict conclusions. The wrappers remain valid and useful independently of the View.

This review is disclosure-safe. It records artifact identity, public outcome categories, and projection behavior only; it does not reproduce private-lane security detail.

## Exact implemented set

| Artifact | Exact version |
| --- | --- |
| `plans/architecture-review-record-alignment` | `sha256:b6ccec33c9daee7182a188916e6a898fdd83618372b0e1da83a59e896b6fc534` |
| `reviews/architecture-review-record-alignment-plan-review` | `sha256:b83fe1083094191af30b57fe16c80151d66d05752c61ecbd5ee8d47ff7ba02d2` |
| `research/architecture-review-artifact-inventory` | `sha256:5aad2d2e466fe2fe51e96185aeafd57c6ddb3021164db05ceeb1a11d13050d28` |
| `conventions/review` | `sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5` |
| `reviews/architecture-review-template-v1.1` | `sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5` |
| `reviews/architecture-review-template-v1.1-approval` | `sha256:ca2a3f93f8b7e6d4dbfa3dee010ead2b93d5fe51cfe9fb2307fcbe883a6ad22b` |
| `reviews/architectural-smell-investigation` | `sha256:c463e099b9b8a2acbbb87f2457407bd1e680120c6124c9c74f23c6ec0c7dc529` |
| `reviews/mcp-view-security-model-unification-architecture-review` | `sha256:3d39dca062d7b71b7cabca273a3c9e3e48a382f93309e74545a81bca5ca8b5d3` |
| `reviews/architecture-domain-model-review` | `sha256:64e66aefdee778601836167b2a212dc05b4f6fcada6eb15fdcc5063bf43e3386` |
| `pages-registry/reviews` | `sha256:0a0387c9b667dd9e890ae282782c4692bfe2c166eb872daff0a38e138130bd4f` |
| `pages/reviews.html` | `sha256:2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4` |

## Blocking View findings

### V1 — Capped/open request results can be mislabeled terminal

The View sets `lifecycleKnown: true` whenever the complete and `open:true` request queries both fulfill. It checks row/count truncation only later for the portfolio-level warning, but still groups every all-query row absent from the returned open-query slice as “Terminal per bundle Kind rules.” If the open slice is capped, a genuinely open row beyond the cap is mislabeled terminal even while the top summary says partial.

The no-convention case also overstates the evidence. Core's open filter retains every row whose type has no governing Kind. The View therefore labels all Review Requests “open per bundle Kind rules” when no Review Request lifecycle convention exists, even though the result proves only that none was classified terminal by a loaded Kind.

Required repair:

- compute request lifecycle only from complete all/open result sets; if either `count` exceeds returned rows, total is unknown, or either query is stale/partial, set lifecycle classification unavailable and do not create a terminal group;
- describe the open-filter result as “not declared terminal” unless the View has positive evidence that a governing Review Request Kind with terminal semantics was loaded; or add a bounded, fail-closed way to establish that convention and its terminal rule;
- keep every returned row visible and retain the partial/cap next action.

### V2 — Edge response completeness is ignored before asserting currentness

For the bidirectional Review graph, successful edge calls set `edgesKnown: true` and `partial: false` without comparing each response's `count` to the returned `edges.length`. A capped-but-successful response can omit the only successor and still drive “Standalone effective conclusion.” The current host returns all edges up to its hard maximum and fails beyond it, so the live bundle is not presently truncated; the exact View nevertheless violates its own portable cap/partial oracle and fails a valid bounded-response simulation.

Required repair: retain per-direction returned/total counts, detect any mismatch or unknown total, and suppress every completeness/effective-verdict assertion unless both directions are demonstrably complete. Detail relations need the same count-vs-returned check. A fulfilled transport is not proof of a complete graph.

### V3 — Disconnected duplicate roots and unclassified Review relations fail open

`successionAssessment` examines only the connected component formed by exact `succeeds review` edges. With no such edge, any record carrying target/version/cutoff/subject/verdict is called a standalone effective conclusion. Two disconnected Reviews with the same exact target/evidence/subject—even with conflicting verdicts—are each declared effective. Likewise, a direct Review-to-Review relation with an unknown or custom label remains visible but does not suppress the standalone claim. The algorithm has inferred that missing/unclassified succession means no succession, contrary to the template's fail-closed rule.

Required repair:

- before asserting standalone or unique-terminus currentness, search the complete Review dataset for every record declaring the same exact target/evidence/subject line, including nodes outside the classified component;
- more than one disconnected candidate, conflicting line metadata, or a potentially relevant unclassified Review-to-Review relation must suppress currentness as unknown/ambiguous;
- explicitly recognized non-succession labels may remain navigational, but unknown/custom labels cannot be treated as proof of independence merely because the View did not classify them;
- retain raw relations and verdicts; reject only the derived currentness claim.

These three failures affect the View's central authority claim, so warning text elsewhere does not contain them.

## Provenance/process finding

### P1 — Template approval does not freeze a distinct independent-QA evidence identity

The template approval precisely names the candidate, companion convention, and predecessor and links all three specialist re-reviews. It does not name exact reviewer-note versions or a distinct independent-QA artifact. Template v1.1's own method gate separates specialist/testing review from independent QA and says the approval Review names QA evidence. The only dedicated alignment QA Task remains pending. The testing reviewer did execute valuable disposable-bundle portability probes, so this is a provenance/stage-separation gap, not an absence of testing.

Do not rewrite the frozen approval. After repaired View and independent QA succeed, issue an immutable approval addendum or re-review that names the exact QA record, exact reviewer evidence versions, convention/template versions, and the scope of approval. Until then, interpret `ca2a3f93…` as method/specialist approval rather than proof that the full self-declared QA gate has closed.

## Wrapper and migration audit — approved independently

### Cardinality and census

- The inventory baseline contains 15 `type: Review` records; the live bundle contains 19.
- The exact set difference is only the three authorized wrappers plus the template v1.1 approval. No baseline Review is missing.
- All 77 inventory-cited frozen Review/Finding/Context Note hashes matched current raw bundle bytes. This includes the v1.0 template, CLI report/approval/addendum, legacy Design Review, Mike Findings, and the inventoried Context Note candidates.
- The five Finding records remain exactly five. Alignment created no Finding.
- The hard census collections—every Review anywhere, every record under `reviews/`, every Review Request, and every Finding—are reproducible by typed/prefix queries. The Context Note universe remains a declared signal-based census plus a five-part content/graph test, not a mathematical proof that arbitrary prose contains no overlooked review. A broader verdict/design signal scan was sampled; sampled extras were later method evidence, implementation/plan gates, diagnoses, or evidence already governed by a Review. This is an honest residual completeness limit, not evidence of a fourth authorized wrapper.

### Mike family

- The wrapper links the synthesis plus all four atomic Findings, the handoff, deprecated Claim, and exactly two `produces task` edges.
- Those remediation identities are only `tasks/registered-view-launch-authority-consolidation` and `tasks/core-import-direction-gate`. Both pre-existed alignment and remain mutable Task authorities. One Task head advanced after wrapper publication, which the wrapper correctly labels as an observed mutable head rather than immutable current truth.
- The wrapper's `changes_recommended` verdict is a declared categorical projection of the frozen synthesis; source bytes prevail. The observation and closed-as-work dispositions create no task.

### MCP legacy family

- The wrapper is navigation/provenance only, names the frozen legacy source and exact historical target, maps the source's mandatory-change outcome to `changes_required`, and makes the source prevail on disagreement.
- It does not copy the source's substantive security detail. Disclosure preflight therefore survives.

### Domain-model chronology family

- The wrapper preserves two evidence strata: the earlier exact technical `changes_requested` outcome and the later named-human Review Request's `approved` frontmatter outcome.
- Its top-level verdict subject is explicitly the later human workflow outcome, not an assertion that the migration actor approved the architecture. The later request's exact observed head is named, and the missing exact later source commit is disclosed rather than invented.
- The wrapper preserves source precedence and becomes incomplete rather than choosing if strata cease to be distinguishable. No duplicate decision authority was created.

### CLI positive control

The canonical CLI report, exact report approval, and PR #224 reconciliation addendum retain their inventory hashes and graph. No redundant CLI wrapper was created.

## View security and portability survived attacks

These properties of the exact View passed and should be preserved during repair:

- Registry id and entry remain unchanged; access is read-only `bundle-read`; `view list` reports the registration valid and entry available.
- The HTML contains no migration-inventory lookup or project/package/family hardcoding. A targeted search found none of the project-specific identifiers used by this migration.
- Unknown metadata is rendered with `textContent`/text nodes. The only `innerHTML` sink consumes the shell's shared bounded `render-document` result, preserving the repository's one renderer/security authority.
- There is no View-side mutation, fetch/network API, storage, dynamic evaluation, or credential logic. The script parses successfully.
- Review Requests and Reviews are separate live queries; unfamiliar roles/fields/relations stay visible; caps and failures already have visible warning scaffolding even though V1–V3 require the derived claims to fail closed sooner.

## Bundle health delta

Current health is `malformed: 0`, `kind_warnings: 9`, `unresolved_links: 6`, `registry_warnings: 0`, `link_type_violations: 18`, `missing_expected_links: 35`, `dangling_view_entries: 0`, and `invalid_view_registrations: 0`. Those issue counts match the pre-wrapper/method builder baseline; the implementation introduced no new conformance, unresolved-link, or relationship debt. Orphan/stale totals vary with new linking and elapsed time and are not treated as regressions.

## Verdict and next gate

The exact wrapper documents, convention, template, inventory, and frozen-history migration receive **APPROVE** within this review's architecture/provenance scope. The exact View registry/blob and the integrated infrastructure receive **CHANGES_REQUIRED** because V1–V3 can assert false lifecycle/currentness conclusions. Repair the View without changing wrapper/frozen artifacts, cross-review the new exact registry/blob versions, then run independent adversarial browser/portability QA. Close P1 with an immutable exact-evidence approval addendum or re-review after QA.

[governing plan](../plans/architecture-review-record-alignment.md)

[plan approval](../reviews/architecture-review-record-alignment-plan-review.md)

[migration inventory](../research/architecture-review-artifact-inventory.md)

[Review convention](../conventions/review.md)

[template v1.1](../reviews/architecture-review-template-v1.1.md)

[template v1.1 approval](../reviews/architecture-review-template-v1.1-approval.md)

[Mike wrapper](../reviews/architectural-smell-investigation.md)

[MCP wrapper](../reviews/mcp-view-security-model-unification-architecture-review.md)

[domain-model wrapper](../reviews/architecture-domain-model-review.md)

[Review Portfolio registry](../pages-registry/reviews.md)

[assigned independent-review task](../tasks/architecture-review-alignment-independent-review.md)

# Final repaired-View integrated re-review

## Verdict

**CHANGES_REQUIRED — high confidence.** The exact repaired registry
`pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`
and View blob
`pages/reviews.html@sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9`
resolve the previously recorded open-filter, capped-result, disconnected-same-line, unclassified-
relation, stale-liveness, selection-removal, and relation-detail recovery defects in the isolated
source harnesses. The final View nevertheless breaks the shipped v0 bridge contract in the real
host and still fails open on inconsistent counts. Both defects are exact, reproducible blockers for
the View and therefore for the integrated infrastructure. They do not invalidate the independently
approved convention, template, inventory, wrappers, or frozen-history migration.

## F1 — the final View sends an unsupported `limit` parameter on v0 edge requests

**Empirical plus exact-source basis; blocking; high confidence.** Both the portfolio graph query and
selected-record relation query now call `Bridge.edges` with `limit` inside `params`. The shipped v0
bridge permits only `from`, `to`, and `text` for an edge request. `normalizeEdgeParams` in
`packages/view-runtime/src/bridge.ts` rejects any other key, and the shipped authoring contract
likewise documents no edge `limit`.

An empirical probe against the built runtime returned a parsed request for
`{from:["reviews/a"]}` and `null` for the same request plus `limit:500`. `BridgeService` answers an
invalid request with an id-less `USAGE` error. The embedded View client correlates replies by id, so
that reply cannot settle the pending Promise. The initial snapshot therefore waits indefinitely in
`makeReviewData`; detail relation requests have the same contract break. The isolated View harnesses
missed this because their fake `Bridge.edges` accepted arbitrary objects and bypassed
`parseBridgeRequest`/`BridgeService`.

Required repair: remove `limit` from v0 edge calls. The shared bridge already owns the edge safety
bound and fails the request when it is exceeded. If a future design needs client-specified edge
limits or pagination, evolve and agreement-test the shared bridge parser, runtime, authoring
contract, and both hosts as a separate explicit protocol change. Add one host-contract test that
runs the View-emitted edge shapes through the real parser/service rather than only a permissive
fake.

## F2 — underreported or invalid counts are accepted as complete

**Empirically reproduced against the exact View implementation; blocking; high confidence.**
`resultComplete` uses `returned.length >= count`, while `completenessProblem` and relation-detail
logic report only `returned.length < count`. A response with two rows and `count:1`, or one edge and
`count:0`, is therefore treated as internally complete. The exact-source probe produced
`rowsComplete:true`, `edgesKnown:true`, `partial:false`, no problem, and an effective-terminus
assessment from those inconsistent responses. Relation detail likewise lacks its required
complete-evidence recovery action for an underreported count.

This contradicts the earlier VSR-2 repair requirement and the approved method's fail-closed rule:
an inconsistent response cannot establish that the visible universe is exhaustive. Required
repair: accept completeness only when `count` is a finite nonnegative integer and returned length
equals it. Missing, negative, fractional, non-finite, overreported, or underreported counts must
produce an explicit inconsistent/unknown-completeness problem, suppress currentness, and show the
retry/CLI next action in relation detail.

## F3 — the generated CLI recovery command is not portable or safely argument-encoded

**Exact contract basis; blocking for the degraded-state recovery oracle; high confidence.** The
View prints `aslite link show <selectedId> --limit 0` as an exact fallback. The skill-bundled CLI is
explicitly not guaranteed to be on `PATH`; its supported invocation is a resolved absolute shim.
A source checkout uses `./aslite`, while another installed channel may expose `aslite` or
`agentstate-lite`. A generic bundle View cannot know which executable prefix launched the host, so
the printed bare prefix is not a portable action. In addition, OKF concept-id validation prevents
path escape but does not restrict spaces or shell metacharacters; interpolating the raw id into a
copyable shell command without argument quoting can make the guidance fail or execute unintended
shell syntax when copied.

The Retry button is useful but does not replace the CLI fallback when the bridge repeatedly refuses
or bounds the graph. Required repair: do not claim one guessed executable prefix is exact. Tell the
operator to use the same agentstate-lite CLI invocation that launched/serves the bundle, present the
argument suffix separately, and encode or avoid presenting the dynamic id as executable shell text.
The recovery oracle should exercise a supported skill-bundle invocation and an id containing
spaces/shell-significant characters without executing unintended syntax.

## Revalidated provenance and flexibility gates

- All 77 inventory-cited frozen Review/Finding/Context Note hashes still match exact raw bundle
  bytes. The baseline contains 15 Reviews and the live bundle 19; the only additions remain the
  three authorized wrappers plus the v1.1 template approval. No baseline Review is missing and the
  Finding count remains exactly five.
- The Mike wrapper remains a thin projection over the synthesis and four atomic Findings, handoff,
  deprecated Claim, and exactly two pre-existing mutable remediation Tasks. The MCP wrapper remains
  disclosure-safe and source-prevailing. The domain wrapper still separates the earlier technical
  `changes_requested` stratum from the later named-human `approved` Review Request head without
  inventing a source commit.
- The canonical CLI report, exact report approval, and PR #224 reconciliation addendum still match
  their frozen hashes and retain their graph. No redundant CLI wrapper or remediation work was
  introduced.
- `conventions/review` still requires only `title`, declares optional open-valued metadata, treats
  `reviews/` as a preferred creation path rather than a validity boundary, and leaves relationship
  topology to ordinary OKF links and versioned methods. Template v1.1 keeps unknown fields,
  relation labels, sparse/off-prefix Reviews, and alternative project methods open-world.
- The migration inventory remains audit evidence only. Static search of the final View found no
  inventory id, project-specific Review ids, package/family table, or path/title/timestamp identity
  inference. Runtime discovery remains live type queries plus graph edges.
- The registry remains the one evolved identity with `bundle-read`; there is no second or hidden
  registry. Unknown metadata still uses text nodes. The sole HTML sink remains the unmodified
  shared bounded `render-document` result. No mutation, storage, network fetch, credential, or
  dynamic-evaluation authority was added, and the script parses.
- Current health remains `malformed:0`, `kind_warnings:9`, `unresolved_links:6`,
  `registry_warnings:0`, `link_type_violations:18`, `missing_expected_links:35`,
  `dangling_view_entries:0`, and `invalid_view_registrations:0`; the Review View registration is
  valid and its entry available.

The duplicated local declaration of `top`/`badges` in `cardButton` is harmless but should be removed
with the bounded repair as a small source-quality cleanup. Independent real-shell/browser QA and
the immutable exact-evidence approval addendum remain correctly downstream; their absence is not a
blocker in this pre-QA gate.

## Evidence commands and residual limits

Evidence included exact `doc read --out`/`pull` plus SHA-256 checks; the 77-hash verifier; Review and
Finding cardinality/set-difference scripts; `link show --limit 0` for the wrappers and CLI family;
`status`; `view list`; static capability/source inspection; the prior red/green and relation-detail
harnesses; exact-source inconsistent-count injection; and a built-runtime `parseBridgeRequest`
positive/negative probe. Full browser layout, exact-byte trust reapproval, live mutation/deletion,
and cross-host behavior remain for QA after F1 and F2 are repaired. The signal-based Context Note
census remains a reasoned, sampled completeness claim rather than proof over arbitrary prose.

# Final generator–critic cycle

## Verdict

**APPROVE — high confidence** for the independent architecture/provenance gate over
`pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`
and unchanged registry
`pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.
The exact repair closes F1–F3 at their owning representation/contract boundaries without narrowing
OKF identity, adding a project schema, expanding the bridge protocol, or assuming one installation
channel. No blocking finding remains in this review's scope.

## Exact repair assessment

- **Real v0 grammar and correlation:** every overview/detail edge request now contains only
  `from`, `to`, or `text`; no client-only `limit` enters the edge grammar. A strict fake rejected
  undeclared keys, and the four shapes actually emitted by the View were each accepted by the built
  `parseBridgeRequest` and executed through `BridgeService` with the original request id preserved
  in an `edges:result` reply. The prior id-less rejection/pending-Promise hang is removed without a
  protocol fork.
- **Strict count authority:** one pure `resultShape`/`validCount` path now governs Review,
  Review Request, overview-edge, and detail-edge evidence. Completeness requires an array plus a
  finite nonnegative safe-integer count exactly equal to its length. Overreported counts remain
  honest cap totals; underreported counts discard the claimed total as contradictory. Missing,
  negative, fractional, infinite, unsafe, non-array, overreported, and underreported fixtures all
  remain partial, suppress graph/currentness authority, and render recovery guidance where
  applicable. The exact prior undercount probe now yields `rowsComplete:false`,
  `edgesKnown:false`, `partial:true`, and `Effective conclusion not asserted`.
- **Opaque ID and installation boundary:** the displayed recovery value is now only the subcommand
  `link show --limit 0 -- '<quoted-id>'`; prose tells the operator to prepend the installed
  AgentState CLI invocation. It assumes neither `aslite`, `agentstate-lite`, `./aslite`, an npm
  prefix, nor the skill's resolved absolute shim. The option terminator precedes the ID, and the
  single pure POSIX quoting helper round-tripped spaces, option-like prefixes, embedded single
  quotes, command-substitution text, glob characters, semicolons, and newlines as one inert
  argument. The actual CLI accepted the option order and treated `--leading-option` as an ID.
  Dynamic IDs and all other metadata still enter the DOM as text, never executable markup.
- **Proportionality:** the repair is localized to View projection helpers and calls. It does not
  restrict the permissive Concept ID grammar, add an edge-limit dialect, move interpretation into
  the Review Kind, or create another command/executable discovery authority. The remaining exact
  `succeeds review` currentness rule belongs to architecture-review template v1.1; unfamiliar
  relations stay visible and fail closed rather than becoming a global closed enum.

## Revalidated integrated evidence

- All 77 inventory-cited frozen Review/Finding/Context Note byte hashes still match. The Review
  baseline remains 15 and the live set 19, with the exact difference limited to the three authorized
  wrappers plus the v1.1 approval; no baseline Review is missing. Finding cardinality remains five.
- The Mike wrapper still links the synthesis, all four atomic Findings, handoff, deprecated Claim,
  and exactly the two pre-existing mutable remediation Tasks. The MCP wrapper remains a thin,
  disclosure-safe, source-prevailing projection. The domain wrapper still distinguishes the earlier
  technical `changes_requested` evidence from the later named-human `approved` Review Request head
  without inventing a source commit.
- The CLI synthesis, exact report approval, and PR #224 reconciliation addendum retain their frozen
  hashes and graph. No redundant CLI wrapper, Finding, remediation Task, or alternate decision root
  was added.
- The Review convention still requires only `title`, uses open-valued optional fields, treats
  `reviews/` as a creation preference rather than a validity boundary, and leaves topology to
  ordinary OKF links/versioned methods. Template v1.1 preserves sparse/off-prefix Reviews, unknown
  fields and labels, unfamiliar target types, alternate project methods, inventory non-authority,
  and fail-closed currentness.
- Static inspection still finds no migration-inventory lookup, project-specific Review IDs,
  family/package table, or title/path/timestamp identity inference. The inventory is audit evidence,
  not runtime configuration. The existing registry remains the sole registration with
  `bundle-read`; no hidden registry or schema was introduced.
- The capability/DOM boundary remains unchanged: no mutation, fetch/network, storage, credential,
  navigation, or dynamic-evaluation authority; unknown values use text nodes; the sole HTML sink is
  the unmodified shared bounded `render-document` result. The exact script parses.
- Bundle health remains `malformed:0`, `kind_warnings:9`, `unresolved_links:6`,
  `registry_warnings:0`, `link_type_violations:18`, `missing_expected_links:35`,
  `dangling_view_entries:0`, and `invalid_view_registrations:0`. The registry is valid and its entry
  available. Orphan/stale totals changed only with new review context and elapsed time.

## Evidence and residual boundaries

Evidence comprised exact bundle pull/read plus SHA-256 checks; the frozen-hash and cardinality
scripts; exact wrapper/CLI link inspection; status and View registration; static capability and
hidden-authority searches; prior transformed-source red/green/currentness/relation fixtures; the
new structural harness; a real built-runtime parser/service probe; exact undercount reinjection;
POSIX one-argument shell round-trips; and an actual CLI option-terminator probe.

Independent browser/adversarial QA remains the required next gate for exact-byte trust reapproval,
official-shell rendering, live add/update/delete and selection behavior, keyboard/narrow-layout
behavior, and web/MCP host exercise. The recovery subcommand is intentionally POSIX-shell encoded;
a non-POSIX operator must translate the shown single ID argument using that shell's native quoting.
The Context Note census remains a declared signal-based, sampled completeness claim rather than a
proof over arbitrary prose. Finally, the earlier template-approval provenance gap remains scheduled
for an immutable exact-evidence approval addendum after QA; it is not a pre-QA blocker and no frozen
approval was rewritten.
