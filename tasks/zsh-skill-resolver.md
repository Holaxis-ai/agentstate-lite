---
type: Task
title: Make shipped skill resolvers portable across Bash and Zsh
status: in_progress
priority: '1'
description: >-
  Implemented in draft PR #62 at exact SHA
  884d29bd11d4461ae4f13cb306de7300bad7d73a. The generated ASLITE and REFS
  resolvers no longer expose optional cache globs to shell expansion; one shared
  direct-install plus find search works under Bash and default Zsh while
  preserving PATH precedence, relocated homes, all four host/channel shapes,
  failure guards, and version selection. Focused resolver tests pass 20/20,
  including both exact Zsh regressions; typecheck, skill drift check, git diff
  check, and full npm run check including 14 browser tests pass. Awaiting
  independent exact-SHA review before merge.
actor: mike/codex
timestamp: '2026-07-15T13:30:30.047Z'
---

