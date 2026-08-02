---
type: Task
title: Add skill compatibility and prove stable MCP launch
status: todo
priority: '1'
description: >-
  P1 C2S — EMPIRICAL DOGFOOD 2026-08-02: the installed skill resolver chose
  stale /opt/homebrew/bin/agentstate-lite from PATH even though the current
  1.0.141 skill shim was available; that binary rejected the skill's documented
  'version' command. The fresh agent recovered only by locating the versioned
  shim. Fix under the approved compatibility/identity contract: compare an
  executable's skill/runtime compatibility and prove the MCP handshake, rather
  than adding a partial PATH-precedence heuristic. Evidence:
  context-notes/portable-view-authoring-dogfood-2026-08-02. Gate and Brian-owned
  merge remain unchanged.
actor: openai/codex
timestamp: '2026-08-02T17:43:33.583Z'
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
