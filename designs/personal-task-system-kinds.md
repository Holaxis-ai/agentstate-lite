---
type: Design
title: 'Personal Task System v1: Task + Project kind contract'
description: >-
  Recommended schema for the first Personal Task System recipe, grounded in
  aggregate founder dogfood: a validated Task lifecycle plus an optional,
  deliberately small Project kind and typed Task relationships. This is the
  stable data contract for the collaborative board View; it excludes the
  surrounding private ontology and avoids required body ceremony.
actor: openai/codex
timestamp: '2026-07-20T21:33:34.199Z'
---
# Decision

The Personal Task System v1 has two first-class domain kinds: **Task** and **Project**.

Project is not speculative scope. It emerged from sustained use of the founder's private task system and is already a material organizing relationship. The product recipe should preserve that validated capability while simplifying the private bundle's broader ontology.

This design is the stable schema contract for the first collaborative board View. Stable means the View may depend on kind names, paths, required fields, enum values, and relationship vocabulary. It does not mean the model can never gain compatible optional fields or relationships.

# Evidence from real use

The reference bundle was inspected only in aggregate; no private instance content is carried into this design.

- 74 Task instances.
- Status exercises every proposed lifecycle value: `todo`, `in_progress`, `blocked`, `done`, and `canceled`.
- Priority is present on 72 of 74 Tasks, using `high`, `medium`, or `low`.
- Assignee is present on 73 of 74 Tasks.
- Due date is present on 47 of 74 Tasks.
- 40 Task-to-Project relationships exist.
- The reference system has 5 Projects, currently exercising `active` and `paused`.
- Sensitivity is meaningfully set on only 1 Task, so it does not earn a place in the general v1.
- The Task `description` field is unused; ordinary Markdown body content remains available without making another field part of the contract.

# Task kind

```yaml
type: Convention
title: Task
governs: Task
path: tasks/
description: A discrete next action that a person or agent can prioritize, own, advance, block, and complete.
fields:
  required:
    - title
    - status
  optional:
    - priority
    - assignee
    - due
  values:
    status:
      - todo
      - in_progress
      - blocked
      - done
      - canceled
    priority:
      - high
      - medium
      - low
  terminal:
    status:
      - done
      - canceled
  descriptions:
    status: Current lifecycle state of the work.
    priority: Relative importance; absence means unprioritized.
    assignee: Advisory identity responsible for the next action; not authentication or authorization.
    due: Target calendar date, authored as YYYY-MM-DD.
links:
  depends on: Task
  part of: Project
link_descriptions:
  depends on: A prerequisite Task that should complete before this Task can proceed.
  part of: The optional Project whose outcome this Task advances.
freshness_horizon: 30d
```

## Task body

Do not require body headings in v1. Fast capture is central to a personal task system, and the reference usage does not justify mandatory ceremony. The Markdown body remains available for context, acceptance notes, or agent working material.

## Task semantics

- A Task may exist without a Project. Inbox, maintenance, and one-off work must remain cheap to capture.
- A Task may link to another Task with `depends on`; the graph carries dependency structure.
- `assignee` is optional even though the reference bundle uses it heavily. A single-user system must not require identity setup.
- Missing priority is distinct from `low`: it means the Task has not been prioritized.
- The schema teaches the `YYYY-MM-DD` due-date convention; v1 does not introduce a new semantic date type.

# Project kind

```yaml
type: Convention
title: Project
governs: Project
path: projects/
description: A durable outcome or body of work that groups related Tasks and preserves context across them.
fields:
  required:
    - title
    - status
  optional:
    - description
  values:
    status:
      - active
      - paused
      - archived
  terminal:
    status:
      - archived
  descriptions:
    status: Whether the Project is active work, intentionally paused, or archived.
    description: A concise statement of the Project's intended outcome or scope.
expects_inbound:
  part of: Task
freshness_horizon: 180d
```

## Project body

Do not copy the private `Project Overview` kind's required six-section document structure. A Project may carry free-form Markdown, but the general task recipe must remain useful for someone who only needs a title, status, and grouped Tasks.

# Board View contract

The first View may rely on:

- Querying `Task` and `Project` instances by kind.
- Task status columns using the exact five-value lifecycle.
- Priority ordering `high`, `medium`, `low`, then absent.
- Optional assignee and due-date display/filtering.
- `part of` edges for Project grouping and filtering.
- `depends on` edges for blocked/dependency context.
- Human-confirmed scalar changes to Task status, priority, assignee, and due through the trusted View-action mechanism.

The current trusted action surface does not need to grow merely to ship this unit. Project membership is rendered from typed links and may initially be authored by an agent through the CLI; human link editing can be a later, separately justified action capability.

# Compatibility and migration

- Author the recipe's conventions as new portable definitions; do not automatically rewrite the founder's private bundle.
- Generalize `Project Overview` to the recipe-facing kind name `Project`.
- Generalize the observed `relates to` relationship to the more structural `part of` vocabulary used for grouping.
- The existing generic work-tracking Task convention is the starting point, but the recipe-specific Task adds the empirically validated `due` field, priority enum, Project relationship, and field/link descriptions.

# Explicit exclusions

Do not pull the reference bundle's adjacent `Area`, `Engagement`, `Note`, `Resource`, `Time Entry`, `Timesheet`, or Context Note kinds into this recipe. They may become later recipes or compatible extensions when a concrete user journey demands them.

Also exclude from v1:

- Sensitivity policy or claims of privacy enforcement.
- Required Task or Project body sections.
- Recurrence, estimates, subtasks as a bespoke hierarchy, calendars, notifications, and automation rules.
- A custom identity or authorization system.
- Human editing of typed links through the View bridge.

# Acceptance criteria

1. The checked-in recipe conventions express exactly the Task and Project contracts above and pass strict kind parsing.
2. A fresh bundle can install both definitions without instance data.
3. Representative instances cover all status and priority values, an unprioritized Task, a Task without a Project, `part of`, and `depends on`.
4. `kinds` teaches the field and relationship descriptions clearly enough for an unfamiliar agent to author valid instances.
5. The board View task can treat this schema as its v1 contract without requiring additional domain fields.
6. No private instance titles, bodies, people, or project details are copied from the reference bundle.

[the owning roadmap item](../roadmap-items/personal-task-system-recipe.md)

[the implementation task](../tasks/task-system-kind-design.md)

[the downstream board View](../tasks/task-system-board-ui.md)
