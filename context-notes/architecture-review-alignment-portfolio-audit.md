---
type: Context Note
title: 'Architecture-review alignment: portfolio View audit'
actor: review-discovery
timestamp: '2026-08-08T14:28:15.184Z'
---
# Summary

**Ultimate goal:** agentstate-lite is a human-visible, conflict-safe, local-first shared memory in which durable conclusions are easy to find, correctly typed, and linked to the evidence and work they govern.

**Proximate goal:** make human Review Requests and durable Review reports distinguishable and discoverable through one registered View; this serves the ultimate goal by making the review-family graph legible without creating a second discovery authority.

Recommendation: **evolve `pages-registry/reviews` in place into “Review portfolio”; do not add a second View.** Preserve the registry id, entry key, and `access: bundle-read`. Replace the HTML bytes through compare-and-swap and update only the registry title, description, and explanatory body through compare-and-swap. Do not relocate the legacy-prefix registry/blob in this unit: current runtime policy explicitly recognizes those locations, while relocation is a separate migration decision.

This is a progressive-disclosure repair, not a new workflow. The View remains a read-only projection. `Review Request` remains the named-human decision authority, and `Review` remains the durable report/verdict authority.

# Evidence snapshot

The review used these exact authorities and versions:

| Evidence | Exact version / observation |
| --- | --- |
| Accepted alignment plan | `plans/architecture-review-record-alignment` at `sha256:93b15c755e7e9920350a9092403f4816b3030d15ed3c1411702f9f255fcf5435` |
| Registered View | `pages-registry/reviews` at `sha256:ecb6daba8740d5a2fb78714c45b85f70c2a37f642e01203ad2027b19d7879f55`; title `Review requests`; entry `pages/reviews.html`; access `bundle-read` |
| Exact registered source blob | `pages/reviews.html` at `sha256:0033ec35eda298cd4045fb8775b269b21cce78a0e45019d095f29c19ea28dddc`; 14,854 bytes; inspected through `aslite pull` |
| View convention | `conventions/view` at `sha256:8633db86f36f75a00d2c7680a2c6228d830ac25ff57ce80c718d41f41e9e6b35` |
| Review Request convention | `conventions/review-request` at `sha256:6bf815ddb5b6d490f80f140b6ec6bf012263f2ec534d27d41b6a348d5ea3df46` |
| Current inventory | 6 `Review Request` heads and 14 `Review` heads. All 14 Review heads lack the proposed `status`, `role`, `verdict`, `target`, `target_version`, `evidence_cutoff`, `template_version`, and `owner` fields. |
| Current bundle health baseline | 0 malformed docs, 0 registry warnings, 0 dangling View entries, 0 invalid View registrations. Pre-existing debt: 6 unresolved links and 18 link-type violations. |

The current source has four relevant behaviors:

1. It queries only `type: Review Request`; completed and in-progress `Review` reports cannot appear.
2. It correctly subscribes before its first query and uses the Review Request kind's `open:true` semantics, but its raw change listener may start overlapping refreshes; the current authoring contract supplies `Bridge.watch` to serialize and coalesce refreshes.
3. It implements a private Markdown parser and inserts that output into `innerHTML`. Current View authoring guidance instead requires `render-document`, whose shared bounded renderer returns inert semantic HTML.
4. Its navigation predicate accepts only `frontmatter.type === "Page"`, although `Page` is a retired type and every currently registered visual record is `type: View`. Consequently linked View explainers render as generic artifacts rather than opening through the supported `open-page` action. The registry body also still says “Page records.”

The Review Request convention has a related pre-existing mismatch: `explained by` still targets `Page`, while the two existing targets are now `View` records. That accounts for two current link-type violations. Repairing this vocabulary to `View` is appropriate if the alignment unit is allowed to touch the request convention; otherwise record it as adjacent debt and do not hide it by title- or prefix-based inference in the View.

# Objections and dispositions

## Objection: a second portfolio View would preserve the focused request UI

Rejected. Two overlapping launcher cards would require a human to know which review surface contains the desired record and would retain the current incomplete surface indefinitely. The existing id is already linked from Review Requests and is semantically broad enough to become the portfolio. Preserve request-focused grouping inside it.

## Objection: infer canonical/supporting roles from legacy titles

Rejected. The accepted model says graph role, not the word “review,” determines type and authority. Frozen Reviews have no new role fields and must remain byte-stable. The View must label them `Historical / unclassified` (or `role not declared`) until the migration graph makes their role explicit; it must not classify `approval`, `addendum`, or `rereview` from filename/title substrings.

## Objection: show only `role: synthesis` Reviews

Rejected. That would make every frozen legacy Review disappear and would hide supporting approval/addendum records needed to understand exact-version review families. Show all Review heads, but make declared synthesis records primary and supporting/legacy records visually distinct.

## Objection: automatically render every linked body for convenience

Rejected. It adds noise, work, and disclosure surface. Load head metadata for linked records, show typed/status summaries immediately, and invoke `render-document` only when the human asks to read one. The bridge grant already covers the whole bundle, but changed executable bytes still require local exact-byte reapproval.

# Design contract

## Identity and authority

- Keep registry id `pages-registry/reviews`, entry `pages/reviews.html`, and `access: bundle-read`.
- Rename launcher/title to **Review portfolio** and describe it as a read-only projection of human requests plus durable review reports.
- Do not add `entry_version`: this is an intentionally mutable live dashboard, not an immutable report.
- Do not add mutation controls. Human decisions continue through attributed, version-guarded updates to the Review Request; review reports continue through normal bundle writes and review gates.
- Promote the new blob with `--expected-version sha256:0033ec35eda298cd4045fb8775b269b21cce78a0e45019d095f29c19ea28dddc`; update the registry with `--expected-version sha256:ecb6daba8740d5a2fb78714c45b85f70c2a37f642e01203ad2027b19d7879f55` after a fresh read.

## Snapshot queries

Run one serialized live snapshot through the reference `Bridge.watch` client. Issue these bounded queries in parallel:

```js
Bridge.query({ type: "Review Request", limit: 200 })
Bridge.query({ type: "Review Request", open: true, limit: 200 })
Bridge.query({ type: "Review", limit: 500 })
```

Keep each returned `count`. If `count > rows.length`, show an explicit incomplete-results banner with both numbers; do not imply the portfolio is complete. These caps are far above the current 6/14 inventory while still defining a safe over-limit state.

Use the open-query ids, not a duplicated terminal-status table, to split Review Requests:

- **Open human decisions:** all ids returned by `open:true`, sorted by `requested`, `in_review`, `changes_requested` priority and then newest timestamp/id.
- **Closed human decisions:** remaining requests, newest decision/timestamp first.

Classify Review heads only from declared fields:

- **Canonical syntheses:** `role === "synthesis"`; display `status` independently from `verdict`.
- **Supporting reviews:** `role` is `specialist`, `approval`, `addendum`, or `rereview`.
- **Historical / unclassified:** missing or unknown `role`. Missing provenance displays as `not declared (legacy)`, never `approved`, `final`, or another inferred value.
- Within each group, put `draft`, `in_review`, or `verdict: pending` before final records, then sort by `evidence_cutoff`, timestamp, and stable id. Render `superseded` explicitly; do not silently remove it.

The top decision card must expose, without opening a body:

- Review Request: title, lifecycle status, reviewer, requested by, question, decision summary/date when present.
- Review: title, role, lifecycle status, verdict, target, target version, evidence cutoff, template version, owner, and record id. Every missing field is visible as undeclared rather than omitted when it affects interpretation.

## Detail and review-family graph

Selecting a card is the second navigation step after opening the View. The detail pane must immediately show verdict/target and related Finding/Task titles/statuses, meeting the plan's two-step discovery criterion without requiring body parsing.

For the selected record:

1. Call `Bridge.renderDocument(selectedId)` for the authoritative body and exact rendered version.
2. Call `Bridge.edges({ from: selectedId })` and `Bridge.edges({ to: selectedId })` in parallel.
3. Deduplicate related ids for reads, retain every distinct edge text and direction, cap displayed relationship cards at 100, and show an over-limit notice rather than silently dropping the remainder.
4. Group links by direction and exact edge text; do not reinterpret free-form link text as a typed relationship.
5. Show linked `Finding`, `Task`, `Review`, `Review Request`, `Decision`, `Claim`, and other records using their actual `type`, title, status/verdict when present, id, and relationship label. An unreadable target remains visible as `Unavailable` with its id and edge.
6. A related-record button calls `render-document` on demand in the same pane. If the related record is an actual `type: View` under a permitted registry id, also offer `Open View` through `Bridge.openPage`. Never recognize retired `Page` as the authoring type or infer View capability from a filename alone.
7. Preserve the selected id across live snapshots when it still exists; choose the highest-priority open request, then newest synthesis, then newest available record only when no valid selection remains.

Use the shell renderer's passive `data-aslite-doc-id` markers to allow inline document drill-down. Insert only the unmodified `render-document` HTML. Show the returned exact document version and a clear bounded-content notice when `bounded` is true.

## Safe rendering and access consequences

- Build metadata UI with DOM nodes and `textContent`. Do not concatenate frontmatter, ids, edge text, or errors into HTML strings.
- Remove the local `markdown`, `inline`, and graph-paragraph-stripping renderers. `innerHTML` is allowed only for the unmodified inert fragment returned by `render-document`.
- Embed the current reference bridge client, including `event.source === window.parent`, bridge-version checks, pending-id matching, and `Bridge.watch` refresh serialization.
- Keep all CSS/JS inline and use no external hosts, fetch, XHR, WebSocket, EventSource, forms, or arbitrary URLs.
- The formal grant does not expand: the current View is already `bundle-read`. The functional scope does expand from requests to all Review bodies and their graph, so source review and the shell's expected exact-byte reapproval are meaningful security gates.
- Rendering is local to an already authorized bundle reader; it does not justify putting sensitive vulnerability details into the public board. Public disclosure discipline remains upstream of the View.

## Accessibility and responsive behavior

- Use semantic `header`, `nav`, `main`, `section`, heading hierarchy, lists, and real `button` controls.
- Make request/report and group filters keyboard-operable, with `aria-pressed` or a correct tab pattern; preserve visible focus.
- Put refresh/count text in an `aria-live="polite"` region; use `role="alert"` for startup/partial errors.
- Status/verdict must be textual and not color-only. Keep sufficient light/dark contrast and respect `prefers-reduced-motion` for scroll/transition behavior.
- At narrow widths, preserve the decision-card facts before graph detail and never require horizontal scrolling for ids or hashes.

## Empty, partial, and error states

- Distinguish `No human review requests` from `No durable Review reports`; one empty collection must not blank the other.
- Use `Promise.allSettled` for the two logical datasets. If one dataset fails, render the other with a labeled partial-data alert; if both fail, render a retryable `role=alert` state.
- A detail read/render/edge failure affects only that panel. Keep the portfolio list and identify the failed operation without echoing unsafe raw payloads.
- Live-refresh failures after a successful snapshot keep the last successful snapshot visible, label it `not live`, and allow a manual retry; they must not replace known data with an empty state.
- If a selected record is removed, announce that fact and move to the deterministic fallback selection.

# Executable QA contract

The implementer should validate a private scratch copy of the bundle and the live bundle's non-mutating health surfaces. The final reviewer/QA record should capture exact pre/post blob and registry versions.

1. **Static source gate.** Extract every inline script and compile it with `new Function`; fail on syntax errors. Assert the source contains both Review queries, `Bridge.watch`, `render-document`, source-window checks, overflow handling, and actual `type: View` navigation. Assert it contains no local Markdown parser and no network/mutation APIs.
2. **Registry/health gate.** Run `./aslite status --limit 0` and `./aslite view list --limit 50`. Require malformed, registry warnings, dangling entries, and invalid registrations to remain zero. Compare unresolved/link-violation counts with the recorded baseline; no new debt is allowed. If `explained by: View` is repaired, explicitly record the expected reduction rather than treating all residual debt as new.
3. **Exact-byte gate.** Pull `pages/reviews.html` after promotion and record its content-addressed version; verify the registry still points to that key with `access: bundle-read`. A stale CAS promotion/update must fail rather than overwrite a concurrent edit.
4. **Inventory agreement gate.** Query Review Requests (all/open) and Reviews through the CLI and compare their counts/ids to the View's rendered summary. Do not hard-code 6/14 because the migration legitimately adds Reviews.
5. **Browser acceptance.** Through `./aslite ui --dir <scratch> --port 0 --json`, approve the changed exact bytes, open the single `pages-registry/reviews` launcher card, and verify: iframe sandbox is exactly `allow-scripts`; open versus terminal requests are separated; a declared synthesis and a frozen missing-role Review land in different groups; status and verdict are both visible; the CLI family and Mike family are selectable; linked Findings and Tasks appear in the selected family without opening another View; a related body uses shared rendering and displays its exact version.
6. **Adversarial rendering.** In the scratch bundle, create titles, edge text, ids/body text containing HTML-like payloads. Verify metadata remains text, shared Markdown output is inert, no script/event fires, and no external network request is made.
7. **Live/reliability acceptance.** With the View open on the scratch bundle, create/update/delete a Review and observe a serialized live refresh without full-page reload or overlapping stale detail. Exercise one failed/unavailable related target, one missing-field legacy Review, an over-limit fixture, and one logical query failure; the unaffected data remains visible with honest banners.
8. **Accessibility/responsive acceptance.** Navigate filters/cards/detail using the keyboard at narrow and wide host sizes; verify visible focus, announced live/error state, textual status/verdict, stable heading order, and no horizontal overflow.

# Recommended next implementation unit

Assign one View builder to revise the exact pulled blob and registry copy through CAS, with the request-convention `Page` -> `View` relationship repair either explicitly included or explicitly tracked as pre-existing debt. Then require an independent source/security review of the exact promoted blob version before browser QA. The reviewer should focus on the one allowed `innerHTML` sink, exact bridge client, absence of title-based role inference, partial/overflow behavior, and the expected trust reapproval.

[governed by](../plans/architecture-review-record-alignment.md)

[tracks](../tasks/architecture-review-alignment-portfolio-audit.md)
