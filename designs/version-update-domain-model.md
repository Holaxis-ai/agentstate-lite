---
type: Design
title: 'Domain model: release identity, update discovery, compatibility, and rollback'
actor: openai/codex
timestamp: '2026-07-31T21:13:41.191Z'
---
# Purpose

Provide one shared vocabulary for designing, implementing, reviewing, and proving AgentState's release identity and update contract. This model serves the ultimate product goal by making the installed collaboration substrate identifiable, supportable, and safely upgradeable across agent sessions.

# Terms

- **Release version:** The SemVer published as `@holaxis/aslite` package metadata, currently `0.1.0-pre.2`.
- **Supported release:** The exact package version selected by the default `latest` policy after required proof. Before stable, `latest` and `next` coincide at rest; during a bounded release transaction `next` may instead name an explicit preview candidate.
- **Release track:** A mutable policy selector (`latest` or `next`). It is chosen by policy/user command and cannot be inferred from installed bytes. `latest` is the passive/default track; `next` is explicit.
- **Build identity:** Immutable build facts about the executable: release version, source commit/cleanliness, artifact channel, and per-integration compatibility-contract versions.
- **Artifact channel:** Where the executable artifact was produced: `npm-package`, `local-dev`, temporary `marketplace-legacy`, or `unknown`.
- **Launch mode/evidence:** Runtime observations about how the bytes were invoked (for example PATH shim, direct path, or probable npx), plus confidence. This is not artifact channel and may be `unknown`.
- **Artifact fingerprint:** SHA-256 of the actual running executable file, distinguishing different bytes even when SemVer is equal.
- **Complete runtime identity:** Build identity enriched with runtime fingerprint, resolved executable path, invocation/launch evidence, and any explicit drift findings.
- **Identity projection:** Any surface that reports or consumes identity, including `--version`, `version`, home/session-start, skill manifests/status, MCP startup, diagnostics, release receipts, and tests.
- **Update discovery:** Read-only comparison between complete runtime identity and the supported release selected by an explicit/default release track.
- **Explicit check:** `aslite version --check [--tag latest|next]`; it fetches current public registry metadata now and reports a structured result without modifying installation or configuration.
- **Orientation notice:** A non-fatal notice on bare home/session-start. It renders cached knowledge immediately and refreshes at most daily without delaying work.
- **Upgrade action:** The exact version-pinned package-manager command printed to the user, followed by verification and integration reconciliation commands. AgentState does not execute npm or silently modify itself.
- **Integration asset:** An installation-adjacent surface that may outlive executable bytes: Agent Skill, SessionStart hook, or MCP host configuration.
- **Compatibility state:** Additive evidence about whether an integration asset is `absent`, `current`, `stale`, `unmanaged`, `legacy-path-bound`, or built for a newer contract, without replacing existing public state fields.
- **Release authority:** The protected stage-only npm trusted-publishing path plus one approval/rejection by either Brian or Mike with npm 2FA and a separate no-rebuild finalizer keyed by immutable stage/run/artifact identifiers.
- **Release source:** One reviewed commit/tag/package version/build-input set from which the npm tarball, generated skill, release record, and documentation claims derive.
- **Rollback artifact:** The immutable Git tag and non-latest GitHub release preserving the last working marketplace distribution before live deletion. It is recovery material, not an update stream.
- **Release candidate:** Exact retained `.tgz` built/packed once after source gates and identified by source tag/SHA, npm integrity, tarball SHA-256, workflow run/artifact ID, and (after staging) npm stage ID.
- **Verification receipt:** Structured evidence naming old identity, selected track/release, exact command, resulting identity, integration compatibility, immutable release identifiers, and proof outcomes.

# Invariants

1. One owning build-identity primitive feeds every identity projection; projections format it but never reconstruct it independently.
2. Different executable bytes cannot truthfully present the same complete runtime identity, even when release version matches.
3. Artifact channel, launch evidence, and release track remain separate. Unknown evidence stays unknown.
4. `0.1.0-pre.2` is canonical now. A stale local `dist` reporting `pre.1` is diagnosed, never allowed to borrow the adjacent manifest's newer version.
5. Ordinary bundle commands are offline-first and output-stable: no registry wait and no unsolicited text on structured/protocol stdout.
6. Explicit and passive discovery are bounded and unable to mutate npm, skills, hooks, MCP host configuration, or bundles. Passive failure cannot fail/delay orientation; structured home JSON, ordinary commands, and protocol output never receive passive work or notice.
7. Agent Skill compatibility compares manifested bytes/contract with running identity. One exact/tokenized hook ownership authority governs status and every mutator. Supported MCP configuration calls stable `aslite mcp`; the CLI proves the launch contract but does not claim arbitrary host-config inspection.
8. An npm upgrade never silently rewrites integration assets. Status/receipts expose the state and exact explicit follow-up.
9. Publishing is impossible unless version, build-time identity, generated assets, source tag/commit, retained tarball, and documentation claims agree. Release verification and finalization never rebuild/repack the production candidate.
10. Either Brian or Mike may approve the exact staged candidate; approval never bypasses build/test/package proof.
11. Pre-stable `latest == next` is an explicit temporary at-rest exception. During prerelease proof `latest` may remain supported while `next` names an explicit candidate. At stable, stale `next` is removed until a genuine preview exists.
12. Marketplace retirement waits for old-to-new npm proof, npm-primary docs, transferred gates, and an independently recoverable frozen artifact.

# Lifecycle

1. A reviewed release-preparation PR assigns SemVer and compatible generated claims in a gate-clean source commit.
2. After repository/publisher protection preflight, a protected annotated `v<version>` selects that commit. Source gates run; then one production candidate is built/packed once, verified by retained path, and staged through OIDC.
3. The stage run ends with immutable identifiers. Brian or Mike downloads and rejects or approves with npm 2FA. A separate explicitly dispatched finalizer verifies without rebuilding and records registry/tag/release state.
4. Installed CLIs report complete runtime identity locally. Default orientation may show a cached latest-track result and detach a background refresh; JSON/protocol/ordinary output remains stable.
5. `aslite version --check` compares default `latest` or explicit `next`; exact dist-tag target controls forward or rollback reconciliation.
6. The user runs the exact version-pinned npm command. Stable PATH commands continue to resolve new bytes without changing supported hook/MCP launch commands.
7. The user verifies identity and explicitly reconciles skill/hook compatibility if needed; MCP is proven through stable argv/handshake rather than arbitrary config scanning.
8. A bad public release is removed from supported/candidate tags, deprecated with recovery guidance, and replaced by a new version; a failed stage is rejected before publication. Immutable audit evidence remains.

# Boundaries

- No daemon, silent self-update, postinstall configuration mutation, telemetry, bundle-format/storage/hosting change, or general MCP configuration manager.
- npm-global is the supported repeated-use authority. `npx` is read-only trial/bootstrap and may be distinguishable only when runtime evidence permits; persistent npm-package skill/hook install requires the current executable to resolve through a managed PATH bin. Other package managers are not promised initially.
- `aslite update` remains reserved for a future command that actually mutates an installation.
- The marketplace recovery release is frozen, non-latest emergency material and retains no live cache-resolution or dual-release automation.
