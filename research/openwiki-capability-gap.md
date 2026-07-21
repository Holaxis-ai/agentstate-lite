---
type: Research
title: >-
  OpenWiki vs AS: interop is free, generation is out of scope, the recipe is
  schema + an authoring skill
description: >-
  Dual-codebase gap analysis (langchain-ai/openwiki + AS source), empirical.
  KEY: (1) INTEROP WORKS TODAY unmodified — an OpenWiki OKF bundle opens cleanly
  in AS (list/read/link/status all correct); the premised log.md/logs.md
  mismatch does NOT exist (OpenWiki uses log.md). (2) AS MEETS and EXCEEDS
  OpenWiki on the STORE side (index normalization is CAS+marker-owned vs
  unconditional overwrite; kind validation is a strict superset; live Views >
  static markdown). (3) The big GAP — LLM-driven generation from code +
  incremental updates — is ARCHITECTURAL and OUT OF SCOPE: AS is a
  zero-runtime-dependency store; embedding an LLM harness would break gate 5 /
  local-first / no-secrets. (4) The AS-native codebase-doc shape = a RECIPE
  (schema, small-medium) + an AUTHORING SKILL that lets the coding agent already
  driving AS do the generation — NOT a second agent harness. Full matrix +
  differentiators + bottom line in body.
actor: mike/claude
timestamp: '2026-07-21T02:06:48.445Z'
---
# OpenWiki vs AgentState — capability gap (2026-07-20)

Dual-codebase analysis (langchain-ai/openwiki + AS's actual source), read-only, empirical where marked.

## Headline
OpenWiki is an **agentic generator** — it runs its own multi-provider LLM loop to walk a repo and
write/maintain a wiki. AgentState is a **typed store** a third-party agent writes into. The correct
AS-native shape for codebase docs is NOT to rebuild OpenWiki's generator — it's a **recipe (schema) +
an authoring skill**, letting the coding agent already driving AS do the generation, while AS
provides the superior store / validation / graph / live UI.

## Interop: WORKS TODAY, no adapter (EMPIRICAL)
A hand-built OpenWiki-shaped OKF bundle opened cleanly in AS unmodified: `list` excluded
`index.md`/`log.md` as reserved; `doc read` preserved OpenWiki's unknown `openwiki_generated`
extension field (OKF §9 permissive consumption); `link show` derived the backlink bidirectionally
over relative links; `status` reported 0 malformed / 0 unresolved / 0 orphans. **The premised
`logs.md` vs `log.md` mismatch does not exist — OpenWiki uses `log.md`, identical to AS.** Minor
(reasoned): OpenWiki doesn't stamp `timestamp`, so AS's freshness sweep is simply inert on raw
OpenWiki output (activates once a codebase-doc recipe declares timestamped kinds) — not broken.

## Capability matrix (ranked)
- **GAP — architectural, OUT OF SCOPE:** LLM-driven generation from code (walk repo → write
  quickstart + sections); incremental diff-budgeted updates. OpenWiki bundles its own agent loop; AS
  ships a ZERO-runtime-dependency CLI (no model calls, gate 5). Embedding an LLM harness would break
  AS's local-first / no-secrets / pluggable design — a different product, not a recipe.
- **GAP — small, buildable if wanted:** CI auto-update + PR template; AGENTS.md/CLAUDE.md pointer-block
  injection (AS's analog is the richer live `hook install` SessionStart, not a static block).
- **PARTIAL — a recipe:** the section taxonomy (architecture/workflows/domain/api/…) → a codebase-doc
  recipe (Reference/Section kinds), following the existing work-tracking/roadmap pattern. Small-medium,
  schema only, no engine change.
- **MEETS — AS stronger:** OKF emission + index normalization (AS's `index-projection` is
  marker-owned + CAS + refuses-to-clobber; OpenWiki overwrites unconditionally); frontmatter/field
  validation (AS's kind system is a strict superset — arbitrary required/optional/enum/arity/sections/
  typed-links vs OpenWiki's fixed field set); human-readable view (AS's live queryable Views >
  OpenWiki's static markdown index pages).

## AS differentiators OpenWiki lacks
Typed enforced kinds; versioning + CAS + actor attribution; derived typed-edge/backlink graph
(`queryEdges`); live human-collaborative Views with a data bridge; pluggable multi-backend + wire
protocol; multi-recipe composability (idempotent `recipe add`); git-based multi-agent sync + session
awareness; zero embedded secrets / LLM / telemetry.

## Bottom line for a codebase-doc recipe
- **TODAY:** AS opens / validates / lists / graphs OpenWiki output unmodified; AS's index +
  validation + graph are strictly more capable for the same job.
- **BUILD:** a codebase-doc **recipe** (schema, small-medium) + an **authoring skill/prompt** (tells
  the coding agent how to walk a repo and populate the bundle via `new`/`doc write`/`link add`) —
  prompt/editorial work, not engine. Optional: the pointer-block + CI template (small each).
- **OUT OF SCOPE (keep it so):** an embedded LLM/agent generation loop. AS supplies the durable store
  + versioning + graph + live UI; the agent already in the loop supplies the brains OpenWiki bundles
  internally. Don't build a second agent harness to compete with OpenWiki's core value prop.

[grounds the recipe scope (schema + authoring skill, generation out of scope)](../tasks/recipe-codebase-documentation.md)
