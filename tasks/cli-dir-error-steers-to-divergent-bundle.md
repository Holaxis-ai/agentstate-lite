---
type: Task
title: >-
  A --dir path that isn't a bundle root errors with 'init --dir <same>',
  steering toward a divergent second bundle
status: todo
priority: '2'
assignee: ''
description: >-
  FOUND 2026-07-23 during the view-authoring test. An agent ran 'aslite ui --dir
  .' (natural, since the skill trains 'run bare from the project root'). It
  failed with 'no OKF bundle at <cwd> (no index.md)' and help 'aslite init --dir
  .'.


  VERIFIED in resolveLocalBundleTarget (packages/cli/src/bundle.ts:352-359): an
  explicit --dir is read as the LITERAL bundle root (no walk to the conventional
  .agentstate-lite/ subfolder — that walk only runs for BARE commands). The
  failure help is hard-coded to 'init --dir <same path>'. Following it LITERALLY
  creates a second bundle at the project root — the exact divergent-bundle
  disaster the skill and CLAUDE.md warn against ('never init a project that
  already has a workspace'). A NOT_FOUND error should never steer toward a
  destructive action.


  SCOPE: this is NOT ui-specific — the bad help comes from the shared resolver,
  so every --dir command has it. ui is just where an interactive user is most
  likely to type '--dir .'.


  PROPOSED SOLUTION: when '--dir <path>' finds no bundle at <path> but
  <path>/.agentstate-lite/index.md DOES exist, resolve to the conventional
  subfolder (or, if we keep --dir strict-literal, error with help pointing AT
  the subfolder, not at init). Only when NEITHER exists should init be suggested
  — and even then, suggest it for a NEW location, never for a path already
  inside a bundle-bearing project. The one-line invariant: the resolver must
  never emit 'init' help for a path whose project already has a workspace.


  DONE WHEN: 'ui --dir .' (and any --dir <project-root>) either just works or
  errors toward the right subfolder; no reachable --dir failure suggests an init
  that would create a second bundle.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T17:43:52.550Z'
---

