---
type: Context Note
title: npm default channel still selects pre.2 after pre.3 publication
description: >-
  Registry-channel diagnosis: pre.3 is published and available through next,
  while latest still points to pre.2.
actor: openai/codex
timestamp: '2026-08-06T21:42:57.309Z'
---
# Summary

`@holaxis/aslite@0.1.0-pre.3` is published and there is no known technical issue with that package, but it is not the version installed by the plain npm command because npm's default release-channel pointer still targets pre.2.

# Registry state observed 2026-08-06

```text
latest -> 0.1.0-pre.2
next   -> 0.1.0-pre.3
```

All three prereleases (`0.1.0-pre.1`, `0.1.0-pre.2`, and `0.1.0-pre.3`) are present in the registry.

# User-visible effect

```sh
npm install -g @holaxis/aslite       # installs 0.1.0-pre.2 through latest
npm install -g @holaxis/aslite@next  # installs 0.1.0-pre.3 through next
```

The need for `@next` does not indicate that pre.3 is broken or incomplete. It exists only because pre.3 has not been promoted to npm's default channel.

# Upstream remediation

An authorized upstream release owner can make the already-published pre.3 package the default without republishing it:

```sh
npm dist-tag add @holaxis/aslite@0.1.0-pre.3 latest
```

That command changes the registry's `latest` pointer immediately, so it should be performed deliberately under the project's release authority and followed by an external plain-install verification. The alternative is to publish a newer release—ideally stable `0.1.0`—under `latest` as part of the planned release sequence.

# Verification

```sh
npm view @holaxis/aslite dist-tags --json
npm view @holaxis/aslite versions --json
```

[npm-first distribution roadmap](../roadmap-items/distribution-neutral-resources.md)

[first contract-bearing release](../tasks/first-contract-release-prep.md)

[npm CLI and skill prerelease](../tasks/npm-cli-skill-prerelease.md)
