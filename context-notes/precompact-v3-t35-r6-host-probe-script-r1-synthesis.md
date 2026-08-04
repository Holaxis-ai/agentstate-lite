---
type: Context Note
title: Revision 3 T3.5 R6 host-probe script R1 review synthesis — FAIL
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T01:07:48.631Z'
---
# Summary

Frozen strict host-probe script `host-probe.mjs@sha256:6108e6102f1257274bcc4cd9dd82c38b9490806fed55de8f1a7f71f716bf823e` is **FAIL — DO NOT EXECUTE** after independent product/acceptance and adversarial-skeptic static review. No run root exists and no tmux, Claude, auth, network, repository, bundle, Plan, task, worktree, or global mutation occurred. The five-question boundary remains accepted; repair is limited to controller safety, structural isolation, and fail-closed evidence.

Exact reviews:

- acceptance `context-notes/precompact-v3-t35-r6-host-probe-script-acceptance@sha256:d5309ef9c566fcbddfd48ca07a5a12af86657c3330ff12bfc51ea6f8d9d193fe`;
- skeptic `context-notes/precompact-v3-t35-r6-host-probe-script-skeptic@sha256:8e40c8d4e567d75ebe8136ac7da55d43c6214ec8acaed33c6fdd22d4a15b7a05`.

## Required minimum repair

1. Pre-register a controller-only cleanup descriptor before every server/control/requester/fixture/pane/detached-child creation or release. On any wait/parse/assertion failure, teardown must harvest and validate any create-only gate/pane/child record that exists and safely discover the test-owned principal without promoting safety-only knowledge into H1-H5 evidence.
2. Make all-handle teardown transition-aware: the same exact PID/start/uid/PGID may be pinned Node or the exact reviewed tmux exec target. Accept only that closed Node→tmux transition; never accept arbitrary comm drift. Reap and prove every handle/resource PID and full private group absent, including controls, requesters, fixture client, pane, marked child, and server.
3. Do not unlink any socket while any planned/recorded creator or group is unresolved. Teardown must retain raw pre-signal, signal/fallback, PID/group absence, socket validation/unlink, and a final failure-path process audit. Ambiguity preserves FAIL and the socket/evidence root rather than guessing.
4. Make Git observations genuinely nonmutating: `GIT_OPTIONAL_LOCKS=0`, disable fsmonitor/untracked cache/preload index through exact command configuration, disallow external diff/textconv surfaces, and retain exact raw receipts. Worktree comparison cannot be the only proof that the observer itself did not update index metadata.
5. H2 must receive a structurally narrowed immutable object containing only post-client-absence fresh PID/group/socket facts. Hidden action receipts stay in a separately namespaced controller-only record and are unreachable from H2's parameters/closure.
6. Retain simultaneous fresh ps rows proving both H3 requester identities live before owner release.
7. Fail closed on every action receipt: both EOFs, expected close code, null signal, bounded output, exact stderr/stdout shape, and honest sampled/unsampled tmux phase. A missing mandatory terminal file/index/controller-teardown write or expected contract-digest mismatch prevents PASS.
8. Keep exactly H1-H5, no lifecycle/CAS/lease/scheduler/schema/verdict expansion, no execution, and the strict <=800 nonblank/noncomment source-line guard. Freeze new script/contract digests and repeat both independent static reviews.

[tracked by](../tasks/pre-compact-multi-session.md)
