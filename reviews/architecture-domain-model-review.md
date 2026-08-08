---
type: Review
title: Architecture review — stable domain model and bundle state
status: final
role: synthesis
verdict: approved
verdict_subject: later named-human Review Request outcome after remediation
family: architecture-domain-model-review
target: review-requests/kinds-and-descriptions-architecture
target_version: 'sha256:85d1aaf3967a4ded3492dc4a4f842ec572b9cc9c44b0e6a5122f00827e5df794'
evidence_cutoff: '2026-08-03T18:52:04.913Z'
template_version: '1.1'
owner: agentstate-lite maintainers
actor: review-migration-builder
timestamp: '2026-08-08T15:07:40.456Z'
---
# Decision card

- **Record:** canonical chronology wrapper for the stable-domain-model architecture review; final under architecture-review template v1.1.
- **Primary target:** the Kinds, relationships, and self-describing domain-model architecture across the initial technical review and the later named-human Review Request outcome.
- **Projected verdict:** **approved** for the later human Review Request subject after its recorded remediation, while the earlier exact technical target remains **changes required**. This wrapper reports those two source strata; it does not issue or impersonate the human approval.
- **Verdict subject:** the later named-human decision recorded in `review-requests/kinds-and-descriptions-architecture`; the initial technical verdict applies only to its earlier revision line.
- **Target-version limit:** the initial source names `c92497a` with link behavior rechecked at `69a0627`; the later approved Review Request does not declare one exact source commit, so none is invented here.

# Deterministic projection and precedence contract

For the initial technical stratum, `context-notes/architecture-domain-model-review-2026-07-13` at `sha256:ef7677811db36ed1b3faf26a6f1f6b5d6c61668feece468262fad99be04083bf` is authoritative and its `changes_requested` conclusion maps to v1.1 `changes_required` because the recorded repairs blocked approval.

For the later named-human stratum, the current frontmatter fields `status`, `decision_summary`, and `decided_at` in `review-requests/kinds-and-descriptions-architecture` at `sha256:85d1aaf3967a4ded3492dc4a4f842ec572b9cc9c44b0e6a5122f00827e5df794` are the workflow authority. They record Brian Derfer's later approval after remediation. The request body's earlier `changes_requested` response remains historical evidence for the preceding stratum; it does not override the later lifecycle fields.

The wrapper does not independently validate either target. Exact source bytes prevail. If those precedence rules cease to distinguish the strata, the later frontmatter no longer records approval, or another source conflicts on the same target/evidence line, the wrapper outcome becomes `incomplete` and requires a newly reviewed synthesis.

# Chronology and provenance

| Stratum | Exact source | Target/version | Source outcome | Wrapper mapping | Version class |
| --- | --- | --- | --- | --- | --- |
| Initial technical review | `context-notes/architecture-domain-model-review-2026-07-13` at `sha256:ef7677811db36ed1b3faf26a6f1f6b5d6c61668feece468262fad99be04083bf` | `main` at `c92497a`; link behavior rechecked at `69a0627` | `changes_requested` | `changes_required` for the initial exact target | Frozen current bytes |
| Later human decision | `review-requests/kinds-and-descriptions-architecture` at `sha256:85d1aaf3967a4ded3492dc4a4f842ec572b9cc9c44b0e6a5122f00827e5df794` | Later remediated `main`; exact commit not declared | `approved` in current workflow frontmatter and decision summary | `approved` for the named-human request subject | Mutable current head observed at publication |

[initial technical review](../context-notes/architecture-domain-model-review-2026-07-13.md)

[later human Review Request](../review-requests/kinds-and-descriptions-architecture.md)
