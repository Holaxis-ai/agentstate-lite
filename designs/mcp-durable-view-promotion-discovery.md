---
type: Design
title: 'Durable conversational Views: promotion, discovery, and invocation'
description: >-
  Recommended contract for one generic View catalog, durable invocation through
  the fixed MCP shell, a cross-host declarative View format, and exact-byte
  human-confirmed promotion.
actor: openai/research-agent
timestamp: '2026-07-26T23:42:02.869Z'
---
# Durable conversational Views: promotion, discovery, and invocation

## Status

Superseded on 2026-07-26 by
[MCP and web View security-model unification](mcp-view-security-model-unification.md).

Keep this document's generic `list_views`, generic invocation, and exact-byte promotion
recommendations as later product work. Withdraw its script-free-declarative-first durable format
and sequencing recommendation: lifecycle, execution, provenance, and authority are independent
axes, and the next architectural proof is the established bridge under a shared security model.
Neither document authorizes implementation on `main` without review.

Parent direction: `designs/mcp-app-generative-views`.

## Decision summary

1. Keep one stable bundle View identity and one fixed MCP App shell.
2. Add one generic model-visible `list_views` tool when—and only when—the server can invoke at
   least one durable View through the existing generic `show_view` tool.
3. Do not register one MCP tool or one changing MCP UI resource per bundle View.
4. Do not treat ordinary MCP resources as reliable agent discovery. Core MCP defines resources as
   application-controlled and tools as model-controlled; MCP Apps primarily associates UI
   resources with tools through static tool metadata.
5. Do not feed today's scriptful `bridge-v0` bundle HTML into the conversational nested frame.
   That would reopen the arbitrary-script/self-navigation exfiltration boundary already rejected
   by the fixed-shell spike.
6. Prove a script-free declarative durable View format that both the local UI and MCP adapter can
   interpret. Existing scriptful Views remain valid workspace Views; they are not silently claimed
   as conversation-compatible.
7. Prove durable discovery/invocation before building promotion. A catalog with no invokable
   consumer is inert; promotion before a stable durable contract would persist the wrong thing.
8. Promotion must save the exact reviewed presentation bytes and data contract from a successful
   ephemeral launch. It must not ask the model to regenerate them.

## What exists today

### One durable identity and registry

The bundle already has the right identity seam:

- a `type: View` registry document under `views-registry/`;
- stable `title`, optional `description`, `entry`, and shell-enforced `access`;
- an HTML blob under `views/`;
- one core `parseRegistration` grammar used by launcher and server security checks;
- recipe portability for a View registry/entry pair.

That registry—not MCP's tool list—should remain the authority for which Views the bundle contains.

### Two intentionally different presentation contracts

The local UI currently runs a durable View as a sandboxed `allow-scripts` application. The View's
JavaScript talks to the trusted shell through the `bridge-v0` postMessage API for query, read,
edges, subscribe, navigation, and optionally one governed proposal.

The MCP App fixed shell intentionally rejects arbitrary generated script. It accepts script-free
HTML/CSS, materializes bounded `data-aslite-*` bindings from a server-resolved launch envelope, and
places trusted controls outside the generated frame.

Those are two host adapters over shared AgentState data/action authorities, but the stored HTML is
not currently interchangeable. An unqualified “promote this MCP HTML as a View” would therefore be
dishonest: the local shell would serve unresolved declarative bindings, while the MCP shell cannot
safely execute an existing scriptful View.

## Why discovery should be a tool

The MCP specification describes tools as model-controlled and resources as application-controlled.
The MCP Apps specification associates a UI resource with a tool through the tool's
`_meta.ui.resourceUri`; hosts may prefetch/cache that resource, and servers may omit UI-only
resources from ordinary resource listing.

Therefore:

- MCP resources remain appropriate for the fixed package-owned App shell.
- Bundle View definitions remain bundle data, not dynamically changing MCP UI resources.
- A model that must choose a bundle View needs one bounded model-visible discovery tool.

The recommended name is `list_views`, not `get_views`: it returns a bounded catalog of metadata,
never HTML bytes or one View body.

Conceptual output:

```json
{
  "count": 3,
  "views": [
    {
      "id": "views-registry/task-focus",
      "title": "Task focus",
      "description": "Open Tasks grouped by priority",
      "access": "bundle-read",
      "conversationReady": true
    }
  ]
}
```

The first version should be token-lean and deterministic: ID-sorted, at most 20 rows, with the
pre-limit count. It should expose identity, purpose, access, and compatibility—not entry keys,
HTML, credentials, nonces, or registry bodies.

`list_views` is read-only and model-visible. Existing refresh/action tools remain app-only.

## Invocation remains generic

Do not add a tool per durable View. Extend the existing `show_view` contract with an exclusive
durable source:

```json
{ "viewId": "views-registry/task-focus" }
```

This is mutually exclusive with agent-authored `html`/`css`. The server:

1. resolves the registry through the existing core grammar;
2. verifies the View is declared conversation-compatible;
3. reads the exact entry version;
4. parses the declarative presentation and its data contract;
5. resolves a bounded selection using existing query authorities;
6. mints the same frozen, versioned launch envelope used by ephemeral Views; and
7. returns the presentation through the same fixed `ui://agentstate/view-host/v1.html` shell.

The tool result should identify the durable View ID plus registry/entry versions so fallback text
and review evidence remain honest. The generated frame still receives no bundle credential.

## Conversation-compatible durable format

The next proof needs a format distinction, not another View kind. The existing `type: View`
identity remains stable.

Illustrative registry shape:

```yaml
type: View
title: Task focus
description: Open Tasks grouped by priority.
entry: views/task-focus.html
access: bundle-read
format: declarative-v1
query:
  type: Task
  open: true
  limit: 10
```

The exact field shape is deliberately not frozen here. The proof must decide whether the
declarative contract belongs directly in registry frontmatter or in an inert, strictly parsed
manifest carried with the entry. Either way:

- `format: declarative-v1` means script-free presentation interpreted by trusted host code;
- absent `format` means today's existing `bridge-v0` workspace application;
- the query vocabulary is the existing shared `type`/`prefix`/`field`/`open`/bounded-limit
  authority, not a second query language;
- the stored contract never carries resolved instance bodies;
- both hosts parse the same contract;
- unknown fields and versions fail closed.

The first proof should support one query-backed, read-only View. Agent-supplied ID input contracts,
relationship expansion, durable actions, variants, and live subscriptions should follow only after
that one format runs identically in both hosts.

This deliberately creates no `MCP View` kind. “Conversation-ready” is a capability of a View
presentation, not a second ontology.

## Existing scriptful Views

Existing `bridge-v0` Views remain fully supported in `aslite ui`. `list_views` may either omit them
or return them with `conversationReady: false`; the first proof should choose whichever produces
the clearest agent behavior.

It must not:

- claim they can be shown inline when they cannot;
- execute their arbitrary JavaScript inside the generated-content frame;
- synthesize a separate model-visible tool for each one; or
- fork their registry identity into an unrelated MCP record.

A future compatibility adapter could implement the bridge through app-only MCP calls, but that is
not a cheap translation. It would need query/read/edges, subscription semantics, navigation,
capability revocation, and proposal handling inside another sandbox boundary. It should compete
against declarative migration only after real scriptful Views demonstrate that need.

## Promotion

Promotion is a lifecycle write, not byte copying alone:

```text
ephemeral launch
  -> human chooses Save
  -> exact presentation + unresolved data contract are validated
  -> content-addressed entry is written
  -> durable View registry is created
  -> new identity appears in list_views
  -> show_view(viewId) reproduces it
```

The promotion receipt must carry:

- new View ID;
- registry and entry versions/content hashes;
- title and description;
- declarative format version;
- unresolved query/input contract;
- access/action declaration;
- actor attribution; and
- any orphaned blob key if registry creation fails after the blob write.

Do not freeze the currently resolved object snapshots into the durable definition.

The ideal eventual experience is a trusted-shell Save action because the running MCP process owns
the exact launch bytes and can obtain explicit human confirmation. The smallest implementation may
instead use an agent-mediated CLI command, but it must accept the exact presentation bytes and
verify their hash against the launch receipt rather than regenerate them.

The existing generic `promote` + `new "View"` sequence remains valid for expert-authored
`bridge-v0` Views. A compound declarative promotion path is justified only because it must preserve
and validate presentation, data contract, format, attribution, and two persisted objects as one
honest product operation.

## Security and authority

- The fixed MCP UI resource remains package-owned and versioned.
- Durable bundle presentation remains untrusted data.
- Declarative entries run with `script-src 'none'`.
- Registry identity and entry bytes are resolved server-side and version-bound into the launch.
- A stale or changed registry/entry requires a new launch.
- Query resolution remains bounded and freezes exact IDs/versions for that launch.
- `access` remains shell-enforced; presentation cannot grant itself bundle access.
- Promotion is explicit, attributed, and compare-and-swap guarded.
- Durable actions remain out of the first read-only compatibility proof.

## Recommended implementation sequence

1. **Compatibility fixture:** manually install one query-backed `declarative-v1` View in a scratch
   bundle and prove both the local UI and MCP fixed shell render the same authoritative rows from
   the same stored entry/contract.
2. **Shared parsing authority:** place the strict declarative registration/contract parser below
   both hosts. Extract presentation materialization only when the second host consumes it—not as a
   speculative package first.
3. **Discovery + invocation unit:** ship bounded `list_views` and
   `show_view({viewId})` together. A discovered conversation-ready View must be immediately
   invokable; no “key without a lock.”
4. **Promotion unit:** save an exact successful ephemeral query-backed presentation as a durable
   declarative View after explicit human confirmation, then prove it appears in `list_views` and
   reproduces through `show_view(viewId)`.
5. **Later:** agent-supplied durable inputs, trusted durable actions, relationship expansion,
   live refresh, presentation variants, second-host verification.

## Rejected first moves

- **One MCP tool per View:** tool-catalog growth, bundle churn, and unnecessary model context.
- **Dynamic UI resource per View:** conflicts with the fixed-shell/cacheable-resource design and
  still does not provide reliable model-controlled discovery.
- **Resources-only discovery:** resources are application-controlled; agent visibility varies by
  host.
- **Catalog before invocation:** creates an inert feature that advertises objects the MCP adapter
  cannot show.
- **Raw scriptful View reuse:** reopens the exfiltration boundary rejected by the fixed-shell proof.
- **A new `MCP View` kind:** forks identity, recipes, descriptions, and lifecycle.
- **Automatic promotion:** turns temporary presentation into synced executable content without an
  explicit human decision.

## External protocol references

- MCP server primitive control model:
  https://modelcontextprotocol.io/specification/2025-06-18/server/index
- MCP Apps stable specification and tool/UI resource linkage:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
- MCP Apps overview and lifecycle:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/overview.md

[designs task](../tasks/mcp-durable-view-promotion-discovery.md)
