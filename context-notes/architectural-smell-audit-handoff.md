---
type: Context Note
title: 'Architectural-smell audit: findings and recommended sequence'
actor: openai/codex
timestamp: '2026-08-08T13:53:29.416Z'
---
# Summary

We tested four recommendations from the quantitative architectural-smell report against current
`main`, using independent investigations followed by a skeptical synthesis pass. The conclusion is
not that the codebase needs a broad cleanup program. The measurements are useful inventory, but
only two narrow changes currently have enough demonstrated value to schedule. Two other claims
should remain observations rather than becoming work.

# What was analyzed

The investigation covered four concrete claims:

1. Whether registered-View launch preparation is duplicated across the web host and
   `view-runtime`.
2. Whether core's bottom-layer production import rule lacks an executable guard.
3. Whether core's test dependency on server is a harmful layering inversion that should be moved.
4. Whether two reported CLI dependency cycles represent real runtime or maintenance risk.

Each claim was checked against current code and history, not accepted from file-size, complexity,
cycle, or clone metrics alone. A reducer then compared the findings and ranked only changes with a
clear invariant or demonstrated maintenance benefit.

# Findings

## Promote: one registered-View launch authority

The original report overstated this as duplication of the entire launch sequence, but a meaningful
duplication remains: the web host independently performs registered-View preparation,
currentness, and catalog work already owned by `view-runtime` for MCP. This is live,
security-sensitive policy, and history shows semantic changes have needed coordination across the
copies. Consolidating it deletes a real parallel decision path while preserving web and MCP
behavior.

This is the first recommended unit and is tracked as P2 in
`tasks/registered-view-launch-authority-consolidation`.

## Promote: enforce core's production import direction

Core's production dependency graph is clean today, but its most important layering promise—core is
the bottom layer—is not directly executable. A small production-source-only AST test can protect
that invariant, including type-only upward imports and escape hatches, without changing production
code or disturbing server-backed test fixtures.

This is the second recommended unit and is tracked as P3 in
`tasks/core-import-direction-gate`.

## Observe: core's server-backed tests

The dev/test dependency creates a test-scope cycle and prevents a simplistic isolated-core test
workflow. However, it is also an intentional integration fixture, the supported repository gate
already builds the relevant siblings, and several cases legitimately test core behavior through
the reference server. Moving the tests now would reorganize ownership without a demonstrated
product or engineering payoff. Revisit only if isolated core testing becomes a supported workflow,
the dependency causes recurring CI/build failures, or a case-by-case ownership matrix shows a
cleaner home.

No implementation task was created.

## Close: the two CLI type-only cycles

Both reported cycles close only through TypeScript type-only imports, which are erased before
runtime. The runtime graph is acyclic, and no initialization, build, tooling, or maintenance defect
was found. Moving types merely to make a type-insensitive cycle counter report zero would be churn.
If cycle checking is introduced later, it should distinguish runtime edges from type-only edges.

No implementation task was created.

# Recommendation

Execute only the two evidence-backed units, in this order:

1. Consolidate registered-View launch authority into `view-runtime`.
2. Add the core production import-direction gate.

Do not turn the rest of the architectural-smell report into a backlog based on LOC, complexity, or
duplication scores. Stable code should move only when there is a demonstrated defect, recurring
change friction, an upcoming feature that makes the refactor cheaper, or an important invariant
that lacks a single executable owner. The active roadmap item
`roadmap-items/change-surface-simplification` now records this sequence and keeps all other
candidates trigger-gated.

# Durable evidence

The detailed adjudication is in `findings/architectural-smell-investigation-synthesis`, with one
supporting Finding for each investigated claim. The original `tasks/simplification-audit` is done;
the synthesis and the roadmap are now the authoritative record for what should and should not move
forward.

[Synthesis](../findings/architectural-smell-investigation-synthesis.md)

[View finding](../findings/registered-view-launch-authority-investigation.md)

[Core gate finding](../findings/core-import-direction-gate-investigation.md)

[Test dependency finding](../findings/core-server-test-dependency-investigation.md)

[Cycle finding](../findings/cli-type-only-cycles-investigation.md)

[Roadmap](../roadmap-items/change-surface-simplification.md)

[Recommended task 1](../tasks/registered-view-launch-authority-consolidation.md)

[Recommended task 2](../tasks/core-import-direction-gate.md)
