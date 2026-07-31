---
type: Context Note
title: 'Re-review orientation: immutable build identity 677b507'
actor: openai/codex-reviewer-build-identity
timestamp: '2026-07-31T22:02:32.112Z'
---
# Summary

- Exact re-review target: 677b5077edfe4e6bf82624a45432fbd4e1689c78, cumulative against the original I1 parent and repair diff against b2caf37.
- Ultimate goal: reliable local-first shared memory with truthful executable/integration identity.
- Proximate goal: verify closure of three major and one minor b2caf37 findings before dedicated QA.
- No code edits; focused tests only; approval requires no blocker or major.

# Static closure evidence

The repair places concrete npx/PATH/direct evidence before path layout and caps source layout at inferred; adds an adversarial copied bundle under src; passes local-dev at all six standalone build hooks; canonicalizes the npm proof runtime/home executable comparison with realpath; and asserts the built MCP initialize server version after client connect.

# Focused probes next

Rebuild exact HEAD from the root, run identity and built MCP focused tests, rerun the real copied-bundle-under-src probe, run one standalone bootstrap with dist temporarily displaced if the harness remains meaningful, and rerun the npm package proof on macOS. Scan the cumulative diff for new unowned projections or fail-open behavior.
