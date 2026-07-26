---
type: Design
title: Conversational Generative Views via MCP Apps
actor: codex
timestamp: '2026-07-26T14:56:05.338Z'
---
# Conversational Generative Views via MCP Apps

## Status

Working product and architecture direction. This document captures the July 2026 exploration and
the current point of convergence. It does not claim the MCP surface exists and does not authorize a
hosted deployment.

The OSS product authority is the
[agentstate-lite North Star](../docs/north-star.md). This design originated in the Holaxis strategy
bundle, whose broader `strategy/live-shared-agent-workspace` and
`plans/private-hosted-platform` records remain company-level authorities. The MCP App direction can
be proved locally before either remote storage or the event backbone exists.

## The opportunity

AgentState already lets agents work with durable, structured bundle objects and lets humans open
bundle-authored Views in the local UI. MCP Apps create a second host for the same human-facing
experience: an agent can surface an interactive AgentState View directly inside a conversation.

The important opportunity is not merely to embed an existing dashboard in chat. It is to combine:

- the agent's ability to understand an immediate human request and design a useful interface;
- AgentState's stable object identities, kinds, relationships, versions, and mutation rules;
- a sandboxed conversational application that can display live objects and accept governed human
  actions.

This yields generative UI over deterministic, structured, live state. The interface may be
temporary; the objects and their changes remain durable.

## Where the exploration started

The discussion began with a remote MCP service that could let web agents read AgentState and show
Views in chat. That immediately raised storage, workspace discovery, authentication, GitHub
authorization, local-to-remote synchronization, and hosted-runtime questions.

Several useful conclusions emerged:

1. A remote MCP service cannot discover a user's local bundle without a remotely resolvable
   locator, prior registration, or a synchronization/hosting layer.
2. Git already provides AgentState's current cross-machine transport, but it exposes changes at
   synchronization boundaries and should not become provider knowledge inside the core product.
3. A local MCP server is a much smaller first product: it can read the same local bundle as the
   CLI, see unpushed edits immediately, work offline, and avoid remote authentication.
4. A local MCP server does not require a user-managed daemon. An MCP-compatible host can spawn the
   npm-installed `aslite mcp` executable over STDIO and own its lifecycle.
5. MCP should not become a second general-purpose CRUD API that duplicates the CLI. Its distinct
   product role is conversational human visibility and interaction.

The conversation then moved from pre-authored Views to agent-selected objects, and finally to a
more generative first experience: the agent writes ephemeral HTML for the immediate question and
passes stable AgentState object IDs separately. The trusted runtime supplies authoritative data and
governed actions.

## Current point of convergence

> AgentState MCP is a conversational runtime for Views. Agents select the relevant bundle objects
> and may generate a question-specific ephemeral interface. Humans inspect and act through that
> interface. Every action resolves through the same governed AgentState mutation boundary used by
> the CLI.

This is a presentation-and-interaction surface, not an alternative data authority.

The durable bundle remains authoritative. The generated HTML is untrusted, disposable
presentation. Object identity, data access, kinds, relationships, concurrency, attribution, and
mutation policy remain AgentState responsibilities.

## Product boundary

The conceptual MCP surface stays narrow:

- **List Views** when an agent wants to reuse a durable bundle-authored View.
- **Render a View** from either a registered durable View or an ephemeral generated View.
- **Execute a View action** initiated by the human through the rendered application.

Exact tool names and whether ephemeral HTML is staged in a separate call remain implementation
details. The important boundary is that MCP does not mirror every CLI verb. It does not need
general-purpose `doc write`, `link add`, recipe installation, arbitrary file access, or raw
Markdown replacement tools merely because those operations exist in the CLI.

The resulting surface split is:

| Surface | Primary participant | Responsibility |
| --- | --- | --- |
| Files and CLI | Agent | Unrestricted bundle work within the agent's permissions |
| Local `aslite ui` | Human | Full local workspace browsing and durable bundle Views |
| MCP Apps | Human, mediated by an agent | Question-specific conversational Views and governed actions |

## Architectural shape

MCP Apps should become a second host adapter for AgentState's View runtime, not a second
AgentState implementation:

```text
                                  +----------------------+
aslite ui / loopback HTTP ------> | shared View runtime  | ------> AgentState core/backend
                                  |                      |
aslite mcp / MCP Apps ----------> | launches, envelopes, | ------> shared mutation service
                                  | actions, freshness   |
                                  +----------------------+
```

The layers have deliberately different responsibilities:

- **AgentState core** owns bundle objects, kinds, relationships, versions, backend access, and the
  shared mutation boundary.
- **The shared View runtime** owns launch identity, object-selection envelopes, input-contract
  validation, action capability checks, confirmation state, and presentation-neutral errors.
- **The current UI server** adapts that runtime to loopback HTTP, SSE, and the workspace shell.
- **The MCP App adapter** adapts the same runtime to STDIO MCP, MCP Apps resources, tool results,
  and conversational-host lifecycle.
- **The CLI** resolves the bundle, workspace, actor, and installation policy before starting either
  host.

MCP protocol knowledge does not belong in core. HTTP/SSE knowledge does not belong in the shared
View runtime. Mutation policy does not belong in either host adapter.

The codebase already contains much of the difficult local machinery: the UI server has a bounded
launch registry and trusted action service; the web shell has capability revocation and sandboxed
View framing; core has the View registration grammar and shared document mutation service. The
implementation should extract and generalize those authorities rather than rebuild them.

### One fixed MCP App shell

The preferred MCP architecture uses one stable, package-owned UI resource, conceptually:

```text
ui://agentstate/view-host/v1
```

The render tool is associated with that resource. Every invocation supplies different
question-specific data through the normal MCP tool input/result channel:

- generated presentation bytes or a staged content token;
- the validated input/query contract;
- authoritative object snapshots and versions;
- a short-lived launch ID;
- the permitted semantic actions.

This fits the MCP Apps split between a predeclared, inspectable UI resource and dynamic
`structuredContent` delivered to the rendered application. It also avoids dynamic tool-catalog
churn, one resource registration per prompt, and incorrect reuse of a cached resource URI whose
bytes changed between calls.

The fixed shell is trusted package code. Generated presentation is untrusted input to that shell.
The shell owns initialization, responsive host adaptation, loading/error states, action
interception, confirmation, refresh, and fallback behavior.

An early compatibility spike must prove this exact resource/result lifecycle in the target hosts.
If arbitrary generated JavaScript requires a nested sandbox that hosts do not support reliably,
the first public version should accept script-free HTML and CSS plus declarative action markers.
Shadow DOM or equivalent containment may help isolate styles, but is not itself a JavaScript
security boundary. Arbitrary generated script should wait for a demonstrated portable isolation
mechanism.

### July 26 fixed-shell spike result

The experimental `codex/experiment-mcp-apps` implementation proved this lifecycle in the official
MCP Apps basic host:

- one fixed `ui://agentstate/view-host/v0.html` resource rendered multiple calls with different
  agent-authored HTML and different explicit object selections;
- the `show_view` result carried current server-resolved document snapshots and versions, while the
  generated HTML carried no copied bundle data;
- an npm-built `aslite mcp --dir <bundle>` process served the same contract over clean STDIO;
- structured text remained available as the non-App fallback.

The spike also rejected one containment mechanism. A generated `blob:` URL created from inside the
host's opaque sandbox resolved to a blank document in the reference host, despite an explicit
`frameDomains: ["blob:"]` grant. A nested `srcdoc` frame rendered reliably.

The deeper adversarial probe rejected arbitrary generated JavaScript. The sandbox blocked parent-DOM
access and `fetch`, but script could navigate its own child frame to an external URL. That request
can encode bundle data in its URL even when the destination refuses framing, so `connect-src
'none'` is not a sufficient no-exfiltration boundary.

The safe first contract is therefore script-free HTML/CSS. The trusted shell sanitizes active
elements and all navigation-bearing attributes, replaces only explicit
`data-aslite-text="objects.<index>.…"` bindings with text nodes from the resolved envelope, and
loads the result into `<iframe sandbox srcdoc="…">` with `script-src 'none'`. The child receives no
JavaScript capability and no raw object payload. The official reference host rendered two distinct
bound presentations through the same resource, while a planted script and external link were
removed. A second host must reproduce that declarative behavior before the surface is stabilized.

## Installation and process model

The intended local distribution is one npm installation containing:

- the `aslite` CLI;
- AgentState core and its existing View runtime assets;
- a local STDIO MCP server;
- the MCP App wrapper and bridge adapter;
- an explicit setup command that registers the MCP server with supported hosts.

A conceptual journey is:

```bash
npm install -g @holaxis/aslite
aslite mcp install
```

The host later spawns `aslite mcp` when needed. The user does not start a daemon, reserve a port,
or deploy a service. The process reads the same local bundles as the CLI.

This does not require AgentState to remain dependent on a marketplace skill. A skill may remain an
optional discoverability and guidance surface, generated from the same product references, while
the npm package carries the executable runtime.

## The core conversational journey

```text
User: "Show me today's most important tasks."
        |
        v
Agent chooses explicit Task IDs or a bounded "latest important tasks" query
        |
        v
Agent generates ephemeral HTML for this exact question
        |
        v
Agent asks AgentState MCP to render the HTML with the separate data contract
        |
        v
AgentState resolves the contract and records a short-lived launch envelope
        |
        v
The fixed MCP App shell receives authoritative snapshots through the trusted runtime
        |
        v
The user inspects the tasks and clicks "Complete"
        |
        v
AgentState confirms and executes a version-guarded mutation
        |
        v
The App renders the updated authoritative task
```

The agent does not copy the documents into the HTML. It supplies presentation intent plus an
inspectable data-selection contract. AgentState resolves and supplies current data.

## View data selection

Explicit object IDs are one important input mode, not the only one. A View may request data through
three bounded forms:

1. **Explicit objects** — display these exact stable IDs.
2. **Deterministic queries** — for example, the ten newest open Tasks ordered by `updatedAt`.
3. **Bounded graph expansion** — start from one selected object and follow declared relationship
   types within explicit limits.

A render may combine them. For example, a project dashboard might receive one explicit Project ID,
query its open Tasks, and expand each Task's linked Review Request.

Conceptually:

```json
{
  "presentation": "<section data-source=\"latestTasks\">...</section>",
  "data": {
    "latestTasks": {
      "kind": "Task",
      "where": { "status": "open" },
      "orderBy": { "field": "updatedAt", "direction": "desc" },
      "limit": 10
    }
  }
}
```

This data contract remains technically separate from the HTML even if an authoring tool makes them
feel like one generated artifact. That separation keeps data authority inspectable, validates the
request before presentation runs, allows the same query to be refreshed, and prevents markup from
silently expanding its own access.

The trusted runtime parses and validates every query, enforces kind/field/limit rules, records the
resolved contract in the launch capability, and returns only matching snapshots. A durable View
stores the same input/query contract, so "latest ten Tasks" remains live rather than freezing the
ten instances selected when it was authored.

### Why object IDs should remain agent-selectable

Selection and presentation have different owners:

> The agent selects the subjects. The View controls how those subjects are validated, expanded,
> and presented.

The agent may have already interpreted the user's request and narrowed one hundred records to the
five that matter. It should be able to pass those five IDs to the render operation rather than
forcing every View to rediscover the selection.

The View or generated application still owns an input contract:

- accepted kinds;
- minimum and maximum selection size;
- whether IDs are required, optional, or forbidden;
- supported presentation parameters;
- permitted relationship expansion.

Examples:

- A document reader requires one document ID.
- A selected-task comparison accepts several Task IDs.
- A "today" dashboard can run a deterministic bundle query when no IDs are supplied.
- A review interface accepts one Review Request ID and follows its declared links to designs,
  roadmap items, tasks, and artifacts.

The agent passes IDs and parameters, never a hand-copied replacement for the documents.

## Ephemeral generated Views

The most differentiated first experience is entirely generative at the presentation layer:

1. The agent identifies the relevant objects.
2. The agent authors self-contained HTML and CSS against a small declarative AgentState View API.
3. The render request separately carries explicit IDs, bounded queries, permitted relationship
   expansion, and granted capabilities.
4. AgentState hashes the generated bytes, resolves the data contract, and creates a
   session-scoped launch.
5. A compatible conversation host renders the fixed AgentState MCP App shell, which receives the
   generated presentation and authoritative data as invocation content.
6. The resource expires after the session unless deliberately promoted.

The fixed App shell keeps a stable versioned resource URI. Generated bytes receive a content hash
inside the short-lived launch record, not a reused resource URI whose contents vary. The public
contract may use an opaque staged-View token rather than make a local filesystem path part of the
architecture; a local implementation may still use a file as an authoring convenience, while a
remote implementation may upload the same bytes.

### Generative does not mean rebuilding the runtime

The agent generates the useful interface, not the security and transport machinery. AgentState
injects or wraps the generated content with fixed, tested support for:

- MCP Apps initialization and message handling;
- resolved object/query data delivery;
- safe DOM/runtime helpers;
- standard loading, empty, conflict, and error states;
- View actions and confirmation;
- live refresh or explicit refresh;
- styling defaults and accessibility hooks.

Agents should not repeatedly reproduce bridge boilerplate. The wrapper is stable substrate; the
question-specific UI remains generative.

The first version should strongly prefer script-free generated HTML and CSS. Interactions can be
declared with markers such as:

```html
<button
  data-aslite-action="document.set-field"
  data-target="tasks/write-proposal"
  data-field="status"
  data-value="done">
  Mark complete
</button>
```

The fixed shell intercepts the intent, renders trusted confirmation UI, and submits the governed
action. Generated markup does not receive a reusable tool credential and cannot make an invisible
mutation merely by synthesizing a click.

## Selected objects as the data-access envelope

Generated HTML is untrusted. It receives no filesystem path, bundle credential, storage adapter,
or unrestricted query capability.

The trusted render request supplies the data-selection contract separately from the HTML. The
runtime exposes current versions of the resolved objects, and only those objects, to the
application. The HTML cannot enlarge its authority by inventing another ID or broadening a query.

If a View needs related objects, its input contract may permit bounded expansion through declared
relationship types, or the agent can include the related IDs in a new render request. Unrestricted
graph traversal must not be an accidental side effect of rendering one object.

This makes the resolved launch envelope both:

- the presentation input; and
- a capability boundary for bundle reads.

A conceptual launch record is:

```json
{
  "launchId": "opaque",
  "bundleIdentity": "stable bundle locator",
  "actor": "agent or session actor",
  "viewSource": {
    "kind": "ephemeral",
    "contentHash": "sha256:..."
  },
  "selectionContract": {
    "explicitIds": ["tasks/write-proposal"],
    "queries": [],
    "expansions": []
  },
  "resolvedObjectIds": ["tasks/write-proposal"],
  "objectVersions": {
    "tasks/write-proposal": "sha256:..."
  },
  "allowedActions": ["document.set-field"],
  "expiresAt": "..."
}
```

The server-side record, not client-supplied launch metadata, is authoritative for subsequent
reads and actions.

## Human mutation through the MCP App

Conversational Views should not be limited to passive display. Their value includes lightweight
human actions such as:

- complete a task;
- approve or reject a review;
- change status or priority;
- assign an owner;
- add a short response;
- confirm an agent-proposed change.

The generated HTML must not submit arbitrary Markdown or unrestricted patches. It requests a
governed action against a selected target:

```json
{
  "action": "complete-task",
  "target": "tasks/write-proposal",
  "expectedVersion": "sha256:..."
}
```

The trusted runtime verifies that:

1. the target belongs to the rendered selection or its explicitly authorized expansion;
2. the action is allowed for this View and target kind;
3. the expected version still matches;
4. the current user intentionally initiated the action;
5. any required confirmation has occurred.

The runtime then resolves the semantic action into the actual mutation. Generated code does not
own the mapping from "complete task" to frontmatter or Markdown.

### One mutation authority

All View actions route through AgentState's shared document-mutation service below the CLI. That
boundary already owns:

- fresh read/decide/write coupling;
- compare-and-swap and bounded retry;
- semantic no-op detection;
- kind validation;
- actor propagation;
- final-version receipts.

The MCP adapter adds user/session authentication, View capability checks, confirmation, and
presentation-oriented error handling. It does not duplicate mutation policy.

The existing local `bundle-propose` capability is the closest current proof: a View can propose one
scalar-field change, the trusted shell shows canonical before and after values, and the engine
performs a hard-CAS mutation only after human confirmation. The first MCP mutation should reuse
and adapt this path rather than introduce a broad write bridge.

## Trust and confirmation model

Read and mutation are separate privileges.

- Ephemeral generated Views are read-only by default.
- Read authority is limited to the server-resolved launch envelope.
- A render request grants capabilities; the HTML cannot grant them to itself.
- Human interaction is evidence of intent, not sufficient authorization by itself.
- The trusted runtime revalidates every action.
- Low-risk reversible scalar changes may use an inline confirmation.
- Destructive, broad, or security-sensitive actions remain out of scope until separately
  designed.
- A downgrade or rerender revokes stale capabilities; an old application instance must not retain
  mutation authority.

The application never receives a reusable write credential.

## Durable Views and promotion

Ephemeral generative Views and durable bundle Views are two lifecycle states of the same idea, not
two rendering systems:

```text
Immediate question
      |
      v
Ephemeral generated View
      |
      +-- discard after use
      |
      +-- useful repeatedly --> promote, name, describe, review --> durable bundle View
```

Most generated Views should disappear. Repeatedly useful interfaces can be promoted intentionally
into the bundle, linked to kinds or recipes, and reused by agents without regeneration.

An agent may propose promotion, but saving requires an explicit human decision because it turns
temporary generated code into durable executable bundle content that may sync to other
participants. Promotion should preserve the exact content-addressed bytes the human just used
rather than asking the model to regenerate them. The promotion operation then creates the durable
View record around those bytes, capturing:

- name and description;
- HTML entry and content version;
- accepted kinds and data-selection input contract;
- permitted relationship expansion;
- declared actions and capabilities;
- intended presentation surface;
- provenance and authoring actor.

Promotion should validate the saved resource against the same sandbox, bridge, capability, CSP,
size, and action rules that will govern it later. It must not freeze the currently resolved
instance data into the View. Durable Views may continue to accept different explicit IDs or query
results through their declared input contracts.

### One View identity, potentially more than one presentation

Conversational and workspace surfaces have materially different ergonomics:

- an MCP App is usually compact, inline, mobile-aware, shallowly navigated, and focused on one
  conversational purpose;
- the local web UI can support full-screen layouts, persistent navigation, multiple panels,
  larger graphs, denser information, and longer browsing sessions.

AgentState should not pretend one HTML renderer is always optimal for both, but it should also not
create unrelated MCP and web View systems. The durable **View identity** owns the stable meaning:

- purpose;
- input and object-selection contract;
- relationship-expansion policy;
- actions and capabilities.

A renderer is one presentation of that identity. The first implementation should prefer one
responsive renderer and declare its supported surfaces, for example `conversation`, `workspace`,
or both. Only demonstrated host-specific pressure should introduce separate presentation entries
under the same View identity:

```yaml
type: View
title: Task Focus
surfaces:
  - conversation
  - workspace
entries:
  conversation: views/task-focus-inline.html
  workspace: views/task-focus-workspace.html
```

This shape is illustrative rather than a frozen schema. If variants are introduced, they must
share one input and action contract so presentation differences cannot fork data semantics or
mutation policy.

The same View semantics should ultimately run in:

- the current local `aslite ui` shell;
- an MCP App in a compatible conversation host;
- a future authenticated hosted AgentState UI.

MCP should become another host for the View primitive, not a new View format.

## Multiple documents and relationship-driven Views

A View is not bound to one document. It may render:

- an explicit set of IDs selected by the agent;
- one root object plus related objects;
- a deterministic query;
- a combination of a query and selected IDs.

For example, a Review Request View can receive one review ID, display its requested decision, and
surface linked designs, roadmap items, implementation tasks, evidence, and durable HTML artifacts.
Navigation to another registered View remains distinct from embedding copied content.

The View runtime should resolve authoritative objects from the declared selection contract. It
should not require the agent to rewrite those objects into a presentation payload.

## Freshness and real-time behavior

The local first version does not require the full hosted event backbone.

It must guarantee:

- every explicit render and refresh reads current object versions;
- a successful action returns the final authoritative version and updated object;
- a stale action fails visibly rather than overwriting;
- local filesystem changes can be observed by the MCP process.

The current View runtime already has a bundle subscription/change mechanism. Reusing it inside an
MCP App depends on whether target conversation hosts reliably deliver server-initiated updates to
an already-rendered application. That must be demonstrated empirically rather than assumed.

If host push is unreliable, the first version can refresh after actions and expose an explicit
refresh control. The later live shared-workspace event backbone provides the remote replayable
freshness spine without changing the View contract.

## Non-visual fallback

MCP hosts differ. Some clients may not render MCP Apps or may expose only terminal output.

Every render operation therefore returns a concise structured and textual fallback describing the
selected objects and the intended View. The agent can still complete the conversational workflow
or offer another surface when inline UI is unavailable.

The application enhances comprehension and interaction; it is not required for data correctness.

## Local-first proof and remote evolution

The same conceptual MCP contract can later have two implementations:

```text
Local MCP  --> local filesystem-backed AgentState bundle
Remote MCP --> authenticated hosted AgentState workspace
```

The local proof should come first because it avoids conflating conversational UI with hosted
storage, workspace registration, OAuth, synchronization, and tenancy.

For remote agents that cannot access the user's computer, a remote MCP service still requires a
remotely resolvable workspace and authentication. That service should consume the same View,
object, kind, relationship, and mutation semantics through the pluggable backend. Git may remain
an interoperability or current collaboration transport, but GitHub-specific knowledge does not
belong in the core View or MCP contract.

## Smallest credible proof

The first proof should demonstrate the product experience, not merely protocol compliance:

1. Install the npm artifact in a clean environment.
2. Register its local STDIO MCP server in one compatible desktop conversation host.
3. Use a real local bundle with a declared Task kind.
4. Ask: "Show me today's most important tasks."
5. Have the agent generate an ephemeral interface plus a deterministic data contract that selects
   the real Tasks, using either explicit IDs or a bounded query.
6. Render that interface through the fixed MCP App shell without copying task bodies into the HTML.
7. Complete one task through a governed scalar-field proposal and explicit human confirmation.
8. Show the updated task immediately in the application.
9. Read the same task through the normal CLI and prove it is the identical authoritative change.
10. Demonstrate a useful structured/text fallback in a client that does not render the App.

This proves the core proposition:

> An agent can turn a human request into a purpose-built interface over deterministic AgentState
> objects, and the human can safely act on those objects from the conversation.

## Proposed sequencing

1. **MCP host spike (implemented experimentally):** one npm-built STDIO command, one fixed App
   resource, dynamic `structuredContent`, explicit-ID snapshots, and script-free nested-`srcdoc`
   containment with declarative text bindings.
2. **Independent review and second-host proof:** review the experimental boundary and repeat the
   lifecycle/containment probe in a real target conversation host before stabilizing the surface.
3. **Behavior-preserving runtime extraction, only where the next slice needs it:** lift the
   existing launch/action authorities into host-neutral code before adding writes or durable
   promotion; do not make read-only rendering wait on an extraction it does not yet consume.
4. **Ephemeral render:** generated script-free HTML/CSS plus an explicit data-selection envelope
   supporting stable IDs and one bounded deterministic query.
5. **One governed action:** adapt the existing scalar `bundle-propose` path for task completion,
   with trusted-shell confirmation and server-side launch revalidation.
6. **Bounded relationship expansion:** add it only after explicit IDs and deterministic queries
   have demonstrated a clear need and safe contract.
7. **Durable View compatibility:** render one existing bundle-authored View through the same MCP
   host contract.
8. **Promotion path:** intentionally save a valuable ephemeral View as a durable bundle View.
9. **Freshness proof:** test file watching, action refresh, and target-host notification behavior.
10. **Second host:** verify the portable MCP Apps path in another compatible host.
11. **Remote adapter:** only after the local product experience is valuable, connect the same
    contract to an authenticated hosted workspace.

## Questions still open

- Should the first public render tool accept generated HTML directly, a local authoring file, or an
  opaque staging token? This is an ergonomics decision; all three must resolve to the same
  content-hashed launch record.
- What exact declarative authoring API should script-free generated HTML receive?
- How are input contracts expressed for ephemeral Views versus durable registered Views?
- What is the smallest deterministic query vocabulary that covers latest/open/by-kind Views
  without becoming a second general query language?
- Does the first durable View schema need only a `surfaces` declaration, or is there immediate
  evidence for multiple host-specific `entries`?
- What bounded relationship-expansion form is justified after explicit IDs and queries?
- Can a second target host reproduce the reference host's sanitized nested-`srcdoc` rendering and
  declarative binding behavior? Arbitrary generated JavaScript is explicitly outside the first
  contract because self-navigation defeats the apparent no-network boundary.
- Which low-risk semantic actions exist beyond the current scalar-field proposal?
- When is inline human confirmation sufficient, and when must the host add another approval step?
- How are actor identity and human principal represented together in local history?
- How long do ephemeral View resources live, and what cleans them up?
- Which target hosts render the standard MCP Apps bridge today, and which require compatibility
  aliases or non-visual fallback?
- Can an already-rendered application receive reliable live updates in each host?
- What is the minimal promotion command and review receipt that saves the exact staged bytes,
  validates them, and creates the durable View record?

## Explicit non-goals for the first pass

- Mirroring the full AgentState CLI as MCP tools.
- Building remote storage or authentication before the local experience is proven.
- Creating an MCP-specific second View format.
- Allowing generated HTML to read arbitrary bundle objects.
- Allowing generated HTML to submit arbitrary Markdown or filesystem writes.
- Requiring a user-managed daemon or exposed local HTTP port.
- Treating temporary generated HTML as authoritative business data.
- Solving destructive actions, broad multi-document transactions, or arbitrary forms in the first
  implementation.

## Decision summary

The current recommendation is:

1. Package a local STDIO MCP server with the npm CLI.
2. Give MCP a narrow product role: conversational View rendering and human interaction.
3. Use one fixed, versioned AgentState MCP App shell and deliver invocation-specific presentation
   and data through the tool result.
4. Lead with sanitized, script-free agent-generated HTML/CSS plus declarative text bindings; keep
   presentation separate from the explicit data-selection contract.
5. Treat the server-resolved launch envelope as both presentation input and the constrained
   read/action capability boundary.
6. Extract and reuse a host-neutral View runtime rather than regenerate bridge, launch, and action
   machinery.
7. Permit governed human actions through the one shared mutation service, beginning with the
   existing scalar proposal pattern.
8. Preserve durable bundle Views as the promotion target for interfaces that prove repeatedly
   valuable.
9. Treat a View's purpose, input contract, and actions as durable identity; prefer one responsive
   renderer, with host-specific presentation variants only when real usage requires them.
10. Keep the contract backend-neutral so the same experience can later run against a hosted live
   workspace.
