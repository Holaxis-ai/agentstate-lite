---
type: Page
title: Board
entry: pages/board.html
description: >-
  Live kanban over the board's own Tasks and Roadmap Items — in progress, up
  next, blocked, recently done; re-renders on every synced change.
timestamp: '2026-07-10T16:30:00.000Z'
---

The board rendering itself: queries `type: Task` and `type: Roadmap Item` over the v0
bridge, groups by status, and subscribes to change events so a teammate's synced update
re-renders the page live. First real consumer of the ui-pages spike.
