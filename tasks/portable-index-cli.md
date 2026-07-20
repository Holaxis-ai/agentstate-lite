---
type: Task
title: 'Portable index projection: explicit local CLI consumer'
status: in_progress
priority: '2'
description: >-
  After the core planner ships, add local-only index generate with recursive
  generation, --check, --force adoption, actor/CAS receipts, and an
  installed-tarball portability journey.
actor: openai/codex-portable-index-cli
assignee: openai/codex-portable-index-cli
timestamp: '2026-07-20T02:43:12.811Z'
---
# Approved direction

Implement Unit 2 of [Portable generated indexes](../designs/portable-index-projection.md) after the core planner/ownership unit ships.

# Objective

Expose one explicit, local-first CLI consumer that lets a user or agent make a concrete bundle navigable in GitHub, ordinary Markdown editors, copied folders, and skill-free/npm-first environments without risking curated indexes.

# Command contract

```text
aslite index generate [--dir <bundle>] [--check] [--force] [--actor <name>]
```

- Whole resolved local bundle is the only v1 scope; recursive completeness is mandatory.
- Default execution creates missing indexes and refreshes marker-owned indexes.
- Any unmarked or malformed-marker target refuses before all writes.
- `--force` explicitly adopts/replaces unmarked indexes and lists every adoption.
- `--check` runs the identical plan and safety classification but writes nothing. Its structured result distinguishes clean, drift, and refusal without making read-oriented commands mutate.
- Actor precedence follows flag > `AGENTSTATE_LITE_ACTOR` > absent. Only changed reserved-file writes carry attribution.
- Receipts report capped path lists and total counts for created, updated, unchanged, adopted, refused, completed, and pending outcomes as applicable. No-op execution exits 0 and writes nothing.
- First slice is local-only: no `--remote`, no ambient target, and no automatic sync.

# Scope

1. Add command registration, generated CLI reference/help, structured AXI-conformant receipts, and typed error mapping over the core policy.
2. Resolve display name through the existing bundle-display-name authority, falling back to the project folder rather than `.agentstate-lite`.
3. Decide and pin `--check` exit semantics within the existing capped taxonomy; agents must be able to branch on structured fields rather than prose.
4. Mark newly initialized tool-authored root stubs as generated only if doing so cannot change init's existing root identity/version behavior unexpectedly. Existing unmarked roots always require explicit force adoption; do not heuristically match legacy templates.
5. Add only the minimum README/CLI-reference/skill discoverability needed for the shipped command. Correctness and command knowledge live in the npm CLI, not a skill-only reference.

# Non-goals

- No mutation, sync, read, home, session-start, hook, or View automation.
- No remote CLI generation, export/package framework, event backbone, managed blocks, or per-directory configuration.
- No recipe-bundled reserved files; generation happens only after definitions are installed into a concrete host bundle.

# Acceptance journey

In a scratch bundle, using the installed offline npm tarball:

1. Initialize and add root, child, and grandchild concepts.
2. `index generate --check` reports the full recursive plan and makes zero writes.
3. The legacy unmarked root makes default generation refuse with zero changed files.
4. `--force` adopts it; every generated relative link resolves.
5. Rerun is a no-op.
6. Editing one concept description makes `--check` report drift; generation updates only affected ancestor indexes.
7. Removing/changing the marker makes default generation refuse.
8. No command invokes sync or depends on plugin/skill installation.

# Dependency and delivery

Depends on [Portable index core planner and ownership](prune-regenerate-index-api.md). Deliver as a separate CLI-focused PR after that unit merges, with full repository gate, npm-tarball journey proof, and independent exact-SHA review.

[depends on](prune-regenerate-index-api.md)

# Implementation record — 2026-07-19

Unit 2 is implemented at exact commit `d3674df2ae33a6985fc8078a8c6abf95bddf0572` in [PR #131](https://github.com/Holaxis-ai/agentstate-lite/pull/131), intentionally left unmerged for owner review.

The exact-SHA local full repository gate passed (`npm run check`, exit 0), including installed-package verification, generated npm-target skill validation, and 15 Chromium UI/security E2E cases. The focused portable-index command suite passes 7/7. GitHub-hosted checks are all green on the same SHA: Node 20 built-CLI smoke plus the Node 22 and Node 26 gates.

Independent exact-SHA mechanism review is **APPROVE** with no remaining findings. Its first pass identified two P2 recovery-command issues: explicit `--dir` paths were not POSIX-shell-safe and `--check --force` dropped `--force` from its recovery instruction. Both now use one command builder, including embedded apostrophes, and a regression test reasserts zero-write preview behavior.

Fresh-agent black-box acceptance against only the exact installed four-file npm tarball is **PASS**. Artifact SHA-256: `704fc331672de3e7ca7cc47776f463c0a9ac87e657e3895c9253c604bf95a072`. The journey proved recursive generation, byte-identical check/refusal paths, deliberate one-file adoption, five relative/resolving links, no-op rerun, and a final clean check. It also executed the emitted force-recovery command character-for-character through `/bin/sh -c`, with npm offline, against a bundle path containing spaces and an apostrophe; the command adopted exactly one index and exited 0.
