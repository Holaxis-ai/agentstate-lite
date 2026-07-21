---
type: Context Note
title: 'PR #138 (doc reader PR-1) — build state'
actor: mike/claude
timestamp: '2026-07-21T18:45:14.302Z'
---
# Summary

Unit 2 PR-1 shipped as PR #138 @ ecda6e9 (branch feat/doc-reader-core): the shell doc reader. Renders any bundle markdown doc in the shell origin with the 3-belt security boundary (micromark+gfm HTML-off → mdast-to-React direct, no HTML string/DOMParser/innerHTML → shell CSP script-src 'self'); THE INVARIANT (attributes built from resolveConceptId output, raw href never reaches DOM) pinned red. core links.ts de-node:path'd so the ONE resolver bundles for the browser (gate 3; the review's HIGH-1 build-breaker), parity-pinned two ways. DocPage with kind-declared chips, Cited-by, live refetch, not-found/deleted terminal states; activity rows are buttons into the reader. +24.5KB gz (budget 40); CLI stays zero-dep (verify:npm-package green).

Gates at the SHA: build/typecheck/workspace tests green; core 394, ui 130; e2e 18/18 over the real CLI (hostile doc inert, no dialogs, links + deep links). Both security pins red-probed. Visually smoked light+dark (header card, aligned gfm table, inline task-list, inert raw HTML as mono text). HIGH-RISK review tier: awaiting independent review + adversarial QA on the belts. Then PR-2 figures, PR-3 open-doc.
