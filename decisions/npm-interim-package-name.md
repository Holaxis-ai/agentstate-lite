---
type: Decision
title: >-
  Interim npm package name: as-lite (Brian + Mike agreed 2026-07-20; long-term
  name still open)
actor: anthropic/claude
timestamp: '2026-07-21T02:17:12.951Z'
---
# Decision

Publish the npm package under the **interim name `as-lite`**. This is explicitly a
placeholder coordinate: a long-term product/package name decision remains open, and a rename
is expected once it lands. The interim name exists so the prerelease work is not blocked on
the branding decision.

# Rationale

- An unrelated package named `agentstate` already exists on npm ("Firebase for AI Agents -
  TypeScript/JavaScript SDK for persistent agent state management", v1.0.2). Publishing
  `agentstate-lite` would read as that package's lite variant — confusing, and potentially
  disallowed under npm's name-similarity/typosquat rules.
- `as-lite` verified available on the npm registry (404) on 2026-07-20.

# What this decides (per the identity task's checklist)

- **Package name:** `as-lite` (interim).
- **Short command:** `aslite` remains the preferred bin. The prerelease task must ensure
  `npx -y as-lite` resolves — npm needs a bin matching the package name when multiple bins
  exist, so an `as-lite` bin alias (or equivalent) ships with the rename.
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
all `as-lite` versions with a pointer at the successor. Published `as-lite` versions remain
installable (npm does not allow unpublishing after 72h) but clearly marked superseded.

# Provenance

Decided by Brian with Mike, 2026-07-20, recorded by Claude in-session. Driver: the identity
question was blocking `tasks/npm-cli-skill-prerelease` and the team chose not to let a
branding decision gate distribution work.

[resolves](../tasks/npm-package-identity.md)

[unblocks](../tasks/npm-cli-skill-prerelease.md)
