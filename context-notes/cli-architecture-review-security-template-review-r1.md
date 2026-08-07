---
type: Context Note
title: Security review R1 — reusable architecture review template
actor: security-reviewer
timestamp: '2026-08-07T14:10:42.307Z'
---
# Summary

Verdict: **REVISE** for template `reviews/architecture-review-template` at `sha256:99ca713faaa4439830c548d83c37dcd2c07d44ca9bd82d8b9e377c50b3bc226c` and domain model `research/architecture-review-domain-model` at `sha256:78016770fdd8fd481de46a8dd121de3859e981e3207f7033514a80dc90b0eeb4`.

The exact draft contains the mandatory security domains, threat-boundary-sink inventory, evidence ladder, safe-probe constraints, artifact identity, shared-surface agreement rule, severity/confidence separation, and pre-write private-disclosure gate. Approval is withheld because four reuse defects could let a third party produce an apparently complete review without complete material security coverage or apply key security concepts inconsistently. No packages/cli review or findings were performed.

# Blocking issues

## SEC-TPL-R1-01 — Unassessed or sampled material security risk does not constrain the target verdict

- Severity: high
- Location: template §§2, 3, 5.2, 6.4, and 9; domain-model Reuse profiles.
- Problem: modules may be `sampled` or `not assessed`, and the stopping rule requires only that each applicable risk have a disposition. Because `not assessed` itself is a disposition, the exact text does not require an `incomplete` verdict or prohibit approval when a material/high-risk security boundary remains unassessed. `sampled` has no required population, selection method, or residual-risk record. A frozen/non-goal surface could also be treated as N/A even if it remains shipped or reachable.
- Required change: define verdict consequences. Any applicable material security obligation marked `not assessed` must force `incomplete` and block an approved target verdict. `sampled` must record population, selection method, representativeness, and residual risk, and must not substitute for end-to-end review of high-risk authorization, credential, destructive-write, process, or network authorities without explicit justified acceptance. N/A must mean the obligation is unreachable or genuinely absent under the recorded supported threat/deployment model; frozen investment or no-auth-by-design may affect recommendation priority but cannot alone erase reachable risk.

## SEC-TPL-R1-02 — The security matrix has no explicit coverage-closure rule

- Severity: high
- Location: template §§4.2, 6.4, and 7.
- Problem: the draft requires inventories and an entrypoint matrix, but does not say that every externally influenced source and every reachable privileged sink must be represented, nor how alternate/shared public paths close coverage. A reviewer could choose a few representative rows and still satisfy the literal matrix requirement.
- Required change: require a bounded universe of externally influenced entrypoints/sources, privileged or irreversible sinks, actors/capabilities, and supported trust/deployment states. Every source-to-reachable-sink path must be represented or grouped under a justified equivalence class, with `reviewed`, N/A with rationale, or `not assessed` with blocker/residual risk. Require alternate public adapters to be enumerated and either traced individually or tied to one owning authority plus agreement evidence.

## SEC-TPL-R1-03 — Severity labels are separated from confidence but lack reusable classification anchors

- Severity: medium
- Location: template §5.4.
- Problem: the exact text lists critical/high/medium/low/informational and contributing factors, but does not define level thresholds. Different third-party reviewers can assign incompatible ratings while all following the template. Section 9 says severity is frozen, but what would be frozen is only a label list.
- Required change: add concise anchors. Critical covers low-complexity broad catastrophic compromise; high covers substantial unauthorized access/boundary escape/credential or destructive integrity loss under feasible conditions; medium covers meaningful bounded impact, material prerequisites/interaction, unsafe defaults, or reliable supported-mode DoS; low covers limited concrete impact or defense-in-depth weakness; informational covers hardening without demonstrated security impact. Retain the rule that confidence and priority never lower severity.

## SEC-TPL-R1-04 — The domain model omits the security terms that the template depends on

- Severity: medium
- Location: domain model Terms versus template §6.4.
- Problem: the domain model claims to provide one vocabulary, but does not define asset, actor/principal, attacker capability, trust assumption, trust boundary, entrypoint/source, privileged sink, authentication, authorization, or security invariant. It defines only generic Boundary and Operation. Third parties can therefore build materially different threat models while using the same nominal template.
- Required change: add the missing security terms with review tests. At minimum distinguish generic boundaries from trust boundaries, actors from authenticated principals, actor capabilities/preconditions from identity, entrypoints from arbitrary public surfaces, and privileged sinks from ordinary operations. Define security invariant as an invariant protecting an asset against a specified actor/capability across supported states and failures.

# Nonblocking issues

## SEC-TPL-R1-05 — Evidence modes overlap

- Severity: low
- Location: template §5.1.
- Problem: `reasoned` and `static` are both offered without defining whether static is a subtype of reasoned or a separate provenance mode.
- Required change: optionally define `static` as a reasoned source/artifact trace, or collapse it into `reasoned`, so reviewers do not use inconsistent labels. Evidence grades already carry the important assurance distinction.

## SEC-TPL-R1-06 — Generic disclosure predicate uses ambiguous slash wording

- Severity: low
- Location: template §2.
- Problem: `released/main revision` can mean intersection or union outside this repository.
- Required change: prefer `present on a publicly released revision, including main when main is the release channel`, while allowing a project-specific stricter policy. The gate itself is correctly placed before public persistence.

# Survived checks

- Exact head versions matched the requested hashes.
- Decision card and target freeze require exact SHA/version, clean-state provenance, runtime/toolchain, generated inputs, and built/distributed artifact identity; changed bytes invalidate or historical-label evidence.
- Security §6.4 contains all mandatory domains: validation/canonicalization, filesystem/path, process, network, credentials, authentication/authorization, TOCTOU/concurrency, unsafe defaults, resource exhaustion, supply chain/distribution, and disclosure.
- Asset/actor/trust-boundary/privileged-sink/invariant inventory and source-to-side-effect trace are required.
- E0-E3 grades, E1 publication minimum, high/critical safe-E2 expectation, controls, limitations, and revision binding are explicit.
- Severity, confidence, and action priority are independent; severity may not be lowered due to confidence.
- Disposable scratch state, synthetic credentials, positive/negative controls, and prohibition on production/third-party targets are explicit.
- Shared contracts require one owning authority plus every irreducible public projection; capability/surface and security matrices reinforce this.
- Survived attacks and refutations preserve exact scope, controls, counterevidence, and residual limits.
- Disclosure triage occurs before public persistence and routes technical detail privately.
- The updated plan repeats the exact-version reviewer gate, target freeze, E1/E2 QA floor, and pre-write disclosure gate.

# Phase boundary

No source, test, git, network, or sync action was taken. No actual package finding was generated. The security task remains in progress pending a revised exact template and version-specific re-review.
