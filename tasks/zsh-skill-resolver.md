---
type: Task
title: Make shipped skill resolvers portable across Bash and Zsh
status: in_progress
priority: '1'
description: >-
  Fix the generated ASLITE and REFS skill resolvers so optional install
  locations work under default zsh as well as bash. Replace shell-expanded
  optional globs with a portable discovery primitive and test the exact emitted
  resolver under both shells, including missing optional roots, relocated homes,
  PATH precedence, failure guards, and highest-version selection.
actor: mike/codex
timestamp: '2026-07-15T13:22:25.932Z'
---

