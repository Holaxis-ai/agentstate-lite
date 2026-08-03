---
type: Context Note
title: 'P0 installed-host lifecycle review — revision 3, pass 2'
actor: codex-precompact-v3-plan-lifecycle-r2
timestamp: '2026-08-03T18:22:26.635Z'
---
# Summary

status: FAIL

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently determine whether the exact revised revision-3 plan is implementable and can prove the lifecycle rail on the installed host; this serves the ultimate goal by preventing implementation against an untestable safety or support contract.

## Exact review inputs

- `designs/pre-compact-multi-session`: `sha256:7d9c8643c701d346ca672336798ab1a769d739ec3dadb113e7093c4c9369ab6f`
- `plans/pre-compact-multi-session-v3`: `sha256:36fcaba4a3f9ce5156d58edcd873c302d7c41b62309866dd7404076f128b79d1`
- `context-notes/precompact-v3-orientation`: `sha256:6a5a02140842cc24730814c620c74d73fa36fe590d3212cfbc56970828e1932b`
- `context-notes/precompact-v3-live-rail-probe`: `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`
- prior lifecycle FAIL: `context-notes/precompact-v3-plan-review-lifecycle` at `sha256:b2db98481ba5b7e5a48ac5294d368a65e4f0fa0431206cd5547f12166f21dbb1`

## Orientation

The revised design and plan now explicitly address all five prior lifecycle blockers: structural hook ownership with the installed foreign `printf` as an exact preservation fixture; a claim bounded to successful helper invocation plus real launch/timeout characterization; live PreCompact and SessionStart negative gates; a required genuine sub-agent compaction journey; and process-level CAS/read-back semantics without an fsync durability claim. Remaining review work is to test internal coherence and installed-host feasibility, especially exact runtime readiness identity, SessionStart/board critical-path behavior, and whether each live gate has a falsifiable oracle on one immutable candidate.

## Final gate verdict

FAIL.

The revised lifecycle, managed-hook migration, failure boundary, real sub-agent gate, and durability wording are implementable and resolve the prior review's B1-B5. Two acceptance defects remain blocking because the current plan can reach neither a truthful `rail_ready:true` result nor complete installed-host proof of its automatic rail without an unstated assumption.

### B1 — the verified Claude host artifact has no reproducible runtime identity contract

The design identifies the supported artifact as Claude Code `2.1.220` commit `4073f59596e2`; T2 status must check version/commit, and G0 must pin that version/commit in the immutable manifest. On this installed host:

- `claude --version` and `claude --version --output-format json` both expose only `2.1.220 (Claude Code)`;
- the installed path is a symlink to `~/.local/share/claude/versions/2.1.220`;
- the binary does not contain `4073f59596e2` as searchable bytes;
- its actual SHA-256 is `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081` and its signed CDHash is separately observable, but neither value is recorded by the live probe or required in the design/manifest.

Therefore an implementation following the exact plan can check the version but cannot reproduce the claimed commit check or distinguish the probed binary from another same-version build. Hard-coding the asserted commit from the note would be an assumption, not verification, and would make `verified_host`/`installed_unverified` untruthful.

Required correction: define one mechanically observable Claude artifact tuple—at minimum resolved executable bytes SHA-256 plus reported version and platform/architecture (or document and test an actual installed command that returns the commit). Record that tuple in the live-probe evidence, T2 readiness contract, and G0 manifest; status must recompute it from the resolved executable and report `installed_unverified` on mismatch. The helper/harness digest lock is already adequate and need not change.

### B2 — L0 does not require blocking PreCompact for both supported triggers

The prior review required a real blocking prepare failure for manual and forced-automatic compaction because the product claim and live journeys cover both trigger modes. Revised L0 says only `Invoke a real PreCompact failure` and neither the design nor plan binds that assertion to both `trigger:manual` and `trigger:auto`. A verifier can satisfy L0 with the manual case, leaving the automatic fail-closed boundary dependent on fixtures/documentation rather than the exact installed artifact.

Required correction: make L0 explicitly run the same candidate failure once through real manual `/compact` and once through bounded forced automatic compaction, proving no compact boundary/model continuation in each trigger mode. The existing automatic controls and isolation harness already make this feasible.

## Resolved safety findings

- Managed ownership is now structural, and the installed foreign `printf` is an exact install/status/uninstall preservation fixture.
- Launch/kill/timeout limitations are truthfully outside the successful-invocation guarantee; health plus L0 characterize them.
- Real SessionStart `continue:false`, genuine sub-agent compaction through SubagentStop, first-response canaries, and one immutable candidate digest are mandatory.
- Durability is correctly limited to process-level CAS/read-back; no fsync/power-loss claim remains.

confidence: high. B1 is directly supported by the installed executable surfaces; B2 follows from the exact acceptance wording and is inexpensive to close.
