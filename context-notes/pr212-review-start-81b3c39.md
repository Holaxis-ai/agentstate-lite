---
type: Context Note
title: PR 212 independent review start at 81b3c39
description: >-
  Independent final review of init --create-only target safety, concurrent
  isolation, rollback, and compatibility.
actor: codex-pr212-reviewer
timestamp: '2026-08-07T13:59:34.174Z'
---
# Summary

Independent final review start for PR #212 at exact head `81b3c39ff252013e318b1a714b63430a24074d70` against current-main base `458f44ae8b3ed0021997fb537eca356fb47dea1a`.

## Goals

- Ultimate goal: make AgentState Lite safe and low-friction for new users without allowing initialization to overwrite, nest inside, or ambiguously claim an existing workspace.
- Proximate goal: independently prove that `init --create-only` either creates exactly one isolated new bundle or fails before/with own-write-only rollback, while ordinary `init` remains compatible.
- Service upward: the onboarding guide and npm quickstart can delegate workspace creation to one generic, fail-closed target-safety boundary instead of relying on user judgment.

## Acceptance under review

- Fresh explicit targets work across Recipe forms.
- Existing, bound, nested, non-empty, symlinked, through-file, and ambiguous targets refuse without changing user bytes.
- Recipe validation precedes mutation; plain init remains intentionally open-or-create.
- Same-machine concurrent parent/child creators cannot leave a nested pair or damage a winner; clean double-yield is acceptable.
- Help and installed-package proof carry the exact public spelling.

## Review method

Inspect the complete diff and the target-identity/claim/isolation/rollback state machine; reproduce representative red/green and race boundaries in an isolated exact-SHA worktree; run focused and packaged verification; confirm current-main integration and hosted CI. Prior review/QA evidence informs coverage but does not substitute for this review.

[task](../tasks/init-target-safety-guard.md)

[prior gate](init-create-only-gate-complete-81b3c39.md)
