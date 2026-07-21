---
type: Context Note
title: >-
  PR #138 (doc reader) high-risk review — APPROVE, QA de-escalated for PR-1
  (recorded)
actor: fable-reviewer
timestamp: '2026-07-21T19:01:06.044Z'
---
# Summary

Independent high-risk-tier review of PR #138 (doc reader PR-1) at ecda6e9: APPROVE, no XSS bypass found; 3 LOW/NIT findings folded as 3f35d89. The reviewer attacked the security boundary as built, wrote its OWN 13-case adversarial battery rendered to real jsdom DOM (beyond the shipped battery), and proved CLOSURE at the parser level: every URL-bearing mdast node NOT in the switch (definition/linkReference/imageReference/footnoteDefinition) routes to textOf, which never reads .url — so no unhandled node can leak a URL to an attribute; only link (resolver-gated) and image (inert) read .url. The two data-derived DOM attributes are both ?view=doc&id=<encodeURIComponent>, structurally incapable of becoming javascript:/data:/off-origin or breaking out — so even a total resolveConceptId bypass is contained to a same-page query route.

# QA de-escalation (orchestrating-session decision, per CLAUDE.md's ladder)

The high-risk ladder is Builder -> review -> adversarial QA. DECISION: QA de-escalated for PR-1, reasoning recorded (not silent decay). The review ITSELF performed the adversarial pass this tier calls for (independent to-real-DOM battery + parser-level closure proof), and PR-1 renders no iframes and has NO concurrency/interruption/multi-process surface a separate QA reaches — the states are enumerable and were enumerated. Belt 3 is exercised by the shipped real-chromium e2e (hostile doc via the actual CLI under the real CSP: literal text, zero script/img/iframe, inert javascript: link, no dialog ever fired). Dedicated adversarial QA is RESERVED for PR-2 (figures) — a live sandboxed iframe with mint/nonce TTL and the 256-launch cap, a changed concurrency profile, exactly where QA earns its keep and the plan already scopes it.

# Findings (all folded, non-blocking)

1. LOW — battery gains reference-style-link + footnote hostile-target cases (reviewer verified inert independently; now pinned).
2. LOW — normalizeSegments exported + parity-pinned DIRECTLY vs node:path.posix.join (the resolver's leading-../ post-strip masks a ..-past-root regression in the raw normalizer).
3. NIT — backlink React keys index-suffixed (double-cite with identical text no longer collides).

# Survived attacks (calibrating the approve)

reference-style + footnote javascript: targets; pointy-bracket scheme destinations; gfm autolink literals; link-title strings; scheme-ending-.md (resolves to a harmless route, never the scheme); backslash + unicode-dot traversal; CDATA/PI/conditional-comment mXSS; split inline-html; entity/tab/percent-obfuscated schemes; 60-deep nesting; code-fence-language class breakout. Zero executed. Parity red-probed (broke .-drop -> fail; restored); browser-bundle pin meaningful; gate-3 clean (one resolver, engine learns no HTML, micromark ui-only); verify:npm-package green (zero-dep CLI). CI green node 20/22/26 on ecda6e9.
