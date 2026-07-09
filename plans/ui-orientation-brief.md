---
type: Plan
title: >-
  UI orientation brief for Brian: witness-first, generic-by-construction,
  activity feed as centerpiece
timestamp: '2026-07-07T18:11:43.045Z'
---
# UI orientation brief — for Brian, from the 2026-07-07 call + this week's evidence

Everything here is packaging, not new design: the standing task
[tasks/ui-generic-kinds](../tasks/ui-generic-kinds.md) had already decided the core shape
before your new-user experience confirmed the need. This brief consolidates what exists,
what's decided, and where the seams are — so the UI work starts from records, not memory.

## The reframe your feedback ratified

**The UI's first job is witnessing, not collaborating.** The v1 kanban failed as an
interaction surface for a workflow nobody had; your question — "what did this thing do for
me?" — has a lower bar and immediate value. The buyer is the OWNER of the agents wanting
legibility, not a hypothetical human collaborator.

## The iron rule (your "false information" finding)

**Never render a kind the bundle doesn't declare.** The zeros-kanban happened because the
view was hardcoded to Task while the bundle held context notes. The fix is generic by
construction: the view layer asks the bundle what it contains and renders that.

## The contract the UI reads (all shipped)

- `loadKinds` / `kinds` — every declared kind: fields, enums, path prefix, freshness
  horizon, and (as of PR #4) the **typed-link vocabulary** (`links: {contains: Task, …}`).
- `list --type <k>` — rows with kind-declared columns (status etc.), head-projected, cheap.
- `link show <id> [--text <type>]` — typed edges both directions, per-literal-link.
- `doc history <id>` — attributed version chains (actor + agent + timestamp).

Derivation rules that fall out (no display hints needed): kind with a single-select enum →
board with enum columns · freshness horizon → staleness badges · declared link types →
relationship navigation ("contains 3 tasks", "cited by 2 claims") · conventions-free bundle
→ degrade to list/detail/graph. The `boardShape` module in the v1 SPA is the designed swap
seam — all Task/enum literals were deliberately isolated behind it for exactly this
replacement (see tasks/ui-generic-kinds).

## Display hints: pre-decided, deliberately deferred

tasks/ui-generic-kinds already answers the call's open question: "do not invent convention
schema here — the long-run home for explicit view hints is the recipe profile spec, decided
later." Derive views from schema shape first; add hints only when derivation demonstrably
fails on a real recipe. (Same consumer-pull discipline that has been right all week.)

## The recommended centerpiece: an attributed activity feed

"What did the agents do?" is chronological, not board-shaped: docs written/updated, by which
actor/agent, when. Everything needed is already stored (frontmatter actor + timestamp,
version history). This is ALSO the agent-side awareness primitive ("what changed since my
last session" — see plans/sync-verb): one derivation, two faces. If the orientation page
lands on exactly one view, make it this one.

## Orientation page: one-screen budget

Dismissible welcome teaching the mental model (typed documents · relationships as links ·
recipes install capability), pointing at the live views. If it needs more than a screen,
that is the UI telling us it is not yet self-evident — trim the UI, not lengthen the prose.

## Live updates without touching the wire

The ui server sits on the local bundle: watch the filesystem for local agents' writes
(instant) + pull git for teammates' (sub-minute, fail-soft offline), stream both to the
browser. Zero wire-protocol changes; the enforced-CAS tiers stay untouched.

## Corrections to call memory

Shipped built-ins are `context-notes` + `work-tracking` (statuses only — no claim/lease
mechanism, deliberately; see the leases-added-friction prior from canonical). `claims` is
the worked EXAMPLE folder recipe (`examples/recipes/claims`); there is no roadmap built-in.

## Banked plumbing (do not rebuild)

Loopback server + per-run token + Host allowlist + CSP, `--dir` in-process mount and
`--remote` reverse proxy, gzip-embedded SPA pipeline, typed client, head-projected query
layer — all production-grade per the ui-v1 record. The views are the only disposable part.

## REVISION (2026-07-07, later): generative pages supersede the generic renderer

Mike's call, and the economics are right: generation cost collapsing inverts the case for
a declarative view system — a bespoke page costs seconds, so reuse stops being the goal,
and a generic view executor (board shapes, group-by, filters…) is the kanban trap again.
The revised architecture fixes exactly FOUR things and generates everything else:

1. **Sandbox**: generated pages run in an iframe — no token, no network (CSP),
   presentation-only. Non-negotiable (exfiltration + prompt-injection blast-radius cap).
2. **Data bridge**: a postMessage API proxying the EXISTING read surface (list / kinds /
   link show / doc read / history). The one interface that must be versioned and
   disciplined — every generated page codes against it. Read-only.
3. **Page registry**: a convention — pages are HTML blobs under `views/`, promoted through
   the byte channel, listed in the shell menu. Pages are versioned/attributed bundle
   citizens; RECIPES CAN SHIP PAGES.
4. **One built-in default page**: the attributed activity feed + kind browser (the witness
   view), so fresh bundles aren't blank and agent-less humans still see something.

Maintenance dissolves into regeneration (a broken/stale page is one request from fresh);
liveness via template-plus-rebake off the change cursor (plans/sync-verb). The skill gains
one behavior when it reopens for edits: on "show me X", generate a page against the bridge
and offer to promote it. tasks/ui-generic-kinds is SUPERSEDED in spirit — the generic
renderer is at most the default page, not the destination. The derivation rules earlier in
this brief survive as guidance for what generated pages should do by default, not as a
renderer spec.
