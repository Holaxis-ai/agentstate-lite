---
type: Context Note
title: Revision 3 live SubagentStop installed-host fixture
actor: codex-precompact-v3-subagentstop-probe
timestamp: '2026-08-03T19:01:33.759Z'
---
# Summary

status: PASS

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: capture and sanitize a real Claude Code 2.1.220 SubagentStop hook payload without touching user-global settings or repository code; this serves the ultimate goal by replacing an inferred T0 lifecycle fixture with provenance-backed installed-host evidence.

## Probe contract

- Fresh exact `/private/tmp` root, fresh `CLAUDE_CONFIG_DIR`, and scratch project only.
- One temporary SubagentStop command hook records raw stdin privately and returns event-safe empty JSON.
- Launch the pinned installed Claude executable through a named tmux session, request one minimal real subagent, wait for completion, and terminate the session.
- Preserve exact payload field names, JSON types, and field presence while replacing identifying/content values with typed deterministic canaries.
- Record host tuple, launch method, raw evidence locator, sanitized fixture locator, before/after inventories, and user-global/repository diff proof.
- Never record authentication environment, credentials, tokens, or raw payload content in the shared bundle note.

## Result

The pinned installed Claude host launched one real `general-purpose` subagent, the subagent returned the fixed canary `SUBAGENT_OK`, the `SubagentStop` hook fired exactly once, and the parent returned `PARENT_OK`. The capture contains 13 top-level fields. Recursive type/presence comparison between raw and sanitized JSON passed, including exact field order. The live payload adds two fields absent from the prior contract-derived fixture: `background_tasks` and `session_crons`, both empty arrays in this run.

### Sanitized exact payload

```json
{
  "session_id": "00000000-0000-4000-8000-000000000001",
  "transcript_path": "/private/tmp/SANITIZED/parent-transcript.jsonl",
  "cwd": "/private/tmp/SANITIZED/project",
  "prompt_id": "00000000-0000-4000-8000-000000000002",
  "permission_mode": "bypassPermissions",
  "agent_id": "agent-id-canary-0001",
  "agent_type": "general-purpose",
  "hook_event_name": "SubagentStop",
  "stop_hook_active": false,
  "agent_transcript_path": "/private/tmp/SANITIZED/agent-transcript.jsonl",
  "last_assistant_message": "SUBAGENT_OK",
  "background_tasks": [],
  "session_crons": []
}
```

Sanitized integration fixture: `/private/tmp/aslite-subagentstop-live.o9UPJG/sanitized/subagentstop.payload.json`  
SHA-256: `283cb2466d33fed786ac58034de06a8c2200a690910674873bf88a1990bd5801`

Private raw evidence: `/private/tmp/aslite-subagentstop-live.o9UPJG/raw/subagentstop.raw.json`  
Mode: `0600` inside a `0700` root. SHA-256: `23c086f452aa0b9505b2174ef26bfcbdfb6d84aeb95d9206eb8adb304737e6af`. Raw values are intentionally not reproduced here.

Sanitized probe manifest: `/private/tmp/aslite-subagentstop-live.o9UPJG/sanitized/probe-manifest.json`  
SHA-256: `a82e38f4858f6bb3fd0d850708357dc941e768d3c28c0ff224e7a2ebee8f15b1`

## Pinned host tuple

- resolved executable: `/Users/brian/.local/share/claude/versions/2.1.220`
- reported version: `2.1.220 (Claude Code)`
- executable SHA-256: `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`
- platform/architecture: `Darwin` / `arm64`
- format: `Mach-O 64-bit executable arm64`
- size/mode: `256908272` bytes / executable

## Command method

The holaxis agent-launcher tmux pattern was used with session `aslite-substop-o9UPJG`, working directory `/private/tmp/aslite-subagentstop-live.o9UPJG/project`, and environment binding `CLAUDE_CONFIG_DIR=/private/tmp/aslite-subagentstop-live.o9UPJG/claude-config`. The absolute pinned Claude executable ran non-interactively in print mode with model alias `haiku`, `--setting-sources user`, `--strict-mcp-config`, only the `Agent` tool, four-turn and USD 0.30 caps, and a prompt requiring exactly one minimal `general-purpose` subagent. The temporary user settings registered only an absolute Node capture command for `SubagentStop`. The tmux session was killed after evidence capture; `tmux list-sessions` then reported no server.

No authentication variable/value was printed, copied into the capture hook, sanitizer, manifest, or shared note. Claude's temporary configuration internals were not read; inventories contain only file metadata and hashes.

## Isolation and diff proof

Before/after root inventories:

- `/private/tmp/aslite-subagentstop-live.o9UPJG/inventory/root-before.json` — `6077a38ca54d34544e102a69484375198e64556e614a078b16e85dd9b01fe140`
- `/private/tmp/aslite-subagentstop-live.o9UPJG/inventory/root-after.json` — `e8a797b2172a7ab9f7b6975eb42913ff374c3837618f98abbf08237878eca83c`

User-global configuration inventory covered `~/.claude/settings.json`, `~/.claude/hooks`, and `~/.claude.json` by metadata/hash only:

- before: `/private/tmp/aslite-subagentstop-live.o9UPJG/inventory/global-before.json` — `e4b5e039ecf08fb92f4da171066d16c7244aab1e8105f837731b362c4b6a9a56`
- after: `/private/tmp/aslite-subagentstop-live.o9UPJG/inventory/global-after.json` — `e4b5e039ecf08fb92f4da171066d16c7244aab1e8105f837731b362c4b6a9a56`
- byte comparison: identical (`cmp` exit 0)

Repository code proof: before and after `git status --porcelain -z --untracked-files=all` and `git diff --binary` each hashed to the empty SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. No repository code or task document changed. The requested context note is the only bundle mutation, and no sync was run.

## Verdict

PASS. Provenance blocker 3 is closed for T0: the exact installed SubagentStop field set and JSON types are now live-captured and sanitized. The T0 builder should replace the inferred fixture with the sanitized payload above and retain its installed-host provenance metadata.
