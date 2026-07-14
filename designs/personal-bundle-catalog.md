---
type: Design
title: Personal bundle catalog (draft)
actor: codex
timestamp: '2026-07-14T17:36:49.179Z'
---
# Personal bundle catalog

**Status:** Draft, unprioritized. This document preserves a product direction; it does not
authorize implementation.

## Problem

AgentState is organized around project-scoped bundles. That is the right authority boundary for
project knowledge, but one person may work across many repositories, private workspaces, and
shared boards. Today discovery is contextual: when standing inside a project, the CLI resolves its
bundle. There is no personal surface that answers which bundles this person uses, where they are,
or how to reopen the relevant human Pages.

The product thesis explicitly targets one human and their agent fleet across many projects. A
personal catalog is the possible bridge between project-local authority and that cross-project
experience.

## Product boundary

The catalog is a personal index of bundle references. It is not a new bundle format, a merged
knowledge database, or hosted multi-tenant dispatch. Each referenced bundle remains an independent
authority with its own documents, history, sharing mode, permissions, and lifecycle.

Portable recipes complement this layer. A recipe can install common Kinds, relationship semantics,
and Pages into several bundles without moving their instance data. The catalog makes those bundles
discoverable; it does not make them identical or silently combine them.

## Candidate user experience

A user can explicitly register the bundles they work with and see one local landing surface:

- project-local bundles associated with repositories;
- private bundles stored outside a public repository;
- git-shared project boards;
- deliberately subscribed bundles, if a supported transport exists.

For each entry, the catalog can show a human label, project association, locator, sharing mode,
availability, and last-opened or last-seen state. From there the user can open that bundle's Page
launcher or invoke an agent in the correct project context.

The first useful slice should prefer explicit registration over filesystem crawling. Discovery
may later offer safe suggestions from known project bindings, but it should never scan or publish
workspaces without the user's knowledge.

## Agent behavior

Project-local resolution remains authoritative when an agent is operating inside a repository. The
catalog is for orientation and explicit cross-project selection; it must not make a random bundle
ambient or cause an agent to write across bundles accidentally.

A future agent-facing read could answer “which bundle belongs to this project?” or “show my known
bundles,” while every mutation still names or resolves exactly one target bundle.

## Privacy and portability

Machine-local paths, private workspace names, and subscriptions may reveal sensitive information.
The catalog should be private to the user by default and must distinguish portable identity from a
machine-specific locator. A shared project must not require committing one person's absolute path.

An eventual entry may need both:

- a stable identity or project hint, such as a repository remote plus bundle role; and
- a local locator, such as an absolute path or checked-out project binding.

The correct storage authority remains an open question: a personal AgentState bundle could make
the catalog inspectable and extensible, while a small machine-local configuration store could
avoid recursively requiring a catalog to locate the catalog.

## Cross-bundle views

Read-only aggregation is a possible later capability, not part of the first slice. Bundles that
share Kind semantics through portable recipes could support views such as all open Review Requests
or all active Tasks. Such a view must preserve source-bundle identity, tolerate unavailable
bundles, and never imply a cross-bundle transaction or merged authority.

## Separation from hosted multi-bundle infrastructure

This concept is user-side workspace discovery. It does not require server-side bundle
partitioning, per-bundle keys, hosted authorization, or one service dispatching among tenants.
Those concerns may eventually supply one kind of catalog entry, but they are separate architecture
and should not be smuggled into a local launcher.

## Candidate first slice

If prioritized, the smallest credible experiment is:

1. An explicit local registry with add, remove, list, and rename operations.
2. Entries for local paths and repository-associated project bundles only.
3. A read-only launcher showing reachability and opening the selected bundle's existing UI.
4. Exact-target agent guidance; no cross-bundle writes or aggregate query engine.
5. A clean export story that omits or separates machine-local locator data.

This is a candidate, not an approved implementation plan. The data model and storage authority
should be reviewed before code begins.

## Wake conditions

Prioritize design or implementation when one or more of these become recurring rather than
hypothetical:

- one person actively uses three or more bundles and repeatedly loses track of them;
- agents select, initialize, or modify the wrong bundle because project context is ambiguous;
- opening the correct bundle launcher requires repeated manual path or repository navigation;
- shared operating models make a cross-project read-only view clearly valuable;
- explicit subscriptions become a real supported workflow.

## Non-goals

- Automatic whole-disk or repository crawling.
- Moving or merging bundle data into a central database.
- Cross-bundle mutation, transactions, or implicit write routing.
- Hosted multi-tenant dispatch, authorization, or billing.
- Reopening the parked remote surface merely to support catalog entries.
- Recipe marketplace or package-upgrade mechanics.
- Implementation tasks before explicit prioritization.

## Open questions

1. Is the catalog itself a personal bundle, a small config file, or a derived index over explicit
   bindings?
2. What identifies the same bundle across two machines without exposing either machine's path?
3. Should a catalog entry represent a project, a bundle, or a particular local checkout?
4. How should unavailable, moved, or duplicate bundles be reconciled?
5. Does the existing Page launcher gain a bundle-selection layer, or should selection remain a
   separate thin landing surface?
6. How can common recipe and Kind identities be detected without making package provenance a new
   authority over bundle-owned definitions?
