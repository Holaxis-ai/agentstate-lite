---
type: Doc
title: agentstate-lite — the core (one page)
timestamp: '2026-07-06T20:24:10.312Z'
---
# agentstate-lite — the core (one page)

**Decided 2026-07-06** — after the Access retirement, the UI pause, and the
cognitive-ecosystem reframe, this page is the standing answer to "what is this product?"
Read it BEFORE re-litigating scope. Longer context: `docs/NORTH-STAR.md` (vision),
`STATUS.md` (honest state), the project board (live work).

## The product, in one sentence

**A markdown knowledge bundle in your repo, plus a CLI built for agents:** agents write
what they know and do; humans can read it; compare-and-swap versioning makes concurrent
agents safe; git shares it.

## Why it exists

Coding agents forget everything between sessions, step on each other's writes, and keep
what they know invisible to the humans they work for. agentstate-lite is the shared,
versioned, conflict-safe memory that fixes all three — in plain text, offline-first,
owned by the user.

## The deeper claim (why this shape)

From "Cognition as a Distributed Activity" (Derfer & Collier 2026) and its design skill:
discipline must live in the harness and fire at operational moments — not in a model's
memory. agentstate-lite is that harness for knowledge work:

- **Recipes declare structure** — kinds as plain convention docs (fields, enums,
  sections, freshness horizons), installable as text.
- **The engine provides the operational moments** — validation fires at the write; CAS
  fires at the write; attribution fires on every mutation; the session hook fires at
  session start.

A cognitive-ecosystem design becomes *installable text*: conventions → recipes →
cookbooks. The falsifiable test of this claim is `tasks/claims-recipe` (port
holaxis-claims as a recipe; declared success criteria; timeboxed). If it wins, recipes
are the product's generative layer. If it loses, the core above still stands on its own.

## Core (invest)

- **`packages/core`** — the engine: ONE parser / bundle walk / link resolver, the kinds
  registry, and the `StorageBackend` seam (filesystem default; versioning/CAS/attribution
  shaped for the hardest backend).
- **`packages/cli`** — the product: AXI-shaped commands, recipes, the served loopback head
  (safe local multi-agent), the project binding (in flight), git sharing (queued).
- Plain text, standards-clean (OKF), local-first: everything works with the network off.

## Frozen (do NOT invest without an explicit human decision)

- **`packages/worker`** (hosted tier): stays deployed, untouched. Auth exists and is
  dormant; no new auth work — the GitHub device-flow login is deferred indefinitely.
- **UI:** the v1 board was judged inadequate by the human; the plumbing (server, proxy,
  security, embed pipeline, client/query layer) is banked; the views await a rethink of
  the primitive itself (a kanban may be the wrong window onto a knowledge substrate).
- **Distribution / marketplace / npm / publishing:** mechanics are known and recorded
  (a public repo with a manifest IS a marketplace); everything gates on the human's
  publish decision (`tasks/publish-repo`).
- **Multi-bundle / registries / cross-project views:** prior art noted (openknowledge's
  registry); build only when per-project binding pain proves the need.

## Ecosystem stance (as of 2026-07-06)

The OKF spec is weeks old. The `openknowledge` CLI is approximately our free read tier
("a small tooling stack" — their words; no doc writes, no native versioning, no CAS, no
auth). We **own** the uncontested layers: the write substrate (CAS / history /
attribution), conventions-in-bundle, recipes, and agent/human symmetry. We **cede**
commodity static visualization. We **interop**: bundles we produce should pass their
validator.

## The test that governs everything

The generative test, from the skill this product now answers to: *if removing an artifact
would degrade the system's reasoning, it is load-bearing; otherwise it is scope.* Applied
at every "should we build X": does X serve the one-sentence product for the users we
actually have — one human and their agent fleet, across many projects? If not: freeze it.

[test count claim](../claims/repo-stats/test-count.md)
