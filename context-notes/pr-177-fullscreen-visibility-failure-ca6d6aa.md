---
type: Context Note
title: 'PR #177 fullscreen visibility transition failure at ca6d6aa'
actor: codex-pr177-followup
timestamp: '2026-07-29T17:44:58.941Z'
---
# Summary

The real Codex host's inline-to-fullscreen transition changes the App document's visibility. PR
#177 currently misclassifies that expected host presentation transition as a true suspension,
retires the authorized durable launch, and replaces the expanded View with a reopen error.

# Observed failure

Brian performed the real Codex/ChatGPT Work MCP Apps dogfood against exact PR #177 head
`ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a` on 2026-07-29. The registered
`pages-registry/roadmap` View launched on first insertion, showed its exact-byte authorization
dialog, authorized successfully, and exposed the host-capability-gated **Expand** control.

Clicking **Expand** entered the host's expanded surface but immediately replaced the View with:

> Reopen this View after suspension so AgentState can establish a fresh subscription baseline.

This fails the fullscreen round-trip acceptance criterion. PR #177 remains draft.

# System model

The MCP server mints one durable launch for the registered View. The trusted outer App shell owns
authorization, polling, bridge forwarding, frame sizing, and display-mode requests. The registered
View runs in the nested sandboxed iframe. The host owns the outer inline/fullscreen presentation
and reports its current and available display modes through host context.

The durable launch currently treats every authorized-document transition to
`document.visibilityState === "hidden"` as a true suspension: it records the launch ID, advances
the frame epoch, clears sizing state, and stops polling. When the same document becomes visible
again, it retires the payload so a stale subscription baseline cannot resume.

The real host's inline-to-fullscreen transition also changes document visibility. That expected
presentation transition is therefore misclassified as a suspension. When the expanded surface
becomes visible, the handler retires the still-current launch and renders the red reopen message.

# Invariants

- A genuine background suspension must not resume a stale durable subscription baseline.
- A host-mediated display-mode transition for the same authorized launch must preserve the launch,
  bridge authority, polling continuity, and nested View.
- Host teardown, unexpected iframe navigation, changed launch identity, and genuine suspension
  remain fail-closed.
- The **Expand** control remains absent unless the host advertises fullscreen.
- A fix must not rely on timing guesses about when the host emits visibility or host-context
  events.

# Unverified ordering

The exact ordering among `requestDisplayMode()` resolution, `visibilitychange`, and
`onhostcontextchanged` has not yet been captured. The regression must model all ordering variants
the SDK contract permits instead of assuming the request promise resolves before the document is
hidden.

# Goals and next proof

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: distinguish host-mediated display-mode transitions from true durable-View
suspension without weakening suspension safety. This serves the ultimate goal by allowing the
host-supported expanded presentation to preserve a valid, authorized live View.

Before another implementation change, add a deterministic lifecycle regression that reproduces
the real sequence and proves:

1. inline → fullscreen visibility transitions preserve the same authorized launch;
2. fullscreen → inline preserves it as well;
3. an unsolicited hidden → visible suspension still retires the launch;
4. teardown, navigation, launch replacement, and epoch/source validation remain fail-closed.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)
