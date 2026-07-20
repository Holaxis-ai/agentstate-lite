---
type: Task
title: 'New-user quickstart: the TESTED install to init-a-recipe to productive journey'
description: >-
  Owns the stitched, copy-paste-able new-user journey that decides whether a
  test user succeeds — the single highest-leverage onboarding artifact for the
  release push. THE FLOW: (a) npm install the CLI; (b) install the Agent Skill
  and/or session-start hook for the user's agent (Claude Code / Codex /
  OpenCode); (c) init a bundle from a BUILT-IN recipe BY NAME (e.g. 'init
  --recipe personal-task-system'); (d) immediately productive (the recipe's
  kinds + Views are live, the agent knows about them via the skill/hook).
  DELIVERABLE: the exact command sequence written into the README quickstart AND
  the skill's guidance, and TESTED end-to-end in a fresh environment — a
  script/test that runs the LITERAL emitted commands and asserts a working
  recipe'd bundle results (the emitted-command-chain discipline applied to
  onboarding). This is the difference between 'the pieces exist' and 'a stranger
  succeeds.' DEPENDS ON: tasks/npm-cli-skill-prerelease (CLI+skill+hook install)
  and at least one built-in recipe installable by name
  (roadmap-items/personal-task-system-recipe). Parent:
  roadmap-items/distribution-neutral-resources. P1 — critical path for getting
  test users.
actor: mike/claude
status: todo
priority: '1'
timestamp: '2026-07-20T21:44:46.463Z'
---
[the tested new-user onboarding journey](../roadmap-items/distribution-neutral-resources.md)

[depends on CLI+skill+hook install](npm-cli-skill-prerelease.md)

[depends on a built-in recipe installable by name](../roadmap-items/personal-task-system-recipe.md)
