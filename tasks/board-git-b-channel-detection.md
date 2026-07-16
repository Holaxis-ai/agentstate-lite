---
type: Task
title: >-
  board-git PR B: BoardChannel detection (branch/local-only wired; in-tree
  recognized)
status: done
priority: '3'
description: >-
  SHIPPED: PR #79 merged (reviewed candidate 1f95f50). BoardChannel classifier
  in packages/board-git/src/channel.ts: typed union (branch/in-tree/local-only)
  + indeterminate arm; three-valued remote evidence model; 21 deterministic
  constructed-git-state tests covering all 10 plan matrix rows + 2 out-of-matrix
  states; wedged-mid-rebase -> branch pinned with a throwing probe proving
  non-consultation; fail-closed pinned (all dead-remote shapes exit 128 ->
  unknown, never absent); detection read-only pinned on-disk; zero CLI consumers
  (PR C wires). Independent review APPROVE: row->test mapping rebuilt
  independently with no gaps; both judgment calls adjudicated RIGHT against
  today's provisioning code (remnant->in-tree matches inspection order;
  stale-evidence = offline-join parity, poisoned-evidence attack survived);
  import gate red-probed; extraction byte-identical. Carried to C: act-time
  probe stays authoritative (TOCTOU note); pre-share copy misleads when origin
  was removed (pre-existing); details.state is the refusal discriminator;
  dual/indeterminate copy is DRAFT until C renders it. UNBLOCKS C.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T04:34:04.311Z'
---
[depends on](board-git-a1-extraction.md)
