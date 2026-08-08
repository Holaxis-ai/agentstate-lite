---
type: Task
title: Create the three missing canonical Review wrappers
status: done
priority: '2'
assignee: review-migration-builder
actor: review-migration-builder
description: >-
  Created exactly three disclosure-safe deterministic Review wrappers; preserved
  78 frozen hashes, five Findings, and Mike’s exact two-task remediation
  identity.
timestamp: '2026-08-08T15:08:42.276Z'
---
# Objective

Create exactly three thin, disclosure-safe canonical Review wrappers for the established missing families while preserving every source artifact byte and creating no Findings or remediation Tasks.

# Acceptance

Wrappers cover Mike's architectural-smell family, the frozen MCP Design Review, and the chronology-aware domain-model family. They use generic open-world metadata and plain OKF links, preserve multi-revision provenance and verdict subject, copy no sensitive mechanics or causal analysis, and link only existing evidence/work.

[governed by](../plans/architecture-review-record-alignment.md)

[depends on](architecture-review-alignment-method-v1-1.md)

# Outcome

Created exactly three new, expect-absent canonical Review wrappers:

- `reviews/architectural-smell-investigation` — `sha256:c463e099b9b8a2acbbb87f2457407bd1e680120c6124c9c74f23c6ec0c7dc529`;
- `reviews/mcp-view-security-model-unification-architecture-review` — `sha256:3d39dca062d7b71b7cabca273a3c9e3e48a382f93309e74545a81bca5ca8b5d3`;
- `reviews/architecture-domain-model-review` — `sha256:64e66aefdee778601836167b2a212dc05b4f6fcada6eb15fdcc5063bf43e3386`.

Each wrapper is a disclosure-safe deterministic projection with an explicit verdict subject, source precedence, conflict-to-incomplete rule, and exact provenance. The Mike wrapper has nine outbound links: one synthesis, four Findings, one handoff Context Note, one deprecated Claim, and exactly two existing Task IDs.

# Validation

- Compared 78 frozen-current inventory inputs against their exact SHA-256 values: zero mismatches.
- `type: Review` count is 19: the prior 16 plus exactly these three wrappers.
- `type: Finding` count remains 5; this unit created none.
- Mike `produces task` targets are exactly `tasks/registered-view-launch-authority-consolidation` and `tasks/core-import-direction-gate`; this unit created no Task.
- Bundle health remains 0 malformed, 9 kind warnings, 6 unresolved links, 18 link-type violations, and 35 missing expected links; no new conformance debt was introduced.

[Mike wrapper](../reviews/architectural-smell-investigation.md)

[MCP legacy wrapper](../reviews/mcp-view-security-model-unification-architecture-review.md)

[domain-model chronology wrapper](../reviews/architecture-domain-model-review.md)
