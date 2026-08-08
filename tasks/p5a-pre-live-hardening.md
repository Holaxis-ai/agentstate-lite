---
type: Task
title: >-
  P5A pre-live hardening: signed inspection/approval receipts + wire reconciler
  as finalize gate; ban leading-dash tokens
status: in_progress
priority: '2'
description: >-
  Two non-blocking P5A follow-ups that MUST land before E7A/live enablement. (a)
  The state reconciler (release-state.mjs) is documented-not-wired: finalize
  enforces byte identity but trusts operator IDs for inspection+approval
  ordering. Design persisted operator-SIGNED inspection/approval receipts and
  wire release-reconcile as the mechanical finalize ordering gate. (b)
  Argument-injection hardening: assertToken permits a leading '-', so
  flag-shaped values pass; ban leading '-' or insert a '--' end-of-options
  separator before execFile. Not command-injection (no shell) and not reachable
  via automation today (dispatch inputs are SemVer/embedded), but close it
  before live.
actor: openai/codex
timestamp: '2026-08-08T17:48:33.583Z'
---
[hardens](npm-staged-release-automation.md)

[gates](self-discovered-upgrade-proof.md)

# Design decisions (Brian, 2026-08-08) — receipt gate v1

Full design: the designer report logged on plans/release-conventions-program. Brian's calls:
1. **Inspection tier**: PRERELEASE (-> next) = inspection recommended + recorded — absence
   publishes with a permanent, visible "published without inspection receipt" stamp; STABLE
   (-> latest) = inspection receipt strictly required. Invalid/forged evidence is ALWAYS red for
   both tiers (absence tolerated for prereleases; forgery never).
2. **Signing**: operators' existing GitHub SSH keys via ssh-keygen -Y; public keys in a reviewed
   .github/release-allowed-signers (Brian + Mike).
3. **Receipts/stamps PUBLIC on the release page** — resolved by Brian's convention rule: public
   attestation is the widely adopted practice (npm provenance, Sigstore transparency logs,
   GitHub attestations, Apache/Debian maintainer signatures), so receipts stay.
4. **No second approval button**: the one human approval remains npm 2FA stage-approve; the gate
   verifies evidence mechanically (per contract section 5).
5. **Split operators permitted**: inspection and approval MAY be signed by different allowed
   operators; Brian and Mike may split roles. The reconciled state retains per-step actor identity.
6. **No run_id in the receipt binding tuple**: confirmed. Bind stage_id + version +
   tarball_sha256 + draft_release_id so a valid receipt survives finalize redispatch.
7. **Prerelease approval without inspection is valid**: publish the verified approval receipt plus
   the permanent public missing-inspection stamp. Stable still requires inspection.

# Implementation status (Codex, 2026-08-08)

- Fix delta is committed and pushed on `feat/release-receipt-gate` at exact SHA
  `25a33930ca978e400cc19f6bc53cccb3de436e91`, rebased onto main `56b5693d`.
- Independent exact-SHA Review: APPROVE, high confidence. See
  [review receipt](../context-notes/release-receipt-gate-fix-delta-exact-sha-review-25a33930.md).
- Targeted adversarial QA: PASS WITH FINDINGS, high confidence; no high or medium issue remains.
  See [QA receipt](../context-notes/release-receipt-gate-fix-delta-targeted-qa-25a33930.md).
- Repository gate: `npm run check` exit 0 on the exact SHA. The first sandboxed attempt failed
  because the harness denied required `127.0.0.1` listeners (`listen EPERM`); the same unmodified
  SHA passed outside that listener restriction.
- Remaining low defense-in-depth observation: a job-local attacker with filesystem and token
  control could tamper with a shape-valid publication plan before the final proof rejects
  publication. That prerequisite already amounts to controlling the `contents:write` job. A
  future hardening pass may pass the dispatch draft id separately and recheck delete membership.
- This task remains `in_progress` until Brian's PR/merge gate completes. Human PR review must
  verify `.github/release-allowed-signers` contains exactly the intended Brian and Mike key lines.
  P5B remains the next dependent task; P5S and continuous staging follow it.
