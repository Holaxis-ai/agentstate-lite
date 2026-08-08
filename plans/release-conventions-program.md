---
type: Plan
title: >-
  Release-conventions program: recorded + enforced conventions, cadence
  decision, first-stable path (orchestrated)
actor: openai/codex
timestamp: '2026-08-08T17:48:33.805Z'
---
- 2026-08-08: Receipt gate (p5a substantive half) BUILT (feat/release-receipt-gate @ 4b905b3f) +
  independent review APPROVE-WITH-FINDINGS. HANDED OFF to a Codex team
  (context-notes/receipt-gate-codex-handoff) — Fable's safeguard classifier repeatedly flags the
  security-QA sub-agent dispatch for this unit, so Claude/Fable is not driving it further. Codex
  picks up: Brian's same-actor ruling + run_id ack, close the asset-tolerance finding, adversarial
  QA (+external review), PR in Brian's format. Then P5B -> P5S -> enable staging.
- 2026-08-08: Receipt-gate adversarial QA COMPLETED before handoff took effect — pass-with-findings
  (203/203 baseline; all policy rows MATCH). Findings folded into the handoff note: M1 (medium,
  = review item 5, now empirically confirmed) forged/garbage receipt-status assets ride onto the
  published release byte-indistinguishable from genuine stamps; L1 inspect-tool scratch leak;
  L2 stamp upload missing --clobber; plus one Brian-confirm on the approval-without-inspection
  prerelease shape. Codex team: apply fixes in one reviewed unit + re-verify, do NOT re-run the
  full QA matrix.
- 2026-08-08: Codex fix delta COMPLETED and pushed at exact SHA
  `25a33930ca978e400cc19f6bc53cccb3de436e91` on `feat/release-receipt-gate` after independent
  exact-SHA Review APPROVE, targeted adversarial QA PASS WITH FINDINGS (no high/medium), and
  root `npm run check` exit 0. P5A remains open only for Brian's PR/merge gate and explicit
  allowed-signer review; then the encoded critical path continues P5B -> P5S -> continuous staging.
