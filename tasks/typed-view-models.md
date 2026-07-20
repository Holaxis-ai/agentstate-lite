---
type: Task
title: >-
  CANDIDATE (trigger-gated): typed view models over Record<string,unknown>
  render bags
description: >-
  Candidate for roadmap-items/change-surface-simplification (its restraint
  stance governs: NOT built on safety/size arguments — only on real demand).
  From the 2026-07-19 complexity audit, VERIFIED: rendered output is assembled
  as untyped string-keyed Record<string,unknown> bags rather than typed view
  models — status.ts 16, kind.ts 12, converge.ts 13, home.ts 9 (buildHomeView
  itself returns Record<string,unknown>, home.ts:604-619). Correctness angle: a
  typo'd key or wrong-typed value in a render bag escapes tsc. WHY
  TRIGGER-GATED, NOT NOW: (1) it's pervasive (75+ sites across many commands) —
  blanket typing is a large invasive churn against the restraint stance; (2) the
  rendered-byte FIXTURE batteries already backstop key/shape typos empirically
  (a wrong key reddens a pin), so the marginal compile-time safety is real but
  partly covered. TRIGGER to wake: a real output-contract defect ships that a
  typed view model would have caught, OR a view-shape feature needs the
  structure. If woken, do it as a NARROW pilot (type ONE view — home or status —
  as proof) before any sweep. --- SAME-BATCH ADJUDICATIONS (recorded so they
  aren't re-raised): git-plumbing-leak/feature-envy (establish raw-git) DECLINED
  — the heavy orchestration already lives in board-git flow.ts
  (createRemovalCommit/refCommit/treeOf/isAncestor); only 3 trivial read-only
  raw queries (cat-file -e, status --porcelain, remote get-url) remain, a minor
  nit that folds under the existing establish/porcelain candidates. porcelain.ts
  49-export grab-bag ALREADY a tracked candidate (trigger: demonstrated merge
  conflicts / navigation errors) — no new task.
actor: mike/claude
status: todo
timestamp: '2026-07-20T01:28:05.746Z'
---
[trigger-gated candidate (restraint stance governs)](../roadmap-items/change-surface-simplification.md)
