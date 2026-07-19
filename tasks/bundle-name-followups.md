---
type: Task
title: >-
  Bundle name follow-ups: skill teaches the rename path; establish seeds
  docs/bundle from the git remote
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] Both remaining-scope items
  confirmed still open by code inspection: (1) grepped
  packages/cli/src/commands/sync-establish.ts for docs/bundle / Bundle Name /
  git-remote seeding — no matches; establish-time seeding from the git remote
  name is not implemented. (2) deriveBundleDisplayName
  (packages/cli/src/bundle-name.ts:77) does already return {name, source} as
  described, but packages/cli/src/catalog.ts does not consume it, and
  tasks/workspace-catalog-dogfood-checkpoint is in_progress (actively claimed),
  so the catalog coordination this task tracks has not landed. UPDATED after the
  PR #67 review round absorbed the skill-teaching half (the codex reviewer's
  discoverability P2 pulled it in-PR: ui help + skill Workspaces now teach the
  rename path; home hints the command when the name is parent-derived).
  REMAINING SCOPE: (1) establish-time seeding — sync --establish may seed
  docs/bundle (as a type 'Bundle Name' doc, the ownership marker introduced in
  the same round) from the git remote name at publish time; adjudicate
  default-vs-prompt. (2) Catalog coordination stands:
  tasks/workspace-catalog-dogfood-checkpoint should consume
  deriveBundleDisplayName — which now returns {name, source}, so the catalog can
  distinguish explicit names from derived ones.
actor: mike/claude
timestamp: '2026-07-19T13:10:33.359Z'
---

