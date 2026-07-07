---
type: Claim
title: 'The CLI is 9,663 lines of TypeScript source (excluding generated)'
status: active
reason: >-
  wc -l over packages/cli/src/*.ts excluding the build-generated ui-assets
  module
evidence_command: >-
  find packages/cli/src -name '*.ts' ! -path '*generated*' | xargs wc -l | tail
  -1
evidence_commit: 1463bbd
timestamp: '2026-07-06T20:23:48.749Z'
---

