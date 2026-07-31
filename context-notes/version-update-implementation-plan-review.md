---
type: Context Note
title: Version/update implementation-plan review
actor: codex-version-plan-reviewer
timestamp: '2026-07-31T21:01:02.767Z'
---
# Summary

- **Verdict: REVISE / D0 is not yet approved for build.** The policy direction is coherent, but the Plan contains two delivery blockers and several major under-specified or mis-bounded mechanics. Implementation now would require builders to invent public compatibility and release behavior, contrary to D0's claim.
- **Proximate goal:** independently determine whether the proposed version/update Decision and implementation Plan are buildable, correctly ordered, testable, and bounded into reviewable units; this serves the ultimate goal by making the product's installed collaboration substrate truthfully identifiable and safely supportable without weakening its local-first guarantees.
- **Evidence basis:** all requested bundle docs/research notes plus read-only inspection of the CLI router, build bundle, npm package verifier, skill manifest/status, hook ownership/install/uninstall/status, MCP startup metadata, home/session-start, package manifests, and current GitHub workflows/tests.
- Findings below are labeled **empirical** where the current tree directly demonstrates the issue and **reasoned** where the issue follows from the proposed state machine or dependency graph.

# Severity-ranked findings

## BLOCKER 1 — `pre.2` cannot execute the proposed first upgrade journey

**Empirical.** Plan E7 says a fresh installation of published `0.1.0-pre.2` will “record complete identity,” run the explicit `next` check, and execute that check's printed command. The published/source-equivalent pre.2 command router has only `--version`/`-v`; `version` is absent from `KNOWN_COMMANDS` and no check command exists (`packages/cli/src/cli.ts:54-104, 231-235`). I1/U3 add those mechanics only to the candidate. New code cannot retroactively run inside pre.2.

This makes the central E7 command chain impossible and means a single pre.2→candidate release cannot prove both bootstrap migration and self-discovered upgrade.

**Required edit:** split the operational proof:

1. **Bootstrap proof:** `pre.2 → first contract release` uses an externally documented, exact version-pinned npm command; record pre.2's legacy one-line SemVer before upgrade, then use the new release to record full identity/current status and reconcile skill/hook/MCP. State honestly that pre.2 itself could not discover this update.
2. **Discovery proof:** `first contract release → subsequent prerelease` starts from a CLI that already has I1/U3/N4, proves explicit/passive discovery, executes its literal printed command, and verifies reconciliation. Marketplace retirement waits for this proof if the task acceptance continues to require a real old CLI to discover its successor.

The only alternative is to narrow acceptance explicitly so the first bootstrap release need not prove retroactive discovery. Do not use candidate `npx` as a proxy for checking pre.2: it reports the candidate's own identity, not the installed pre.2 bytes.

## BLOCKER 2 — D8 requires a recovery release that F9 has not created yet

**Reasoned from the DAG.** The graph is `E7 → D8`, then `{E7,D8} → F9`, while D8's claim requires every current surface to refer to “frozen recovery only.” F9 is the unit that creates, independently retrieves, and publishes that frozen recovery release. D8 therefore cannot verify its own links/assets/instructions when it runs.

**Required edit:** reorder to `E7 → F9 → D8`, with G10 parallel after E7 and X11 after D8+F9+G10. If a draft must precede docs, split F9 into `F9a create/upload/independently-prove draft` → D8 → `F9b publish immutable release`; do not make documentation assert an artifact that does not yet exist.

## MAJOR 3 — E7 violates the one-unit/one-branch-or-receipt rule

**Reasoned and empirically coupled.** The Plan declares E7 an operational receipt, but E7 starts by merging a reviewed release-preparation PR that changes package/lockfile version, embedded identity claims, generated assets, release notes, and possibly candidate-facing documentation. No child unit owns that PR, its exact file set, or its compatibility/version decision.

This also leaves a pre-publication documentation gap. Current repo/package docs disagree (`README.md` and package README use `@next`; generated npm `SKILL.md` uses an unqualified install). During the proposed canary window, `next` is the candidate while `latest` remains pre.2, so candidate-carried commands must be deliberately correct before E7; post-proof D8 is too late.

**Required edit:** add a separate **R6 release-preparation PR** after C2+U3+N4+P5 (and any actually required onboarding prerequisite). R6 owns:

- exact SemVer selection under the public-compatibility table;
- package and lockfile bump;
- generated embedded identity/release claims;
- candidate release notes and the minimum candidate-carried command/docs agreement;
- exact-SHA Review → relevant gate before merge.

E7 then becomes operations only: tag the reviewed R6 SHA, stage/approve/prove/promote/finalize, and store its receipt.

## MAJOR 4 — public identity and compatibility schemas are not normative enough to preserve `0.1.x`

**Empirical + reasoned.** The Decision lists identity fields but does not define the exact stable `version --json` envelope, types/nullability, schema evolution, or projection subsets. U3 names result states but not their precedence/meaning or exact exit codes. C2 says “preserve existing output fields where compatible,” which is not a compatibility rule.

The existing public surfaces matter:

- skill status currently returns `absent | unmanaged | installed | stale` (`packages/cli/src/commands/skill.ts:467-500`) and emits `skill.hosts.<host>.state` plus a top-level running `version` (`:563-570`);
- hook status currently emits aggregate/per-host booleans and one command (`packages/cli/src/commands/hook.ts:677-710`);
- the Decision says a breaking pre-1.0 public contract advances to `0.2.0-pre.1`.

Replacing `installed` with `current`, or booleans with state objects, would therefore force the breaking line unless D0 explicitly chooses an additive projection.

**Required edit:** add normative tables/examples before I1:

1. exact `version --json` v1 envelope, every field's type and `unknown` representation, and which fields `--version`, home, skill, MCP, and human output project;
2. additive compatibility rule (recommended: retain skill `state: installed` and hook booleans, add a separate `compatibility`/`hosts` projection), or explicitly select the `0.2.0-pre.1` line;
3. compatibility-contract increment rule and how older manifests map without becoming `unmanaged`;
4. check-state precedence (`deprecated`, selected rollback below local, ahead/unrecognized, absent selected version, malformed metadata), whether each prints a reconciliation command, and exact exit code;
5. whether home/session-start JSON mode may display cached notice or must retain byte parity.

## MAJOR 5 — C2 is not a read-only diagnostic unit; it changes a destructive ownership authority

**Empirical.** The substring predicate is shared by read status **and** mutators. `isManagedHookCommand()` currently claims any command containing `agentstate-lite`; `computeSessionStartHookInstall()` rewrites/removes matches and `computeHookUninstall()` deletes them (`packages/cli/src/commands/hook.ts:80-103, 142-218, 223-264`). The architecture research reproduced a foreign `printf ... agentstate-lite ...` command being falsely claimed. Replacing the predicate changes install, reinstall, uninstall, home prompts, and status—not merely diagnostics.

The Plan's no-mutation QA cannot validate the most important repaired behavior: real mutators must stop touching foreign commands while still converging every historically managed form.

**Required edit:** either split a high-risk **C2H hook ownership/mutation classifier** from skill/MCP diagnostics, or rename/re-scope C2 explicitly as a mutation-boundary change. Its contract table must cover exact historical forms (bare/absolute long bin, old npx coordinate, quoted cache paths, current `aslite session-start`, OpenCode marker/source) and foreign near-misses. Gate it Builder → exact-SHA Review → adversarial QA that runs install **and uninstall** and proves byte preservation of foreign configuration; then repository gate.

## MAJOR 6 — artifact channel and “pack once” have no buildable owning interface

**Empirical.** `buildCliBundle(outfile)` currently receives no build flavor; the exact same shared bundler supplies dev/npm and marketplace artifacts and injects only SemVer (`packages/cli/scripts/build-bundle.mjs:18-46`). It cannot truthfully bake `npm-package`, `local-dev`, or `marketplace-legacy` without new explicit call-site authority.

Also, the current installed-package gate builds and runs its own `npm pack` internally (`scripts/verify-npm-package.mjs:175-208`). Root `npm run check` invokes that gate. A later P5 `npm pack` therefore does not, by itself, establish the Plan's unqualified “packs once / build once” claim or prove that the staged bytes are the exact bytes the verifier tested.

**Required edit:** define in I1/P5:

- an explicit, required build flavor/source-commit input at every bundle-producing call site, with tests that dev=`local-dev`, package candidate=`npm-package`, plugin bot/drift build=`marketplace-legacy`, and missing flavor fails closed;
- one release-candidate creation command that outputs a tarball + checksum exactly once after source gates;
- a verifier mode that accepts and tests that retained tarball without rebuilding/repacking it;
- wording that distinguishes earlier test/dev builds from the one production candidate, and a literal workflow test proving `npm stage publish` receives the retained path/checksum.

## MAJOR 7 — P5 conflates repository code with external protection state

**Empirical + reasoned.** A PR can add the workflow/verifier, but it cannot by itself configure npm's exact stage-only trusted-publisher binding, npm owner/2FA posture, GitHub environment/ref restrictions, or tag ruleset. The release research records that the repository currently has none of the required environments/rulesets/tags/releases, and the current marketplace bot directly pushes `main`, which conflicts if P5 also assumes new main protection.

**Required edit:** add an explicit P5 setup/receipt predecessor to the first tag:

- exact workflow/environment trusted-publisher binding verified;
- Brian and Mike owner/2FA recovery checked;
- protected `v*` creation/update/deletion and allowed actors recorded;
- explicit answer whether main protection is required. If yes, convert/retire or narrowly exempt the main-pushing marketplace bot first. If no, require workflow verification that the tagged SHA is on `main` plus protected tag creation and npm staged approval;
- traditional publish tokens remain available only until the first OIDC proof succeeds, then are revoked/disabled as decided.

P5 may merge before this external setup, but it must not claim “protected transaction complete”; E7/R6 tagging is blocked until the setup receipt exists.

## MAJOR 8 — D0 still delegates user-visible notifier choices to the builder

**Reasoned.** “Bounded,” “short,” “one-run suppression,” and “distinct nonzero” are not acceptance thresholds. N4/U3 builders would still have to choose the registry deadline, response-byte cap, cache filename/schema/lock lease, hidden refresh invocation, one-run flag spelling, suppression precedence, `home --json` behavior, and exact unavailable exit code. Those choices affect latency, scripts, privacy, and public CLI grammar.

**Required edit:** place exact constants/names and a state/exit table in D0 (or explicitly delegate them to a reviewed pre-code technical design added to the DAG). Include at minimum official endpoint/Accept header, maximum response bytes, total abort deadline, cache path/version/TTL/lease behavior, `ASLITE_NO_UPDATE_CHECK` + `NO_UPDATE_NOTIFIER` precedence, the one-run flag, CI/test detection, and an invariant that session-start's existing render budget is not extended. Tests then pin those values instead of merely asserting that some bound exists.

## MINOR 9 — Q6 is both a hard dependency and duplicated inside E7

**Reasoned.** Q6 is separately owned, E7 depends on it, yet E7 again requires one founder/unfamiliar-bundle acceptance. The current `tasks/npm-quickstart-onboarding` body is only links, while `tasks/npm-cli-skill-prerelease` already owns the outstanding founder first-use evidence. This can unnecessarily block the highest-priority release work and leave two task records claiming the same human judgment.

**Required edit:** choose one evidence owner. Recommended: E7's founder journey closes the remaining prerelease first-use row and is linked into Q6; Q6 owns the durable literal onboarding/documentation test but is not a hard predecessor of release mechanics unless that test actually blocks them. Otherwise remove the duplicate E7 founder step and state that E7 consumes Q6's named receipt.

# Survived attacks / strengths to retain

- **Review → QA ordering is explicit and correct.** Every high-risk unit places independent exact-SHA Review before adversarial QA and deployment; no Build → QA edge was found.
- **U3 and N4 are correctly split.** Synchronous explicit discovery and detached cache/process mechanics have different risk classes and feedback needs.
- **Identity concepts are sound.** Artifact channel, launch evidence, and mutable release track are kept separate; unknown evidence remains unknown; lazy runtime SHA-256 avoids the self-hash paradox; `--version` stays conventional.
- **Release authority matches platform constraints.** Stage-only OIDC plus interactive secondary dist-tag/deprecation/rollback operations avoids reintroducing a long-lived automation token.
- **Deletion is properly gated.** G10 preserves named safety properties before X11; frozen recovery is not treated as a maintained channel.
- **Local-first boundaries are strong.** Explicit checks and passive notice do not self-update, rewrite integrations, mutate bundles, or place registry work on ordinary/protocol stdout.
- **Branch discipline is strong outside the missing release-preparation unit.** Current-origin branching, exact-SHA review, user-owned PR/merge, board sync separation, and no bot-owned artifact edits should remain.

# Approval condition

Revise the Decision/Plan for Blockers 1–2 and Majors 3–8, then return the same D0 artifacts for one focused re-review. No code unit should be claimed before that approval.
