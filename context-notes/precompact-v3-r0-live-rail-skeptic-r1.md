---
type: Context Note
title: Revision 3 repaired R0 live-rail fixture skeptic review
actor: codex-precompact-v3-r0-live-rail-skeptic-r1
timestamp: '2026-08-04T15:49:49.112Z'
---
# Summary

Status: complete; independent static review of repaired R0 fixture set.

Verdict: **FAIL**. Confidence: **0.99**.

Live R0 authorization: **NO**.

The repair adds the right component names—a standalone hook-shaped script, 256-bit sentinel generation, a manifest, an explicit negative SessionStart output branch, and STATIC comments—but the pieces do not form an executable evidence path.

The collector creates a random STATIC manifest that the hook never reads. The hook takes mode/sentinel from ambient environment, ignores the actual event payload, and is not referenced by the runbook or an isolated settings stanza. The “collector” records no raw hook input/output/event/host/transcript/summary/first-response evidence. The runbook is unchanged from the rejected version and gives no commands for either new script. The reported fifth test covers only manifest creation; no test invokes the standalone hook or its SessionStart negative branch.

Static evidence remains misleading: the old four tests still assert hard-coded transcript/native-summary absence and a fixed sentinel. The manifest digest printed by the collector hashes bytes without the newline that is written to `manifest.json`, so it is not the file SHA-256 it claims to be.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  live_r0_authorization: false
  static_inertness: partial_pass
  reviewed_files:
    - path: scripts/r0-inert-hook.mjs
      sha256: be0bd67393be8cf2b16b8aed60bd409566b4dce7d04084a8f6a8678270ac7e08
    - path: scripts/r0-rail-collector.mjs
      sha256: 5003e7ad6a70c19f8a1a5f47bf47c01b091e65ce31a301eaca00b9691282eae7
    - path: packages/cli/test/r0-collector.test.ts
      sha256: 0918545e149b52f3d12e18c3b1e766232b69484e55edd69ac026fc6244b4f5a5
    - path: packages/cli/test/r0-live-rail.test.ts
      sha256: 384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8
    - path: docs/r0-live-rail-runbook.md
      sha256: d52b40935550888a8c17dd77eb6463363c85d7a521fa4d514d56a9bc67482eda
  dependency:
    path: packages/cli/test/support/r0-live-rail.ts
    sha256: 87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd
  blockers:
    - id: MANIFEST_HOOK_RUNBOOK_ARE_DISCONNECTED
      severity: critical
    - id: HOOK_IGNORES_EVENT_AND_FAILS_OPEN
      severity: critical
    - id: COLLECTOR_COLLECTS_NO_LIVE_EVIDENCE
      severity: critical
    - id: NEGATIVE_SESSIONSTART_NOT_TESTED_OR_RUNBOOKED
      severity: critical
    - id: STATIC_TESTS_STILL_MANUFACTURE_ABSENCE
      severity: high
    - id: MANIFEST_DIGEST_DOES_NOT_MATCH_FILE_BYTES
      severity: high
    - id: SETTINGS_ISOLATION_AND_RESTORE_UNSPECIFIED
      severity: high
  note: context-notes/precompact-v3-r0-live-rail-skeptic-r1
```

## Exact review boundary

Reviewed in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`:

- `scripts/r0-inert-hook.mjs@sha256:be0bd67393be8cf2b16b8aed60bd409566b4dce7d04084a8f6a8678270ac7e08`;
- `scripts/r0-rail-collector.mjs@sha256:5003e7ad6a70c19f8a1a5f47bf47c01b091e65ce31a301eaca00b9691282eae7`;
- `packages/cli/test/r0-collector.test.ts@sha256:0918545e149b52f3d12e18c3b1e766232b69484e55edd69ac026fc6244b4f5a5`;
- `packages/cli/test/r0-live-rail.test.ts@sha256:384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8`; and
- `docs/r0-live-rail-runbook.md@sha256:d52b40935550888a8c17dd77eb6463363c85d7a521fa4d514d56a9bc67482eda`.

I read the unchanged imported support dependency at SHA-256 `87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd`. I did not edit code, run tests or Claude, invoke tmux, mutate settings/host state, or use auth/network. The 5/5 result is builder-reported.

## Critical blocker 1 — no closed manifest-to-hook-to-evidence path

`r0-rail-collector.mjs` generates a 32-byte random sentinel in `manifest.json`. `r0-inert-hook.mjs` does not accept a manifest path and never reads that file. It reads `R0_SENTINEL` and `R0_MODE` from ambient environment. The runbook does not tell the operator to invoke the collector, extract the sentinel, configure the environment, or bind a manifest digest to a case.

Therefore a live hook output cannot be causally tied to the reviewed manifest. An empty/mistyped/stale environment produces a different result while the manifest still looks valid. Manual and automatic cases can accidentally reuse the same environment sentinel.

Minimum repair: one create-only case manifest per case must contain schema, case id, expected exact event, mode, 256-bit sentinel for positives, no sentinel for negatives, creation timestamp, evidence root, and fixture digests. The installed hook command receives only the exact manifest path, lstat/reads/validates it under a private root, and rejects any mode/event/sentinel mismatch. Ambient mode/sentinel fallbacks are prohibited.

## Critical blocker 2 — standalone hook ignores the host event and fails open

The script parses stdin but never inspects `input`. Its response depends only on `R0_MODE`:

- positive mode emits SessionStart `hookSpecificOutput` even for PreCompact or malformed input;
- negative-precompact emits a PreCompact-shaped block for any event;
- negative-session emits SessionStart `continue:false` for any event;
- an unknown/missing mode falls through to positive; and
- missing sentinel falls through to an empty additionalContext.

This can create schema errors on the positive PreCompact half of a real compaction or falsely attribute a response to the wrong event.

The files are mode `0644`, so the shebang does not make them directly executable. Invocation via an exact pinned Node vector can be valid, but the runbook does not specify it.

Minimum repair: strict schema/event validation, a closed mode enum, exact case/event matching, nonempty exact-length sentinel for positive SessionStart only, `{}` pass-through for positive PreCompact, event-correct block outputs, capped stdin, and fail-closed stderr/exit behavior. Add direct process tests for every allowed and malformed vector.

## Critical blocker 3 — the collector does not collect live evidence

The collector creates only `manifest.json` and prints a summary. It does not record:

- raw hook stdin/stdout/stderr and exit/timing;
- event sequence or exact session/transcript identity;
- installed Claude path/version/digest;
- settings before/installed/after digests;
- pre-compaction transcript/native-summary bytes or search receipts;
- first resumed response and sentinel search;
- manual versus automatic trigger provenance;
- foreign/production state before/after; or
- a terminal evidence manifest and recomputable verdict.

Its exported `verdict(evidence)` accepts three caller-supplied booleans. It does not bind them to files/digests, case type, sentinel, source compact, host, or negative response absence. A hand-authored object can PASS.

Minimum repair: make live evidence collection an exact reviewed mechanism or a fully mechanical runbook with create-only files and digest/readback. Verdict must recompute from retained rows for four independent cases and cannot accept naked booleans.

## Critical blocker 4 — negative SessionStart exists only as an untested branch

The new hook contains `negative-session`, but no test invokes `r0-inert-hook.mjs` at all. The old negative tests still exercise only in-process fake-authority PreCompact mapping. The runbook still instructs only negative PreCompact for both triggers.

Required static and live cases are:

1. positive manual: PreCompact pass-through then SessionStart compact sentinel;
2. positive automatic: exact auto PreCompact then SessionStart compact sentinel;
3. negative PreCompact: exact block prevents compaction; and
4. negative SessionStart: allowed compaction reaches source compact, then exact `continue:false` prevents first resumed response.

Each case requires a distinct manifest/evidence root. The negative SessionStart case is load-bearing because it is the production corrupt/unsafe-state safety rail.

## High blocker 5 — the old static tests still manufacture evidence

`r0-live-rail.test.ts` and its support helper are unchanged. They still:

- use fixed `R0_SENTINEL_7f3c9a2e`;
- return `sentinelInTranscript:false` and `sentinelInNativeSummary:false` without reading artifacts;
- run identical positive SessionStart inputs for “manual” and “automatic”; and
- test only negative PreCompact.

Remove live-shaped receipt fields from static tests and rename them as adapter-unit conformance. Static tests must never emit or assert a live verdict. Manual/automatic provenance exists only in real paired event receipts.

## High blocker 6 — manifest digest is not the manifest file digest

The collector writes:

```text
JSON.stringify(manifest) + "\n"
```

but hashes:

```text
JSON.stringify(manifest)
```

The printed `manifest_sha256` therefore does not match `manifest.json` bytes. The test checks only that the label appears, not that it equals a recomputed file hash.

Hash the exact encoded bytes written, use create-only/no-follow semantics, read back and compare, and test the recomputed digest. Also reject existing/symlinked/insecure roots rather than recursively writing through them.

## High blocker 7 — runbook and settings isolation remain unchanged

The runbook's digest is identical to the previously rejected file. It never names the new scripts. It provides no exact command/settings stanza, Node path/digest, per-case environment/manifest, evidence capture, automatic trigger bound, negative SessionStart, settings backup/restore, or cleanup verification.

An acceptable runbook must be paste-executable and bind every command to reviewed file/host digests. It must install only isolated project/test settings, prove production/global settings and journal are unchanged, and restore/remove temporary state with readback. Static 5/5 is a prerequisite row, never the live verdict.

## What survived review

- The standalone hook script does not import production handoff authority or tmux.
- It performs no filesystem, process, network, auth, lifecycle, or repository mutation.
- The collector uses cryptographic 256-bit randomness for its generated sentinel.
- Positive, PreCompact-negative, and SessionStart-negative JSON shapes are represented in source.
- Both new scripts explicitly label themselves STATIC.
- Historical/process/lifecycle claims are absent.

These are useful ingredients, not a live-test system.

## Final decision

**FAIL — live R0 authorization remains CLOSED.**

Confidence: **0.99**.
