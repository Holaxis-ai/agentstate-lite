---
type: Context Note
title: 'PR #177 fresh-launch exact-SHA review — changes requested'
actor: codex-pr177-review-c5e8a74
timestamp: '2026-07-29T18:42:16.106Z'
---
# Summary

Independent read-only code/security/lifecycle review of exact commit
`c5e8a743b40198c0eb7f09feb19bb727647a0baf` over
`ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a`.

**Verdict: FAIL — changes requested.** One empirically confirmed high-severity replay defect can
reactivate the old durable launch and its uncertain subscription baseline after visibility
quarantine. Two medium lifecycle/presentation ordering defects also remain. Do not advance this
SHA to QA.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: determine whether the fresh-launch visibility recovery at `c5e8a74` is race-safe,
exact-authorization preserving, resource-bounded, and lifecycle-compliant. This serves the
ultimate goal by preventing a fullscreen usability repair from weakening durable View freshness
or trust boundaries.

# Findings

## High — an ordinary replay of the old tool result cancels quarantine and resumes the old baseline

**Location:** `packages/mcp-app/src/view.ts:292-307,356-360`.

`renderResult()` unconditionally renders every recovered payload. While launch `L` is suspended or
has `resume_durable_view(L)` in flight, a host replay of the original authorized `show_view`
payload for `L` therefore enters `renderDurablePayload(L)`. Because it is the same launch,
`renderDurablePayload()` clears `suspendedDurableLaunch` and `resumingDurableLaunch`, remounts `L`,
and does not close it. The subsequent fresh candidate is classified stale and closed.

This is the exact rejected state: an ordinary tool-result replay can reactivate the old launch and
its old server subscription state after a hidden interval. If an acknowledgement advanced the
server baseline before the shell dropped its response at suspension, continuing `L` can skip the
change that fresh-launch rotation was introduced to protect.

**Empirical probe:** against the bundled exact-SHA App and real `AppBridge`, hold the resume
response after `H→V`, deliver the original authorized tool result, then release the response. The
observed host state was:

```json
{
  "resumes": ["launch-inline"],
  "closes": ["launch-resumed-1"],
  "status": "Roadmap · exact registered View · live bundle-read bridge"
}
```

The old launch became live; the fresh launch was discarded. The committed browser test never
replays an ordinary tool result, so it remains green.

**Required correction:** while an authorized durable launch is quarantined/resuming, ignore an
ordinary payload carrying that same launch ID. Only the guarded response to the current app-only
resume operation may leave quarantine. Add this replay as a browser regression.

## Medium — a second hidden interval does not invalidate an in-flight resume generation

**Location:** `packages/mcp-app/src/view.ts:699-751,828-847`;
`packages/mcp-app/test/frame-sizing.browser.spec.ts:386-410`.

The suspension marker deliberately remains set while a resume request is in flight. The hidden
handler nevertheless treats any later hidden event for that same launch as a duplicate and returns
before incrementing `frameEpoch` (`view.ts:835`). Thus:

`H → V → resume-start → H → V → resume-result`

retains the first operation's epoch and adopts its candidate after the second visible event. A
second real hidden interval has not invalidated the resume token as the reviewed state machine
requires.

**Empirical probe:** holding the first resume across `H→V→H→V` produced one resume request, closed
the old launch, and mounted the first candidate:

```json
{
  "resumes": ["launch-inline"],
  "closes": ["launch-inline"],
  "status": "Roadmap · exact registered View · live bundle-read bridge"
}
```

The committed rapid-visibility test releases the response while the document is still hidden, so
the visibility predicate—not a new epoch—rejects it. It does not exercise resolution after the
second visible event.

**Required correction:** every distinct hidden transition must advance the lifecycle epoch even
when the same launch is already quarantined. The old request should close its candidate, and the
visible state should start exactly one request for the new generation. Add the sequence above as a
regression.

## Medium — a stale display-request result can overwrite newer host context

**Location:** `packages/mcp-app/src/view.ts:675-687`;
`packages/mcp-app/test/frame-sizing.browser.spec.ts:349-378`.

`changeDisplayMode()` writes `requestDisplayMode()`'s eventual result directly into
`currentHostContext` without checking whether a later
`ui/notifications/host-context-changed` display-mode update arrived while the request was pending.
The SDK provides no ordering guarantee. A request for fullscreen followed by newer host context
reporting inline can therefore be overwritten by the stale fullscreen response, leaving the
button label and local presentation state contrary to the host.

The browser fixture always emits the target host context immediately before returning the same
request result. It does not exercise opposite/newer host context, the full permitted ordering
matrix, decline, or rejection.

**Required correction:** track a display-mode revision incremented only when host context
explicitly carries `displayMode`; apply a request result only if that revision has not advanced.
Add the reviewed request/context ordering and stale-result rows. Display bookkeeping must remain
independent of launch authority.

# Survived attacks and positive evidence

- `resume_durable_view` is app-only, strict-input, and accepts only an opaque old launch ID.
- Registry identity is derived from server-owned launch state; no client-supplied View identity,
  bytes, access, hash, or authorization influences minting.
- The new launch is independently minted from current bundle state. Exact unchanged authorization
  is reused; changed bytes return unauthorized.
- Known unadopted candidates are closed, and explicit teardown awaits the known close request.
- Server contract/current-byte tests passed: 2/2 sampled.
- Chromium fullscreen/return and teardown tests passed: 2/2 sampled.
- MCP App typecheck and exact diff whitespace check passed.

# Residual risks after the findings are fixed

- A resume response lost during hard host unmount can leave an unseen read-only candidate until
  the existing one-hour TTL, 256-launch cap, or stdio process exit. This is documented bounded
  experimental debt, not a claim of synchronous cleanup.
- Server-side close/auth-store transport failures can likewise leave bounded launch state; no
  reviewed path grants broader authorization.
- The existing happy-path tests do not independently prove old poll acknowledgement/bridge reply
  isolation. The epoch/launch guards look structurally sound, but adversarial QA should exercise
  those races after a new exact-SHA review passes.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)

[plan](../plans/pr-177-fullscreen-fresh-launch-resume.md)
