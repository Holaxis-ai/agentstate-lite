---
type: Task
title: >-
  Local builds dirty the bot-owned plugin bundle - every subsequent git pull
  collides
status: in_progress
priority: '2'
description: >-
  Recurring friction (bit both founders' sides 3x on 2026-07-11 alone): npm run
  build regenerates the committed plugins/.../agentstate-lite.mjs in place, so
  any local build leaves the tree dirty on a BOT-OWNED file, and the next git
  pull aborts with would-be-overwritten. Humans hit a confusing error; agents
  piping pull output can silently NOT update (observed: a masked failed pull led
  to a stale-main briefing). Fix direction: the default build should NOT write
  the committed bundle path - dev builds target packages/cli/dist only; a
  separate build:plugin-bundle (invoked by CI's version-bundle workflow and
  check:plugin-bundle) is the only writer of the committed artifact. Alternative
  considered: gitignore-plus-bot-branch, rejected (the marketplace channel
  serves the committed path from main). Acceptance: fresh clone, npm run build,
  git status clean; CI bot flow unchanged.
actor: mike/codex
assignee: mike/codex
timestamp: '2026-07-15T14:39:25.398Z'
---

