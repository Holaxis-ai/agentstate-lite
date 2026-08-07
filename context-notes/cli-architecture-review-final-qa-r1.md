---
type: Context Note
title: CLI architecture review final QA r1
description: Independent exact-version QA result for the frozen CLI architecture review.
actor: codex-testing-reviewer
timestamp: '2026-08-07T15:03:16.605Z'
---
# Summary

**FAIL** independent QA for frozen report `reviews/cli-package-architecture-review` version `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14`.

The report content passed every reviewed template, evidence, finding, disclosure, and status check. The single exact blocker is repository cleanliness: `git status --short` reports untracked `.tmp-cli-package-architecture-review.md`. The QA contract explicitly requires the source worktree to remain clean. This reviewer did not remove, edit, or otherwise alter that file or the frozen report.

Once the owner removes or relocates the scratch file and the exact report version remains unchanged, rerun the cleanliness check and this QA gate. No report-content correction is requested.

# QA identity

- Frozen report: `reviews/cli-package-architecture-review`.
- Exact report version: `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14`.
- Target revision: `81b3c39ff252013e318b1a714b63430a24074d70`.
- Template: `reviews/architecture-review-template` version `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`.
- QA actor: `codex-testing-reviewer`.
- Method: read-only exact-version bundle inspection plus read-only revision, artifact, and worktree checks. No tests, network access, source edits, report edits, Git mutations, or sync.

# Exact blocker

## QA-BLOCKER-01 — source worktree is not clean

Command:

`git status --short`

Observed:

`?? .tmp-cli-package-architecture-review.md`

Expected:

empty output.

Impact on QA: the report can remain frozen and its target source/artifact bytes still match, but the explicit cleanliness acceptance criterion is false at QA time. A PASS and task completion would therefore be untruthful.

Required resolution:

1. the owner removes or relocates the untracked scratch file without changing the frozen report;
2. verify `git status --short` is empty;
3. verify report head remains `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14`;
4. rerun final QA. No report edit is required.

# Checks that passed

## Report identity and provenance

- Report head exactly matches `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14`.
- Report actor is `codex-orchestrator`.
- Current HEAD exactly matches `81b3c39ff252013e318b1a714b63430a24074d70`.
- Artifact exists at `packages/cli/dist/agentstate-lite.mjs`, mode 755, size 4,559,755 bytes, SHA-256 `d9bac0f6f31278b90c8d3d8c1ea9aff9af33d1da5551f36378faffb856f1d583`.
- All twelve outbound report links resolve through the bundle.
- Every linked provenance version exactly matches the report table:
  - template `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`;
  - template approval `sha256:c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead`;
  - target freeze `sha256:fdd6953d0862663b70dbad7029c84b02c0d77023c7b058ce95bf77479926b33c`;
  - empirical evidence `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca`;
  - security findings `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a`;
  - testing findings `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9`;
  - design/reliability findings `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5`;
  - security cross-review `sha256:47cd166a7a40789698885e4d5d9abb999e1ba7710bd5ed964a230edb77974ae2`;
  - testing cross-review `sha256:9694f58e303a6d350cc98477da81ba625e4b21e132b506e5e8fb32cf5c524c59`;
  - skeptic cross-review `sha256:b87dac9c69d0dd613c083f1b9de00f059987147335f236ef1eee5f5fdb191bbe`;
  - plan `sha256:f4f5e6f11f044b17e9f060f5a45ad040b318fd18418a2daf36cd9355fcab198a`;
  - parent task `sha256:283b6d9990c85bf0b88d757a830a45bdb9e946ff164f29e25ddb592ab041ed77`.

## Applicability and cross-cutting completeness

The disposition table covers all ten template modules:

1. purpose and scope;
2. domain, cohesion, coupling, SOLID;
3. API, compatibility, errors;
4. security;
5. reliability and recovery;
6. tests and testability;
7. performance and resources;
8. operability and legibility;
9. build, dependencies, distribution, portability;
10. maintainability, documentation, dead code, simplification.

It also covers all required cross-cutting artifacts: capability/authority trace, security entrypoint/sink matrix, requirement-risk-test matrix, mutation/failure timeline, representative change traces, dependency/authority map, negative-claim audit, and survived attacks/refutations/limitations/dissent. Sampled, not-assessed, and not-applicable rows state their evidence boundary and residual risk. Applicable live advisory status remains explicitly not assessed, and the target verdict is correspondingly incomplete.

## Findings and remediation families

The report contains exactly three public finding IDs:

- `CLI-ARCH-01A`: incomplete observation and unverified compensation;
- `CLI-ARCH-01B`: physical target identity and ownership continuity;
- `CLI-ARCH-02`: command arity before side effects.

They map to two remediation families:

1. one create-only lifecycle owner for 01A and 01B, with distinct invariants, mechanisms, residuals, and validation oracles;
2. one shared arity-aware command grammar authority for 02.

This matches the final cross-review synthesis and preserves the explicit testing/security/skeptic dissent about grouping, feedback infrastructure, and E1 status terminology.

## Evidence grade and survived-probe boundaries

- E2 is limited precisely to the reproduced exact-artifact `init` arity case.
- The wider handler inventory remains E1.
- The exact built `serve` SIGTERM result is recorded as an E2 survived probe limited to Darwin/Node 25.
- The report does not generalize that survival to `ui`, other platforms, or future artifacts.
- The unresolved `ui --open` discrepancy remains a validation gap.
- Historical flakes remain historical and are not promoted.

## Validation quality

- CLI-ARCH-01A requires phase-specific injected observation and removal faults and asserts no success on incomplete observation and no false clean-rollback receipt.
- CLI-ARCH-01B requires target/state replacement and concurrent-content cases at every await boundary and asserts fail-closed behavior, no out-of-target effects, and exact-state cleanup.
- OBS-01 preserves the distinct scan resource oracle through bounded iterative traversal and deterministic deep/wide scratch testing.
- CLI-ARCH-02 requires an exhaustive public command/subcommand sentinel table with USAGE/exit 2, clean channels, and no side effect, plus built mutation, Git, listener, and read-only representatives.
- These oracles observe outcomes and post-failure state rather than only branch execution.

## Observations, dissent, refutations, and limits

The report preserves command-metadata debt, catalog scale, cancellation, recurring sensitivity feedback, and optional generative testing as observations rather than inflating the public finding set. It records the built serve survival, unresolved UI control, bounded negative claims, historical-flake disposition, portability limits, browser semantics gap, and external advisory limitation. It explicitly records specialist dissent on create-only grouping, feedback-infrastructure status, and confirmed-E1 terminology.

Coverage figures are contextual decision-map evidence, not a quality score or threshold.

## Disclosure markers and public safety

All four routing markers match the security-approved wording:

- physical filesystem containment;
- confidential remote-credential transport policy;
- bounded remote/server resource handling;
- destructive remote retry/version binding invariant.

The public report contains affected-file scope and invariant-class routing only. No private trigger combination, exploit path, source-to-sink trace, reproduction, payload, bypass procedure, private validation mechanics, or remediation detail was found.

## Verdict and status truthfulness

- `APPROVED BY REVIEWERS` truthfully describes the completed reviewer gate and does not claim independent QA approval.
- `Incomplete; changes required within the assessed scope` truthfully describes the target verdict.
- The report does not authorize disclosure, merge, remediation, or release.
- Independent QA is correctly delegated to this separate exact-version record.

# QA result

- Result: **FAIL**.
- Exact blockers: one, QA-BLOCKER-01.
- Report content blockers: none.
- Report edited: no.
- Source/test changes by QA: none.
- Testing task: remains `in_progress`.
- Required next action: restore a clean worktree without changing the frozen report, then rerun QA against the same exact report version.
