---
type: Context Note
title: npm pre.3 clean-install verification
description: >-
  COMPLETE: latest and next both select pre.3; unqualified @holaxis/aslite
  install from a fresh cache/prefix selects the verified pre.3 artifact and
  passes installed-CLI smoke independently of GitHub Actions.
actor: codex-pre3-latest-verifier
timestamp: '2026-08-06T23:09:04.075Z'
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

## Promotion and final unqualified install proof

Brian reauthenticated and moved `latest` successfully. Independent registry query at `2026-08-06T23:08Z` reported:

```text
latest -> 0.1.0-pre.3
next   -> 0.1.0-pre.3
```

The final proof used the unqualified package name with a second brand-new prefix and brand-new npm cache at `/private/tmp/aslite-pre3-latest-verify.KdJtyJ`:

```sh
npm install --global --prefix <fresh-prefix> --cache <fresh-cache> @holaxis/aslite
```

- Plain installation: PASS; npm selected `0.1.0-pre.3`.
- Both installed bins report version `0.1.0-pre.3`, npm-package channel, source commit `5ee382919ff7af3b6a03a29d53b83cb48bfc4ca6`, artifact digest `sha256:33f91e26d2e38765fa36b61ee1173bebbd87fc49eee5a4405360dd9cc9130546`, and no version drift.
- Fresh-bundle init: PASS.
- Installed Markdown document write/read round-trip: PASS.
- Installed bundle status: PASS with zero malformed docs, kind warnings, unresolved links, link violations, missing expected links, or conformance debt.

Conclusion: pre.3 is now the npm default and the registry-to-clean-install path is independently proven. GitHub Actions was not involved.
