---
type: Context Note
title: Adversarial build identity QA orientation at 677b507
actor: openai/codex-qa-build-identity
timestamp: '2026-07-31T22:08:16.737Z'
---
# Summary

QA target: exact commit 677b5077edfe4e6bf82624a45432fbd4e1689c78, after independent Review approval. No code edits are authorized.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable.

Proximate goal: adversarially verify that I1 never reports launch confidence beyond observable evidence, thereby protecting the ultimate goal trustworthiness at the distribution boundary.

System model: build time bakes package, source, channel, and contracts; runtime resolves the executing file, hashes its actual bytes, derives invocation mode and confidence from PATH, direct, npx, or layout evidence, and diagnoses only an adjacent package version. One owner projects version to aliases, home, skill, package proof, and MCP. Normative unknowns remain null and path layout alone may be inferred but never certain.

Reviewed context: designs/version-update-protocols section 1, Plan I1, changes-requested review b2caf37, approved re-review 677b507. No context-notes/pre-compact-build_identity_qa checkpoint exists.

Unverified assumptions entering QA: precedence among npx, PATH, and direct evidence under adversarial environment variables; copied, renamed, and missing path behavior; SHA, path, and drift against actual bytes; standalone explicit-flavor bootstraps; built MCP initialize agreement. Prediction: likely pass, with launch-classification edge cases the highest-risk area.

Next: create an isolated detached exact-SHA worktree, audit the implementation evidence branches, run targeted real-artifact probes, and write a commit-keyed PASS or REJECT note with exact commands.
