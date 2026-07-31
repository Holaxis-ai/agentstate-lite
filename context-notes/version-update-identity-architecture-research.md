---
type: Context Note
title: Identity/update architecture research
actor: codex-identity-architecture-researcher
timestamp: '2026-07-31T20:36:39.313Z'
---
# Summary

- **Status:** completed.
- **Ultimate goal:** make agentstate-lite a reliable, local-first, user-owned shared memory for agents and humans.
- **Proximate goal:** map every current build/release identity projection and define the narrowest owning identity/update seam; this serves the ultimate goal by making the collaboration substrate diagnosable and safely upgradeable across sessions.
- **Principal finding:** there is no single runtime identity contract. `--version`, skill status, plugin manifests, hook recognition, MCP initialize metadata, emitted invocations, and docs each derive different subsets from different authorities.
- **Required implementation shape:** introduce one versioned `BuildIdentityV1` owner for local facts and one update-policy owner that consumes it. Do not make identity construction perform network access.

# System model

## Existing authorities and projections

1. **Package/build input.** `packages/cli/package.json:1-3` says `@holaxis/aslite` `0.1.0-pre.2`. `packages/cli/scripts/build-bundle.mjs:18-22,29-46` reads that package version and injects only `__ASLITE_VERSION__` into every esbuild artifact.
2. **CLI version.** `packages/cli/src/cli.ts:54-75` returns the baked literal, but source-mode fallback independently reads adjacent `package.json`; `packages/cli/src/cli.ts:231-235` makes `--version`/`-v` print only that string. There is no source commit, artifact hash, distribution fact, executable path, compatibility contract, or update state.
3. **Runtime path/invocation.** `packages/cli/src/invocation.ts:45-69` resolves the current executable and tests whether either bin name resolves to it on PATH. `packages/cli/src/invocation.ts:81-100` guesses the legacy skill channel solely from `scripts/agentstate-lite.mjs`, otherwise emitting bare PATH name or `npx -y @holaxis/aslite`. `packages/cli/src/invocation.ts:107-120` separately projects absolute bin path and persistent-hook base. This is useful launch context, but it is not an artifact identity.
4. **Dev launcher/stale dist.** Root `aslite:1-7` always executes ignored `packages/cli/dist/agentstate-lite.mjs`; `.gitignore:1-3` ignores all `dist/`. The build deletes/recreates that directory (`packages/cli/build.mjs:30-46`), but nothing prevents source/package changes from coexisting with an older local dist.
5. **Home/session-start.** `packages/cli/src/commands/home.ts:590-619` identifies only `bin` and a description; `home.ts:697-700` adds only the old-hook prompt. `packages/cli/src/commands/session-start.ts:302-335` delegates to home, so it inherits the same omissions. Existing home tests at `packages/cli/test/home.test.ts:95-143` pin header presence/order, not build identity or update state.
6. **Skill assets/status.** `packages/cli/src/commands/skill.ts:121-154` independently resolves adjacent assets and reads adjacent `package.json` for its running version; `skill.ts:85-103,274-280` writes a manifest containing package/version/files; `skill.ts:467-499,563-570` byte-compares installed files and reports `absent|unmanaged|stale|installed`. This path does not consume `cliVersion()`, so adjacent assets and executable bytes can disagree.
7. **Hooks.** `packages/cli/src/commands/hook.ts:80-103` claims every command containing the substring `agentstate-lite`, plus first-token `aslite`; `hook.ts:125-133` asserts writer/recognizer agreement. Status (`hook.ts:267-285,677-710`) reports installed booleans and one display command, not compatibility. `hookNeedsUpdate` (`hook.ts:576-597`) asks only whether a claimed command includes `session-start`; it cannot distinguish current, stale, unmanaged, or legacy-path-bound hooks.
8. **MCP.** The CLI dependency surface accepts `version?: string` (`packages/cli/src/commands/mcp.ts:39-49`), but startup omits it (`mcp.ts:92-102`). The server therefore publishes fallback `0.0.1` (`packages/mcp-app/src/server.ts:428-440`) regardless of the executable. `packages/cli/test/mcp.test.ts:33-60` does not assert version, and `packages/cli/test/mcp-stdio.test.ts:40-99` proves tools/transport but not initialize identity.
9. **User state/cache.** Existing local process state consistently lives under `~/.agentstate`: credentials/config (`packages/cli/src/credentials.ts:35-46`), sync cursors (`packages/cli/src/cursor.ts:47-57`), catalog (`packages/cli/src/catalog.ts:11-13,61-70`), View authorization (`packages/cli/src/ui/view-authorizations.ts:10,43-70`), and UI URL (`packages/cli/src/ui/url-file.ts:19-29`). `packages/cli/src/credentials.ts:48-87` is the existing atomic 0700-directory/0600-file writer and explicitly says not to fork that security primitive.
10. **Npm package proof.** `scripts/verify-npm-package.mjs:13-17,69-95` pins an exact one-bundle tarball shape; `:175-234` rebuilds/packs/offline-installs; `:236-275` proves skill bytes and both bin aliases; `:319-357` proves installed skill status/manifest version; `:434-468` proves the stable hook command. It never asserts package manifest == runtime full identity, runtime hash == installed bytes, MCP initialize version, or a release tag/commit.
11. **Legacy plugin channel.** `.claude-plugin/marketplace.json:8` and `plugins/agentstate-lite/.claude-plugin/plugin.json:3` carry independent marketplace version `1.0.134`. `scripts/ci-version-bundle.mjs:42-84,115-125,201-238` regenerates watched artifacts and bumps that manifest only when generated bytes change. The bundle itself embeds npm SemVer, not the marketplace manifest version. `scripts/ci-version-bundle.test.mjs:297-315` checks deterministic bytes and absence of marketplace version, not full build identity.
12. **Workflows/releases.** `.github/workflows/ci-tests.yml:29-31,70-71,93-105` checks plugin drift and npm packaging but not identity agreement. `.github/workflows/ci-version-bundle.yml:30-77` is a main-push plugin bot. There is no npm publish/trusted-publishing/tag workflow, and `git tag --list` returned no tags at HEAD `8b7cefe8ca5c5df5527296fbd77bc17f4d31288c`.
13. **Generated docs/skills.** `packages/cli/src/skill-render.ts:23-34,608-665,801-843` knowingly renders separate npm and plugin channels from one source, but npm skill installation uses untagged `npm install -g @holaxis/aslite`, while README prerelease guidance uses `@next` (`README.md:14-33`; `packages/cli/README.md:10-16,27-34`). `packages/cli/scripts/gen-skill.mjs:137-166` pins generator drift, not release-identity agreement. Plugin prose says behavior/output are identical even though release vintages and bytes can differ.

## Empirical disagreement in the clean code worktree

- `./aslite --version` and `node packages/cli/dist/agentstate-lite.mjs --version` both printed `0.1.0-pre.1`; the plugin shim printed `0.1.0-pre.2`.
- `AGENTSTATE_LITE_NO_AUTOPULL=1 ./aslite skill status --scope global --json` reported running asset version `0.1.0-pre.2`, while both installed host skills were stale at `0.1.0-pre.1`. Thus one process says pre.1 through `--version` and pre.2 through `skill status`.
- SHA-256 differs: local dist `4be5ad9d373f766a55041366d4f89dfde025cd38323de7a4e91f91e5623c1112`; plugin bundle `ea7d76f1a9e816a8615724e3dc85ee813d572ee1654a917d6fe43b1171a3a0e7`.
- `AGENTSTATE_LITE_NO_AUTOPULL=1 ./aslite --json` exposed only the stale executable path, not version/channel/commit/hash, and emitted npm fallback commands; it also emitted `hook_update`.
- `AGENTSTATE_LITE_NO_AUTOPULL=1 ./aslite hook status --scope global --json` claimed an unrelated `printf ...` SessionStart hook because its instructional prose contained `project agentstate-lite bundle`. This proves the broad marker rule creates false ownership and a false home update nag.
- `git status --short` emitted nothing; the stale dist is invisible because `dist/` is ignored.

# Agreement table

| Surface | Current fact source | Required projection from the owning contract | Primary seam/test |
|---|---|---|---|
| Build output | package SemVer define only | schema, package, release SemVer, source commit/dirty state, artifact channel, compatibility-contract version | build-bundle define test |
| `--version`/`-v` | `cliVersion()` | backward-compatible SemVer projection exactly equal to `BuildIdentityV1.release.version` | version unit + built CLI agreement |
| `version [--json]` | absent | complete identity, executable/fingerprint, launch mode/confidence; optional check result | new command contract tests |
| Home/`--json` | `binPath()` only | concise identity + cached update orientation; never corrupt structured stdout | injected home deps + render snapshots |
| Session-start | delegates to home | same identity/update projection after sync | session-start/home agreement test |
| Skill manifest/status | adjacent package/assets | identity/compatibility manifest plus byte state; version must come from running identity | skill fixtures, including stale local dist |
| Hook install/status/home | path composer + substring marker | semantic compatibility state and exact repair command from one classifier | writer/classifier table |
| MCP initialize | fallback `0.0.1` | exact running release version (and contract metadata if protocol permits) | stdio client server-info assertion |
| Emitted invocation/help | PATH/path guesses | launch mode and copy-paste command derived from identity runtime context | invocation table + source guard |
| Update cache | absent | schema/checked-at/channel/latest/supported/upgrade command/error, atomically stored outside bundle | cache/TTL/offline/concurrency tests |
| Npm tarball/global install | package manifest + file allowlist | manifest/runtime/hash/skill/hook/MCP agreement for installed bytes and both aliases | extend verify-npm-package |
| Legacy plugin | marketplace version + npm SemVer in bytes | `marketplace-legacy` artifact channel, build commit, runtime fingerprint; marketplace version remains channel metadata | plugin bot and copied-layout tests |
| README/package README/SKILLs | renderer plus handwritten prose | commands/dist-tag policy generated or agreement-tested against release policy | doc drift + command execution tests |
| Tag/release/npm dist-tags | no workflow/tags | one approved tagged commit authorizes exactly one package/skill/docs identity | release-workflow dry-run/policy tests |

# Proposed seam

## 1. One local identity owner

Add `packages/cli/src/build-identity.ts` as the only producer of a versioned `BuildIdentityV1`. Build scripts inject one JSON object (for example `__ASLITE_BUILD_IDENTITY__`) rather than scattered literals. A minimal contract should contain:

- `schema_version` and `compatibility_contract_version`;
- `release.package` and canonical SemVer;
- `source.commit` and an explicit dirty/unknown state for development builds;
- immutable `artifact.channel` (`npm-package`, `marketplace-legacy`, `local-dev`, or explicit `unknown`);
- runtime `executable_path`, `artifact_sha256`, `invocation`, and `launch_mode` with confidence.

Compute SHA-256 lazily from the actual executable bytes. Do not try to embed the bundle's own final hash in itself. Fail closed to `unknown` where evidence is absent.

Important domain refinement: `npx` versus `npm-global` is a **launch mode**, not an immutable fact in identical npm tarball bytes. The same artifact can be globally installed, npx-cached, copied, or directly invoked. Preserve a distribution-channel field if the public model requires it, but separate artifact channel from launch mode and never infer certainty solely from a cache-looking path.

`cliVersion()` becomes only a compatibility projection over this owner. `currentExecutableRealPath`, PATH-bin matching, and invocation composition remain low-level runtime inputs but are consumed once. `resolveSkillAssets` must stop rereading package version as a second authority.

## 2. One update-policy owner, consuming identity

Add a separate update service responsible for supported-channel metadata, TTL, prerelease ordering, upgrade-command selection, and nonfatal errors. Store a dedicated versioned record such as `~/.agentstate/update-check.json` through the existing `credentialsDir()` + `writeFileAtomic0600()` primitive. Keep it out of the OKF bundle, cursor files, npm cache, stdout protocols, and build identity.

`aslite version --check [--json]` performs an explicit check. Home/session-start reads cached truth and may use an established safe notifier/refresher pattern, but must remain fast, nonfatal, CI-aware, and output-pure. The release-policy owner—not README prose—chooses exact commands such as `npm install -g @holaxis/aslite@next` during prerelease.

## 3. Compatibility classifiers

- **Skill:** extend `.aslite-skill.json` with identity schema/compatibility contract and asset hashes. Status combines manifest compatibility with byte comparison and returns `absent|current|stale|unmanaged`; same SemVer with different bytes must be stale.
- **Hook:** replace arbitrary substring ownership with a tokenized/normalized classifier shared by compose/install/status/home. Recognize exact supported bin forms and known legacy bundle shapes. Return `absent|current|stale|unmanaged|legacy-path-bound`, plus reason and exact repair command. A foreign command merely mentioning the project must be unmanaged.
- **MCP:** pass `BuildIdentityV1.release.version` into `startMcpStdioServer`. Document/test durable host config as `command: aslite`, args beginning `mcp`; avoid versioned plugin-cache or worktree paths. The existing production note confirms a global Codex config currently uses `/opt/homebrew/bin/aslite` at pre.1, so version orientation needs to reveal that stale executable without managing arbitrary host configuration.

## 4. Release and legacy-channel boundary

The release workflow should obtain the identity once from the approved tag/commit, build the npm artifact and adjacent skill, run the full package proof, publish with provenance/trusted publishing after protected approval, and verify dist-tags. Until marketplace retirement, the plugin bot must stamp `marketplace-legacy` plus the source commit/fingerprint while keeping marketplace `1.0.x` explicitly separate from npm release SemVer. A plugin manifest bump is not a new npm release.

# Tests

## Unit/contract

1. Build identity parser/projection: injected production object, source-run development object, missing facts fail closed, SHA-256 matches exact executable, both aliases return the same identity.
2. Agreement: `--version` and `-v` exactly equal `version --json.release.version`; home and session-start expose the same identity; MCP receives the same release version.
3. Stale local dist fixture: adjacent `package.json=pre.2` plus baked executable `pre.1` must report pre.1 everywhere and expose source/artifact drift; skill status must not silently switch to pre.2.
4. Same-SemVer collision: two byte-distinct artifacts with equal SemVer have distinct fingerprints and cannot be treated as identical/current.
5. Invocation matrix: PATH bin, direct npm dist, npx cache, local dev, plugin cache, copied artifact, missing realpath. Assert honest channel/launch-mode/confidence and copy-paste command.
6. Hook classifier table: every composer output is current; pre-session-start is stale; absolute plugin-cache/worktree paths are legacy-path-bound; hand-authored supported commands follow policy; `printf ... agentstate-lite ...` and argument-only mentions are unmanaged.
7. Skill matrix: absent/unmanaged/current/stale, contract-version mismatch, manifest corruption, same SemVer changed bytes, interrupted install, upgrade between scratch distributions.
8. Update service: SemVer/prerelease ordering, supported dist-tag selection, exact upgrade command, fresh/stale TTL, corrupt cache, offline/timeout/registry error, CI suppression, explicit check behavior, atomic concurrent writers, and no stdout pollution.

## Integration/agreement

9. Extend `mcp.test.ts` to assert the CLI passes identity version; extend `mcp-stdio.test.ts` to assert initialize server info equals the built CLI identity.
10. Extend `verify-npm-package.mjs`: installed package manifest == `version --json`; runtime fingerprint hashes the installed `.mjs`; `aslite` and `agentstate-lite` identities agree; skill manifest/status, hook command/classifier, and MCP initialize all agree; no network after isolated install.
11. Extend plugin bot tests: two builds are deterministic; manifest records build commit/channel; changed bytes under unchanged npm SemVer yield a new fingerprint; both marketplace manifests and runtime identity agree without conflating marketplace version with release version.
12. Generator/docs agreement: npm and plugin SKILLs plus both READMEs use release-policy-approved install/check/upgrade commands; prerelease guidance cannot accidentally switch from `@next` to untagged `latest`; referenced commands execute in clean fixtures.
13. Release workflow fixtures/dry-run: reject tag/package/build/docs mismatch, unapproved actor/environment, wrong dist-tag, missing provenance, dirty source, or package proof failure; verify published metadata after release.

## End-to-end

14. Clean-machine old-to-new flow: install prior npm prerelease, install skill/hook, configure MCP with stable `aslite mcp`, publish/install candidate, verify update orientation, upgrade command, skill/hook compatibility repair, MCP server version, absence of cache-bound persistent paths, and rollback.

# Risks (ranked)

1. **Critical — contradictory identity in one process.** The current stale dist empirically reports pre.1 while skill status reports running pre.2. Any updater built on only one projection can recommend or suppress the wrong action.
2. **Critical — false hook ownership can rewrite user configuration.** Arbitrary substring matching currently claims a foreign `printf` command and triggers a false update prompt. An install/uninstall path could consequently mutate/remove configuration it does not own.
3. **High — MCP advertises false version `0.0.1`.** Hosts cannot correlate server behavior with installed CLI release.
4. **High — same-SemVer, different-byte plugin artifacts.** Main-push bot rebuilds/bump marketplace metadata while npm SemVer stays fixed, so multiple byte vintages claim the same incomplete CLI version. Commit and fingerprint are required until retirement.
5. **High — no release authorization workflow or tags.** Package proof is strong for shape/behavior but does not establish who authorized which commit/version or what dist-tag is supported.
6. **High — channel overclaiming.** Treating `npx`/global as immutable build channel encourages brittle cache-path parsing and can persist short-lived paths into hooks/MCP config.
7. **Medium — skill version has a second authority.** Adjacent package reads can conceal stale executable bytes; byte state alone lacks compatibility-contract meaning.
8. **Medium — docs can choose the wrong prerelease tag.** Generated npm SKILL uses untagged install while README uses `@next`; future `latest`/`next` divergence would create inconsistent upgrades.
9. **Medium — update checks can damage CLI reliability.** Network work on hot paths, cache corruption, or stdout leakage would break session latency and MCP/JSON protocols unless isolated behind the update service.

# Gaps

- No registry/network research was performed in this architecture pass; supported dist-tag and release authorization policy should come from the parallel release-policy research.
- Exact GitHub trusted-publishing environment/protection names do not exist yet and require repository-owner policy decisions.
- Exact compatibility-contract versioning rules need product acceptance (what changes force skill/hook repair versus merely a newer release).
- Detecting literal `npx` launch from inside identical package bytes is not reliably possible after Node starts; the schema must permit unknown/inferred launch mode or accept wrapper-provided evidence.

# Confidence

- **High** on current-code topology, contradictory runtime projections, stale-dist hazard, hook false positive, MCP fallback, package/plugin/workflow gaps, and the proposed ownership boundary.
- **Medium-high** on the exact public identity schema names; the artifact-channel/launch-mode split is technically necessary, but product vocabulary may be adjusted.
- **Medium** on update-refresh timing and release-workflow details because those depend on policy work outside this read-only architecture assignment.
