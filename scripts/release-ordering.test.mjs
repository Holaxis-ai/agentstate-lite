import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildReceiptStatusStamp,
  canonicalPayloadBytes,
  canonicalReceiptPayload,
  evaluateOrdering,
  isAuxiliaryReleaseAssetName,
  parseReceiptFile,
  policyTagFor,
  receiptAssetName,
  receiptEmissionCommands,
  releaseTier,
  SIGN_NAMESPACE,
  stampAnnotation,
  stampAssetName,
} from "./release-ordering.mjs";
import { allowedSignerPrincipals, main as verifyOrderingMain, selectReceiptAssets, verifySignedReceipt } from "./release-verify-ordering.mjs";
import { buildStageReceipt } from "./release-receipts.mjs";
import { ReleaseStateError } from "./release-state.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STAGE_ID = "123e4567-e89b-42d3-a456-426614174000";
const OTHER_STAGE_ID = "223e4567-e89b-42d3-a456-426614174000";
const COMMIT = "1".repeat(40);
const TARBALL_SHA = "sha256:" + "a".repeat(64);
const OTHER_SHA = "sha256:" + "9".repeat(64);
const MANIFEST_SHA = "sha256:" + "b".repeat(64);
const INTEGRITY = "sha512-YWJjZA==";
const RUN_CREATED_AT = "2026-08-08T12:00:00Z";
const ALLOWED = ["briand-ai", "mikec-ai"];

function stageReceiptFor(version) {
  const tarball = `holaxis-aslite-${version}.tgz`;
  return buildStageReceipt({
    runId: "100",
    artifactId: "101",
    artifactDigest: "sha256:" + "c".repeat(64),
    stageId: STAGE_ID,
    version,
    tag: `v${version}`,
    sourceCommit: COMMIT,
    policyTag: version.includes("-") ? "next" : "latest",
    tarballSha256: TARBALL_SHA,
    tarballFilename: tarball,
    integrity: INTEGRITY,
    manifestSha256: MANIFEST_SHA,
    draftReleaseId: "300",
    draftAssets: [
      { id: "201", name: tarball, digest: TARBALL_SHA },
      { id: "202", name: "candidate.json", digest: MANIFEST_SHA },
    ],
  });
}

function chainFor(version) {
  return {
    schema: "aslite.finalizer-chain-proof.v1",
    version,
    tag: `v${version}`,
    source_commit: COMMIT,
    stage_id: STAGE_ID,
    draft_release_id: "300",
    tarball_sha256: TARBALL_SHA,
    integrity: INTEGRITY,
  };
}

function receiptFor(decision, version, overrides = {}, meta = {}) {
  const payload = canonicalReceiptPayload({
    decision,
    stage_id: STAGE_ID,
    version,
    tarball_sha256: TARBALL_SHA,
    draft_release_id: "300",
    actor: "briand-ai",
    emitted_at: decision === "inspected" ? "2026-08-08T10:00:00Z" : "2026-08-08T10:30:00Z",
    ...(decision === "inspected" ? { observed_sha256: TARBALL_SHA } : {}),
    ...overrides,
  });
  return {
    payload,
    uploaderLogin: meta.uploaderLogin ?? payload.actor,
    uploadedAt: meta.uploadedAt ?? (decision === "inspected" ? "2026-08-08T10:01:00Z" : "2026-08-08T10:31:00Z"),
  };
}

function evaluate(version, { mode = "live", inspected, approved } = {}) {
  return evaluateOrdering({
    mode,
    chain: chainFor(version),
    stageReceipt: stageReceiptFor(version),
    inspected: inspected === undefined ? receiptFor("inspected", version) : inspected,
    approved: approved === undefined ? receiptFor("approved", version) : approved,
    runCreatedAt: RUN_CREATED_AT,
    allowedActors: ALLOWED,
  });
}

const PRE = "0.1.0-pre.4";
const STABLE = "0.1.0";

test("payload shape: canonical, ordered, validated", () => {
  const a = canonicalReceiptPayload({
    emitted_at: "2026-08-08T10:00:00Z",
    actor: "briand-ai",
    observed_sha256: TARBALL_SHA,
    draft_release_id: "300",
    tarball_sha256: TARBALL_SHA,
    version: PRE,
    stage_id: STAGE_ID,
    decision: "inspected",
  });
  const b = canonicalReceiptPayload({
    decision: "inspected",
    stage_id: STAGE_ID,
    version: PRE,
    tarball_sha256: TARBALL_SHA,
    draft_release_id: "300",
    actor: "briand-ai",
    emitted_at: "2026-08-08T10:00:00Z",
    observed_sha256: TARBALL_SHA,
  });
  assert.equal(canonicalPayloadBytes(a), canonicalPayloadBytes(b), "field order in input never changes signed bytes");
  assert.deepEqual(Object.keys(a), [
    "schema", "decision", "stage_id", "version", "tarball_sha256", "draft_release_id", "actor", "emitted_at", "observed_sha256",
  ]);
  for (const bad of [
    { decision: "published" },
    { version: "not-semver" },
    { tarball_sha256: "a".repeat(64) },
    { actor: "briand ai" },
    { emitted_at: "yesterday" },
    { schema: "aslite.operator-receipt.v2" },
  ]) {
    assert.throws(() => canonicalReceiptPayload({ ...a, ...bad }), /operator receipt verification failed/);
  }
  assert.throws(
    () => canonicalReceiptPayload({ ...a, decision: "approved" }),
    /must not carry observed_sha256/,
    "approved receipts carry no observation claim",
  );
});

test("tier + naming authorities", () => {
  assert.equal(releaseTier(PRE), "prerelease");
  assert.equal(releaseTier(STABLE), "stable");
  assert.equal(policyTagFor(PRE), "next");
  assert.equal(policyTagFor(STABLE), "latest");
  assert.equal(receiptAssetName("inspected", STAGE_ID), `receipt-inspected-${STAGE_ID}.json`);
  assert.equal(stampAssetName(STAGE_ID), `receipt-status-${STAGE_ID}.json`);
  assert.ok(isAuxiliaryReleaseAssetName(`receipt-approved-${STAGE_ID}.json`));
  assert.ok(isAuxiliaryReleaseAssetName(`receipt-status-${STAGE_ID}.json`));
  assert.ok(!isAuxiliaryReleaseAssetName("evil.tgz"));
  assert.ok(!isAuxiliaryReleaseAssetName("receipt-forged-x.json"));
  assert.ok(!isAuxiliaryReleaseAssetName("candidate.json"));
  assert.throws(() => receiptAssetName("status", STAGE_ID), /unknown receipt decision/);
});

test("TIER MATRIX — prerelease with both receipts reaches approved_public, no stamp", () => {
  const result = evaluate(PRE);
  assert.equal(result.tier, "prerelease");
  assert.equal(result.state, "approved_public");
  assert.deepEqual(result.missing, []);
  assert.equal(result.stamp_required, false);
  assert.equal(result.actor, "briand-ai");
});

test("TIER MATRIX — prerelease missing inspection passes WITH stamp, ledger stays staged", () => {
  const result = evaluate(PRE, { inspected: null });
  assert.equal(result.state, "staged");
  assert.deepEqual(result.missing, ["inspected"]);
  assert.deepEqual(result.verified, ["approved"]);
  assert.equal(result.stamp_required, true);
});

test("TIER MATRIX — prerelease missing both passes WITH stamp naming both", () => {
  const result = evaluate(PRE, { inspected: null, approved: null });
  assert.equal(result.state, "staged");
  assert.deepEqual(result.missing, ["inspected", "approved"]);
  assert.equal(result.stamp_required, true);
});

test("TIER MATRIX — prerelease inspected-only stamps the missing approval receipt", () => {
  const result = evaluate(PRE, { approved: null });
  assert.equal(result.state, "inspected");
  assert.deepEqual(result.missing, ["approved"]);
  assert.equal(result.stamp_required, true);
});

test("TIER MATRIX — stable with both receipts passes; missing either is red", () => {
  assert.equal(evaluate(STABLE).state, "approved_public");
  assert.throws(() => evaluate(STABLE, { inspected: null }), /missing required operator receipts: inspected/);
  assert.throws(() => evaluate(STABLE, { approved: null }), /missing required operator receipts: approved/);
  assert.throws(
    () => evaluate(STABLE, { inspected: null, approved: null }),
    /missing required operator receipts: inspected, approved/,
  );
});

test("TIER MATRIX — dry-run tolerates absence in BOTH tiers (reported, not red, no stamp)", () => {
  for (const version of [PRE, STABLE]) {
    const result = evaluate(version, { mode: "dry-run", inspected: null, approved: null });
    assert.deepEqual(result.missing, ["inspected", "approved"]);
    assert.equal(result.stamp_required, false, "stamping is a live-publish act");
  }
});

test("ADVERSARIAL — present-but-invalid evidence is red in every tier and mode", () => {
  const cases = [
    ["receipt for a different stage (replayed prior candidate)", { inspected: receiptFor("inspected", PRE, { stage_id: OTHER_STAGE_ID }) }],
    ["receipt for a different draft release", { inspected: receiptFor("inspected", PRE, { draft_release_id: "999" }) }],
    ["receipt naming different bytes", { inspected: receiptFor("inspected", PRE, { tarball_sha256: OTHER_SHA, observed_sha256: OTHER_SHA }) }],
    ["actor outside the allowlist", { inspected: receiptFor("inspected", PRE, { actor: "attacker" }, { uploaderLogin: "attacker" }) }],
    ["bot-uploaded receipt (CI token cannot impersonate an operator)", { inspected: receiptFor("inspected", PRE, {}, { uploaderLogin: "github-actions[bot]" }) }],
    ["receipt uploaded after finalize dispatch", { inspected: receiptFor("inspected", PRE, {}, { uploadedAt: "2026-08-08T12:00:01Z" }) }],
    ["approval uploaded before inspection", { approved: receiptFor("approved", PRE, {}, { uploadedAt: "2026-08-08T09:00:00Z" }) }],
    ["cross-operator inspect/approve (approver must attest their own inspection)", { approved: receiptFor("approved", PRE, { actor: "mikec-ai" }, { uploaderLogin: "mikec-ai" }) }],
    ["decision/kind mismatch", { inspected: receiptFor("approved", PRE) }],
  ];
  for (const [label, receipts] of cases) {
    for (const mode of ["live", "dry-run"]) {
      assert.throws(() => evaluate(PRE, { mode, ...receipts }), /operator receipt verification failed/, `${label} (${mode})`);
    }
  }
});

test("ADVERSARIAL — a forged matching-signature receipt with a wrong observed SHA hits the state machine", () => {
  // Even if an operator signed a mismatch, the replayed inspection cross-check refuses approval.
  const version = PRE;
  const inspected = receiptFor("inspected", version);
  inspected.payload = { ...inspected.payload, observed_sha256: OTHER_SHA };
  assert.throws(
    () => evaluateOrdering({
      mode: "live",
      chain: chainFor(version),
      stageReceipt: stageReceiptFor(version),
      inspected,
      approved: null,
      runCreatedAt: RUN_CREATED_AT,
      allowedActors: ALLOWED,
    }),
    (error) => error instanceof ReleaseStateError && error.code === "inspection_mismatch",
  );
});

test("evaluateOrdering fails closed on unknown mode and empty allowlist", () => {
  assert.throws(() => evaluate(PRE, { mode: "yolo" }), /unknown mode/);
  assert.throws(
    () => evaluateOrdering({
      mode: "live",
      chain: chainFor(PRE),
      stageReceipt: stageReceiptFor(PRE),
      inspected: null,
      approved: null,
      runCreatedAt: RUN_CREATED_AT,
      allowedActors: [],
    }),
    /principal list is empty/,
  );
});

test("stamp: built only when required, names the missing evidence, annotation matches", () => {
  const result = evaluate(PRE, { inspected: null });
  const stamp = buildReceiptStatusStamp({ result, finalizeRunId: "555", emittedAt: "2026-08-08T13:00:00Z" });
  assert.equal(stamp.schema, "aslite.receipt-status.v1");
  assert.equal(stamp.note, "published without inspected receipt");
  assert.deepEqual(stamp.missing, ["inspected"]);
  assert.equal(stamp.tier, "prerelease");
  assert.equal(stamp.stage_id, STAGE_ID);
  const annotation = stampAnnotation(stamp);
  assert.match(annotation, /published without inspected receipt/);
  assert.match(annotation, new RegExp(`receipt-status-${STAGE_ID}`));
  const both = buildReceiptStatusStamp({
    result: evaluate(PRE, { inspected: null, approved: null }),
    finalizeRunId: "555",
    emittedAt: "2026-08-08T13:00:00Z",
  });
  assert.equal(both.note, "published without inspected receipt or approved receipt");
  const clean = evaluate(PRE);
  assert.throws(() => buildReceiptStatusStamp({ result: clean, finalizeRunId: "555", emittedAt: "2026-08-08T13:00:00Z" }), /does not require one/);
});

test("receipt emission commands are validated and injection-shaped values throw", () => {
  const commands = receiptEmissionCommands({ stageId: STAGE_ID, version: PRE, draftReleaseId: "300" });
  assert.match(commands.inspected, /release-inspect\.mjs --stage-id/);
  assert.match(commands.approved, /--decision approved$/);
  assert.throws(() => receiptEmissionCommands({ stageId: "-rf; rm", version: PRE, draftReleaseId: "300" }), /invalid stage id/);
});

test("selectReceiptAssets picks THIS stage's receipts, ignores siblings, rejects duplicates", () => {
  const release = {
    assets: [
      { id: 1, name: `receipt-inspected-${STAGE_ID}.json`, uploader: { login: "briand-ai" }, created_at: "2026-08-08T10:01:00Z" },
      { id: 2, name: `receipt-approved-${STAGE_ID}.json`, uploader: { login: "briand-ai" }, created_at: "2026-08-08T10:31:00Z" },
      { id: 3, name: `receipt-inspected-${OTHER_STAGE_ID}.json`, uploader: { login: "briand-ai" }, created_at: "2026-08-08T09:00:00Z" },
      { id: 4, name: "holaxis-aslite-0.1.0-pre.4.tgz" },
      { id: 5, name: "candidate.json" },
    ],
  };
  const found = selectReceiptAssets(release, STAGE_ID);
  assert.deepEqual(Object.keys(found).sort(), ["approved", "inspected"]);
  assert.equal(found.inspected.id, "1");
  assert.equal(found.approved.uploaderLogin, "briand-ai");
  release.assets.push({ id: 6, name: `receipt-inspected-${STAGE_ID}.json` });
  assert.throws(() => selectReceiptAssets(release, STAGE_ID), /duplicate inspected receipt asset/);
});

test("the committed allowed-signers file names exactly the ratified operators", () => {
  const text = readFileSync(path.join(repoRoot, ".github", "release-allowed-signers"), "utf8");
  assert.deepEqual(allowedSignerPrincipals(text).sort(), ["briand-ai", "mikec-ai"]);
  assert.match(text, new RegExp(`namespaces="${SIGN_NAMESPACE}"`), "keys are scoped to the receipt namespace");
});

// --- real ssh-keygen signature round-trips (throwaway key) ---

function withScratch(fn) {
  const scratch = mkdtempSync(path.join(tmpdir(), "aslite-ordering-test-"));
  try {
    return fn(scratch);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function makeSigner(scratch, principal) {
  const keyPath = path.join(scratch, `${principal}-key`);
  execFileSync("ssh-keygen", ["-t", "ed25519", "-N", "", "-q", "-C", principal, "-f", keyPath]);
  const publicKey = readFileSync(`${keyPath}.pub`, "utf8").trim().split(" ").slice(0, 2).join(" ");
  return { keyPath, allowedLine: `${principal} namespaces="${SIGN_NAMESPACE}" ${publicKey}` };
}

function signReceipt(scratch, keyPath, payload, namespace = SIGN_NAMESPACE) {
  const messagePath = path.join(scratch, `payload-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(messagePath, canonicalPayloadBytes(payload));
  execFileSync("ssh-keygen", ["-Y", "sign", "-f", keyPath, "-n", namespace, messagePath], { stdio: "pipe" });
  return JSON.stringify({ payload, signature: readFileSync(`${messagePath}.sig`, "utf8") });
}

test("ssh signature round-trip: signed receipt verifies; tampering/wrong key/namespace/principal are red", () => {
  withScratch((scratch) => {
    const brian = makeSigner(scratch, "briand-ai");
    const outsider = makeSigner(scratch, "outsider");
    const signersPath = path.join(scratch, "allowed_signers");
    writeFileSync(signersPath, `${brian.allowedLine}\n`);

    const payload = receiptFor("inspected", PRE).payload;
    const good = signReceipt(scratch, brian.keyPath, payload);
    assert.deepEqual(verifySignedReceipt({ text: good, allowedSignersPath: signersPath }), payload);

    // Tampered payload after signing.
    const parsed = JSON.parse(good);
    parsed.payload = { ...parsed.payload, tarball_sha256: OTHER_SHA, observed_sha256: OTHER_SHA };
    assert.throws(
      () => verifySignedReceipt({ text: JSON.stringify(parsed), allowedSignersPath: signersPath }),
      /ssh signature check failed/,
    );

    // Signed by a key outside allowed_signers (even claiming an allowed actor).
    const forged = signReceipt(scratch, outsider.keyPath, payload);
    assert.throws(() => verifySignedReceipt({ text: forged, allowedSignersPath: signersPath }), /ssh signature check failed/);

    // Signed in the wrong namespace.
    const wrongNs = signReceipt(scratch, brian.keyPath, payload, "file");
    assert.throws(() => verifySignedReceipt({ text: wrongNs, allowedSignersPath: signersPath }), /ssh signature check failed/);

    // Payload actor is not the signing principal.
    const otherActor = { ...payload, actor: "mikec-ai" };
    const wrongPrincipal = signReceipt(scratch, brian.keyPath, otherActor);
    assert.throws(() => verifySignedReceipt({ text: wrongPrincipal, allowedSignersPath: signersPath }), /ssh signature check failed/);

    // Not a signature at all.
    assert.throws(
      () => parseReceiptFile(JSON.stringify({ payload, signature: "hello" })),
      /not an SSH signature block/,
    );
  });
});

test("verify subcommand end to end: green chain writes the ordering proof; stamp subcommand materializes assets", async () => {
  await (async () => {
    const scratch = mkdtempSync(path.join(tmpdir(), "aslite-ordering-e2e-"));
    try {
      const brian = makeSigner(scratch, "briand-ai");
      const signersPath = path.join(scratch, "allowed_signers");
      writeFileSync(signersPath, `${brian.allowedLine}\n`);

      const inspected = receiptFor("inspected", PRE).payload;
      const approved = receiptFor("approved", PRE).payload;
      const receiptsDir = path.join(scratch, "receipts");
      mkdirSync(receiptsDir, { recursive: true });
      writeFileSync(path.join(receiptsDir, receiptAssetName("inspected", STAGE_ID)), signReceipt(scratch, brian.keyPath, inspected));
      writeFileSync(path.join(receiptsDir, receiptAssetName("approved", STAGE_ID)), signReceipt(scratch, brian.keyPath, approved));

      const release = {
        id: 300,
        body: "Prepared draft.",
        assets: [
          { id: 1, name: receiptAssetName("inspected", STAGE_ID), uploader: { login: "briand-ai" }, created_at: "2026-08-08T10:01:00Z" },
          { id: 2, name: receiptAssetName("approved", STAGE_ID), uploader: { login: "briand-ai" }, created_at: "2026-08-08T10:31:00Z" },
        ],
      };
      const releasePath = path.join(scratch, "draft-release.json");
      const chainPath = path.join(scratch, "verified-chain.json");
      const stagePath = path.join(scratch, "stage-receipt.json");
      const outPath = path.join(scratch, "ordering-result.json");
      writeFileSync(releasePath, JSON.stringify(release));
      writeFileSync(chainPath, JSON.stringify(chainFor(PRE)));
      writeFileSync(stagePath, JSON.stringify(stageReceiptFor(PRE)));

      await verifyOrderingMain([
        "verify",
        "--mode", "live",
        "--chain", chainPath,
        "--receipt", stagePath,
        "--release", releasePath,
        "--receipts-dir", receiptsDir,
        "--run-created-at", RUN_CREATED_AT,
        "--allowed-signers", signersPath,
        "--out", outPath,
      ]);
      const result = JSON.parse(readFileSync(outPath, "utf8"));
      assert.equal(result.state, "approved_public");
      assert.equal(result.stamp_required, false);

      // A stamped path: strip the inspection receipt and re-verify, then stamp.
      const bare = { ...release, assets: release.assets.slice(1) };
      writeFileSync(releasePath, JSON.stringify(bare));
      await verifyOrderingMain([
        "verify",
        "--mode", "live",
        "--chain", chainPath,
        "--receipt", stagePath,
        "--release", releasePath,
        "--receipts-dir", receiptsDir,
        "--run-created-at", RUN_CREATED_AT,
        "--allowed-signers", signersPath,
        "--out", outPath,
      ]);
      const stampedResult = JSON.parse(readFileSync(outPath, "utf8"));
      assert.deepEqual(stampedResult.missing, ["inspected"]);
      assert.equal(stampedResult.stamp_required, true);

      const stampDir = path.join(scratch, "stamp-out");
      await verifyOrderingMain([
        "stamp",
        "--result", outPath,
        "--release", releasePath,
        "--out-dir", stampDir,
        "--finalize-run-id", "555",
      ]);
      const assetName = readFileSync(path.join(stampDir, "asset-name.txt"), "utf8").trim();
      assert.equal(assetName, stampAssetName(STAGE_ID));
      const stamp = JSON.parse(readFileSync(path.join(stampDir, assetName), "utf8"));
      assert.equal(stamp.note, "published without inspected receipt");
      const body = readFileSync(path.join(stampDir, "body.txt"), "utf8");
      assert.ok(body.startsWith("Prepared draft.\n\n"), "existing release body is preserved");
      assert.match(body, /published without inspected receipt/);

      // No stamp required -> empty asset-name.txt sentinel.
      writeFileSync(outPath, JSON.stringify(result));
      const cleanDir = path.join(scratch, "stamp-clean");
      await verifyOrderingMain(["stamp", "--result", outPath, "--release", releasePath, "--out-dir", cleanDir, "--finalize-run-id", "555"]);
      assert.equal(readFileSync(path.join(cleanDir, "asset-name.txt"), "utf8"), "");
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  })();
});
