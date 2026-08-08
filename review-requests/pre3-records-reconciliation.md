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
timestamp: '2026-08-08T14:51:05.763Z'
---
# Context

**In plain terms: our written records say the current published version is pre.2, but the
registry says pre.3. This request asks you to approve three small corrections so the records
match reality again.**

How the drift happened: `0.1.0-pre.3` was published manually on 2026-08-03 — BEFORE the release
contract and its machinery existed — and `latest` was interactively pointed at it. But pre.3 was
built from code that predates the contract features (the `aslite version` identity command and
the update check), so it is a second "bootstrap" release (a plain build that helps users get
started, but not yet a release that carries the new version/update machinery). The program's
records were written as if pre.2 were still current:

- `decisions/version-update-contract` section 1 still names `0.1.0-pre.2` as the canonical
  current public release; `designs/version-update-domain-model` invariant 4 says the same.
  (*Canonical* here just means "the one official answer to 'what version are users getting?'")
- `tasks/first-contract-release-prep` (R6A — the task for shipping the FIRST release that
  actually contains the contract machinery) still plans to publish under the number
  `0.1.0-pre.3`. That number is now taken by the non-contract build, so the first contract
  release must be `0.1.0-pre.4`.
- `tasks/bootstrap-pre2-upgrade-proof` (E7A — the task that proves a real user can UPGRADE
  cleanly from an old version to a new one) frames the proof as "upgrade from pre.2". Real test
  users may now be on pre.3, since `latest` points there — so the proof should cover upgrading
  from pre.3 too.

Registry ground truth as of 2026-08-08: published versions are pre.1, pre.2, pre.3; both install
channels (`latest` and `next` — the npm labels that decide what a plain install vs an opt-in
"give me the newest" install delivers) point at pre.3; the source tree also says pre.3. The new
automated policy check (`release:audit-tags`, merged via PR #219) confirms this REGISTRY state is
healthy and allowed — the mismatch is only in the PROSE of the records, not in anything running.

# Requested decision

**In plain terms: three record corrections — update two documents to say pre.3 is current,
retarget one task to pre.4, and widen one proof to cover pre.3. Nothing about how releases work
changes here.**

Approve (or amend) the following, applied by your program's convention — either you/Codex apply
them, or approve and we apply with attribution:

1. Contract section 1 + domain-model invariant 4: canonical current public release becomes
   `0.1.0-pre.3`, with one added sentence noting pre.3 is a second bootstrap release (no
   contract code) published manually before the staged release machinery existed.
2. R6A (`first-contract-release-prep`): target version becomes `0.1.0-pre.4`; everything else
   about how that release is staged and promoted is unchanged.
3. E7A (`bootstrap-pre2-upgrade-proof`): widen the upgrade proof to also cover starting from
   pre.3 (title/scope wording is your call).

Note: a SEPARATE decision about release cadence (how often we publish) was ratified by Brian on
2026-08-08 and is shared with you as an informational notice
(review-requests/cadence-continuous-staging) — deliberately not mixed into this request, which is
purely "make the records true."

# Acceptance criteria

- The three records above state the pre.3 reality and the pre.4 target; no other contract
  semantics change under this request.
- The automated policy check stays green after the edits (it reads code and the registry, not
  prose — this is a records-only change).
- The edit is attributed and linked back to this Review Request.

# Reviewer response

(awaiting reviewer)

[reviews task](../tasks/first-contract-release-prep.md)
