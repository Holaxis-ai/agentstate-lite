---
type: View
title: Status
description: >-
  Where-are-we dashboard over the board: task KPIs, per-roadmap-item progress
  bars, in-flight/blocked cards, recently-done and queue lists; live via the v0
  bridge.
entry: pages/status.html
actor: claude-fable
access: bundle-read
timestamp: '2026-07-12T13:34:31.836Z'
---

A synthesized project-status view: queries `type: Task` and `type: Roadmap Item`
heads plus the `contains` edge set over the v0 bridge, rolls tasks up under their
roadmap items as stacked progress bars, and subscribes to change events so every
synced update re-renders live. Complements the Board page (kanban) with the
where-are-we summary.
