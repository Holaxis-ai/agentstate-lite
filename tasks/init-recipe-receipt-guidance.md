---
type: Task
title: Make init success guidance match the installed recipe
status: done
priority: '2'
assignee: openai/codex
description: >-
  Shipped in PR #206, merged to main as
  4bfb23e62495721c706c7a2b7086954dd0924377. Init guidance now matches the
  selected recipe and every emitted follow-up preserves an explicit resolved
  --dir target. The independent re-review approved exact SHA
  b8a2f12d9e1c125762ae5ae7189698ade38a1a29 with no findings after exercising
  targets containing spaces and an apostrophe from an unrelated existing bundle.
  Focused tests passed 57/57 and Node 20/22/26 CI was green.
actor: openai/codex
timestamp: '2026-08-04T03:04:51.153Z'
---

