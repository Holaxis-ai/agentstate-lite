---
type: View
title: Board
entry: pages/board.html
description: >-
  Live kanban over the board's own Tasks and Roadmap Items — in progress, up
  next, blocked, recently done; re-renders on every synced change.
actor: mike/claude
access: bundle-read
timestamp: '2026-07-10T19:58:57.650Z'
---

The board rendering itself: queries `type: Task` and `type: Roadmap Item` over the v0
bridge, groups by status, and subscribes to change events so a teammate's synced update
re-renders the page live. First real consumer of the ui-pages spike.
