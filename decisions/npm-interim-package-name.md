---
type: Decision
title: >-
  Interim npm coordinate: @holaxis/aslite (amended 2026-07-21; was unscoped
  aslite, blocked by npm moniker rule)
actor: anthropic/claude
timestamp: '2026-07-21T23:19:26.641Z'
---
# Decision

Publish the npm package under the **interim name `aslite`**. This is explicitly a
placeholder coordinate: a long-term product/package name decision remains open, and a rename
is expected once it lands. The interim name exists so the prerelease work is not blocked on
the branding decision.

# Rationale

- An unrelated package named `agentstate` already exists on npm ("Firebase for AI Agents -
  TypeScript/JavaScript SDK for persistent agent state management", v1.0.2). Publishing
  `agentstate-lite` would read as that package's lite variant — confusing, and potentially
  disallowed under npm's name-similarity/typosquat rules.
- `aslite` over `as-lite` (both verified available on the npm registry, 404, 2026-07-20):
  the package name matches the existing preferred bin, so `npx -y aslite` resolves with no
  bin alias and users install and run one identical name. npm blocks new names differing
  from existing ones only by punctuation, so registering `aslite` also keeps `as-lite` out
  of squatters' hands.

# What this decides (per the identity task's checklist)

- **Package name:** `aslite` (interim).
- **Short command:** `aslite` remains the preferred bin, now identical to the package name —
  no alias needed for `npx -y aslite`.
- **Manifest migration:** the existing `agentstate-lite` manifest name was never published;
  it simply changes in `package.json`. No npm-side migration exists or is needed.
- **Repo/product rename:** deferred — NOT part of this unit. The GitHub repo stays
  `agentstate-lite` until the long-term name is chosen.
- **Version/tag policy (working default, adjust at publish if Brian objects):** prereleases
  as `0.x.y-pre.N` under the npm dist-tag `next`; nothing lands on `latest` until a
  deliberate stable release.
- **Ownership/credentials:** secured at first publish from Brian's npm account (or an org he
  designates) — the publish itself remains an explicit human-gated act.

# Rollback / rename path

When the long-term name is chosen: publish under the new coordinate, then `npm deprecate`
all `aslite` versions with a pointer at the successor. Published `aslite` versions remain
installable (npm does not allow unpublishing after 72h) but clearly marked superseded.

# Provenance

Decided by Brian with Mike, 2026-07-20 (name form `aslite` vs `as-lite` settled by Brian
2026-07-20), recorded by Claude in-session. Driver: the identity question was blocking
`tasks/npm-cli-skill-prerelease` and the team chose not to let a branding decision gate
distribution work.

[resolves](../tasks/npm-package-identity.md)

[unblocks](../tasks/npm-cli-skill-prerelease.md)

# Amendment (2026-07-21): scoped coordinate @holaxis/aslite

The first real publish of unscoped `aslite` was REJECTED by npm's publish-time moniker rule
(403: "too similar to existing packages sqlite, slate"). This rule is enforced only at
publish; a 404 on `npm view` proves unregistered, NOT publishable — the original
availability verification checked the weaker claim.

Revised decision (Brian, 2026-07-21): publish as **`@holaxis/aslite`** under a new `holaxis`
npm org (free public tier; Brian creates it). Rationale: scopes bypass the moniker rule and
global collisions entirely; the org owns the `@holaxis` namespace permanently (supply-chain
protection — nobody else can publish under it, and the eventual long-term name is guaranteed
available inside it); `npx -y @holaxis/aslite` still resolves the `aslite` bin (npx matches
the unscoped part). Bins, skill identity (`aslite`, `skills/aslite`), and everyday UX are
unchanged — the scope appears only at install/npx moments. Scoped publishes require
`--access public` / `publishConfig.access: public` (pinned in the manifest).

Rollback/rename path updated accordingly: the successor name will live in the same
`@holaxis` scope; superseded versions get `npm deprecate` pointers as before.
