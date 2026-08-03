import assert from "node:assert/strict";
import test from "node:test";

import {
  inspectionInstructions,
  rejectOperation,
  approveOperation,
  secondaryTagOperation,
  removeSecondaryTagOperation,
  rollbackOperation,
  registryVerifyOperations,
  promoteOperation,
  immutableReleaseOperations,
} from "./release-operations.mjs";
import { commandsFor } from "./release-run-operations.mjs";

const SHA = "sha256:" + "a".repeat(64);
const BARE = "a".repeat(64);

test("inspection instructions emit the exact stage download + SHA-256 compare", () => {
  const i = inspectionInstructions({ stageId: "stage-1", tarballSha256: SHA, filename: "holaxis-aslite-0.1.0-pre.4.tgz" });
  assert.equal(i.steps[0], "npm stage download stage-1 --out ./holaxis-aslite-0.1.0-pre.4.tgz");
  assert.equal(i.steps[1], "shasum -a 256 ./holaxis-aslite-0.1.0-pre.4.tgz");
  assert.equal(
    i.steps[2],
    `test "$(shasum -a 256 ./holaxis-aslite-0.1.0-pre.4.tgz | awk '{print $1}')" = "${BARE}" && echo MATCH || echo MISMATCH`,
  );
  assert.equal(i.expected_sha256, SHA);
});

test("reject/approve require 2fa and name the exact stage id", () => {
  assert.deepEqual(rejectOperation({ stageId: "s9" }), { command: "npm stage reject s9", requires_2fa: true });
  assert.deepEqual(approveOperation({ stageId: "s9" }), { command: "npm stage approve s9", requires_2fa: true });
});

test("secondary tag operations target the scoped package", () => {
  assert.equal(secondaryTagOperation({ version: "0.1.0-pre.4", tag: "next" }).command, "npm dist-tag add @holaxis/aslite@0.1.0-pre.4 next");
  assert.equal(removeSecondaryTagOperation({ tag: "next" }).command, "npm dist-tag rm @holaxis/aslite next");
});

test("rollback restores the prior track and deprecates with the recovery command as the message", () => {
  const r = rollbackOperation({ failedVersion: "0.1.0-pre.4", priorVersion: "0.1.0-pre.3", track: "next" });
  assert.equal(r.commands[0], "npm dist-tag add @holaxis/aslite@0.1.0-pre.3 next");
  assert.match(r.commands[1], /^npm deprecate @holaxis\/aslite@0\.1\.0-pre\.4 ".*npm install --global @holaxis\/aslite@0\.1\.0-pre\.3.*"$/);
  assert.equal(r.recovery_command, "npm install --global @holaxis/aslite@0.1.0-pre.3");
});

test("registry verification lists signature, integrity, and clean-install smoke — all read-only", () => {
  const v = registryVerifyOperations({ version: "0.1.0-pre.4" });
  assert.ok(v.commands.includes("npm audit signatures --package @holaxis/aslite@0.1.0-pre.4"));
  assert.ok(v.commands.includes("npm view @holaxis/aslite@0.1.0-pre.4 dist.integrity dist.shasum --json"));
  assert.ok(v.commands.includes("npm install --global @holaxis/aslite@0.1.0-pre.4"));
  assert.ok(v.commands.some((c) => c.startsWith("aslite version --check")));
  // No mutation verb leaks into the read-only proof.
  assert.ok(!v.commands.some((c) => /dist-tag|publish|deprecate|stage (approve|reject)/.test(c)));
});

test("promote and immutable release name the exact version/tag/release id", () => {
  assert.equal(promoteOperation({ version: "0.1.0", tag: "latest" }).command, "npm dist-tag add @holaxis/aslite@0.1.0 latest");
  const rel = immutableReleaseOperations({ releaseId: "rel-42", tag: "v0.1.0" });
  assert.ok(rel.commands[0].includes("releases/rel-42"));
  assert.ok(rel.commands[1].includes("-f draft=false"));
});

test("every operation fails closed on a missing required argument", () => {
  assert.throws(() => rejectOperation({}), /requires stageId/);
  assert.throws(() => secondaryTagOperation({ version: "1.0.0" }), /requires tag/);
  assert.throws(() => rollbackOperation({ failedVersion: "x" }), /requires priorVersion/);
  assert.throws(() => immutableReleaseOperations({ releaseId: "r" }), /requires tag/);
});

test("commandsFor resolves each op name to the same exact strings", () => {
  assert.deepEqual(commandsFor("reject", ["--stage-id", "s1"]), ["npm stage reject s1"]);
  assert.deepEqual(commandsFor("registry-verify", ["--version", "0.1.0"]), registryVerifyOperations({ version: "0.1.0" }).commands);
  assert.deepEqual(
    commandsFor("immutable-release", ["--version", "0.1.0", "--release-id", "rel-9"]),
    immutableReleaseOperations({ releaseId: "rel-9", tag: "v0.1.0" }).commands,
  );
  assert.throws(() => commandsFor("bogus", []), /unknown op/);
});
