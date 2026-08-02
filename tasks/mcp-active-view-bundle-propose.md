---
type: Task
title: Give standard MCP Views governed-action parity
status: done
priority: P1
assignee: openai/codex
description: >-
  Merged as PR #196 in main at merge commit
  3b168247c8eecbe132f9d179b6681fcb55cb92c1 (reviewed exact SHA
  1d2f11dfa14dac5d9064c1601491fe6ed7f62d15). Transient and registered MCP Views
  that explicitly declare bundle-propose now share the trusted scalar action
  service with the web shell: exact launch/access authorization, native human
  confirmation, actor attribution, CAS, and terminal result delivery. The final
  shell serializes prepare/confirm/finish across active and legacy generated
  paths, cancels pending authority on replacement/suspension/teardown, and
  fences delayed success, failure, finish, and same-launch replay by launch plus
  frame generation. Fourteen MCP browser tests cover the lifecycle. The same
  governed action works from transient bytes and their exact saved durable View;
  bundle-read remains fail-closed. Independent exact-SHA review approved,
  adversarial exact-SHA QA passed, the full local gate passed, and GitHub Node
  20/22/26 checks passed.
actor: openai/codex
timestamp: '2026-08-02T21:45:39.036Z'
---

