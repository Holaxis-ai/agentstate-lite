---
type: Review
title: Approval — reusable architecture review template v1.1
status: final
role: approval
verdict: approved
verdict_subject: template artifact
family: architecture-review-method-v1.1
target: reviews/architecture-review-template-v1.1
target_version: 'sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5'
evidence_cutoff: '2026-08-08T15:04:01.000Z'
template_version: '1.1'
owner: codex-orchestrator
actor: codex-orchestrator
timestamp: '2026-08-08T15:04:01.000Z'
---
# Decision card

- **Verdict subject:** the reusable template artifact, not any software target reviewed with it.
- **Exact template:** `reviews/architecture-review-template-v1.1` at `sha256:70ad04233c07b5cd5440339465849004b6bc96c2c02527a6ebf270fb28213ec5`.
- **Companion convention:** `conventions/review` at `sha256:583f7e7caa4e011d9de3f7ee1b27660256ec0022e0e12011ab7b05a8c63d19e5`.
- **Verdict:** approved for reuse.
- **Predecessor:** v1.0 remains frozen and approved at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`; this is a new artifact, not a rewrite.

# Review outcome

The first v1.1 draft was rejected by security/reliability, testing/portability, and design/skeptic reviewers. The exact repaired artifacts passed all three re-reviews. The approved method keeps the Kind minimal and open-world while placing architecture-specific discipline in the versioned template: explicit verdict subjects, classified successor-to-predecessor semantics, fail-closed ambiguity, deterministic wrapper projection, multi-target provenance, disclosure preflight, one review-authored coverage ledger, and portable scratch oracles.

The convention requires only `title`, declares optional open-valued fields, and has no enum, required heading, link vocabulary, inbound expectation, or runtime registry. Unknown and off-prefix Reviews remain valid/readable; adding new structured fields uses normal convention evolution or the byte channel rather than pretending kind-aware patching accepts undeclared names.

# Evidence

- [Security and reliability re-review](../context-notes/architecture-review-template-v1-1-security-review.md)
- [Testing and portability re-review](../context-notes/architecture-review-template-v1-1-testing-review.md)
- [Design and skeptic re-review](../context-notes/architecture-review-template-v1-1-design-skeptic-review.md)
- [Migration inventory](../research/architecture-review-artifact-inventory.md)
- [Approved alignment plan](../plans/architecture-review-record-alignment.md)
- [Review convention](../conventions/review.md)
- [Approved template v1.1](architecture-review-template-v1.1.md)
- [Frozen template v1.0](architecture-review-template.md)
- [v1.0 approval](architecture-review-template-approval.md)

# Approval boundary and residual QA

This approval covers the method and companion convention only. It does not approve any Review target or the later portfolio implementation. Exact-byte wrapper review and adversarial View/browser portability QA remain required. Any future v1.1 edit invalidates this approval and requires a new review record or version.
