---
type: Page
title: Board
entry: pages/board.html
description: Tasks in status columns (todo · in progress · blocked); a status change moves the card live.
actor: mike/claude
timestamp: "2026-07-09T00:00:01.000Z"
---
Tasks bucketed into status columns over the bridge's `type: Task` query. Done and canceled tasks
collapse behind a count. When a task's `status` changes, the card moves to its new column within
about a second — driven by the same live `change` stream, no reload.
