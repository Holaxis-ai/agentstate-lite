---
type: Context Note
title: Version/update release contract review
actor: codex-version-contract-reviewer
timestamp: '2026-07-31T21:19:38.043Z'
---
# Summary

## Original outcome

The initial independent D0 release-policy/security review returned **CHANGES_REQUESTED** with H1-H6 and M1-M4. It found that the first Decision/Plan required implementation-time invention around asynchronous staged approval/finalization, external protection and the direct-main marketplace bot, exact-artifact build-once proof, transient support tags, rollback-aware comparison, integration-contract semantics, structured passive output, MCP scope, npx persistence, and founder-proof sufficiency.

## Revision audit

The revised domain model, normative `designs/version-update-protocols`, Decision, and Plan materially resolve the original findings:

- **H1 mostly resolved:** staged publication is now an explicit prepared → staged → inspected → approved/rejected → registry-verified → promoted → final state machine. External 2FA never resumes the OIDC run, finalization is separately dispatched, immutable IDs bind retries, and job permissions are separated. Interactive `npm stage download`/checksum inspection correctly sits between OIDC staging and approval.
- **H2 resolved:** P5B owns conversion of the direct-main marketplace bot; P5S owns empirically verified main/tag/environment/trusted-publisher/2FA/immutable-release setup and blocks live tags.
- **H3 resolved:** source gates are distinguished from one production-candidate build/pack; the verifier gains no-build/no-pack `--tarball` mode; the exact `.tgz` is staged; source SHA is injected at build time rather than self-referentially committed.
- **H4 resolved:** `latest == next` is explicitly an at-rest prerelease invariant; `next` may be a bounded explicit candidate; preapproval and registry-only postapproval proofs, stage rejection, tag restoration, deprecation, and stable/prerelease failure paths are enumerated.
- **H5 mostly resolved:** exact dist-tag selection is authoritative; upgrade and rollback states/commands/exits are fixed; numeric “ahead” cannot suppress rollback.
- **H6 mostly resolved:** compatibility contracts are per integration with bump criteria; additive skill states, semantic hook states/remedies, bounded MCP contract, and destructive hook QA are specified.
- **M1 resolved:** passive work/notice is default TOON orientation only; JSON/protocol/ordinary output is untouched; suppressors, paths, budgets, TTL, lease, worker, and notice shape are named.
- **M2 resolved:** MCP scope is honestly limited to PATH argv/handshake proof plus generic guidance; no per-host inspection is claimed.
- **M3 not fully resolved:** product policy now says npx is read-only, but its enforcement evidence is insufficient (R1 below).
- **M4 resolved:** founder acceptance now cites the singular existing prerelease acceptance owner; automation remains separate and Q6 is not made a hard release-mechanics dependency.

The revised plan also correctly splits the destructive hook authority (C2H), skill/MCP work (C2S), retained-artifact automation (P5A), marketplace-bot protection compatibility (P5B), external settings receipt (P5S), and the honest two-release bootstrap/self-discovery proofs (R6A/E7A and R6B/E7B). Review precedes every QA/deploy edge.

## Final verdict

**CHANGES_REQUESTED** — no broad redesign is needed, but three normative contradictions remain. R1 is high because the stated npx safeguard is false under npm's execution model. R2-R3 are medium and must be fixed before D0 approval because they assign mutually incompatible behavior to builders on update state and destructive hook ownership. A fourth low release-draft wording issue should be clarified in the same edit.

## Residual findings

### R1 — High — PATH equality does not prove a durable global install and therefore does not prevent npx persistence

**Sections:** Domain Boundaries; Protocol §4 paragraph after the hook table; Decision §6 final bullet; Plan C2H/C2S.

The documents say persistent skill/hook install is safe when a managed PATH bin resolves to the running npm-package executable. npm exec/npx explicitly installs the requested package into its cache **and adds that cache's bins to PATH** for the child process. Thus an npx invocation will normally satisfy `command -v aslite -> running executable`; bare `aslite session-start` can then be persisted even though it will disappear from PATH when npx exits. This contradicts the same design's honest statement that identical npm bytes cannot reliably infer npx versus global selection.

**Required correction:** define durable-global evidence independently of the transient process PATH. For the supported npm-global v1 contract, accept only a resolved bin proven under the active npm global prefix (or another explicitly enumerated durable managed install receipt), reject `npx-inferred`/npm-exec-cache paths, and fail closed when provenance is unknown. Pin a real npm-exec fixture proving its injected cache bin cannot authorize skill/hook persistence. If no reliable cross-platform proof is available, require an explicit prior global-install receipt rather than claiming PATH equality is sufficient.

Official npm evidence: https://docs.npmjs.com/cli/v11/commands/npm-exec/ states that remotely requested packages are installed in an npm-cache folder which is added to PATH for the executed process.

### R2 — Medium — The selected-deprecated precedence makes the `deprecated` state unreachable

**Sections:** Protocol §2 Network and selection, normative `unavailable.code`, and State and exit precedence; Decision §4; Passive Protocol §3 actionable notices.

The first state row classifies any selected deprecated version as `unavailable`/exit 1. The next row classifies “running exact version equals selected and running version is deprecated” as `deprecated`/exit 0. When running equals selected, both refer to the same version metadata, so the first row always wins and the second row can never occur. Consequently the passive `deprecated` notice is also unreachable under the normative table.

**Required correction:** choose one policy and make every schema/notice agree. Recommended: keep selected-deprecated as the fail-closed policy inconsistency (`unavailable`, no command), remove `deprecated` as a top-level equal-version status/passive notice, and retain running deprecation only as additive reason metadata when a different valid selected target supplies a safe reconciliation. Alternatively, deliberately make equal selected-deprecated `deprecated` and remove `selected_deprecated` from the preceding unavailable rule. Do not keep both precedence rows.

### R3 — Medium — Hook provenance is unobservable, but the protocol both rejects hand-authored commands and removes exact shapes as owned

**Sections:** Protocol §4 “Hook ownership and mutation boundary” prose/table; Plan C2H.

Claude/Codex persisted hook entries do not carry a tool-authenticated provenance marker. The table treats an exact stable `aslite session-start` command/timeout/shape as owned and removable, while the prose says hand-authored commands are rejected. An exact hand-authored entry is observationally identical to an exact generated entry, so C2H cannot implement both rules.

**Required correction:** state the honest semantic-ownership rule: every exact enumerated generated-compatible shape is deemed owned regardless of who originally typed it; only non-exact/near-match hand-authored shapes are unmanaged. Keep the destructive QA. If original-author provenance must matter, introduce a durable marker/receipt and a migration rule before allowing uninstall—but do not ask the classifier to infer unavailable history.

### R4 — Low — The GitHub draft has no explicit creation/attachment state

**Sections:** Protocol §5 `final`; Plan P5A.

P5A says it prepares but does not publish the GitHub draft, and `final` publishes an “already-prepared draft/attached exact bytes,” but the state table does not name which job/permission creates that draft and attaches the retained artifact.

**Correction:** either add a `draft_prepared` operation with owner, immutable asset checksum, and `contents: write`, or state that the separately scoped finalizer creates the draft, attaches/verifies the retained bytes, and then publishes it in the documented immutable-release sequence. This is a legibility fix, not a change to the selected authority model.

## Re-review boundary

No governing Design, Decision, Plan, task, roadmap, or code was edited. This existing review note is the only bundle mutation and is intentionally not synced by the reviewer. After R1-R3 are corrected (and R4 clarified), a final focused read should be sufficient for **APPROVED**; the original H1-H6/M1-M4 do not need another broad review.
