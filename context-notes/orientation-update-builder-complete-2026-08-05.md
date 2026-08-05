---
type: Context Note
title: Orientation update builder repaired at 8056f52
description: >-
  Builder implementation, exact-SHA review repair, and verification handoff for
  the replacement orientation-update candidate.
actor: codex-orientation-builder
timestamp: '2026-08-05T21:51:53.991Z'
---
# Summary

The orientation-update implementation and exact-SHA review repair are complete on
`feat/orientation-update-notice` at replacement candidate SHA
`8056f525766551556dedb31928d09e821fc4a58e`.

## Goals

- Ultimate: make shared, versioned, conflict-safe Markdown memory installable and useful without
  founder intervention.
- Proximate: provide a cached, nonblocking supported-release orientation on default human startup
  surfaces without adding registry latency, changing machine output, or trusting unsafe local state.

## Implemented

- A strict private update-cache and lease owner under `~/.agentstate`, including exact schemas,
  SemVer/result validation, 24-hour cache/attempt windows, private ownership/mode checks,
  handle-based bounded nonblocking reads, hard-link no-replace claims, continuous stale-lease
  replacement, token-scoped cleanup, and authority revalidation before cache commit.
- Default TOON `home`/`session-start` rendering can show one exact five-field cached notice and
  launch an exact detached private worker without awaiting npm. JSON, help, `--no-update-check`,
  and presence of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` perform no passive update
  work.
- The hidden worker reuses the existing exact latest-track update authority, writes only successful
  validated results, and converts unavailable attempts to cooldown state.
- CLI help, reference data, generated skill text, privacy wording, and test/mutation harness
  suppression are aligned with the new behavior.
- After the first exact-SHA review exposed an expired-cooldown ABA process-start race, the parent
  now revalidates its matching, unexpired fixed-path active token immediately before detached spawn.
  Lost authority returns without cleanup, because even token-scoped quarantine would briefly move
  a successor's record. A deterministic cleaner-C / parent-A / parent-B IPC barrier test proves
  parent B starts exactly one worker, parent A starts none, and B's successor lease is preserved.

## Verification

- Orientation owner suite: PASS, 22/22, including the deterministic ABA regression.
- Focused owner/home/session-start/update/version batteries: PASS, 120/120.
- Root `npm run build`: PASS.
- Root `npm run typecheck`: PASS.
- Generated skill check (`npm run check:skill -w @holaxis/aslite`): PASS.
- Offline npm package proof (`ASLITE_NO_UPDATE_CHECK=1 npm run verify:npm-package`): PASS.
- Full repository gate (`ASLITE_NO_UPDATE_CHECK=1 npm run check`): PASS after the final
  no-successor-touch correction, including the UI E2E gate.
- Final staged `git diff --check`: PASS; cumulative branch scope is 11 files, 2,194 insertions and
  28 deletions.
- Branch pushed to `origin/feat/orientation-update-notice`; worktree clean after commit.

## Review focus and residuals

The first exact-SHA review finding is repaired with deterministic regression coverage. No known
builder finding remains. Replacement SHA `8056f525766551556dedb31928d09e821fc4a58e` requires mandatory
independent exact-SHA re-review before adversarial QA. Review should concentrate on the repaired
cleanup/claim/spawn authority boundary, private-route argv exactness, global flag routing, and the
claim that every JSON/suppressed path performs zero update-state or process work. No bundle sync,
PR action, GitHub comment, merge, or unrelated init-target-safety change was performed by this
builder.

[task](../tasks/orientation-update-notice.md)

[approved implementation plan](../plans/orientation-update-notice-implementation.md)

[normative protocol](../designs/version-update-protocols.md)
