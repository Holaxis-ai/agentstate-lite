---
type: Context Note
title: 'PR #180 exact-SHA review'
description: >-
  Independent review goal and outcome for the content-addressed MCP View shell
  resource.
tags:
  - review
  - mcp-apps
  - cache-identity
actor: codex-pr180-review
timestamp: '2026-07-30T00:58:21.914Z'
---
# Summary

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable across supported MCP hosts.

Proximate goal: independently review PR #180 at exact head `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea`, verifying that exact generated shell bytes receive one immutable, content-derived resource identity at every MCP discovery/delivery surface while the separately tracked hidden-lifecycle behavior remains untouched. This serves the ultimate goal by removing a field-proven stale-shell ambiguity without widening authority or adding unrelated lifecycle mechanics.

Review focus: exact-byte hash provenance; URI stability and byte-change rotation; tool metadata/resource-registration/resource-response agreement; malformed or legacy alias behavior; scope isolation from lifecycle and authorization code; regression-test provenance; generated-artifact policy; and exact-head CI evidence.

Prior evidence to audit rather than duplicate: `context-notes/claude-cache-code-review-a0dd5cb`, `context-notes/claude-cache-qa-a0dd5cb`, and the uninstrumented Claude Desktop acceptance recorded on `tasks/claude-desktop-durable-bridge-initialization`.

# Outcome

Verdict: **APPROVE** exact head `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea`; no blocking, major, or minor findings.

The change is one coherent cache-identity repair. It changes only `packages/mcp-app/src/server.ts` and `packages/mcp-app/test/server.test.ts`; lifecycle, authorization, launch/epoch, bridge, visibility, polling, and generated shell bytes remain identical to parent `77c84e4827f332cd8a84079d239dc76398b88959`.

The implementation hashes the exact UTF-8 `MCP_VIEW_HTML` string once at module load with the existing core SHA-256 primitive and embeds the complete lowercase 64-character digest in the URI. Tool metadata, exact resource registration, and returned resource content all consume the same exported constant. Independent Node `crypto` hashing confirmed 740,804 returned UTF-8 bytes, digest `0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee`, and exact URI `ui://agentstate/view-host/v1/0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee.html`. The built production CLI contains no old static `ui://agentstate/view-host/v1.html` literal.

Regression provenance survived review: temporarily restoring the parent’s static URI while retaining the candidate test made the focused test fail with the expected static-versus-content-derived assertion; restoring the candidate made it pass. The complete MCP App unit suite passed 56/56 in the isolated worktree. `npm run build` and `git diff --check` passed. Exact-head GitHub Actions run `30503826234` passed the full repository gate on Node 22 and Node 26 plus the built-CLI smoke on Node 20.

Prior adversarial QA and field acceptance were also audited: built-server and built-CLI discovery/read surfaces agreed, aliases were rejected, builds were reproducible, and the first uninstrumented exact-candidate Claude Desktop invocation rendered the live Roadmap. Those records are consistent with the code and current task closure evidence.

Non-blocking design note: the identity intentionally covers the HTML bytes, not the resource response’s separate CSP/rendering metadata. MCP Apps treats that metadata as execution-affecting host input, so a future metadata-only change should deliberately rotate the URI or broaden the identity input. This is not a current finding: PR #180 introduces the first hashed identity, leaves metadata unchanged, and its explicit field-proven claim is exact shell-byte selection.
