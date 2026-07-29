---
type: Context Note
title: Claude bridge QA orientation at 13fcc2c
actor: claude-bridge-test-research
timestamp: '2026-07-29T21:19:23.607Z'
---
# Summary

Read-only QA orientation for isolating Claude Desktop's missing first durable bridge event at exact PR 177 head `13fcc2c`.

## Goals

Ultimate goal: make agentstate-lite dependable, conflict-safe shared memory whose authorized conversational Views become usable immediately across supported hosts.

Proximate goal: isolate the first missing event in Claude Desktop's exact `13fcc2c` registered-View launch path and define a host-shaped red/green regression, so the fix restores first bridge initialization without weakening PR 177's suspension, epoch, sizing, or fullscreen invariants.

## Current system model

The trusted outer MCP App receives an authorized registered View and mounts its untrusted HTML in a nested iframe. The child must emit bridge `hello`; the outer shell must validate source, launch, epoch, authorization, visibility, and suspension state; the outer then calls app-only `durable_view_bridge`; Claude must forward that tool call to the MCP server; the reply must return to the child. The real Claude run reaches authorization and fullscreen-capable shell rendering but remains on the Roadmap loading state. Server logs contain no app-only bridge call, resume, poll, or close event. Therefore the failure is upstream of server receipt and is presently ambiguous among missing child hello, outer-shell rejection, and host non-forwarding.

## Test-research constraints and plan

This is read-only QA investigation: no source edits, commits, pushes, or PR mutations. Inspect exact `13fcc2c`, the actual Roadmap bridge client, and existing unit/Playwright host fixtures. Identify the smallest deterministic host-shaped regression that proves authorized mount plus fullscreen advertisement plus child loading plus zero server-directed bridge calls. Instrumentation must separately expose: child hello observed; outer acceptance/rejection with reason; outer `callServerTool` invocation; host receipt; server receipt/reply.

## Unverified assumptions

- Claude may expose a rendered App document as `visibilityState=hidden`, causing an outer activity gate to reject the first child hello.
- The current Playwright registered-View fixture may never send a real bridge hello and therefore cannot cover first initialization.
- The failure could instead be iframe load/source/epoch ordering or Claude forwarding behavior; evidence must distinguish these before a production fix is selected.
