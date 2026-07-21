---
type: Task
title: 'npm prerelease: authoritative CLI plus explicitly installable Agent Skill'
status: in_progress
priority: '1'
description: >-
  PUBLISHED: @holaxis/aslite@0.1.0-pre.1 live on npmjs (tag next; latest forced
  by first-publish). Registry cold-install smoke all green incl. skill+hook
  round-trips and npx. Remaining: founder proof on a clean machine (human), then
  npm-as-primary-channel doc step + marketplace retirement as separate units.
actor: anthropic/claude
timestamp: '2026-07-21T23:53:18.059Z'
---
# Behavioral claim

One npm installation provides the authoritative AgentState CLI plus an optional, explicitly
installable Agent Skill. The skill invokes the CLI on `PATH`; it never embeds another executable or
resolves a marketplace cache.

# Scope

1. Extend the npm tarball allowlist to include the generated Agent Skill and only its declared
   reference assets alongside the existing self-contained CLI.
2. Add `aslite skill install|status|uninstall` with project/global scope for supported skill hosts.
   Reuse the existing host-config-root authority, including `CODEX_HOME` and `CLAUDE_CONFIG_DIR`.
3. Keep installation explicit and reversible. Do not use npm lifecycle scripts to mutate user or
   project configuration.
4. Render the npm-carried skill with bare `aslite` commands and actionable guidance when the CLI is
   missing. Remove cache discovery from this target.
5. Prove the existing `hook install` writes stable `aslite session-start` when the npm bin is on
   `PATH`.
6. Publish a prerelease only after the package identity task is resolved.

# Acceptance proof

From the exact packed prerelease in an isolated home and without this source checkout:

- install the package and run `aslite` offline;
- install, inspect, reinstall idempotently, and uninstall the Agent Skill for Codex and Claude;
- install the SessionStart hook and confirm it targets the stable PATH command;
- start a fresh agent session against an unfamiliar real bundle;
- discover its Kinds/workflow, make an attributed mutation, and open a View without founder
  explanation;
- upgrade/reinstall the package without an executable or hook path expiring; and
- confirm the npm tarball contains exactly one executable implementation.

# Non-goals

- Removing the marketplace fallback before the proof passes.
- Silent postinstall configuration.
- Publishing core/server libraries or changing hosted architecture.
- Adding a second skill renderer or recipe engine.

[implements](../designs/npm-bundle-bootstrap.md)

[advances](../roadmap-items/distribution-neutral-resources.md)

[depends on](npm-package-identity.md)

# Package coordinate (unblocked 2026-07-20)

The identity gate is resolved: publish as **`aslite`** (interim — see
[the decision doc](../decisions/npm-interim-package-name.md) for rationale, the working
version/tag policy, and the rename/rollback path). The package name matches the preferred
bin, so `npx -y aslite` resolves with no bin alias. Prereleases go out as `0.x.y-pre.N` on
dist-tag `next`, never `latest`.

# Delivery record (2026-07-20)

Shipped as TWO stacked PRs (Brian opens/merges; publish itself stays human-gated):

- **PR1** `feat/aslite-npm-coordinate` @ `3bd40b9` — interim coordinate `aslite` applied
  (decision doc: decisions/npm-interim-package-name); two-form managed-hook recognition;
  fail-loud + atomic + mode-preserving hook writes. Stages: plan review (2 high findings,
  both pre-build), build, review ×2 (1 blocker: lockfile; red-probes caught), adversarial QA
  ×2 (2 majors found & fixed: settings clobber, torn-read race; kill-test 244 SIGKILLs clean).
- **PR2** `feat/aslite-skill-channel` @ `2308e66` + `3bbd57e` (stacked on PR1) — tarball
  carries SKILL.md + mirrored references/ (30-file tarball, one executable, proven);
  `skill install|status|uninstall` with manifest-tracked, symlink-refusing, self-healing
  installs. Stages: review ×3 (findings each round: Codex-scope wording; symlink pins;
  the owned-base red-test gap — a mutation survived the suite until pinned), QA ×3
  (symlink-through-delete F1, interruption brick F2, concurrency refusals F3 — all fixed;
  final verdict SHIP, 0/40 kill-bricks). Residual R2 (concurrent same-target installs can
  exit 1 spuriously, self-healing, zero data loss) recorded in tasks/skill-installer-followups.
- After PR1 merges: rebase PR2 onto main, regenerate prose (check:skill), re-push.
- Remaining acceptance items that are HUMAN post-publish validation: founder installs the
  packed prerelease on a clean machine, fresh agent session on an unfamiliar real bundle,
  attributed mutation + View open without founder explanation, upgrade without path expiry.

# PUBLISHED (2026-07-21)

`@holaxis/aslite@0.1.0-pre.1` is live on npmjs (public, org `holaxis` created and owner-verified;
scoped coordinate per the amended decision — unscoped `aslite` was 403'd by npm's publish-time
moniker rule, "too similar to sqlite, slate"). Registry fact vs policy wording: npm forces
`latest` to exist on first publish, so latest == next == 0.1.0-pre.1 today; the policy's
operative meaning is that latest never ADVANCES automatically. Cold-install smoke from the real
registry, fully isolated (scratch prefix/HOME): install, help, init, new, list, skill
install/status/uninstall (both hosts, files verified on disk), hook install writing exactly
`aslite session-start`, clean uninstalls, and `npx -y @holaxis/aslite@next` — all green.

Remaining acceptance items (HUMAN, post-publish): founder installs on a clean machine/home,
fresh agent session against an unfamiliar real bundle, discovers Kinds/workflow and makes an
attributed mutation + opens a View without founder explanation, upgrade/reinstall without path
expiry. Then: make npm the documented primary channel, and marketplace retirement as separate
deletion units (design transition steps 5-6).
