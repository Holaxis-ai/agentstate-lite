---
type: Review Request
title: >-
  Ratify: continuous per-merge staging with batched human finalization (contract
  amendment)
status: canceled
reviewer: mike
requested_by: brian
question: >-
  Do you ratify the model-c cadence amendment as written in
  decisions/release-cadence-continuous-staging?
actor: anthropic/claude
decision_summary: >-
  Ratified solo by Brian 2026-08-08 (his explicit call, superseding joint
  routing). This request converts to an informational notice: no approval
  needed; feedback welcome on decisions/release-cadence-continuous-staging and
  returns as an amendment.
decided_at: '2026-08-08T18:00:00Z'
timestamp: '2026-08-08T13:37:46.041Z'
---
# Context

Brian wants per-merge prerelease availability without giving up deliberate stable cuts. A full
current-state map (release-mapper report, logged on plans/release-conventions-program) showed the
idea collides with four clauses of the ratified decisions/version-update-contract, so it is a
contract amendment, not an implementation task. Brian selected model (c) — continuous per-merge
STAGING with batched human finalization — over full auto-publish (a) and status-quo cadence (b),
and chose joint Brian+Mike ratification.

The full proposal, exact amendment language, delegated implementation questions (version minting,
rejected-candidate number reuse, phase semantics), and the gated prerequisite order are in
decisions/release-cadence-continuous-staging (linked).

# Requested decision

Ratify (or amend) the proposal: every merge to main auto-builds and STAGES a retained release
candidate; publication remains interactive human 2FA approval, performed in batches; the at-rest
dist-tag invariant is redefined to latest <= next with equality restored at promotion; the
contract's four affected clauses are amended exactly as written in the proposal doc.

# Acceptance criteria

- Mike approves or requests changes on the proposal doc's amendment language (not just the idea).
- On approval: the proposal doc drops PENDING, the contract gains the amendment (linked both
  ways), and a post-ratification implementation plan is drafted before any workflow change.
- The human-2FA publication gate and the retained-artifact identity chain survive unchanged —
  any implementation that would weaken either returns to ratification.

# Reviewer response

(awaiting reviewer)

[reviews design](../decisions/release-cadence-continuous-staging.md)
