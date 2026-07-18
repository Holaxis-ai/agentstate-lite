// `agentstate-lite status` — a read-only, whole-bundle health report (bundle lint).
//
// COMPOSITION only: this command adds NO new core validation/link/freshness logic. It composes
// existing core machinery — `loadKinds`/`validateAgainstKind` (kind conformance), `parseLinksFromDoc`
// (cross-links, reversed in-memory for orphan derivation), and `freshness()` fed a kind's declared
// horizon (staleness) — into one report. ONE registry load (`loadKinds`) + ONE `query(bundle)` + ONE
// prefix-scoped `listBlobs` (the legacy_naming audit) per invocation; everything else derives in
// memory. Orphans come from reversing the SAME edge set built
// while scanning for unresolved links — never a per-doc `backlinks()` call (that would be N
// whole-bundle traversals over data this command already has in hand).
//
// "Unresolved links", not "broken": OKF §5 explicitly permits links to not-yet-written knowledge, so
// a link whose target isn't in the queried doc set is informational, not an error. External hrefs
// (`isExternalHref`, already filtered out by `parseLinksFromDoc`) never count.
//
// Findings are REPORTS, not errors: exit is ALWAYS 0 once the analysis runs (a bad invocation or a
// missing bundle still exits USAGE/NOT_FOUND as usual, via `parseOrUsage`/`openBundle`). A future
// `--fail-on-findings` CI flag is intentionally NOT built here.
//
// Duplicate-id detection (the old v1.1 wishlist item) is DELIBERATELY DROPPED: a concept id IS its
// storage path, so ids are structurally unique per backend — there is nothing to detect.
import { parseArgs } from "node:util";
import {
  freshness,
  freshnessHorizonMs,
  isTerminal,
  listBlobs,
  loadKinds,
  type OkfDocument,
  parseLinksFromDoc,
  query,
  validateAgainstKind,
} from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { maybeAutoPull } from "../autopull.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { collectLinkDeclarations } from "../link-types.js";
import { isLegacyPageDoc, isLegacyRegistryDocId, LEGACY_PAGE_BLOB_PREFIX } from "../legacy-page.js";

export const STATUS_USAGE = `agentstate-lite status — read-only whole-bundle health report (bundle lint)

Usage:
  agentstate-lite status [--limit <n>] [--dir <path> | --remote <url>]

Runs, in ONE pass over the bundle: a kind-conformance lint (against any declared conventions/,
reusing the SAME validator 'doc write'/'new' use), an unresolved-link scan (a link whose target
isn't in the bundle — informational, since OKF permits links to not-yet-written knowledge; external
links are excluded entirely), an orphan scan (concept docs with zero inbound links from OTHER
concept docs), a freshness sweep over kinds that declare a horizon (a governed doc older than it is
'stale'; a governed doc with no usable timestamp — missing OR malformed — is counted
'no_timestamp'), and two graph lints over any declared 'links'/'expects_inbound' vocabulary (see
'kinds --help'): edges violating a declared typed-edge type ('link_type_violations') and kind
instances missing a declared inbound expectation ('missing_expected_links'). Duplicate-id detection
is not offered: an id IS its storage path, so ids are structurally unique.

Category semantics (one line each):
  malformed          A document whose YAML frontmatter cannot be parsed at all — it is skipped by
                      every scan (so it never blinds this report) and named here with the parser
                      error; fix its YAML or remove the file. This is the headline finding.
  kind_warnings      Frontmatter/section violations against a doc's OWN declared kind (a per-doc
                      lint; see 'kinds').
  unresolved_links   A link whose target isn't in the queried doc set — informational (OKF permits
                      links to not-yet-written knowledge), not broken.
  orphans            A concept doc with ZERO INBOUND links from OTHER concept docs. Outbound links
                      do NOT rescue a doc; a self-link does NOT rescue a doc; links from a reserved
                      file (index.md/log.md) can never count as a source (reserved files are
                      excluded from the queried doc set by design). Convention docs (type:
                      Convention) are EXPECTED, PERMANENT orphans — they are schema declarations,
                      not content, and nothing is expected to cite them — so they are NOT
                      special-cased out of the count or the rows; the 'type' column on each row is
                      how you tell schema from content at a glance.
  stale              A governed doc (its type has a declared kind with a freshness horizon) whose
                      timestamp is older than that horizon.
  no_timestamp       A governed doc with no usable timestamp (missing OR malformed) — it cannot be
                      judged stale or fresh at all, so it is counted separately from 'stale'.
  registry_warnings  Malformed convention docs THEMSELVES (loadKinds' own warnings) — a problem in
                      the schema declaration, not in a doc that kind governs.
  link_type_violations  An edge whose text EXACTLY matches a declared typed-edge vocabulary entry
                      (some kind's 'links' map) but the actual source and/or target doc's type
                      doesn't conform to that declaration — the same rule 'link add' warns on at
                      write time, applied bundle-wide.
  missing_expected_links  A kind instance whose OWN kind declares 'expects_inbound' but lacks at
                      least one conforming inbound edge (exact text match AND the citing doc's
                      type matches the expected source kind). Rows carry the instance's 'status'
                      field value when its kind declares one (the triage signal). An instance
                      whose OWN kind declares a terminal set of field values (see 'kinds --help')
                      AND whose frontmatter currently matches it is EXCLUDED from this count and
                      its rows (it's noise — a done/canceled instance doesn't need the expected
                      edge anymore); the top-level 'terminal_skipped' field counts the INSTANCES
                      skipped before this lint evaluated them — not findings suppressed (a skipped
                      instance might have linted clean anyway) — present only when > 0. A kind with no terminal
                      declaration is unaffected (every instance still counts, exactly as before
                      terminal declarations existed). Non-terminal instances sort first: by the
                      declared terminal set when the kind has one, else by the legacy hardcoded
                      status === "done" fallback.
  legacy_naming      Informational, never a warning: docs typed 'Page' (the legacy name for the
                      'View' kind) plus items still under the legacy pages-registry//pages/ id
                      prefixes — all fully supported, nothing migrates. Omitted when the bundle
                      carries none.

This is a whole-bundle read (one registry load + one query + one prefix-scoped blob listing,
batched) — acceptable for an explicitly batch-analysis command; over --remote it is one
whole-bundle fetch, not a per-doc round trip.

Exit is ALWAYS 0 once the analysis runs: findings are reports, not errors. (A --fail-on-findings CI
flag is a recorded future item, not built here.)

Options:
  --limit <n>             Cap each finding category's row list to <n> rows (default: 20; 0 = unlimited)
  --dir <path>            Bundle directory (default: discovered from the cwd)
  --remote <url>          Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help
`;

export interface StatusCliDeps {
  stdout: (s: string) => void;
  /** The opportunistic board-freshness trigger (default {@link maybeAutoPull} — autopull.ts). */
  autoPull: (dir?: string) => Promise<unknown>;
}

/** AXI list-cap default: 20 rows per finding category unless `--limit` overrides it (0 = unlimited). */
const DEFAULT_LIMIT = 20;

/** A finding category's row list, capped with `shown`/`total` so truncation is always explicit. */
interface Capped {
  shown: number;
  total: number;
  rows: Record<string, unknown>[];
}

function cap(rows: Record<string, unknown>[], limit: number): Capped {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}

/** A doc's `type` field, or "" when absent/non-string — the ONE place this coercion happens. */
function docType(doc: OkfDocument): string {
  return typeof doc.frontmatter.type === "string" ? doc.frontmatter.type : "";
}

export async function status(argv: string[], deps: Partial<StatusCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          limit: { type: "string" },
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "status",
  );
  if (values.help) {
    stdout(STATUS_USAGE);
    return;
  }

  let limit = DEFAULT_LIMIT;
  if (values.limit !== undefined) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)");
    }
    limit = Number(raw);
  }

  const remote = await resolveRemoteFlag(values.remote, values.dir);
  // Opportunistic board freshness (autopull.ts): silent, fail-soft, detection-gated — see list.ts.
  if (!remote) await (deps.autoPull ?? maybeAutoPull)(values.dir);
  const bundle = await openBundle(values.dir, remote);

  // ONE registry load, ONE query — every finding below derives from these two results in memory.
  // A corrupt document (unparseable YAML frontmatter) is collected as its OWN finding rather than
  // crashing the health report — a health report that can't run because one doc is broken is the
  // opposite of useful; the broken doc IS the headline finding.
  const malformedRows: Record<string, unknown>[] = [];
  const [registry, docs, legacyBlobKeys] = await Promise.all([
    loadKinds(bundle),
    query(bundle, {}, { onSkip: (s) => malformedRows.push({ id: s.id, reason: s.reason }) }),
    // legacy_naming audit (below): blob keys still under the legacy pages/ prefix — one extra
    // prefix-scoped listing on a command that is already an explicit whole-bundle read.
    listBlobs(bundle, LEGACY_PAGE_BLOB_PREFIX),
  ]);
  const byId = new Set(docs.map((d) => d.id));
  // `id -> doc`, for the link-type-violation check's target-doc-type lookup below (never a second
  // per-edge query — the doc is already in hand from the ONE `query(bundle)` above).
  const docsById = new Map(docs.map((d) => [d.id, d]));

  // Kind lint: for every doc whose `type` is governed by a declared kind, validate it (the ONE
  // validator `doc write`/`new` already use — no second implementation).
  const lintRows: Record<string, unknown>[] = [];
  for (const doc of docs) {
    const kind = registry.kinds.get(docType(doc));
    if (!kind) continue;
    for (const w of validateAgainstKind(doc, kind)) {
      lintRows.push({ id: doc.id, field: w.field ?? "", code: w.code });
    }
  }

  // The declared typed-edge vocabulary (`links` maps across every kind), flattened ONCE for the
  // link-type-violation check below — shared with `link add`'s own write-time lint (link-types.ts),
  // never a second implementation.
  const linkTypeDeclarations = collectLinkDeclarations(registry);

  // Unresolved links + the inbound edge set (reused below for orphans AND the two graph lints —
  // never a per-doc backlinks() call, which would be N whole-bundle traversals over data already
  // in hand).
  const unresolvedRows: Record<string, unknown>[] = [];
  const inbound = new Set<string>();
  // `id -> {text, sourceType}[]` for every RESOLVED inbound edge from an OTHER concept doc (the
  // same "from OTHER concept docs" rule orphans uses — a self-link doesn't rescue a doc from a
  // missing-expected-link finding either). Feeds `missing_expected_links` below.
  const inboundEdges = new Map<string, { text: string; sourceType: string }[]>();
  const linkTypeViolationRows: Record<string, unknown>[] = [];
  for (const doc of docs) {
    for (const l of parseLinksFromDoc(doc)) {
      if (!byId.has(l.to)) {
        unresolvedRows.push({ from: doc.id, href: l.href });
        continue;
      }
      // "From OTHER concept docs" — a self-link does not rescue a doc from orphan (or
      // missing-expected-link) status.
      if (l.to !== doc.id) {
        inbound.add(l.to);
        const list = inboundEdges.get(l.to) ?? [];
        list.push({ text: l.text, sourceType: docType(doc) });
        inboundEdges.set(l.to, list);
      }

      // link_type_violations: this edge's text matches a declared typed-edge vocabulary entry (some
      // kind's 'links' map) but the actual source and/or target kind doesn't conform — the SAME rule
      // `link add` warns on at write time, applied bundle-wide over every resolved edge.
      const declared = linkTypeDeclarations.get(l.text);
      if (declared && declared.length > 0) {
        const sourceType = docType(doc);
        const targetType = docType(docsById.get(l.to)!);
        const matched = declared.find((d) => d.governs === sourceType) ?? declared[0]!;
        const sourceOk = declared.some((d) => d.governs === sourceType);
        const targetOk = targetType === matched.target;
        if (!sourceOk || !targetOk) {
          linkTypeViolationRows.push({
            from: doc.id,
            to: l.to,
            text: l.text,
            expected: `${matched.governs} -> ${matched.target}`,
          });
        }
      }
    }
  }

  // Orphans: concept docs with zero inbound edges from other concept docs. Reserved files never
  // appear in `docs` (query() already excludes index.md/log.md), so they can never be a "source"
  // here structurally, not by special-casing. A convention doc that nothing links to is reported
  // honestly like anything else — not special-cased away. Rows carry `type` alongside `id` so a
  // reader can tell an EXPECTED, PERMANENT orphan (`type: Convention` — schema, not content) apart
  // from an orphaned concept doc at a glance, without splitting the list or the count (the finding
  // that a Convention doc is an orphan is true by definition; honesty over false comfort).
  const orphanRows: Record<string, unknown>[] = [];
  for (const doc of docs) {
    if (!inbound.has(doc.id)) orphanRows.push({ id: doc.id, type: docType(doc) });
  }

  // Freshness sweep: only over kinds that declare a horizon (feeding the EXISTING
  // `FreshnessOptions.maxAgeMs` via `freshness()` itself — no forked verdict logic).
  const now = new Date();
  const staleRows: Record<string, unknown>[] = [];
  const noTimestampRows: Record<string, unknown>[] = [];
  for (const doc of docs) {
    const kind = registry.kinds.get(docType(doc));
    if (!kind) continue;
    const horizonMs = freshnessHorizonMs(kind);
    if (horizonMs === undefined) continue;
    const result = freshness(doc, { maxAgeMs: horizonMs, now });
    if (result.verdict === "empty") {
      noTimestampRows.push({ id: doc.id, type: docType(doc) });
    } else if (result.verdict === "stale") {
      staleRows.push({ id: doc.id, age_ms: result.ageMs, horizon_ms: horizonMs });
    }
  }

  // missing_expected_links: for every kind instance whose OWN kind declares `expects_inbound`,
  // check each declared `{link type: expected source kind}` entry against the doc's resolved
  // inbound edges (built above, one whole-bundle pass — never a second traversal). A doc missing
  // one or more expectations gets ONE row naming all of them. `status` is included on the row only
  // when the kind itself declares a `status` field (the triage signal).
  //
  // tasks/status-terminal-declaration.md: an instance whose OWN kind declares a terminal set
  // (`kind.fields.terminal`) that its frontmatter currently matches is EXCLUDED entirely — a
  // done/canceled instance is noise for this lint (the original gate, 2026-07-07). The exclusion
  // is counted (`terminalSkipped`) rather than silently shrinking the total; a kind with NO
  // terminal declaration keeps every instance, exactly as before this declaration existed.
  const missingExpectedRanked: { row: Record<string, unknown>; sortsFirst: boolean }[] = [];
  let terminalSkipped = 0;
  for (const doc of docs) {
    const kind = registry.kinds.get(docType(doc));
    if (!kind?.expectsInbound) continue;
    const terminalDeclared = Object.keys(kind.fields.terminal).length > 0;
    if (terminalDeclared && isTerminal(kind, doc.frontmatter)) {
      terminalSkipped++;
      continue;
    }
    const edges = inboundEdges.get(doc.id) ?? [];
    const missing = Object.entries(kind.expectsInbound)
      .filter(([text, sourceKind]) => !edges.some((e) => e.text === text && e.sourceType === sourceKind))
      .map(([text]) => text);
    if (missing.length === 0) continue;
    const row: Record<string, unknown> = { id: doc.id };
    const declaresStatus = kind.fields.required.includes("status") || kind.fields.optional.includes("status");
    if (declaresStatus) row.status = doc.frontmatter.status;
    row.missing = missing;
    // Sort key: when the kind DECLARES a terminal set, order by the ACTUAL declaration
    // (`isTerminal`) rather than a hardcoded "done" string — a bundle whose enum uses different
    // terminal words (e.g. resolved/archived) still gets non-terminal-first triage ordering.
    // A kind with no terminal declaration keeps the EXACT pre-existing hardcoded fallback (no
    // regression). Every row here is already non-terminal by construction (terminal instances
    // were excluded above), so for a terminal-declaring kind this is always `false` — the
    // fallback branch is the only one that can ever sort a row second.
    const sortsFirst = terminalDeclared ? isTerminal(kind, doc.frontmatter) : row.status === "done";
    missingExpectedRanked.push({ row, sortsFirst });
  }
  missingExpectedRanked.sort((a, b) => {
    if (a.sortsFirst !== b.sortsFirst) return a.sortsFirst ? 1 : -1;
    return String(a.row.id).localeCompare(String(b.row.id));
  });
  const missingExpectedRows = missingExpectedRanked.map((e) => e.row);

  // legacy_naming (legacy-page.ts, plans/rename-page-kind-to-view Option C+): docs still typed
  // with the LEGACY 'Page' kind name, plus (informational, separately labeled) items still under
  // the legacy pages-registry//pages/ id prefixes. Old names/prefixes are fully legal and nothing
  // ever migrates — these are reports, not findings. This section is ALSO the sizing meter for a
  // future full deprecation of the legacy Page name: its counts ARE that decision's cost estimate.
  const pageTypedRows: Record<string, unknown>[] = docs
    .filter((doc) => isLegacyPageDoc(doc.frontmatter))
    .map((doc) => ({ id: doc.id }));
  // STORE-AWARE: docs count only under the legacy registry prefix; blob keys only under the
  // legacy entry prefix (already prefix-scoped at the `listBlobs` call above) — a concept doc
  // that merely lives at e.g. `pages/manual` is not a legacy item.
  const legacyPrefixRows: Record<string, unknown>[] = [
    ...docs.filter((doc) => isLegacyRegistryDocId(doc.id)).map((doc) => ({ id: doc.id, store: "doc" })),
    ...legacyBlobKeys
      .slice()
      .sort()
      .map((key) => ({ id: key, store: "blob" })),
  ];

  const malformed = cap(malformedRows, limit);
  const lint = cap(lintRows, limit);
  const unresolved = cap(unresolvedRows, limit);
  const orphans = cap(orphanRows, limit);
  const stale = cap(staleRows, limit);
  const noTimestamp = cap(noTimestampRows, limit);
  const registryLint = cap(
    registry.warnings.map((w): Record<string, unknown> => ({ ...w })),
    limit,
  );
  const linkTypeViolations = cap(linkTypeViolationRows, limit);
  const missingExpectedLinks = cap(missingExpectedRows, limit);

  const out: Record<string, unknown> = {
    docs: docs.length,
    kinds: registry.kinds.size,
    malformed: malformed.total,
    kind_warnings: lint.total,
    unresolved_links: unresolved.total,
    orphans: orphans.total,
    stale: stale.total,
    no_timestamp: noTimestamp.total,
    registry_warnings: registryLint.total,
    link_type_violations: linkTypeViolations.total,
    missing_expected_links: missingExpectedLinks.total,
  };
  // Beside the count, unconditionally at the top level (never nested inside the row block below,
  // which is itself omitted when `missing_expected_links` is 0 — a bundle where EVERY matching
  // instance happened to be terminal-skipped would otherwise hide this field entirely, exactly
  // the silent shrink the exclusion above must not cause). Semantics: INSTANCES skipped BEFORE
  // the missing_expected_links lint evaluated them — not findings suppressed (a skipped instance
  // might have carried its expected edge and linted clean anyway).
  if (terminalSkipped > 0) out.terminal_skipped = terminalSkipped;
  // Row-list blocks are omitted when empty (matching `kinds`/`doc write`'s existing omit-if-empty
  // convention) so a clean bundle's report stays a short summary, not nine empty categories.
  if (malformed.total > 0) out.malformed_docs = malformed;
  if (lint.total > 0) out.kind_lint = lint;
  if (unresolved.total > 0) out.unresolved = unresolved;
  if (orphans.total > 0) out.orphan_docs = orphans;
  if (stale.total > 0) out.stale_docs = stale;
  if (noTimestamp.total > 0) out.no_timestamp_docs = noTimestamp;
  if (linkTypeViolations.total > 0) out.link_type_violations_rows = linkTypeViolations;
  if (missingExpectedLinks.total > 0) out.missing_expected_links_rows = missingExpectedLinks;
  if (registryLint.total > 0) out.registry_lint = registryLint;
  // Omitted entirely on a legacy-free bundle (the `terminal_skipped` present-only-when-relevant
  // idiom) — a clean report gains nothing.
  const pageTyped = cap(pageTypedRows, limit);
  const legacyPrefix = cap(legacyPrefixRows, limit);
  if (pageTyped.total > 0 || legacyPrefix.total > 0) {
    const legacy: Record<string, unknown> = {
      note:
        "informational — 'Page' is the legacy name for the 'View' kind; legacy-typed docs and " +
        "old-prefix ids stay fully supported and never migrate. These counts size a future full deprecation.",
      page_typed_docs: pageTyped.total,
      legacy_prefix_items: legacyPrefix.total,
    };
    if (pageTyped.total > 0) legacy.page_typed_rows = pageTyped;
    if (legacyPrefix.total > 0) legacy.legacy_prefix_rows = legacyPrefix;
    out.legacy_naming = legacy;
  }

  stdout(render(out, resolveMode(values)));
}
