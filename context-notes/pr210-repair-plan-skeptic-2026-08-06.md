---
type: Context Note
title: PR 210 repair-plan skeptic acceptance and risk review
actor: codex-pr210-plan-skeptic
timestamp: '2026-08-06T18:56:52.871Z'
---
# Summary

Independent skeptic review completed against exact head `4e394db65346d957676e590d7ca287d20b39dafb`. The two-blocker repair is viable, but a plan is acceptable only if it treats canonical path spelling as one shared semantic provenance invariant and repairs the local-dev installed npm-layout writer without adding a new cross-prefix ownership exception.

Status: acceptance and risk review ready for builder synthesis. Source and Git remained read-only.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: give a third party a must-pass acceptance and risk matrix for the two PR 210 blockers. This serves the ultimate goal by making writer and recognizer provenance, historical compatibility, installed-package support, and byte preservation explicit gates rather than assumptions.

## Independent system model

Four axes must stay separate:

1. Artifact channel describes the bytes: `npm-package`, `local-dev`, or `marketplace-legacy`.
2. Executable layout describes where those bytes run: stable npm prefix, repository `packages/cli/dist`, or marketplace skill bundle.
3. Install authority physically proves the current running executable and runtime before any write.
4. Hook ownership is a pure lexical and semantic classifier over stored host state. It cannot depend on the package still existing.

The writer selects authority evidence, composes one runtime and executable argv pair, serializes it through the closed shell-token language for Claude and Codex, and emits exact generated source for OpenCode. Status, install reconciliation, deduplication, and uninstall all consume the same ownership result. A false positive therefore grants destructive authority across every host.

The installed-package blocker is an axis-confusion defect: a `local-dev` artifact installed under `<prefix>/lib/node_modules/@holaxis/aslite` is physically an npm-layout executable, but the current authority returns the host `process.execPath`. The writer then composes a cross-prefix npm pair that the tightened recognizer correctly rejects. The repair must make that writer emit the same-prefix stable npm launch after physical proof; it must not teach the recognizer that arbitrary cross-prefix npm pairs are local development.

## Canonical spelling versus physical resolution

Canonicality here is lexical provenance: an absolute stored token must already equal its platform-defined normalized spelling. Normalizing a token and then granting ownership is unsafe because `./`, duplicate separators, and parent segments become indistinguishable from writer output. The predicate must reject the raw spelling rather than canonicalize it into permission.

Physical proof is different. Install authority may use `realpath` to prove that the running package, managed bin, npm prefix, and stable `<prefix>/bin/node` resolve to the required current files. Status and uninstall must remain pure and must not call `realpath`: a removed package, changed symlink, or offline checkout must not strand a hook that the product actually wrote. A stable npm launcher may itself be a canonical symlink path whose physical target is the host Node executable outside the prefix.

The supported durable npm contract is macOS and Linux. Tests should pin POSIX canonical semantics independent of runner convenience. Windows-like spellings must remain unmanaged unless Windows support is separately designed; this repair must not imply new Windows persistent-install support.

Historical inspection found no legitimate noncanonical path writer. Since the first SessionStart writer, absolute executable bases came from `currentExecutableRealPath`, which calls `realpathSync`. The durable npm writer later used a real npm prefix, real package entry, and normalized joined stable runtime path. Historical JSON double quoting changed only the lexical envelope for whitespace; it did not make dot segments or duplicate separators legitimate. Any claimed historical exception therefore needs a concrete writer commit and fixture, not path equivalence.

## Empirical counterexamples at 4e394db

All of these are currently owned even though no production writer emits them:

- Same noncanonical npm prefix in both tokens using `./`, `//`, or `a/../` returns `current`.
- A noncanonical direct npm, local-dev, or marketplace entry returns `legacy_path_bound` because `managedExecutableLayout` normalizes before matching.
- A noncanonical runtime paired with a canonical local-dev or marketplace entry returns `current` because the generic Node branch normalizes before its suffix check.

This is one invariant failure, not a request for a new subsystem. A repair only inside `stableNpmRuntimePair` leaves the same destructive class reachable through adjacent existing call sites.

## Must-pass acceptance matrix

| Boundary | Must remain owned | Must remain unmanaged | Required evidence |
|---|---|---|---|
| Canonical path primitive | Absolute normalized POSIX paths, including ordinary dots in names and canonical paths containing spaces or literal shell metacharacters through the supported quote envelope | Dot segments, parent segments, duplicate separators, leading duplicate root separators, relative paths, and Windows-like lookalikes on supported POSIX hosts | One pure table for runtime and executable tokens; new negative rows fail at `4e394db` |
| Stable npm pair | Exact canonical `<P>/bin/node <P>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start` | Canonical cross-prefix pairs; same physical target spelled noncanonically; one canonical token plus one noncanonical token; unscoped or near-match package suffixes | Pure classifier table proving both same-prefix and raw-token canonicality |
| Direct and independent layouts | Canonical direct npm, repository local-dev, and marketplace historical entries keep their existing states; canonical Node plus repository local-dev or marketplace keeps `current` | Noncanonical entry token for every layout; noncanonical runtime token for local-dev or marketplace; npm entries must never fall through to the generic Node rule | The same canonical predicate at every absolute-path admission call site, ideally one helper plus bounded call sites |
| Local-dev source-tree writer | Canonical host Node plus canonical `packages/cli/dist/agentstate-lite.mjs` remains writer-recognized | Any npm-shaped executable with an unproven cross-prefix host runtime | Authority plus `buildHookLaunchSpec` unit proof |
| Local-dev artifact installed in npm layout | After proving the installed prefix and stable Node relation, writer emits the canonical same-prefix npm pair and self-recognizes it | Missing or mismatched stable prefix Node, transient cache, or incomplete proof fails before any host write; there is no channel-based classifier exception | Pure authority projection plus freshly packed local-dev installed-tarball journey |
| Npm-package authority | Existing `durable_global` proof and stable same-prefix launch remain unchanged | Real npm-exec or npx cache, PATH shadow, unsupported platform, missing prefix, mismatched runtime, and copied executable remain refused without writes | Existing authority suite plus sampled red probe |
| Historical compatibility | Bare `aslite` and `agentstate-lite`, pre-session-start forms, exact legacy npx coordinate, canonical direct layouts, supported historical whitespace double envelope, exact current and legacy OpenCode source retain their current classifications | Shell-equivalent or path-equivalent spellings never emitted by a writer remain foreign | One enumerated positive history table with provenance comments; no normalization-based history inference |
| Claude and Codex status | Canonical generated entries report installed with the expected compatibility state | Every noncanonical matrix row reports unmanaged or absent | Pure entry classification and built CLI status receipts |
| Claude and Codex install | Reinstall over one exact current entry is a no-op; foreign near-match plus current entry remains byte-identical | Foreign-only near-match is never rewritten or deduplicated; when install legitimately appends a managed group, the foreign subtree is unchanged | Byte snapshots for no-op cases and exact expected-diff assertions for append cases |
| Claude and Codex uninstall | Every enumerated owned current and historical entry is removed | Foreign-only noncanonical files return `changed:false` and remain byte-identical | Freshly built lifecycle tests for both files |
| OpenCode lifecycle | Exact generated canonical source is current, reinstall is byte-identical, and uninstall removes it | Exact template-shaped source containing each noncanonical runtime or executable pair is unmanaged; install refuses overwrite and uninstall preserves exact bytes | Freshly built status, install, and uninstall probes over exact plugin bytes |
| Installed package proof | Local developer tarball installs offline, both bins resolve, all three hooks use one writer-recognized launch, status is current, reinstall is no-op, uninstall cleans owned state, and foreign siblings survive | The proof may not skip hooks, relabel local-dev bytes as npm-package, or accept the old host-runtime cross-prefix command | `npm run verify:npm-package` green on the repaired SHA |
| Repository and CI | Focused tests, build, full `npm run check`, and exact-SHA Node 20, 22, and 26 checks pass | A focused green suite cannot supersede the installed-tarball or repository gates | Exact SHA receipts and GitHub check links |

## Plan rejection criteria

Reject a proposed plan or implementation if any of the following is true:

- It normalizes a foreign token and then uses the normalized value to grant ownership.
- It patches only `stableNpmRuntimePair` while leaving normalized direct-layout or generic-runtime admissions owned.
- It adds a broad `local-dev` exception for npm-shaped cross-prefix commands. Artifact channel is not present in persisted hook text, so such an exception would authorize any matching foreign command.
- It uses filesystem existence or `realpath` during status or uninstall rather than keeping physical proof at install time.
- It changes the verifier expectation to the unsafe host-runtime plus npm-entry pair, weakens the artifact channel, skips the hook journey, or removes Node 22 and 26 from the gate.
- It tests only the source classifier, only uninstall, or only Claude and Codex. OpenCode exact-source ownership must receive the same path invariant.
- It rejects canonical historical paths with spaces, embedded punctuation, or supported exact quote envelopes as collateral damage.
- It claims a noncanonical historical exception without identifying the exact writer commit and reproducing its bytes.
- It changes public state names, existing booleans, or unrelated hook architecture to solve these two blockers.

## Recommended bounded shape

The smallest safe repair is one shared raw-token canonical absolute-path predicate used by every semantic path-layout admission, plus a narrow authority or launch projection that recognizes a proven local-dev artifact in npm layout and selects its stable same-prefix Node path. The recognizer gains no new generic npm alternative. Tests should be table-driven from one counterexample inventory and projected through pure classification and all three built host lifecycles.

## Evidence and confidence

Evidence: repository and bundle guidance; normative C2H protocol; exact-SHA source and tests; PR diff; historical writer commits; pure exact-head probes; and the independently reproduced installed-package failure recorded by the orchestrator. I did not run a second full repository gate because this role is a plan skeptic and the current exact head is already known red.

Confidence: high for the acceptance boundary and counterexamples; medium-high for implementation shape because the builder may choose a different narrow authority refactor that satisfies the same matrix.

[tracks](../tasks/hook-compatibility-ownership.md)

[extends system model](hook-ownership-semantic-node-pair-model-2026-08-05.md)
