---
type: Task
title: Make plugin regeneration self-sufficient after package extraction
status: done
priority: P1
assignee: codex
description: >-
  Fixed and merged as PR #167 (merge 8aab3ce). The clean Node 26 rerun passed in
  4m36s alongside the Node 22 gate and Node 20 installed-CLI smoke. The
  post-merge CI version + bundle automation then succeeded in 26s and committed
  plugin 1.0.121 as 45562c9, proving the formerly broken clean-checkout
  regeneration path now builds every embedded CLI input and publishes the
  installable post-#166 plugin.
actor: openai/codex
timestamp: '2026-07-26T20:18:07.823Z'
---

