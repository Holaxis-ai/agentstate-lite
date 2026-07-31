---
type: Context Note
title: 'Final review orientation: source transaction at 3579b98'
actor: openai/reviewer
timestamp: '2026-07-31T22:57:49.222Z'
---
# Summary

Exact SHA `3579b987e9f893b7b5cc4f3d9f83880e29fe19cb` supersedes rejected `a71866b`. The current review boundary includes the cumulative I1 implementation plus corrections for ordered help adjacency, EOF whitespace, and the marketplace generator's source-dirty feedback loop.

The Task progress predates the completed approval and adversarial QA of `723ea52`; the latest exact-SHA review and marketplace system-model notes are the current evidence.

## Goals

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and distribution artifacts are truthfully and reproducibly identifiable.

Proximate goal: independently establish that the complete branch at `3579b98` preserves the approved I1 behavior while making marketplace regeneration a deterministic transaction over one explicit source-fact snapshot. This serves the ultimate goal by preventing generated outputs from changing their own provenance input mid-run.

## Review model

- A generation attempt samples `currentSourceFacts` before any writer runs.
- The identical snapshot flows through `run -> regenerateArtifacts -> buildPluginBundle -> buildCliBundle`.
- A real two-pass convergence proof reuses one explicit snapshot; the second pass must be byte-stable and must not bump manifests.
- The standalone checker samples before preparation writes and supplies the snapshot explicitly.
- Dirty evidence remains honest: an initially dirty checkout yields `dirty:true`; generated outputs do not retroactively alter the transaction input.
- The GitHub Actions bot actor guard remains load-bearing because the artifact built from source commit H is committed by a distinct bot commit B.
- Ordinary PRs still neither rebuild nor hand-bump bot-owned marketplace artifacts.

## Review scope

Review the complete `origin/main...3579b98` diff and isolate the changes since `a71866b`. Verify the two prior findings, snapshot ordering and propagation, deterministic dirty-true proof, actor-guard semantics, and unchanged PR ownership policy. Run proportionate build, typecheck, focused CLI/script tests, package proof, and Git whitespace checks in a clean detached worktree. Do not edit code.

## References

- [[tasks/version-build-identity]]
- [[plans/version-string-channel-identity]]
- [[context-notes/version-build-identity-code-review-723ea52]]
- [[context-notes/version-build-identity-qa-723ea52]]
- [[context-notes/version-build-identity-final-code-review-a71866b]]
- [[context-notes/version-build-identity-marketplace-regeneration-system-model]]
- [[context-notes/version-build-identity-marketplace-regeneration-loop-a71866b]]
