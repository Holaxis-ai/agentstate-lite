---
type: Task
title: 'Graph lints: write-time link-type conformance + expects_inbound status sweep'
status: done
priority: '1'
description: >-
  SHIPPED in PR #7: ONE shared declaration collector (cli/src/link-types.ts)
  feeding both consumers — write-time link_type_violations (warn) on link add,
  and the expects_inbound status sweep (missing_expected_links). Extended since
  by PR #20 (terminal instances excluded from the sweep, reported as
  terminal_skipped) and PR #23 pending (addLink extraction reuses the same lint
  for new --link). Closed in the 2026-07-09 board hygiene pass — record had sat
  in_progress since shipping.
actor: mike/claude
timestamp: '2026-07-09T15:13:41.841Z'
---

