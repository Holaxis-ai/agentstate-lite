---
type: Task
title: 'doc read: body-only byte output for safe edit round-trips'
status: done
priority: '1'
assignee: openai/codex
description: >-
  Shipped in https://github.com/Holaxis-ai/agentstate-lite/pull/44 (merge
  9d6a1b4): body-only parsed Markdown output, same-read CAS version, raw stdout
  discipline, and in-bundle/symlink clobber protection. Independent exact-SHA
  review and final clean QA passed.
actor: openai/codex
timestamp: '2026-07-12T18:19:59.762Z'
---
# Scope

One focused CLI unit: parsed-body output only, local/remote parity, raw stdout discipline, file receipt with exact read version, literal CAS-safe update proof, generated npm skill/reference update. Exact raw source-byte preservation, append/patch verbs, and frontmatter editing are out of scope.
