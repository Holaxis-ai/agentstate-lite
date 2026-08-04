---
type: Context Note
title: 'Exact-SHA C2S review: 0fa253f blocked'
actor: codex-c2s-reviewer
timestamp: '2026-08-04T01:16:54.776Z'
---
# Summary

Verdict: BLOCKED. Exact commit 0fa253f342c119f89e9295f18ecf4a9a678f34ec must not advance to QA or merge because the new owned-manifest parser accepts Windows backslash traversal entries that the destructive command layer explicitly forbids.

## Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet, with operational discipline encoded in the harness.

Proximate goal: independently determine whether exact SHA 0fa253f safely preserves the C2S compatibility and mutation contract. This serves the ultimate goal by preventing installed instructions and selected runtime bytes from silently diverging or escaping their managed target.

## Blocking finding

HIGH — exact owned manifests can escape the target during Windows uninstall.

packages/cli/src/skill-compatibility.ts:46-52 accepts any nonempty references path segments except literal dot and dot-dot segments split on forward slash. It does not reject backslashes or NUL. parseOwnedSkillManifest uses that predicate at lines 54-62 and 101-107, bypassing isSafeManifestEntry in packages/cli/src/commands/skill.ts:283-291, even though that existing validator rejects backslashes, NUL, absolute paths, and traversal.

The uninstall path at packages/cli/src/commands/skill.ts:522-539 trusts parsed manifest entries and resolves each with join(dir, ...relativePath.split("/")). On Windows, a sorted exact legacy receipt containing SKILL.md plus references/..\\..\\victim.txt is accepted as owned; path.win32.join resolves the second entry outside the target. A target containing only the manifested SKILL.md can pass the extras preflight, after which uninstall removes SKILL.md and the outside victim. NUL entries can also pass ownership and cause a late filesystem exception after partial mutation.

A pure empirical probe against the exact SHA returned owned true, kind legacy, and joined path C:\\project\\.codex\\skills\\victim.txt for that fixture. This is a destructive path-traversal regression from the parent parser, which applied isSafeManifestEntry.

Required repair: make the ownership parser consume the one safe manifest-entry authority, or move that authority into the parser module and have all callers use it. Add a parser-level regression for backslash and NUL plus a Windows path-normalization proof that install and uninstall refuse without changing target or victim bytes.

## Remaining audit

No additional blocking finding was identified in the completed static audit.

Survived attacks and reasoned checks:
- Exact legacy/v2 package, installer, schema, sorted-file, contract, source-identity, and digest ownership is otherwise strict; unknown future schemas and base-ownership near misses fail closed.
- Corrupt exact-v2 extensions remain owned-repairable; readable higher contracts precede receipt invalidity and explicit install refuses downgrade before debris cleanup.
- Actual installed bytes plus receipt digests and contract relation drive compatibility; version/source/channel/artifact provenance remains informational.
- Transitional legacy manifests preserve manifest-first crash ownership across fresh install and upgrades; the focused suite covers partial, debris, symlink, and obsolete-file states.
- Per-target ownership/extras/obstruction refusals defer debris cleanup until after read-only preflight. Authority refusal occurs once before either host target.
- Durable npm-global authority is fail closed for unsupported platforms, missing prefix, npm-exec/npx evidence, cache executable paths, PATH shadowing, wrong prefix bins, and wrong package layout. It realpaths executable and prefix and requires the exact supported POSIX global layout.
- Existing skill state/version fields remain and compatibility evidence is additive with fixed keys.
- MCP guidance is bounded to help/generated-skill/version-help surfaces in this SHA, makes no host-inspection claim, and the literal PATH initialize test compares the server release to the selected CLI release while byte-checking an explicit config sentinel.
- Root orchestrator reports full npm run check green at this exact SHA, including package verification, 15 MCP App browser tests, and 19 UI E2E tests. PR 204 release-receipt/exact-retained-artifact integration is intentionally excluded.

Test-gap diagnosis: packages/cli/test/skill-command.test.ts:529-547 proves isSafeManifestEntry rejects backslashes, while packages/cli/test/skill-compatibility.test.ts:31-52 never sends a backslash or NUL entry through parseOwnedSkillManifest; the disconnected tests let the destructive regression pass the full gate.

## Progress

Review of exact SHA 0fa253f is complete and blocked. Next action is builder repair at the shared safe-entry boundary, focused red/green regression evidence, a new exact candidate SHA, then a fresh independent exact-SHA review before adversarial QA.
