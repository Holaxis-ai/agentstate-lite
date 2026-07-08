---
type: Task
title: >-
  Top-level --help is the worst surface in the tool: TOON-serialized command
  specs on giant single lines
status: in_progress
priority: '2'
description: >-
  Field feedback (external agent session, generic form): the top-level help
  index crams full command specs into escaped TOON string arrays — the agent had
  to grep it — while subcommand help (new --help) was praised as excellent. AXI
  read: help is prose to READ, not data to PARSE; TOON is the wrong codec for
  the index page. Fix: grouped plain-text index, one command per line with a
  short description; keep TOON for data surfaces. Confirmed on the 1.0.20 build.
actor: mike/claude
timestamp: '2026-07-08T23:02:00.285Z'
---

