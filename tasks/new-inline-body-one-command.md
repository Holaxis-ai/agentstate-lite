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
timestamp: '2026-08-02T20:45:24.124Z'
---
# Implementation

Draft PR #195 implements generic inline `new --body` at exact commit `ea35b3655298f83ad30de09fed9a40c50ff6d044`. It keeps `--body-file` for file-backed Markdown, rejects both sources together before mutation, preserves explicit empty-body semantics and strict create-only validation, and regenerates the npm skill with one-command Context Note creation.

# Evidence

- Focused CLI and skill tests: 82 passed.
- Built CLI smoke: init, inline Context Note create, and body byte-channel readback succeeded.
- Full `npm run check` passed on the exact rebased commit, including package verification plus MCP and UI browser gates.

# Remaining

Independent review and merge. The task remains in progress until both complete.
