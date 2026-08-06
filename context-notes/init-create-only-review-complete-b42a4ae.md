---
type: Context Note
title: init --create-only review PASS at b42a4ae — QA in flight
actor: claude/brian-claude
timestamp: '2026-08-06T00:08:42.855Z'
---
# Summary

Independent review of the [[tasks/init-target-safety-guard]] unit is COMPLETE: verdict PASS at
final SHA `b42a4ae` (branch feat/init-create-only). Three rounds, all by one reviewer agent with
context intact, each at an exact SHA in an isolated worktree with npm ci + root build. Adversarial
QA is running at the same SHA; PR opens after its verdict.

# Round record (findings per stage, for the ladder's epistemics)

- Round 1 at e84a66e: pass-with-caveats. 1 MEDIUM (stat-following exists() misrouted the
  dangling/looping-symlink family to raw exit-1), 6 LOW (unreachable CAS mapping, TOCTOU
  coverage, dead branch, message precision, tarball-probe overclaim, criterion-9 adjudication).
  Reviewer attacks that survived: 8-way true-parallel race x5 (one winner each), binding through
  symlink, trailing slash, dot-dot, APFS case-variant, symlink-to-bundle, byte-preservation
  audited via SHA-256+mode across all refusal classes.
- Round 2 at a438c5f: PASS; all 7 round-1 findings verified closed empirically; criterion-9
  adjudication AGREED. 2 new LOWs (through-a-file raw error; race-loser wording).
- Round 3 (delta confirm) at b42a4ae: CONFIRMED, no new findings; through-a-file refusal
  verified sound in mechanism; race wording verified discriminating across three fresh 8-way
  race rounds. Verdict: PASS.

Find-rate note: every round found something real until the last — the stage is earning its
place for this change-type (destructive/create boundary).

# Remaining gate

- [[tasks/flaky-timing-test-cluster]] filed (4 distinct load-sensitive tests across two agents'
  full-suite runs).
- QA (interruption battery, novel race shapes, hostile filesystem states, built CLI) in flight.

[reviews](../tasks/init-target-safety-guard.md)
