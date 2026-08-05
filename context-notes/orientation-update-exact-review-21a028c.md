---
type: Context Note
title: Exact-SHA orientation update review at 21a028c
actor: codex-orientation-exact-review
timestamp: '2026-08-05T21:38:38.532Z'
---
# Summary

**Exact-SHA Review verdict: FAIL — one blocking concurrency finding.**

Reviewed `feat/orientation-update-notice` at exact candidate `21a028c418bf30ecb72aa77a0b06a244aee769d0` against base `164ba7edb89c31678856020ee794f80530e6c276` in a clean detached worktree. The complete 11-file delta was audited. No source, GitHub, PR, merge, or shared-board sync mutation was performed.

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: determine whether this exact N4 candidate safely adds cached, nonblocking release orientation while preserving machine-output stability, privacy, and the one-worker-per-attempt-window concurrency contract. The exact candidate does not yet satisfy the strict worker-start contract.

# Blocking finding

## F1 — expired-cooldown quarantine has an ABA path that can start two detached workers in one attempt window

Type: empirical external red control plus code-traced interleaving.

`claimUpdateLease` first inspects the fixed lease (`packages/cli/src/update-orientation.ts:692`) and, for an expired cooldown, later calls `quarantineMatchingLease` (`:711-717`). That helper unconditionally renames whatever occupies the fixed path to quarantine (`:638-651`) and validates the captured bytes only afterward. If it captured a raced successor, restoration is attempted only when the fixed path is still absent (`:666-673`).

A reachable cooperating-process interleaving is:

1. Cleaner C observes expired cooldown X.
2. Another cleanup removes X; parent A sees the absent path, publishes active token A, and pauses before spawn.
3. C resumes its delayed unconditional rename and captures active A rather than X, reopening the fixed path.
4. Parent B publishes active token B. C detects the mismatch but cannot restore A because B now occupies the fixed path.
5. A and B can both reach `spawn`: the parent path rechecks only cache freshness at `:837-842`; it does not revalidate that its token is still the matching unexpired active record before the spawn at `:849-857`.

A's private child remains authority-safe and exits before U3 because the worker validates token authority. That preserves the one-network-check property, but it does not preserve the approved protocol's literal “at most one eligible process starts one worker per attempt window” claim.

The external expected-red probe replaced parent A's active token after claim and asserted that a parent with withdrawn authority starts zero workers. Exact `21a028c` started one: `actual 1`, `expected 0`; the one-test control exited 1 as intended. The shipped IPC battery covers exclusive initial claim, continuous stale-active replacement, and paused-parent fresh-cache revalidation, but has no expired-cooldown quarantine ABA case.

Required repair: prevent a displaced parent from reaching detached spawn and add a deterministic multi-process expired-cooldown/quarantine-successor test. If the literal OS-process-start bound remains normative, the repair must close the conditional-capture/check-to-spawn race itself, not only rely on the child exiting before network. Otherwise the protocol must explicitly narrow the guarantee to one token-authorized U3/cache worker per attempt window and the tests must assert that exact property.

# Evidence

- Candidate/base/merge-base pins matched exactly; isolated candidate remained detached and clean after review.
- Root build: PASS.
- Exact focused command from the approved plan: PASS, 119/119, 0 failures, 17.8 s when run with loopback permission. The first sandboxed run had three `listen EPERM 127.0.0.1` environmental failures; rerunning the same command outside that restriction cleared all three.
- Expected-red external authority-loss control: RED as intended, 0/1 pass, assertion `1 !== 0`.
- Pre-change provenance sample: the fixed no-bundle/no-notice home TOON+JSON projection from base and candidate was byte-identical; combined artifact SHA-256 `cb80930da0b2c07954ccf4e613d3c35a400a70c7bee21581b1b5325a014e405a`.
- `git diff --check`: PASS; exact delta is 11 files, 2,060 insertions, 28 deletions.

# Survived audit areas

The following did not produce another finding:

- same-handle no-follow/nonblocking bounded reads; 65,536/4,096-byte ceilings; exact owner/mode/type checks;
- complete fsynced temp plus no-replace hard-link initial claim;
- exact active/cooldown schemas, canonical time arithmetic, continuous stale-active-to-cooldown replacement, and worker authority checks before U3/cache commit;
- successful cache publication before matching-active release, detached ignored-stdio/no-wait launch, and spawn error handling;
- recursive exact cache validation, SemVer/cross-field checks, install-command recomputation, and five-field notice projection;
- exact hidden argv routing and silent invalid/no-authority behavior;
- flag/environment/JSON suppression and no-update-state built probes;
- TOON notice placement, generated help/skill agreement, fixed registry request/privacy boundary, and unchanged no-notice home bytes.

# Next gate

Repair is required before adversarial QA. Any repair produces a new exact SHA and invalidates this verdict; re-review should focus first on the new expired-cooldown ABA test and the final authority-to-spawn invariant, then sample the focused battery.

Confidence: 0.98.
