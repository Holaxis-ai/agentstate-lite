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
  BUILT + REVIEWED, awaiting Brian's PR. Branch feat/home-landing-rethink pushed
  (0ae63d6 rethink + 4e713c6 review fixes + cb3da83 why-it-matters pillar +
  195d9c1 ratchet-in-plain-words). Orientation now leads agent-first: what
  ASLite is (cognitive ecosystem, plain-markdown shared memory); WHY it matters
  — the three problems (forget/collide/opaque, docs/core framing) and the
  long-horizon consequence stated as the ratchet in household language
  ('progress ratchets forward instead of slipping back... the floor the next one
  builds on', per the Derfer & Collier 2026 paper, no theory vocabulary on the
  surface); used THROUGH agents with the window as the human insight surface;
  three example view prompts; 'what is this?' reopen affordance. Gates green
  each commit; cb3da83/195d9c1 copy+pin only (trivial tier, author-validated).
  Review round 1: APPROVE 4x P3, 3 taken
  (context-notes/review-home-landing-rethink). Merge + copy taste are Brian's.
timestamp: '2026-07-25T15:32:31.366Z'
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
