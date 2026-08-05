---
type: Context Note
title: >-
  Review of PR #209 at 8056f52 — approved pending green 22/26 gates; fail-closed
  design verified
actor: claude/reviewer
timestamp: '2026-08-05T22:57:05.179Z'
---
# Summary

Independent review of PR #209 (`feat/orientation-update-notice`) at exact SHA
`8056f525766551556dedb31928d09e821fc4a58e`. APPROVED — no defects found; one design trade-off
noted, one CI caveat. High-risk-tier review (concurrency, detached process spawn, private-state
writes, network-adjacent): full read of the 959-line module, isolated worktree at the SHA,
suites re-run, plus independent end-to-end probes with the built CLI.

CI caveat at review time: node-20 engines smoke green on the exact SHA; node 22/26 gates still
PENDING. My approval is conditional on those completing green (the same suites passed locally in
the worktree).

# Verification performed

- update-orientation suite 22/22 in the worktree, including the real multi-process barrier/IPC
  tests (concurrent hard-link claim winner, stale-active replacement, expired-cooldown ABA,
  paused-parent recheck) — the exact races I intended to probe are already deterministic tests.
- home + session-start suites green.
- Independent built-CLI end-to-end probe: seeded a valid cache via the module's own serializer
  in a scratch HOME — TOON shows the five-field update_notice immediately after identity with
  the exact npm command; `--json` and `--no-update-check` outputs contain no notice; chmod 0644
  on the cache (tamper) -> notice gone, exit 0, and no lease/spawn work (unsafe fails closed
  before the claim). No probe run touched the network.

# Assessment

The safety design is genuinely strong:

- Fail-closed private state: O_NOFOLLOW handle-based reads, owner+mode checks, size caps,
  strict UTF-8, exact-key schemas, canonical-instant round-trips. Every "unsafe" outcome stops
  ALL work including the lease claim.
- The claim primitive is `linkSync` (EEXIST-atomic); stale conversion and cooldown cleanup use
  observed-record compare + quarantine with restore-on-race; the spawn-authority fix commit
  closes the ABA window (revalidate the exact token immediately before spawn, and again inside
  the atomic writer's beforeCommit so the rename aborts on withdrawn authority).
- Prompt-injection hardening worth naming: the notice reaches AGENT ambient context
  (SessionStart TOON), and `parseSuccessfulCheck` requires the command to equal the exact
  `npm install --global @holaxis/aslite@<strict-semver>` template, versions strict semver,
  metadata control-char-free and bounded — a poisoned registry response cannot place arbitrary
  text into agent context through this surface.
- Render-path guarantees hold: notice only from a fresh validated cache; the worker is detached
  with stdio ignore; JSON/suppressed paths bypass the whole owner; suppression is exact-token +
  env-key-presence (including empty values and CI).

# Trade-off noted (documented, not a defect)

A failed or offline refresh transitions the lease to a cooldown that spans the full 24h TTL —
one bad network moment means no retry (and possibly no notice) for a day. Deliberate
anti-stampede choice, and the help text says "once per 24-hour attempt window" honestly.

# Minor observations

- The hidden `__update-refresh-v1` route is absent from KNOWN_COMMANDS/help by design; a user
  typing it gets silent zero-work. Acceptable for a private route; a future `doctor` surface
  could expose lease/cache state for support.
- `hasExactKeys`/strict parsers make the cache schema effectively frozen; any future field
  addition must bump UPDATE_CACHE_SCHEMA or every existing cache invalidates — fine, but worth
  remembering at v2 time.

Worktree removed; probes cleaned; no network touched during review.
