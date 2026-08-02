---
type: Convention
title: Journey Stage
governs: Journey Stage
path: journey-stages/
fields:
  required:
    - title
    - journey
    - order
    - lane
    - readiness
    - criticality
  optional:
    - description
  values:
    lane:
      - shared
      - claude-desktop
      - chatgpt-app
      - terminal-web
    readiness:
      - missing
      - rough
      - works
      - supported
      - validated
    criticality:
      - core
      - supporting
links:
  journey stage planned by: Roadmap Item
  journey stage specified by: Design
  journey stage implemented by: Task
  journey stage validated by: Context Note
  journey stage reviewed by: Review
sections:
  - Desired experience
  - Current experience
  - Acceptance criteria
  - Evidence
  - Remaining gaps
timestamp: '2026-08-02T15:26:35.520Z'
---

# Journey Stage

One observable step in a Journey. Readiness describes demonstrated user support, not implementation
effort or optimism. The record owns the changing assessment; linked roadmap items, designs, tasks,
and evidence explain how the stage will improve and why its current rating is credible.
