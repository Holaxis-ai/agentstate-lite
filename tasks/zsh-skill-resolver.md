---
type: Task
title: Make shipped skill resolvers portable across Bash and Zsh
status: done
priority: '1'
description: >-
  Shipped in PR #62 at source SHA 884d29bd11d4461ae4f13cb306de7300bad7d73a,
  merge f4bec30, and plugin 1.0.55. The generated ASLITE and REFS resolvers no
  longer expose optional cache globs to shell expansion; one shared
  direct-install plus find search works under Bash and default Zsh while
  preserving PATH precedence, relocated homes, all four host/channel shapes,
  failure guards, and version selection. Focused resolver tests passed 20/20,
  including exact Zsh regressions; typecheck, skill drift check, git diff check,
  and full npm run check including 14 browser tests passed. Merged by explicit
  human instruction without the otherwise-required independent exact-SHA review.
actor: mike/codex
timestamp: '2026-07-15T13:33:56.226Z'
---

