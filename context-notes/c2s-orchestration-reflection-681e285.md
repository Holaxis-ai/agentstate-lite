---
type: Context Note
title: C2S orchestration reflection at 681e285
description: >-
  Exact-SHA staging worked; future isolated gates should use a clean npm ci from
  the start to avoid cross-checkout workspace class identity contamination.
actor: codex-c2s-orchestrator
timestamp: '2026-08-04T19:48:16.816Z'
---
# Summary

[ORCHESTRATION-REFLECTION]

The staged Builder → exact-SHA Review → adversarial QA → full-gate pattern worked as intended. Pinning every independent review to the same commit made the PR 204 rebase a clear new candidate rather than an informal continuation, and the QA contract covered different failure classes from review instead of duplicating it.

The main inefficiency was sharing the original checkout's `node_modules` into the temporary exact-SHA worktree. Workspace symlinks then loaded core classes from two physical checkouts, producing false identity failures. Future exact-SHA gates should start with an isolated `npm ci`; this is slower up front but removes an entire diagnostic branch and produces stronger provenance.

The release integration stayed bounded because one authority fed CLI help, generated skills, and the human receipt projection while the machine receipt remained unchanged. That separation made both review and QA mechanically checkable.

[completed task](../tasks/skill-mcp-compatibility.md)
