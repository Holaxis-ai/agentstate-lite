---
type: Task
title: 'Portable index projection: recursive core planner and ownership policy'
description: >-
  APPROVED direction — replace the unsafe dormant readIndex/regenerateIndex API
  with a pure recursive planner and marker/CAS-governed write policy. BLOCKED
  only until PR #127 (the overlapping log-helper prune) merges; then branch from
  fresh origin/main.
actor: openai/codex-portable-index
status: done
priority: '2'
assignee: openai/codex-portable-index
timestamp: '2026-07-20T02:15:06.515Z'
---
# Approved direction

Implement Unit 1 of [Portable generated indexes](../designs/portable-index-projection.md), approved by Mike on 2026-07-19. This replaces the prior delete-only task. `index.md` is now an intentional portable navigation projection, but the current `readIndex`/`regenerateIndex` API is not safe to expose or wire directly.

# Objective

Replace the dormant one-directory, overwrite-anything index API with one core-owned, backend-neutral projection boundary that can safely support an explicit CLI consumer in the next unit.

# Scope

1. Remove the unused `readIndex` convenience export. Projection writers must retain the raw reserved-file version from `readReserved`; parsing a body while discarding that CAS basis is not the owning abstraction.
2. Replace `regenerateIndex(bundle, dir)` with a pure recursive planner/renderer that:
   - consumes one bundle display name plus one complete `queryHeads`-shaped concept-head set;
   - plans every directory containing concepts, recursively, from that single observed head set;
   - guarantees every emitted child-index link has a corresponding planned target;
   - groups direct concepts by type and uses title/description projections;
   - emits deterministic, relative, POSIX-shaped links independent of backend/list order;
   - preserves root `okf_version` policy and emits no nested frontmatter;
   - carries the exact generated marker `<!-- agentstate-lite:generated-index:v1 -->` in every owned body;
   - accepts display text as input rather than deriving `.agentstate-lite` or a remote URL.
3. Add core-owned plan classification/write policy without adding a public command yet:
   - classify every target from a versioned `readReserved` as missing, generated, unchanged, or unmarked/refused;
   - perform all ownership/refusal checks before the first write;
   - default policy refuses the entire plan with zero writes if any existing target is unmarked or has a malformed/duplicate marker;
   - explicit force policy may adopt unmarked indexes and must expose that classification in the result;
   - byte-identical results are no-ops with no write or attribution;
   - changed writes use the exact version observed during classification, carry actor attribution, and write deepest directories first with root last;
   - a CAS conflict stops and reports completed/pending paths; rerun remains idempotent.
4. Keep the planner backend-neutral. It may be contract-tested over memory/filesystem seams, but this unit does not expose remote CLI generation.

# Explicitly preserved

- `index.md` and `log.md` reserved-file semantics and guards.
- Generic `readReserved`/`writeReserved` CAS across filesystem, memory, remote, and reference-server routes.
- `initBundle`'s current root `okf_version` stub behavior in this unit unless a narrowly required marker change is reviewed with the ownership policy.
- Git sync behavior; this unit never calls or modifies sync.
- `versionedMutation` and document/link mutation behavior.

# Non-goals

- No CLI command, README/skill discoverability, or user-facing receipt yet.
- No generation from mutations, sync, reads, home, session start, hooks, or Views.
- No event backbone, export framework, managed partial sections, new package, or bundle-wide transaction.
- No silent overwrite of hand-authored indexes.

# Required tests and red probes

- Recursive root/child/grandchild fixture: every generated child link resolves to a planned target.
- Reverse-order heads produce byte-identical plans.
- Root version preservation; nested files remain frontmatter-free.
- Generated marker ownership, including missing/valid/unmarked/malformed/duplicate cases.
- One unmarked target makes a multi-target default plan perform zero writes.
- Force adoption is explicit in the result.
- No-op plan performs zero writes and creates no actor attribution.
- Injected racing edit produces typed CAS conflict, never overwrite.
- Injected failure after a child write proves rerun completes without rewriting unchanged children.
- Red probe: disabling ownership refusal overwrites a hand-authored introduction and fails.
- Red probe: disabling recursive planning exposes a generated broken child link and fails.
- Existing reserved-file, index-init, backend, and wire contracts remain green.

# Dependency and delivery

This unit depends on [the log-helper prune](prune-unused-log-api.md) / PR #127 because both edit the same reserved-file section and core export surface. Do not branch or implement until #127 is merged into `origin/main`; then branch from the new current `origin/main`, never from the prior PR tip.

Deliver as one core-focused PR with full repository gate and independent exact-SHA review. The follow-on CLI task is [Portable index CLI](portable-index-cli.md).

[depends on](prune-unused-log-api.md)

# Implementation record — 2026-07-19

Unit 1 is implemented at amended commit `7a9cfc0020af2075f4d974ee7e50431e5809a526` in [PR #128](https://github.com/Holaxis-ai/agentstate-lite/pull/128). The local full repository gate passed (`npm run check`, exit 0), including the 389-case core suite, 34 npm-install proof cases, package verification, skill drift, and 15 Chromium UI/security E2E cases. The first independent review found three fail-closed edge cases (marker vocabulary in ordinary metadata, invalid/extra root metadata, and malformed nested YAML); all are fixed and regression-pinned. Independent re-review approved the exact amended SHA with no remaining findings (focused projection suite 10/10 and core TypeScript build green). GitHub-hosted CI remains a separate signal and is currently queued during the GitHub Actions service incident.

Shipped via PR #128 at merge commit `4e14fa33caa9a24a819ba8cc90e6186fd0f8f6b1` on 2026-07-19.
