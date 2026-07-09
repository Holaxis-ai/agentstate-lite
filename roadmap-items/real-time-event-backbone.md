---
type: Roadmap Item
title: 'Real-time event backbone: ordered, recoverable change feed (CANDIDATE)'
status: queued
description: >-
  CANDIDATE — recognized direction, NOT yet committed or sequenced (queued + no
  sequence = the backlog tier). Make ordered, recoverable real-time events a
  per-bundle primitive that the UI, sync awareness, session-start, and
  notifications consume, replacing per-consumer change inference. Foundational:
  touches the storage seam (every backend), the wire protocol, and the
  generative UI. Origin: codex/Brian's fleet proposal from the feat/ui-pages
  review. Design + open questions in research/real-time-event-backbone.
  Sequencing + adoption is a joint Mike/Brian decision; status flips to active
  when committed.
actor: mike/claude
timestamp: '2026-07-09T21:35:14.510Z'
---
[informed by](../research/real-time-event-backbone.md)
