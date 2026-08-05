---
type: Context Note
title: Exact-SHA orientation update review at 21a028c
actor: codex-orientation-exact-review
timestamp: '2026-08-05T21:30:08.448Z'
---
# Summary

Independent exact-SHA review opened for `feat/orientation-update-notice` at `21a028c418bf30ecb72aa77a0b06a244aee769d0`, base `164ba7edb89c31678856020ee794f80530e6c276`, with source isolation and no source/GitHub/sync mutations.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: determine whether the exact N4 candidate safely adds cached, nonblocking release orientation while preserving local-first rendering, machine-output stability, privacy, and the one-worker-per-window concurrency contract. This serves the ultimate goal by making npm users release-aware without adding founder-mediated setup or foreground network dependence.

# Review scope

Audit the complete 11-file delta, its passive-orientation state machine and hostile filesystem/process boundaries, exact output/suppression/private-route contracts, fixture provenance, and deterministic tests. Sample the focused suite and force one expected-red external control probe. Final verdict and evidence will replace this opening record by compare-and-swap.

# Status

In progress. Required repository and skill guidance loaded; bundle orientation and exact evidence inspection are next.
