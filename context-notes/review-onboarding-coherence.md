---
type: Context Note
title: 'Coherence review: plans/onboarding-surfaces'
actor: claude-ob-coherence-reviewer
timestamp: '2026-08-03T23:21:19.550Z'
---
# Summary

Coherence/architecture review of `plans/onboarding-surfaces` (2026-08-03, reviewer
`claude-ob-coherence-reviewer`). Read-only: no git, code, or doc changed except this note.

**Verdict: pass-with-caveats.** The plan's central claim is right — there is one journey, not four
onboarding products, and the five components have genuinely distinct jobs with no double-counting.
The "already shipped" claims are true; I confirmed them live. Two HIGH findings are places where the
plan asserts behavior the shipped code does not have, and both would be discovered mid-build:
discovery emits a cwd-initializing command, and `init` does not fail closed on an existing
workspace. One MEDIUM finding is a v1 contradiction (a read-only View cannot create the first
instance). The surface table also omits live onboarding surfaces that have their own open tasks.

# What I confirmed empirically

Probes ran against the repo build at clean HEAD `5ee3829` (`packages/cli/dist/agentstate-lite.mjs`,
`channel: npm-package`), in an isolated scratch directory with no ancestor bundle. Note the
globally installed `aslite` on PATH is built from `b14a4a5`, which PREDATES PR #201 — anyone
re-probing must use the repo dist or reinstall, or they will refute a claim that is actually true.

- **PR #201 / merge `138a3c7`** — confirmed in `git log`: `138a3c7 Make product recipes discoverable
  before init (#201)`, authored by mikec-ai, 2026-08-03.
- **Bare `aslite` in an empty directory** — exit 0; `getting_started` points at
  `... recipes` (to compare available workspace setups) and `init --recipe none`; **no files
  created** (directory still empty after the run). Confirmed.
- **`aslite recipes` in that empty directory** — exit 0, `count: 3`
  (`context-notes`, `work-tracking`, `roadmap`), each with `applied: null` (bundle-free),
  `summary`, `assets`, and both commands; **no files created**; no network reached. Confirmed.
- **The empty directory stays bundle-free** across both probes. Confirmed.
- **Recipe machinery carries References + a registered View today** —
  `init --dir <fresh path> --recipe packages/cli/references/recipes/review-workflow` succeeded and
  materialized `index.md`, `conventions/{view,review-request}.md`,
  `references/view-authoring-v0.md`, `views-registry/review-workflow-reviews.md`, and the blob
  `views/review-workflow/reviews.html`. The invoking cwd was left untouched. Confirmed.
- **Coordination boundary** — board commit `4540425` touched exactly two Task records:
  `tasks/guidance-bundle-onboarding` (Brian-owned) and `tasks/onboarding-surface-scoping` (the
  scoping session's own task), plus three new docs. `tasks/product-recipe-discovery`,
  `tasks/npm-quickstart-onboarding`, and `journeys/new-user-to-recurring-value` retain
  `actor: openai/codex` and their pre-scoping timestamps — **unmodified**. Confirmed.

## Claims I did NOT re-execute

- **Launcher/home done in #135/#137/#151.** Accepted from `tasks/launcher-first-run-onboarding`'s
  record (status `done`, with PR numbers, merge SHAs, review records, and the residuals it left
  open). I did not boot `aslite ui` or re-verify the first-run orientation surface.
- **Offline capability** was probed only as "no remote flag, no network dependency observed" — not
  under a genuinely severed network.

# Issues

## H1 (HIGH, empirical) — shipped discovery emits a cwd init command, contradicting the plan

`packages/cli/src/commands/recipes.ts:65-85`: `commandTargetSuffix` appends `--dir` **only when the
caller already passed `--dir`/`--remote`**. In the exact onboarding moment — empty directory, no
flags — the emitted command is `<bin> init --recipe <name>`, which initializes the **cwd**. Verified
live in the probe output above.

The plan's journey step 4 and the guidance task's decided boundary both require the emitted command
to be `aslite init --recipe agentstate-guide --dir <chosen-learning-workspace>` and state "never
infer the cwd as a product choice." As written, adding `agentstate-guide` as an ordinary built-in
produces the opposite of the plan's requirement.

**Fix:** decide ownership now, in the same review request Mike is signing. Either (a) the guidance
unit is permitted to change `recipeInventoryRow` so destination-requiring recipes emit a
destination-bearing command — which crosses into the shipped primitive the plan says the guidance
task must only *consume*; or (b) drop the "emitted command" wording from the plan and state that the
guide's destination guidance lives in its `summary` copy alone. Leaving it implicit guarantees the
builder trips the boundary.

## H2 (HIGH, empirical) — "never mutates an existing workspace" is not current `init` behavior

Two probes, both exit 0, both silent:

- `init --recipe context-notes` run **inside an existing bundle's subdirectory** created a nested
  second bundle (new `index.md` + `conventions/`). Nothing detected the enclosing bundle.
- `init --dir <an existing bundle> --recipe context-notes` **additively applied** a second recipe
  into that bundle (its `conventions/` went from `{view, review-request}` to
  `{context-note, review-request, view}`).

Guidance acceptance criterion 3 ("never creates, replaces, or mutates an existing project workspace
or binding target") and the plan's acceptance matrix row ("existing project/binding targets fail
closed") therefore require a **behavior change to shared `init`/collision-probe machinery**. That
contradicts the plan's "no new machinery" framing and reaches outside the guidance unit's stated
content boundary. The guidance task hints at this only obliquely, under content-design questions
("the collision probes needed to make the explicit path honest") — which understates it as copy work
rather than a create-path safety change.

**Fix:** name it explicitly — either as a declared sub-deliverable of the guidance unit (and then it
carries the higher review/QA tier that a destructive-write/create-path guard deserves), or as its
own task marked a predecessor. Do not let it ride in as guide "content."

## M1 (MEDIUM, empirical) — a read-only View cannot create the first instance

`packages/view-runtime/src/action-bridge.ts:7,61,73` and `packages/view-runtime/src/index.ts:602+`:
the only action kind in the whole authority is **`document.set-field`** — one scalar field on an
**existing** document with a governing Kind, gated on `access: bundle-propose`, human confirmation,
and hard CAS. There is no create action anywhere in the bridge.

The plan is internally contradictory here. "Ship static Reference docs plus one registered,
**bundle-read** orientation View. Begin with **no user-instance data**; the learner's first safe
action **creates the first instance**." A data-free bundle has nothing to `set-field` on, and a
`bundle-read` View cannot write at all. Journey step 5's phrasing ("open the guide through the ...
View path ... and perform one safe attributed action") reads as an in-View action to anyone who
hasn't read the runtime.

**Fix:** state plainly that v1's safe action is a **CLI** write (`aslite new "Context Note" … --actor
<name>`) *observed live* in the read-only View, and put `bundle-propose` / `document.set-field`
explicitly out of v1 scope. That is a coherent and attractive v1 — the live-refresh View watching a
CLI write land is a good teaching moment — but it must be said, not inferred.

## M2 (MEDIUM, empirical) — the surface table omits live onboarding surfaces with open tasks

No double-counting: the five rows have distinct jobs and the table correctly states the containment
relations (guide View runs in the launcher; quickstart consumes discovery; the Journey is a map, not
a runtime). Completeness is the problem. Missing from the table, each with a live record:

- **Host connection (Claude Desktop / ChatGPT via MCP).** Journey stages
  `02-connect-claude-desktop` (`rough`, core) and `03-connect-chatgpt-app`; open task
  `tasks/mcp-install-verb` ("the one surface built for host wiring makes users hand-author JSON").
  The Journey names "Primary human surface: MCP Apps," and guidance acceptance criterion 4 depends
  on it ("opens through ordinary local web **and, where configured, MCP View surfaces**") — while
  CLAUDE.md gate 4 calls `aslite mcp` experimental and "not yet a supported product surface." The
  plan handles all of this in one prose sentence ("parallel host lanes") with no owner row.
- **Return / rediscovery.** The `session-start` hook + `catalog` — named in the plan's own journey
  step 7 and Journey stage `12-return-and-rediscover` (`rough`), with no row.
- **README / npm front door.** Verified: `README.md:35-45`'s Quickstart never mentions
  `aslite recipes`; it jumps straight to `init --dir .agentstate-lite` + `recipe add`. The most-read
  onboarding surface contradicts journey steps 2-3 and belongs to nobody in this plan.
- **The Agent Skill.** Discussed in prose (the "may mention / must not nag" bullet) but has no row,
  despite being the agent-side discovery surface for a product whose primary consumer is an agent.
- **De-duplication miss:** `tasks/persona-recipe-product-manager` (todo) is `agentstate-guide`'s
  closest sibling — a data-free built-in recipe *with Views*, competing for the same `recipes`
  inventory and the same "which built-ins ship" decision — and is absent from the de-duplication
  table that claims to resolve the overlap. `tasks/capability-awareness-hints` and
  `tasks/new-kind-missing-convention-hint` are adjacent discovery-surface todos, also unmentioned.

**Fix:** add a host-connection row and a return-orientation row (owner: openai/codex Journey lanes),
add a README/front-door line to whichever unit ships first, and add
`tasks/persona-recipe-product-manager` to the de-duplication table with an explicit disposition.

## M3 (MEDIUM, reasoned) — the plan relocates the "lightweight tutorial" without saying so

`decisions/defer-builtin-recipes` "What changes now" assigned the tutorial scope to
`tasks/launcher-first-run-onboarding`: "the 'lightweight tutorial' is this task's scope." That task
shipped. The plan now marks the launcher **Done — do not reopen** and hands the tutorial job to a
new built-in recipe.

The plan's consistency claim is **correct on the letter**: the deferral is about guessed *domain
operating models*, and a guide over already-shipped primitives is not the Personal Task System. But
the deferral's deeper rationale — "the productized shape should be LEARNED, not guessed; get a few
test users" — applies to a curriculum too, and the plan does not engage with it. No evidence is
offered that the shipped launcher orientation (which PR #151 specifically rewrote for a first-time
reader) fails to cover the v1 curriculum outcome, and no test-user evidence supports the curriculum
choice.

**Fix:** one paragraph in the plan: why the shipped launcher orientation does not cover the v1
curriculum outcome, and either the evidence behind the curriculum choice or an explicit statement
that the curriculum is the guide unit's first artifact to be validated against a real test user.

## L1 (LOW, empirical) — mislabeled link

Plan line 75: "Keep [the interop sample bundle](../docs/core.md) conceptually separate." The link
text names `examples/sample-bundle`; the target is `docs/core`, the scope arbiter. Repoint or
reword.

## L2 (LOW, empirical) — the scoping task's own disposition is self-inconsistent

The de-duplication table says `tasks/onboarding-surface-scoping` should be "Complete after this plan
and review request are linked." It was set `done` at `22:36:59`, before `plans/onboarding-surfaces`
(`22:37:59`) and `review-requests/onboarding-surfaces-mike-signoff` (`22:37:59`) existed. Harmless in
effect; the record asserts a precondition it did not follow.

## L3 (LOW, empirical) — the built-in-with-a-View path is real but unexercised

All three built-ins are conventions-only (`packages/cli/src/recipe-source-builtin.ts`), and
`packages/cli/test/recipes.test.ts` covers built-ins only for conventions. The mechanism is genuinely
shared — built-ins are just `RecipeFile[]` fed through the same `parseRecipeFiles` as a folder recipe
— and the filesystem `review-workflow` recipe proves References + View end to end, so the plan's "no
new machinery" holds *for this part*. Two implementation notes worth stating up front rather than
discovering at build time: the guide will be the **first** built-in carrying `pages`/`references`
(it should bring that first coverage test), and its HTML must be inlined as a source string constant
because the dist is a single esbuild bundle with no runtime access to `references/`. Scale is a
non-issue — review-workflow's View is 3.8KB of HTML plus a 17.8KB reference.

## L4 (LOW, empirical) — `actor` overwritten on the Brian-owned task

`tasks/guidance-bundle-onboarding`'s `actor` went from `brian-claude` to `codex-onboarding-scope` in
the re-scope. `assignee: brian-claude` still carries ownership so the boundary holds, but the plan
calls it "Brian-owned" while `list --field actor=brian-claude` no longer finds it. This is the known
last-writer `actor` semantics already recorded in the PR #151 residuals, not a new defect.

# Answers to the five review questions

1. **Shipped claims:** confirmed. Bare `aslite` points at `recipes`, `recipes` lists the three
   built-ins bundle-free, and the empty directory stays empty. PR #201 / `138a3c7` verified in git.
   The launcher claim is record-confirmed, not re-executed.
2. **Surface allocation:** correct on jobs and shipped/remaining split, no double-counting, but
   **incomplete** — see M2 (host connection, return orientation, README front door, Agent Skill, and
   the `persona-recipe-product-manager` de-duplication miss).
3. **Buildable on existing machinery:** yes for the core claim (definitions-only recipe with
   References + a registered bundle-read View, applied at an explicit `--dir`) — empirically proven.
   **No** for two sub-claims the plan folds in: fail-closed collision behavior (H2) and an in-View
   create action (M1). Hidden dependencies: the guide View needs the `ui` launcher (shipped, fine);
   acceptance criterion 4's MCP half depends on an explicitly experimental, unsupported host; and
   every data-bearing View requires exact-byte trust approval in the trusted shell before bundle data
   flows — an onboarding friction step the plan never mentions.
4. **Architectural consistency:** yes. No second parser, recipe engine, renderer, or mutation policy
   is introduced; the guide is content through the existing pipeline, which is exactly the "one
   owning primitive" discipline. Consistent with `decisions/defer-builtin-recipes` on the letter; see
   M3 on the spirit.
5. **Coordination boundary:** correct, empirically. Board commit `4540425` modified only the
   Brian-owned guidance task and the scoping session's own task; the three openai/codex-owned records
   are untouched.

# Bottom line

Approve the plan's structure and its two-task boundary. Before the guidance unit starts building,
resolve H1 and H2 — both are places where the plan describes behavior the code does not have, and
both cross the coordination boundary the plan itself draws, so they belong in Mike's sign-off rather
than in a builder's discretion. M1 is a one-sentence clarification that prevents a wasted build
iteration. M2 and M3 are plan-completeness edits, not blockers.

[reviews](../plans/onboarding-surfaces.md)
