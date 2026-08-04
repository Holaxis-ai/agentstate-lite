---
type: Context Note
title: >-
  Final review of PR #205 at cd3d330 — approved, 3 minor findings + hook-install
  follow-up
actor: claude/reviewer
timestamp: '2026-08-04T02:48:04.679Z'
---
# Summary

Final independent review of PR #205 (`feat/skill-mcp-compatibility`) at exact SHA
`cd3d330a069419b9746bc007d8aedf10666c2c78`. APPROVED for its stated scope — three minor
NON-BLOCKING findings below, plus one follow-up worth its own task. Note the PR's own declared
merge dependency: it must not merge until PR #204 lands, this branch is rebased, and the
`STABLE_MCP_LAUNCH_GUIDANCE` wiring into the release receipt is re-reviewed.

CI green on the exact SHA (gate node 22/26 + engines smoke). Locally re-ran all seven
new/changed suites at that SHA: 93/93 pass. Empirical probing performed (labeled below).

# What the change does well (verified)

- Ownership is deliberately NARROWER than parseability: exact package spellings, exact installer
  marker, exact managed file shape. Symlinked manifests, near-miss fields, backslash/NUL/dot-dot
  entries all land in refusal, and refusals are byte-preserving — the mutating verbs now do a
  complete read-only preflight and sweep debris only after acceptance (the old
  sweep-before-refusal honesty note is gone because the behavior is fixed, not re-worded).
- The Windows traversal repair (`cd3d330`) centralizes entry validation in
  `isSafeManifestEntry` inside skill-compatibility.ts, with a test proving the win32 join
  escape and both-verb byte-preservation.
- The transitional-manifest interruption design is correct: the mid-upgrade manifest is
  legacy-shaped (no digests), so no interruption point can strand a manifest claiming digests
  that are not yet true on disk; the v2 receipt lands only after disk matches it.
- The install authority is fail-closed in the right places: npm-exec env, _npx cache paths,
  unresolvable executables, shadowed PATH aliases, relative/missing npm prefix, unsupported
  platforms all classify `unknown`/refuse, with evidence and remedy in the error envelope.
  Uninstall deliberately stays ungated.
- The literal-PATH MCP proof is a real subprocess test: bare `aslite` on PATH, initialize
  version equals `version --json`, and a host-config sentinel byte-checked untouched.

# Findings (all minor, non-blocking)

## N1 — a routine file-set upgrade is misreported as `receipt_invalid` (empirical)

In `skillStatusForDir`, when the on-disk file SET differs from the running asset set (`sameSet`
false), `receiptDigestsMatch` is initialized false for v2 and the digest loop is skipped, so the
classifier reports `reason: receipt_invalid`. Probed empirically: install v2, then add ONE new
reference file to the shipped assets (a normal next release) -> status says
`stale / receipt_invalid`, while the same upgrade with changed BYTES but an unchanged set says
`stale / asset_drift`. The installed receipt is actually valid and matches its own manifest.
State and remedy are identical (stale / install), so this is diagnostic-label accuracy only —
but in a PR whose point is honest receipts, `asset_drift` is the true reason. Fix direction:
verify digests against the manifest's OWN files, or check asset drift before receipt validity
when the receipt is internally consistent.

## N2 — stale comment: "for a fresh install IS the final content"

skill.ts's transitional-write comment still says the transitional content equals the final
content on a fresh install. True before this PR (one manifest shape); now false — transitional
is legacy-shaped, final is v2 — so fresh installs do two manifest writes. Behavior is fine
(every interruption point stays owned); the comment is now misleading.

## N3 — durable-global proof and version-manager shims (reasoned, not reproduced)

`classifyPersistentInstallAuthority` requires the PATH bin to resolve (realpath) to exactly
`<npm-prefix>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`. Under Volta/asdf-style
shims the PATH entry is a shim binary, not a symlink, so realpath(bin) != executable and the
state is `unknown` — refusing a genuinely durable global install with an error that tells the
user to run the `npm install -g` they already ran. Fail-closed, macOS/Linux-only by design, and
arguably correct for v1 — but expect support reports; the reason string could name shims.

# Follow-up (out of this PR's scope, same risk class)

`hook install` performs the SAME category of persistent host change (SessionStart hooks across
three hosts) with NO install-authority gate — under npx it can durably record a command base
that dies with the npx session/cache. This PR's `resolvePersistentInstallAuthority` is the
ready-made primitive; wiring it into `hook install` (and deciding the marketplace-legacy
policy there) deserves its own task rather than silent omission.

# Verification record

- CI cited on exact SHA; local re-run of skill-compatibility, install-authority, skill-command,
  mcp-stdio, mcp, version, skill-distribution suites: 93/93.
- Empirical probe of N1 via a scratch fixture through `skill()` (probe deleted after run).
- Read-only review otherwise; no working-tree mutations remain (`git status` clean).

Attacks that survived: symlinked manifest swap, backslash traversal in both verbs, foreign-file
refusal byte-preservation, near-miss ownership fields, newer-contract downgrade attempt,
authority-refusal target preservation.

[reviews](../tasks/skill-mcp-compatibility.md)
