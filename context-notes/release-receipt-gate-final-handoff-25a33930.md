---
type: Context Note
title: P5A receipt-gate final handoff at 25a33930
actor: openai/codex
timestamp: '2026-08-08T17:48:43.979Z'
---
# Summary

P5A engineering is complete and pushed at exact SHA
`25a33930ca978e400cc19f6bc53cccb3de436e91`; independent Review, adversarial QA, and the full
repository gate all passed. The task remains `in_progress` only for Brian's PR/merge gate, after
which the durable P5A -> P5B -> P5S -> continuous-staging chain can continue.

# Takeover card

**What is this?** P5A hardens the signed release-receipt/finalization gate so npm publication is
bound to exact verified release assets and deterministic cleanup, while preserving Brian's
prerelease/stable policy and split operator roles.

**Where are we?** Implementation is pushed on `feat/release-receipt-gate` at exact SHA
`25a33930ca978e400cc19f6bc53cccb3de436e91` (main ancestor `56b5693d`). Independent exact-SHA
Review approved it, targeted adversarial QA passed it with one low residual, and root
`npm run check` exited 0. P5A stays `in_progress` until the human PR/merge gate completes.

**What's next?** Brian opens and reviews the PR, explicitly verifies
`.github/release-allowed-signers` contains exactly the intended Brian and Mike public-key lines,
and owns the merge. After merge, update/close P5A and claim P5B; the durable dependency chain is
P5A -> P5B -> P5S -> continuous staging.

**What's blocking?** No engineering gate is blocked. The remaining gate is intentionally human:
PR creation/review/merge. One low defense-in-depth observation remains: an attacker already able to
control the job filesystem and `contents:write` token could tamper with a shape-valid local
publication plan before final proof prevents publication. Future hardening may separately pass the
dispatch draft id and recheck deletion membership; this is not an external bypass.

**How do I act?** Start from [the P5A task](../tasks/p5a-pre-live-hardening.md), then read the
[approved fix plan](../plans/release-receipt-gate-fix-delta.md),
[build receipt](release-receipt-gate-fix-delta-build-2026-08-08.md),
[exact-SHA review](release-receipt-gate-fix-delta-exact-sha-review-25a33930.md), and
[targeted QA](release-receipt-gate-fix-delta-targeted-qa-25a33930.md). Do not bypass the P5A ->
P5B -> P5S -> continuous-staging dependency chain.

# Gate receipts

- Builder focused suite: 61/61 pass; required M1 name-only weakening caused the intended red probe,
  then the exact comparator was restored.
- Exact-SHA Review: APPROVE, confidence 0.96; no unresolved high/medium finding.
- Targeted adversarial QA: PASS WITH FINDINGS, confidence 0.94; affected suite 61/61 and independent
  adversarial harness 10/10.
- Repository gate: first sandboxed run failed with shared `listen EPERM 127.0.0.1`; same unmodified
  exact SHA passed `npm run check` outside the listener restriction, exit 0.
- Branch publication: exact lease protected the forced update from remote `4b905b3f` to
  `25a33930ca978e400cc19f6bc53cccb3de436e91`.

# Orchestration reflection

The sequential Generator-Critic pipeline fit the security-sensitive work: planning review found
five missing contracts before Build, the exact-SHA reviewer verified their closure, and adversarial
QA found only a low job-local residual. The clearest reusable improvement is to put exact asset
id/name/digest binding, convergent release-body ownership, and pre-stage/finalize grammar modes in
the first plan, and to mark loopback-listener tests as requiring an unrestricted local gate so a
sandbox failure is classified immediately. The durable domain/plan/review/QA links made the
session boundary survivable and kept downstream work from consuming an unverified conclusion.
