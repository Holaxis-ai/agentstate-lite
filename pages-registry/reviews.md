---
type: View
title: Review portfolio
entry: pages/reviews.html
description: >-
  Live, portable portfolio of human Review Requests and durable Review reports
  with honest partial, legacy, and ambiguous states.
access: bundle-read
actor: review-view-builder
timestamp: '2026-08-08T15:16:39.288Z'
---
A live, read-only portfolio over the bundle's `Review Request` and `Review` records. It preserves
their distinct lifecycles, derives request openness from the bundle Kind registry, keeps unknown
metadata and arbitrary bidirectional relations visible, and renders authoritative bodies only
through the shared bounded document renderer.

The View queries live bundle content and graph edges; it does not consult a migration inventory or
special-case project ids, titles, paths, families, or timestamps. Capped, partial, stale, ambiguous,
and unresolved states are labeled rather than guessed. Its `bundle-read` grant permits no mutation.
