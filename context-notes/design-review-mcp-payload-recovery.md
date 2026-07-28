---
type: Context Note
title: >-
  Design review: MCP shell payload recovery — REDESIGN (resolve_launch by
  toolCallId; probe gates the build)
actor: claude-main
timestamp: '2026-07-28T00:40:23.683Z'
---
Independent design review of the proposed structuredContent-fallback fix, run BEFORE
implementation per Brian's process call (2026-07-27). Verdict: REDESIGN — recovery shape right
(in-shell, over the app channel), recovery key wrong, root-cause framing wrong, gating assumption
unverified.

# Key findings

1. ROOT CAUSE MISREAD: ext-apps' 'Host supports structured content' text lives under
   updateModelContext/message — app-to-HOST modalities, not host-to-app delivery. No such host
   capability exists to be withheld; McpUiToolResultNotification carries the full CallToolResult.
   Actual cause unknown; a payload-SIZE limit (generated payloads reach ~1MB) fits the symptom
   equally and invalidates every in-shell fetch design if true.
2. SECURITY (blocking, proposal only): re-invoking show_view from the App requires making it
   app-callable — granting the App arbitrary objectIds/query selection over the bundle. Also
   violates the security-unification design's invariant (App forwards only an opaque launch ID +
   bounded bridge request; never View specification). show_view is declared visibility:['model']
   (server.ts:448) — the proposal bet on hosts ignoring our own declaration.
3. UNVERIFIED GATE: no shell path has ever proven callServerTool responses preserve
   structuredContent on Desktop (approval/bridge/polling only run AFTER a first render, which
   never happened there). If proxied responses also drop it, the durable bridge is ALREADY
   non-functional on Desktop — a larger unit than this one.

# Adopted design (pending probe)

App-only resolve_launch keyed on hostContext.toolInfo.id (the ui/initialize handshake already
carries the tools/call requestId; server callbacks see RequestHandlerExtra.requestId): show_view
records requestId->launchId in a bounded TTL one-shot map; resolve_launch({toolCallId}) with
visibility:['app'] re-derives the already-minted payload from launch state (no payload copy, no
second launch, no re-frozen query). Fallback only if toolInfo.id is absent on Desktop:
argumentless most-recent-undelivered-launch, one-shot, with the concurrency ambiguity stated.
Keep from the draft: the pure result-recovery module + validator consolidation (delete view.ts
duplicates in the same unit). Also in-unit: never recover from isError results, surface the
server's error text instead of the generic message, hard per-instance retry cap.

# Build gates (required before implementation)

1. Throwaway instrumentation branch, ONE Desktop launch, artifact via an app-only echo tool that
   writes findings server-side: (a) ontoolinput fired? arg keys; (b) actual getHostCapabilities
   keys; (c) toolInfo.id present?; (d) delivered result shape (keys, typeof structuredContent,
   isError, content sizes); (e) callServerTool response structuredContent for SMALL and ~1MB
   payloads; (f) does result._meta survive the notification (if yes and structuredContent no,
   zero-round-trip _meta mirroring beats everything). NEVER merged.
2. Build STOPS if (e) fails — different, larger unit.
3. Board framing corrected before build (done); upstream report held until probe evidence.
4. Diagnostic wording from observed evidence, never from a capability field that does not exist.

[the claimed unit](../tasks/mcp-shell-payload-without-structuredcontent.md)
[corrected field report](mcp-durable-view-render-field-report.md)
[security design this now conforms to](../designs/mcp-view-security-model-unification.md)
