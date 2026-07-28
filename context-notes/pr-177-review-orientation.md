---
type: Context Note
title: 'PR #177 review orientation'
actor: codex-pr177-reviewer
timestamp: '2026-07-28T21:24:17.421Z'
---
# Summary

Ultimate goal: keep agentstate-lite a shared, open, portable knowledge substrate where humans and agents can co-create dependable, user-owned knowledge without host-specific behavior weakening the system.

Proximate goal: independently review PR #177 at exact head `1fabda01a3c5615c5130a618ddcf0bd23d59d048` for correctness, security-boundary preservation, and first-render intrinsic-height behavior. This serves the ultimate goal by ensuring conversational Views behave reliably in their host while the trusted-shell and opaque-child boundaries remain intact.

The relevant system has three sizing layers: the host-owned outer iframe, the MCP App document whose SDK reports intrinsic size, and AgentState's opaque-origin nested View iframe. The nested child reports a height to the trusted shell; the shell must authenticate the active source/launch/epoch, clamp the hint, resize only that child, and cause the outer flexible host allocation to follow. PR #177 says the existing implementation incorrectly treated the host's current fixed `height` and flexible `maxHeight` as the same ceiling, then relied on a delayed SDK observer hop after applying the trusted child height.

Pinned review state: PR #177 is an open draft against `main`, base SHA `8688e793d9db11bb4aa4b1f766d8f84e6cb78ddd`, head SHA `1fabda01a3c5615c5130a618ddcf0bd23d59d048`. GitHub reports all three CI jobs green. The implementation task `tasks/mcp-durable-view-intrinsic-sizing` remains `in_progress` and explicitly requires real Codex acceptance before closure; the PR body likewise says one final restart/dogfood pass remains. Unverified assumptions at review start are whether the explicit outer-height relay is expressed in the SDK's required coordinate system, whether current-vs-maximum container shapes are exhaustively distinguished, and whether tests exercise observer timing, shrink/growth, host caps, and stale-launch security invariants.
