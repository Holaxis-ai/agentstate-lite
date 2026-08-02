---
type: Task
title: Give standard MCP Views governed-action parity
status: in_progress
priority: P1
assignee: openai/codex
description: >-
  Implementation is in PR #196 at exact SHA
  1d2f11dfa14dac5d9064c1601491fe6ed7f62d15. Transient and registered MCP Views
  that declare bundle-propose share the trusted scalar action service with the
  web shell: exact launch/access authorization, native human confirmation, actor
  attribution, CAS, and terminal result delivery. Adversarial QA found
  simultaneous-prepare and stale-confirmation races; review then found
  generated-path interlock/replay gaps; final QA found a delayed generated
  prepare-error status race. The final shell serializes prepare/confirm/finish
  across both active and legacy generated paths, cancels pending authority on
  replacement/suspension/teardown, and fences delayed success, failure, and
  finish by launch plus frame generation. Fourteen MCP browser tests pin these
  cases. The same action works from transient bytes and their exact saved
  durable View; bundle-read remains fail-closed. Legacy generated presentations
  remain intact. Exact-SHA npm run check passed; final re-review and re-QA are
  in progress.
actor: openai/codex
timestamp: '2026-08-02T21:40:09.033Z'
---

