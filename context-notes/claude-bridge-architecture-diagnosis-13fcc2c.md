---
type: Context Note
title: 'Architecture diagnosis: Claude bridge initialization at 13fcc2c'
actor: claude-bridge-architecture
timestamp: '2026-07-29T21:29:10.960Z'
---
# Summary

The strongest code-level hypothesis for the Claude Desktop stall is an **already-hidden, pre-authorized first mount**. The server log has only the initial model-visible tool call and no app-only authorization call, consistent with machine-wide authorization already being persisted. Exact `13fcc2c` then renders an authorized payload immediately, clears `suspendedDurableLaunch`, and mounts the child without consulting `document.visibilityState`. The Roadmap child emits one-shot `hello` and `subscribe` requests. If Claude preloaded the outer App while its document was already hidden, the outer handler discards both. Because there was no hidden transition after the payload became current, no suspension marker exists; a later visible transition has nothing to resume. Expand/Return inline changes display context, not necessarily Page Visibility state, and produced no server-side resume.

A second, independent defect makes exact-build verification ambiguous: every outer-shell revision advertises the same cacheable URI, `ui://agentstate/view-host/v1.html`. The MCP Apps specification defines the URI as the resource's unique identifier and permits hosts to prefetch/cache UI resources. The earlier ChatGPT/Codex screenshot did demonstrably execute pre-`c5e8a74` shell bytes, but that screenshot predates the Claude run and does **not** prove Claude used stale bytes. The Claude screenshots contain no discriminating old/new text. Therefore the diagnostic build must use a unique/content-derived resource URI and a build fingerprint before its lifecycle telemetry is trusted.

No source change should be made from inference alone. The planned throwaway probe is sufficient only after adding shell-byte identity. If it confirms `visibilityState === "hidden"` at authorized render and no later hidden event, the minimal lifecycle repair is to treat an authorized payload received while hidden as suspended before mounting any child, then reuse the existing fresh server-owned `resume_durable_view` path when visible.

# Whole-system model

## Components and timing

1. `show_view` mints an exact-byte durable launch and returns a payload plus `_meta.ui.resourceUri`.
2. Claude resolves the URI to the trusted outer App. It may preload/cache this resource before the tool runs.
3. The outer App receives or recovers the tool result. If the registered bytes are already authorized machine-wide, it skips the interactive authorization path and immediately activates the durable payload.
4. `renderDurablePayload` at `13fcc2c` increments the epoch, stops polling, closes dialogs, sets `suspendedDurableLaunch = null`, records the payload, and mounts the approved HTML in a sandboxed blob-backed child. It does not branch on current visibility.
5. The Roadmap child bootstrap runs synchronously. It sends one `hello` and one `subscribe`; neither has a retry, visibility listener, or timeout. Static loading placeholders remain while those promises are unresolved.
6. The outer `message` handler first applies frame-size classification. Bridge frames are `other`, so sizing does not consume them.
7. It then requires: `document.visibilityState !== "hidden"`, exact current child `event.source`, durable schema, and authorization. A hidden first mount is silently discarded before `forwardDurableBridgeMessage`.
8. `App.callServerTool` itself is a standard JSON-RPC `tools/call` through the host bridge. The SDK adds no visibility check. Prior Claude instrumentation established that app-initiated calls and structured responses are normally proxied faithfully.
9. After a bridge call resolves, exact `13fcc2c` rechecks launch, epoch, visibility, and suspension before replying. Subscribe success starts polling.
10. A later hidden event on an active payload records the suspended launch, increments epoch, invalidates sizing, and stops polling. A visible event with that marker calls `resume_durable_view`, accepts only a fresh server-owned replacement, and remounts the child.
11. A visible event **without** that marker does nothing. This is the gap when the payload is activated after the document is already hidden.

## Differences from the previously working/global shell

- The child Roadmap bootstrap and the outer initial bridge admission checks are materially the same: one-shot child requests, sizing first, then visibility/source/schema/authorization.
- Pre-`c5e8a74` visible recovery retired the launch and displayed “Reopen this View after suspension…”. Exact `13fcc2c` derives a fresh launch through `resume_durable_view`.
- Exact `13fcc2c` also hardens stale bridge/poll/display responses with epoch and currentness checks. These checks occur after `App.callServerTool` and cannot explain the complete absence of a server call.
- Both builds use `ui://agentstate/view-host/v1.html` despite byte-distinct outer shells. Local artifact comparison:
  - exact `13fcc2c`: 740,804 HTML bytes, SHA-256 `0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee`, includes `resume_durable_view`;
  - previously built/global worktree: 737,253 HTML bytes, SHA-256 `7b2bf2a468c0cd137be72c45849452426e99f340d76d95427b20d76ed6dad2dd`, includes the old reopen sentence and no resume tool.
- Persisted authorization changes first-mount timing even when source code is unchanged: an earlier successful run that required a human approval click mounted the child after an interactive delay, while this Claude run appears to have received an already-authorized payload immediately.

## External state and invariants

- Claude owns resource preloading/cache, Page Visibility state, iframe presentation, and display transitions.
- Machine-wide exact-byte authorization changes whether activation follows a user gesture.
- Tool metadata URI, registered resource URI, and `resources/read.contents[].uri` must be identical.
- One resource URI must map immutably to one exact shell byte sequence.
- Hidden launches remain quarantined. No repair may weaken source, launch, authorization, epoch, or visibility checks.
- Resume derives a replacement only from server-owned launch identity; neither the child nor model gains View-selection authority.

# Ranked hypotheses

1. **Already-hidden pre-authorized mount loses the one-shot child handshake — high.** Exact code has the gap, the server saw no app-only authorization or bridge call, and the browser harness does not cover it. It explains why persisted authorization can fail while a prior click-to-authorize path worked.
2. **Mutable shell bytes alias under the unchanged cacheable UI URI — medium as Claude's immediate cause, certain as a verification defect.** The protocol permits caching and the builds are byte-distinct under one URI. The earlier ChatGPT/Codex screenshot proves this happened on that host surface, but the later Claude screenshots do not identify their executed bytes.
3. **Claude's nested frame reports an unexpected `event.source` or suppresses child-to-parent `postMessage` — medium-low.** The child visibly renders, its inline scripts are allowed, and the same construction works in tests/other hosts, but only boundary telemetry can exclude a host-specific source/proxy behavior.
4. **The child script never reaches hello because of a runtime/CSP exception — low-medium.** Static placeholders alone cannot prove script execution, though `sandbox="allow-scripts"`, inline-script CSP, and deterministic bootstrap make failure less likely.
5. **Claude rejects `App.callServerTool` before the request reaches the server — low.** The SDK uses normal `tools/call`, prior Desktop probes established app-call forwarding, and the outer visibility/source gate offers an earlier explanation. Instrument call entry and resolution/rejection to close this boundary.

# Minimal safe fix shape

## Verification/infrastructure repair: immutable resource identity

Derive `MCP_VIEW_RESOURCE_URI` deterministically from `MCP_VIEW_HTML`, for example `ui://agentstate/view-host/v1/<full-sha256>.html`. A manual `v2` bump would clear this incident but preserve a second human-coordination surface.

Use one exported value for tool `_meta.ui.resourceUri`, resource registration, and returned content URI. Prove:

- identical HTML yields the same URI;
- a one-byte change yields a different URI;
- advertised, registered, and returned URIs match;
- served bytes hash to the identity embedded in the URI.

This changes resource identity only; it does not affect launch authority, bridge protocol, visibility, or tool exposure.

## Conditional lifecycle repair if the probe confirms hypothesis 1

Make durable activation visibility-aware. When an authorized payload arrives while the outer document is hidden:

- record it as the current suspended/quarantined launch synchronously;
- do not execute/mount the child while hidden (clear or leave the frame inert);
- keep the launch/epoch/source invariants intact;
- on visible, use the existing `resume_durable_view` path to mint and mount a fresh server-owned launch.

Do not add child retry timers, synthesize hello, forward while hidden, weaken `event.source`, reuse a hidden launch, or branch on Claude's name. If the probe instead shows the document visible and a source mismatch, repair the owning host/message primitive against that evidence.

# Plan review and refinements

Verdict on `plans/claude-desktop-durable-bridge-initialization`: **approve after two explicit refinements**. Its dependency chain (diagnosis → red regression → production repair → independent review → QA → real-host acceptance) is sound.

## Refinement 1: prove the diagnostic shell's identity

The throwaway probe must use a unique/content-derived resource URI and expose a build fingerprint. Otherwise Claude may execute cached production bytes and none of the four new telemetry boundaries, producing a false diagnosis. This can be one diagnostic launch: unique URI/fingerprint plus the planned child execution, outer classification, call entry, and call outcome facts.

## Refinement 2: make the regression reproduce authorization and initial visibility ordering

If the probe confirms the hidden-mount hypothesis, the committed browser regression must:

1. set the outer document hidden **before** delivering an already-authorized durable result;
2. mount a child that emits a real one-shot hello/subscribe;
3. show that current code sends no `durable_view_bridge`;
4. transition visible without a preceding post-mount hidden event;
5. require one fresh `resume_durable_view`, a remounted child hello, and then bridge/poll traffic;
6. prove delayed traffic from the original launch/epoch remains rejected.

The existing lifecycle fixture is insufficient: it delivers an unauthorized result, authorizes after a click, and its child never emits a bridge hello. Existing tests always dispatch a hidden event after authorization, so they cannot expose missing initial suspension state.

## Dependencies

- Build/finalize `MCP_VIEW_HTML` before deriving its URI.
- Feed tool metadata and resource registration from the same derived URI.
- Run the unique-URI probe before treating telemetry absence as evidence.
- Make lifecycle implementation conditional on probe evidence and a red host-shaped regression.
- Preserve the explicit mandatory exact-SHA Reviewer gate before QA.
- QA must use an isolated build carrying the reviewed HTML and derived URI, not a stale working-tree/global artifact.

## Sufficiency of the proposed sequence

With these refinements, the probe/regression sequence is sufficient before implementation. Without a unique URI it cannot prove which code ran; without an already-authorized, initially hidden, one-shot child regression it does not model the suspected failure.

# Source pointers at exact `13fcc2c`

- `packages/mcp-app/src/server.ts:49`: stable `MCP_VIEW_RESOURCE_URI`.
- `packages/mcp-app/src/server.ts:472`: `show_view` advertises that URI.
- `packages/mcp-app/src/server.ts:837-866`: resource registration and returned content reuse the same URI with mutable `MCP_VIEW_HTML`.
- `packages/mcp-app/src/view.ts:301-335`: durable activation clears suspension and mounts an authorized child without inspecting current visibility.
- `packages/mcp-app/src/view.ts:529-560`: app-only bridge call and post-await currentness gate.
- `packages/mcp-app/src/view.ts:738-810`: exact fresh-launch resume logic, which requires a pre-existing suspension marker.
- `packages/mcp-app/src/view.ts:833-865`: sizing classification followed by hidden/source/schema/authorization admission.
- `packages/mcp-app/src/view.ts:867-887`: only a post-activation hidden event creates the marker used by visible recovery.
- `examples/views/roadmap.html:213-220`: one-shot hello/watch initialization with no retry.
- `packages/mcp-app/test/fixtures/display-mode-host.ts:15-35, 199-210`: current registered child has no bridge bootstrap, and the initial test result is unauthorized.
- `packages/mcp-app/test/frame-sizing.browser.spec.ts:63-92, 333-425`: visibility helper always dispatches an event after activation; lifecycle coverage therefore misses already-hidden activation.

# Acceptance refinements

- Record the diagnostic/reviewed shell fingerprint and resource URI in real-host evidence.
- Confirm the first Roadmap graph loads without requiring Expand.
- Confirm initial server traffic includes child hello/subscribe via `durable_view_bridge`, followed by polling.
- Cycle Expand/Return inline, then perform a real background/restore and verify a fresh launch.
- Preserve stale-response, teardown, source/epoch, display-race, ChatGPT sizing, focused MCP, and unpiped repository gates.
- Do not treat clearing Claude's cache as the product fix.

# Goals and status

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: identify the exact initialization break at merged head `13fcc2c` and define the smallest lifecycle-safe correction. The investigation identifies an untested already-hidden/pre-authorized activation gap as the leading hypothesis and a reused cacheable shell URI as a mandatory verification correction; the unique-URI boundary probe remains the causal gate.

Status: architecture/plan review complete; no source edits made.

Official protocol reference: https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx

[tracks](../tasks/claude-desktop-durable-bridge-initialization.md)

[reviews](../plans/claude-desktop-durable-bridge-initialization.md)

[evidence](claude-pr177-initial-bridge-stall-13fcc2c.md)
