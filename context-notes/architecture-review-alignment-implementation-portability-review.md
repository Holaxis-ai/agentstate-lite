---
type: Context Note
title: Architecture-review alignment implementation portability review
actor: review-alignment-portability
timestamp: '2026-08-08T16:05:33.447Z'
---
# Summary

**APPROVE — the exact final Review Portfolio is portable, fail-closed, and meaningfully testable
within the declared POSIX recovery boundary.** It resolves P1–P4, both duplicate-source defects,
bridge/parser drift, strict result-count validation, and the retry/CLI recovery path without closing
the OKF vocabulary or assuming one CLI installation channel. No blocking portability or testability
finding remains.

Approved final-gate artifacts:

- blob `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`;
- `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.

Previously reviewed final-gate artifacts:

- blob `pages/reviews.html@sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9`;
- `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.

Previously re-reviewed repaired artifacts:

- blob `pages/reviews.html@sha256:2ceab5dfe2dfca39f22fb72175e9e760330aa1690db890b819d601436ca6035f`;
- `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.

The initial exact-byte findings and evidence remain below as review history.

The project ultimate goal is human-visible, conflict-safe, local-first shared memory. My proximate
goal was to verify that the implemented discovery surface remains a conservative projection of
live OKF records rather than a hidden registry or schema. This serves the ultimate goal by ensuring
that missing conventions, capped graph reads, and unfamiliar relation vocabularies cannot silently
change a review verdict.

Exact reviewed artifacts:

- `conventions/review@sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`;
- `reviews/architecture-review-template-v1.1@sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`;
- `reviews/architecture-review-template-v1.1-approval@sha256:ca2a3f93f8b7e6d4dbfa3dee010ead2b93d5fe51cfe9fb2307fcbe883a6ad22b`;
- `research/architecture-review-artifact-inventory@sha256:5aad2d2e466fe2fe51e96185aeafd57c6ddb3021164db05ceeb1a11d13050d28`;
- `reviews/architectural-smell-investigation@sha256:c463e099b9b8a2acbbb87f2457407bd1e680120c6124c9c74f23c6ec0c7dc529`;
- `reviews/mcp-view-security-model-unification-architecture-review@sha256:3d39dca062d7b71b7cabca273a3c9e3e48a382f93309e74545a81bca5ca8b5d3`;
- `reviews/architecture-domain-model-review@sha256:64e66aefdee778601836167b2a212dc05b4f6fcada6eb15fdcc5063bf43e3386`;
- `pages-registry/reviews@sha256:0a0387c9b667dd9e890ae282782c4692bfe2c166eb872daff0a38e138130bd4f`;
- blob `pages/reviews.html@sha256:2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4`
  (43,017 bytes).

# Initial blocking findings

## P1 — Capped open-request results can label an open request terminal

`makeRequestData` sets `lifecycleKnown:true` whenever the all-requests and `open:true` queries both
fulfill. It does not require either result to be complete. `renderRequests` then defines terminal as
every shown all-query row whose ID is absent from the returned open subset.

Empirical exact-source probe: an all result with two shown/two total and an open result with one
shown/two total produced `lifecycleKnown:true`; the second shown request would enter “Terminal per
bundle Kind rules” even though the fixture declares it open and it was omitted only by the open
query cap. The summary says the snapshot is partial, but the row-level classification is still
false.

Required repair: a row's absence from an incomplete open subset never proves terminal. Either page
the open query to completion, or put positively returned open rows in “Open” and every other shown
row in “Lifecycle unknown due to cap.” No terminal classification may occur until the relevant all
and open result sets are complete.

## P2 — Missing Review Request convention is mistaken for a known all-open lifecycle

The View registry says request openness derives from the bundle Kind registry, but the View never
queries or otherwise proves that a usable Review Request Kind exists. In a recipe-free scratch OKF
bundle, `list --type "Review Request" --open` returned every record and explicitly reported “no kind
declares terminal values — --open filtered nothing.” The View receives only two successful, equal
all/open result sets and classifies every row “Open per bundle Kind rules,” including a row with raw
`status: approved` and another with an unfamiliar status.

Required repair: prove usable terminal semantics before offering open/terminal groups, or remove
that classification and show raw request lifecycle values without inference. Missing, malformed,
duplicate, capped, or otherwise unverifiable Kind semantics must produce “Lifecycle unavailable,”
not “all open.” Do not reimplement a second closed lifecycle table in the View.

## P3 — Capped or count-unknown edge queries can produce a false effective verdict

`makeReviewData` treats the bidirectional Review graph as complete whenever both edge promises
fulfill. It ignores each response's `count`. An exact-source harness returned zero edges with
`count:1` in each direction; the View produced `partial:false`, `edgesKnown:true`. A complete-metadata
Review can then receive “Standalone effective conclusion” even though its successor was omitted.

Related problems:

- a fulfilled Review or edge result with no numeric count can be rendered “live · complete” even
  though the UI itself says total unknown;
- relation detail adds counts but appends its truncation/CLI-next-action message only when locally
  collected rows exceed `RELATION_LIMIT`, not when a bridge response reports more edges than it
  returned; and
- global graph `edgeTotal` is set to the deduplicated returned length, not an assurance that both
  directional result sets were exhaustive.

Required repair: compare returned row/edge length with each result's reported count before
classification. Unknown count or returned-less-than-total makes the dataset/graph incomplete and
suppresses every effective-conclusion claim. Relation detail must use the same rule and provide the
documented next action whenever the bridge, not only the local display slice, truncates results.

## P4 — A permitted custom succession mapping is ignored and can become false standalone currentness

The approved template permits another exact succession label when the successor/report explicitly
maps that label through ordinary OKF content. The View filters only
`edge.text === "succeeds review"`; it neither consumes a mapping nor fails closed when an
unclassified Review-to-Review relation may affect currentness.

Empirical exact-source probe: two complete, off-prefix Reviews used an unknown metadata field that
mapped `replaces assessment` to succession plus an edge with that label. The selected successor was
reported “Standalone effective conclusion” rather than classified through the mapping or marked
incomplete. This is a method/implementation mismatch and makes the default label a hidden closed
vocabulary.

Required repair: either consume a bounded machine-readable relationship profile from ordinary OKF
content, or conservatively suppress currentness when an unclassified Review-to-Review edge touches
the record/chain and could be a mapped succession relation. Unknown relations remain visible; fail
closed does not mean infer them as succession. Path, title, family, role, status, timestamp, and
direction remain non-authoritative.

# Minor source-quality findings

- `cardButton` appends the same Kind label twice, creating duplicate visible chrome.
- `loadRelated` appends the same loading notice twice before immediately clearing/replacing it.

These do not create authority or portability failures, but removing them with the blocking repair
reduces avoidable duplicated behavior in the single View source.

# Survived attacks

- **No corpus registry:** static search found no project review IDs, package/family names, migration
  inventory ID, corpus cardinalities, or title-stem classifiers in the View bytes.
- **Inventory independence:** runtime code queries only live `Review Request`, `Review`, and graph
  data; inventory is explanatory text only. Deleting the Research inventory does not configure
  portfolio classification.
- **Sparse and off-prefix Reviews:** the type query has no prefix filter. Missing role/status/verdict
  values remain visible and lead to explicit “not declared”/incomplete states.
- **Unknown fields and values:** unknown roles enter “Other / undeclared role”; raw unknown
  frontmatter is listed under “Other metadata” through `textContent`, not dropped or interpreted.
- **Arbitrary relations:** exact free-text labels and both directions are displayed. Relations do
  not acquire approval/currentness merely from family, timestamps, or metadata.
- **Default succession faults:** exact `succeeds review` multiple predecessors/successors,
  cycles/self-edges, missing endpoints, and mismatched target/evidence applicability produce
  ambiguous/incomplete rather than a winner. An exact-source cycle probe returned “Succession graph
  ambiguous.”
- **Partial promise rejection:** failure of one directional graph query sets `edgesKnown:false` and
  suppresses effective conclusions; last-good snapshots are labeled stale/partial.
- **Host contract:** registry identity, `entry`, and `bundle-read` access stayed unchanged. Bodies
  use the shared `render-document` result; metadata and bridge errors use text nodes/textContent.
- **Wrappers:** all three are thin deterministic projections with exact source precedence and
  explicit incomplete-on-conflict rules. They introduce no generic runtime rule, closed vocabulary,
  or inventory dependency.

# Executable QA oracles after repair

QA should not rely on source-string presence. Load the exact HTML bytes in an iframe whose parent
implements the documented read-only bridge, then drive deterministic response fixtures; separately
run the exact registered View through the real shell over a scratch bundle.

Minimum red/green matrix:

| Fixture | Required observable result |
| --- | --- |
| Recipe-free bundle with Review Requests but no applicable Kind | raw requests visible; lifecycle explicitly unavailable; no open/terminal claim |
| Complete all query + capped open query | positively returned open rows may be open; all other shown rows unknown, never terminal |
| Review query count greater than returned rows | portfolio incomplete; every effective-conclusion assessment suppressed |
| Either edge direction count greater than returned edges, or count absent | graph incomplete; no standalone/effective/ historical currentness claim |
| One directional query rejects after a last-good snapshot | returned/last-good rows remain visible as partial/stale; currentness suppressed |
| Sparse Review outside `reviews/` with unfamiliar role/status/verdict/target/field | visible in Other role; raw metadata preserved; assessment incomplete, no inferred family |
| Duplicate/free-text/support/approval links | every returned relation visible with exact label/direction; no target-verdict authority |
| Explicit default succession with matching applicability | unique root/terminus recognized |
| Custom mapped succession relation | recognized through declared profile or explicitly unclassified/incomplete; never asserted standalone merely because label differs |
| Multiple predecessors/successors, cycle, self-edge | ambiguous |
| Dangling classified successor endpoint or mismatched applicability | incomplete |
| Inventory present vs deleted | identical Review/Request rows, grouping, and verdict/navigation; generic whole-bundle inventory visibility may change |
| More detail relations than bridge/display cap | shown/total or total-unknown, truncation/incomplete marker, and exact next action |
| HTML-like unknown metadata | rendered as text, never markup/script |
| Live add/update/delete | next serialized refresh reflects the mutation; no stale selection or old verdict survives as current |

At least P1 and P3 must be probed red against the current `2d022320…` bytes before testing repaired
bytes. Record the exact blob version, bridge fixture, shown/total values, screenshot or DOM oracle,
and browser/host mode. The QA Task's prose is directionally complete, but these response-level
oracles are required to prevent a green happy-path browser check from missing the false-classification
branches above.

# Evidence boundary

The bounded Node harness extracted the exact second IIFE from blob `2d022320…`, disabled only startup
side effects, and invoked its actual `makeRequestData`, `makeReviewData`, and
`successionAssessment` functions. It did not substitute rewritten classification logic. A separate
scratch CLI probe established the conventions-free `--open` behavior. Browser layout, focus,
official-shell approval, and rendered-document containment remain for QA after blockers are fixed.

# Repaired exact-byte re-review

The transformed-source harness was rerun against blob `2ceab5df…` using the same response fixtures.

Resolved:

- **P1:** a capped open-filter response sets `openMembershipComplete:false` and `partial:true`;
  omitted shown rows enter “Open-filter membership unknown,” not terminal.
- **P2:** the UI and registry now describe open-filter **transport membership**, explicitly state
  that a missing Kind can make it a no-op, and make no open/terminal lifecycle claim.
- **P3 overview/currentness:** missing numeric counts or returned-less-than-count Review/edge results
  set the dataset partial and `edgesKnown:false`; effective-conclusion claims are suppressed.
- **P4:** a non-default relation between same-line Reviews yields “Same-line relation is
  unclassified” / ambiguous. Disconnected same-line Reviews also fail closed. Default cycles remain
  ambiguous.
- **Duplicates:** the duplicate Kind label and duplicate related-record loading notice are gone.

Remaining blocker:

- **P3 relation-detail actionability:** with outbound `{edges:[one], count:2}` and complete empty
  inbound results, the exact View renders `Outbound relations returned 1 of 2 edges; the response is
  partial or capped.` and `1 shown · 1 returned · 2 total`. It provides no next action. The
  “use the CLI graph query” guidance is appended only when locally collected rows exceed
  `RELATION_LIMIT`, so bridge-side truncation at or below that local slice misses it. In this case
  the overview can remain complete because its larger graph query was exhaustive; no summary retry
  compensates.

Required final repair: whenever either detail-direction result rejects, lacks a numeric count, or
returns fewer edges than its count, render an exact retry/CLI next action alongside the partial
state. Keep the accurate shown/returned/total disclosure already present.

# Final exact-byte portability/testability gate

The unchanged transformed-source harness was rerun against final blob `a198909c…` with the prior
red/green fixtures plus all four relation-detail completeness branches.

Resolved and regression-checked:

- outbound one-returned/two-total, missing numeric count, and rejected-direction fixtures each show
  the precise partial/unavailable notice, a `Retry relations` action, and a CLI recovery action;
- complete outbound zero/count-zero and one/count-one fixtures retain accurate counts and do not show
  a false recovery prompt;
- capped open-filter membership remains partial without a terminal inference;
- capped or count-unknown Review/edge responses still suppress currentness;
- an unclassified same-line relation and an explicit succession cycle remain ambiguous;
- the prior duplicate Kind chip and duplicate loading notice remain absent.

## Remaining blocker — the recovery command crosses the shell boundary unsafely

The new command is constructed as `aslite link show ` + `selectedId` + ` --limit 0`, with neither
shell quoting nor an option terminator. That is not portable across the concept IDs admitted by the
core OKF boundary. In an isolated, recipe-free real-CLI fixture:

- both `weird/id` and the distinct valid ID `weird/id with space` were created successfully;
- the displayed unquoted form for `weird/id with space` exited 0 but silently returned `weird/id`,
  because later words became ignored extra positionals;
- a valid leading-option ID such as `--review` is parsed as an option without `--`, while `-h`
  invokes help rather than reading the record;
- the parser-safe argument form, with all options before `--` and the ID kept as one quoted shell
  word, returned the intended records.

Required repair: render a POSIX-shell-safe representation of the selected ID, including embedded
single-quote escaping, and place it after the option terminator. The resulting command shape must
be `aslite link show --limit 0 -- '<shell-escaped-id>'`. Add exact-source fixtures for a space-bearing
ID, a leading-option ID, and an ID containing a literal single quote. The test must execute the
rendered command through the supported shell and assert that the returned `id` equals the selected
ID; source-string presence alone is insufficient.

Confidence: **high**. The verdict is based on the exact final View bytes, unchanged registry bytes,
the actual View functions under deterministic bridge fixtures, and real CLI parsing against valid
concept IDs in an isolated bundle. Browser layout and host-shell approval remain QA concerns, but
neither affects this command-tokenization failure.

# Final Generator–Critic approval gate

The final proximate goal was to verify that the last repair corrected the representation boundary
without weakening open-world OKF identity, bridge compatibility, completeness honesty, or the
previous P1–P4 fixes. This serves the project's human-visible, conflict-safe, local-first goal by
ensuring that the View's action guidance and automatic conclusions stay faithful to the bundle and
to the shipped host contract.

Reviewed immutable bytes:

- `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`
  (50,182 bytes; independently hashed to the same digest);
- unchanged `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.

Verdict: **APPROVE**, confidence **high**.

## Executed evidence

- The transformed-source harness invoked the exact View's `resultShape`, `makeRequestData`,
  `makeReviewData`, `successionAssessment`, `renderRelations`, selection reconciliation, and pure
  recovery-command helpers. It disabled only startup side effects and did not substitute rewritten
  classification or command logic.
- Every exact View edge request contained only the shipped `from` or `to` selector; none sent the
  unsupported query-only `limit` field. The real `parseBridgeRequest` accepted those captured shapes
  and rejected the formerly used edge `limit`. A real `BridgeService` over the core memory backend
  preserved request/reply IDs and returned one array whose finite count exactly matched its length in
  both directions.
- Strict count fixtures admitted only arrays paired with finite, nonnegative safe integers. Exact
  zero/zero and one/one results were complete. Returned-less-than-count, returned-greater-than-count,
  absent, fractional, infinite, negative, unsafe-integer, and non-array results all failed closed.
  The legitimate one-returned/two-total case retained the accurate `1 shown · 1 returned · 2 total`
  disclosure and recovery action; contradictory totals became unknown rather than authoritative.
- Detail fixtures covered rejection, invalid or absent count, bridge truncation, contradictory count,
  malformed collection, complete empty, complete nonempty, and local display truncation. Recovery
  appeared only where evidence or display was incomplete; 101 complete relations displayed
  `100 shown · 101 returned · 101 total` plus local-truncation guidance.
- The exact generated subcommand was executed through `/bin/sh` with the repository's real CLI over
  an isolated recipe-free bundle. Space-bearing, leading-option, help-like, and literal-single-quote
  IDs each exited 0 and returned the exact selected ID. The View now emits only the invocation-neutral
  subcommand `link show --limit 0 -- '<shell-escaped-id>'` and explicitly tells the operator to prepend
  the installed AgentState CLI invocation.
- The exact embedded watcher completed its subscribe-before-snapshot run, a manual retry, a failed
  manual retry followed by a successful retry, and a deletion change event without poisoning later
  refreshes. Last-good Request and Review snapshots remained visible as stale/partial on rejection;
  deletion of the selected row moved selection deterministically and emitted the explanatory notice.
- P1 capped open-filter membership, P2 conventions-free transport semantics, P3 capped/unknown graph
  currentness suppression, P4 unknown same-line relation handling, explicit succession cycles,
  bidirectional edge deduplication, sparse/off-prefix visibility, and arbitrary relation display all
  remained green. The Kind chip and linked-record loading notice each occur once in the exact source.

## Testability and residual boundary

The safety-critical decisions are small pure helpers over bridge result data, while I/O remains
behind the injected `Bridge` surface. That separation made meaningful malformed-result, stale-state,
selection, command-tokenization, and host-contract tests possible without a parallel schema or
inventory. Exact-byte approval and the immutable digest remain the regression boundary for this
bundle-authored View.

The displayed recovery is deliberately a POSIX-shell subcommand, not an executable invocation and
not a Windows PowerShell transcript. The operator must prepend the invocation appropriate to the
installed distribution, exactly as the View states. The View renders the command through text
content and never executes it. Browser layout, focus, and trusted-shell approval presentation were
not re-probed in this portability gate; they remain separate host/UI assurance concerns and do not
undermine the exercised parser, service, count, or POSIX boundaries.

[governed by plan](../plans/architecture-review-record-alignment.md)

[reviewed registry](../pages-registry/reviews.md)

[independent review task](../tasks/architecture-review-alignment-independent-review.md)
