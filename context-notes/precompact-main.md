---
type: Context Note
title: 'Pre-compact handoff: T3.5 H2-H5 clean-room builder R5'
description: >-
  Exact R5 passed both independent boundary gates; one immutable source may now
  be authored under a strict no-execution fence.
actor: codex-t35-option1-orchestrator
timestamp: '2026-08-04T18:49:58.729Z'
---
# Summary

Option 1 remains selected. Exact R5 received independent acceptance PASS (0.99) and adversarial-skeptic PASS (0.97). It keeps R4's one-shot mechanics while limiting admission to cooperative evidence governance under a non-malicious same-UID threat model. A clean-room builder task now authorizes one immutable source file only; no source execution, host process, execution admission, or feature-code mutation is authorized.

# Goals

Ultimate goal: agentstate-lite is durable, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: produce one immutable clean-room R5 H2-H5 probe source under a no-execution fence, then obtain fresh dual exact-byte static review; this serves the ultimate goal by converting an accepted safety boundary into inspectable code without exposing protected host state to unreviewed execution.

# Exact current authority

- Decision: `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`.
- Rejected R1 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`.
- R1 acceptance FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance@sha256:9ab4554b694a5f573fc53d8b22e816e834e8c3999a11136684324ed5abb768f7`.
- R1 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:22c47a846c9dbe7d22742c73babc043469b537caf62c035c2de81682f8b16717`.
- R2 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`.
- R2 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`.
- R3 skeptic PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`.
- R3 acceptance FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`.
- R4 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4@sha256:85cce4a5b61f15713f5ea8a95e481e084cd99729a75ef5abee07ea212fe69023`.
- R4 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:ac378402e60ad29f377aecbca0345f5c61a85a0f7c798601d2bea94c51a55cfd`.
- Whole-system diagnostic through R5: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c`.
- Current R5 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:33db32b3d9088052481301ee5829170c0ddee4f333eabf6b06907818bc951852`.
- R5 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r5@sha256:d2e72878e0e7968daae4daf268d111a0113d6aa09c9d7f4cc6c7dc83be51b050`.
- R5 skeptic PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r5@sha256:b3fc5bb7be1f1fc47baa2ea95bf1703a22e31d31a8d5973138ccc5e64bc5a384`.
- Builder task creation version: `tasks/precompact-v3-t35-h2-h5-probe-builder-r5@sha256:ee61dc75f9e91d2996062daf6957bc91fda1e49fe2c8b581239c8a58bd16b80d`.
- Sole permitted source path: `/private/tmp/aslite-t35-h2-h5-source-r5/h2-h5-probe.mjs`; the 0700 parent exists and is empty at dispatch.
- Accepted T0-T4 feature authority remains clean `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, branch `feat/precompact-handoff-v3`, SHA `36c741a8173832d75d61a7ab138b5219c4415c66`.

# R5 model

- The pinned tmux manpage and v5 evidence make top-level `-N` an explicit option-level architecture premise. A server may disappear after sampled validation, but every allowed client is `-N`, so the race can fail a primary oracle without creating a replacement server. Review rejection of that inference closes option 1; execution may not decide it.
- H2 observation plans are sealed before actions. The controller does not parse action results until a separate stdin-only observer process returns from its fixed schedule.
- A pane may request a marked companion but cannot spawn it. The controller creates it directly and owns its handle from the creation syscall onward. H4 is explicitly scoped to controller-owned declared principals.
- `abort-latch.json` closes creators before descendant-first cleanup; the server-B kill is the final authorized tmux action; `action-fence.json` is written only after that action is terminal, and no tmux action follows it.
- Real-home protected targets, metadata/content bounds, npm metadata-only sentinel, exact feature path/SHA/branch, and nonmutating Git observations are fully pinned.
- Before any probe principal, the in-process controller takes protected P0, runs only preregistered pinned-Git helpers with index and direct-handle guards, takes protected P1, requires P0/P1 equality, and freezes P1 plus the exact clean Git receipts. Git-caused mutation cannot become the accepted baseline.
- After script dual review, orchestration creates one CAS-claimed cooperative execution-admission Task binding the exact script, campaign id, and initially absent root. Any result consumes it. BLOCKED exists only before the first Git helper; every later defect is FAIL. A new admission requires a separate reviewed rebaseline Decision and cannot silently adopt changed state.
- The admission Task, exported lineage, actor labels, and recorded user direction govern conforming orchestration and accepted evidence; they do not authenticate actors, create a cryptographic capability, or physically prevent a malicious same-UID principal from forging metadata or bypassing the runner.

# Next dependency and prohibitions

The clean-room builder may author and statically inspect the sole source path but must not invoke Node on it, including `node --check`, import, parse, test, or dry run. On builder completion, fresh isolated acceptance and skeptic reviewers must PASS the exact source digest before any cooperative execution-admission record may be created. No host probe, tmux, Git helper, Claude/API/auth, Plan replacement, candidate freeze, R0/Q0/L0-L3 advance, G0 acceptance, or feature-code mutation is admitted now.

# Operating rule

Process the builder result immediately. A builder-complete result advances only to exact-byte static review; any source change after review dispatch invalidates both reviews. A static-review FAIL requires a new immutable source revision and fresh dual review. Only exact-source dual PASS can open one execution-admission dependency.

# Loaded skills

`holaxis-self-awareness`, `holaxis-cognitive-ecosystem`, `agentstate-lite`, and `holaxis-orchestrator`.
