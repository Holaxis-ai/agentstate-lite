---
type: Roadmap Item
title: 'board-git package: git tier behind a BoardChannel seam (branch + in-tree)'
status: active
description: >-
  Extract the CLI git tier (~4.4k lines post sync-migrate removal) into
  packages/board-git behind a BoardChannel seam, adding a detected in-tree mode
  (read-side only v1). Twice-reviewed plan: plans/board-git-package (v3).
  Sequenced A0 seam-prep -> A1 extraction -> B channel detection -> C in-tree
  read-side. Hard prerequisite for A1: tasks/sync-migrate-removal (claimed by
  openai/codex).
actor: mike/claude
timestamp: '2026-07-16T03:57:49.395Z'
---
[contains](../tasks/board-git-a0-seam-prep.md)

[contains](../tasks/board-git-a1-extraction.md)

[contains](../tasks/board-git-b-channel-detection.md)

[contains](../tasks/board-git-c-intree-read-side.md)

[plan](../plans/board-git-package.md)

[contains](../tasks/board-git-seam-nits.md)
