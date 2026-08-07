---
type: Context Note
title: npm quickstart integration acceptance critique
actor: codex-quickstart-acceptance-critic
timestamp: '2026-08-07T17:40:58.321Z'
---
# Summary

Acceptance review returns **CHANGES_REQUIRED**: retain the installed first-value journey, but make the default package unqualified, preserve `--scope user`, emit create-only commands that work from a normal non-empty project, avoid a multi-`npx` moving-tag workflow, and retain PR #212's installed production-lock evidence.

# Verdict

**CHANGES_REQUIRED** before the integration plan is handed to Builder.

The parked checkpoint has the right product unit—one installed artifact reaches first useful state through existing primitives—but its acceptance contract currently bakes in two misleading public paths and misses one executable-command failure. These are narrow reconciliation corrections, not a request for guide curriculum, release automation, update-selection, or marketplace work.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: freeze a truthful, executable npm first-value contract for the rebased quickstart while preserving merged install vocabulary and create-only safety. This serves the ultimate goal by ensuring a newcomer can follow the front door without selecting the preview channel accidentally, mis-targeting their project root, or depending on multiple moving package resolutions.

# Product outcome and retained boundary

Keep the checkpoint's core outcome:

1. Install one exact npm artifact once.
2. In a bundle-free project, inspect home and the offline Recipe inventory without project-tree writes.
3. Create a genuinely new conventional `.agentstate-lite` bundle with `init --create-only --recipe work-tracking`.
4. Create one valid attributed Task.
5. See it in `doc read`, `list`, home, and kind-clean status.
6. Explain that the user supplies intent/source material and an agent authors the bundle through CLI primitives.

Keep out of scope: `aslite guide`, guide curriculum/Views, release automation, version selection mechanics, live publishing, marketplace retirement, skill/hook mechanics, and unrelated documentation cutover.

# Required acceptance corrections

## 1. Default installation must not teach `@next`

Live registry evidence on 2026-08-07 is `latest = next = 0.1.0-pre.3`, but the ratified release contract gives the tags different meanings: `latest` is the supported default and `next` becomes preview-only once stable exists. Therefore the default quickstart must use the unqualified package:

```sh
npm install -g @holaxis/aslite
```

An unqualified one-command `npx -y @holaxis/aslite ...` may remain as an explicitly labeled trial. Do not put `@next` in the default install or quickstart. This does not change release policy or tags; it merely projects the already-decided default correctly.

The npm README's parked five-command `npx -y @holaxis/aslite@next ...` flow must not survive. Each invocation resolves a mutable tag independently, so it is not one exact installed-artifact journey and may cross versions. Install once, then execute the same `aslite` chain used by the root README and package verifier.

Current public `pre.3` predates the merged create-only code. The PR/package proof is source-candidate evidence, not a claim that the live registry package already supports this journey. The PR handoff should state that a later release proof owns registry-to-install evidence.

## 2. Preserve PR #211's canonical public scope

Every retained skill/hook install example must use `--scope user`. `global` may be accepted only as the silent compatibility input implemented by PR #211; rebasing the checkpoint must not reintroduce it into either README, verifier expectation, receipt, or help assertion.

## 3. Generated create commands must point at a genuinely creatable target

The parked no-bundle home and Recipe rows add `--create-only` without changing the default target. With no `--dir`, `init` targets the current directory. That works only when the directory is empty; in the common case—an existing non-empty project with no bundle—the advertised command refuses. The acceptance plan currently tests only an empty discovery directory and therefore misses the normal project-root case.

The no-bundle create path should name the conventional new target, e.g.:

```sh
aslite init --create-only --recipe <name> --dir .agentstate-lite
```

or another explicitly approved genuinely-new target. Add a non-empty, bundle-free project regression that executes the emitted command character-for-character and proves it creates only the intended bundle, not a root `index.md`.

Recipe inventory over an already-open bundle must not advertise a `create_bundle` command targeting that same existing bundle: after the parked change it is guaranteed to fail. Prefer omitting `create_bundle` when `applied !== null` and retaining the actionable `add_to_bundle` command. This narrows the checkpoint rather than expanding scope.

## 4. Attribution must be honest in public copy

The deterministic verifier may use `quickstart-agent`, but public copy must say to replace that tutorial label with the actual agent identity (or otherwise explain that actor labels are advisory). Do not silently teach every user to record a fictional shared actor. Persistent actor configuration remains a separate task.

## 5. The installed proof must compose, not replace, PR #212 evidence

Reconciliation must retain the exact installed production-lock barrier, no-delete/create-only refusal proof, source identity, retained-tarball path, and package contract now on `origin/main`. The quickstart should replace the old blank-init-plus-`recipe add work-tracking` happy path with direct create-only work-tracking init, but it must not delete or weaken the independent holder/contender lock proof.

# Revised actionable acceptance criteria

1. Both README quickstarts project the supported default package with unqualified `@holaxis/aslite`; `@next` is absent from default quickstart/install commands. Any npx example is one clearly labeled unqualified trial, not a multi-command mutable workflow.
2. Both README install examples that install integrations use `--scope user` only.
3. No-bundle home and Recipe inventory are read-only in an existing non-empty project and emit a create-only command for a genuinely new conventional target.
4. The emitted no-bundle Recipe create command is executed character-for-character in a scratch non-empty project and succeeds; a second execution refuses with exit 5 and byte-preserves the bundle.
5. Existing-bundle Recipe inventory provides `add_to_bundle` and does not provide a guaranteed-dead same-target `create_bundle` command. Remote inventory remains add-only.
6. The installed tarball is installed once; that exact executable performs home -> recipes -> direct create-only work-tracking init -> attributed Task -> doc/list/home/status. Home shows the Task and status remains kind-clean.
7. Public copy explains the human/agent authoring handoff and that `quickstart-agent` is an example advisory actor label.
8. The verifier returns a named quickstart receipt and retains all current-main identity, retained-artifact, production-lock, refusal/no-delete, skill/hook, and package allowlist assertions.
9. No guide, release workflow, publishing, update, marketplace, hook/skill behavior, or unrelated product surface changes enter the diff.

# Minimum Review evidence

- Review the exact rebased SHA against `origin/main` (`531c9df8...`), not stale local `main` (`28cbf91...`).
- Audit the conflict resolution in both READMEs, `update-orientation.test.ts`, and both verifier files specifically for `user` scope and the PR #212 production-lock barrier.
- Inspect/execute the exact documented `aslite` chain from the installed tarball; do not substitute semantically similar commands.
- Sample the non-empty project emitted-command regression and probe it red against checkpoint `6e2cfaa`.
- Confirm the diff remains the quickstart unit and contains no release/guide mechanics.

# Minimum adversarial QA evidence

- From an isolated installed tarball and non-empty bundle-free project containing unrelated files, prove home/recipes create no project files; execute the emitted create command; create/read/list the attributed Task; verify home/status; retry create-only and byte-compare the bundle/unrelated files.
- Prove existing-bundle and remote Recipe rows never offer the dead same-target create path.
- Audit that the deterministic production-lock holder/contender proof still reaches the real installed lock and that only one nested contender publishes.
- Full `npm run check`, exact package verification, `git diff --check`, clean worktree, and Node 20/22/26 hosted CI on the final SHA.
- Defer live unqualified registry-install proof until the new source candidate is actually published; do not mislabel local-tarball evidence as registry evidence.

# Evidence inspected

- Parked checkpoint `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef` and its nine-file parent diff.
- Current remote main `531c9df8ac7299f662d87862d270c7eb63f7dfab` (local `main` is stale at `28cbf91...`).
- PR #211 task/review and canonical `user` acceptance.
- PR #212 installed verifier including the real production-lock preload barrier.
- Approved onboarding plan, quickstart task/plan/orientation, first-use feedback, release contract, and pre.3 default/clean-install records.
- Live npm dist-tags: `latest` and `next` both resolve to `0.1.0-pre.3` at review time.
