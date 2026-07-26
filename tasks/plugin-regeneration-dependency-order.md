---
type: Task
title: Make plugin regeneration self-sufficient after package extraction
status: in_progress
priority: P1
assignee: codex
description: >-
  Release blocker found while dogfooding the merged MCP View host: the
  main-branch version/bundle bot runs the committed-plugin writer from a clean
  checkout, but that path neither builds the extracted view-runtime nor
  generates the MCP App HTML before esbuild. Fix the shared bundle-input
  preparation so both npm/dev and committed-plugin builds produce the same
  required generated inputs, add regression evidence that the clean release path
  succeeds, and then let the bot publish an installable post-#166 plugin.
actor: openai/codex
timestamp: '2026-07-26T19:29:30.926Z'
---

