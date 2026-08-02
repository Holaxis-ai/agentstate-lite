---
type: Design
title: Core user journey map as a live product-planning instrument
actor: openai/codex
timestamp: '2026-08-02T15:28:03.799Z'
---

# Core user journey map as a live product-planning instrument

## Decision

Model the supported AgentState Lite user journey inside this bundle with two small kinds—`Journey`
and `Journey Stage`—and project those records through one durable responsive View. This is a
planning instrument for the existing product roadmaps, not a new product roadmap or a new runtime
feature.

The first journey is **new user to recurring value**: a person installs AgentState Lite, connects a
supported desktop agent host, learns the product through a guidance bundle, creates useful
structured content and a custom View, invokes that same View inline or expanded in an MCP App (or
through the local web host), returns later, and updates AgentState Lite without losing their work.

Implementation task: [Build the core user journey map and live support View](../tasks/build-core-user-journey-map.md).

## Product surface model

There is one AgentState `View`. MCP inline, MCP expanded/full-page, and local web are containers or
invocation adapters over the same registered View identity, source, queries, bridge behavior, and
authorization model. The journey must not imply that an MCP View and a web View are different
things. Expanded MCP Apps are a primary full-page experience; local web is a useful alternative
launcher for terminal-oriented agents and users.

Core supported conversational products are Claude Desktop and the ChatGPT desktop app (including
Codex experiences surfaced there). Terminal agents remain supported through the CLI, with local web
as the human-facing View fallback when their host cannot present MCP Apps.

This product model is governed by
[One portable View model](unified-portable-view-model.md) and the
[Conversational Views through MCP Apps](../roadmap-items/conversational-mcp-views.md) roadmap item.

## Information model

A `Journey` states the stable promise, target user, entry condition, and successful outcome. A
`Journey Stage` is the mutable unit of assessment. Each stage records:

- its sequence and lane;
- whether it is on the core or supporting path;
- an honest readiness level;
- the desired and current experience;
- concrete acceptance criteria, evidence, and remaining gaps;
- links to existing roadmap items, designs, tasks, and review/context evidence.

The readiness ladder is deliberately observable:

1. `missing` — the user cannot complete the stage.
2. `rough` — possible through special knowledge, manual recovery, or a fragile path.
3. `works` — repeatably completes on a supported path, but lacks clean external proof or polish.
4. `supported` — documented, maintained, and covered by an intentional support boundary.
5. `validated` — a representative new user has completed it without founder coaching.

The map must never collapse readiness into a reassuring average. It should lead with the weakest
core stage, readiness counts, and host-specific gaps. Product work improves the journey only when a
stage gains evidence and moves up this ladder.

## Relationship model

The new kinds own their relationship vocabulary so this experiment does not broaden existing Task
or Roadmap Item conventions:

- a Journey `has journey stage` links to its Journey Stages;
- a Journey Stage is `journey stage planned by` existing Roadmap Items;
- a Journey Stage is `journey stage specified by` existing Designs;
- a Journey Stage may be `journey stage implemented by` Tasks;
- a Journey Stage may be `journey stage validated by` Context Notes or `journey stage reviewed by`
  Reviews.

These deliberately specific labels preserve the bundle's globally typed relationship vocabulary;
they do not redefine generic labels already owned by Roadmaps, Tasks, or older records.

Most task mapping should be derived through the existing Roadmap Item `contains` Task links. Direct
stage-to-task links are reserved for work that is uniquely diagnostic of a stage. This avoids
maintaining a second hand-curated task hierarchy.

## View behavior

The durable View is the working surface for Mike and Brian. It should:

- summarize the product promise and honest current support level;
- show the weakest core stage and readiness distribution first;
- render the journey as a spacious ordered map on a wide/expanded surface and as stacked cards in
  narrow inline MCP presentation;
- filter by gaps and host lane without creating host-specific View source;
- show desired experience, current experience, acceptance, evidence, gaps, and linked work for a
  selected stage;
- refresh from bundle data so edits by an agent immediately alter the map;
- remain useful in MCP inline, MCP expanded, and local web containers.

The View is a projection. It must not embed the assessment as copied HTML or invent another status
store. Journey and Journey Stage documents remain the authority.

## Initial scope and non-goals

This first unit is entirely bundle content: conventions, records, relationships, and one View. It
does not add CLI behavior, a new roadmap item, telemetry, a bespoke workflow engine, or host-specific
View types. It also does not claim that the initial readiness assessment is research-grade. The
assessment is a transparent starting hypothesis that should be revised as fresh-user evidence
arrives.

The implementation task belongs under the existing UI rethink roadmap because this is a View-backed
planning surface. Product gaps revealed by the map remain owned by their existing roadmap axes,
including distribution, conversational Views, recipes, local-first operation, and multi-workspace
discovery.

## Success criteria

This design succeeds when a founder can open one View and answer, without reading the whole board:

1. What is the supported end-to-end journey?
2. Where does it currently break or require coaching?
3. Does the gap affect Claude Desktop, the ChatGPT app, terminal/web, or every host?
4. Which existing design or roadmap item owns the next improvement?
5. What evidence would justify calling that stage supported or validated?
