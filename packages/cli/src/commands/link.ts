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
// outbound links (core `parseLinks`) and its "cited by" set (core `backlinks`).
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
  VersionConflict,
  type OkfDocument,
  type Version,
} from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const LINK_USAGE = `agentstate-lite link — add a cross-link or show a concept's links + backlinks

Usage:
  agentstate-lite link add <from> <to> [--text <t>]
  agentstate-lite link show <id> [--limit <n>]

Idempotent: re-adding a link the source already carries is a no-op — exit 0, changed:false, no
duplicate link, no timestamp refresh.

Options:
  --text <t>            Link display text (default: the target id)
  --limit <n>          (link show) Cap each of the outbound/backlink lists (default: 50; 0 =
                         unlimited); outbound_count/backlink_count always report the true totals
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
}

export async function link(argv: string[], deps: Partial<LinkCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "add") return linkAdd(rest, stdout);
  if (sub === "show") return linkShow(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(LINK_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown link subcommand: ${sub} (expected add|show)`, {
    help: `${cliInvocation()} link --help`,
  });
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
  const text = values.text?.trim() || to;
  const href = relativeHref(from, to);
  const normalizedTo = to.replace(/^\/+/, "").replace(/\.md$/, "");

  // Reserved files (index.md/log.md, any directory level) are never concept documents, so they
  // can never be a link target — core's `resolveConceptId` now drops such a link from the parsed
  // edge set entirely (it never becomes a concept edge), which would otherwise silently break this
  // command's idempotency check below (`parseLinks(...).some(l => l.to === normalizedTo)` could
  // never observe a link it can no longer see, so a re-run would append a duplicate link on every
  // invocation instead of converging to `changed:false`). Reject up front with a structured error
  // instead — a pure, no-I/O check via the SAME reserved-name predicate core uses.
  if (isReservedFile(pathFromConceptId(normalizedTo))) {
    throw new CliError(
      "USAGE",
      `'${to}' names a reserved OKF file (index.md/log.md), which is never a concept document and cannot be a link target`,
      { help: `${cliInvocation()} list` },
    );
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);

  // `link add` is the engine's PROOF consumer of versioned-read + compare-and-swap-write: read the
  // source WITH its version, check idempotency, then write the appended link CONDITIONAL on that
  // version. On a VersionConflict (a concurrent writer moved the doc between our read and write),
  // re-read once, re-check idempotency (the racing write may have added this very link → converge to
  // changed:false), and retry within a small bounded budget. The idempotent no-op behavior and exit
  // codes are preserved.
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
      throw classifyBundleError(err, values.remote);
    }

    // Idempotent: if the source already links to this target (in either link form), re-adding is a
    // no-op that exits 0 rather than appending a duplicate (AXI: mutations converge).
    const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo);
    if (already) {
      stdout(
        render(
          {
            link: "exists",
            from: source.id,
            to: normalizedTo,
            changed: false,
            help: [`${cliInvocation()} link show ${normalizedTo}`],
          },
          mode,
        ),
      );
      return;
    }

    const trimmed = source.body.replace(/\s*$/, "");
    const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})\n`;
    // Refresh `timestamp` to now() by default — adding a cross-link is a meaningful change and
    // freshness must reflect it — unless `--keep-timestamp` asks to preserve the source's existing
    // value. Recomputed each CAS attempt (the source is re-read on retry) so a slow retry still lands
    // a timestamp taken at write time, not at the first read.
    const nextFrontmatter = values["keep-timestamp"]
      ? source.frontmatter
      : { ...source.frontmatter, timestamp: new Date().toISOString() };
    try {
      const saved = await writeDoc(
        bundle,
        { ...source, frontmatter: nextFrontmatter, body: nextBody },
        { expectedVersion: version },
      );
      stdout(
        render(
          {
            link: "added",
            from: saved.id,
            to,
            href,
            text,
            changed: true,
            help: [`${cliInvocation()} link show ${to}`],
          },
          mode,
        ),
      );
      return;
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

async function linkShow(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values, positionals } = parseOrUsage(
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
    "link show",
  );
  if (values.help) {
    stdout(LINK_USAGE);
    return;
  }

  // Row cap (AXI §9): a heavily-cited hub concept can have a very large "cited by" set — bound both
  // link lists by default like `status`/`list` do, while `outbound_count`/`backlink_count` keep
  // reporting the true totals. Default 50; 0 = unlimited.
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

  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "link show requires a concept <id>", {
      help: `${cliInvocation()} link show <id>`,
    });
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));

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
  const outboundShown = limit > 0 ? outbound.slice(0, limit) : outbound;
  const inboundShown = limit > 0 ? inbound.slice(0, limit) : inbound;
  const payload: Record<string, unknown> = {
    id,
    exists,
    outbound_count: outbound.length,
    outbound: outboundShown,
    backlink_count: inbound.length,
    backlinks: inboundShown,
  };

  const help: string[] = [];
  if (outboundShown.length < outbound.length || inboundShown.length < inbound.length) {
    help.push(
      `showing ${outboundShown.length}/${outbound.length} outbound + ${inboundShown.length}/${inbound.length} backlinks — run \`${cliInvocation()} link show ${id} --limit 0\` for all`,
    );
  }
  if (!exists) {
    help.push(
      inbound.length > 0
        ? `'${id}' has no document yet but is cited by ${inbound.length} — run \`${cliInvocation()} doc write ${id} --type <t>\` to create it`
        : `no concept at '${id}': it has no document and nothing links to it`,
    );
  }
  if (help.length > 0) payload.help = help;
  stdout(render(payload, resolveMode(values)));
}
