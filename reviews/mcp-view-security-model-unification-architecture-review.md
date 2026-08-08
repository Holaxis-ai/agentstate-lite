---
type: Review
title: Architecture review — MCP and web View security-model unification
status: final
role: synthesis
verdict: changes_required
verdict_subject: exact MCP and web View security-model design revision
family: mcp-view-security-model-unification
target: designs/mcp-view-security-model-unification
target_version: 'sha256:2a97e67d1e95c18fadd97e288f1700b545d7b44bf591a35b606a7fac7455c343'
evidence_cutoff: '2026-07-27T00:01:52.361Z'
template_version: '1.1'
owner: agentstate-lite maintainers
actor: review-migration-builder
timestamp: '2026-08-08T15:07:36.111Z'
---
# Decision card

- **Record:** canonical synthesis wrapper for the frozen MCP/web View security-model `Design Review`; final under architecture-review template v1.1.
- **Primary target:** `designs/mcp-view-security-model-unification` at historical digest `sha256:2a97e67d1e95c18fadd97e288f1700b545d7b44bf591a35b606a7fac7455c343`.
- **Projected verdict:** **changes required** for that exact design revision. The source verdict `approve_with_required_changes` contains mandatory pre-implementation conditions, so v1.1 maps it to the blocking category `changes_required`.
- **Verdict subject:** the exact design revision reviewed by the frozen legacy Design Review, not later revisions or implementation state.
- **Disclosure:** this wrapper intentionally does not restate security findings or private-lane mechanics. Read the disclosure-screened source under repository policy.

# Deterministic projection contract

The sole verdict authority for this wrapper is `reviews/mcp-view-security-model-unification` at `sha256:2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de`. Its exact target identity, verdict, blocking status, limitations, and disclosure boundary prevail. The wrapper supplies only a `type: Review` discovery root and the v1.1 categorical mapping above; it does not approve a later design, implementation, merge, or release.

If the exact source is missing, conflicts with the fields above, or cannot be mapped without substantive judgment, this wrapper's outcome is `incomplete` and a newly reviewed synthesis is required.

# Provenance

| Evidence line | Exact identity | Supports | Version class |
| --- | --- | --- | --- |
| Frozen verdict source | `reviews/mcp-view-security-model-unification` at `sha256:2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de` | Original exact-design verdict and disclosure boundary | Frozen current bytes |
| Reviewed target | `designs/mcp-view-security-model-unification` at `sha256:2a97e67d1e95c18fadd97e288f1700b545d7b44bf591a35b606a7fac7455c343` | Exact historical design bytes named by the source | Historical digest citation |

[legacy verdict source](mcp-view-security-model-unification.md)
