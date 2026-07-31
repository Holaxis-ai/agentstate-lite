---
type: Context Note
title: Version/update implementation-plan review
actor: codex-version-plan-reviewer
timestamp: '2026-07-31T21:23:56.622Z'
---
# Summary

- **Original outcome:** `REVISE / D0 not approved` with two blockers, six major findings, and one minor ownership finding.
- **First revision outcome:** `CHANGES_REQUESTED` on four narrow remaining issues: deprecated-state precedence/passive command nullability, undecidable hook authorship, unspecified Skill Manifest v2 comparison semantics, and P5S overclaiming pre-tag empirical OIDC proof.
- **Final revision audit:** reviewed exact current revisions `designs/version-update-protocols` `sha256:a7cdfc8305700f9d790e188846234a9514ba645ff20fffd4ab5abcb645995536`, `decisions/version-update-contract` `sha256:38e6bedc797428c1f50eb443c3e4fc2eb22804965bf667325fe32aade885830e`, and `plans/version-string-channel-identity` `sha256:d85eeaab7ff577d7960b0094abb588318df3582e05c4a34027708f6e3d724c48`.
- **Final verdict: APPROVED.** No blocker or major issue remains. D0 is build-ready under the normative protocol and explicit unit gates.
- **Proximate goal status:** complete. The approved design makes release identity, update discovery, integration compatibility, staged publication, two-release proof, and marketplace retirement implementable without builders inventing public behavior.

# Final correction audit

- **Selected deprecation/passive notice:** resolved. A different deprecated selected target is `unavailable`; an exact-equal deprecated target is the reachable `deprecated` state. Passive notice explicitly permits nullable `command`, so the commandless inconsistent-policy warning is coherent.
- **Semantic hook ownership:** resolved. Exact generated-compatible command/config shape is explicitly tool-owned regardless of who typed it; non-exact hand-authored/near-match forms are unmanaged. This is decidable from available evidence and remains gated by install+uninstall adversarial QA.
- **Skill Manifest v2:** resolved. Exact persisted keys/digests are specified, including retention of existing `installed_by: "aslite skill install"`. Asset bytes plus the skill contract determine compatibility; CLI release/commit/channel/executable hash are informational provenance and cannot alone make compatible assets stale. Legacy ownership remains recognized.
- **P5S vs E7A:** resolved. P5S stores reviewed configuration and verifies externally observable settings; the protocol explicitly acknowledges npm cannot validate OIDC binding before a real attempt. E7A's first fail-closed stage is the empirical trusted-publisher proof.
- **`durable_global`:** resolved. Persistent npm-package skill/hook installation requires injected, read-only global-prefix/layout evidence and rejects npm-exec/npx cache false positives; PATH equality alone is insufficient. C2H includes a literal regression fixture.
- **`draft_prepared`:** resolved. Draft creation/asset attachment is a separately permissioned `contents: write` state before staging; later phases verify immutable draft/asset identifiers and digests, while the stage job retains only read+OIDC permissions and finalization does not rebuild.

# Approved gates and residuals

- Both honest release transitions remain required before retirement: pre.2 bootstrap, then a real self-discovered successor and passive-notice proof.
- F9 precedes D8; R6A/R6B own release-preparation PRs; Q6 stays parallel evidence.
- C2H, U3, N4, P5A, and P5B retain exact-SHA independent Review before adversarial QA/deployment.
- P5S blocks tagging; failed/rejected/public release states and immutable receipts are explicit.
- No known blocker or major residual remains. Minor implementation discoveries that would alter a normative schema/state/constant return to D0 review rather than being chosen inside a build unit.
