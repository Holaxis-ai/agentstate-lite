---
type: Task
title: >-
  Local builds dirty the bot-owned plugin bundle - every subsequent git pull
  collides
status: done
priority: '2'
description: >-
  DONE — merged as PR #64 (2026-07-15). Default builds no longer write the
  bot-owned committed bundle (one committed-path writer, consumed by CI + manual
  build:plugin-bundle); regression pin runs the real build and asserts
  plugins/+.claude-plugin/ byte-identical (reviewer proved it catches the
  original bug by revert experiment). Fix round from the external review also
  killed the cross-node class: exact-pinned pako 2.1.0 makes committed-bundle
  bytes a pure function of source+lockfile (closed
  tasks/bundle-cross-node-reproducibility). Transition: the bot's first regen
  produces one expected pako-format diff+bump. The git-pull collision that bit
  both founders all week is dead.
actor: brian
assignee: brian-claude
timestamp: '2026-07-15T18:08:39.485Z'
---

