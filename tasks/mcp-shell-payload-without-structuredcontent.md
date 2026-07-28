---
type: Task
title: >-
  App shell must not depend on structuredContent delivery — an OPTIONAL host
  capability
status: in_progress
priority: '1'
actor: claude-main
description: >-
  REDESIGNED after pre-build independent design review (Brian's call — review
  caught a misread root cause, an authority-widening flaw in the argument-replay
  mechanism, and an unverified gating assumption). Adopted design: app-only
  resolve_launch keyed on hostContext.toolInfo.id, one-shot, re-derived from
  existing launch state — conforms to the security-unification invariant; NO
  dual-visibility show_view, NO argument replay, NO second launch. BUILD GATED
  on a throwaway Desktop instrumentation probe (does the proxied tools/call
  response preserve structuredContent? does toolInfo.id arrive? is it a SIZE
  limit?) — if proxied responses also drop structuredContent, STOP: the durable
  bridge is already dead on Desktop and this becomes a larger unit. Full record:
  context-notes/design-review-mcp-payload-recovery. Claim held by claude-main;
  probe build is the next step.
timestamp: '2026-07-28T00:51:07.964Z'
---
# Root cause (corrected after design review — see the review record for the full chain)

Claude Desktop delivers show_view tool results that the App shell judges payload-less, so nothing
renders on that host (both generated and registered paths; server-side results verified complete
over raw stdio). WHY is unknown: the earlier 'optional structuredContent host capability' framing
was a misreading (that schema text covers app-to-host modalities); a payload-size limit fits the
symptom equally. The shell's sole dependency on result.structuredContent is the fragility either
way.

# ADOPTED DESIGN (supersedes the original proposal — do not build anything else)

The original argument-replay proposal (shell re-invokes show_view with captured tool-input
arguments) is REJECTED: it requires making show_view app-callable (arbitrary bundle selection
handed to the App — authority widening), violates the security-unification invariant (App sends
only opaque IDs, never View specification), and mints duplicate launches. Full adjudication:
[design review record](../context-notes/design-review-mcp-payload-recovery.md).

Build instead, GATED on the probe below:

- show_view records requestId -> launchId in a small bounded, TTL'd, ONE-SHOT map
  (RequestHandlerExtra.requestId is available in every tool callback; the ui/initialize handshake
  delivers the same id to the shell as hostContext.toolInfo.id).
- New app-only resolve_launch({ toolCallId }) (visibility: ['app']) re-derives the already-minted
  payload from existing launch state and deletes the mapping on first read. No payload copies, no
  second launch, no re-frozen query.
- Shell: on a payload-less NON-ERROR result, call resolve_launch with getHostContext().toolInfo.id.
  Never recover from isError results — surface the server's error text instead of the generic
  message. Hard per-instance retry cap (no reference-equality retry bounding).
- Keep the pure result-recovery module; DELETE view.ts's duplicate validators in the same unit.
- Fallback ONLY if the probe shows toolInfo.id absent on Desktop: argumentless
  most-recent-undelivered-launch, one-shot, with the concurrent-panel ambiguity stated in code.

# Build gates (in order; the build does not start until 1-2 pass)

1. Throwaway instrumentation branch (NEVER merged), ONE Claude Desktop launch, findings written
   server-side via a temporary app-only echo tool: (a) ontoolinput fired + arg keys; (b) actual
   getHostCapabilities keys; (c) toolInfo.id present; (d) delivered result shape; (e) callServerTool
   response structuredContent for SMALL and ~1MB payloads; (f) does result._meta survive.
2. STOP if (e) fails: proxied responses also lossy means the durable bridge is already dead on
   Desktop — bigger unit, re-plan.
3. If (f) shows _meta survives while structuredContent does not, zero-round-trip _meta mirroring
   beats resolve_launch — adopt it instead and record the swap.

# Acceptance sketch

- On a host that omits structuredContent from tool-result notifications, generated and durable
  launches both render (or, when the probe's answers make that impossible, the shell shows an
  evidence-based diagnostic describing what was observed — never a capability that does not exist).
- Healthy hosts: behavior unchanged; recovery path provably idle.
- Unit tests: extraction + coordinator ordering/one-shot invariants; isError never recovers;
  registry one-shot consumption; server test pins resolve_launch app-only visibility.

[design review record (authoritative adjudication)](../context-notes/design-review-mcp-payload-recovery.md)
[corrected field report](../context-notes/mcp-durable-view-render-field-report.md)
[security design this conforms to](../../designs/mcp-view-security-model-unification.md)
[Mike's catalog WIP this must not collide with](mcp-durable-view-catalog.md)
