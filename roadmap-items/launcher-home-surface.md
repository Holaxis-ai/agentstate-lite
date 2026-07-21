---
type: Roadmap Item
title: >-
  Launcher becomes the human home: flat honest cards, orientation, live activity
  (naming open)
status: active
description: >-
  Reshape the ui landing surface from a capability-grouped View launcher into
  the human visual home + first-run tutorial. Flat recency grid with capability
  badges (drop the Dashboards/Interactive/Documents grouping — 'Documents'
  collides with the doc noun), orientation block, live recent-activity strip
  over existing SSE. Open question: rename 'launcher'
  (home/workspace/overview/hub) before tutorial copy hardens the word. Boundary:
  ui-rethink stays separate/post-window.
actor: mike/claude
timestamp: '2026-07-21T17:52:33.530Z'
---
# Intent

Reshape the `ui` command's landing surface from a capability-grouped View launcher into the
human's visual HOME for the bundle — the counterpart of the CLI `home` view every agent
session opens with — and make it carry the lightweight first-run tutorial. This is the
near-term focus after the built-in-recipe deferral (decisions/defer-builtin-recipes): test
users meet THIS surface first.

# Shape (direction, not yet a build spec)

- **Flatten the card grid; demote bridge capability to a badge.** Grouping by the enforced
  `bridge` field (Dashboards / Interactive / Documents) projects the security model into the
  information architecture; users think in subjects, not API grants. A flat recency-sorted
  grid with a small trust badge per card (`live data` / `can edit` / `self-contained`)
  preserves the enforced-field honesty (same field, same derivation) without organizing by
  it. The "Documents" label in particular collides with the product's core noun (docs) and
  goes away regardless.
- **Orientation block**: what this bundle is, the human-agent loop, where things live —
  replacing the developer-facing empty-state paragraph.
- **Live recent-activity strip**: recent docs by timestamp over the EXISTING SSE stream.
  This is the tutorial's engine and the empty-state fix in one move: a fresh bundle shows
  "ask your agent to create a note — watch it appear here" instead of a dead paragraph
  about promoting HTML.
- **No invented categorization.** If grouping is ever needed, it is a bundle-authored field
  on the View convention justified by real test-user view populations — the same
  learn-from-users logic as the recipe deferral, never a hardcoded SPA taxonomy.

# Open question: is "launcher" even the right word?

The surface is becoming a home/overview, not a launcher-of-apps. Candidates to weigh with
test users: **home** (aligns with the CLI `home` verb — the agent gets home in the
terminal, the human gets it in the browser), **workspace**, **overview**, **hub**. The
command name (`aslite ui`) and the surface's internal name can diverge; rename is cheap
before test users, expensive after. Decide before the tutorial copy hardens the word.

# Boundary

roadmap-items/ui-rethink (what replaces the kanban primitive) stays SEPARATE and
post-window. This item is the existing surface made orienting and honest — not the
fundamental rethink. tasks/launcher-first-run-onboarding is the first contained unit; the
recent-activity strip is a deliberate scope line in that task, not silent growth.

[the pivot that made this the focus](../decisions/defer-builtin-recipes.md)

[boundary: the fundamental redesign stays separate](../roadmap-items/ui-rethink.md)

[contains](../tasks/launcher-first-run-onboarding.md)

# Workspaces at home (added 2026-07-21)

Home means "my stuff", not "this one bundle" — the agent's home (session-start) already
renders a workspaces block from the catalog, and the human home should mirror it. Tiered:

- **Tier 1 (in scope here): SEE them.** Read-only catalog block — registered workspaces,
  the open one marked, copy-paste open command for the others. No security change (same
  info the CLI home prints). Layering: the catalog is CLI policy, so the CLI INJECTS it
  through a consumer-owned ui-server option (the `resolveBundleDisplayName` precedent) —
  ui-server never imports CLI code.
- **Tier 2 (separate decision): SWITCH between them.** Preferred shape is
  remount-in-place (one loopback server swaps the mounted bundle; same session, one bundle
  at a time; watcher/SSE/launch registry reboot, open frames revoke). Multi-mount —
  several bundles under one origin/session — brushes the FROZEN multi-bundle
  partitioning/authz unit and is NOT to be built piecemeal from a home widget.
- **Privacy flag (deliberate choice required):** the catalog is user-global, so home would
  surface ALL workspace labels — including private ones — in a surface headed for
  test-user demos and screenshots. Mitigate by design (collapsed by default, or a
  catalog-side private flag home respects), not by accident.

# Alignment with agent-authored Views + the content model (added 2026-07-21, after prototype review)

Layer boundary (write it down so it never drifts): **the shell renders what is UNIVERSAL to
every OKF bundle** — markdown docs, frontmatter, links/backlinks, the attributed timeline,
kind-DECLARED chips (mechanism in the shell, meaning from the bundle) — and **anything
domain-interactive is a View**. The shell never grows a built-in task board; that is a View,
per the standing verdict that removed the old React board views. A possible future direction
(the "window" reimagining, discussed 2026-07-21): make docs READABLE in the shell — activity
rows and references click through to a rendered doc page. That is NEW SCOPE needing its own
decision; it is compatible with one-parser/one-runtime (same shell, same APIs PageFrame uses).

Three first-class content media, each with a distinct job (correcting an earlier framing that
bridge:none pages get absorbed by a doc reader — WRONG, per Mike):

1. **Markdown docs** — the knowledge substrate (diffable, queryable, linkable).
2. **Self-contained HTML artifacts** (`bridge: none`) — the VISUAL medium: diagrams,
   explainers, organized information. Agents' native artifact form; the sandbox +
   connect-src 'none' CSP makes them SAFE bundle content with provenance. First-class,
   not legacy. What changes with a readable shell is only that HTML stops being
   conscripted for plain prose.
3. **Live Views** (`bundle-read`/`bundle-propose`) — lenses/apps over live data.

Synthesis candidates for the window direction: HTML artifacts render as sandboxed FIGURES
inline in doc pages (same nonce/mint/CSP machinery, embedded instead of full-frame);
a bridge `open-doc` handoff (sibling of `open-page`) so Views hand reading to the shell and
stay thin; new-View registration surfaces as a timeline event ("your agent built you an
app"); generative view creation (tasks/ui-generative-chat) lives INSIDE the window, next to
the knowledge it lenses. The original launcher grouping's instinct — bridge:none things are
different IN KIND — was right; only the "Documents" label and top-level-grouping expression
were wrong. The distinction expresses as ROLE: artifacts = figures/gallery, views = lenses/tools.

# Progressive disclosure + sharing status (added 2026-07-21, prototype round 3)

Principle (Mike): show user-meaningful STATE up front; put implementation MECHANICS one
click behind. Paths, ports, branch names are mechanics — but never deleted (plain files you
own is the product's soul; the path is the proof of ownership) — they live in a
"where is this?" disclosure. The SHARING status is NOT mechanics, it is trust: whether the
knowledge leaves this computer and where it goes stays front and center as a human chip —
"private — this computer only" vs "shared · <org/repo>" plus sync freshness. This display is
part of tasks/bundle-visibility-safeguard's answer (the p1 explicit-sharing-choice task), and
the first-run orientation carries the promise in words ("everything stays private to this
computer until you choose to share it"). Workspace rows likewise show names only; path +
open command expand per row. Data note: the sync machinery already computes everything the
chip needs (channel detection, awareness cache, unpushed backstop) — CLI injects a summary,
same seam as the display name and catalog.

[sharing chip advances this safeguard](../tasks/bundle-visibility-safeguard.md)

# Styling architecture (added 2026-07-21, prototype round 3)

Two commitments, both mostly enforced by existing constraints:

1. **Tokens are the one theming contract.** styles.css is plain CSS (the CSP forbids
   inline styles/CSS-in-JS) and all components style through the :root token block
   (surfaces, text levels, the three semantic accents structure/process/signal, radius,
   font roles) — light and dark both at token level. Rule to codify: hex values live ONLY
   in the token block; components reference tokens. A rebrand is a one-block edit; a cheap
   grep gate can pin it.
2. **The shell is opinionated ONLY on the core product surface** — chrome, home (identity/
   sharing/activity/workspaces/views grid), the doc reader's typography, the confirmation
   dialog. The boundary is MACHINE-ENFORCED, not aspirational: Views and artifacts render
   in opaque-origin sandboxed iframes — no shared DOM, no CSS leak, in either direction.
   The doc reader's opinion is FORMAT-level (typography for markdown), never content-level
   — the GitHub-renders-your-README sense of opinionated.

Component vocabulary: ~8 primitives carry the whole surface (pill, chip, badge, card,
note, section-title, feed row, dialog); new surfaces compose from them.

Deliberate deferral: bundle-DECLARED theming (workspace accent/logo, like the display-name
doc). Cheap later (token injection at one seam) but new scope — an explicit future
decision, never backed into.

[distilled design](../designs/home-surface.md)

[second-act design](../designs/doc-reader.md)
