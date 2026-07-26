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
  PR OPEN, review round 3 (PR-side, REQUEST-CHANGES) addressed at d28aee4.
  Round-3 findings: P1 walkthrough taught bare CLI commands the supported plugin
  channel cannot run (no PATH bin; skill install npm-only) — all actions now
  agent-mediated, sync mechanics described without commands, global pin forbids
  bare aslite invocations in the walkthrough; P2 double-click on last Next
  dismissed via React's reused button node — Got it ignores detail>1
  activations, step changes focus the entering panel heading (also closes the
  keyboard variant + round-2 focus note), pinned in unit (detail-2 dispatch) and
  e2e (real dblclick). Gates at d28aee4: unit/typecheck/build/e2e:gate 18/18
  green. Full review history: context-notes/review-home-landing-rethink (rounds
  1-2) + this round on the PR. Merge remains Brian's.
timestamp: '2026-07-26T16:43:58.353Z'
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
