---
type: Convention
title: Journey
governs: Journey
path: journeys/
fields:
  required:
    - title
    - status
    - target_user
    - product_promise
    - entry_condition
    - success_condition
  optional:
    - description
  values:
    status:
      - draft
      - active
      - retired
  terminal:
    status:
      - retired
links:
  has journey stage: Journey Stage
sections:
  - Product promise
  - Entry condition
  - Successful outcome
  - Supported surfaces
timestamp: '2026-08-02T15:26:35.330Z'
---

# Journey

A stable end-to-end product promise experienced by a defined user. A Journey is not a roadmap or a
task hierarchy. Its ordered Journey Stages hold the live assessment and link back to the existing
work that advances them.
