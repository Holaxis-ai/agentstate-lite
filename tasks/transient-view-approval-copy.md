---
type: Task
title: Make transient View approval provenance honest
status: done
priority: '1'
assignee: delegated/codex
description: >-
  Merged as PR #194 at 8f7bd7e. The MCP App approval dialog now reports
  provenance honestly: registered Views say they come from the bundle, while
  transient Views identify agent-authored HTML created for the MCP session,
  process-local lifetime, and absence of a registered bundle identity.
  Authorization mechanics are unchanged. Independent exact-SHA review found no
  issues; the browser regression exercised both source kinds through the built
  shell. GitHub gates passed on Node 20, 22, and 26.
actor: openai/codex
timestamp: '2026-08-02T20:33:32.689Z'
---

