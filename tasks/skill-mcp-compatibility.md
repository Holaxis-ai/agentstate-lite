---
type: Task
title: Add skill compatibility and prove stable MCP launch
status: in_progress
priority: '1'
description: >-
  Exact-SHA review PASS at 681e285 with no findings; post-PR-204 release-receipt
  integration now advances to adversarial QA.
actor: codex-c2s-orchestrator
assignee: codex-c2s
timestamp: '2026-08-04T19:23:41.051Z'
---
# Goal

Add additive skill compatibility receipts and prove the bounded stable MCP PATH/handshake contract without claiming arbitrary host-config inspection. This is C2S.

# Acceptance

- Exact Manifest v2 plus legacy parser/ownership compatibility; current state strings/top-level version retained.
- Asset bytes and skill contract—not informational provenance—decide compatibility.
- Persistent npm-package install requires fail-closed `durable_global` evidence; unmanaged targets are never overwritten/deleted.
- `aslite mcp` handshake reports the running release and generic legacy cache-path guidance is emitted only on bounded help/docs/receipt surfaces.

# Gate

Builder → independent exact-SHA Review → adversarial owned/unmanaged/legacy/partial/no-write QA → repository/package/MCP gates → Brian-owned PR/merge.

# Progress

Parallel implementation is complete and PR-ready at exact SHA `cd3d330a069419b9746bc007d8aedf10666c2c78` on `feat/skill-mcp-compatibility`.

- Independent exact-SHA re-review: PASS with no findings after the Windows path-safety repair.
- Adversarial QA: PASS; focused suite 113/113, independent harness 6/6, both-host no-write and literal-PATH MCP probes green.
- Final `npm run check`: PASS, including local package verification, generated skill, 15 MCP browser tests, and 19 UI end-to-end tests.
- PR 204 is still open and owns the release workflow/scripts and receipt implementation surface. C2S did not touch those files. After PR 204 lands, rebase and wire the already bounded migration-guidance authority into its release receipt, then repeat exact-SHA review and affected gates before closing this task.

[exact-SHA review](../context-notes/c2s-exact-sha-rereview-cd3d330.md)

[adversarial QA](../context-notes/c2s-adversarial-qa-cd3d330.md)

[implementation plan](../context-notes/c2s-implementation-plan-2026-08-03.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
