---
type: Context Note
title: Version/update release contract review
actor: codex-version-contract-reviewer
timestamp: '2026-07-31T21:23:57.734Z'
---
# Summary

## Original outcome

The first D0 release-policy/security review returned **CHANGES_REQUESTED** with H1-H6 and M1-M4. The first focused re-review found the broad revision sound but retained R1-R4: transient npx PATH could masquerade as a durable global install; selected-deprecated state precedence was contradictory; exact hand-authored hooks had unobservable provenance; and GitHub draft creation/attachment lacked an owned state.

## Revision audit

The latest `designs/version-update-protocols`, `decisions/version-update-contract`, and `plans/version-string-channel-identity` resolve every blocker/major finding:

- **R1 resolved:** persistent npm-package integration installs require fail-closed `durable_global` evidence derived from a validated absolute npm global prefix and supported global layout, explicitly reject npm-exec/cache evidence, and cannot rely on PATH equality. C2H requires a literal real npm-exec/npx-cache fixture that passed the old rule and must now refuse without writes; C2S consumes the same injected authority.
- **R2 resolved:** selected-deprecated precedence is disjoint. A different deprecated selected version is `unavailable`; an equal running/selected deprecated version is `deprecated`. Passive output permits the latter only with a nullable `command`, so no unsafe install instruction is fabricated.
- **R3 resolved:** hook ownership is now explicitly semantic. Exact enumerated generated-compatible shapes are deemed owned regardless of who typed them; non-exact/near-match hand-authored commands are unmanaged. This matches observable evidence and remains protected by install/uninstall byte-preservation QA.
- **R4 resolved:** `draft_prepared` is a named state owned by a separate `contents: write` job, with draft/asset IDs and digests bound to the prepared receipt. Finalization re-verifies those identifiers before attaching the final receipt and publishing.
- **Manifest v2 verified:** it is exact and additive, retains existing `package`, `version`, `installed_by: "aslite skill install"`, and `files`; adds schema, compatibility contract, source identity, and per-file SHA-256; requires sorted complete file/digest coverage; preserves legacy ownership; and makes provenance fields informational when actual assets and contract are compatible.
- **P5S wording verified:** it records reviewed configuration and every externally observable protection, but does not claim empirical OIDC binding success because npm cannot validate that before a real attempt. E7A's first fail-closed stage is correctly named as the empirical trusted-publisher proof.

The earlier H1-H6/M1-M4 resolutions remain intact: asynchronous staged approval/finalization and permissions are explicit; repository protection is sequenced with the marketplace-bot conversion; the production candidate is built/packed once and verified/staged by exact retained path; transient `next`/`latest`, rejection, rollback, and deprecation are defined; exact dist-tag selection controls forward/rollback reconciliation; integration contracts are per-surface and additive; passive JSON/protocol isolation is fixed; MCP scope is bounded; the two-release proof is honest about pre.2; and Review precedes every QA/deploy edge.

## Final verdict

**APPROVED.** No blocker or major release-policy, security-boundary, npm/GitHub feasibility, public-schema, state-precedence, human-authority, or implementation-plan contradiction remains in D0.

This approval is for the governing design/plan contract, not advance approval of later code or live operations. The Plan's per-unit exact-SHA Review, adversarial QA, repository/package gates, P5S external receipt, E7A empirical OIDC proof, staged inspection/2FA, and operational receipt reviews remain mandatory.

## Residuals

No blocker/major residuals. Ordinary implementation details and platform behavior remain hypotheses until their named fixtures, preflight, and live receipts execute; the protocol correctly fails closed and assigns those proofs to later units rather than treating this design review as empirical release evidence.

## Review boundary

No governing Design, Decision, Plan, task, roadmap, or code was edited. This existing review note is the only bundle mutation and is intentionally not synced by the reviewer.
