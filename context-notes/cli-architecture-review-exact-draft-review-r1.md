---
type: Context Note
title: CLI architecture review exact-draft reviewer gate r1
actor: codex-architecture-skeptic
timestamp: '2026-08-07T14:54:27.390Z'
---
# Summary

**CHANGES_REQUIRED** for exact draft `reviews/cli-package-architecture-review` version `sha256:0fbf9daff0d284099390447b07aea542b73c1c6dea2c35de4b9e1f5239efc664`.

The draft is substantively strong: its target/artifact/environment identity is honest, its `Incomplete; changes required` verdict matches the unresolved private and dependency-advisory boundaries, its create-only and arity severities are proportionate, its E2 claim is correctly limited to the reproduced `init` path, its observations are generally not inflated into defects, its `serve` refutation is properly scoped, and its action plan names the correct owners.

Five exact blockers remain before reviewer approval: the disclosure markers are not preserved verbatim; template applicability and cross-cutting-artifact dispositions are incomplete; material specialist dissent is omitted; CLI-ARCH-01A does not select one overall confidence/status rationale; and mutable provenance links are not bound to exact input versions. These are report-integrity issues only. This reviewer did not edit the report or product source.

# Review identity

- Exact draft reviewed: `reviews/cli-package-architecture-review` at `sha256:0fbf9daff0d284099390447b07aea542b73c1c6dea2c35de4b9e1f5239efc664`.
- Template: `reviews/architecture-review-template` v1.0 at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- Skeptic cross-review: `sha256:b87dac9c69d0dd613c083f1b9de00f059987147335f236ef1eee5f5fdb191bbe`.
- Security cross-review: `sha256:47cd166a7a40789698885e4d5d9abb999e1ba7710bd5ed964a230edb77974ae2`.
- Testing cross-review: `sha256:9694f58e303a6d350cc98477da81ba625e4b21e132b506e5e8fb32cf5c524c59`.
- Method: exact-document inspection and cross-review comparison only, using the project bundle. No report edit, tests, build, runtime probe, network operation, product-source inspection, or Git mutation.

# Exact blockers

## BLOCKER-01 — Disclosure routing markers are textually altered

The draft says it records “only these approved routing markers,” but it normalizes all four and changes the specifically frozen destructive marker from `PRIVATE_ROUTE_REQUIRED: destructive remote retry/version binding invariant` to a bullet with `PRIVATE_ROUTE_REQUIRED` separated from its text and `version-binding` hyphenated. The earlier review instruction and skeptic record require exact preservation, not semantic approximation. The first three markers also drop already-approved public qualifier text and affected-file scope from the verbatim skeptic record.

Required correction: replace the draft marker block with the exact approved public-safe marker block, without adding any trigger, interleaving, reproduction, exploit, bypass, or remediation mechanics:

- `PRIVATE_ROUTE_REQUIRED`: physical filesystem containment across filesystem-backed bundle operations — affected files: `packages/core/src/backend.ts`, `packages/core/src/filesystem-lock.ts`, and CLI/server adapters that consume that backend.
- `PRIVATE_ROUTE_REQUIRED`: confidential remote-credential transport policy — affected files: `packages/cli/src/config.ts`, `packages/cli/src/bundle.ts`, `packages/cli/src/commands/ui.ts`, `packages/core/src/remote-backend.ts`, `packages/ui-server/src/proxy.ts`.
- `PRIVATE_ROUTE_REQUIRED`: bounded remote/server resource handling — affected files: `packages/core/src/remote-backend.ts`, `packages/server/src/serve.ts`, `packages/server/src/router.ts`.

`PRIVATE_ROUTE_REQUIRED: destructive remote retry/version binding invariant`

No private merits or technical details should be added. This blocker is about stable routing identity and disclosure discipline.

## BLOCKER-02 — Applicability and stopping-rule coverage are implicit rather than dispositioned

Template sections 3 and 7 require every review module and every cross-cutting artifact to be marked `required`, `sampled`, `not applicable` with rationale, or `not assessed` with blocker/residual risk. The decision card names applicable profiles, and the body covers much of the work, but the draft does not enumerate all ten modules or all cross-cutting artifacts with those dispositions. Therefore a reader cannot verify the stopping rule from the report itself.

Required correction: add one compact applicability/coverage table covering:

- purpose/scope;
- design/SOLID/domain authority;
- API/compatibility/error contracts;
- security/trust boundaries;
- reliability/recovery;
- tests/testability;
- performance/resources;
- operability/observability;
- build/dependencies/distribution/portability;
- maintainability/docs/dead code/simplification;
- capability/authority trace;
- security entrypoint/privileged-sink matrix;
- requirement-risk-test matrix;
- mutation/failure timeline;
- representative change traces;
- dependency/authority map;
- negative-claim audit;
- survived attacks/refutations/limitations/dissent.

Each row may link an exact-version evidence record rather than repeat it. Security artifacts may be marked assessed in the private lane with a redacted public summary; no private matrix details belong here. Reachable browser accessibility/semantic behavior should be `not assessed` with residual risk rather than merely “outside” if it remains an applicable UI concern. Truly absent hosted/public deployment behavior may be `not applicable` only with the one-sentence absence rationale the template requires.

The current `Incomplete` verdict is honest but does not itself satisfy this inventory obligation.

## BLOCKER-03 — Material minority positions are missing from dissent

The draft records the security-versus-skeptic disagreement about separate CLI-ARCH-01A/01B IDs, but omits two material positions from the exact testing cross-review and one status difference from the skeptic cross-review:

1. Testing proposed one grouped create-only finding containing DR-01, SEC-BRANCH-01, and SEC-BRANCH-02 as distinct subclaims/oracles. Security required DR-01 and SEC-BRANCH-01 to remain separate IDs. The final synthesis may choose the security structure, but it must record testing's grouping position and why the selected structure better satisfies the template's owner/invariant/mechanism rule.
2. Testing proposed TST-CLI-03 as a Low/Planned final feedback-infrastructure finding. The draft demotes it to OBS-05 without recording that dissent. The synthesis may retain the demotion, but must state that the testing reviewer preferred a finding and why absence of a durable branch artifact is treated as infrastructure observation rather than a demonstrated defect.
3. The skeptic record treated the create-only family as a candidate pending deterministic fault validation with Medium overall confidence; security treated both static mechanisms as confirmed E1 findings. The draft adopts `confirmed` without identifying this status disagreement or the rationale for choosing the security disposition.

Required correction: extend `Scope limits and dissent` with these exact positions and a short synthesis rationale. Do not add more findings solely to eliminate disagreement; preserve the disagreement honestly.

## BLOCKER-04 — CLI-ARCH-01A lacks one overall confidence label

The line `Medium / High that the mechanism exists, Medium practical frequency / Now` correctly separates mechanism certainty from incidence, but it does not choose one of the template's required overall confidence values. This makes the decision card and finding comparison ambiguous, especially because the skeptic cross-review recommended Medium overall and security used split confidence wording.

Required correction: select one overall confidence label and then retain the component rationale. A template-consistent form would be `Medium overall (High confidence in the static mechanism; Medium confidence in reachable occurrence and externally observable consequence)`. If the final author instead selects High, the report must explain why the unprobed target-replacement/fault outcome is not a material unknown. Keep severity Medium and evidence E1 independent of that choice.

Also explain the `confirmed` status selection under BLOCKER-03; E1 is sufficient for publication, but status drift between reviewers must not be silent.

## BLOCKER-05 — Provenance links do not bind mutable evidence inputs to exact versions

The report binds the template, source revision, and artifact, but its provenance section links mutable bundle document IDs without recording the exact versions actually synthesized. A later note update would make the report's evidence chain ambiguous.

Required correction: add an exact-version provenance table for, at minimum:

- target freeze;
- empirical evidence;
- security, testing, and design/reliability findings;
- security, testing, and skeptic cross-reviews;
- template approval;
- the review task or plan if its state is relied upon.

The report may retain human-readable links beside the hashes. Evidence cutoff alone is not a substitute for immutable input identity.

# Approved aspects

- **Decision card honesty:** exact target, base, clean artifact identity, environment, evidence cutoff, draft status, `Incomplete; changes required` verdict, and highest-leverage actions are visible within the promised scan time.
- **Finding ownership:** create-only remediation is assigned to one lifecycle authority; arity remediation is assigned to shared grammar metadata, not scattered handlers.
- **Consolidation:** two create-only IDs share one remediation program without erasing the two security-recognized causal mechanisms. This is acceptable once omitted dissent is restored.
- **Severity and priority:** Medium/Now for non-released create-only integrity, Medium/Next for arity, and Low/Planned or observation status for feedback/resource hypotheses are proportionate.
- **Evidence precision:** `init` alone is E2; the remainder of the arity class stays E1. The full gate and coverage are bounded to exercised behavior. The `serve` signal result is correctly a scoped survived probe.
- **Observation discipline:** DR-03, DR-04, DR-05, TST-CLI-01, TST-CLI-03, and TST-CLI-04 are not overstated as product defects in the chosen synthesis.
- **Negative claims:** runtime-cycle and dead-module statements name their bounded graph/module scope and avoid symbol-level overclaiming. Historical flakes remain historical.
- **Action proportionality:** the draft prioritizes deterministic create-only fault validation, then centralized arity, while leaving catalog scale, property testing, and feedback refinements planned or conditional.
- **Disclosure verdict:** the draft does not claim security/release completeness and does not authorize merge, release, or public disclosure.

# Non-blocking precision suggestions

- Add the skeptic caveat that “no reverse source import found” does not exclude semantic duplication or non-import coupling; current wording is already source-import-scoped, so this is not a blocker.
- In the assurance summary, distinguish machine-enforced gates that run on every relevant change from exact local E2 execution; avoid implying every configured runtime lane ran in this review.
- If “three public findings” remains in the decision card, immediately clarify that they represent two remediation families, as the body already does.

# Result Envelope

- Status: `CHANGES_REQUIRED`
- Exact draft: `sha256:0fbf9daff0d284099390447b07aea542b73c1c6dea2c35de4b9e1f5239efc664`
- Blocking findings: `BLOCKER-01` through `BLOCKER-05`
- Report edited: no
- Product/source/test changes: none
- Private technical detail added: none
- Required next action: orchestrator issues a new exact report version correcting the five blockers, then requests exact-version reviewer acceptance before QA
- Task disposition: remain `in_progress`
