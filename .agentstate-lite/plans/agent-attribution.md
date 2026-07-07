---
type: Plan
title: >-
  Implementation plan — structured, additive per-`agent` attribution (Stage-1
  Unit 2b, Unit 2 of the actor-identity design)
timestamp: '2026-07-06T16:48:10.395Z'
---
# Implementation plan — structured, additive per-`agent` attribution (Stage-1 Unit 2b, Unit 2 of the actor-identity design)

Binding, per-file plan implementing EXACTLY `scratchpad/actor-identity-design.md` (FINALIZED). One
API key (the server-set **principal**, `actor`) attributes writes to MANY client-declared **agents**
(new optional `agent`). Purely ADDITIVE: two new optional fields, one new nullable column each on two
tables, no change to version-token derivation, no existing test/behavior broken. Verified against
wrangler LOCAL simulation only — the prod D1/R2 deploy + `0003` migration is HUMAN-GATED and happens
separately AFTER this unit.

## The end-to-end chain (what must thread)

```
CLI --actor <label>                         (unchanged; shipped on doc write/update/new/delete)
  -> RemoteBackend.write sends X-Actor        (unchanged; remote-backend.ts:359)
  -> Worker createAuthGate                    (auth.ts:324)
       withActor(req, userId):
         reads incoming client X-Actor
         sets X-Actor = userId (principal, server-set, unforgeable)   <- unchanged behavior
         sets X-Agent = sanitize(client X-Actor)                      <- NEW
  -> Router writeOptionsFromHeaders           (router.ts:149-160)
         X-Actor -> options.actor  (unchanged)
         X-Agent -> options.agent  (NEW)
  -> D1R2Backend.write                        (d1r2-backend.ts:232)
         persists actor + agent into doc_heads AND doc_history (all 3 write branches)
  -> D1R2Backend.versions                     (d1r2-backend.ts:363)
         SELECT ... agent -> VersionInfo.agent
  -> Router handleVersions -> wire JSON        (router.ts:297; agent rides per entry, additive)
  -> RemoteBackend.versions parses agent       (remote-backend.ts:396)
  -> CLI doc history renders actor + agent     (doc.ts:990)
```

Reference server (`serve`, no auth): no `withActor`, no `X-Agent` manufactured -> `--actor` stays
`actor`, `agent` absent. Local `--dir` (FilesystemBackend): `--actor` -> `actor`, `agent` absent
(and not persisted anyway). The principal/agent split lives ONLY on the auth'd worker.

## Invariant to preserve (assert, do not touch)

`agent` is NOT part of the content-addressed version token. Tokens are derived EXCLUSIVELY by
`contentVersion(doc)` / `versionOfBytes(raw)` / `blobVersion(bytes)` (`core/src/versioning.ts`) over
`stringifyDoc(frontmatter, body)` — `agent` never enters frontmatter, body, or bytes. Therefore the
tri/quad-backend PARITY tests (byte-identical `sha256:<hex>` across Filesystem/Memory/Remote/D1R2)
MUST still pass unchanged. No line under `versioning.ts`, `stringifyDoc`, or any token computation is
touched by this unit. **CONFIRMED: version-token derivation is untouched.**

---

## Per-file changes

### 1. `packages/core/src/types.ts` — the seam contract (2 optional fields)

- **`VersionInfo`** (interface at 133-140, fields: `version` 135, `actor` 137, `timestamp` 139): ADD
  after `actor`:
  ```ts
  /**
   * The client-declared sub-identity/label under {@link VersionInfo.actor} (the principal), when
   * one was attested. ABSENT on backends that record no agent: FilesystemBackend (keeps no
   * history), the reference server / local `--dir` (no auth manufactures it). Only the auth'd
   * worker's `withActor` splits a client's claimed actor into this field under the server-set
   * principal — see the actor-identity design. Free-form, sanitized at the trust boundary.
   */
  agent?: string;
  ```
- **`WriteOptions`** (interface at 142-159, `actor?` at 157-158): ADD after `actor`:
  ```ts
  /**
   * OPTIONAL client-declared agent label recorded ALONGSIDE {@link WriteOptions.actor} (the
   * principal). Additive: a backend that ignores it (FilesystemBackend) or a caller that omits it
   * behaves exactly as before. NOT part of the content-addressed version token, so it never
   * affects CAS or cross-backend token parity.
   */
  agent?: string;
  ```
- No other change. Both fields optional — every existing `VersionInfo`/`WriteOptions` literal stays
  valid.

### 2. `packages/core/src/backend.ts` — FilesystemBackend (NO code change; confirm)

- `write` (297-322) already accepts `WriteOptions` and does not persist `actor` (see the 314-318
  comment). It silently ignores the new `options.agent` too — correct (design line 57: "ignores
  `options.agent`").
- `versions` (344-360) returns `[{ version, actor, timestamp }]` — no `agent` key, so `agent` is
  `undefined` (absent) on read-back. Correct.
- **CONFIRMED NO-CHANGE FILE.** Optionally extend the 314-318 comment by one clause noting `agent`
  is likewise accepted-but-not-persisted; documentation-only, not required for correctness.

### 3. `packages/core/src/memory-backend.ts` — persist + return agent (the in-proc parity backend)

- `Revision` interface (46-53): ADD `agent?: string;` (after `actor`).
- `write` (127-132): the revision literal currently
  `{ version, actor: options.actor?.trim() || defaultActor(), timestamp, doc }`. ADD:
  ```ts
  agent: options.agent?.trim() || undefined,
  ```
  (empty/whitespace agent normalizes to `undefined` = absent; `defaultActor()` is NOT applied to
  agent — an unattested agent is simply absent, unlike actor which always defaults.)
- `versions` (168): current map `({ version, actor, timestamp }) => ({ version, actor, timestamp })`.
  Change to carry `agent` (omit-when-undefined so a never-agent'd revision serializes clean):
  ```ts
  return this.chains.get(id) ?? [] ... .map(({ version, actor, timestamp, agent }) =>
    agent === undefined ? { version, actor, timestamp } : { version, actor, timestamp, agent });
  ```
- This is the standing evidence the seam honors `agent` for the hard case; it keeps agent test
  parity where FilesystemBackend cannot.

### 4. `packages/core/src/remote-backend.ts` — parse agent from the versions() response (write path UNCHANGED)

- `write` (354-369): **UNCHANGED.** It still sends `X-Actor` from `options.actor` (359); it does NOT
  send `X-Agent`. The worker manufactures `X-Agent` — a client cannot forge it. (`writeBlob` 475-496
  and `writeReserved` 413-434 `X-Actor` at 486/423 are ALSO unchanged — blobs/reserved are out of
  scope.)
- `versions` (396-401): currently `const payload = (await res.json()) as { versions: VersionInfo[] };
  return payload.versions;`. Make the agent parse EXPLICIT (defensive against foreign fields, and to
  match the design's "parse `agent` into `VersionInfo.agent`"):
  ```ts
  const payload = (await res.json()) as {
    versions: Array<{ version: Version; actor: string; timestamp: string; agent?: string }>;
  };
  return payload.versions.map((v) =>
    v.agent === undefined ? { version: v.version, actor: v.actor, timestamp: v.timestamp }
                          : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent });
  ```

### 5. `packages/server/src/router.ts` — read X-Agent; versions() JSON carries agent

- `writeOptionsFromHeaders` (149-160): after the `X-Actor` block (157-158) ADD:
  ```ts
  const agent = req.headers.get("X-Agent");
  if (agent) options.agent = agent;
  ```
  Applies to BOTH the worker (which reuses this router via `createRouterForBackend`) and `serve`
  (no auth -> no `X-Agent` header -> `options.agent` stays undefined -> agent absent — correct).
- `handleVersions` (297-301): **NO code change.** It returns `jsonResponse(200, { versions: history })`
  where `history` is `VersionInfo[]`; `JSON.stringify` omits `undefined` `agent` automatically, so
  each entry carries `agent` ONLY when the backend recorded one ("only when present, to stay minimal"
  — achieved structurally). CONFIRMED NO-CHANGE for the versions handler; the ONLY router edit is the
  two-line `X-Agent` read in `writeOptionsFromHeaders`.
- `deleteOptionsFromHeaders` (169-172): UNCHANGED — a delete records no revision, so no agent.

### 6. `packages/worker/src/auth.ts` — withActor: principal + agent split + sanitize

- ADD a `sanitizeAgent` helper (near the other module helpers, e.g. below `constantTimeEqual`):
  ```ts
  /** Max stored agent-label length (chars). A free-form attested sub-identity, not an id — capped to bound storage. */
  const AGENT_LABEL_MAX = 64;

  /**
   * Sanitize a CLIENT-DECLARED agent label before it is attested under the server-set principal:
   * trim, drop ASCII control characters (0x00-0x1F and 0x7F), and cap length. Returns `null` when
   * nothing usable remains (an empty/blank/all-control label -> no X-Agent set -> agent absent).
   * The label is free-form and untrusted-but-scoped: it can only ever attribute WITHIN the caller's
   * own principal (the principal is unforgeable), so the sanitize is about storage hygiene and
   * header safety, not authorization.
   */
  function sanitizeAgent(raw: string | null): string | null {
    if (raw === null) return null;
    // eslint-disable-next-line no-control-regex
    const cleaned = raw.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, AGENT_LABEL_MAX);
    return cleaned === "" ? null : cleaned;
  }
  ```
- `withActor` (215-220): keep the signature `(req, userId)` (its ONLY caller is line 324; no
  call-site change). Read the incoming client `X-Actor` BEFORE overriding it, then set the principal
  and the sanitized agent:
  ```ts
  export function withActor(req: Request, userId: string): Request {
    const clientActor = sanitizeAgent(req.headers.get("X-Actor")); // the client's claimed actor -> their agent label
    const headers = new Headers(req.headers);
    headers.set("X-Actor", userId);          // principal, OVERRIDING any client value (unchanged, unforgeable)
    if (clientActor) headers.set("X-Agent", clientActor);
    else headers.delete("X-Agent");          // never let a client forge X-Agent directly
    return new Request(req, { headers });
  }
  ```
  Note the explicit `headers.delete("X-Agent")`: a client cannot smuggle its own `X-Agent` — the
  worker is the ONLY place `X-Agent` is minted, and only from the (sanitized) client `X-Actor`.
- Update the module doc block (22-27, layer 3 "Actor injection") to describe the principal + agent
  split: the resolved identity's `userId` becomes `X-Actor` (principal, overriding any client value)
  AND the client's claimed `X-Actor` is sanitized into `X-Agent` (the attested sub-label under that
  principal) — so `doc_history` records BOTH the unforgeable principal and the client-attested agent.

### 7. `packages/worker/src/d1r2-backend.ts` — persist + return agent (doc path only)

- `write` (232-311): after `const actor = ...` (236) ADD `const agent = options.agent?.trim() || null;`
  (nullable column; blank normalizes to NULL). Thread `agent` into ALL THREE branches:
  - **Unconditional** (247-262):
    - `doc_heads` INSERT: columns `(id, version, actor, agent, updated_at, seq)`, values
      `(?, ?, ?, ?, ?, 1)`; `ON CONFLICT(id) DO UPDATE SET version = excluded.version,
      actor = excluded.actor, agent = excluded.agent, updated_at = excluded.updated_at,
      seq = doc_heads.seq + 1`. `.bind(id, version, actor, agent, now)`.
    - `doc_history` INSERT: `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
      SELECT ?, seq, ?, ?, ?, ? FROM doc_heads WHERE id = ? AND version = ?`.
      `.bind(id, version, actor, agent, now, id, version)`.
  - **Expect-absent create** (266-283):
    - `doc_heads`: `INSERT INTO doc_heads (id, version, actor, agent, updated_at, seq)
      VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT(id) DO NOTHING RETURNING id`.
      `.bind(id, version, actor, agent, now)`.
    - `doc_history`: `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
      SELECT ?, 1, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM doc_heads WHERE id = ? AND version = ? AND seq = 1)`.
      `.bind(id, version, actor, agent, now, id, version)`.
  - **CAS** (296-306):
    - `doc_heads`: `UPDATE doc_heads SET version = ?, actor = ?, agent = ?, updated_at = ?,
      seq = seq + 1 WHERE id = ? AND version = ?`. `.bind(version, actor, agent, now, id, options.expectedVersion)`.
    - `doc_history`: `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
      SELECT ?, seq, ?, ?, ?, ? FROM doc_heads WHERE id = ? AND version = ?`.
      `.bind(id, version, actor, agent, now, id, version)`.
  - The idempotency short-circuits (245 unconditional no-op; 287-295 redundant-CAS no-op) are
    UNCHANGED — an identical-content re-write still writes nothing, so it never records a new agent
    (matching MemoryBackend, whose content-address short-circuit likewise drops the write).
- `versions` (363-370): SELECT adds the column and the map carries it (NULL -> omit):
  ```ts
  const { results } = await this.db
    .prepare("SELECT version, actor, agent, updated_at FROM doc_history WHERE id = ? ORDER BY seq DESC")
    .bind(id)
    .all<{ version: string; actor: string; agent: string | null; updated_at: string }>();
  return results.map((r) =>
    r.agent === null ? { version: r.version, actor: r.actor, timestamp: r.updated_at }
                     : { version: r.version, actor: r.actor, timestamp: r.updated_at, agent: r.agent });
  ```
- `capabilities` (149-151), reserved (382-436), blobs (445-534): UNCHANGED — reserved/blob
  attribution is out of scope (blob `actor` at 460 stays as-is; NO blob `agent`).

### 8. `packages/worker/migrations/0003_agent.sql` — new nullable columns (NEXT-numbered)

New file (0001/0002 already exist; 0003 is next). Nullable so existing rows are `NULL` agent.
Single-line ALTERs — the test harness `splitStatements` (strips `--` lines, splits on `;`) handles
them, and `wrangler d1 migrations apply` runs files in filename order:
```sql
-- Stage-1 Unit 2b (actor-identity Unit 2): structured per-agent attribution.
-- ADD a nullable `agent` column to the doc head + history tables — the client-declared
-- sub-identity/label recorded ALONGSIDE the server-set principal (`actor`). Additive:
-- existing rows get NULL (agent absent), matching every non-worker backend. NOT part of
-- the content-addressed version token, so no reindex/backfill. Reserved/blob tables are
-- deliberately untouched (agent attribution is doc-only in v1). See src/auth.ts's
-- withActor (principal+agent split) and src/d1r2-backend.ts.

ALTER TABLE doc_heads ADD COLUMN agent TEXT;
ALTER TABLE doc_history ADD COLUMN agent TEXT;
```
**Test-harness wiring: NO change needed.** `packages/worker/test/env.ts` (`migrationStatements`)
`readdir`s `migrations/` and applies EVERY `*.sql` in sorted filename order on each `createTestEnv()`
— so `0003_agent.sql` is auto-applied to every worker test's fresh in-memory D1, and the new column
exists before any query runs. (Verified: `env.ts` reads the dir dynamically; adding the file is
sufficient.) **DO NOT** run `wrangler d1 migrations apply` against prod — that is the human-gated
deploy step, separate and later.

### 9. `packages/cli/src/commands/doc.ts` — render agent in `doc history` (+ help)

- `docHistory` (985-995): the versions map (990) currently emits `{ version, actor, timestamp }`.
  ADD `agent` when present:
  ```ts
  versions: versions.map((v) =>
    v.agent === undefined ? { version: v.version, actor: v.actor, timestamp: v.timestamp }
                          : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent }),
  ```
  `VersionInfo` is already imported and `docVersions` already returns `VersionInfo[]`, so `v.agent`
  flows straight through the TOON/JSON render (e.g. a row shows `actor: root, agent: collab-3`).
- Help block (`DOC_USAGE`, the `doc history` paragraph at 155-160): append one line noting the
  principal/agent split on an auth'd remote. Adjust wording to, e.g.:
  > `doc history` lists a doc's attributed version chain, newest first: version + actor + timestamp
  > (and `agent`, when recorded) per revision, with a count. On an AUTH'D remote, `actor` is your
  > authenticated **principal** (the API key's user, server-set and unforgeable) and `agent` is the
  > `--actor` label you declared, attested under that principal. A local `--dir` bundle keeps no
  > history and does not persist `--actor` (it reports the file's OS owner as `actor`, no `agent`) —
  > so trust attribution only against a remote.
- `reference.ts` (70-71 `doc history` summary): optionally update the one-line summary to mention
  agent; regenerate SKILL/reference after (see gates). `doc write`/`update`/`new` `--actor` help
  (doc.ts 102/133, new.ts 78) is UNCHANGED — the design's Unit 1 already landed `--actor`; Unit 2
  adds no new flag.

---

## Confirmed NO-CHANGE files (called out explicitly)

- `packages/core/src/backend.ts` (FilesystemBackend) — accepts `WriteOptions` (agent ignored),
  `versions()` returns no `agent` (absent). Degenerate-by-design. (Optional doc-comment touch-up
  only.)
- `packages/core/src/versioning.ts` and `stringifyDoc` — token derivation untouched (the parity
  invariant).
- `packages/server/src/router.ts` `handleVersions` — structural pass-through (`JSON.stringify` omits
  undefined `agent`); only `writeOptionsFromHeaders` changes.
- `packages/core/src/remote-backend.ts` `write`/`writeBlob`/`writeReserved` — send only `X-Actor`;
  the worker manufactures `X-Agent`.
- `packages/worker/src/d1r2-backend.ts` reserved + blob paths; `capabilities()`.
- `packages/worker/test/env.ts` — auto-applies `0003` by reading `migrations/` dynamically.
- `withActor` signature and its single call site (auth.ts:324) — internal-only change.

---

## Test matrix (every hop of the chain proven)

1. **Memory agent persistence** (`packages/core/test/dual-backend.test.ts`, alongside the existing
   "versions() records a real, newest-first, attributed history" at 334-347): write with
   `{ actor: "root", agent: "collab-3" }`; assert `versions()[0]` has `actor === "root"` AND
   `agent === "collab-3"`. A second write with actor only -> that revision's `agent` is `undefined`
   (absent). Proves MemoryBackend stores + returns agent and omits it when unset.

2. **Wire X-Agent round-trip** (`packages/core/test/wire-protocol.test.ts`, near the versions test at
   528-541): over a `createRouter` on a MemoryBackend, PUT a doc with BOTH `X-Actor: root` and
   `X-Agent: collab-3` headers directly, then GET `.../versions` and assert the JSON entry carries
   `actor: "root"` AND `agent: "collab-3"`. Then via `RemoteBackend` (router-as-fetchImpl) call
   `versions(id)` and assert `VersionInfo.agent === "collab-3"` parses through. A control write with
   NO `X-Agent` -> the entry has no `agent` key (JSON) and `VersionInfo.agent === undefined`. Proves
   router read + wire JSON + RemoteBackend parse.

3. **Worker withActor split** (`packages/worker/test/auth.test.ts`, alongside the X-Actor injection
   test at 456-473): use the stub bundleRouter (which reflects headers — extend it to echo BOTH
   `X-Actor` and `X-Agent`). Send an authenticated request whose CLIENT `X-Actor: collab-3` (as a
   real API-key writer, userId `u-actor`). Assert the forwarded request has `X-Actor === "u-actor"`
   (the PRINCIPAL wins) AND `X-Agent === "collab-3"` (the client label, attested). Add a
   sanitize case: client `X-Actor` with control chars / >64 chars -> `X-Agent` is stripped/capped;
   client `X-Actor` blank or absent -> NO `X-Agent` header forwarded. This is the core anti-spoof
   proof (principal server-set, agent client-attested + sanitized).

4. **Worker full-stack agent attribution** (`packages/worker/test/worker.test.ts`, alongside the
   PUT/GET round-trip at ~100-160): through the REAL `worker.fetch` -> `createAuthGate` ->
   `D1R2Backend`, PUT a doc as a writer key with client `X-Actor: collab-3`, then GET
   `.../docs/{id}/versions` and assert the entry has `actor === "<writer userId>"` (principal) AND
   `agent === "collab-3"` — proving the D1 `agent` column persists and surfaces end to end through
   the actual deployment wiring over the local D1/R2 simulation.

5. **PARITY tokens byte-identical** (`packages/worker/test/parity.test.ts`, extend the existing
   byte-identical test at 110-126): write the SAME document across Filesystem/Memory/RemoteBackend/
   D1R2Backend, once with NO agent and once WITH `{ agent: "collab-3" }`, and assert the returned
   `version` token is IDENTICAL in all cases and matches `/^sha256:[0-9a-f]{64}$/` — i.e. supplying
   `agent` does NOT perturb the content address. This is the explicit "parity holds unchanged"
   assertion the hard constraint demands.

6. **doc history renders agent** (`packages/cli/test/doc.test.ts`): drive `doc history <id>` against a
   backend that recorded an agent (a MemoryBackend-backed remote, or an injected `docVersions` dep)
   and assert the rendered row shows both `actor` and `agent` (JSON mode: entry has `agent`;
   default/TOON: `agent` field present). A control revision with no agent -> no `agent` in that row.

7. **serve / filesystem agent absent** (existing behavior, assert unchanged):
   - `packages/cli/test/doc.test.ts` (or a server test): a local `--dir` (FilesystemBackend)
     `doc history` shows `actor` (OS owner) and NO `agent`.
   - A `serve` (reference server, no auth) write with `--actor collab-3` -> `versions()` shows
     `actor: "collab-3"`, NO `agent` (no `withActor` manufactures `X-Agent`). Confirms the split
     lives ONLY on the auth'd worker and nothing regresses off it.

All PRE-EXISTING tests must still pass verbatim (additive change): the quad-backend parity/contract
suites, `dual-backend`, `wire-protocol`, `auth`, `worker`, `race`, and the CLI suites.

---

## Gates / SKILL steps (order)

1. `npm run build` and `npm run typecheck` exit 0.
2. `npm test --workspaces --if-present` green — INCLUDING `packages/worker`'s local-sim suite (the
   new `agent` column is auto-applied via `test/env.ts`; if a worker test 500s on "no such column",
   the migration file is missing/misnamed — it MUST sort after `0002`).
3. `npm run check` (build + typecheck + tests + SKILL drift gate) green.
4. If `doc history` help / `reference.ts` summary changed: regenerate SKILL.md / the reference
   artifact (per the `axi-skills` build) so the drift gate passes; re-run `npm run check`.
5. AXI conformance (gate 1): `doc history` output stays a minimal attributed row (adds one optional
   `agent` field, no full-frontmatter dump); errors/idempotency/exit-taxonomy unchanged.
6. Smoke the built CLI on `examples/sample-bundle` (init / note write+read / list / link add+show /
   view -> 4 nodes / 7 edges) — unaffected, but the standing smoke gate.
7. Commit as ONE reviewed unit (local only; no push/PR). **DO NOT** `wrangler deploy` or apply the
   `0003` migration to prod — that is the separate, human-gated deploy AFTER this unit.

## Scope out (do NOT build)

Presence / leases / assignee (a separate primitive); a registered-agents table (free-form labels in
v1); the rejected composite `"principal:agent"` string; blob/reserved-file attribution.
