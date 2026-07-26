---
type: Task
title: Make plugin regeneration self-sufficient after package extraction
status: in_progress
priority: P1
assignee: codex
description: >-
  Release blocker found while dogfooding the merged MCP View host: the
  main-branch version/bundle bot ran the committed-plugin writer from a clean
  checkout, but that path neither built the extracted view-runtime nor generated
  the MCP App HTML before esbuild. PR #167 centralizes every embedded input
  behind one shared preparation helper, source-aliases the private runtime
  packages, and pins all three bundle producers to that helper. Verification:
  removed ignored generated/dist inputs and rebuilt successfully; npm run
  test:scripts passed 64/64 with the real bot path converging on its second run;
  npm run check passed including packed-install and 18/18 browser E2E. Awaiting
  independent exact-SHA review before merge; after merge the bot should publish
  the first installable post-#166 plugin.
actor: openai/codex
timestamp: '2026-07-26T19:37:01.126Z'
---

