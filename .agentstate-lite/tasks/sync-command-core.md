---
type: Task
title: >-
  U3a the sync command core flow: provision/commit/pull/push/envelope + interim
  conflict guard
status: todo
priority: '1'
description: >-
  U3a. Replace the sync stub with the core flow (entry self-heal, provision,
  commit, pull, push, envelope, two empty states, push-fail) plus the INTERIM
  conflict guard. Deps: sync-git-porcelain, sync-cursor-store.
timestamp: '2026-07-07T21:20:03.074Z'
---
# U3a — the `sync` command, core flow

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U3a. String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) message pack (moments (a),
(b), (d), (f)).

## Definition of done

Replace the NOT_IMPLEMENTED exit-2 stub in `packages/cli/src/commands/sync.ts`. Flow
(`--pull-only` skips commit + push):

0. ENTRY SELF-HEAL (adjudication C): a stale mid-rebase state found at sync ENTRY is aborted
   BEFORE the commit step (a wedged worktree kills commit first, so heal must precede it).
1. provision (U1 self-heal).
2. commit (stageAndCommit; skip-empty).
3. pull — full sync: `rebase origin/board`. `--pull-only`: `merge --ff-only origin/board`
   (NEVER rebase; full sync commits first so its rebase always starts clean).
4. push.
5. envelope + awareness cache write (consumed by U4).

Envelope (`cap()`): `{committed, pulled, pushed, conflicts{shown,total,rows}}`. Update
`reference.ts` usage/summary (drift gates regenerate both SKILL.md channels).

Message-pack strings (test-pinned):
- (a) clean sync: `sync: {committed:N, pushed:N, pulled:N, actor:<a>, incoming:{shown,
  total, rows:[{verb,kind,id,title,actor}…]}}`.
- (b) two empty states: no git repo → `sync: nothing to sync`; clean+current → `sync:
  already up to date`.
- (d) push-fail after commit → PARTIAL envelope LEADING with safety: "committed to the board
  locally — your work is saved. The push failed (offline or auth); re-run sync when you're
  back online or your access is restored." exit 4 (auth) / 1 (network), same message.
- (f) git missing → GIT_MISSING/exit 1 "sync needs git, which isn't installed on this
  machine"; no upstream → NO_UPSTREAM/exit 1 "the board branch isn't linked to a remote yet
  — sync can't share it" + migrate/teammate help.

## INTERIM conflict guard (adjudication A — THIS unit)

U3a does NOT resolve conflicts. On a same-doc conflict it uses U1's detect + CLEAN abort,
then exits CONFLICT(5) with the EXACT interim string:

  "doc X changed on both sides — nothing was changed on either side; conflict resolution
  ships in the next update"

NO export file at U3a. The worktree is left pristine. U3b (sync-conflict-resolution)
REPLACES this guard with the converging mechanic — do not build the converge here.

## Acceptance criteria (tests, deps: U1, U2)

- two-clone founder e2e: A writes docs → sync → B `sync --pull-only` sees the attributed
  delta
- idempotent re-run; both empty states
- INTERIM conflict guard: exit 5, pristine worktree, the interim string, NO export file
- FULL sync WITH a pending commit against a planted stale-rebase fixture heals at entry then
  completes (adjudication C)
- push-fail partial envelope (string (d)); exit taxonomy 0/1/4/5
- commit-grammar moments; string-pinned pack moments (a), (b), (d), (f)

## Gates

Builder → independent Reviewer → QA (+ the two-clone e2e). Deps: sync-git-porcelain (U1),
sync-cursor-store (U2).

[depends on](sync-git-porcelain.md)

[depends on](sync-cursor-store.md)
