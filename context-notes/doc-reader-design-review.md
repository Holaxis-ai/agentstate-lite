---
type: Context Note
title: Doc-reader pre-build review — APPROVE-WITH-CHANGES folded (rev 2)
actor: fable-reviewer
timestamp: '2026-07-21T18:26:39.421Z'
---
# Summary

Independent Fable pre-build review of designs/doc-reader + plans/doc-reader-build: APPROVE-WITH-CHANGES, all changes folded into rev 2 of both docs the same day. Third consecutive pre-build round to catch real findings before code.

# Findings (as accepted)

1. HIGH-1 empirical — the planned 'mechanical' core links subpath export BREAKS browser bundling: links.ts imports node:path (path.posix.* at lines 75/101/102) and esbuild platform:browser fails to resolve it. Fix is a gate-3 decision made in rev 2: de-node:path links.ts itself (pure posix string logic) so the ONE resolver runs in both runtimes, with a node-browser parity test; treated as high-risk surface (the resolver IS the scheme-smuggling defense).
2. HIGH-2 — the load-bearing XSS invariant was unstated: micromark does NOT sanitize URLs; safety exists only because attributes are BUILT from the resolver's output. Rev 2 states it as PR-1's first pinned-red invariant with a first-class scheme battery (javascript:/data:/vbscript:, entity-obfuscated, whitespace-split).
3. MEDIUM-3 — the HTML-string→DOMParser intermediate WAS the mXSS surface and is avoidable: rev 2 renders AST/mdast→React directly (no HTML string, no DOMParser, no innerHTML; dangerouslySetInnerHTML grep-gated). DOMPurify adjudicated NOT needed (no innerHTML sink). The shell's own asset CSP (script-src 'self') credited as the real third belt.
4. MEDIUM-4 empirical — gfm was missing while our own shipped authoring contract carries 11 table rows; rev 2 adds gfm to scope, allowlist, battery.
5. MEDIUM-5/6 — figure lifecycle vs the 120s nonce TTL + 256-launch cap (sized for one-frame-at-a-time): rev 2 specifies re-mint-on-mount, lifecycle/cap tests, and PR-2's focused lifecycle-adversarial check; plus the figure path needs its OWN blob-key resolver + client-side registration gate (resolveConceptId is .md-only — the plan had conflated a server 403 with the client render decision).
6. LOW-7/8/9 — body-size cap + bounded walk stated (pathological docs land on the trusted tab); size budget restated in GZIP terms (≤40KB gz); back-to-home affordance + not-found state added; raster images made a CONSCIOUS v1 deferral (decision 5), not an accident.

# Survived attacks

resolveConceptId neutralizes scheme smuggling (traced: javascript: → null → inert; traversal ids re-validated server-side by assertSafeConceptId); React attribute/child escaping; one-parser/one-runtime respected (no server/core markdown path, no viewer reintroduction); the one gate-3 tension was HIGH-1's fix itself, resolved in favor of the one shared resolver.
