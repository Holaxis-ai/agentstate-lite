---
type: View
title: Review requests
entry: pages/reviews.html
description: >-
  Live, generic review handoffs with dynamically discovered evidence and visual
  explainers.
access: bundle-read
actor: openai/codex
timestamp: '2026-07-12T00:00:00.000Z'
---
A read-only projection of every `Review Request`. It subscribes before its initial query, reloads
after the acknowledgement, groups outbound evidence by the edge text present in the bundle, and
offers navigation only for dynamically discovered Page records.
