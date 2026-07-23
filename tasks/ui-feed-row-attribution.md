---
type: Task
title: >-
  Activity rows name the last writer as if it were the owner — show the
  assignee, stop implying agency
status: in_progress
priority: '1'
assignee: claude-main-feed-attr
description: >-
  CLAIMED 2026-07-23 by claude-main-feed-attr.


  PROBLEM (hit three times in one session by the product owner, in the live UI):
  a feed row renders '<actor> <Kind> "<title>"'. The name is the doc's
  frontmatter 'actor' — WHOEVER WROTE LAST — but its position (first, bold,
  sentence-subject) reads as the person responsible. The row never shows
  'assignee', which is the field that actually means that. Observed: 'codex Task
  "Write the onboarding docs"' where codex merely created the doc and brian owns
  the work; and 'brian Task "Fix the flaky checkout test"' assigned to codex.
  Two of three rows named the party NOT doing the work.


  REPRODUCED, related defects in the same field (NOT fixed by this task —
  display only): an update with no --actor bumps timestamp but KEEPS the
  previous name, so the row credits someone for a change they did not make;
  'link add --actor dana' overwrites the actor of a doc dana did not author; and
  any later write erases the creation event, since the feed projects heads
  (current state), not events.


  SCOPE OF THIS TASK (display only, ActivityFeed.tsx): (1) surface the kind's
  declared lifecycle/ownership fields when present — status and assignee —
  generically off frontmatter, no Task special-casing; (2) restructure the row
  so the actor reads as provenance rather than as the subject of a sentence.
  Deliberately NOT in scope: changing what is written (the stale-actor
  write-path fix), and deriving real created/updated verbs from board-git's
  AwarenessDeltaRow (gated behind roadmap-items/real-time-event-backbone).


  DONE WHEN: a row whose writer differs from its assignee makes that distinction
  readable at a glance, the actor no longer occupies the subject position, and
  tests pin both — including a row with no assignee and a row with no actor.
actor: claude-main-feed-attr
timestamp: '2026-07-23T13:32:18.780Z'
---
[roadmap-items/launcher-home-surface](../roadmap-items/launcher-home-surface.md)
