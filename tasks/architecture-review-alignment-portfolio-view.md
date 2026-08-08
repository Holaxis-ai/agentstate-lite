---
type: Task
title: Evolve the reviews View into a portable Review portfolio
status: done
priority: '2'
assignee: review-view-builder
actor: review-view-builder
timestamp: '2026-08-08T15:58:26.914Z'
---
# Objective

Evolve the existing reviews registered View in place into a generic Review portfolio without expanding its authority or depending on this project's migration inventory.

# Acceptance

Keep the registry id, entry, and bundle-read grant. Query live Review Requests and Reviews, preserve unknown/missing values and arbitrary bidirectional links, separate request lifecycle from report verdicts, use shared document rendering, expose caps/partial/ambiguous states, and contain no hardcoded project identifiers or title/folder inference. Changed HTML receives independent source/security review before browser QA.

# Outcome

Completed the in-place portfolio build as actor `review-view-builder`.

- Preserved registry id `pages-registry/reviews`, `entry: pages/reviews.html`, and `access: bundle-read`.
- CAS-promoted `pages/reviews.html` from `sha256:0033ec35eda298cd4045fb8775b269b21cce78a0e45019d095f29c19ea28dddc` to `sha256:2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4` (43,017 bytes).
- CAS-updated only the registry title, description, and body from `sha256:ecb6daba8740d5a2fb78714c45b85f70c2a37f642e01203ad2027b19d7879f55` to `sha256:0a0387c9b667dd9e890ae282782c4692bfe2c166eb872daff0a38e138130bd4f`.
- Implemented separate live `Review Request` all/open queries and a live `Review` dataset; sparse/unknown values and extra metadata remain visible without inventory, id, title, path, family, or timestamp inference.
- Implemented bidirectional exact-label graph detail, actual `type: View` shell navigation, bounded shown/total states, partial/stale last-good states, shared `render-document` bodies, accessible filters/cards/details, and serialized `Bridge.watch` refresh.
- Effective-conclusion diagnostics recognize only exact `succeeds review` edges with complete matching subject/target/version/evidence applicability. Caps, stale/partial graph state, dangling endpoints, missing applicability, branches, competing predecessors/successors, cycles, and self-edges suppress or reject currentness. Approval/support/navigation/family/timestamp/unknown relations never establish a target verdict.

# Builder validation

- The exact promoted source was pulled back and matched the candidate byte-for-byte; both SHA-256 digests were `2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4`.
- The single inline script in both candidate and pulled bytes compiled through `new Function` under Node 25.2.1.
- Required-source inspection confirmed live all/open Request queries, all Review query, `Bridge.watch`, shared rendering, bidirectional edges, exact succession handling, View navigation, caps, partial state, and last-good state.
- Forbidden-source inspection found no network APIs, mutation bridge operations, private Markdown parser, or project-specific review/family identifiers.
- The source has one `innerHTML` sink; it receives only the unmodified inert `render-document` HTML returned by the trusted shell.
- `aslite view list` reports nine valid Views, with `pages-registry/reviews` registered as `Review portfolio`, `bundle-read`, and no unavailable entry.
- Post-build status remains: malformed 0, registry warnings 0, dangling View entries 0, invalid View registrations 0, unresolved links 6, link-type violations 18, and missing expected links 35. The latter three counts are unchanged pre-existing debt.

## Reviewer-rejected repair

- CAS-promoted the repaired exact View blob from `sha256:2d0223202f410b56f5a8a1512feddb2f2d08bb0d964bed8e1a5584af1973fdc4` to `sha256:2ceab5dfe2dfca39f22fb72175e9e760330aa1690db890b819d601436ca6035f` (48,619 bytes).
- CAS-updated the unchanged-identity registry body from `sha256:0a0387c9b667dd9e890ae282782c4692bfe2c166eb872daff0a38e138130bd4f` to `sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`; id, entry, title, description, and `bundle-read` access remain unchanged.
- Request groups now state exact open-filter transport membership. Only a numeric complete response permits “not returned”; missing/capped counts remain unknown, and the UI states that a missing governing Kind can make the filter a no-op.
- Review rows and both graph directions require numeric complete counts before any currentness claim. Detail relations expose returned and total counts independently.
- Automatic currentness still recognizes only literal `succeeds review`, and now fails closed for disconnected same-line peers or unclassified relations between same-line peers.
- Stale last-good data says `not live`; manual Retry uses the same serialized watch scheduler; disappeared selections announce their removal from returned rows and deterministic fallback.

## Repair validation

- `/private/tmp/review-portfolio-redgreen.mjs` reproduced all five rejected blocker families against the prior exact source and passed capped open/no-op labeling, capped and missing edge counts, unlinked and unknown-edge same-line peers, serialized stale retry, and selected deletion against the repair. The parent orchestrator independently reran the same harness successfully before promotion.
- The promoted blob was pulled back byte-for-byte at `sha256:2ceab5dfe2dfca39f22fb72175e9e760330aa1690db890b819d601436ca6035f`.
- Final static security inspection passed script compilation, required fail-closed controls, absence of network/storage/mutation APIs, exactly one trusted shared-renderer `innerHTML` sink, one Kind chrome append, and one related-load notice.
- Post-repair health: malformed 0, registry warnings 0, dangling View entries 0, invalid View registrations 0. The six unresolved links, 18 link-type violations, and 35 missing expected links remain pre-existing bundle debt.

## Relation-detail complete-evidence repair

- CAS-promoted `pages/reviews.html` from `sha256:2ceab5dfe2dfca39f22fb72175e9e760330aa1690db890b819d601436ca6035f` to `sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9` (49,590 bytes). Registry `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03` was not changed.
- Relation detail now exposes a `Complete-evidence next action` with an in-place `Retry relations` control and the concrete uncapped CLI command `aslite link show <selected-id> --limit 0` whenever either directional request rejects, lacks a numeric count, or returns fewer edges than its count. The same recovery affordance remains available for local slicing.
- Accurate shown/returned/total labels and all prior fail-closed currentness, generic/open-world, read-only bridge, and trusted-renderer constraints remain intact.
- Focused red/green evidence: `/private/tmp/review-portfolio-relation-detail-fixture.mjs` failed against the former exact `2ceab5…` bytes because the action was absent, then passed against the candidate and pulled-back promoted bytes for outbound `{edges:[one],count:2}` plus inbound `{edges:[],count:0}`, including `1 shown · 1 returned · 2 total`, Retry, and CLI action assertions.
- Regression evidence: `PORTFOLIO_CANDIDATE_PATH=/private/tmp/review-portfolio-detail-repair-pulled.html node /private/tmp/review-portfolio-redgreen.mjs` passed all prior blocker families. Static script/security/recovery inspection passed compilation, the one trusted renderer sink, absence of network/storage/mutation APIs, and required recovery controls. Candidate/pullback `cmp` passed.
- Post-repair status remains malformed 0, registry warnings 0, dangling View entries 0, invalid View registrations 0; unresolved links 6, link-type violations 18, and missing expected links 35 remain pre-existing debt.
- Repair boundary and goals are recorded in `context-notes/architecture-review-alignment-portfolio-detail-repair-2026-08-08@sha256:0897503c5ff7c262bd963ae9aced71ba7eb48a5eed5b591e0813f7edee410711`.

Browser/adversarial portability QA and independent exact-byte re-review remain separate downstream umbrella gates.

## Structural bridge/count/command repair

- CAS-promoted `pages/reviews.html` from `sha256:a198909c82cdd8c7b95dbd1749f988cd375d11551cbef4380ab666ae28ab24e9` to `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea` (50,182 bytes). Registry `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03` was not changed.
- Removed unsupported `limit` fields from all four emitted v0 edge-request shapes. Strict fake fixtures reject undeclared edge parameters, while `/private/tmp/review-portfolio-structural-harness.mjs` passed every emitted overview/detail request through the current `parseBridgeRequest` and `BridgeService.handle` path and verified accepted `edges:result` replies preserve each request id.
- Centralized collection/count classification in `resultShape`: collections must be arrays; counts must be finite nonnegative safe integers; only exact length/count equality is complete. A legitimate `1 returned / 2 total` cap preserves its numeric total but fails closed; a returned collection longer than count is labeled contradictory with total unknown. Review Request all/open queries, Review queries, both overview graph directions, and relation detail use the same classifier.
- Centralized POSIX quoting and recovery-subcommand construction. The View now says `Using your installed AgentState CLI invocation, run` and renders only `link show --limit 0 -- '<escaped-id>'` as text. Shell fixtures proved whitespace, leading-option, literal-quote, newline, and inert shell-significant IDs each round-trip as exactly one argument without execution.
- Candidate and exact promoted pullback both passed the structural harness, the focused outbound `{edges:[one],count:2}`/inbound-empty relation fixture, the prior five-family transformed-source red/green harness, exact-byte `cmp`, script compilation, one trusted shared-renderer sink, no network/storage/mutation APIs, no edge `limit`, and all generic/open-world controls.
- Post-repair health remains malformed 0, registry warnings 0, dangling View entries 0, invalid View registrations 0; unresolved links 6, link-type violations 18, and missing expected links 35 remain pre-existing debt.
- Phase goals, system model, and completion state are recorded in `context-notes/architecture-review-alignment-portfolio-detail-repair-2026-08-08`.

Independent exact-byte re-review and browser/adversarial portability QA remain downstream gates.

[governed by](../plans/architecture-review-record-alignment.md)

[depends on](architecture-review-alignment-method-v1-1.md)

[depends on](architecture-review-alignment-family-wrappers.md)
