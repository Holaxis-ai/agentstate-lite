---
type: Plan
title: 'Implementation plan: continuous per-merge staging (gated; post-ratification)'
actor: anthropic/claude
timestamp: '2026-08-08T13:38:48.830Z'
---
# Goal

Implement ratified decisions/release-cadence-continuous-staging: every merge to main auto-builds
and STAGES a retained release candidate; publication stays interactive human 2FA in batches;
stable cuts deliberate. NOTHING here changes workflows until the prerequisite chain clears.

# Mechanics (from the ratified decision's delegated questions)

1. **Trigger + serialization**: new merge-triggered job (or extension of release-staged.yml) with
   a concurrency group serializing candidate builds; runs AFTER ci-version-bundle to avoid racing
   the bot's push-back commit.
2. **Version minting (staging lane only)**: candidate builder computes newest published pre.N + 1
   from the registry (the audit gate's fetch/classification primitives are reusable); the minted
   version is written into the PACKED manifest only — never committed to main (no second
   bot-commit channel; avoids the P5B collision). release-candidate.mjs's manifest-agreement
   check gains a minted-manifest mode for auto-staged candidates; human-tagged stable flow
   unchanged.
3. **Rejected candidates**: a staged-but-rejected candidate never publishes; its N is REUSED by
   the next candidate (keeps the published series contiguous per the audit's scheme check).
4. **Phase semantics**: release/phase.json gains the continuous-staging at-rest-like state
   ("candidates staged, awaiting batch approval") so the audit gate treats steady-state staging
   as at_rest-equivalent, not a blocking transaction. Coordinate with the audit gate's
   declaration cross-validation: auto-staged candidates are NOT declared in phase.json (it stays
   the HUMAN transaction ledger); the audit's staged-visibility assumption (staged versions
   absent from public packument) makes this coherent — verify against real npm staging behavior
   during rollout.
5. **Batch finalize UX**: finalize remains release-finalize.yml per candidate; add an operator
   runbook for batch approval (approve newest, reject/skip superseded — their numbers recycle).
6. **Identity**: every auto-staged candidate carries the full retained-artifact identity chain
   (SHA, integrity, workflow run) exactly as deliberate candidates do — no assurance reduction.

# Prerequisite chain (build order, nothing enabled early)

PR #219 merged (audit gate; awaiting external re-review of 9fef1e3) -> p5a-pre-live-hardening
(split: assertToken one-liner now; signed-receipt reconciler gate as its own unit) -> P5B
(release-protection-bot-bridge) -> P5S (release-protection-setup — Brian/Mike ~30min human
session: release environment, ASLITE_RELEASE_LIVE_ENABLED, branch/tag protection, trusted
publisher, 2FA) -> dry-run the continuous-staging lane -> enable live.

# Assurance

High-risk tier (release machinery): builder -> independent review -> adversarial QA on the
staging lane (racing merges, rejected-number reuse, minted-manifest agreement, registry
unavailability mid-mint), plus external-team review invited per the PR #219 precedent (cross-team
review has caught disjoint failure classes twice in this program).

# Status

Plan recorded 2026-08-08 post-ratification. BUILD NOT STARTED — first buildable unit is the p5a
assertToken split once PR #219 merges.

[implements](../decisions/release-cadence-continuous-staging.md)

[planned by](../plans/release-conventions-program.md)
