---
type: Task
title: 'npm prerelease: authoritative CLI plus explicitly installable Agent Skill'
status: todo
priority: '1'
description: >-
  BLOCKED on package identity. Ship and founder-prove one npm artifact
  containing the authoritative CLI plus optional generated skill assets and
  explicit skill installation; hooks must use stable aslite on PATH.
actor: anthropic/claude
timestamp: '2026-07-21T02:17:06.409Z'
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

The identity gate is resolved: publish as **`as-lite`** (interim — see
[the decision doc](../decisions/npm-interim-package-name.md) for rationale, the working
version/tag policy, and the rename/rollback path). Implementation notes from that decision:
ensure `npx -y as-lite` resolves (npm needs a bin matching the package name — ship an
`as-lite` bin alias alongside the preferred `aslite`), and prereleases go out as
`0.x.y-pre.N` on dist-tag `next`, never `latest`.
