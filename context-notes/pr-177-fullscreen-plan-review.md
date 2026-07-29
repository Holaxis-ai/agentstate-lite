---
type: Context Note
title: 'PR #177 fullscreen lifecycle plan and security review'
actor: pr177-fullscreen-plan-review
timestamp: '2026-07-29T18:01:28.763Z'
---
# Summary

Independent plan and security review for the real Codex fullscreen failure at exact PR head
`ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a`.

## Verdict

**Verdict: reject any repair that tries to classify a hidden document as “fullscreen” or
“suspension” using a pending boolean, event order, elapsed time, or host-context mode alone.**
The pinned MCP Apps SDK exposes three uncorrelated observations:

1. the `requestDisplayMode()` result;
2. partial `ui/notifications/host-context-changed` updates; and
3. ordinary browser document visibility.

It exposes no transition identifier and states no ordering relationship among them. Consequently,
an arbitrarily delayed fullscreen-related hide and the next genuine background hide can be
observationally identical. A one-shot permit merely moves that ambiguity; a timeout turns it into a
timing-dependent race.

The smallest safe usable repair is to stop trying to preserve the old durable launch across any
authorized hidden-to-visible cycle. Gate the old child immediately, then automatically obtain a
new server-owned launch from the old launch's server-owned registry identity and remount it with a
fresh subscription baseline. This safely handles both fullscreen transitions and genuine
suspension without classifying either. The tradeoff is explicit: exact authorized bytes can run
again without another prompt, but transient nested-View UI state is remounted rather than
preserved.

If preserving the **same launch, same subscription, and same nested-document state** is
non-negotiable, the safe decision is to remove fullscreen support for durable Views from this PR.
The current SDK contract does not provide enough correlation to prove that stronger claim.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: define a race-complete, fail-closed repair that makes host-mediated fullscreen
usable without allowing an uncertain durable subscription to resume. This serves the ultimate
goal by preserving exact authorization and current data while replacing an unprovable
same-document-continuity assumption with a reproducible fresh-launch boundary.

# Current system model

## Authorized launch and nested frame

- `show_view({viewId})` resolves a registered View and mints a process-local `PageLaunch` from
  exact registry and entry state (`packages/mcp-app/src/server.ts:367-384`).
- The launch contains a random launch ID, exact registry version, entry key, exact admitted content
  version/type, bytes, access capability, and expiry
  (`packages/view-runtime/src/index.ts:44-58,75-157`).
- Authorization is a process-memory decision over registry ID, exact content version, normalized
  content type, capability, execution mode, and policy version
  (`packages/view-runtime/src/authorization.ts:3-62`;
  `packages/view-runtime/src/index.ts:60-68`).
- The fixed trusted outer App shell mounts those bytes in a nested `allow-scripts` opaque frame
  with the active-View CSP. The child receives no MCP SDK or credential.
- The outer shell validates `event.source`, launch ID, frame epoch, and sizing nonce before
  forwarding frame activity (`packages/mcp-app/src/view.ts:407-425,696-743`).

## Bridge, polling, and suspension

- The outer shell forwards only opaque launch ID plus a bounded request to the app-only bridge
  tool. `BridgeService` resolves and revalidates server-owned launch authority before and after
  each request (`packages/view-runtime/src/bridge.ts:295-354`).
- A subscription baseline is server-owned. A pending change is replayed until the shell sends its
  generation as `acknowledgeGeneration`
  (`packages/view-runtime/src/bridge.ts:356-415`).
- At `ca6d6aa`, every authorized `hidden` event records the launch ID, increments the frame epoch,
  resets sizing, and stops polling. The next `visible` event retires the payload and displays the
  reopen error (`packages/mcp-app/src/view.ts:745-769`).
- This is why real Codex fullscreen fails: its presentation transition includes an outer-document
  visibility cycle.

## Display mode and teardown

- The App declares inline/fullscreen support and exposes the control only when the host advertises
  the target mode.
- `changeDisplayMode()` currently writes the request result into local host context without
  protecting it from a newer partial host-context notification
  (`packages/mcp-app/src/view.ts:648-688`).
- The SDK says host-context notifications are partial and merged before handlers run, but gives no
  ordering guarantee relative to display-mode request settlement
  (`node_modules/@modelcontextprotocol/ext-apps/dist/src/app.d.ts:712-746,1334-1362`).
- `ui/resource-teardown` is an explicit graceful-unmount request and the host waits for its handler
  (`node_modules/@modelcontextprotocol/ext-apps/dist/src/app.d.ts:748-778`). It is terminal and
  should continue revoking state, but the contract does not say it fires for background freeze,
  BFCache, tab visibility, or every suspension. It cannot replace visibility handling.

# Why likely narrow fixes are unsafe

## Pending-transition boolean or grace window

Reject. If the request result or host-context update arrives before visibility changes, clearing
the boolean breaks fullscreen. Keeping it for the “next” visibility cycle can preserve a later
unrelated suspension. A timeout does not add causality.

## Treat host context as correlation

Reject. `displayMode` is a partial state observation, not a transition receipt tied to a particular
visibility event. A later or earlier notification cannot prove which hide it caused.

## Ignore visibility while a transition appears active

Reject. This can resume an old subscription after a genuine suspension that happened during an
unsettled or already-settled display request. It also leaves stale asynchronous bridge and poll
operations insufficiently fenced.

## Treat visibility as pause only and rely on pending-generation replay

Reject without a stronger delivery protocol. Replay protects a pending **unacknowledged**
generation. It does not protect this race:

1. the shell posts a change to the child and stores its generation;
2. the next poll sends that acknowledgement;
3. the server advances its baseline immediately;
4. the document becomes hidden and the local epoch changes while the request is in flight; and
5. the shell drops the response after its local post-request check.

The server has already advanced (`packages/view-runtime/src/bridge.ts:367-373`), while the child
has no explicit receipt proving it processed the earlier `postMessage`. Reusing that launch after
uncertain suspension can therefore skip a change. A child delivery-ack/resume protocol could solve
this later; it is a larger contract change than a fresh remount.

## Rely only on `ui/resource-teardown`

Reject. It safely handles explicit unmount and must stay terminal, but its contract does not cover
all document suspension or visibility cycles.

# Recommended implementation plan

## 1. Extract a tested durable-mount lifecycle coordinator

Replace scattered interpretation of `suspendedDurableLaunch`, `frameEpoch`, visibility, async
resume results, and payload replacement with one small state/effect model:

- `inactive`
- `active { launchId, frameEpoch }`
- `suspended { launchId, frameEpoch }`
- `resuming { launchId, frameEpoch, resumeToken }`
- optionally `replacement-ready { oldLaunchId, newPayload, frameEpoch }` when a resume response
  arrives while hidden.

The coordinator owns only lifecycle and effects. It does not parse bridge requests, decide
authorization, or infer display-mode causality.

On authorized `hidden`:

- transition active to suspended;
- increment the frame epoch;
- clear frame-sizing identity;
- stop poll scheduling and clear local acknowledgement;
- leave the old frame visible only as inert presentation state; no bridge reply, poll result,
  size result, or child request may pass the suspended gate.

On `visible`:

- if a validated replacement payload is already pending, mount it;
- otherwise start exactly one app-only resume call for the suspended old launch;
- never reactivate the old launch or its polling state.

Any ordinary tool-result replay of the old payload while suspended must not clear suspension.
Only the expected resume result bearing the current local resume token may leave the suspended
state.

## 2. Add one exact app-only fresh-launch tool

Suggested name: `resume_durable_view`.

Its strict input is only:

```ts
{ launchId: z.string().min(1).max(128) }
```

It must not accept `viewId`, HTML, content hash, content type, capability, authorization, registry
version, or policy from the client.

Server algorithm:

1. Resolve the old launch by opaque ID from `PageLaunchRegistry`.
2. Require `bundle-read`.
3. Revalidate the old launch against current registry/entry state.
4. Require that its exact `pageLaunchAuthorizationSubject` is still session-authorized.
5. After every asynchronous check, confirm the old launch is still present; a concurrent
   `close_durable_view` or teardown must prevent minting a replacement after closure.
6. Derive only `old.registryId` from that server-owned record and call
   `mintActiveViewLaunch(bundle, durableLaunches, old.registryId)`.
7. Require the new launch to remain admitted as `bundle-read`.
8. Recompute authorization from the new exact subject. Never call `authorize()` in this path.
9. Return `durablePayload(newLaunch, authorized)`. If bytes/type/access/policy changed, the result
   is unauthorized and the shell must show the existing exact-byte approval dialog before
   executing it.
10. On any invalidity, revoke the invalid old launch and return a bounded explicit failure. Never
    fall back to a “most recent” launch or a client-supplied ID.

The old launch may remain server-side until the client adopts the new result. This makes repeated
hide/show while the resume request is in flight recoverable. It is safe only with these
conditions:

- the client permits one resume request per suspended old launch;
- old activity remains locally gated by epoch and suspended state;
- the new launch has its own empty subscription state until its newly mounted child subscribes;
- successful adoption closes the old launch before the new child may forward activity;
- a stale, replaced, navigated, or teardown-invalidated resume result immediately closes the new
  launch;
- candidate launches remain bounded by existing launch TTL/count limits.

An alternative is pre-revoking old before minting new. That is simpler and stronger one-shot
cleanup, but a second hide or transient resume failure becomes irrecoverable. Keeping old until
adoption is acceptable for this read-only experimental surface because old and new subscription
states are independent and opaque IDs remain launch-bound. Do not claim teardown destroys every
candidate synchronously unless the implementation actually closes an in-flight replacement after
hard unmount; otherwise record the bounded TTL-contained orphan window honestly.

## 3. Validate and adopt the replacement in the shell

A resume response is adoptable only if:

- it is a valid durable payload;
- its launch ID differs from the old launch ID;
- the resume token and frame epoch are still current;
- the current local payload is still the same old launch;
- no teardown, navigation, payload replacement, or cancellation has invalidated the operation;
- the document is visible at adoption.

If the response arrives hidden, keep it unmounted as `replacement-ready` and adopt on the next
visible event, or close it and retry later from the still-gated old launch. Keeping it pending
avoids needless server churn and is safe because no nested child or subscription exists yet.

If adoption succeeds, mount through the existing `renderDurablePayload`; close the old launch
before accepting child bridge traffic. The new frame receives a new frame epoch, size nonce,
object URL, and load-guard expectation. Its View re-runs initial queries and establishes a fresh
server subscription baseline.

On resume error, fail closed with an explicit reopen message and revoke the old launch. Do not use
timed retry loops.

## 4. Keep teardown, navigation, replacement, and authorization terminal

- `app.onteardown` invalidates the lifecycle token, closes current old/new/pending launches,
  clears the frame, and prevents any later resume result from rendering.
- Unexpected nested-frame `load` continues to retire the current authorized launch
  (`packages/mcp-app/src/view.ts:696-709`).
- A different tool payload supersedes the old lifecycle: advance epoch, close old and any pending
  replacement, and ensure an in-flight resume result is closed on arrival.
- Changed source or expanded authority never inherits approval. Existing CSP, sandbox,
  `event.source`, frame epoch, nonce, launch-currentness, and bridge pre/post checks remain
  unchanged.

## 5. Separate display-state bookkeeping from durable authority

Display request resolution and host context must never arm, resume, authorize, or retire a launch.

Track a `displayModeRevision` incremented only by host-context updates that explicitly include
`displayMode`. A request captures that revision:

- if no display-mode update occurred before the request resolves, its returned actual mode may be
  applied;
- if a display-mode update occurred, preserve the newer host-context state and do not overwrite it
  with the request result;
- a theme/font/container-only partial update does not suppress the request result;
- a late rejection must not overwrite a successfully updated View status when host context already
  reports the target mode.

The control remains hidden unless the current full host context advertises the target mode.

# Deterministic acceptance tests

## Red-first production regression

Before implementation, add a lifecycle test at `ca6d6aa` that reproduces the real host sequence:
authorized Roadmap launch, `inline`, user requests fullscreen, outer document becomes hidden then
visible, and the current code renders the reopen error. The same test must pass only after a fresh
launch is mounted and subscribed.

Source-text regex assertions are not sufficient. The lifecycle coordinator should be executable
as a pure unit, with one integration test over the real server tools and one browser/DOM shell
test for adoption and frame gating.

## Complete successful ordering matrix

Let:

- `D` = `requestDisplayMode()` resolves with the target;
- `C` = host context reports the target;
- `H` = document hidden;
- `V` = document visible.

Exercise all 12 legal interleavings where `H` precedes `V`, for **both** inline → fullscreen and
fullscreen → inline:

1. `H V D C`
2. `H V C D`
3. `H D V C`
4. `H D C V`
5. `H C V D`
6. `H C D V`
7. `D H V C`
8. `D H C V`
9. `D C H V`
10. `C H V D`
11. `C H D V`
12. `C D H V`

For every row:

- `H` immediately gates old bridge/poll/frame activity and advances epoch;
- `V` never reactivates the old launch;
- exactly one replacement is adopted for the old launch;
- the old launch is revoked on adoption;
- the new child establishes a fresh subscription baseline;
- the View remains rendered and interactive;
- final button label follows current host context;
- no event ordering affects authorization.

Also cover display transitions that do not change visibility (`D C`, `C D`) and host-driven
context changes without an App request.

## Decline, rejection, and stale display events

- Request resolves to the original mode, with and without a host-context notification.
- Request rejects without any host transition.
- Host context reports target before a late request rejection; stale rejection does not destroy
  or overwrite the live View.
- Request reports target before a later host context reports the original mode; host context wins.
- Host context reports original mode before a late request result reports target; the newer
  context revision is not overwritten.
- A theme-only partial context update does not suppress a valid request result.
- Available modes change during the request; the control is recomputed from the merged current
  context.

## Resume-result ordering and repeated visibility

- Resume response arrives while visible: adopt once.
- Resume response arrives while hidden: do not mount; adopt pending replacement on visible.
- `H → V → resume-start → H → resume-result → V`: no old activity leaks and exactly one new
  launch is ultimately mounted.
- Repeated `visible` events while one resume is in flight do not make additional calls.
- A stale resume result after payload replacement, teardown, unexpected frame navigation, or
  lifecycle-token change is closed and never rendered.
- A duplicate ordinary tool result carrying the old launch while suspended cannot clear the
  suspension gate.
- Two concurrent direct calls to the resume app-only tool cannot produce an unbounded set of
  usable candidates; count/TTL remains bounded and no candidate inherits different authority.

## Genuine suspension

An unsolicited `H → V` with no display request or display-mode host-context change follows the
same safe path:

- old epoch invalidated;
- old polling never resumes;
- fresh server-owned launch minted from old server-owned registry identity;
- exact unchanged authorization may be reused;
- fresh child queries and subscription baseline established;
- old launch revoked.

This proves genuine suspension cannot resume a stale baseline without pretending visibility
reveals its cause.

## Authorization and currentness attacks

- Unknown, expired, closed, malformed, or wrong-capability old launch fails with no fallback.
- Extra tool keys and client-supplied `viewId`, HTML, access, authorization, or hash are rejected
  before bundle work.
- Registry deletion, entry deletion, invalid content type, invalid UTF-8, oversized HTML, or
  access downgrade/expansion during suspension fails closed.
- Same registry + exact same admitted tuple returns authorized.
- Changed bytes/type/access/policy returns unauthorized and does not mount active bytes before the
  user approves.
- Registry/title changes follow existing authorization-tuple policy and still revalidate
  currentness.
- A close/teardown racing every async server check prevents a replacement from surviving.

## Old/new operation isolation

- Delayed old bridge reply after hide is dropped by old epoch.
- Delayed old poll change and delayed acknowledgement response are dropped and cannot schedule
  another old poll.
- Advancing or corrupting the old server subscription never affects the new launch's baseline.
- Old child `postMessage`, wrong source, wrong epoch, wrong launch, wrong nonce, malformed size,
  and unexpected child navigation retain their existing rejection behavior.
- Fixed 288px card internal scrolling, flexible grow/apply/shrink, hidden first mount, focused MCP
  suite, UI Chromium suite, repository check, exact-SHA independent review, and adversarial QA all
  remain green.

## Real host acceptance

Against the new exact PR head in real ChatGPT Work/Codex:

1. launch and authorize `pages-registry/roadmap`;
2. verify first-insertion interaction and internal scrolling;
3. click **Expand** without conversation recycling;
4. verify Roadmap remounts automatically, becomes interactive, and is internally scrollable;
5. click **Return inline**;
6. verify the same behavior inline;
7. verify no second authorization prompt when exact bytes/access/policy are unchanged;
8. if the View changes while hidden, verify new approval is required or the resume fails closed.

Call the result “fresh remount across display modes,” not same-frame continuity.

# Reject criteria

Reject the implementation if any of these is true:

- Success depends on a timer, grace period, event ordering, focus heuristic, or “next hidden”
  permit.
- A display request or host-context notification changes launch authorization or freshness state.
- The old launch or old subscription baseline resumes after any authorized hidden-to-visible
  cycle.
- The resume tool accepts or trusts client-supplied View identity, HTML, content version/type,
  access, authorization, or policy.
- The resume path calls `authorize()` or executes changed bytes before exact approval.
- An old ordinary tool result can clear suspension.
- A stale async resume result can render after teardown, navigation, replacement, a second epoch,
  or a different launch.
- Old and new poll acknowledgements or subscription baselines can cross.
- A newer host-context display mode can be overwritten by a stale request result.
- Existing `event.source`, epoch, nonce, CSP, sandbox, load-guard, server pre/post currentness, or
  bounded broker checks are weakened.
- Fullscreen is claimed to preserve nested UI state when the implementation remounts it.
- Teardown cleanup is claimed stronger than the implementation proves.
- Only synthetic tests pass; the exact new SHA is not re-dogfooded in real Codex through both
  Expand and Return inline.

# Recommended gate order

This changes reconnect/replay behavior on an active-content security boundary. Treat it as
high-risk mechanics:

1. red lifecycle regression and pure exhaustive ordering tests;
2. server resume-tool/currentness/authorization tests;
3. implementation;
4. independent exact-SHA review;
5. adversarial QA focused on async races, teardown, replacement, authorization drift, and
   old/new poll isolation;
6. repository check and CI;
7. real Codex Expand/Return-inline dogfood.

If the team does not want this lifecycle expansion in PR #177, revert the fullscreen declaration
and control for durable Views, retain the already-proven sizing fix, and track correlated
fullscreen/resume as a separate unit.

# Progress and environment

Review completed without product-code edits. The worktree remained at exact head `ca6d6aa`.

Environment note: requested AgentState Lite skill snapshot `1.0.119` was absent from the installed
plugin cache; the available current snapshot `1.0.131` was read and followed instead.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)

[failure evidence](pr-177-fullscreen-visibility-failure-ca6d6aa.md)
