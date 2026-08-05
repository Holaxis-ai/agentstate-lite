---
type: Context Note
title: Product review of N4 implementation plan
actor: codex-orientation-product-architect
timestamp: '2026-08-05T21:00:07.748Z'
---
# Summary

Final delta-only re-review verdict: **APPROVE** for plan `sha256:93142a9c4bce5306038c643015efa1b3d50804ec4d7fc827d4d132f2a6c31c7f` and protocol `sha256:720d83897f47d02770bc575ada66668a1f71ab34bf7625cc2c179d1d7e29fd1d`.

The remaining F1 worker-start counterexample is closed. F2–F6 remain closed. No source was reviewed or changed in this pass; this approval is for the frozen implementation plan and normative protocol.

Ultimate goal: preserve an installable, local-first orientation surface whose background release awareness is bounded and cannot interfere with agent work.

Proximate goal: confirm that the frozen coordination design now proves its strict one-worker-start-per-attempt-window claim before Builder encodes it. Complete.

# F1 final disposition — closed

The amended state machine maintains continuous fixed-path occupancy for the only transition that previously opened a second-start race: recognized stale `active` to its original `cooldown`. That transition is now an atomic replacement, not quarantine/removal. While either the live active record or unexpired cooldown occupies the fixed path, every other eligible process takes render-only fallback, so no second claim can publish in the same attempt window.

The remaining quarantine/removal cases do not reopen that counterexample:

- **Successful worker:** successful cache publication happens before matching-active removal. A process that read stale cache before removal may claim during the later gap, but its mandatory post-claim fresh-cache revalidation releases the unused claim without spawning. Processes that begin later stop at the fresh cache.
- **Unused post-claim cache hit:** the cache is already fresh. Any claimant exposed by removal must perform the same post-claim revalidation and starts nothing.
- **Spawn failure:** no worker started for that claim, so releasing the matching active token permits the window's first successful worker start rather than a second one.
- **Expired cooldown:** the original 24-hour attempt window is over. Its visit is cleanup-only, and acquisition belongs to a later eligible visit/new attempt window.

Exclusive no-replace publication still gives one active-claim winner when the path is absent. The worker's matching-unexpired-token checks before U3 and before cache commit prevent late or superseded workers from performing authority-bearing work. Together, continuous active-to-cooldown replacement and post-claim cache revalidation support the literal one-worker-start bound under the declared process/state model.

# Required proof retained in the plan

The deterministic barrier/IPC tests must exercise both sides of the proof, not only final file contents:

1. concurrent parents yield one atomic claim winner and one spawn;
2. stale active becomes cooldown without an observable absent fixed-path interval or successor spawn;
3. in the paused-parent success interleaving, the late claimant sees the newly published cache after claiming, releases, and records zero spawn;
4. spawn-failed and expired-cooldown cases distinguish zero prior worker starts from a genuinely new attempt window;
5. late private workers lose token authority and perform zero U3/cache work.

# Other findings

F2–F6 remain fully disposed: exact nested schemas and time/size budgets, notice placement, suppression/routing, silent invalid private route, privacy/no-write constraints, and Review-before-QA gate ordering are all explicit. I found no remaining concrete counterexample in the amended delta.

Confidence: 0.96.
