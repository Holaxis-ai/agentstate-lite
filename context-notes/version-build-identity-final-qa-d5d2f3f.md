---
type: Context Note
title: Final adversarial build identity QA at d5d2f3f — PASS
actor: openai/qa
timestamp: '2026-07-31T23:10:59.398Z'
---
# Summary

Verdict: PASS exact commit d5d2f3f2dd37472f612e5b287f449a1c0b942285.

Severity count: 0 blockers, 0 majors, 0 minors. No code or generated artifact was edited by QA. The exact detached worktree remained clean after every focused, transaction, and package proof.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable identity and distribution projections are truthful, reproducible, and supportable.

Proximate QA outcome: I1 satisfies its final dedicated adversarial QA gate. The runtime identity matrix, all projections, npm package proof, marketplace source transaction, and human/bot ownership boundary agree. The root agent may proceed to the full repository gate.

# Exact setup and scope

- Target: d5d2f3f2dd37472f612e5b287f449a1c0b942285.
- Parent: 3579b987e9f893b7b5cc4f3d9f83880e29fe19cb.
- Detached worktree: /private/tmp/aslite-build-identity-final-qa-d5d2f3f.oTDP0I/repo.
- npm ci passed.
- Root npm run build passed.
- Full npm run check was intentionally not run; it remains the root agent gate after this QA PASS.

# Runtime identity matrix

The local-dev built executable independently hashed to:

    ccdbc4fa971eb6e0975329de906c7704f7416aa788262574b2ef75e229b45bf4

version --json reported exactly sha256:ccdbc4fa971eb6e0975329de906c7704f7416aa788262574b2ef75e229b45bf4, package 0.1.0-pre.2, source commit d5d2f3f with dirty false, local-dev channel, the canonical executing path, and direct/certain. Exact argv realpath equality supports that confidence.

The loader-driven production source command:

    node --import ./packages/cli/test/ts-loader.mjs ./packages/cli/src/index.ts version --json

reported src/index.ts and SHA 495296ff75c0ed0dbfa3b6ef33370b97954b7d5b956fd170763aaf9d2155807a. Independent shasum matched exactly; imported helper src/invocation.ts had a different SHA, 2efe573cdaf60b8c1072b99493ad2dd13724cc842adb58258a9142ffcae33224. The previously rejected helper-file substitution remains closed.

Adversarial launch cases:

- Identical bundle bytes copied beneath a misleading src directory remained direct/certain because direct argv evidence outranked layout. Path changed; SHA remained exact.
- npm_command=exec produced npx-inferred/inferred, never certain.
- Identical bytes under an _npx cache-shaped path produced npx-inferred/inferred.
- A PATH symlink alias produced path/certain, invocation aslite, and the canonical target path.
- An extensionless renamed copy produced direct/certain with the actual renamed path.
- A stale adjacent package.json declaring 9.9.9 did not replace baked 0.1.0-pre.2 and reported version_mismatch true.
- Explicit missing executable evidence returned path null, SHA null, mode unknown, and confidence unknown.
- Both --version and -v printed exactly 0.1.0-pre.2.

No observed launch confidence exceeded its evidence.

# Projection and package agreement

Focused command:

    AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./test/ts-loader.mjs ./test/build-identity.test.ts ./test/version.test.ts ./test/home.test.ts ./test/skill-command.test.ts ./test/mcp.test.ts ./test/mcp-stdio.test.ts ./test/help-index-cli-integration.test.ts

Result: 76 passed, 0 failed.

This proved the exact envelope, same-SemVer byte distinction, malformed and missing evidence fail-closed behavior, aliases, real source entry, home version/channel/path, skill running-version authority over stale manifests, MCP command wiring, and built MCP initialize server version agreement.

The real bare home output independently projected:

    version: 0.1.0-pre.2
    channel: local-dev
    bin: exact canonical dist path

Direct package proof:

    npm run verify:npm-package

Result:

    verified @holaxis/aslite@0.1.0-pre.2: 30 files, zero runtime dependencies, bins aslite/agentstate-lite, offline workflow passed

The verifier asserts the installed artifact channel is npm-package, both installed bin identities are deep-equal, actual installed-file SHA and canonical path match, adjacent manifest agrees, home projects npm-package/version/path, compatibility contracts are 1/1/1, and both installed skill manifests report the package version.

# Marketplace source transaction

Command:

    npm run test:scripts

Result: 65 passed, 0 failed.

The real production-chain evidence showed:

- run forwards the identical explicit source object to regeneration.
- buildPluginBundle receives that snapshot and passes it with marketplace-legacy to buildCliBundle.
- Two explicit dirty:true marketplace builds were byte-identical.
- Executing one dirty:true build reported the exact supplied commit and dirty true; known evidence was not weakened to false or null.
- The real first regeneration changed the marketplace SKILL and bundle and bumped both manifests together from 1.0.134 to 1.0.135.
- The real second regeneration reused the same source snapshot, reported changed false, and retained both post-pass-one manifest versions. There was no feedback rebuild and no double bump.
- The default root build left plugins and .claude-plugin byte- and mode-identical.
- The complete npm package proof survived poisoned inherited lifecycle configuration.

The standalone checker samples source facts on line 32 before prepareCliBundleInputs on line 35, then passes that exact source object to buildCliBundle. Thus preparation cannot feed generated state back into checker provenance.

The workflow retains the exact load-bearing guard:

    if: github.actor != 'github-actions[bot]'

This remains necessary because the artifact built from source commit H cannot embed the later bot wrapper commit B. The serialized script suite pins this guard and preserves reset-before-retry workflow behavior.

# Distribution ownership and restoration

The cumulative branch diff contains no path under .claude-plugin or plugins/agentstate-lite. Exact d5d2f3f changes only packages/cli/SKILL.md relative to reviewed parent 3579b98.

The PR-owned npm drift gate passed:

    npm run check:skill -w @holaxis/aslite
    packages/cli/SKILL.md is up to date.

The committed npm skill contains version [--json] immediately before session-start.

Before and after all real transaction/package tests, the four bot-owned baseline hashes were identical:

- marketplace.json: 4df0291fb919fe613791037e0ec424ac680af05763500746cb2efb276ba56f2f
- plugin.json: 5b9937efe1eaea51d2624904febbd1e46f8307b0641ed843acde91e4171a837d
- plugin SKILL.md: 6aa72429f2ebc0c7efeb1b8389dd937159db9dc76422d32ca3ca25b5ced6dd4d
- plugin executable: ea7d76f1a9e816a8615724e3dc85ee813d572ee1654a917d6fe43b1171a3a0e7

File modes also remained unchanged, including executable mode on the committed marketplace mjs. Final git status was clean and git diff --check origin/main...HEAD passed.

# Gate disposition

Exact d5d2f3f passes dedicated final adversarial QA with zero findings. Remaining action is the root-owned full repository gate, followed by branch/PR handoff under the existing human merge boundary.

[task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[implementation plan](../plans/version-string-channel-identity.md)

[marketplace system model](version-build-identity-marketplace-regeneration-system-model.md)

[regeneration-loop analysis](version-build-identity-marketplace-regeneration-loop-a71866b.md)

[approved final review](version-build-identity-final-code-rereview-d5d2f3f.md)

[prior executable QA](version-build-identity-qa-723ea52.md)
