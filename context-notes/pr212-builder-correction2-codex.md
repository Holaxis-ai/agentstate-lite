---
type: Context Note
title: PR 212 Builder correction cycle 2
actor: codex-pr212-builder
timestamp: '2026-08-07T15:57:33.640Z'
---
# Summary

PR #212 Builder correction cycle 2 is in progress from rejected SHA `ab2d97fff7fe391e7b46cf3509eef6631008288e` in `/private/tmp/aslite-pr212-build`.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: close the final three bounded rereview gaps—post-realpath binding-target presence, masked publish-fault provenance, and barrier-attributable installed production-mutex evidence—without changing survived create-only behavior. This serves the ultimate goal by making the new-bundle boundary both fail-closed and independently demonstrable in the shipped artifact.

Current system model: create-only performs strict preflight, acquires the conservative physical-root filesystem mutex, revalidates, creates missing components, revalidates again, and invokes expect-absent publication. Binding discovery shares one parser, but bound-target bundle inspection uses an absence-tolerant first lstat and then incorrectly reuses the same tolerance after a successful realpath. The coordinator preserves the primary release failure and the masked callback's code/phase/operation, but does not copy the callback path/fs code/residue into prefixed prior fields. Source tests deterministically hold the real mutex; the installed verifier only starts two CLI processes concurrently and observes their terminal results.

Unverified assumptions to close before implementation: post-realpath target identity is required for both symlink and non-symlink candidates; the double-fault envelope can preserve prior structured fields without changing primary lock details; and a portable Node preload can expose an installed process reaching the real lock boundary without adding a product test hook or relying on unsupported loader behavior.

Red checkpoint at exact rejected SHA `ab2d97f`: the focused direct and symlink binding-target subtests both failed with `Missing expected rejection`, proving publication continued after successful realpath followed by injected physical-target `ENOENT`. The strengthened release-over-publish test failed because `prior_path` was undefined (and therefore did not reach the subsequent `prior_fs_code`/prior-residue assertions). The installed-proof structural regression failed because the verifier had no `--import` preload, holder-acquired marker, contender-contention marker, or held-lock no-publication assertion. No product source changed before this behavioral red run.

Chosen installed mechanism: generate a scratch ESM preload and launch the installed entry with Node's `--import` flag. The preload patches only `fs.promises.mkdir` for the real production `.lock` claim. The designated holder performs the actual atomic mkdir and pauses before returning; the contender reaches the identical lock path and observes real `EEXIST`; the parent verifier sees both markers and confirms neither index exists before releasing the holder. This is an external observation harness, not a product hook, and uses the common ESM preload mechanism across maintained Node 20/22/26.

Implemented:

- Bound-target inspection retains the initial optional candidate observation, rejects irrelevant non-directory/non-symlink candidates as before, then performs a required physical `lstat` after every successful realpath for both direct and symlink targets. ENOENT/ENOTDIR/other I/O errors are RUNTIME uncertainty, and resolved shape loss is ESHAPE uncertainty before publication.
- Release-over-publish envelopes retain the release fault as primary while copying `prior_path`, `prior_fs_code`, `prior_publication_outcome`, and an independent `prior_residual_created_directories` array alongside prior code/phase/operation.
- Installed proof launches the packed entry through Node `--import` with a scratch ESM preload. The holder performs the actual production lock-directory mkdir and pauses before returning. The contender reaches the same path, receives real EEXIST, and records it. The verifier confirms both lock paths are identical, neither index exists while the claim is held, releases the holder, then requires the holder to win, the child to exit conflict 5, and no nested bundle pair.

Green evidence: focused create-only 44/44; full CLI 1324/1324; script suites 128/128; `npm run verify:npm-package` passed the actual packed/install barrier proof; root build, CLI typecheck, skill generation check, verifier syntax check, and `git diff --check` passed. Core was not changed in this bounded correction; its accepted 399/399 evidence remains on the preceding exact correction.

Scope review: only `packages/cli/src/bundle.ts`, its focused create-only test, `scripts/verify-npm-package.mjs`, and its verifier test are modified. No generated plugin/manifest changes, no deletion/quarantine behavior, no push.

Proximate goal status: complete. Follow-up commit `61ff794a6e1515f662c2005d800c814058da0139` (`fix(cli): close final create-only review gaps`) follows `ab2d97f` without amending either prior correction. The branch is clean and unpushed. Next action belongs to exact Review and then QA at this exact SHA; under the frozen cap, any further substantive finding requires architecture reorientation rather than another narrow patch cycle.
