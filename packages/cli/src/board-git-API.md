# `@agentstate-lite/board-git` — intended public API (written down at A0, before the move)

The board's git channel is being extracted to a private workspace package
(`plans/board-git-package` on the project bundle; this PR is A0 — seam preparation in place, no
file moves). This file states the ACCEPTANCE BAR for the package's public surface so A1's
relocation is a mechanical move against a written contract, not a judgment call discovered in
diff review.

## What the package exports

Domain-neutral operations, typed results, and injected stores/adapters:

- **Porcelain ops** (today `cli/src/git.ts`): the ONE spawn wrapper (`runGit`/`runGitBytes`) and
  the named ops — provisioning/self-heal, stage-and-commit, converging fetch-rebase, ff-pull,
  push, `diffDocsBetween` (the ONE ref-to-ref doc diff; `changesSince` rides it), `currentHead`,
  `countUncommitted`, `unpushedCount`. Channel constants (`BOARD_BRANCH`/`BOARD_REMOTE`/
  `BOARD_REF`/`BUNDLE_DIR`) become `branch`-mode defaults when the BoardChannel seam lands (PR B).
- **Error taxonomy** (today `cli/src/board-git-errors.ts`): `BoardGitError` + `classifyGitError`
  + the structural guard `isBoardGitError` (never bare `instanceof` — the dual-load hazard).
  The package's errors carry `code`/`details`/`help` ONLY; exit codes and envelopes are CLI
  boundary policy (`errors.ts`'s `cliErrorFromBoardGit`, the ONE mapping layer).
- **State store** (today `cli/src/cursor.ts`): `createSyncStore({stateDir, writeAtomic})` — the
  factory is the injection point; the CLI wires the default instance from its own credentials
  discipline (`~/.agentstate/sync`, `writeFileAtomic0600`). Plus the pure key/schema vocabulary
  (`bundleKey`, cursor/cache/marker types).
- **Neutral engine helpers** (today `cli/src/sync-engine.ts`): `retargetBoardInterior`,
  `healStaleRebaseBeforeProvisioning`, `resolveBundleKey`, `toDeltaRows`, `singleActor`,
  `provisionAnnouncement`.
- **Flow orchestration** (`flow.ts`, carved in A1 from `commands/sync*.ts`): the sync/establish
  engine steps — git/channel orchestration only, per the acceptance bar below.

## What the package must NEVER export or import

- CLI invocations, help/usage text, rendering (TOON/JSON), environment resolution, exit
  behavior, or the CLI's `errors.ts`/`output.ts`/`invocation.ts`/`args.ts`.
- Command modules stay in the CLI as leaves consuming package APIs; the one legal reverse edge
  is the CLI's discovery layer consuming the package's `BUNDLE_DIR` constant.

## Completion criteria (from the plan's acceptance bar)

The extraction is complete only when: the package imports no CLI source and the
import-direction test (ships with A1) has NO allowlist in any merged commit; branch-mode
behavior and output are pinned by parity tests; unknown remote state cannot select or establish
in-tree mode; in-tree v1 cannot push, create a board branch, or run autopull; and the npm
artifact still installs as one CLI.
