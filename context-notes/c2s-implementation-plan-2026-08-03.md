---
type: Context Note
title: C2S implementation contract and gate plan
actor: codex-c2s-orchestrator
timestamp: '2026-08-04T00:53:30.334Z'
---
# Summary

C2S implements the approved skill compatibility and bounded MCP launch contract without crossing
PR 204's release-automation ownership boundary.

## Goals

Ultimate goal: make AgentState Lite the shared, versioned, conflict-safe markdown memory for one
human and their agent fleet.

Proximate goal: make the installed Agent Skill, selected `aslite` executable, and MCP initialize
identity provably compatible without mutating unmanaged integrations. This serves the ultimate goal
by ensuring agents execute the same durable contract their installed instructions describe.

## Public additive skill status schema

Existing `skill.version`, host `state`, and optional host `version` remain unchanged. Every status
host gains this total fixed-key object:

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

All keys are present; inapplicable values use `null`. Install remedies use the running invocation
plus `skill install --scope <scope>`. `upgrade_cli` has no guessed command until supported-release
selection exists.

Precedence: absent; ownership unproven; readable higher contract; invalid v2 extension or digest;
lower contract; asset drift; matching legacy; matching exact v2. A higher contract retains the old
public state derived from actual bytes but blocks install before any mutation.

## Implementation units and dependencies

1. Test owner: add pure compatibility/parser and durable-global classifier tests, then command-level
   no-write and Manifest v2 tests. These establish the red contract before implementation.
2. Builder: add a pure owned-receipt/compatibility layer and a reusable persistent-install authority.
   `commands/skill.ts` consumes both, keeps legacy interruption receipts, and emits final exact v2.
3. Builder: add bounded shared MCP migration guidance and literal PATH initialize proof. No host
   configuration discovery or mutation is introduced.
4. Regression: run focused skill/MCP/render/resolver suites, generated-skill drift, typecheck, then
   the full repository gate.
5. Independent exact-SHA Reviewer must pass before a separate adversarial QA agent exercises owned,
   unmanaged, legacy, partial, durable/no-write, and MCP boundaries.
6. After PR 204 lands, rebase and extend its owned exact-tarball verifier/release receipt rather than
   editing or duplicating those files concurrently.

## File ownership

- Core: `packages/cli/src/skill-compatibility.ts`, `packages/cli/src/install-authority.ts`,
  `packages/cli/src/commands/skill.ts`.
- Bounded MCP guidance: `commands/mcp.ts`, `commands/version.ts`, `skill-render.ts`, generated npm
  `SKILL.md`.
- Tests: new pure suites plus focused extensions to existing skill/MCP/version/distribution suites.
- Excluded until post-204 rebase: release workflows, release scripts/verifier, `build.mjs`, package
  manifests, plugin-bot generated assets.

## Acceptance matrix

- Exact v2 keys, sorted files/digests, digest-to-byte parity, build identity source.
- Exact historical ownership only; malformed/near-match/symlink targets remain byte-identical.
- Compatibility rows cover absent, unmanaged, current v2, current legacy, stale receipt/bytes/lower
  contract, and newer contract without silent downgrade.
- Both project/global npm-package installs require one fail-closed durable-global preflight before
  either target writes; local-dev remains explicitly allowed and Windows/unknown fail closed.
- Literal PATH argv `aslite mcp` completes initialize and reports the same release as the PATH CLI.
- Guidance exists only on approved help/generated-skill/release-receipt surfaces.

[task](../tasks/skill-mcp-compatibility.md)

[domain model](c2s-domain-model-2026-08-03.md)

[architecture reconnaissance](c2s-architecture-scout-2026-08-03.md)

[test matrix](c2s-test-matrix-scout-2026-08-03.md)

[normative protocol](../designs/version-update-protocols.md)
