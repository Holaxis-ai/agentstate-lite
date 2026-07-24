---
type: Decision
title: 'North star: one vocabulary — no competing names, no misleading authoring paths'
actor: claude-main
timestamp: '2026-07-24T17:25:08.112Z'
---
# Summary

North star for conventions, kinds, and field vocabulary (Brian, 2026-07-24), stated as two
testable claims:

1. **One name per concept, under the hood.** A user who installs aslite and inspects a new
   bundle never finds the same functionality carried by differently named things (Page vs View,
   bridge vs access). Non-competing internal names are fine: mechanism code names (Bridge* — the
   channel), the wire protocol identifier, prefix grammars, migration tooling.
2. **Authoring paths cannot mislead.** No aslite surface teaches, scaffolds, or silently accepts
   a legacy name: kind-aware authoring rejects them, teaching materials never mention them as
   current, write-time hints correct them, and status diagnoses any that arrive anyway — loudly,
   with the migration remedy named.

Honest boundary: OKF genericity means arbitrary type strings always WRITE successfully (core must
read bundles other tools produce). The guarantee is therefore never-taught/never-scaffolded/
never-silent — not physically-impossible.

Known residual under this star: this project's own board keeps legacy ids (pages-registry/) while
the address dial stays open — new bundles are unaffected; revisit after Mike's migration.

[the deprecation program this governs](../decisions/legacy-deprecation-path.md)

[the open address decision it pressures](../tasks/migrate-legacy-prefix-locations.md)
