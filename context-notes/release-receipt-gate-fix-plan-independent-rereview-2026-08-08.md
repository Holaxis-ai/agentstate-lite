---
type: Context Note
title: 'Independent rereview: P5A release-receipt-gate fix plan'
actor: openai/codex-review-receipt-plan
timestamp: '2026-08-08T16:55:26.036Z'
---
# Summary

Verdict: **APPROVE for Build**. The revised domain model and implementation plan fully close all five required corrections from the independent CHANGES-REQUIRED review. The security invariants are now expressed as executable acceptance criteria, file-level ownership, adversarial rows, and one load-bearing M1 red probe rather than being left to builder interpretation.

This is documentation-level Build authorization only. It does not approve future code: the implemented exact SHA must still pass focused tests, independent exact-SHA review, targeted adversarial QA, and the repository gate in the recorded order.

## Exact artifacts reviewed

- Domain model `context-notes/release-receipt-gate-domain-model-2026-08-08`: `sha256:f65e8fde04204716be49e04c15ecbf32b7f11794ef9447453fcafed52282303c`.
- Plan `plans/release-receipt-gate-fix-delta`: `sha256:e6d119d55a873931b2d66791b84313ba1e31ee4c4fbe018e3aa93e7239edfdc4`.
- Revision note `context-notes/release-receipt-gate-fix-plan-revision-2026-08-08`: `sha256:ad1a0feae71e7c93a516bafffb9c51ae1c6d2f5dce2f31cd88bda1f59ef18c42`.
- Original independent review `context-notes/release-receipt-gate-fix-plan-independent-review-2026-08-08`: `sha256:61747e47d5bc35084e484570a4d9270bcc2e92b4af7017d10ce93f3f79e8f278`.
- Code baseline consulted as needed: `feat/release-receipt-gate` at `4b905b3f`; current main integration target remains `56b5693d`.

## Prior required corrections — closure verdict

1. **Workflow-owned public body status — CLOSED.** Domain section `Workflow-owned release-body status` and plan criteria 13-14 define one delimited block, malformed/duplicate refusal, required-to-required replacement, required-to-none removal, unrelated-note preservation, post-PATCH re-query, and exact agreement before publish. Implementation and QA targets carry the same contract.
2. **Receipt/status byte-to-asset binding — CLOSED.** Plan criteria 8-11 require downloaded receipt local SHA-256 equality with GitHub metadata, exact persisted `{id,name,digest}` triples, generated status digest before upload, unique final status name/digest, newly observed final ID, and exact-set rejection for same-name replacement. The domain model states the same proof chain.
3. **Deterministic cleanup and dry-run separation — CLOSED.** Plan criteria 10, 17, and 18 require a `draft_release_id`-bound sorted/unique numeric-ID manifest, an ID-only live executor, retry behavior whose authority remains the final re-query, and an injected/stubbed transcript proving dry-run makes zero DELETE/upload/PATCH/publish calls.
4. **Per-state actor identity without reconciler fork — CLOSED.** Plan criterion 3 and the release-state target preserve public receipt input `actor`, namespace only the internal ledger key for all five actor-bearing states, retain same-state idempotence/conflict behavior, and require tests over every reachable branch.
5. **One classifier with phase-aware modes — CLOSED.** Plan criterion 6 and the domain `Asset grammar` section define one strict live-UUID parser with pre-stage residual-only and finalize current/sibling consumers. Synthetic dry-run tokens and malformed lookalikes never acquire auxiliary authority.

## Survived attacks

- Same receipt filename with a changed ID or digest remains red because final retention is proof-triple based, not name based.
- A forged/pre-existing current status cannot ride unchanged: it is removed when unnecessary or replaced and digest-bound when required.
- A validly named sibling containing arbitrary bytes may be tolerated only in the mutable draft phase; its exact ID is excluded before final proof and publication.
- Retry after a partially completed stamped run converges both machine and human evidence: status asset clobber plus owned-body replacement/removal prevent stale or duplicate claims.
- Split Brian/Mike roles no longer collide while signer allowlisting, signed actor/uploader equality, receipt timing, and same-state immutable replay remain intact.
- Dry-run shares classification/planning logic but has an empirically testable zero-mutation boundary.
- The M1 red probe is load-bearing: weakening final verification to names alone must make the suite fail.
- The plan retains the required Build -> independent Review -> targeted QA -> repository gate sequence; any implementation change after review loops back through review.

## Roadmap and takeover coherence

The repaired path is coherent in both graph and prose:

- `roadmap-items/distribution-neutral-resources` at `sha256:a59dfed4bacd505f1dcadf476b0db26dc664d64928091100c77a5131379c7f5d` contains P5A and continuous staging.
- P5A (`in_progress`, `sha256:dfaf7c0e5928fe7741123af8eafea00933352d48e808209650afa51ce0b26fce`) has the required inbound `contains`; P5B (`todo`, `sha256:c86bbfe25b5d420cf38d1a8711da4d2b95b1cfc7852018459f538cb5794f9d62`) explicitly depends on P5A.
- P5S (`todo`, `sha256:b9032b058ba72f017932768337331cb5c56a978b64e77e153ed164697d7d52ff`) depends on P5B.
- Continuous staging (`todo`, `sha256:7a1545b756703f7b07a9d023f335bc16d7beeb487168f2688400af43937bf697`) depends on P5S, links its ratified decision and implementation plan, and records its own high-risk Build/Review/QA gate plus human boundary.
- Consolidated `roadmap` at `sha256:f4677ccdaef9083ae2fcc460dd449668301ef17985815a2704cea9be9b1c2782` states the same P5A -> P5B -> P5S -> continuous-staging sequence. `aslite status` no longer lists P5A or continuous staging among Tasks missing inbound `contains`.

An unrelated link-lint row remains on the original Context Note's `reviews task` label because that label is conventionally typed for a Review Request. It predates this rereview, does not affect the repaired roadmap/task edges, and is not a Build blocker. This rereview uses neutral relationship labels to avoid adding another violation.

## Findings

No remaining plan blocker. The listed implementation assumptions are appropriately scoped builder checks, especially the fallback to download-and-hash the exact final status asset ID if GitHub omits digest metadata. They forbid weakening to name-only proof.

## Build authorization

Builder is authorized to integrate main `56b5693d` into the feature branch and implement the revised plan as one coherent code+test unit. Review approval does not travel forward automatically: freeze the resulting exact SHA, then execute independent review before targeted QA, followed by `npm run check` on that same approved SHA.

## Confidence

High (0.97). Each prior required correction is present in both the domain model and acceptance/implementation/test surfaces, and the takeover path was independently traversed through live bundle links and status output.

[rereviews](release-receipt-gate-fix-plan-independent-review-2026-08-08.md)

[assesses](../plans/release-receipt-gate-fix-delta.md)

[uses](release-receipt-gate-domain-model-2026-08-08.md)

[tracks](../tasks/p5a-pre-live-hardening.md)
