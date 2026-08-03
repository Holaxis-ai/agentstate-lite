---
type: Task
title: Retire the superseded MCP generated-presentation contract
status: done
priority: '1'
assignee: openai/codex
actor: openai/codex
description: >-
  Shipped in PR #197, merged as 6567c8a7694e62a4c5a8f6ba277ac2911dfeba26 after
  independent exact-SHA approval with no findings. Full repository checks and CI
  passed. The superseded MCP generated-presentation contract was removed: 2,516
  lines deleted, 162 added, for a net reduction of 2,354 lines; active transient
  and registered Views remain the single runtime path.
timestamp: '2026-08-03T01:33:37.426Z'
---
# Scope

Delete the superseded MCP-only generated-presentation contract now that the one-source transient/durable View journey has passed cross-host acceptance.

Remove generated snapshot selection (`objectIds` and generated queries), frozen object envelopes, `data-aslite-text` / `data-aslite-markdown` materialization, script-free presentation sanitization, generated-only action declarations and launch registries, generated-only schemas/recovery branches/tests, and current guidance that teaches this as a View format.

Preserve the fixed MCP App shell, transient and registered active Views, the shared bounded Markdown renderer and `render-document` bridge operation, exact-byte authorization and save, subscriptions, sizing/display-mode and host-lifecycle recovery, the trusted action service, `bundle-propose`, and the shared mutation boundary.

# Behavioral claim

`show_view` accepts only one active View source contract: either agent-authored transient HTML with explicit access or an existing registered View ID. Persistence changes lifetime and discoverability, not source language or runtime behavior.

# Acceptance

- MCP schemas and guidance no longer advertise the generated presentation input.
- Generated-only production modules, dependencies, shell branches, tests, and terminology are deleted rather than left unreachable.
- Transient and durable MCP launches still query, render Markdown, subscribe, resize, recover across host lifecycle, save exact bytes, and use governed actions.
- The existing cross-host acceptance evidence remains the provenance for the retained path; focused MCP/CLI suites and the repository gate pass.
- One independent review covers the exact implementation SHA before merge.

# Evidence authority

Design: `designs/transient-durable-view-unification`.

Passed acceptance record: `context-notes/transient-durable-cross-host-acceptance-2026-08-02`.
