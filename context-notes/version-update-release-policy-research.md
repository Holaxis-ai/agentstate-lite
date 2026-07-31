---
type: Context Note
title: Version/update release-policy research
actor: codex-release-policy-researcher
timestamp: '2026-07-31T20:40:03.325Z'
---
# Summary

- **Status:** completed.
- **Ultimate goal:** make agentstate-lite the reliable, local-first, user-owned shared memory for agents and humans.
- **Proximate goal:** translate current authoritative npm and GitHub release mechanics into a decision-ready release, update, approval, provenance, and rollback contract for `tasks/version-string-channel-identity`.
- **Link upward:** an externally verifiable release identity and safe upgrade path are prerequisites for users to trust the CLI and its integration surfaces across sessions.
- **Main conclusion:** use GitHub Actions trusted publishing from one exact, tag-triggered workflow and a protected release environment; prefer npm's new **stage-only trusted publishing** if Brian and Mike are willing to approve on npm with 2FA. It is npm's documented maximum-security posture and reviews the actual staged tarball. Direct OIDC publish behind a GitHub environment where Brian and Mike are reviewers is the lower-complexity fallback.
- **Material platform constraint:** npm OIDC is documented for `npm publish` and `npm stage publish` only. It does **not** authorize `npm dist-tag`, `npm deprecate`, or rollback operations. The confirmed pre-stable rule that both `latest` and `next` advance therefore cannot be completed by a tokenless publish alone; the second tag move needs an interactively authenticated maintainer or a separately protected traditional credential. Prefer the interactive Brian-or-Mike step over reintroducing a long-lived write token.
- **Confidence:** high for platform mechanics and repository gaps; medium for the exact approval placement because it is a product/operations choice between npm staged approval and GitHub environment approval.

# Evidence

## Current authoritative conventions

### Trusted publishing, approval, and provenance

- npm trusted publishing uses OIDC and short-lived workflow-bound credentials. It currently requires npm CLI 11.5.1+ and Node 22.14+, a supported cloud-hosted runner, an exact repository/workflow mapping, `id-token: write`, and optionally an exact GitHub environment. Each package can have only one trusted publisher connection.
- npm recommends disabling traditional publish tokens after OIDC is proven (`Require two-factor authentication and disallow tokens`). This setting does not block the trusted publisher.
- Public packages published from public repositories through trusted publishing automatically receive npm provenance and publish attestations; no `--provenance` flag is required. npm provenance links the package to source/build instructions but is not a claim that the code is safe.
- npm's current strongest posture is **stage-only** trusted publishing. `npm stage publish` uploads an unavailable candidate; a maintainer must inspect and approve it with 2FA before it becomes public. Staged publishing requires npm 11.15+ and Node 22.14+. A staged prerelease requires an explicit `--tag`, and the selected tag is immutable for that staged candidate.
- GitHub environments can list Brian and Mike as required reviewers; only one listed reviewer must approve. `Prevent self-review` is optional and materially changes policy: if enabled, the person who initiated the deployment cannot approve it. Environments can also restrict deployment to selected `v*` tags and disallow administrator bypass.
- GitHub tag rulesets can restrict creation, update, and deletion of matching release tags. npm itself recommends environment protections and release-tag protection alongside trusted publishing.

### Dist-tags and prereleases

- npm uses `latest` by default for publishing and for an unqualified install. Other tags have no built-in semantics; conventionally `latest` identifies stable and another tag such as `next`/`beta` identifies prerelease.
- A publish or stage operation selects only one dist-tag. Additional tags are moved with `npm dist-tag add`; authenticated tag mutation is a separate registry write.
- The confirmed pre-stable policy (`latest == next == newest prerelease`) differs from npm convention but is safe while no stable release exists: it deliberately makes the supported test release reachable by plain global install while preserving `@next`. It must be explicit (`--tag latest`) because current npm staged-publish behavior rejects an untagged prerelease.
- At `0.1.0`, `latest` should point to stable. Do not leave `next` pointing at the older `0.1.0-pre.N` and call it preview; either remove `next` until a real next preview exists or publish the first next-line preview and point `next` there.
- `0.1.0-pre.N` is valid SemVer and sorts numerically by `N`; `0.1.0-pre.N` is lower precedence than `0.1.0`. npm's introductory guidance starts public packages at 1.0.0, while SemVer explicitly reserves 0.y.z for initial development. The project exception is valid but its compatibility rules must be stated because SemVer deliberately does not define compatibility within 0.y.z.

### Global upgrade command

- npm's user guide teaches `npm update -g <package>` for a global package. npm also formally supports global installation by exact package tag/version, including scoped packages.
- Recommend the project print `npm install --global @holaxis/aslite@latest` as the canonical supported-release reconciliation command, and `npm install --global @holaxis/aslite@next` only for an explicitly selected preview track. This is a deliberate, safe deviation from the generic update spelling: it names the package coordinate and mutable support tag, works for install/reinstall/repair, and can move a user back to an older version when a dist-tag is rolled back. `npm update -g` is less explicit and is semantically framed as an upgrade.
- Exact rollback is `npm install --global @holaxis/aslite@<known-good-version>`. `npx -y @holaxis/aslite@<tag-or-version> ...` remains a trial/one-shot path and does not modify the supported global installation.

### Deprecation, unpublish, and rollback

- Published npm name/version pairs are immutable and can never be reused, even after unpublish.
- Normal rollback is: move the supported tag(s) back to a known-good version, deprecate the bad version with an actionable message, and publish a fixed new version. Already installed bad copies are not automatically downgraded; the CLI must print the explicit install command.
- npm strongly recommends deprecation instead of unpublish because deprecation preserves downstream installs and emits a warning. Unpublish is exceptional: under 72 hours it is allowed only while there are no public dependents; after 72 hours all listed policy conditions must hold (no dependents, fewer than 300 weekly downloads, single owner/maintainer). This package currently has two maintainers, so an ordinary post-72-hour unpublish should not be considered available.
- `npm dist-tag`, `npm deprecate`, and `npm unpublish` are interactive/package-owner operations under the recommended no-token posture. Keep a tested emergency runbook and current 2FA recovery for both Brian and Mike.

### Git tags, GitHub releases, and frozen recovery

- GitHub releases are based on Git tags, which bind a release to a specific point in repository history.
- GitHub immutable releases lock the associated tag and assets after publication and automatically generate a release attestation containing the tag, commit SHA, and release assets. GitHub recommends creating a draft, attaching all assets, then publishing it.
- Enable release immutability before publishing the frozen marketplace recovery release. Use a distinct tag such as `marketplace-recovery-1.0.134`, target the exact last known-good marketplace commit, attach the recoverable plugin archive plus checksum and recovery instructions, do not mark it as the latest product release, and publish the draft. This satisfies the confirmed “frozen emergency backup, not a maintained channel” policy with stronger guarantees than an ordinary movable tag.
- For npm releases, use `v${package.version}` as the exact tag and attach the exact `npm pack` tarball/checksum to the corresponding draft GitHub release when practical. Publishing that draft after npm/tag verification makes the GitHub tag/assets immutable and independently attested.

### Registry metadata and update checks

- The npm registry's documented `GET /{package}` packument contains `dist-tags`, version metadata, per-version deprecation, and `dist.integrity`. The official abbreviated Accept type is `application/vnd.npm.install-v1+json`; it is the right bounded source for `aslite version --check` and the daily cache.
- Current registry evidence (2026-07-31): `latest` and `next` both resolve to `0.1.0-pre.2`; the version metadata exposes the tarball SHA-512 integrity and lists Brian (`bderfer68`) and Mike (`mikec-ai`) as maintainers.
- npm itself has an `update-notifier` setting that defaults on and can be suppressed. That supports the product choice that update notices must be suppressible, but npm's docs do not prescribe AgentState's cache/timeout architecture.
- Recommended automatic behavior remains the confirmed contract: only the human orientation surface; show a cached answer immediately; at most one background refresh attempt per 24 hours; short abort timeout; no retry loop; no effect on command success; no output on ordinary bundle-command stdout; skip in CI/tests and when explicitly disabled. Store only package/tag/version/deprecation/integrity plus timestamps. Do not transmit the installed version, cwd, bundle identity, actor, or usage data. Any registry request necessarily reveals the package coordinate and normal network metadata to the registry, so document the request and opt-out plainly.
- A release **track** (`latest` versus `next`) is not recoverable from installed package bytes: npm installs the same tarball whether selected by tag or exact version, and dist-tags remain mutable registry metadata. Add release track as a separate domain term. `version --check` should default the supported global journey to `latest` and require an explicit/persisted opt-in for `next`; otherwise the post-0.1.0 preview journey is ambiguous.

## Repository evidence and gaps

- Public GitHub repository, default branch `main`.
- GitHub API currently reports: zero environments, zero rulesets, zero releases, zero tags, and no `main` branch protection. These are blockers to claiming a protected trusted-publish path.
- There is no npm publish/release workflow. Existing workflows cover repository tests and the temporary marketplace bundle bot only.
- `.github/workflows/ci-version-bundle.yml` pushes generated marketplace changes directly to `main` and explicitly warns that branch protection will break it. Strong main protection therefore depends on first retiring this bot, changing it to a PR, or granting a narrowly justified bypass. Do not silently add branch protection and strand the temporary channel.
- `packages/cli/package.json` and the workspace lockfile agree on `0.1.0-pre.2`; `publishConfig` pins only public access. The current package proof is strong on tarball allowlist, single executable, offline workflow, skill bytes, and stable PATH hook command.
- Runtime identity currently bakes only the SemVer. There is no source commit, runtime executable hash, release track, channel evidence, or release workflow mapping. A robust artifact fingerprint can be the runtime SHA-256 of the executing `.mjs` bytes (avoids the self-referential problem of embedding the file's own digest), accompanied by an embedded source commit and executable path.
- The current npm version record has registry integrity/signature data, but the repository has no matching Git tag or GitHub release. Do not describe `0.1.0-pre.2` as source-provenanced; treat it as the bootstrap release and make the next release the first fully automated/provenanced one.

# Recommendations

## Recommended release contract

1. **Reviewed source assignment.** A release PR changes `packages/cli/package.json`, `package-lock.json`, generated release claims/docs, and any compatibility contract. The workflow never invents a version or writes a version commit to `main`. This revises the domain lifecycle phrase “action assigns the SemVer” into “a reviewed source commit assigns SemVer; the action verifies and publishes it.”
2. **One immutable source ref.** After merge, create protected annotated tag `v${version}` at the selected gate-clean `main` commit. A tag ruleset restricts `v*` create/update/delete. The workflow fails unless tag text, package version, lockfile version, embedded commit, and checkout SHA agree and the commit is reachable from `main`.
3. **One exact workflow.** Add a non-reusable `.github/workflows/release-npm.yml`, triggered by `push.tags: v*`, on a GitHub-hosted runner. Configure npm's trusted publisher to exact org/repo/workflow/environment. Use Node 24 (or another version satisfying current npm requirements), assert npm CLI minimum, `permissions: contents: read, id-token: write` for publish/stage, and disable package-manager caching in release builds.
4. **Build and prove once.** Run `npm ci`, the repository gate, the installed-tarball proof, identity agreement tests, and clean-machine upgrade proof. Produce one `npm pack` tarball, record SHA-256 and npm `dist.integrity`, and pass that exact artifact forward; never rebuild between approval and publish.
5. **Approval choice — recommended:** configure the npm trust relation to allow `npm stage publish` only; stage the exact tarball with an explicit policy tag. Brian or Mike downloads/reviews the staged candidate and approves it with npm 2FA. This is npm's official maximum-security path and places the one required approval after candidate bytes exist. A GitHub environment may still bind the OIDC subject and restrict `v*` deployment refs without duplicating the human review.
6. **Approval fallback — simpler CI:** allow direct `npm publish` and use a GitHub `npm-release` environment with Brian and Mike as reviewers; GitHub requires only one. Restrict it to selected `v*` tags and disallow admin bypass. Decide `Prevent self-review` explicitly: enable it for separation of duties (the initiator needs the other founder), or leave it off if “either Brian or Mike” includes self-approval. Build/upload the candidate before the environment-gated publish job so the reviewer can inspect what will ship.
7. **Registry tag finalization.** Before stable, stage/publish explicitly with `--tag latest`, then have the approving maintainer interactively run `npm dist-tag add @holaxis/aslite@${version} next`; verify both tags before declaring release complete. This is intentionally non-atomic and must be an explicit receipt. At `0.1.0`, publish `latest` and remove stale `next` until a real preview exists. Later previews publish `--tag next`; stable releases publish `--tag latest`.
8. **Post-publish proof.** Read the documented packument, verify version and tag(s), compare registry `dist.integrity`, verify npm signatures/attestations from a scratch lockfile (`npm audit signatures`), perform an isolated global install, run both bins, identity, skill/hook status, and `aslite mcp` startup. Only then publish the prepared GitHub draft release and close the release receipt.
9. **No-token posture.** After the first OIDC release succeeds, set npm publishing access to require 2FA and disallow traditional tokens, and revoke obsolete automation tokens. Brian and Mike retain interactive 2FA owner access for stage approval, dist-tag changes, deprecation, and emergency rollback.

## Recommended runtime/update contract

- `aslite --version` remains a terse SemVer projection. `aslite version` reports full local identity: release version, source commit, runtime executable SHA-256, distribution channel/evidence, executable/invocation path, and selected/default release track.
- `aslite version --check [--tag latest|next]` synchronously queries the abbreviated packument, validates bounded JSON and SemVer, considers deprecation as well as precedence, and reports `current`, `behind`, `ahead-or-unrecognized`, `deprecated`, or `unavailable`. It never mutates npm, skills, hooks, or MCP config.
- Recommended global command: `npm install --global @holaxis/aslite@latest`; preview opt-in: `...@next`; exact recovery: `...@<version>`. Verification then runs `aslite version`, `aslite skill status`, `aslite hook status`, and a bounded `aslite mcp` startup probe. Legacy cache-path MCP configuration receives migration guidance to bare `aslite mcp`, never a rewrite.
- Automatic orientation uses the same comparison primitive but only cached results. A stale/missing cache starts at most one background refresh and does not delay current output. Provide a product-specific suppression variable/config and consider also honoring npm's familiar `NO_UPDATE_NOTIFIER` convention; document precedence.

## Recommended rollback runbook

1. Freeze new release finalization and identify the last known-good exact version/integrity.
2. Interactively move `latest` and, when pre-stable, `next` to the known-good version; verify registry reads.
3. Deprecate the bad exact version with the known-good install command and issue/security URL.
4. Publish a new fixed version; never overwrite or reuse the bad version.
5. Use unpublish only for accidental sensitive/malicious publication that satisfies npm policy, not for ordinary defects.
6. Preserve all audit facts: bad/good versions, tag transitions, approver, registry integrity, Git tag/SHA, and user reconciliation command.

# Uncertainties

- **Approval placement:** choose npm stage-only approval (stronger, exact-candidate 2FA, two-phase finalization) versus direct OIDC publish behind GitHub environment approval (simpler, already matches the drafted domain wording). Do not layer both human gates unless two approvals are intentionally desired.
- **Self-review:** if using GitHub required reviewers, does “either Brian or Mike approves” allow the workflow initiator to approve? GitHub's `Prevent self-review` choice must be recorded.
- **0.1.0 `next` cutover:** remove `next` until a real next preview, or ensure a genuine post-stable preview exists at the stable release. Leaving it on an older prerelease is unsafe/misleading.
- **0.x compatibility taxonomy:** confirmed breaking changes advance the minor line, but decide where backward-compatible features land before 1.0 (patch versus a new minor). SemVer does not decide this for 0.y.z.
- **Explicit-check exit code:** orientation failures must always be non-fatal. For `aslite version --check`, decide whether registry timeout/unavailable returns exit 0 with structured `unavailable` or a runtime nonzero for scriptability; the body must never claim current when no comparison occurred.
- **Release-track persistence:** raw npm installs do not preserve whether a tarball was selected through `latest`, `next`, or an exact version. Decide explicit `--tag` only versus a user config written by a separate opt-in command; do not infer it from bytes.
- **Branch protection sequencing:** the current marketplace bot directly pushes main. Decide bot PR conversion/bypass/retirement before enforcing main protection required for trustworthy release automation.
- **First trusted publish:** npm does not validate trusted-publisher configuration when saved; errors appear only on attempted publish. Plan a protected real prerelease as the proof and keep the current manual route available only until it succeeds.

# Primary sources

- Trusted publishing requirements, exact workflow/environment mapping, token restriction, automatic provenance, OIDC limitations, and stage-only recommendation: https://docs.npmjs.com/trusted-publishers/
- Staged publishing approval, versions, tag immutability, explicit prerelease tags, and trust-token command scope: https://docs.npmjs.com/staged-publishing/ and https://docs.npmjs.com/cli/v11/commands/npm-stage/
- npm provenance/attestations and verification: https://docs.npmjs.com/generating-provenance-statements/
- GitHub required reviewers, one-of-many approval, self-review, ref restrictions, and admin bypass: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- GitHub tag rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- npm dist-tag semantics and convention: https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/ and https://docs.npmjs.com/adding-dist-tags-to-packages/
- npm global update convention: https://docs.npmjs.com/updating-packages-downloaded-from-the-registry/
- npm explicit tag/global install semantics: https://docs.npmjs.com/cli/install/
- npm immutability/unpublish policy: https://docs.npmjs.com/policies/unpublish/
- npm deprecation: https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/
- SemVer 0.x and prerelease precedence: https://semver.org/
- GitHub releases/tags: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases and https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
- GitHub immutable releases/release attestations: https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases and https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/prevent-release-changes
- GitHub artifact attestations (useful for separately downloadable recovery assets): https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
- npm public Registry API and abbreviated packument: https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md and https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
- npm update-notifier suppression precedent: https://docs.npmjs.com/cli/using-npm/config/
- Current package tags: https://registry.npmjs.org/-/package/%40holaxis%2Faslite/dist-tags
- Current package version/integrity/maintainers: https://registry.npmjs.org/%40holaxis%2Faslite/0.1.0-pre.2
- Current repository settings evidence: https://api.github.com/repos/Holaxis-ai/agentstate-lite/environments , https://api.github.com/repos/Holaxis-ai/agentstate-lite/rulesets , https://api.github.com/repos/Holaxis-ai/agentstate-lite/releases , and https://api.github.com/repos/Holaxis-ai/agentstate-lite/tags
