---
type: Context Note
title: Architecture-review alignment View source and security review
actor: review-alignment-security
timestamp: '2026-08-08T16:03:28.523Z'
---
# Summary

**Final allowed-cycle verdict: CHANGES_REQUIRED (high confidence).** The exact View now fixes the
unsupported edge field, strict count/array agreement, executable-prefix portability, and shell
quoting defects. Its read-only source and retry boundaries remain sound. One reachable scale case,
however, still emits an invalid v0 request: the View places every returned Review id into one edge
selector array, while the shipped host accepts at most 32 selector values. A 33–500 Review
portfolio therefore recreates the uncorrelated-error/permanently-pending refresh failure. A second
shared-contract defect trims leading or trailing whitespace from otherwise valid opaque OKF ids,
which can make an incomplete Review graph look complete. These are public method/source findings;
no private disclosure detail was found.

**Ultimate goal:** keep agentstate-lite human-visible, conflict-safe, local-first shared memory in
which durable conclusions remain findable and evidence-bound.

**Proximate goal:** ensure the Review portfolio never turns incomplete graph/query evidence into a
currentness or liveness claim; this serves the ultimate goal by making the View a safe projection
rather than a second decision authority.

## Final allowed Generator–Critic cycle

- View blob `pages/reviews.html` at
  `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`
  (`50,182` bytes).
- Unchanged registry `pages-registry/reviews` at
  `sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.
- Decision: **CHANGES_REQUIRED**; confidence: **high**.

`shasum -a 256` over bytes pulled through the bundle byte channel matched both reviewed versions.
The registry remains `access: bundle-read`, declares no mutation authority or `entry_version`,
and contains no migration-inventory, package, repository, team, review-family, or project ids.

### Remaining blocking findings

#### VSR-7 — More than 32 Reviews produce an invalid, uncorrelated edge request and hang refresh

`makeReviewData` maps every returned Review row to `ids` and sends one
`Bridge.edges({from:ids})` plus one inbound equivalent. The Review query admits 500 returned rows.
The shipped v0 host parser caps an edge selector array at 32 values. Direct real-parser probes
accepted one and 32 selectors, but returned `null` for 33 outbound or inbound selectors.
`BridgeService.handle` then returned `USAGE` without the request id; the embedded client ignored
the uncorrelated reply and left the Promise pending. Thus 1–32 Reviews work, while 33–500 Reviews
leave `makeReviewData` inside `Promise.allSettled` forever and prevent the initial snapshot from
rendering. This violates the required every-message-valid/correlated invariant and makes the
portable portfolio brittle as its own durable history grows.

**Required repair:** partition returned Review ids into v0-valid batches of at most 32 for each
direction, validate strict shape/count agreement on every batch, combine only after every batch
settles, and suppress currentness if any batch rejects or is incomplete. Preserve deduplication
across outbound/inbound results. Exercise exact host-contract fixtures with 0, 1, 32, 33, and 500
Review ids. Separately, harden the shared service so an invalid request that has a valid v0
envelope/id receives a correlated error; malformed input should reject, not strand a client
Promise indefinitely.

#### VSR-8 — The v0 edge parser changes valid opaque ids by trimming boundary whitespace

Core's canonical concept-id guard accepts ids such as `" reviews/x"` and `"reviews/x "`. The
edge parser accepts those requests but normalizes each selector with `.trim()`, producing the
different ids `"reviews/x"`. A Review whose id or graph peer has boundary whitespace can therefore
receive an empty, numerically complete edge result for the wrong identity; effective-conclusion
logic may then label it standalone despite a real successor relation. The final command helper
correctly preserves the same ids, so the inconsistency is specifically at the shared bridge
representation boundary.

**Required repair:** in the owning v0 parser, use trimming only to detect an all-whitespace omitted
selector, while retaining each nonblank selector's original exact string. Apply the same rule to
array entries and add parser/service/query-edge agreement fixtures for leading/trailing spaces,
internal spaces, quotes, option-like prefixes, and ordinary ids. Do not narrow OKF's core id
grammar or teach this View a second identity codec. Until the shared contract is fixed, the View
must at least fail closed rather than assert currentness for an id the edge bridge cannot preserve.

### F1–F3 repairs that passed

- **F1 strict completeness:** the exact `resultShape` accepts counts only when they are finite,
  nonnegative safe integers and declares completeness only for an actual array whose length equals
  count. Exact-source fixtures for missing array/count, underreported, overreported, negative,
  fractional, infinite, `NaN`, and unsafe counts all failed closed; only exact equality passed.
  Request, Review graph, and selected-relation paths all consume this one helper.
- **F2 admitted edge fields:** all four edge calls removed the unsupported `limit` property.
  Single-id selected-record calls and Review arrays of at most 32 parse as v0 and retain the request
  id. VSR-7 records the remaining array-cardinality violation.
- **F3 inert portable recovery:** the helper renders only
  `link show --limit 0 -- '<POSIX-quoted id>'`, with no executable prefix, through `textContent`.
  The real CLI accepted that exact option order and terminator. A shell-token probe round-tripped
  an id containing a single quote, semicolon, space, and command-looking text as one sixth argument
  and produced no side-effect command; spaces, leading `--`, leading/trailing whitespace, and a
  newline were also preserved by the pure helper.

### Other gates that passed on the final bytes

- Transformed exact-source succession fixtures label disconnected conflicting same-line Reviews
  and unfamiliar same-line relations ambiguous, a partial graph incomplete, and only a complete
  single-record graph standalone effective. Open-filter wording remains transport membership,
  never lifecycle authority; stale snapshots say `not live`, and selection removal is announced.
- The embedded bridge retained source-parent, `v0` protocol, pending-id, and delete-on-settle
  checks. Wrong source, protocol, and id stayed pending; the valid reply resolved once and a
  duplicate did nothing.
- The watcher probe showed maximum refresh concurrency one, with two manual waiters coalesced with
  a change into one follow-up batch. Relation retry disables its button and checks
  `detailGeneration` after both edge and document awaits, preventing stale overwrite. Both retry
  paths remain read-only.
- The exact inline script compiled with `new Function`. Static counts are one script, no external
  script, one `innerHTML` assignment, and zero mutation protocols, network primitives, or forms.
  The one HTML sink still receives only unmodified shared `render-document` output; all metadata,
  ids, graph labels, errors, counts, and recovery text use `textContent` or text nodes.
- There is no fetch, XHR, WebSocket, EventSource, form, arbitrary href/src/location navigation,
  v1 action, `document.set-field`, or `bundle-propose` path. `open-page` remains host-validated
  registered-View navigation. Searches found no disclosure-sensitive or project-specific content.

### Residual caveats

- The shared v0 client has no per-request timeout. Iframe teardown bounds its lifetime, but a
  trusted shell that never sends a correlated reply can strand pending work; VSR-7 exercises that
  risk through a reachable invalid request.
- The View's local relation display cap remains 100, while the host refuses an edge query above
  1,000 rather than paginating it. The View correctly labels rejected/partial evidence and offers
  the inert CLI subcommand; it must never present those states as currentness evidence.
- Browser QA still needs CSP/sandbox, exact-byte trust reapproval, inert shared rendering, hostile
  metadata, live create/update/delete, keyboard, and narrow-layout checks after these blockers are
  resolved.

## Superseded exact-byte re-review

- View blob `pages/reviews.html` at
  `sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9`
  (`49,590` bytes).
- Unchanged registry `pages-registry/reviews` at
  `sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.
- Decision: **CHANGES_REQUIRED**; confidence: **high**.

`shasum -a 256` over bytes pulled through the bundle byte channel matched both reviewed versions.
The registry still declares only `access: bundle-read`, has no mutation authority or
`entry_version`, and remains portable: it contains no migration-inventory, package, repository,
review-family, team, or project identifiers.

### Final blocking findings

#### VSR-5 — Undeclared edge limits are rejected without a correlatable request id, hanging refresh

The exact source calls `Bridge.edges({ from: ids, limit: REVIEW_LIMIT })`, its inbound equivalent,
and both selected-record directions with `limit: RELATION_LIMIT`. The current v0 parser permits
only `from`, `to`, and `text` in edge params. A direct probe against the shipped parser returned a
valid parsed request for `{from:"reviews/x"}` and `null` for the same request with `limit:500`.
`BridgeService.handle` then produced a `USAGE` error with no `id`; the embedded client accepts a
reply only by pending id, so the Promise remains pending instead of rejecting. On any nonempty
Review dataset, `makeReviewData` consequently waits forever in `Promise.allSettled`; the initial
snapshot never renders. The selected-record relation retry has the same protocol mismatch.

**Required repair:** remove `limit` from all v0 edge calls. Keep the existing local display cap and
fail-closed handling of the host's documented 1,000-edge `TOO_LARGE` response. If edge pagination
or server-side limits are needed, evolve and test the shared bridge protocol first; a portable View
must not invent request fields. Add an integration fixture that routes the exact View request
through `parseBridgeRequest`/`BridgeService` and proves every emitted request either correlates a
response or is deliberately fire-and-forget.

#### VSR-2 residual — Returned length greater than count still passes as complete

The repaired predicate is `count !== null && rows.length >= count`, and
`completenessProblem` reports only `rows.length < count`. An exact-source probe with two returned
rows and `count:1` produced `{complete:true, problem:null}`; zero rows with `count:-1` did the same.
This does not satisfy the prior required repair for contradictory counts and can restore effective
currentness under a malformed or evolved host response.

**Required repair:** accept a count only when it is a finite, nonnegative safe integer, and treat a
result as complete only when returned length equals count. Any inequality or invalid count must
set the relevant partial/unknown flag, emit an explicit problem, and suppress currentness. Apply
the same invariant to query, graph, open-filter, and selected-record relation results.

#### VSR-6 — Copyable recovery command does not quote the untrusted selected id

The recovery block renders `aslite link show ` + `selectedId` + ` --limit 0` as text. This is safe
for the DOM, but not safe operator guidance: the canonical concept-id grammar admits spaces and
shell metacharacters. Direct core probes accepted ids containing `;`, `$()`, spaces, and `&`.
Pasting a displayed command for such a bundle-controlled id can split arguments or execute an
additional shell command.

**Required repair:** POSIX-shell-quote the concept id (including embedded single quotes), or avoid
presenting a composed executable command. Add fixtures for spaces, single quotes, semicolons,
ampersands, dollar/command syntax, leading hyphens, and newlines. This is a human copy/paste sink,
not a browser-executed injection.

### Gates that passed on the final bytes

- The embedded bridge retained parent-source, `v0` protocol, pending-id, and delete-on-settle
  checks. A hostile-source, wrong-protocol, wrong-id, valid-id, duplicate sequence remained pending
  through the first three, resolved only to the valid reply, and ignored the duplicate.
- The modified watcher serialized initial, change, and two coalesced manual refreshes with maximum
  concurrency one. The selected relation retry disables its button synchronously and checks
  `detailGeneration` after both edge and document awaits, so it cannot overwrite a newer detail
  selection. Both retry paths remain read-only.
- The script compiles with `new Function`. Static counts are one inline script, zero external
  scripts, one `innerHTML` assignment, and zero mutation protocols, network primitives, or forms.
  The one HTML sink still receives only the shared bounded `render-document` result; metadata,
  ids, relation labels, counts, and errors use `textContent` or text nodes.
- No `fetch`, XHR, WebSocket, EventSource, arbitrary URL/href/src/location navigation, form,
  action protocol, `document.set-field`, or `bundle-propose` path exists. `open-page` remains the
  single registered-View navigation request owned by the host.
- The repaired same-line graph logic fails closed for disconnected and unclassified same-line
  relations. Request UI/registry wording now describes open-filter transport membership rather
  than claiming lifecycle authority. Stale snapshots say `not live`, selected-record removal is
  announced, and app-wide Retry uses the serialized watcher authority.
- Searches found no disclosure-sensitive or project-specific data in either exact subject.

### Residual caveats

- The recovery text hardcodes the packaged `aslite` alias. That alias is officially shipped, but
  AgentState/OKF consumers can run the same CLI via `agentstate-lite`, `npx`, `./aslite`, or a
  bundled absolute path. Portable UI guidance should say “use your installed AgentState CLI” and
  avoid presenting one prefix as universally available.
- The shared v0 client still has no per-request timeout. Iframe teardown bounds lifetime, but a
  trusted shell that never replies can leave a request pending. VSR-5 makes this visible because an
  invalid request receives an uncorrelated error.
- Browser QA still needs to exercise CSP/sandboxing, exact-byte trust reapproval, inert shared
  rendering, hostile metadata, live create/update/delete, keyboard behavior, and narrow layouts
  after the blockers are repaired.

## Prior exact review subject

- View blob `pages/reviews.html` at
  `sha256:2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4`
  (`43,017` bytes).
- Registry `pages-registry/reviews` at
  `sha256:0a0387c9b667dd9e890ae282782c4692bfe2c166eb872daff0a38e138130bd4f`.
- Approved method `reviews/architecture-review-template-v1.1` at
  `sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`,
  approved by `reviews/architecture-review-template-v1.1-approval` at
  `sha256:ca2a3f93f8b7e6d4dbfa3dee010ead2b93d5fe51cfe9fb2307fcbe883a6ad22b`.
- Portfolio audit `context-notes/architecture-review-alignment-portfolio-audit`; its original
  snapshot predates the implementation, so its behavioral contract—not its historical blob and
  registry versions—is the comparison authority.

`shasum -a 256` over bytes pulled through the bundle byte channel matched both reviewed versions.
The registry preserves id `pages-registry/reviews`, entry `pages/reviews.html`, and
`access: bundle-read`; it declares no `entry_version` and no mutation authority.

## Prior blocking findings

### VSR-1 — Disconnected competing Reviews on one exact evidence line are each labeled effective

**Basis: empirically reproduced against extracted exact-source functions; high confidence.**

`successionAssessment` seeds its component only from exact `succeeds review` edges. When no such
edge exists, a row with target, target version, evidence cutoff, verdict subject, and verdict is
immediately labeled `Standalone effective conclusion`. It does not search the complete Review
dataset for another record with the same declared evidence line.

An exact-source harness supplied two unlinked Reviews with identical target, target version,
evidence cutoff, and verdict subject but conflicting verdicts. The function returned
`level: effective` for both. This violates the approved method's fail-closed rule that more than
one possible root/terminus on an applicable line makes currentness ambiguous. A human can therefore
see two contradictory claims, each wearing an effective-conclusion badge.

A second exact-source fixture joined the same-line Reviews with an unfamiliar relation labeled
`project-defined successor`; the selected Review was still labeled standalone effective. The
approved method allows an author-declared alternative succession mapping in ordinary OKF content.
Because this View does not parse such a mapping, a same-line unclassified Review-to-Review edge is
unresolved applicability evidence and cannot safely be ignored while asserting currentness.

**Required repair:** derive the applicable-line candidate set from all visible Review rows before
claiming a standalone root or terminus. More than one candidate on the line must be ambiguous unless
one explicitly classified successor-to-predecessor component contains and orders every applicable
candidate with a unique root and terminus. A same-line Review-to-Review relation that is neither a
known non-succession relation nor an observable explicit succession mapping suppresses currentness
as unclassified/ambiguous; it remains visible and is never promoted into succession by guessing.
Missing line identity or records outside the complete visible/paginated universe continue to
suppress currentness. Do not infer succession from family, role, path, title, status, timestamps,
or unfamiliar edges.

**Red acceptance fixtures:** two unlinked same-line Reviews with conflicting verdicts, and two
same-line Reviews joined by an unfamiliar relation, must show the graph and ambiguity/incomplete
notice; neither may say standalone effective.

### VSR-2 — Unknown or inconsistent counts fail open as complete

**Basis: empirically reproduced against extracted exact-source functions; high confidence.**

The portfolio's completeness predicate treats `total: null` and `openTotal: null` as not truncated.
An exact-source probe returned `false` from `isTruncated` for both a one-row query with no count and
an open-query result with no count. When the other flags are healthy, the summary can therefore say
`complete` while its own metric says `total unknown`.

The graph path has the same failure mode. `makeReviewData` considers both edge directions complete
whenever their Promises fulfill; it does not compare each response's `count` with its returned edge
length. A red probe supplied `count: 1` with zero outbound edges and received
`edgesKnown: true`, `partial: false`, and no problem. Effective-conclusion logic may then run over an
internally incomplete graph. The selected-record relation panel likewise leaves `totalKnown` true
when a fulfilled edge response has no numeric count and does not explicitly label a response-level
`count > edges.length` gap.

A complete all-requests result plus a capped open result is also misclassified. The exact-source
fixture used two all rows, one returned open row, and `open.count: 2`. `makeRequestData` still set
`lifecycleKnown: true` and `partial: false`; rendering then classified the omitted open row as
terminal. The summary's general incomplete banner does not undo that per-record false lifecycle
claim.

The current bridge contract normally returns truthful numeric counts and unbounded edge results,
but the approved method explicitly requires degraded-but-not-erroring, capped, and partial states
to fail closed. Cheap response-shape checks are appropriate defense against host regression and
future protocol evolution.

**Required repair:** treat absent/non-numeric counts, `rows.length > count`, or returned length below
count as incomplete unless the client has deliberately exhausted a documented pagination path.
Validate each outbound/inbound edge result before deduplication; any mismatch sets `edgesKnown:
false`, suppresses currentness, and produces an honest incomplete banner. Apply the same rule to
all/open Review Request queries and the detail relation count. Never classify an all-query row as
terminal from set subtraction unless the open-query result is complete; positive returned open ids
may remain labeled as such while omitted ids are lifecycle-unknown.

**Red acceptance fixtures:** missing query count, missing open count, missing edge count, and
`count > returned length` must never yield portfolio `complete`, `edgesKnown: true`, an effective
verdict, or terminal classification for an id omitted by a capped open result.

### VSR-3 — `open:true` is presented as proven openness when no Review Request convention exists

**Basis: reasoned from the exact View and the shared bridge contract; high confidence.**

The bridge's documented `open:true` rule keeps a row unless the bundle's own convention declares
its current value terminal. With no governing convention, the filter keeps every row. The View has
no Kind-presence result, yet treats any fulfilled all/open pair as `lifecycleKnown: true` and labels
every returned id `Open per bundle Kind rules`. In a conventions-free or partially migrated OKF
bundle, this converts “not declared terminal” into a stronger human-decision claim that the View
cannot establish.

**Required repair:** either consume an authoritative Kind-availability signal, if one is added to
the shared bridge, or use the portable semantics the current bridge actually proves: `not declared
terminal by available bundle Kind rules`. Do not claim the Review Request is open merely because a
missing convention filtered nothing. Preserve raw status and distinguish positive filter membership
from proof that a lifecycle convention exists. The registry description/body should use the same
bounded language if source wording changes.

**Red acceptance fixture:** remove the Review Request convention while retaining requested and
approved-looking rows. All rows remain visible, but none is presented as authoritatively open or
terminal solely from the no-op open filter.

### VSR-4 — Last-good snapshots are called live and lack the promised recovery/selection notices

**Basis: exact-source reasoning; high confidence.**

When both request queries or the Review query fail after a success, the View correctly keeps a
last-good snapshot and marks the dataset `stale`. `snapshot`, however, maps every impairment to
`live · incomplete`; it never labels the retained state `not live`. There is no manual retry
control. The only retry guidance appears after the whole `Bridge.watch` startup/subscription path
fails and tells the user to reopen the View. In addition, when a selected record disappears,
`chooseSelection` silently moves to its fallback without announcing the removal as required by the
portfolio audit.

**Required repair:** stale last-good state must display `not live` (while retaining its visible
data), offer a real keyboard-operable retry through the same serialized refresh authority, and
announce selected-record removal before deterministic fallback. A manual retry must not call
`snapshot` in parallel with `Bridge.watch`; both triggers need one owning serialized/coalescing
refresh function.

**Red acceptance fixtures:** after one good snapshot, reject the next dataset refresh and verify the
old data remains, status says `not live`, Retry is keyboard-operable, one retry/change event cannot
overlap another refresh, and deleting the selected record produces an `aria-live` announcement.

## Survived attacks and positive evidence

- **Exact bridge provenance survived.** The embedded v0 client retains parent-source checking,
  bridge-version checking, pending-id matching/deletion, subscribe-before-read behavior, and the
  reference `Bridge.watch` serialization/coalescing algorithm. Its inline script compiled with
  `new Function`.
- **DOM injection boundary survived static dataflow review.** Exactly one `.innerHTML =` sink exists,
  and its value is the unmodified `render-document` result. Frontmatter, ids, relation text, counts,
  and errors flow through `textContent`/text nodes. There is no private Markdown/inline renderer,
  `document.write`, `outerHTML`, or `insertAdjacentHTML` path.
- **Capability boundary survived.** Source inspection found no `fetch`, XHR, WebSocket,
  EventSource, forms, external scripts/styles, arbitrary `href`/`src`, location navigation, or
  mutation/action protocol. `open-page` receives only the already-linked document id and remains a
  fire-and-forget request to the shell, which owns registered-View validation.
- **No hidden project authority survived search.** The source contains no migration-inventory id,
  project/package/team ids, known review-family names, or title/path/timestamp role inference.
  Request openness comes from the `open:true` Kind query; Review role grouping uses only the raw
  declared role and preserves unknown roles.
- **Hostile metadata remains text.** HTML-like strings cannot reach the sole HTML sink through card,
  fact, relation, error, badge, id, or notice rendering. Unknown frontmatter is exposed through text
  facts rather than discarded.
- **Bounds are present at the View layer.** Review Request and Review head queries cap at 200/500;
  displayed relations and linked-record reads cap at 100; rendered bodies use the shared bounded
  renderer. The v0 edge request itself has no limit parameter and may materialize a large authorized
  graph before the client display cap; that protocol-level residual risk is pre-existing and should
  remain explicit in browser QA rather than being misrepresented as solved here.
- **Accessibility basics survived.** The View uses real buttons, visible focus, semantic major
  sections/headings, `aria-pressed` filters/cards, textual lifecycle/verdict values, polite live
  regions, alert roles for hard failures, responsive wrapping, and reduced-motion handling. VSR-4
  identifies the missing recovery/removal announcements.
- **Registration and bundle health survived.** `view list` reports this one registry as valid with
  the reviewed version, `bundle-read`, and the expected entry. Current health remains zero malformed
  docs, registry warnings, dangling View entries, and invalid View registrations. Existing unrelated
  unresolved/link-type debt remains visible.

## Prior residual risk and re-review scope

- Browser QA still must exercise shell sandbox/CSP, exact-byte trust reapproval, inert shared
  rendering, hostile metadata, live create/update/delete, narrow layouts, and keyboard behavior.
- The bridge client intentionally has no per-request timeout; iframe teardown bounds its lifetime,
  while slow or non-responding trusted-shell requests can still leave pending Promises. This is the
  shared v0 client contract, not a portfolio-specific regression.
- Re-review the exact repaired blob only for VSR-1 through VSR-4 plus the static capability/DOM
  regression checks above. The registry needs no semantic change unless its exact bytes change as
  part of the repair.

[portfolio audit](architecture-review-alignment-portfolio-audit.md)

[approved method](../reviews/architecture-review-template-v1.1.md)

[View registry](../pages-registry/reviews.md)
