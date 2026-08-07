---
type: Context Note
title: PR212 R0 adversarial test design
actor: codex-pr212-test-designer
timestamp: '2026-08-07T14:38:51.177Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: design deterministic red regressions and post-fix QA for PR #212 rollback and isolation blockers, serving the ultimate goal by making unattended workspace creation fail closed without deleting foreign state.

## Result Envelope

Status: COMPLETE — test design only; product code untouched; no sync.

Summary: exact-SHA 81b3c39 has two confirmed destructive/fail-open blockers and a broader strict-observation gap. The deterministic regression set below covers claim/index provenance, safe cleanup, upward and downward observation faults, truthful errors, ordinary-init and Recipe compatibility, and barrier-controlled built/installed parent-child races.

Evidence:
- Exact HEAD is 81b3c39ff252013e318b1a714b63430a24074d70 on feat/init-create-only.
- A direct probe caused current rollback to delete a pre-existing empty target directory.
- A direct probe atomically-equivalent replaced target/index.md bytes before conflict handling; current rollback deleted the replacement.
- A real chmod-000 descendant probe at uid 501 returned success with target and hidden nested bundle both present.
- Injected downward readdir faults EACCES, EIO, EMFILE, ENOENT, and ENOTDIR all returned success with both bundles present.
- Injected EIO from the direct nested-index stat and from the upward enclosing-index stat also returned success. The defect is therefore wider than readdir catch: generic findBundleRoot/exists is not safe inside an isolation proof.
- The linked review comment and context-notes/pr212-exact-review-81b3c39 agree. The specifically requested context-notes/init-target-safety-guard-exact-sha-review-gate was not present in the local bundle snapshot.

Risks:
- Fixing only readdir leaves upward and direct-index stat failures open.
- A post-write read cannot prove ownership of the CAS-created bytes; the exact version must come from the successful expect-absent write.
- Path-only or byte-check-then-unlink cleanup remains racy unless conditional removal is serialized with writers.
- Live races without a barrier can pass without exercising the post-CAS collision and must not be treated as proof.
- OS chmod tests are supplemental because privileged users can bypass mode bits.

Next recommendation: freeze a create-only claim/publication receipt plus an isolation-specific strict filesystem seam; land the red unit matrix first, then implement, then run barrier-controlled built and exact-tarball races before exact-SHA review and adversarial QA.

# Current system and smallest seam

Current sequence is assertCreateOnlyTarget -> claimCreateOnlyTarget(void) -> initBundle(expectNew) -> verifyCreateOnlyIsolation(target) -> Recipe apply. claim returns no created-directory receipt, initBundle discards writeReserved's returned version, verify reuses permissive discovery and then unlinks/rmdirs by pathname.

Smallest deterministic seam:

```ts
interface CreateOnlyIsolationFs {
  lstat(path: string): Promise<Stats>;              // strict, no blanket catch
  readdir(path: string, opts: {withFileTypes:true}): Promise<Dirent[]>;
  removeIndexIfVersion(root: string, expected: Version): Promise<"removed"|"absent"|"changed">;
  rmdir(path: string): Promise<void>;
}
```

Pass Partial<CreateOnlyIsolationFs> only to the create-only claim/isolation/cleanup primitives, defaulting to real Node operations. Do not change ordinary discovery's permissive exists contract. The isolation verifier must use an isolation-specific strict up-walk and down-walk; injecting readdir alone is insufficient because current findBundleRoot/exists and direct child/index.md probes swallow stat errors.

Required provenance passed into verify/cleanup:

```ts
CreateOnlyClaim {
  target: string;
  targetPreexisted: boolean;
  createdDirectories: Array<{path: string; identity: DirectoryIdentity}>;
}
CreatedIndexClaim {
  path: string;
  version: Version; // returned by the exact successful expect-absent CAS, never re-read afterward
}
```

The implementation may choose equivalent names/shapes. The tests should pin behavior, not field spelling. If directory identity cannot be made strong enough portably, uncertainty must leave residue and report it rather than deleting by pathname.

# Absence versus uncertainty matrix

| Phase / observation | Accept as absence or expected contention | Must fail closed |
| --- | --- | --- |
| Preflight nearest-existing-ancestor lstat | ENOENT means a missing path component | ENOTDIR maps to the existing through-file conflict; EACCES, EPERM, EIO, EMFILE/ENFILE, ELOOP are uncertainty |
| Preflight target/index or conventional index probe | ENOENT is absent only after the containing directory was successfully established | Any other code; target/container disappearance or identity change |
| Claim mkdir | EEXIST is expected contention and triggers strict shape/emptiness verification | ENOENT after a parent was established, ENOTDIR, EACCES, EPERM, EIO, resource errors |
| Claim lstat/readdir after EEXIST | No error code is absence; a successful observation must prove real empty directory | ENOENT/ENOTDIR are concurrent disappearance/shape change; every other error is uncertainty |
| Publish index CAS | VersionConflict is an expected loser, but cleanup/message must account for directories created by claim | Other errors are runtime failures; never claim no write/residue without the claim receipt |
| Upward isolation traversal | ENOENT for a candidate index.md is absence only while its containing ancestor is successfully observed as the same directory | Ancestor lstat/readdir error; ENOENT/ENOTDIR for an already-observed directory; symlink/identity transition |
| Downward isolation traversal | ENOENT for child/index.md is absence only after parent readdir and child lstat successfully establish that child directory | readdir error of any code; child ENOENT/ENOTDIR after it was enumerated; direct-index stat errors other than qualified ENOENT; identity/shape transition |
| Cleanup | ENOENT for the exact claimed index means already absent; ENOTEMPTY on a directory means preserve foreign content | Expected-version mismatch means preserve replacement; unlink/rmdir EACCES/EIO/etc means incomplete cleanup; identity mismatch means preserve path |

After traversal begins, ENOENT and ENOTDIR from readdir are not benign absence: they mean a directory enumerated moments earlier disappeared or changed shape.

# Executable deterministic red/green cases

## Unit: provenance and cleanup

1. PREEXISTING_EMPTY_TARGET_SURVIVES
- Arrange base/target as an empty pre-existing directory; capture lstat dev/ino. Claim, publish target/index.md, create base/index.md as enclosing conflict, then verify.
- Assert CliError conflict; target exists with original directory identity; target/index.md is absent only if it still matches the created-index claim; base/index.md bytes exact.
- Current 81b3c39: RED, target is deleted. Fixed: GREEN.

2. CREATED_DIRECTORY_RECEIPT_IS_EXACT
- Arrange pre-existing base/keep, target base/keep/a/b/target absent. Claim only.
- Assert receipt marks keep as foreign/pre-existing and lists exactly a, a/b, and target in creation order with identities.
- Force conflict and cleanup. Assert created empty directories may be removed; keep survives with original identity. Add foreign.txt under a/b before cleanup and assert cleanup stops there and preserves it.
- Current: RED/no receipt and rmdir can remove keep. Fixed: GREEN.

3. CAS_VERSION_PROVENANCE_IS_FROM_WRITE
- Instrument the core expect-absent reserved write to return V1, then replace index.md with V2 before any possible follow-up read.
- Assert CreatedIndexClaim.version is V1. A post-write read yielding V2 must not rewrite the claim.
- Current: RED/no version receipt. Fixed: GREEN.

4. FOREIGN_REPLACEMENT_INDEX_SURVIVES
- Publish claimed index V1. Rename a foreign temp file over target/index.md to V2. Force enclosing conflict.
- Assert V2 bytes and file identity remain exact; conflict is returned; cleanup details say index preserved/changed, never complete rollback.
- Current: RED, V2 is unlinked. Fixed: GREEN.

5. CONDITIONAL_INDEX_DELETE_IS_ATOMIC
- At the conditional-delete primitive, inject/coordinate a competing V2 write at the boundary between version premise and unlink.
- Assert either V1 is removed before V2 writes, or the delete gets VersionConflict/changed and V2 survives; there is no interleaving where V2 reports written and is then unlinked.
- This must exercise the same per-path cross-process lock as reserved writes, or a design that avoids deletion.
- Current raw unlink: RED. Fixed: GREEN.

6. DIRECTORY_IDENTITY_MISMATCH_PRESERVES_REPLACEMENT
- After recording a created target directory, move it aside and install a foreign empty directory at the pathname before directory cleanup.
- Assert foreign directory survives and cleanup reports identity mismatch/residue. Do not demand unsafe cleanup where portable identity is uncertain.
- Current pathname rmdir: RED. Fixed: GREEN.

7. CAS_LOSER_ACCOUNTS_FOR_CLAIM_WRITES
- High-level init with absent deep target and injected initBundle VersionConflict after claim.
- Assert created directory residue is either provenance-cleaned safely or explicitly reported. Message must not say nothing was written by this run when claim created directories.
- Current: RED; test at lines 339-360 checks prose/code only and leaves claim directories unasserted. Fixed: GREEN.

## Unit: strict observation and fail-closed scan

Use the CreateOnlyIsolationFs seam; each row must be deterministic and must assert no Recipe docs were applied.

8. DOWN_READDIR_ERROR_TABLE
- Real target/index plus target/opaque/deep/index.md.
- Inject readdir(target/opaque) error for EACCES, EPERM, EIO, EMFILE, ENFILE, ENOENT, ENOTDIR, ELOOP one row each.
- Assert no success; typed RUNTIME error includes operation, exact path, and original fs code; hidden subtree bytes survive; cleanup status truthful.
- Current: RED for tested EACCES/EIO/EMFILE/ENOENT/ENOTDIR, all returned success. Fixed: GREEN.

9. DOWN_DIRECT_INDEX_STAT_ERROR
- Real target/index and target/child/index.md; inject EIO (and EACCES row) when probing child/index.md.
- Assert fail closed/preserve both foreign nested bytes as applicable, never treat error as no index.
- Current: RED, injected EIO returned success with both bundles. Fixed: GREEN.

10. UP_ENCLOSING_INDEX_STAT_ERROR
- Real base/index.md and base/a/target/index.md; inject EIO/EACCES probing base/index.md.
- Assert no success, typed RUNTIME with path/code, no foreign deletion.
- Current: RED because findBundleRoot uses permissive exists; EIO returned success. Fixed: GREEN.

11. ENUMERATED_CHILD_DISAPPEARS_OR_CHANGES_SHAPE
- Parent readdir returns child as directory. Before child traversal, injected op removes it and throws ENOENT; second row replaces it with a regular file and throws ENOTDIR.
- Assert uncertainty error, replacement file bytes survive, no Recipe application.
- Current: RED because errors become empty subtree. Fixed: GREEN.

12. REAL_UNREADABLE_DESCENDANT_SUPPLEMENT
- Non-root only: chmod target/opaque to 000 with hidden nested index.
- Assert command cannot succeed and both foreign nested bytes survive after restoring permissions.
- Current uid-501 probe: RED/success with both bundles. Fixed: GREEN.
- Skip under uid 0, but injected rows remain mandatory and unskippable.

## Unit: truthful cleanup receipts/messages

13. CLEANUP_OUTCOME_TABLE
Rows: unchanged owned index removed; index already absent; index version changed; conditional unlink throws EACCES/EIO; created directory ENOTEMPTY from foreign content; rmdir EIO; directory identity mismatch.
- Assert structured details identify removed, retained, and uncertain paths.
- A complete-cleanup phrase is allowed only when all claimed artifacts/directories are proven gone and no pre-existing directory was claimed.
- For changed/failed/retained rows assert message does not contain unqualified rolled back, nothing remains, or nothing was written.
- Current: RED; unlink/rmdir errors are swallowed and line 615 always says complete rollback.

## Integration: ordinary init and Recipe regressions

14. CREATE_ONLY_PREEXISTING_EMPTY_SUCCESS_CONTROL
- Pre-existing empty target, no race: create-only succeeds, same directory identity remains, Recipe applied.
- Protects the behavior while failure cleanup is tightened.

15. PLAIN_INIT_OPEN_OR_CREATE_AND_RECIPE
- Plain init --recipe none creates; re-run plain init --recipe work-tracking keeps index.md byte-identical and installs the Recipe; third identical run is idempotent.
- Bad Recipe on plain/create-only creates nothing; corrected retry succeeds.
- Existing-bundle create-only still refuses before bytes change and points to recipe add.
- Fresh create-only still succeeds for default, none, named built-in, and path Recipe forms.
- Existing tests cover most controls; retain them and add the plain-init Recipe transition byte assertion.

16. ISOLATION_ERROR_PRECEDES_RECIPE_APPLICATION
- High-level init with default Recipe and injected post-publish scan EIO.
- Assert no conventions/context-note.md or other Recipe artifact exists; only explicitly reported create-only residue may remain.
- Current scan succeeds and Recipe applies: RED. Fixed: GREEN.

# Deterministic built and packed-install parent/child race

Do not rely on millisecond staggers or require a particular winner. Add a test-only Node --import preload fixture that patches the shared node:fs promises object for subprocesses.

Barrier protocol:
1. Parent and child processes each complete preflight and stop at their first claim mkdir, writing role-ready markers.
2. Release parent target mkdir first; after its claimed-directory marker, release the child's recursive parent mkdir. This ensures both claims can proceed rather than one being rejected during preflight/claim.
3. Intercept the atomic rename that publishes each root index.md. Hold both until parent-publish-ready and child-publish-ready markers exist, then release both.
4. Run the exact same harness against packages/cli/dist/agentstate-lite.mjs and against the installed entrypoint/bin from the retained local-dev tarball proof. Give the barrier a fixed timeout that fails the test as harness failure, never silently falls back to an ungated race.

Assertions for every shape (ordinary parent/ordinary child, ancestor/conventional .agentstate-lite child, both-conventional):
- never two exit-0 receipts;
- never both parent/index.md and child/index.md survive;
- every nonzero stdout parses as structured JSON with correct conflict/runtime exit;
- foreign sentinel files and winner bytes are byte-identical;
- pre-existing empty directories remain;
- any residue is named truthfully;
- at least the barrier proves both publish points were reached, so this is a post-CAS arbitration test rather than a scheduling smoke.

The existing six-round live test may remain as a cheap smoke, but it is not proof because it can pass when preflight rejects one process before the dangerous state.

# Gate separation

Unit/source gate:
- packages/cli/test/init-create-only.test.ts deterministic receipt, strict stat/readdir, cleanup table, and ordinary-init regressions.
- packages/core test for exact expect-absent version receipt and atomic conditional reserved delete if that primitive is added.
- Red-proof each new blocker test against 81b3c39; record failures matching the current behavior.

Built integration gate:
- npm run build from root.
- Run focused CLI suite.
- Run the barrier-controlled built-dist race across all three path shapes.
- Probe JSON stdout/exit taxonomy and Recipe non-application.

Distribution gate:
- Extend scripts/verify-npm-package.mjs after installing the exact retained tarball.
- Keep fresh/refusal/help proof, add pre-existing-empty survival and barrier-controlled installed-entrypoint parent/child race.
- Run both bin aliases only where alias parity matters; do not duplicate the expensive race per alias.

Hosted gate:
- Node 22/26 full npm run check must run all deterministic source and package rows.
- Node 20 built-CLI smoke must add create-only fresh success, safe existing refusal, and one barrier-controlled built race if the preload supports the floor; otherwise add a deterministic sequential safety smoke and explicitly leave post-CAS proof to 22/26.
- Actual chmod probe is supplemental and allowed to skip only under privileged uid. No required gate depends on chmod semantics or scheduler timing.

# Final recommendation

Freeze these acceptance points before implementation:
1. claim receipt distinguishes pre-existing from created directories;
2. created index version comes from the exact successful CAS;
3. conditional index removal is atomic with writers or post-CAS deletion is eliminated;
4. isolation uses strict dedicated observation, including upward stat and downward readdir/stat;
5. cleanup returns structured provenance/outcomes and messages reflect residue;
6. barrier-controlled built and installed races prove both publication points were reached.

No product code or test file was edited by this agent. This note is intentionally unsynced per assignment.
