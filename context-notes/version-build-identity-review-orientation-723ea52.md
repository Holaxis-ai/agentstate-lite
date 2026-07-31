---
type: Context Note
title: 'Review orientation: executable-entry authority at 723ea52'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T22:19:37.416Z'
---
# Summary

- Exact review target: 723ea5234b0677a55e81e8f68d83628cf2390694, cumulative from the original I1 parent and structurally corrected after QA rejection of 677b507.
- Ultimate goal: reliable local-first shared memory with truthful executable and integration identity.
- Proximate goal: verify one registered production-entry authority correctly names and hashes bundle and source entries before QA reruns.
- No code edits; focused probes only; approval requires no blocker or major.

# Updated system model

The production CLI has one entry module and two shapes. In a bundle, index.ts becomes the emitted mjs; in source, index.ts remains the loader-launched entry. index.ts now registers its own file URL synchronously before main dispatch. invocation.ts canonicalizes and stores that entry idempotently, uses it before its helper fallback, and remains the one path owner for build identity, PATH matching, home bin, hook command, and skill layout.

Static ESM dependencies evaluate before the index body, but a scan found no module-evaluation-time call that resolves or caches executable identity; calls occur during main command handling after registration. There is no import cycle back from invocation.ts to index.ts. Helper-only tests do not evaluate index.ts and retain the deliberate helper fallback.

# Assumptions under focused attack

- A real loader source launch reports canonical src/index.ts and hashes those exact bytes.
- A built direct launch still registers/hashes the emitted mjs; copied and symlink/PATH launches remain honest.
- Concrete npx/PATH/direct evidence retains precedence over source-layout inference.
- Registration is same-path idempotent, conflicting valid registration fails, missing registration/path retains fallback without contaminating production.
- Home, hook, and skill consumers observe the registered path rather than a new fork.
- The source integration test is hermetic and derives its expected hash independently from index.ts bytes.
