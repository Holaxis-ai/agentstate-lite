---
type: Task
title: Prove one unchanged durable View through the MCP host
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #173 at 7e22fcc proves the shipped Roadmap HTML runs from unchanged current
  bytes through the shared launch authority and read-only BridgeService in the
  MCP App. The security follow-up makes approval's executable-code trust
  boundary explicit, adds shell CSP defense-in-depth, and retires a launch after
  unexpected child navigation. Exact-SHA independent review requested changes:
  (1) suspension currently clears scheduled polling but an in-flight bridge/poll
  response can still forward and restart polling because the active predicate
  ignores hidden/suspended state; add delayed bridge and poll tests across
  hide/resume. (2) UTF-8 BOM bytes are part of the approved stored version but
  default TextDecoder handling strips the BOM before Blob execution, falsifying
  literal exact-byte identity; preserve BOM or narrow the claim and pin
  round-trip behavior. (3) the new guard test imports unbuilt dist and
  package-only npm test fails from a clean checkout; use the TS loader/source or
  add the package build prerequisite. Positive review evidence: exact-SHA CI
  green on Node 20/22/26, focused suites green after build, Chromium proved the
  static shell CSP constrains the nested blob View even without iframe csp
  support, and no generated-view/durable-bridge regression was found. Status
  remains in progress; fix these findings, then renew exact-SHA review, run
  adversarial QA, and dogfood in a real conversational host before merge.
actor: openai/codex
timestamp: '2026-07-27T03:03:44.951Z'
---

