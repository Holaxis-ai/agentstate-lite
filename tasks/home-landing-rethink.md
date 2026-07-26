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
  BUILT + REVIEWED, awaiting Brian's PR. Branch feat/home-landing-rethink, now
  through 92b9f9f: orientation is a 3-PANEL WALKTHROUGH — (1) What is
  agentstate-lite? + What problems does it solve? (ratchet in plain words;
  problems sentence softened to honest scope per Brian: 'forget important
  information / occasionally step on / often keep invisible'); (2) How do I use
  agentstate-lite? (agents are the main users, built by/for agents italicized,
  skill+hook install commands); (3) Views examples + Collaborating with others
  (sharing promise) + try-it. Back/Next + step indicator; Got it only on the
  last panel, dismissal persistence unchanged; reopen restarts at panel 1. Unit
  suite walks all panels with global copy rules; e2e drives the full nav +
  reopen loop; pages e2e 13/13, ui suite + typecheck green. OPEN FLAGS
  unchanged: plugin-vs-npm truth of 'should have been installed'; no skip path
  on the walkthrough (3 clicks mandatory to dismiss) — flag for Brian's UX
  judgment. Prior review round record:
  context-notes/review-home-landing-rethink.
timestamp: '2026-07-26T14:29:32.408Z'
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
