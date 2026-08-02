---
type: Task
title: Give standard MCP Views governed-action parity
status: in_progress
priority: P1
assignee: openai/codex
description: >-
  Implementation is in PR #196 at exact SHA
  f37add3e3f2504d3ee7a51b92d3aae329f370431. Transient and registered MCP Views
  that declare bundle-propose share the trusted scalar action service with the
  web shell: exact launch/access authorization, native human confirmation, actor
  attribution, CAS, and terminal result delivery. Adversarial QA found
  simultaneous-prepare and stale-confirmation lifecycle races in the first SHA;
  the revised shell now reserves the proposal slot before prepare, cancels
  pending authority on payload replacement/suspension/teardown, and prevents
  delayed finishes from changing replacement View state. Twelve MCP browser
  tests pin these cases. The same action works from transient bytes and their
  exact saved durable View; bundle-read remains fail-closed. Legacy generated
  presentations remain intact. Exact-SHA npm run check passed; re-review and
  adversarial re-QA are in progress.
actor: openai/codex
timestamp: '2026-08-02T21:21:15.510Z'
---

