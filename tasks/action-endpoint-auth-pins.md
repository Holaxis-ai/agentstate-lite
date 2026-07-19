---
type: Task
description: >-
  Follow-up from the PR #109 review's adversarial-QA list (item 2 — the one not
  covered by the #109/88ba95a hardening): direct HTTP probes pinning that the
  three /__ui/actions/* endpoints fail CLOSED at each auth layer. The code
  enforces this by construction (review-verified read: Host allowlist, checkAuth
  session gate, exact X-Requested-With value, JSON content-type, 16 KiB cap,
  exact-key bodies) but NO test drives the layers over real HTTP, so a
  routing/auth refactor could regress silently. DoD: ui-server tests hitting
  prepare/commit/cancel with (a) no session, (b) valid session but missing/wrong
  X-Requested-With value, (c) wrong content-type, (d) oversized body, (e) extra
  body keys — each asserting the specific 403/415/413/400 refusal and that NO
  action side effect occurred. Test-only, Sonnet-safe, small. Items 1 (lure-View
  click-timing) and 3 (concurrent-writer race) from the QA list are covered: 1
  by 88ba95a's MutationObserver e2e, 3 by the service-level CAS race test.
actor: mike/codex
title: >-
  Pin the /__ui/actions/* auth layers with direct HTTP probe tests (PR#109 QA
  item 2)
status: done
timestamp: '2026-07-19T13:09:20.881Z'
---
Parent context: PR #109 (trusted View actions) + the posted review at https://github.com/Holaxis-ai/agentstate-lite/pull/109#issuecomment-5012721593.

Shipped: PR #118 — https://github.com/Holaxis-ai/agentstate-lite/pull/118
Merge commit: 3fc8c4fa698def77197ee3250a294890b6ce0115

Proof: 3 endpoints × 7 fail-closed HTTP probes; focused suite 25/25; adversarial red proof showed a weakened exact-header guard allowed the wrong-header commit probe to mutate its isolated target; full local npm run check passed; GitHub gates passed on Node 20, 22, and 26.
