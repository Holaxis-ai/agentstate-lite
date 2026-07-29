---
type: Context Note
title: 'PR #177 revised fresh-launch adversarial QA — PASS'
actor: codex-pr177-qa-13fcc2c
timestamp: '2026-07-29T19:18:42.106Z'
---
# Summary

Independent adversarial QA of exact revised commit
`13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2` after independent exact-SHA review
PASS.

**Verdict: PASS — no blocking findings.** The stale display-request rejection is suppressed only
when a newer host-context display update ends at the requested target. Rejections remain visible
when no newer display context exists, when newer context reports the original mode, and when a
target update is superseded by a later original-mode update. The full repository gate, prior
fresh-launch lifecycle set, current-byte authorization proof, delayed old-operation isolation, and
built CLI stdio contract all pass.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: prove stale display-request rejection is suppressed only after newer host context
establishes the requested target, while still-relevant failures remain visible and prior
fresh-launch replay, generation, authorization, stale-result, and teardown guarantees stay intact.
This serves the ultimate goal by keeping fullscreen status truthful without coupling presentation
events to durable authority.

# Exact-SHA and broad gate

The worktree began and ended clean at
`13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2`.

- `npm ci` — PASS; 439 packages installed from the lockfile. npm reported 7 audit findings
  (4 moderate, 3 high), not introduced or adjudicated by this QA unit.
- Unpiped root `npm run check` — PASS, exit 0. This includes root build, typecheck, all workspace
  tests, script tests, installed-tarball proof, skill drift check, MCP Chromium, and UI Chromium.
- MCP App unit suite within the root gate — **55/55 PASS**.
- MCP App Chromium suite within the root gate — **8/8 PASS**.
- UI Chromium gate within the root gate — **19/19 PASS**.

# Focused lifecycle and transport evidence

- `npx playwright test --config playwright.config.ts --grep 'fullscreen visibility
  transitions|replayed results|newer host display context|stale display rejection|explicit
  resource teardown'` — **5/5 PASS**.
  - Expand and Return inline both rotate to usable fresh launches.
  - `H→V→H→V` invalidates the first resume generation, closes its stale candidate, and adopts only
    the newest generation.
  - Original results replayed before and after retirement cannot reactivate the old launch.
  - A delayed successful display result cannot overwrite newer host context.
  - A delayed rejected display result cannot overwrite live status after newer target-confirming
    host context.
  - Explicit resource teardown remains unsettled until the durable launch close completes.
- `node --test --test-name-pattern='durable resume rotates' --import
  ./test/ts-loader.mjs ./test/server.test.ts` — **1/1 PASS**. Exact unchanged current bytes retain
  authorization on a fresh launch; changed bytes mint a distinct unauthorized replacement.
- `node --test --import ./test/ts-loader.mjs ./test/durable-activity.test.mjs` — **3/3 PASS**.
  Delayed old bridge and poll results cannot forward or restart after suspension.
- `node --test --import ./test/ts-loader.mjs ./test/mcp-stdio.test.ts` from `packages/cli` —
  **2/2 PASS**. The built CLI serves the fixed MCP App tool contract over SDK stdio, keeps all
  lifecycle tools app-only, and keeps JSON-RPC stdout byte-empty for startup failures.

# Rejection truth table

Source inspection of `changeDisplayMode()` confirms suppression requires both:

1. `displayModeContextRevision` advanced after the request began; and
2. the latest merged host context equals the requested target.

A temporary non-repository headless Chromium probe exercised four real `AppBridge` rows against
the exact built App:

| Row | Host-context sequence before rejection | Result |
|---|---|---|
| no newer context | none | rejection visible; status kind `error`; button `Expand` |
| newer original | `inline` | rejection visible; status kind `error`; button `Expand` |
| target then original | `fullscreen → inline` | rejection visible; status kind `error`; button `Expand` |
| newer target | `fullscreen` | stale rejection suppressed; live View status retained; button `Return inline` |

This proves the correction does not hide still-relevant failures and suppresses only the obsolete
request error after newer host truth establishes success. The temporary probe was removed, and the
repository worktree remained clean.

# Residual risks

- A request may reject before a later target-confirming host-context update arrives. The later
  update corrects the button but does not clear the already-rendered error copy. This ordering is
  outside the corrected stale-rejection row and does not affect display or durable authority.
- A resume response lost during hard host unmount can leave an unseen read-only candidate until the
  existing one-hour TTL, 256-launch cap, or stdio process exit. This remains documented bounded
  experimental debt.
- The client tombstone bound and server launch bound are duplicated values of 256 rather than one
  exported authority or agreement test; future drift could weaken the close-failure argument.
- Real ChatGPT Work/Codex Expand → Return inline dogfood remains the final external acceptance gate.

[review](pr-177-review-13fcc2c.md)

[prior QA finding](pr-177-qa-d6a849f.md)

[plan](../plans/pr-177-fullscreen-fresh-launch-resume.md)

[task](../tasks/mcp-durable-view-intrinsic-sizing.md)
