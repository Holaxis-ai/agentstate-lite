---
type: Context Note
title: Duplicate R0 rail retirement exact review
actor: codex-r0-retirement-reviewer
timestamp: '2026-08-04T17:46:21.886Z'
---
# Summary

Independent retirement review of /private/tmp/aslite-precompact-v3.RLDTIZ/repo is complete. The duplicate R0 cleanup satisfies the exact absence and preservation contract. No candidate bytes were modified by this review.

# Verdict and confidence

PASS. Confidence: 0.98 for the bounded retirement claim.

The cleanup removes no tracked behavior: every retired target is absent, the accepted T0 owner and its test retain their reviewed digests, and the preserved harness test evidence is green. The next implementation phase is T3.5 architecture. R0 remains reserved for later exact-artifact review after G0.

# Empirical checks

- Independently tested each of the ten inventory targets with both existence and symlink predicates. All were absent:
  - .r0-live/
  - packages/cli/test/fixtures/r0/
  - packages/cli/test/r0-collector.test.ts
  - packages/cli/test/r0-live-rail.test.ts
  - packages/cli/test/support/r0-live-rail.ts
  - scripts/r0-inert-hook.mjs
  - scripts/r0-prepare.mjs
  - scripts/r0-rail-collector.mjs
  - scripts/r0-run-case.mjs
  - docs/r0-live-rail-runbook.md
- Ran a read-only repository-wide retired-name inventory, pruning .git and node_modules. It returned no rows.
- Independently hashed the preserved owner files:
  - packages/cli/test/fixtures/handoff/live-harness.mjs = 7cc496d2ebeee7ffaf8e659494d9220d5cdc33b46408ba5ae440f2153bfe7e7d
  - packages/cli/test/handoff-harness.test.ts = c3ea9e1b721d732083d6378ed76c7238e509811bdd625671a1cc1d5b04a82df9
  These exactly match the baselines in the reviewed skeptic input.
- Inspected /private/tmp/precompact-r0-retirement-harness.log. Its TAP summary reports 10 tests, 9 pass, 0 fail, 1 deliberately skipped red contract, duration 574.665791 ms.
- Audited the complete 276-line handoff-harness.test.ts and the complete 193-line live-harness.mjs. The suite pins installed-host event fields, transcript fixtures, decision-card bounds, settings provenance, all six later L0 fault identifiers, deterministic dependencies and killpoints, helper missing/non-executable/timeout classifications, store scenarios, default live refusal, strict scratch-root isolation, secret non-inheritance, immutable launch bytes, and outside-canary detection. Its executable activity is bounded to Node/in-repository helpers and /private/tmp scratch roots; it does not invoke Claude, a network client, auth, real user settings, or a production journal.
- Independently read the exact current heads requested for the product contract, test architecture, system-model skeptic, and builder receipt. Their head versions equal the supplied SHA-256 pins.
- Independently read the retirement plan and stale precompact-main handoff. The reviewed product contract and skeptic verdict explicitly supersede the stale R0-repair direction; the retirement plan makes C4 record reconciliation depend on this PASS and names T3.5 architecture as the sole next phase.

# Relied-on receipts

The no-git constraint prevented an independent git status or HEAD query in the shared candidate worktree. I therefore rely on the builder/orchestrator receipt for:

- HEAD 36c741a8173832d75d61a7ab138b5219c4415c66.
- Empty git status --short after cleanup.
- Exit code 0 for the exact packages/cli command: node --test --import ./test/ts-loader.mjs ./test/handoff-harness.test.ts.
- The statement that the retired paths were untracked or ignored and no tracked Git byte changed.
- The statement that cleanup invoked no Claude, network, auth, user settings, production journal, bundle runtime, or outside-path state.

The retained log independently supports the reported test result semantically (zero TAP failures), but a log alone cannot prove the spawning process exit code.

# Survived attacks

- A retired path replaced by a symlink would have been reported; none was.
- A same-named retired artifact elsewhere in the candidate tree would have appeared in the bounded repository-wide search; none did.
- Silent mutation of either accepted T0 owner would have changed its digest; both match exactly.
- The test log is not accepted blindly: its construction was audited against the exact preserved test and harness bytes.
- The one skipped row is an explicitly named RED CONTRACT for a future foreign-settings transformation, not a hidden failure in the accepted T0 preservation suite.
- The reviewed sources converge on one authority: existing T0 owns isolation and later L0 owns candidate fault cases. No surviving artifact establishes a second R0 path, settings, manifest, collector, or verdict authority.
- Stage conflation did not survive review: prerequisite host evidence is H0, later exact-artifact review is R0, and the immediate architecture dependency is T3.5.

# Findings

No blocking findings.

Non-blocking but mandatory close action: context-notes/precompact-main still contains the superseded R0-repair instruction, and the parent phase/task records have not yet been reconciled. This is C4 in the accepted retirement plan, intentionally sequenced after independent PASS. It must be completed before any new builder is dispatched so the stale handoff cannot propagate.

Evidence limitation: clean tracked state and exact HEAD are receipt-backed rather than independently re-run because reviewers were instructed not to use git in the shared candidate worktree. The independent absence checks, exact owner digests, and test/log audit are consistent with that receipt.

# Next dependency

C4: the orchestrator must disposition the rejected R0 model, replace the stale precompact-main handoff, reconcile the parent task to T3.5, and sync the board. After C4, resume the T3.5 architecture decision: reuse audited v5 no-autostart evidence and freshly probe only remaining H2-H5 physical/controller facts before exact acceptance and skeptic review. Do not repair or revive the duplicate R0 rail, run Claude, freeze a candidate, or advance G0 from this cleanup result.

[reviews](../tasks/precompact-v3-r0-retirement-review.md)
