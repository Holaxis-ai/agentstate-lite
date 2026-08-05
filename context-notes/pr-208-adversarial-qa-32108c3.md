---
type: Context Note
title: PR 208 adversarial QA at 32108c3
description: >-
  PASS: hostile registry, exact output/exit, and recursive no-write QA at the
  reviewed exact SHA.
actor: codex-supported-release-check
timestamp: '2026-08-05T19:16:46.193Z'
---
# Summary

Adversarial registry/output/no-write QA **PASS** at exact PR #208 SHA `32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9`. No findings survived. Confidence: high.

# Scope and isolation

The QA agent verified the clean exact head before and after testing and worked from a disposable `git archive` of that SHA. It was constrained to read-only inspection, loopback fixtures, and temporary probes. It made no source, GitHub, npm, or bundle mutation and did not need the public registry.

# Evidence

- Focused release-check, identity, and built-help suite passed 36/36 from the disposable exact-SHA archive.
- Existing hostile-registry coverage passed for timeout, offline, redirect/no-retry, malformed JSON, invalid UTF-8, declared and streamed oversize, deprecation precedence, and tag movement.
- Independent loopback probes confirmed peer shutdown, stopped writes, and zero active connections after streamed HTTP 200 overflow, timeout, declared oversize, and redirect; the redirect target received zero requests.
- Exact JSON and TOON byte snapshots matched. Recorded SHA-256 prefixes/suffixes: JSON `79cbdbda…a0a6e`; TOON `487fabca…5b43`.
- Exit behavior matched the contract: successful, deprecated, and actionable states exit 0; unavailable states exit 1; usage errors exit 2. Identity remained present on unavailable results and all remediation commands were version-pinned.
- Recursive before/after snapshots were byte-identical for isolated cwd, HOME, npm state, Claude/Codex/OpenCode integration state, AgentState preferences, a fixture bundle, and the shared project bundle.
- Final exact-head and cleanliness check remained `32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9` with no tracked or staged changes.

# Verdict

`status: completed`; `verdict: pass`; `issues: []`; `confidence: high`.

The next gate is the full repository check at the same exact SHA.
