---
type: Task
title: Board-native human review workflow
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Prove reusable human review through a Review Request Kind, linked evidence, an
  architecture explainer Page, and a generic review Page.
actor: openai/codex
timestamp: '2026-07-12T01:50:40.359Z'
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

[plan](../plans/review-request-workflow.md)
