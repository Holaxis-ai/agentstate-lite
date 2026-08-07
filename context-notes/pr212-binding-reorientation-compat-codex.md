---
type: Context Note
title: PR 212 binding target compatibility reorientation
actor: codex-pr212-binding-compat
timestamp: '2026-08-07T16:14:09.965Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: derive the narrowest authoritative binding-target behavior matrix that fixes PR 212's confirmed direct-file versus symlink-file P2 without expanding the binding language. This serves the ultimate goal by preserving predictable unattended create-only onboarding while keeping existing project bindings compatible.

Compatibility verdict: the exact SHA `61ff794a6e1515f662c2005d800c814058da0139` remains **CHANGES_REQUESTED**, but the reoriented acceptance contract is ready for a narrowly scoped builder. Stable non-directory targets must be treated identically through direct and symlink spellings as “not an existing bundle”; create-only may continue. Dangling, unobservable, or demonstrably transitioning targets remain `RUNTIME`. Existing bundle targets remain `ALREADY_EXISTS`; malformed/URL binding syntax remains shared-parser `USAGE`.

## Sources and system model

- Parent compatibility baseline: exact built CLI `81b3c39ff252013e318b1a714b63430a24074d70` in `/private/tmp/aslite-pr212-old-review`.
- Reviewed head: exact built CLI `61ff794a6e1515f662c2005d800c814058da0139` in `/private/tmp/aslite-pr212-final-review`.
- Primary-bundle task, frozen plan, all PR 212 exact Review/correction notes, and `context-notes/pr212-binding-observer-reorientation-2026-08-07`.
- Shared authorities: `parseProjectBinding`/`resolveProjectBinding`, `resolveLocalBundleTarget`, `README.md`, generated help/skill text, `bundle.test.ts`, and `init-create-only.test.ts`.

The shared parser validates JSON, the non-empty path spelling, URI intent, and binding-file-relative resolution. It does not require the target to exist or validate its filesystem shape. README and `ProjectBinding` describe the intended value as an out-of-tree directory, while ordinary `openBundle` separately requires an `index.md` and returns `NOT_FOUND` for a non-bundle target. Create-only therefore is not the binding validator. Its narrower question is whether the reached binding already names a bundle that would shadow the requested new workspace.

The parent answered that question with permissive `exists(<target>/index.md)` and `exists(<target>/.agentstate-lite/index.md)`, where `exists` catches every filesystem error as false. That establishes useful stable-shape compatibility, but its dangling and unreadable-directory allows are fail-open observation artifacts rather than trustworthy compatibility guarantees.

## Empirical exact-SHA matrix

All rows used an otherwise fresh project whose `.agentstate.json` pointed at the stated target, then ran the exact built CLI with `init --create-only --dir <project>/new-bundle --recipe none --json`. “Symlink” means the binding value names an alias to the same physical object.

| Binding target | 81b direct | 81b symlink | 61ff direct | 61ff symlink | Authoritative create-only result |
|---|---|---|---|---|---|
| Initially absent pathname | ALLOW | n/a; a present alias with an absent referent is dangling below | ALLOW | n/a | ALLOW |
| Stable empty readable directory | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| Stable bundle directory (`index.md`) | ALREADY_EXISTS | ALREADY_EXISTS | ALREADY_EXISTS | ALREADY_EXISTS | ALREADY_EXISTS |
| Stable readable regular file | ALLOW | ALLOW | ALLOW | RUNTIME/ESHAPE | ALLOW for both spellings as a tolerated non-bundle |
| Dangling symlink (one link or a link chain) | ALLOW | ALLOW | RUNTIME/ENOENT at `realpath-binding-target` | RUNTIME/ENOENT | RUNTIME |
| Mode-000 directory whose children cannot be inspected | ALLOW | ALLOW | RUNTIME/EACCES at `lstat-own-index` | RUNTIME/EACCES | RUNTIME |
| Mode-000 regular file whose metadata remains observable | ALLOW | ALLOW | ALLOW | RUNTIME/ESHAPE | ALLOW for both spellings as a stable non-bundle |

The parent bundle-directory alias error names the logical alias; 61ff names the physical target. The conflict class is unchanged and the physical name is appropriate for strict diagnostics.

The parent’s dangling and unreadable-directory ALLOW rows are not safe compatibility to preserve: the parent’s catch-all `exists` cannot distinguish absence from EACCES/I/O/shape uncertainty. In contrast, the stable regular-file rows require compatibility because both parent spellings and 61ff's direct spelling agree, no syscall failed, and no transition was observed. Treating the symlink spelling differently is the confirmed P2.

Focused source checks on 61ff passed 5/5 for shared binding syntax, symlinked binding-file/empty-directory parity, and post-realpath disappearance; ordinary discovery checks passed 2/2 for a valid bound bundle and a bound non-bundle returning `NOT_FOUND`.

## Authoritative classification

### Intentional compatibility

1. Initial `lstat` ENOENT for the logical binding target means no existing bound bundle: ALLOW.
2. A stable readable directory with neither its own nor conventional `index.md` is not a bundle: ALLOW.
3. A stable direct or symlink-followed non-directory object is not a bundle: ALLOW. This is compatibility tolerance for the create-only shadow check, not a declaration that regular-file bindings are valid for ordinary commands. A later bare command still returns `NOT_FOUND`.
4. A verified own or conventional bundle through either spelling shadows the new target: `ALREADY_EXISTS`.
5. Malformed JSON, missing/empty/non-string `bundle`, and URL/unsupported-URI intent remain the one shared parser's `USAGE` errors.

### Invalid-binding or observation uncertainty

1. A dangling link is not initial absence. `lstat` established a path entry, then followed-target observation failed: `RUNTIME`.
2. Failure to observe the target, resolve it, inspect a directory's own/conventional index, or traverse the containing path is `RUNTIME` with phase/operation/path/fs code.
3. A later ENOENT/ENOTDIR after presence, a changed followed-target kind, or a changed observed identity is `RUNTIME`.
4. File read permission is irrelevant once metadata proves a stable non-directory; directory search/read permission is relevant because the shadow check must inspect its bundle markers.
5. An unreadable binding file is strict observation `RUNTIME` before parsing under the frozen validation contract; content that was successfully read but is invalid is parser `USAGE`. Ordinary discovery historically wraps binding-file read failure as `USAGE`; that phase-specific difference should not be mistaken for a second parser.

## Narrow observation state machine

The smallest model that satisfies both stable-shape parity and transition failure is one followed-target receipt inside `existingBundleAt`; no parser, discovery precedence, help, or binding-language change is required.

1. `lstat(logical target)`. Only ENOENT here is initial absence and returns no bundle. Other failures are `RUNTIME`.
2. Because a path entry was observed, take one followed snapshot with `stat(logical target)`. This gives the referent kind/identity for direct and symlink spellings alike. ENOENT/ENOTDIR/ELOOP/EACCES/I/O here is `RUNTIME`; it includes dangling links.
3. `realpath(logical target)`, then required `lstat(physical target)`. Any failure is `RUNTIME`.
4. Compare the followed snapshot with the physical snapshot. An observed kind change is `RUNTIME/ESHAPE`; an observed identity change should reuse the repository's existing `dev`/`ino` comparison semantics and be `RUNTIME`. This comparison only reports transitions the process actually observed; it does not claim to exclude arbitrary mutation after the final observation.
5. If both snapshots are the same stable non-directory kind, return no bundle (ALLOW create-only).
6. If both are the same stable directory, strictly inspect own and conventional bundle markers. Found bundle -> `ALREADY_EXISTS`; verified absence -> ALLOW; any observation failure -> `RUNTIME`.

This adds one followed `stat` observation/receipt and table-driven tests in the existing binding-target observer. A one-line `return null` for the 61ff physical non-directory result would fix the static P2 but would leave file-to-directory/directory-to-file transitions unobservable or inconsistently classified, so it is too narrow mechanically even though its static outcome is correct.

## Invariant reconciliation

There is no inherent contradiction between reorientation invariant 2 (stable non-directory parity) and invariant 5 (observed shape/identity changes are uncertainty). They only look contradictory in 61ff because its two observations are of different entities: `lstat` sees the logical symlink kind, while the later `lstat` sees the referent kind. A followed-target snapshot makes both observations refer to the same entity.

Two boundary clarifications are required:

- “Initial absence” cannot include dangling links: the logical link was present before referent ENOENT.
- ALLOW for a stable file means only “no existing bound bundle shadows this create-only target.” It must not be documented as a new valid regular-file binding form. Prohibiting regular-file binding values would be a separate product decision because it would intentionally break parent behavior and 61ff's direct-file behavior.

The module-level ordinary-discovery prose says an unreadable binding file is `USAGE`, while the frozen create-only strict-observation matrix requires binding I/O uncertainty to be `RUNTIME`. This is a documentation/classification seam, not a parser fork. It should be clarified separately if user-facing docs are touched, but it does not justify widening this binding-target correction.

## Recommendation

Approve this compatibility matrix and state machine as the reorientation gate. Authorize one binding-observer/test-only correction at 61ff's successor; require red tests for stable direct/symlink file parity (including mode-000 file metadata), dangling direct/link-chain runtime, unreadable directory parity, and direct/symlink file-to-directory plus directory-to-file transitions. Retain existing disappearance tests and shared-parser tests. Then restart exact-SHA Review before QA.

Do not approve or send `61ff794` to QA as-is. Do not revise parser syntax, README binding language, discovery precedence, ordinary `openBundle`, or error help in this correction.
