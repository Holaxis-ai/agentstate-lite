---
type: Context Note
title: 'PR #177 fullscreen lifecycle semantics research'
actor: pr177-fullscreen-research
timestamp: '2026-07-29T18:00:50.286Z'
---
# Summary

PR #177 head `ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a` cannot deterministically
classify a `document.visibilityState` hidden/visible cycle as either fullscreen movement or
background suspension from MCP Apps protocol signals. The protocol gives display-mode response and
host-context events no ordering relationship to browser visibility, and visibility is not an MCP
lifecycle event. The deterministic correction is therefore to stop classifying the cause: quarantine
every hidden authorized launch, then rotate to a fresh server-owned launch on visible. That retires
the old subscription identity, remounts exact current bytes, and forces the nested View to query and
subscribe from a fresh baseline. `ui/resource-teardown`, unexpected child navigation, launch
replacement, and server currentness failures remain terminal.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: replace visibility-cause guessing with a deterministic fresh-launch transition that
keeps fullscreen usable and stale subscription state fail-closed. This serves the ultimate goal by
making real-host presentation transitions safe without weakening exact-byte launch authority.

## Contract facts

- Installed SDK `@modelcontextprotocol/ext-apps` is `1.7.5`, protocol `2026-01-26`.
- `requestDisplayMode()` sends `ui/request-display-mode` and returns the actual mode; the host may
  return a different/current mode (`node_modules/@modelcontextprotocol/ext-apps/dist/src/app.d.ts:
  1334-1362`; `spec.types.d.ts:592-616`).
- Host display-mode state is carried by `HostContext.displayMode`; partial changes arrive through
  `ui/notifications/host-context-changed` (`spec.types.d.ts:219-290`). The SDK merges that partial
  context before the app handler runs (`app.d.ts:712-746`).
- The stable specification does not order request settlement against host-context notification, and
  neither is ordered against browser `visibilitychange`. Browser visibility is not a protocol
  lifecycle message.
- Actual host teardown is separate: the host MUST send `ui/resource-teardown` before unmounting and
  SHOULD wait for the response (`app-bridge.d.ts:1093-1116`; `spec.types.d.ts:313-329`).
- Primary source:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx

## Current implementation and failure

The shell keeps payload, bridge epoch, polling state, suspension marker, sizing session, and host
context as parallel globals (`packages/mcp-app/src/view.ts:59-70`). The current visibility handler
marks every authorized hidden durable View suspended, advances the epoch, clears sizing, and stops
polling; visible then always calls `retirePayload()` and renders the reopen error
(`view.ts:745-769`). That is the exact mechanism triggered by Codex fullscreen.

The existing fences are otherwise sound building blocks:

- durable activity requires current epoch, visible document, no suspension marker, matching
  authorized launch (`view.ts:407-425`; `durable-activity.ts:1-14`);
- delayed poll/bridge results recheck that fence before release (`view.ts:435-480,493-524`);
- unexpected nested navigation retires the launch (`view.ts:696-709`);
- replacing a durable payload closes the previous launch (`view.ts:284-334`);
- server polling keeps a delivered change pending until acknowledgement and owns the baseline
  (`packages/view-runtime/src/bridge.ts:356-415`); subscribe creates/replaces the baseline
  (`bridge.ts:493-498`).

One adjacent teardown weakness should be corrected in the same lifecycle unit:
`closeDurableLaunch()` is fire-and-forget (`view.ts:132-138`), so the async `onteardown` handler
returns `{}` before server revocation is known to finish (`view.ts:771-785`). The protocol permits
the host to unmount immediately after that response.

## Event model and permitted orderings

Events:

- `Q(t)`: app sends a request for target mode `t`;
- `P(m)`: request promise settles with actual mode `m`;
- `X(m)`: host-context notification reports mode `m`;
- `H`, `V`: browser document becomes hidden, then visible;
- `T`: host sends protocol teardown;
- `N`: approved nested child navigates unexpectedly;
- `L2`: a different tool result/launch replaces the current payload;
- `D(e)`: delayed bridge/poll result for epoch `e`.

For an accepted request, after `Q(t)` the protocol permits every ordering of `P(t)`, `X(t)`, `H`,
and `V` that preserves only `H < V`:

1. `H V P X`
2. `H V X P`
3. `H P V X`
4. `H P X V`
5. `H X V P`
6. `H X P V`
7. `P H V X`
8. `P H X V`
9. `P X H V`
10. `X H V P`
11. `X H P V`
12. `X P H V`

`X` may be omitted, giving `H V P`, `H P V`, or `P H V`; `H/V` may be omitted because a host can
change presentation without hiding this document. A host-driven transition may produce `X` without
local `Q`. A declined request returns the current mode or rejects. `T` may occur after initialization
at any point and dominates all other states.

This produces an indistinguishability proof. One permitted fullscreen trace is
`Q, P(fullscreen), X(fullscreen), H, V`. Another permitted trace has the same prefix and event
sequence but the host changed mode without hiding and the later `H,V` is an unrelated suspension.
No app algorithm can preserve the first while revoking the second unless it uses a timer or
host-specific causal metadata. A pending/confirmed display-request flag merely creates a stale
exemption.

## Recommended deterministic state machine

Keep display mode as presentation state only. Make durable lifecycle explicit:

1. `active(L,E)` — visible, authorized exact launch; bridge/poll may run.
2. `quarantined(L,E+1)` — entered on `H`; advance epoch, stop polling, clear sizing, retain exact
   payload only as recovery input. No child message or delayed result may forward.
3. `resume-pending(L,E+1,R)` — entered on `V`; one app-only
   `resume_durable_view({launchId:L})` call is in flight, keyed by resume generation `R`.
4. `active(L',E+2)` — adopt only a guarded fresh result; remount exact bytes, then the child
   re-queries and re-subscribes. `L'` has no subscription state inherited from `L`.
5. `closed` — teardown/navigation/replacement/reload/currentness failure.

The server resume operation should:

1. resolve the old server-owned launch and require current `bundle-read` authority plus the
   existing exact authorization;
2. resolve/mint a fresh current launch from the old registry ID;
3. recompute authorization from the fresh exact tuple—never copy the old boolean; changed
   bytes/access may return an unauthorized payload requiring a new prompt;
4. return the fresh payload without copying the old subscription baseline.

The client adopts only if current payload is still `L`, suspension marker is `L`, captured
epoch/resume generation still match, and the document is visible. It renders `L'` synchronously
after that guard and then closes `L`. A hidden-again, replacement, navigation, or teardown
invalidates `R`; any late `L'` must be closed and never rendered. Resume must be single-flight per
suspended epoch.

Fresh launch rotation is simpler and safer than same-launch recovery. Same-launch recovery needs
another server subscription epoch/reset primitive to stop an old in-flight poll from racing the
new baseline, and it does not literally retire an unsolicited suspension. The fresh launch makes
all old poll, acknowledgement, bridge, and sizing state unreachable by identity.

Leaving `L` alive until guarded adoption preserves retryability, but creates one bounded caveat:
teardown or transport loss while resume is in flight can mint an `L'` the client never learns to
close. Client code must close every unadopted result and await known closes in `onteardown`.
Process exit and the one-hour launch TTL bound the remaining leak. If strict immediate revocation is
required, add server-side provisional-child tracking/cascade (closing `L` also closes unadopted
children) or a two-phase adopt tool; do not pretend fire-and-forget closure proves it.

## Regression tests

1. Extract a pure lifecycle reducer and table-test all 12 accepted `P/X/H/V` orderings, the three
   no-`X` variants, no-visibility transitions, both inline→fullscreen and fullscreen→inline, and
   declined/error results. Presentation-event order must not alter launch lifecycle.
2. Unsolicited `H→V` must quarantine `L`, reject all `D(E)`, rotate to `L'`, retire `L`, remount,
   and establish a new subscription only after the new child subscribes.
3. Exercise old poll races: pending unacknowledged change, acknowledgement in flight, unchanged
   poll in flight, and a bridge reply in flight. None may post into `L'` or mutate its baseline.
4. Exercise rapid `H,V,H,V` and duplicate visible events. Exactly one resume per generation may be
   adopted; every other minted launch is closed.
5. Change entry bytes/access and expire/revoke `L` during quarantine. Resume must never inherit
   authorization; it prompts again or fails closed.
6. Inject `T`, `N`, and `L2` at every resume boundary. They dominate, invalidate the async result,
   close known launches, and prevent resurrection.
7. Replace the current source-regex lifecycle assertion (`packages/mcp-app/test/frame-sizing.test.mjs:
   235-292`) with behavioral unit tests plus a browser harness using the SDK bridge. Keep the
   existing fixed/flexible sizing browser tests.
8. Add a teardown test proving the handler does not resolve until the close call for the current
   launch completes; separately document/test the TTL or provisional-child backstop for a late
   resume result.

## Acceptance-criterion correction

“Fullscreen `H→V` preserves the same launch while unsolicited `H→V` retires it” is not implementable
portably from current MCP Apps signals. The executable criterion should be:

> Any hidden interval quarantines the old launch and cannot resume its baseline. On visible, the
> shell may automatically rotate to a fresh exact launch and fresh child subscription; teardown,
> navigation, replacement, currentness failure, and unadopted async results remain fail-closed.

If preserving the same launch ID is mandatory, disable fullscreen or require an explicit
host-specific causal token. Do not use elapsed time to infer causality.
