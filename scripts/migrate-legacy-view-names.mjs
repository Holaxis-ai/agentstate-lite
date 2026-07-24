#!/usr/bin/env node
// Phase 2a of the legacy-deprecation path (board doc decisions/legacy-deprecation-path):
// rename the legacy View names INSIDE bundle documents — `type: Page` -> `type: View` and the
// legacy `bridge` field -> `access` — plus the shipped-convention refresh. NO file moves and NO
// link rewriting: document ids and blob keys stay exactly where they are (legacy folder
// LOCATIONS remain recognized; relocation is a separate open decision), and fail-closed
// capability semantics are identical under either field name, so values are copied VERBATIM
// (an invalid value is copied and warned about, never "fixed").
//
// Repo script, not a CLI verb (that pattern decision is deliberately open on the board). All
// bundle access goes through the core engine API (packages/core/dist — build from the repo root
// first); every write is CAS-guarded through core's `versionedMutation`, so the script is safe
// to re-run: a second run reports zero changes.
//
// Usage: node scripts/migrate-legacy-view-names.mjs --dir <bundle-root> [--dir <bundle-root> ...]
//        [--dry-run] [--actor <name>]

import { readFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual, parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

import {
  deleteDoc,
  parseMarkdown,
  query,
  readDocVersioned,
  versionedMutation,
  writeDocVersioned,
} from "../packages/core/dist/index.js";

export const DEFAULT_ACTOR = "migrate-legacy-view-names";

/** The one receipt note about write normalization — engine writes are whole-document. */
export const NORMALIZATION_NOTE =
  "engine writes re-serialize whole documents to canonical form (key order, quoting, trailing " +
  "newline), so externally-authored docs may normalize formatting beyond the renamed keys.";

const VIEW_CONVENTION_ID = "conventions/view";
const CANONICAL_VIEW_CONVENTION = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../examples/views/conventions/view.md",
);

const ACCESS_VALUES = new Set(["none", "bundle-read", "bundle-propose"]);

const isViewTyped = (frontmatter) => frontmatter.type === "Page" || frontmatter.type === "View";

/**
 * Plan the in-place rename for ONE doc's frontmatter, or `null` when nothing applies. Pure —
 * re-run against every CAS attempt's fresh read. Key order is preserved (`access` takes the
 * `bridge` slot when renamed); values are copied verbatim.
 */
export function planDocChange(frontmatter) {
  const flipType = frontmatter.type === "Page";
  const hasOwnBridge = Object.hasOwn(frontmatter, "bridge") && isViewTyped(frontmatter);
  if (!flipType && !hasOwnBridge) return null;

  const hasOwnAccess = Object.hasOwn(frontmatter, "access");
  const changes = [];
  const warnings = [];
  const entries = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === "type" && flipType) {
      entries.push(["type", "View"]);
      continue;
    }
    if (key === "bridge" && hasOwnBridge) {
      if (hasOwnAccess) continue; // `access` already decides; drop the shadowed legacy field.
      entries.push(["access", value]); // verbatim — fail-closed semantics are name-independent.
      if (!ACCESS_VALUES.has(value)) {
        warnings.push(
          `bridge value ${JSON.stringify(value)} is not a recognized capability; copied verbatim ` +
            "to `access` (it fails closed to `none` at runtime under either name)",
        );
      }
      continue;
    }
    entries.push([key, value]);
  }
  if (flipType) changes.push("type_flipped");
  if (hasOwnBridge) changes.push(hasOwnAccess ? "bridge_removed" : "bridge_renamed");
  // Object.fromEntries defines properties (never invokes a setter), so a hostile key such as
  // `__proto__` cannot poison the accumulator.
  return { next: Object.fromEntries(entries), changes, warnings };
}

const isAbsence = (err) => err?.code === "ENOENT" || err?.code === "EISDIR";

async function readOrAbsent(bundle, id) {
  try {
    const { doc, version } = await readDocVersioned(bundle, id);
    return { state: doc, version };
  } catch (err) {
    if (isAbsence(err)) return { state: undefined, version: null };
    throw err;
  }
}

/** Load THE canonical shipped View convention (single-sourced from this repo's file). */
export function loadCanonicalViewConvention() {
  const raw = readFileSync(CANONICAL_VIEW_CONVENTION, "utf8");
  const { frontmatter, body } = parseMarkdown(raw, "conventions/view.md");
  return { frontmatter, body };
}

const isViewConvention = (fm) => fm.type === "Convention" && fm.governs === "View";
const isPageConvention = (fm) => fm.type === "Convention" && fm.governs === "Page";

/** Both sides arrive through THE one frontmatter parser, so deep value equality (key order ignored — the engine reorders on write) plus body equality is the idempotence basis. */
function sameDocContent(a, b) {
  return isDeepStrictEqual(a.frontmatter, b.frontmatter) && a.body === b.body;
}

/**
 * Migrate one bundle in one pass. Options: `dryRun` (plan + report, zero writes), `actor`
 * (attribution for every write), and test-only `hooks.beforeDocWrite(id, attempt)` — invoked
 * inside the CAS window so a test can inject a deterministic competing write.
 */
export async function migrateBundle(bundle, options = {}) {
  const { dryRun = false, actor = DEFAULT_ACTOR, hooks = {} } = options;
  const receipt = {
    bundle: bundle.root,
    dry_run: dryRun,
    docs_scanned: 0,
    types_flipped: 0,
    bridge_renamed: 0,
    bridge_removed: 0,
    convention_swapped: false,
    page_conventions_deleted: [],
    changed_docs: [],
    warnings: [],
    skipped_docs: [],
  };
  const warn = (id, warning) => receipt.warnings.push({ id, warning });

  const docs = await query(bundle, {}, { onSkip: ({ id, reason }) => receipt.skipped_docs.push({ id, reason }) });
  receipt.docs_scanned = docs.length;
  for (const { id, reason } of receipt.skipped_docs) {
    warn(id, `unreadable doc skipped (${reason}) — if it is Page/bridge-typed it was NOT migrated`);
  }

  // ── 1. Per-doc renames (type flip + bridge -> access), CAS-guarded, retried per doc. ─────────
  const candidates = docs.filter((doc) => planDocChange(doc.frontmatter) !== null);
  for (const candidate of candidates) {
    const id = candidate.id;
    if (dryRun) {
      const plan = planDocChange(candidate.frontmatter);
      recordPlan(receipt, id, plan, warn);
      continue;
    }
    let attemptNo = 0;
    const outcome = await versionedMutation({
      read: () => readOrAbsent(bundle, id),
      decide: (state) => {
        if (state === undefined) return { action: "done", result: null };
        const plan = planDocChange(state.frontmatter);
        if (plan === null) return { action: "done", result: null };
        return { action: "write", next: { id, frontmatter: plan.next, body: state.body }, result: plan };
      },
      write: async (next, expectedVersion) => {
        await hooks.beforeDocWrite?.(id, attemptNo++);
        return (await writeDocVersioned(bundle, next, { expectedVersion, actor })).version;
      },
    });
    if (outcome.result !== null) recordPlan(receipt, id, outcome.result, warn);
  }

  // ── 2. Shipped-convention refresh + dead Page-convention removal. ─────────────────────────────
  const canonical = loadCanonicalViewConvention();
  const conventionDocs = await query(bundle, { prefix: "conventions/", type: "Convention" });
  const pageConventionIds = conventionDocs.filter((doc) => isPageConvention(doc.frontmatter)).map((doc) => doc.id);
  const hadViewConvention = conventionDocs.some(
    (doc) => doc.id === VIEW_CONVENTION_ID && isViewConvention(doc.frontmatter),
  );
  const viewConventionOccupied = conventionDocs.some(
    (doc) => doc.id === VIEW_CONVENTION_ID && !isViewConvention(doc.frontmatter),
  );
  if (viewConventionOccupied) {
    warn(VIEW_CONVENTION_ID, "exists but is not a Convention governing View — left untouched");
  }

  // Page-typed docs remaining AFTER the doc pass (fresh query — dry-run projects the flips).
  const remainingPage = dryRun ? [] : (await query(bundle, { type: "Page" })).map((doc) => doc.id);
  const pageStockGone = dryRun
    ? receipt.skipped_docs.length === 0
    : remainingPage.length === 0 && receipt.skipped_docs.length === 0;

  // Swap an existing View convention to the current shipped content; create it only as the
  // replacement for a Page convention this run deletes (a conventions-free bundle stays
  // conventions-free — kind usage is opt-in per bundle).
  const shouldCreate = !hadViewConvention && !viewConventionOccupied && pageConventionIds.length > 0 && pageStockGone;
  if (hadViewConvention || shouldCreate) {
    if (dryRun) {
      const existing = hadViewConvention ? conventionDocs.find((doc) => doc.id === VIEW_CONVENTION_ID) : undefined;
      if (!existing || !sameDocContent(existing, canonical)) {
        receipt.convention_swapped = existing ? "would_swap" : "would_create";
      }
    } else {
      const outcome = await versionedMutation({
        read: () => readOrAbsent(bundle, VIEW_CONVENTION_ID),
        decide: (state) => {
          if (state !== undefined && !isViewConvention(state.frontmatter)) {
            return { action: "done", result: false }; // raced into an unrelated doc — leave it.
          }
          if (state !== undefined && sameDocContent(state, canonical)) {
            return { action: "done", result: false }; // already current — idempotent no-op.
          }
          return {
            action: "write",
            next: { id: VIEW_CONVENTION_ID, frontmatter: canonical.frontmatter, body: canonical.body },
            result: state === undefined ? "created" : "swapped",
          };
        },
        write: async (next, expectedVersion) =>
          (await writeDocVersioned(bundle, next, { expectedVersion, actor })).version,
      });
      receipt.convention_swapped = outcome.result;
    }
  }

  // A convention teaching a dead kind name is exactly the two-names confusion this migration
  // ends — delete it once zero Page-typed docs remain. Any remaining (or unreadable, hence
  // uncounted) Page stock keeps it, with a warning.
  for (const id of pageConventionIds) {
    if (!pageStockGone) {
      const blockers = dryRun ? receipt.skipped_docs.map((s) => s.id) : [...remainingPage, ...receipt.skipped_docs.map((s) => s.id)];
      warn(id, `Page convention kept: Page-typed stock may remain (${blockers.join(", ")})`);
      continue;
    }
    if (dryRun) {
      receipt.page_conventions_deleted.push(id);
      continue;
    }
    const outcome = await versionedMutation({
      read: () => readOrAbsent(bundle, id),
      decide: (state) => {
        if (state === undefined) return { action: "done", result: false };
        if (!isPageConvention(state.frontmatter)) return { action: "done", result: false };
        return { action: "write", next: state, result: true };
      },
      // `versionedMutation` expects a version-returning write; the delete's CAS uses the same
      // expectedVersion and the returned token is unused by this caller.
      write: async (_next, expectedVersion) => {
        await deleteDoc(bundle, id, { expectedVersion });
        return expectedVersion;
      },
    });
    if (outcome.result === true) receipt.page_conventions_deleted.push(id);
  }

  return receipt;
}

function recordPlan(receipt, id, plan, warn) {
  receipt.changed_docs.push(id);
  if (plan.changes.includes("type_flipped")) receipt.types_flipped++;
  if (plan.changes.includes("bridge_renamed")) receipt.bridge_renamed++;
  if (plan.changes.includes("bridge_removed")) receipt.bridge_removed++;
  for (const warning of plan.warnings) warn(id, warning);
}

async function main() {
  const { values } = parseArgs({
    options: {
      dir: { type: "string", multiple: true },
      "dry-run": { type: "boolean", default: false },
      actor: { type: "string", default: DEFAULT_ACTOR },
    },
  });
  const dirs = values.dir ?? [];
  if (dirs.length === 0) {
    console.error(
      "usage: node scripts/migrate-legacy-view-names.mjs --dir <bundle-root> [--dir <bundle-root> ...] [--dry-run] [--actor <name>]",
    );
    process.exit(2);
  }
  const receipts = [];
  for (const dir of dirs) {
    receipts.push(
      await migrateBundle({ root: path.resolve(dir) }, { dryRun: values["dry-run"], actor: values.actor }),
    );
  }
  console.log(JSON.stringify({ note: NORMALIZATION_NOTE, bundles: receipts }, null, 2));
}

const invokedDirectly =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err?.stack ?? String(err));
    process.exit(1);
  });
}
