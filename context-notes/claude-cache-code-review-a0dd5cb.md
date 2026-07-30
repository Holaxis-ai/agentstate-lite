---
type: Context Note
title: Independent cache-only code review of a0dd5cb
description: >-
  Approved: exact shell bytes have one full-SHA immutable URI across metadata,
  registration, and returned content.
tags:
  - review
  - claude-desktop
  - mcp-app
actor: claude-cache-code-review
timestamp: '2026-07-30T00:27:10.278Z'
---
# Summary

Independent review of exact cache-only candidate `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea` against exact parent `77c84e4827f332cd8a84079d239dc76398b88959` is **APPROVE**. No blocking, major, or minor code findings were identified. The candidate may advance to adversarial QA and exact-SHA host acceptance; this review does not replace the final uninstrumented Claude Desktop validation required by [[tasks/claude-desktop-durable-bridge-initialization]].

The review used detached worktree `/private/tmp/aslite-cache-review-a0dd5cb`. The candidate and builder worktrees are tracked-clean. The main checkout retains only its pre-existing `.gitignore` modification.

This verdict follows the field diagnosis in [[context-notes/claude-bridge-probe-result-77c84e4]] and the previous combined-candidate review in [[context-notes/claude-bridge-code-review-91a0cbe]].

# Findings

None.

# Scope and implementation review

- The exact diff is one coherent cache-identity claim: only `packages/mcp-app/src/server.ts` and `packages/mcp-app/test/server.test.ts` change, with 25 insertions and one deletion.
- No lifecycle, iframe, bridge-source, authorization, launch/epoch, polling, or visibility implementation changes are present.
- `packages/mcp-app/src/server.ts:49-55` hashes the exact `MCP_VIEW_HTML` string with the existing UTF-8 SHA-256 primitive `versionOfBytes`, strips only the literal `sha256:` label, and embeds the complete 64-character lowercase hexadecimal digest in `ui://agentstate/view-host/v1/<digest>.html`.
- The observed exact URI is `ui://agentstate/view-host/v1/0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee.html`. The digest segment is 64 hexadecimal characters; no truncation occurs.
- Tool metadata at `packages/mcp-app/src/server.ts:478`, resource registration at `packages/mcp-app/src/server.ts:843-850`, and returned resource content at `packages/mcp-app/src/server.ts:851-856` all consume the same exported `MCP_VIEW_RESOURCE_URI` constant. The returned executable text remains exactly `MCP_VIEW_HTML`.
- The registered exact URI was successfully read through the in-memory MCP contract, demonstrating that the custom content-addressed path remains discoverable by the server contract.

# Test and provenance review

- `packages/mcp-app/test/server.test.ts:38-51` independently recomputes the full digest from `MCP_VIEW_HTML` and checks the exported URI.
- Appending one ASCII space changes one UTF-8 byte and changes the digest from `0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee` to `38264ac7359fbc54f1542275ecb172e6bb48f3c008ef43ba2ce5c3a77437fcfd`.
- `packages/mcp-app/test/server.test.ts:356` pins the model-visible `show_view` metadata URI.
- `packages/mcp-app/test/server.test.ts:367-370` reads the resource by the exported URI and explicitly asserts that `contents[0].uri` is identical, covering the response-identity gap identified in the prior review.
- Parent-red provenance was independently reproduced by overlaying only the candidate test onto detached exact parent `77c84e4`: the test failed because the parent returned `ui://agentstate/view-host/v1.html` instead of the expected hashed URI.
- The detached exact candidate passed the complete MCP App unit suite: **56/56**.
- The contract suite continued to assert that authorize, bridge, poll, resume, close, prepare, and finish tools are App-only. Existing source, authorization, visibility, lifecycle, and launch-currentness tests passed, and those implementation surfaces are byte-identical to the parent.
- `git diff --check` passed.
- Builder evidence records a clean dependency install, focused resource and contract tests, MCP **56/56**, and full `npm run check` including 8 browser and 19 UI end-to-end tests. The independent review reran the relevant MCP suite and parent-red proof rather than duplicating the entire repository gate.

# Security and authority assessment

The change narrows cache ambiguity without adding authority. The URI contains only a deterministic digest of the public App-shell HTML; it exposes no secret or invocation-specific value. Model-visible tool scope is unchanged, all privileged bridge operations remain App-only, and one exported identity is used at every discovery and delivery surface. Identical shell bytes retain one stable identity; any changed shell byte selects another identity, preventing a host from legitimately satisfying the new tool advertisement with stale executable HTML cached under the old mutable URI.

# Goal and status

Ultimate goal: make agentstate-lite a reliable local-first collaboration substrate whose conversational MCP Views behave correctly across supported hosts and whose work state survives agent/session boundaries.

Proximate goal: determine whether the separated candidate gives exact MCP App shell bytes one immutable, consistent resource identity without changing bridge authority or lifecycle behavior.

Status: review complete and approved. The candidate serves the ultimate goal by fixing the proven stale-shell selection failure as an isolated, test-pinned change. It is ready for adversarial QA, followed by the task's required uninstrumented exact-SHA Claude Desktop acceptance.
