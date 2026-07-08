---
type: Task
title: 'U6 skill + docs truth pass: flow ends with sync, setup verb, plugin bump'
status: todo
priority: '2'
description: >-
  U6. Skill and docs truth pass: typical flow ends with sync, sync as setup
  verb, hook-install re-run prompt, plugin version bump in both manifests. Deps:
  sync-conflict-resolution, sync-sessionstart.
actor: brian-claude
timestamp: '2026-07-08T15:50:39.056Z'
---
# U6 — skill + docs truth pass

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U6. String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) (P7 one-sentence; P11
teaching).

## Definition of done

`gen-skill.mjs` / SKILL generation:
- typical flow ENDS with `sync` ("recording work isn't done until it's shared")
- Workspaces section teaches "shared with teammates via aslite sync" and NO branch/worktree
  mechanics
- `sync` is the SETUP verb for existing projects (init = greenfield only)
- `init` run inside a git repo prints an fs-only hint ("if this project shares a board, run
  sync instead" — detected by `.git` up-tree, NO git binary invoked)
- the ONE "you may notice a `board` branch" aside
- founder one-sentence: "`aslite sync` shares your board — commits your changes, pulls your
  teammate's, pushes yours, touching nothing but the board."
- PROMPT founders to re-run `hook install` (adjudication E)

Plugin version bump in BOTH manifests — CHECK main's current version FIRST (marketplace.json
was 1.0.11 at planning time; verify the plugin.json manifest too and bump both together).
README quickstart re-read against new behavior.

USER-FACING LANGUAGE RULE throughout: no "worktree"/"linked"/"subtree".

## Acceptance criteria

- SKILL drift gates green after regeneration
- typical flow ends with sync; setup-verb + init-hint text present; single board aside;
  founder one-sentence present; hook-install re-run prompt present
- both plugin manifests bumped in lockstep off main's actual current version
- no forbidden mechanics vocabulary in any user-facing string

## Gates

Builder → independent Reviewer → QA. Deps: sync-conflict-resolution (U3b),
sync-sessionstart (U4) — U6 teaches the FULL user-facing surface.

[depends on](sync-conflict-resolution.md)

[depends on](sync-sessionstart.md)

## Inherited from the actor-attribution review (2026-07-08, issue 4)

Attribution is now POSSIBLE (--actor persists to frontmatter) but adoption is unforced —
the skill's own guidance never tells agents to pass --actor, so "unknown" stays the
common case in practice (the unit's own closing board record initially shipped without
it — proof). This unit's skill pass should teach --actor in the typical flow and the
Workspaces section ("write docs with --actor <your-name> so teammates' awareness renders
attribute you"), keeping the pinned no-default semantics.
