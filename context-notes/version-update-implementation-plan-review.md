---
type: Context Note
title: Version/update implementation-plan review
actor: codex-version-plan-reviewer
timestamp: '2026-07-31T21:19:45.141Z'
---
# Summary

- **Original outcome:** `REVISE / D0 not approved` with two blockers, six major findings, and one minor ownership finding.
- **Revision audit:** the revised domain model, new normative protocol design, Decision, and Plan resolve the original two-release proof blocker; F9-before-D8 ordering; separate R6A/R6B release-preparation ownership; additive public identity/check/compatibility schemas and fixed notifier constants; high-risk C2H destructive Review→QA gate; explicit build flavors plus retained-tarball verification; P5B/P5S repository/external protection; and nonblocking Q6 evidence ownership. The latest staged flow also correctly assigns interactive `stage download`/checksum inspection before approval and explicitly makes rejected-stage SemVer consumption project policy.
- **Final verdict: CHANGES_REQUESTED.** No architecture rework is needed. Three remaining normative contradictions would otherwise force U3/C2H/C2S builders to invent behavior. One small P5S wording residual should also be corrected. Re-review can be limited to the exact rows below.
- **Proximate goal status:** review complete. The revision now serves the ultimate goal structurally; final approval waits only for internally consistent state/ownership/manifest semantics.

# Remaining severity-ranked issues

## MAJOR 1 — the `deprecated` check state is unreachable and its passive notice has no command

The protocol first declares any selected deprecated version `unavailable`, and the first precedence row consumes that condition. The next row then declares “running exact version equals selected and running version is deprecated” as `deprecated`. Because running and selected refer to the same packument version entry when equal, that second row can never execute.

The passive protocol compounds the contradiction: it displays `deprecated` notices while specifying that every actionable notice contains an exact command, but the `deprecated` row deliberately has `command: null`.

**Required edit:** choose one coherent contract. Recommended:

- remove standalone `deprecated` from successful check/passive-notice states;
- a dist-tag selecting a deprecated version remains `unavailable/selected_deprecated`;
- when the running version is deprecated and the selected exact version differs, retain `upgrade_available` or `rollback_available`, include `running_deprecated`, and print the exact selected-version command.

Alternatively, move exact-equal deprecated ahead of selected-deprecated and explicitly define a commandless warning notice. Whichever policy is chosen, make the precedence table, status enum, cache eligibility, and `update_notice.command` nullability agree.

## MAJOR 2 — hook ownership still asks the classifier to infer unknowable authorship

The protocol says the pure tokenized classifier recognizes exact `aslite session-start`/historical generated shapes while rejecting “hand-authored commands.” A command string/config shape carries no provenance: a human-authored exact `aslite session-start` is byte-for-byte indistinguishable from the installer's output. C2H cannot satisfy both rules, and the ambiguity sits on uninstall's destructive ownership boundary.

The revised Plan is closer—it rejects hand-authored **npx forms**—but the normative protocol still governs and uses the broader impossible rule.

**Required edit:** state the operational convention explicitly: an exact supported/generated command+shape is tool-owned by semantic form regardless of who originally typed it; unsupported hand-authored forms and near-matches are unmanaged. If actual authorship must matter, add a durable ownership marker and a migration rule instead. Align the table and C2H fixtures with the chosen decidable rule.

## MAJOR 3 — Skill Manifest v2 fields and comparison semantics remain unspecified

The protocol says Manifest v2 adds `compatibility_contract` and “running artifact identity fields,” but it does not name the persisted keys/types/schema version or say whether those provenance fields participate in compatibility. This matters because the normative state table says matching asset bytes + equal contract is `current`. If an older manifest's recorded CLI version/fingerprint is exact-compared to the new running artifact, every CLI release can mark an otherwise compatible unchanged skill stale, contradicting the table and the per-integration contract rule.

**Required edit:** add the exact Manifest v2 JSON shape and parser/evolution rules. State that compatibility is decided by owned asset bytes plus the skill contract (and any explicitly named asset identity), while installer/provenance fields are informational unless D0 deliberately chooses release-coupled staleness. Define the `newer_contract` row's retained legacy `state` deterministically from byte state.

## MINOR 4 — P5S overstates pre-tag empirical verification of npm's publisher binding

P5S says the path is “empirically protected” and the preflight verifies the exact npm trusted-publisher binding before any live tag. The release research records that npm does not validate that binding when configured; the first real OIDC stage attempt is the empirical proof. GitHub settings and a reviewed npm configuration receipt can be verified beforehand, but npm's end-to-end binding cannot.

**Required edit:** describe P5S as reviewed configuration/preflight evidence and E7A's first fail-closed stage as empirical trusted-publisher proof. A failed stage is safe and consumes the version only by the now-explicit project policy.

# Resolved findings retained as gates

- E7A honestly bootstraps pre.2; E7B separately proves self-discovery/passive notice.
- F9 completes before D8 relies on frozen recovery.
- R6A/R6B own reviewed release-preparation PRs; E7 units are operational receipts.
- Public `0.1.x` projections are additive; exact identity/check/cache constants and exits are normative.
- C2H explicitly covers install and uninstall with exact-SHA Review before adversarial QA.
- I1/P5A require explicit flavor/source inputs and verify the exact retained candidate without rebuilding.
- P5B resolves the direct-main bot conflict; P5S blocks tags on external setup evidence.
- Q6 is parallel durable onboarding evidence, not a release-mechanics predecessor.
- Every QA/deploy remains downstream of independent Review.
