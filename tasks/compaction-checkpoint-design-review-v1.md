---
type: Task
title: Independently review compaction checkpoint lifecycle v1 design
status: in_progress
priority: '1'
description: >-
  Critique the selected lifecycle protocol, schemas, costs, support tiers, and
  host-exception boundaries before planning.
actor: codex-checkpoint-design-critic
timestamp: '2026-08-08T17:48:47.018Z'
---
# Goal

Independently review the v1 compaction-checkpoint lifecycle design and reject it unless a third-party
implementation planner could rely on it without inventing semantics, weakening invariants, or
silently accepting unbounded UX/security costs.

**Ultimate goal:** Make agent work durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Find architectural defects before task decomposition or code begins.

# Review target and authority

- Target: [v1 lifecycle design](../designs/compaction-context-checkpoint-lifecycle-v1.md)
- [authoritative task](compaction-context-checkpoint-lifecycle.md)
- [domain model and invariants](../designs/compaction-checkpoint-domain-model.md)
- [cross-runtime synthesis](../context-notes/compaction-checkpoint-cross-runtime-synthesis-2026-08-08.md)
- Runtime research for [Codex](../research/compaction-checkpoint-codex-capabilities.md),
  [Claude](../research/compaction-checkpoint-claude-capabilities.md), and
  [OpenCode](../research/compaction-checkpoint-opencode-capabilities.md)

# Required review

Write `reviews/compaction-context-checkpoint-lifecycle-v1-design-review` with verdict `pass`, `fail`,
or `pass-with-caveats`, severity-ranked findings, exact design locations, violated criteria/invariants,
and the smallest acceptable repair.

At minimum test:

1. Turn Ticket creation/injection/Stop correlation, replay, first-turn behavior, and what exact state
   proves the current turn was assessed without a hidden second authority;
2. unchanged selector CAS semantics, baseline/no-generation behavior, per-turn board dirtiness, and
   whether the claimed low-churn/ease-of-use cost is acceptable and measurable;
3. same-bearer one-continuation enforcement and proof that host retries, crashes, parallel hooks, or
   missing active flags cannot exceed the shared bound;
4. exact subject, lineage, bearer, and carrier mapping across root/subagent, compact, resume, fork,
   simultaneous carriers, and adapter restart;
5. generation/selector/receipt schemas, CAS/create/read-back ordering, orphan/superseded behavior,
   and remote/backend agreement;
6. PreCompact one-block/fail-open policy and the boundary between documented behavior and required
   empirical gates;
7. restore selector-generation-selector validation, payload bounds, delivery honesty, and ambiguity;
8. OpenCode restore-only classification and whether exact identity is sufficient to implement even
   that tier;
9. privacy, bundle visibility, retention, legacy migration, disable/uninstall, and foreign config
   preservation;
10. support-tier marketing truth, acceptance-criterion coverage, and whether any supposed reversible
    choice is actually a product/security one-way door requiring Brian.

# Constraints and gate

- Reviewer is read-only: do not modify the target design, code, branch, host config, or tests.
- Do not rubber-stamp because unknowns are labeled; distinguish legitimate probe gates from missing
  architecture.
- Do not demand host-specific machinery where honest degradation satisfies the product contract.
- If the design passes, say explicitly that no blocking finding remains. If it fails, downstream
  planning is blocked until a generator repairs and the review is repeated.
- Persist a phase-result Context Note, update this Task outcome/status, and do not run `aslite sync`.

[depends on](compaction-checkpoint-design-v1.md)
