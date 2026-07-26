---
type: Task
title: >-
  Home landing rethink: agent-first orientation (what aslite is, UI-as-window,
  view-prompt examples)
status: done
priority: '2'
assignee: claude-main
actor: claude-main
description: >-
  DONE 2026-07-26 — merged to main as PR #163 (merge b2a6286; bot plugin 1.0.120
  followed). Shipped: agent-first 4-panel orientation walkthrough (What is
  agentstate-lite?+problems/ratchet; How do I use ASLite?; Views+Recipes;
  Collaborating with others=sync + 'That's the tour' CTA), Back/Next lower-right
  + step count, Got it only on last panel with double-activation guard +
  panel-heading focus transfer, 'what is this?' reopen at panel 1, remote-only
  mode pill, one-line empty-views state, ALL actions agent-mediated (global pin
  forbids bare aslite commands in the walkthrough). THREE review rounds at exact
  SHAs: subagent rounds 1 (APPROVE 4xP3) + 2 (APPROVE 5xP3) recorded in
  context-notes/review-home-landing-rethink; PR-side round 3 (REQUEST-CHANGES:
  P1 channel-truth of bare commands, P2 double-click dismissal — both
  probe-verified) fixed in d28aee4. Gates green at every round incl. e2e:gate
  18/18. Post-merge: main rebuilt, local tarball installed globally (aslite on
  PATH at /opt/homebrew/bin). Honest caveat: the walkthrough has no skip path (3
  Nexts to dismiss) — recorded design choice, revisit on test-user feedback.
timestamp: '2026-07-26T17:23:33.722Z'
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
