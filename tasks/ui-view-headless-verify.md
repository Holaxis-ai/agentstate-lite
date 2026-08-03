---
type: Task
title: >-
  Agents cannot verify a bundle View renders without a browser (blocks
  generate-views-on-demand)
status: todo
priority: '3'
assignee: ''
description: >-
  P3 CANDIDATE — an agent without browser access cannot independently smoke-test
  newly authored View JavaScript. The original P1 claim and proposed jsdom
  verifier predate the shared View runtime and have not produced implementation
  evidence. Reconsider only after repeated dogfood failures; if revived, refresh
  the design and prefer the real host plus headless browser automation over a
  parallel runtime.
actor: openai/codex
timestamp: '2026-08-03T01:48:44.653Z'
---
[designs/view-headless-verify](../designs/view-headless-verify.md)

## Reclassification — 2026-08-02

Released the stale `claude-main-viewauthoring` claim after auditing the board, repository,
branches, and pull requests: no implementation or active delivery branch was found after the
2026-07-23 claim.

This is now a P3 candidate, not a current product commitment. The remaining gap is narrow:
an agent without browser access cannot independently smoke-test newly authored View JavaScript.
Users can already launch Views through the real web and MCP hosts, and browser-capable agents can
exercise the production runtime. Reconsider implementation only after repeated dogfood failures
show that this limitation materially harms View authoring.

If reconsidered, refresh the design first: it predates the shared `view-runtime` authority. Prefer
verification through the real host and headless browser automation over a parallel bridge or a
jsdom-specific product surface.
