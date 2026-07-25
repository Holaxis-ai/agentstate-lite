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
  (0ae63d6 rethink, 4e713c6 review fixes, cb3da83 why-it-matters, 195d9c1
  ratchet wording, d423c42 sectioned restructure with Brian's copy). Orientation
  is now four titled sections: What is agentstate-lite? / What problems does it
  solve? (ratchet in plain words) / How do I use it? (agents are the main users;
  skill+hook install commands inline) / Views (example prompts). Privacy promise
  retained (chip/promise consistency rule + e2e pin); redundant closing install
  paragraph dropped. OPEN COPY FLAGS for Brian: (1) 'should have been installed
  when you installed ASLite' is true for the plugin channel, not npm (no
  lifecycle scripts by design); (2) the window-as-insight-surface sentence was
  removed with the replaced range. Gates green each commit (unit+typecheck+pages
  e2e; d423c42 copy/style tier). Review round 1 record:
  context-notes/review-home-landing-rethink. Merge is Brian's.
timestamp: '2026-07-25T20:07:34.477Z'
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
