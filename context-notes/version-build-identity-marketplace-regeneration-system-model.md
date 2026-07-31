---
type: Context Note
title: 'System model: build identity and marketplace regeneration feedback loop'
actor: openai/codex
timestamp: '2026-07-31T22:48:27.288Z'
---
# Summary

The marketplace artifact generator currently feeds its own tracked output changes back into `source.dirty` on a second regeneration. Preserve explicit source provenance and deterministic bytes by separating build inputs from generated outputs; do not weaken the identity contract.

# Reorientation

Ultimate goal: make agentstate-lite a durable, dependable local-first memory and coordination tool whose distributed artifacts can be identified and supported exactly.

Proximate goal: finish I1 by making every CLI artifact report an honest byte-distinguishing identity without breaking the existing bot-owned marketplace distribution loop.

# Whole system

## Producers

- `packages/cli/scripts/build-bundle.mjs` is the single esbuild configuration. It bakes package version, source commit, source dirty state, artifact channel, and compatibility contracts into the executable.
- `packages/cli/build.mjs` produces `local-dev` or `npm-package` dist output.
- `packages/cli/scripts/build-plugin-bundle.mjs` is the only writer of the committed marketplace executable and uses `marketplace-legacy`.
- `scripts/ci-version-bundle.mjs` regenerates the committed executable plus SKILL and references, detects byte changes, bumps two plugin manifests, and leaves the workflow to commit them.
- `packages/cli/scripts/check-skill-bundle.mjs` rebuilds a scratch marketplace artifact for byte comparison.

## Workflow and ordering

1. A human commit lands on main.
2. The non-bot workflow checks out current main cleanly.
3. The generator builds from that commit, then writes the committed executable, SKILL, references, and plugin version manifests.
4. The bot commits those outputs. The bot commit has a new SHA, so its embedded source commit is intentionally the parent input commit.
5. The `github-actions[bot]` actor guard prevents the bot commit from triggering a recursive rebuild.
6. PR branches do not normally carry bot-owned output changes.

## External and mutable state

- `HEAD` identifies the source snapshot.
- Git status supplies dirty evidence.
- The committed output paths are tracked files and therefore become dirty as soon as regeneration changes them.
- The workflow actor and clean checkout are external preconditions.
- The plugin cache is keyed by the paired manifest version.

# Invariants

- Same explicit build inputs must produce identical bytes.
- Source provenance must never claim stronger evidence than the builder had.
- `npm-package` requires exact commit and `dirty:false`.
- Marketplace artifacts retain exact input commit and `marketplace-legacy` channel.
- Generating output must not redefine the source input midway through a deterministic regeneration check.
- The two marketplace manifests and generated artifacts move atomically under the bot.
- Human PR builds must not commit or hand-bump bot-owned artifacts.
- The bot actor guard remains load-bearing because the bot commit SHA cannot be embedded in the artifact created before that commit exists.

# Diagnostic finding

The new identity currently derives dirty from the entire worktree on every build call. In the real integration test, the first run changes the tracked generated outputs and manifests. The second run therefore sees `dirty:true` although no source input changed, embeds different identity bytes, and reports changed again. This is a producer-output feedback loop, not nondeterministic esbuild output.

The help smoke test also needs one ordered adjacency assertion, and `version.ts` has one extra blank line at EOF, per independent review of `a71866b`.

# Unverified choice

The fix must decide whether marketplace provenance should use one explicit source-fact snapshot for a generation attempt, or compute dirty over source inputs while excluding its generated outputs. Removing dirty evidence entirely would weaken the approved identity contract and is not preferred.
