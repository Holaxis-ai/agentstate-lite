---
type: Task
title: >-
  Establish/window journeys: pre-existing defects surfaced by PR #75 adversarial
  QA
status: done
priority: '3'
description: >-
  SHIPPED: PR #82 merged (reviewed candidate 2b1627d). Full high-risk ladder:
  builder -> independent review (APPROVE — every adopt/refuse arm empirical with
  refs byte-checked; the CAS guard RACED for real via a git shim and held;
  session-start adoption, 5->1 exit, remnant-vs-dual routing, and the
  marker-clear edge all adjudicated favorably; parity = one disclosed line) ->
  adversarial QA (SHIP — 12/12 concurrent adopt races exactly-one-wins; 7
  deterministic + 22 random kill points all heal on bare re-run; concurrent
  session-starts fail-soft; read-only refs honest). F2 receipt-chain fixed
  (strict-ancestor ff-adopt), F3 wedge escape + honest preview, F5 one-hop
  window/wedge/dual copy in home, F-D1/D2/D3 + invalid-marker +
  stale-marker-clear + comment sweep done, F4/F6 documented WONTFIX in sync
  --help. QA's two new LOW findings (exotic preconditions, ff-only, no data
  loss) recorded as tasks/adopt-path-hardening.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T13:29:58.404Z'
---
[depends on](sync-migrate-removal.md)
