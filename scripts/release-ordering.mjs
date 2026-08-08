// Pure authority for the operator-receipt ordering gate: receipt payload shape and canonical
// signing bytes, receipt/stamp asset naming, tier policy (prerelease vs stable), and the ordering
// evaluation that replays the release-state machine over signed operator evidence. No I/O — the
// ssh-keygen signature check and GitHub fetches live in scripts/release-verify-ordering.mjs.
//
// Tier policy (ratified on tasks/p5a-pre-live-hardening): for PRERELEASE candidates a missing
// operator receipt is tolerated but the publish is permanently stamped; for STABLE candidates both
// receipts are required. Present-but-invalid evidence is ALWAYS red, in every tier and mode.
import { reconcile, ReleaseStateError } from "./release-state.mjs";

export const RECEIPT_SCHEMA = "aslite.operator-receipt.v1";
export const STAMP_SCHEMA = "aslite.receipt-status.v1";
export const SIGN_NAMESPACE = "aslite-release-receipt";
export const RECEIPT_DECISIONS = ["inspected", "approved"];

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?(?:\+[0-9A-Za-z][0-9A-Za-z.-]*)?$/;
const SHA256 = /^sha256:[a-f0-9]{64}$/;
const TOKEN = /^[A-Za-z0-9._][A-Za-z0-9._-]*$/;
const ACTOR = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/; // GitHub login shape
const AUX_ASSET = /^receipt-(inspected|approved|status)-[A-Za-z0-9._][A-Za-z0-9._-]*\.json$/;
const SSH_SIG = /^-----BEGIN SSH SIGNATURE-----\n[\s\S]+\n-----END SSH SIGNATURE-----\n?$/;

function fail(message) {
  throw new Error(`operator receipt verification failed: ${message}`);
}

function field(name, value, pattern) {
  if (typeof value !== "string" || !pattern.test(value)) fail(`invalid ${name}: ${JSON.stringify(value)}`);
  return value;
}

function isoTime(name, value) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) fail(`invalid ${name}: ${JSON.stringify(value)}`);
  return value;
}

/** prerelease candidates publish to `next`; stable candidates move `latest`. */
export function releaseTier(version) {
  field("version", version, SEMVER);
  return version.includes("-") ? "prerelease" : "stable";
}

export function policyTagFor(version) {
  return releaseTier(version) === "prerelease" ? "next" : "latest";
}

export function receiptAssetName(decision, stageId) {
  if (!RECEIPT_DECISIONS.includes(decision)) fail(`unknown receipt decision ${JSON.stringify(decision)}`);
  return `receipt-${decision}-${field("stage id", stageId, TOKEN)}.json`;
}

export function stampAssetName(stageId) {
  return `receipt-status-${field("stage id", stageId, TOKEN)}.json`;
}

/** Release assets this gate owns; verify-finalizer tolerates ONLY these beyond the core two. */
export function isAuxiliaryReleaseAssetName(name) {
  return typeof name === "string" && AUX_ASSET.test(name);
}

/**
 * Validate + normalize a receipt payload into fixed key order. The returned object's JSON
 * serialization is the canonical byte stream that gets signed and verified.
 */
export function canonicalReceiptPayload(fields) {
  const decision = fields?.decision;
  if (!RECEIPT_DECISIONS.includes(decision)) fail(`unknown receipt decision ${JSON.stringify(decision)}`);
  const payload = {
    schema: RECEIPT_SCHEMA,
    decision,
    stage_id: field("stage_id", fields.stage_id, TOKEN),
    version: field("version", fields.version, SEMVER),
    tarball_sha256: field("tarball_sha256", fields.tarball_sha256, SHA256),
    draft_release_id: field("draft_release_id", fields.draft_release_id, TOKEN),
    actor: field("actor", fields.actor, ACTOR),
    emitted_at: isoTime("emitted_at", fields.emitted_at),
  };
  if (fields.schema !== undefined && fields.schema !== RECEIPT_SCHEMA) {
    fail(`unknown receipt schema ${JSON.stringify(fields.schema)}`);
  }
  if (decision === "inspected") {
    payload.observed_sha256 = field("observed_sha256", fields.observed_sha256, SHA256);
  } else if (fields.observed_sha256 !== undefined) {
    fail("approved receipt must not carry observed_sha256");
  }
  return payload;
}

/** The exact bytes signed with `ssh-keygen -Y sign -n aslite-release-receipt`. */
export function canonicalPayloadBytes(payload) {
  return `${JSON.stringify(canonicalReceiptPayload(payload), null, 2)}\n`;
}

/** Parse a receipt file's text into { payload, signature }, validating both shapes. */
export function parseReceiptFile(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    fail(`receipt file is not valid JSON: ${error.message}`);
  }
  const payload = canonicalReceiptPayload(parsed?.payload ?? {});
  const signature = parsed?.signature;
  if (typeof signature !== "string" || !SSH_SIG.test(signature)) fail("receipt signature is not an SSH signature block");
  return { payload, signature };
}

function bindReceipt(kind, payload, chain) {
  if (payload.decision !== kind) fail(`${kind} receipt carries decision ${payload.decision}`);
  for (const key of ["stage_id", "version", "tarball_sha256", "draft_release_id"]) {
    if (payload[key] !== chain[key]) {
      fail(`${kind} receipt ${key} ${JSON.stringify(payload[key])} does not name this candidate (${JSON.stringify(chain[key])})`);
    }
  }
}

function orderedBefore(name, earlier, later, message) {
  const a = Date.parse(earlier);
  const b = Date.parse(later);
  if (Number.isNaN(a) || Number.isNaN(b)) fail(`invalid timestamp on ${name}`);
  if (a > b) fail(message);
}

function stageReceiptEvents(stageReceipt) {
  if (stageReceipt?.schema !== "aslite.stage-receipt.v2" || stageReceipt?.state !== "staged") {
    fail("stage receipt schema/state is not staged v2");
  }
  const prepared = stageReceipt.prepared ?? {};
  const draft = stageReceipt.draft ?? {};
  const stage = stageReceipt.stage ?? {};
  const tarballAsset = (draft.assets ?? []).find((asset) => asset?.name === prepared.tarball?.filename);
  return [
    {
      to: "prepared",
      receipt: {
        version: prepared.version,
        tag: prepared.tag,
        source_commit: prepared.source_commit,
        run_id: prepared.run_id,
        artifact_id: prepared.artifact?.id,
        artifact_digest: prepared.artifact?.digest,
        tarball_sha256: prepared.tarball?.sha256,
        integrity: prepared.tarball?.integrity,
      },
    },
    {
      to: "draft_prepared",
      receipt: {
        draft_release_id: draft.release_id,
        asset_ids: (draft.assets ?? []).map((asset) => asset?.id),
        asset_digest: tarballAsset?.digest,
      },
    },
    { to: "staged", receipt: { stage_id: stage.id, stage_tag: stage.tag } },
  ];
}

/**
 * The finalize ordering gate. `chain` is verify-finalizer's proof (already cross-checked against
 * dispatch inputs, candidate bytes, and artifact metadata); `stageReceipt` is the retained
 * stage-receipt.json; `inspected`/`approved` are `{ payload, uploaderLogin, uploadedAt } | null`
 * with signatures ALREADY verified by the adapter; `runCreatedAt` is THIS finalize run's
 * GitHub-attested creation time. Throws on any present-but-invalid evidence (every tier, every
 * mode). Missing evidence: tolerated in dry-run (reported); tolerated live only for prerelease
 * candidates, and then only with a stamp; red for stable.
 */
export function evaluateOrdering({ mode, chain, stageReceipt, inspected, approved, runCreatedAt, allowedActors }) {
  if (mode !== "dry-run" && mode !== "live") fail(`unknown mode ${JSON.stringify(mode)}`);
  if (!Array.isArray(allowedActors) || allowedActors.length === 0) fail("allowed-signers principal list is empty");
  const tier = releaseTier(chain.version);
  isoTime("finalize run created_at", runCreatedAt);

  for (const [kind, receipt] of [["inspected", inspected], ["approved", approved]]) {
    if (!receipt) continue;
    bindReceipt(kind, receipt.payload, chain);
    if (!allowedActors.includes(receipt.payload.actor)) {
      fail(`${kind} receipt actor ${receipt.payload.actor} is not an allowed operator`);
    }
    if (receipt.uploaderLogin !== receipt.payload.actor) {
      fail(`${kind} receipt uploaded by ${JSON.stringify(receipt.uploaderLogin)} but signed as ${receipt.payload.actor}`);
    }
    orderedBefore(
      `${kind} receipt`,
      receipt.uploadedAt,
      runCreatedAt,
      `${kind} receipt was uploaded after this finalize run was dispatched — re-dispatch to consume it`,
    );
  }
  if (inspected && approved) {
    orderedBefore(
      "receipt pair",
      inspected.uploadedAt,
      approved.uploadedAt,
      "approval receipt precedes the inspection receipt — inspection must come first",
    );
    if (inspected.payload.actor !== approved.payload.actor) {
      fail("inspection and approval receipts name different operators — the approver must attest their own inspection");
    }
  }

  const missing = [
    ...(inspected ? [] : ["inspected"]),
    ...(approved ? [] : ["approved"]),
  ];
  if (missing.length > 0 && mode === "live" && tier === "stable") {
    fail(`stable candidate is missing required operator receipts: ${missing.join(", ")}`);
  }

  // Replay the state machine over the evidence that exists. The ledger can only legally reach
  // approved_public THROUGH inspected, so an approved-only prerelease stops at `staged` and the
  // approval evidence stands on its own signature + the registry publication proof.
  let ledger = { state: null, identifiers: {} };
  const events = stageReceiptEvents(stageReceipt);
  if (inspected) {
    events.push({
      to: "inspected",
      receipt: {
        actor: inspected.payload.actor,
        inspected_at: inspected.payload.emitted_at,
        observed_sha256: inspected.payload.observed_sha256,
        stage_id: inspected.payload.stage_id,
        version: inspected.payload.version,
        tarball_sha256: inspected.payload.tarball_sha256,
      },
    });
    if (approved) {
      events.push({
        to: "approved_public",
        receipt: {
          actor: approved.payload.actor,
          approved_at: approved.payload.emitted_at,
          public_version: approved.payload.version,
          public_tag: policyTagFor(approved.payload.version),
          stage_id: approved.payload.stage_id,
          tarball_sha256: approved.payload.tarball_sha256,
        },
      });
    }
  }
  for (const event of events) {
    ledger = reconcile(ledger, event).ledger;
  }

  return {
    schema: "aslite.ordering-proof.v1",
    mode,
    tier,
    state: ledger.state,
    stage_id: chain.stage_id,
    version: chain.version,
    tarball_sha256: chain.tarball_sha256,
    draft_release_id: chain.draft_release_id,
    verified: RECEIPT_DECISIONS.filter((kind) => !missing.includes(kind)),
    missing,
    actor: inspected?.payload.actor ?? approved?.payload.actor ?? null,
    stamp_required: missing.length > 0 && mode === "live",
  };
}

/** The permanent, workflow-emitted public record that a candidate published without full receipts. */
export function buildReceiptStatusStamp({ result, finalizeRunId, emittedAt }) {
  if (!result?.stamp_required) fail("stamp requested but the ordering result does not require one");
  return {
    schema: STAMP_SCHEMA,
    stage_id: result.stage_id,
    version: result.version,
    tarball_sha256: result.tarball_sha256,
    draft_release_id: result.draft_release_id,
    tier: result.tier,
    missing: result.missing,
    note: `published without ${result.missing.map((kind) => `${kind} receipt`).join(" or ")}`,
    emitted_by: "release-finalize workflow",
    finalize_run_id: field("finalize run id", finalizeRunId, TOKEN),
    emitted_at: isoTime("emitted_at", emittedAt),
  };
}

/** The human-visible release-body annotation matching the stamp asset. */
export function stampAnnotation(stamp) {
  return `> **Receipt status:** ${stamp.note} (${stamp.tier} tier; stamped by the finalize workflow, run ${stamp.finalize_run_id}). Machine-readable record: \`${stampAssetName(stamp.stage_id)}\`.`;
}

/** Operator commands rendered into the stage summary for signed receipt emission. */
export function receiptEmissionCommands({ stageId, version, draftReleaseId }) {
  field("stage id", stageId, TOKEN);
  field("version", version, SEMVER);
  field("draft release id", draftReleaseId, TOKEN);
  const base = `node scripts/release-inspect.mjs --stage-id ${stageId} --version ${version} --draft-release-id ${draftReleaseId} --key ~/.ssh/id_ed25519`;
  return {
    inspected: base,
    approved: `${base} --decision approved`,
  };
}
