---
type: Plan
title: >-
  Release-conventions program: recorded + enforced conventions, cadence
  decision, first-stable path (orchestrated)
actor: anthropic/claude
timestamp: '2026-08-08T16:27:02.557Z'
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
