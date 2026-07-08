---
type: Task
title: 'U2 cursor + awareness state module: opaque cursor + cache + marker'
status: done
priority: '1'
description: >-
  U2 SHIPPED (builder-u2, feat/sync-cursor-store). NEW
  packages/cli/src/cursor.ts — the per-bundle sync/awareness state store: opaque
  {tier, token} cursor (unknown tiers round-trip UNTOUCHED; token is
  string|number so the future {tier:d1, token:seq} swaps in with zero CLI
  changes), the awareness cache (enriched delta rows {docId, verb, kind, title,
  actor-from-frontmatter} + unpushed/uncommitted backstop counts + updatedAt +
  honest note field), and the timestamped board-pending marker (refreshMarker
  per pull step) — all three under ONE per-bundle key (bundleKey: repo remote
  URL + subpath, normalized; fallback absolute bundle root) in
  ~/.agentstate/sync/<sha256(key)>.json, with the key ALSO stored inside the
  file so a hash collision reads as foreign (null), never another bundle's
  state. Atomic 0600/0700 writes via writeFileAtomic0600 EXTRACTED-shared from
  credentials.ts (ONE discipline, no fork). Reads NEVER throw:
  absent/malformed/foreign/unreadable/stale-past-maxAgeMs all read null,
  per-section independent (home's double-guard safe). recordReanchor()
  atomically re-anchors the cursor and records REANCHOR_NOTE 'delta unavailable
  (history rewritten)' with an empty delta + caller's backstop counts — never
  silent, never fatal. NO git in the module (U1 boundary honored; existence
  guard stays the caller's job). Tests: 13 new in
  packages/cli/test/cursor.test.ts (dangling-SHA re-anchor over the U0 harness;
  cross-bundle isolation over TWO DISTINCT ORIGINS per the U0 reviewer note;
  atomic+perms 0600/0700; malformed/absent/stale->null; tier opacity;
  cache+marker schema round-trip incl. frontmatter-sourced actor rows). CLI
  suite 418->431 green; npm run check exit 0. Caveats: (1) AwarenessDeltaRow is
  defined HERE as the single-feed shape — U1's changesSince should import it at
  merge time, reconcile if U1 defined its own; (2) cross-process merge-writes
  are last-writer-wins (crash-consistent via rename; same acceptance as
  FilesystemBackend — state is re-derivable from git); (3) plugin manifests
  bumped 1.0.11->1.0.12 (the credentials refactor changes the committed bundled
  mjs) — collision risk with parallel unit PRs, re-check at merge. Deps:
  sync-test-harness.
assignee: builder-u2
timestamp: '2026-07-07T23:12:35.379Z'
---
# U2 — cursor + awareness state module

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U2. Reuses `credentials.ts` atomic-write machinery.

## Definition of done

NEW `packages/cli/src/cursor.ts`. `packages/core` untouched.

- Opaque `{tier, token}` cursor (git tier = SHA; future D1 tier = `{tier:"d1",
  token:<seq>}` behind the SAME `changesSince` interface — CLI stays tier-agnostic).
- Keyed per BUNDLE (repo remote URL + subpath; fallback: absolute bundle root — NOT
  per-machine).
- Atomic 0600/0700 writes reusing `credentials.ts` (O_EXCL temp → chmod → rename).
- This ONE module also owns the AWARENESS CACHE and the BOARD-PENDING MARKER — cursor +
  cache + marker under one per-bundle key, same atomic discipline; the marker is
  timestamped and refreshed by every pull step.
- Existence guard + re-anchor: `git cat-file -e` before diffing; on miss → re-anchor to
  HEAD + report "delta unavailable (history rewritten)" — NEVER a silent skip, never fatal.
- The enriched `changesSince` (actor PER-DOC FROM FRONTMATTER, adjudication F) is THE single
  feed producer for both faces and the future activity feed.
- `home` treats absent/stale/malformed cache-or-marker as null inside its existing
  double-guard — marker absence ALONE never produces "run init".

## Acceptance criteria (tests, deps: U0)

- dangling-SHA re-anchor honest note (never fatal, never silent skip)
- cross-bundle isolation (two bundles → distinct keys, no leakage)
- atomic-write / permissions (0600 file, 0700 dir)
- enriched-delta shape with actor sourced from frontmatter

## Gates

Builder → independent Reviewer → QA. Deps: sync-test-harness (U0).

[depends on](sync-test-harness.md)
