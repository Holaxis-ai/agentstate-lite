---
type: Design
title: User-scoped workspace catalog
actor: mike/codex
timestamp: '2026-07-15T02:28:55.699Z'
---
# User-scoped workspace catalog

**Status:** Direction approved; the minimum registry loop was authorized for implementation on
2026-07-14 after active use across multiple bundles. Later units remain separately gated.

## Decision summary

Add a machine-local, explicitly managed catalog that lets one user and their agents locate the
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
bundle. There is no user-scoped surface that answers which bundles this person uses, where they are,
or how an agent should target one outside its current project.

That pain is no longer hypothetical: one user is actively juggling several bundles. The original
wake condition for prioritizing the design has therefore been met.

The product thesis targets one human and their agent fleet across many projects. A workspace catalog
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

> Resolve an explicit catalog selector to exactly one validated bundle locator, or fail without
> choosing.

In v1, “exact” means one canonical local filesystem locator. It does not mean the catalog has
proven an enduring logical identity for the bundle: bundles do not currently carry such an
identifier, and a deleted path can later contain a different valid bundle. Registration and every
resolution canonicalize through `realpath` and verify that the target still contains the bundle-root
`index.md`. Durable logical and cross-machine bundle identity is a separate future design.

After resolution, the ordinary single-bundle command path remains authoritative. This avoids a
second query engine, cross-bundle transaction semantics, and an ambient global “active bundle” that
could silently route a mutation to the wrong target.

Project-local resolution retains precedence when an agent is operating inside a repository and the
user has not named another bundle. The catalog is consulted when the user names a catalog entry,
asks which bundles exist, or explicitly requests work outside the current project.

## Product boundary

The catalog is a user-scoped index of workspace references. It is not a new bundle format, a merged
knowledge database, or hosted multi-tenant dispatch. Each referenced bundle remains an independent
authority with its own documents, history, sharing mode, permissions, and lifecycle.

Portable recipes complement this layer. A recipe can install common Kinds, relationship semantics,
and Pages into several bundles without moving their instance data. The catalog makes those bundles
discoverable; it does not make them identical or silently combine them.

## First-slice CLI contract

The concrete command spelling should be validated against the CLI framework, but the first slice
should expose these capabilities:

```text
agentstate-lite catalog add <label> [--dir <path>]
agentstate-lite catalog list [--json]
agentstate-lite catalog resolve <selector> [--field path | --json]
```

With no `--dir`, `add` uses the existing project-local discovery path, making registration easy
from inside a project. An explicit `--dir` retains its current meaning throughout the CLI: it names
the literal bundle root containing `index.md`, not a repository directory that merely contains a
`.agentstate-lite/` child. `add` canonicalizes the discovered root through `realpath`, validates it,
and stores that local locator.

V1 permits one entry per canonical path and no aliases. The same label plus same canonical path is
an idempotent no-op. The same label with a different path, the same path with a different label, or
any other uniqueness conflict fails explicitly. Generated ids use a reserved grammar/prefix that
labels are forbidden to match, so a selector can unambiguously be classified as an id or a label
without an implicit precedence rule.

Labels are user-defined or agent-defined on the user's behalf. AgentState does not prescribe
categories such as personal, project, or team; it only enforces a safe label grammar and
uniqueness. Registration is always explicit — agents may suggest or perform it when asked, but the
CLI never crawls the filesystem or silently enrolls a workspace.

`resolve` returns one entry only and revalidates the canonical path and its `index.md`. `--field
path` emits only the raw canonical path plus a newline for direct shell and agent reuse. An unknown,
unavailable, or invalid selector is an error, never a best-effort choice and never an invitation to
initialize a replacement bundle.

All catalog commands work from any directory and do not require an already resolved bundle. They
are registered in the executable's top-level command/reference authority.

The agent-facing JSON result should be versioned and minimal, for example:

```json
{
  "schema_version": 1,
  "id": "bnd_01J...",
  "label": "agentstate",
  "locator": { "kind": "local-path", "path": "/Users/example/projects/agentstate/.agentstate-lite" },
  "available": true
}
```

The existing CLI output model remains authoritative: one logical result schema renders as TOON by
default and compact JSON with `--json`. There is no separate human table contract. The schema, exit
codes, error envelope, and next-step hints are part of the executable's public interface and
require deterministic tests.

### Agent interaction

An agent follows a two-step protocol:

1. Use `catalog list --json` for orientation or `catalog resolve <selector> --field path` when the
   user names a workspace.
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

- `agentstate-lite catalog --help` alone explains the workflow and targeting precedence;
- commands return structured, documented output suitable for any agent harness;
- errors include actionable next commands without assuming a skill is loaded;
- the npm package and any plugin-bundled executable expose identical behavior;
- a skill is an optional adoption and policy layer, not a required runtime dependency;
- no catalog state or protocol is stored only in `SKILL.md`, `CLAUDE.md`, or `AGENTS.md`.

The skill can still add value by telling an agent when to consult the catalog and by emphasizing
the exact-target invariant. That instruction must summarize behavior already owned and explained by
the CLI rather than creating a second authority.

## Storage authority and data model

For the first slice, use a separate `~/.agentstate/catalog.json` file under AgentState's existing
per-user configuration directory. Do not reuse the remote-credential file. Do not model the
registry as an AgentState bundle: doing so
creates recursion about how to locate the catalog and implies knowledge-store semantics that the
locator registry does not need.

The file should have a versioned top-level envelope and entries with only the information required
for deterministic selection and useful orientation:

- generated stable catalog-entry id;
- unique human label;
- locator kind and canonical local path.

Availability is derived at read time. Repository hints, bundle roles, and last-opened timestamps do
not belong in v1; they add semantics and contended writes without improving safe selection.

The schema is strict and versioned. Behavior-affecting additions require a schema-version bump; an
older CLI refuses to mutate a newer schema. Malformed or unsupported data fails closed, names the
exact config path, provides a non-destructive repair hint, and is never automatically replaced.

Writes must use the project's established private-config discipline: directory mode `0700`, file
mode `0600`, schema validation, and atomic replacement. Atomic replacement alone is insufficient
for multiple agents because two read-modify-write processes can both read version A and the later
rename can silently erase the earlier mutation. Every mutating catalog command therefore routes
through one catalog mutation primitive:

1. acquire a cross-process lock with bounded waiting;
2. reread and strictly validate the current schema while holding the lock;
3. make the idempotency or conflict decision against that fresh state;
4. atomically replace the file; and
5. release the lock in a `finally` path.

Lock metadata identifies the owning process. Stale-lock recovery is conservative: reclaim only
after a minimum age when the owning process can be proven absent; otherwise fail with a retry hint.
Age alone never authorizes breaking a lock. Simultaneous add/add, add/remove, and rename/remove are
adversarial test cases for this primitive.

The stable id identifies the catalog entry, not universally the underlying bundle. Cross-machine
bundle identity remains deliberately unresolved in the first slice.

## Candidate user experience

A user can explicitly register the bundles they work with and inspect them from any directory:

- project-local bundles associated with repositories;
- private bundles stored outside a public repository;
- git-shared project boards present in local checkouts.

For each entry, the catalog shows a human label, local locator, and derived availability. The first
useful slice prefers explicit registration over filesystem crawling.
Discovery may later offer safe suggestions from known project bindings, but it never scans or
publishes workspaces without the user's knowledge.

The later `catalog open` operation may launch the selected bundle's existing Page launcher. A later visual
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

### Unit 1a: minimum registry loop — authorized

Implement the private versioned registry plus add, list, and resolve (`--field path`). Prove unique
selection, realpath and bundle-root validation, the locked mutation boundary, permission handling,
corruption and newer-schema behavior, and TOON/JSON projections of one result contract. Update
generated CLI reference/help from the same command authority. Because this unit controls target
selection and supports concurrent agent mutation, it receives exact-SHA independent review and
adversarial QA even though its code size should remain modest.

### Unit 1b: catalog management — after dogfood

Add rename and remove only after the minimum loop is used. Reuse the same locked mutation primitive;
do not change selector or uniqueness semantics.

### Unit 2: human opening workflow — separately gated

Add `catalog open` as in-process delegation to the current `ui --dir` handler. Preserve its
foreground, one-bundle behavior and latest-run URL-file semantics. Do not introduce a multi-bundle
server.

### Unit 3: thin visual catalog, only if still valuable

Render registered entries, reachability, and an Open action. Treat this as navigation over the
registry, not as cross-bundle querying. The views gate still requires an explicit human decision
before this unit begins.

No implementation task should combine these units merely because they share the roadmap item.

## Risks and required tests

- **Wrong-target writes:** ambiguous or missing selectors must fail; mutation examples must retain
  an explicit resolved directory.
- **Stale or reused paths:** list reports unavailable entries; resolve/open canonicalizes and
  revalidates the bundle root, fails with a repair hint, and never initializes a replacement bundle
  automatically. V1 cannot detect a different valid bundle placed at the same path; that limitation
  is explicit until bundles have durable identity.
- **Moved bundles:** the user explicitly updates or re-adds the locator; no filesystem crawling in
  the first slice.
- **Duplicate registration and selector collision:** one entry per canonical path, reserved id
  grammar, and deterministic idempotency/conflict rules prevent ambiguous selection.
- **Registry corruption or concurrent writers:** strict schema handling plus one locked mutation
  primitive protect the last valid state and prevent silent lost updates.
- **Privacy:** file permissions are tested and no command prints unrelated entries when resolving
  one selector.
- **Distribution drift:** npm-packed and plugin-bundled CLIs expose the same catalog contract;
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

1. Should durable bundle identity eventually live in reserved bundle metadata, and what migration
   would introduce it without weakening OKF interoperability?
2. Is resolve-then-`--dir` sufficient for agent ergonomics, or is a later global selector worth the
   additional precedence and safety surface?
3. After real usage, which orientation metadata justifies entering the schema, and is it derived or
   catalog-owned?
