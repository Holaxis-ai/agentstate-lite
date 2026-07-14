---
type: Task
title: 'new: create complete records from --body-file and return the final version'
status: in_progress
priority: '1'
assignee: codex
description: >-
  Dogfood found that new --link returns a pre-link version and forces a
  subsequent body replacement that must manually preserve generated links. Add a
  body-file byte channel to new, compose the initial body and typed links
  through one owning path where feasible, and guarantee the success receipt
  reports the final stored version. Keep the existing body-link guard strict.
  Acceptance: body+links are present after one command; receipt version equals a
  same-read head; invalid input does not leave a misleading success receipt;
  local and remote command paths remain aligned; deterministic tests pin the
  observed failure. Implemented in PR #57:
  https://github.com/Holaxis-ai/agentstate-lite/pull/57; exact-SHA adversarial
  review approved.
actor: mike/codex
timestamp: '2026-07-14T21:23:45.345Z'
---

