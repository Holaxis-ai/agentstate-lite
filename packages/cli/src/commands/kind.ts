// `agentstate-lite kind field "<Kind>" <add|remove> <name> …` — EDIT a kind convention's declared
// schema (add/remove a field, restrict it to an enum). The plural `kinds` command LISTS what a bundle
// declares; this SINGULAR `kind` command MUTATES one convention doc — the same plural-lists /
// singular-mutates split as `recipes`/`recipe`.
//
// Before this, evolving a kind's schema meant hand-editing the convention's markdown frontmatter (or
// pull→edit→promote over --remote) — the recurring maintenance-journey gap the cold-start usability
// study surfaced in every round (C3). This closes it: it reads the governing convention doc (its id
// comes from `loadKinds`), edits the raw `fields.{required,optional,values}` in place while preserving
// everything else (governs/path/sections/body), and writes it back through the ordinary engine. Works
// over `--dir` and `--remote` alike (it is just a doc read + write). Idempotent: adding an
// already-declared field, or removing an absent one, is a no-op that exits 0.
import { parseArgs } from "node:util";
import { loadKinds, readDoc, writeDoc, type Frontmatter } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

/** Field names a kind convention may NOT declare — `type` is stamped from `governs`; the rest are CLI control flags (core's `RESERVED_FIELD_NAMES`). */
const RESERVED_FIELD_NAMES = new Set(["type", "dir", "remote", "json", "help"]);

export const KIND_USAGE = `agentstate-lite kind — edit a bundle's kind conventions (a kind's schema)

Usage:
  agentstate-lite kind field "<Kind>" add <name> [--required] [--values <a,b,c>] [options]
  agentstate-lite kind field "<Kind>" remove <name> [options]

Adds or removes a DECLARED field on the '<Kind>' kind's governing convention doc. The plural
'kinds' command LISTS what a bundle declares; this singular 'kind' command EDITS one (mirroring
'recipes'/'recipe'). A field added without --required is OPTIONAL; --values restricts it to an
enumerated set. Idempotent: adding an already-declared field (or removing an absent one) is a
no-op that exits 0. Preserves everything else on the convention (governs/path/sections/body).

Options:
  --required            Add the field as REQUIRED (default: optional). Ignored by 'remove'.
  --values <a,b,c>      Restrict the field to this comma-separated enum ('add' only)
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
  --actor <name>        Attribute this write
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;

/** Injectable seam so the parse→edit wiring is unit-testable. */
export interface KindCliDeps {
  stdout: (s: string) => void;
}

/** Normalize a possibly-absent/malformed `fields.<list>` into a fresh string[]. */
function toStringList(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

export async function kind(argv: string[], deps: Partial<KindCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        allowPositionals: true,
        options: {
          required: { type: "boolean" },
          values: { type: "string" },
          dir: { type: "string" },
          remote: { type: "string" },
          actor: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
      }),
    "kind",
  );
  if (values.help) {
    stdout(KIND_USAGE);
    return;
  }

  const helpHint = `${cliInvocation()} kind field "<Kind>" add <name>`;
  const subresource = positionals[0]?.trim();
  if (subresource !== "field") {
    throw new CliError(
      "USAGE",
      `kind: unknown or missing sub-resource '${subresource ?? ""}' — only 'field' is supported (edit a kind's declared fields)`,
      { help: helpHint },
    );
  }
  const kindName = positionals[1]?.trim();
  const action = positionals[2]?.trim();
  const fieldName = positionals[3]?.trim();
  if (!kindName) {
    throw new CliError("USAGE", 'kind field requires a "<Kind>"', { help: helpHint });
  }
  if (action !== "add" && action !== "remove") {
    throw new CliError("USAGE", `kind field "${kindName}" <action>: action must be 'add' or 'remove', got '${action ?? ""}'`, {
      help: helpHint,
    });
  }
  if (!fieldName) {
    throw new CliError("USAGE", `kind field "${kindName}" ${action} requires a <name>`, { help: helpHint });
  }
  if (positionals.length > 4) {
    throw new CliError(
      "USAGE",
      `kind field takes exactly "<Kind>" <action> <name>, got extra: ${positionals.slice(4).join(", ")}`,
      { help: helpHint },
    );
  }
  if (RESERVED_FIELD_NAMES.has(fieldName)) {
    throw new CliError(
      "USAGE",
      `'${fieldName}' is a reserved name and cannot be a kind field (type is stamped from the kind; dir/remote/json/help are control flags).`,
      { help: helpHint },
    );
  }
  if (action === "remove" && (values.required || values.values !== undefined)) {
    throw new CliError("USAGE", "--required/--values apply to 'add', not 'remove'", { help: helpHint });
  }
  if (values.actor !== undefined && values.actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value — pass an actor identity or omit the flag.", {
      help: helpHint,
    });
  }

  let enumVals: string[] | undefined;
  if (values.values !== undefined) {
    enumVals = values.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (enumVals.length === 0) {
      throw new CliError("USAGE", "--values was empty — pass a comma-separated list (e.g. --values todo,doing,done)", {
        help: helpHint,
      });
    }
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const registry = await loadKinds(bundle);
  const target = registry.kinds.get(kindName);
  if (!target) {
    const known = [...registry.kinds.keys()].sort();
    throw new CliError(
      "USAGE",
      known.length > 0
        ? `unknown kind '${kindName}' (declared: ${known.join(", ")})`
        : `unknown kind '${kindName}' (no kinds declared in this bundle)`,
      { help: `${cliInvocation()} kinds` },
    );
  }

  // Read the governing convention doc and edit its RAW frontmatter.fields in place, preserving
  // governs/path/sections/timestamp/body. `target.id` is the convention's own concept id.
  const conv = await readDoc(bundle, target.id);
  const fm = conv.frontmatter;
  const fieldsObj =
    fm.fields && typeof fm.fields === "object" && !Array.isArray(fm.fields)
      ? { ...(fm.fields as Record<string, unknown>) }
      : {};
  const required = toStringList(fieldsObj.required);
  const optional = toStringList(fieldsObj.optional);
  const valuesMap: Record<string, unknown> =
    fieldsObj.values && typeof fieldsObj.values === "object" && !Array.isArray(fieldsObj.values)
      ? { ...(fieldsObj.values as Record<string, unknown>) }
      : {};

  let changed = false;
  if (action === "add") {
    const targetList = values.required ? required : optional;
    const otherList = values.required ? optional : required;
    // Re-classifying an existing field (e.g. `add --required` a currently-optional field) moves it.
    const otherIdx = otherList.indexOf(fieldName);
    if (otherIdx >= 0) {
      otherList.splice(otherIdx, 1);
      changed = true;
    }
    if (!targetList.includes(fieldName)) {
      targetList.push(fieldName);
      changed = true;
    }
    if (enumVals) {
      const prev = Array.isArray(valuesMap[fieldName]) ? (valuesMap[fieldName] as unknown[]).map(String) : undefined;
      if (!prev || prev.join(" ") !== enumVals.join(" ")) {
        valuesMap[fieldName] = enumVals;
        changed = true;
      }
    }
  } else {
    for (const list of [required, optional]) {
      const idx = list.indexOf(fieldName);
      if (idx >= 0) {
        list.splice(idx, 1);
        changed = true;
      }
    }
    if (fieldName in valuesMap) {
      delete valuesMap[fieldName];
      changed = true;
    }
  }

  if (changed) {
    // Rebuild `fields`, omitting now-empty lists/maps so the convention stays clean.
    const newFields: Record<string, unknown> = {};
    if (required.length > 0) newFields.required = required;
    if (optional.length > 0) newFields.optional = optional;
    if (Object.keys(valuesMap).length > 0) newFields.values = valuesMap;
    const newFm: Frontmatter = { ...fm };
    if (Object.keys(newFields).length > 0) newFm.fields = newFields;
    else delete newFm.fields;
    await writeDoc(bundle, { id: target.id, frontmatter: newFm, body: conv.body }, { actor: values.actor?.trim() });
  }

  // Report the RESULTING schema (reload so the derived KindConvention reflects the write).
  const after = changed ? (await loadKinds(bundle)).kinds.get(kindName) : target;
  const receipt: Record<string, unknown> = {
    kind: kindName,
    changed,
    action,
    field: fieldName,
    convention: target.id,
    required: after?.fields.required ?? required,
    optional: after?.fields.optional ?? optional,
  };
  const resultValues = after?.fields.values ?? {};
  if (Object.keys(resultValues).length > 0) receipt.values = resultValues;
  receipt.help = [`${cliInvocation()} kinds`];
  stdout(render(receipt, resolveMode(values)));
}
