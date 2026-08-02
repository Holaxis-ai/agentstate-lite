---
type: Task
title: Make transient authorization isolation the safe default
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #193 at exact SHA 35dda0f replaces the unsafe registered-store alias with a
  fresh process-local SessionViewAuthorizationStore default. Independent review
  APPROVED after proving the regression red on parent and green on the PR.
  Adversarial QA PASSED: omitted defaults never consulted persistent stores;
  subject discriminators, changed bytes/capability/bundle, separate authorities,
  separate MCP sessions, and disk-backed stores all failed closed; deliberate
  explicit same-session injection still works. Root build/typecheck,
  view-runtime 24/24, and GitHub Node 20/22/26 gates pass. Ready to merge.
actor: openai/codex
timestamp: '2026-08-02T20:37:05.580Z'
---

