// `agentstate-lite new "<Kind>" <id> --<field> <value> …` — create a new instance of a
// bundle-declared kind.
//
// Phase-0 experiment result (binding — Part B of the kind-conventions plan): 9 fresh agents, 3
// grammar variants. A generic `new "<Kind>" <id>` verb (no per-kind subcommands) scored 3/3 with
// zero failures; per-kind subcommand sugar scored 3/3 too but with shallow discovery (subjects
// groped for a `kinds` verb they couldn't find). `new` is statically registered in
// `KNOWN_COMMANDS`/`cli.ts` like every other command — no dynamic per-kind dispatch machinery.
//
// `new` validates STRICTLY (unlike `doc write`'s warn-by-default): a missing required field or a
// value outside a declared enum is a USAGE error (exit 2), never a written-but-warned doc. Declared
// `sections` are scaffolded as empty body headings; the kind's `path` prefix (if declared) is
// prepended onto the id unless the id already carries it. The engine (`writeDoc`) itself performs NO
// kind validation — this command is the one place that reads the registry and decides.
//
// Round-review finding: `new` is CREATE-ONLY, not create-or-overwrite. It used to call `writeDoc`
// unconditionally, so `new` on an id that already carries a document silently REPLACED its
// title/body/every field with the freshly scaffolded ones — the same silent-data-loss class F1
// closed for `doc write`. It now writes with the engine's expect-absent compare-and-swap
// (`expectedVersion: null`, the same create-race-closing pattern the CLI's recipe machinery
// (`applyRecipe`) uses): the write succeeds only if the target id does not yet exist, and a
// pre-existing doc maps the resulting `VersionConflict` to a structured ALREADY_EXISTS error
// (exit 5) that hints `doc update` (to patch it) or `doc write` (to overwrite it outright and
// deliberately).
//
// Field flags are dynamic (kind-defined), so this command parses argv in TWO PHASES through the
// SAME `node:util` `parseArgs` every other command uses (retiring the former hand-rolled
// tokenizer, whose glued/malformed-flag error used to misdirect — see below).
//
// Phase 1 (lenient discovery): a `strict:false` parse over ONLY the control flags (dir/remote/
// actor/json/help) extracts the leading `Kind` positional (and opens the bundle + loads the
// registry). Phase 2 (authoritative): a STRICT `parseArgs` re-parse, built from the loaded kind's
// declared fields (`{ type: "string", multiple: true }` each) PLUS the same control flags, is the
// source of truth for every value, the `id`/`>2`-positionals check, and unknown-flag detection.
// This keeps `new` on the exact same parser shape as every other command (consistency was the
// point) while still handling a kind's fields, which aren't known until the Kind is loaded.
//
// A glued/malformed flag token (e.g. a shell-quoting mistake that lands `"--status todo"` as ONE
// argv element) now surfaces as an "unknown field(s) … status todo" USAGE error that NAMES the
// token — replacing the old hand-rolled parser's misdirecting "got 3 positionals" (a real agent
// hit this mid-session; the whole point of this migration).
//
// `--actor` is a CONTROL flag here (mirrors `doc update`'s `DOC_UPDATE_VALUE_FLAGS`), so a kind
// field literally named `actor` is unreachable AS A KIND-FIELD FLAG via `new` — core's
// `RESERVED_FIELD_NAMES` does not reserve `actor`, but the CLI already treats it as reserved on
// every other mutation surface, so this is consistent, not a regression (still listed in a
// "declared:" hint). Since the actor-attribution fix, the control flag ITSELF persists
// `frontmatter.actor` (see the write below), so a kind declaring `actor` is satisfiable after all
// — through the control flag, with control semantics (blank-value guard, trim).
import { parseArgs } from "node:util";
import {
  loadKinds,
  type Frontmatter,
  type KindConvention,
  type KindRegistry,
  type ValidationWarning,
} from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { CliError, asHandled, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { mutateDoc } from "../mutate.js";
import { resolveActor } from "../actor.js";
import { addLink } from "./link.js";

export const NEW_USAGE = `agentstate-lite new — create a new instance of a bundle-declared kind

Usage:
  agentstate-lite new "<Kind>" <id> --<field> <value> [--<field> <value> ...] [options]

The kind must be declared by a kind convention doc under conventions/ — run 'agentstate-lite kinds'
to list what a bundle declares. Supply each of the kind's required fields via --<field> <value>
(or --<field>=<value>); declared optional fields may be supplied the same way. Repeat a flag to
set an array value (e.g. --tags a --tags b). Any field not declared by the kind is a USAGE error.
The kind's declared body 'sections' (if any) are scaffolded as empty '# Heading' blocks; its
'path' prefix (if any) is prepended onto <id> unless <id> already carries it. Validation is
STRICT: a missing required field or a disallowed enum value rejects the write (exit 2) rather
than writing-with-a-warning.

'new' is CREATE-ONLY: if the (prefixed) <id> already carries a document, the write is rejected
(exit 5) instead of silently replacing it — run 'doc update' to patch an existing doc, or 'doc
write' to overwrite it outright and deliberately.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --actor <name>         Attribute this write: persisted as the doc's own 'actor' frontmatter field
                         (the per-doc attribution sync and its receipts read) and recorded in version
                         history by a persisting backend. Precedence: --actor >
                         AGENTSTATE_LITE_ACTOR > absent. A present-but-blank flag or environment
                         value is a USAGE error (exit 2).
  --link "<type>=<target-id>"
                         Repeatable. After the doc is created, add an outbound cross-link of this
                         TYPE to the given target id — through the exact same idempotent path
                         'link add --text "<type>"' uses (relative bundle-relative href; a
                         dangling target, i.e. one with no document yet, is allowed, same as
                         'link add'). A type not in this kind's declared 'links' vocabulary warns
                         but still adds the link (teach, never block). A malformed value (missing
                         '=', empty type, or empty target) is a USAGE error (exit 2) — checked
                         BEFORE the doc is written, so a malformed --link creates nothing. If a
                         link fails AFTER the doc was created (e.g. a reserved-file target), the
                         doc is NOT rolled back: the receipt's 'links' array names which entries
                         failed and the command exits non-zero.
  --no-prefix           Use <id> verbatim — do NOT auto-prepend the kind's declared path prefix
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;

export interface NewCliDeps {
  stdout: (s: string) => void;
}

/**
 * Bundle-selection + output-control flags for `new`, shared by BOTH parse phases. NOT `strict` —
 * `new` is ALWAYS strict, so a literal `--strict` token must remain an "unknown field" (falls into
 * the kind-field bucket and is rejected as undeclared), matching pre-migration behavior. `actor`
 * is control here (mirrors `doc update`'s `DOC_UPDATE_VALUE_FLAGS`), so a same-named kind field is
 * shadowed — see file header. `link` (the one-step create+link ergonomics flag) is control for the
 * same reason: it is generic to EVERY kind, not a kind-declared field, so a kind literally
 * declaring a field named `link` is shadowed too (same judgment call as `actor`).
 */
const NEW_CONTROL_OPTIONS = {
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  link: { type: "string", multiple: true },
  "no-prefix": { type: "boolean" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
} as const;

/** Prepend the kind's declared `path` prefix onto `id`, unless `id` already carries it. */
function resolveInstanceId(kind: KindConvention, id: string): string {
  if (!kind.path) return id;
  const prefix = kind.path.replace(/\/+$/, "") + "/";
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
}

/** One parsed `--link "<type>=<target-id>"` value. */
interface ParsedLinkFlag {
  type: string;
  target: string;
}

/**
 * Parse one `--link` value into its `{type, target}` pair. Splits on the FIRST '=' (a target id
 * can never itself contain '=', but this keeps the rule simple and doesn't matter either way).
 * Malformed input (no '=', empty type, empty target) is a USAGE error (exit 2) NAMING the
 * expected form — checked for every value before any doc is written, so a malformed --link
 * creates nothing (fail fast, never a partially-applied create).
 */
function parseLinkFlagValue(raw: string): ParsedLinkFlag {
  const eq = raw.indexOf("=");
  if (eq < 0) {
    throw new CliError("USAGE", `--link value '${raw}' is missing '=' — expected the form "<type>=<target-id>"`, {
      help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"`,
    });
  }
  const type = raw.slice(0, eq).trim();
  const target = raw.slice(eq + 1).trim();
  if (!type) {
    throw new CliError(
      "USAGE",
      `--link value '${raw}' has an empty link type — expected the form "<type>=<target-id>"`,
      { help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"` },
    );
  }
  if (!target) {
    throw new CliError(
      "USAGE",
      `--link value '${raw}' has an empty target id — expected the form "<type>=<target-id>"`,
      { help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"` },
    );
  }
  return { type, target };
}

/**
 * Phase 1 runs `strict:false`, which yields boolean `true` (not `undefined`, and no throw) for a
 * CONFIGURED value flag given no value as the final argv token — e.g. `new Task x --dir`. `--dir`/
 * `--remote` are consumed BEFORE the authoritative Phase-2 strict parse (they open the bundle the
 * kind is loaded from), so a boolean here would reach `openBundle` and crash it ('paths[0] must be a
 * string') as a RUNTIME (off the capped taxonomy) instead of the clean USAGE Phase 2 would give.
 * Reject it here, returning the narrowed `string | undefined` so no unsound cast is needed.
 */
function controlFlagValue(val: string | boolean | undefined, flag: string): string | undefined {
  if (typeof val === "boolean") {
    throw new CliError("USAGE", `--${flag} requires a value`, {
      help: `${cliInvocation()} new "<Kind>" <id> --${flag} <value>`,
    });
  }
  return val;
}

/**
 * Inbound typed-link declarations targeting `kind`: every OTHER kind whose `links` map names
 * `kind.governs` as a target. Pure reverse lookup over the ONE registry — no kind or link-type
 * name appears in code, so the alignment teaching below is fully generic: whatever relationships
 * a bundle's conventions declare are what get taught. Self-declarations (a kind linking to
 * itself, e.g. Task "depends on" Task) are excluded — the kind's OWN `links` map already covers
 * those on the outbound side.
 */
function inboundLinkDecls(
  registry: KindRegistry,
  kind: KindConvention,
): Array<{ source: KindConvention; linkType: string }> {
  const inbound: Array<{ source: KindConvention; linkType: string }> = [];
  for (const source of registry.kinds.values()) {
    if (source.governs === kind.governs) continue;
    for (const [linkType, target] of Object.entries(source.links ?? {})) {
      if (target === kind.governs) inbound.push({ source, linkType });
    }
  }
  return inbound.sort(
    (a, b) => a.source.governs.localeCompare(b.source.governs) || a.linkType.localeCompare(b.linkType),
  );
}

/** `roadmap-items/<roadmap-item>`-style placeholder for a kind: declared path prefix + slugged name. */
function kindIdPlaceholder(kind: KindConvention | undefined, governs: string): string {
  const slug = governs.toLowerCase().replace(/\s+/g, "-");
  const prefix = kind?.path ? kind.path.replace(/\/+$/, "") + "/" : "";
  return `${prefix}<${slug}>`;
}

/**
 * Per-kind help for `new "<Kind>" --help`: the exact required/optional fields, enum values, scaffolded
 * body sections, and id path prefix an agent needs to author a VALID instance — without a separate
 * `kinds` round-trip (cold-start study: 2 testers had to cross-reference `kinds` before every `new`).
 */
function renderKindHelp(kind: KindConvention, registry: KindRegistry, inv: string): string {
  const ordinary = (field: string) => field !== "actor" && field !== "link";
  const req = [...new Set(kind.fields.required.filter(ordinary))];
  const required = new Set(req);
  const opt = [...new Set(kind.fields.optional.filter((field) => ordinary(field) && !required.has(field)))];
  const fieldRows = [
    ...req.map((field) => ({ field, requirement: "required" })),
    ...opt.map((field) => ({ field, requirement: "optional" })),
  ].map(({ field, requirement }) => {
    const allowed = kind.fields.values[field];
    const description = kind.fields.descriptions[field];
    return (
      `  --${field} <v>  ${requirement}` +
      (allowed && allowed.length > 0 ? `; allowed: ${allowed.join(" | ")}` : "") +
      (description ? ` — ${description}` : "")
    );
  });
  const sections = kind.sections && kind.sections.length > 0 ? kind.sections.join(", ") : "(none)";
  const pathLine = kind.path
    ? `Id:  auto-prefixed with '${kind.path.replace(/\/+$/, "")}/' unless <id> already carries it`
    : "Id:  used as-is (this kind declares no path prefix)";
  // Typed-link vocabulary, BOTH directions (declared-only; a bundle declaring none gets no block):
  // the kind's own outbound types, plus the reverse lookup — other kinds declaring edges INTO this
  // one. The inbound side is the alignment cue (e.g. a new Task learns Roadmap Items contain Tasks).
  const outboundLines = Object.entries(kind.links ?? {}).map(([t, target]) => {
    const description = kind.linkDescriptions?.[t];
    return `  this kind may link:     "${t}" → ${target}${description ? ` — ${description}` : ""}`;
  });
  const inboundLines = inboundLinkDecls(registry, kind).map(
    ({ source, linkType }) =>
      `  other kinds link here:  ${source.governs} "${linkType}" → ${kind.governs}` +
      (source.linkDescriptions?.[linkType] ? ` — ${source.linkDescriptions[linkType]}` : ""),
  );
  const linksBlock =
    outboundLines.length + inboundLines.length > 0
      ? `Links (typed edges declared by this bundle's conventions; write with --link "<type>=<target-id>" ` +
        `at create time, or link add --text "<type>" after the fact):\n` +
        [...outboundLines, ...inboundLines].join("\n") +
        "\n"
      : "";
  return (
    `${inv} new "${kind.governs}" <id> — create a ${kind.governs} instance\n\n` +
    (kind.description ? `Description:  ${kind.description}\n` : "") +
    `Fields (declared by the '${kind.governs}' kind convention):\n` +
    (fieldRows.length > 0 ? fieldRows.join("\n") + "\n" : "  (none)\n") +
    `Body sections scaffolded:  ${sections}\n` +
    linksBlock +
    `${pathLine}\n\n` +
    `Repeat a flag to set an array value (e.g. --tag a --tag b). Validation is STRICT.\n` +
    `To ADD a field to this kind, edit its convention doc (${inv} kinds names it; then pull → edit fields.optional → promote).\n\n` +
    `Options:\n` +
    `  --actor <name>   Attribute the write (overrides AGENTSTATE_LITE_ACTOR)\n` +
    `  --link "<type>=<target-id>"\n` +
    `                   Repeatable: after creating this instance, add an outbound link of type\n` +
    `                   <type> to <target-id> (same idempotent path as 'link add'; a dangling\n` +
    `                   target is allowed)\n` +
    `  --no-prefix      Use <id> verbatim (skip the auto path prefix above)\n` +
    `  --dir <path>     Bundle directory (default: discovered from the cwd)\n` +
    `  --remote <url>   Talk to a wire-protocol server instead of a local bundle\n` +
    `  --json           Emit compact JSON instead of TOON\n` +
    `  -h, --help       Show this help\n`
  );
}

export async function newCommand(argv: string[], deps: Partial<NewCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  // Phase 1 — lenient discovery: extract the leading `Kind` positional plus the bundle-selection
  // flags, without yet knowing the kind's declared fields (unconfigured kind-field flags become
  // stray booleans/positionals here — harmless, since only `positionals[0]` is read from this
  // pass; Phase 2 is the AUTHORITATIVE parse for everything else, including `id`).
  const pre = parseOrUsage(
    () => parseArgs({ args: argv, strict: false, allowPositionals: true, options: NEW_CONTROL_OPTIONS }),
    "new",
  );
  const kindName = (pre.positionals[0] as string | undefined)?.trim();
  // `new --help` with NO kind named → the generic reference. `new "<Kind>" --help` → that kind's
  // own schema (rendered below, once the kind is loaded) so an agent can author a valid instance
  // without a separate `kinds` round-trip.
  if (pre.values.help && !kindName) {
    stdout(NEW_USAGE);
    return;
  }
  if (!kindName) {
    throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
      help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`,
    });
  }

  const preDir = controlFlagValue(pre.values.dir, "dir");
  const preRemote = controlFlagValue(pre.values.remote, "remote");
  // `--help` must work anywhere: if the bundle can't be opened, fall back to the generic reference
  // rather than erroring on a bundle lookup the user didn't ask to perform.
  let bundle;
  try {
    bundle = await openBundle(preDir, await resolveRemoteFlag(preRemote, preDir));
  } catch (err) {
    if (pre.values.help) {
      stdout(NEW_USAGE);
      return;
    }
    throw err;
  }
  const registry = await loadKinds(bundle);
  const kind = registry.kinds.get(kindName);
  if (!kind) {
    if (pre.values.help) {
      stdout(NEW_USAGE); // named kind isn't declared here — the generic help is the most we can show
      return;
    }
    const known = [...registry.kinds.keys()].sort();
    throw new CliError(
      "USAGE",
      known.length > 0
        ? `unknown kind '${kindName}' (declared: ${known.join(", ")})`
        : `unknown kind '${kindName}' (no kinds declared in this bundle)`,
      { help: `${cliInvocation()} kinds` },
    );
  }
  if (pre.values.help) {
    stdout(renderKindHelp(kind, registry, cliInvocation()));
    return;
  }

  // Phase 2 — strict, kind-aware, AUTHORITATIVE parse. `type`/`dir`/`remote`/`json`/`help` are
  // already stripped from `declaredFields` by `loadKinds` (core's `RESERVED_FIELD_NAMES`); `actor`
  // and `link` are NOT core-reserved, so they are excluded here explicitly (control wins on a name
  // collision) — still listed in `declaredFields` for the "declared: …" hint text below.
  const declaredFields = [...kind.fields.required, ...kind.fields.optional];
  const fieldNames = declaredFields.filter((f) => f !== "actor" && f !== "link");
  const fieldOptions = Object.fromEntries(
    fieldNames.map((f) => [f, { type: "string", multiple: true } as const]),
  );

  const { values, positionals } = parseOrUsage(() => {
    try {
      return parseArgs({
        args: argv,
        allowPositionals: true,
        strict: true,
        options: { ...fieldOptions, ...NEW_CONTROL_OPTIONS },
      });
    } catch (err) {
      // Preserve the helpful unknown-field UX (and, notably, turn a glued/malformed flag token —
      // e.g. `"--status todo"` as ONE argv element from a shell-quoting mistake — into an error
      // that NAMES the offending token instead of the old hand-rolled parser's misdirecting "got N
      // positionals"): re-throw the kind-specific message. `parseOrUsage` passes a thrown
      // `CliError` through unchanged and translates any OTHER parse error normally.
      if ((err as { code?: unknown } | null)?.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
        const raw = /'([^']+)'/.exec((err as Error).message)?.[1] ?? "";
        const field = raw.replace(/^--?/, ""); // node quotes the raw '--name'; strip the dashes
        if (field === "body" || field === "body-file") {
          // --body is a `doc write` flag, not a `new` one: a kind's body comes from its scaffolded
          // sections. Give that guidance instead of the confusing "unknown field 'body'".
          throw new CliError(
            "USAGE",
            `'new' does not take --${field} — a kind's body comes from its declared sections (scaffolded as empty ` +
              `'# Heading' blocks). Create the instance, then set content with '${cliInvocation()} doc update <id> ` +
              `--body <text>'; or use '${cliInvocation()} doc write' for a generic (non-kind) document.`,
            { help: `${cliInvocation()} new "${kindName}" <id>` },
          );
        }
        throw new CliError(
          "USAGE",
          `unknown field(s) for kind '${kind.governs}': ${field}` +
            (declaredFields.length > 0
              ? ` (declared: ${declaredFields.join(", ")})`
              : " (this kind declares no fields)") +
            ` — to ADD it to the '${kind.governs}' kind: \`${cliInvocation()} kind field "${kind.governs}" add ${field}\` (then re-run).`,
          { help: `${cliInvocation()} kinds` },
        );
      }
      throw err; // parseOrUsage -> translated USAGE (missing value, takes-no-value, …)
    }
  }, "new");
  // `values`'s inferred type is keyed off the STATIC control-options literal (TypeScript can't see
  // through the runtime-built `fieldOptions` spread), so a dynamic kind-field lookup below needs an
  // explicit index-signature view — the runtime shape is exactly `{ [field]: string[] | undefined }`
  // for a `{ type: "string", multiple: true }` option, which is what every field option above is.
  const dynamicValues = values as unknown as Record<string, string[] | string | boolean | undefined>;

  const id = (positionals[1] as string | undefined)?.trim();
  if (!id) {
    throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
      help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`,
    });
  }
  // A stray extra positional almost always means a flag was mistyped (e.g. a missing `--` before
  // a value) rather than a deliberate third argument — surface it instead of silently absorbing it.
  if (positionals.length > 2) {
    throw new CliError(
      "USAGE",
      `new takes exactly "<Kind>" and <id>, got ${positionals.length} positionals: ${positionals.join(", ")}`,
      { help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>` },
    );
  }

  const actor = resolveActor(values.actor as string | undefined, {
    help: `${cliInvocation()} new "<Kind>" <id> --actor <name>`,
  });

  // Parse EVERY --link value up front, before any write — a malformed value is a caller mistake,
  // not a partial-success case, so it must reject cleanly with NOTHING created (see
  // `parseLinkFlagValue`'s header).
  const linkFlags = (values.link as string[] | undefined) ?? [];
  const parsedLinks = linkFlags.map(parseLinkFlagValue);

  const frontmatter: Frontmatter = { type: kind.governs };
  for (const field of fieldNames) {
    const vals = dynamicValues[field] as string[] | undefined;
    if (vals === undefined || vals.length === 0) continue;
    frontmatter[field] = vals.length === 1 ? vals[0]! : vals;
  }
  // `mutateDoc` applies the resolved actor to frontmatter before strict validation, so the actor
  // control flag (or environment default) still satisfies a kind that declares actor as required.
  // `mutateDoc`'s validate step (strict:true below) defaults `frontmatter.timestamp` in place if
  // still absent BEFORE validating — so a kind that declares `timestamp` required (e.g. the seeded
  // Context Note kind) validates against a value that is actually present, not "missing because the
  // user didn't pass --timestamp".

  const body = (kind.sections ?? []).map((heading) => `# ${heading}\n`).join("\n");
  // `--no-prefix` uses the id VERBATIM instead of auto-prepending the kind's declared `path` — the
  // escape hatch for when a caller needs a specific id/namespace that differs from the kind's
  // convention (cold-start study r3: an agent needing a literal prefix had to drop off `new` onto
  // `doc write`, losing strict kind validation, because the auto-prefix rewrote its id).
  const targetId = values["no-prefix"] ? id : resolveInstanceId(kind, id);
  const remote = values.remote as string | undefined;

  // "create-only" mode: expect-absent CAS, the same closed-create-race pattern the CLI's recipe
  // machinery (`applyRecipe`) uses. A pre-existing doc at `targetId` maps to a structured, actionable
  // ALREADY_EXISTS (exit 5) instead of silently overwriting it. Validation is STRICT (unlike `doc
  // write`'s warn-by-default): a missing required field or a disallowed enum value rejects the
  // write (exit 2) before any write is attempted.
  const result = await mutateDoc({
    bundle,
    id: targetId,
    mode: "create-only",
    registry,
    remoteUrl: remote,
    strict: true,
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor,
    persistActor: true,
    buildCandidate: () => ({ frontmatter, body }),
    errors: {
      alreadyExists: () =>
        new CliError(
          "ALREADY_EXISTS",
          `'${targetId}' already exists — 'new' only creates fresh instances of a kind and refuses to ` +
            `silently overwrite one. Run '${cliInvocation()} doc update ${targetId}' to patch it, or ` +
            `'${cliInvocation()} doc write ${targetId} --type ${kind.governs}' to overwrite it outright ` +
            `and deliberately.`,
          { help: `${cliInvocation()} doc update ${targetId}` },
        ),
    },
  });

  const saved = result.doc;
  const receipt: Record<string, unknown> = {
    new: "written",
    kind: kind.governs,
    id: saved.id,
    type: saved.frontmatter.type,
    timestamp: saved.frontmatter.timestamp ?? null,
    // The content-addressed version token of the created doc — the CAS basis for a later
    // optimistic `doc update --expected-version` (mirrors `doc write`/`doc history`).
    version: result.version,
  };
  // Surface the path-prefixing so it isn't silent: an agent that passed a bare id (or a
  // differently-prefixed one) sees the final id it actually got (cold-start study: C4 nearly
  // committed a wrong id because the prefix was auto-applied without any indication).
  if (targetId !== id) {
    receipt.note = `id prefixed with the '${kind.governs}' kind's path → '${targetId}' (you passed '${id}')`;
  }
  // --link (one-step create+link ergonomics unit): wire each declared cross-link through the
  // EXACT SAME machinery `link add` uses (`addLink`, `link.ts`) — never a second link-writer.
  // Best-effort across entries: the doc already exists by this point, and each --link is an
  // INDEPENDENT edge, so one failing entry does not abort the others (no fake atomicity — every
  // entry is attempted and reported).
  interface LinkFlagReceipt {
    type: string;
    target: string;
    changed?: boolean;
    href?: string;
    warnings?: ValidationWarning[];
    error?: { code: string; message: string };
  }
  const linkResults: LinkFlagReceipt[] = [];
  const satisfiedOutboundTypes = new Set<string>();
  let firstLinkFailure: CliError | undefined;
  for (const { type, target } of parsedLinks) {
    const warnings: ValidationWarning[] = [];
    // Teach when this kind declares an outbound link vocabulary and `type` isn't in it — warn,
    // never block: a hard reject here would be incoherent given a DANGLING target (below) is
    // unconditionally allowed, so a merely-undeclared TYPE can't be held to a stricter standard.
    if (kind.links && Object.keys(kind.links).length > 0 && !(type in kind.links)) {
      warnings.push({
        code: "LINK_TYPE_UNDECLARED_FOR_KIND",
        message: `'${type}' is not declared in the '${kind.governs}' kind's link vocabulary (declared: ${Object.keys(kind.links).join(", ")}) — added anyway.`,
        field: "text",
        severity: "warning",
      });
    }
    try {
      const added = await addLink(bundle, saved.id, target, { text: type, remoteUrl: remote, actor });
      if (added.warnings) warnings.push(...added.warnings);
      linkResults.push({
        type,
        target,
        changed: added.changed,
        href: added.href,
        ...(warnings.length > 0 ? { warnings } : {}),
      });
      satisfiedOutboundTypes.add(type);
    } catch (err) {
      const classified = err instanceof CliError ? err : classifyBundleError(err, remote);
      linkResults.push({
        type,
        target,
        error: { code: classified.code, message: classified.message },
        ...(warnings.length > 0 ? { warnings } : {}),
      });
      if (!firstLinkFailure) firstLinkFailure = classified;
    }
  }
  if (parsedLinks.length > 0) receipt.links = linkResults;

  // Point-of-use link teaching (AXI §9): the moment an instance is created is when its declared
  // relationships are actionable — surface them as complete, placeholder-parameterized commands
  // derived from the SAME registry (inbound = alignment cue from other kinds' declarations,
  // outbound = this kind's own). Capped per direction; a bundle declaring no links adds nothing.
  // An outbound type already satisfied via --link above is dropped from its own hint — suggesting
  // a follow-up `link add` for a relationship this very command just established would be noise.
  const help = [`${cliInvocation()} doc read ${saved.id}`];
  const HINTS_PER_DIRECTION = 3;
  for (const { source, linkType } of inboundLinkDecls(registry, kind).slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link from a ${source.governs}: ${cliInvocation()} link add ${kindIdPlaceholder(source, source.governs)} ${saved.id} --text "${linkType}"`,
    );
  }
  const outboundLinkDecls = Object.entries(kind.links ?? {}).filter(([linkType]) => !satisfiedOutboundTypes.has(linkType));
  for (const [linkType, target] of outboundLinkDecls.slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link to a ${target}: ${cliInvocation()} link add ${saved.id} ${kindIdPlaceholder(registry.kinds.get(target), target)} --text "${linkType}"`,
    );
  }
  receipt.help = help;
  stdout(render(receipt, resolveMode({ json: Boolean(values.json) })));

  // At least one --link entry failed AFTER the doc was created: the full receipt above already
  // named the doc (it exists — no rollback, no fake atomicity) and which links failed. Throw
  // `asHandled` so the bin wrapper sets a non-zero exit WITHOUT re-emitting a second, conflicting
  // envelope (mirrors `sync`'s post-commit push-failure partial-envelope pattern).
  if (firstLinkFailure) {
    const failedCount = linkResults.filter((r) => r.error).length;
    throw asHandled(
      new CliError(
        firstLinkFailure.code,
        `'${saved.id}' was created, but ${failedCount} of ${parsedLinks.length} --link ${parsedLinks.length === 1 ? "entry" : "entries"} failed — see 'links' in the receipt above for details`,
        { help: firstLinkFailure.help },
      ),
    );
  }
}
