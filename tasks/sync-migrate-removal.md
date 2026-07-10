---
type: Task
title: >-
  sync --share: board-branch creation becomes a permanent affordance; --migrate
  spelling retires
status: in_progress
priority: '2'
description: >-
  RESCOPED (Brian, 2026-07-09, superseding the ship-use-delete ruling after the
  Broken-Leash analysis): the migration machinery is not deleted — it is
  GENERALIZED. Board-branch creation is a permanent product need (any new repo
  that wants a shared board), and --migrate was merely its hard case. This unit
  ships the general verb and retires the migration framing. Sync remains an
  explicit/manual action in this unit; transparent auto-sync is a later layer.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-10T12:50:39.036Z'
---
## Why the rescope (the Broken-Leash analysis, 2026-07-09)

A new repo wanting a shared board has NO product path once --migrate is deleted: sync
can JOIN an existing origin/board but nothing CREATES one. Today's greenfield route is
pure ceremony (init folder → commit to main → --migrate → removal PR — committing
history solely to remove it). The founders' migration was just the hard case (folder
already committed) of a general verb. Supersedes the ship-use-delete ruling; the wake
condition fired immediately, from the founders' own product analysis rather than
external demand.

## Product boundary

This unit is the local-first → shared-board transition, not transparent
collaboration sync. A project may start with a purely local `.agentstate-lite/`
folder and no remote repo. Later, after the code repo gains an `origin`, the user
can explicitly run the new share verb to publish that existing local board as
`origin/board`. Fresh clones can then explicitly run `sync` to join/provision the
board worktree.

Do NOT build automatic board sync in this unit. Session-start auto-pull,
post-write auto-commit/push, background sync, UI sync buttons, and conflict
prompting are future policy layers over the same substrate. The acceptance target
here is a clean, documented manual path that preserves those future options.

## Scope

1. NEW verb (naming at build: `sync --share` or similar) — on a boardless repo with an
   origin remote:
   - GREENFIELD (folder uncommitted or absent): create the orphan board branch (bundle
     at root — from the local folder if present, else fresh init content), `git push -u
     origin board`, provision the worktree, emit the one .gitignore line as guidance
     (no main-tree surgery — nothing was ever committed).
   - COMMITTED-FOLDER (the old --migrate case): same, plus the removal commit on a side
     branch + PR guidance — the audited U5 flow, reframed.
   All existing guards carry over verbatim (they survived two review rounds): orphan
   root = no-common-ancestor (GitHub cannot PR board→main), freshness/behind-origin
   refusals, board/-namespace check, crash-window recovery, both-worlds honesty for the
   committed case, loud provisioning.
2. RETIRE the --migrate spelling (alias or delete; delete preferred — the removal task's
   original goal survives as "the migration FRAMING dies").
3. SKILL/docs: the Workspaces section teaches the trilogy — (a) local-only folder
   (supported mode, per tasks/sync-local-only-degradation), (b) JOIN an existing shared
   board (`sync`), (c) SHARE a new board (the new verb). This also answers
   sync-local-only-degradation's open question A shape: local-only is a first-class
   sibling, not a degraded state. The docs must name the sync boundary plainly:
   sharing/joining is explicit for now, and transparent automatic sync is not part of
   this unit.
4. DOCUMENT the per-repo protection line: adopters should enable delete/force-push
   protection on their board branch (structural for us via repo settings, disciplinary
   for adopters — say it in the skill and README).
5. README legibility line for open-source readers: the board branch never merges; what
   it is; why it's protected. (Absorbs the pending legibility item.)

## Acceptance criteria

- A user can initialize and use a local-only board in a git repo with no remote.
- After adding an `origin` remote, the user can explicitly run the new share verb to
  publish the existing local board to `origin/board` without first committing
  `.agentstate-lite/` to `main`.
- If `.agentstate-lite/` was already committed to `main`, the same share verb handles
  that hard case by creating the board branch and producing the cleanup branch/PR
  guidance.
- A fresh clone of the repo can explicitly run `sync` and get the shared board
  worktree from `origin/board`.
- The implementation does not imply or promise transparent auto-sync. Any automatic
  pull/push behavior must be left to a later task.

## Carried findings

- Codex PR#26 guidance-staleness (alreadyMigrated branch-order) — fix or moot it in the
  generalization.
- The U5 delta-review LOW (spoofable crash discriminator) — re-adjudicate under the new
  verb's shape; the write-time marker may now be worth it since the verb is permanent.
