// `doc write <id>` — see `../doc.ts`'s header comment for the full F1 (P1, data loss) rationale and
// the round-review stdin-detection fix this verb's body-source guard depends on.
import { parseArgs } from "node:util";
import { promises as fs } from "node:fs";
import { readDoc, loadKinds, type Frontmatter, type OkfDocument } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../../bundle.js";
import { CliError, classifyBundleError } from "../../errors.js";
import { parseOrUsage } from "../../args.js";
import { render, resolveMode } from "../../output.js";
import { cliInvocation } from "../../invocation.js";
import { mutateDoc } from "../../mutate.js";
import { DOC_WRITE_USAGE, type DocCliDeps, defaultReadStdin } from "./common.js";

export async function docWrite(argv: string[], deps: Partial<DocCliDeps>): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const readStdin = deps.readStdin ?? defaultReadStdin;

  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          type: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          resource: { type: "string" },
          tag: { type: "string", multiple: true },
          timestamp: { type: "string" },
          body: { type: "string" },
          "body-file": { type: "string" },
          "blank-body": { type: "boolean" },
          strict: { type: "boolean" },
          actor: { type: "string" },
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "doc write",
  );
  if (values.help) {
    stdout(DOC_WRITE_USAGE);
    return;
  }

  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc write requires a concept <id> positional", {
      help: `${cliInvocation()} doc write <id> --type <t>`,
    });
  }
  const type = values.type?.trim();
  if (!type) {
    throw new CliError("USAGE", "--type <t> is required (OKF concepts must carry a non-empty type)", {
      help: `${cliInvocation()} doc write ${id} --type <t>`,
    });
  }
  if (values.actor !== undefined && values.actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value — pass an actor identity or omit the flag.", {
      help: `${cliInvocation()} doc write ${id} --actor <name>`,
    });
  }

  // Body source: --body wins, then --body-file, then piped stdin. `bodySourceGiven` tracks whether
  // the caller supplied a body source at all: --body (even --body "") and --body-file always count,
  // even when their content is empty; piped stdin counts ONLY when its content is non-empty
  // (belt-and-braces: an empty stdin read is treated the same as no input at all, since an agent
  // harness's redirected-but-dataless stdin can otherwise be indistinguishable from a deliberate
  // empty pipe). This is the F1 guard below's load-bearing distinction.
  let body: string;
  let bodySourceGiven: boolean;
  if (values.body !== undefined) {
    body = values.body;
    bodySourceGiven = true;
  } else if (values["body-file"]) {
    body = await fs.readFile(values["body-file"], "utf8");
    bodySourceGiven = true;
  } else {
    const stdinBody = await readStdin();
    bodySourceGiven = stdinBody !== undefined && stdinBody !== "";
    body = stdinBody ?? "";
  }
  const blankBody = Boolean(values["blank-body"]);

  const frontmatter: Frontmatter = { type };
  if (values.title !== undefined) frontmatter.title = values.title;
  if (values.description !== undefined) frontmatter.description = values.description;
  if (values.resource !== undefined) frontmatter.resource = values.resource;
  if (values.tag && values.tag.length > 0) frontmatter.tags = values.tag;
  // `--actor` persists as the doc's OWN `actor` frontmatter field — the per-doc attribution that
  // sync's change enrichment reads (frontmatter is the ONLY per-doc source; engine version
  // attribution below is a separate channel a plain filesystem bundle never surfaces). Sync-verb
  // review adjudication F / PR#13 item 3: without this, every CLI-authored doc rendered actor
  // "unknown" in sync receipts, commit subjects, and incoming rows. No `--actor` → no field (no
  // default, no env fallback); kind conventions are unaffected (validateAgainstKind is not a
  // top-level-key linter — OKF §9 permits undeclared frontmatter).
  if (values.actor !== undefined) frontmatter.actor = values.actor.trim();
  if (values.timestamp?.trim()) {
    // Validate an explicit --timestamp at the input boundary: gate 2 derives freshness/staleness and
    // list-sort from it, so an un-parseable value would silently poison those (it was previously
    // persisted verbatim). Reject with exit 2 like --type does. External-bundle timestamps still flow
    // through the engine's parse-layer normalization untouched — this guards only the CLI's raw input.
    const ts = values.timestamp.trim();
    if (Number.isNaN(Date.parse(ts))) {
      throw new CliError(
        "USAGE",
        `--timestamp ${JSON.stringify(ts)} is not a valid date/time (expected ISO-8601, e.g. 2026-07-03T12:00:00Z)`,
        { help: `${cliInvocation()} doc write ${id} --timestamp <iso>` },
      );
    }
    frontmatter.timestamp = ts;
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));

  // Read the EXISTING doc (if any) ONCE. Reused by every guard below: the schema-loss (convention)
  // refusal, the F1 body-blank refusal, AND the dropped-frontmatter-fields warning. A create (ENOENT)
  // leaves `existing` undefined and all three skip. One read on a mutation — not a hot path — and the
  // dropped-fields warning (cold-start study r3) needs it on EVERY overwrite, not just the no-body case.
  const isConventionPath = id.startsWith("conventions/");
  let existing: OkfDocument | undefined;
  try {
    existing = await readDoc(bundle, id);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
      throw classifyBundleError(err, values.remote);
    }
    // ENOENT: no existing doc — this is a creation, not an overwrite. Nothing to guard.
  }

  // SCHEMA-LOSS guard (cold-start study #3): `doc write` replaces the WHOLE document and carries only
  // a fixed flag set (type/title/description/resource/tags/timestamp) — it has NO governs/fields
  // flags. Overwriting an existing kind CONVENTION with it silently drops the convention's schema
  // (governs/fields/path), un-declaring its kind with exit 0 and no warning. Refuse.
  if (isConventionPath && existing && existing.frontmatter.type === "Convention") {
    const governs =
      typeof existing.frontmatter.governs === "string" && existing.frontmatter.governs.trim()
        ? existing.frontmatter.governs
        : "(unknown)";
    throw new CliError(
      "USAGE",
      `refusing to overwrite kind convention '${id}' with 'doc write' — it replaces the whole document and ` +
        `would drop the convention's schema (governs/fields/path), un-declaring the '${governs}' kind. To change ` +
        `its title/body, use 'doc update' (it preserves the schema). To change the schema fields, use ` +
        `'${cliInvocation()} kind field "${governs}" add/remove <name>' (or edit the convention's markdown frontmatter directly).`,
      { help: `${cliInvocation()} doc update ${id} --title <t>` },
    );
  }

  // F1 (P1, data loss) guard: an existing, non-empty body must not be silently blanked when no body
  // source was given and the caller hasn't opted into blanking (--blank-body). A brand-new doc is
  // always allowed through (an empty body is a valid creation).
  if (!bodySourceGiven && !blankBody && existing && existing.body.trim() !== "") {
    throw new CliError(
      "USAGE",
      `'${id}' already has a non-empty body and no body source was given (--body, --body-file, or ` +
        `piped stdin) — refusing to silently blank it. Pass a body source, run ` +
        `'${cliInvocation()} doc update ${id}' to patch other fields while preserving the body, or ` +
        `pass --blank-body to blank it deliberately.`,
      {
        help: `${cliInvocation()} doc update ${id}`,
        details: { existing_body_chars: existing.body.length },
      },
    );
  }

  // If a kind convention governs `type`, validate against it — WARN-by-default (attach `warnings[]`
  // to the receipt, still write, exit 0); `--strict` upgrades a non-empty warning set to a USAGE
  // error (exit 2) that does NOT write. `mutateDoc`'s "overwrite" mode runs this decision (via
  // `kind-write.ts`'s shared `defaultTimestampAndValidateKind` — B8, also consumed by `promote`'s
  // `.md` route) BEFORE writing, defaulting `frontmatter.timestamp` first so a kind that requires
  // `timestamp` validates against the value that will actually be persisted. A conventions-free
  // bundle (no Convention docs) loads an empty registry, so this is a no-op.
  const registry = await loadKinds(bundle);

  // "overwrite" mode: never re-reads (the F1 guard above already did the ONE conditional read this
  // verb needs, and classified any error from it); writes unconditionally, last-writer-wins.
  const result = await mutateDoc({
    bundle,
    id,
    mode: "overwrite",
    registry,
    remoteUrl: values.remote,
    strict: Boolean(values.strict),
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor: values.actor?.trim(),
    buildCandidate: () => ({ frontmatter, body }),
    errors: {},
  });

  const saved = result.doc;
  const receipt: Record<string, unknown> = {
    doc: "written",
    id: saved.id,
    type: saved.frontmatter.type,
    timestamp: saved.frontmatter.timestamp ?? null,
    // The content-addressed version token of this write — pass it back as `--expected-version` for a
    // later optimistic doc update/delete (see also `doc history`).
    version: result.version,
  };
  // Dropped-frontmatter warning (cold-start study r3): `doc write` replaces the WHOLE document, so an
  // overwrite (e.g. re-running the "same" write, expecting idempotency) silently REGRESSES frontmatter
  // fields the existing doc carried that this write didn't re-supply — e.g. a `status` a prior
  // `doc update`/`new` set. Surface it (never silent); `doc update` is the preserve-the-rest path.
  // (Conventions are REFUSED above; this warns for ordinary docs / kind instances.)
  const droppedFields = existing
    ? Object.keys(existing.frontmatter).filter((k) => k !== "timestamp" && !(k in frontmatter))
    : [];
  if (droppedFields.length > 0) {
    receipt.dropped_fields = droppedFields;
    receipt.note =
      `'doc write' is a FULL replace and dropped ${droppedFields.length} frontmatter field(s) not re-supplied: ` +
      `${droppedFields.join(", ")}. To change fields while preserving the rest (e.g. a status set by 'doc update' ` +
      `or 'new'), use '${cliInvocation()} doc update ${id}' instead.`;
  }
  if (result.warnings.length > 0) receipt.warnings = result.warnings;
  receipt.help = [`${cliInvocation()} doc read ${saved.id}`];

  stdout(render(receipt, resolveMode(values)));
}
