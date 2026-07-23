---
type: Decision
title: 'Legacy Page/bridge support is transitional: migrate, then remove'
actor: claude-main-viewauthoring
timestamp: '2026-07-23T23:48:28.527Z'
---
# Legacy Page/bridge support is TRANSITIONAL — migrate, then remove

**Decision (Brian, 2026-07-23):** dual-read acceptance of legacy forms (`type: Page`, the
`pages-registry/`/`pages/` prefixes, and the `bridge` frontmatter field once `access` lands) is a
MIGRATION WINDOW, not a permanent contract. The plan is three phases:

1. **Add** the new forms without breaking anything (Option C+ dual-read; the `access` rename unit).
2. **Migrate** the existing bundles. The install base is currently ~2 people (Brian, Mike), so this
   is the cheapest migration the system will ever have; every new user makes legacy support more
   permanent. Includes the parked-and-now-unparked hard part: registry id/blob moves
   (`pages-registry/` -> `views-registry/`, `pages/` -> `views/`) with link rewriting.
3. **Remove** legacy read paths from code, gated on the `status` legacy-stock audit reading zero
   across all known bundles.

**Supersedes** the "never migrates / keeps working forever" phrasing that crept into several
records (CLAUDE.md's View note, task descriptions, session summaries). The original Option C+
record was already compatible: it said "until a future deprecation decision" and built the audit
as the deprecation sizing meter. This is that decision.

**Rationale for cleanliness over accretion:** conventions and contracts should read as ONE system
to the many future users, not as an archaeology of renames. Dual-read code, dual prefixes, and
dual field names each tax every future reader and every future feature.

**Explicitly out of scope for removal:** the `bridge: "v0"` wire-protocol identifier inside view
HTML clients (mechanism, author-invisible; any rename there rides a deliberate protocol version
bump, e.g. the bridge-v1 unit), and the internal `Bridge*` code names (correctly named — they name
the channel).

[phase 2](../tasks/migrate-legacy-page-bridge-stock.md)

[phase 3](../tasks/remove-legacy-page-bridge-support.md)

[the rename unit this governs](../tasks/view-bridge-field-rename.md)

[tasks/migrate-legacy-page-bridge-stock](../tasks/migrate-legacy-page-bridge-stock.md)

[tasks/migrate-legacy-prefix-locations](../tasks/migrate-legacy-prefix-locations.md)

## REVISED 2026-07-23: three independent dials, not two phases of moves

The migration decomposes into three independently-schedulable dials: (1) the permission
FIELD name (`bridge` -> `access`), (2) the TYPE name (`Page` -> `View`), (3) the folder
LOCATION (`pages-*/` -> `views-*/`). Dials 1+2 are in-file, one-word edits — semantic
vocabulary, the actual source of two-names confusion — and proceed promptly (Phase 2a).
Dial 3 changes document IDENTITY (addresses), is categorically harder (link rewriting),
and is a genuinely open decision recorded on tasks/migrate-legacy-prefix-locations —
"possible, not preferred". Phase 3 removes the legacy NAMES only; old-folder recognition
stays (near-zero cost) unless the address decision closes.

[dial 3, the open address decision](../tasks/migrate-legacy-prefix-locations.md)
