---
type: Task
title: >-
  Awareness cache keyed per remote overwrites across clones (PR#13 review, item
  4)
status: done
priority: '1'
description: >-
  CLOSED: sync state keyed per CLONE (remote URL + subpath + checkout root).
  Cross-clone isolation driven end-to-end: B's stranded 'unpushed: 2' backstop
  survives A's clean sync under ONE HOME.
actor: builder-cache
assignee: brian-claude
timestamp: '2026-07-08T19:55:58.854Z'
---
Driven evidence (PR#13 panel, empirical): clone B had 2 stranded unpushed commits
(cache unpushed: 2); a clean sync in clone A reset the SHARED cache to unpushed: 0 —
the backstop fails exactly on its target case. The founders' agent-worktree pattern
makes same-machine multi-clone the NORM, not an edge.

DoD: cache/cursor/marker keying includes the checkout identity (bundle root path, or
remote + checkout path — decide with U2's canonicalization caveats in mind: the
ssh-vs-https false-split and .git-strip false-merge recorded on tasks/sync-cursor-store).
Cross-clone isolation test: B's stranded state survives A's clean sync. Coordinate with
tasks/sync-sessionstart (reads these keys) and note the cursor migration story for any
existing state files.

## Record (shipped)

KEYING SHAPE: remote URL + subpath + CHECKOUT ROOT (the board worktree's realpath), one
key for ALL state (cursor, cache, marker, conflict-exports dir); path fallback unchanged.
Why: every piece is a per-CLONE fact — the cursor is one checkout's HEAD watermark, the
unpushed/uncommitted backstop counts are computed against one worktree, and the delta rows
derive from the per-clone cursor. The marker (arguably per-remote-shareable) was NOT split
onto a shared key: no shipped consumer yet (U4), its contract already treats absence as
"unknown, never an error", and a second keyspace would reintroduce the cross-clone file
coupling this fix removes. The remote-URL component is KEPT so a recycled checkout path
(new project cloned at an old clone's location) reads stale state as foreign. Bonus fix:
two clones' conflict EXPORTS no longer share a directory either (previously one clone's
export could overwrite the other's pending 'yours' file).

U2 CAVEATS: unchanged normalization; both caveats are now LESS load-bearing — ssh-vs-https
false-split only bites when the SAME checkout's origin spelling changes (state honestly
re-derives from the first-sync baseline); .git-strip false-merge can no longer merge two
different clones' state (roots differ), only the same checkout across a repo<->repo.git
flip, which IS the same bundle.

MIGRATION: ignore-and-reanchor, documented in cursor.ts's module header. Old remote-only-key
files are never read again (the foreign-key-inside-file guard makes even a renamed file read
as absent); they sit as small orphaned JSON under ~/.agentstate/sync/. All state re-derives
from git: first post-upgrade sync falls back to the pre-sync-HEAD baseline (same shape as a
fresh clone's first sync) and counts recompute every run. No cleanup sweep — deleting files
we cannot positively attribute is riskier than leaving them.

TESTS: 536 CLI tests green (full check green across all suites: 536+225+5+4+117). New:
cross-clone isolation (two clones, ONE origin, ONE HOME; B strands 2 commits via a rejecting
pre-receive hook — the exact empirical shape; A's clean sync; B's unpushed:2 + cursor
survive; keyA != keyB) — verified to FAIL under the old shared keying (temporarily reverted
the key derivation; the test caught it); same-clone key stability (syncs from repo root, a
subdirectory, and board-interior all reuse ONE state file, cursor readable under the derived
key); sync-level dangling-cursor re-anchor under the per-clone key (honest note through the
REAL sync flow — also proves resolveBundleKey and the store agree on keys end-to-end).
Updated: bundleKey unit tests (+ per-clone distinctness + recycled-root case), cross-bundle
isolation (now also asserts same-origin-other-clone gets a DIFFERENT key), sync/sync-conflict
key constructions.

HONEST CAVEATS: (1) U4's SessionStart/home (unshipped) inherits per-checkout semantics —
"since THIS CHECKOUT last synced"; a brand-new clone has no marker until its first pull, so
first-contact detection must stay probe-gated (the confirmed detection-gated provisioning
rider), never marker-only. (2) checkoutRoot is realpath'd at the sync call site (realOrSame),
not in the store — a future non-sync caller behind symlinks must realpath before keying (doc'd
on bundleKey). (3) Orphaned pre-fix state files are left in place by design.

Version: 1.0.19 (both manifests). NOTE: parallel branch roadmap-recipe may also claim 1.0.19
— orchestrator reconciles at merge.
