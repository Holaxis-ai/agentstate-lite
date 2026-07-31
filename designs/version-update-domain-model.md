---
type: Design
title: 'Domain model: release identity, update discovery, compatibility, and rollback'
actor: openai/codex
timestamp: '2026-07-31T20:22:21.051Z'
---
# Purpose

Provide one shared vocabulary for designing, implementing, reviewing, and proving AgentState's release identity and update contract. This model serves the ultimate product goal by making the installed collaboration substrate identifiable, supportable, and safely upgradeable across agent sessions.

# Terms

- **Release version:** The SemVer published as `@holaxis/aslite` package metadata, currently `0.1.0-pre.2`.
- **Supported release:** The release selected by AgentState policy for an installed channel. Before `0.1.0`, `latest` and `next` both select the newest supported prerelease; after `0.1.0`, `latest` selects stable and `next` selects preview.
- **Build identity:** The immutable facts about the running executable: release version, source commit, distribution channel, artifact fingerprint, and executable path.
- **Distribution channel:** How executable bytes arrived: `npm-global`, `npx`, `local-dev`, or temporary `marketplace-legacy`.
- **Artifact fingerprint:** A content-derived identifier strong enough to distinguish different executable bytes even when their SemVer is the same.
- **Identity projection:** Any public surface that reports or consumes identity, including `--version`, `version`, home/session-start, skill manifests/status, diagnostics, release receipts, and tests.
- **Update discovery:** Read-only comparison between the running build identity and the supported release selected by policy.
- **Explicit check:** `aslite version --check`; it fetches current supported-release metadata now and reports a structured result without modifying the installation.
- **Orientation notice:** A non-fatal update notice on bare home/session-start. It shows a cached result immediately and refreshes at most daily without delaying ordinary work.
- **Upgrade action:** The exact package-manager-owned command printed to the user, followed by verification and integration reconciliation commands. AgentState does not execute npm or silently modify itself.
- **Integration asset:** An installation-adjacent surface that may outlive executable bytes: the Agent Skill, SessionStart hook, or MCP host configuration.
- **Compatibility state:** Whether an integration asset is absent, current, stale/actionable, unmanaged, or legacy-path-bound relative to the running build/contract.
- **Release authority:** GitHub Actions trusted publishing, gated by repository checks and protected human approval from either Brian or Mike.
- **Release source:** The one commit/tag/package version/build-input set from which npm package, generated skill, release record, and documentation claims are derived.
- **Rollback artifact:** The immutable Git tag and downloadable GitHub release preserving the last working marketplace distribution before the live duplicate channel is deleted. It is recovery material, not an update stream.
- **Verification receipt:** Structured evidence naming the old identity, selected supported identity, exact recommended command, resulting identity, integration compatibility, and proof outcomes.

# Invariants

1. One owning build-identity primitive feeds every identity projection; projections may format it but may not reconstruct it independently.
2. Different executable bytes cannot truthfully present the same complete build identity, even when they share a release version.
3. `0.1.0-pre.2` is the canonical current release. A stale local `dist` reporting `pre.1` is detected as build/source drift, never treated as an alternate desired version.
4. Ordinary bundle commands remain offline-first and output-stable: they do not wait for the registry and do not receive unsolicited notice text on structured stdout.
5. Update discovery is bounded, non-fatal, cacheable, suppressible, skipped in CI/tests, and unable to turn a successful local command into failure.
6. `aslite version --check` is read-only. The actual upgrade remains an explicit npm command owned by the user and package manager.
7. Agent Skill compatibility compares installed manifested bytes/contract with the running release identity. SessionStart hook compatibility compares its managed semantic command/contract, not merely package versions. Supported MCP configuration calls `aslite mcp`, not a version-keyed cache path.
8. An npm upgrade never silently rewrites skills, hooks, or MCP host configuration. Status/receipts identify actionable follow-up and print exact commands.
9. Publishing is impossible unless version, embedded identity, generated assets, tag/commit, packed tarball, and documentation release claims agree under CI checks.
10. Either Brian or Mike may approve a protected publish; neither approval bypasses the build/test/package proof.
11. `latest` and `next` may coincide only under the recorded prerelease policy. The first stable `0.1.0` changes their meanings without changing the identity model.
12. Marketplace retirement happens only after an old-to-new npm upgrade proof passes and the rollback artifact is independently recoverable.

# Lifecycle

1. A merged, gate-clean commit is selected for release.
2. A protected release action assigns the SemVer and source tag, builds once from that source, verifies identity/assets, and publishes through trusted publishing after Brian-or-Mike approval.
3. Installed CLIs report their complete build identity locally. Orientation may show the previously cached supported-release comparison and refresh it in the background.
4. `aslite version --check` performs an explicit current comparison and prints the exact npm upgrade and post-upgrade verification journey when needed.
5. The user runs npm. The stable `aslite` PATH entry now resolves the new package without changing supported hook/MCP launch commands.
6. The user verifies runtime identity and runs skill/hook compatibility status or convergence commands named in the receipt.
7. A release proven bad is deprecated or moved out of the supported dist-tag; the prior supported release is selected according to the rollback decision, with an auditable release record.

# Boundaries

- No mandatory background daemon, silent self-update, postinstall configuration mutation, telemetry, bundle-format change, storage change, hosted-service work, or general MCP configuration manager.
- `npx` is supported for trial/bootstrap and reports channel identity honestly, but it is not the repeated-use installed authority.
- Other package managers may work but are not promised by the initial contract.
- The marketplace rollback artifact is frozen recovery material and does not retain live cache-resolution or dual-release automation.
