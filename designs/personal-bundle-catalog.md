---
type: Design
title: Personal bundle catalog (draft)
actor: codex
timestamp: '2026-07-14T20:37:09.407Z'
---
# Personal bundle catalog

**Status:** Draft; wake condition met on 2026-07-14 by active use across multiple bundles.
This document is ready for design review. It does not authorize implementation.

## Decision summary

Add a machine-local, explicitly managed catalog that lets one person and their agents locate the
independent AgentState bundles they use. The catalog is a routing aid, not a merged knowledge store.
It resolves a human label or stable entry id to exactly one bundle locator; the existing AgentState
CLI then performs the requested operation against that bundle.

The first slice is CLI-first and distribution-independent. It must work from an npm installation
without a skill. A skill may teach an agent when the catalog is useful, but the executable owns the
commands, schemas, validation, help, and safe-targeting behavior.

## Problem

AgentState is organized around project-scoped bundles. That is the right authority boundary for
project knowledge, but one person may work across many repositories, private workspaces, and
shared boards. Today discovery is contextual: when standing inside a project, the CLI resolves its
bundle. There is no personal surface that answers which bundles this person uses, where they are,
or how an agent should target one outside its current project.

That pain is no longer hypothetical: one user is actively juggling several bundles. The original
wake condition for prioritizing the design has therefore been met.

The product thesis targets one human and their agent fleet across many projects. A personal catalog
is the bridge between project-local authority and that cross-project experience.

## Goals

1. Let a person explicitly register, label, inspect, and remove bundle references.
2. Let an agent deterministically resolve a named bundle to one exact local target.
3. Preserve project-local resolution as the default while working inside a repository.
4. Keep every bundle independently authoritative, portable, shareable, and usable without the
   catalog.
5. Make the capability discoverable and operable through the CLI alone, including structured
   output for agents.
6. Keep machine-local paths and private bundle names private by default.

## Foundational invariant: select, then operate

The catalog never participates in bundle reads or writes after target selection. Its sole runtime
responsibility is:

> Resolve an explicit catalog selector to exactly one bundle locator, or fail without choosing.

After resolution, the ordinary single-bundle command path remains authoritative. This avoids a
second query engine, cross-bundle transaction semantics, and an ambient global “active bundle” that
could silently route a mutation to the wrong target.

Project-local resolution retains precedence when an agent is operating inside a repository and the
user has not named another bundle. The catalog is consulted when the user names a catalog entry,
asks which bundles exist, or explicitly requests work outside the current project.

## Product boundary

The catalog is a personal index of bundle references. It is not a new bundle format, a merged
knowledge database, or hosted multi-tenant dispatch. Each referenced bundle remains an independent
authority with its own documents, history, sharing mode, permissions, and lifecycle.

Portable recipes complement this layer. A recipe can install common Kinds, relationship semantics,
and Pages into several bundles without moving their instance data. The catalog makes those bundles
discoverable; it does not make them identical or silently combine them.

## First-slice CLI contract

The concrete command spelling should be validated against the CLI framework, but the first slice
should expose these capabilities:

```text
agentstate-lite catalog add <label> --dir <path>
agentstate-lite catalog list [--json]
agentstate-lite catalog resolve <label-or-id> [--json]
agentstate-lite catalog rename <label-or-id> <new-label>
agentstate-lite catalog remove <label-or-id>
agentstate-lite catalog open <label-or-id>
```

`add` validates that the path resolves to an existing bundle and stores a canonical local locator.
It is idempotent for the same catalog entry and locator; conflicting labels fail explicitly.
`resolve` returns one entry only. An unknown selector or ambiguous label is an error, never a
best-effort choice. `open` is a human convenience that invokes the existing single-bundle UI for
the resolved directory rather than introducing a multi-bundle UI runtime.

The agent-facing JSON result should be versioned and minimal, for example:

```json
{
  "schema_version": 1,
  "id": "bnd_01J...",
  "label": "personal",
  "locator": { "kind": "local-path", "path": "/Users/example/bundles/personal" },
  "available": true,
  "project": null
}
```

Human table output is not an agent contract. The JSON shape, exit codes, error envelope, and next
step hints are part of the executable's public interface and require deterministic tests.

### Agent interaction

An agent follows a two-step protocol:

1. Use `catalog list --json` for orientation or `catalog resolve <selector> --json` when the user
   names a bundle.
2. Pass the returned path as the explicit directory to every ordinary AgentState command in that
   unit of work.

For a request such as “read my personal bundle, then add a note to the AgentState project bundle,”
the agent resolves both entries, reads the first bundle with its exact directory, and writes to the
second with its exact directory. It does not change a process-global current bundle between those
steps.

The first slice should not add a global `--catalog` selector to every command. The explicit
resolve-then-`--dir` sequence reuses the existing single-target boundary and makes the target
visible in each consequential invocation. A convenience selector can be considered later only if
it preserves the same one-resolution primitive and cannot introduce different precedence rules.

## Distribution and skill independence

The catalog belongs to the CLI, not to a skill distribution. The expected long-term installation
path may become a traditional npm install, and the catalog must remain fully usable in that form.

Therefore:

- `agentstate-lite catalog --help` explains the workflow and targeting precedence;
- commands return structured, documented output suitable for any agent harness;
- errors include actionable next commands without assuming a skill is loaded;
- the npm package and any plugin-bundled executable expose identical behavior;
- a skill is an optional adoption and policy layer, not a required runtime dependency;
- no catalog state or protocol is stored only in `SKILL.md`, `CLAUDE.md`, or `AGENTS.md`.

The skill can still add value by telling an agent when to consult the catalog and by emphasizing
the exact-target invariant. That instruction must summarize behavior already owned and explained by
the CLI rather than creating a second authority.

## Storage authority and data model

For the first slice, use a small machine-local configuration file under AgentState's existing
per-user configuration directory. Do not model the registry as an AgentState bundle: doing so
creates recursion about how to locate the catalog and implies knowledge-store semantics that the
locator registry does not need.

The file should have a versioned top-level envelope and entries with only the information required
for deterministic selection and useful orientation:

- generated stable entry id;
- unique human label;
- locator kind and canonical local path;
- optional repository identity or project hint;
- optional bundle role, such as project board or personal workspace;
- last-opened timestamp as disposable local convenience state.

Writes must use the project's established private-config discipline: restrictive permissions,
atomic replacement, schema validation, and failure without discarding the last valid file. Unknown
future fields should be handled according to an explicit compatibility rule rather than silently
rewritten away.

The stable id identifies the catalog entry, not universally the underlying bundle. Cross-machine
bundle identity remains deliberately unresolved in the first slice.

## Candidate user experience

A user can explicitly register the bundles they work with and inspect them from any directory:

- project-local bundles associated with repositories;
- private bundles stored outside a public repository;
- git-shared project boards present in local checkouts.

For each entry, the catalog can show a human label, project association, local locator, availability,
and last-opened state. The first useful slice prefers explicit registration over filesystem crawling.
Discovery may later offer safe suggestions from known project bindings, but it never scans or
publishes workspaces without the user's knowledge.

The initial `open` operation launches the selected bundle's existing Page launcher. A later visual
catalog may show the same registry and hand off to that existing single-bundle UI. It should not
turn the current UI server into a multi-bundle data plane merely to provide navigation.

## Privacy and portability

Machine-local paths, private workspace names, repository hints, and subscriptions may reveal
sensitive information. The registry is private to the user by default, excluded from project
repositories, and never synced by bundle sharing.

The first slice does not need catalog export. When portability becomes a concrete use case, export
must separate portable identity hints from machine-specific locators and require an explicit user
action. A shared project must never require committing one person's absolute path.

## Cross-bundle views

Read-only aggregation is a possible later capability, not part of the first slice. Bundles that
share Kind semantics through portable recipes could support views such as all open Review Requests
or all active Tasks. Such a view must preserve source-bundle identity, tolerate unavailable
bundles, and never imply a cross-bundle transaction or merged authority.

The registry is useful without this capability. Aggregation should be designed separately after
real use demonstrates which cross-bundle questions recur.

## Separation from hosted multi-bundle infrastructure

This concept is user-side workspace discovery. It does not require server-side bundle partitioning,
per-bundle keys, hosted authorization, or one service dispatching among tenants. Those concerns may
eventually supply one kind of catalog entry, but they are separate architecture and should not be
smuggled into a local launcher.

## Proposed delivery sequence

### Unit 1: registry and agent-safe CLI

Implement the private versioned registry plus add, list, resolve, rename, and remove. Prove unique
selection, path validation, atomic persistence, permission handling, corruption behavior, and JSON
contracts. Update generated CLI reference/help from the same command authority.

### Unit 2: human opening workflow

Add `catalog open`, reusing the current `ui --dir` behavior. Do not introduce a multi-bundle server.

### Unit 3: thin visual catalog, only if still valuable

Render registered entries, reachability, and an Open action. Treat this as navigation over the
registry, not as cross-bundle querying. The views gate still requires an explicit human decision
before this unit begins.

No implementation task should combine these units merely because they share the roadmap item.

## Risks and required tests

- **Wrong-target writes:** ambiguous or missing selectors must fail; mutation examples must retain
  an explicit resolved directory.
- **Stale paths:** list reports unavailable entries; resolve/open fails with a repair hint and never
  initializes a replacement bundle automatically.
- **Moved bundles:** the user explicitly updates or re-adds the locator; no filesystem crawling in
  the first slice.
- **Duplicate registration:** deterministic idempotency and conflict rules prevent two labels from
  appearing to identify the same thing accidentally.
- **Registry corruption or concurrent writers:** atomic persistence and adversarial tests protect
  the last valid state.
- **Privacy:** file permissions are tested and no command prints unrelated entries when resolving
  one selector.
- **Distribution drift:** npm-packed and plugin-bundled CLIs must expose the same catalog contract;
  generated references remain derived from executable command metadata.

## Non-goals

- Automatic whole-disk or repository crawling.
- Moving or merging bundle data into a central database.
- Cross-bundle mutation, transactions, or implicit write routing.
- A mutable global active-bundle setting.
- Cross-bundle query or aggregation in the first slice.
- Hosted multi-tenant dispatch, authorization, or billing.
- Reopening the parked remote surface merely to support catalog entries.
- Recipe marketplace or package-upgrade mechanics.
- Making a skill necessary to use or discover the catalog.

## Open questions for review

1. Does the small private config file remain the correct authority, or is there a concrete benefit
   that justifies modeling the catalog as a bundle despite the recursion and semantic mismatch?
2. Should duplicate canonical paths be rejected, aliased, or treated as an idempotent add?
3. Is repository identity useful in Unit 1, or should it wait until moved-path recovery is designed?
4. What compatibility behavior should apply when a newer CLI has written fields an older CLI does
   not understand?
5. Does `catalog open` spawn the current UI process directly, or should it print and optionally run
   the exact `ui --dir` command?
6. Is resolve-then-`--dir` sufficient for agent ergonomics, or is a later global selector worth the
   additional precedence and safety surface?
