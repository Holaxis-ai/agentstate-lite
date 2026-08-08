---
type: Task
title: Evolve the reviews View into a portable Review portfolio
status: done
priority: '2'
assignee: review-view-builder
actor: review-view-builder
timestamp: '2026-08-08T15:17:43.713Z'
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

Independent exact-source/security review and browser/adversarial portability QA remain required before the umbrella task closes.

[governed by](../plans/architecture-review-record-alignment.md)

[depends on](architecture-review-alignment-method-v1-1.md)

[depends on](architecture-review-alignment-family-wrappers.md)
