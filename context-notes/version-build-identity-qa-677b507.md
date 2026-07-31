---
type: Context Note
title: Adversarial build identity QA at 677b507 — REJECT
actor: openai/codex-qa-build-identity
timestamp: '2026-07-31T22:13:48.854Z'
---
# Summary

Verdict: REJECT exact commit 677b5077edfe4e6bf82624a45432fbd4e1689c78.

One major empirical acceptance breach remains. A real unbundled source CLI launch reports runtime.executable_path and artifact.sha256 for src/invocation.ts, the helper module that owns currentExecutableRealPath, instead of the actual source entry src/index.ts named by process.argv[1]. This violates the I1 requirements that resolved executable path and lazy actual-file SHA describe the running entry bytes, and it defeats the claim that different executable bytes cannot present the same complete identity: changing src/index.ts without changing src/invocation.ts leaves the reported complete source identity unchanged.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable.

Proximate QA outcome: the evidence-overclaim boundary is not yet safe for source runs, so the corrected commit must return to Builder and exact-SHA Review before QA repeats.

# Major finding

Empirical command:

    node --import ./packages/cli/test/ts-loader.mjs ./packages/cli/src/index.ts version --json

Observed runtime fields:

    executable_path: /private/tmp/aslite-build-identity-qa.sShXCu/repo/packages/cli/src/invocation.ts
    artifact.sha256: sha256:82ab8ae749f996415b096636a177fb72502e4411d7436a526311c54a136ff043
    launch_mode: source
    launch_confidence: inferred

Independent byte command:

    shasum -a 256 packages/cli/src/index.ts packages/cli/src/invocation.ts

Observed:

    e0632200f4a9e32d8c65004f86403eb7898a3ac0263b23b93962a75a3c10bae5  packages/cli/src/index.ts
    82ab8ae749f996415b096636a177fb72502e4411d7436a526311c54a136ff043  packages/cli/src/invocation.ts

Cause visible in code: currentExecutableRealPath first realpaths fileURLToPath(import.meta.url) inside invocation.ts and returns it; only if that fails does it examine process.argv[1]. Bundling collapses import.meta.url to the correct single .mjs, but an unbundled source graph does not. The source fallback and source launch mode are public I1 behavior, so this is not merely a test-loader artifact.

Required correction: make the owner resolve the actual launched source entry without regressing bundled, direct, PATH, symlink, or missing-path behavior; add a real source-entry agreement test that compares executable_path and sha256 with argv[1] and that turns red if index.ts bytes change while invocation.ts does not. Exact replacement SHA requires independent Review before repeated QA.

# Survived attacks

All commands below ran in detached worktree /private/tmp/aslite-build-identity-qa.sShXCu/repo at exact 677b507 after npm ci and npm run build.

- Built direct launch reported local-dev, exact commit 677b507, dirty false, direct/certain, adjacent 0.1.0-pre.2, and runtime SHA a1bb75f0a79ab7f6d3416ec224373b9069c15f083e8251ea605b4f79892037c4. Independent shasum matched exactly.
- Copying identical built bytes under a misleading src directory remained direct/certain because direct argv evidence outranked layout; path changed, SHA stayed byte-identical, adjacent version became null.
- Setting npm_command=exec on direct bytes produced npx-inferred/inferred, never certain.
- Copying identical bytes under an _npx cache-shaped layout produced npx-inferred/inferred.
- A proven PATH symlink alias produced path/certain with the canonical target path.
- A renamed extensionless copy produced direct/certain with the actual renamed real path and matching SHA.
- A stale adjacent package.json version 9.9.9 did not replace baked 0.1.0-pre.2 and correctly reported version_mismatch true.
- Both --version and -v returned exactly 0.1.0-pre.2.
- Root npm run build exited 0 in the exact worktree.

# Environmental observation and intentionally unrun checks

A bare-shell direct node packages/cli/build.mjs local-dev attempt failed at the pre-existing UI embedder requirement that npm_execpath be present; the declared npm run build path supplied that environment and passed. This was not treated as the rejection.

Per orchestrator direction to issue the verdict once the adversarial matrix completed, QA stopped after the source breach. Dedicated QA did not rerun the optional built MCP handshake, marketplace/npm helper builds, or the full repository gate. The approved exact-SHA Review already recorded the focused MCP handshake and npm package proof as passing; the root agent owns subsequent gates, but they should not run as a shipping gate until this rejection is repaired and re-reviewed.

[task](../tasks/version-build-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[implementation plan](../plans/version-string-channel-identity.md)

[approved review before QA](version-build-identity-code-rereview-677b507.md)
