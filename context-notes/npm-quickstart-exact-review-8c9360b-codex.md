---
type: Context Note
title: npm quickstart exact review at 8c9360b
actor: codex-npm-quickstart-reviewer
timestamp: '2026-08-07T18:07:54.966Z'
---
# Summary

APPROVE exact clean SHA `8c9360bb098f33302337d489a54dd0fcb0e16f24` against base `531c9df8ac7299f662d87862d270c7eb63f7dfab`. No blocker, scope-drift, or overengineering finding. The diff is exactly the approved nine-file onboarding unit. Adversarial QA may proceed on this SHA; any subsequent code change restarts exact-SHA Review.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: independently decide whether the integrated npm first-value journey is truthful, executable in a non-empty project, and preserves the merged PR #211 and PR #212 contracts. This serves the ultimate goal by keeping the installation front door both useful and fail-closed.

# Exact scope and commit audit

- Review worktree: `/private/tmp/aslite-npm-quickstart-review-8c9360b`.
- Exact head remained clean at `8c9360bb098f33302337d489a54dd0fcb0e16f24`.
- Base: `531c9df8ac7299f662d87862d270c7eb63f7dfab`.
- Commit stack: rebased checkpoint `8fcd8e34f0aa4eacf06889d0f6dda878996c495c`, then correction `8c9360bb098f33302337d489a54dd0fcb0e16f24`.
- `range-diff` confirms the checkpoint replay; the only mechanical checkpoint difference is the main-owned `readFile` import.
- `base..head` changes exactly nine approved files: both READMEs; home and Recipe source/tests; update-orientation golden; installed verifier and its static test.
- No guide curriculum, release workflow, live publishing, update-selection, marketplace retirement, hook/skill mechanics, generated plugin artifacts, or unrelated product surface entered.

# Contract audit

- Home: default bundle-free guidance targets `.agentstate-lite`; an explicit project directory targets its `.agentstate-lite` child. Broken bindings, unreadable bundles, and board-first-contact suppression remain distinct and unchanged.
- Recipe matrix: only `applied === null` local discovery projects `create_bundle`; existing local `false` and `true` rows and remote rows are add-only. The help projection follows the same matrix.
- READMEs: install the unqualified supported default once; teach no default `@next`; retain canonical `--scope user`; explain that `quickstart-agent` is advisory and that the agent owns ongoing CLI authoring from user intent/source material.
- Installed verifier: starts in a non-empty project with unrelated bytes, proves home/recipes are read-only, executes the emitted work-tracking creation command literally, verifies conventional-child creation, retries the same command and byte-pins the whole project, then proves attributed Task read/list/home/status state.
- PR #212 evidence remains load-bearing: package/source identity and dirty-state assertions, retained-artifact route, package allowlist, whole-tree no-delete refusal snapshot, externally instrumented real production-lock holder/contender barrier, exact same lock path and `EEXIST`, no publication before release, loser exit 5, and exclusion of both nested publications all remain exercised.
- PR #211 evidence remains: relocated-home install/status/uninstall executes canonical `--scope user`; static checks reject compatibility-only public `global` commands.
- Update-orientation golden was intentionally advanced only for the changed home bytes and still pins exact no-notice bytes plus one five-field notice immediately after identity.

# Independent execution evidence

- `npm ci`: pass.
- `npm run build`: pass.
- `npm run typecheck`: pass.
- Focused exact source suites: home + recipes + update orientation, `102/102` pass.
- Focused static README and real-lock contract tests: `2/2` pass.
- Exact clean-SHA `npm run verify:npm-package`: pass; receipt reported `source commit=8c9360bb098f33302337d489a54dd0fcb0e16f24`, `dirty=false`, 30 files, zero runtime dependencies, both bins, and offline workflow passed.
- `git diff --check`: pass; review worktree clean; exact nine-file boundary reconfirmed.

# Required red probe

Empirical checkpoint probe used an archive of `8fcd8e34f0aa4eacf06889d0f6dda878996c495c`, built independently, with its installed-style `aslite` bin on PATH. In a non-empty bundle-free project containing `marker.txt`, its emitted work-tracking command was exactly `aslite init --create-only --recipe work-tracking`. Executing that exact string exited 5 `ALREADY_EXISTS` because it targeted the occupied project root. This directly proves the correction criterion was red at the checkpoint and is not a tautological final-only expectation.

# Survived attacks and residual

- Stable default, explicit, existing-false, existing-true, and remote Recipe/Home states matched the frozen table.
- Literal shell execution is appropriate for the emitted POSIX command contract; invocation code explicitly targets macOS/Linux and repository CI/release gates run Ubuntu.
- No second target-selection authority or onboarding subsystem was introduced; the change composes existing home, Recipe, init, Task, and package-verifier primitives.
- No findings. Dedicated adversarial installed-journey QA remains the next required gate before push/PR.
