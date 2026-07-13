---
type: Convention
title: Review Request
governs: Review Request
path: review-requests/
description: A durable request for a named human to judge a defined question against linked evidence — the workflow authority for a decision that must survive chat history.
links:
  reviews design: Design
  reviews task: Task
  reviews roadmap item: Roadmap Item
  explained by: Page
fields:
  required:
    - title
    - status
    - reviewer
    - requested_by
    - question
  optional:
    - decision_summary
    - decided_at
  values:
    status:
      - requested
      - in_review
      - changes_requested
      - approved
      - canceled
  terminal:
    status:
      - approved
      - canceled
  descriptions:
    title: A concise label for the review outcome being sought.
    status: The persisted review lifecycle state (requested -> in_review -> changes_requested -> approved/canceled), not an activity update.
    reviewer: The human expected to make the judgment. Coordination metadata only, not an authorization grant and not license for an agent to act as that person.
    requested_by: The human accountable for the scope and evidence supplied to the reviewer.
    question: The exact judgment the reviewer is being asked to make.
    decision_summary: A concise persisted outcome recorded after the review; absent while no decision exists.
    decided_at: ISO 8601 timestamp at which the persisted decision was made.
sections:
  - Context
  - Requested decision
  - Acceptance criteria
  - Reviewer response
actor: openai/codex
timestamp: '2026-07-12T00:00:00.000Z'
---
# Review Request

A durable request for a named human to judge a defined question against linked evidence. Create
one when a decision or review must survive chat history and be visible to humans and agents. Do
not use it as a generic task: the record is the workflow authority, while any Page is only a
read-only projection.

## Field meanings

- `title` — a concise label for the review outcome being sought.
- `status` — the persisted review lifecycle state, not an activity update.
- `reviewer` — the human expected to make the judgment. This is coordination metadata, not an
  authorization grant and not permission for an agent to impersonate that person as `actor`.
- `requested_by` — the human accountable for the scope and evidence supplied to the reviewer.
- `question` — the exact judgment the reviewer is being asked to make.
- `decision_summary` — a concise persisted outcome after review; absent while no decision exists.
- `decided_at` — the ISO timestamp at which the persisted decision was recorded.

These definitions live in the Convention body today. Planned machine-readable Kind, field,
relationship, and enum descriptions have not shipped and are not implied by this document.

## Status meanings

- `requested` — ready for the reviewer; no review is yet in progress.
- `in_review` — the reviewer is actively considering the request.
- `changes_requested` — the reviewer has identified work that must be addressed before another
  decision; the request remains open.
- `approved` — the reviewer accepted the proposal; terminal for this request.
- `canceled` — the requester withdrew the request; terminal for this request.

The expected lifecycle is `requested -> in_review -> approved`, with
`in_review -> changes_requested -> requested` for revision. Cancellation may occur from any open
state. This is guidance, not a transition engine.

## Relationship meanings

- `reviews design` -> `Design` — a design whose reasoning or proposed contract is under review.
- `reviews task` -> `Task` — implementation work whose scope or sequencing informs the decision.
- `reviews roadmap item` -> `Roadmap Item` — the strategic commitment affected by the decision.
- `explained by` -> `Page` — a registered visual explainer that orients the reviewer. It remains
  a projection and must not become the decision authority.

Relationship names are target-specific because the current typed vocabulary maps one exact edge
text to one target Kind.

## Body sections

- `Context` — why the review exists and what background the reviewer needs.
- `Requested decision` — the judgments requested, written so an answer can be explicit.
- `Acceptance criteria` — evidence of a complete review, not automated validation rules.
- `Reviewer response` — the durable response, objections, conditions, and rationale. Leave it
  explicitly pending until the reviewer responds.

## Authority and attribution

The requester owns scope, evidence, resubmission, and cancellation. The named reviewer owns the
response and outcome. A reviewer or agent records the response through one version-guarded,
attributed CLI update that preserves the existing body and fills `Reviewer response`. The
executing agent uses its truthful actor identity; `reviewer` and `requested_by` do not enforce
identity. Version history provides provenance, not authorization.
