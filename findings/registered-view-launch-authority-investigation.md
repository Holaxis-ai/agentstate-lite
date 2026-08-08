---
type: Finding
title: >-
  Registered View mint preparation is duplicated across the web host and view
  runtime
actor: openai/codex
timestamp: '2026-08-08T13:35:04.052Z'
---
# Scope

Investigate the architectural-smell report's claim that `ui-server` duplicates the registered-View launch authority owned by `view-runtime`, against exact `origin/main` commit `5806ece2c393f1c277f4a17a9006c1ba75eca86b`. The trace covered web and MCP launch ingress, local and remote storage, registry/blob acquisition, registration and active-HTML admission, exact-byte mint identity, currentness/revocation, approval, bridge/action resolution, tests, history, and the existing View designs.

# Verdict

**PROMOTE TO TASK.** There is one coherent behavior-preserving consolidation available. The original report overstates the duplication as the whole launch sequence, but the remaining production duplication is still real and sits on a security-sensitive authority.

The web host's `/__page/mint` handler independently performs the exact registered-View preparation that `view-runtime.mintActiveViewLaunch` owns for MCP: versioned registry read, registration validation, entry read and optional version pin, active-HTML admission, content hashing, launch minting, and post-mint currentness/revocation. Every web View launch reaches that copy. Current code agrees, so this is not a present vulnerability or user-visible defect; it is a false one-authority claim and a demonstrated recurring coordination surface.

# Facts

## Shipped flows

- The web SPA sends exactly `{ registryId }` to `POST /__page/mint` (`packages/ui/src/api/pages.ts:180-188`). `ui-server` then performs the full preparation itself (`packages/ui-server/src/server.ts:330-372`).
- MCP registered-View launch calls `mintActiveViewLaunch` directly (`packages/mcp-app/src/server.ts:354`). The runtime helper owns the same registry, entry, admission, hash, mint, and currentness steps (`packages/view-runtime/src/index.ts:301-347`).
- The CLI always supplies a semantic `Bundle` in both modes. Local mode supplies `bundle`; remote mode opens a `RemoteBackend` bundle and supplies it as `kindsBundle` (`packages/cli/src/commands/ui.ts:175-188`).
- Once a web launch exists, the shipped local and remote CLI paths already delegate currentness to `view-runtime.launchIsCurrent`, because `viewLaunchIsCurrent` immediately takes its `bundle` arm (`packages/ui-server/src/server.ts:167-170`). Bridge and action resolution likewise use `PageBridgeLaunchAuthority` and `PageActionLaunchAuthority` over that bundle.
- The alternative inline remote implementation (`remoteRegistryHeads`, direct blob fetch, inline `viewLaunchIsCurrent`) is used only when private `ui-server` is booted in remote mode without `kindsBundle`. No shipped consumer does that. That fallback can mint and serve HTML, but `bootUiServer` cannot construct a bridge without a bundle, so it is not a complete active-View host.
- The private `@agentstate-lite/ui-server` workspace is not a published compatibility surface.

## Existing decisions

- `CLAUDE.md` requires one View semantics/action authority and calls hosts adapters over it.
- [MCP durable View promotion/discovery](../designs/mcp-durable-view-promotion-discovery.md) says `view-runtime` owns registry resolution, exact-byte identity, approval, and currentness, and specifically claims both hosts consume `mintActiveViewLaunch`. The web mint path makes that sentence false today.
- [Transient/durable View unification](../designs/transient-durable-view-unification.md) likewise defines web and MCP as adapters over one launch authority.
- PR #173 introduced `mintActiveViewLaunch` so MCP would not reproduce the web mechanics. It did not migrate the pre-existing web handler.

# Mixed-case adjudication

## Refuted portion of the smell report

The production web host does **not** maintain a second post-launch currentness, bridge, authorization, or action authority. Those paths delegate to `view-runtime` whenever the required bundle is present, and the CLI always provides it. Therefore the report's phrase “the whole registered-View launch sequence is written twice” is too broad.

HTTP parsing, error-envelope/status translation, authorization-dialog projection, nonce URL construction, CSP response headers, and remote proxying are legitimate host adaptation and should remain in `ui-server`.

## Confirmed portion

Registered-source preparation before the launch exists is implemented twice, and the web copy is live. A change to registration validity, `entry_version`, declared access, admitted content type, source hashing, or the pre/post-mint race fence must be applied to both locations.

History shows that coordination already happening: the exact-byte approval change (`52e127e`) introduced content admission/hash/currentness in both files, and the exact durable-save work (`255d05a`) added `entry_version` enforcement to both. Agreement so far comes from repeated human coordination and separate tests, not one code path.

# Reachable drift risk

The failure mode is not theoretical code style. If one copy changes alone, web and MCP can disagree about which bundle bytes are executable under a prior approval. Existing tests are strong within each surface, but they do not make it impossible for one surface to retain an older rule.

The optional no-bundle remote fallback also creates a misleading test contract. An empirical probe using the actual CLI shape (`RemoteBackend` passed as `kindsBundle`) minted successfully and returned fail-closed `403` after the upstream disappeared. The fallback-only test shape instead expects a `502` because its inline currentness function throws. That is observable proof that the compatibility branch and the shipped remote path already have different failure semantics.

# Empirical evidence

At the evidence commit:

- Fresh install and root build passed.
- `@agentstate-lite/view-runtime`: 25/25 tests passed.
- `@agentstate-lite/ui-server`: 43/43 tests passed.
- A bounded real-reference-server probe created a View, opened the same store through `RemoteBackend`, and called `mintActiveViewLaunch`: the registered launch was current before an entry-byte change and not current afterward.
- A production-shape `bootUiServer({ mode: "remote", kindsBundle: RemoteBackendBundle })` probe minted successfully; after the upstream closed, nonce serving failed closed with `403`, demonstrating that the shipped path used runtime currentness rather than the fallback's throwing inline branch.

These probes establish that the existing `Bundle` seam already supports both storage modes. A new source-provider abstraction is unnecessary.

# Smallest sound implementation unit

Create one task to make `view-runtime` the literal registered-launch authority for the web host, without changing user behavior:

1. Make the mode-appropriate semantic `Bundle` required by `UiServerOptions` in both dir and remote modes (a discriminated union or equivalent). Keep the existing remote proxy origin/key separately for `/v0/*` transport.
2. Route exact-ID web minting through `mintActiveViewLaunch(bundle, runtime.launches, registryId)`.
3. Route nonce serving and authorization verification directly through `launchIsCurrent(bundle, launch)`; remove `ui-server`'s inline remote currentness implementation.
4. Route catalog projection through `listViewCatalog(bundle)` in both modes and delete the no-bundle `remoteRegistryHeads`/direct View-blob compatibility path.
5. Preserve the host's current HTTP status/messages with typed runtime launch failures rather than string matching. MCP may keep presenting the same messages.
6. Preserve the legacy `{ key }` mint ingress only if a committed consumer still exists. The current SPA uses only `{ registryId }`; if retained for strict behavior parity, resolve key-to-registry ID as a narrow host ingress adapter, then call the shared mint helper. Do not let it retain its own admission/mint/currentness path.

This unit deletes an authority and the mode-specific duplicate code; it must not add a generic provider/service layer around `Bundle`.

# Acceptance evidence and review tier

Risk tier: **security-boundary behavior-preserving refactor**. Use Builder → exact-SHA independent review → focused adversarial QA, even if the mechanical parity fixtures are strong.

Acceptance evidence:

- Pre-change route fixtures pin the current success payload and failure taxonomy for local and `RemoteBackend` modes: missing registration, invalid registration, missing entry, `entry_version` mismatch, inadmissible content, mid-mint change, and authorized/unapproved success.
- Existing dishonest-upstream content-version tests remain green and still prove the host-computed hash governs identity and revocation.
- A shared agreement probe shows web and MCP derive the same registry ID/version, entry, access, normalized content type, and content hash from one local and one remote fixture.
- Probe the authority red once: perturbing the runtime's admission/hash/currentness rule must fail both the web and MCP surface tests.
- Static ownership check: outside `view-runtime`, no production source mints `sourceKind: "registered"` and `ui-server` no longer imports the primitives needed to reconstruct registered launch identity.
- Full repository gate passes.

# Uncertainty

The only unresolved product-policy point is whether the private `{ key }` mint compatibility input should be retired or retained as ingress sugar. It is not used by the current SPA and should not block the authority consolidation. Preserve it in the first unit if deletion would broaden the behavioral claim.

# Reproduction

Evidence commit:

```text
5806ece2c393f1c277f4a17a9006c1ba75eca86b
```

Commands and probes:

```bash
git worktree add --detach <isolated-path> 5806ece2c393f1c277f4a17a9006c1ba75eca86b
npm ci
npm run build
npm test -w @agentstate-lite/view-runtime
npm test -w @agentstate-lite/ui-server
rg -n "mintActiveViewLaunch|launches\\.mint|viewLaunchIsCurrent|remoteRegistryHeads" packages/{ui-server,view-runtime,mcp-app}/src
git blame -L 290,380 packages/ui-server/src/server.ts
git blame -L 296,347 packages/view-runtime/src/index.ts
```

[investigates claim](../claims/architectural-smell-report-remediation.md)

[informs task](../tasks/simplification-audit.md)
