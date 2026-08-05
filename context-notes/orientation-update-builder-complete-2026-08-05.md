---
type: Context Note
title: Orientation update builder complete at 21a028c
description: >-
  Builder implementation and verification handoff for the exact
  orientation-update review candidate.
actor: codex-orientation-builder
timestamp: '2026-08-05T21:28:25.367Z'
---
# Summary

The orientation-update implementation is complete on `feat/orientation-update-notice` at exact
candidate SHA `21a028c418bf30ecb72aa77a0b06a244aee769d0`.

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

## Verification

- Focused owner/home/session-start/update batteries: PASS, 119/119.
- Root `npm run build`: PASS.
- Root `npm run typecheck`: PASS.
- Generated skill check (`npm run check:skill -w @holaxis/aslite`): PASS.
- Offline npm package proof (`ASLITE_NO_UPDATE_CHECK=1 npm run verify:npm-package`): PASS.
- Full repository gate (`ASLITE_NO_UPDATE_CHECK=1 npm run check`): PASS, including 19/19 UI E2E.
- Final staged `git diff --check`: PASS; 11 scoped files, 2,060 insertions and 28 deletions.
- Branch pushed to `origin/feat/orientation-update-notice`; worktree clean after commit.

## Review focus and residuals

No known builder finding remains. The candidate still requires the planned independent exact-SHA
Review before adversarial QA. Review should concentrate on filesystem-race authority, private-route
argv exactness, global flag routing, and the claim that every JSON/suppressed path performs zero
update-state or process work. No bundle sync, PR action, GitHub comment, merge, or unrelated
init-target-safety change was performed by this builder.

[task](../tasks/orientation-update-notice.md)

[approved implementation plan](../plans/orientation-update-notice-implementation.md)

[normative protocol](../designs/version-update-protocols.md)
