---
type: Task
title: Pin permissive OKF v0.2 read and transport compatibility
status: done
priority: '2'
description: >-
  Merged PR #221 as 2c9de5e on 2026-08-07. Test-only: a hand-authored v0.2
  fixture pins local/reference-server read, head-query, filter, graph,
  root-version, content-version, and byte-untouched agreement. Focused suite,
  full local npm run check, and GitHub Node 20/22/26 checks passed. No
  production behavior changed.
actor: openai/codex
timestamp: '2026-08-08T01:28:25.762Z'
---
# Objective

Freeze AgentState Lite's current permissive OKF v0.2 read and transport behavior before any v0.2
writer semantics are introduced.

# Scope

- Add a compact, hand-authored v0.2 bundle fixture covering `generated`, `verified`, `sources`,
  date-only scalars, lifecycle `status`, unknown extension fields, and ordinary body links.
- Prove read, head-query, graph extraction, and local/reference-server agreement over that fixture.
- Keep this unit test-only: no production code, authoring claim, mutation semantics, defaults, or
  public guidance changes.
- Make the fixture the standing precondition for the later v0.2 write-contract task.

# Acceptance

- The tests fail if supported v0.2 metadata is dropped or read projections diverge across the local
  and reference-server paths.
- The fixture remains an external-producer shape rather than an AgentState-generated document.
- The PR contains no production-code changes and the full repository gate passes.

# Evidence

See the [compatibility design](../designs/okf-compatibility-and-upstream-stewardship.md) and
[compatibility audit](../research/okf-v0-2-compatibility-audit.md).
