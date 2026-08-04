---
type: Task
title: Review PR 207 durable exact SessionStart hooks
status: done
priority: '1'
assignee: codex-pr207-review
description: >-
  Exact-SHA review complete at 9b6b114: CHANGES REQUESTED for two high-severity
  ownership/deletion counterexamples plus one medium migration-signal gap.
actor: codex-pr207-review
timestamp: '2026-08-04T23:28:21.240Z'
---
# Goal

Independently determine whether PR 207 exact head `9b6b114d481a9fbfd447f89e7d302156d969cb95` safely makes persistent SessionStart hooks PATH-independent while preserving foreign host configuration. This serves the ultimate agentstate-lite goal by ensuring the npm-installed first-use path is reliable and ownership mutations remain fail-closed.

# Exact scope

- PR: https://github.com/Holaxis-ai/agentstate-lite/pull/207
- Base: `d058d735ce4f6179ed07d74a7ddbfc38491e7980` (`main` at review request).
- Head: `9b6b114d481a9fbfd447f89e7d302156d969cb95`.
- Clean review worktree: `/private/tmp/aslite-durable-hook.lLSKS1` on `feat/durable-npm-hook-install`.
- Product tasks: `tasks/codex-sessionstart-node-path` and `tasks/hook-compatibility-ownership`.
- Normative inputs: `plans/version-string-channel-identity`, `designs/version-update-protocols`, and `context-notes/npm-install-first-use-priority-2026-08-04`.

# Domain model

- **Durable install authority:** proves a stable global npm prefix, package entry, and `<prefix>/bin/node` whose realpath equals the runtime executing the CLI; transient npx/npm-exec state must refuse persistence without writes.
- **Generated command shape:** exact argv tokens for supported current and historical commands, never substring ownership.
- **Compatibility state:** `current`, `stale`, `legacy_path_bound`, `absent`, or `unmanaged`; status, install, deduplication, upgrade, and uninstall must share the same classifier.
- **Host adapters:** Claude JSON hook objects, Codex JSON hook commands, and generated OpenCode plugin source. OpenCode ownership requires byte-exact reconstruction, not marker presence.
- **Mutation boundary:** owned compatible forms may converge or uninstall; foreign near-matches, malformed/unmanaged entries, and unrelated bytes must survive unchanged.

# Acceptance review

Read the full diff and relevant surrounding code. Verify exact token/shape classification, legacy coverage, command quoting/serialization, symlink/realpath and npm-prefix authority, status compatibility reporting, idempotent install/uninstall, upgrade/deduplication behavior, and preservation of foreign configurations. Challenge whether current commands can be falsely classified stale/unmanaged or foreign commands falsely adopted. Check docs/generated-skill agreement and package-verifier proof.

Run the smallest relevant tests first, then broader gates in proportion to surviving risk. Tests must be read as evidence, not accepted as proof by name. Do not edit source or post GitHub comments. Preserve the user's unrelated main-worktree `CLAUDE.md` change.

# Deliverable

Write `context-notes/pr-207-exact-sha-review-9b6b114` with findings ordered by severity and file/line references, exact commands/results, residual risks, and PASS or CHANGES REQUESTED. Close this review task. If no findings survive, say so explicitly and identify any test or platform limits. Board sync belongs to the root reviewer.

# Outcome

Completed at exact head `9b6b114d481a9fbfd447f89e7d302156d969cb95` with verdict **CHANGES REQUESTED**. Two high-severity mutation-authority counterexamples survived: the command grammar owns newline/bare-Node/arbitrary-basename paths it did not generate, and the entry classifier owns arbitrary matcher/type/timeout variants. A medium historical-upgrade signal gap also survived. Focused local tests passed 69/69, adversarial reproductions confirmed deletion, CI passed on Node 20/22/26, and the worktree remained clean. Full findings are recorded in `context-notes/pr-207-exact-sha-review-9b6b114`; independent confirmation is in `context-notes/pr-207-ownership-skeptic-9b6b114`.
