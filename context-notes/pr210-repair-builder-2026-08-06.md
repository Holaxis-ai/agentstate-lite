---
type: Context Note
title: PR 210 canonical-path repair builder evidence
actor: codex-pr210-repair-builder
timestamp: '2026-08-06T19:18:45.232Z'
---
# Summary

Builder repair for PR #210 completed and pushed as exact SHA `5a5a6229c840992e94cf26e91bd1f82b4bf18488` on `fix/pr207-hook-ownership-housekeeping`.

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: close the two exact PR #210 review blockers with one canonical path admission invariant and one installed local-dev npm-layout authority projection. This serves the ultimate goal by keeping destructive ownership fail-closed while making every supported installed writer output self-recognizable.

## Implemented

- `hook-compatibility.ts` now requires every absolute runtime or executable token admitted by npm, repository local-dev, or marketplace ownership to already equal its platform-native normalized spelling. The classifier does not realpath or normalize foreign text into permission, and raw same-prefix npm pairing remains unchanged after canonicality passes.
- `install-authority.ts` distinguishes ordinary repository local-dev from a local-dev artifact installed in the exact scoped npm layout. The installed form reuses the durable npm-prefix/PATH/bin/package/runtime proof, keeps state `local_dev`, and returns stable `<prefix>/bin/node` evidence; proof failure remains `unknown`.
- The installed-package verifier now canonicalizes its scratch prefix, sanitizes inherited npm lifecycle/workspace configuration before invoking installed bins, and expects the stable prefix Node launch for both local-dev and npm-package artifacts.
- Pure and freshly built regressions cover `./`, duplicate separators, and parent segments across npm pairs, direct npm/local-dev/marketplace entries, noncanonical runtimes, Claude, Codex, and OpenCode. Foreign state is byte-preserved through install/uninstall.

## Red provenance at 4e394db

- Focused test-only run: 19 passed, 3 failed exactly at noncanonical classification, reconciliation mutation, and installed local-dev authority evidence.
- Freshly built lifecycle probe: 0 passed, 1 failed because install rewrote/deduplicated the foreign noncanonical rows.
- Existing complete installed-package proof failed before repair because the local-dev installed artifact composed a cross-prefix launch.

## Green evidence at 5a5a622

- Focused classifier/reconciliation/authority suite: 22/22 passed.
- Freshly built selected lifecycle suite: 3/3 passed (`hook install wires`, mismatched npm, noncanonical managed paths).
- Poisoned-lifecycle installed-proof regression: 1/1 passed.
- `npm run verify:npm-package`: exit 0, complete offline installed journey passed.
- `git diff --check`: exit 0.
- `npm run check`: exit 0 when run with loopback-listener permission. The first sandboxed attempt failed only because every server-backed test received `listen EPERM 127.0.0.1`; the authorized rerun executed the same gate successfully.
- Plugin manifests and committed plugin bundle are untouched.

## Scope and next gate

Eight files changed: two owning source files, five hook/authority test files, and the installed-package verifier. No public state names, shell grammar, generic npm fallback, marketplace policy, symlink/realpath recognition policy, manifest, or committed plugin artifact changed.

Next gate: fresh independent exact-SHA review of `5a5a6229c840992e94cf26e91bd1f82b4bf18488`, followed by adversarial QA only if review passes.

[tracks](../tasks/hook-compatibility-ownership.md)

[extends plan](pr210-repair-plan-2026-08-06.md)
