// CLI wrapper over the pure operations emitter (scripts/release-operations.mjs). Without --execute
// it PRINTS the exact command strings (dry-run); with --execute it runs them, failing on the first
// non-zero exit. It never builds or packs — it only runs the registry/release operations the
// protocol specifies for a candidate that already exists. Used by the finalize workflow and usable
// by an operator for a dry-run preview.
//
// Usage: node scripts/release-run-operations.mjs --op <name> [op args] [--execute]
//   ops: reject|approve|secondary-tag|remove-secondary-tag|rollback|registry-verify|promote|immutable-release
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ops from "./release-operations.mjs";

const scriptPath = fileURLToPath(import.meta.url);

function arg(argv, flag, required = false) {
  const at = argv.indexOf(flag);
  if (at === -1) {
    if (required) throw new Error(`missing ${flag}`);
    return undefined;
  }
  const value = argv[at + 1];
  if (value === undefined || value.startsWith("--")) throw new Error(`missing value for ${flag}`);
  return value;
}

/** Resolve an op name + flags to the ordered list of exact command strings. Pure. */
export function commandsFor(op, argv) {
  switch (op) {
    case "reject":
      return [ops.rejectOperation({ stageId: arg(argv, "--stage-id", true) }).command];
    case "approve":
      return [ops.approveOperation({ stageId: arg(argv, "--stage-id", true) }).command];
    case "secondary-tag":
      return [ops.secondaryTagOperation({ version: arg(argv, "--version", true), tag: arg(argv, "--tag", true) }).command];
    case "remove-secondary-tag":
      return [ops.removeSecondaryTagOperation({ tag: arg(argv, "--tag", true) }).command];
    case "rollback":
      return ops.rollbackOperation({
        failedVersion: arg(argv, "--failed-version", true),
        priorVersion: arg(argv, "--prior-version", true),
        track: arg(argv, "--track") ?? "next",
      }).commands;
    case "registry-verify":
      return ops.registryVerifyOperations({ version: arg(argv, "--version", true) }).commands;
    case "promote":
      return [ops.promoteOperation({ version: arg(argv, "--version", true), tag: arg(argv, "--tag") ?? "latest" }).command];
    case "immutable-release":
      return ops.immutableReleaseOperations({
        releaseId: arg(argv, "--release-id", true),
        tag: `v${arg(argv, "--version", true)}`,
      }).commands;
    default:
      throw new Error(`unknown op: ${op}`);
  }
}

function execute(command) {
  return new Promise((resolve, reject) => {
    const child = spawn("sh", ["-c", command], { stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`command failed (${code}): ${command}`))));
    child.on("error", reject);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const argv = process.argv.slice(2);
    const op = arg(argv, "--op", true);
    const doExecute = argv.includes("--execute");
    const commands = commandsFor(op, argv);
    for (const command of commands) {
      if (doExecute) {
        console.log(`+ ${command}`);
        await execute(command);
      } else {
        console.log(command);
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
