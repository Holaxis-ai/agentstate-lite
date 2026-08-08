---
type: Task
title: Audit architecture-review discovery and portfolio View
status: done
priority: '2'
assignee: review-discovery
actor: review-discovery
timestamp: '2026-08-08T14:28:18.411Z'
---
# Objective

Inspect the current Review Request View, registered View contract, existing review records, and human navigation paths. Recommend the smallest portfolio design that exposes both requests and completed reviews without creating a second View authority.

# Deliverable

Write `context-notes/architecture-review-alignment-portfolio-audit` with the proposed View/data contract, migration choice, accessibility/security considerations, and executable QA checks. Do not mutate review artifacts in this phase.

# Outcome

Completed the read-only discovery audit against `pages-registry/reviews` at `sha256:ecb6daba8740d5a2fb78714c45b85f70c2a37f642e01203ad2027b19d7879f55` and exact source blob `pages/reviews.html` at `sha256:0033ec35eda298cd4045fb8775b269b21cce78a0e45019d095f29c19ea28dddc`.

Recommendation: evolve the existing registered View in place into a single Review portfolio, preserve its read-only grant and identity, query Review Requests and Reviews as separate lifecycles, classify missing legacy fields honestly, render bodies only through the shared bounded renderer, and require exact-byte source review plus browser QA. The audit also identifies the current source's retired `Page` navigation predicate and the Review Request convention's matching pre-existing typed-link debt.

[audit result](../context-notes/architecture-review-alignment-portfolio-audit.md)

[governed by](../plans/architecture-review-record-alignment.md)
