---
type: Task
title: Define and ship the npm versioning and update contract
status: in_progress
priority: '1'
description: >-
  HIGHEST PRIORITY: @holaxis/aslite@0.1.0-pre.2 is publicly published from
  merged PR #181; both latest and next now resolve to pre.2. Clean isolated
  registry installs proved the plain npm install path plus both aslite and
  agentstate-lite binaries. Remaining work is the durable update-discovery,
  upgrade, skill/hook compatibility, automation, and rollback contract before
  retiring the marketplace channel.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-31T20:49:36.647Z'
---
# Problem

AgentState currently has no trustworthy user-facing answer to four basic questions:

1. Which executable and release am I running?
2. Is it the current supported release?
3. What exact command safely upgrades it?
4. After upgrading, are the installed Agent Skill, hooks, and MCP configuration still compatible?

The marketplace/plugin channel and npm channel can carry materially different code while reporting
the same package version. The plugin also lives under host-owned, version-keyed cache paths that
move or disappear during upgrades. Agents repeatedly have to rediscover those paths, and a session
can continue holding instructions for an expired cache. On 2026-07-30, even the installed skill
catalog's advertised path was stale and had to be rediscovered under a different cache nesting.

The npm prerelease gives us a stable executable authority, but publishing once is not an update
system. Before npm becomes the primary channel, define and prove the complete release and upgrade
contract.

# Product outcome

A user installs AgentState conventionally, agents invoke the stable short command `aslite`, and
both can tell whether it is current and how to upgrade without knowing anything about plugin
caches. The npm package is the single executable authority. The optional installed Agent Skill
contains guidance and references, not another copy of the CLI, and its compatibility with the CLI
is explicit.

`npx` remains a useful zero-install bootstrap or trial path. It must not create a second unversioned
authority by installing guidance from `main` that can drift ahead of the installed npm executable.

# Decisions this task must make

1. **Version policy:** SemVer policy before 1.0; when patch/minor/major changes apply; prerelease
   naming; and the meaning of npm dist-tags such as `latest` and `next`.
2. **Release authority and cadence:** what event publishes a package, who can publish, how Git tags
   and commits map to npm versions, and how a bad release is deprecated or rolled back.
3. **Runtime identity:** the command/output that reports package version, build commit, channel, and
   executable path well enough to distinguish npm, local development, and any temporary legacy
   channel.
4. **Update discovery:** whether and where the CLI performs a bounded, non-blocking check for a
   newer supported release; how it behaves offline; how often it checks; and how users or agents
   explicitly suppress it.
5. **Upgrade verb and guidance:** decide whether AgentState owns an `aslite update` convenience
   command or prints the package-manager command. In either case, provide one exact, copyable
   upgrade path and a verification receipt.
6. **Skill and hook compatibility:** define how an npm upgrade detects an older Agent Skill or
   installed hook, whether the user reruns `aslite skill install` / `aslite hook install`, and how
   status commands explain mismatches without silently mutating configuration.
7. **`npx` role:** support `npx @holaxis/aslite ...` for trial/bootstrap while keeping repeated
   operation on the installed `aslite` binary. If `npx skills add` is supported, publish or generate
   a slim skill artifact pinned to a compatible release rather than installing from a moving
   `main`.
8. **Marketplace retirement boundary:** identify the proof that allows deletion of the embedded
   marketplace executable and cache-resolution machinery, while preserving a rollback artifact.

# Acceptance

- A recorded design or decision answers all eight questions above and names one recommended
  end-user install and upgrade journey.
- A clean-machine proof installs one npm version, uses it, upgrades to the next test release, and
  verifies the CLI, Agent Skill, hooks, and MCP startup afterward.
- The installed runtime reports a version identity that changes when its bytes/release changes;
  two different distribution vintages cannot truthfully present as the same build.
- When a newer supported version exists, the user receives an accurate, bounded, non-fatal notice
  and one exact upgrade command. Offline use remains fully functional.
- `aslite skill status` and `aslite hook status` can identify any actionable post-upgrade mismatch
  without relying on marketplace cache paths.
- The npm package, generated skill, release tag, and documentation are produced from one release
  source. CI prevents publishing a version whose declared identity or packaged assets disagree.
- README and onboarding documentation stop teaching marketplace-cache discovery once the npm
  upgrade proof passes.
- The existing narrow version-string finding is resolved by this task rather than implemented as a
  disconnected patch.

# Non-goals

- A mandatory background updater or silent self-modification.
- Making `npx skills add` the primary executable installation mechanism.
- Renaming the product or npm package.
- Removing the marketplace rollback path before the npm upgrade proof succeeds.
- Changes to bundle storage, synchronization, or remote hosting.

# Relevant existing work

- The npm CLI and optional-skill prerelease is already published and awaiting founder proof.
- The npm distribution design already chooses npm as the intended sole executable authority.
- Marketplace retirement remains gated on successful npm-first proof.
- Installer-hardening follow-ups remain separate unless the upgrade contract makes one directly
  necessary.

[uses domain model](../designs/version-update-domain-model.md)

[governed by decision](../decisions/version-update-contract.md)

[implemented by plan](../plans/version-string-channel-identity.md)
