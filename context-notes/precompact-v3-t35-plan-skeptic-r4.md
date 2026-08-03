---
type: Context Note
title: Revision 3 T3.5 Plan R4 adversarial skeptic review — FAIL
tags:
  - review
  - precompact-v3
  - skeptic
actor: codex-precompact-v3-t35-skeptic-r4
timestamp: '2026-08-03T22:24:11.000Z'
---
# Summary

Status: complete

Verdict: FAIL

Confidence: high

Reviewed exact Plan R4 `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812` against the exact accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`, accepted plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`, host note `sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`, current orientation `sha256:f6315314629204b35fa0cd8bc3b5890ae5995a82b7e84c0ac204ff3c9b45375b`, product R3 FAIL `sha256:1632c52273ab9a4aafb6d7bd342dee6f8bfc82ca14b77097381763c1e4a2c934`, and skeptic R3 FAIL `sha256:a348bf7f680bb089a48a919dbcbf6ebaf865d876198b105dfa18ebdcdd27507d`. This review was read-only: no Claude, tmux, auth, or repository code mutation.

F0 is not authorized. P35 remains failed until a new exact Plan version closes both blockers below and receives independent exact-version review.

## Blocking findings

1. `RESERVED_NO_SERVER_RECORD` cleanup can certify absence before a later spawn. R4 says cleanup reads the durable reservation without the mutation lock and, when the exact socket is absent, treats termination as already satisfied; only afterward does it acquire the campaign lock and CAS-record cleanup. R4 does not require `stage run` to obtain a fresh launch permit, recheck a nonterminal reservation under the same serialization point, or prove that no launch-capable process remains before cleanup records absence. Therefore this allowed interleaving exists:

   - `stage run` has durably reserved state `RESERVED_NO_SERVER_RECORD`, with the socket still absent;
   - cleanup reads that reservation and observes the socket absent;
   - cleanup concludes termination is satisfied;
   - the still-live/stalled stage runner spawns pinned tmux on the reserved socket before or after cleanup's bookkeeping CAS;
   - the runner is SIGKILLed before socket observation/PID capture/server-record CAS;
   - the socket/server can appear after cleanup's absence proof, including after two cleanup passes if spawn was stalled across both.

   Socket absence is therefore not proof that the reserved launch capability has been extinguished. The plan's listed `tmux spawn before socket` killpoint does not close the race; it is exactly the gap that can be mis-certified. This can orphan an auth-bearing tmux/Claude process while the ledger says cleanup completed, violating sections 206-212 and measurable criterion 17.

   Required repair: introduce an executable-enforced, crash-recoverable launch/reap state machine with a terminal spawn fence. Cleanup must atomically revoke an uncommitted reservation before treating absence as clean, and `stage run` must be unable to spawn after that revocation. Once launch is committed, cleanup must not use socket absence alone; it must durably identify and extinguish every process capable of creating the socket. A practical construction is an auth-free, pipe-gated launcher whose PID/start is durably recorded before the launch gate and auth are delivered; cleanup kills/verifies the launcher or exact server and revalidates absence before recording cleanup. Whatever construction is chosen needs a scheduler test for the exact absence-observed/spawn-afterward interleaving.

2. The strict pinned `/bin/ps` grammar rejects valid output on the installed Darwin host. R4 requires every success row to have a leading space before the exact decimal PID. The exact pinned command was exercised read-only under the required environment and returned a valid five-digit PID row beginning directly with the digit:

   `93346 Mon Aug  3 22:23:19 2026         0 /bin/ps\n`

   There is zero leading whitespace because the PID fills Darwin ps's five-column PID field. By contrast PID 1 was padded (`    1 ...`), and a valid absent PID returned exit 1 with zero stdout as expected. Thus a parser implementing R4 literally rejects a live five-digit owner on this machine and makes lock acquisition/recovery fail closed for ordinary current PIDs. This is not only an implementation detail: the Plan pins the wrong exact row grammar.

   Required repair: specify and test the actual Darwin format as a width-sensitive PID field (for example zero-or-more leading ASCII spaces followed by the exact stored decimal PID, followed by required field-separator whitespace), while retaining exact single-row/LF/stderr/exit/uid/command/start checks. Add fixtures for 1-, 4-, and 5-digit PIDs plus exact installed-host smoke evidence. Do not relax later separators or permit extra rows.

## What survived adversarial review

- Exact-full-identity, corrected jq, promote-collision, and `SessionStart(source=compact)` as the supported injection rail remain sound.
- Candidate freeze has one executable authority, an absent target leaf, exactly one build/pack, manifest-last publication, exact tree/modes, and interruption refusal.
- The shared npm validator correctly closes all seven install-triggered script keys plus implicit `binding.gyp`, permits `prepublishOnly`, and now makes the defensible offline/no-network-dependency claim rather than claiming no network attempt.
- The immutable owner-file-to-hard-link lock construction, dev/ino/digest/mode/nlink validation, release discipline, history-before-current ordering, orphan handling, and incomplete-history quarantine are coherent apart from the pinned ps grammar blocker.
- L0's single live-attempt serialization and terminal sibling policy are coherent apart from the tmux launch/reap race.
- The sequential wrapper now has the required child stdin finish, stdout/stderr EOF, `close`, exit/signal/timeout/overflow predicates; closed child env; fresh-generation causation; physical byte/version proof; expected-before guarded corruption; separate fault record; settings CAS restore; status-ready proof; and tainted-journal disposition.
- Auth possession/inheritance is stated honestly; the child strips auth; the inheritance canary is nonsecret; privacy, protected-state, replay, assertion/attestation, and red-first gates do not expose another blocker in this pass.
- I found no remaining second production authority or contradiction that independently blocks R4 beyond the two findings above.

Proximate goal outcome: independently determine whether exact Plan R4 is safe to release into F0; it is not, because its process-lifecycle proof and exact ps grammar are unsound. This serves the ultimate project goal by preventing a candidate acceptance rail from certifying cleanup or lock safety it has not actually established.
