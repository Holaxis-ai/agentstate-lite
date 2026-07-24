---
type: Context Note
title: 'Inventory: remaining type Page documents'
actor: codex-page-inventory
timestamp: '2026-07-24T15:42:10.902Z'
---
# Summary

Current-main inventory of `type: Page` documents on 2026-07-24.

## Goal

Determine whether any current repository or live project-bundle documents still declare
`type: Page`, serving the product goal by making the legacy-name removal gate depend on an exact,
repeatable inventory rather than an ambiguous grep count.

## Result

- Live `.agentstate-lite` bundle: 0 parsed `Page` documents across 418 docs.
- Raw Markdown frontmatter scan of the live bundle: 0 `type: Page` files, including malformed-file
  coverage; bundle status also reports `legacy_naming.page_typed_docs: 0`.
- Current tracked repository Markdown/MDX: exactly 1 real `type: Page` document:
  `packages/cli/test/fixtures/review-workflow-legacy-v1/pages-registry/review-workflow-reviews.md`.
  It is an intentional legacy-v1 compatibility fixture, not live bundle stock.
- Other tracked `type: Page` matches are prose, source comments/messages, generated distribution
  text, or test strings that manufacture legacy documents during tests.
- The live bundle still has 16 items under legacy `pages-registry/` and `pages/` locations, but its
  eight registry documents are now `type: View`; path migration is a separate decision.

Scope: current clean `main` at `ff726ac3d425e1e7f120259021f62e29a62b7d96`, with local HEAD equal
to `origin/main`.
