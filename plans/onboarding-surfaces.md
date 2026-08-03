---
type: Plan
title: 'Onboarding surfaces v2: one journey, safe guide slice, explicit adjacent lanes'
actor: codex-onboarding-scope
description: >-
  Approved direction: agentstate-guide is outside the domain-Recipe deferral;
  early slice contains generic create-only init safety, ordered/stateless guide,
  and independent npm quickstart, with adjacent lanes explicit.
timestamp: '2026-08-03T23:54:01.578Z'
---
# Revision 2 decision summary

**Status:** revised after the [three-lens review synthesis](../context-notes/review-onboarding-synthesis.md) on 2026-08-03. The panel returned **pass-with-caveats**: the one-journey structure and Recipe delivery shape hold, but v1 must not claim mechanics the current product lacks.

There is one new-user journey, not four competing onboarding products. Within the **discovery → guide → first-value slice**, three implementation units remain:

1. a generic [`init --create-only` target-safety guard](../tasks/init-target-safety-guard.md);
2. the [`agentstate-guide` curriculum/Recipe/front-door unit](../tasks/guidance-bundle-onboarding.md); and
3. the independent [npm quickstart proof](../tasks/npm-quickstart-onboarding.md).

Two primitives are already shipped—bundle-free recipe discovery and launcher/home orientation—and the Journey records remain the cross-lane product/evidence model. Host connection, return/rediscovery, and richer operating-model recipes remain adjacent onboarding work outside this slice.

**Decision resolved:** Brian Derfer decided that `agentstate-guide` is outside the domain-Recipe deferral because it teaches AgentState Lite's existing functionality rather than a proposed user operating model. The durable [decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md) and [approved review request](../review-requests/onboarding-surfaces-mike-signoff.md) authorize the reviewed front-door, create-only, quickstart, Journey, and roadmap record boundaries. Built-in registration remains evidence-gated, not decision-blocked.

# Goals

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the harness.

## Proximate goal

Give newcomers one legible, safe path from installation to a useful recurring workspace while preserving one owning primitive for each behavior. This serves the ultimate goal only if the guide teaches mechanics that actually exist and does not silently mutate another workspace.

# Corrections from review

Three earlier claims were wrong or too broad:

- **A read-only View cannot create a document.** The only current View action is `document.set-field` on an existing governed document. Guide v1 therefore teaches an exact CLI `aslite new` action and observes it live in a `bundle-read` View. View-mediated document creation and `bundle-propose` are out of scope.
- **Current `init` does not fail closed on existing/enclosing workspaces.** It can apply another Recipe to an existing bundle and create a nested bundle. Safe onboarding needs an explicit generic create-only preflight; this is shared product code, not guide copy.
- **“Only two implementation tasks remain” was true only of the four handed-off records, not onboarding as a whole.** This revision scopes the claim to the early slice and names adjacent open work.

A fourth current-code constraint shapes discovery: bundle-free `aslite recipes` emits a cwd-targeting `init --recipe <name>` command when the caller supplied no target. V1 will not change that generic inventory contract. The approved no-bundle home, README, and Agent Skill follow-up will carry the guide's explicit safe command.

# Domain model

| Term | Job | Not this |
| --- | --- | --- |
| **Front doors** | README/npm quickstart, bare `aslite`, and the installed Agent Skill tell a newcomer what to do next. | Persistent nagging or a hidden user-state machine. |
| **Recipe discovery** | Bundle-free `aslite recipes` inventories starting setups without creating files. | The owner of guide-specific recommendation copy or destination policy. |
| **Create-only target safety** | A generic opt-in `init` preflight refuses existing, bound, enclosing, ambiguous, or concurrently created bundle targets before any write. | Recipe-specific branching or a replacement for `recipe add`. |
| **Guidance Recipe** | A portable, ordered curriculum plus a registered read-only View, proposed as the built-in `agentstate-guide`. | A special installer, a guessed domain operating model, or an unordered documentation dump. |
| **Launcher/home** | The existing human container for any materialized bundle and its Views/activity. | A second curriculum or a reason to reopen completed launcher work. |
| **Quickstart proof** | The literal installed-package install → orientation → fresh `work-tracking` bundle → useful/visible state acceptance journey. | Release staging, guide content, or another UI. |
| **Journey model** | Desired experience, lane, evidence, readiness, and gaps across the whole lifecycle. | An implementation backlog or runtime surface. |
| **Notice/acknowledgement** | Future per-person, expiring interaction state requiring stable identity. | A v1 guide dependency. |

# Surface and ownership allocation

| Component | Current state | Disposition and owner |
| --- | --- | --- |
| README, no-bundle home, Agent Skill | Live but do not name the guide; README skips recipe discovery. | The approved guide task owns the minimal static guide-entry copy and exact command. Quickstart continues to own the general installed-package journey. |
| [Bundle-free recipe discovery](../tasks/product-recipe-discovery.md) | Done in PR #201 / merge `138a3c7`; openai/codex. | Keep done. A built-in guide appears generically in inventory. Do not change per-row command semantics in this slice. |
| [Create-only init safety](../tasks/init-target-safety-guard.md) | Missing; newly scoped P1, Brian/Claude side. | Build one backward-compatible generic `--create-only` mode before the guide's creation command or revised quickstart is treated as safe. |
| [Guidance task](../tasks/guidance-bundle-onboarding.md) | Todo P2; assignee brian-claude. | Own ordered curriculum, read-only View, build-time Recipe embedding, static front-door copy, and the learn-to-real-bundle proof. Built-in registration is permitted after the prototype, safety, user-validation, review, and package gates pass. |
| [Launcher first-run](../tasks/launcher-first-run-onboarding.md) | Done in PRs #135/#137/#151. | Reuse as the container. The separate guide is justified because the launcher explains the current bundle at a glance; it does not provide an ordered, reopenable learn-by-doing path or graduation to another workspace. Do not reopen it. |
| [npm quickstart](../tasks/npm-quickstart-onboarding.md) | Todo P1; openai/codex. | Remains independent of guide content. After the guard ships, use create-only for its fresh `work-tracking` target and consume the existing discovery/front door. |
| [MCP install verb](../tasks/mcp-install-verb.md) | Todo P1; openai/codex. | Adjacent host-connection lane, not a guide-v1 predecessor. MCP remains “where configured”; terminal/local web is sufficient for guide validation. |
| Return/rediscovery | Existing hook, catalog, session-start, and [catalog dogfood](../tasks/workspace-catalog-dogfood-checkpoint.md); Journey readiness remains rough. | Adjacent recurring-use work. The guide teaches how to reopen its fixed location; broader cross-host rediscovery stays in its existing lane. |
| [Capability-awareness hints](../tasks/capability-awareness-hints.md) | Todo P3. | Separate general capability-hint system. Guide discovery is narrower and stateless: recommend only when the user self-identifies as new or asks how to begin. |
| [Missing-kind recovery hint](../tasks/new-kind-missing-convention-hint.md) | Todo P3. | Separate error-recovery affordance, not guide discovery. |
| [Product Manager Recipe](../tasks/persona-recipe-product-manager.md) / [Personal Task System Recipe](../tasks/recipe-personal-task-system.md) | Deferred/todo or blocked. | Remain deferred domain operating models. The guide may establish packaging precedent for a built-in with References+View, but does not take or unblock their product slot. |
| [New-user Journey](../journeys/new-user-to-recurring-value.md) | Active; openai/codex. | Keep as the whole-lifecycle frame. Exact proposed record clarifications are gated in the review request. |

# Supported entry points and user sequence

The product has three entry conditions, not one:

1. **Empty terminal:** bare `aslite` provides no-bundle orientation.
2. **Agent-mediated:** the installed Agent Skill sees the user self-identify as new or ask how to start.
3. **Existing project/host:** the user already has a bundle or a connected host and wants a separate learning workspace.

The common sequence is:

1. **Install executable:** install the supported npm package.
2. **Optionally install durable agent integration:** `aslite skill install` and `aslite hook install` make help/orientation available to supported agents and future sessions; neither is required for CLI correctness.
3. **Discover without mutation:** bare `aslite` and `aslite recipes` work offline from an empty directory and create no files. The skill/no-bundle/README front doors name the guide only in the relevant new-user context.
4. **Create explicitly and safely:** use the suggested, overrideable personal location:
   ```sh
   aslite init --create-only --recipe agentstate-guide --dir ~/.agentstate-lite/guide
   ```
   The create-only guard must ship first. Generic recipe inventory may continue to show its ordinary cwd-oriented command; guide-specific safe placement lives in the front-door copy.
5. **Learn in order:** open the guide with the ordinary local launcher. Numbered References, explicit next-links, and a home View form a sequence without storing completion state.
6. **Perform one real action:** run an exact CLI command such as `aslite new "Context Note" first-step --title "My first note" --actor <name>`; the `bundle-read` View live-refreshes and shows the attributed record. The View does not write.
7. **Graduate rather than convert:** create a separate real workspace in the intended visibility mode and choose an appropriate Recipe. The guide stays reopenable at its known location.
8. **Reach recurring value:** create useful content, return through session/catalog orientation, and take host-connection/update/sharing lanes as later parts of the Journey.

Claude Desktop and ChatGPT setup are parallel host lanes. They do not block the terminal/local-web guide proof.

# Guidance Recipe v1 contract

## Lifecycle and proactive discovery

- V1 is an ordered persistent reference, not a completion-tracking wizard.
- The Agent Skill must name `agentstate-guide`, print the exact create-only command, and recommend it when a user says they are new or asks how to start.
- The approved no-bundle `getting_started` copy and README follow-up must name the same safe path.
- Recommendation is **stateless and zero-nag**. With no repeated prompt there is nothing to suppress, so no acknowledgement marker is needed. Any future repeated/proactive prompt must remain stateless or it reacquires the stable-identity prerequisite from [the notice design](../designs/user-notices.md).
- The guide remains available on demand and documents the exact reopen command/location.

## Curriculum

- Author numbered static References with explicit previous/next/graduation links plus one `bundle-read` orientation View.
- Begin with no user-instance data. The learner's exact CLI write creates the first instance; the View only observes it.
- Teach bundle location/ownership, docs, links, Kinds, Recipes, Views, status, attribution, local-first visibility, and optional sync.
- Treat curriculum order as a revisable hypothesis. Run at least one fresh-user/fresh-agent walkthrough before declaring v1 done and revise the sequence from observed friction.
- Keep `examples/sample-bundle` separate as the interop/round-trip fixture. [The core scope arbiter](../docs/core.md) governs product scope; it is not the sample-bundle target.

## Built-in packaging

The guide is the first named built-in expected to carry References and a registered View. Its packaging is a real sub-deliverable:

- Author the Recipe manifest, References, View registry doc, and HTML as ordinary source files under one guide recipe source directory.
- Extend the existing `prepareCliBundleInputs` build-time preparation path to generate a TypeScript `RecipeFile[]` module from those exact bytes.
- Import that generated module from the built-in Recipe source and feed it through the same `parseRecipeFiles` authority as every Recipe.
- Do not read package-relative files at runtime and do not hand-maintain large HTML/Markdown string literals.
- Add first-built-in-with-References+View inventory/apply/idempotence tests and a generator drift/provenance check.
- Use the existing local-dev installed-tarball gate for PR validation. A real supported npm release journey supplies later distribution evidence; guide development does not depend on P5A or live publication.

# Implementation and decision sequence

1. **Decision complete:** Brian approved the guide-deferral distinction and the review-revised technical boundaries.
2. **Prototype:** author the ordered curriculum, read-only View, exact CLI first action, and build-time embedding generator. Test with a folder Recipe or local build.
3. **Target-safety unit:** build and independently review/QA generic `init --create-only`. This is a destructive/create-path boundary.
4. **Guide unit:** after the guard, register the guide built-in, land the static front-door copy, run source/package gates, and complete a fresh-user walkthrough before declaring v1 done.
5. **Quickstart unit:** after its existing I1+C2S prerequisites plus create-only, prove the installed `work-tracking` fast path. It may assert that the guide appears, but does not test guide curriculum.
6. **Evidence updates:** update Journey records only after implementation evidence exists.

# De-duplicated task disposition

| Record | Disposition |
| --- | --- |
| [product-recipe-discovery](../tasks/product-recipe-discovery.md) | Keep done; generic inventory primitive. Approve only the narrow no-bundle home copy follow-up under the guide task. |
| [launcher-first-run-onboarding](../tasks/launcher-first-run-onboarding.md) | Keep done; reuse as container. |
| [init-target-safety-guard](../tasks/init-target-safety-guard.md) | New P1 predecessor; generic shared safety mechanic with its own review/QA gate. |
| [guidance-bundle-onboarding](../tasks/guidance-bundle-onboarding.md) | Keep todo P2; revise acceptance, not scope again. Own guide content, embedding, front doors, and guide proof. |
| [npm-quickstart-onboarding](../tasks/npm-quickstart-onboarding.md) | Keep separate todo P1; approved clarification links create-only while preserving its distinct oracle. |
| [mcp-install-verb](../tasks/mcp-install-verb.md) | Keep separate adjacent P1 host-lane work. |
| [capability-awareness-hints](../tasks/capability-awareness-hints.md) | Keep separate P3; broader than stateless guide discovery. |
| [new-kind-missing-convention-hint](../tasks/new-kind-missing-convention-hint.md) | Keep separate P3 recovery work. |
| [persona-recipe-product-manager](../tasks/persona-recipe-product-manager.md) | Keep deferred/todo P3; guide is curriculum, not a domain operating model. |
| [recipe-personal-task-system](../tasks/recipe-personal-task-system.md) | Keep blocked under the test-user decision. |
| [Journey and stages](../journeys/new-user-to-recurring-value.md) | Keep active as the cross-lane evidence model; no task conversion. |
| [onboarding-surface-scoping](../tasks/onboarding-surface-scoping.md) | Close after this revision, task revisions, validation, and sync. |

# Decision and authorized record changes

Brian assumed decision authority while Michael is unavailable. The [approved request](../review-requests/onboarding-surfaces-mike-signoff.md) records the reviewed technical disposition; the [Decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md) records the human product call.

Authorized record changes are: link quickstart to the generic create-only predecessor; clarify the named Journey/Journey Stage entry, guide, and operating-model evidence; and add the typed npm/product-recipe Roadmap Item containment edges. Product recipe discovery stays done and its generic row-command behavior stays unchanged.

# Acceptance matrix

| Boundary | Required proof | Owner |
| --- | --- | --- |
| Existing discovery | Empty directory: bare `aslite` and `recipes` exit 0, create no files, and inventory remains generic. | Shipped primitive regression. |
| Create-only safety | Fresh target succeeds; existing/bound/enclosing/ambiguous/concurrent targets fail before writes; ordinary `init` and `recipe add` retain their contracts. | init target-safety task. |
| Stateless guide discovery | README, no-bundle home, and generated skill agree on name, exact create-only/default-path command, when to recommend, and zero-nag behavior. | guide task. |
| Ordered learning | Fresh user follows numbered curriculum, performs CLI `new`, sees it live in the read-only View, and creates a separate real bundle. | guide task. |
| Built-in packaging | Source assets generate one embedded `RecipeFile[]`; inventory lists References+View; installed local-dev tarball applies/idempotently re-applies without runtime source files. | guide task. |
| Minimal productivity | Installed artifact: install → orient/discover → create-only `work-tracking` init → attributed Task → visible state. | npm quickstart. |
| Journey fidelity | Named Journey Stage records cite evidence and do not claim readiness before proof. Stage 06's deferred operating-model gap is not assigned to the guide. | Journey record owner; scoped clarification authorized now. |
| Collision avoidance | No P5A, release automation, update selection, marketplace retirement, MCP installation, View-create action, notice identity, or deferred domain-recipe build. | All units. |

# Evidence

This revision incorporates the [intent review](../context-notes/review-onboarding-intent.md), [coherence review](../context-notes/review-onboarding-coherence.md), [skeptic review](../context-notes/review-onboarding-skeptic.md), and their [synthesis](../context-notes/review-onboarding-synthesis.md), plus the original [recipe-to-guide handoff](../context-notes/recipe-discovery-guidance-bundle.md), [recipe deferral](../decisions/defer-builtin-recipes.md), [recipe roadmap](../roadmap-items/recipe-plugins.md), [npm distribution roadmap](../roadmap-items/distribution-neutral-resources.md), and [orientation record](../context-notes/onboarding-surfaces-orientation-2026-08-03.md).

# Non-goals

- No product implementation in this scoping revision.
- No special guide installer/command, silent postinstall, recipe-specific target branch, second Recipe parser, or runtime asset lookup.
- No View-mediated document creation or `bundle-propose` action.
- No acknowledgement, passive seen tracking, identity work, or repeated prompt.
- No P5A, staged release, update, marketplace, deployment, MCP-install, or deferred domain-operating-model work.
- No conversion of the learning workspace into the user's real project.
