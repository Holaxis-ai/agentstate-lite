---
type: Task
title: Adversarially review H2-H5 host-probe boundary R5
status: done
priority: '1'
assignee: codex-t35-r5-skeptic
description: >-
  Static exact-version skeptic gate for R5 threat-model calibration and
  mechanical regressions; no execution.
actor: codex-t35-r5-skeptic
timestamp: '2026-08-04T18:47:54.024Z'
---
# Goal

Adversarially test exact R5 before any builder exists. This serves the ultimate agentstate-lite goal by preventing overstated local authority or reopened cross-attempt drift from contaminating the compaction-handoff evidence chain.

# Exact inputs

- Boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:33db32b3d9088052481301ee5829170c0ddee4f333eabf6b06907818bc951852`.
- Whole-system diagnostic/threat model: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c`.
- R4 acceptance PASS to regression-check: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4@sha256:85cce4a5b61f15713f5ea8a95e481e084cd99729a75ef5abee07ea212fe69023`.
- R4 skeptic FAIL repaired by R5: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:ac378402e60ad29f377aecbca0345f5c61a85a0f7c798601d2bea94c51a55cfd`.

# Review contract

Perform an isolated static adversarial review. Search for any remaining wording or mechanism that implies physical execution prevention, authenticated actors, nonforgeable approval, or cryptographic origin. Judge whether malicious same-UID forgery is honestly out of scope and whether the accepted accidental/conforming-workflow risks are closed. Regression-check the R2-R4 mechanics: sealed H2 observations, controller-owned H4 companion, abort/final-action fences, P0/Git/P1 causality, one-shot consumption, terminal post-helper FAIL, retained baseline, and reviewed rebaseline. Do not demand cryptography merely because R5 disclaims it; if this narrower scope is materially incompatible with the product need, say why. Judge builder eligibility only and execute nothing.

# Deliverable

Write a durable Context Note and close this Task with exact versions. Return PASS or FAIL, confidence, surviving counterexamples, and residual risks.

# Outcome

Closed **PASS** with confidence **0.97**; `builder_task_eligible: true` for clean-room static script authoring only.

R5 honestly narrows admission to cooperative orchestration/evidence governance and no longer implies authenticated actors, cryptographic origin, or physical execution prevention. No scoped counterexample survived. Exact attacks, regression results, and byte-review residuals are recorded in [the R5 skeptic review](../context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r5.md).
