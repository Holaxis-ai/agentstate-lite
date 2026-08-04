---
type: Context Note
title: 'C2S architecture scout: skill compatibility and bounded MCP launch'
actor: codex-c2s-arch-scout
timestamp: '2026-08-04T00:51:24.211Z'
---
# Summary

## Ultimate and proximate goals

The repository's ultimate goal is to make AgentState Lite the shared, versioned,
conflict-safe markdown memory for one human and their agent fleet. The proximate goal of
this read-only reconnaissance was to map the current Skill installer and MCP startup path
to the approved C2S contract so implementation can make the installed instructions and
the executing CLI provably compatible without mutating unmanaged integrations.

The code already has strong interruption/convergence mechanics and already routes the MCP
initialize version from the running build identity. The smallest safe C2S change is therefore
to add a pure owned-receipt/compatibility layer and a pre-write durable-install authority in
front of the current mechanics, preserve the existing manifest-first transition with a legacy
transitional receipt, and add the missing PATH-level MCP proof and bounded migration guidance.

## Current implementation map

| Concern | Current owner | Current behavior | C2S seam |
|---|---|---|---|
| Running assets | `resolveSkillAssets`, `packages/cli/src/commands/skill.ts:122` | Resolves package root from the real executable, lists sorted `SKILL.md` plus `references/**`, and uses `cliVersion()` | Extend the asset model with the running build identity, skill contract, executable digest, and sorted per-asset SHA-256; keep package-root discovery here |
| Manifest parse / ownership | `readManifest`, `skill.ts:255` | Any JSON object with a safe `files` array is treated as managed; `package`, `version`, and `installed_by` are not validated; a manifest symlink is followed | Replace with a pure discriminated parser that separates `absent`, `unmanaged`, and `owned` from v1/v2 receipt validity; never let a symlinked manifest establish ownership |
| Manifest serialization | `manifestContent`, `skill.ts:268` | Writes legacy receipt `{package,version,installed_by,files}` | Retain a legacy transitional serializer and add the exact final Manifest v2 serializer/digests |
| Install mutation | `installIntoDir`, `skill.ts:323` | Manifest-first; transitional union receipt, converge assets, remove obsolete files, final receipt | Preserve this algorithm. Write the transitional union as legacy v1, then the final converged receipt as v2. Refuse a higher installed contract before any mutation |
| Uninstall mutation | `uninstallFromDir`, `skill.ts:423` | Removes exactly manifested paths plus receipt after extras/obstruction checks | Consume the same owned-manifest parser; legacy and v2 remain removable, unmanaged stays byte-unchanged |
| Compatibility status | `skillStatusForDir`, `skill.ts:470` | Compares actual file set/bytes and then requires byte-exact equality with the current legacy receipt | Make actual asset bytes + contract authoritative; validate v2 receipt digests against installed bytes; ignore informational provenance mismatch; project additive per-host `compatibility` |
| Public command | `skill`, `skill.ts:511` | Resolves scope/targets, then status/install/uninstall; `SkillDeps` injects cwd/home/env/executable/stdout | Add identity/install-authority injection. Run the npm-package durable-global gate once before either host can enter a mutating function |
| Build identity | `staticBuildIdentity`, `cliVersion`, `buildIdentityEnvelope`, `packages/cli/src/build-identity.ts:160,178,254` | Sole release/contract/version/executable-SHA authority | Reuse this owner; do not read adjacent `package.json` as compatibility authority |
| MCP CLI adapter | `mcpInner`, `packages/cli/src/commands/mcp.ts:58` | Opens bundle and passes `cliVersion()` to the stdio server | Production path is already correct; keep it |
| MCP initialize | `createMcpAppServer`, `packages/mcp-app/src/server.ts:386` | SDK `serverInfo.version` uses supplied version; private direct consumers may fall back to `0.0.1` | C2S proof should exercise the CLI adapter, not widen the private server package |
| MCP integration test | `packages/cli/test/mcp-stdio.test.ts:41` | Starts `node <absolute-dist> mcp` and proves initialize version | Add the missing literal host contract: `command: "aslite"`, args beginning with `"mcp"`, resolved through an isolated PATH, then assert initialize version equals `cliVersion()` |
| Generated skill docs | `renderNpm` / `renderSkill`, `packages/cli/src/skill-render.ts:623,805`; generator `packages/cli/scripts/gen-skill.mjs` | Two generated channels from one renderer | Add one shared stable-MCP guidance section to both renderers; regenerate only `packages/cli/SKILL.md` in the PR. The plugin projection remains bot-owned |
| Help / verification guidance | `MCP_USAGE`, `packages/cli/src/commands/mcp.ts:18`; `VERSION_USAGE`, `commands/version.ts` | No stable-PATH/cache migration guidance yet | Put shared wording in these bounded help/verification surfaces; do not add scanning or rewriting |

## Existing public output to preserve

Current JSON status is:

```json
{
  "skill": {
    "action": "status",
    "scope": "project|global",
    "version": "<running release>",
    "hosts": {
      "claude_code": { "path": "<path>", "state": "absent|unmanaged|installed|stale", "version": "<optional installed version>" },
      "codex": { "path": "<path>", "state": "absent|unmanaged|installed|stale", "version": "<optional installed version>" }
    }
  }
}
```

Install retains `action`, `scope`, top-level `version`, `source`, aggregate `changed`, and
per-host `{path,changed}`. Uninstall retains `action`, `scope`, aggregate `changed`, and
per-host `{path,changed}`. C2S should add only `hosts.<host>.compatibility` to status and must
not rename/retype those fields or state strings.

## Owned manifest model

Ownership and receipt validity need separate decisions.

1. An owned base receipt should require a real non-symlink manifest file; a recognized historical
   package (`aslite`) or current package (`@holaxis/aslite`); exact
   `installed_by: "aslite skill install"`; a non-empty string version; and a sorted, unique, safe
   file list containing `SKILL.md` and otherwise only `references/**`. Git history shows the
   original writer used `aslite`; current on-machine pre.2 receipts use `@holaxis/aslite`. No other
   installed-by spelling was generated.
2. A receipt without v2 fields is an owned legacy receipt. If actual assets match, public state is
   `installed`, compatibility is `current`, and reason is `legacy_receipt`.
3. An exact v2 receipt adds schema, positive integer contract, source identity, and a digest map
   with exactly the same sorted keys as `files`. Every digest must be `sha256:<64 hex>` and match
   the actual installed bytes. A bad/missing v2 extension does not erase proven base ownership; it
   is owned-but-stale so explicit reinstall can repair it.
4. Actual installed-vs-running bytes and contract decide compatibility. Version/commit/channel/
   executable-SHA differences alone do not make matching assets stale. Same SemVer with different
   bytes remains stale.
5. A higher installed contract projects `newer_contract` and install refuses before writes. It
   remains explicitly uninstallable because ownership is proven and uninstall is the user's direct
   requested action.

The current exact-manifest-text comparison at `skill.ts:490` must go: it incorrectly lets
informational provenance/version fields decide staleness and cannot recognize matching legacy
receipts as current.

### Interruption-safe v2 transition

The current manifest-first invariant is valuable and should not be replaced. A v2 transitional
receipt cannot truthfully claim that digests match assets which have not been written yet. Use:

```text
read-only preflight
  -> legacy v1 transitional receipt owning sorted union(old files, new files)
  -> converge new assets
  -> remove obsolete owned files
  -> final exact v2 receipt for the now-converged asset set
```

Every interruption remains owned and repairable; only a completed install claims a valid digest
receipt.

## Write boundary and durable-global proof

There are two required pre-write changes.

First, `installIntoDir` and `uninstallFromDir` currently call `sweepManagedDebris` before refusing
malformed/unmanaged/extras/obstruction states. The source comment explicitly acknowledges that a
refused folder can lose a reserved-manifest temp file. C2S's unmanaged-no-mutation contract requires
a whole-target read-only preflight before any sweep:

- parse ownership without following the manifest symlink;
- logically ignore eligible owned debris while checking extras and obstructions;
- if refusal is required, return with byte-identical target state;
- only after acceptance, sweep debris and mutate;
- retain first-install recovery only for an otherwise-empty target containing exact reserved
  manifest-temp debris. A foreign companion file makes the target unmanaged and preserves every
  byte.

Second, an `npm-package` install needs one injected, fail-closed authority check before either host
target is processed. A reusable production resolver should:

1. reject npm-exec/npx environment evidence and `_npx` executable/bin paths;
2. resolve a managed PATH bin to the real running executable;
3. run bounded, shell-free `npm prefix --global` and require one absolute canonical prefix;
4. require the selected PATH bin under `<prefix>/bin/{aslite|agentstate-lite}`;
5. require the real executable at the supported POSIX npm-global layout
   `<prefix>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`;
6. return evidence only; perform no writes.

The observed supported macOS layout is `/opt/homebrew/bin/aslite` symlinked to
`/opt/homebrew/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`, with global prefix
`/opt/homebrew`. The resolver should also fixture an ordinary Linux/user prefix. PATH equality
alone is deliberately insufficient.

`local-dev` keeps the current explicitly developer/test-only allowance. The marketplace skill
bundle still refuses in `resolveSkillAssets`. An unknown build identity should fail closed rather
than mint a v2 contract it cannot prove.

## MCP and guidance

The MCP release projection already has one identity path:

```text
cliVersion() -> mcpInner start({version}) -> createMcpAppServer({version}) -> initialize serverInfo.version
```

No host-config scanner or mutator belongs in C2S. The missing executable proof is the literal stable
PATH command. Extend the stdio integration test with an isolated bin directory containing an
`aslite` link to the built CLI, configure the SDK transport with `command: "aslite"` and
`args: ["mcp", ...]`, and assert the handshake version. This proves the supported config survives a
version replacement at the PATH target without editing host configuration.

Use one shared generic guidance primitive across:

- `mcp --help`;
- `version --help` / its verification guidance;
- both generated skill renderers;
- the later release receipt consumer.

The guidance should say to globally install the npm package, configure the host with command
`aslite` and argument `mcp`, manually replace any absolute version-keyed legacy marketplace/cache
executable, and note that AgentState Lite neither scans nor rewrites host config. It must not claim
per-host compatibility.

## Focused test seams

- Keep and extend `packages/cli/test/skill-command.test.ts` for output preservation, legacy/v2
  parser fixtures, provenance-neutral matching, same-version byte drift, lower/higher contracts,
  digest corruption, receipt symlink, partial transition recovery, no-downgrade, and byte snapshots
  on every refusal.
- Add a pure durable-global classifier suite covering Homebrew/Linux layouts, both aliases, missing
  or malformed prefix, PATH link outside prefix, wrong real executable, npx cache PATH false
  positive, npm-exec environment evidence, and local-dev policy.
- Extend `packages/cli/test/mcp-stdio.test.ts` for literal PATH startup and initialize agreement.
- Extend `packages/cli/test/mcp.test.ts`, `version.test.ts`, and
  `skill-distribution.test.ts` for the bounded shared guidance. The existing npm-render test
  currently bans any `plugins/cache` text; revise it to ban cache discovery/resolver logic while
  allowing the new bounded migration warning, or phrase the warning generically without the
  literal segment.
- Keep `packages/mcp-app` direct-server tests unchanged; its private fallback version is outside the
  CLI launch contract.

## PR 204 separation

C2S requires no edit to PR 204's release workflows/scripts, package verifier, `packages/cli/build.mjs`,
or package manifests. Source-owned C2S files can remain `commands/skill.ts`, a new pure/install-
authority module, `commands/mcp.ts`, `commands/version.ts`, `skill-render.ts`, the npm-generated
`packages/cli/SKILL.md`, and focused tests. The plugin generated artifact is bot-owned and should
not be committed in this PR.

## Gaps requiring orchestrator resolution

1. The normative protocol fixes compatibility states and the exact `legacy_receipt` reason, but
   does not give the complete per-host `compatibility` object key set, null-vs-omission rules, or
   exact remedy strings. That additive public JSON schema should be fixed before its tests are
   pinned rather than invented in code.
2. No release-receipt guidance consumer exists on current main; the likely consumer is PR 204-owned
   and intentionally excluded from this branch. C2S can establish the shared wording and the other
   bounded surfaces, but release-receipt consumption needs a post-204 integration/rebase check.
3. Unknown/future manifest schema behavior is not explicit. Safest interpretation: preserve proven
   base ownership, refuse downgrade when a readable installed contract is higher, otherwise report
   owned stale and require explicit reinstall.

### Recommended exact additive compatibility schema

To close gap 1 without changing existing fields, use one total, fixed-key object on every host:

```json
{
  "compatibility": {
    "state": "absent|unmanaged|current|stale|newer_contract",
    "reason": "target_absent|ownership_unproven|legacy_receipt|receipt_invalid|asset_drift|installed_contract_older|installed_contract_newer|null",
    "installed_contract": null,
    "running_contract": 1,
    "remedy": {
      "action": "none|install|refresh_receipt|upgrade_cli|user_decision",
      "command": null
    }
  }
}
```

All keys are always present in JSON/TOON; inapplicable values are `null`. Exact projection:

| Compatibility | Reason | Contracts | Remedy |
|---|---|---|---|
| `absent` | `target_absent` | installed `null`, running current/null | `install`, `<invocation> skill install --scope <scope>` |
| `unmanaged` | `ownership_unproven` | installed `null`, running current/null | `user_decision`, command `null` |
| `current` v2 | `null` | both known/equal | `none`, command `null` |
| `current` legacy | `legacy_receipt` | installed `null`, running current | `refresh_receipt`, install command |
| `stale` corrupt receipt/digest | `receipt_invalid` | installed readable-or-null, running current | `install`, install command |
| `stale` lower contract | `installed_contract_older` | both known | `install`, install command |
| `stale` file-set/byte drift | `asset_drift` | installed readable-or-null, running current | `install`, install command |
| `newer_contract` | `installed_contract_newer` | both known | `upgrade_cli`, command `null` until an exact supported-version command is available |

Classifier precedence should be absent → unmanaged → readable higher contract → invalid v2
receipt/digest → lower contract → asset drift → matching legacy → matching v2. The legacy optional
refresh remains visible without falsely calling compatible bytes stale. A newer-contract host keeps
its existing public `state` derived from actual byte compatibility, while the additive state blocks
install downgrade.

## Confidence

High on owning functions, write boundaries, existing output, historical receipts, MCP identity
flow, and non-overlap with PR 204. Medium on the exact additive compatibility JSON and release-
receipt placement because those are not fully specified/available in the current tree.

[models C2S](../tasks/skill-mcp-compatibility.md)

[uses domain model](c2s-domain-model-2026-08-03.md)

[implements plan](../plans/version-string-channel-identity.md)

[implements protocol](../designs/version-update-protocols.md)
