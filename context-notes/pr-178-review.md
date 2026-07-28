---
type: Context Note
title: 'PR #178 cross-host code and design review'
description: >-
  CHANGES REQUESTED at PR head 351fee4: Desktop's mandatory recency fallback
  swaps overlapping launches; use an exact one-shot claim marker over the
  preserved text channel, then run real Desktop acceptance.
tags:
  - review
  - mcp-apps
  - claude-desktop
actor: codex-pr178-review
timestamp: '2026-07-28T02:45:02.667Z'
---
# Summary

Ultimate goal: keep agentstate-lite a minimal, offline-first, user-owned knowledge bundle whose harness integrations add dependable operational discipline without making the core harder to reason about.

Proximate goal: independently review PR #178 at exact head `351fee47c149d7b4431188a6fb103d11bcbc55af`, including whether its payload-recovery design is the smallest portable repair for the observed Claude Desktop interoperability defect while leaving the healthy Codex MCP Apps path unchanged. This serves the ultimate goal by making durable and generated Views render reliably across hosts without widening authority or adding host-specific machinery that the evidence does not require.

Verdict: CHANGES REQUESTED. The diagnosis and broad recovery shape are sound: keep the normal `structuredContent` path first, never replay `show_view`, and use an app-only resolver to return an already-minted launch. However, the correlation design is not safe on the target host.

Blocking finding: `PendingLaunchRegistry.consume()` falls back from every key miss to the globally most-recent pending launch. Claude Desktop's measured `toolInfo.id` is unrelated to the server's JSON-RPC request id, so every Desktop recovery takes that fallback. With two overlapping launches A then B, panel A redeems B and panel B redeems A. A one-off executable check against the built PR code produced:

`expected {"panelA":"launch-a","panelB":"launch-b"}; actual {"panelA":"launch-b","panelB":"launch-a"}`.

The TTL, bound, and one-shot removal do not establish correlation; they only bound how long and how often the wrong launch can be returned. Because recovered payloads carry authoritative object snapshots and action descriptors, this is not merely cosmetic ordering. `RecoveryGuard(3)` can also let one app instance consume more than one unrelated ticket if multiple payload-less notifications overlap or repeat.

Design recommendation: use the channel the Desktop probe and upstream reproduction show survives. Mint a random one-shot claim id, include only that opaque claim marker in the existing text `content` fallback, and map the exact claim id to the already-minted launch. On a payload-less non-error result, the shell parses the marker and calls the app-only resolver with it. This preserves the healthy Codex fast path, avoids duplicating the up-to-1 MB payload into model context, removes `toolInfo.id`/request-id coupling and the recency fallback, and remains host-name-independent. The claim is model-visible, so the security design should state why it grants no model authority: redemption is app-only, same-server-connection-only, bounded, and one-shot. If even a non-authorizing opaque marker is unacceptable in model-visible content, the safe alternative is to fail closed rather than return an unrelated launch.

Evidence:

- The local Desktop probe report shows the initial notification kept `content` and `isError`, stripped `structuredContent` and `_meta`, reported `toolInfo.id = toolu_...` while the server saw request id `3`, and returned app-initiated `structuredContent` and `_meta` faithfully at 229 bytes and 1,000,029 bytes.
- The official stable MCP Apps spec defines `toolInfo.id` as the JSON-RPC tools/call request id and requires the tool-result notification to carry the standard `CallToolResult`; Desktop violates both parts in the measured build.
- The official ext-apps issue #696 reproduces Desktop's stripping and documents parsing the preserved text content as the current compatible workaround.
- OpenAI's current guidance says to use the standard MCP Apps bridge first, feature-detect rather than branch on a host name, and keep the normal tool-result path portable.

Verification:

- `npm run build`: PASS.
- `npm test -w @agentstate-lite/mcp-app`: PASS, 41 tests.
- `npm test`: PASS across all workspaces.
- Adversarial Desktop-style two-panel correlation check: FAILS as described above.
- The PR does not yet contain an end-to-end shell test that drives `ontoolresult -> recoverPayload -> callServerTool -> render`, and the task record explicitly says real Claude Desktop acceptance of this build is still pending. That target-host acceptance should remain a merge gate after the correlation redesign.
