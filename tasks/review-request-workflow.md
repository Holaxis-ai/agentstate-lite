---
type: Task
title: Board-native human review workflow
status: done
priority: '1'
assignee: openai/codex
description: >-
  Prove reusable human review through a Review Request Kind, linked evidence, an
  architecture explainer Page, and a generic review Page.
actor: openai/codex
timestamp: '2026-07-12T02:28:02.002Z'
---
# Objective

Prove a reusable human-review workflow entirely inside the shared bundle: a durable Review Request Kind, a generic read-only review Page, an architecture explainer Page for Brian, and one real request linking the relevant designs, roadmap items, tasks, and explainer.

# Behavioral claim

An agent can create one structured Review Request and a human can open one generic UI to understand the question, inspect linked evidence, navigate to a purpose-built explainer, and record a decision through the existing agent/CLI path—without hardcoded reviewer-specific UI or AgentState code changes.

# Scope

- Declare a `Review Request` Convention with a compact lifecycle and typed link vocabulary.
- Document Kind, field, relationship, and enum meanings in the Convention body today; do not duplicate or pre-implement the pending machine-readable-description tasks.
- Create a registered architecture explainer Page for Brian covering the current architecture, values, description roadmap, and unlocked capabilities.
- Create a generic registered review Page that reads all Review Requests and linked artifacts from the bundle.
- Create one real Review Request assigned to Brian and connect it to the architecture Page and relevant design, roadmap, and task records.
- Exercise Page-to-Page navigation and browser history in the real local UI.

# Boundaries

- No AgentState source-code change.
- No writable Page bridge or in-UI approval button; decisions are recorded through an agent or CLI.
- No Brian-specific identifiers or artifact ids in the generic review Page.
- No new schema system; this dogfoods existing Kinds, links, blobs, Pages, and CLI enforcement.

# Workflow

Design → independent design review → board implementation → independent artifact review → live browser QA → sync.

# Outcome

Shipped entirely in the shared bundle:

- `Review Request` Convention with a compact requested/in-review/changes-requested/approved/canceled lifecycle, typed evidence relationships, four required body sections, terminal states, and human-readable semantics.
- Generic `pages-registry/reviews` read-only Page with subscribe-before-query bootstrapping, generation fencing, generic request selection, dynamic edge grouping, safe full-document evidence views, and registered Page navigation.
- `pages-registry/architecture-kinds` content Page explaining the current architecture, project values, planned description semantics, unlocked capabilities, hypotheses, and honest boundaries.
- Real `review-requests/kinds-and-descriptions-architecture` assigned to Brian Derfer and linked to two designs, one roadmap item, four description tasks, and the architecture Page.

Independent design and artifact reviews approved the final artifacts. Review findings drove fixes for a no-replay bootstrap race, an unproven response path, truncated evidence, prototype-key grouping, dark-mode contrast, and graph-link footer rendering.

Live QA proved empty-state subscription, request arrival without refresh, all evidence, full artifact expansion, Page navigation, browser history, and absence of mutation controls. Disposable QA proved the exact bootstrap race, malformed edge text, XSS escaping, Kind validation, and a CAS-safe attributed decision update that preserved the original body. Brian's real request remains `requested`; this implementation task is complete.

[plan](../plans/review-request-workflow.md)
