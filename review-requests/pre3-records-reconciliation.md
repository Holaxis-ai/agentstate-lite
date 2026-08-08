---
type: Review Request
title: >-
  Reconcile release records to pre.3 reality (contract canonical version,
  R6A->pre.4, E7A proof matrix)
status: requested
reviewer: mike
requested_by: brian
question: >-
  Approve the three record corrections aligning the ratified release docs with
  the published pre.3 registry state?
actor: anthropic/claude
timestamp: '2026-08-08T00:39:04.266Z'
---
# Context

The release program's ratified records have drifted from registry reality, and the drift traces to
a manual publish that predated the contract machinery: `0.1.0-pre.3` was published 2026-08-03
(and `latest` interactively promoted to it), but it does NOT contain the contract code (U3
`version --check`, N4) — it is a second bootstrap release, not the planned R6A "first
contract-bearing release". Meanwhile:

- `decisions/version-update-contract` section 1 still names `0.1.0-pre.2` as the canonical
  current public release; `designs/version-update-domain-model` invariant 4 says the same.
- `tasks/first-contract-release-prep` (R6A) still targets version `0.1.0-pre.3` — a number that
  is now TAKEN by a non-contract build. R6A's release must be `0.1.0-pre.4`.
- `tasks/bootstrap-pre2-upgrade-proof` (E7A) frames the upgrade proof as "bootstrap from pre.2";
  real test users may now be on pre.3 (it is `latest`), so the proof matrix should include
  pre.3 -> pre.4 (and arguably pre.2 -> pre.4).

Registry ground truth (2026-08-08): published = pre.1, pre.2, pre.3; latest == next == pre.3;
source `packages/cli/package.json` == 0.1.0-pre.3. The new `release:audit-tags` gate (under
review on feat/release-tag-audit) verifies this state PASSES the contract's at-rest policy — the
drift is in the PROSE records, not the registry state.

# Requested decision

Approve (or amend) the following record corrections, applied by your program's convention —
either you/Codex apply them, or approve and we apply with attribution:

1. Contract section 1 + domain-model invariant 4: canonical current public release -> `0.1.0-pre.3`,
   with one sentence noting pre.3 is a second bootstrap release (no contract code) published
   outside the staged machinery before it existed.
2. R6A (`first-contract-release-prep`): target version -> `0.1.0-pre.4`; expected `next` staging
   and promotion flow unchanged.
3. E7A (`bootstrap-pre2-upgrade-proof`): widen the bootstrap-upgrade proof to cover pre.3 as a
   starting point (title/scope update as you see fit).

# Acceptance criteria

- The three records above state the pre.3 reality and the pre.4 target; no other contract
  semantics change under this request (cadence changes are a SEPARATE upcoming proposal).
- `release:audit-tags`' source-drift check remains green after the edits (it reads code + registry,
  not prose — this is a records-only change).
- The edit is attributed and linked back to this Review Request.

# Reviewer response

(awaiting reviewer)

[reviews task](../tasks/first-contract-release-prep.md)
