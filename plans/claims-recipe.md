---
type: Plan
title: Claims recipe — binding design v1 (awaiting human review)
timestamp: '2026-07-06T20:16:18.512Z'
---
# Claims recipe — binding design (v1)

**Status: DESIGN, awaiting human review — do not build until Mike signs off.** Grounded in
the holaxis-claims skill (v1.0.0, read 2026-07-06): event-sourced JSONL claims with
CREATE/UPDATE/DEPRECATE actions, per-section files, `--parent-event-id` optimistic locking,
analyst/challenger/reviewer lifecycle, `[LOCKED]` prefix convention, never-delete.

## The mapping (holaxis-claims → lite)

| holaxis-claims | lite mechanism | note |
|---|---|---|
| claim (note) | doc, `type: Claim`, id `claims/<section>/<slug>` | one doc per claim |
| section (per-topic JSONL) | id prefix `claims/<section>/` | `list --prefix claims/validation/` |
| content | `title` — the claim text WITH its specific numbers | listable at a glance |
| reason | required `reason` field | how derived / why changed |
| artifacts | optional `artifacts` field (csv) + LINKS to in-bundle docs/blobs | see "new capability" |
| `[LOCKED]` prefix + active/deprecated | `status` enum: `active\|challenged\|locked\|deprecated` | validated at write — illegal states impossible |
| actor_type/actor_id | engine actor attribution on every write | role read from the transition history |
| event sourcing / replay | `doc history` (enforced backends) + git log (board tier) | see honest gaps |
| `--parent-event-id` lock | `--expected-version` CAS | byte-for-byte the same semantics |
| CREATE / UPDATE / DEPRECATE | `new "Claim"` / `doc update --status` / `--status deprecated` | hard-delete never used |
| `validate` command | `status` kind lint | artifact-existence checks = future |

## The Claim kind (the entire recipe payload)

One convention doc (`conventions/claim.md`): `governs: Claim`, `path: claims/`,
required `title`, `status` (enum above), `reason`; optional `artifacts`,
`evidence_command` (the exact command that produced the number), `evidence_commit`
(the commit it ran against). No freshness horizon in v1 (claims deprecate by event, not
by age). Plus the `type: Recipe` manifest. The recipe is ~2 documents of plain text.

## Lifecycle, ported

File: `new "Claim" <section>/<slug> --title "118 of 443 targets validated (26.6%)"
--status active --reason "…" --evidence_command "…" --evidence_commit <sha>`.
Challenge: `doc update --status challenged --expected-version <head> --actor <who>`.
Lock: reviewer sets `--status locked` the same way. Deprecate-never-delete: `--status
deprecated` + file the successor claim, linked `supersedes`-style. The CAS token IS the
parent-event lock; a racing writer gets the same refusal notes.py gives.

## What the port gains (the success criteria, mapped)

1. **Write-time validation** — enum + required fields enforced by the engine, not by rules prose.
2. **Queryability** — `list --type Claim --field status=locked` replaces jq over JSONL.
3. **Concurrent-agent safety** — engine CAS vs. hand-rolled parent-event checks.
4. **One implementation** — a recipe install replaces per-project `setup_claims.py` scaffolds.
5. **NEW capability the JSONL system cannot have: citation links.** A document that cites
   a claim links to it; backlinks then answer "every doc citing this claim" — so when a
   claim deprecates, the blast radius of stale citations is one `link show` away. This is
   the drift-detection direction holaxis-claims wants but can't express.

## Honest gaps (recorded, not hidden)

- **Filesystem history is head-only** — per-claim event replay comes from git on the board
  tier (native attributed history on enforced backends). Acceptable; note in recipe README.
- **No state-machine enforcement** — kinds validate values, not transitions (locked→active
  is socially forbidden, not mechanically). If dogfooding proves the need, "transition
  rules on enum fields" becomes a pulled kind-capability requirement — do not pre-build.
- **No artifact-existence validation** — a `status`-report extension, future.

## Testbed (decided 2026-07-06 — zero astronomy, by construction)

The repo's own published numbers, which drifted TODAY (719 vs 725 vs 750 test counts in
one afternoon): section `claims/repo-stats/` on the BOARD bundle (private git, never the
public repo) — test-count, engine/cli LOC, embedded-UI bundle size, backend count. The
architecture brief and README cite these; the experiment ends with each cited number
backed by a locked claim carrying the command + commit that produced it. Astronomy
projects install the same recipe into THEIR OWN bundles later; nothing domain-specific
ever enters agentstate-lite's repo or board.

## Recipe folder location

External private folder (e.g. `~/projects/Holaxis/recipes/claims/`) — being external IS
the experiment (first real third-party `RecipeSource` consumer). NOT in the public repo;
publishing it later as the flagship example recipe is a separate human decision.

## Build steps (after sign-off)

1. Author the recipe folder (manifest + claim convention). 2. `recipe add <path>` into the
board bundle. 3. File the five repo-stat claims with real provenance. 4. Run one full
challenge→lock cycle including a deliberate two-actor CAS race. 5. Evaluate against the
five criteria; record the verdict (win or lose) on `tasks/claims-recipe`.
