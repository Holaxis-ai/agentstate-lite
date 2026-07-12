---
type: Task
title: 'doc read: body-only byte output for safe edit round-trips'
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Add --body-out <path|-> so agents can extract only the parsed Markdown body,
  receive the read version on file output, and feed the result literally to doc
  update --body-file without nesting frontmatter.
actor: openai/codex
timestamp: '2026-07-12T17:13:04.312Z'
---
# Scope

One focused CLI unit: parsed-body output only, local/remote parity, raw stdout discipline, file receipt with exact read version, literal CAS-safe update proof, generated npm skill/reference update. Exact raw source-byte preservation, append/patch verbs, and frontmatter editing are out of scope.
