---
type: Task
title: >-
  'new <Kind>' for a known-but-uninstalled shipped convention doesn't name the
  one command that installs it
status: todo
priority: '3'
assignee: ''
description: >-
  FOUND 2026-07-23 during the view-authoring test. Creating a View in a bundle
  that hadn't installed the View convention would have failed; the agent only
  avoided it by proactively running 'aslite kinds' first.


  VERIFIED (packages/cli/src/commands/new.ts:396-400): for an undeclared kind,
  'new' throws 'unknown kind "View" (declared: Context Note, Task)' with help
  'aslite kinds'. Correct, but it does not distinguish 'you typoed a kind' from
  'this is a SHIPPED convention you just haven't installed here' — the
  View/Task/Roadmap case, where the fix is a specific promote or 'recipe add'.


  PROPOSED SOLUTION: when the requested kind name matches a KNOWN
  built-in/shipped convention that simply isn't installed in this bundle, the
  error names the exact remedy — e.g. 'View is a shipped kind not yet declared
  here: run aslite recipe add <name>' (or the promote command for a
  reference-shipped convention). Mirrors CLAUDE.md's principle: move the
  recovery into the error the caller already hits. Keep the generic 'unknown
  kind' for a genuinely unknown name.


  DONE WHEN: 'new "View"' in a bundle without the View convention prints the one
  command that installs it, and 'new "Nonsense"' still gets the generic
  unknown-kind error.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T17:43:52.817Z'
---
[tasks/ui-view-headless-verify](ui-view-headless-verify.md)
