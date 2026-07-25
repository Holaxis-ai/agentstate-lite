---
type: Context Note
title: 'Review record: home landing rethink (1 round, exact SHA)'
actor: claude-main
timestamp: '2026-07-25T00:18:34.027Z'
---
# Review record — feat/home-landing-rethink

Ordinary-change tier: Builder -> one independent review -> repo gate. No dedicated QA (no
high-risk boundary touched; ui workspace only).

## Round 1

- Reviewer: general-purpose subagent in an isolated worktree, detached at 0ae63d6, fresh npm ci,
  repo-root build. Verdict: APPROVE, confidence high.
- Findings: 4x P3 (no P1/P2). (1) one-frame about-btn flash before the localStorage dismissal
  state resolves on first run; (2) focus loss on reopen — about-btn unmounts under focus;
  (3) orientationReopened not reset by the config-change effect (symmetry nit, unreachable in a
  single-bundle session); (4) copy nuance: 'versioned writes' overglosses dir mode where the
  filesystem backend keeps no history.
- Probes run (all red-capable, then reverted, worktree clean): cognitive-ecosystem pin, remote-mode
  about-btn gating pin, dismiss-resets-reopen pin.
- Survived attacks: simultaneous card+button (impossible by construction), remote-mode gating,
  localStorage-unavailable path, OKF-jargon pin, npx-unscoped-coordinate guard, privacy-promise
  wording, styles token/hex gate, e2e 'hide details' locator uniqueness.
- Gates at reviewed SHA: npm ci 0, build 0, typecheck 0, ui tests 0 (174), changed e2e test 0.

## Disposition (fix commit 4e713c6)

- Taken: findings 1, 3, 4 (flash gate on orientationDismissed===true; reopen reset in the config
  effect; 'conflict-safe writes' wording) plus the reviewer's notes-level nit — views lead-in no
  longer calls every view 'live' (artifact views are self-contained).
- Not taken: finding 2 (focus management on reopen). 'Got it' has the same preexisting
  unmount-under-focus behavior; fixing reopen alone would be asymmetric. Candidate for a small
  focused a11y pass over the home surface's disclosure buttons if one is filed.
- Post-fix gates: typecheck 0, ui tests 0, pages e2e 13/13.

[unit under review](../tasks/home-landing-rethink.md)
