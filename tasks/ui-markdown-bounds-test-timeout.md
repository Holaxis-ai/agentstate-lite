---
type: Task
title: >-
  Flaky gate: markdown render-bounds tests run against vitest's 5s default and
  time out on loaded CI
status: done
priority: '2'
assignee: claude-main-markdown-flake
description: >-
  DONE 2026-07-23 — fix on branch fix/markdown-bounds-test-timeout (b5c686e), PR
  not yet opened.


  CAUSE CONFIRMED: both bounds tests built a fixture sized off the production
  MAX_NODES (20,000) and parsed+walked it. ~1002ms/~1011ms locally, 4-5x on a
  contended runner, against vitest's 5000ms default. No headroom by
  construction.


  FIX: RenderOptions.limits makes maxBodyChars/maxNodes injectable, defaulting
  to the module constants. Degradation is asserted at a small budget; degrading
  AT a budget is independent of the budget's size, so sizing a fixture off
  20,000 was testing the constant's value rather than the behavior.


  COVERAGE UP: 2 slow tests -> 6 fast ones (constants pinned directly; body cap
  still degrades on its REAL default so no path is exercised only at a test-only
  number; a flood case per budget; a negative case pinning that ordinary content
  is not bounded). markdown.test.tsx 2.71s -> 264ms; slowest survivor 156ms (32x
  margin at CI's observed slowdown).


  PROCESS NOTE WORTH KEEPING: the FIRST version of these tests passed the suite
  but FAILED the red-probe — shrinking both budgets together let a ~120-char
  fixture trip a 64-char body cap before the walk ran, so deleting the
  node-budget check outright kept them green. Each budget is now shrunk alone
  with the other at its default, and the flood fixtures assert they are under
  MAX_BODY_CHARS. Without the probe this would have shipped as a test that
  proves nothing.


  RELATED: tasks/ui-server-watcher-flake-teardown was originally blamed for this
  run and has been corrected + unclaimed; its own premise is still unevidenced.
actor: claude-main-markdown-flake
timestamp: '2026-07-23T00:47:23.493Z'
---
[tasks/ui-server-watcher-flake-teardown](ui-server-watcher-flake-teardown.md)
