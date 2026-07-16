---
type: Roadmap Item
title: 'board-git package: git tier behind a BoardChannel seam (branch + in-tree)'
status: done
description: >-
  COMPLETE (2026-07-16, seven PRs, all independently reviewed on exact SHAs):
  #73 seam prep, #75 establish unification + --migrate retirement (full
  high-risk ladder: review, adversarial QA, F1 fix, delta review), #76 cursor
  split, #78 extraction (packages/board-git, no-allowlist machine-enforced
  import boundary), #79 fail-closed BoardChannel detection, #80 in-tree
  read-side mode, #81 review-nit sweep. Product goals delivered: the git tier is
  a package with a mechanical boundary, and a bundle committed with code is a
  supported, honestly-described board mode (read-side v1: awareness +
  fetch-and-report; write verbs refuse truthfully; --establish is the upgrade
  path). Plan: plans/board-git-package (v3). Open elsewhere on the board:
  tasks/establish-window-journey-defects (pre-existing window-journey issues
  from #75's QA — its own prioritization call).
actor: mike/claude
timestamp: '2026-07-16T10:58:34.617Z'
---
[contains](../tasks/board-git-a0-seam-prep.md)

[contains](../tasks/board-git-a1-extraction.md)

[contains](../tasks/board-git-b-channel-detection.md)

[contains](../tasks/board-git-c-intree-read-side.md)

[plan](../plans/board-git-package.md)

[contains](../tasks/board-git-seam-nits.md)
