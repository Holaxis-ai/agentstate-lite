/**
 * Local D1 + R2 test harness: spins up a REAL local D1 (SQLite-backed) database and R2
 * bucket via Wrangler's `getPlatformProxy()`, applies EVERY migration in `migrations/`
 * (0001's D1R2Backend head/history index, 0002's Stage-2 auth tables — and any future
 * one, in filename order, matching `wrangler d1 migrations apply`'s own ordering), and
 * hands back the bindings `D1R2Backend`/`MembershipStore` expect.
 *
 * `persist: false` keeps every proxy fully in-memory (no `.wrangler/state` written to
 * disk) — each call gets an ISOLATED database/bucket, which is what lets every test file
 * (and, inside a file, every test that calls `createTestEnv()`) start from a clean slate
 * without leaking state across runs or needing manual teardown/reset logic.
 *
 * `getPlatformProxy` spawns a child process to host the local Miniflare simulation; this
 * is the sharp edge worth calling out (see the Part A report): each `createTestEnv()` call
 * is NOT free, so tests that need many isolated environments create as few as practical and
 * scope concurrent operations (e.g. a race test) within ONE environment instead of one per
 * operation.
 */
import { getPlatformProxy } from "wrangler";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

const here = path.dirname(fileURLToPath(import.meta.url));
const WRANGLER_CONFIG = path.join(here, "..", "wrangler.jsonc");
const MIGRATIONS_DIR = path.join(here, "..", "migrations");

export interface TestEnv {
  db: D1Database;
  bucket: R2Bucket;
  dispose: () => Promise<void>;
}

/** Strip `--` line comments and split on `;`, dropping empty statements. */
function splitStatements(sql: string): string[] {
  const withoutComments = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  return withoutComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

let migrationCache: string[] | null = null;

/** Every `NNNN_*.sql` file under `migrations/`, concatenated in filename order (matches `wrangler d1 migrations apply`). */
async function migrationStatements(): Promise<string[]> {
  if (migrationCache === null) {
    const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();
    const statements: string[] = [];
    for (const file of files) {
      statements.push(...splitStatements(await readFile(path.join(MIGRATIONS_DIR, file), "utf8")));
    }
    migrationCache = statements;
  }
  return migrationCache;
}

/** A fresh, isolated local D1 + R2 environment with the schema already applied. */
export async function createTestEnv(): Promise<TestEnv> {
  const proxy = await getPlatformProxy<{ DB: D1Database; BUCKET: R2Bucket }>({
    configPath: WRANGLER_CONFIG,
    persist: false,
  });
  // NOT `db.exec()`: D1's `exec()` splits its input on bare `\n` to find statement
  // boundaries (a documented quirk, unrelated to `;`), which shreds our multi-line
  // `CREATE TABLE (...)` statements into invalid fragments. `prepare(stmt).run()` treats
  // the whole string as ONE statement regardless of embedded newlines — the same API
  // `D1R2Backend` itself uses for every other query.
  try {
    for (const stmt of await migrationStatements()) {
      await proxy.env.DB.prepare(stmt).run();
    }
  } catch (err) {
    // A migration failure must not orphan the child process getPlatformProxy spawned to
    // host the local simulation — dispose before propagating, or a throwing migration
    // leaks a live workerd process per failed test run (seen firsthand during development:
    // an earlier bug here left a workerd process running with no owning test able to clean
    // it up, since the thrown error unwound past this function before `dispose` was ever
    // reachable).
    await proxy.dispose();
    throw err;
  }
  return { db: proxy.env.DB, bucket: proxy.env.BUCKET, dispose: proxy.dispose };
}
