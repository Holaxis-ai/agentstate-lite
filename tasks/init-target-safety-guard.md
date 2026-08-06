---
type: Task
title: Add generic create-only target safety to init
status: in_progress
priority: '1'
assignee: brian-claude
description: >-
  PR-READY at exact SHA 81b3c39ff252013e318b1a714b63430a24074d70 on pushed
  branch feat/init-create-only (4 commits: e84a66e feature, a438c5f + b42a4ae
  review fixes, a5c0838 QA fixes, 81b3c39 round-4 fix). Gate complete:
  independent exact-SHA review PASS (5 rounds; every round through r4 found real
  defects) + adversarial QA PASS (interruption/race/hostile-fs batteries,
  installed-tarball proof, red-proofed final fix). Full npm run check exit 0.
  Ledger: context-notes/init-create-only-gate-complete-81b3c39. Pre-existing
  findings filed as tasks/binding-fifo-read-hang,
  tasks/crash-leftover-lock-no-owner, tasks/flaky-timing-test-cluster. Awaiting
  Brian-owned PR open + merge.
actor: claude/brian-claude
timestamp: '2026-08-06T00:56:49.803Z'
---
# Problem

Onboarding needs an explicit command that creates a new bundle only when its target is genuinely new. Current `init` is intentionally idempotent/open-or-create: it can apply another Recipe to an existing bundle and can create a nested bundle when invoked below an enclosing workspace. That behavior makes the proposed guide command unsafe as a “new standalone learning workspace” contract.

This is a shared `init` target-selection boundary used underneath [the guide task](guidance-bundle-onboarding.md)'s zero-decision `aslite guide` facade and directly by [npm quickstart](npm-quickstart-onboarding.md). It is product code, not guide copy.

# Behavioral decision

Add a generic, opt-in `init --create-only` mode. Existing `init` behavior without the flag remains backward compatible.

Before any write, create-only mode resolves the physical/local target and fails closed when:

- the target is already an OKF bundle;
- a project binding resolves the selected location to an existing bundle;
- the target would be nested inside an enclosing bundle; or
- target identity cannot be established safely because of malformed bindings, symlink ambiguity, or a concurrent create.

The error explains the two valid recoveries: use `recipe add` to modify an existing bundle, or choose a different explicit `--dir` for a new bundle.

The onboarding guide's lower-level equivalent becomes:

```sh
aslite init --create-only --recipe agentstate-guide --dir ~/.agentstate-lite/guide
```

The public newcomer command is `aslite guide`, which must delegate first-run creation to this generic boundary and use `~/.agentstate-lite/guide` unless an advanced `--dir` override is supplied. The exact `init --create-only` spelling and semantics remain generic; there is no `agentstate-guide` branch in target resolution. The [approved boundary review](../review-requests/onboarding-surfaces-mike-signoff.md) authorizes npm quickstart to use the same mode for its fresh-workspace proof after this guard ships.

# Acceptance criteria

- A fresh explicit target initializes successfully with every supported Recipe form.
- An existing bundle target fails before changing docs, blobs, reserved files, timestamps, or board state.
- Invocation from inside an enclosing bundle cannot create an accidental nested workspace.
- Local-path bindings are honored and URL-valued/invalid bindings remain fail-closed with existing guidance.
- Symlink aliases, path normalization, simultaneous creators, interrupted preflight/write boundaries, and permission failures receive deterministic adversarial coverage.
- Re-running the guide creation command against an existing guide fails safely and tells the user how to reopen it; it never injects guide content into another workspace.
- `recipe add` remains the explicit path for adding a Recipe to an existing bundle.
- `init` without `--create-only` retains its documented behavior and existing tests.
- Help, generated skill text, no-bundle orientation, and the installed-tarball proof use the exact public spelling.
- The exact installed local-dev tarball proves the guard without depending on a live npm publication.

# Architecture and gate

Target policy belongs in one owning CLI target-resolution primitive, not in guide content or recipe-specific branching. The mechanic sits on a destructive/create-path boundary and requires Builder → independent exact-SHA Review → adversarial QA → repository/package gate. Review must probe the guard red and verify that no write occurs before target safety is established.

# Dependencies and coordination

- Scoped by [the revised onboarding plan](../plans/onboarding-surfaces.md) and the review findings linked there.
- Brian/Claude side owns the guard unit.
- Brian's [guide-deferral decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md) and the approved boundary review clear this unit to enter implementation planning under its required review/QA gate.
- No P5A, release automation, update-selection, marketplace-retirement, MCP, or View-action work belongs here.
