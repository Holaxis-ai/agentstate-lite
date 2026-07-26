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
  READY FOR BRIAN'S PR at 8243dfd. Branch feat/home-landing-rethink: agent-first
  4-panel walkthrough (What is agentstate-lite?+problems/ratchet; How do I use
  ASLite?; Views+Recipes incl. flexibility->reusable/sharable + agents suggest;
  Collaborating with others = how sync works, agent-first sharing path; 'That's
  the tour' separated CTA), Back/Next lower-right + step count lower-left, Got
  it only on panel 4, reopen via 'what is this?' restarts at panel 1 with
  collapsed disclosures, DIR pill dropped (remote-only badge), empty-views state
  one sentence. MERGED current main (aaaedb8, clean — post-#159 integrity
  reviewer-verified). Gates at tip: npm ci/build/typecheck/full npm
  test/e2e:gate 18/18 all green. TWO review rounds, both APPROVE at exact SHAs,
  all taken/declined findings recorded in
  context-notes/review-home-landing-rethink (round 2 killed the last copy
  overclaim: hooks sentence now truth-gated). Remaining: Brian opens the PR
  (description delivered in-session); accepted residuals: about-btn flash pin
  impractical in jsdom, Next->Got-it shared slot double-click (recoverable), no
  skip path on the walkthrough (design choice).
timestamp: '2026-07-26T15:41:31.888Z'
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
