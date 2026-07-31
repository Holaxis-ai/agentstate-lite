---
type: Context Note
title: 'Orientation: version-string/channel-identity task review'
actor: openai/codex
timestamp: '2026-07-31T20:22:20.836Z'
---
# Summary

## Goals

- **Ultimate goal:** Make agentstate-lite the reliable, local-first, user-owned shared memory for agents and humans: plain Markdown, safe concurrent writes, and git-based sharing.
- **Proximate goal:** Define the release/update identity contract, produce a reviewed implementation plan, and ship its coherent units through the required review and QA gates.
- **Link upward:** A trustworthy distribution identity and upgrade path are prerequisites for users to rely on the CLI and its installed integration surfaces across sessions.

## Current orientation

- The task is `in_progress`, priority 1, and says npm `0.1.0-pre.2` is public and proven by isolated installs.
- Brian authorized this session to take the task on and confirmed `0.1.0-pre.2` is the canonical current release. Any `0.1.0-pre.1` reported by the local dev bundle is stale-build evidence to diagnose, not an alternate desired version.
- Its task body was truncated in the first read and still needs full inspection.
- It has backlinks from `roadmap-items/distribution-neutral-resources` (`contains`) and `tasks/retire-marketplace-channel` (`depends on`), but no outbound links.
- The prior `context-notes/pre-compact-main` concerns PR #177 and is not a current handoff for this unit.

## Unverified assumptions

- Whether the eventual automatic update notice belongs only on human-orientation surfaces, or may alter command output elsewhere.
- Whether MCP configuration should gain a managed status/migration surface or remain a proof-only external configuration contract.

## Findings

- **Verdict:** the task is design-ready but not build-ready. Its problem statement, product outcome, acceptance criteria, and non-goals are strong, but the unit spans policy, identity mechanics, update discovery, compatibility diagnostics, release automation, documentation, and end-to-end upgrade proof. It should remain an umbrella task whose plan delivers several coherent reviewed units.
- **One identity owner is mandatory.** On clean `main` at `8b7cefe`, `packages/cli/package.json` is `0.1.0-pre.2`, but the locally stale `./aslite` bundle prints `0.1.0-pre.1`; that same executable's `skill status` reports the adjacent package assets as `0.1.0-pre.2`. Public identity projections can therefore disagree inside one process. The implementation needs one build-identity primitive plus a per-surface agreement table and tests.
- **SemVer alone cannot distinguish distribution vintages.** The marketplace bundle prints npm version `0.1.0-pre.2` while its channel manifest is `1.0.134`. Runtime identity should carry at least release version, source/build commit, distribution channel, executable path, and an artifact/build fingerprint or equivalent invariant strong enough to satisfy the task's changed-bytes criterion.
- **Registry claims verified on 2026-07-31.** The public npm registry reports both `latest` and `next` as `0.1.0-pre.2`. The repo has no Git tags and no npm publish workflow; release authority and commit/tag/package mapping are genuinely undecided rather than merely undocumented.
- **Current behavior matches the stated gap.** `--version` emits only the SemVer string; `update` is deliberately rejected. `skill status` already reports installed/stale by byte-comparing installed assets with the running package, which is a useful foundation. `hook status` reports presence and a command but no release/contract compatibility. The task asks about MCP compatibility, but its decision list does not yet assign an MCP configuration/status contract.
- **Update discovery needs an output-boundary decision.** Automatic registry checks must not perturb structured command stdout or make ordinary local bundle operations network-dependent. The design should name the exact surface, cache/TTL, timeout, offline behavior, and suppression mechanism. A human-orientation surface such as bare home/session-start, plus an explicit check command, is the narrowest plausible boundary.
- **Coordination state is split.** `roadmap-items/distribution-neutral-resources` and `tasks/retire-marketplace-channel` point at this task, but the main `roadmap` still says `tasks/npm-cli-skill-prerelease` owns the remaining founder proof/onboarding. That older task remains `in_progress` and overlaps the clean-machine upgrade proof. The ownership boundary must be reconciled before implementation.
- **Progressive disclosure is incomplete.** The task has no outbound links, no explicit next action, and no linked Decision or Plan. A reader must search the bundle to recover the prior npm design, package-name decision, old task, and roadmap item.

## Recommended next action

Author and review a Decision plus implementation Plan before code. The Decision should define the identity record and channel comparison rules, SemVer/dist-tag policy, supported-release selection, upgrade command/receipt, update-check boundary, skill/hook/MCP compatibility semantics, release/tag/publish authority, and rollback. The Plan should then sequence coherent units: identity primitive and agreement tests; update/compatibility diagnostics; release automation; clean-machine old-to-new proof and documentation transition. Reconcile the roadmap and `tasks/npm-cli-skill-prerelease` ownership in the same planning pass.

The task remains claimed as `in_progress` by `openai/codex`. No code change has been made yet; design decisions and the reviewed implementation plan precede the build.

## Founder policy confirmations (2026-07-31)

Brian confirmed the following product defaults:

1. Until the first stable release, use `0.1.0-pre.N` and let both `latest` and `next` identify the newest supported prerelease; after `0.1.0`, `latest` means stable and `next` means preview. Breaking pre-1.0 contracts advance the minor line.
2. The supported installed journey is global npm; `npx` is trial/bootstrap, and other package managers are not initially guaranteed.
3. A protected release may be approved by either Brian or Mike.
4. AgentState does not silently self-modify; it reports an exact npm upgrade command and verification receipt.
5. Automatic discovery is limited to the human-orientation surface, daily-cached, bounded/non-fatal, offline-safe, suppressible, and absent from ordinary bundle-command output.

Convention check: npm's own `update` verb mutates installed packages, so a bare non-mutating `aslite update` would be mildly surprising. Brian confirmed the refinement: use `aslite version --check` for the explicit read-only check and reserve `aslite update` for a future command that actually updates. The established CLI notifier pattern supports the agreed daily cache/opt-out policy and refreshes asynchronously, so item 5 is convention-aligned; prefer cached-result-now/background-refresh over adding startup latency.

Brian also confirmed item 6: supported MCP host configuration launches the stable `aslite mcp` PATH command and survives npm upgrades without edits; legacy cache-path configuration receives explicit migration guidance, never a silent rewrite. Before the live marketplace channel is deleted, preserve its final working state as an immutable Git tag and downloadable GitHub release—an emergency backup, not a maintained second channel.
