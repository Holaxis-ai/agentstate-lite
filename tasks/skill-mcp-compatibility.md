---
type: Task
title: Add skill compatibility and prove stable MCP launch
status: in_progress
priority: '1'
description: >-
  Candidate cd3d330 passed independent exact-SHA re-review after the Windows
  path-safety repair; separate adversarial QA is in progress.
actor: codex-c2s-orchestrator
assignee: codex-c2s
timestamp: '2026-08-04T01:21:18.724Z'
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

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
