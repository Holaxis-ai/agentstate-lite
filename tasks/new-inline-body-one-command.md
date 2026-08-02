---
type: Task
title: 'new: accept inline body for one-command governed creation'
status: done
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
timestamp: '2026-08-02T21:16:11.077Z'
---
# Implementation

Draft PR #195 implements generic inline `new --body`. It keeps `--body-file` for file-backed Markdown, rejects both sources together before mutation, preserves explicit empty-body semantics and strict create-only validation, and regenerates the npm skill with one-command Context Note creation.

Independent review of the initial head `ea35b3655298f83ad30de09fed9a40c50ff6d044` found one merge-blocking compatibility issue: core still allowed a kind-declared `body` field, so `--body` could be interpreted as both frontmatter and Markdown and appeared twice in per-kind help.

Commit `b16861b` routes `body` through the existing central reserved-field policy alongside `body-file`. A colliding legacy convention now receives the standard `KIND_RESERVED_FIELD` rename warning; `body` cannot enter dynamic field parsing or frontmatter; and per-kind help presents only the Markdown control.

Independent re-review then found the supported `kind field add` path carried a duplicate reserved-name list and could falsely report success for an immediately ignored declaration. Final head `c72c02bb3367e51eee077ce76e59897ee1272329` removes that duplicate, publicly exports and consumes the core authority, rejects reserved additions, and preserves `kind field remove` as the migration path for legacy collisions.

# Evidence

- Initial focused CLI and skill tests: 82 passed.
- Built CLI smoke: init, inline Context Note create, and body byte-channel readback succeeded.
- Collision-fix focused suite: 100 passed, including core reservation receipts, point-of-use warning behavior, frontmatter exclusion, and single-help-entry coverage.
- Final focused suite: 117 passed, including `body`/`body-file` authoring rejection and legacy removal migration.
- Full `npm run check` passed on exact clean commit `c72c02bb`, including package verification, 9 MCP browser tests, and 19 UI end-to-end tests.
- Final independent review of `c72c02bb` reported no findings and judged the PR merge-ready.
- All required GitHub checks passed on Node 20, 22, and 26; PR #195 is ready, mergeable, and clean.

# Completion

PR #195 was squash-merged into `main` as `642189bf9bf04ac90e3bae15c263fa6d1a0cee51` on 2026-08-02. No required work remains.
