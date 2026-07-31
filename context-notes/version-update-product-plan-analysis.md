---
type: Context Note
title: Version update product and plan analysis
actor: codex-version-update-product-owner
timestamp: '2026-07-31T20:37:00.666Z'
---
# Summary

## Goal and verdict

- **Ultimate goal:** preserve agentstate-lite as the local-first, standards-clean, conflict-safe shared memory product while safely moving test-user distribution to npm.
- **Proximate goal:** validate and decompose the version/update and channel-transition work into independently reviewable units with actionable acceptance criteria. This serves the ultimate goal by preventing release identity, update discovery, and integration compatibility from becoming opaque or unsafe cross-session boundaries.
- **Verdict:** `tasks/version-string-channel-identity` is a strong umbrella problem statement but is not build-ready as one unit. It correctly names eight decision areas, the desired product outcome, important acceptance, and useful non-goals. It still combines policy, local identity, networked discovery, host-configuration diagnostics, release/deployment automation, human acceptance, documentation cutover, and rollback. One PR could not make one coherent behavioral claim or receive risk-proportionate review.

## Confirmed policy baseline

- Canonical current public release: `@holaxis/aslite@0.1.0-pre.2`.
- Supported installed journey: global npm; `npx` is a zero-install trial/bootstrap path, not the repeated-use authority.
- Until stable, use `0.1.0-pre.N`; both `latest` and `next` select the newest supported prerelease. After `0.1.0`, `latest` selects stable and `next` preview. A breaking pre-1.0 contract advances the minor line.
- Publishing is protected and may be approved by Brian or Mike, without bypassing build/test/package proof.
- Explicit discovery is read-only `aslite version --check`; AgentState prints an npm-owned upgrade command and never silently updates itself.
- Automatic notice is limited to human-orientation surfaces, uses a cached result immediately, refreshes at most daily, is bounded/non-fatal/offline-safe/suppressible, and never changes ordinary bundle-command output.
- Supported MCP configuration launches stable `aslite mcp`; legacy cache-path configuration receives explicit migration guidance and is never silently rewritten.
- The final working marketplace distribution becomes an immutable Git tag plus downloadable GitHub release before the live channel is deleted. It is recovery material, not a maintained update stream.

## Evidence from the current tree

- `packages/cli/src/cli.ts` owns only a SemVer string today: `--version`/`-v` print the build-time `__ASLITE_VERSION__`, sourced from `packages/cli/package.json` by `scripts/build-bundle.mjs`. There is no structured `version` command, source commit, channel, or byte fingerprint.
- `packages/cli/src/invocation.ts` already owns executable-path and PATH resolution plus a legacy plugin-path predicate. It does not prove an `npm-global`/`npx`/`local-dev` channel decision table.
- `skill status` already byte-compares manifested installed assets with the running package and reports `absent | unmanaged | installed | stale`; this is the foundation for skill compatibility, not work to rebuild.
- `hook status` currently reports per-host presence and a command. It does not report semantic compatibility/current/stale/legacy-path state.
- `mcp` exists as a stable CLI subcommand, but the repository has no general MCP-host configuration manager. Adding one would be new scope, not an implied mechanic.
- Home/session-start already have fail-soft, injectable orientation seams and a self-clearing hook notice. Any version notice must preserve their existing render-always and time-budget contracts rather than add awaited registry latency.
- `scripts/verify-npm-package.mjs` proves one exact packed tarball, one executable, both bins, offline bundle use, skill round-trips, and stable hook installation. It does not prove old-to-new registry upgrade, runtime identity agreement, supported-release discovery, or MCP startup after upgrade.
- There is no npm publish workflow and `git tag --list` is empty. The existing main-push automation is for marketplace artifact regeneration/versioning, not protected npm publishing.
- README and the shipped npm README already recommend npm and npx, but still describe the live marketplace as a temporary rollback channel. Final cutover/deletion wording remains gated.

## Missing decision rows needed before build

1. **Identity projection contract:** exact structured fields, `--version` backward compatibility, which surfaces display the full identity, and the agreement table all projections must satisfy.
2. **Fingerprint/channel mechanics:** how the executable-byte fingerprint is computed without self-reference; how `npm-global`, `npx`, `local-dev`, and `marketplace-legacy` are distinguished empirically; what state is reported when channel cannot be proven.
3. **Version transaction:** whether the version is changed in an ordinary reviewed PR before publish or assigned by the protected workflow; exact tag naming; build-once source SHA; GitHub Release/package ordering; failure recovery between steps.
4. **Pre-1.0 increment/cadence:** exact handling of fixes versus compatible additions inside a prerelease line, when `pre.N` advances, and whether releases are on-demand only.
5. **Bad-release policy:** which dist-tags move to which prior version, whether/when a bad release is deprecated, how the supported release is selected, and the prohibition/exception policy for unpublish.
6. **Discovery contract:** registry authority, selected tag per channel, timeout/budget, cache location/schema/TTL, corruption/concurrency behavior, suppression switch, CI/test behavior, and explicit-check exit/result semantics when offline.
7. **Upgrade receipt:** whether the printed install command is version-pinned or tag-based, exact post-upgrade verification commands, and receipt schema linking old/supported/resulting identity.
8. **Compatibility state table:** backward-compatible projection of skill states; semantic hook states and exact remedies; project/global scope; what MCP evidence is mechanically checked versus documented/proved.
9. **Operational proof:** exact old/new versions (`pre.2` to the next test release), clean-home/prefix conditions, fresh-shell/PATH conditions, Node/OS floor, required founder participation, unfamiliar-bundle actions, MCP handshake evidence, and offline step.
10. **Recovery artifact:** tag/release name, exact attached assets and checksums, installation/recovery instructions, and the independent retrieval proof required before deletion.

## Additional non-goals to record

- Do not rename the product/package/repository or publish core/server workspaces.
- Do not promise non-npm package managers or Windows in the initial update contract.
- Do not add a daemon, telemetry, mandatory startup registry request, npm lifecycle mutation, or a general self-update command.
- Do not make `npx skills add` or a moving `main` branch an installation authority.
- Do not add a general MCP-host configuration manager unless Brian/Mike explicitly choose that scope.
- Do not absorb unrelated installer hardening from `tasks/skill-installer-followups`; include an item only when the upgrade proof demonstrates it is required.
- Do not change bundle formats, storage, sync, remote hosting, recipes, or user bundle contents.
- Do not delete or stop maintaining the live marketplace channel until the old-to-new npm proof, npm-primary documentation, and independently recoverable frozen release all pass.

## Ownership reconciliation

- **`tasks/version-string-channel-identity` remains the umbrella owner** for release policy, one runtime/build identity, supported-release discovery, post-upgrade compatibility semantics, protected publishing, the old-to-new proof, and the gate that unblocks retirement. It should link a new Decision, reviewed Plan, and child implementation tasks rather than directly own one code PR.
- **`tasks/npm-cli-skill-prerelease` retains first-artifact/first-use ownership.** Its implemented claim (one npm package with one CLI plus optional explicit skill/hook installation) is already shipped. Its remaining human acceptance is the fresh-founder/unfamiliar-bundle first-use proof. Transfer its old “upgrade/reinstall without path expiry” line to the version/update umbrella and update its stale `pre.1`/dist-tag wording; do not make both tasks own the same upgrade receipt.
- **`tasks/npm-quickstart-onboarding` owns the literal new-user first-install journey** (install, skill/hook, recipe initialization, productive bundle), its command-chain test, and user-facing onboarding clarity. It does not own runtime identity, update selection, publish automation, or marketplace deletion.
- **`tasks/retire-marketplace-channel` stays blocked** until the version/update proof passes, npm is documented as primary, and the frozen recovery release is independently recoverable. It owns the gate handoff and deletion-focused PRs, not new version/update behavior.
- **`tasks/verify-npm-package` and `tasks/npm-package-identity` remain done.** Their shipped mechanisms/decisions are inputs. Extend the npm verifier under new child tasks rather than reopening the completed units. The coordinate decision remains authoritative for `@holaxis/aslite`; a new release-contract Decision must explicitly supersede only its now-conflicting working dist-tag wording (“next never advances latest”).
- **`tasks/skill-installer-followups` remains separate.** Its concurrency, unmanaged metadata, Windows, and host-discovery limitations are not silently pulled into this release unless the defined clean upgrade proof exposes one as a blocker.
- **`roadmap` needs reconciliation:** replace the older statement that the prerelease task owns all remaining proof/docs with the narrower split above. `roadmap-items/distribution-neutral-resources` already has the correct high-level order (version/update contract → founder upgrade proof → npm primary → deletion) and should contain/link each new child task.
- **Design boundaries:** `designs/npm-bundle-bootstrap` continues to own npm-as-sole-executable direction; `decisions/npm-interim-package-name` owns the coordinate; the new release Decision owns post-publish version/dist-tag/approval/rollback policy; `designs/version-update-domain-model` supplies vocabulary/invariants, not the final release authorization.

## Proposed units

### DAG

`D0 → I1 → {C2, U3, P5}`; `U3 → N4`; `{I1, C2} → Q6`; `{C2, U3, N4, P5, Q6} → E7 → D8`; `{E7, D8} → F9`; `E7 → G10`; `{D8, F9, G10} → X11`.

Design/test-fixture work for C2, U3, and P5 may proceed in parallel after D0, but each implementation branch should be cut from current `origin/main` after I1 merges. U3 and C2 may merge in either order only if their public output schemas are fixed in D0 and their files remain disjoint. Every stage containing QA has an explicit independent Review dependency before QA.

### D0 — release-contract Decision + reviewed implementation Plan (bundle deliverable, no code PR)

- **Claim/objective:** all policy and output/state tables are explicit, conflicts are superseded deliberately, and each later unit has one acceptance contract.
- **Roles/stages:** Product Owner + release-policy/identity architects → independent Plan Reviewer → Brian-or-Mike approval of the human rows. No build begins before approval.
- **Acceptance:** answers the ten missing rows above; records exact non-goals; names unit owners/dependencies/risk tiers; defines the agreement and compatibility tables; updates task/roadmap ownership and links without marking blocked proof complete.

### I1 — one immutable build-identity authority (PR)

- **Claim/objective:** every local identity projection is derived from one build identity and different executable bytes cannot present the same complete identity.
- **Acceptance:** one owning primitive exposes the D0 schema; package version, source commit, channel, executable path, and byte-distinguishing fingerprint agree across `aslite version`, retained `--version`, home/session diagnostics, packed npm, npx, local-dev, and temporary legacy fixtures according to the table; a byte mutation or stale dist turns the agreement gate red; identity is fully offline; verifier rejects package/embedded/generated-asset disagreement.
- **Risk/stages:** ordinary code, medium residual risk. Identity Builder → independent Reviewer of exact SHA/agreement-test provenance → repository gate. Dedicated QA is optional unless review finds an unpinned reachable channel.

### C2 — read-only integration compatibility diagnostics (PR)

- **Claim/objective:** skill, hook, and the bounded MCP launch contract expose actionable compatibility without rewriting host configuration.
- **Acceptance:** skill byte/manifest comparison is reused and projected compatibly; hook status distinguishes current semantic `aslite session-start`, actionable stale forms, unmanaged forms, and legacy cache paths with exact remedies; supported MCP evidence proves `aslite mcp` from PATH survives version replacement and legacy guidance is emitted at the D0-owned surface; project/global scopes and malformed/symlinked/partial states are covered; status/check paths perform zero config writes.
- **Risk/stages:** configuration/destructive-boundary adjacency, medium-high. Compatibility Builder → independent Reviewer → adversarial QA over malformed, partial, legacy, relocated-home, and no-mutation states → repository gate.

### U3 — explicit supported-release comparison (`aslite version --check`) (PR)

- **Claim/objective:** one read-only command accurately compares the running identity with the supported npm release and prints one exact npm-owned upgrade/verification journey.
- **Acceptance:** policy selects the correct dist-tag/version; results distinguish current/outdated/ahead/unsupported/unavailable without claiming current on failure; registry calls are bounded and injectable; offline use remains functional; exact upgrade command follows D0 (prefer an immutable selected version in the receipt); structured output names running and selected identity plus follow-ups; no installation/skill/hook/MCP config is changed; ordinary command bytes remain unchanged.
- **Risk/stages:** external release-selection boundary, high. Update Builder → independent Reviewer → adversarial QA with fake registry, black hole, malformed/malicious metadata, tag movement, cache corruption, and stdout/exit-code probes → repository gate.

### N4 — daily cached orientation notice (PR)

- **Claim/objective:** bare home/session-start can surface a known newer supported release without adding registry latency or affecting non-orientation output.
- **Acceptance:** cached-result-now behavior; refresh at most daily through a non-blocking/bounded mechanism; absent/stale/corrupt cache never produces an inaccurate notice or fails/delays render; explicit suppression and CI/test disablement; no notice on ordinary bundle commands or transport stdout; notice self-clears when current; concurrent sessions cannot corrupt state; session-start remains inside its existing budget and render-always guarantee.
- **Risk/stages:** timing/cache/reconnect boundary, high. Orientation Builder → independent Reviewer → adversarial QA for offline, hung network, process exit/interruption, concurrent starts, fake time, corrupt cache, and output parity → repository gate.

### P5 — protected single-source npm release automation (PR; publishing remains human-gated)

- **Claim/objective:** a protected action publishes exactly one reviewed source as a coherent npm/tag/release set and refuses any provenance disagreement.
- **Acceptance:** exact reviewed SHA is selected; version/tag/package/embedded identity/generated skill/references/tarball/docs claims agree; repository and exact-package gates pass; trusted publishing uses the protected environment with either Brian or Mike as approver; build-once artifact is promoted rather than rebuilt from moving `main`; dist-tags follow D0; duplicate/partial/failure cases fail closed with a documented retry/rollback runbook; dry-run produces inspectable receipts without publishing.
- **Risk/stages:** deployment/supply-chain boundary, high. Release Builder → independent security/release Reviewer → adversarial dry-run QA → explicit Brian-or-Mike approval before any live publish. Review is a hard predecessor of QA and deployment.

### Q6 — tested first-install quickstart (PR, owned by `tasks/npm-quickstart-onboarding`)

- **Claim/objective:** the literal npm-global first-use journey reaches a productive local work-tracking bundle; npx is taught only as trial/bootstrap.
- **Acceptance:** documented commands are executed literally from the packed package; skill/hook optionality and fresh-session restart are explicit; one unfamiliar bundle workflow performs an attributed mutation and opens/launches a View; npx reports npx/trial identity and does not become a persistent hook/skill authority; no marketplace path discovery is taught.
- **Risk/stages:** docs + command-contract test. Onboarding Builder → independent Reviewer focused on command provenance and one red probe → relevant automated gates. No separate QA unless the literal battery cannot represent the real host journey.

### E7 — publish the next test release and perform the clean old-to-new proof (operational evidence unit, not a code PR)

- **Claim/objective:** a real clean installation moves from canonical `pre.2` to the next protected release without path expiry or integration ambiguity.
- **Acceptance:** isolated HOME/npm prefix and fresh shell; install exact `pre.2`; record complete identity; install skill/hook and prove supported `aslite mcp` startup/handshake; run explicit check; execute the printed command; record changed identity/fingerprint; skill/hook states and exact convergence commands succeed; MCP still starts through PATH without config edits; offline bundle workflow succeeds after download; npx trial is separately identified; structured verification receipt is stored. Produce two distinct evidence conclusions: first-use/founder evidence for the prerelease task and old-to-new evidence for the version task.
- **Risk/stages:** live release acceptance. All code PRs must already have independent Review and required QA. Release QA operator executes the exact runbook; a founder performs the required unfamiliar-bundle judgment; no publication occurs without the P5 protected approval.

### D8 — npm-primary documentation cutover (PR)

- **Claim/objective:** every current user-facing source teaches one npm-global install/upgrade path and treats npx as trial, with no live cache-discovery instructions.
- **Acceptance:** README, npm README, generated help/skill, onboarding, and release guidance agree; exact `version --check`, selected upgrade command, compatibility follow-ups, and offline behavior are taught; marketplace is referenced only as the frozen recovery release; literal command-chain tests pass.
- **Risk/stages:** low docs/generated-projection change. Docs Builder → independent Reviewer → relevant drift/literal-command gates. No separate QA unless review finds execution drift.

### F9 — freeze and independently prove the final marketplace recovery release (operational evidence unit)

- **Claim/objective:** the last live marketplace state is immutable, downloadable, checksummed, and usable without preserving a live update channel.
- **Acceptance:** exact main SHA/plugin version/tag/release/assets/checksums/instructions recorded; an independent reviewer retrieves from the GitHub release rather than a working tree; recovery QA installs/launches it in isolation and records the result; Brian/Mike confirms this artifact is the rollback boundary. Release operation → independent Reviewer → recovery QA, in that order.

### G10 — transfer every surviving distribution invariant to npm gates (test-only PR)

- **Claim/objective:** deleting plugin checks cannot remove an unnamed safety property.
- **Acceptance:** before/after inventory maps every plugin build/drift/version/resolver test to an npm verifier/identity/release gate or records why it is obsolete; retained tests are derived from pre-deletion behavior where parity matters; reviewer samples the provenance and forces one gate red; no runtime behavior changes.
- **Risk/stages:** behavior-preserving mechanical test unit. Test Builder → independent Reviewer focused on contract provenance/red probe → repository gate. No separate QA unless the parity contract cannot cover a reachable state.

### X11 — delete the live marketplace channel (deletion-focused PR, owned by `tasks/retire-marketplace-channel`)

- **Claim/objective:** the repository no longer builds, publishes, resolves, or maintains a duplicate marketplace executable; npm remains fully functional and the frozen release is the only rollback material.
- **Acceptance:** remove committed plugin executable/shim, live manifests, plugin build/drift/version bot workflow, cache resolvers/tests, dual render/regeneration branches, and live-channel docs; repository search finds no AgentState runtime cache discovery; clean root build/check and exact npm verification pass; npm skill/hook/MCP/upgrade journey remains green; frozen release recovery is rechecked; line/file reduction distinguishes generated bytes from maintained source/tests.
- **Risk/stages:** consequential deletion/release-boundary change, high. Deletion Builder → independent Reviewer of exact inventories/SHA → adversarial QA from a clean checkout plus frozen-release recovery → merge. QA and merge are forbidden before Review.

## Acceptance matrix

| Requirement / policy | Owning unit(s) | Acceptance evidence |
|---|---|---|
| Recorded answers to all eight task questions | D0 | Approved Decision table + reviewed Plan; links from umbrella task |
| Canonical `pre.2`, prerelease/stable dist-tag policy | D0, P5 | Decision + workflow policy tests and release receipt |
| One complete runtime identity; changed bytes cannot share it | I1 | Cross-surface agreement table; stale-dist and byte-mutation red probes |
| npm-global authority; npx trial/bootstrap | I1, Q6, E7 | Empirical channel fixtures + literal quickstart + live receipts |
| Accurate explicit current/outdated check and exact command | U3 | Fake-registry matrix + structured receipt + exact command test |
| Daily cached, bounded, suppressible orientation-only notice | N4 | Fake-time/black-hole/concurrency tests; non-orientation byte parity |
| Offline commands remain functional and cannot fail due to update discovery | U3, N4, E7 | Offline/error matrix + post-download offline live workflow |
| Skill status identifies actionable post-upgrade mismatch | C2, E7 | Manifest/byte state table + real old-to-new receipt |
| Hook status identifies semantic/legacy mismatch without mutation | C2, E7 | Host-state matrix + no-write proofs + real upgrade receipt |
| Stable `aslite mcp`; legacy cache path gets explicit guidance | D0, C2, E7, D8 | Scope decision + PATH-start/handshake + guidance text; no silent edits |
| Single release source and protected Brian-or-Mike publish | I1, P5 | Identity/package gate + protected workflow/dry-run/live receipt |
| Tag/commit/package/generated assets/docs agree | I1, P5 | Failing mismatch probes + immutable published receipt |
| Clean old-to-new test release proof | E7 | Stored verification receipt from exact `pre.2` to next release |
| First-use founder/unfamiliar-bundle proof not duplicated | Q6, E7 | Separate first-use conclusion attached to prerelease task |
| Docs stop teaching marketplace cache discovery | Q6, D8, X11 | Repository/generated-doc search + literal command tests |
| Frozen final marketplace rollback before deletion | F9, X11 | Independent retrieval/install evidence + deletion dependency |
| No silent self/config mutation | C2, U3, N4, E7 | Filesystem snapshots/no-write tests; only package-manager command is user-run |
| Narrow existing version-string finding is resolved coherently | I1 | Old `cliVersion` projection is subsumed by one identity primitive, not patched separately |
| Every QA/deploy follows independent Review | all risked units | Explicit stage dependencies above; no Build→QA edge exists |

## Open questions

### Brian/Mike decisions still required

1. **Version/tag transaction:** reviewed version-bump PR before protected publish, or a protected workflow that assigns/commits the version? Also approve exact tag naming and on-demand cadence.
2. **Bad-release rollback:** confirm the exact rule for moving `latest`/`next`, deprecating the bad version, choosing the prior supported version, and whether unpublish is categorically excluded.
3. **Pre-1.0 increments:** confirm how fixes and compatible additions advance `pre.N` versus a patch/minor line; only breaking-change minor advancement is currently explicit.
4. **MCP legacy detection surface:** is documented/release-receipt guidance plus stable-PATH startup proof sufficient, or must the CLI inspect named host MCP config files? The latter is a new configuration-manager scope and should not be inferred.
5. **Founder proof sufficiency:** must both founders perform inverse-direction clean journeys, or is one founder plus the automated isolated proof enough for release and retirement?
6. **Frozen release shape:** approve final tag/release naming and the minimum attached artifact/checksum/install-instruction set that qualifies as independently recoverable.

### Technical choices the Decision/Plan reviewers can resolve without expanding product scope

- Full identity output schema and backward compatibility of `--version`.
- Self-fingerprint method and empirical channel-detection decision table.
- Registry endpoint/client, exact timeout, cache path/schema, suppression variable, and corruption/concurrency strategy.
- Explicit-check unavailable/ahead/unsupported exit/result semantics and whether a check refresh may update only the public metadata cache while remaining read-only with respect to installation/configuration.
- Exact version-pinned upgrade/verification receipt shape and unit fixture layout.

## Progress

Analysis complete. No code or existing task/roadmap/plan/decision document was modified. This note is the only bundle write; `sync` was not run.
