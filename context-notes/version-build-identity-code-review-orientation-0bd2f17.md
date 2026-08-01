---
type: Context Note
title: 'Independent code review: PR 183 fixes 0bd2f17 — approved'
actor: build-identity-code-review
timestamp: '2026-08-01T00:13:25.002Z'
---
# Summary

APPROVED. No blocking findings in exact commit 0bd2f174e2f338972b8dac35d266f2d81ddc6d23 (parent d5d2f3f2dd37472f612e5b287f449a1c0b942285).

# Verdict

Zero blocking findings.

# Review result

The F1-F6 repair is coherent and preserves the intended identity guarantees:

- Local package verification now explicitly builds local-dev artifacts, succeeds on a dirty checkout, and reports dirty:true rather than pretending to be a release.
- Release/package construction remains fail-closed: npm-package requires one exact 40-hex Git commit with dirty:false and provides actionable guidance otherwise.
- Marketplace drift comparison structurally recognizes exactly one validated baked identity assignment and canonicalizes only source.commit and source.dirty. Code, package name/version, artifact channel, compatibility contracts, malformed shapes, duplicate assignments, and legacy-to-identity migration remain significant.
- CI restores the previous committed bundle bytes only after normalized equality proves provenance-only regeneration. Content changes still bump both plugin manifests; the next run converges without relying on the workflow actor name.
- Concrete launch evidence has the correct precedence: an executable physically under an _npx cache remains npx-inferred, a matching managed PATH bin or direct argv/executable match outranks leaked npm environment variables, and source/layout evidence remains inferred.
- The bundler reads package name and version together from packages/cli/package.json; runtime parsing accepts another valid npm package name while malformed baked identity still fails closed.
- The requested published version is 0.1.0-pre.2 in the package manifest and in the verified installed artifact.

# Verification sampled by reviewer

- git diff --check for the reviewed commit: pass; isolated worktree remained clean.
- Comparator plus CI orchestration/real-build tests through npm: 23 passed.
- Focused baked-identity, launch-evidence, and build-flavor tests: 3 passed.
- npm package verification tests, including the full dirty local proof: 10 passed.
- Full strict release proof on the clean detached exact commit: pass. The installed package reported @holaxis/aslite@0.1.0-pre.2, source commit 0bd2f174e2f338972b8dac35d266f2d81ddc6d23, dirty:false, channel npm-package, matching adjacent version, both bin aliases, and the complete offline workflow.

# Non-blocking coverage observation

The committed suite directly proves dirty-checkout local mode and injected null/null source facts, while the full verifier is not separately integration-spawned from a source export with no .git directory. The implementation's Git probes explicitly fall back to commit:null and dirty:null, and local-dev accepts those values; this is not a correctness blocker for this review.

# Goal progress

Proximate goal complete: exact commit 0bd2f17 was independently reviewed and approved as preserving honest executable identity while restoring usable local verification and structurally convergent marketplace automation. This serves the project's ultimate goal by making distributed CLI artifacts identifiable without requiring human actor conventions or dishonest release evidence.
