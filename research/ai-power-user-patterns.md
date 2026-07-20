---
type: Research
title: >-
  AI-power-user markdown patterns: hot.md is fake, Memory Bank is the real
  convergence
description: >-
  Web research informing the persona-recipe decision. KEY: hot.md is fabricated
  (AI-slop citation laundering — Karpathy's real pattern is the LLM Wiki,
  index.md/log.md = OKF reserved files). Strongest real pattern = Cline's Memory
  Bank (activeContext.md etc., cross-tool convergence), which maps ~1:1 onto OKF
  kinds + freshness horizons. RECOMMENDATION: ship an 'AI power user' recipe
  FIRST (not PM re-skin), scoped tightly to the session-to-session
  working-memory gap — a Focus kind + a Session/Briefing kind + one relationship
  + one Working Memory View. Full findings + sources + honest gaps in body.
actor: mike/claude
timestamp: '2026-07-20T20:26:02.096Z'
---
# AI-power-user markdown patterns — research pass (2026-07-20)

Web research to inform the P1 persona-recipe decision (PM vs "AI power user"). Sonnet research
agent, web-heavy. Purpose: ground the first shipped recipe in a convention people *already*
improvise (that's what makes a recipe take off).

## Headline: `hot.md` is not a real convention — don't design around it

Karpathy's actual canonical gist
([442a6bf](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)) contains no "hot"
string. The "500-char rolling hot.md" detail is repeated verbatim across SEO content-mill sites that
cite each other, not the primary source — AI-slop citation laundering. The **real** Karpathy pattern
is an "LLM Wiki": a `raw/` dir of immutable sources, an LLM-maintained interlinked `wiki/`, a schema
file (CLAUDE.md/AGENTS.md), an `index.md` catalog, an append-only `log.md`, and ingest/query/lint
ops. Notably, `index.md` + `log.md` are already OKF's own reserved files.

## Patterns ranked (best-justified as recipe material at the bottom)

- **Skip:** inbox-zero/email triage (SaaS/OAuth, not markdown-native); `hot.md` (fabricated);
  standalone TODO.md (tiny; work-tracking already does it better); GTD/inbox generally (already
  shipped ground).
- **Durable but redundant with what ships:** AGENTS.md/CLAUDE.md as a schema file (now
  Linux-Foundation-governed — validates our CLAUDE.md approach, but it's a single root file, not a
  kind); spec/plan/task "context engineering" (GitHub spec-kit 123k★, Anthropic endorses structured
  note-taking — but overlaps our Plan/Research/docs-core ground).
- **Strongest, real convergence:** Karpathy's LLM Wiki core mechanics (maps ~1:1 onto OKF — already
  half-built); and the top candidate, **Cline's Memory Bank** (`projectbrief.md`, `activeContext.md`,
  `progress.md`, …) — independently forked/reimplemented for Roo Code, Cursor, Windsurf, and
  community skills; emerged organically from devs hand-rolling memory files; differentiated
  update-frequencies (activeContext churns; projectbrief is stable) that map exactly onto OKF kinds +
  per-kind freshness horizons.

## Recommendation: ship an "AI power user" recipe first — scoped to the working-memory gap

The genuine gap (nothing in agentstate-lite encodes it today) is **continuity of what the agent is
currently thinking about across sessions.** Task tracking (work-tracking/Task), plans (Plan), and
research (Research) already ship — a PM recipe would mostly re-skin them. So scope the recipe TIGHTLY
to session-to-session working memory. Minimal (graspable in one look):

- **`Focus` kind** (singular/near-singular): current focus, recent changes, next steps, open
  questions — the real Memory-Bank `activeContext.md` equivalent. Short freshness horizon (24–48h) so
  staleness surfaces via existing freshness machinery.
- **`Session` / `Briefing` kind**: one doc per work session, append-oriented — what happened,
  decisions, relative links to the Focus/Task/Concept docs it touched (Karpathy's ingest→synthesis /
  the daily-briefing pattern, as a typed doc rather than a raw log line).
- **One relationship**: Session docs link out to Focus + what they touched; Focus accumulates
  backlinks from recent Sessions.
- **One View**: a "Working Memory" dashboard — live Focus doc + last N Sessions, staleness flagged.
  Nearly free (gate 1 already shows backlink counts inline; gate 3 already carries freshness).

Explicitly LEAVE OUT: a GTD/inbox/todo kind (redundant with work-tracking), the full PARA taxonomy
(scope creep, not agent-specific), and the spec-kit constitution/spec/plan/tasks pipeline wholesale
(docs/core + Plan/Research already cover it).

## Sources for a designer
1. Karpathy LLM Wiki gist (primary — read the raw text): https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
2. Cline Memory Bank (best files→roles→cadence decomposition): https://docs.cline.bot/best-practices/memory-bank
3. Anthropic context-engineering guidance: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
4. AGENTS.md (minimal-convention design taste): https://agents.md
5. GitHub spec-kit (contrast for plan/task discipline): https://github.com/github/spec-kit

## Honest gaps
- "AI power user recipe" is not an existing named genre in the wild — it's our working hypothesis;
  this synthesizes adjacent real patterns toward it.
- Adoption figures (AGENTS.md "60k+ projects", Karpathy-CLAUDE.md "220k stars") come from
  marketing-flavored posts, not primary telemetry — directionally credible, exact numbers unverified.
- Cline Memory Bank has strong cross-tool-fork signal but no hard production-usage data found — worth
  a spot-check with real users before committing design time.
- OpenClaw/ClawHub daily-briefing tooling is too new to call durable vs single-vendor.

[recommends AI-power-user (working-memory) recipe over PM](../tasks/persona-recipe-product-manager.md)
