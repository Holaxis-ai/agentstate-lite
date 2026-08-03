// End-of-stage emitter: prints the immutable stage receipt AND the operator's exact interactive
// commands (mandatory pre-approval inspection + reject/approve + the downstream operations) so the
// staged-release run ends with everything a human needs and NOTHING that resumes automatically.
// All command strings come from the ONE pure emitter (scripts/release-operations.mjs).
//
// Usage: node scripts/release-emit-receipt.mjs --run-id .. --artifact-id .. --stage-id ..
//        --version .. --policy-tag .. --tarball-sha256 .. --tarball-filename ..
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  inspectionInstructions,
  rejectOperation,
  approveOperation,
  promoteOperation,
  registryVerifyOperations,
  immutableReleaseOperations,
} from "./release-operations.mjs";

const scriptPath = fileURLToPath(import.meta.url);

function arg(argv, flag, required = true) {
  const at = argv.indexOf(flag);
  if (at === -1) {
    if (required) throw new Error(`missing ${flag}`);
    return undefined;
  }
  const value = argv[at + 1];
  if (!value || value.startsWith("--")) throw new Error(`missing value for ${flag}`);
  return value;
}

export function buildReceipt(fields) {
  const { runId, artifactId, stageId, version, policyTag, tarballSha256, tarballFilename } = fields;
  const inspection = inspectionInstructions({ stageId, tarballSha256, filename: tarballFilename });
  return {
    receipt: {
      schema: "aslite.stage-receipt.v1",
      state: "staged",
      run_id: runId,
      artifact_id: artifactId,
      stage_id: stageId,
      version,
      policy_tag: policyTag,
      tarball_sha256: tarballSha256,
      tarball_filename: tarballFilename,
    },
    inspection,
    operations: {
      reject: rejectOperation({ stageId }),
      approve: approveOperation({ stageId }),
      registry_verify: registryVerifyOperations({ version }),
      promote: promoteOperation({ version, tag: policyTag }),
      immutable_release: immutableReleaseOperations({ releaseId: "<draft-release-id>", tag: `v${version}` }),
    },
  };
}

function markdown(built) {
  const { receipt, inspection, operations } = built;
  const lines = [
    "## Staged release receipt",
    "",
    "```json",
    JSON.stringify(receipt, null, 2),
    "```",
    "",
    `### ${inspection.title} (REQUIRED before approval)`,
    "",
    "```sh",
    ...inspection.steps,
    "```",
    `- Expected SHA-256: \`${inspection.expected_sha256}\``,
    `- On mismatch: ${inspection.on_mismatch}`,
    "",
    "### After a MATCHING inspection",
    "",
    "```sh",
    `# reject (spends this stage; prepare the next SemVer):`,
    operations.reject.command,
    `# or approve (requires 2FA):`,
    operations.approve.command,
    "```",
    "",
    "### Registry verification (read-only, after approval)",
    "",
    "```sh",
    ...operations.registry_verify.commands,
    "```",
  ];
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const argv = process.argv.slice(2);
  const built = buildReceipt({
    runId: arg(argv, "--run-id"),
    artifactId: arg(argv, "--artifact-id"),
    stageId: arg(argv, "--stage-id"),
    version: arg(argv, "--version"),
    policyTag: arg(argv, "--policy-tag"),
    tarballSha256: arg(argv, "--tarball-sha256"),
    tarballFilename: arg(argv, "--tarball-filename"),
  });
  console.log(markdown(built));
}
