---
type: Task
title: 'U2 cursor + awareness state module: opaque cursor + cache + marker'
status: todo
priority: '1'
description: >-
  U2. New cursor.ts owning the opaque per-bundle cursor plus awareness cache and
  board-pending marker; atomic 0600/0700; enriched changesSince with per-doc
  frontmatter actor. Deps: sync-test-harness.
timestamp: '2026-07-07T21:20:02.871Z'
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
