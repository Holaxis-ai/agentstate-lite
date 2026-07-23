---
type: Design
title: View headless verification — design
actor: claude-main-viewauthoring
timestamp: '2026-07-23T17:54:41.279Z'
---
# View headless verification — design

Serves `tasks/ui-view-headless-verify`. Goal: an agent that generates a bundle View can
confirm it works, with no browser, so the "guide users to generate views" strategy does not
ship unverified pages to humans.

## What the architecture already gives us (verified in code)

- `handleBridgeRequest(request, deps, capability)` (`packages/ui/src/pages/bridge.ts:193`) is a
  PURE router, its own comment: "Injected so the router is testable without the DOM/network."
- `BridgeDeps` is a clean injectable interface. The SPA backs it with HTTP fetches
  (`PageFrame.tsx:35`); it can be backed DIRECTLY by core functions —
  `queryHeads`/`readDoc`/`loadKinds`/`queryEdges` — over a local `--dir` bundle.

So the DATA half of "does this view work" needs no DOM at all: feed a view's bridge requests to
the SAME router the real shell uses, backed by real bundle data, and check they resolve.

## The hard constraint

The npm CLI ships ZERO runtime dependencies, MACHINE-ENFORCED
(`scripts/verify-npm-package.test.mjs`: "dependencies must be empty"). Executing a view's
JavaScript in a DOM needs jsdom — 4.1 MB of transitive deps. **jsdom cannot go in the shipped
CLI.** This, not the wiring, is the design's real fork.

## Three tiers of verification, at very different cost

- **Tier 1 — static + sandbox-safety (no DOM, zero-dep, ships in the CLI).** The blob exists, is
  non-empty, registered, declares a valid `bridge` capability; and a scan for the #1 authoring
  failure: external network references (CDN `<script>`/`<link>`, remote fonts, `fetch`/XHR to a
  non-bridge origin) that SILENTLY die under the opaque-origin no-network sandbox. Catches the
  most common real mistake, cheaply.
- **Tier 2 — bridge-contract replay (no DOM, zero-dep, ships).** Limited: a view's actual
  requests live inside its JS, so replaying THEM needs execution. What Tier 2 can do without a
  DOM is assert the bundle can answer the request SHAPES a view of this kind would make (e.g.
  `query {type:Task, open:true}` resolves) — overlaps `list --open`, modest extra value.
- **Tier 3 — headless render (NEEDS a DOM).** The full check: load the HTML in jsdom, run its JS
  against real core-backed `BridgeDeps`, capture console errors, unhandled rejections, whether
  the bridge handshake (`hello`) completed, and whether the view produced DOM nodes. This is the
  only tier that answers "does it actually run and draw."

## Honesty about Tier 3's ceiling

jsdom is not a browser: no real CSP, no true iframe-sandbox enforcement, JS-engine differences.
A green Tier 3 means "runs, talks to the bridge, draws nodes against real data" — NOT "looks
right" and NOT "behaves under the production sandbox + CSP." It is a smoke test. The task's
"done when" already scoped it exactly this way; the design must not let a green be over-trusted.

## The decision (Brian's): where does Tier 3 live?

Tier 1 ships in the CLI regardless — zero-dep, always available, immediate signal to a
generating agent. The fork is Tier 3's packaging:

- **A. Optional sibling verifier** (`npx @holaxis/aslite-viewcheck <dir> <id>`, depends on jsdom).
  Core CLI stays zero-dep; the heavy check is opt-in. An agent generating a view is in a dev
  environment where `npx`-ing a tool is normal, so the agent case is served without bloating the
  end-user CLI. RECOMMENDED.
- **B. Escalation inside `aslite view check`** — Tier 1 always; if a DOM verifier is resolvable
  (installed peer, or `npx` on demand), escalate to Tier 3. One command, but runtime `npx` is
  fragile and network-dependent.
- **C. Bundle jsdom into the CLI.** Breaks the machine-enforced zero-dep boundary and adds
  4.1 MB. Rejected unless Brian wants to revisit that boundary.

## Recommended slice

Ship **Tier 1 as `aslite view check <id>`** first (own PR: zero-dep, high-value, closes the
biggest cheap slice — external-resource mistakes). Build **Tier 3 as option A** as a second unit
once the sibling-package shape is agreed. Reuse `handleBridgeRequest` and `BridgeDeps` verbatim
in both, so the verifier can never drift from what the real shell does.
