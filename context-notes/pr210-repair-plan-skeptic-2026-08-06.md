---
type: Context Note
title: PR 210 repair-plan skeptic acceptance and risk review
actor: codex-pr210-plan-skeptic
timestamp: '2026-08-06T18:51:08.147Z'
---
# Summary

Independent skeptic pass started against exact head `4e394db65346d957676e590d7ca287d20b39dafb`. Source and Git remain read-only; this note is the only bundle artifact this role will mutate.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: produce an independently derived must-pass acceptance and risk matrix for the two PR 210 blockers, so a third party can reject any narrow repair that reopens destructive ownership or breaks the installed-package proof. This serves the ultimate goal by making writer/recognizer provenance and byte preservation explicit review gates.

## Current system model

The hook writer selects an installation authority, composes a runtime/package argv pair, serializes it through a closed lexical grammar for Claude and Codex or generated source for OpenCode, then self-checks the same classifier used by status, reconciliation, deduplication, and uninstall. Mutation authority therefore requires both exact host shape and proof that the command belongs to a canonical writer or enumerated historical language. Foreign or ambiguous state must remain byte-identical.

The current exact head has two interacting defects: stable npm pairing accepts noncanonical path spellings that persistent authority cannot emit, while the local-dev installed-tarball proof composes a host runtime with an npm-layout package entry that the tightened cross-prefix rule rejects.

## Unverified assumptions

- Canonicality must be defined per path token without normalizing a foreign spelling into ownership, and Windows semantics may differ from POSIX normalization.
- The supported local-dev npm-layout artifact needs a narrowly named authority relationship; it must not become a generic cross-prefix npm exception.
- Same-prefix npm, marketplace, local-dev source-tree, enumerated historical forms, and all three host lifecycle projections must remain mutually consistent.

## Progress

Repository guidance, product goal, task, orchestration note, exact-SHA findings, and both hook-ownership system models read. Code and tests are next.
