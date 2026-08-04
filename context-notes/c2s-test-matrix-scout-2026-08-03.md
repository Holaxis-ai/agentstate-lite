---
type: Context Note
title: C2S red-test and adversarial QA matrix
actor: codex-c2s-test-scout
timestamp: '2026-08-04T00:51:30.146Z'
---
# Summary

## Status

Read-only test reconnaissance complete against source commit `5ee3829`. No source, test, task,
branch, or git state was changed. This note is the only board write.

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their
agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the
harness.

## Proximate goal

Turn C2S's normative compatibility and MCP-launch contract into an executable red-test and
adversarial-QA matrix. This serves the ultimate goal by preventing installed instructions,
selected executable bytes, and MCP identity from silently disagreeing.

## Bottom line

The repository already has unusually strong tests for the old skill installer's destructive-write
boundary: unmanaged/malformed/extras refusal, symlinks, interruption debris, partial installs,
upgrade transitions, byte-stable reinstall, and exact uninstall. It also already proves that the
CLI passes its running release to MCP and that a directly launched built `.mjs` reports that release
over stdio.

C2S still needs four red contracts:

1. exact Manifest v2/digest generation and a pure compatibility agreement table;
2. exact legacy/v2 ownership parsing, especially package and `installed_by` near-misses;
3. a fail-closed `durable_global` proof that runs before any persistent npm-package install write;
4. a literal PATH launch (`aslite mcp`) plus initialize handshake, not the current direct
   `node <dist> mcp` proof.

# Existing test authorities

- `packages/cli/test/skill-command.test.ts` is the destructive-write and command-output authority.
  Its `makeDistribution`, `runSkill`, `treeSnapshot`, and upgrade fixtures cover the old v1 receipt,
  but `treeSnapshot` records bytes only and cannot prove symlink/type/mode preservation.
- A new `packages/cli/test/skill-compatibility.test.ts` should own a table-driven pure
  parser/classifier matrix. Keeping this out of the already 729-line command suite makes the state
  table auditable and reusable by status/install policy.
- A new `packages/cli/test/durable-global.test.ts` should own a pure, injected npm-prefix/PATH/
  realpath classifier. C2H can later consume the same owner rather than growing a second proof.
- `packages/cli/test/skill-distribution.test.ts` owns both generated SKILL projections and their
  reference/resource completeness.
- `packages/cli/test/skill-resolver.test.ts` executes the emitted plugin resolver blocks verbatim in
  bash/zsh. It is a regression gate, not evidence that npm-primary skill/CLI contracts match.
- `packages/cli/test/mcp.test.ts` owns command help, argument/startup behavior, no bundle open on
  help, and the unit projection of `cliVersion()` into `startServer`.
- `packages/cli/test/mcp-stdio.test.ts` owns a real child-process/SDK handshake, but currently starts
  `node <absolute-dist> mcp`; it does not prove the host argv contract `aslite mcp` through PATH.
- `packages/mcp-app/test/server.test.ts` proves MCP App semantics after a supplied server version;
  the release identity owner remains CLI-side.
- `packages/cli/test/version.test.ts` and `packages/cli/test/build-identity.test.ts` own immutable
  identity and launch evidence. C2S should not fork those semantics.
- `scripts/verify-npm-package.mjs` is the exact installed-tarball authority. It already proves both
  PATH bins, packaged skill-byte parity, project/global skill install/status/uninstall, offline
  bundle work, and no plugin-channel writes. It does not perform an MCP handshake or exercise the
  npm-package durable-global refusal/success boundary.
- `scripts/verify-npm-package.test.mjs` owns verifier helper/policy behavior. PR 204 owns release
  verifier/workflow work, so C2S should not edit those files in parallel without coordination.

# Acceptance-to-test matrix

`Current` means coverage at `5ee3829`; `red` means the case should fail before C2S.

| ID | Acceptance row | Test level and exact file | Fixture/evidence | Current coverage and gap | Real process / tarball? |
|---|---|---|---|---|---|
| S1 | Manifest v2 retains `package`, `version`, `installed_by`, `files` and adds the exact schema, contract, source identity, and digest map | command integration: `packages/cli/test/skill-command.test.ts` | first install into both project hosts; parse `.aslite-skill.json`; deep-equal all required keys and no accidental aliases | Current test pins only the four old keys. Red for schema/contract/source/digests. | no |
| S2 | `files` and `file_sha256` are sorted, have exactly equal key sets, cover every shipped managed asset, and use `sha256:<64-hex>` of the actual source bytes | pure + command: `skill-compatibility.test.ts`, `skill-command.test.ts` | deliberately unsorted input; nested references; recompute every digest from `assets.root` | Current files are sorted and installed bytes are compared, but no digest receipt exists. Red. | no |
| S3 | Source identity comes from the running `BuildIdentityV1` authority, not adjacent `package.json` | command: `skill-command.test.ts`; agreement: `version.test.ts` | injected deterministic running identity with stale adjacent manifest and known executable bytes | Current `resolveSkillAssets` uses `cliVersion` (good) but has no source identity/artifact digest projection. Red for v2 fields. | no |
| S4 | Ownership parser accepts the exact historical legacy receipt and exact v2 receipt | pure table: `skill-compatibility.test.ts` | legacy packages `aslite` and `@holaxis/aslite` if both are confirmed historical; exact `installed_by: "aslite skill install"`; safe sorted file list; exact v2 | Current parser accepts any object with a safe `files` array. It does not validate package, installer, version, schema, uniqueness, or receipt generation. Red. | no |
| S5 | Package/installer/schema near-misses do not establish ownership; install and uninstall do not mutate them | pure table + command no-write: `skill-compatibility.test.ts`, `skill-command.test.ts` | wrong package, installer substring, extra whitespace, `npx ...`, missing installer, unknown schema; exact tree snapshot before/after | Current malformed JSON/path traversal refuses, but wrong package/installer is incorrectly accepted as owned. Red and security-relevant. | no |
| S6 | Existing top-level running `skill.version` and host `state` strings remain additive-compatible | command output agreement: `skill-command.test.ts` | row table for absent/unmanaged/installed/stale plus new `compatibility` object | Current strings/version are pinned separately; no additive object or whole-row agreement table. Red for additive evidence. | no |
| S7 | Missing target => public `absent`, compatibility `absent`, explicit install remedy | pure + command: `skill-compatibility.test.ts`, `skill-command.test.ts` | both scopes, one/both hosts absent | Existing public state covered. Compatibility/remedy absent. Red. | no |
| S8 | Manifest-less/invalid-owned target => public and compatibility `unmanaged`; never overwrite/remove | pure + command: same files | foreign file plus every S5 near-miss; exact lstat-aware snapshot | Existing manifest-less/malformed cases are strong; exact ownership-field near-misses and additive state are missing. Partially covered/red. | no |
| S9 | Exact bytes + equal contract => `installed/current`, irrespective of informational package version, release version, source commit/channel, or executable artifact SHA | pure table + command: same files | install v2; mutate only all provenance fields to different valid values; bytes/digests/contract unchanged | Current status compares the full serialized manifest and would call this stale. Red. | no |
| S10 | Matching bytes + legacy receipt => `installed/current`, reason `legacy_receipt`; explicit reinstall refreshes only the receipt | pure + command: same files | hand-write confirmed historical receipt over exact assets; snapshot assets; status; reinstall | Current code emits legacy receipts itself, but after v2 it needs an explicit compatibility branch. No reason or refresh-only assertion exists. Red. | no |
| S11 | Same SemVer but different honestly receipted asset bytes => `stale/stale` | pure + command: same files | two fake distributions with the same running version and different `SKILL.md`; first receipt/disk self-consistent, second running assets differ | Current hand-edit test catches disk drift but not two same-version, internally self-consistent distributions. Red for this acceptance claim. | no |
| S12 | Digest missing/extra/malformed or digest not matching installed bytes => owned but corrupt/stale when the core ownership shape remains valid | pure + command: same files | one mutation per digest failure; status tree byte-identical before/after | No digests today. Red. Parser must not confuse receipt corruption with foreign ownership. | no |
| S13 | Installed contract lower than running => public stale, compatibility stale, explicit reinstall remedy | pure table: `skill-compatibility.test.ts`; command with injected running contract: `skill-command.test.ts` | running contract 2, installed v2 contract 1, exact bytes | Running contract is currently 1, so this requires an injected contract fixture rather than invalid contract 0. Red. | no |
| S14 | Installed contract higher than running => compatibility `newer_contract`; install must not downgrade; public owned state remains its byte-derived value | pure + command no-write: same files | installed contract 2, running 1; matching and drifted-byte subrows; install snapshot unchanged; explicit uninstall tested separately | No contract classification. Red. Exact compatibility-object fields beyond `state/reason/remedy` should be pinned once authored. | no |
| S15 | A v2 transitional/partial install remains owned and recoverable; manifest `files`/digest keys still cover the union at interruption points | command interruption: `skill-command.test.ts` | v1→v2 union manifest before asset writes, mid-write, obsolete survivor, missing new file, manifest tmp | Existing legacy transition/partial tests are excellent, but their hand-written transitional receipt has no v2 digests and even uses the historical `aslite` package. Extend rather than replace. | no |
| S16 | Status is read-only for every compatibility state | command: `skill-command.test.ts` | lstat-aware snapshots around all S7–S15 status calls, including temp debris and symlinks | One temp-orphan case explicitly pins read-only. No whole-state agreement table. Partial/red. | no |
| D1 | Persistent install from `npm-package` runs one injected `durable_global` classifier before any host write | pure + command: `durable-global.test.ts`, `skill-command.test.ts` | identity channel npm-package; resolver returns success/refusal; both project and global install scopes | No durability classifier/gate exists. Red. Status remains read-only and npx-supported; do not gate it. | no |
| D2 | Durable success proves PATH bin resolves to the running executable and both bin/real executable are inside the absolute `npm prefix --global` supported layout | pure: `durable-global.test.ts` | POSIX prefix with `bin/aslite` symlink to `lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`; injected npm-prefix stdout/exit; realpaths | Build identity distinguishes PATH/npx but does not prove npm-global durability. Red. | no |
| D3 | Missing/failed/non-absolute prefix, PATH miss/shadow, executable outside prefix, bin outside prefix, broken symlink, or unsupported platform fails closed | pure table + command no-write: same files | one fixture per evidence failure; outcome code/reason stable enough for status/help | No implementation. Red. The normative protocol explicitly names macOS/Linux layout; unsupported Windows should fail closed unless separately designed. | no |
| D4 | `_npx`/npm-exec cache evidence is rejected even when PATH equality could otherwise pass | pure + command: same files | real-looking `_npx/.../node_modules/.bin/aslite` and cached package executable; ambient npm variables alone and cache-path concrete evidence | `build-identity.test.ts` detects npx-inferred launch, but skill install ignores it. Red. | one later QA child |
| D5 | A durability refusal creates/modifies/deletes no Claude/Codex target bytes, including when one target already exists | command: `skill-command.test.ts` | preplant owned/unmanaged/symlink targets; lstat-aware before/after snapshot; injected resolver failure | Existing per-target refusals may still process the sibling; the new global precondition must fire before either host loop. Red. | no |
| D6 | `local-dev` retains explicit developer behavior and marketplace invocation retains its existing bounded refusal | command regression: `skill-command.test.ts` | existing local fake distribution and cache-path marketplace executable | Both are already covered except additive evidence. Preserve. | no |
| M1 | CLI passes the one running version authority to MCP server creation | unit: `packages/cli/test/mcp.test.ts` | injected startServer captures `version` | Already covered with `startedVersion === cliVersion()`. Keep. | no |
| M2 | Literal host argv is `aslite mcp` resolved through PATH, and initialize `serverInfo.version` equals that executable's `version --json` release | child integration: `packages/cli/test/mcp-stdio.test.ts` | temp `bin/aslite` symlink/shim to built CLI; SDK `StdioClientTransport({command:"aslite", args:["mcp", ...], env: isolated PATH})`; compare handshake to subprocess `aslite version --json` | Current handshake uses `node <absolute-dist> mcp`; version matches, PATH contract unproved. Red. | real child required |
| M3 | MCP launch does not inspect or rewrite arbitrary host config; explicit version-keyed cache-path evidence stays byte-identical | child integration + QA: `mcp-stdio.test.ts` | isolated HOME with Claude/Codex config sentinel containing a version-keyed plugin cache argv; before/after exact snapshot; PATH global CLI still handshakes | No scanner exists (good), but no explicit no-scan/no-rewrite proof. Red evidence gap. | real child required |
| M4 | Generic legacy cache-path migration guidance appears in `mcp --help` | unit: `mcp.test.ts` | exact stable concepts: install supported global CLI; set host command to `aslite mcp`; verify initialize/version; no host-specific rewrite claim | Current help has no migration guidance. Red. | no |
| M5 | The same generic guidance appears in version verification and both generated skill channels | unit/render: `version.test.ts`, `skill-distribution.test.ts`; drift gate `check:skill` | assert guidance concepts in `VERSION_USAGE`, `renderNpm()`, `renderSkill()`; retain npm render's ban on an executable cache resolver | No guidance. Red. Existing resolver tests must remain green. | no |
| M6 | Guidance is bounded: ordinary command/protocol output stays unchanged and no arbitrary host compatibility is claimed | unit/integration: `mcp.test.ts`, `mcp-stdio.test.ts`, `skill-distribution.test.ts`, relevant home/error agreement tests | scan authored projection owner/approved surfaces; assert MCP protocol stdout remains JSON-RPC-only; fake HOME untouched | Existing stdout purity/error tests are strong. Add a bounded-surface tripwire rather than broad prose grep. | child for stdout |
| P1 | Installed tarball proves v2 manifest/digests and current compatibility for both hosts | exact package verifier: `scripts/verify-npm-package.mjs` after PR 204 lands; helper tests in `scripts/verify-npm-package.test.mjs` | current offline isolated global install/prefix and project/global host homes | Current verifier checks only package/version in the old manifest and public installed state. Red. | tarball required |
| P2 | Installed tarball launches literal PATH `aslite mcp` and returns the same package release in initialize | exact package verifier after PR 204 | reuse isolated prefix/PATH and scratch bundle; SDK client or a small exact JSON-RPC driver | Current verifier proves PATH bins but never invokes MCP. Red. | tarball + child required |
| P3 | A real npm-exec/npx-cache invocation of npm-package bytes refuses persistent skill install without writes | exact package/release QA after PR 204 | local tarball, isolated npm cache/HOME/project, literal npm exec command, before/after trees | Cannot be proven by the current local-dev package verifier because local-dev intentionally retains developer behavior. Pure fixtures are necessary but not sufficient. | tarball + child required |
| P4 | Candidate/release receipt carries the bounded integration verification/guidance | PR-204-owned release receipt plus a C2S projection helper; verifier helper test after merge | exact receipt field/array naming the skill status and MCP PATH/initialize checks | No current release receipt insertion point on main. Do not edit PR 204's workflow/verifier files concurrently; integrate/rebase once its schema lands. | retained tarball/release proof |

# Fixture improvements

1. Add `snapshotTreeExact`: record relative path, lstat kind, mode, symlink target, and bytes for
   regular files. The existing byte-only `treeSnapshot` can miss a link/file substitution when
   target bytes happen to match.
2. Make the fake distribution fixture accept an injected build identity/skill contract. Its
   adjacent `package.json` version is deliberately not authoritative, so it cannot model contract
   2 or provenance rows by itself.
3. Keep the compatibility classifier pure and table-driven. Status, install refusal/convergence,
   and output projection should consume its result; tests should not reproduce classification in
   three suites.
4. Keep the durable-global resolver pure/injected (`resolveOnPath`, `npmPrefixGlobal`, `realpath`,
   platform, env, running identity). The command-level test should assert it is called before target
   enumeration/mutation.
5. For packed verification, the isolated command environment must explicitly expose the test
   prefix to `npm prefix --global` (for example a test-owned npm config/prefix), not inherit the
   developer's prefix. The current verifier intentionally strips inherited `npm_config_prefix` and
   does not add the isolated prefix back to `commandEnv`; release-mode verification would therefore
   fail once the durability gate is active.

# Ordered minimal red-test sequence

1. `skill-compatibility.test.ts`: land the pure legacy/v2 parser and S7–S14 agreement table first.
   This establishes state precedence without filesystem mutation.
2. `skill-command.test.ts`: pin exact Manifest v2, digest parity, provenance-insensitive current,
   same-SemVer byte drift, legacy refresh, lower/higher contract behavior, and exact ownership
   near-miss no-write cases.
3. `durable-global.test.ts`: pin success plus every fail-closed evidence row; then add one
   command-level pre-write refusal for both project/global install.
4. `mcp.test.ts` + `version.test.ts` + `skill-distribution.test.ts`: pin bounded guidance and keep
   both generated channels/resource gates coherent.
5. `mcp-stdio.test.ts`: replace or supplement the direct-node proof with literal PATH
   `aslite mcp`; compare initialize release to `aslite version --json`; preserve clean stdout.
6. Run existing `skill-resolver.test.ts`, the full old `skill-command.test.ts` interruption/symlink
   battery, `mcp-app/test/server.test.ts`, and generated-skill drift checks as regression gates.
7. After PR 204 lands, extend its retained/installed-package verifier with P1–P4 rather than
   creating a second pack/install implementation. The exact tarball is the only adequate proof for
   npm-global layout and real npm-exec behavior.

# Later adversarial QA probes (after independent Review)

Use an isolated checkout at the exact reviewed SHA and preserve byte-level before/after receipts.

## Owned

- Exact v2 current install: status is read-only, reinstall is byte-stable `changed:false`, explicit
  uninstall removes only manifested assets.
- Same bytes but every provenance fact changed: remains current.
- Same SemVer/different self-consistent assets: stale; explicit current installer converges.
- Higher installed contract: older installer refuses downgrade and leaves target exact; explicit
  uninstall behavior follows the reviewed policy and touches no sibling data.

## Unmanaged

- No manifest; malformed JSON; traversal; wrong package; installer substring/whitespace/npx
  near-match; unknown schema; foreign extra; target symlink. Run both install and uninstall and
  compare lstat-aware snapshots. No near-match establishes ownership.

## Legacy

- Exercise every confirmed historical package spelling with the exact installer marker. Matching
  bytes report `legacy_receipt`; receipt refresh changes only the manifest; partial/missing bytes
  remain owned-stale and recoverable.

## Partial/interrupted

- Manifest-only first-install state; union manifest before writes; mid-asset write; obsolete old
  survivor; missing asset; digest-map corruption; managed temp debris; empty and non-empty directory
  squatters; file symlinks. Each outcome is either recoverable owned-stale or a no-write refusal,
  never silently unmanaged after AgentState Lite established ownership.
- Optional high-value real multi-process probe: concurrent identical installs must finish in an
  owned, v2-valid current-or-recoverably-stale state, never a foreign/unowned state. Run only if the
  implementation changes the write sequencing enough that unit interruption fixtures cannot cover
  it.

## Durable/no-write

- PATH shadow, missing npm, npm-prefix exit/non-absolute/mismatch, `_npx` cache path, broken shim,
  executable copied outside prefix, and unsupported platform all refuse before either host changes.
- Real local-tarball `npm exec` probe: rejected persistent install, empty target trees, no manifest
  temp debris.
- Real isolated npm-global install: supported prefix succeeds, writes exact v2 receipts, and can be
  statused/uninstalled offline.

## MCP

- Isolated PATH containing only Node plus the installed prefix; start literal `aslite mcp`, complete
  SDK initialize, and compare server release to the same PATH command's identity.
- Plant a stale version-keyed marketplace command in a test-owned host config and a fake cache
  executable. The PATH global command must still win; the config and cache tree remain byte-exact.
- Usage and bundle-start failures keep protocol stdout empty; help is offline and does not scan
  HOME; no output claims arbitrary per-host MCP compatibility.

# Verification commands

Focused sequence after the red tests are implemented:

```sh
npm run build
AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs \
  ./packages/cli/test/skill-compatibility.test.ts \
  ./packages/cli/test/durable-global.test.ts \
  ./packages/cli/test/skill-command.test.ts \
  ./packages/cli/test/skill-distribution.test.ts \
  ./packages/cli/test/skill-resolver.test.ts \
  ./packages/cli/test/version.test.ts \
  ./packages/cli/test/mcp.test.ts \
  ./packages/cli/test/mcp-stdio.test.ts
npm run check:skill -w @holaxis/aslite
```

After PR 204 integration:

```sh
node --test scripts/verify-npm-package.test.mjs
npm run verify:npm-package
npm run check
```

The exact npm-package/npx adversarial proof belongs in the retained release-candidate or release
verifier path; `verify:npm-package` developer mode intentionally builds `local-dev` bytes.

# Gaps requiring explicit implementation judgment

1. The normative design does not enumerate the exact keys inside each additive `compatibility`
   object beyond state/reason/remedy semantics. Author one minimal schema, then pin it; do not let
   TOON/JSON projections invent separate shapes.
2. "Retained owned state" for `newer_contract` means the old public state remains byte-derived;
   the compatibility state takes precedence for the no-downgrade decision. Pin matching-byte and
   drifted-byte subrows so this is not rediscovered during review.
3. Interpret "persistent npm-package install" as both project- and global-scope `skill install`:
   both leave durable host assets. If product intends a narrower scope, record that decision before
   weakening D1/D5.
4. The protocol names supported macOS/Linux npm-global layout. Windows behavior needs an explicit
   later support decision; C2S should fail closed rather than infer a layout.
5. Release-receipt integration is structurally owned by PR 204. C2S can own the guidance/proof
   projection and all non-overlapping tests now, but final P1–P4 evidence must be rebased or added
   after PR 204 rather than silently omitted or implemented in a duplicate packer.

# Confidence

High on current coverage and the four missing proof boundaries; high on exact existing test
authorities and which proofs require child processes/tarballs. Medium on the final additive
compatibility object key names and PR-204 receipt insertion point because the normative protocol
deliberately leaves those projection details to the unit and PR 204 is still in flight.

[tests](../tasks/skill-mcp-compatibility.md)
