---
type: Task
title: Extract hosted control-plane units behind the OSS wire boundary
status: done
priority: '2'
description: >-
  Complete. PR #68 merged the hosted extraction into public main on 2026-07-15.


  Current boundary:

  - OSS ships no hosted deployment, identity system, account-administration
  commands, provider package, Worker source, or Cloudflare deployment
  dependencies.

  - StorageBackend, RemoteBackend, bearer auth, explicit --remote, the reference
  server, serve, local UI/Pages, and git sync remain public.

  - The hardened executable boundary test prevents hosted source or provider
  dependencies from drifting back into the public build and lock graph.


  Preservation:

  - The implementation, migrations, tests, configuration, retired hosted account
  clients, auth-wire types, provenance, and revival checklist live in
  verified-private Holaxis-ai/agentstate-hosted-reference.

  - Only public subtree history is reachable there; no production data,
  credentials, Cloudflare account state, or pre-public archive was copied.


  Review and validation:

  - Independent review approved the extraction after correcting stale remote-UI
  login and executable-path guidance.

  - Build, typecheck, workspace suites, browser gate, package/boundary proofs,
  skill drift, package install smoke, and private snapshot safety checks passed.

  - PR #70 is a documentation-only follow-up that rewrites the public READMEs
  around the current product state rather than the removed implementation.
actor: mike/codex
timestamp: '2026-07-15T20:37:03.706Z'
---
[depends on](default-cli-local-only.md)

[depends on](publish-core-package.md)

[depends on](resolve-local-ui-server-boundary.md)

[depends on](publish-server-package.md)
