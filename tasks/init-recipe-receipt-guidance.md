---
type: Task
title: Make init success guidance match the installed recipe
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Confirmed against npm @holaxis/aslite@0.1.0-pre.3. Draft PR #206 fixes both
  defects at exact commit b8a2f12d9e1c125762ae5ae7189698ade38a1a29: init derives
  guidance from the selected recipe's parsed governs inventory, and every
  follow-up retains an explicit resolved --dir target. Context Note creation is
  advertised only when declared; other kind-bearing recipes point to kinds;
  recipe none advertises no mutation. Coverage spans default, context-notes,
  work-tracking, roadmap, external, and none. A built-CLI integration test
  initializes targets containing spaces and an apostrophe from an unrelated
  existing bundle, executes emitted kinds and recipes commands verbatim, and
  executes the filled new command; reads and writes remain on the selected
  target. Focused tests pass 57/57, the full repository gate passes including 19
  browser E2E tests, and exact-SHA Node 20/22/26 CI is green. The first
  independent review caught target loss; the corrected exact-SHA re-review
  approved with no findings:
  https://github.com/Holaxis-ai/agentstate-lite/pull/206#pullrequestreview-4850091446.
  Ready to merge.
actor: openai/codex
timestamp: '2026-08-04T02:37:30.921Z'
---

