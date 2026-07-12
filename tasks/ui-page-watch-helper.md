---
type: Task
title: 'Bundle Pages: canonical Bridge.watch live-refresh helper'
status: done
priority: '1'
assignee: openai/codex
description: >-
  Make correct subscribe-before-snapshot live Page behavior a one-line optional
  client primitive.
actor: openai/codex
timestamp: '2026-07-12T11:19:29.451Z'
---
# Objective

Make correct live Page authoring one line by adding an optional `Bridge.watch(refresh)` helper to the shipped copyable bridge client and using it in the shipped data Page examples.

# Behavioral claim

A Page author supplies only an asynchronous refresh function. The canonical helper subscribes before the initial snapshot, never runs overlapping refreshes, coalesces changes that arrive while a refresh is running, and reruns after later changes without requiring the author to reconstruct live-update coordination.

# Scope

- Add `Bridge.watch(refresh)` to the copyable v0 client in `examples/pages/BRIDGE.md` and embedded example clients.
- Migrate Pulse and Roadmap to the helper without changing their user-facing behavior.
- Pin subscribe-before-first-refresh, serialized refreshes, coalescing, recovery after refresh rejection, and existing `subscribe` compatibility.
- Keep this additive and self-contained: no wire-protocol, shell, event-backbone, Page-framework, or mutation changes.

# Origin

The generic Review Requests Page had to hand-author subscribe-before-snapshot and generation fencing. This task moves that recurring platform-specific responsibility into the client contract while leaving domain queries and rendering in the Page.

# Workflow

Design review → isolated implementation → independent code review → exact-SHA QA → PR.

# Implementation status

- Implemented on `codex/page-watch-helper` at `c8c6b197ff09ebb351210cb3c35c05d1f27ae00a`.
- Independent design review approved after pinning failed-watcher deactivation and queued-batch recovery after rejection.
- Independent code review approved with no findings.
- Final QA passed 26/26 literal-client scheduler tests, the full repository gate, Chromium Page tests, built CLI smoke, and standalone package-install smoke.
- Pull request https://github.com/Holaxis-ai/agentstate-lite/pull/41 merged as `77dec2e5e72ee12fde715da8e0d5af5b384d2e57`.
- Post-merge automation regenerated the installed skill, Page references, and compiled bundle as plugin `1.0.38` at `6a7e00c`.

Shipped.

[depends on](review-request-workflow.md)

[plan](../plans/ui-page-watch-helper.md)
