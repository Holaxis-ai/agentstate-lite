---
type: Context Note
title: npm pre.3 clean-install verification
description: >-
  Exact pre.3 installs and passes installed-CLI smoke; moving latest is blocked
  only by a stale/revoked local npm token (E401), requiring interactive npm
  re-login and owner verification.
actor: codex-pre3-verifier
timestamp: '2026-08-06T22:26:54.530Z'
---
# Summary

The published `@holaxis/aslite@0.1.0-pre.3` artifact installs and runs cleanly without GitHub Actions. The remaining unqualified plain-install proof is gated only by an authorized npm dist-tag change, not by CI.

## Goals

Ultimate goal: make npm the safe, independently verifiable primary distribution channel for agentstate-lite.

Proximate goal: prove the already-published pre.3 artifact from a fresh npm cache and prefix before deciding whether to move `latest`. This serves the ultimate goal by separating artifact correctness from registry-channel policy.

## Live registry state

Observed 2026-08-06:

```text
latest -> 0.1.0-pre.2
next   -> 0.1.0-pre.3
```

## Isolated verification

Installed exact `@holaxis/aslite@0.1.0-pre.3` using a new prefix and new npm cache under `/private/tmp/aslite-pre3-plain-verify.ak3OWn`.

- npm install: PASS (`added 1 package`).
- Both installed bins exist: `aslite` and `agentstate-lite`.
- Both `version --json` commands report package `0.1.0-pre.3`, artifact channel `npm-package`, source commit `5ee382919ff7af3b6a03a29d53b83cb48bfc4ca6`, artifact digest `sha256:33f91e26d2e38765fa36b61ee1173bebbd87fc49eee5a4405360dd9cc9130546`, and `version_mismatch: false`.
- Fresh-bundle `init --json`: PASS.
- Installed `doc write` and `doc read` round-trip, including Markdown body bytes: PASS.
- Installed `status --json`: PASS with zero malformed docs, kind warnings, unresolved links, or conformance debt.
- Installed UI loopback launch: PASS; server shut down cleanly after the launch check. Browser rendering was not claimed by this smoke.

## Remaining release-owner action

No registry mutation was performed. An authorized release owner may move the already-published artifact to the default channel with:

```sh
npm dist-tag add @holaxis/aslite@0.1.0-pre.3 latest
```

After that mutation, repeat the install from another empty prefix and empty cache using the unqualified package name, then assert `version --json` resolves exactly `0.1.0-pre.3` and repeat the smoke above. GitHub Actions is not involved in either the dist-tag mutation or npm installation.

[registry diagnosis](npm-pre3-default-channel-2026-08-06.md)

## Authentication blocker observed

Brian attempted the authorized dist-tag mutation at `2026-08-06T22:24:29Z`; npm returned E401 on the registry PUT. The registry GET succeeded, the active registry is `https://registry.npmjs.org/`, the user config is `/Users/brian/.npmrc`, and that file contains an npmjs `_authToken` key. A separate read-only `npm whoami` also returned E401. No credential value was printed or persisted in the bundle.

Diagnosis: the configured npm token is stale, revoked, or expired. Recover with npm's browser login, verify `npm whoami` and package ownership, then repeat the dist-tag mutation. If auth-and-writes 2FA is enabled, complete the interactive security-key/OTP prompt; do not store an OTP in the project or bundle.
