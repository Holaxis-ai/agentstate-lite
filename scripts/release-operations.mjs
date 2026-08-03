// Pure emitter of the EXACT operator command strings for each staged-release operation. No I/O; a
// single authority so the workflow, the interactive instructions block, and the tests never drift
// from one another. Normative source: version-update-protocols.md §5 (states/owners + transient
// tag/failure rules). Every command is quoted for a POSIX shell; identifiers are the immutable IDs
// fixed earlier in the transaction.

const PKG = "@holaxis/aslite";

function req(name, value) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`release operation requires ${name}`);
  }
  return value;
}

/** `npm stage download <id>` + local SHA-256 compare — the mandatory pre-approval inspection. */
export function inspectionInstructions({ stageId, tarballSha256, filename }) {
  req("stageId", stageId);
  req("tarballSha256", tarballSha256);
  const bare = String(tarballSha256).replace(/^sha256:/, "");
  const out = filename ? `./${filename}` : "./candidate.tgz";
  return {
    title: "Inspect the staged tarball BEFORE approval",
    steps: [
      `npm stage download ${stageId} --out ${out}`,
      // Compute the SHA-256 of what npm actually staged and compare to the retained receipt.
      `shasum -a 256 ${out}`,
      `test "$(shasum -a 256 ${out} | awk '{print $1}')" = "${bare}" && echo MATCH || echo MISMATCH`,
    ],
    expected_sha256: `sha256:${bare}`,
    on_mismatch: "reject the stage; a mismatch means the staged bytes are not the retained candidate",
  };
}

/** `npm stage reject <id>` (+2FA). A rejected stage is spent; the next SemVer is prepared. */
export function rejectOperation({ stageId }) {
  return { command: `npm stage reject ${req("stageId", stageId)}`, requires_2fa: true };
}

/** `npm stage approve <id>` (+2FA) — only after a matching inspection. */
export function approveOperation({ stageId }) {
  return { command: `npm stage approve ${req("stageId", stageId)}`, requires_2fa: true };
}

/** Move a secondary dist-tag (e.g. float `next` to a prerelease candidate). */
export function secondaryTagOperation({ version, tag }) {
  return { command: `npm dist-tag add ${PKG}@${req("version", version)} ${req("tag", tag)}` };
}

/** Remove a stale secondary tag (e.g. drop `next` once stable makes it redundant). */
export function removeSecondaryTagOperation({ tag }) {
  return { command: `npm dist-tag rm ${PKG} ${req("tag", tag)}` };
}

/**
 * Post-approval failure recovery (§5): immediately restore the failed track to the prior
 * known-good version and deprecate the failed public version WITH the recovery command as the
 * deprecation message. `latest` is left untouched on a prerelease failure.
 */
export function rollbackOperation({ failedVersion, priorVersion, track = "next" }) {
  req("failedVersion", failedVersion);
  req("priorVersion", priorVersion);
  const recovery = `npm install --global ${PKG}@${priorVersion}`;
  return {
    commands: [
      `npm dist-tag add ${PKG}@${priorVersion} ${track}`,
      `npm deprecate ${PKG}@${failedVersion} "superseded — install ${PKG}@${priorVersion} (${recovery})"`,
    ],
    recovery_command: recovery,
  };
}

/**
 * Registry-side verification of an approved public version (§5 registry_verified): packument
 * integrity/signature/provenance plus a clean offline-then-online install/bins/identity smoke. All
 * read-only.
 */
export function registryVerifyOperations({ version }) {
  req("version", version);
  const coord = `${PKG}@${version}`;
  return {
    commands: [
      `npm view ${coord} dist.integrity dist.shasum --json`,
      `npm audit signatures --package ${coord}`,
      `npm view ${coord} --json`,
      `npm install --global ${coord}`,
      "aslite --version",
      "aslite version --json",
      "aslite version --check --json",
      "aslite mcp --help",
    ],
  };
}

/** Interactive dist-tag promotion after registry proof (§5 promoted). */
export function promoteOperation({ version, tag = "latest" }) {
  return { command: `npm dist-tag add ${PKG}@${req("version", version)} ${tag}` };
}

/**
 * Immutable-release finalization (§5 final): publish the PREPARED GitHub draft (never create a new
 * one) after re-verifying its release/asset IDs and digests. The finalizer downloads and verifies
 * rather than rebuilding.
 */
export function immutableReleaseOperations({ releaseId, tag }) {
  req("releaseId", releaseId);
  req("tag", tag);
  return {
    commands: [
      // Re-verify the prepared draft's identity before publishing it.
      `gh api repos/{owner}/{repo}/releases/${releaseId} --jq '.draft, .tag_name, .id'`,
      `gh api -X PATCH repos/{owner}/{repo}/releases/${releaseId} -f draft=false -f make_latest=true`,
    ],
    tag,
  };
}
