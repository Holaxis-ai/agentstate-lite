---
type: Review
title: Architecture review — architectural-smell investigation
status: final
role: synthesis
verdict: changes_recommended
verdict_subject: 'PR #224 remediation recommendations after focused investigation'
family: architectural-smell-investigation
target: 'PR #224 ARCHITECTURE-SMELLS.md recommendations'
target_version: 76ed593695d9f712b09e2734c50fa3117097b336
evidence_cutoff: '2026-08-08T13:53:29.416Z'
template_version: '1.1'
owner: agentstate-lite maintainers
actor: review-migration-builder
timestamp: '2026-08-08T15:07:31.808Z'
---
# Decision card

- **Record:** canonical synthesis wrapper for the architectural-smell investigation; final under architecture-review template v1.1.
- **Primary target:** the remediation recommendations in PR #224's `ARCHITECTURE-SMELLS.md`, with later focused current-main investigations kept as a separate evidence stratum.
- **Projected verdict:** **changes recommended** for the named remediation recommendations: exactly two existing narrow work units are supported; one claim remains observe/defer and one is closed as standalone work. This is a categorical projection of the frozen synthesis Finding, not a new assessment of the codebase.
- **Verdict subject:** whether PR #224's quantitative recommendations justify remediation after the four focused investigations.
- **Disclosure:** public provenance and outcome categories only. Substantive reasoning remains in the exact source records.

# Deterministic projection contract

The overall decision authority is `findings/architectural-smell-investigation-synthesis` at `sha256:7e0b3274aee6cca333c7ff640c75969586e0f32e2069114b1eb74b6d4e767cce`. Each atomic Finding's exact bytes govern its individual claim and disposition. The two linked Task records govern only their mutable work lifecycle; neither creates or changes a review verdict.

`Create a task now` maps to the wrapper category `changes_recommended`; `retain as an observation` and `invalidate/close as standalone work` remain non-task dispositions and are not mapped to approval. Source bytes prevail over this projection. Any source disagreement, missing exact source, or mapping that requires new causal judgment makes this wrapper `incomplete` and requires a newly reviewed synthesis.

# Multi-revision provenance

| Evidence line | Exact identity | Supports | Version class |
| --- | --- | --- | --- |
| PR #224 report | PR head `76ed593695d9f712b09e2734c50fa3117097b336`; Git blob `cb86ca5e9ac69f2108bb90d0b919ccd4b67a9905`; file SHA-256 `caa0293596d881283d757ca760ada3d482dd675eb711cac51975ca6d0cd67b5d` | Original quantitative recommendations | Historical external provenance |
| Survey target | `main` at `31921ce157260c5b7245375503059bdd2c4a3bfe` | Revision measured by PR #224 | Historical source revision |
| Focused investigations | `main` at `5806ece2c393f1c277f4a17a9006c1ba75eca86b` | Four current-main claim dispositions | Historical source revision plus frozen bundle Findings |
| Family synthesis | `findings/architectural-smell-investigation-synthesis` at `sha256:7e0b3274aee6cca333c7ff640c75969586e0f32e2069114b1eb74b6d4e767cce` | Overall reduction and work identity | Frozen current bytes |

Public source: [PR #224 — architecture smell report](https://github.com/Holaxis-ai/agentstate-lite/pull/224).

# Findings and work identity

| Source | Exact version | Projected disposition |
| --- | --- | --- |
| `findings/registered-view-launch-authority-investigation` | `sha256:eaa332484a88dfdbdbae293c772800e72beaa7b2e6b7fa4865f462fbdd1d17fd` | Existing work unit supported |
| `findings/core-import-direction-gate-investigation` | `sha256:82d862a7e3f38f62386ee096bccf6caf608c3a4cf93c7d5ebd53517628bb8c62` | Existing work unit supported |
| `findings/core-server-test-dependency-investigation` | `sha256:dbd63f65c666ced47e3fdcfbdd01206605c99f4149368b678496746bb321376f` | Observe/defer; no task |
| `findings/cli-type-only-cycles-investigation` | `sha256:c84b9eb2157cf79771830802265b06b5f35782559c5b1991074318728d41c019` | Closed as standalone work; no task |

This wrapper creates no Finding and no remediation Task. The promoted remediation identity is exactly:

- `tasks/registered-view-launch-authority-consolidation` — mutable current head observed at publication as `sha256:b27d7d5c9f8f74418a400593104ee01881e0ab440552cba1135ee0f3f98abbce`;
- `tasks/core-import-direction-gate` — mutable current head observed at publication as `sha256:32e05881c15eb4662404d6c1859d56f7c0f7dff3eeaf307836a9a3caaf9553d0`.

[source synthesis](../findings/architectural-smell-investigation-synthesis.md)

[has finding](../findings/registered-view-launch-authority-investigation.md)

[has finding](../findings/core-import-direction-gate-investigation.md)

[has finding](../findings/core-server-test-dependency-investigation.md)

[has finding](../findings/cli-type-only-cycles-investigation.md)

[supported by context](../context-notes/architectural-smell-audit-handoff.md)

[adjudicates claim](../claims/architectural-smell-report-remediation.md)

[produces task](../tasks/registered-view-launch-authority-consolidation.md)

[produces task](../tasks/core-import-direction-gate.md)
