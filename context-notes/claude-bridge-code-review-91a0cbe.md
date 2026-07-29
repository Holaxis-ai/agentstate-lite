---
type: Context Note
title: Independent code review of Claude bridge candidate 91a0cbe
description: >-
  Changes requested: content-addressed identity is correct, but hidden
  authorized replacement is retired by the frame navigation guard.
tags:
  - review
  - claude-desktop
  - mcp-app
actor: claude-bridge-code-review
timestamp: '2026-07-29T23:29:50.294Z'
---
# Summary

Independent review of exact candidate `91a0cbe6820b776f3211484b0cc621a72e48d1f1` against parent `77c84e4827f332cd8a84079d239dc76398b88959` is **CHANGES REQUESTED**. QA approval is **not granted**.

The content-addressed MCP resource identity is correct and the focused candidate tests pass with parent-red provenance. However, the hidden-first-mount change introduces a blocking replacement lifecycle regression: intentionally clearing the prior child while an authorized replacement is received hidden produces an unguarded `about:blank` load that is mistaken for hostile child navigation. The new replacement is immediately closed and cannot resume when visible.

The exact candidate also combines two independently tracked behavioral claims—the proven Claude cache-identity root cause and a separate hidden-first-mount lifecycle defect—without an explicit scope exception. This conflicts with the repository rule that a PR carry one coherent behavioral or policy claim.

This review supports [[tasks/claude-desktop-durable-bridge-initialization]] and [[tasks/mcp-app-hidden-authorized-first-mount]], and uses the field evidence in [[context-notes/claude-bridge-probe-result-77c84e4]] plus the acceptance model in [[context-notes/claude-bridge-test-model-13fcc2c]].

# Blocking finding: intentional hidden replacement is retired as navigation

Reproduction against exact `91a0cbe` in headless Chromium:

1. Start visible and mount authorized launch A.
2. Transition the outer App to hidden.
3. Deliver a different authorized durable replacement launch B while hidden.
4. The candidate marks B current, then calls `clearFrameDocument()`.
5. Removing the previous iframe `src` produces an `about:blank` `load`.
6. Because `clearFrameDocument()` reset the load guard, the global frame `load` handler treats that intentional clear as navigation by B, calls `retirePayload()`, and closes B.
7. Transitioning visible cannot resume because the replacement is already terminal.

Observed state immediately after replacement and again after visible:

```json
{
  "status": "This View navigated away from its approved document, so AgentState closed the launch. Reopen it to continue.",
  "resume": [],
  "closed": ["launch-inline", "launch-replacement"]
}
```

Relevant code:

- `packages/mcp-app/src/view.ts:185-192`: `clearFrameDocument()` resets `frameLoadGuard`, then removes `src`.
- `packages/mcp-app/src/view.ts:355-364`: hidden authorized activation installs the replacement as current, records suspension, and clears the old frame.
- `packages/mcp-app/src/view.ts:829-842`: any unguarded `load` with an authorized current payload is classified as navigation and retired.

Required correction: distinguish an intentional shell-owned frame clear from child navigation without weakening the navigation guard. Add a host-shaped regression test covering visible mounted A → hidden → authorized replacement B → no B child execution while hidden → visible fresh server-owned resume for B → only the resumed B launch can bridge. The intentional clear must not retire B. The implementation must also remain safe if a particular browser does not emit a load for `removeAttribute("src")`; a blindly consumed “next load” token is therefore not sufficient by itself.

# Scope-separation finding

The candidate combines:

1. The Claude Desktop bridge root cause proven by the unique-URI probe: stable resource identity allowed stale outer-shell bytes.
2. The independently reproduced hidden authorized first-mount lifecycle defect, which the field notes explicitly distinguish from the Claude root cause.

`CLAUDE.md` requires each PR to contain one coherent behavioral or policy claim and directs dependent second decisions to be split or made explicit before implementation. These two fixes have separate causes, invariants, tests, and failure modes. Split them into independently reviewed changes, preferably landing the content-addressed URI repair first, or obtain and record an explicit human scope exception before presenting a combined candidate.

# Test-sufficiency follow-up

`packages/mcp-app/test/server.test.ts:38-51` correctly proves that the exported URI equals the full SHA-256 of the exact `MCP_VIEW_HTML` bytes and that a byte-distinct shell gets a different identity. Existing integration reaches the resource through the same constant. Add an explicit assertion that the registered resource response's `contents[0].uri` equals `MCP_VIEW_RESOURCE_URI`, so all three identity surfaces—tool metadata, registration key, and returned resource content—are pinned against future drift.

# What survived review

- `packages/mcp-app/src/server.ts:49-55` derives the resource URI from the full SHA-256 of the exact generated outer-shell HTML. It does not truncate the digest.
- One exported constant is used for tool metadata, resource registration, and returned content.
- The one-shot hidden-first-mount test is parent-red and candidate-green for its covered initial-delivery scenario.
- The resource-identity test is parent-red and candidate-green.
- Existing bridge source, authorization, visibility, launch/epoch, and tool-visibility gates were not relaxed; bridge tools remain App-only.
- The covered hidden-first-mount path keeps child bytes inert while hidden and uses the existing server-owned `resume_durable_view` rotation when visible.

# Verification performed

- Candidate `npm test -w @agentstate-lite/mcp-app`: **56/56 passed**.
- Candidate focused Playwright tests for hidden authorized first mount, visibility transitions, and replay terminality: **3/3 passed**.
- Exact-parent test overlay for hidden authorized first mount: **failed as expected** (`resumeRequests` remained empty).
- Exact-parent resource test overlay: **failed as expected** (stable `ui://agentstate/view-host/v1.html` versus expected content-addressed URI).
- Additional host-shaped candidate lifecycle probe: **failed**, reproducing the blocking replacement retirement described above.
- Candidate worktree remained clean; no code edits were made during review.

# Goal and status

Ultimate goal: preserve a portable, host-independent MCP App whose live bundle bridge remains correct under host caching and lifecycle transitions.

Proximate goal: independently determine whether exact `91a0cbe` safely fixes the Claude cache identity and hidden-first-mount defects. Status: review complete; content-addressed identity approved in isolation, combined candidate rejected pending lifecycle correction and scope resolution.
