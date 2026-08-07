---
type: Context Note
title: 'CLI architecture review: security cross-review'
actor: codex-security-reviewer
timestamp: '2026-08-07T14:48:04.434Z'
---
# Summary

Security cross-review completed against frozen source revision `81b3c39ff252013e318b1a714b63430a24074d70` and approved architecture-review template v1.0 `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`. The public candidate synthesis is approved with the adjudications below. The target review is not ready for an unqualified approval: private disclosure triage remains open, current dependency-advisory status is not assessed, and the exact final draft must preserve the evidence and redaction constraints in this note.

The proximate goal is to make the final CLI architecture report security-accurate and disclosure-safe; this serves the ultimate goal by keeping the local-first CLI's trust claims evidence-bound while directing fixes to the authorities that own the violated invariants.

# Evidence reviewed

- Approved template: `reviews/architecture-review-template` at `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- Target freeze: `context-notes/cli-architecture-review-target-freeze` at `sha256:fdd6953d0862663b70dbad7029c84b02c0d77023c7b058ce95bf77479926b33c`.
- Empirical evidence: `context-notes/cli-architecture-review-empirical-evidence` at `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca`.
- Testing findings: `context-notes/cli-architecture-review-testing-findings` at `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9`.
- Design/reliability findings: `context-notes/cli-architecture-review-design-reliability-findings` at `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5`.
- Security findings: `context-notes/cli-architecture-review-security-findings` at `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a`.

# Public finding adjudication

| ID | Security cross-review disposition | Evidence | Severity / confidence / priority | Correct owning layer |
| --- | --- | --- | --- | --- |
| `DR-01` | Approve as a distinct confirmed public finding. It concerns incomplete observation and unverified compensation in create-only post-commit isolation. | E1 static causal trace; the full exact-revision gate and strong ordinary race coverage are counterevidence, not a probe of the named fault windows. | Medium / High for mechanism, Medium for practical frequency / Now before feature-branch merge. | A dedicated create-only lifecycle owner that fails closed on incomplete observation, verifies compensation truthfully, and exposes deterministic fault seams. |
| `SEC-BRANCH-01` | Approve as a distinct confirmed public branch finding. Do **not** deduplicate with `DR-01`: the authority is related, but this finding concerns continuity of the claimed physical target identity across phases, a materially different invariant and mechanism. | E1 static trace; no exact-SHA target-replacement fault probe was recorded. | Medium / Medium / Now before feature-branch merge. | The same create-only lifecycle boundary, with stable target identity/ownership carried through commit, verification, and exact-state rollback. |
| `DR-02` | Approve as confirmed and reproduced. It is caller-intent/correctness risk, not a released cross-user security advisory on current evidence. | E2 exact-built-artifact reproduction: `init unexpected --dir <fresh target> --recipe none` exited 0 and created the bundle; cleanup was recorded. | Medium / High / Next. | One arity-aware command grammar/parser authority that rejects surplus input before side effects, plus exhaustive command-arity agreement tests. |
| `TST-CLI-01` | Retain as a distinct cancellation-contract concern, not a security advisory. Default Git operations carry remaining budgets, so the current evidence establishes a losing-operation/cancellation gap but not unbounded supported-path harm. | E1 static; full gate passed, but no probe observed abort, open-resource closure, process-exit time, or absence of late state effects. | Low / High for mechanism, Medium for user-visible harm / Next. | The session-start/pull lifecycle contract: propagate cancellation through the owning async boundary and test both foreground return and post-return finality. |
| `TST-CLI-02` | Narrow to an assurance gap. Do not state that signal shutdown is currently broken. The exact shipped `serve` path survived the available probe; `ui` and cross-platform paths remain untested at the public signal boundary. | E2 survived probe for built `serve` on Darwin/Node 25; E1 residual gap for built `ui` and other supported environments. | Low / High that the residual gap exists / Next. | Shared signal-lifecycle authority where practical, plus bounded built-artifact subprocess tests for each long-running command. |

`DR-01` and `SEC-BRANCH-01` may share one remediation program and phase-boundary test harness, but the final report must preserve both IDs, invariants, mechanisms, and residual risks. Template section 8 permits deduplication only when owner, violated invariant, and causal mechanism are materially the same; that test is not met here.

# Security overlap and boundaries

- `DR-01` and `SEC-BRANCH-01` protect state-integrity and filesystem-authority properties. They are public-safe at a defensive level because they apply to the unreleased reviewed branch, but the report should avoid procedural abuse instructions.
- `DR-02` protects preservation of caller intent before mutation or process orchestration. It is a meaningful correctness/operability issue; current evidence does not establish a cross-principal attack path.
- `TST-CLI-01` overlaps resource-finality and degraded-state truthfulness. Its default-path boundedness is material counterevidence and keeps the current severity Low pending an effect-level probe.
- `TST-CLI-02` overlaps lifecycle cleanup, not authentication or authorization. The survived `serve` probe must be recorded beside the residual gap.
- Loopback-only server/UI defaults, explicit reference-server exposure warning, exact Host/session checks, exact-byte View authorization with revalidation, argv-based subprocess execution, CAS/cross-process locks, and strict build/package gates remain strengths within their stated bounds.

# Private routing markers and mandatory redaction

The following public records must remain routing markers only. Advisory-threshold dispositions were sent directly to the orchestrator and are intentionally not repeated here:

- `PRIVATE_ROUTE_REQUIRED`: physical filesystem containment across filesystem-backed bundle operations — affected files may be named, but public prose must omit trigger conditions, causal trace, reproduction, and bypass detail.
- `PRIVATE_ROUTE_REQUIRED`: confidential remote-credential transport policy — omit transport preconditions, credential-observation paths, reproduction, and mitigation detail that reveals the path.
- `PRIVATE_ROUTE_REQUIRED`: destructive remote retry/version-binding invariant — preserve as a separate private item; do not collapse it into generic retry reliability or publish its mechanism.
- `PRIVATE_ROUTE_REQUIRED`: bounded remote/server resource handling — keep the mechanism and triggering conditions private pending any bounded private validation and re-triage.

The exact final report may say that private review items exist, name their invariant class and affected files at the already-published level, and state that private remediation/disclosure work is required. It must not contain payloads, exploit steps, precondition combinations, bypass recipes, or a public source-to-sink trace for these markers.

# Approval conditions and blockers

1. Approve `DR-01`, `SEC-BRANCH-01`, and `DR-02` for the public draft with the exact dispositions above.
2. Approve `TST-CLI-01` as a Low-severity cancellation-contract concern, not a demonstrated corruption or denial-of-service claim.
3. Approve `TST-CLI-02` only in narrowed form: a passed E2 `serve` probe plus an E1 residual `ui`/cross-platform test gap.
4. Block any deduplication of `DR-01` with `SEC-BRANCH-01`; cross-link them under one create-only lifecycle remediation program instead.
5. Block any claim that current dependency advisories are absent. `npm audit --offline` reported no cached advisory, but cache freshness is unknown and a live query was not authorized. The final verdict must preserve `not assessed` for current advisory status or obtain an authorized current result.
6. Block an unqualified security-complete/approved verdict until the orchestrator has privately dispositioned the routed items and the public draft has been checked for disclosure safety.
7. Keep the security task `in_progress` through exact-draft approval; this cross-review does not authorize public disclosure, merge, or remediation work.

# Residual validation requested

- Deterministic create-only phase-boundary fault tests for both `DR-01` and `SEC-BRANCH-01`, with no out-of-target effects and truthful cleanup outcomes.
- An exhaustive built-artifact arity table for `DR-02`, asserting usage failure and no side effect for surplus input.
- A controlled session-start probe that distinguishes foreground return from operation cancellation, process exit, resource release, and final state.
- A built `ui` signal probe and at least one CI-supported-platform lifecycle proof to close the residual part of `TST-CLI-02`.
- Private-only validation for routed security markers, using disposable state and synthetic credentials under the approved disclosure lane.

# Progress

Cross-review is complete and the public candidate set is conditionally approved. Remaining work is exact-draft review, private advisory handling, and resolution or explicit retention of the dependency-advisory assessment gap. The assigned security task therefore remains `in_progress`.

[reviews security findings](cli-architecture-review-security-findings.md)

[reviews testing findings](cli-architecture-review-testing-findings.md)

[reviews design findings](cli-architecture-review-design-reliability-findings.md)

[uses empirical evidence](cli-architecture-review-empirical-evidence.md)

[supports task](../tasks/cli-architecture-review-security.md)
