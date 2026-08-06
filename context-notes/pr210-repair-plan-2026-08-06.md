---
type: Context Note
title: PR 210 bounded repair plan
actor: codex-pr210-plan
timestamp: '2026-08-06T18:57:27.363Z'
---
# Summary

Implementation-ready repair plan for PR #210 at exact failing head `4e394db65346d957676e590d7ca287d20b39dafb`. It closes only the two delivered blockers: noncanonical managed path tokens falsely granting mutation authority, and the installed `local-dev` tarball composing a cross-prefix Node/package pair that the corrected recognizer must reject.

## Goal linkage

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: make every supported hook writer output belong to the closed recognizer language while every non-writer path spelling stays foreign, then restore installed-tarball and repository gates. This serves the ultimate goal by keeping destructive ownership fail-closed without reopening the generic npm fallback.

## Baseline at 4e394db

- `stableNpmRuntimePair` compares raw same-prefix slices after suffix checks but does not require tokens to be the canonical spellings the writer emits.
- `managedExecutableLayout` normalizes before matching, so a noncanonical direct npm executable is also owned as historical/path-bound.
- Read-only probes classify matching npm runtime/package pairs containing `./`, duplicate `/`, or `a/../b` as `current`; a noncanonical direct scoped npm entry classifies `legacy_path_bound`.
- After a root `npm run build`, `npm run verify:npm-package` fails at installed `aslite hook install`. The tarball is honestly `local-dev`; authority returns host `process.execPath` plus the scratch-prefix npm entry, creating a correctly rejected cross-prefix pair.
- The verifier already creates `<scratch-prefix>/bin/node` as a symlink to the running Node executable. Authority ignores it for `local-dev` because it returns before npm-layout proof.

## Smallest owning-code repair

### Canonical path prerequisite

In `packages/cli/src/hook-compatibility.ts`, add one internal pure predicate equivalent to:

```ts
isAbsolute(value) && normalize(value) === value
```

Require it before either `stableNpmRuntimePair` or `managedExecutableLayout` grants a layout. Then retain current suffix and raw-prefix checks. Never normalize a foreign token and classify the normalized result; canonicality is a prerequisite, not a repair.

This closes the reviewed three-token pair and the adjacent two-token direct entry that otherwise retains uninstall authority. Apply it consistently to npm, local-dev, and marketplace managed layouts because all writers emit resolved, normalized absolute paths.

Use native `node:path` semantics (`isAbsolute`, `normalize`, `sep`), not slash-only regexes or `path.posix`. Do not use filesystem `realpath` in recognition: a lexically canonical symlink path such as `<prefix>/bin/node` is valid, while physical provenance is proved earlier by authority.

Do not alter these boundaries:

- npm remains current only when runtime and scoped package entry share one raw prefix;
- failed npm pairing never falls through to generic absolute-Node recognition;
- that generic branch remains limited to explicit repository local-dev and marketplace layouts;
- shell grammar, token envelopes, and enumerated history stay unchanged.

### Installed local-dev npm authority

In `packages/cli/src/install-authority.ts`, reuse/factor the existing durable npm-layout proof for `npm-package` and for `local-dev` whose resolved executable is in the scoped npm package layout (`.../node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`). On success:

- npm-package remains `state: durable_global`;
- installed npm-layout local-dev remains `state: local_dev` and BuildIdentity remains `local-dev`;
- both return proven npm prefix, selected prefix bin alias, executable realpath, and stable runtime token `<prefix>/bin/node` whose realpath equals the running Node executable.

Preserve existing raw runtime/executable authority for repository-layout local-dev (`.../packages/cli/dist/agentstate-lite.mjs`) and preserve marketplace behavior. Gate the npm proof on the executable layout so ordinary repo-local developer runs do not gain an `npm prefix --global` probe.

If an npm-shaped local-dev install cannot prove the same facts as durable npm (supported POSIX platform, non-npx environment, first PATH alias, package entry, and prefix Node resolving to the running runtime), fail closed rather than returning arbitrary cross-prefix evidence.

No `buildHookLaunchSpec` change should be needed: corrected evidence makes its existing writer compose the recognized same-prefix pair. Do not add a direct-executable escape hatch, channel marker, new hook argument, or generic npm fallback.

### Installed-package assertion

In `scripts/verify-npm-package.mjs`, keep local verification stamped `local-dev` and keep dirty-tree support. For POSIX, expect `<prefix>/bin/node <installed-entrypoint-realpath> session-start` for both local-dev and npm-package. Remove only the local-dev special case expecting host `process.execPath`; the harness already creates the stable launcher.

Do not weaken release construction, relabel local-dev as npm-package, skip hook lifecycle, or remove stable-runtime proof.

## Red-first test matrix

Add tests before source changes and capture their expected failures on `4e394db`.

1. `hook-shell-fixtures.ts`: structured rows (`family`, `program`, `args`, `command`) for `./`, `a/../b`, and duplicate native separators in matching npm pairs. Include noncanonical direct npm entries plus repository local-dev and marketplace direct variants so the shared primitive cannot normalize-before-owning elsewhere.
2. `hook-compatibility.test.ts`: lexical tokenization succeeds for every row, but classification is `unmanaged`. Canonical npm, repo local-dev, marketplace, quoted-literal, and history fixtures remain positive controls.
3. `hook-reconciliation.test.ts`: exact-shape noncanonical entries report unmanaged; uninstall returns the original object with `changed:false`; install with one already-current owned entry never replaces or deduplicates foreign rows.
4. `install-authority.test.ts`: a proven npm-layout local-dev fixture returns state local_dev plus prefix runtime evidence; the same npm-shaped fixture with missing/mismatched stable runtime refuses; repository-layout local-dev remains allowed; npm-package and marketplace controls remain unchanged.
5. `session-start.test.ts` using freshly built dist:
   - Claude/Codex foreign-only settings: status unmanaged, uninstall `changed:false`, bytes identical.
   - Install fixture: foreign rows plus one exact current row and already-enabled Codex TOML; install must not replace/deduplicate/reformat the foreign rows.
   - OpenCode: loop isolated bases because one plugin holds one row. Exact generated source for each noncanonical program/args is unmanaged; status/uninstall preserve bytes; install refuses overwrite and preserves bytes.
   - Keep the existing mismatched-prefix all-host lifecycle test green as the no-fallback regression.
6. The complete local `verify:npm-package` journey is blocker 2's red/green proof and must assert the emitted prefix runtime.

Focused RED command after tests, before source:

```sh
AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/hook-compatibility.test.ts ./packages/cli/test/hook-reconciliation.test.ts ./packages/cli/test/install-authority.test.ts
```

Build from repository root before every built or package probe:

```sh
npm run build
AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-name-pattern='noncanonical.*path|mismatched npm' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/session-start.test.ts
npm run verify:npm-package
```

On test-only `4e394db`, the first command must fail new classifier/authority assertions, the built command must expose ownership/mutation of new rows, and verify must fail at installed hook install. A new test green before implementation does not prove the blocker.

## Green gates

After implementing only the owning changes, rerun the same focused commands character-for-character and require exit 0. Then run:

```sh
npm run build
AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/hook-compatibility.test.ts ./packages/cli/test/hook-reconciliation.test.ts ./packages/cli/test/install-authority.test.ts
AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-name-pattern='writer/recognizer|noncanonical.*path|mismatched npm|hook install wires' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/session-start.test.ts
npm run verify:npm-package
git diff --check
npm run check > /private/tmp/pr210-check.log 2>&1
```

Evaluate every command by its own exit code; never pipe a gate. `npm run check` includes root build, typecheck, workspace tests, script tests, installed-tarball proof, skill drift, browser, and UI E2E. Builder delivery must provide one exact SHA, changed files, captured red-first/green evidence, repository-gate exit, and confirmation plugin manifests/committed plugin bundle were untouched.

## Review and QA gates

This stays high-risk destructive ownership mechanics: Builder -> fresh exact-SHA Review -> fresh adversarial QA -> repository/CI gates. Review audits red provenance, probes one new test against `4e394db`, confirms local-dev prefix evidence comes from authority rather than recognizer, and confirms generic npm fallback remains closed. QA runs the noncanonical matrix through Claude/Codex/OpenCode status/install/uninstall in scratch homes, asserts byte identity/no unexpected writes, and executes installed-tarball proof. Finally require green configured Node 20/22/26 checks, record exact merge-ready SHA, and stop before Brian-owned merge.

## Risks

- Normalizing then classifying launders foreign spelling; equality must precede ownership.
- Use native path semantics. Durable global npm authority remains intentionally macOS/Linux; this repair must not silently claim a Windows production layout.
- Recognition stays filesystem-independent; authority alone realpaths trusted running artifacts.
- An npm-shaped local-dev install lacking stable prefix proof must refuse, while repo-layout local-dev remains explicit.
- Keep cross-prefix tests across every consumer; no broader branch may reacquire npm after stable pairing fails.
- Root build is mandatory before trusting built lifecycle or verify output.

[task](../tasks/hook-compatibility-ownership.md)

[review finding](pr210-exact-review-4e394db.md)

[orchestration](pr210-merge-readiness-orchestration-2026-08-06.md)
