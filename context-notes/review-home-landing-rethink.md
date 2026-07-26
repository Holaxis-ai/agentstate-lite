---
type: Context Note
title: 'Review record: home landing rethink (2 rounds, exact SHAs)'
actor: claude-main
timestamp: '2026-07-26T15:41:06.862Z'
---
# Review record — feat/home-landing-rethink

Ordinary-change tier: Builder -> independent review per round -> repo gate. No dedicated QA
(no high-risk boundary; ui workspace only).

## Round 1 — 0ae63d6 (initial orientation rework)

- Isolated-worktree reviewer, detached at exact SHA, fresh npm ci. Verdict: APPROVE, confidence
  high. 4x P3; 3 taken in 4e713c6 (about-btn flash gate, reopen reset on config change,
  'conflict-safe writes' wording), focus-loss-on-reopen declined as preexisting-symmetric.
- Probes: 3 run, all red-capable. Survived attacks incl. remote-mode gating, localStorage-off,
  OKF/npx pins, styles hex gate.

## Round 2 — aaaedb8 (full branch diff vs main after merging main, incl. the 4-panel walkthrough)

- Same protocol. Verdict: APPROVE, confidence high. Gates at SHA: ci/build/typecheck/ui suite
  (175) all 0; builder's full-gate + e2e:gate 18/18 cited and spot-re-run.
- 5x P3: (1) dismiss-time step reset unpinned (probe: deletion SURVIVED the suite);
  (2) about-btn resolution gate unpinned (probe survived; jsdom flushes the flash frame, honest
  pin impractical); (3) walkthrough test name said 3-panel; (4) copy overclaim — 'skill and hooks
  should have been installed when you installed ASLite' is false on every current channel (plugin
  ships skills only; npm unpublished; only hook is SessionStart); (5) Next->Got-it shared button
  slot lets a double-click on panel 3 dismiss the tour.
- Probes: 5 run — 3 red, 2 survived (the two pin-gap findings). Merge integrity vs PR #159
  verified clean; sync/recipes/install copy verified TRUE against code except finding 4.
- Disposition (fix commit 8243dfd): took 1 (new second-reopen pin, re-probed red-capable),
  3 (test name), 4 (hooks sentence now states what ships: SessionStart context, explicit install)
  + reviewer cosmetic (learn-more disclosure resets on dismiss). NOT taken, recorded: 2 (pin
  impractical in jsdom — accepted gap) and 5 (keying the button slot would drop keyboard focus on
  every 3->4 transition; the misfire is recoverable via 'what is this?' — accepted trade).

[unit under review](../tasks/home-landing-rethink.md)
