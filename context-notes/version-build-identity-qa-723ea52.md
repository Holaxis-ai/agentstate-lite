---
type: Context Note
title: Adversarial build identity QA at 723ea52 — PASS
actor: openai/codex-qa-build-identity
timestamp: '2026-07-31T22:27:58.952Z'
---
# Summary

Verdict: PASS exact commit 723ea5234b0677a55e81e8f68d83628cf2390694.

Severity count: 0 blockers, 0 majors, 0 minors. No code edits were made. The detached exact-SHA worktree remained clean.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable.

Proximate QA outcome: the explicit production-entry registration repairs the rejected source executable identity, and the adversarial matrix found no confidence claim stronger than its observable evidence. Exact 723ea52 passes the dedicated QA gate; the root agent may proceed to the remaining focused/package and full repository gates.

# Former rejection reproduction

After npm ci and the repository-required root npm run build, the exact previously failing command was rerun:

    node --import ./packages/cli/test/ts-loader.mjs ./packages/cli/src/index.ts version --json

Observed:

    executable_path: /private/tmp/aslite-build-identity-qa-723ea52.YqLYgx/repo/packages/cli/src/index.ts
    artifact.sha256: sha256:495296ff75c0ed0dbfa3b6ef33370b97954b7d5b956fd170763aaf9d2155807a
    launch_mode: direct
    launch_confidence: certain

Independent byte oracle:

    shasum -a 256 packages/cli/src/index.ts packages/cli/src/invocation.ts

Observed src/index.ts SHA 495296ff75c0ed0dbfa3b6ef33370b97954b7d5b956fd170763aaf9d2155807a, exactly matching the envelope. src/invocation.ts SHA was independently different, 2efe573cdaf60b8c1072b99493ad2dd13724cc842adb58258a9142ffcae33224. The old helper-file substitution is closed. direct/certain is warranted because registered entry and process.argv[1] canonical realpaths are equal; it does not depend on the src directory hint.

A first attempt before root build failed because fresh-worktree sibling dist outputs were absent. This is the repository-documented setup prerequisite, not product behavior; the identical command succeeded after npm run build.

# Built evidence matrix

The root build produced packages/cli/dist/agentstate-lite.mjs at source commit 723ea52, dirty false, channel local-dev.

- Independent shasum of the built file was 4ddbb4f35e44db8c9d7601c2ce27673241e0d5797f14d9212d497365193241c9. version --json reported exactly sha256:4ddbb4f35e44db8c9d7601c2ce27673241e0d5797f14d9212d497365193241c9.
- Direct built launch reported its canonical bundle path and direct/certain, supported by exact argv realpath equality.
- Copying identical built bytes beneath a misleading src directory remained direct/certain because direct evidence outranked the layout hint. SHA remained identical and path changed to the actual copy.
- Setting npm_command=exec on direct bytes produced npx-inferred/inferred, never certain.
- Copying identical bytes beneath an _npx cache-shaped path produced npx-inferred/inferred.
- A PATH symlink alias produced path/certain, invocation aslite, and the canonical target executable path; managed-bin comparison proved the relationship.
- A renamed extensionless copy produced direct/certain with its actual canonical renamed path and matching SHA.
- An adjacent package.json declaring 9.9.9 did not replace baked 0.1.0-pre.2; drift reported adjacent_package_version 9.9.9 and version_mismatch true.
- Both --version and -v printed exactly 0.1.0-pre.2.

Exact commands used the detached worktree bundle and copies under /private/tmp/aslite-build-identity-evidence-723ea52.GHMNnl. Each command exited 0.

# Missing and registration boundaries

Injected complete path absence:

    buildIdentityEnvelope({ executablePath: () => undefined, managedBin: () => undefined, invocation: () => "test", argv: ["node"], env: {} })

returned executable_path null, artifact.sha256 null, launch_mode unknown, and launch_confidence unknown.

Registering a nonexistent entry path did not invent it; helper-only source fallback resolved src/invocation.ts and classified it source/inferred based only on suffix/layout.

Registering src/index.ts twice was idempotent. A subsequent attempt to register the distinct valid src/cli.ts threw:

    CLI executable entry was already registered as .../src/index.ts; refusing .../src/cli.ts

Thus production registration is highest authority, same-value reuse is stable, missing evidence falls back without certainty, and conflicting valid evidence fails closed.

A helper-only import that never evaluates src/index.ts reported src/invocation.ts with source/inferred and its actual helper SHA. This is the modeled test-only fallback and does not masquerade as production registration.

# Focused executable tests and MCP

Command:

    AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./test/ts-loader.mjs ./test/build-identity.test.ts ./test/version.test.ts ./test/mcp-stdio.test.ts

Result: 14 tests passed, 0 failed.

This covered malformed baked identity fail-closed behavior, missing path, launch-mode distinctions, both aliases, exact built envelope, real loader-driven source entry path/SHA, lone plugin layout, stale manifest, same-SemVer byte distinction, mandatory and marketplace build flavors, and the built MCP stdio handshake. The MCP test asserts initialize server version agrees with cliVersion and also preserves stdout purity on failure.

# Scope and next gate

QA did not run the full repository gate, per instruction. The root agent owns the remaining focused/package proof and full npm run check after this PASS. The worktree was detached at exact 723ea52 and git status remained clean.

[task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[implementation plan](../plans/version-string-channel-identity.md)

[system model](version-build-identity-executable-path-system-model.md)

[approved exact-SHA review](version-build-identity-code-review-723ea52.md)

[prior QA rejection](version-build-identity-qa-677b507.md)
