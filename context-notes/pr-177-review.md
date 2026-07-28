---
type: Context Note
title: 'PR #177 exact-SHA review — changes requested'
description: >-
  P1: protocol-fixed height is treated as unbounded; full merged-tree gate
  passes, but fixed-host portability regresses.
actor: codex-pr177-reviewer
timestamp: '2026-07-28T21:47:08.580Z'
---
# Summary

Verdict: **CHANGES REQUESTED** for PR #177 at exact head `1fabda01a3c5615c5130a618ddcf0bd23d59d048`.

Ultimate goal: keep agentstate-lite a shared, open, portable knowledge substrate where humans and agents can co-create dependable, user-owned knowledge without host-specific behavior weakening the system.

Proximate goal: independently review PR #177 for correctness, security-boundary preservation, and first-render intrinsic-height behavior. This serves the ultimate goal by ensuring conversational Views behave reliably in their host while the trusted-shell and opaque-child boundaries remain intact.

## Blocking finding

### P1 — A protocol-fixed `height` is treated as unbounded

`flexibleHostHeightLimit()` returns `undefined` whenever `containerDimensions` has `height`, and the caller therefore permits the nested child to grow to the 4096px product ceiling. The PR's new test explicitly pins `{ height: 288 }` to a 900px child.

Empirical evidence:

- With the PR built against `@modelcontextprotocol/ext-apps` 1.7.5, the SDK schema accepts `{ containerDimensions: { width: 400, height: 288 } }` as the fixed-height shape.
- Directly evaluating the PR helper produces `{ limit: null, appliedChildHeight: 900 }` for a 288px fixed host, 900px requested child, and 53px shell chrome.
- The PR's own test at `packages/mcp-app/test/frame-sizing.test.mjs:159-197` asserts the same behavior.

Contract evidence and reasoned impact:

- The stable MCP Apps specification defines `height` as fixed: the host controls the size and the View should fill the available space. Only flexible axes (`maxHeight` or omitted) require hosts to honor `ui/notifications/size-changed`.
- A conforming fixed-height host may therefore keep the outer container at 288px and ignore the 953px notification while this patch installs a 900px nested iframe. The App then overflows or clips its host instead of retaining a bounded child. This is a cross-host regression even if Codex currently uses the fixed shape as a mutable current allocation.

Preserve the fixed-height bound when applying the child size. A portable compatibility path can still send the desired outer height immediately, then expand the child only if a later host-context update proves the allocation changed; otherwise keep the fixed host bounded. Pin both a truly fixed host and the Codex growth handshake.

## Survived attacks

- Exact-head diff is limited to the frame-sizing helper, shell integration, and focused tests; `git diff --check` is clean.
- Source-window, launch ID, epoch, nonce, malformed-height, stale-mount, dialog, and 4096px product-cap protections remain intact.
- Flexible `maxHeight` arithmetic correctly subtracts shell chrome for the child and reports the capped outer height.
- PR #177 merges cleanly with current `main` (`16d0a76374daef7e0b73cc4b7ed484a147d01189`).
- `npm run check` passes on that synthetic merge, including all 41 MCP App tests and all 19 Chromium UI/security tests.
- GitHub CI is green on Node 20, 22, and 26.

## Validation boundary

The PR remains a draft, and its description says the final restart/Codex dogfood pass for the explicit relay is still outstanding. No GitHub review or comment was posted by this reviewer.
