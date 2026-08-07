---
type: Context Note
title: 'PR #212 binding-observer architecture reorientation'
description: >-
  Three-cycle diagnostic reorientation: explicit binding-target absence,
  stable-shape, and transition taxonomy before any further fix.
actor: codex-pr212-orchestrator
timestamp: '2026-08-07T16:18:37.960Z'
---
# PR #212 binding-observer architecture reorientation

# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: replace the repeated binding-target edge patches with one explicit, phase-aware observation model that preserves established binding compatibility while failing closed on demonstrated filesystem uncertainty. This serves the ultimate goal by making unattended create-only onboarding predictable without further review-by-whack-a-mole.

## Why reorientation is required

The create-only safety area has now crossed the three-cycle review cap:

1. `12dd30b` fixed unsafe rollback but accepted target disappearance, misstated double failures, drifted binding symlink behavior, and lacked attributable production-lock evidence.
2. `ab2d97f` fixed those cases but treated post-realpath binding-target disappearance as absence, retained incomplete masked-error provenance, and kept the installed proof scheduler-dependent.
3. `61ff794` fixed those cases, but introduced a stable-shape asymmetry: a direct regular-file bound target is a harmless non-bundle while a symlink to the same stable file is `RUNTIME/ESHAPE`.

The recurring pattern is diagnostic: the implementation has no explicit taxonomy separating **initial absence**, **stable non-bundle shape**, and **a transition/observation failure**. Each local fix has inferred one of those states from a syscall result without carrying the prior observation that gives the result meaning.

## Whole-system model

### Components

- The shared binding parser validates `.agentstate.json` syntax and resolves its `bundle` value relative to the binding file. It intentionally does not require that the value currently names a bundle.
- Ordinary binding discovery finds the nearest binding and later attempts to open its target.
- Create-only target policy asks a narrower question before publication: does a binding at/above the candidate already point to an existing bundle that would shadow this new target?
- The strict filesystem observer supplies `lstat`, `realpath`, `readFile`, and directory probes under injected-test and real Node implementations.
- The create-only coordinator runs preflight, acquires the root-scoped production mutex, repeats strict observation, creates missing directories, observes again, and publishes `index.md` while locked.
- The error adapter converts observation uncertainty to structured `RUNTIME`; verified existing-bundle conflicts remain `ALREADY_EXISTS`.

### Ordering and external state

The binding target may be absent, a directory, a regular file, or a symlink to any of those. Raw filesystem writers can replace or remove it between observations. The application mutex serializes cooperating create-only processes but cannot serialize arbitrary raw writers. The product therefore cannot guarantee a stable pathname after the last observation; it can and must refuse when its own ordered observations demonstrate uncertainty or a transition.

### Required invariants

1. A binding target absent at the first target-presence observation means no existing bound bundle and may be allowed.
2. A successfully and consistently observed stable non-directory object is not an OKF bundle. Direct and symlink spellings of the same stable object have the same classification.
3. A successfully observed directory is inspected strictly for its own and conventional `index.md`.
4. Once a candidate or resolved target has been observed present, a later ENOENT/ENOTDIR/read/realpath failure is uncertainty, never fresh absence.
5. Shape/identity changes between observations are uncertainty. Stable shape is classification, not error.
6. Parser semantics are shared; strict filesystem observation must not create a second binding-language policy.
7. No classification authorizes deletion. All failures retain truthful phase/path/code/residue/publication details.

## Current verified state

At `61ff794a6e1515f662c2005d800c814058da0139`, the core architecture, root mutex, no-deletion property, target-disappearance handling, double-fault provenance, source production-lock barriers, installed production-lock barrier, plain init, Recipe lifecycle, and package identity all survived final review. The only confirmed blocker is the stable direct-file versus symlink-to-file binding-target asymmetry in `existingBundleAt`.

## Unverified assumptions to resolve before code

- Whether adding a strict followed-target `stat` observation is necessary to distinguish a stable symlink-to-file from a symlink target that changed shape, or whether ordered `realpath` then required `lstat` plus stable non-directory classification is sufficient within the frozen raw-writer threat boundary.
- The exact truth table for direct/symlink/dangling targets across absent, directory, regular-file, directory-to-file transition, file-to-directory transition, and post-realpath disappearance.
- Whether identity comparison (`dev`/`ino`) should be required for direct and dereferenced targets, given filesystem portability and the fact that identity checks cannot prevent a mutation after the final observation.
- The smallest code shape that expresses this taxonomy once without another parser or discovery fork.

## Reorientation gate

The architecture, compatibility, and falsification passes are complete. The gate is satisfied and one narrowly bounded Builder correction is authorized. The subsequent patch must add table-driven red/green tests at `61ff794`, change only the private binding-target observer/tests, and restart exact-SHA Review before QA. The prior cap is not reset by simply renaming another patch cycle; this reorientation artifact and independent model review are the required new evidence.

## Frozen resolution

The observer is a local three-outcome classifier: `NO_BUNDLE`, `EXISTING_BUNDLE`, or typed `UNCERTAIN`. It retains no binding-target receipt across preflight, locked revalidation, or pre-publish.

1. `lstat(candidate)` establishes lexical presence. Initial `ENOENT` alone is absence; every other failure is `RUNTIME`.
2. For a direct object, its successful `lstat` is the effective-target snapshot. For a symlink, one private followed `stat(candidate)` establishes the referent snapshot; failure, including dangling `ENOENT`, is `RUNTIME`.
3. `realpath(candidate)` and required `lstat(physical)` establish the second effective-target snapshot. Any failure is `RUNTIME`.
4. A resolved symlink, directory/non-directory shape mismatch, or `dev`/`ino` mismatch between those two effective snapshots is an observed transition and therefore `RUNTIME`.
5. A stable non-directory returns `NO_BUNDLE` for both direct and symlink spellings. A stable directory is strictly inspected for own and conventional indexes; a found marker returns `EXISTING_BUNDLE`, verified absence returns `NO_BUNDLE`, and all non-absence probe faults return `RUNTIME`.

This followed snapshot is deliberately local and bounded. It detects only a transition the observer actually witnessed; it does not claim to exclude raw writers after the final observation. Cross-phase receipts, retries, watchers, file-descriptor pinning, hashing, parser changes, discovery changes, and new cleanup behavior are explicitly out of scope.

### Minimum proof delta

- Red at `61ff794`: a stable direct regular file and symlink to the same file must both be classified as no existing bound bundle.
- Transition guards: direct/symlink effective-target directory-to-file or identity replacement observed within one call must be `RUNTIME`, with no publication.
- Fault guards: followed `stat`, `realpath`, and resolved `lstat` failures retain exact phase/operation/path/fs-code provenance; dangling remains `RUNTIME`.
- Existing disappearance, directory/bundle, parser, no-delete, mutex, publication, and installed-package proofs remain authoritative and must stay green.

This chooses the architecture/compatibility model over the falsifier's one-branch alternative because the extra private `stat` has one concrete, bounded purpose: it makes the pre- and post-canonicalization observations refer to the same effective object, so stable symlink shape can be distinguished from a transition the observer actually saw. The falsifier's scope warning is retained by rejecting any cross-phase or open-ended identity protocol.

## Review evidence

- [frozen repair plan](../plans/pr212-safety-blocker-repair-2026-08-07.md)
- [governing task](../tasks/init-target-safety-guard.md)
- `context-notes/pr212-exact-review-12dd30b-codex`
- `context-notes/pr212-exact-rereview-ab2d97f-codex`
- `context-notes/pr212-final-review-61ff794-codex`
- `context-notes/pr212-binding-reorientation-architecture-codex`
- `context-notes/pr212-binding-reorientation-compat-codex`
- `context-notes/pr212-binding-reorientation-falsifier-codex`
