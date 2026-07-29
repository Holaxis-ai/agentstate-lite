---
type: Plan
title: Claude Desktop durable bridge initialization repair plan
description: >-
  Probe, regress, repair, review, and validate the post-merge Claude Desktop
  registered View initialization failure.
actor: codex-pr177-followup
timestamp: '2026-07-29T21:21:35.940Z'
---
# Purpose

Repair the exact merged MCP App so a registered View establishes its first durable bridge baseline in Claude Desktop without weakening launch authority, visibility quarantine, or ChatGPT sizing/fullscreen behavior.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: make the first registered-View bridge handshake deterministic across Claude Desktop and ChatGPT while preserving fresh-launch recovery after real suspension.

# Domain model

- **Registered child View**: exact approved bundle-authored HTML running in a sandboxed nested iframe.
- **Trusted outer shell**: the MCP App resource that owns authorization, source/launch/epoch validation, bridge forwarding, polling, sizing, and display requests.
- **Host bridge**: the MCP Apps postMessage transport between the outer shell and Claude or ChatGPT.
- **Durable bridge hello**: the child View one-shot request that asks the server for bundle identity and begins graph access.
- **Active launch**: visible, authorized, current server-owned launch whose child messages may forward.
- **Quarantined launch**: launch invalidated by a hidden interval; its delayed child/server traffic must not forward.
- **Resume**: app-only server operation that derives a fresh launch from server-owned identity and remounts the child with a fresh subscription baseline.

# Work and dependencies

1. **Diagnostic probe — Builder / primary agent.** Create a detached throwaway build, never committed or merged, that exposes only four boundary facts: child script execution; outer receipt and source/visibility classification; entry into server-tool forwarding; and resolution/rejection. Run one Claude launch. Dependency: current field report.
2. **Diagnosis and plan review — architecture and test-model agents.** Independently inspect exact code and existing harness, rank hypotheses, review this plan, and identify the smallest host-shaped regression. Dependency: field report; probe may refine conclusions.
3. **Failing regression — Builder.** Add a committed browser or unit regression that reproduces the exact probe-established event ordering and fails against current main. Dependency: probe diagnosis and plan review.
4. **Production repair — Builder.** Change the owning lifecycle/bridge primitive only. Do not add retry timers, Claude-specific branches, host-name detection, weaker source checks, or alternate bridge implementations. Dependency: red regression.
5. **Builder verification.** Run focused MCP unit and Chromium suites, typecheck, then unpiped root `npm run check`. Commit one coherent unit and push the feature branch. Dependency: green regression and clean worktree.
6. **Independent exact-SHA review — Reviewer agent.** Review system invariants, probe-to-regression provenance, security boundaries, and code. Probe the regression red against the parent and sample focused tests. This is a mandatory dependency before QA.
7. **Adversarial QA — QA agent.** After review approval, verify the reviewed SHA in a fresh isolated checkout, including initial hidden/visible mount, bridge hello, display transitions, suspension/resume, stale traffic, and server-tool visibility. Dependency: review pass.
8. **Real-host acceptance — Brian.** Point Claude Desktop at the exact reviewed build, launch once, confirm the graph loads immediately, cycle Expand/Return inline, and background/restore. Recheck ChatGPT only if the repair changes shared lifecycle behavior. Dependency: review and QA.

# Acceptance

- The diagnostic evidence identifies the first missing boundary rather than inferring from a spinner.
- The regression matches the observed host ordering and is demonstrably red on the parent.
- First launch loads the real Roadmap data in Claude Desktop.
- Display transitions work repeatedly when advertised.
- Background suspension rotates to a fresh launch and does not release stale child, poll, or bridge traffic.
- No source/launch/epoch validation is weakened; no timing guess or host-specific API is introduced.
- Independent review passes before adversarial QA; repository gate and required real-host acceptance pass.

[implements](../tasks/claude-desktop-durable-bridge-initialization.md)

[field evidence](../context-notes/claude-pr177-initial-bridge-stall-13fcc2c.md)
