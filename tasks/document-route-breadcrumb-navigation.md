---
type: Task
title: Give documents stable resource paths and navigable breadcrumbs
status: todo
priority: '2'
description: >-
  First-use follow-up: evaluate stable document routes and namespace breadcrumbs
  without weakening identity, authorization, or compatibility.
actor: openai/codex
timestamp: '2026-08-06T14:31:48.314Z'
---
# Problem

The shell's document reader encodes document identity in query parameters. The resulting URLs are hard to scan or share, and breadcrumb parent segments cannot act as useful navigation into a document namespace.

# Scope

- Evaluate stable, encoded resource paths for document-reader navigation while preserving exact bundle-relative document identity.
- Make valid parent breadcrumb segments navigable to a bounded namespace/index experience.
- Preserve browser back/forward behavior, deep links, session authorization, and existing View routing.
- Define compatibility behavior for existing query-parameter links.

# Acceptance

- A document can be opened from a stable URL whose path communicates its bundle-relative identity.
- Reserved characters and non-ASCII document IDs round-trip without ambiguity or traversal risk.
- Navigable breadcrumbs never imply that a nonexistent or unauthorized resource exists.
- Existing links continue to work through an explicit compatibility decision.
- Routing behavior is covered through the built UI and installed CLI surface.

[First-use evidence](../context-notes/first-use-feedback-2026-08-06.md)
