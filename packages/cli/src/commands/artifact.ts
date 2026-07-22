// `agentstate-lite artifact create <file> --title <title>` — the ONE command that owns the
// produced-output sequence (designs/artifact-runtime Unit 1): derive a collision-safe id, promote
// the bytes to `artifacts/<id>.html` (capturing the version in-process — the agent never sees a
// hash), and create-only the `type: Artifact` record with `entry` + `entry_version` + `status:
// active`. `--supersedes <id>` additionally flips the prior artifact to `superseded` and links this
// one `supersedes` it.
//
// Order is derive-id → promote → record: the blob key needs the id first. Partial failure NAMES what
// completed (the `new --link` receipt discipline) so a re-run is idempotent, never a silent orphan.
//
// Admission (rendering) is product-level and convention-INDEPENDENT (designs/artifact-runtime,
// "product kind + opt-in convention"): this command works whether or not a bundle declares the
// Artifact Convention — strict validation applies only when it does. This is NOT a thin alias for
// the generic path (the reason `note` was deleted): it owns a fumble-prone multi-step sequence.
import { promises as fs } from "node:fs";
import { parseArgs } from "node:util";
import { loadKinds, queryHeads, writeBlob, type Bundle, type Frontmatter } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { mutateDoc } from "../mutate.js";
import { boardPostPersistHook } from "../board-attribution.js";
import { resolveActor } from "../actor.js";
import { render, type OutputMode } from "../output.js";
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";
import { parseOrUsage } from "../args.js";

export const ARTIFACT_USAGE = `agentstate-lite artifact — produced outputs you share with a human (HTML today)

Usage:
  agentstate-lite artifact create <file> --title <title> [options]

'create' owns the whole sequence: it promotes <file>'s bytes under artifacts/, captures the version,
derives a collision-safe id from the title, and writes the type:Artifact record (entry, entry_version,
status: active). One command — no version hash to copy, no two-object dance.

Options:
  --title <title>       REQUIRED — the artifact's human title (and the basis for its id)
  --description <text>  Optional one-line description
  --supersedes <id>     Mark a prior artifact superseded and link this one 'supersedes' it
  --dir <path>          Operate on a local bundle at <path>
  --remote <url>        Operate on a remote bundle
  --actor <name>        Attribute the write to <name>
  --json                TOON/JSON receipt
  -h, --help            Show this help`;

const ARTIFACT_CREATE_OPTIONS = {
  title: { type: "string" },
  description: { type: "string" },
  supersedes: { type: "string" },
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
} as const;

export interface ArtifactCliDeps {
  stdout: (s: string) => void;
}

/** Title → a bundle-relative slug (lowercase, hyphen-joined, bounded); never empty. Pure. */
export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return slug || "artifact";
}

/** The first free `artifacts/<slug>[-n]` record id (n starts at 2), given the ids already present. Pure. */
export function firstFreeId(slug: string, taken: ReadonlySet<string>): string {
  let id = `artifacts/${slug}`;
  for (let n = 2; taken.has(id); n++) id = `artifacts/${slug}-${n}`;
  return id;
}

export async function artifact(argv: string[], deps: Partial<ArtifactCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const sub = argv[0];
  if (sub === undefined || sub === "--help" || sub === "-h" || sub === "help") {
    stdout(ARTIFACT_USAGE);
    return;
  }
  if (sub !== "create") {
    throw new CliError("USAGE", `unknown artifact subcommand: '${sub}' (expected 'create')`, {
      help: `${cliInvocation()} artifact --help`,
    });
  }

  const { values, positionals } = parseOrUsage(
    () => parseArgs({ args: argv.slice(1), strict: true, allowPositionals: true, options: ARTIFACT_CREATE_OPTIONS }),
    "artifact create",
  );
  if (values.help) {
    stdout(ARTIFACT_USAGE);
    return;
  }

  const file = positionals[0] as string | undefined;
  if (!file) {
    throw new CliError("USAGE", "artifact create requires a local <file> positional", {
      help: `${cliInvocation()} artifact create <file> --title <title>`,
    });
  }
  const title = (values.title as string | undefined)?.trim();
  if (!title) {
    throw new CliError("USAGE", "artifact create requires --title <title>", {
      help: `${cliInvocation()} artifact create ${file} --title <title>`,
    });
  }

  // Read the bytes ONCE, before any write — a missing/unreadable file is caller input and must leave
  // nothing created.
  let bytes: Buffer;
  try {
    bytes = await fs.readFile(file);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      throw new CliError("USAGE", `no such file: '${file}'`, {
        help: `${cliInvocation()} artifact create <file> --title <title>`,
      });
    }
    throw new CliError("RUNTIME", `could not read '${file}': ${err instanceof Error ? err.message : String(err)}`);
  }

  const mode: OutputMode = values.json ? "json" : "default";
  const dir = values.dir as string | undefined;
  const remoteUrl = values.remote as string | undefined;
  const actor = resolveActor(values.actor as string | undefined, {
    help: `${cliInvocation()} artifact create <file> --title <title> --actor <name>`,
  });
  const bundle: Bundle = await openBundle(dir, await resolveRemoteFlag(remoteUrl, dir));
  const registry = await loadKinds(bundle);

  // Derive a collision-safe id (checked against existing artifacts/ RECORD ids) → the blob key beside it.
  const existing = await queryHeads(bundle, { prefix: "artifacts/" });
  const id = firstFreeId(slugifyTitle(title), new Set(existing.map((h) => h.id)));
  const entryKey = `${id}.html`;

  const supersedes = (values.supersedes as string | undefined)?.trim();
  // The supersedes edge is a body cross-link carrying the declared verb (the carrier model); both docs
  // live under artifacts/, so it's a same-directory relative link.
  const body = supersedes ? `[supersedes](${supersedes.split("/").pop()}.md)\n` : "";

  // 1. Promote the bytes (expect-absent create — the blob key is fresh by construction of the id).
  let entryVersion: string;
  try {
    entryVersion = await writeBlob(bundle, entryKey, bytes, "text/html", { expectedVersion: null });
  } catch (err) {
    throw new CliError("RUNTIME", `could not write the artifact blob '${entryKey}': ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Create the record (create-only CAS; strict validation applies only if an Artifact convention is declared).
  const frontmatter: Frontmatter = { type: "Artifact", title, status: "active", entry: entryKey, entry_version: entryVersion };
  const description = (values.description as string | undefined)?.trim();
  if (description) frontmatter.description = description;
  let createdId: string;
  try {
    const result = await mutateDoc({
      bundle,
      id,
      mode: "create-only",
      registry,
      remoteUrl,
      strict: true,
      helpOnKindReject: `${cliInvocation()} kinds`,
      actor,
      persistActor: true,
      onPersisted: boardPostPersistHook(bundle, actor),
      buildCandidate: () => ({ frontmatter, body }),
      errors: {
        alreadyExists: () =>
          new CliError(
            "ALREADY_EXISTS",
            `'${id}' already exists — its blob '${entryKey}' was written; re-run to adopt it, or use a different --title.`,
            { help: `${cliInvocation()} artifact create <file> --title <title>` },
          ),
      },
    });
    createdId = result.doc.id;
  } catch (err) {
    if (err instanceof CliError) throw err;
    throw new CliError(
      "RUNTIME",
      `wrote the blob '${entryKey}' but failed to write the record '${id}': ${err instanceof Error ? err.message : String(err)} (re-run to adopt the blob)`,
    );
  }

  // 3. Supersede the prior — NON-fatal: the new artifact (and its link) are already written, so a
  // failure here NAMES itself in the receipt rather than losing the create.
  let supersedeNote: string | undefined;
  if (supersedes) {
    try {
      await mutateDoc({
        bundle,
        id: supersedes,
        mode: "patch",
        registry,
        remoteUrl,
        strict: false,
        helpOnKindReject: `${cliInvocation()} kinds`,
        actor,
        persistActor: true,
        onPersisted: boardPostPersistHook(bundle, actor),
        buildCandidate: (existingDoc) => {
          // patch mode guarantees the target exists; narrow it so the required Frontmatter.type carries over.
          if (!existingDoc) throw new CliError("NOT_FOUND", `'${supersedes}' does not exist`);
          return { frontmatter: { ...existingDoc.frontmatter, status: "superseded" }, body: existingDoc.body };
        },
        errors: {},
      });
    } catch (err) {
      supersedeNote = `FAILED to mark '${supersedes}' superseded: ${err instanceof Error ? err.message : String(err)} — the new artifact and its 'supersedes' link are written; run '${cliInvocation()} doc update ${supersedes} --status superseded'.`;
    }
  }

  const receipt: Record<string, unknown> = {
    artifact: "created",
    id: createdId,
    entry: entryKey,
    entry_version: entryVersion,
    content_type: "text/html",
    status: "active",
    open: `?view=artifact&id=${encodeURIComponent(createdId)}`,
  };
  if (supersedes) receipt.supersedes = supersedeNote ?? supersedes;
  receipt.help = [`${cliInvocation()} doc read ${createdId}`];
  stdout(render(receipt, mode));
}
