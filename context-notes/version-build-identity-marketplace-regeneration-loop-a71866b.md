---
type: Context Note
title: >-
  Marketplace regeneration feedback loop at a71866b — recommend explicit source
  snapshot
actor: openai/qa
timestamp: '2026-07-31T22:53:41.092Z'
---
# Summary

Recommendation: choose A. Treat source facts as an immutable build input sampled once at the outer regeneration boundary, before any generator writes, and propagate that exact object through run -> regenerateArtifacts -> buildPluginBundle -> buildCliBundle. Reuse the same snapshot across the real two-pass convergence proof.

This is the smallest fix that preserves all four required invariants: exact checkout provenance, deterministic bytes for identical inputs, bot-owned output behavior, and the load-bearing bot actor guard. B changes the meaning of dirty; C discards known evidence.

Analysis target was exact HEAD a71866b2d1960d419aec2f6b635e123755592bc0. No code, generated output, manifest, or test file was edited by this analysis.

# Whole loop

Let H be the clean human-authored main commit that triggers the workflow.

1. The non-bot actor guard admits the job and checkout pins current main H.
2. run snapshots committed artifact bytes, but currently does not snapshot source facts.
3. regenerateArtifacts calls buildPluginBundle; buildCliBundle then samples currentSourceFacts from ambient git state and embeds H plus dirty false.
4. The bundle, SKILL, and references are generated. If they differ, run bumps both manifests.
5. The workflow sees the bot-owned output changes, commits them together as bot commit B, and pushes.
6. B has a new HEAD. The actor guard suppresses the workflow triggered by B. Without that guard, a build at B would embed B rather than H and produce another bot commit indefinitely.
7. If a push is rejected, the workflow hard-resets to the new main tip before retrying. Each retry therefore starts a new clean source transaction and must sample a new snapshot.

The failing real integration test performs a different sequence without a reset:

- pass one starts with source facts H,false and writes generated outputs/manifests;
- pass two is still at H but ambient git status is now dirty solely because pass one wrote its outputs;
- buildCliBundle resamples H,true, so the embedded literal and bundle bytes change;
- the second run reports changed again and may bump again.

That is not evidence of nondeterministic compilation. The two passes were given different source-fact inputs. A third ambient pass would likely settle at H,true, but that is neither the desired proof nor acceptable double-bump behavior.

# Option comparison

## A — explicit fixed source facts: recommended

Define the regeneration transaction source snapshot before any output mutation. run accepts an optional explicit source value for testability and otherwise calls currentSourceFacts exactly once at entry. It passes the same validated value to regenerateArtifacts, buildPluginBundle, and finally buildCliBundle.

The real convergence proof captures one source snapshot before the first run and passes it to both run calls. The first pass may update artifacts and bump once; the second rebuild receives the same commit and dirty value, reproduces identical bytes, reports changed false, and leaves manifests unchanged.

Honesty is preserved:

- a clean bot checkout records H,false;
- a developer checkout already dirty before the transaction records H,true;
- unknown git evidence remains null;
- generator outputs created after the snapshot do not retroactively redefine the source input that produced them.

The same rule should be used by the standalone committed-bundle writer and checker: snapshot once before prepareCliBundleInputs or any other writer and pass explicitly. Low-level ambient fallback may remain for isolated callers, but an orchestrator must not resample during one logical transaction.

Minimal API shape:

- run({ ..., source = currentSourceFacts() })
- regenerateArtifacts(paths, { source })
- buildPluginBundle({ source })
- buildCliBundle(outfile, { artifactChannel: marketplace-legacy, source })
- check-skill-bundle captures source once before preparation and passes it to buildCliBundle

Fake regenerators may ignore the extra argument. The real test passes one source object to both invocations.

## B — exclude generated outputs from dirty: reject

Filtering the two manifests, generated SKILL, bundle, and references out of git status would make the second ambient pass look clean, but it changes the normative public fact from exact checkout dirty state to relevant-input dirty state.

That creates three costs:

- a checkout can visibly be dirty while identity claims dirty false;
- manual or corrupted edits at excluded bot-owned paths become invisible provenance;
- correct filtering requires path-sensitive porcelain/pathspec logic and a channel-specific dirty definition shared across producer and checker.

It also does not eliminate the HEAD feedback after bot commit B. B still differs from H, so the actor guard remains necessary. B solves the test by redefining truth rather than fixing input ownership.

## C — remove, null, or force-false marketplace dirty: reject

Forcing false is a lie on a dirty source build. Forcing null discards evidence git can prove. Either violates the normative marketplace requirement for exact checkout commit and dirty state and weakens diagnostics for manual or compromised regeneration.

Runtime artifact SHA would still distinguish bytes, but source provenance is a separate promised fact. C also does nothing about HEAD changing from H to B, so it cannot replace the actor guard.

# Producer, checker, and at-rest semantics

The bot artifact is built from H and committed by B. It should continue to declare H,false: H is the source transaction that produced its bytes; B is the wrapper commit containing generated outputs.

Consequently, a naive checker rebuilding at clean bot commit B with ambient B,false cannot byte-match the artifact stamped H,false. That is an intentional consequence of the actor-guarded workflow, not something to hide with B or C.

The smallest current fix should make checker source sampling explicit and document its mode as fresh build for the supplied/current source facts. Within the producer transaction and convergence test, supply H,false to both writer and checker/builds. If a future at-rest checker must validate bot commit B, it needs a separate provenance-aware mode: verify the declared H relationship to B and that B changed only allowed bot-owned outputs, then rebuild with the verified H facts. It must not silently trust the artifact or rewrite ambient dirty semantics. That extension is not required to close the current feedback test.

PR behavior remains unchanged: ordinary PRs do not hand-regenerate or bump bot-owned outputs, the root PR gate excludes plugin drift, and the bot regenerates after merge. Explicit source injection does not move ownership into PRs.

# Required regression proof

1. In the real repo-tied convergence test, capture source = currentSourceFacts before pass one; call run with that identical source for both passes.
2. Assert pass two is changed false and both manifest versions equal their post-pass-one values.
3. Make run plumbing observable: a fake or spy regenerate receives the exact source snapshot passed to run.
4. Retain byte equality for two marketplace builds given the same explicit source facts.
5. Retain a dirty-true marketplace fixture so the fix cannot collapse to false or null.
6. Retain the workflow test that asserts github.actor is not github-actions bot. State in its failure message that exact HEAD provenance makes the guard load-bearing.
7. Keep the retry reset-before-rerun behavior; every retry must resample only after reset to the new clean tip.

# Decision

A fixes the architectural ownership error: ambient repository state becomes an input sampled by the transaction owner, not a hidden dependency re-read by a low-level producer after the producer has changed that state. It is proportional, testable, and preserves the normative protocol without creating a second dirty definition.

[task](../tasks/version-build-identity.md)

[normative identity protocol](../designs/version-update-protocols.md)

[executable identity system model](version-build-identity-executable-path-system-model.md)

[QA-passed identity commit](version-build-identity-qa-723ea52.md)
