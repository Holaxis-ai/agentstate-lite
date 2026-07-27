---
type: Design
title: 'Durable conversational Views: promotion, discovery, and invocation'
description: >-
  Accepted contract: one bounded model-visible View catalog over the existing
  generic durable invocation; ordinary exact-byte bundle authoring remains the
  promotion path until dogfooding proves a compound operation is warranted.
actor: openai/codex
timestamp: '2026-07-27T15:18:18.020Z'
---
# Durable conversational Views: promotion, discovery, and invocation

## Status

Recommended on 2026-07-27 after the shared-security, unchanged-byte durable-View, and intrinsic
sizing proofs shipped.

This revision replaces the document's earlier `declarative-v1` recommendation. That earlier
recommendation correctly chose one generic catalog and one stable View identity, but it assumed
the MCP host could not safely run the existing active View format. That assumption is now false:
the web UI and MCP adapter resolve the same `type: View` registration, mint the same exact-byte
launch identity, and delegate bridge requests to the same `view-runtime` authority.

Parent direction: [Conversational Generative Views via MCP Apps](mcp-app-generative-views.md).
Security authority:
[MCP and web View security-model unification](mcp-view-security-model-unification.md).

## Decision

1. Keep the existing `type: View` registry document and HTML blob as the one durable identity and
   executable presentation.
2. Add one bounded, model-visible `list_views` tool. It reports compatible bundle Views; it never
   returns HTML or creates one tool per View.
3. Invoke a discovered View through the already-shipped generic
   `show_view({ viewId: "views-registry/…" })` path and the fixed package-owned MCP App shell.
4. Use MCP resources only to deliver that fixed shell. Do not rely on resource listing for model
   discovery of bundle content.
5. Add one optional author-declared `presentation` field to View registrations:
   `workspace | inline | adaptive`. Absence means the existing workspace/default posture.
6. Do not add multiple entry blobs, a second `MCP View` kind, or persisted fullscreen variants
   now. One responsive entry remains the default architecture; fullscreen is a host display mode,
   not a second durable object.
7. Treat promotion as curation into an ordinary portable View using the existing byte and kind
   authoring paths. Do not add a one-click MCP write path or compound CLI command until dogfooding
   demonstrates repeated friction.

The first executable unit is discovery only: `presentation` metadata plus `list_views`, backed by
the existing generic invocation. Promotion requires no new engine or storage capability.

## Why the previous format proposal is retired

The original draft proposed a new script-free durable format because generated MCP presentation
and active web Views had different security models. Subsequent work removed that premise:

- `view-runtime` owns registry resolution, exact-byte launch identity, approval, currentness, and
  the read bridge for both hosts;
- the MCP adapter mounts an unchanged active View in a second opaque-origin child;
- the generated presentation frame remains a separate, passive authoring mode;
- durable View authorization is tied to exact registry and entry versions; and
- the nested-frame sizing relay now lets the same active View participate in conversational
  layout without changing its source contract.

Adding `declarative-v1` now would create the second View format the shared-security work was meant
to avoid. Generated and durable are lifecycle/provenance distinctions, not separate durable
ontologies.

## What exists today

### Durable identity

A durable View is already ordinary bundle content:

- a `type: View` registry document under `views-registry/`;
- `title`, optional `description`, `entry`, and shell-enforced `access`;
- an HTML blob under `views/`; and
- actor/timestamp provenance on the registry document plus version identity for both registry and
  entry.

Core's `parseRegistration` is the one authority for valid registry IDs and entry keys.
`mintActiveViewLaunch` resolves the exact registry and blob versions. Both human-facing hosts
consume that authority.

### Generic invocation

`show_view` already accepts the exclusive durable form:

```json
{ "viewId": "views-registry/task-focus" }
```

The MCP adapter resolves the current registration, admits its exact HTML bytes, requires local
approval when the View requests bundle access, and runs bridge traffic through the shared
read-only authority. No HTML is rewritten or copied into the tool call.

### Existing authoring primitives

The CLI can already persist both halves without placing the HTML in model context:

```sh
aslite promote task-focus.html --doc-key views/task-focus.html
aslite new "View" task-focus \
  --title "Task focus" \
  --description "Open tasks grouped by priority" \
  --entry views/task-focus.html \
  --access bundle-read \
  --presentation adaptive \
  --actor <actor>
```

The View remains plain OKF metadata plus an opaque blob. It travels through local files, git sync,
recipes, or a future remote backend without MCP-specific storage.

## Discovery contract

### Why a tool, not a resource

Core MCP classifies tools as model-controlled and resources as application-controlled. MCP Apps
links a tool to a UI resource through `_meta.ui.resourceUri`; the specification explicitly permits
servers to omit UI-only resources from ordinary resource listing.

The official `ext-apps` reference host enumerates both tools and resources for its own host UI, but
that is host behavior, not a guarantee that resource metadata reaches the model. In the current
conversation host, the agent-facing discovery surface exposes model-visible tools; it does not
offer the server's resource list as an equivalent callable catalog.

Therefore:

- the fixed `ui://agentstate/view-host/v1.html` resource remains the App shell;
- bundle registrations remain bundle data rather than dynamic UI resources; and
- one read-only tool provides reliable model discovery.

### `list_views`

The first tool has no search language and no per-View dynamic schema:

```json
{}
```

Conceptual result:

```json
{
  "schemaVersion": "agentstate.view-catalog.v1",
  "count": 2,
  "views": [
    {
      "viewId": "views-registry/task-focus",
      "title": "Task focus",
      "description": "Open tasks grouped by priority",
      "access": "bundle-read",
      "presentation": "adaptive"
    }
  ],
  "omitted": {
    "unsupportedAccess": 1,
    "notInlineDeclared": 2,
    "invalid": 1
  }
}
```

Required behavior:

- query the current bundle for `type: View` heads;
- reuse `parseRegistration` and `resolveDeclaredAccess`;
- sort by stable View ID;
- return at most 20 rows and a pre-limit compatible count;
- include only registrations declared `presentation: inline | adaptive`;
- in the first unit, include only the access levels `show_view({viewId})` actually accepts
  (`bundle-read` today);
- return identity, purpose, access, and presentation only;
- never return entry keys, HTML, registry bodies, credentials, nonces, or approval state;
- name omitted categories so a small catalog is not mistaken for the entire bundle;
- provide a concise text fallback for non-App hosts; and
- declare the tool read-only, idempotent, closed-world, and model-visible without a UI resource.

The exact omission counters may be simplified during implementation, but invalid and unsupported
registrations must not be silently represented as invokable.

`list_views` and `show_view` remain separate verbs because one enumerates a bounded catalog while
the other creates a launch. Combining them into a mode-switching schema would save one tool at the
cost of a less legible model contract.

## Presentation metadata

Add one optional scalar field to the existing View convention:

```yaml
presentation: workspace
```

Allowed values:

- `workspace` — designed for the full local launcher; the default when absent;
- `inline` — designed and tested for a conversational container; and
- `adaptive` — designed and tested for both workspace and inline containers.

This is author intent, not a new security capability. `access` still controls data/action
authority, and the host still owns actual dimensions. The MCP catalog uses presentation metadata
to avoid claiming that every technically mountable desktop dashboard is a good conversational
View.

Do not add `inline_entry`, `workspace_entry`, or `fullscreen_entry` now:

- exact-byte trust and update lifecycle are simpler with one entry;
- responsive CSS plus the shipped sizing relay covers the demonstrated need;
- fullscreen is negotiated at runtime with the MCP host;
- multiple entries can drift semantically while sharing one title and purpose; and
- no current user journey has proved that duplicated presentation source is worth that cost.

If dogfooding finds a genuinely valuable View that cannot adapt across containers, add an optional
presentation map under the same registry identity in a later schema version. Do not pre-commit to
its shape here.

## Promotion

### Product meaning

Promotion means: “this presentation is useful enough to become named, portable bundle content.”
It is not merely copying the current rendered rows.

The durable result contains:

- a stable View ID;
- title and purpose description;
- exact self-contained HTML bytes;
- `access`;
- `presentation`;
- any query/read/edge behavior authored inside the existing bridge client;
- actor and timestamp on the registration; and
- registry and blob versions from the two existing writes.

Resolved document snapshots are not persisted into the View. The durable HTML queries current
bundle state through the bridge when launched.

### Current honest journey

An ephemeral generated View and an active durable View use different *authoring* contracts:
generated HTML uses shell-materialized bindings, while a durable View contains its bridge client.
The system therefore cannot honestly promise that arbitrary ephemeral bytes can be saved unchanged
as an active durable View.

For the first product loop:

1. An agent creates an invocation-specific View and the human uses it.
2. Repeated value is the signal to keep it.
3. The agent authors the durable equivalent as one self-contained active View file, using the
   existing View authoring reference and the same query vocabulary.
4. `promote` writes the exact file bytes; `new "View"` writes the portable registration.
5. The author declares `presentation: inline` or `adaptive` only after testing it there.
6. `list_views` discovers it, and `show_view({viewId})` invokes it without rewriting its source.

This is a curation step, not a one-click serialization step. That is acceptable while the feature
is experimental and the authors are agents already using the CLI.

### Why no new promotion command yet

A compound `view create` or trusted-shell Save action would need to own two-object failure,
collision handling, exact source capture, capability selection, actor attribution, and the
generated-to-active authoring conversion. The generic engine already owns the important
invariants; the remaining value is ergonomic.

Build that command only after dogfooding answers two questions:

1. Is repeated ephemeral-to-durable conversion common?
2. Can the conversion be deterministic, or does it remain an agent authoring step?

If the answer justifies a command, it should compose `promote` and kind creation like
`artifact create`, report any orphaned blob explicitly, and produce ordinary bundle content. It
must not introduce an MCP-only persistence store.

## User and agent journeys

### Human

The human asks for a task-focused View, uses the generated result, and decides it is reusable.
The agent turns it into a durable adaptive View and shows it once for confirmation. Days later the
human asks, “show my task focus view”; the agent discovers the named View and opens it inline.

### Agent

1. Call `list_views`.
2. Match the user's request against stable ID, title, and description.
3. Call `show_view({viewId})`.
4. Let the trusted shell handle exact-byte authorization and bridge lifecycle.
5. If no suitable View exists, use generated `show_view` rather than creating durable state
   silently.

The model never reads the View's HTML merely to launch it.

## Implementation sequence

1. **Catalog unit:** add the optional `presentation` field to the shipped View convention and add
   bounded `list_views`, with agreement tests proving every listed ID is accepted by the shared
   registration/access authorities and invokable through durable `show_view`.
2. **Authoring guidance:** teach agents when to declare `inline` versus `adaptive`, how to test
   intrinsic layout, and how to perform the existing two-step exact-byte authoring flow.
3. **Dogfood:** promote one repeatedly useful generated concept into an adaptive durable View,
   discover it in a fresh conversation, and invoke it without live explanation.
4. **Promotion ergonomics decision:** only then decide whether to add `view create`, a trusted
   shell Save action, or nothing.
5. **Later:** support additional durable access levels, presentation variants only with evidence,
   then verify a second host and consider a remote adapter separately.

## Rejected first moves

- **One MCP tool per View:** tool-catalog growth and bundle churn become model-context churn.
- **Dynamic UI resource per View:** duplicates the fixed shell and does not guarantee model
  discovery.
- **Resources-only discovery:** resources are application-controlled and host exposure varies.
- **A second `MCP View` kind:** forks identity, recipes, descriptions, and lifecycle.
- **A new declarative durable format:** the shared active-View authority now works in both hosts.
- **Multiple presentation entries now:** no evidence yet justifies extra executable sources and
  trust subjects.
- **Implicit “all Views are inline” discovery:** mounting success is not author-declared product
  suitability.
- **Automatic promotion:** temporary presentation must not become synced executable bundle content
  without an explicit durable authoring decision.

## External protocol evidence

- MCP server primitive control model:
  https://modelcontextprotocol.io/specification/2025-06-18/server/index
- MCP Apps stable specification, UI-resource linkage, and resource-listing discretion:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
- MCP Apps lifecycle and host-context presentation modes:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/overview.md
- Official reference host implementation (`ext-apps` v1.7.5), which enumerates resources for the
  host but does not turn them into a guaranteed model-controlled catalog:
  https://github.com/modelcontextprotocol/ext-apps/blob/v1.7.5/examples/basic-host/src/implementation.ts

[designs task](../tasks/mcp-durable-view-promotion-discovery.md)
