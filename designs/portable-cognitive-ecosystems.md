---
type: Design
title: AgentState as a portable cognitive ecosystem
actor: openai/codex
timestamp: '2026-07-11T03:41:50.007Z'
---
# AgentState as a Portable Cognitive Ecosystem

**Status:** Directional architecture and product vision, grounded in the implemented system as of July 2026. This document deliberately distinguishes shipped behavior, near-term extensions, and longer-term hypotheses. It is not a claim that every element of the future vision already exists.

## Executive thesis

AgentState may be developing into a category broader than an agent memory store, a skills system, a workflow engine, or a generative UI framework.

The emerging architecture can be described as a **portable cognitive ecosystem**: an open, durable environment in which humans, agents, tools, prior artifacts, conventions, and interfaces participate in shared work. The model is one component of that system, not the whole system. Important discipline is moved out of a model's temporary context and into structures that persist and fire at operational moments.

The potential product unit is the **recipe**:

> A recipe packages a domain's concepts and relationships, the instructions for working with them, and the human interfaces through which the resulting work becomes visible.

In its strongest future form, a recipe does not merely install a schema or teach one agent a procedure. It establishes a shared operating environment that multiple agents, humans, and future sessions can enter and continue to evolve.

This suggests a useful distinction:

- A **skill** gives an agent a portable ability.
- An **application** gives a user a fixed environment.
- A **recipe** can give humans and agents a portable, evolvable operating environment.

That third category is not yet an established software primitive. AgentState has many of the pieces needed to make it real: open Markdown bundles, Kinds, links, recipes, versioned mutations, attribution, shared board state, generated Pages, sandboxed live data access, and plugin distribution. The remaining work is not to collapse these pieces into one giant abstraction. It is to make their composition coherent, transferable, observable, safe, and empirically useful.

## 1. The change in the unit of software

Traditional applications usually fix three things in advance:

1. the domain model,
2. the workflow,
3. the user interface.

Developers encode those decisions; users enter records into the resulting container.

```text
Developer defines schema + workflow + UI
                    |
                    v
          User manages records
```

Agent-native work permits a different loop:

```text
Recipe establishes concepts + working practices
                    |
                    v
Agents and humans create durable shared knowledge
                    |
                    v
Pages render interfaces appropriate to that knowledge
                    |
                    v
Observed practice improves the recipe
                    |
                    v
The improved environment can be shared
```

The central artifact is no longer necessarily the application. It can be the **operating model**: the vocabulary, durable state, procedures, constraints, and views through which work happens.

This does not eliminate applications. AgentState itself is an application and runtime. It changes what must be permanently hand-built for each domain. A literature review, product discovery process, claims system, personal CRM, fundraising process, or investigation may not each need a bespoke SaaS product. Each may be expressible as a portable operating model applied to the same substrate.

## 2. Why this is possible now

The architecture is enabled by several developments arriving at the same time.

### Agents can maintain environments, not merely answer prompts

Modern agents can inspect files, call structured tools, operate CLIs, follow conventions, generate artifacts, and continue work across multiple turns. A recipe applied five years ago would have been mostly a project template. An agent can interpret it continuously: create valid records, traverse links, enforce procedures, surface exceptions, and generate interfaces.

### Skills and plugins provide distribution for procedural knowledge

Agent runtimes now have recognizable packaging and marketplace mechanisms. These provide a delivery layer for instructions and executable helpers without requiring AgentState to invent another marketplace.

### Generative UI reduces the cost of domain-specific interfaces

A durable domain model no longer implies a permanently hand-coded product surface. Agents can generate a Page for the current data and task, while AgentState supplies a constrained data bridge and live invalidation. This makes interfaces a projection of the shared environment rather than the sole owner of its state.

### Persistent multi-agent work creates a coordination problem

As agents become longer-running and more numerous, chat history is not adequate shared state. Agents need durable knowledge, conflict-safe writes, attribution, handoffs, and an observable record that humans can inspect. Human trust also requires seeing work happen and being able to redirect it.

### Local-first, open artifacts are newly strategic

If agents mediate more of a person's knowledge work, locking the resulting knowledge inside one agent vendor or application becomes more costly. Plain Markdown, an open bundle format, generic links, and replaceable storage backends let the intelligence of the environment persist beyond any particular model or host.

## 3. The conceptual model

The architecture stays clearer when each layer retains one job.

### Bundle: the durable shared world

The bundle is the evolving state of the environment: documents, frontmatter, links, blobs, history, and conventions. It is inspectable without an agent and remains useful if AgentState disappears.

### Kind: the domain vocabulary

A Kind declares what a class of document means structurally: its fields, enum values, body sections, link vocabulary, lifecycle terminal states, placement convention, and freshness horizon. Kinds are controlled vocabulary expressed as ordinary OKF convention documents and loaded through one registry.

Kinds should remain **Kinds**, not “ingredients.” The recipe metaphor is helpful at the product layer, but `Kind` accurately names a type definition. An individual document may act as an ingredient in some process; the Kind defines what that document is.

### Recipe: the portable operating model

Today, a recipe is a curated, data-only composition of convention documents applied through one generic pipeline. It installs domain structure into a bundle using expect-absent CAS, is idempotent, and does not overwrite an adopted convention.

The future recipe is still grounded in that portable core, but it can be delivered alongside complementary assets:

- agent instructions or a focused skill,
- examples and seed documents,
- optional Pages,
- deterministic validation or reporting scripts,
- explicit orchestration that invokes existing AgentState primitives.

The portable recipe core and tool-specific enhancements must remain separable. A recipe-ignorant OKF tool should still see valid, useful documents. Plugin behavior must not become necessary merely to read the knowledge.

### Skill: procedural intelligence

A skill teaches an agent when and how to perform a pattern. It belongs beside a recipe, not underneath or above it. The skill can explain how to use the installed Kinds, what evidence matters, when to promote work, and which deterministic commands to call.

A skill alone usually does not establish durable shared state. A recipe alone does not provide all procedural judgment. Their composition is the useful unit.

### Page: the human window

A Page is a generated or authored interface stored as bundle content and registered by a `type: Page` document. Pages render inside a sandboxed iframe. Their bridge capability is explicit: `none` for content-only Pages or `bundle-read` for Pages that query bundle data. The bridge is read-only by construction.

Pages are not the source of truth and do not define a second domain model. They are contextual projections of the bundle. Different Pages can present the same knowledge for different people or tasks without migrating the underlying state into separate application databases.

### Operational moment: where structure becomes behavior

A convention sitting in a bundle is not enough. For cognitive infrastructure to matter, it must activate at the moment it is needed: validation at write time, a CAS guard at mutation time, a session summary at session start, a verification check before publication, or a refresh after a durable event.

Operational moments are the bridge between declarative structure and effective practice. AgentState should add them carefully and specifically, not by becoming a general workflow engine.

### Plugin: delivery, not ontology

A plugin delivers a recipe, its skill, and optional assets into an agent environment. The plugin marketplace handles discovery, versioned installation, and cache refresh. Applying the recipe to a particular bundle remains a distinct, explicit action.

This separation creates two honest selection moments:

1. Which recipe plugins are available to this agent environment?
2. Which recipes has this bundle explicitly adopted?

## 4. What the current architecture already provides

The current system is more than a diagram. It already implements a significant part of this model.

### 4.1 Open, local-first durable state

AgentState bundles are ordinary OKF Markdown documents and blobs. The filesystem is the default backend. Users can read, grep, diff, edit through supported tooling, commit, export, and retain the bundle without a hosted account. The bundle is the owned artifact; AgentState is a producer and consumer of it.

The storage seam supports filesystem, in-memory, reference remote, and D1/R2-backed implementations. The engine retains domain semantics while adapters persist bytes and versions. This makes local use first-class and remote use additive.

### 4.2 One semantic engine

Core owns the frontmatter parser, bundle walk, link resolver, graph behavior, Kind registry, freshness interpretation, and versioned storage contract. Consumers are expected to call these authorities rather than restating their semantics.

This is important for the ecosystem vision. A portable operating model cannot be trustworthy if the CLI, UI, recipe loader, and remote service each interpret it differently.

### 4.3 Conflict-safe, attributed mutation

Version tokens, compare-and-swap writes, bounded retry, actor attribution, and history are already part of the storage and engine shape. The mutation boundary is being consolidated so read-dependent decisions operate against the same version they attempt to write.

These are not merely database features. They are coordination primitives. Multiple agents can act on a shared environment without reducing correctness to “the last writer probably wins.” Attribution makes the environment legible to humans and future agents.

### 4.4 Kinds as bundle-owned controlled vocabulary

Kinds are declared in plain convention documents and discovered under a stable prefix. They currently express:

- required and optional fields,
- enumerated values,
- terminal lifecycle values,
- expected body sections,
- typed link expectations,
- placement prefixes,
- freshness horizons.

The generic CLI discovers Kinds, creates instances, validates writes, projects declared fields, filters by fields, and teaches link shapes. The mechanism is opt-in and conventions-free bundles retain their existing behavior.

The planned field-description work is strategically important because it lets a recipe transfer meaning, not just shape. It is not shipped yet. Kind-level descriptions are a small adjacent addition that should likely travel through the same self-teaching metadata path rather than become a separate system.

### 4.5 Recipes as an existing application mechanism

AgentState already has one external and built-in recipe pipeline. `init` can apply a default recipe; `recipe add` applies a named or folder-based recipe; `recipes` reports available and applied structures. Application is idempotent and expect-absent, so it does not silently clobber a convention the bundle has adopted and changed.

This is deliberately modest. Current recipes install convention documents. They do not yet install a complete environment of skills, hooks, Pages, or arbitrary automation. That limitation is valuable because it keeps the core portable and safe while the broader product claim is tested.

### 4.6 Shared multi-agent state

The `board` branch and `sync` provide an offline-friendly sharing tier. A local bundle can remain private indefinitely, including the useful case of a public code repository with a private associated board. Sharing is an explicit act. Once established, teammates and agents can converge changes through a board-specific workflow without mixing board writes into code commits.

Session-start integration makes the shared state available when an agent begins work. Actor-aware awareness and document changes leave institutional residue instead of living only in private chat exchanges.

### 4.7 Generated Pages and live human visibility

The local UI launches bundle-owned Pages. An agent can generate self-contained HTML, promote it as a blob, register it as a Page, and have the launcher discover or reload it. A `bundle-read` Page can query documents and graph edges through a constrained bridge and subscribe to change notifications. Humans can see the result while agents continue to modify the bundle.

This is already a generative UI loop, though it is important to name its present boundary. Agents generate Pages through their normal tool environment; the launcher itself does not yet provide a complete prompt-to-agent-to-Page chat experience.

The static viewer is being retired in favor of one Page primitive. That reduces parallel interpretation and lets content Pages and data Pages use the same registry and sandbox model. The removal also consciously gives up the automatically generated whole-bundle graph and baked data snapshot until a real Page or snapshot protocol justifies replacing them.

### 4.8 Real-time invalidation exists; durable event semantics do not yet

The current UI uses one shared SSE connection and change detection to invalidate or refresh consumers. It supports useful live behavior and reconnect-triggered full refresh. It does not yet provide a durable, ordered, replayable event journal.

The proposed event backbone would add per-bundle cursors, replay, snapshot-plus-cursor bootstrapping, actor attribution, and honest invalidation for direct filesystem changes. It remains a candidate architecture, not a committed or shipped primitive. This distinction matters: the future vision should consume such a backbone if ratified, but should not pretend ephemeral SSE already guarantees ordered recovery.

### 4.9 Plugin distribution is available; recipe transfer remains to be proven

The AgentState CLI and skill can already be distributed through versioned plugin caches, and the distribution now ships the advertised contracts and examples. The open experiment is whether a real external recipe, its focused skill, and optional assets can be published by one founder, installed by another without a source checkout, applied to a fresh bundle, understood through discovery, and refreshed across a plugin version change.

That founder-to-founder transfer is the correct near-term proof. It tests product value without requiring a new marketplace, dependency resolver, or automatic migration system.

## 5. Alignment with cognitive-ecosystem design

The cognitive-ecosystem framework treats the model as one participant in a larger system of humans, artifacts, scripts, memory, schemas, conventions, and institutions. Its seven directives map strongly to AgentState.

| Directive | Existing AgentState alignment | Important gap or future extension |
| --- | --- | --- |
| Promotion from ad hoc to durable | Documents, context notes, `promote`, Kinds, recipes, and task records turn session output into callable structure | Make promotion moments easier to invoke and measure; show when repeated practice deserves a Kind, recipe, skill, or deterministic primitive |
| Stabilization routing | Status fields, decision/design records, conventions, code tests, and version history provide several routes to stability | Do not assume every document has the same epistemic status; add route metadata only where real workflows need validated/specified/declared distinctions |
| Deterministic substrate | One engine, stable CLI contracts, CAS, parsers, validation, scripts, tests, and replayable file artifacts move critical behavior outside model judgment | Recipe-level conformance and reproducible adoption proofs need to become first-class before community distribution grows |
| Retractability | Version history, plugin versions, additive contracts, fixtures, and parity testing support comparison across change | Recipe adoption has no upgrade or rollback model yet; do not build one until a real second version must update adopted, possibly customized conventions |
| Primitive-granular verification | Core and backend contract tests, Kind parser tests, mutation tests, bridge tests, and isolated reviews test individual boundaries | Pages, recipe assets, and operational rules need focused conformance tests rather than relying only on an impressive end-to-end demo |
| Generative ecosystem audit | The project already asks whether removing an artifact would degrade reasoning and has used that test to freeze or retire surfaces | Usage observability remains weak; the system cannot yet show which Kinds, Pages, skills, or recipe elements are actually load-bearing |
| Coordination among participants | Shared board, links, attribution, history, sync awareness, session start, CAS, and live Pages route human/agent work through common structure | Durable ordered events and better handoff/attention surfaces would reduce the remaining private or inferred coordination channels |

The strongest alignment is not metaphorical. AgentState is already being used by its founders and their agents to build AgentState. The board, tasks, designs, links, review records, and Pages participate in the engineering process. Removing them would change what the team and its agents can know and coordinate. By the framework's generative test, they are mediating cognitive structure.

## 6. The ratchet: how environments become more capable

The architecture supports a cumulative loop:

```text
Conversation or one-off work
          |
          v
Durable document or artifact
          |
          v
Repeated structure becomes a Kind
          |
          v
Repeated working method becomes a skill or deterministic primitive
          |
          v
Kinds + method + views become a recipe package
          |
          v
Another person installs and adapts it
          |
          v
Successful adaptations inform the next recipe version
```

This is more than accumulation. Each successful promotion raises the floor from which the next agent begins. The next session does not merely receive a longer transcript; it receives a better environment.

A useful metaphor is genotype and phenotype:

- The **recipe** is a portable genotype: an initial vocabulary, operating guidance, and optional interfaces.
- The **bundle** is the phenotype: the living environment that develops through local human-agent activity.
- A later recipe version should not overwrite the phenotype. Valuable adaptations may be promoted intentionally into a new portable genotype.

The metaphor also explains why recipe upgrades are difficult. Once a bundle has adopted and modified a convention, its local evolution matters. Plugin update and recipe migration must remain separate operations.

## 7. Future vision: installable cognitive ecosystems

The future experience should feel less like configuring a database and more like adopting a mature way of working.

### Example: install a research ecosystem

A user installs a research recipe plugin. The plugin delivers:

- Kinds such as Question, Source, Claim, Evidence, and Synthesis;
- descriptions explaining every Kind and field;
- link conventions for evidence, contradiction, derivation, and supersession;
- a skill teaching agents how to conduct and record the research;
- a Page showing open questions, contested claims, evidence coverage, and provenance;
- deterministic checks that report uncited or internally inconsistent claims.

The user explicitly applies the recipe to a local bundle. The adopted conventions become ordinary Markdown owned by the user. The agent can inspect `kinds` and per-Kind help, create valid documents, connect them, and explain the workflow. The Page immediately renders the emerging state. As the agent works, the human sees new claims and evidence arrive and can redirect the investigation.

The recipe's skill may tell the agent what to do, but the bundle retains what happened. The Page makes it visible. The deterministic checks guard important boundaries. Version history and attribution show who changed what. A later agent can continue without the original conversation.

### The portable package shape

The clean architecture has two layers.

**Portable recipe core:**

- manifest and version identity,
- convention documents,
- optional seed documents and link scaffolds,
- plain explanatory prose,
- documented conflict and apply semantics.

**Host-specific enhancement:**

- skill instructions,
- optional Pages and examples,
- deterministic scripts,
- explicit installer/orchestration helpers,
- declared permissions for any executable behavior.

The core should remain valid OKF content and usable through plain files. The plugin is a convenient delivery vehicle, not the definition of the recipe.

### Self-teaching Kinds

For recipe transfer to work, Kinds must communicate enough meaning at the moment of use. Required/optional fields and enums transfer shape, but not always intent. The low-complexity semantic layer should grow incrementally:

1. field descriptions,
2. Kind-level descriptions,
3. descriptions for enum values where lifecycle semantics are non-obvious,
4. section descriptions,
5. field examples,
6. link descriptions.

All should be optional, non-executable metadata flowing through the one Kind registry. They should improve discovery, help, skill generation, and Pages without changing validation unless an explicit existing rule already does so.

Avoid turning Kinds into a general schema language. Inheritance, computed fields, arbitrary expressions, embedded prompts, triggers, and UI layout declarations would increase coupling and make open degradation harder. Add scalar types, cardinality, or reference constraints only when concrete workflows repeatedly fail without them.

### Bounded operational moments

The near-term recipe should primarily rely on agent instructions and existing deterministic commands. Future operational behavior can be divided into three trust levels:

1. **Agent procedures:** instructions such as “before completing a synthesis, verify every Claim has evidence.” The agent invokes existing tools.
2. **Declarative lifecycle checks:** narrowly defined rules interpreted by AgentState, such as permitted status transitions or “report missing evidence before verification.” These should emerge from repeated workflows, not from a desire for a generic rules language.
3. **Executable plugin helpers:** scripts that import data, generate reports, build Pages, or run domain-specific validation. These require explicit trust and permissions.

Installing a data recipe must never silently activate arbitrary code. Data-only and executable packages should be visibly distinct trust tiers.

### Ordered, recoverable events as the live spine

If AgentState commits to deeper real-time collaboration, one event primitive should serve Pages, the launcher, session awareness, notifications, and future agent coordination. Consumers should not each reinvent polling, diffing, reconnect, and replay.

The desired durable contract is:

- monotonic per-bundle cursor,
- actor and affected artifact,
- previous and resulting versions,
- explicit event type and timestamp,
- reconnect after a cursor with replay,
- snapshot bootstrap returning a cursor,
- an explicit full-refresh response when retention cannot satisfy replay,
- atomic state-and-event commit on backends capable of it,
- honest coarse invalidation when direct filesystem edits bypass precise mutation events.

Presence, progress animation, and typing indicators should remain ephemeral and droppable. Durable state changes and ephemeral activity are different products and should not share false guarantees.

### Human mediation as a defining experience

The user value is not merely that agents can write records. It is that a person can engage an agent and see the shared world changing in real time. Pages should expose meaningful intermediate state, not only polished final outputs. Humans should be able to inspect, question, correct, and redirect the agent while the durable record remains coherent.

This is where AgentState can differ from both background automation and static knowledge bases. The environment is jointly inhabited. The human is neither a passive consumer nor an operator managing hidden agent jobs.

## 8. Why the composition may be differentiated

No individual component is unprecedented. Markdown knowledge stores, typed databases, workflow engines, agent skills, local-first tools, generated interfaces, and plugin marketplaces all exist.

The differentiation may lie in the center of gravity:

- Note-taking products typically add AI to documents.
- Database products add AI to schemas and views.
- Agent frameworks add memory and tools to agents.
- Workflow engines add model calls to pipelines.
- UI generators add a database behind a generated application.

AgentState can instead center the **durable shared cognitive environment**. Documents, agents, procedures, and interfaces are cooperating projections of one open substrate.

The potential unique claim is:

> Install a domain-specific way of working, let agents operate it immediately, watch the work evolve live, and retain the resulting knowledge as open, inspectable, portable state.

This may be a moment-in-time architecture because the necessary capabilities only recently became simultaneously practical: reliable tool-using agents, skill/plugin distribution, generated interfaces, multi-agent sessions, and demand for durable user-owned context.

It may also reflect a different way of thinking about intelligence. Instead of locating capability solely inside a larger model or longer prompt, it treats intelligence as distributed through participants and mediating structure. Improving the environment can improve the system without changing the model.

The project’s own development history matters here. AgentState has been built by founders and agents using AgentState. That recursive use exposed real requirements—conflict-safe claims, board awareness, durable designs, shared tasks, live Pages, and invariant ownership—that a speculative “AI workspace” design might not discover.

## 9. Architectural principles and non-negotiables

### One authority per semantic concern

Keep one parser, one Kind registry, one link resolver, one mutation boundary, and—if adopted—one live freshness spine. Recipes and Pages consume those authorities; they do not create parallel implementations.

### Open substrate, optional enhancement

The knowledge remains meaningful as OKF Markdown. A host-specific skill or Page may add substantial value, but losing the host must not erase the domain state or make it unintelligible.

### Local-first is a product capability

A recipe and its bundle must work without a remote service. A user may keep a board private even when associated code is public. Remote collaboration is an adapter and explicit choice.

### Human visibility is foundational

Real-time human-agent engagement is not decorative UI. It is part of the coordination model and trust boundary. Generated Pages should make durable work visible while preserving sandboxing and read-only access by default.

### Executable behavior requires explicit trust

Applying a Markdown recipe and installing executable code are different acts. The product should surface that distinction instead of hiding it behind the friendliness of the recipe metaphor.

### Adopted state belongs to the bundle

A plugin update does not automatically mutate an adopted bundle. Recipe installation, recipe migration, and local customization are separate lifecycle events.

### Operational moments, not reminder prose

If a rule matters reliably, place it in the primitive that owns the relevant action or in a deterministic check that fires at the relevant boundary. Do not rely on every future agent remembering a paragraph.

### Stop before the meta-system consumes the work

The substrate should reduce coordination cost. If recipe governance, dependency resolution, schema expressiveness, or automation infrastructure consumes more attention than the domain work it supports, the architecture has overshot.

## 10. Recommended sequence

The next work should prove transfer and meaning before expanding expressiveness or automation.

### 1. Make unfamiliar Kinds self-teaching

Ship machine-readable field descriptions through the one parser and registry into `kinds`, per-Kind help, recipes, and the UI contract. Include Kind-level descriptions in the same conceptual metadata path if it can remain a coherent reviewed unit; do not create a separate description system.

This is high leverage because it improves every recipe, agent, and generated Page while adding no new execution semantics.

### 2. Run the founder-to-founder recipe-plugin experiment

Package one genuinely useful external recipe with a focused skill and, if useful, one Page. Publish it through an existing marketplace. Install it on the other founder's machine without the source checkout. Apply it to a fresh local bundle, create instances, use links and statuses, reapply idempotently, protect a hand-edited convention, and verify a plugin version refresh reaches the receiving cache.

Record exact friction. The success criterion is not that files arrive. It is that the receiver inherits a useful way of working with little or no oral explanation.

### 3. Evaluate the transfer, not the demo aesthetics

Ask:

- Could the receiving agent discover what the Kinds mean?
- Did it create correct records without prompt repair?
- Did the Page expose useful state immediately?
- Which instructions had to be repeated outside the package?
- Which parts of the package were unused?
- Did the user feel they installed a workflow, or merely copied templates?

Only gaps observed here should drive the next metadata or orchestration primitive.

### 4. Ratify or reject the event backbone before adding live consumers

If Pages, notifications, session awareness, and agent collaboration will all grow, decide whether ordered, recoverable events are the shared freshness primitive. Resolve ordering scope, retention, backend atomicity, snapshot bootstrapping, and direct-filesystem degradation before separately extending reconnect logic in more consumers.

### 5. Add recipe adoption/version machinery only when version two exists

Do not build provenance, dependency resolution, upgrades, or migrations merely because mature package managers have them. The trigger is concrete: a recipe has a second version that should update an existing, possibly customized bundle. At that point, design preview, diff, authority, rollback, and conflict handling together.

### 6. Add bounded verification before bounded automation

The next executable additions should be deterministic validators or reports that prove the recipe's promises. General triggers and actions should wait. Verification provides trust with less architectural surface than automation.

### 7. Audit what becomes load-bearing

After several real recipe adoptions, examine which Kinds, descriptions, skill sections, Pages, hooks, and scripts are actually consulted. Promote sedimented practice; remove ceremonial structure. This is the appropriate moment to decide whether cookbooks, composition glue, richer links, or lifecycle constraints have earned implementation.

## 11. Falsifiable product hypotheses

The vision should be treated as a sequence of testable claims.

### Hypothesis A: a recipe transfers an operating model

**Test:** One founder installs and applies the other's recipe without source checkout or live explanation.

**Evidence of success:** The receiving agent can explain the domain, create correct instances, follow links and lifecycle semantics, and complete a useful workflow using only packaged discovery and instructions.

**Evidence against:** The receiver needs substantial oral context, repeated prompt correction, or direct edits to make the package usable.

### Hypothesis B: generated Pages provide immediate human leverage

**Test:** A recipe-provided or agent-generated Page presents meaningful bundle state within the first workflow.

**Evidence of success:** The human notices, understands, and redirects work sooner than they would through raw Markdown or terminal receipts alone.

**Evidence against:** The Page is decorative, duplicates generic lists, or requires bespoke maintenance that outweighs its value.

### Hypothesis C: durable shared structure improves multi-agent performance

**Test:** Multiple agents or sessions continue the same work through the bundle rather than private chat summaries.

**Evidence of success:** Fewer repeated discoveries, fewer conflicting writes, clearer ownership, and better human comprehension of what changed.

**Evidence against:** Agents ignore the structure, create parallel notes, or spend more time maintaining records than advancing work.

### Hypothesis D: recipes become a community unit

**Test:** A third party creates, adapts, or shares a recipe without modifying AgentState core.

**Evidence of success:** Domain expertise compounds through remixable Kinds, skills, checks, and Pages while bundles remain interoperable.

**Evidence against:** Every useful recipe requires bespoke engine code or a proprietary hosted feature.

## 12. Risks and failure modes

### The recipe becomes a disguised programming language

Adding inheritance, computed fields, triggers, expressions, layouts, migrations, permissions, and dependency resolution into one manifest would recreate an application platform badly. Keep the recipe declarative core small and compose with skills, scripts, Pages, and existing AgentState primitives.

### Metaphor outruns product proof

“Installable cognitive ecosystem” is a strong vision, not yet a shipped category. Public positioning should lead with the concrete benefit—shared, durable, visible agent work—and earn the larger language through transfer experiments.

### Generated UI becomes a second source of truth

Pages must remain projections over the bundle. Mutation capabilities, if ever added, need explicit scoped commands and authority rather than direct ad hoc writes from generated JavaScript.

### Automation obscures agency and trust

Silent code execution under a friendly recipe label would undermine local-first ownership. Make executable assets visible, permissioned, and separable from data-only adoption.

### Community recipes fragment shared meaning

Two recipes may govern the same Kind differently or use the same word for different concepts. Conflict semantics, namespace expectations, and visible provenance will eventually matter. Do not solve the entire ecosystem now, but do not hide collisions.

### Local customization makes upgrades unsafe

Expect-absent installation is safe precisely because it avoids upgrades. When migration becomes necessary, it must distinguish recipe defaults from adopted local structure and make changes previewable and reversible.

### Real-time experience promises more than the event model guarantees

Ephemeral invalidation is useful but must not be described as durable ordered collaboration. Either ratify the event backbone or keep claims scoped to refresh behavior.

### Infrastructure consumes the project

The strongest warning from cognitive-ecosystem design applies recursively to AgentState: the cognitive substrate must not consume more attention than the work it supports. The stopping rule is user output and coordination quality, not architectural completeness.

## 13. Product language

The simplest externally useful statement remains concrete:

> AgentState gives humans and agents shared, versioned, local-first knowledge they can both see and evolve.

The differentiated recipe statement is:

> Skills give agents abilities. AgentState recipes give humans and agents a shared way of working.

The ambitious category statement is:

> AgentState makes domain-specific cognitive ecosystems portable: install the concepts, practices, and interfaces for a kind of work; let agents and humans inhabit them together; keep the resulting knowledge open and owned.

These statements operate at different levels. The first should be true today. The second is the near-term recipe-plugin proof. The third is the north star.

## Conclusion

AgentState's possible uniqueness does not come from inventing Markdown, types, agents, plugins, or generated interfaces. It comes from composing them around a different center: a durable shared environment through which humans and agents reason together.

The architecture already contains much of the required substrate:

- open durable knowledge,
- one semantic core,
- bundle-owned domain vocabulary,
- conflict-safe attributed writes,
- local and shared operation,
- agent-facing procedural skills,
- generated human interfaces,
- live visibility,
- versioned plugin delivery.

Recipes could become the portable unit that binds those capabilities into a domain-specific operating model. If the founder-to-founder experiment proves that another person can inherit a useful way of working—not merely receive some files—then AgentState will have demonstrated something meaningfully broader than a skills system.

The right next move is therefore not a large platform build. It is to make Kinds self-teaching, transfer one real recipe, observe what actually carries cognition across the boundary, and promote only the structures that prove load-bearing. That is both the product experiment and the cognitive-ecosystem method.

## Related records

- [The product core](../docs/core.md)
- [Design vision](../docs/vision.md)
- [North Star](../docs/north-star.md)
- [Recipes: kind composition and plugin selection](recipes.md)
- [Page model and static viewer deprecation](page-model-and-viewer-deprecation.md)
- [Invariant ownership and change contracts](invariant-ownership-and-change-contracts.md)
- [Real-time event backbone proposal](../research/real-time-event-backbone.md)
- [Recipe plugins roadmap item](../roadmap-items/recipe-plugins.md)
- [Founder-to-founder recipe-plugin proof](../tasks/prove-recipe-plugin-sharing.md)
- [Kind field descriptions](../tasks/kind-field-descriptions.md)
