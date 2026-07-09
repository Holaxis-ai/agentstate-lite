---
type: Plan
title: DELETE operation — binding per-file implementation plan
timestamp: '2026-07-06T16:48:17.269Z'
---
# DELETE operation — binding per-file implementation plan

Refines the settled spike (D1–D9) into concrete, code-grounded edits. Every signature, branch, and
error mapping below is written against the REAL current code (verified read of `types.ts`,
`backend.ts`, `memory-backend.ts`, `d1r2-backend.ts`, `remote-backend.ts`, `bundle.ts`, `router.ts`,
`auth.ts`, `doc.ts`, `versioning.ts`, `mutate.ts`, the D1 migration, and the four test harnesses).

Hard invariant carried from the settled design: **hard-delete, filesystem-native, no tombstones,
non-cascading, reserved files not deletable, idempotent (absent → `false`, never an error).**

---

## 0. The one new options type + the seam methods (settled shapes)

- **`DeleteOptions`** — a NEW, minimal interface (do NOT reuse `WriteOptions`): only
  `expectedVersion?: Version`. Deliberately **no `null` branch** (expect-absent is meaningless for a
  delete — an absent target is already an idempotent `false`) and **no `actor`** (a delete records no
  new revision to attribute; D5 makes any history purge unobservable through the read surface).
- **`delete(id, options?): Promise<boolean>`** and **`deleteBlob(key, options?): Promise<boolean>`**
  on `StorageBackend`. Return `true` = existed and was removed; `false` = already absent (idempotent
  no-op success).
- **CAS + idempotency contract (identical on every adapter):**
  - absent → `false` **regardless of `expectedVersion`** (idempotent; never throws). This is the
    load-bearing rule that makes concurrent deletes converge to "1 winner + N-1 `false`" with **no**
    spurious conflicts.
  - present + no `expectedVersion` → remove → `true`.
  - present + matching `expectedVersion` → remove → `true`.
  - present + mismatched `expectedVersion` → throw `VersionConflict(id, expectedVersion, current)`.

---

## 1. `packages/core/src/types.ts` — seam contract (mirror `write`/`writeBlob`)

Add the options interface near `WriteOptions` (~line 159):

```ts
/** Options controlling a conditional {@link StorageBackend.delete} / {@link StorageBackend.deleteBlob}. */
export interface DeleteOptions {
  /**
   * Compare-and-swap guard. When set, the delete succeeds ONLY if the backend's current version for
   * the target equals this token; a MISMATCH throws `VersionConflict`. When omitted, the delete is
   * UNCONDITIONAL. An ABSENT target is ALWAYS an idempotent no-op returning `false` — never a
   * conflict — even when `expectedVersion` is set (a delete that finds nothing to delete has already
   * converged to the caller's intent). Unlike {@link WriteOptions.expectedVersion} there is no `null`
   * (expect-absent) form: create-if-absent has no delete analogue.
   */
  expectedVersion?: Version;
}
```

Add two methods to `interface StorageBackend`, documented to mirror `write`/`writeBlob`:

```ts
  /**
   * Remove the concept document at `id`. Returns `true` when a document existed and was removed,
   * `false` when it was already absent (idempotent no-op). Honors {@link DeleteOptions.expectedVersion}
   * (compare-and-swap → typed `VersionConflict` on mismatch against a PRESENT document). History-row
   * purge is backend-discretionary and unobservable through the read surface: after a successful
   * delete `read` rejects (ENOENT-shaped), `exists` is `false`, `list` excludes it, `versions` is `[]`.
   */
  delete(id: ConceptId, options?: DeleteOptions): Promise<boolean>;
  /** Remove the blob at `key`. Same true/false + CAS + idempotency contract as {@link StorageBackend.delete}. */
  deleteBlob(key: BlobKey, options?: DeleteOptions): Promise<boolean>;
```

Export `DeleteOptions` from `index.ts` alongside `WriteOptions` (grep the existing `WriteOptions`
re-export line and add `DeleteOptions` to it).

**Capabilities discovery: NO CHANGE.** `capabilities?()` keeps `{ enforced_cas, blobs, projections,
backlinks }`. Delete is a CORE seam method every backend implements (like `read`/`write`), not an
optional capability — confirmed: nothing in `handleCapabilities` (router) or the wire capabilities
test needs to grow a `delete` flag.

---

## 2. `packages/core/src/backend.ts` — `FilesystemBackend` (unlink under the per-path mutex)

Reuse the existing `withLock(target, …)` + `currentVersionAt` / `currentBlobVersionAt` helpers. The
whole check-then-unlink runs inside the SAME static per-resolved-path mutex `write`/`writeBlob` use,
so concurrent deletes (and delete-vs-write) to one path serialize.

Add after `write()` / `writeBlob()` respectively:

```ts
  async delete(id: ConceptId, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeConceptId(id);
    const target = this.abs(pathFromConceptId(id));
    return this.withLock(target, async () => {
      const current = await this.currentVersionAt(target);   // null if absent
      if (current === null) return false;                     // idempotent no-op (even under CAS)
      if (options.expectedVersion !== undefined && current !== options.expectedVersion) {
        throw new VersionConflict(id, options.expectedVersion, current);
      }
      await fs.unlink(target);
      return true;
    });
  }

  async deleteBlob(key: BlobKey, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeBlobKey(key);
    const target = this.abs(key);
    return this.withLock(target, async () => {
      const current = await this.currentBlobVersionAt(target); // null on ENOENT/EISDIR
      if (current === null) return false;
      if (options.expectedVersion !== undefined && current !== options.expectedVersion) {
        throw new VersionConflict(key, options.expectedVersion, current);
      }
      await fs.unlink(target);
      return true;
    });
  }
```

- `currentVersionAt` already returns `null` on any read failure; `currentBlobVersionAt` already
  returns `null` only on `isAbsentFileError` (ENOENT/EISDIR) and re-throws real errors (EACCES/…) —
  correct: a permissions error must NOT masquerade as "absent → false".
- Import `DeleteOptions` in the `import type { … }` block.
- **Empty parent directories are intentionally NOT pruned** (filesystem-native, mirrors the fact that
  `atomicWrite` creates but never prunes dirs; the concept/blob walks skip empty dirs anyway). State
  this in a one-line comment so a later reviewer doesn't "fix" it.
- Best-effort-across-processes caveat is UNCHANGED and inherited from `withLock` — same as `write`.

---

## 3. `packages/core/src/memory-backend.ts` — `MemoryBackend` (map delete under sync CAS)

Add after `write()` / `writeBlob()`. The CAS check and the `Map.delete` are synchronous with no
`await` between them → atomic against the in-process map (mirrors `write`'s enforced CAS).

```ts
  async delete(id: ConceptId, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeConceptId(id);
    const current = this.chains.get(id)?.[0]?.version ?? null;
    if (current === null) return false;
    if (options.expectedVersion !== undefined && options.expectedVersion !== current) {
      throw new VersionConflict(id, options.expectedVersion, current);
    }
    this.chains.delete(id);   // purges the whole chain → versions()/read()/exists()/list() all reflect absence (D5)
    return true;
  }

  async deleteBlob(key: BlobKey, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeBlobKey(key);
    const current = this.blobs.get(key)?.version ?? null;
    if (current === null) return false;
    if (options.expectedVersion !== undefined && options.expectedVersion !== current) {
      throw new VersionConflict(key, options.expectedVersion, current);
    }
    this.blobs.delete(key);
    return true;
  }
```

Import `DeleteOptions` in the `import type { … }` block.

---

## 4. `packages/worker/src/d1r2-backend.ts` — `D1R2Backend` (conditional DELETE, atomic)

Mirrors the existing CAS-write idiom: a single atomic conditional statement, and a follow-up read
ONLY to classify a zero-row outcome (absent → `false` vs. present-but-mismatched → `VersionConflict`)
— exactly how `write()` computes `actual` for its `VersionConflict` after `meta.changes === 0`.

**Doc delete — history purge is explicit and guaranteed via `db.batch`** (do NOT depend on
`ON DELETE CASCADE` being active: `PRAGMA foreign_keys = ON` is per-connection and not guaranteed on
a later D1 connection). The second batch statement purges `doc_history` only when the head row is now
gone, so a LOSING CAS delete (head still present) leaves history intact:

```ts
  async delete(id: ConceptId, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeConceptId(id);
    const headDelete =
      options.expectedVersion === undefined
        ? this.db.prepare("DELETE FROM doc_heads WHERE id = ?").bind(id)
        : this.db.prepare("DELETE FROM doc_heads WHERE id = ? AND version = ?").bind(id, options.expectedVersion);
    const results = await this.db.batch([
      headDelete,
      // Purge history ONLY when no head row for `id` survives this batch (a lost CAS keeps its head,
      // so its history is untouched). D1 commits the batch atomically, statements in order.
      this.db
        .prepare("DELETE FROM doc_history WHERE id = ? AND NOT EXISTS (SELECT 1 FROM doc_heads WHERE id = ?)")
        .bind(id, id),
    ]);
    if (results[0]!.meta.changes > 0) return true;      // head removed → success
    if (options.expectedVersion === undefined) return false; // unconditional zero-rows → absent
    const current = await this.currentDocVersion(id);
    if (current === null) return false;                  // absent under CAS → idempotent false
    throw new VersionConflict(id, options.expectedVersion, current); // present + mismatched → conflict
  }
```

**Blob delete — no history table, single statement:**

```ts
  async deleteBlob(key: BlobKey, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeBlobKey(key);
    const stmt =
      options.expectedVersion === undefined
        ? this.db.prepare("DELETE FROM blob_heads WHERE key = ?").bind(key)
        : this.db.prepare("DELETE FROM blob_heads WHERE key = ? AND version = ?").bind(key, options.expectedVersion);
    const result = await stmt.run();
    if (result.meta.changes > 0) return true;
    if (options.expectedVersion === undefined) return false;
    const current = await this.currentBlobVersion(key);
    if (current === null) return false;
    throw new VersionConflict(key, options.expectedVersion, current);
  }
```

- Import `DeleteOptions` from `@agentstate-lite/core` (type import block).
- **R2 content bytes are intentionally left in place** (content-addressed shared/deduped namespace; a
  head row is the only thing that makes content reachable — with the head gone, `read` throws ENOENT).
  R2 GC is out of scope; orphaned content is unobservable through the read surface (D5). Add a
  one-line comment saying so.
- No `migrations/*.sql` change needed — `doc_history` FK/`seq` schema is untouched; deletes only
  remove rows.
- `capabilities()` unchanged.

---

## 5. `packages/core/src/remote-backend.ts` — `RemoteBackend` (DELETE request + 412 mapping)

`toError` ALREADY maps a `412` to a reconstructed `VersionConflict(fallbackId, expected, actual)` from
the envelope's `details`, and everything else to `RemoteError`. Reuse it verbatim. Reuse
`assertValidExpectedVersion` (rejects `""`). Add after `write()` / `writeBlob()`:

```ts
  async delete(id: ConceptId, options: DeleteOptions = {}): Promise<boolean> {
    assertValidExpectedVersion(options.expectedVersion);
    const headers: Record<string, string> = {};
    if (options.expectedVersion !== undefined) headers["If-Match"] = options.expectedVersion;
    const res = await this.send(`/docs/${encodeId(id)}`, { method: "DELETE", headers });
    if (!res.ok) throw await this.toError(res, id);   // 412 → VersionConflict; other non-2xx → RemoteError
    const payload = (await res.json()) as { deleted: boolean };
    return payload.deleted;
  }

  async deleteBlob(key: BlobKey, options: DeleteOptions = {}): Promise<boolean> {
    assertValidExpectedVersion(options.expectedVersion);
    const headers: Record<string, string> = {};
    if (options.expectedVersion !== undefined) headers["If-Match"] = options.expectedVersion;
    const res = await this.send(`/blobs/${encodeBlobKey(key)}`, { method: "DELETE", headers });
    if (!res.ok) throw await this.toError(res, key);
    const payload = (await res.json()) as { deleted: boolean };
    return payload.deleted;
  }
```

- Import `DeleteOptions` in the `import type { … }` block.
- **No `404` branch** — the wire contract returns `200 {deleted:false}` for an absent target, never
  `404` (D7). A `404` would only occur for a genuinely bad route and correctly falls to `toError`
  (→ `RemoteError`, `NOT_FOUND` code), which is fine.
- `assertValidExpectedVersion` only rejects `""`; `DeleteOptions` has no `null` member, so `If-Match`
  is the only conditional header ever emitted (no `If-None-Match`).

---

## 6. `packages/server/src/router.ts` — DELETE branches (doc + blob), If-Match CAS, reserved 400, idempotent 200

Add a small header helper next to `writeOptionsFromHeaders` (delete only ever reads `If-Match`, never
`If-None-Match`/`X-Actor`):

```ts
/** Read a CAS `If-Match` (quote/weak-tolerant) into a `DeleteOptions`. No `If-None-Match` for delete. */
function deleteOptionsFromHeaders(req: Request): DeleteOptions {
  const ifMatch = req.headers.get("If-Match");
  return ifMatch !== null ? { expectedVersion: stripETagWrapper(ifMatch) } : {};
}
```

Add two handlers inside `buildRouter` (next to `handleWriteDoc` / `handleWriteBlob`):

```ts
  async function handleDeleteDoc(id: ConceptId, req: Request): Promise<Response> {
    assertValidDocId(id); // rejects traversal AND reserved ids → plain Error → 400 USAGE via catch-all (D4/D7)
    const deleted = await backend.delete(id, deleteOptionsFromHeaders(req)); // VersionConflict → 412 via errorFromCaught
    return jsonResponse(200, { deleted });
  }

  async function handleDeleteBlob(key: BlobKey, req: Request): Promise<Response> {
    assertSafeBlobKey(key); // rejects .md-ending keys (incl. index.md/log.md) + traversal → 400 USAGE
    const deleted = await backend.deleteBlob(key, deleteOptionsFromHeaders(req));
    return jsonResponse(200, { deleted });
  }
```

Wire them into the method dispatch:

- In the `rest.startsWith("docs/")` block, alongside GET/PUT/HEAD:
  `if (req.method === "DELETE") return await handleDeleteDoc(id, req);`
- In the `rest.startsWith("blobs/")` block, alongside GET/PUT/HEAD:
  `if (req.method === "DELETE") return await handleDeleteBlob(key, req);`

Notes:
- `DELETE` under `reserved/` is NOT added — it falls through the reserved block's existing
  `unsupported method → 400 USAGE`, which is exactly the D4 "reserved files not deletable" outcome.
- `DELETE /docs` (collection, no id) and `DELETE /blobs` (collection) fall through their existing
  `unsupported method → 400 USAGE` guards (no bulk delete — SCOPE OUT).
- Response carries **no** version headers (nothing survives to version). Just `{ deleted }`.
- Import `DeleteOptions` and (already present) `stripETagWrapper` from `@agentstate-lite/core`.
- The `.../versions` sub-resource check is GET-only and unaffected.

---

## 7. `packages/worker/src/auth.ts` — `classifyBundleRoute` (DELETE = write-class)

`DELETE` on the two deletable namespaces (docs/blobs) is a mutation → `writer`. Reserved stays
`reader` (there is no reserved-delete op; the router 400s it either way, so no need to broaden):

```ts
export function classifyBundleRoute(method: string, rest: string): Role {
  const isWrite =
    (rest.startsWith("docs/") && (method === "PUT" || method === "DELETE")) ||
    (rest.startsWith("reserved/") && method === "PUT") ||
    (rest.startsWith("blobs/") && (method === "PUT" || method === "DELETE"));
  return isWrite ? "writer" : "reader";
}
```

Result (D6): reader → `403 FORBIDDEN` on a DELETE to docs/blobs; writer/admin allowed; root is admin
everywhere; the `X-Actor` injection and single-bundle guard are untouched. No change to `worker.ts`/
`index.ts` wiring — DELETE flows through the existing `createAuthGate` → `createRouterForBackend`.

---

## 8. `packages/core/src/bundle.ts` — engine wrappers (additive, via `backendFor`)

Mirror `writeDocVersioned`/`writeBlob`'s shape. `deleteDoc` carries the SAME reserved-file +
id-safety guard `writeDocVersioned`/`readDocVersioned` carry (enforcing D4 at the engine layer, not
just the CLI/router); `deleteBlob` is a pure pass-through (the `assertSafeBlobKey` guard lives in the
backend, exactly like `writeBlob`).

```ts
/** Delete a concept document. `true` = existed & removed, `false` = already absent (idempotent). CAS via `options.expectedVersion`. */
export async function deleteDoc(bundle: Bundle, id: ConceptId, options?: DeleteOptions): Promise<boolean> {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file, not a concept — use the index/log accessors, not deleteDoc.`);
  }
  return backendFor(bundle).delete(id, options);
}

/** Delete a blob by key. Same true/false + CAS + idempotency contract. See {@link StorageBackend.deleteBlob}. */
export async function deleteBlob(bundle: Bundle, key: BlobKey, options?: DeleteOptions): Promise<boolean> {
  return backendFor(bundle).deleteBlob(key, options);
}
```

- Import `DeleteOptions` in the `import type { … }` block; export both functions from `index.ts`.
- **D8 provenance-log decision — DO NOT auto-append a `log.md` "deleted <id>" entry.** Rationale: no
  engine write path self-logs (`writeDoc`/`writeBlob` don't call `appendLog`; logging is always
  caller-driven, e.g. `sync`). Auto-appending on delete would (a) diverge from `writeDoc`'s posture,
  (b) add a reserved-file read-CAS-write (and, over `--remote`, an extra round trip) to every delete,
  and (c) re-create the deleted id's provenance in a file the delete was meant to reduce clutter
  around. Keep the wrapper a pure pass-through; revisit provenance logging as a cross-cutting concern
  if/when `writeDoc` gets it too.

---

## 9. `packages/cli/src/commands/doc.ts` + `cli.ts` — `doc delete <id>` and the blob-delete verb

### 9a. `doc delete <id>` (AXI-clean, idempotent, CAS, reserved-reject)

Dispatch: in `doc()`, add `if (sub === "delete") return docDelete(rest, deps);` and extend the
unknown-subcommand message to `write|update|read|delete`. Add `delete` to `DOC_USAGE`.

```ts
async function docDelete(argv: string[], deps: Partial<DocCliDeps>): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs({
      args: argv,
      options: {
        "expected-version": { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
      allowPositionals: true,
    }),
    "doc delete",
  );
  if (values.help) { stdout(DOC_USAGE); return; }

  const id = positionals[0]?.trim();
  if (!id) throw new CliError("USAGE", "doc delete requires a concept <id> positional", { help: `${cliInvocation()} doc delete <id>` });

  // D4: reserved ids are not deletable — reject with a clean USAGE (exit 2) before any bundle op.
  if (isReservedFile(pathFromConceptId(id))) {
    throw new CliError("USAGE", `'${id}' is a reserved OKF file (index.md/log.md), not a deletable concept`, {
      help: `${cliInvocation()} list`,
    });
  }

  const bundle = await openBundle(values.dir, resolveRemoteFlag(values.remote, values.dir));
  const expectedVersion = values["expected-version"]?.trim() || undefined;

  let deleted: boolean;
  try {
    deleted = await deleteDoc(bundle, id, expectedVersion ? { expectedVersion } : undefined);
  } catch (err) {
    if (err instanceof VersionConflict) {
      // Local backend throws VersionConflict directly; --remote maps 412 → VersionConflict in RemoteBackend.
      throw new CliError("STALE_HEAD", err.message, {
        help: `${cliInvocation()} doc read ${id}`,
        details: { expected: err.expected, actual: err.actual },
      });
    }
    throw classifyBundleError(err, values.remote); // reserved plain-Error → USAGE; RemoteError → its code
  }

  const receipt: Record<string, unknown> = {
    doc: "deleted",
    id,
    deleted,                               // boolean: true=removed, false=already absent (AXI P6 idempotent, exit 0)
    help: [`${cliInvocation()} list`],
  };
  stdout(render(receipt, resolveMode(values)));
}
```

- Imports to add to `doc.ts`: `deleteDoc`, `VersionConflict` from `@agentstate-lite/core`
  (`isReservedFile`, `pathFromConceptId`, `classifyBundleError`, `openBundle`, `resolveRemoteFlag`,
  `render`, `resolveMode`, `CliError`, `cliInvocation`, `parseOrUsage` are already imported).
- **`deleted` is a BOOLEAN** (`true`/`false`) — reconciling the spike's `{deleted:"true"/"false"}`
  notation with the rest of the stack: the wire returns JSON `{deleted:true|false}`, `RemoteBackend`
  parses it as a boolean, and `doc update`'s sibling receipt field `changed` is already a boolean.
  TOON renders it as `deleted: true` / `deleted: false`. Uniform type end-to-end; the spike's quotes
  are read as value-illustration.
- **Idempotency (AXI P6):** absent target → `deleteDoc` returns `false` → `deleted: false`, exit 0.
  No special-casing; `false` is a success.
- **Reserved reject:** explicit CLI USAGE (exit 2) for a crisp message; the engine `deleteDoc` guard
  is the belt-and-suspenders backstop (a plain `Error` → `classifyBundleError` → USAGE anyway).
- **CAS:** `--expected-version <v>` mismatch → `VersionConflict` → `STALE_HEAD` (CONFLICT, **exit 5**)
  with `details:{expected,actual}` and a re-read hint — mirrors `promote`'s conflict mapping. NOTE: a
  stale token against an already-ABSENT doc returns `false` (idempotent), not a conflict — by the
  seam contract; the receipt is `deleted:false` exit 0. Say this in `DOC_USAGE`.
- **`--remote`:** `openBundle`/`resolveRemoteFlag` already route through `RemoteBackend`; no
  delete-specific wiring. `init --remote` rejection is unrelated and unaffected.

### 9b. Blob-delete CLI — THE OPEN DECISION, resolved

**DECISION (binding): ship a top-level, key-addressed `delete --doc-key <key>` verb, symmetric with
`promote`/`pull`, that routes by key shape** — a `.md` key → `deleteDoc` (via `conceptIdFromPath`), any
other key → `deleteBlob`. Keep `doc delete <id>` (9a) as the concept-native ergonomic form.

Rationale (recommended over the alternatives the spike floated):
- Blob addressing in this CLI lives ONLY in the `--doc-key` family (`promote`/`pull`). A key-addressed
  delete is their natural inverse and introduces **no new addressing concept** for blobs — the felt
  gap the spike names ("symmetric pull-family verb").
- A `--delete` flag on `promote`/`pull` was rejected: those verbs are byte-MOVEMENT (`promote` = bytes
  in, `pull` = bytes out); overloading them with a destructive no-bytes mode is semantically muddy.
- The doc/blob overlap (`delete --doc-key x.md` vs `doc delete x`) is the SAME, already-accepted
  overlap the repo tolerates between `pull --doc-key x.md` and `doc read --out` — consistent design
  language, not new debt.

Spec for `delete --doc-key <key>` (new file `packages/cli/src/commands/delete.ts`, mirroring
`pull.ts`'s shape):
- Options: `--doc-key <key>` (required), `--expected-version <v>`, `--dir`, `--remote`, `--json`, `-h`.
- Route by `key.toLowerCase().endsWith(".md")` (same case-insensitive test `pull`/`promote` use):
  - **doc route:** `const id = conceptIdFromPath(key);` then reuse the SAME `deleteDoc` call +
    reserved-reject + `VersionConflict`→`STALE_HEAD` mapping as 9a. (`conceptIdFromPath("index.md")` →
    `"index"`; `deleteDoc`'s `isReservedFile` guard still fires → USAGE, so `index.md`/`log.md` keys
    are rejected identically.)
  - **blob route:** `const deleted = await deleteBlob(bundle, key, expectedVersion ? {expectedVersion} : undefined);`
    with the same `VersionConflict`→`STALE_HEAD` mapping (`assertSafeBlobKey` runs in the backend).
- Receipt: `{ delete: "<key>", target: "doc"|"blob", deleted: <boolean>, help: [<invocation> list | pull …] }`.
- Register in `cli.ts`: add `"delete"` to `KNOWN_COMMANDS` and `delete: wrap(deleteCommand)` in the
  `commands` map (import the new module). Add it to the `reference.ts` command groups so `--help`
  lists it (single source of truth — the SKILL drift gate + `npm run check` require this).

> If the maintainer prefers a strictly smaller surface, the drop-in reduction is: ship ONLY `doc
> delete <id>` now and defer `delete --doc-key`. But the spike asked for the decision to be MADE and
> the blob path SPECIFIED; the above is that specification. `deleteBlob` on the engine + wire is
> shipped regardless (worker/CLI-remote tests need it), so deferring the verb costs no seam work.

---

## 10. Docs + STATUS

- `docs/WIRE-PROTOCOL.md`: add `DELETE /v0/bundles/{bundle}/docs/{id}` and `.../blobs/{key}` to the
  endpoint set — `If-Match:<version>` = CAS → `412 { error.details:{expected,actual} }`; no `If-Match`
  = unconditional; success → `200 { deleted: true|false }`; **absent target → `200 {deleted:false}`,
  NOT `404`**; reserved-id → `400 USAGE`; no bulk `DELETE /docs`. Note it resolves the previously-open
  "no delete on the wire" gap; delete is a CORE method (capabilities descriptor unchanged).
- `STATUS.md`: one changelog row — delete wired across all four adapters + engine wrappers + wire +
  CLI + auth; hard-delete, non-cascading, reserved-protected, idempotent.

---

## 11. TEST MATRIX (per the required coverage)

### 11a. Cross-backend parity — `packages/core/test/dual-backend.test.ts` (FS + Memory RUNNERS)
- **delete present:** `deleteDoc` → `true`; then `readDoc` rejects ENOENT, `exists` → `false`,
  `list`/`query` excludes it, `docVersions` → `[]`. Assert identical over both runners.
- **delete absent (idempotent):** `deleteDoc` on a never-written id → `false` (no throw). Delete then
  re-delete → second call `false`.
- **CAS delete:** write → capture `version`; `deleteDoc(id, {expectedVersion: version})` → `true`.
  Write again, then `deleteDoc(id, {expectedVersion: <stale>})` → throws `VersionConflict` (assert
  `.expected`/`.actual`). `deleteDoc(<absent id>, {expectedVersion: <any>})` → `false` (idempotent,
  NOT a conflict — pin this explicitly).
- **reserved reject:** `deleteDoc(bundle, "index")` and `deleteDoc(bundle, "log")` throw a plain
  `Error` (assert message mentions "reserved").

### 11b. Blob parity — `packages/core/test/blob.test.ts` (FS + Memory RUNNERS)
- `deleteBlob` present → `true`; then `readBlob` → `null`, `existsBlob` → `false`, `listBlobs`
  excludes. Absent → `false`. CAS matching → `true`; stale → `VersionConflict`; absent+CAS → `false`.

### 11c. CAS race (idempotent convergence)
- **Memory (dual-backend.test.ts):** write one doc; fire **N concurrent unconditional** `deleteDoc`s
  via `Promise.allSettled` → **exactly 1 `true` + (N-1) `false`, zero rejections** (the winner
  removes, the rest see it absent). Also **N concurrent CAS deletes racing the SAME
  `expectedVersion`** → **exactly 1 `true` + (N-1) `false`** (losers find it already absent →
  idempotent `false`, NOT `VersionConflict`) — pin this as the correct semantic. A SEPARATE assertion
  covers a genuine conflict: overwrite to v1, then CAS-delete with the v0 token → `VersionConflict`.
- **D1R2 (`packages/worker/test/race.test.ts`):** the identical N-concurrent shape (uses
  `Promise.allSettled` + `createTestEnv` already) — 1 `true` + N-1 `false`; and versions→`[]` /
  `doc_history` empty after the winner (proves the batched history purge).

### 11d. Idempotent no-op (CLI, `packages/cli/test/doc.test.ts`)
- `doc delete <id>` on a present doc → `deleted:true`, exit 0; on an absent id → `deleted:false`,
  exit 0 (AXI P6). Re-delete → `deleted:false`, exit 0.

### 11e. Reserved-id reject
- Router (`wire-protocol.test.ts`): `DELETE /v0/bundles/test/docs/index.md` → `400`, envelope
  `code:"USAGE"`, `SpyBackend` never sees a `delete` call.
- CLI (`doc.test.ts`): `doc delete index` → USAGE, exit 2.
- Engine (dual-backend.test.ts): covered in 11a.

### 11f. Wire DELETE round-trip + 412 CAS — `packages/core/test/wire-protocol.test.ts`
- `RemoteBackend.delete` present → `true`; absent → `false` (assert the wire returned `200`, not
  `404`). Same for `deleteBlob`.
- Raw router assertions: `DELETE /docs/{id}` present → `200 {deleted:true}`; absent → `200
  {deleted:false}`.
- CAS: stale `If-Match` → `412` → `RemoteBackend` throws reconstructed `VersionConflict` (assert
  `.expected`/`.actual` from `details`); matching `If-Match` → `200 {deleted:true}`. Blob symmetric.
- Traversal/unsafe id: `DELETE /docs/..%2F..%2Fetc/hosts` → `400`, backend `delete` never called
  (extend the existing `SpyBackend` guard test). Blob `.md`-key delete → `400`.
- **`SpyBackend` must gain forwarding stubs** for `delete`/`deleteBlob` (it `implements
  StorageBackend`, so it won't compile otherwise):
  `delete(id, o?) { this.calls.push(\`delete:${id}\`); return this.inner.delete(id, o); }` and the
  `deleteBlob` analogue. (`StubBackend` in `server/test/capabilities.test.ts` `extends MemoryBackend`
  → inherits the new methods, no change.)

### 11g. Worker contract — `packages/worker/test/contract.test.ts` + `parity.test.ts`
- `contract.test.ts`: delete doc round-trip (present→`true`, `read` ENOENT, `exists`→`false`,
  `list` excludes, **`versions`→`[]`** — the assertion that pins the `doc_history` purge / cascade),
  CAS delete (stale→conflict, matching→`true`), delete blob round-trip + CAS.
- `parity.test.ts`: extend the quad-backend scenario so a delete + subsequent `list`/`versions`
  yields IDENTICAL results across FS / Memory / D1R2.

### 11h. Auth role — `packages/worker/test/auth.test.ts`
- Unit: `classifyBundleRoute("DELETE","docs/x") === "writer"`, `("DELETE","blobs/x") === "writer"`,
  `("DELETE","reserved/log.md") === "reader"` (add to the existing `classifyBundleRoute` test).
- Gate: a **reader-role** key issuing `DELETE /v0/bundles/default/docs/x` → `403 FORBIDDEN`
  (`access_denied` event recorded) — extend the existing "reader gets 403 on a write route" test; a
  **writer-role** key → reaches the router → `200 {deleted}`.

### 11i. CLI over `--remote` — `packages/cli/test/remote.test.ts`
- `doc delete <id> --remote` against a real `serve()` instance: present → `deleted:true` exit 0;
  absent → `deleted:false` exit 0. `--expected-version <stale>` → CONFLICT (exit 5). Confirms the
  full CLI → HTTP → engine delete loop, mirroring the file's existing `link add --remote` pattern.
- If `delete --doc-key` (9b) ships: a `.md` key and a blob key each round-trip `--remote`.

---

## 12. Files touched (summary)

| File | Change |
|---|---|
| `packages/core/src/types.ts` | `DeleteOptions` interface; `delete`/`deleteBlob` on `StorageBackend`; export `DeleteOptions` |
| `packages/core/src/backend.ts` | `delete`/`deleteBlob` — unlink inside `withLock`, CAS via `currentVersionAt`/`currentBlobVersionAt`, absent→false |
| `packages/core/src/memory-backend.ts` | `delete`/`deleteBlob` — sync map delete under CAS |
| `packages/worker/src/d1r2-backend.ts` | `delete` (batched head+guarded-history purge) / `deleteBlob` (single conditional DELETE) |
| `packages/core/src/remote-backend.ts` | `delete`/`deleteBlob` — DELETE request, `If-Match` CAS, `toError` 412→`VersionConflict`, parse `{deleted}` |
| `packages/core/src/bundle.ts` | `deleteDoc` (reserved-guard) / `deleteBlob` engine wrappers; export both |
| `packages/server/src/router.ts` | `deleteOptionsFromHeaders`; `handleDeleteDoc`/`handleDeleteBlob`; DELETE dispatch in docs/blobs blocks |
| `packages/worker/src/auth.ts` | `classifyBundleRoute` — DELETE on docs/blobs = writer |
| `packages/cli/src/commands/doc.ts` | `doc delete <id>` subcommand + `DOC_USAGE` |
| `packages/cli/src/commands/delete.ts` (new) + `cli.ts` + `reference.ts` | `delete --doc-key <key>` key-routed verb; register in `KNOWN_COMMANDS`/commands/help |
| `packages/core/src/index.ts`, `@agentstate-lite/core` re-exports | export `DeleteOptions`, `deleteDoc`, `deleteBlob` |
| `docs/WIRE-PROTOCOL.md`, `STATUS.md` | document the DELETE routes + changelog |
| tests: `dual-backend`, `blob`, `wire-protocol` (incl. `SpyBackend` stubs), `worker/{contract,race,parity,auth}`, `cli/{doc,remote}` | per §11 |

**Confirmed no-change:** `capabilities?()` and `handleCapabilities` (delete is core, not an optional
capability); `migrations/*.sql` (deletes only remove rows); worker `index.ts`/`worker.ts` wiring
(DELETE flows through the existing gate+router); `StubBackend` in `capabilities.test.ts` (inherits
from `MemoryBackend`).
