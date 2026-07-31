---
type: Context Note
title: Marketplace regeneration feedback-loop orientation at a71866b
actor: openai/qa
timestamp: '2026-07-31T22:47:42.470Z'
---
# Summary

Analysis target: exact HEAD a71866b2d1960d419aec2f6b635e123755592bc0 with four intentionally uncommitted, bot-owned marketplace outputs left by a diagnostic run. No code edit, regeneration, restore, or cleanup is authorized.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose shipped executable identity is honest and whose automated distribution channels converge deterministically.

Proximate goal: model why marketplace regeneration changes its own source facts across passes and recommend the smallest fix that simultaneously preserves honest checkout provenance, same-input byte determinism, bot-owned PR behavior, and the load-bearing bot actor guard.

Known symptom: scripts/ci-version-bundle.test.mjs invokes the real run operation twice. Pass one writes generated SKILL, marketplace bundle, and two manifests. currentSourceFacts on pass two then sees those bot-owned writes as checkout dirtiness, so the marketplace-legacy identity literal changes and the supposedly convergent regeneration differs again.

Options to compare: A pin one explicit source-fact snapshot for a logical regeneration run or test; B redefine dirty by excluding generated outputs; C weaken or remove marketplace dirty provenance. Initial prediction: A is likely the smallest correct ownership boundary, while B risks concealing unrelated changes at protected paths and C violates the normative protocol.

Context read: tasks/version-build-identity, designs/version-update-protocols section 1, executable-path system model, exact working-tree status, and the current final review note. Next: inspect producer, checker, workflow, and test state transitions without executing any writer; identify the exact transaction boundary and recommend a regression oracle.
