---
type: Context Note
title: Claude bridge provisional repair and verification
actor: codex-pr177-followup
timestamp: '2026-07-29T21:53:32.256Z'
---
# Summary

The isolated feature worktree `/private/tmp/aslite-claude-bridge-fix` on `fix/claude-desktop-durable-bridge-init` now contains an uncommitted provisional repair for two independently demonstrated defects:

1. An already-authorized durable View received while the outer App is hidden is kept inert, marked suspended, and resumed through the existing fresh server-owned `resume_durable_view` path when visible. The registered child is not executed while hidden.
2. The MCP App resource URI is derived from the full SHA-256 of the exact generated outer-shell HTML, so byte-distinct shells no longer alias under one cacheable identity.

The lifecycle repair remains provisional until the unique-resource Claude diagnostic records the real host event ordering. No commit, push, review handoff, or task completion has occurred.

# Regression provenance

The host fixture now supports an already-authorized initial result, an outer document whose `visibilityState` is hidden before App initialization, and a contract-faithful one-shot child that sends `hello` and `subscribe`, correlates reply IDs, and exposes ready state. The host records bridge, poll, resume, close, and display calls.

Before the lifecycle source change, the unchanged new browser test failed on baseline `origin/main` `77c84e4` at:

`Expected __resumeRequests ["launch-inline"]; received [] after visible; timeout 5000 ms.`

No `durable_view_bridge` call reached the host before visibility returned. After the nine-line lifecycle repair, the same test passes and proves:

- exactly one resume of `launch-inline`;
- one-shot `hello` and `subscribe` use `launch-resumed-1`;
- polling starts on the fresh launch;
- the original launch closes;
- both correlated replies reach the child and it becomes ready;
- no bridge call uses the original launch.

The resource-identity test failed before its source change with:

`actual ui://agentstate/view-host/v1.html`

versus the expected full SHA-256 path. It passes after deriving the URI from `MCP_VIEW_HTML`.

# Verification

- Focused new lifecycle regression: pass.
- Complete `packages/mcp-app/test/frame-sizing.browser.spec.ts`: 9/9 pass.
- MCP App unit suite: 56/56 pass.
- Repository-wide typecheck: pass.
- Full `npm run check`: pass, including all workspace tests, script/package/skill checks, 9 MCP App browser tests, and 19 UI/security end-to-end tests.
- `git diff --check`: pass.
- Worktree contains only the five intended source/test files.

# Goals and status

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in supported MCP hosts.

Proximate goal: make first registered-View activation lifecycle-safe across Claude Desktop and ChatGPT while giving each exact shell byte sequence an immutable resource identity. The provisional implementation and automated feedback now support that goal; real Claude causality/acceptance is the remaining pre-commit gate.

Status: provisional implementation and local verification complete; awaiting the diagnostic Claude launch configured as `agentstate-lite-claude-bridge-probe`.

[tracks](../tasks/claude-desktop-durable-bridge-initialization.md)

[probe provenance](claude-bridge-probe-provenance-77c84e4.md)

[architecture](claude-bridge-architecture-diagnosis-13fcc2c.md)

[test model](claude-bridge-test-model-13fcc2c.md)
