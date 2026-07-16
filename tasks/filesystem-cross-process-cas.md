---
type: Task
title: Enforce FilesystemBackend CAS across independent agent processes
status: in_progress
priority: '1'
description: >-
  Close the remaining silent lost-update window when separate CLI/serve
  processes mutate one local bundle.
actor: mike/codex
assignee: mike/codex
timestamp: '2026-07-16T03:23:00.672Z'
---
# Behavioral claim

Two independent AgentState Lite processes mutating the same local bundle cannot both satisfy the same version premise and report success while one update is silently lost.

# Why now

`FilesystemBackend` currently serializes check-then-write through a static in-process mutex. That closes concurrent HTTP clients sharing one `serve` process, but not the founder-dogfooded workflow where several agent/CLI processes write the same local board directly. The mutation-boundary audit identified this adapter limitation as the remaining broad integrity risk beneath otherwise-correct retrying consumers.

# Scope

- Design one cross-process conditional-write discipline at the filesystem adapter layer, shared by concept docs, reserved files, blobs, and deletes.
- Preserve atomic full-file replacement, content-addressed versions, expect-absent semantics, idempotent identical writes/deletes, safe path handling, and the existing `VersionConflict` contract.
- Use bounded waiting and conservative stale-lock handling; never silently steal an ambiguous live/malformed lock.
- Keep the storage seam and all semantic consumers unchanged unless a minimal adapter-neutral hook is genuinely required.
- Do not turn the bundle into a database, add a daemon requirement, or introduce arbitrary multi-document transactions.

# Verification

- A deterministic built-process test makes independent Node processes race one shared expected version and proves exactly one winner plus typed conflicts/retries.
- A higher-level cross-process `link add` or `doc update` test proves all independent changes converge without loss.
- Existing filesystem, memory, wire, CLI mutation, blob, and delete tests remain unchanged in meaning.
- Failure/timeout leaves no corrupt target or silently stolen lock; recovery behavior is explicit and tested.

[identified by](../designs/mutation-boundary-audit.md)

# Implementation ready for review

Draft PR: https://github.com/Holaxis-ai/agentstate-lite/pull/77

- All five filesystem mutation paths (`write`, `delete`, `writeReserved`, `writeBlob`, `deleteBlob`) now share one adjacent per-target cross-process critical section; the process-local queue remains the fast path.
- Active, stale, malformed, symlink-alias, and case-alias lock behavior is deterministic and fail-closed. Crash leftovers carry private owner metadata and are never auto-stolen.
- Filesystem `enforced_cas` and retained `history` are now reported independently (`true` and `false`, respectively).
- Exact commit `b60f7b6` passed the full `npm run check`, deterministic two-process CAS and five-process `link add` proofs, exact-SHA review, and an adversarial SIGKILL/recovery probe.
