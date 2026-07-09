// `agentstate-lite link add|show` — cross-links and derived backlinks.
//
// OKF cross-links are STANDARD markdown links in a concept's body (never wikilinks); backlinks are
// DERIVED by reversing the resolved link graph, never stored. `link add <from> <to>` appends a
// markdown link to `<from>`'s body in the bundle-RELATIVE form (`../<to>.md` — the form VISION, the
// OKF samples, and the reference graph builder use — via core `relativeHref`), then rewrites the doc.
// `timestamp` means "last meaningful change" (OKF + VISION); appending a cross-link IS one, so by
// default `link add` REFRESHES `frontmatter.timestamp` to now() on the outgoing write (freshness must
// see the change) — `--keep-timestamp` opts back into core `writeDoc`'s normal preserve-if-present
// behavior. The idempotent no-op path (source already links to the target) never touches the
// timestamp: re-adding an existing link is a true no-op. `link show <id>` reports the concept's
// outbound links (core `parseLinks`) and its "cited by" set (core `backlinks`), each row carrying
// the citing/cited link's `text` — the only relationship-type signal OKF's untyped edges carry.
// `link show --text <t>` filters BOTH directions to links whose text EXACTLY matches `<t>` (not a
// substring match) — a reader-side lens over the same edges, never a second derivation.
// `link add`'s SUCCESS envelope (`changed:true` only — the idempotent no-op path never checks) also
// carries a graph-lint `warnings[]` when the link's text matches a bundle-declared typed-edge
// vocabulary entry (a kind's `links` map) but the actual source/target kinds don't conform, or when
// the text is a same-spelling-different-case near miss of a declared type — warn-only, never
// blocking, since the link is already written by the time this check runs.
//
// The mutation itself (versioned-read → idempotency check → CAS write → lint) is factored into
// the exported `addLink`, so `new --link` (`commands/new.ts`, one-step create+link) rides the
// EXACT SAME path this file's own `link add` subcommand uses — never a second link-writer.
import { parseArgs } from "node:util";
import {
  readDoc,
  readDocVersioned,
  writeDoc,
  parseLinks,
  backlinks,
  relativeHref,
  isReservedFile,
  pathFromConceptId,
  loadKinds,
  VersionConflict,
  type Bundle,
  type OkfDocument,
  type ValidationWarning,
  type Version,
} from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { maybeAutoPull } from "../autopull.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { collectLinkDeclarations } from "../link-types.js";

export const LINK_USAGE = `agentstate-lite link — add a cross-link or show a concept's links + backlinks

Usage:
  agentstate-lite link add <from> <to> [--text <t>]
  agentstate-lite link show <id> [--limit <n>] [--text <t>]

Idempotent: re-adding a link the source already carries is a no-op — exit 0, changed:false, no
duplicate link, no timestamp refresh.

Graph lint (link add only): if this bundle declares a kind's 'links' vocabulary (see 'kinds --help')
and --text matches a declared type, the just-written link is checked against the actual source/target
kinds; a mismatch or a same-spelling-different-case near miss attaches a 'warnings' array to the
success envelope (exit 0 — the link is already written). An untyped --text (no declared match, any
casing) or a conventions-free bundle never warns.

Options:
  --text <t>            (link add) Link display text (default: the target id)
                         (link show) Filter outbound links AND backlinks to those whose text is
                         EXACTLY <t> (case-sensitive, not a substring match); empty/missing value
                         is a usage error. outbound_count/backlink_count report the FILTERED
                         totals when set. A filter that matches nothing is a valid empty result,
                         not an error — its help line names the distinct link texts that ARE
                         present, so a near-miss (typo/case) is visible.
  --limit <n>          (link show) Cap each of the outbound/backlink lists (default: 50; 0 =
                         unlimited); outbound_count/backlink_count always report the true
                         (post-filter) totals
  --keep-timestamp      Preserve the source's existing timestamp (default: refresh to now,
                         since adding a cross-link is a meaningful change)
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;

/** Bounded compare-and-swap retry budget for `link add` (a concurrent writer moved the source doc). */
const LINK_ADD_MAX_ATTEMPTS = 5;

export interface LinkCliDeps {
  stdout: (s: string) => void;
  /**
   * The opportunistic board-freshness trigger `link show` (the READ verb only — never `link add`)
   * runs before serving a LOCAL read (default: autopull.ts's `maybeAutoPull`).
   */
  autoPull?: (dir?: string) => Promise<unknown>;
}

/** A doc's `type` field, or "" when absent/non-string (mirrors `status.ts`'s own `docType`). */
function docType(doc: OkfDocument): string {
  return typeof doc.frontmatter.type === "string" ? doc.frontmatter.type : "";
}

/**
 * Write-time type-conformance lint for a just-written link (graph lints unit): if `text` exactly
 * matches a declared typed-edge vocabulary entry, verify the ACTUAL source/target kinds against the
 * declaration (a mismatch is a `LINK_TYPE_VIOLATION`); if `text` matches a declared type only
 * case-insensitively, warn naming the declared spelling (`LINK_TYPE_CASE_VARIANT`) — no edit-distance
 * matching. Untyped links (no match, in any casing) return no warnings. Never throws for a missing
 * target doc (a dangling target just skips the target-kind half of the check — unresolved links are
 * `status`'s existing concern); a conventions-free bundle (no kind declares any `links`) returns
 * immediately with zero extra I/O beyond the registry load every write command already pays for.
 */
async function lintLinkType(
  bundle: Bundle,
  args: { sourceType: string; text: string; to: string; remoteUrl?: string },
): Promise<ValidationWarning[]> {
  const registry = await loadKinds(bundle);
  const declarations = collectLinkDeclarations(registry);
  if (declarations.size === 0) return [];

  const exact = declarations.get(args.text);
  if (exact && exact.length > 0) {
    // An exact-match text is the only case that needs the target doc's actual type — a near-miss
    // (or no match at all) never pays for this extra read.
    let targetType: string | undefined;
    let targetResolved = true;
    try {
      targetType = docType(await readDoc(bundle, args.to));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
        targetResolved = false;
      } else {
        throw classifyBundleError(err, args.remoteUrl);
      }
    }
    const matched = exact.find((d) => d.governs === args.sourceType) ?? exact[0]!;
    const sourceOk = exact.some((d) => d.governs === args.sourceType);
    const targetOk = !targetResolved || targetType === matched.target;
    if (!sourceOk || !targetOk) {
      return [
        {
          code: "LINK_TYPE_VIOLATION",
          message:
            `'${args.text}' is declared by '${matched.governs}' -> ${matched.target}; this link is ` +
            `${args.sourceType || "(untyped)"} -> ${targetResolved ? targetType || "(untyped)" : "(unresolved)"}.`,
          field: "text",
          severity: "warning",
        },
      ];
    }
    return [];
  }

  // No exact match: a same-spelling-different-case near miss ('Contains' vs 'contains') warns
  // naming the declared spelling.
  for (const declaredText of declarations.keys()) {
    if (declaredText.toLowerCase() === args.text.toLowerCase()) {
      return [
        {
          code: "LINK_TYPE_CASE_VARIANT",
          message: `'${args.text}' is a case-variant of the declared link type '${declaredText}' — did you mean --text '${declaredText}'?`,
          field: "text",
          severity: "warning",
        },
      ];
    }
  }
  return [];
}

export async function link(argv: string[], deps: Partial<LinkCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "add") return linkAdd(rest, stdout);
  if (sub === "show") return linkShow(rest, stdout, deps.autoPull);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(LINK_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown link subcommand: ${sub} (expected add|show)`, {
    help: `${cliInvocation()} link --help`,
  });
}

/** Options for {@link addLink} — a subset of `link add`'s own flags, since callers other than
 * the CLI subcommand (e.g. `new --link`) never expose `--dir`/`--json`/etc. themselves. */
export interface AddLinkOptions {
  /** Link display text (default: the target id, mirroring `link add`'s own default). */
  text?: string;
  /** Preserve the source's existing timestamp instead of refreshing it to now(). */
  keepTimestamp?: boolean;
  /** Threaded into `classifyBundleError` so a `--remote` mutation's AUTH_REQUIRED carries a
   * copy-pastable hint (mirrors every other bundle-mutating command). */
  remoteUrl?: string;
}

export interface AddLinkResult {
  /** The source doc's id (post-write, or as read on the idempotent no-op path). */
  from: string;
  /** The link's bundle-relative normalized target (leading slash / `.md` suffix stripped). */
  normalizedTo: string;
  href: string;
  text: string;
  /** false on the idempotent no-op path (the source already links to this target). */
  changed: boolean;
  /** Present only when the write-time type-conformance lint (graph lints unit) attached one. */
  warnings?: ValidationWarning[];
}

/**
 * Core link-add mutation: idempotent versioned-read → idempotency check → CAS write (bounded
 * retry) → write-time type-conformance lint. Extracted out of `linkAdd` below (the CLI
 * subcommand, which composes this into its own receipt shape unchanged) so `new --link`
 * (`commands/new.ts` — one-step create+link) rides the EXACT SAME machinery instead of a second
 * hand-rolled link-writer (gate 3: one link resolver, no parallel implementation).
 */
export async function addLink(
  bundle: Bundle,
  from: string,
  to: string,
  opts: AddLinkOptions = {},
): Promise<AddLinkResult> {
  const text = opts.text?.trim() || to;
  const href = relativeHref(from, to);
  const normalizedTo = to.replace(/^\/+/, "").replace(/\.md$/, "");

  // Reserved files (index.md/log.md, any directory level) are never concept documents, so they
  // can never be a link target — core's `resolveConceptId` now drops such a link from the parsed
  // edge set entirely (it never becomes a concept edge), which would otherwise silently break the
  // idempotency check below (`parseLinks(...).some(l => l.to === normalizedTo)` could never
  // observe a link it can no longer see, so a re-run would append a duplicate link on every
  // invocation instead of converging to `changed:false`). Reject up front with a structured error
  // instead — a pure, no-I/O check via the SAME reserved-name predicate core uses.
  if (isReservedFile(pathFromConceptId(normalizedTo))) {
    throw new CliError(
      "USAGE",
      `'${to}' names a reserved OKF file (index.md/log.md), which is never a concept document and cannot be a link target`,
      { help: `${cliInvocation()} list` },
    );
  }

  // Versioned-read + compare-and-swap-write: read the source WITH its version, check idempotency,
  // then write the appended link CONDITIONAL on that version. On a VersionConflict (a concurrent
  // writer moved the doc between our read and write), re-read once, re-check idempotency (the
  // racing write may have added this very link → converge to changed:false), and retry within a
  // small bounded budget.
  for (let attempt = 0; ; attempt++) {
    let source: OkfDocument;
    let version: Version;
    try {
      ({ doc: source, version } = await readDocVersioned(bundle, from));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
        throw new CliError("NOT_FOUND", `no source concept at id '${from}'`, {
          help: `${cliInvocation()} list`,
        });
      }
      // classifyBundleError passes an already-classified CliError through unchanged (e.g. a
      // transport-error RUNTIME from a wrapped --remote fetchImpl, see bundle.ts) and maps a
      // RemoteError by its own code instead of collapsing everything into USAGE.
      throw classifyBundleError(err, opts.remoteUrl);
    }

    // Idempotent: if the source already links to this target (in either link form), re-adding is a
    // no-op that exits 0 rather than appending a duplicate (AXI: mutations converge).
    const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo);
    if (already) {
      return { from: source.id, normalizedTo, href, text, changed: false };
    }

    const trimmed = source.body.replace(/\s*$/, "");
    const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})\n`;
    // Refresh `timestamp` to now() by default — adding a cross-link is a meaningful change and
    // freshness must reflect it — unless `keepTimestamp` asks to preserve the source's existing
    // value. Recomputed each CAS attempt (the source is re-read on retry) so a slow retry still lands
    // a timestamp taken at write time, not at the first read.
    const nextFrontmatter = opts.keepTimestamp
      ? source.frontmatter
      : { ...source.frontmatter, timestamp: new Date().toISOString() };
    try {
      const saved = await writeDoc(
        bundle,
        { ...source, frontmatter: nextFrontmatter, body: nextBody },
        { expectedVersion: version },
      );
      // Write-time type-conformance lint (graph lints unit) — warn-only, never blocking: the link
      // is already written by the time this runs. Skipped entirely on the idempotent no-op path
      // above (a true no-op performs no registry load and no checks).
      const warnings = await lintLinkType(bundle, {
        sourceType: docType(source),
        text,
        to: normalizedTo,
        remoteUrl: opts.remoteUrl,
      });
      return {
        from: saved.id,
        normalizedTo,
        href,
        text,
        changed: true,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (err) {
      if (err instanceof VersionConflict && attempt < LINK_ADD_MAX_ATTEMPTS - 1) continue;
      if (err instanceof VersionConflict) {
        // Exhausted the retry budget: surface as a CONFLICT (exit 5) with a re-run fixing command.
        throw new CliError("STALE_HEAD", err.message, {
          help: `${cliInvocation()} link add ${from} ${to}`,
        });
      }
      throw err;
    }
  }
}

async function linkAdd(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          text: { type: "string" },
          "keep-timestamp": { type: "boolean" },
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "link add",
  );
  if (values.help) {
    stdout(LINK_USAGE);
    return;
  }

  const from = positionals[0]?.trim();
  const to = positionals[1]?.trim();
  if (!from || !to) {
    throw new CliError("USAGE", "link add requires <from> and <to> concept ids", {
      help: `${cliInvocation()} link add <from> <to>`,
    });
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);

  const result = await addLink(bundle, from, to, {
    text: values.text,
    keepTimestamp: values["keep-timestamp"],
    remoteUrl: values.remote,
  });

  if (!result.changed) {
    stdout(
      render(
        {
          link: "exists",
          from: result.from,
          to: result.normalizedTo,
          changed: false,
          help: [`${cliInvocation()} link show ${result.normalizedTo}`],
        },
        mode,
      ),
    );
    return;
  }

  const receipt: Record<string, unknown> = {
    link: "added",
    from: result.from,
    to,
    href: result.href,
    text: result.text,
    changed: true,
    help: [`${cliInvocation()} link show ${to}`],
  };
  if (result.warnings && result.warnings.length > 0) receipt.warnings = result.warnings;
  stdout(render(receipt, mode));
}

async function linkShow(
  argv: string[],
  stdout: (s: string) => void,
  autoPull?: (dir?: string) => Promise<unknown>,
): Promise<void> {
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          limit: { type: "string" },
          text: { type: "string" },
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "link show",
  );
  if (values.help) {
    stdout(LINK_USAGE);
    return;
  }

  // Row cap (AXI §9): a heavily-cited hub concept can have a very large "cited by" set — bound both
  // link lists by default like `status`/`list` do, while `outbound_count`/`backlink_count` keep
  // reporting the true (post-filter) totals. Default 50; 0 = unlimited.
  const DEFAULT_LIMIT = 50;
  let limit = DEFAULT_LIMIT;
  if (values.limit !== undefined) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} link show <id> --limit 50`,
      });
    }
    limit = Number(raw);
  }

  // `--text` is an exact-match filter over BOTH directions' link text — not a second derivation,
  // just a lens over the same edges `parseLinks`/`backlinks` already resolved. An empty/missing
  // value is a usage error (a filter that matches nothing is a valid result; a filter that names
  // nothing is a mistake).
  let textFilter: string | undefined;
  if (values.text !== undefined) {
    textFilter = values.text.trim();
    if (!textFilter) {
      throw new CliError("USAGE", "--text requires a non-empty value to filter on", {
        help: `${cliInvocation()} link show <id> --text <t>`,
      });
    }
  }

  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "link show requires a concept <id>", {
      help: `${cliInvocation()} link show <id>`,
    });
  }

  const remote = await resolveRemoteFlag(values.remote, values.dir);
  // Opportunistic board freshness (autopull.ts): silent, fail-soft, detection-gated — see list.ts.
  if (!remote) await (autoPull ?? maybeAutoPull)(values.dir);
  const bundle = await openBundle(values.dir, remote);

  // Outbound links come from the source doc (missing doc → NOT_FOUND). Backlinks are derived over the
  // whole bundle and are valid even for a not-yet-written target, so they are computed regardless.
  let outbound: { to: string; text: string; href: string }[] = [];
  let exists = true;
  try {
    const source = await readDoc(bundle, id);
    outbound = parseLinks(bundle, source).map((l) => ({ to: l.to, text: l.text, href: l.href }));
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
      throw classifyBundleError(err, values.remote);
    }
    // ENOENT: no document at this id YET. NOT an error — a concept can be CITED before it is written
    // (backlinks are derived over the whole bundle and stay meaningful). Report `exists:false` so an
    // agent can distinguish "doc exists, zero outbound links" from "no doc here" — which a bare
    // outbound_count:0 could not (the #5 gap: `link add` errors NOT_FOUND on the same id; `link show`
    // must not silently look identical to an existing-but-linkless doc).
    exists = false;
  }

  const inbound = await backlinks(bundle, id);
  // Distinct link texts across BOTH directions, captured BEFORE filtering — fuel for the
  // zero-match near-miss hint below. Exact match means a typo ('contain' for 'contains') would
  // otherwise read as an empty graph; naming what IS there mirrors `doc read --field`'s
  // absent-field behavior.
  const textsPresent =
    textFilter === undefined
      ? []
      : [...new Set([...outbound, ...inbound].map((l) => l.text))].sort((a, b) => a.localeCompare(b));
  if (textFilter !== undefined) {
    outbound = outbound.filter((l) => l.text === textFilter);
  }
  // `inboundMatched` is the FILTERED set whenever `--text` is set — the honest post-filter total
  // every downstream count/help message below reads from, never the unfiltered `inbound` length
  // dressed up as if it were the filtered count.
  const inboundMatched = textFilter !== undefined ? inbound.filter((l) => l.text === textFilter) : inbound;
  const outboundShown = limit > 0 ? outbound.slice(0, limit) : outbound;
  const inboundShown = limit > 0 ? inboundMatched.slice(0, limit) : inboundMatched;
  const payload: Record<string, unknown> = {
    id,
    exists,
    outbound_count: outbound.length,
    outbound: outboundShown,
    backlink_count: inboundMatched.length,
    backlinks: inboundShown.map((l) => ({ from: l.from, text: l.text })),
  };
  if (textFilter !== undefined) payload.text_filter = textFilter;

  const help: string[] = [];
  if (outboundShown.length < outbound.length || inboundShown.length < inboundMatched.length) {
    help.push(
      `showing ${outboundShown.length}/${outbound.length} outbound + ${inboundShown.length}/${inboundMatched.length} backlinks — run \`${cliInvocation()} link show ${id} --limit 0\` for all`,
    );
  }
  if (textFilter !== undefined && outbound.length === 0 && inboundMatched.length === 0) {
    if (textsPresent.length > 0) {
      const TEXTS_SHOWN = 8;
      const shown = textsPresent
        .slice(0, TEXTS_SHOWN)
        .map((t) => `'${t}'`)
        .join(", ");
      const more = textsPresent.length > TEXTS_SHOWN ? ` (+${textsPresent.length - TEXTS_SHOWN} more)` : "";
      help.push(
        `no links matched --text '${textFilter}' in either direction (exact match) — link texts present here: ${shown}${more}`,
      );
    } else if (exists) {
      help.push(`no links matched --text '${textFilter}' in either direction — this is a definitive empty result, not an error`);
    }
  }
  if (!exists) {
    help.push(
      inboundMatched.length > 0
        ? `'${id}' has no document yet but is cited by ${inboundMatched.length} — run \`${cliInvocation()} doc write ${id} --type <t>\` to create it`
        : `no concept at '${id}': it has no document and nothing links to it${textFilter !== undefined ? ` matching --text '${textFilter}'` : ""}`,
    );
  }
  if (help.length > 0) payload.help = help;
  stdout(render(payload, resolveMode(values)));
}
