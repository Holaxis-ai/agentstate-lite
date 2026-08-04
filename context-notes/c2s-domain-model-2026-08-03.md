---
type: Context Note
title: 'C2S domain model: skill compatibility and bounded MCP launch'
actor: codex-c2s-orchestrator
timestamp: '2026-08-04T00:41:42.916Z'
---
# Summary

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their
agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the
harness.

## Proximate goal

Make the installed Agent Skill, selected `aslite` executable, and MCP initialize identity provably
compatible without mutating unmanaged integrations. This serves the ultimate goal by ensuring
agents execute the same durable contract that their installed instructions describe.

## Terms

- **Running distribution:** the actual `aslite` executable selected for this invocation plus its
  authoritative `BuildIdentityV1` evidence.
- **Running skill assets:** `SKILL.md` and `references/**` shipped beside the running npm package.
- **Install target:** one host/scope skill directory managed by `aslite skill install`.
- **Owned manifest:** the exact existing package/installer/file shape that permits AgentState Lite
  to inspect or mutate a target. Compatibility never broadens ownership.
- **Legacy manifest:** an owned pre-v2 receipt lacking schema/contract/digests. It remains owned and
  can be current when actual bytes match.
- **Manifest v2:** additive receipt containing schema, package/version/installer, compatibility
  contract, informational source identity, sorted asset list, and SHA-256 for every asset.
- **Asset compatibility:** comparison of actual installed bytes with running assets, plus the
  installed-vs-running skill contract relation. Provenance facts alone never make equal assets
  stale.
- **Durable global evidence:** proof that a persistent npm-package installer is a real supported
  npm-global executable, not a transient npm-exec/npx cache path. Missing proof fails closed before
  writes.
- **MCP launch contract:** host argv `aslite mcp` resolved through PATH and an initialize handshake
  whose server version equals the running CLI release.
- **Legacy path-bound MCP evidence:** an explicit test-owned config using a version-keyed plugin
  cache path. It can be reported as legacy but is never rewritten.
- **Remedy:** additive, explicit user action derived from compatibility state; no implicit repair.

## Compatibility states

| Target evidence | Existing public state | Additive compatibility state | Mutation/remedy |
|---|---|---|---|
| Missing target | absent | absent | Offer skill install |
| No valid owned manifest | unmanaged | unmanaged | Never overwrite/remove |
| Matching bytes, equal contract | installed | current | None |
| Matching bytes, legacy receipt | installed | current (`legacy_receipt`) | Optional receipt refresh |
| Byte drift or lower installed contract | stale | stale | Explicit reinstall |
| Installed contract higher than CLI | retain owned state | newer_contract | Upgrade/check CLI; never silently downgrade |

## Invariants

1. Existing `state` values and top-level running `version` remain byte/type compatible; new evidence
   is additive under per-host `compatibility`.
2. `files` and `file_sha256` are sorted, cover exactly the same managed assets, and each digest
   matches actual installed bytes.
3. Ownership and compatibility are separate decisions: corrupted/incompatible owned state can be
   reported, but unmanaged state is never mutated.
4. Same SemVer with different actual bytes is stale. Matching bytes remain compatible even when
   source commit/channel/artifact SHA differ.
5. A higher installed skill contract is `newer_contract`; an older CLI never downgrades it.
6. Persistent `npm-package` skill install requires injected, fail-closed durable-global proof before
   any write. Local-dev and temporary marketplace behavior retain their explicitly bounded policy.
7. MCP proof is bounded to PATH argv and initialize response. The CLI never scans or claims
   compatibility for arbitrary host configurations.
8. MCP initialize `serverInfo.version` derives from the same running identity as `aslite version`.
9. Generic legacy-cache migration guidance appears only on the approved bounded help, generated
   skill, version verification, and release-receipt surfaces.
10. C2S does not implement host MCP installation, update selection, hook ownership, release
    automation, or arbitrary config rewriting.

## Interaction model

```text
running BuildIdentityV1
        | skill contract + release version
        v
running packaged skill assets ---- actual-byte comparison ---- installed target
        |                                                   | owned manifest v1/v2
        +---------------- compatibility classifier <--------+
                                    |
                         existing state + additive evidence/remedy

PATH `aslite mcp` ---- initialize ----> serverInfo.version
       |                                  |
       +-------- same running identity ---+
```

## Phase state

- C2S is claimed by `codex-c2s` on `feat/skill-mcp-compatibility`.
- Normative sources are `designs/version-update-protocols`, `plans/version-string-channel-identity`,
  and `tasks/skill-mcp-compatibility`.
- PR 204 owns release workflows/scripts plus `packages/cli/build.mjs` and package metadata. C2S must
  avoid those files unless a proven requirement forces coordination.
- Next: map current implementation/tests, establish red tests, then implement behind the existing
  command surfaces.

[models](../tasks/skill-mcp-compatibility.md)

[implements plan](../plans/version-string-channel-identity.md)

[implements protocol](../designs/version-update-protocols.md)
