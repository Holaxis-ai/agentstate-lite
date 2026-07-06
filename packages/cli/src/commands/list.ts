// `agentstate-lite list` / `agentstate-lite query` — query concepts over their frontmatter.
//
// Thin wrapper over core `queryHeads(bundle, { type?, tags?, prefix?, fields? })` (the filter facets
// are ANDed; reserved index.md/log.md are always excluded) — HEAD projections (id + frontmatter +
// version), never bodies: every row here reads only frontmatter, and over `--remote` the backend
// push-down keeps bodies off the wire entirely. Results default to a UNIFORM, flat row shape
// ({ id, type, title, timestamp }) so TOON renders them as a compact scannable table; the full
// frontmatter + body of any row is available via `agentstate-lite doc read <id>`.
//
// Tier-1 kind capabilities (plans/tier1-kind-capabilities.md), two GENERIC (no per-kind code) additions:
//
//   - Kind-aware columns (Fork A): a `--type <X>`-scoped query, with NO `--fields` override, where a
//     loaded kind convention governs `X`, projects `{id, title, ...kind's declared fields}` instead of
//     the minimal schema — so an agent sees e.g. a Task's status/priority without knowing to pass
//     --fields. Activation requires ALL of: --type given, --fields absent, the type is governed, and
//     the kind declares at least one non-excluded field. An unscoped list, or a type-scoped list of an
//     UNGOVERNED type, keeps the minimal schema byte-for-byte — loadKinds is only even called when the
//     first two conditions hold, so an unscoped/--fields query (and every conventions-free bundle) does
//     ZERO extra registry work. `--fields` ALWAYS overrides (an explicit projection wins).
//   - `--field key=value` filter (Fork B, repeatable, ANDed): a generic core QueryFilter facet (any
//     kind, any field), not CLI-side — so it rides the engine's one filter locus over --remote for
//     free, same as the existing type/tags facets (applied to pushed-down heads, never bodies).
import { parseArgs } from "node:util";
import { queryHeads, loadKinds, type QueryFilter } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";

export const LIST_USAGE = `agentstate-lite list — query concepts over their frontmatter (alias: query)

Usage:
  agentstate-lite list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--fields <a,b>] [--limit <n>] [--dir <path>]

Options:
  --type <t>           Restrict to concepts whose frontmatter type equals this
  --tag <t>            Restrict to concepts carrying this tag (repeatable; ALL must match)
  --field <k=v>        Restrict to concepts whose frontmatter field k equals v (repeatable; ALL must
                       match). Array fields match on membership; values are string-coerced (so an
                       unquoted YAML number like priority: 1 matches --field priority=1)
  --prefix <p>         Restrict to concept ids starting with this bundle-relative prefix
  --fields <a,b,...>   Add extra frontmatter fields to each row (comma-separated; default schema is
                       id,type,title,timestamp). ALWAYS overrides kind-aware columns below. Each cell
                       is truncated to 80 chars — long content lives in \`doc read <id>\`.
  --limit <n>          Cap the number of rows returned (default: 100; 0 = unlimited). A truncated
                       result reports \`shown\` alongside the total \`count\`.
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help

A --type-scoped query of a kind-governed type projects that kind's declared fields as columns
({id, title, ...fields}) instead of the minimal schema; --fields overrides. An unscoped query, or a
query of an ungoverned type, always keeps the minimal {id,type,title,timestamp} schema.
`;

export interface ListCliDeps {
  stdout: (s: string) => void;
}

export async function list(argv: string[], deps: Partial<ListCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          type: { type: "string" },
          tag: { type: "string", multiple: true },
          field: { type: "string", multiple: true },
          prefix: { type: "string" },
          fields: { type: "string" },
          limit: { type: "string" },
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "list",
  );
  if (values.help) {
    stdout(LIST_USAGE);
    return;
  }

  const filter: QueryFilter = {};
  if (values.type?.trim()) filter.type = values.type.trim();
  if (values.tag && values.tag.length > 0) filter.tags = values.tag;
  if (values.prefix?.trim()) filter.prefix = values.prefix.trim();

  // Fork B: --field key=value (repeatable, ANDed). Split on the FIRST "=" (a deliberate value
  // containing "=" survives); an empty key, or a token with no "=" at all, is USAGE (exit 2). The
  // value is taken verbatim after the first "=" (not trimmed) — the shell handles quoting, and a
  // deliberately spaced value should survive untouched.
  if (values.field && values.field.length > 0) {
    const fields: Record<string, string> = {};
    for (const entry of values.field) {
      const eq = entry.indexOf("=");
      const key = eq >= 0 ? entry.slice(0, eq).trim() : "";
      if (eq < 0 || key === "") {
        throw new CliError("USAGE", `--field expects key=value (got '${entry}')`, {
          help: `${cliInvocation()} list --field status=done`,
        });
      }
      fields[key] = entry.slice(eq + 1);
    }
    filter.fields = fields;
  }

  // Row cap (AXI §9 "reveal truncated lists"): `list` is THE query verb and the one most likely to
  // hit large N, so it bounds its rows by default like `status` does its finding categories. Default
  // 100 (high enough that a typical bundle is never truncated — §2 "cover common cases in one call");
  // 0 = unlimited. `count` always reports the TOTAL matched; a truncated result additionally carries
  // `shown` + a `--limit 0` hint so the bound is never silent.
  const DEFAULT_LIMIT = 100;
  let limit = DEFAULT_LIMIT;
  if (values.limit !== undefined) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} list --limit 100`,
      });
    }
    limit = Number(raw);
  }

  // Extra frontmatter fields to append after the default schema (AXI §2 `--fields` hatch). The four
  // default keys are always present, so a requested duplicate is skipped and every row stays uniform.
  const DEFAULT_KEYS = new Set(["id", "type", "title", "timestamp"]);
  const extraFields = (values.fields?.trim() ? values.fields.split(",") : [])
    .map((f) => f.trim())
    .filter((f) => f && !DEFAULT_KEYS.has(f));

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  // A corrupt document (unparseable YAML frontmatter) is skipped and reported, never allowed to
  // fail the whole scan — one bad file must not blind the agent to every other doc (AXI §5/§6).
  // Head projections, not full docs: every row below reads only id + frontmatter, and over
  // `--remote` the push-down means bodies never cross the wire (frontmatter-projection pass).
  const skipped: { id: string; reason: string }[] = [];
  const docs = await queryHeads(bundle, filter, { onSkip: (s) => skipped.push(s) });

  // Cap a projected cell so one long field can't dominate a row (AXI §2/§3 — long-form content
  // belongs in `doc read`, not a list cell). SHARED by the `--fields` projection and the kind-aware
  // columns below, so both truncate identically.
  const COLUMN_CELL_CAP = 80;
  const cell = (v: unknown): unknown => {
    if (v === undefined || v === null) return "";
    const s = Array.isArray(v) ? v.join(",") : v;
    return typeof s === "string" && s.length > COLUMN_CELL_CAP ? s.slice(0, COLUMN_CELL_CAP) + "…" : s;
  };

  const projectMinimal = (d: (typeof docs)[number]): Record<string, unknown> => {
    const row: Record<string, unknown> = {
      id: d.id,
      type: typeof d.frontmatter.type === "string" ? d.frontmatter.type : "",
      title:
        typeof d.frontmatter.title === "string"
          ? d.frontmatter.title
          : (d.id.split("/").pop() ?? d.id),
      timestamp: typeof d.frontmatter.timestamp === "string" ? d.frontmatter.timestamp : "",
    };
    // The `--fields` hatch caps each cell the SAME way kind columns do — a long field (e.g.
    // `--fields description`) is truncated per row rather than dumped in full.
    for (const f of extraFields) row[f] = cell((d.frontmatter as Record<string, unknown>)[f]);
    return row;
  };

  // Fork A: kind-aware columns. Activation requires ALL of: --type given (a single-kind result — the
  // hard TOON constraint, since docs[N]{cols} is a UNIFORM table so per-row kind-specific columns are
  // only sound when every row shares one kind), --fields ABSENT (an explicit projection always wins),
  // the loaded registry governs --type, and that kind declares at least one non-excluded field. Loading
  // the registry is gated behind the first two conditions so an unscoped/--fields query — and every
  // conventions-free bundle — does zero extra registry work.
  //
  // "--fields ABSENT" means the FLAG was not given at all — NOT "extraFields ended up empty". A
  // caller passing --fields id,title (both already default keys) still explicitly asked for a
  // projection and must get the minimal schema back, not have it silently overridden by kind
  // columns just because every requested name happened to collide with a default key.
  const fieldsFlagGiven = values.fields !== undefined;

  let kindCols: string[] | undefined;
  if (!fieldsFlagGiven && filter.type && docs.length > 0) {
    const registry = await loadKinds(bundle); // command-layer, loaded ONCE (gate 3)
    const kind = registry.kinds.get(filter.type);
    if (kind) {
      const cols = [...new Set([...kind.fields.required, ...kind.fields.optional])].filter(
        (f) => f !== "id" && f !== "title" && f !== "description",
      );
      if (cols.length > 0) kindCols = cols;
    }
  }

  const rows: Record<string, unknown>[] = kindCols
    ? docs.map((d) => {
        const fm = d.frontmatter as Record<string, unknown>;
        const row: Record<string, unknown> = {
          id: d.id,
          title: typeof fm.title === "string" ? fm.title : (d.id.split("/").pop() ?? d.id),
        };
        for (const c of kindCols!) row[c] = cell(fm[c]);
        return row;
      })
    : docs.map(projectMinimal);

  const total = rows.length;
  const shownRows = limit > 0 ? rows.slice(0, limit) : rows;
  const truncated = shownRows.length < total;

  // `count` is the TOTAL matched (§4 definitive aggregate); `docs` is the (possibly capped) page.
  const out: Record<string, unknown> = { count: total, docs: shownRows };
  if (truncated) out.shown = shownRows.length;

  // Contextual disclosure (§9): a list is not self-contained, so point at the natural drill-downs —
  // but only when there's something to drill into. A truncation hint (if capped) and the corrupt-doc
  // hint (if any) precede the browse hints so the most actionable line is first.
  const help: string[] = [];
  if (truncated) {
    help.push(
      `showing ${shownRows.length} of ${total} — run \`${cliInvocation()} list --limit 0\` (or a higher --limit) for all`,
    );
  }
  if (skipped.length > 0) {
    out.skipped = skipped;
    help.push(
      `${skipped.length} document(s) skipped (unparseable frontmatter) — run \`${cliInvocation()} doc read <id>\` for the full error, then fix the YAML`,
    );
  }
  // Discovery hint for the kind-column projection (Fork A): the felt friction this closes is an
  // agent typing `--fields status,priority` on every board scan because nothing advertises that
  // `--type Task` projects those columns automatically. When a MINIMAL-schema result turns out to
  // be uniformly ONE governed kind with projectable fields, say so — ONE help line, never a
  // schema change (a data-dependent projection was considered and REJECTED: output columns must
  // key on the INVOCATION, not on what the bundle happens to contain today — see
  // plans/list-hint-arity.md decision 1). The registry load is gated behind uniformity + the
  // absence of --type/--fields, so mixed/unscoped scans (and every conventions-free bundle) pay
  // nothing; when it fires over --remote it costs one thin conventions/ round-trip.
  if (!kindCols && !fieldsFlagGiven && !filter.type && docs.length > 0) {
    const first = docs[0]!.frontmatter.type;
    const uniformType = typeof first === "string" && first !== "" && docs.every((d) => d.frontmatter.type === first);
    if (uniformType) {
      const registry = await loadKinds(bundle);
      const kind = registry.kinds.get(first);
      if (kind) {
        const cols = [...new Set([...kind.fields.required, ...kind.fields.optional])].filter(
          (f) => f !== "id" && f !== "title" && f !== "description",
        );
        if (cols.length > 0) {
          const typeArg = /\s/.test(first) ? `"${first}"` : first;
          help.push(
            `all ${total} rows are '${first}' — \`${cliInvocation()} list --type ${typeArg}\` projects its ${cols.join("/")} columns`,
          );
        }
      }
    }
  }
  if (total > 0) {
    help.push(`${cliInvocation()} doc read <id>`, `${cliInvocation()} link show <id>`);
  }
  if (help.length > 0) out.help = help;
  stdout(render(out, resolveMode(values)));
}
