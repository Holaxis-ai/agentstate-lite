---
type: Review
title: 'Independent review: PR #187 project-directory bundle resolution'
actor: openai/codex-reviewer
timestamp: '2026-08-02T14:53:08.822Z'
---
# Exact change reviewed

PR #187, exact commit `b91a820c08c310ca2906ab708c3a9b4bd732b709`.

# Verdict

`changes_requested` — the target-selection mechanism is sound, but one P2 coherence finding should be fixed in this same unit before merge.

# Finding

## [P2][reasoned] The public help and nearby source contracts still state the behavior this PR removes

The implementation now intentionally accepts either an exact bundle root or a project directory whose direct `.agentstate-lite/` child is a bundle. However, `bundle --help` still says `--dir` resolves a "literal bundle root" (`packages/cli/src/commands/bundle.ts:18`), and `catalog --help` repeats the same false contract (`packages/cli/src/commands/catalog.ts:34`) even though catalog add consumes the changed resolver. `openBundle` and home/session-start comments also still say explicit `--dir` is verbatim/literal-root-only (`bundle.ts:416-417`, `home.ts:296-298`, `home.ts:343-346`). This is directly user- and agent-facing discoverability for the new affordance, not review history. Update those strings/comments to the precise rule: explicit `--dir` accepts the requested bundle root or its direct conventional child, while it never walks upward to select an ancestor.

# Empirical evidence

- Detached exact-SHA worktree with a fresh `npm ci` and repo-root build.
- Focused bundle + bundle-locate resolver suites: 33/33 pass.
- Exact-SHA GitHub checks: Node 20 built-CLI smoke, Node 22 gate, and Node 26 gate all green.
- Built-CLI scratch proof: `bundle locate --dir <project>` returned the canonical `.agentstate-lite` child; `list --dir <project>` succeeded; `bundle locate --dir <project>/src` exited 6 and pointed at the existing bundle without `init`.
- Deliberate old-contract red probe (`assert.rejects` for project-directory resolution) failed with `Missing expected rejection`, proving the added behavior is what makes the resolver contract green.
- Symlink probe preserved a lexical `root` for ordinary commands, returned the physical target as `canonicalRoot`, and refused to retarget a nested typo while pointing its help at the lexical enclosing bundle.

# Survived attacks

- Exact explicit bundle roots still win over a direct conventional child.
- Explicit selection continues to suppress project bindings.
- A nested invalid `--dir` is not silently retargeted to an ancestor; only its error help names the enclosing workspace.
- An unrelated invalid path keeps the greenfield `init --dir <path>` fallback.
- `openBundle` and `bundle locate` consume the same `resolveLocalBundleTarget` authority; locate projects its canonical root while openBundle retains the lexical path.
- Conventional-child detection requires the child `index.md`; an empty `.agentstate-lite/` folder remains unavailable.

[tasks/cli-dir-error-steers-to-divergent-bundle](../tasks/cli-dir-error-steers-to-divergent-bundle.md)

# Re-review addendum — 2026-08-02

Exact commit reviewed: `2a787553a6c99f23e8e1828340315f717ce9b181`.

## Final verdict

`approve` — the prior P2 coherence finding is fully resolved; no new findings.

## Resolution verified

- Built `bundle --help` now says explicit `--dir` accepts a bundle root or its direct `.agentstate-lite` child.
- Built `catalog --help` now describes the same project-directory affordance for `catalog add`.
- `openBundle` documentation now states the exact boundary: requested root or direct conventional child, never an ancestor.
- The two session-start/home comments now truthfully distinguish direct-child explicit resolution from the upward walk needed for a nested run directory and a separately resolved board checkout.
- A source-wide stale-phrase scan found no remaining literal-root-only assertion about explicit `--dir`.

## Re-review evidence

- Detached exact-SHA worktree with fresh `npm ci`.
- Repo-root build succeeded.
- Both revised help surfaces were sampled from the freshly built CLI and matched the implementation.
- The follow-up commit changes only the five help/comment sites named by the prior finding; resolver code and its previously reviewed tests are unchanged.
- Exact-SHA GitHub CI was still running when this addendum was recorded; the standing gate remains the merge prerequisite.
