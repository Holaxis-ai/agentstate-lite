---
type: Decision
title: >-
  PROPOSED: continuous per-merge staging, batched human finalization (amends the
  version-update contract)
actor: anthropic/claude
timestamp: '2026-08-08T00:45:45.278Z'
---
# Proposal (PENDING RATIFICATION by Brian + Mike)

Adopt **continuous staging with batched human finalization** ("model c"), amending
`decisions/version-update-contract`:

Every merge to `main` automatically builds, retains, and **stages** a release candidate
(`0.1.0-pre.N`) through the existing candidate -> draft -> stage chain. **Nothing goes live**:
publication (finalize/approve, with npm 2FA) remains an interactive human act, performed by
Brian or Mike **in batches at their convenience**. Stable cuts remain fully deliberate and
follow the contract's existing stable path.

Chosen over (a) full auto-publish — which would retire the human publication gate and reduce
supply-chain assurance — and (b) status quo cadence. Model c delivers "every merge is an
installable, inspectable candidate" while KEEPING the one human approval gate.

# Exact contract amendments required

1. **"Releases are on demand"** (section 2) — amended: *staging* becomes continuous (per merge);
   *publication* remains on demand. The release transaction's human steps are unchanged in kind,
   batched in cadence.
2. **"The workflow never invents or commits a version"** (section 2) — amended for the staging
   lane only: CI mints the candidate version `0.1.0-pre.(N+1)` mechanically (registry-aware,
   serialized per merge). The finalize/promote steps still never invent anything: they publish
   exactly the staged, retained candidate.
3. **Tag-as-selector** (section 2: "annotated tag v<version> selects one gate-clean main
   commit") — amended: for auto-staged candidates the selecting event is the merge commit itself;
   the workflow records the exact SHA in the candidate identity (already does). Deliberate
   (human-tagged) staging remains available and unchanged for stable cuts.
4. **At-rest `latest == next`** (section 1) — REDEFINED for the batched model: `next` = newest
   APPROVED (published) prerelease; `latest` = newest PROVEN/supported release; invariant becomes
   `latest <= next`, with equality restored at each promotion. (Under batched finalization, next
   legitimately runs ahead of latest between promotions; the old equality rule would be red
   continuously.) The `release:audit-tags` gate encodes this revised invariant.

Unchanged: the interactive-2FA publication gate; the retained-artifact identity chain per
candidate; never-overwrite/deprecate-and-replace for bad releases; the OIDC authority split
(automation may stage, only humans approve/tag/deprecate); marketplace retirement sequencing.

# Implementation questions delegated to the post-ratification plan (with recommendations)

- **Version minting mechanics**: candidate builder writes the minted version into the packed
  manifest (registry newest + 1) rather than bot-committing per-merge version bumps to main
  (avoids a second bot-push channel and the P5B collision). The tag/manifest agreement check
  adapts to the minted-manifest model for auto-staged candidates.
- **Rejected candidates and number contiguity**: a staged-but-rejected candidate never publishes;
  the next candidate REUSES its N (keeps the published series contiguous, per the audit gate's
  scheme check). Racing merges are serialized by a workflow concurrency group.
- **Phase declaration under continuous staging**: `release/phase.json` semantics extend so a
  perpetual "candidates staged, awaiting batch approval" state is a defined at-rest-like phase,
  not a transaction that blocks the audit gate.

# Prerequisites (implementation is gated; ratification is not)

Ordered: `release:audit-tags` merged (PR #219, in review) -> p5a-pre-live-hardening ->
release-protection-bot-bridge (P5B) -> release-protection-setup (P5S: environment, live flag,
protections — irreducibly Brian/Mike, ~30 min, to be scheduled) -> enable continuous staging.

# Ratification

Proposed by Brian (cadence intent) and drafted/orchestrated by anthropic/claude, 2026-08-08.
Ratifiers: Brian + Mike. Mike's review rides review-requests/cadence-continuous-staging; this
doc's title drops PENDING on approval. If Mike requests changes, amendments return here.

[amends](../decisions/version-update-contract.md)

[planned by](../plans/release-conventions-program.md)
