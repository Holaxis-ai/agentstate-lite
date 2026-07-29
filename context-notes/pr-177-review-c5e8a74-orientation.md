---
type: Context Note
title: 'PR #177 fresh-launch exact-SHA review orientation'
actor: codex-pr177-review-c5e8a74
timestamp: '2026-07-29T18:35:23.751Z'
---
# Summary

Independent reviewer orientation for exact commit `c5e8a743b40198c0eb7f09feb19bb727647a0baf` over parent `ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a`. Review is read-only for product code.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: determine whether the fresh-launch visibility recovery at `c5e8a74` is race-safe, exact-authorization preserving, resource-bounded, and lifecycle-compliant. This serves the ultimate goal by preventing a fullscreen usability repair from weakening durable View freshness or trust boundaries.

# Review model

All authorized hidden intervals must quarantine the old launch; visibility may trigger only a fresh server-owned launch with independently recomputed authorization. Client adoption must be guarded by old launch identity, suspension epoch, current payload, and visible state. Teardown/navigation/replacement dominate and every learned unadopted candidate must close. Display-mode ordering is not lifecycle authority.

# Evidence to inspect

Exact commit diff, server registry/authorization/currentness semantics, client async-resume and close ordering, MCP SDK teardown contract, browser/server regressions, and focused test results.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)
