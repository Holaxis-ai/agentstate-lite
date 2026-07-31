---
type: Task
title: 'npm prerelease: authoritative CLI plus explicitly installable Agent Skill'
status: in_progress
priority: '1'
description: >-
  PUBLISHED: @holaxis/aslite@0.1.0-pre.2 is canonical; registry installs, both
  bins, optional skill, hook, and npx smoke are proven. Remaining ownership is
  the singular founder/unfamiliar-bundle first-use judgment; upgrade mechanics
  and npm-primary cutover moved to the approved version/update program.
actor: openai/codex
timestamp: '2026-07-31T21:28:52.928Z'
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
- contribute the founder/unfamiliar-bundle judgment to the separately owned pre.2 bootstrap release
  receipt (upgrade mechanics are owned by `tasks/version-string-channel-identity`); and
- confirm the npm tarball contains exactly one executable implementation.

# Non-goals

- Removing the marketplace fallback before the proof passes.
- Silent postinstall configuration.
- Publishing core/server libraries or changing hosted architecture.
- Adding a second skill renderer or recipe engine.

[implements](../designs/npm-bundle-bootstrap.md)

[advances](../roadmap-items/distribution-neutral-resources.md)

[depends on](npm-package-identity.md)

# Package coordinate and superseded working tag policy

The identity gate is resolved at scoped **`@holaxis/aslite`** with bins `aslite` and
`agentstate-lite`. The original unscoped coordinate and “next never advances latest” working rule
from [the decision doc](../decisions/npm-interim-package-name.md) were superseded by its amendment and
[release/update Decision](../decisions/version-update-contract.md). Before stable, latest and next
coincide at rest on the proven supported prerelease; during proof next may temporarily name the
explicit candidate while latest remains supported.

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

# PUBLISHED bootstrap history (2026-07-21 through 2026-07-30)

`@holaxis/aslite@0.1.0-pre.1` is live on npmjs (public, org `holaxis` created and owner-verified;
scoped coordinate per the amended decision — unscoped `aslite` was 403'd by npm's publish-time
moniker rule, "too similar to sqlite, slate"). Registry fact vs policy wording: npm forces
`latest` to exist on first publish, so latest == next == 0.1.0-pre.1 today; the policy's
operative meaning is that latest never ADVANCES automatically. Cold-install smoke from the real
registry, fully isolated (scratch prefix/HOME): install, help, init, new, list, skill
install/status/uninstall (both hosts, files verified on disk), hook install writing exactly
`aslite session-start`, clean uninstalls, and `npx -y @holaxis/aslite@next` — all green.

`0.1.0-pre.2` is now the canonical public bootstrap release; both `latest` and `next` resolve to it,
and isolated registry installs proved both bins. Remaining acceptance here is the singular founder
clean-home/unfamiliar-bundle judgment. `tasks/bootstrap-pre2-upgrade-proof` owns and records the
upgrade mechanics and links that human evidence back here. npm-primary docs, self-discovery proof,
frozen recovery, gate transfer, and marketplace deletion are separate reviewed units.

[acceptance evidence from](bootstrap-pre2-upgrade-proof.md)
