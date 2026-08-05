---
type: Context Note
title: Orientation update builder implementation
actor: codex-orientation-builder
timestamp: '2026-08-05T21:20:10.086Z'
---
# Summary

Builder implementation for `tasks/orientation-update-notice` is complete in isolated worktree `/private/tmp/aslite-orientation-update.QiuhqB` on `feat/orientation-update-notice`; verification and exact-SHA review remain.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: ship cached, nonblocking supported-release orientation without registry latency, machine-output drift, or unsafe private-state/process behavior. The implementation now serves that goal through one private owner and narrowly gated home/session routing.

## Implemented system model

- `update-orientation.ts` strictly owns the exact cache and active/cooldown schemas, canonical times, size limits, recursively exact successful-U3 validation, five-field notice projection, handle-based nofollow/nonblocking reads, exact POSIX owner/modes, hard-link no-replace claims, continuous stale-active replacement, token-quarantine release, detached exact-entry launch, and the silent worker.
- Parent behavior is cache-first, no-wait, and post-claim cache-revalidated. Worker behavior checks matching unexpired active authority before U3 and immediately before atomic cache rename, writes only successful latest results, writes cache before releasing active, and converts unavailable/failure to the original attempt-window cooldown.
- Default bare/home/session-start TOON is eligible. JSON, `--no-update-check`, and presence of `ASLITE_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, or `CI` bypass display and all cache/lease/process work. The private route is registered only in the exact entry and remains absent from public registries/help.
- Literal pre-change TOON/JSON bytes from base SHA `164ba7edb89c31678856020ee794f80530e6c276` remain pinned. The only output addition is `update_notice` immediately after identity.
- Reference/generated npm SKILL changes and CLI test-script suppression are limited to the approved exception. The separate init-target-safety-guard lane was not touched.

## Evidence before repository gate

- New focused owner suite: 21 passing tests, including real barrier/IPC claim concurrency, continuous stale replacement, and the paused-parent interleaving.
- Approved focused five-file battery: 119/119 passing with loopback permission. Its first sandboxed run had only three existing update-check server `listen EPERM` failures; the exact rerun outside that restriction passed.
- Root/CLI builds and CLI typecheck passed during the cycle. Generated skill was regenerated from `reference.ts`.

Next: diff audit, generated/package checks, full `npm run check` to a temp log, commit/push, then independent exact-SHA Review before QA.
