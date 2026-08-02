---
type: Task
title: 'new: accept inline body for one-command governed creation'
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Dogfood correction: the generated agent skill currently prescribes new
  followed by doc update for a Context Note because new deliberately rejects
  inline --body. Add generic --body parity with doc write/update, mutually
  exclusive with --body-file, preserve strict create-only semantics, and update
  the generated skill to demonstrate one-command Context Note creation. This
  supersedes the canceled not-validated conclusion in
  tasks/governed-create-one-command for the official agent workflow.
actor: openai/codex
timestamp: '2026-08-02T20:35:02.737Z'
---

