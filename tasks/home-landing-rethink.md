---
type: Task
title: >-
  Home landing rethink: agent-first orientation (what aslite is, UI-as-window,
  view-prompt examples)
status: in_progress
priority: '2'
assignee: claude-main
actor: claude-main
description: >-
  BUILT + REVIEWED, awaiting Brian's PR. Branch feat/home-landing-rethink
  through f5d3507: orientation is now a 4-PANEL walkthrough — (1) What is
  agentstate-lite? + What problems does it solve?; (2) How do I use ASLite?; (3)
  Views (example prompts) + Recipes subsection (installable document-type
  definitions, built-ins, recipe add, agent-first ask); (4) Collaborating with
  others — how sync works today (--establish once, sync commits/pulls/pushes
  bundle-only, sessions/stale reads pull on their own, converging conflicts,
  in-tree alternative) + try-it. Nav: Back/Next lower-right (Next outermost),
  step count lower-left, Got it only on panel 4, dismissal persistence + panel-1
  reopen unchanged. Empty-views state shrunk to a one-line agent ask
  (walkthrough owns the explanation; learn-more mechanics kept). Gates green at
  f5d3507 (unit 174, typecheck, pages e2e 13/13). NOTE: branch predates PR
  #159's merge — needs a rebase/merge check against current main before PR
  (legacy-View removal touched adjacent ui files). Open flags: plugin-vs-npm
  truth of 'should have been installed'; no skip path on the 4-click
  walkthrough. Review round 1 record: context-notes/review-home-landing-rethink.
timestamp: '2026-07-26T14:52:55.798Z'
---
# Goal

Rethink the ui command's landing (home) surface content per Brian's direction (2026-07-24):
(1) a brief but informative overview of WHAT aslite is; (2) reinforce that it is primarily a
cognitive ecosystem for agents, used most effectively THROUGH agents — the UI exists mainly for
humans to gain insight into what agents are working on; (3) a few concrete examples of asking an
agent to construct custom views.

Proximate goal: the first screen a human meets frames the product agent-first and hands them
ready-to-paste prompts — serving the ultimate goal (a legible shared memory between one human and
their agent fleet) by making the human window teach the agent-first loop instead of implying a
hand-operated tool.

# Scope

- packages/ui Launcher orientation section: new copy (overview, agent-first framing, example view
  prompts); orientation becomes REOPENABLE after dismissal (an 'about' affordance) so the examples
  stay reachable; dismissal persistence and dir-mode-only gating unchanged.
- Preserve standing pins: no OKF jargon in first read (learn-more disclosure), privacy promise
  wording incl. in-tree mode, agent-connecting fallback (skill/hook install), no unscoped npm
  coordinate. Views empty state untouched (PR #151 copy holds).
- Update Launcher.test.tsx pins; e2e pins expected to keep passing.

[builds on unit 1](launcher-first-run-onboarding.md)

[the surface's standing design](../designs/home-surface.md)

[review record](../context-notes/review-home-landing-rethink.md)
