---
type: Task
title: >-
  Flaky gate: markdown render-bounds tests run against vitest's 5s default and
  time out on loaded CI
status: in_progress
priority: '2'
assignee: claude-main-markdown-flake
description: >-
  CLAIMED 2026-07-23 by claude-main-markdown-flake.


  EVIDENCE: PR #151 run 29967569606 attempt 1, node 22, head c1fa959. FAIL
  src/views/markdown.test.tsx > 'bounds an all-EDGE flood too — inline edge rows
  count against the node budget' — 'Test timed out in 5000ms' at 5017ms. Its
  sibling, 'bounds degrade honestly: oversized bodies and node floods report
  bounded', took 3828ms on the same run. Node 20 and 26 passed on the identical
  sha; a bare re-run went green with no code change.


  CAUSE: both tests build a body sized off MAX_NODES (20,000) and parse+walk it,
  so their cost is proportional to the production constant. Locally they take
  ~1002ms and ~1011ms; on a contended shared runner that is 4-5x, which crosses
  vitest's 5000ms default at random. There is no headroom by construction.


  THE DESIGN POINT: the property under test is 'a flood exceeding the budget
  degrades to bounded', which is INDEPENDENT of how big the budget is. Sizing
  the fixture off the real 20,000 tests the constant's value, not the behavior,
  and is exactly what makes it slow. Splitting those apart (behavior at an
  injectable small budget; the constant's value asserted directly) should be
  both faster and strictly more coverage than raising a timeout.


  DONE WHEN: the bounds behavior is asserted without a fixture sized off the
  production constant, both tests run in low tens of milliseconds, and the real
  MAX_NODES/MAX_BODY_CHARS values are still pinned somewhere.
actor: claude-main-markdown-flake
timestamp: '2026-07-23T00:41:21.554Z'
---
[tasks/ui-server-watcher-flake-teardown](ui-server-watcher-flake-teardown.md)
