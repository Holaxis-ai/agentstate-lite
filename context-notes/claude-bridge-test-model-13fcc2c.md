---
type: Context Note
title: Claude bridge test model and acceptance matrix at 13fcc2c
actor: claude-bridge-test-research
timestamp: '2026-07-29T21:31:39.362Z'
---
# Summary

Exact `13fcc2c` has a first-initialization coverage hole: the SDK-backed Playwright lifecycle host mounts a synthetic “Roadmap” child with no bridge client, records no durable bridge calls, and therefore cannot fail when the real registered child’s one-shot `hello` is discarded. A temporary read-only probe using the committed outer App, real Roadmap HTML, and the same `AppBridge` host reproduced the complete field-visible symptom when the outer document started `hidden` before App initialization and emitted no `visibilitychange`: authorization succeeded; **Expand** changed to **Return inline**; the child stayed at `loading the graph…` / `reading the roadmap…`; and the host saw only `authorize_durable_view`, with zero `durable_view_bridge`.

This is a proven host-shaped red-test candidate, not yet a proven Claude cause. The planned throwaway Claude diagnostic must establish the actual ordered boundary trace before that ordering becomes the committed regression.

Ultimate goal: keep agentstate-lite dependable, conflict-safe, user-owned shared memory whose authorized conversational Views are immediately usable in supported hosts.

Proximate goal: pin the first missing Claude bridge boundary and require a parent-red/repair-green regression that restores initial Roadmap loading without weakening exact authorization, frame-source checks, epoch fencing, or explicit visibility quarantine.

## Exact implementation and coverage findings

- Investigated clean worktree `/private/tmp/aslite-pr177-followup` at `13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2`.
- The real Roadmap sends `hello` and `subscribe` immediately and once, then sends `query`, `query`, and `edges` only after subscribe resolves (`packages/cli/references/views/roadmap.html:81-125,195-220`). A dropped initial request leaves its static loading placeholders forever.
- The outer raw message handler first recognizes sizing frames, then silently returns when `document.visibilityState === "hidden"`, source is not the current nested frame, schema is not durable, or authorization is false (`packages/mcp-app/src/view.ts:833-865`). It exposes no rejection reason.
- `forwardDurableBridgeMessage` calls `app.callServerTool(durable_view_bridge)` and only rechecks durable currentness after resolution/rejection (`view.ts:529-560`). Existing server logs therefore distinguish server receipt, but not child emission, outer gate rejection, or App transport entry.
- Durable currentness independently requires current epoch, visible snapshot, and no suspension marker (`view.ts:443-460`; `durable-activity.ts`). An initial hidden document can therefore both discard the request before forwarding and reject any eventual result.
- The lifecycle host’s child is only a button and tall `<main>` (`test/fixtures/display-mode-host.ts:30-39`). It has no `postMessage`, `hello`, loading state, or bridge reply client. The host returns a static reply ID and records resume/close/display but not bridge requests (`display-mode-host.ts:111-166`).
- Browser visibility is installed only after lifecycle initialization and always dispatches `visibilitychange` (`test/frame-sizing.browser.spec.ts:71-90`). No test covers a document already hidden before App initialization or an authorized child’s first bridge request.
- Server tests thoroughly cover exact-byte authorization, hello/query/read/subscribe/poll, fresh resume, currentness, and app-only visibility, but they call MCP tools directly. They do not traverse child → outer → SDK host → server.

## Temporary host-shaped probe

The probe was created only under `/private/tmp`, did not edit repository source, and used:

- committed App HTML from `packages/mcp-app/src/generated/view-html.generated.ts`;
- real `packages/cli/references/views/roadmap.html`;
- the existing bundled `AppBridge` fixture with only dynamic reply IDs and per-tool counters added;
- one controlled difference between cases: outer `document.visibilityState` installed as `visible` versus `hidden` before the App script, with no synthetic visibility event;
- the real authorization click and real Expand request/context response.

Observed:

| boundary | visible control | initially hidden, no event |
| --- | --- | --- |
| authorized shell status | exact registered View | exact registered View |
| display transition | Expand → Return inline | Expand → Return inline |
| child after transition | `0 roadmap items…`; `no roadmap items yet` | `loading the graph…`; `reading the roadmap…` |
| host app-tool sequence | authorize, hello, subscribe, query, query, edges | authorize only |
| durable bridge calls | 5 | 0 |

This proves exact current code deterministically maps the candidate ordering to the exact field UI while a visible control maps the same Roadmap/AppBridge path to a working bridge. It does **not** prove Claude supplied that visibility ordering.

## Diagnostic instrumentation required

The throwaway Claude build should emit an ordered, monotonic trace, not four final booleans. Each row should carry a sequence number and only non-sensitive facts:

| boundary | required marker | distinguishes |
| --- | --- | --- |
| child execution | injected `child-boot` marker before the bridge client plus original request type/ID marker | child script never executed vs executed |
| raw outer receipt | request type/ID, `event.source === frame.contentWindow`, current `visibilityState` | child postMessage not delivered vs delivered |
| outer classification | one exclusive result: sizing-consumed, no-payload, hidden, source-mismatch, wrong-schema, unauthorized, epoch/suspension rejection, accepted | local gate rejection and exact reason |
| forwarding entry | launch/epoch correlation and request type/ID immediately before `forwardDurableBridgeMessage` | accepted locally vs never entered |
| SDK request | marker immediately before `app.callServerTool`, then resolved/rejected/timeout with safe error class | SDK invocation vs local hang/rejection |
| host/server receipt | existing MCP stderr log keyed to the diagnostic request ID | host forwarding vs server receipt |
| child reply | outer post-to-child marker and child receipt marker | server reply released vs lost on return path |

The trace must record build provenance: clean baseline SHA `13fcc2c`, diagnostic patch SHA/diff hash, generated App HTML SHA-256, View ID and contentVersion, unique server name, host name/version/context, and timestamps/log path. Do not log bundle rows, bodies, launch secrets, or full HTML.

Interpretation is then mechanical:

- `child-boot` absent: child/CSP/mount problem.
- boot present, original hello absent at outer: child client or browser delivery problem.
- raw hello present, classification rejected: outer lifecycle gate owns the defect.
- accepted and SDK-start absent: outer control-flow defect.
- SDK-start present, no settle and no server receipt: host forwarding/hang.
- SDK rejected: host/SDK error is the finding.
- server receipt present: investigate server reply and return-path markers, not initialization.

## Plan review and required refinements

The staged plan in `plans/claude-desktop-durable-bridge-initialization` has the right gates: diagnostic first, probe-derived red regression, owning-primitive repair, exact-SHA review before QA, and real-host acceptance last. It should be refined as follows:

1. Step 1 must preserve the **ordered trace and provenance tuple** above as a Context Note or artifact. “Four boundary facts” as unordered booleans cannot prove which event preceded visibility, authorization, mount, or forwarding.
2. The probe needs separate `forward-entry`, `callServerTool-start`, `callServerTool-settle`, and server-receipt boundaries. Combining them cannot distinguish an outer rejection from host forwarding failure.
3. Step 3 may commit the initially-hidden regression only if Claude shows that actual ordering. Otherwise the regression must reproduce the probe-established ordering literally—even if it is child non-execution, source mismatch, or SDK forwarding.
4. Parent-red provenance must be executable: run the new test unchanged against exact `13fcc2c` (or cherry-pick only the test onto a detached parent worktree), capture the named failure, then run the same test green on the repair. A newly written test that was never executed on the parent is insufficient.
5. The browser regression must use the real Roadmap bridge client or a minimal contract-faithful child that sends one-shot `hello` and validates correlated reply IDs. It must record host receipt of app-only calls. The current button-only fixture and static `"test"` reply cannot serve.
6. If the probe confirms “initially hidden before listener, no visibility event,” the red test ordering must be:
   - document reports hidden before outer App initialization;
   - host initializes and advertises fullscreen;
   - unauthorized payload arrives and authorization succeeds;
   - authorized registered child mounts and posts one-shot hello;
   - outer receives it from the exact current frame while no explicit suspension generation exists;
   - Expand/context change may succeed without a visibility event;
   - current parent leaves the child loading and host bridge count at zero.
   The green test must load the child, while a separate explicit hidden event after activation still quarantines immediately.
7. Review must reject a “fix” that merely retries on a timer, forwards forged/wrong-source messages, ignores explicit hidden-event suspension, reuses a quarantined launch, or makes app-only tools model-visible.

## Acceptance matrix

| case | observable requirement | invariant |
| --- | --- | --- |
| visible first mount | hello reaches host/server; subscribe then query/query/edges; Roadmap leaves both placeholders | exact current authorized launch only |
| probe-established initial ordering | same real child loads without interaction; Expand remains usable | no host-name branch or timer |
| explicit hidden event after active | old child and delayed bridge/poll replies cannot forward | epoch advances; launch quarantined |
| visible after quarantine | exactly one guarded resume generation is adopted; fresh child establishes a fresh baseline | old launch closes; no baseline reuse |
| rapid H/V/H/V and delayed resume | only current generation adopts; every learned stale candidate closes | no resurrection or leak beyond documented TTL backstop |
| fullscreen/inline with no visibility event | repeated display changes do not rotate or stall the active launch | display state is not lifecycle authority |
| display plus H/V in all supported orderings | UI mode is correct and fresh resume is race-safe | host context cannot revive stale traffic |
| wrong source / unauthorized / stale epoch | zero app-only bridge calls | source, authorization, launch, and epoch gates remain strict |
| App transport instrumentation | start → host/server receipt → resolution are correlated | failure boundary is diagnosable |
| server contract | authorize/bridge/poll/resume/close remain `visibility:["app"]`; model sees only `show_view` | no tool-surface expansion |
| teardown/navigation/replacement | terminal path dominates; known current launch close is awaited | no post-teardown forwarding |
| exact-SHA real Claude | first Roadmap loads; Expand/Return; background/restore returns on fresh launch | field acceptance |
| ChatGPT regression | prior fixed/flexible sizing, intrinsic grow/shrink, display ordering, and lifecycle suite stay green | no PR-177 regression |

## Recommendation

Proceed with the throwaway Claude trace before choosing production behavior. The initially-hidden/no-event shape is now the smallest credible regression and exactly reproduces the observed panel, but committing it as “the bug” before Claude proves that state would lose probe-to-regression provenance.

[informs](../tasks/claude-desktop-durable-bridge-initialization.md)

[reviews](../plans/claude-desktop-durable-bridge-initialization.md)

[tests](claude-pr177-initial-bridge-stall-13fcc2c.md)
