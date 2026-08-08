---
type: Context Note
title: >-
  HANDOFF to Codex: release-receipt-gate (p5a) — built + reviewed, needs QA +
  Brian's rulings + merge
actor: anthropic/claude
timestamp: '2026-08-08T16:27:02.385Z'
---
# Summary

HANDOFF to a Codex team: pick up the release-receipt-gate unit (the substantive half of
`tasks/p5a-pre-live-hardening`) and carry it through QA -> merge, then continue the release
program. A branch is BUILT and passed independent review with findings; the remaining work is
Brian's two rulings, one review finding to close, adversarial QA, and merge. Claude (Fable 5) is
handing off because the safeguard classifier repeatedly flags the *security-QA sub-agent dispatch*
for this unit (forge/tamper/replay signed-artifact vocabulary reads as offensive-security);
Fable cannot reliably dispatch that QA. A Codex team on a different harness should have no such
trouble. Program roadmap: `plans/release-conventions-program`.

# What this unit is (plain)

A verification step added to the release finalize workflow. Before publishing, the workflow checks
for "receipts" — small JSON records, signed with an operator's GitHub SSH key and attached to the
draft release, attesting a named operator (Brian or Mike) downloaded the staged tarball and
confirmed its checksum. Tiered: prerelease inspection receipt is OPTIONAL (absence publishes with a
permanent public "published without inspection receipt" stamp); stable requires it. Present-but-
invalid evidence is always rejected. Full design + rationale: the phase-1 design report and phase-2
build report are in the session transcript; the ratified decisions are recorded on
`tasks/p5a-pre-live-hardening` (the "Design decisions (Brian, 2026-08-08)" section).

# Current state — the branch

- Branch `feat/release-receipt-gate` @ `4b905b3f` (single commit, base origin/main `730a2d85`;
  pushed, NO PR opened). Built in worktree; 14 files, +1314/-24.
- New: `scripts/release-ordering.mjs` (pure policy + payload canonicalisation + tier logic +
  `evaluateOrdering` replaying `release-state.mjs` `reconcile()`), `scripts/release-verify-ordering.mjs`
  (workflow adapter: ssh-keygen -Y verify against committed allowed-signers, receipt selection,
  stamp materialisation), `scripts/release-inspect.mjs` (operator emission tool, single + batch),
  `.github/release-allowed-signers`, `scripts/release-ordering.test.mjs`.
- Modified: `.github/workflows/release-finalize.yml` (new read-only `ordering-verified` job ->
  needs-chain -> `registry-verify` -> `finalize`; finalize re-verifies pre-publish then
  stamp-then-publish); `release-receipts.mjs` + `release-verify-chain.mjs` (two-asset rule widened
  to core-two + `receipt-(inspected|approved|status)-<stageId>.json` extras only); `release-emit-
  receipt.mjs` (instructions lead with the signed-emission command); `release-state.mjs` +
  `release-reconcile.mjs` header caveats corrected (now wired; the overstated approval-gap claim
  fixed); tests extended; `package.json` registers the new suite in `test:scripts`.
- Gates on the branch: `npm run check` exit 0; live `release:audit-tags` exit 0; scripts suites
  203/203 (per independent review's own re-run).

# Decisions Brian RATIFIED (already recorded on tasks/p5a-pre-live-hardening)

1. Tiered: prerelease inspection recommended + publicly stamped when absent; stable strictly
   required; invalid/forged evidence always red.
2. Signing: operators' existing GitHub SSH keys via `ssh-keygen -Y`; keys in committed
   `.github/release-allowed-signers` (principals `briand-ai`, `mikec-ai`, namespace
   `aslite-release-receipt`).
3. Receipts + stamps stay PUBLIC on the published release (aligned with npm-provenance / Sigstore
   public-attestation convention).
4. No second GitHub approval button — the one human approval remains npm 2FA `stage approve`.

# OPEN — needs Brian's ruling before merge (from the independent review)

1. **SAME-ACTOR rule (undisclosed policy tightening — Brian never approved this).** The builder
   added a rule that the operator who inspects must be the SAME operator who approves. It blocks a
   "Brian inspects, Mike approves" split in EVERY tier (on prerelease it is present-but-invalid, so
   it hard-blocks rather than stamping). It is enforced both in `evaluateOrdering`
   (release-ordering.mjs ~196-198) AND structurally by `release-state.mjs mergeIdentifiers` treating
   `actor` as one immutable ledger key. The ratified protocols text (`designs/version-update-
   protocols` section 5) says "Brian or Mike" INDEPENDENTLY at each state — i.e. it PERMITS
   cross-operator. DECISION: keep same-actor (simpler, "approver attests their own inspection") or
   relax to allow cross-operator (matches ratified text; relaxing means changing the normative
   state machine's per-state actor keys, not just the gate). Ask Brian in plain language.
2. **run_id dropped from the receipt binding tuple (disclosed deviation, reviewer verified SOUND).**
   Payload binds `stage_id + version + tarball_sha256 + draft_release_id` (run_id omitted). Reviewer
   confirmed uniqueness holds and it keeps receipts valid across finalize re-dispatches. Just needs
   Brian's acknowledgment; no code change required.

# Review FINDING to close (medium) — in this unit or a recorded follow-up

The widened two-asset rule tolerates ANY `receipt-status-<stageId>.json` (and arbitrary bytes under
a receipt-shaped name) as an extra draft asset without validating it. Consequences: a party with
`contents:write` can upload a FORGED status stamp (e.g. falsely "published without inspection
receipt") that is never validated and rides onto the immutable published release permanently;
stamps are UNSIGNED so a reader cannot distinguish workflow-emitted from forged. Pre-change, ANY
extra asset refused publication. Suggested fix (reviewer): the pre-publish re-check should red on
any `receipt-status-<currentStageId>` asset it did not itself emit, and either signature-verify or
refuse unconsumed receipt-named assets rather than blanket-tolerate the name shape. Lesser related:
receipt/stamp uploads target release by TAG while body PATCH targets draft by ID (multi-draft-per-
tag divert risk — upload by release ID closes it); a failed live finalize leaves a name-colliding
stamp asset the operator must delete. Decide: fix in-unit vs. follow-up task.

# QA status — DONE, pass-with-findings (adversarial QA already ran)

The adversarial QA pass COMPLETED (agent qa-receipt-gate, branch 4b905b3f, offline, real
ssh-keygen signatures from throwaway keys against a fixture allowed-signers file; committed
`.github` untouched). Baseline suite 203/203 green after `npm ci`. VERDICT: pass-with-findings —
every documented policy row behaves as specified end to end through the real adapter subprocess
(`release-verify-ordering.mjs`) and the operator tool (`release-inspect.mjs` with stub gh/npm).
Evidence JSON was preserved in that worktree's scratchpad `qa/` (adapter-report.json,
inspect-report.json, logs); the worktree is
`/Users/brian/GitHub/agentstate-lite/.claude/worktrees/agent-a199ec4215e0c8a17` — copy the
evidence out before it is reaped if you want it. So the Codex team does NOT need to re-run the
full adversarial matrix; it needs to CLOSE the findings below and re-verify the fixes.

Rows verified MATCH: tier behaviour (pre both/missing-inspection/missing-both stamp correctly;
stable missing-either reds); all invalid-evidence cases red in both live and dry-run with no result
file (unlisted key, wrong namespace, altered payload, each binding-field mismatch, uploader !=
signed actor incl. github-actions[bot], upload-after-run-start, approval-before-inspection,
cross-actor); stale sibling-stage receipts ignored not consumed, and renaming one to the current
name still reds on binding; checksum disagreement -> `inspection_mismatch` (refused, not tolerated);
operator tool emits only on match, prints reject command + uploads nothing on mismatch, batch mode
works, no half-written receipt; idempotence byte-identical; dry-run tolerates absence but still reds
present-but-invalid.

QA findings (fold into the "next steps" work):

- **M1 (medium) = the review's asset-tolerance finding, now EMPIRICALLY CONFIRMED.** A draft
  carrying a forged `receipt-status-<currentStageId>.json` (falsely "published without inspected
  receipt"), plus arbitrary binary under `receipt-inspected-<token>.json` and a sibling
  `receipt-status-0000.json`, passes every gate: chain accepts (AUX regex filters them; a control
  `evil.tgz` still reds on exactly-two), verify exits 0 approved_public, the result never mentions
  them, and they ride onto the immutable published release. Forged stamp is BYTE-INDISTINGUISHABLE
  from a genuine one (genuine stamps are UNSIGNED JSON, same schema/name; provenance is only the
  asset's GitHub uploader/timestamp, not in the file) — so a release that truly had both receipts
  verified can carry an authoritative-looking machine record saying it published unreceipted.
  Boundary: only `receipt-<inspected|approved|status>-<token>.json` names qualify; garbage under the
  CURRENT stage's inspected/approved name IS consumed and reds ("not valid JSON"). Precondition:
  `contents:write` on the draft — integrity-of-record inside the trust boundary, NOT an approval
  bypass. Fix options: (a) in-unit — verify reds (or warns) when a current-stage `receipt-status`
  asset exists that the workflow did not emit, and/or restrict tolerated extras to KNOWN sibling
  stage ids; (b) follow-up — record that stamps are unsigned-by-design, provenance is uploader
  metadata. RECOMMEND (a): the whole point of this unit is a trustworthy published record.
- **L1 (low, empirical).** `release-inspect.mjs` mismatch path leaks its scratch TMPDIR
  (`aslite-release-inspect-*`) containing the downloaded MISMATCHING tarball, because
  `process.exit(1)` inside the try skips the `finally` rmSync. No half-written receipt (contract
  holds); it is temp hygiene + untracked suspect bytes left on the operator's machine. One-line fix
  (throw / set exitCode instead of `process.exit`, or clean before exit).
- **L2 (low-medium, reasoned — gh not exercised offline).** The finalize stamp upload runs
  `gh release upload "v$VERSION" ...` WITHOUT `--clobber`; a live run that uploads the stamp then
  fails before completing cannot be retried (asset-name collision), and this is the same mechanism
  that turns M1's pre-planted forged `receipt-status` into a finalize-blocker. Add `--clobber` (or
  skip-if-present) to that one upload.

- **MATRIX-EXPECTATION DIVERGENCE for Brian to confirm (not a bug).** "Approval receipt present with
  NO inspection receipt" does NOT stop a PRERELEASE run — it publishes with a `verified [approved]`
  receipt AND a stamp saying "published without inspected receipt" (coherent, matches ratified
  policy; stable still reds). QA flagged it only because it is a slightly odd published shape worth a
  conscious yes. Fold into Brian's ruling list.

The neutral-worded QA contract (for reference / re-run) is saved at
`/private/tmp/claude-501/-Users-brian-GitHub-agentstate-lite/5a44a08f-aebe-49f8-981f-258f2dd3406e/scratchpad/qa-contract-neutral.md`
(session-local; reproduce from this note if gone).

# allowed_signers — Brian must VERIFY at PR review (human-owned input)

Seeded from https://github.com/briand-ai.keys and https://github.com/mikec-ai.keys at build time;
reviewer confirmed they byte-match those endpoints. Brian's PR review IS the verification act:

    briand-ai namespaces="aslite-release-receipt" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF3Y1oo4fO3sTtSNLqsf7+FM9n7wzrAxQUGM3bDW74HY
    mikec-ai  namespaces="aslite-release-receipt" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE6kKEpqRTC2EOt2FQ6xCtL2KVQtPTFnisk84inUTonm
    mikec-ai  namespaces="aslite-release-receipt" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE/TQzVCZMmwdevrwZdjxWcSqIWUzujU8G9U8h0RT3bn

# Next steps for the Codex team (order)

1. Get Brian's ruling on: same-actor rule (open item 1) + run_id ack (open item 2) + the
   approval-without-inspection prerelease shape (QA divergence, above).
2. Apply fixes in ONE reviewed unit: same-actor per his call; M1 asset-tolerance (recommend fix
   in-unit); L1 inspect-scratch leak (one line); L2 stamp-upload `--clobber`. A risky mechanic and
   the test that pins it ship in the SAME unit — add red-testable fixtures for M1 (forged status
   asset reds) and L1 (mismatch path leaves no scratch).
3. Adversarial QA ALREADY RAN (pass-with-findings — see QA status). Do NOT re-run the full matrix;
   after applying the fixes, re-verify the fixed rows red/green and get ONE independent review of
   the fix delta on the exact SHA. This is a security boundary — still INVITE external-team review
   on the PR (external review has caught disjoint failure classes twice in this program — PR #219
   findings 1 & 2).
4. Open the PR in Brian's format (## Summary / ## Safety and compatibility / ## Validation, plain
   ASCII), call out the allowed_signers list for his verification. Brian opens/merges his PRs; do
   not merge for him. Fix rounds on an open PR are APPENDED commits, never amends.
5. After merge: p5a is done. Then `tasks/release-protection-bot-bridge` (P5B), then
   `tasks/release-protection-setup` (P5S — irreducibly Brian/Mike, ~30 min: `release` environment,
   `ASLITE_RELEASE_LIVE_ENABLED=true`, branch/tag protection, trusted publisher, 2FA), then dry-run
   the continuous-staging lane, then enable live. Continuous-staging implementation plan:
   `plans/continuous-staging-implementation`.

# Program context the Codex team needs

- Cadence model c (per-merge auto-STAGE, batched human finalize) is RATIFIED by Brian alone:
  `decisions/release-cadence-continuous-staging`; contract Amendment A1 on
  `decisions/version-update-contract`. This receipt gate must COMPOSE with batched finalization
  (per-candidate receipts, batch tooling in release-inspect.mjs).
- The `release:audit-tags` enforcement gate is LIVE on main (PR #219) — do not regress it; it
  observes the registry and reds on dist-tag/version-scheme violations.
- The codex-npm program is JOINTLY OWNED by Brian + Mike ("it's ours" — Brian, 2026-08-08). Brian's
  approval suffices for its decisions; Mike is informed, not gated. Do not route routine approvals
  to Mike as a required gate.
- Registry ground truth: latest == next == 0.1.0-pre.3 (a second bootstrap release, no contract
  code). First contract-bearing release is R6A -> 0.1.0-pre.4 (`tasks/first-contract-release-prep`).

[implements](../tasks/p5a-pre-live-hardening.md)

[part of](../plans/release-conventions-program.md)
