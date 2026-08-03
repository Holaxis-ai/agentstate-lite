---
type: Context Note
title: Revision 3 T3.5 installed-host hook capabilities
actor: codex-precompact-v3-host-prober
timestamp: '2026-08-03T21:52:53.369Z'
---
# Summary

status: FAIL

Overall verdict: **FAIL** because the protected real-user Claude root config `~/.claude.json` changed bytes during the normal-auth attempt. The load-bearing same-event hook primitives passed on exact Claude Code 2.1.220, while observation of a first real model response is **BLOCKED_AUTH** because the inherited API key reached the API but returned a billing failure. This probe does not test candidate semantics and does not satisfy or claim R0, Q0, or L0-L3 acceptance.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: empirically test the exact Claude Code 2.1.220 host capabilities assumed by the T3.5 passive-observer and fault-synchronization rail; this serves the ultimate goal by preventing candidate acceptance from depending on inferred host scheduling behavior.

## Exact fixture identity

- Plan input: `plans/precompact-v3-t35-candidate-acceptance@sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0`.
- Pinned Claude realpath: `/Users/brian/.local/share/claude/versions/2.1.220`.
- Claude version / SHA-256 / platform: `2.1.220 (Claude Code)` / `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081` / `Darwin arm64`.
- Exact Node command: `/opt/homebrew/Cellar/node/25.2.1/bin/node`; version `v25.2.1`; SHA-256 `a885ecbb600fb6f651eed75c6d44010cc8033cc952ee88b6ee850a793e345794`.
- Success settings SHA-256: `10ff631ca8373cfccda659a74b440a509b3a9acf7cf6869f5fe81cd0bf261c43`.
- Failure settings SHA-256: `efebd6e4c46ba6555855d9a268dd0bdb6f72a141d4dbc3461936e002339fe158`.
- Hook program SHA-256: `9641e2c0b8d4f52f726c48e6718c0560874ae4e8d9171c09df40e6cc9f1a7eb3`.
- Each success handler used `type: command`, the exact Node path as `command`, and a six-element exact `args` array. The three args-array SHA-256 values were `b4dbe18319a7f45a844b38782e9aefc57245333a1d7f3286b6d947c7827cf58e`, `20cdb215c6a25b5ce2daeeca9545887cad1fed946112b809193e09a3f620af47`, and `15bc0b4328f8abc37cd8a0d120ad4e6a8d2f5828add59ab0e6441dd63f4245f5`.

Sanitized fixture: `/private/tmp/aslite-t35-host-probe.w8WyZt/evidence/sanitized-host-capabilities-v2.json`; SHA-256 `dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`.

## Component verdicts

### PASS — exec form, independent stdin, parallel start, and join

- The host accepted all three exact `command` plus `args` handlers. Three `hook_started` rows appeared before any `hook_response`; all three responses were `exit_code: 0`, `outcome: success`.
- The writer and monitor sibling start timestamps differed by 1 ms, directly establishing parallel start rather than sequential execution.
- Writer, monitor, and passive observer independently parsed stdin and recorded identical input SHA-256 and byte-count values. This proves each sibling received the complete same input independently.
- Probe-capture caveat: `observer.raw.json` serialized a Node Buffer wrapper instead of preserving replayable raw bytes. It is not used as provenance for the stdin claim; the claim rests on the equal worker-computed digest and byte count. Future fixtures should correct this capture bug before treating that raw file as exact payload bytes.
- The writer created 0600 generation-like evidence, delayed, and wrote a 0600 final-success marker 2005 ms after generation evidence.
- Writer `hook_response` was observed at `1785793395271` ms and monitor `hook_response` at `1785793396794` ms. Host initialization followed at `1785793396814` ms: every hook response preceded the host join/advance point.

### PASS — flushed writer completion is visible to a still-open sibling

Exact sanitized debug schema:

```text
level: DEBUG
record_kind: synchronous_hook_success
event: SessionStart
matcher: startup
output:
  hookSpecificOutput:
    hookEventName: string
    additionalContext: string
```

The exact writer-success debug line had SHA-256 `4a06c14338291e44c2e99f162ff0e3b7401dae9f05f0f313c845b41cea888266` and was flushed at `1785793395270` ms. The still-running monitor observed that exact line by matching its digest at `1785793395281` ms, 11 ms later, then remained open until `1785793396783` ms—another 1502 ms—before returning. Therefore exact Claude Code 2.1.220 exposes a stable post-writer-exit/pre-join success-and-output signal in its debug file. This primitive supports deterministic sibling fault synchronization without inferring completion from a writer-owned pre-exit marker.

### PASS — passive observer and failure observability

- Passive observer raw/metadata evidence was 0600. Its real-host `hook_response` was `exit_code: 0` with exactly zero stdout bytes and zero stderr bytes.
- The intentional failure handler entered and wrote 0600 evidence, emitted zero stdout/stderr, and exited 23. The host exposed a `hook_response` with `exit_code: 23`, `outcome: error`, and the exact keys `exit_code`, `hook_event`, `hook_id`, `hook_name`, `outcome`, `output`, `session_id`, `stderr`, `stdout`, `subtype`, `type`, and `uuid`. Its success evidence was absent. Handler failure plus evidence absence is therefore machine-observable.

### BLOCKED_AUTH — first real model response

All hook responses preceded host initialization and the first assistant-shaped stream row. However that row was an API error, not a model response. The isolated inherited-key attempt returned a billing failure; the normal-auth attempt under relocated config returned authentication failure. No real model response was observed, so this probe does not claim first-model-response timing. A future clean probe needs a valid isolated auth path and must retain the same protected-state checks.

No authentication values were read or exposed. No auth value appears in the shared note or sanitized fixture.

## Protected-state result — FAIL

The exact before/after inventory covered `~/.claude/settings.json`, `~/.claude/settings.local.json`, `~/.claude/hooks`, and `~/.claude.json` by metadata/hash only.

- Before inventory SHA-256: `2a3d08c8983705a2ebaf3625f148026b366644b62721bcfd52157dc5dfaf490a`.
- After inventory SHA-256: `0c2853e262db386ab00e92dfe709d34364ea33cd53a32c7650752d2a9fe0d9ef`.
- `~/.claude/settings.json`, `~/.claude/settings.local.json`, and `~/.claude/hooks` were equivalent before/after.
- The only detected protected change was `~/.claude.json`: before mode/size/SHA-256 `0600` / `261054` / `c12b0c4952a45a8e5982c398a895bc7f1c05f767a3b9810d8704f2001957e287`; after `0600` / `261054` / `c8cf676725d5a2191137614fbd75fe32422243524bbccb0d8e95ee14113ed07e`.
- Repository status and diff were empty and equivalent before/after: both channels had 0 bytes and SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

`~/.claude.json` content was not inspected, copied, or exposed, and it was not reverted or otherwise modified after detection. The exact byte drift makes the probe's overall verdict FAIL even though the load-bearing hook primitive passed.

## Isolation, process state, and retained evidence

Fresh probe root: `/private/tmp/aslite-t35-host-probe.w8WyZt`. It contains raw private evidence, including full hook inputs, session/transcript locators, debug/stdout logs, temporary host state, and probe scripts. Keep it private and do not share it as a sanitized artifact. The orchestrator's external process audit found no remaining probe processes. This probe created no tmux session. No further Claude/tmux invocation was made after the drift was detected.

No repository code commit was created. This context note is the only intended durable bundle mutation from the probe.

## Addendum — zero-output completion identity (read-only retained-evidence analysis)

Verdict: **NOT PROVEN** that exact Claude Code 2.1.220 emits a pre-join completion record which identifies a zero-stdout synchronous handler by command/args independently of its output bytes. The overall probe verdict remains FAIL.

The passive observer's stream `hook_response` occurred at `1785793393250` ms, before the writer response at `1785793395271` ms, the monitor response at `1785793396794` ms, and host initialization at `1785793396814` ms. It therefore is a real pre-join completion record. Its opaque `hook_id` SHA-256 was `49c6d38d8f1c0ed7a1f0534d18ed47ce4788631cb2f523347cc9780022433556`, and that ID correlated to exactly one earlier `hook_started` row.

Exact sanitized schemas:

```text
hook_started keys:
  hook_event, hook_id, hook_name, session_id, subtype, type, uuid

hook_response keys:
  exit_code, hook_event, hook_id, hook_name, outcome, output,
  session_id, stderr, stdout, subtype, type, uuid
```

That correlation does not identify the configured handler:

- all three sibling `hook_started` rows had the same `hook_name`, `SessionStart:startup`;
- neither `hook_started` nor `hook_response` carried a `command` or `args` key;
- the retained debug log contained neither the passive observer's opaque hook ID, passive label, nor observer-mode argument;
- the debug log contained one generic empty-output parsing line, but it carried no hook ID/name/command/args identity; and
- the only way this analysis selected the passive response was its zero-length stdout/stderr plus exit 0, which is precisely output-dependent and becomes ambiguous if more than one sibling is silent.

The host stream therefore permits an external runner to correlate one opaque start/response pair, but the retained evidence provides no stable mapping from that pair to the observer's command/args independent of output. A sibling handler also cannot safely target this completion: its input does not supply the host stream's opaque hook ID, and the shared debug file does not expose that ID or the silent handler's command/args. Settings order would be an inference, not an emitted identity contract. Any design that needs a sibling to wait specifically for a silent observer completion requires a separate explicit correlation signal or renewed production/host evidence; this probe does not establish one.
