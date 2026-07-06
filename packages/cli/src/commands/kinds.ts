// `agentstate-lite kinds` — list the kind conventions declared by this bundle.
//
// Phase-0 experiment result (binding — see `docs/plan-kind-conventions.md` Part B): agents given NO
// enumeration path scored 0/3 on discovery of a bundle's declared kinds (~49-command probe spirals,
// one silently-wrong artifact); agents given a dedicated `kinds` verb scored 3/3, zero failures, 3
// commands. This command IS that verb — the live-registry counterpart to `--help`/`home`'s static
// pointer line (reference.ts kindsPointer()), which stays offline/no-I/O by AXI contract.
import { parseArgs } from "node:util";
import { freshnessHorizonMs, loadKinds, type KindConvention } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const KINDS_USAGE = `agentstate-lite kinds — list the kind conventions declared by this bundle

Usage:
  agentstate-lite kinds [--dir <path>] [--remote <url>]

A kind convention is a plain OKF doc (type: Convention) under conventions/ declaring a document
kind's required/optional fields, allowed enum values, expected body sections, and an optional
freshness horizon. See 'agentstate-lite new --help' to create an instance of a declared kind.

Declaring a kind convention (frontmatter keys core reads — everything else is unread prose):
  governs              string   required — the 'type' value this convention governs
  title                string   optional — display title (defaults to governs)
  path                 string   optional — bundle-relative path prefix for instances
  fields.required      list     field names an instance MUST carry
  fields.optional      list     field names an instance MAY carry
  fields.values        map      field name -> list of allowed values — the ONLY place an enum
                                 constraint goes; never a top-level enum/enums/values/constraints key
  sections             list     expected level-1 '# Heading' body-section names
  freshness_horizon    string   '<n>(m|h|d)', e.g. 24h, 30d, 15m
A misshaped or misplaced key here is a non-fatal registry warning (visible in 'kinds'/'status'
output), never a silent no-op. See 'agentstate-lite doc read conventions/context-note' on any
--init'd bundle for a full worked example with a values: enum and sections:.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;

export interface KindsCliDeps {
  stdout: (s: string) => void;
}

/** Project one KindConvention into the flat row shape `kinds` renders. */
function toRow(kind: KindConvention): Record<string, unknown> {
  const row: Record<string, unknown> = {
    governs: kind.governs,
    required: kind.fields.required,
    optional: kind.fields.optional,
  };
  if (Object.keys(kind.fields.values).length > 0) row.values = kind.fields.values;
  if (kind.path) row.path = kind.path;
  if (kind.sections && kind.sections.length > 0) row.sections = kind.sections;
  if (kind.freshnessHorizon) {
    row.horizon = kind.freshnessHorizon;
    const ms = freshnessHorizonMs(kind);
    if (ms !== undefined) row.horizon_ms = ms;
  }
  return row;
}

export async function kinds(argv: string[], deps: Partial<KindsCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "kinds",
  );
  if (values.help) {
    stdout(KINDS_USAGE);
    return;
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const registry = await loadKinds(bundle);
  const rows = [...registry.kinds.values()].sort((a, b) => a.governs.localeCompare(b.governs)).map(toRow);

  const out: Record<string, unknown> = { count: rows.length, kinds: rows };
  if (registry.warnings.length > 0) out.warnings = registry.warnings;
  if (rows.length === 0) {
    out.help = [`${cliInvocation()} new "<Kind>" <id> --<field> <value>  (once a kind is declared)`];
  }
  stdout(render(out, resolveMode(values)));
}
