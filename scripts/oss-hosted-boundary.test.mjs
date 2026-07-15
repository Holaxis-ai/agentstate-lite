import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

test("OSS distribution excludes the frozen hosted implementation and control-plane clients", async () => {
  const retiredPaths = [
    "packages/worker",
    "packages/core/src/auth-wire.ts",
    "packages/cli/src/auth-client.ts",
    "packages/cli/src/commands/invite.ts",
    "packages/cli/src/commands/join.ts",
    "packages/cli/src/commands/key.ts",
    "packages/cli/src/commands/login.ts",
    "packages/cli/src/commands/member.ts",
    "packages/cli/src/commands/whoami.ts",
  ];

  const present = [];
  for (const relativePath of retiredPaths) {
    if (await exists(relativePath)) present.push(relativePath);
  }
  assert.deepEqual(present, [], "hosted-only source belongs in the frozen private reference, not OSS");
});

test("OSS build and lockfile carry no Cloudflare deployment dependency", async () => {
  const rootPackage = await readFile(path.join(root, "package.json"), "utf8");
  const lockfile = await readFile(path.join(root, "package-lock.json"), "utf8");
  const buildGraph = rootPackage + "\n" + lockfile;

  for (const forbidden of ["@agentstate-lite/worker", "packages/worker", "wrangler", "@cloudflare/workers-types"])
    assert.equal(buildGraph.includes(forbidden), false, `public build graph must not contain '${forbidden}'`);
});

test("generic wire authorities remain public after hosted extraction", async () => {
  const [remoteBackend, router, cli] = await Promise.all([
    readFile(path.join(root, "packages/core/src/remote-backend.ts"), "utf8"),
    readFile(path.join(root, "packages/server/src/router.ts"), "utf8"),
    readFile(path.join(root, "packages/cli/src/cli.ts"), "utf8"),
  ]);

  assert.match(remoteBackend, /export class RemoteBackend/);
  assert.match(router, /export function createRouterForBackend/);
  assert.match(cli, /serve: wrap\(serve\)/);
});
