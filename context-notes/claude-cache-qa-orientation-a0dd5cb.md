---
type: Context Note
title: Cache identity QA orientation at a0dd5cb
actor: claude-cache-qa
timestamp: '2026-07-30T00:29:36.542Z'
---
# Summary

Adversarial QA orientation for exact cache-only candidate `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea`, after independent review approval.

Ultimate goal: make agentstate-lite a reliable local-first collaboration substrate whose conversational MCP Views behave correctly across supported hosts and whose work state survives agent/session boundaries.

Proximate goal: determine whether exact candidate App-shell bytes have one immutable, full-content-derived identity at every MCP discovery/read surface, with byte sensitivity and build reproducibility, without changing authorization, source, epoch, visibility, or lifecycle behavior.

The cache model is one-to-one by content: identical UTF-8 `MCP_VIEW_HTML` bytes must deterministically yield the same full SHA-256 URI; any byte change must yield a different URI; `show_view` metadata, registered resource identity, resource-read response identity, and returned executable bytes must agree. The candidate may not introduce a fallback/static alias that lets a host reuse stale bytes.

Attack plan: inspect exact diff and all URI consumers; independently recompute digest from built bytes; exercise MCP tool discovery and resource listing/read; mutate one byte only in an in-memory probe; search for aliases, truncation, normalization, encoding, and collision-prone parsing; compare clean rebuild outputs; run focused MCP contract/tests and confirm non-cache lifecycle surfaces are byte-identical to parent.
