---
type: Plan
title: 'PR #177 fullscreen lifecycle — fresh-launch resume plan'
actor: codex-pr177-followup
timestamp: '2026-07-29T18:00:39.789Z'
---
# Goal

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: make an authorized durable View survive host presentation and suspension
visibility cycles without reusing a possibly stale launch or subscription baseline. This serves
the ultimate goal by making the host-supported fullscreen path safe and usable.

# Domain model

- **Host display transition**: an advisory `ui/request-display-mode` request plus zero or more
  partial host-context and browser-visibility events. The protocol supplies no causal ID or event
  ordering across those channels.
- **Visibility quarantine**: the period after an authorized App document becomes hidden. The old
  launch stays mounted but cannot forward bridge/poll/frame activity; its epoch is invalidated.
- **Fresh launch rotation**: an app-only server operation that accepts only the old opaque launch
  ID, derives the View registry ID from server-owned state, and mints a new exact current launch
  with authorization recomputed from the current bytes/access/policy tuple.
- **Adoption**: the client accepts a replacement only while the old launch, suspension marker,
  resume generation, and visible document are still current. Mounting the replacement advances the
  epoch and closes the old launch.
- **Explicit teardown**: `ui/resource-teardown`, the protocol lifecycle authority. Teardown is
  terminal and must await closure of the currently known durable launch.

# Architectural finding

The host may order request resolution, host-context change, hidden, and visible events
arbitrarily—or omit some of them. A pending-request flag, timeout, or host-context match therefore
cannot distinguish fullscreen from an unrelated suspension. Same-launch resume is also unsafe:
old in-flight poll acknowledgements and bridge replies share its server subscription state.

Every authorized hidden→visible cycle will consequently use the same deterministic policy:
quarantine the old epoch, then rotate to a new server launch and remount. Presentation ordering is
irrelevant to authority and freshness.

# Invariants and acceptance

1. No client-supplied View ID, HTML, content hash, capability, or authorization boolean influences
   resume. The server derives identity only from the old launch.
2. Resume requires an existing, session-authorized `bundle-read` old launch. The new launch is
   independently current and independently authorization-scoped.
3. Changed bytes/access/policy never inherit approval. A current replacement may return
   unauthorized and must show the ordinary exact-byte approval dialog.
4. Only one resume call is in flight for one suspended launch/epoch. A result is adopted only when
   the old payload, suspension marker, resume generation, epoch, and visible state still match.
5. Every unadopted replacement learned by the client is immediately closed. A hard host unmount
   can still orphan a response the client never receives; the existing one-hour TTL, 256-launch
   cap, and stdio process lifetime bound that read-only experimental debt.
6. Old delayed bridge, poll, sizing, and iframe events fail the launch/epoch/source gates after
   adoption.
7. Explicit teardown and unexpected nested navigation remain terminal. Teardown awaits closure of
   the currently known launch before returning.
8. Inline→fullscreen and fullscreen→inline both remount a usable registered View. An unsolicited
   hidden→visible cycle follows the same fresh-launch path.
9. Display controls remain host-capability gated and accept an actual mode that differs from the
   request.

# Implementation sequence and ownership

1. Builder `/root` adds a red server regression for the app-only resume contract and a browser-host
   regression that reproduces the real Expand visibility cycle against the bundled App.
2. Builder adds `resume_durable_view` with strict `{ launchId }` input, server-owned identity
   derivation, independent currentness/authorization evaluation, and no model visibility.
3. Builder replaces visible-after-hidden retirement with a single-flight fresh-launch rotation,
   stale-result closure, and awaited teardown closure. Display-mode code remains causally
   independent.
4. Independent Reviewer audits the exact implementation SHA. Any blocking finding returns to the
   Builder and requires a new exact-SHA review.
5. Independent QA runs only after Review approval: focused MCP unit/browser suites, UI Chromium,
   and the unpiped repository `npm run check`.
6. Builder pushes the existing PR branch, updates PR/task evidence, and asks Brian to repeat the
   real host Expand→Return-inline dogfood. The Task remains open until that final host pass.

# Dependencies and parallelism

Research and plan review were parallel and are complete in
`context-notes/pr-177-fullscreen-semantics-research` and
`context-notes/pr-177-fullscreen-plan-review`. Builder work is serial because the server contract
and client state machine must change together. Review depends on a committed implementation SHA.
QA depends on Review approval. Push and real-host dogfood depend on QA.

# Reject criteria

- Any timing window, timeout, request-pending exemption, or inferred ordering.
- Same-launch polling/subscription reuse after visibility return.
- Client-supplied registry identity or authorization state.
- A replacement accepted after payload replacement, another suspension epoch, teardown, or
  navigation.
- Build→QA without independent exact-SHA Review.

[failure evidence](../context-notes/pr-177-fullscreen-visibility-failure-ca6d6aa.md)

[implements](../tasks/mcp-durable-view-intrinsic-sizing.md)
