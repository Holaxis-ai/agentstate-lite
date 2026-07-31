---
type: Context Note
title: 'D0 progress: version/update system model and review gate'
description: >-
  Current system model, decisions, assumptions, and independent-review status
  for the release/update contract.
actor: openai/codex
timestamp: '2026-07-31T20:51:09.325Z'
---
# Summary

## Goals

- **Ultimate goal:** Make agentstate-lite the reliable, local-first, user-owned shared memory for agents and humans: plain Markdown, safe concurrent writes, and git-based sharing.
- **Proximate goal:** Obtain independent approval of the release/update Decision and implementation Plan, reconcile ownership, then ship the first complete runtime-identity unit through Review and repository gates.
- **Link upward:** A truthful executable identity is the first enforceable layer of the supported npm upgrade contract users must be able to trust across sessions.

## Current system model

- `@holaxis/aslite@0.1.0-pre.2` is canonical and both npm dist-tags currently select it, but it predates any protected source tag/publish workflow.
- Runtime identity currently splits across baked CLI SemVer, adjacent package metadata, marketplace versioning, and MCP's unrelated fallback. A stale ignored local `dist` can make one process claim both `pre.1` and `pre.2`.
- Artifact source, runtime launch evidence, and mutable release track are distinct. Identical npm bytes cannot reliably prove global-versus-npx selection; the model now requires explicit unknown/confidence rather than path-based certainty.
- Hook ownership currently uses a substring match and can falsely claim a foreign command that merely mentions agentstate-lite. Compatibility work must use exact/tokenized semantic classification before any repair path relies on ownership.
- npm trusted publishing can stage/publish with short-lived OIDC but cannot move dist-tags, deprecate, or roll back. The Decision chooses stage-only candidate approval by either Brian or Mike with npm 2FA, followed by small interactive tag/finalization operations and no long-lived publish token.
- Pre-stable `latest == next` is an explicit convention exception. The next candidate stages on `next`, is proven from exact `pre.2`, and only then moves `latest`; stable removes stale `next` until a real preview exists.
- Explicit checks default to `latest`; preview is explicit `--tag next`. They print an exact version-pinned global install command. Passive discovery is orientation-only, cached-now/background-refresh, and cannot affect ordinary/protocol output.

## Progress

- Research is complete in `context-notes/version-update-identity-architecture-research`, `context-notes/version-update-product-plan-analysis`, and `context-notes/version-update-release-policy-research`.
- `designs/version-update-domain-model` has been revised with the three-way identity distinction and staged release lifecycle.
- `decisions/version-update-contract` and `plans/version-string-channel-identity` are authored, linked from the umbrella task, and synced.
- Independent policy/security and implementation/test reviews are in progress. Code and child-task creation remain gated on D0 approval.

## Assumptions awaiting reviewer challenge

- One automated isolated upgrade proof plus one founder/unfamiliar-bundle acceptance is sufficient; the same journey need not be repeated by both founders.
- Registry-unavailable is a distinct nonzero result for the explicit check while passive/orientation failure remains fully non-fatal. This preserves script honesty without making ordinary offline work fail.
- npm stage-only approval is preferred over duplicating approval at both GitHub and npm. A GitHub environment may constrain OIDC/ref scope without adding a second human gate.

[tracks](../tasks/version-string-channel-identity.md)

[reviews decision](../decisions/version-update-contract.md)

[reviews plan](../plans/version-string-channel-identity.md)
