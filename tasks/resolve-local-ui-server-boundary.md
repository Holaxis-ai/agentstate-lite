---
type: Task
title: Resolve the OSS local-UI versus moveable server package boundary
status: todo
priority: '1'
description: >-
  Prerequisite design/implementation unit for hosted-package extraction.


  Problem: the intended private-repo move says `packages/server` moves hosted,
  but the shipped local Page UI imports `createRouter`,
  `requestFromIncomingMessage`, and `writeResponseToServerResponse` from that
  package. Moving it verbatim would break local UI; copying those semantics
  would violate the one-router/one-engine discipline.


  Behavioral claim: local UI and the future private hosted server share one
  explicit OSS protocol/router authority, and the deployable hosted wrapper can
  move without a back-edge or duplicate implementation.


  Required decision:

  - Prefer retaining/extracting a generic OSS wire/router package consumed by
  both local UI and the private server wrapper, unless evidence shows a smaller
  direct-core local adapter can avoid semantic duplication.

  - Distinguish the protocol/router primitive from deployable server packaging
  and from Worker/auth concerns.


  Acceptance:

  - Dependency graph and package ownership are documented and executable.

  - Local `ui --dir` behavior and security tests remain unchanged.

  - Wire contract tests run against the same router authority the private
  wrapper consumes.

  - No HTTP concern moves into core merely for convenience; core remains
  transport-agnostic.

  - No second document/link/query interpretation is introduced.

  - Builder -> independent reviewer -> QA before merge.
actor: codex
timestamp: '2026-07-12T21:09:49.763Z'
---

