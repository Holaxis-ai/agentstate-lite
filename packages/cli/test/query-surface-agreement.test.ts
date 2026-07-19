/**
 * One valid-query contract, exercised through both public projections: the CLI `list` command and
 * the View bridge's `query` request. This intentional TEST-ONLY sibling import does not change the
 * runtime package graph; it is the agreement seam that prevents the two consumers from drifting.
 * Parsing errors remain surface-specific and are deliberately outside this table.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  CONVENTION_TYPE,
  initBundle,
  loadKinds,
  queryHeads,
  writeDoc,
  type Bundle,
  type HeadResult,
} from "@agentstate-lite/core";

import { list } from "../src/commands/list.js";
import {
  handleBridgeRequest,
  type BridgeDeps,
  type QueryParams,
} from "../../ui/src/pages/bridge.js";

const T = "2026-07-18T00:00:00.000Z";

interface AgreementRow {
  name: string;
  params: QueryParams;
  ids: string[];
  count: number;
}

const AGREEMENT_ROWS: AgreementRow[] = [
  { name: "unfiltered, unlimited", params: { limit: 0 }, ids: ["tasks/a", "tasks/b", "tasks/c", "tasks/d"], count: 4 },
  { name: "scalar and array field membership", params: { field: "status=todo", limit: 0 }, ids: ["tasks/a", "tasks/b"], count: 2 },
  { name: "string coercion", params: { field: "priority=1", limit: 0 }, ids: ["tasks/a"], count: 1 },
  { name: "open uses declared terminal membership", params: { open: true, limit: 0 }, ids: ["tasks/a", "tasks/d"], count: 2 },
  { name: "field and open compose", params: { field: "status=todo", open: true, limit: 0 }, ids: ["tasks/a"], count: 1 },
  { name: "positive limit preserves total count", params: { limit: 2 }, ids: ["tasks/a", "tasks/b"], count: 4 },
];

async function makeBundle(): Promise<{ bundle: Bundle; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-query-agreement-"));
  const bundle: Bundle = { root: dir };
  await initBundle(dir);
  await writeDoc(bundle, {
    id: "conventions/task",
    frontmatter: {
      type: CONVENTION_TYPE,
      title: "Task",
      governs: "Task",
      fields: {
        required: ["title", "status"],
        optional: ["priority"],
        terminal: { status: ["done"] },
      },
      timestamp: T,
    },
    body: "",
  });
  for (const [id, status, priority] of [
    ["tasks/a", "todo", 1],
    ["tasks/b", ["todo", "done"], 2],
    ["tasks/c", "done", 3],
    ["tasks/d", "blocked", 4],
  ] as const) {
    await writeDoc(bundle, {
      id,
      frontmatter: { type: "Task", title: id, status, priority, timestamp: T },
      body: "",
    });
  }
  return { bundle, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

async function cliResult(bundle: Bundle, params: QueryParams): Promise<{ ids: string[]; count: number }> {
  const argv = ["--dir", bundle.root, "--type", "Task", "--fields", "status,priority", "--json"];
  if (params.field) argv.push("--field", params.field);
  if (params.open) argv.push("--open");
  if (params.limit !== undefined) argv.push("--limit", String(params.limit));
  let output = "";
  await list(argv, { stdout: (chunk) => void (output += chunk), autoPull: async () => {} });
  const parsed = JSON.parse(output) as { docs: Array<{ id: string }>; count: number };
  return { ids: parsed.docs.map((row) => row.id), count: parsed.count };
}

async function bridgeResult(
  heads: HeadResult[],
  deps: BridgeDeps,
  params: QueryParams,
): Promise<{ ids: string[]; count: number }> {
  const outcome = await handleBridgeRequest(
    { bridge: "v0", id: "agreement", type: "query", params: { type: "Task", ...params } },
    deps,
    "bundle-read",
  );
  const result = (outcome.reply as { result: { rows: HeadResult[]; count: number } }).result;
  assert.deepEqual(result.rows.map((row) => row.id), result.rows.map((row) => row.id).sort());
  assert.ok(heads.length > 0);
  return { ids: result.rows.map((row) => row.id), count: result.count };
}

test("CLI list and View bridge query agree row-for-row on valid filtering semantics", async (t) => {
  const { bundle, cleanup } = await makeBundle();
  try {
    const heads = await queryHeads(bundle, { type: "Task" });
    const registry = await loadKinds(bundle);
    const deps: BridgeDeps = {
      config: async () => ({ root: bundle.root, name: "agreement", mode: "dir" }),
      query: async () => heads,
      read: async () => ({ id: "unused", frontmatter: { type: "Task" }, body: "" }),
      kinds: async () => [...registry.kinds.values()],
      edges: async () => [],
      resolvePage: async () => false,
    };

    for (const row of AGREEMENT_ROWS) {
      await t.test(row.name, async () => {
        const expected = { ids: row.ids, count: row.count };
        assert.deepEqual(await cliResult(bundle, row.params), expected, "CLI projection");
        assert.deepEqual(await bridgeResult(heads, deps, row.params), expected, "bridge projection");
      });
    }
  } finally {
    await cleanup();
  }
});
