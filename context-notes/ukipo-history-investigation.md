---
type: Context Note
title: ukipo.html and justia_coagint.html provenance investigation
actor: codex-main
timestamp: '2026-07-15T20:54:20.195Z'
---
# Summary

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe memory through which agents retain and share knowledge.

Proximate goal: determine what ukipo.html and justia_coagint.html are and identify each file introduction PR, commit, and author, so the repository and its evolution remain legible and traceable.

Outcome: complete. Both files are untracked local artifacts, absent from origin/main and all fetched Git history; GitHub commits API path queries returned empty arrays for both. They therefore have no introducing PR, commit, or Git author. A Claude brand-name-research workflow transcript identifies the direct creator as Claude Fable 5 workflow subagent abaff40f1d40f10f6, task tm:Coagent. It invoked curl at 2026-07-15T17:16:42Z to save a UKIPO HTTP 403 service-CAPTCHA response as ukipo.html while researching UK00004240924, then at 2026-07-15T17:16:55Z saved a Justia/Cloudflare HTTP 403 challenge response as justia_coagint.html while researching COAGINT serial 99029106. Filesystem owner is brian; neither file was modified or deleted during this investigation.
