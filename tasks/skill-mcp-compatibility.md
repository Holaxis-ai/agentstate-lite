---
type: Task
title: Add skill compatibility and prove stable MCP launch
status: todo
priority: '1'
description: 'Implement C2S: additive skill receipts plus bounded MCP PATH/handshake proof.'
actor: openai/codex
timestamp: '2026-07-31T21:26:26.859Z'
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
