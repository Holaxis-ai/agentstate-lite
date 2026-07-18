---
type: Roadmap
title: agentstate-lite — Roadmap (near-term spine)
actor: mike/claude
timestamp: '2026-07-18T13:24:44.273Z'
---
# agentstate-lite — Roadmap (near-term spine)

**Interim consolidated roadmap (2026-07-03).** One place for the forward sequence of units,
reconciling `docs/NORTH-STAR.md` §7 (the strategic staging), `STATUS.md` (what is shipped), and the
task backlog. The EVENTUAL form is roadmap-items-as-docs under a `Roadmap` kind (see
[the recipe/cookbook design](designs/recipes.md)); this single doc is the spine until that kind
exists.

# Now — shipped (this session + prior)

- Local **core + CLI + viewer** — the OKF engine, the AXI CLI (publishable `agentstate-lite`), the
  static-HTML viewer.
- **Stage-1 wire protocol + reference server** (`packages/server`, `RemoteBackend`) and the
  **Cloudflare deployment** (Unit 2b: Worker + D1 + R2, `D1R2Backend`, enforced cross-process CAS) —
  deployed to production.
- **Stage-2 auth** — minted API keys + invites + membership (roles/revocation) behind the
  `IdentityVerifier` seam; production-verified.
- **Delete** (`fccb067`) — hard-delete across seam/backends/wire/engine/CLI + auth; CAS-guarded,
  idempotent, reserved-safe.
- **Kind-aware doc surface** (`e0349b9`) — `doc read` shows all frontmatter; `doc update --<field>`
  patches kind fields (status transition), strict-by-default on enums. The unlock that made tasks
  usable via the CLI.
- **AXI experience pass** (`6343408`) — content-first home dashboard, translated parseArgs errors,
  invocation-correct hints.
- **Recipes Unit A — "recipe zero"** (`757536e`) — the Context Note seeding pulled out of core into
  a generic CLI recipe registry (`recipes` / `recipe add` / `init --recipe`); core is now fully
  convention-agnostic. context-notes is the first built-in recipe; the seeded doc stays
  byte-identical.
- **Delete the `note` command** (`b84873e`) — removed `note` + the Context-Note core codec; core is
  now FULLY convention-agnostic (zero "Context Note" reference). context-notes = a zero-privilege
  default recipe, authored via the generic path. Accepted regressions on purpose; typed sections
  deferred-conditional (prove-then-build).
- **Pluggable recipe pattern** (`40feefd`) — a `RecipeSource` seam + ONE pure `parseRecipeFiles`
  pipeline; built-in and external recipes share one path; a recipe is a folder (`type: Recipe`
  manifest + `conventions/*.md`); ZERO core changes. The clean pluggable foundation the human
  required BEFORE adding domain recipes (human-approved design, `plans/pluggable-recipes.md`).
- **Work-tracking recipe** (`83e5d81`) — the FIRST domain recipe, second built-in: the Task
  convention as a tested, versioned artifact, frontmatter pinned to this bundle's hand-authored
  [conventions/task](conventions/task.md) (so it reports `applied:true` here with no
  reconciliation write). Pure convention via the generic path; ergonomics remain queued below.
  (Shipped ~1h after this doc's previous revision; recorded in STATUS item 40 and
  [tasks/recipes](tasks/recipes.md) on 2026-07-04.)
- **Read-path scaling, both halves** (`8cb5954` + `81d8da4`, 2026-07-04, deployed `8e87db9f`) —
  `queryHeads` frontmatter projection consumed end to end (scans carry no bodies over the wire)
  and the D1 `frontmatter` head column (Worker scans stop touching R2; legacy rows self-heal on
  write — observed on this bundle's data).
- **Roadmap recipe** (`4167b40`, 2026-07-08) — the THIRD built-in (`recipe add roadmap`):
  this board's Roadmap + Roadmap Item conventions extracted as work-tracking's companion
  (typed `contains` vocabulary roadmap → item → task, item status enum queued/active/done).
  The Task-side `expects_inbound` pairing travels as a documented one-step opt-in
  (pull → edit → promote), pinned by a test that executes the documented chain literally —
  the recipe pipeline has no versioned re-application and `kind field` edits fields only.
  Record: [tasks/roadmap-recipe](tasks/roadmap-recipe.md).

# Next — queued (sequenced)

1. **The UI/sharing spine (2026-07-06 direction pivot — Cloudflare Access RETIRED, STATUS item
   44 / `c67190f`, prod cleaned `e846ad63`).** Two-tier shape: the OSS tier is the local-first
   substrate + multi-agent (served loopback head) + **git-based sharing**; the hosted tier is
   the LIVE substrate (board, live CAS, granular access, artifact serving) as one operated
   deployment — the board is the tier boundary. Sequenced:
   [tasks/positioning](tasks/positioning.md) (the decision record + `plans/ui-v1.md` rev 3),
   [tasks/ui-v1](tasks/ui-v1.md) (LOCAL `agentstate-lite ui` first — no auth on its critical
   path; GitHub device-flow hosted login is the follow-on),
   [tasks/git-sharing](tasks/git-sharing.md) (the OSS multi-human floor),
   [tasks/skill-distribution](tasks/skill-distribution.md) (internal Holaxis marketplace +
   worker deploy kit; the PUBLIC distribution channel is a recorded open question, later).
2. **Generic kind capabilities** ([tasks/task-ergonomics](tasks/task-ergonomics.md)) — REFRAMED:
   these are GENERIC (kind-aware default columns, field-filter, CAS-`claim`, link-conditioned
   `runnable`/`blocked` queries), NOT task features. A bespoke `task` verb is an ANTI-GOAL (the trap
   the deleted `note` command was). The recipe LEANS ON these; they benefit every kind and get built
   as dogfooding proves the need. (Plus a LOW follow-up: a kind-field arity guard across `new` +
   `doc update`.)
3. **Work-management cookbook** — compose tasks + roadmap + the roadmap<->task link convention + the
   task-rollup query: the first real cookbook. (`task-system-skill` subsumed: a skill delivers +
   teaches a recipe.) The plugin/marketplace distribution channel is a reserved THIRD `RecipeSource`,
   built when needed.

# Later — distribution + the standard

- Package work-tracking as the first **recipe-plugin** (marketplace channel), preserving the
  guardrail that a recipe is never defined SOLELY as a plugin.
- Formalize the **OKF recipe/cookbook profile** as a documented spec (lite = the reference
  implementation; portable to any OKF tool). Two composition levels only — conventions -> recipes ->
  cookbooks — no further regress.
- Deferred product surfaces from the North Star: an admin/collaboration UI; remote-agent
  orchestration; the flagship document-centric remote backend.
- **Typed sections (CONDITIONAL — prove the need first).** Grow kind conventions from
  fields + flat headings to fields + TYPED sections (prose / list / links) with generic
  authoring/merge — the capability that would let a plain convention deliver `note`-quality UX with
  zero bespoke code. DEFERRED and gated: build ONLY if authoring context-notes via the generic path
  (after `note` is deleted) proves genuinely painful. It is the replacement for the deleted `note`
  ergonomics, but we ship the deletion first and let dogfooding generate the requirement.

# North Star

A multi-human, multi-agent **collaboration substrate** (`docs/NORTH-STAR.md`): a shared remote
backend (shipped as the CF deployment), auth + an admin/collaboration UI (auth shipped; admin UI
deferred), and remote-agent orchestration — everything riding the pluggable `StorageBackend` seam.
Recipes/cookbooks are the OKF-native extension + packaging layer. **2026-07-06 refinement:** the
substrate ships as TWO tiers — OSS (local-first, multi-agent, git-shared; identity outsourced to
the repo host) and HOSTED (the live board, per-doc access, artifact serving; one operated
deployment, where auth is the industry's already-solved single-deployment case). "Frictionless
self-hosted multi-human" is explicitly a non-goal — self-hosting stays possible, honestly labeled
bring-your-own-ops. Decision record: [tasks/positioning](tasks/positioning.md).

# Pointers

- `docs/NORTH-STAR.md` — the strategic staging (in-repo, not a bundle doc).
- `STATUS.md` — honest wired/partial/deferred state + changelog (in-repo).
- [the recipe/cookbook design](designs/recipes.md) — recipe = kind-composition (an OKF profile);
  cookbook = composed recipes; recipe zero; Unit A/B.
- [tasks/recipes](tasks/recipes.md), [tasks/task-ergonomics](tasks/task-ergonomics.md) — the live
  backlog.

# Roadmap items — the living decomposition

The roadmap-items-as-docs form this doc anticipated now exists (work-tracking's `Roadmap Item`
kind). Each item below CONTAINS its tasks via typed `contains` links; this spine contains the
items the same way, so the whole chain (roadmap → item → task) is one filtered query per hop
(`link show <id> --text contains`).

- [contains](roadmap-items/local-first-loop.md) — the local-first daily loop
- [contains](roadmap-items/claims-provenance.md) — claims/provenance as the capability channel
- [contains](roadmap-items/typed-relationships.md) — typed relationships (reading shipped; validation gated)
- [contains](roadmap-items/ui-rethink.md) — the human window rethink

[contains](roadmap-items/real-time-event-backbone.md)

[contains](link-model-body-safe.md)

[contains](roadmap-items/recipe-plugins.md)

[contains](roadmap-items/self-describing-domain-models.md)

[contains](roadmap-items/radical-simplification.md)

[contains](roadmap-items/personal-bundle-catalog.md)

[contains](roadmap-items/distribution-neutral-resources.md)

[contains](roadmap-items/board-git-package.md)

[contains](roadmap-items/safe-human-interactive-pages.md)

[contains](roadmap-items/change-surface-simplification.md)
