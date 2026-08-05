---
type: Design
title: 'Version identity, update, compatibility, and staged-release protocols'
description: >-
  Normative schemas, state precedence, budgets, compatibility tables, build
  flavors, staged-release state machine, and two-release proof.
actor: codex-orientation-orchestrator
timestamp: '2026-08-05T20:53:18.711Z'
---
# Purpose

Make the release/update Decision executable without leaving public schemas, result precedence, notifier budgets, compatibility semantics, or staged-release continuation to individual builders. This design is normative for I1, C2H, C2S, U3, N4, P5, and the two live-release proofs.

# 1. Build and runtime identity protocol

## Required build inputs

Every bundle-producing call passes an explicit build-flavor object; omission is an error:

| Caller | `artifact_channel` | Source facts |
|---|---|---|
| Ordinary repo/dev build | `local-dev` | Git commit and dirty state when available; otherwise `null` |
| Release-candidate builder | `npm-package` | Exact protected tag/check-out SHA; `dirty: false` required |
| Marketplace bot and its drift rebuild | `marketplace-legacy` | Exact checkout SHA and dirty state |

`npx` and npm-global are launch/install journeys over the same `npm-package` bytes, not build flavors. The release commit is injected at build time; no committed file attempts to contain its own future commit SHA.

Compatibility contracts are a per-integration object, initially `{ "skill": 1, "hook": 1, "mcp": 1 }`. Increment only the affected integer when persisted integration shape or semantics require user reconciliation. Ordinary CLI/API additions, release versions, prose-only changes, and compatible implementation changes do not increment it.

## Normative `version --json` envelope

Keys are additive within schema v1; existing keys are never renamed or retyped. Unknown facts are JSON `null`, never invented strings.

```json
{
  "identity": {
    "schema": "aslite.build-identity.v1",
    "package": { "name": "@holaxis/aslite", "version": "0.1.0-pre.3" },
    "source": { "commit": "<40-hex-or-null>", "dirty": false },
    "artifact": { "channel": "npm-package", "sha256": "sha256:<64-hex-or-null>" },
    "runtime": {
      "executable_path": "/resolved/path/or/null",
      "invocation": "aslite",
      "launch_mode": "path",
      "launch_confidence": "certain"
    },
    "compatibility_contracts": { "skill": 1, "hook": 1, "mcp": 1 }
  },
  "drift": {
    "adjacent_package_version": "0.1.0-pre.3",
    "version_mismatch": false
  }
}
```

Field enums:

- `artifact.channel`: `npm-package | local-dev | marketplace-legacy | unknown`.
- `runtime.launch_mode`: `path | direct | npx-inferred | source | unknown`.
- `runtime.launch_confidence`: `certain | inferred | unknown`.
- `source.dirty`: boolean or `null`; `drift.adjacent_package_version`: string or `null`.

The runtime SHA is computed lazily from the resolved executing `.mjs`/source file and cached only in-process. If the path/hash cannot be proven, both relevant facts remain `null`. Path layout may support an explicitly `inferred` launch mode but never upgrades it to `certain`.

Projection table:

| Surface | Projection |
|---|---|
| `--version` / `-v` | Exact `identity.package.version` plus newline only |
| `version` | The same envelope in default TOON |
| `version --json` | Exact JSON envelope above |
| home/session-start identity | Package version, artifact channel, executable path; cached notice is governed separately below |
| skill top-level `version` | Retained existing field, sourced from `identity.package.version` |
| MCP initialize server version | `identity.package.version` |
| package/release receipt | Full envelope plus retained tarball metadata |

Local adjacent-manifest inspection is diagnostics only. A stale baked executable remains authoritative for its own version and reports mismatch; no projection substitutes the adjacent manifest.

# 2. Explicit update-check protocol

## Network and selection

- Endpoint: fixed HTTPS `GET https://registry.npmjs.org/%40holaxis%2Faslite`.
- Accept: `application/vnd.npm.install-v1+json`.
- Redirects: rejected. Retries: zero. Total abort deadline: 2,000 ms. Maximum response body: 1,048,576 bytes.
- Default track: `latest`. Preview is explicit `--tag next`; no implicit persistence in v1.
- The exact version selected by the requested dist-tag is policy-authoritative. SemVer direction is explanatory, never permission to ignore a rollback.
- The response must contain a valid requested dist-tag, matching version entry, strict SemVer, and bounded string metadata. A selected deprecated version is never recommended; when it is also the running exact version the result is `deprecated`, otherwise the inconsistent target is `unavailable`.

## Normative `version --check --json` extension

The `identity` object is unchanged. `check` is added:

```json
{
  "identity": { "...": "same as version --json" },
  "check": {
    "schema": "aslite.update-check.v1",
    "track": "latest",
    "status": "upgrade_available",
    "relation": "selected_newer",
    "checked_at": "2026-07-31T00:00:00.000Z",
    "running_version": "0.1.0-pre.2",
    "selected_version": "0.1.0-pre.3",
    "running_deprecated": null,
    "selected_integrity": "sha512-...",
    "command": "npm install --global @holaxis/aslite@0.1.0-pre.3",
    "verify": [
      "aslite version --check",
      "aslite skill status --scope global",
      "aslite hook status --scope global"
    ],
    "unavailable": null
  }
}
```

All listed keys are always present. Inapplicable scalar values are `null`; `verify` is an empty array when no reconciliation command is safe. `unavailable`, when present, is `{ "code": "timeout|offline|http|too_large|malformed|tag_missing|selected_deprecated", "message": "bounded non-secret text" }`.

## State and exit precedence

| Condition, in order | `status` | `relation` | Exact command | Exit |
|---|---|---|---|---|
| Request cannot produce one validated selected version | `unavailable` | `unknown` | `null` | 1 |
| Selected version is deprecated and differs from running | `unavailable` | `unknown` | `null`; inconsistent registry policy | 1 |
| Running exact version equals selected and that version is deprecated | `deprecated` | `equal` | `null`; registry policy needs repair | 0 |
| Exact versions equal | `current` | `equal` | `null` | 0 |
| Selected SemVer is greater | `upgrade_available` | `selected_newer` | Install exact selected version | 0 |
| Selected SemVer is lower (including tag rollback) | `rollback_available` | `selected_older` | Install exact selected version | 0 |

If the running version's metadata is deprecated and exact versions differ, the forward/rollback status still applies and the deprecation string is included as the reason to reconcile. Invalid arguments use the existing usage envelope/exit 2. Invalid local identity is a runtime error/exit 1. No successful comparison uses numeric exit to encode “update available”; callers branch on `check.status`.

Default human/TOON output is the same data. No check changes npm, integrations, bundle content, or release-track preferences. `aslite update` remains unknown/reserved.

# 3. Passive orientation protocol

- Eligible surfaces: bare/home/session-start in default output mode only. `home --json` and `session-start --json` are stable machine projections: they neither display cached update data nor launch refresh work.
- Passive track: `latest` only. A `next` preview is never advertised passively.
- Cache: `~/.agentstate/update-check-v1.json`, directory 0700/file 0600 through the existing atomic writer, with a 65,536-byte read/write ceiling. Schema `aslite.update-cache.v1` binds package name, running version, track, complete successful check result, canonical `checked_at`, and canonical `expires_at`.
- Cache TTL: 86,400,000 ms (24 hours), exactly `expires_at - checked_at`. Cache entries for another running version/track, unavailable results, malformed/oversized data, unsafe file types/owner/permissions, future check time, noncanonical time, or expired display are ignored. Unsafe state fails closed without replacement; safely stored ordinary invalid/expired state may refresh.
- Cross-process coordination: `~/.agentstate/update-check-v1.lock`, maximum 4,096 bytes, is absent or a complete private `aslite.update-lease.v1` record published atomically from an exclusive 0600 temp; a killed writer must never expose partial bytes at the fixed path. The schema is an exact union: `active` binds one random token, canonical start time, a 30,000 ms lease expiry, and the 86,400,000 ms attempt-window expiry; `cooldown` retains that token/start/window expiry after the active lease ends without a successful cache. At most one eligible process starts one worker per attempt window, including unavailable checks and interrupted workers after lease publication.
- Active/cooldown transitions fail closed and never block rendering. A live active record or live cooldown means render-only. An unavailable worker atomically converts only its matching unexpired active record to cooldown; a successful worker writes the cache and removes only its matching active record. A recognized stale active record is converted to its original attempt-window cooldown; an expired cooldown is removed by a cleanup-only visit, and only a later eligible visit may acquire. Foreign/malformed/symlinked/non-regular/oversized/unsafe-owner-or-mode state is never removed automatically. Fixed-path removal/recovery uses a token-validated quarantine transition rather than read-then-unlink, and a worker revalidates a matching unexpired active lease before network work and immediately before cache commit.
- Refresh: one detached invocation of the exact current executable's private `__update-refresh-v1` worker, stdio ignored, no retries, using the same 2,000 ms/1 MiB network primitive. Parent returns without waiting and removes only its matching active record if spawn itself fails. The worker derives current identity and latest track itself; missing/invalid private-worker arguments are silent zero-work exits.
- One-run flag: `--no-update-check` on home/session-start. Environment opt-outs: presence of `ASLITE_NO_UPDATE_CHECK` or `NO_UPDATE_NOTIFIER`; `CI` presence also disables. Tests set `ASLITE_NO_UPDATE_CHECK`. Any suppressor disables both cached display and refresh; explicit `version --check` is unaffected.
- Cached output is a single additive `update_notice` object in default home/session-start TOON, containing only `status`, running/selected version, checked time, and nullable exact command. It appears only for `upgrade_available`, `rollback_available`, or `deprecated`; the deprecated/equal inconsistent-policy notice has `command: null`.
- The session-start render path and its existing ten-second hook timeout are not extended. No network promise, child close, or lease wait is awaited by rendering. Ordinary commands and all MCP/JSON protocol output are byte-unaffected.

# 4. Integration compatibility protocol

## Additive compatibility rule

The `0.1.x-pre.N` line preserves current public output:

- Skill host `state` remains `absent | unmanaged | installed | stale`; top-level running `version` remains.
- Hook aggregate/per-host `installed` booleans and existing `command` remain.
- New evidence appears under additive per-host `compatibility` objects. Removing/renaming/retyping existing fields requires the next breaking minor prerelease.

## Skill

| Evidence | Existing `state` | `compatibility.state` | Remedy |
|---|---|---|---|
| Target absent | `absent` | `absent` | `aslite skill install --scope <scope>` |
| No valid owned manifest | `unmanaged` | `unmanaged` | No automatic overwrite/uninstall; user decides |
| Owned manifest; all bytes match; contract equal | `installed` | `current` | None |
| Legacy owned manifest lacks contract; all bytes match | `installed` | `current` with `reason: legacy_receipt` | Optional reinstall to refresh receipt |
| Owned manifest; bytes differ or installed contract lower | `stale` | `stale` | Explicit skill install |
| Installed contract higher than CLI | retained owned state | `newer_contract` | Upgrade CLI/check supported release; do not downgrade asset silently |

Manifest v2 is exact and additive (existing keys retained):

```json
{
  "schema": "aslite.skill-manifest.v2",
  "package": "@holaxis/aslite",
  "version": "0.1.0-pre.3",
  "installed_by": "aslite skill install",
  "compatibility_contract": 1,
  "source_identity": {
    "release_version": "0.1.0-pre.3",
    "source_commit": "<40-hex-or-null>",
    "artifact_channel": "npm-package",
    "artifact_sha256": "sha256:<64-hex-or-null>"
  },
  "files": ["SKILL.md", "references/..."],
  "file_sha256": { "SKILL.md": "sha256:<64-hex>", "references/...": "sha256:<64-hex>" }
}
```

`files` and `file_sha256` have the same sorted keys and cover every managed asset. Ownership continues to require the existing package/installer/file shape; a legacy owned manifest without `schema`/contract stays owned. Compatibility is determined only by actual installed-vs-running asset bytes and the skill contract table: package `version`, source commit/channel, and executable artifact SHA are provenance/informational and never by themselves make matching compatible assets stale. Manifest digests must match actual installed bytes or the receipt is corrupt/stale. Same SemVer/different actual bytes remains stale.

## Hook ownership and mutation boundary

A pure tokenized classifier is the sole authority for status, install deduplication/rewrite, and uninstall. It owns only explicitly enumerated command layouts and host shapes that this project historically generated: bare `aslite`/`agentstate-lite` commands, managed npm/local-dev/plugin-cache entry layouts, the same-prefix npm Node launch, supported local-dev/plugin-cache Node launches, the legacy npx coordinate, and byte-exact OpenCode source. The command grammar accepts exactly one ASCII space between tokens and rejects control characters, shell operators, malformed quoting, and arbitrary basename lookalikes. Claude/Codex ownership additionally requires the exact generated host shape: `SessionStart` with `matcher: ""`, or the historical `session_start` location, and a `type: "command"`/ten-second entry. An unknown matcher, type, or timeout remains unmanaged even when its command text looks familiar. Claude/Codex settings carry no provenance marker, so an exact generated-compatible semantic shape is deemed owned regardless of who typed it; every non-exact/near-match hand-authored form is unmanaged. A substring mention or OpenCode marker alone is never ownership evidence.

| Class | Compatibility | Mutator behavior | Remedy |
|---|---|---|---|
| Exact `<npm-prefix>/bin/node <npm-prefix>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start`, expected timeout/shape | `current` | Idempotent owned update/removal | None |
| Exact historical `aslite session-start` or `agentstate-lite session-start`, exact generated host shape | `legacy_path_bound` | Remains owned; status/session-start prompts migration because ambient PATH may be absent in GUI hosts | Install global CLI, then hook install |
| Exact historically generated command with the pre-`session-start` subcommand, exact generated host shape | `stale` | Explicit install may converge; uninstall may remove | `aslite hook install --scope <scope>` |
| Exact generated direct npm/local-dev/plugin-cache entry path, exact generated host shape | `legacy_path_bound` | Remains owned; explicit install from supported global CLI converges | Install global CLI, then hook install |
| No managed hook | `absent` | Install may add without touching foreign entries | Hook install |
| Foreign/non-exact command or unknown matcher/type/timeout | `unmanaged` | Never rewrite/remove/deduplicate | User-managed |

C2H is a high-risk mutation-authority change. Adversarial QA runs both install and uninstall against every historical form and foreign near-match and byte-compares unrelated configuration.

For an `npm-package` invocation, persistent skill/hook install requires `durable_global` evidence, not merely PATH equality (npm exec/npx adds its cache bin to PATH). The classifier must resolve a managed bin on PATH to the running executable; obtain and validate the absolute `npm prefix --global`; prove the bin and real executable reside in that prefix's supported macOS/Linux global layout; prove `<prefix>/bin/node` resolves to the Node runtime currently executing the CLI; reject npm-exec/npx-cache path or environment evidence; and fail closed to `unknown`/refusal when any proof is unavailable. The installed hook invokes that stable Node path with the absolute package entry and `session-start`, and an execution proof must pass with a minimal GUI-style PATH. The resolver is injected for tests and performs no write. `npx` remains supported for read-only/trial/bootstrap commands. Temporary `marketplace-legacy` behavior remains explicitly legacy until cutover; `local-dev` behavior is test/developer-only.

## MCP

MCP contract v1 is the host argv contract `aslite mcp` resolved through PATH plus an initialize handshake whose server version equals the running CLI release. The CLI does not scan arbitrary host configs and therefore never claims per-host MCP compatibility. C2S owns launch-contract tests and generic migration guidance in `mcp --help`, `version` verification guidance, generated skill/docs, and release receipts. A test-owned/explicit config containing a version-keyed plugin cache path may be classified `legacy_path_bound`; no config is rewritten.

# 5. Protected staged-release state machine

## External protection prerequisite

Before the first live `v*` tag, a Brian-or-Mike-owned reviewed configuration receipt must show:

1. the temporary marketplace bot no longer pushes directly to protected `main` (preferred: it opens/updates a bot PR);
2. required `main` checks/review protection is active;
3. `v*` create/update/delete is restricted and release tags cannot be moved;
4. the release environment is restricted to selected `v*` refs with no admin bypass and binds the exact workflow, but adds no duplicate human approval;
5. npm's trusted publisher is exact repo/workflow/environment and stage-only; Brian and Mike have owner access, 2FA, and recovery; and
6. GitHub immutable releases are enabled. Traditional publish credentials are revoked after the first OIDC proof, not before recovery is proven.

The release preflight reads/verifies every externally observable setting and refuses staging when evidence is absent. npm does not validate the trusted-publisher binding until a real stage attempt, so P5S records reviewed configuration rather than claiming empirical OIDC success; E7A's first fail-closed stage is the empirical trusted-publisher proof. Code may merge before the external receipt; live tags may not.

## Exact candidate creation

Source gates may perform ordinary dev/test builds. After they pass, one release-candidate command cleans candidate output, builds once with required `npm-package`/tag SHA/clean facts, runs `npm pack` once, and emits:

- exact `.tgz`;
- npm pack filename/version/integrity;
- tarball SHA-256;
- tag, source SHA, build identity, and compatibility contracts;
- generated-asset/docs agreement receipt.

The package verifier gains `--tarball <path>` exact-artifact mode that never builds or packs. The workflow verifies and stages that same retained path; a literal workflow test fails if any later build/pack or different path occurs. Ordinary developer mode may still build/create a scratch candidate, but “build/pack once” refers specifically to the production candidate after source gates.

## States and owners

| State | Operation/owner | Required immutable receipt |
|---|---|---|
| `prepared` | Tag-triggered candidate job; read-only source permissions | version/tag/source SHA, run ID, artifact ID/digest, tarball SHA/integrity, exact-artifact proofs |
| `draft_prepared` | Separate job with only `contents: write`; create/update the tag's GitHub draft and attach the retained tgz/checksum/manifest | draft release ID plus asset IDs/digests matching the prepared receipt; draft remains unpublished/mutable but every later phase re-verifies it |
| `staged` | Same run, job with only `contents: read` + `id-token: write`; `npm stage publish <tgz> --tag <policy-tag>` | npm stage ID and immutable tag plus retained run/artifact/tarball identifiers; the run ends |
| `inspected` | Brian or Mike interactively runs `npm stage download <stage-id>` and compares its SHA-256 to the retained receipt | actor/time/stage ID and observed matching checksum; mismatch requires rejection |
| `rejected` | Brian or Mike: `npm stage reject <stage-id>` + 2FA | actor/time/reason/stage ID; no public version exists |
| `approved_public` | Brian or Mike after `inspected`: `npm stage approve <stage-id>` + 2FA | actor/time/stage ID; public version/tag snapshot |
| `registry_verified` | Separate manual finalizer invocation, scoped read permissions | source run/artifact/stage IDs; packument integrity/signature/provenance, clean install/bins/identity/MCP smoke |
| `promoted` | Brian or Mike interactive dist-tag command after required proof | before/after tags, actor/time, exact version |
| `final` | Manual finalizer job with `contents: write` verifies draft/asset IDs and digests, attaches only any final receipt, then publishes the prepared draft | immutable GitHub release/tag/assets/attestation and full receipt |

External approval never resumes/polls the original run. Finalization is a separate explicitly dispatched mode/job that accepts the original run/artifact/stage IDs, downloads/verifies rather than rebuilds, and fails closed on mismatch. Each state is idempotently reconcilable from immutable IDs.

## Transient tag/failure rules

- At rest before stable, `latest == next == supported prerelease`.
- For a prerelease transaction, staged/approved candidate uses `next`; during the bounded proof window `latest` remains the supported default and `next` is an explicit preview candidate, not passively advertised. `latest == next` is restored only after proof and promotion.
- Before approval, all tarball-install, upgrade-to-local-tarball, integration, offline, both-bin, identity, and downloaded-stage checksum tests must pass. Failed inspection rejects the stage; tags remain unchanged.
- After prerelease approval, run only registry-dependent smoke and the required public upgrade proof. On failure, immediately move `next` back to the prior known-good exact version, deprecate the public candidate with that recovery command, keep `latest` unchanged, and leave the GitHub release draft marked failed.
- At first stable, approval under `latest` can move the default before registry smoke. Any failure immediately restores prior `latest`, restores/removes `next` to its prior state, deprecates the failed version, and records the receipt. Success removes stale `next` unless a genuine preview exists.
- A published version is never reused. Project policy also treats a rejected stage as spent and prepares the next SemVer, even if npm would permit rejecting and restaging the same never-public version; this keeps stage receipts unambiguous.

# 6. Two-release acceptance protocol

Published `0.1.0-pre.2` cannot run commands introduced later, so acceptance has two honest transitions:

1. **Bootstrap transition:** pre.2 → first contract-bearing prerelease. Record pre.2's legacy one-line SemVer; use a separately documented exact version-pinned npm command; then record full new identity/check and reconcile skill/hook/MCP. Do not claim pre.2 discovered the release.
2. **Self-discovered transition:** first contract release → subsequent prerelease. The old installed CLI runs `version --check --tag next` after candidate approval, receives the real registry-selected exact command, executes it, and proves identity/integration/offline behavior. After promotion, a separate still-old install proves the cached default-`latest` orientation notice.

Marketplace retirement waits for both. The singular founder journey already required by `tasks/npm-cli-skill-prerelease` supplies at least one founder/unfamiliar-bundle acceptance; automated isolated upgrade evidence remains separate. Q6 owns the durable literal onboarding test and is not a hard dependency of the release mechanics.

[specifies decision](../decisions/version-update-contract.md)

[implements task](../tasks/version-string-channel-identity.md)

[uses vocabulary](version-update-domain-model.md)
