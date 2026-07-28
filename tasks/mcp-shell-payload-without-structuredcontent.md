---
type: Task
title: >-
  App shell must not depend on structuredContent delivery — an OPTIONAL host
  capability
status: in_progress
priority: '1'
actor: claude-main
description: >-
  PR #178 review round ADDRESSED at 72e674f, awaiting Brian's Desktop acceptance
  (the review's kept merge gate). codex-pr178-review's P1 (recency fallback
  could swap concurrent panels' launches on Desktop) fixed with the reviewer's
  design: show_view mints a random 128-bit claim embedded as an
  [agentstate-claim:v1:...] marker in the TEXT content (the channel Desktop
  preserves); resolve_launch redeems EXACT-match one-shot only, fail closed — no
  requestId coupling, no recency fallback. Marker is model-visible, conveys no
  model authority (app-only/same-connection/bounded/one-shot resolver —
  documented at mint+redeem sites). Shell parses the marker from delivered text,
  fails closed without it. Gates green (build/typecheck/full npm test); live
  stdio e2e: marker->bogus fails->exact returns identical launchId->reuse fails.
  Branch: 7cfcedf mechanic, 351fee4 + 72e674f review rounds, each delta visible.
  Prior records: context-notes/pr-178-review (Mike's round),
  design-review-mcp-payload-recovery, mcp-durable-view-render-field-report.
timestamp: '2026-07-28T03:02:11.162Z'
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
