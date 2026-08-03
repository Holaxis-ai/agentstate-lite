---
type: Plan
title: 'Onboarding surfaces: one journey, two remaining work units'
actor: codex-onboarding-scope
timestamp: '2026-08-03T22:37:59.549Z'
---
# Decision summary

**Status:** scoping recommendation complete on 2026-08-03. The Brian-owned guidance task may be narrowed immediately; proposed wording or state changes to openai/codex-owned records require Michael Collier's sign-off through [the onboarding review request](../review-requests/onboarding-surfaces-mike-signoff.md).

There is **one new-user journey**, not four competing onboarding products. It is implemented and evidenced by different kinds of artifacts:

1. the shipped no-bundle CLI entry points provide discovery;
2. one explicit built-in guidance Recipe provides the missing learning workspace;
3. the existing launcher/home presents any materialized bundle;
4. the npm quickstart task proves a literal install-to-productivity path; and
5. the Journey/Journey Stage documents remain the product map and readiness ledger.

Only two implementation tasks remain: the independent npm quickstart proof and the guidance Recipe. No new onboarding subsystem or umbrella build task is needed.

# Goals

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the harness.

## Proximate goal

Give a newcomer one legible path from installation to a useful recurring workspace while preserving one owning primitive for discovery and Recipe application. This advances the ultimate goal by making the existing knowledge substrate understandable and usable without founder coaching.

# Domain model

| Term | Meaning in this plan | Not this |
| --- | --- | --- |
| **Discovery** | Executable, bundle-free orientation through bare `aslite` and `aslite recipes`; answers “what can I start?” and emits an action. | A catalog service, marketplace, or Agent Skill-only hint. |
| **Guidance Recipe** | A built-in, data-free Recipe that materializes a standalone learning bundle containing static References and a registered orientation View. | A special installer, a second recipe engine, a silently created project bundle, or a domain operating model inferred without user evidence. |
| **Launcher/home** | The existing visual container that orients a human inside the current bundle and renders registered Views/activity. | A second curriculum or a replacement for the guide's content. |
| **Quickstart proof** | A literal installed-package acceptance journey proving npm-global install, orientation, recipe choice, bundle creation, useful content, and a visible productive outcome. | A separate product UI or owner of release staging/update mechanics. |
| **Journey model** | The linked Journey and Journey Stage records that express desired experience, evidence, readiness, and gaps across lanes. | An implementation task backlog or another runtime surface. |
| **Notice/acknowledgement** | A future per-person, expiring interaction mechanism that depends on stable identity. | A prerequisite for guidance v1. |

# Surface allocation

| Component | Distinct job | Current state | Decision | Owner / next action |
| --- | --- | --- | --- | --- |
| [Bundle-free recipe discovery](../tasks/product-recipe-discovery.md) | Let a user in an empty directory see available starting setups and exact init/add commands without creating files. | **Done**, PR #201 / merge `138a3c7`; openai/codex. Live probe on 2026-08-03 confirmed bare `aslite` points to `aslite recipes`, `recipes` lists three built-ins, and the empty directory remains bundle-free. | Keep done. Do not reopen, merge, or retire. A future guidance Recipe becomes discoverable through this generic inventory. | openai/codex owns the shipped primitive; the guidance task adds content through it. |
| [Guidance bundle onboarding](../tasks/guidance-bundle-onboarding.md) | Teach the product through its own bundle primitives and hand the user off to a real workspace. | Todo; Brian/Claude side. | Re-scope in place as **built-in `agentstate-guide` Recipe v1**. Explicitly materialize a standalone guide at a user-chosen location. Persistent reference, not a one-time wizard. | brian-claude remains assignee; next action is a content/interaction design and implementation plan after Mike signs off on the shared journey boundary. |
| Existing launcher/home ([completed first-run task](../tasks/launcher-first-run-onboarding.md)) | Orient the human once any bundle exists; show honest location/sharing state, activity, docs, and registered Views. | Done in PRs #135/#137/#151. | Reuse as the guide's container and the quickstart's visible endpoint. Do not create or reopen an onboarding task for it. | Existing launcher roadmap owns residual launcher work; guidance owns only its own View/content. |
| [npm quickstart](../tasks/npm-quickstart-onboarding.md) | Prove the durable npm-global install → orientation → `work-tracking` init → useful record → visible productivity path. | Todo P1; openai/codex; depends on I1+C2S, explicitly outside release mechanics. | Keep separate and unblocked by the guide. It should consume shipped discovery and prove the existing `work-tracking` fast path. Once the guide exists, assert that it appears as a choice, but do not make guide completion a predecessor. | openai/codex; Michael to approve this boundary before its task wording changes. |
| [New user to recurring value](../journeys/new-user-to-recurring-value.md) and stages | Organize the whole product journey, including host-specific lanes and later recurring value. | Active; openai/codex. | Keep as the frame. It does not become a task or runtime UI. Treat desktop connection stages as parallel lane setup rather than hard predecessors of the shared learning/bundle path. Update evidence/readiness only when implementation evidence exists. | openai/codex; Michael to approve record clarifications. |

# One user journey

The supported newcomer path should read as one progressive sequence:

1. **Install:** install the supported npm package and receive the stable `aslite` executable.
2. **Orient without mutation:** bare `aslite` in an empty directory explains blank initialization and recipe discovery. `aslite recipes` works offline and does not create a bundle.
3. **Choose a path:** recommend `agentstate-guide` to a genuinely new user; keep `work-tracking`, other recipes, and blank initialization visible for users who already know what they need.
4. **Learn in an explicit location:** run an emitted command equivalent to `aslite init --recipe agentstate-guide --dir <chosen-learning-workspace>`. Never infer the cwd as a product choice and never initialize or overwrite an existing project workspace.
5. **Learn by doing:** open the guide through the ordinary launcher/web or MCP View path, understand bundle/kind/link/recipe/View/status concepts, and perform one safe attributed action that creates ordinary bundle content.
6. **Graduate rather than convert:** create a separate real bundle in the intended visibility mode and choose an appropriate recipe. The guide remains available as a reference; it is not transformed into the user's project.
7. **Reach recurring value:** create and coordinate useful content, return through catalog/session orientation, then use update/sharing stages as later parts of the same Journey.

Claude Desktop and ChatGPT connection are parallel host lanes after installation. A terminal/local-web user can complete learning and first-bundle creation without either desktop connection.

# Guidance Recipe v1 boundary

## Delivery and lifecycle decisions

- Use the existing built-in `RecipeSource` path and proposed identity `agentstate-guide`; do not add `guide`, `learn`, persona, marketplace, or postinstall machinery.
- Recommend standalone creation at an explicit destination. Generic `recipe add` can remain mechanically available, but onboarding copy should not encourage injecting the curriculum into an existing project bundle.
- Ship static Reference docs plus one registered, bundle-read orientation View. Begin with no user-instance data; the learner's first safe action creates the first instance.
- Keep the guide permanently reopenable. Do not implement wizard completion, “seen,” or per-person acknowledgement in v1.
- The optional Agent Skill may mention the exact discovery command when a user identifies as new or asks for help, but the executable CLI remains sufficient and must not nag or maintain hidden state.
- Keep [the interop sample bundle](../docs/core.md) conceptually separate: `examples/sample-bundle` is a standards/round-trip fixture, while the guide is maintained product curriculum.
- Teaching sharing must preserve local-first choice: explain local bundle creation first, then make `sync --establish` an explicit later action rather than an onboarding side effect.

## Relationship to the built-in-recipe deferral

This does not reverse [the decision to defer guessed domain operating models](../decisions/defer-builtin-recipes.md). `agentstate-guide` teaches the product's already-shipped primitives; it is not the Personal Task System or a speculative user workflow. Custom-recipe walkthroughs still determine future domain recipes.

## V1 curriculum outcome

Without source-code reading or founder explanation, a user can answer:

- what a bundle is and where this one lives;
- how docs, links, Kinds, Recipes, Views, status, and optional sync relate;
- what remains local by default;
- how to perform one safe attributed write and observe it;
- how to create a separate real workspace; and
- how to reopen the guide later.

# Work sequence versus user sequence

The user sequence above does not impose a serial implementation dependency:

1. **Now:** accept this scope and the two-task boundary.
2. **Quickstart path:** openai/codex may execute Q6 after I1+C2S using the already-shipped `work-tracking` recipe. It remains independent of P5A and of guidance content.
3. **Guide path:** brian-claude may design/build `agentstate-guide` from the shipped PR #201 discovery seam once the shared boundary is approved. It must not touch P5A, staged-release automation, update selection, or marketplace retirement.
4. **Journey evidence:** after each unit ships, openai/codex updates the corresponding Journey Stage current experience, evidence, readiness, and remaining gaps. Records should follow evidence rather than predict it.

The two implementation units can proceed in parallel after coordination because they have different outputs and oracles: Q6 is an installed-package journey test; the guide is a curriculum/Recipe/View artifact with its own literal learn-to-real-bundle proof.

# De-duplicated task disposition

| Record | Disposition | Reason |
| --- | --- | --- |
| [tasks/product-recipe-discovery](../tasks/product-recipe-discovery.md) | **Keep done; no change.** | It is the shipped generic discovery primitive and prerequisite, not remaining onboarding work. |
| [tasks/launcher-first-run-onboarding](../tasks/launcher-first-run-onboarding.md) | **Keep done; no change.** | The launcher container/orientation already shipped. Residual launcher work belongs to its roadmap, not this scope. |
| [tasks/guidance-bundle-onboarding](../tasks/guidance-bundle-onboarding.md) | **Re-scope in place; keep todo P2.** | One task should own guide content, registered View, explicit materialization, and the learn-to-real-bundle proof. Remove special install, wizard, acknowledgement, sample-fixture merger, and discovery-engine questions. |
| [tasks/npm-quickstart-onboarding](../tasks/npm-quickstart-onboarding.md) | **Keep separate, todo P1; proposed clarification only.** | It owns the deterministic installed-package productivity proof with `work-tracking`, not guide content or release mechanics. Other-team record: change only after Michael approves. |
| [Journey and stages](../journeys/new-user-to-recurring-value.md) | **Keep active; no task conversion.** | They are the cross-lane experience/evidence map. Proposed Mike-side edits: record recipe discovery as shipped, clarify parallel host lanes, and link future guide evidence when it exists. |
| [tasks/onboarding-surface-scoping](../tasks/onboarding-surface-scoping.md) | **Complete after this plan and review request are linked.** | The scoped plan and de-duplicated task set are the deliverable; implementation remains elsewhere. |

No task is retired. The apparent four-way overlap resolves to two completed primitives, two distinct pending work units, and one non-task product model.

## Post-approval record repairs

The current bundle lint reports that both pending Tasks lack the typed inbound `contains` relationship
expected by the Task kind. After Michael approves the shared boundary, the openai/codex-owned umbrella
records should add these edges (the task bodies' existing `part of` links do not substitute for the
declared Roadmap Item → Task relationship):

- [npm-first distribution](../roadmap-items/distribution-neutral-resources.md) `contains`
  [npm quickstart](../tasks/npm-quickstart-onboarding.md);
- [npm-first distribution](../roadmap-items/distribution-neutral-resources.md) `contains`
  [guidance onboarding](../tasks/guidance-bundle-onboarding.md); and
- [product recipes](../roadmap-items/recipe-plugins.md) `contains`
  [guidance onboarding](../tasks/guidance-bundle-onboarding.md).

These are graph/ownership corrections after approval, not new implementation tasks.

# Acceptance matrix for later implementation

| Boundary | Required proof | Owning task |
| --- | --- | --- |
| Empty-directory discovery | From an isolated directory, bare `aslite` and `aslite recipes` exit successfully, create no bundle/files, remain offline-capable, and show actionable choices. | Shipped discovery regression; consumed by quickstart and guide. |
| Minimal productivity | Exact installed npm artifact: global install → orientation/discovery → explicit `work-tracking` init → valid attributed Task → visible live state. | npm quickstart. |
| Guide materialization safety | Exact installed npm artifact: discover guide → initialize at explicit chosen path; existing project/binding targets fail closed; no postinstall or ambient mutation. | guidance task. |
| Guide usefulness | Fresh user/agent opens the guide, explains the mental model, completes one safe action, and creates a separate real bundle without founder help. | guidance task. |
| Persistence without nags | Guide can be reopened; no acknowledgement/identity/notice state is required or written. | guidance task. |
| Journey fidelity | Stage records cite the shipped task/context evidence and never claim readiness ahead of proof. | openai/codex Journey owner. |
| Collision avoidance | No changes to P5A, npm release automation, update selection/notices, marketplace retirement, or deferred domain recipes. | Both builders and reviewers. |

# Evidence and constraints consulted

This decision uses the current task bodies, all 14 Journey Stages, [PR #201's recipe/guide handoff note](../context-notes/recipe-discovery-guidance-bundle.md), [the user-notices identity design](../designs/user-notices.md), [recipe roadmap](../roadmap-items/recipe-plugins.md), [npm distribution roadmap](../roadmap-items/distribution-neutral-resources.md), [the built-in deferral decision](../decisions/defer-builtin-recipes.md), Q6 in the version/update plan, and a direct empty-directory probe of the current built CLI.

The handoff's summary that recipe discovery was todo/unowned was stale: its authoritative Task is done and owned/assigned to openai/codex. This plan follows the authoritative Task and expands the coordination boundary accordingly.

# Non-goals

- No product code, release work, or deployment in this scoping unit.
- No new onboarding command, marketplace, recipe parser, or automatic composition.
- No silent npm postinstall changes.
- No automatic creation or mutation of a project bundle.
- No one-time wizard, acknowledgement, stable-person identity, or notice delivery.
- No reopening of deferred Personal Task System/domain recipe work.
- No merger of the product guide with the external-shape interop fixture.

[orientation record](../context-notes/onboarding-surfaces-orientation-2026-08-03.md)
