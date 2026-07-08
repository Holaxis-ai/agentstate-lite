---
type: Task
title: 'U6 skill + docs truth pass: flow ends with sync, setup verb, plugin bump'
status: todo
priority: '2'
description: >-
  U6. Skill and docs truth pass: typical flow ends with sync, sync as setup
  verb, hook-install re-run prompt, plugin version bump in both manifests. Deps:
  sync-conflict-resolution, sync-sessionstart.
actor: brian-claude
timestamp: '2026-07-08T17:15:36.975Z'
---
# U6 — skill + docs truth pass

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U6. String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) (P7 one-sentence; P11
teaching).

## Definition of done

`gen-skill.mjs` / SKILL generation:
- typical flow ENDS with `sync` ("recording work isn't done until it's shared")
- Workspaces section teaches "shared with teammates via aslite sync" and NO branch/worktree
  mechanics
- `sync` is the SETUP verb for existing projects (init = greenfield only)
- `init` run inside a git repo prints an fs-only hint ("if this project shares a board, run
  sync instead" — detected by `.git` up-tree, NO git binary invoked)
- the ONE "you may notice a `board` branch" aside
- founder one-sentence: "`aslite sync` shares your board — commits your changes, pulls your
  teammate's, pushes yours, touching nothing but the board."
- PROMPT founders to re-run `hook install` (adjudication E)

Plugin version bump in BOTH manifests — CHECK main's current version FIRST (marketplace.json
was 1.0.11 at planning time; verify the plugin.json manifest too and bump both together).
README quickstart re-read against new behavior.

USER-FACING LANGUAGE RULE throughout: no "worktree"/"linked"/"subtree".

## Acceptance criteria

- SKILL drift gates green after regeneration
- typical flow ends with sync; setup-verb + init-hint text present; single board aside;
  founder one-sentence present; hook-install re-run prompt present
- both plugin manifests bumped in lockstep off main's actual current version
- no forbidden mechanics vocabulary in any user-facing string

## Gates

Builder → independent Reviewer → QA. Deps: sync-conflict-resolution (U3b),
sync-sessionstart (U4) — U6 teaches the FULL user-facing surface.

[depends on](sync-conflict-resolution.md)

[depends on](sync-sessionstart.md)

## Inherited from the actor-attribution review (2026-07-08, issue 4)

Attribution is now POSSIBLE (--actor persists to frontmatter) but adoption is unforced —
the skill's own guidance never tells agents to pass --actor, so "unknown" stays the
common case in practice (the unit's own closing board record initially shipped without
it — proof). This unit's skill pass should teach --actor in the typical flow and the
Workspaces section ("write docs with --actor <your-name> so teammates' awareness renders
attribute you"), keeping the pinned no-default semantics.

## Inherited: security-disclosure policy line (2026-07-08, Brian-approved)

The docs pass adds a short standing convention to the repo CLAUDE.md (and a one-line
echo in the board's conventions if natural):

> **Security disclosure:** a defect that is (a) exploitable by someone other than the
> victim AND (b) present on main goes through a private GitHub Security Advisory —
> fix privately, merge, then disclose — never a public PR comment or board doc.
> Because the marketplace channel tracks this repo, "released" means "merged to main".
> Pre-merge review findings stay public by default. The board is public: the
> write-time scrub discipline covers vulnerability details, not just secrets.

Context: PR #13/U3b review discussions published defect details safely (all found and
fixed pre-merge; none exploitable) — this line pins WHERE the boundary sits before the
first post-merge exploitable case forces the question.
## Inherited: review-process conventions for CLAUDE.md (2026-07-08, Brian-approved after proportionality review)

The docs pass folds these into the EXISTING CLAUDE.md sections — no new doc, no new
artifact (a standalone playbook was proposed and rejected as recency-weighted overhead):

Into the review-gate paragraph (the "agents review each others' code" rule), four lines:
> - Agents that touch git or run tests work in an ISOLATED worktree/checkout, never the
>   shared working tree; reviewers detach onto the exact sha under review.
> - A risky mechanic and the test that makes it safe ship in the SAME reviewed unit —
>   a gate must own the risk it guards.
> - A review claiming it "executed" a documented command chain means character-for-
>   character with the emitted artifacts — no reasonable substitutions; pin such chains
>   with tests that literally run the emitted strings.
> - Reviewers verify empirically where feasible (built artifact, scratch environments),
>   label each finding empirical vs reasoned, and report survived attacks alongside
>   findings so an APPROVE is calibrated.

Into "Working here", one mechanical line (next to the build-from-repo-root warning):
> - A fresh git worktree has no node_modules: run `npm ci` inside it before trusting any
>   test or drift-gate result (up-tree module resolution manufactures phantom failures).

Into the plugin-version-discipline bullet, one sentence appended:
> Parallel unit branches will collide on the next version by design; whichever merges
> second gets re-bumped and rebased over the other's regenerated bundle before merge.

NOT included, deliberately: claim-before-work (already documented where the records
conventions live — verify it is, add there if not), report-before-idle (orchestrator-
harness-specific), and any cross-team-review-cadence mandate (a founders' policy
question, put to Mike separately — do not canonize unilaterally).
