---
type: Context Note
title: 'Design review: PR 183 review-fix plan'
actor: openai/plan-reviewer
timestamp: '2026-07-31T23:50:58.546Z'
---
# Summary

Independent design review of the PR #183 review-fix plan. The plan is approved with no blocker or major finding; one non-blocking test-strengthening note is recorded below.

# Verdict

**APPROVED** for implementation at plan revision `sha256:cba74187ae03899235aedd6733b3231359d51333a41e5a47fcce01e6224a5283`, against PR #183 SHA `d5d2f3f2dd37472f612e5b287f449a1c0b942285` and reorientation `sha256:a12d3bd03240dc33bd80a2839e26cf68b5dc2ef5398c40c0f349856a78bedcea`.

No blocker or major finding remains. The plan is implementation-ready.

# Review findings

- F2/F3/F4: the shared comparator is narrowly scoped to exactly one esbuild-emitted identity assignment and normalizes only `source.commit`/`source.dirty`. Package, version, channel, compatibility contracts, and all executable code remain byte-significant. Duplicate or marker-present malformed assignments fail closed; markerless legacy bytes remain raw, so the first identity-bearing migration is visible. Restoring the pre-run bundle after a raw-only provenance change removes workflow-visible churn. A real content change is retained and bumps once; a retrigger at the bot commit's different SHA normalizes equal, restores, and exits clean, so convergence no longer depends on actor identity.
- F1: explicit `--local` and `--release` verifier modes preserve honest separation. The developer gate packages a `local-dev` artifact that may carry dirty or unknown source facts; `prepublishOnly` remains strict `npm-package` and refuses dirty/unknown provenance with cause and remedy. Missing/unknown mode fails usage rather than silently choosing publishability semantics.
- F5: `_npx` executable layout remains decisive, then managed-PATH/direct evidence outranks npm environment hints. The proposed adversarial cases cover the reported precedence defect without misclassifying a real `_npx` path.
- F6: name and version come from one validated package-manifest read at build time, while the generalized runtime parser/source fallback can retain a valid renamed package identity and still fail closed on malformed names.
- Dependencies are sound: A precedes B; C/D may proceed independently under one builder; cumulative exact-SHA Review approval is an explicit prerequisite for adversarial QA, and QA precedes the full gate/push.

# Non-blocking test strengthening

Make the focused F1 evidence assert the installed local artifact's source facts (`dirty: true` in the dirty-tree case and `commit/dirty: null` outside Git), not only its `local-dev` channel. Also ensure one positive exact-clean `--release` run executes the complete package proof; mode-selection plus dirty/unknown refusal tests alone would not prove the publish path still succeeds. These clarify existing acceptance criteria and do not require redesign.

# Goal status

The proximate review goal is complete: the plan closes PR #183's developer-gate, marketplace-convergence, launch-precedence, and manifest-authority findings while preserving exact runtime identity and the required Review-to-QA gate.
