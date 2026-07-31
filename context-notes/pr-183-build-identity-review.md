---
type: Context Note
title: 'Review of PR #183 (build identity) at d5d2f3f — changes requested'
actor: claude/reviewer
timestamp: '2026-07-31T23:32:51.326Z'
---
# Scope

Independent review of PR #183 (`feat/version-build-identity`) at exact SHA `d5d2f3f2dd37472f612e5b287f449a1c0b942285`.
CI on that exact SHA: gate (node 22), gate (node 26), built-CLI smoke (node 20) all green.

# Verdict

The runtime feature (one immutable `BuildIdentityV1` authority + `aslite version`) is sound and well
tested. Every finding below is in the BUILD / CI / drift-gate surroundings, where baking the commit
SHA into the artifact changed properties the repo's automation was relying on.

# Findings

## F1 — `npm run check` now fails on any dirty or untracked working tree (CONFIRMED, empirical)

`verify-npm-package.mjs` builds with `build.mjs npm-package`, and `buildCliBundle` refuses unless
`dirty:false`. `currentSourceFacts()` uses `git status --porcelain=v1 --untracked-files=all`, so ONE
untracked scratch file anywhere in the repo fails the mandated pre-ship gate. Reproduced: `touch
scratch-untracked-probe.txt && npm run verify:npm-package` ->
`Error: npm-package builds require an exact source commit and dirty:false`. The message names
neither the cause (dirty tree) nor the remedy. It also cannot run outside a git checkout
(commit null). Fail-closed is right for `prepublishOnly`; for the local gate it is new friction.

## F2 — the plugin-bundle drift gate is now unconditionally red (CONFIRMED, empirical)

`npm run build:plugin-bundle` (the sanctioned writer) immediately followed by
`npm run check:plugin-bundle` reports "skill bundle is stale": writing the artifact dirties the tree,
so the checker's fresh build bakes `dirty:true` against the committed `dirty:false`. Independently,
the committed artifact always bakes an older HEAD than any later checkout. The PR deleted the header
comment that explicitly warned a stamped literal REQUIRES a normalization step and replaced it with
"a straight byte comparison remains correct" — the code disproves that claim. The bundle contains
exactly ONE occurrence of the identity literal, so normalizing it before the byte compare is a
one-line fix.

## F3 — the bot bumps the plugin version and commits ~3MB on EVERY push to main (CONFIRMED by code)

Artifact bytes now change whenever HEAD changes, so `run()` always reports `changed` and the workflow
always bumps + commits, including for doc-only or test-only merges. CLAUDE.md's "only if either
differs from what's committed does it bump" is now vacuous. Version becomes a commit counter, and the
version-keyed plugin cache invalidates for marketplace users on every merge.

## F4 — loop safety regressed from structural to configuration-dependent (reasoned)

Convergence used to make the infinite-commit loop impossible; now the `github.actor !=
'github-actions[bot]'` guard (plus GitHub's suppression of GITHUB_TOKEN-triggered workflows) is the
only stop. The workflow's own header anticipates switching to a PAT/app token if branch protection
lands on main — under a PAT, `github.actor` is the token owner and workflows DO retrigger, so the
guard misses and the loop is unbounded. The added test only regex-asserts the guard string exists in
the YAML; it is not a behavioral test of loop safety.

## F5 — env-based npx inference outranks certain PATH evidence (nit, confirmed by the PR's own test)

`launchEvidence` checks `npm_command === "exec"` before `managedBin()`, so a globally installed
`aslite` invoked inside any `npm exec` subshell reports `launch_mode: npx-inferred`. The adjacent
comment says suggestive evidence "never outranks concrete PATH/direct evidence"; this check does.

## F6 — build-time package name is hardcoded (nit)

`build-bundle.mjs` hardcodes `package.name` while reading `version` from the manifest, and
`parseBakedBuildIdentity` fails closed on a name mismatch. Given the scoped name is documented as
interim, read the name from the manifest.

# Recommended single fix for F2/F3/F4

Normalize the baked `__ASLITE_BUILD_IDENTITY__` literal (or just `source.commit`/`source.dirty`) on
both sides of the byte comparison in `check-skill-bundle.mjs` and in `ci-version-bundle.mjs`'s
changed-detection. That restores convergence (F4), restores the local drift gate (F2), and removes
per-merge bumps (F3) while keeping the runtime identity fully honest.

# Process note

The PR records independent review and adversarial QA each with zero findings. F1 and F2 each
reproduce in one command from the documented developer workflow, which suggests neither stage
exercised the local build/gate path. Relevant to CLAUDE.md's ladder-epistemics bullet.

[reviews](../tasks/version-build-identity.md)
