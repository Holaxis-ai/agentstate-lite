---
type: Task
title: doc update/write --body silently drops a doc's outbound links (data loss)
status: todo
priority: '1'
description: >-
  HIGH — silent loss of the product's signature feature (the link graph). Found
  by an agent using agentstate-lite in a consuming project (generic repro
  below). MECHANISM: OKF cross-links are markdown links stored IN the doc body
  (link add appends [text](../to.md) then rewrites — link.ts). So a
  full-body-replace drops them. REPRO (1.0.26): new '<Kind>' X --link '<t>=<Y>'
  -> outbound_count 1; then doc update X --body '…' (or --body-file) ->
  outbound_count 0. SCOPE: body-specific — a field-only update (doc update
  --tags …) preserves links (body untouched). Spans BOTH doc update --body AND
  doc write --body (full-replace paths). SILENT: no warning; the receipt doesn't
  mention links. SAME FAMILY as the already-fixed F1 (doc write silently
  blanking a non-empty body -> refuses without --blank-body); F1 guarded EMPTY
  bodies, this is a non-empty --body still replacing links. FIX APPROACH:
  pending a behavior decision (preserve-links-by-default with --replace-links
  opt-out / refuse-unless-opt-in like --blank-body / warn-only). Then Sonnet
  build + Fable review + PR (not a direct push).
actor: mike/claude
timestamp: '2026-07-09T23:16:18.125Z'
---

