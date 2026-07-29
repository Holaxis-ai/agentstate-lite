---
type: Context Note
title: 'PR #177 fullscreen lifecycle plan and security review'
actor: pr177-fullscreen-plan-review
timestamp: '2026-07-29T17:47:20.513Z'
---
# Summary

Independent plan and security review for the fullscreen visibility failure observed during real
Codex MCP Apps dogfood at exact PR head `ca6d6aa`.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: define a race-complete, fail-closed repair plan that distinguishes host-mediated
display-mode transitions from genuine suspension without weakening durable-launch authorization.
This serves the ultimate goal by preserving an authorized live View across supported presentation
changes while continuing to retire unsafe stale sessions.

# Scope and review posture

Review the complete authorized durable-launch lifecycle: outer shell authorization, nested frame,
polling and bridge forwarding, display-mode request and host-context transitions, document
visibility, teardown/navigation, launch replacement, and epoch/source validation.

Do not edit product code. Challenge likely fixes for event-order assumptions, timing windows,
replay/confused-deputy behavior, and security regressions. Define deterministic acceptance tests
for every ordering of request resolution, visibility, and host-context events, plus genuine
suspension.

# Progress

Repository guide and required skills loaded. Read the ultimate-goal doc, task
`tasks/mcp-durable-view-intrinsic-sizing`, and failure note
`context-notes/pr-177-fullscreen-visibility-failure-ca6d6aa`. Implementation inspection and plan
adjudication are next.

Environment note: requested AgentState Lite skill snapshot `1.0.119` was absent from the installed
plugin cache; the available current snapshot `1.0.131` was read and followed instead.
