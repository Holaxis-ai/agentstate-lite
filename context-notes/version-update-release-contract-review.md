---
type: Context Note
title: Version/update release contract review
actor: codex-version-contract-reviewer
timestamp: '2026-07-31T21:01:13.401Z'
---
# Summary

- **Status:** completed independent D0 release-policy/security review.
- **Verdict:** **CHANGES_REQUESTED**. The product direction and all clearly confirmed policy choices are represented, but the Decision/Plan are not yet safe to approve for implementation because the release transaction, protection prerequisites, exact-artifact proof, rollback comparison, and compatibility-contract semantics still require implementation-time invention.
- **Ultimate goal:** keep agentstate-lite a reliable, local-first, user-owned collaboration substrate.
- **Proximate goal:** make the release/update contract executable and reviewable before code work; this serves the ultimate goal by ensuring users can identify and upgrade the exact CLI bytes without weakening supply-chain or host-configuration boundaries.
- **Review basis:** task, domain model, Decision, Plan, all three version-update research notes, current repository release/package scripts, and current official npm/GitHub documentation. Findings distinguish empirical platform/repository constraints from reasoned contract gaps.
- **Approval condition:** revise the Decision/Plan for H1-H6, then re-review D0. M1-M4 should be resolved in the same pass because each otherwise forces a later unit to invent public behavior.

# Confirmed choices represented correctly

The documents faithfully record: `0.1.0-pre.2`; pre-stable `pre.N` with breaking changes advancing the minor line; temporary pre-stable `latest == next` and stable `latest`/preview `next`; npm-global as the repeated-use authority and npx as trial/bootstrap; either Brian or Mike as the single npm staged-package approver; read-only `aslite version --check`; cached, orientation-only, offline-safe notice; no `aslite update` until it actually updates; stable `aslite mcp` with guidance rather than silent rewrite for legacy cache paths; and immutable marketplace recovery material rather than a maintained second channel.

The two convention deviations are disclosed and defensible: pre-stable `latest` carrying a prerelease differs from normal npm stable-tag convention, and an exact version-pinned `npm install --global` differs from npm's generic `npm update -g` guidance. The former is explicitly temporary; the latter prevents tag movement between check and install and supports controlled rollback.

# Findings

## H1 — High — The staged release is described as one continuous workflow, but npm approval is an external asynchronous boundary

**Sections:** Decision §2 paragraphs 3-8 and Lifecycle 1-3; Plan P5 and E7.

**Evidence:** npm OIDC may run `npm stage publish`, but a maintainer later approves with 2FA via `npm stage approve` or npmjs.com. The original tag-triggered Actions run cannot resume automatically after that external approval. A later GitHub Release publisher also needs `contents: write`, while the staging job should retain only `contents: read` + `id-token: write`.

**Impact:** “one workflow … carries that exact tarball through the remaining transaction” and “the finalizer” do not name a feasible continuation, retained-artifact authority, permissions, or retry identity. An implementer must invent whether finalization is local, a second workflow run, a manually dispatched mode in the same file, or an indefinitely polling job.

**Correction:** define an explicit release state machine and receipt. At minimum: (1) tag-triggered stage run validates/builds/proves one tarball, records tag/SHA/version/tarball SHA/stage ID, and retains the exact bytes; (2) Brian or Mike downloads/inspects the staged candidate and either rejects or approves it with npm 2FA; (3) a separate, explicitly authorized finalization operation accepts only those immutable identifiers, never rebuilds, verifies registry integrity/signature/install, performs the documented interactive tag mutation, and publishes the already-prepared GitHub draft. Give each job/operation minimum permissions and an owner. Matching partial states resume; disagreement fails closed.

## H2 — High — Required repository/npm protection is not an owned prerequisite and conflicts with the current marketplace bot

**Sections:** Decision §2 (“protected annotated tag”, “protected stage-only”); Plan P5 acceptance/gate.

**Evidence:** the repository research found no environments, rulesets, tags, releases, or main protection. `.github/workflows/ci-version-bundle.yml` currently pushes generated marketplace changes directly to `main` and says branch protection will break it.

**Impact:** the Decision claims a protected reviewed source without sequencing the settings that make that true. Enabling main protection naively can strand the temporary channel; omitting it lets a direct main push become taggable/releasable. These are external state changes a code PR cannot silently perform.

**Correction:** add a P5 prerequisite/setup row owned by Brian/Mike and verified in the release receipt: resolve the bot conflict first (prefer bot-authored PR; otherwise record a narrowly scoped, temporary bypass), protect `main`, protect `v*` creation/update/deletion, restrict the release environment to selected release tags with no admin bypass, configure the exact stage-only trusted publisher, and enable immutable releases before publishing recovery/product releases. The first live tag must fail preflight until these settings are empirically present.

## H3 — High — “Build and pack once” contradicts the current gate and leaves a circular source-commit claim

**Sections:** Decision §2 paragraphs 1-3 and Consequences 4-5; Plan P5 Builder bullets 1-3.

**Evidence:** root `npm run check` invokes `verify:npm-package`; that verifier runs the CLI build and `npm pack` itself. `packages/cli` also runs the verifier as `prepublishOnly`. npm staged publishing packs the working directory by default, though its current CLI accepts a package spec. Separately, a release PR cannot commit a generated claim containing its own final commit SHA without a circular commit.

**Impact:** the proposed sequence can prove one tarball and stage another, or rebuild after approval. “Generated identity claims” plus “embedded commit equals checkout SHA” is impossible if interpreted as a commit-time generated source file.

**Correction:** make the release path build once, inject the checkout/tag commit at build time, run `npm pack` once, and pass that retained `.tgz` to an exact-artifact verifier and to `npm stage publish <artifact.tgz> --tag <policy-tag>`. Refactor the existing verifier/prepublish gate to accept and test an already-built tarball (with a separate ordinary-development mode if needed); the release path must never invoke the repacking mode. Version/contract claims may be committed by the release PR, but `source_commit` must be a build-time fact checked against the tag, not a self-referential committed generated value. Before approval, compare the downloaded staged candidate checksum with the retained artifact.

## H4 — High — The support-tag invariant and proof order disagree during the release transaction

**Sections:** Domain Invariants 11-12 and Lifecycle 2-3; Decision §1, §2 paragraphs 5-6, §7 old-to-new proof; Plan E7.

**Reasoned finding:** the next prerelease is approved publicly under `next` before the real old-to-new proof, while §1 says a release is supported because a dist-tag selects it. During that window `next` selects an unproved candidate and `latest != next`; at stable, approval under `latest` exposes the candidate as the default before post-publication proof. Failure/rejection states are not enumerated.

**Impact:** update discovery can recommend a candidate the contract simultaneously says is not yet proven. Operators do not have a precise rule for staged rejection, failed `next` smoke, or stable `latest` rollback.

**Correction:** make the transient states explicit. Run all artifact-level, integration, offline, and clean-install proof possible against the retained and downloaded staged bytes before approval; after approval run only registry-specific exact-command/signature/integrity smoke. State that `latest == next` is an at-rest pre-stable invariant, not an invariant during finalization. Define whether `next` is a preview candidate or a supported track during that bounded window, and define immediate `next`/`latest` restoration + deprecation behavior for each failure state. Add staged rejection as distinct from public rollback.

## H5 — High — Update result states do not safely model dist-tag rollback to a lower SemVer

**Sections:** Decision §1 bad-release policy and §4 result/exit contract; Plan U3.

**Reasoned finding:** the enum includes `ahead`, `deprecated`, and `unsupported` without a precedence/state table. After rollback, a bad installed `pre.4` may be numerically ahead of supported `pre.3`; calling that merely `ahead` can suppress the required downgrade. It is also unclear whether deprecation applies to the running version, the selected version, or both.

**Impact:** the most safety-critical update case can produce ambiguous output or no exact reconciliation command.

**Correction:** compare exact running version to the exact dist-tag-selected supported version first; SemVer direction is a secondary field, not the authority. Whenever the exact versions differ, emit the exact selected-version install command, including downgrade. Define a table for selected-tag absent/malformed, exact current, forward reconciliation, rollback reconciliation, running-version deprecated, selected-version deprecated/inconsistent, and registry unavailable. Specify result precedence, JSON shape, and exact project exit code (`1` is the standing runtime-failure candidate for unavailable; usage remains `2`) rather than “a distinct nonzero.”

## H6 — High — `compatibility_contract` is named but has no versioning or state/remedy semantics

**Sections:** Domain Build identity/Compatibility state and Invariants 7-8; Decision §3 field table and §6; Plan I1/C2.

**Reasoned finding:** no rule says what change increments the compatibility contract, which persisted surfaces consume it, or how it interacts with a byte-stale skill, a semantically stable hook, and stable MCP PATH configuration. Skill also changes its existing public state spelling from `installed` toward `current` without a compatibility mapping.

**Impact:** I1/C2 must invent the central compatibility policy, making the versioned field decorative or causing needless reinstalls on every release.

**Correction:** add a compatibility table and bump rule. A contract revision should change only when the persisted integration shape/semantics require reconciliation, not on every release. Define per surface: evidence, states, compatibility across contract versions, exact remedy, and preserved JSON fields/state aliases. Specify that skill byte drift can be actionable even under the same contract; hook compatibility is semantic command ownership rather than artifact-version equality; MCP v1 compatibility is the stable `aslite` + `mcp` argv contract and does not claim host-config inspection.

## M1 — Medium — Passive notice behavior contradicts the structured home surface

**Sections:** Decision §3 home/session projection and §5; Plan N4.

**Reasoned finding:** §3 says home/session-start consume identity, while §5 allows the cached notice on bare home/session-start but says JSON stdout receives no passive notice. Home itself has a JSON projection, and the one-run suppression flag is unnamed.

**Correction:** state explicitly whether `home --json` excludes passive update data (recommended for output stability) or includes a stable structured field while doing no network work. Name the one-run flag, define environment-variable presence/value semantics and precedence, and specify whether suppression hides cached display, background refresh, or both.

## M2 — Medium — C2 overclaims MCP diagnostics beyond the chosen no-config-manager boundary

**Sections:** Decision §6; Plan C2 claim/bullets and Requirements Matrix “Skill/hook/MCP compatibility.”

**Reasoned finding:** without reading named host MCP configurations, the CLI cannot report whether an existing host uses a cache-bound path. The Decision correctly refuses arbitrary host-config scanning, but the Plan groups MCP with status diagnostics and state-table evidence.

**Correction:** rename the C2 claim/evidence to “skill/hook diagnostics plus MCP launch-contract proof and migration guidance.” Identify the exact docs/help/release-receipt surface that carries generic legacy guidance. Do not claim per-host MCP compatibility state unless a separately authorized bounded config reader is designed.

## M3 — Medium — npx persistence behavior is not decided

**Sections:** Decision §7; Plan Q6; task npx role.

**Reasoned finding:** “trial/bootstrap” and “does not become a persistent hook/skill authority” do not say what happens if a user invokes `npx ... skill install` or `npx ... hook install`. The latter can persist an ephemeral/cache-derived invocation unless explicitly refused or normalized to an already-installed stable PATH binary.

**Correction:** record the public rule. Recommended: npx may run read-only/trial/bootstrap commands, but persistent hook installation refuses unless a supported global `aslite` resolves on PATH and is the command being installed; decide separately whether an exact npm-artifact skill install is allowed, with its manifest tied to the running identity. Add literal tests for the chosen behavior.

## M4 — Medium — One-founder proof sufficiency is asserted without traceable human provenance

**Sections:** Decision §7 final bullet; Plan E7.

**Reasoned finding:** the recorded confirmed choices establish “Brian or Mike” publication approval, but do not independently establish that one founder plus automation is sufficient for acceptance/retirement. The latest “Confirming both” must not be used to infer an unspecified extra choice.

**Correction:** either obtain/record explicit Brian confirmation for this sufficiency rule or label it a proposed plan default pending D0 human approval. Publication authority and user-journey acceptance sufficiency are separate decisions.

# Survived attacks / strengths

- Separation of artifact channel, launch evidence, and mutable release track is technically sound and avoids fabricating npx/global provenance.
- Runtime SHA-256 of the executing bundle avoids a circular embedded self-hash and resolves same-SemVer/different-byte identity for the CLI artifact.
- Reserving `aslite update` for a future mutating command follows user expectation better than a read-only command named update.
- Exact version-pinned reconciliation is safer than generic npm update/tag commands and correctly supports rollback.
- Stage-only OIDC with one 2FA maintainer approval is feasible for this already-published package and avoids long-lived automation tokens; official npm docs confirm OIDC command scope excludes dist-tag/deprecation operations.
- The hook substring-ownership flaw is recognized and assigned to a semantic classifier with no-mutation QA.
- Frozen immutable GitHub recovery material is correctly separated from a live maintained marketplace channel.

# Primary platform references

- npm trusted publishing (workflow/environment mapping, stage-only action, OIDC limits, token restriction, provenance): https://docs.npmjs.com/trusted-publishers/
- npm staged publishing (external 2FA approval, staged review/download/reject, tag immutability, exact package-spec support): https://docs.npmjs.com/staged-publishing/ and https://docs.npmjs.com/cli/v11/commands/npm-stage/
- GitHub immutable release workflow and asset/tag lock: https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases
- GitHub environment required-reviewer/ref/bypass behavior: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments

# Phase boundary

Review complete; no source Decision, Plan, task, roadmap, or code was edited. Next action is author revision of H1-H6 and M1-M4 followed by independent D0 re-review. This note is intentionally not synced by the reviewer.
