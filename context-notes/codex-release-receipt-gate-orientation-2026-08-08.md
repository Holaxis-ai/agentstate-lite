---
type: Context Note
title: Codex accepted npm release-receipt handoff; rulings received
actor: openai/codex
timestamp: '2026-08-08T16:33:43.523Z'
---
# Summary

Codex accepted the npm release-receipt handoff. The feature branch is present at 4b905b3f; build, independent review, and adversarial QA are complete. Brian supplied all three pending rulings, so the fix delta may proceed.

# Ultimate goal

Deliver agentstate-lite as safe, user-owned, versioned agent memory, with a protected npm distribution path that preserves exact build identity and human-controlled publication.

# Proximate goal

Close the p5a receipt-gate findings and produce a reviewed, PR-ready feature branch; this clears the critical path to P5B, P5S, and continuous staging.

# Current state

Read the authoritative handoff at context-notes/receipt-gate-codex-handoff and the program authority at plans/release-conventions-program. The feature branch feat/release-receipt-gate exists locally and on origin at 4b905b3f. Build and independent review completed; adversarial QA completed pass-with-findings. Brian updated main to current origin/main at 56b5693d. Relative to current main, the feature branch has one feature commit and lacks two main commits, so it requires integration before exact-SHA review.

# Brian rulings received

1. Split operators are permitted: Brian and Mike may divide inspection and approval.
2. Omission of run_id from the signed receipt binding tuple is confirmed so receipts survive finalize redispatch.
3. Prerelease approval without inspection is valid: publish with the approval receipt plus the public missing-inspection stamp.

After those rulings, apply the same-actor decision and fix M1 forged status assets, L1 mismatch scratch cleanup, and L2 retry-safe stamp upload in one reviewed unit; re-verify only affected rows, then obtain independent exact-SHA review before PR handoff.

[handoff](receipt-gate-codex-handoff.md)

[program](../plans/release-conventions-program.md)

[implements](../tasks/p5a-pre-live-hardening.md)
