// Workflow-facing adapter for the operator-receipt ordering gate. Three subcommands:
//   assets  — list "<assetId> <assetName>" for THIS stage id's receipt assets on the draft release
//   verify  — verify signatures/uploaders/timestamps, then evaluate ordering via the pure module
//   stamp   — materialize the receipt-status stamp asset + release-body annotation when required
// Values arrive as argv/file data only (workflows bind expressions to env first); every signature
// is checked with `ssh-keygen -Y verify` against the committed allowed-signers file before the
// payload is trusted. Missing evidence is decided by the pure tier policy; this adapter fails
// closed on everything else.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildReceiptStatusStamp,
  canonicalPayloadBytes,
  evaluateOrdering,
  parseReceiptFile,
  receiptAssetName,
  RECEIPT_DECISIONS,
  SIGN_NAMESPACE,
  stampAnnotation,
  stampAssetName,
} from "./release-ordering.mjs";

const scriptPath = fileURLToPath(import.meta.url);

function arg(argv, flag, required = true) {
  const at = argv.indexOf(flag);
  const value = at === -1 ? undefined : argv[at + 1];
  if (!value || value.startsWith("--")) {
    if (required) throw new Error(`missing ${flag}`);
    return undefined;
  }
  return value;
}

async function jsonFile(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

/** Principals (first token per non-comment line) of an ssh allowed-signers file. */
export function allowedSignerPrincipals(text) {
  return [...new Set(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split(/\s+/)[0]),
  )];
}

/**
 * Verify one signed receipt file's ssh signature against the allowed-signers file, requiring the
 * payload's actor as principal and the fixed namespace. Returns the validated payload.
 */
export function verifySignedReceipt({ text, allowedSignersPath }) {
  const { payload, signature } = parseReceiptFile(text);
  const scratch = mkdtempSync(path.join(tmpdir(), "aslite-receipt-verify-"));
  try {
    const sigPath = path.join(scratch, "receipt.sig");
    writeFileSync(sigPath, signature.endsWith("\n") ? signature : `${signature}\n`);
    execFileSync(
      "ssh-keygen",
      ["-Y", "verify", "-f", allowedSignersPath, "-I", payload.actor, "-n", SIGN_NAMESPACE, "-s", sigPath],
      { input: canonicalPayloadBytes(payload), stdio: ["pipe", "pipe", "pipe"] },
    );
    return payload;
  } catch (error) {
    if (error?.status !== undefined) {
      throw new Error(
        `operator receipt verification failed: ssh signature check failed for ${payload.actor}: ${String(error.stderr ?? "").trim()}`,
      );
    }
    throw error;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

/** Select this stage id's receipt assets from a GitHub release JSON. */
export function selectReceiptAssets(release, stageId) {
  const wanted = new Map(RECEIPT_DECISIONS.map((decision) => [receiptAssetName(decision, stageId), decision]));
  const found = {};
  for (const asset of release?.assets ?? []) {
    const decision = wanted.get(asset?.name);
    if (!decision) continue;
    if (found[decision]) throw new Error(`operator receipt verification failed: duplicate ${decision} receipt asset`);
    found[decision] = {
      id: String(asset.id),
      name: asset.name,
      uploaderLogin: asset.uploader?.login,
      uploadedAt: asset.created_at,
    };
  }
  return found;
}

async function assetsCommand(argv) {
  const release = await jsonFile(arg(argv, "--release"));
  const assets = selectReceiptAssets(release, arg(argv, "--stage-id"));
  for (const asset of Object.values(assets)) {
    console.log(`${asset.id} ${asset.name}`);
  }
}

async function verifyCommand(argv) {
  const mode = arg(argv, "--mode");
  const chain = await jsonFile(arg(argv, "--chain"));
  const stageReceipt = await jsonFile(arg(argv, "--receipt"));
  const release = await jsonFile(arg(argv, "--release"));
  const receiptsDir = arg(argv, "--receipts-dir");
  const runCreatedAt = arg(argv, "--run-created-at");
  const allowedSignersPath = arg(argv, "--allowed-signers");
  const allowedActors = allowedSignerPrincipals(await readFile(allowedSignersPath, "utf8"));

  const assets = selectReceiptAssets(release, chain.stage_id);
  const receipts = {};
  for (const decision of RECEIPT_DECISIONS) {
    const asset = assets[decision];
    if (!asset) continue;
    const payload = verifySignedReceipt({
      text: await readFile(path.join(receiptsDir, asset.name), "utf8"),
      allowedSignersPath,
    });
    receipts[decision] = { payload, uploaderLogin: asset.uploaderLogin, uploadedAt: asset.uploadedAt };
  }

  const result = evaluateOrdering({
    mode,
    chain,
    stageReceipt,
    inspected: receipts.inspected ?? null,
    approved: receipts.approved ?? null,
    runCreatedAt,
    allowedActors,
  });
  await writeFile(arg(argv, "--out"), `${JSON.stringify(result, null, 2)}\n`);
  if (result.missing.length > 0) {
    const consequence = result.mode === "live" ? "the publish will be stamped" : "live finalize would stamp (prerelease) or refuse (stable)";
    console.error(`::warning::missing operator receipts: ${result.missing.join(", ")} — ${consequence}`);
  }
  console.log(JSON.stringify(result));
}

async function stampCommand(argv) {
  const result = await jsonFile(arg(argv, "--result"));
  const release = await jsonFile(arg(argv, "--release"));
  const outDir = arg(argv, "--out-dir");
  const finalizeRunId = arg(argv, "--finalize-run-id");
  await mkdir(outDir, { recursive: true });
  if (!result.stamp_required) {
    await writeFile(path.join(outDir, "asset-name.txt"), "");
    return;
  }
  const stamp = buildReceiptStatusStamp({ result, finalizeRunId, emittedAt: new Date().toISOString() });
  const assetName = stampAssetName(stamp.stage_id);
  await writeFile(path.join(outDir, assetName), `${JSON.stringify(stamp, null, 2)}\n`);
  await writeFile(path.join(outDir, "asset-name.txt"), `${assetName}\n`);
  const body = typeof release.body === "string" && release.body.trim() ? `${release.body}\n\n` : "";
  await writeFile(path.join(outDir, "body.txt"), `${body}${stampAnnotation(stamp)}\n`);
  console.log(JSON.stringify({ stamped: true, asset: assetName, missing: stamp.missing }));
}

export async function main(argv) {
  const [command, ...rest] = argv;
  if (command === "assets") return assetsCommand(rest);
  if (command === "verify") return verifyCommand(rest);
  if (command === "stamp") return stampCommand(rest);
  throw new Error("usage: release-verify-ordering.mjs assets|verify|stamp ...");
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
