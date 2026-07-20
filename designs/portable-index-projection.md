---
type: Design
title: 'Portable generated indexes: a navigable, tool-independent bundle projection'
description: >-
  Design for turning the dormant index.md generator into an explicit, recursive,
  ownership-safe local projection without automatic writes or an event-backbone
  dependency.
actor: openai/codex-design
timestamp: '2026-07-20T01:06:08.861Z'
---
# Portable generated indexes: a navigable, tool-independent face for an AgentState bundle

**Status:** Proposed design. No implementation decision has been made.

**Recommendation in one sentence:** keep `index.md` as a useful portable projection, but replace the dormant whole-file `regenerateIndex` helper with an explicit, local-first, recursively complete `index generate` workflow that refuses unmarked hand-authored indexes, supports dry-run checking, and owns only files carrying an unmistakable generated marker.

## Executive verdict

`index.md` can deliver real product value that `list`, query, and Views do not: it makes a bundle navigable using only Markdown. A human can browse it on GitHub or in an editor; a cold agent can progressively inspect it without first installing AgentState, loading a skill, or transferring every concept body; and the same navigation survives a zip, copied folder, or content-free operating model after installation into a bundle.

That value does **not** justify wiring index regeneration into every mutation, `sync`, reads, or session start. Those triggers would create derived-file churn, bypass gaps for direct filesystem edits, surprise writes from read-oriented commands, and conflicts between generated and curated prose. The current `regenerateIndex` function is also not ready to expose directly: it regenerates one directory at a time, emits links to child indexes it does not create, replaces an existing index body, and cannot distinguish a generated index from a human-authored one.

The right product boundary is an explicit projection command. The first useful version should:

1. scan concept heads once and plan the complete directory tree;
2. generate every required index recursively, so it never creates a link to a child index absent from the same plan;
3. create missing indexes and refresh only indexes already marked as AgentState-generated;
4. refuse the entire write before changing anything if an unmarked existing index would be overwritten;
5. offer `--check` to report drift without writing and an explicit `--force` for the one-time adoption of existing indexes;
6. preserve root `okf_version`, nested-index frontmatter rules, relative links, descriptions, deterministic ordering, and CAS on every reserved-file write.

This is a modest, coherent capability—not a general export framework and not an event-backbone dependency. The existing sibling prune task should be **rewritten**, not executed as filed: remove the redundant `readIndex` wrapper and replace the current unsafe high-level generator with a pure plan/render boundary plus one governed CLI consumer.

## The user value

### Cold-open journey without AgentState knowledge

Today, AgentState's strongest navigation surfaces require the executable:

- `list` and `query` efficiently expose concept heads;
- `home` orients an agent to the current workspace;
- Views can create rich, live, domain-specific navigation.

Those surfaces are better once AgentState is known. They do not help a person or agent that receives an ordinary folder, opens a repository on GitHub, or has not yet discovered the CLI. OKF deliberately permits `index.md` at each directory so a consumer can first see what exists, then open only the relevant documents. A generated hierarchy makes the bundle useful in the lowest-capability environment: Markdown plus relative links.

A cold agent's tool-independent journey becomes:

1. open the root `index.md`;
2. see direct concepts grouped by their declared `type` and immediate subdirectories;
3. follow one subdirectory index rather than scanning the entire bundle;
4. read titles and one-line descriptions before paying to open bodies;
5. install or invoke AgentState only when it needs structured query, mutation, graph traversal, history, or live Views.

This supports token-light progressive disclosure. It is not as cheap or current as `queryHeads` when the CLI is available, but it is readable everywhere and costs no bootstrap knowledge.

### Human browsing and distribution

A persisted index is valuable when a bundle is:

- reviewed on GitHub without launching the local UI;
- opened in an ordinary Markdown editor;
- copied as a folder or distributed as a zip/tarball without Git history;
- embedded in a repository whose readers do not use AgentState;
- prepared as a portable cognitive ecosystem whose definitions should explain themselves;
- consumed from npm-first or other future installations where a skill is absent.

The projection strengthens AgentState's "plain files remain useful" claim. It should not be sold as a substitute for the live product. It is the bundle's portable table of contents.

### Content-free recipes and operating models

Recipe packages currently carry declared definitions—conventions, References, and Views—but intentionally reject reserved filenames such as `index.md`. That is correct: a recipe should not overwrite the host bundle's root or claim navigation ownership before installation. After a recipe is applied, however, its concepts participate in the host bundle's directory tree. An explicit index-generation step can produce navigation for the resulting installed bundle without putting bundle-specific derived files inside the recipe package.

The useful separation is:

```text
portable recipe definitions
          │ recipe add
          ▼
host bundle concepts + definitions
          │ explicit index generate
          ▼
portable Markdown navigation for that concrete bundle
```

No broad export/package framework is required for this first capability.

## Why persisted indexes are not redundant with live surfaces

| Surface | Best at | Limit |
|---|---|---|
| Persisted `index.md` | Zero-tool browsing, GitHub/editor navigation, archive portability, progressive disclosure before AgentState is known | A derived snapshot that can become stale; limited to Markdown grouping and links |
| `list` / `queryHeads` | Current, structured, filterable, token-efficient concept metadata; remote push-down | Requires the executable and knowledge of its commands |
| `home` | Session orientation, workspace identity, recent and collaboration context | Curated for startup, not a complete hierarchy |
| Views | Rich domain-specific visualizations, live refresh, graph/query composition | Requires `agentstate-lite ui`, a browser shell, and authored View content |
| Consumer-synthesized index | Fresh navigation with no persisted churn | Every consumer must implement it; unavailable in plain GitHub/editor/archive contexts |

The product should use each for what it is good at. Persisted indexes earn their place only if they remain explicitly derived, safe to refresh, and optional.

## Standards basis

OKF v0.1 §6 defines `index.md` as an optional directory listing for progressive disclosure. It allows one in any directory, groups entries under headings, recommends relative links and descriptions, explicitly permits producers to generate indexes automatically, and permits consumers to synthesize one when missing. §11 allows the bundle-root index alone to carry `okf_version` frontmatter; nested indexes carry none. Missing indexes do not make a bundle invalid.

The design therefore treats indexes as optional projections, not authoritative concept records. The authoritative data remains the concept files and their frontmatter.

Official specification: [Open Knowledge Format §6 — Index Files](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md#6-index-files).

## Current implementation: what exists and what does not

### Existing useful pieces

`packages/core/src/bundle.ts` already contains a backend-agnostic `regenerateIndex(bundle, dir)` implementation. For one requested directory it:

- obtains concept IDs through the `StorageBackend.list` seam;
- identifies direct concepts and immediate child directory names;
- batch-reads direct concepts through the engine's missing-safe batch helper;
- groups bullets by `type`;
- uses `title` and optional `description` frontmatter;
- sorts type headings, bullets, and child names deterministically;
- emits relative `.md` links;
- preserves a string-valued root `okf_version`, defaulting it to `0.1` when missing;
- writes nested indexes without frontmatter;
- reads the current reserved file and writes with compare-and-swap through `versionedMutation`;
- retries an index-file conflict against a fresh index version.

The generic storage contract already supports versioned `readReserved`/`writeReserved` over filesystem, memory, and remote adapters. The reference wire protocol carries those operations. Git sync already carries reserved files, and board awareness excludes them from concept-document rows.

`initBundle` separately creates the root `index.md` when missing. It writes a minimal root heading and "An Open Knowledge Format bundle" body with `okf_version` under expect-absent CAS. It does not call `regenerateIndex`.

### Current gaps and unsafe semantics

The existing helper has zero production callers and should not simply be exposed as a command.

1. **One directory per call.** A root regeneration discovers immediate subdirectories and links each to `child/index.md`, but does not generate those child indexes. The result can manufacture broken navigation unless a caller separately discovers and regenerates the full tree.

2. **Whole-body replacement.** The generated body replaces the current index body. Only a root string-valued `okf_version` is preserved. A hand-authored introduction, curated grouping, directory description, caveat, or intentionally omitted link is destroyed.

3. **No ownership signal.** There is no durable marker distinguishing generated bytes from curated `index.md` content. The engine cannot know whether refresh is safe.

4. **Source scan is outside the CAS retry.** Concept IDs and heads are scanned once. If a concept changes while the index write conflicts and retries, the final index can reflect the older scan even though the reserved-file write is correctly CAS-guarded. The next regeneration self-heals, but the single run is not a transactional snapshot.

5. **CLI-only automation cannot cover direct edits.** Users and agents can edit OKF Markdown directly, Git can advance the bundle, and external producers can change files. Any "after every CLI mutation" strategy would still drift while falsely sounding comprehensive.

6. **Root naming is storage-shaped.** The generated root heading derives from `path.basename(path.resolve(bundle.root))`. For the conventional local workspace that is often `.agentstate-lite`, not the bundle display name; for a remote bundle the root is a URL, making this derivation inappropriate.

7. **`readIndex` loses the CAS basis.** The exported `readIndex` wrapper parses a body and optional `okfVersion` but discards the reserved-file version token. A governed writer needs the raw bytes and version from `readReserved`, so this convenience API does not help the proposed workflow.

8. **Malformed concepts fail regeneration.** Unlike routine `list`/`status`, the generator does not opt into malformed-document skipping. This is defensible for a complete derived navigation surface—it must not silently omit corrupt content—but the CLI receipt must attribute the failing document rather than leave a partial update.

## Alternatives considered

### A. Prune `readIndex` and `regenerateIndex` now

**Pros**

- removes dead exported API and its dedicated tests;
- eliminates misleading "implemented" surface before npm publication;
- can be recovered from Git if demand appears later.

**Cons**

- discards a mostly-correct deterministic renderer aligned with OKF's portability goal;
- does nothing for the real cold-open and archive-navigation need;
- would likely be followed by rebuilding similar logic once npm/skill independence is tested.

**Assessment:** too aggressive now that a concrete user value and safe trigger have been identified. Still preferable to shipping the current helper as public API unchanged.

### B. Keep the helpers dormant

**Pros**

- no immediate engineering work;
- retains implementation optionality.

**Cons**

- exported API continues to look supported without a product consumer;
- overwrite and incomplete-recursion hazards remain latent;
- source comments and tests keep describing a capability users cannot invoke.

**Assessment:** acceptable only as a short decision pause. Not a durable end state.

### C. Regenerate automatically after every AgentState mutation

**Pros**

- indexes usually look current after CLI writes;
- no separate user action for the happy path.

**Cons**

- doubles or multiplies write work for ordinary mutations;
- one concept mutation can change several ancestor indexes;
- direct file edits and Git updates bypass the hook;
- failures create confusing partial success: the concept may persist while its derived write fails;
- generated index commits and conflicts become high-frequency noise;
- it expands the shared mutation boundary into derived multi-file transactions without real atomicity.

**Assessment:** reject.

### D. Regenerate during `sync`

**Pros**

- indexes are refreshed near a sharing boundary;
- Git carries the result.

**Cons**

- `sync` would silently author content beyond sharing existing changes;
- different CLI versions could render different bytes during convergence;
- derived changes increase merge/conflict pressure on the collaboration path;
- in-tree and dedicated-branch modes would need additional policy;
- failed/offline sync would be entangled with local content generation.

**Assessment:** reject. Sync must not become a hidden authoring trigger.

### E. Regenerate during reads, `home`, or session start

**Pros**

- indexes trend fresh without a remembered command.

**Cons**

- violates read-only expectations;
- creates surprising dirty worktrees or board commits;
- turns lightweight, time-bounded startup into a bundle-wide scan and write;
- makes a user pay generation cost even if they never browse Markdown indexes.

**Assessment:** reject.

### F. Explicit in-place generation command

**Pros**

- intent and write scope are visible;
- compatible with local-first use and ordinary Git review;
- can provide preview/check/refusal semantics;
- produces a durable, zero-tool artifact;
- no hidden coupling to mutation, sync, or event infrastructure.

**Cons**

- users or agents must invoke it when they care about freshness;
- persisted derived files add repository churn;
- multi-file generation is not transactionally atomic;
- safe adoption of existing hand-authored indexes needs explicit policy.

**Assessment:** recommended first product slice.

### G. Generate only during a future export/package workflow

**Pros**

- generated files can live only in an immutable snapshot;
- source bundles incur no churn or ownership ambiguity;
- the exported artifact is self-navigating by construction.

**Cons**

- no export workflow exists today;
- does not improve GitHub/editor browsing of the working bundle;
- building an export framework solely to consume this renderer is disproportionate.

**Assessment:** likely a valuable later consumer of the same pure planner, but not the first slice.

### H. Never persist; synthesize indexes only in consumers

**Pros**

- always computed from current data;
- no write, ownership, or merge conflict.

**Cons**

- already covered better by `list`, query, and Views when AgentState is available;
- provides no GitHub/editor/archive navigation;
- repeats synthesis across consumers.

**Assessment:** keep as a valid consumer choice, not the whole product answer.

## Recommended product contract

### Command shape

Smallest useful CLI surface:

```text
aslite index generate [--dir <bundle>] [--check] [--force] [--actor <name>]
```

Semantics:

- The default scope is the whole resolved local bundle, recursively. There is no root-only default because root-only generation can create links to missing child indexes.
- `--check` performs the same plan and safety checks but writes nothing. It exits `0` when every generated index matches, and a nonzero validation/conflict-style code when generation would create/update/refuse files. The structured receipt reports each category so CI or an agent can branch without parsing prose.
- Without `--check`, the command creates missing indexes and refreshes indexes carrying the exact AgentState generated marker.
- If **any** existing index is unmarked and would need replacement, the command refuses before writing any index. The receipt lists each blocked path and points to `--check`/`--force`. Planning before writes avoids knowingly producing a half-generated hierarchy.
- `--force` explicitly adopts/replaces unmarked indexes. It is intentionally loud because it can delete curated prose. The receipt lists the files adopted. The CLI help should recommend reviewing `--check` output or a Git diff first.
- A byte-identical result is a no-op, exits `0`, and performs no write.
- The normal receipt includes `created`, `updated`, `unchanged`, `adopted`, and `refused` counts plus affected paths, capped with a total count and a follow-up command for full output if needed.
- Actor resolution follows the existing `flag > AGENTSTATE_LITE_ACTOR > absent` rule. Each changed reserved-file write carries the actor through `writeReserved`; no-op checks never create attribution.

`generate` is preferable to `regenerate`: the first call creates missing files, while subsequent calls refresh them. The command is a projection operation, not an automatic lifecycle promise.

### Local versus remote posture

The first CLI slice should be local-only. Its primary value is a navigable file tree, GitHub/editor review, and portable copies. The remote backend exposes reserved-file reads/writes, so the underlying planner and governed writer must remain backend-agnostic and testable over memory/remote contracts, but exposing `--remote` immediately adds naming, permission, multi-file partial-failure, and artifact-retrieval questions without strengthening the initial user journey.

Later remote support can reuse the same plan if a real consumer wants to materialize indexes into a remote bundle. It must remain explicit `--remote`, never ambient.

### Generated ownership marker

Each generated body should carry a stable HTML comment that is legal Markdown and invisible in normal rendering, for example:

```markdown
<!-- agentstate-lite:generated-index:v1 -->
```

The marker means the entire index body is derived and may be replaced by a future `index generate`. It is not a security credential and does not make the file authoritative. A changed or missing marker is treated as human ownership and refused by default.

Whole-file ownership is recommended for the first slice over managed start/end blocks. Managed regions preserve curated intros, but introduce parsing, duplicate-navigation, malformed-marker, and merge semantics disproportionate to the initial value. Users who want curated navigation can keep an unmarked index; the generator will leave it alone and report the refusal. A future managed-block mode should require actual demand.

### Root and nested files

- The root preserves exactly one string-valued `okf_version`; generation never removes or changes a valid declared version.
- Nested indexes carry no frontmatter.
- Missing nested indexes are generated with a directory heading derived from the directory name.
- Root display text should not be derived from a URL or blindly from `.agentstate-lite`. The pure renderer should accept the display heading as input. The CLI may use the existing bundle-display-name resolution, falling back to the project folder rather than the conventional bundle-folder basename.
- Every immediate-subdirectory link emitted by one plan must target an index that the same plan either creates, updates, confirms unchanged, or explicitly reports as blocked. A successful run cannot knowingly leave a generated broken child-index link.

### Existing init stubs

Newly initialized root stubs may include the generated marker because they are already tool-authored bytes. This does **not** trigger full generation during `init`; it only records that an explicit future generation may safely replace the stub body.

Existing bundles have unmarked root indexes. They remain protected. Their first adoption requires `--force` after `--check`. Do not heuristically recognize "looks like the old init template"—localized edits and historical variants make template matching another fragile migration surface.

## Core ownership and API shape

`readIndex` is not needed as a separate public API. It discards the raw version required for a safe conditional write and offers no semantics unavailable from `readReserved` plus the one Markdown parser. It should be removed unless an independent consumer appears.

The current `regenerateIndex` combines three concerns:

1. scanning current concepts;
2. rendering index bytes;
3. deciding whether and how to overwrite a reserved file.

Split those concerns without creating a new package:

- **Pure planner/renderer in core:** consumes a bundle display name and a complete set of concept head projections, returns deterministic planned bytes for every required directory. It performs no writes and can be fixture-tested byte-for-byte.
- **Governed core write helper or thin CLI application layer:** reads every target reserved file with its version, classifies it as missing/generated/unmarked, computes no-ops, refuses unsafe adoption before writes, and performs per-file CAS writes with actor propagation.
- **CLI command:** resolves the local bundle and actor, selects check/force policy, maps typed outcomes to structured AXI-conformant receipts and help.

The pure planner should use `queryHeads` rather than batch-reading bodies: indexes need only IDs and frontmatter. This makes the scan token/transfer-light and keeps the future remote path to one pushed-down heads query. The plan should be based on one head set so all directory outputs are mutually consistent with the same observed scan.

Whether the governed write helper belongs in core or the CLI should be decided by invariant ownership: marker/refusal/CAS rules are storage-independent projection policy and are likely core semantics; CLI wording and display belong in the CLI. Do not export a low-level "overwrite any index" helper as the product API.

## Invariants

An implementation is acceptable only if these remain executable:

1. Concept documents are the authority; generated indexes are replaceable projections.
2. A default run never overwrites an unmarked existing index.
3. Safety is all-plan-before-write: a known refusal produces zero writes.
4. Every generated child-index link resolves to a target covered successfully by the same plan.
5. Root `okf_version` is preserved; nested indexes never gain frontmatter.
6. All links are relative and POSIX-shaped.
7. Output is deterministic for a given display name and set of concept heads, regardless of backend list order.
8. A byte-identical target is a semantic no-op and produces no backend write or attribution.
9. Every changed target uses the version from the read that classified its ownership; a racing edit yields `VersionConflict`, never silent overwrite.
10. Read-oriented commands and `sync` never invoke generation.
11. Direct filesystem edits remain supported; they may make generated indexes stale, and `index generate --check` is the explicit detection path.
12. Malformed concepts fail loudly with an attributed path and no planned writes.

## Concurrency and failure model

There is no bundle-wide transaction in the storage seam. The design should be honest about that.

- Planning is a point-in-time best effort over one `queryHeads` result, not an ordered event snapshot.
- The command preflights ownership and no-op classification before writes, but another writer can race afterward.
- Each index write is individually protected by CAS. If any write conflicts, the command stops and reports the path and current/expected versions. Already completed index writes remain valid projections of the same plan; rerunning heals the rest.
- A concept mutation concurrent with generation can make the completed plan briefly stale. Rerunning is the recovery. The first slice should not add a journal, event cursor, global lock, or repeated whole-tree scan merely to imply atomicity it cannot provide.
- A future event backbone could schedule or invalidate this projection, but the index feature must not depend on it.

The implementation may choose a deterministic write order (deepest directories first, root last) so root navigation is published only after children. This reduces the visible broken-tree window and is worth pinning. It does not make the operation transactional.

## Git, remote, and distribution compatibility

### Git board and in-tree bundles

Generated files are ordinary reserved Markdown and already travel through Git sync or normal repository commits. Because generation is explicit, the user can inspect the diff before sharing. Deepest-first writes reduce transient local breakage; one sync after success carries the coherent result. Generation must not call sync automatically.

The command should work for both a conventional `.agentstate-lite` board checkout and an in-tree bundle selected by `--dir`, subject to existing mode rules. It changes bundle content; it does not change board topology.

### Remote backend

Keep `readReserved`/`writeReserved`, CAS, and the wire contract untouched. The new pure planner must not assume filesystem traversal. Deferring the remote CLI flag does not close the future path.

### npm and skill independence

The command and marker semantics belong in the npm CLI/core, not in a skill. Generated indexes are bundle content and remain readable if the plugin is absent. A thin bootstrap may mention the command later, but correctness and instructions should be self-described by `aslite index generate --help`.

### OKF interoperability

The generated bytes remain ordinary §6 Markdown. The marker is an HTML comment, not proprietary frontmatter, and other consumers can ignore it. Unknown OKF tools can still render every heading and link. AgentState must continue accepting hand-authored unmarked indexes; generation is optional.

## Failure modes and required receipts

| Failure | Required behavior |
|---|---|
| Existing unmarked index | Refuse before writes; list path; recommend `--check` then `--force` only if replacement is intended |
| Marker is malformed or duplicated | Treat as unmarked/human-owned; refuse |
| Malformed concept frontmatter | Attribute concept ID; make no writes |
| Child directory inferred but no concept remains after a concurrent delete | Plan from the returned head set; never emit an unplanned child |
| Index changes after preflight | CAS conflict; stop; never overwrite |
| Concept changes during/after plan | Complete honestly from observed heads; receipt may note projection is a snapshot; rerun heals |
| Partial backend/network failure | Report completed and pending paths; rerun idempotently resumes |
| Identical generated bytes | `changed:false`/unchanged count; no write |
| Invalid nested frontmatter exists | Unmarked by default, therefore refused rather than normalized silently |
| Root has non-string/missing `okf_version` | Preserve the current init/OKF policy explicitly: either refuse as malformed root or normalize only under `--force`; do not silently invent policy in the renderer |

## Testing and red probes

### Pure rendering contract

- unordered heads produce byte-identical sorted output;
- titles, description omission/presence, unknown types, missing display fields, Unicode, and Markdown-significant characters are handled according to one documented escaping policy;
- one scan plans root, nested, and deep indexes recursively;
- every generated subdirectory link has a corresponding planned target;
- root and nested bytes obey frontmatter rules;
- bundle display name is supplied, not inferred from a remote URL or `.agentstate-lite` path.

### Ownership and write contract

- missing targets are created;
- exact marker targets update;
- unmarked and malformed-marker targets refuse with **zero writes across all targets**;
- `--force` adoption is explicit and receipt-visible;
- identical targets are no-ops;
- root version survives regeneration;
- a racing human edit after preflight produces a typed CAS conflict;
- actor propagates only on changed writes.

### Failure/recovery contract

- inject a failure after a child write and before root; rerun completes without rewriting unchanged children;
- inject a concept mutation after planning; prove the run never claims transactional freshness and the next run heals;
- inject a malformed concept; prove no index changes;
- use a reverse-order memory backend and filesystem backend agreement row.

### CLI journey

In a scratch bundle:

1. initialize and add concepts at root, one child, and one grandchild;
2. run `index generate --check` and inspect the structured plan;
3. verify the legacy unmarked root refuses a normal run without modifying any file;
4. run with `--force`, then verify GitHub-renderable relative links resolve;
5. rerun and receive a no-op;
6. edit one concept description, confirm `--check` reports drift, regenerate, and see only its ancestor index change;
7. hand-edit a generated index and remove/change its marker, confirm the default run refuses;
8. run the installed-tarball CLI offline to prove the capability does not depend on a skill.

The critical red probe is removal of the default ownership refusal: a test must then overwrite an unmarked hand-authored introduction and fail. Another red probe should disable recursive planning and expose a generated broken child link.

## Implementation sequence and likely size

Keep this to two reviewable units after product approval.

### Unit 1 — pure recursive plan and ownership policy in core

- remove `readIndex`;
- extract/rewrite `regenerateIndex` into a pure all-directory planner plus governed, marker-aware plan classification;
- keep generic reserved-file and CAS machinery unchanged;
- add byte fixtures and adversarial ownership/recursion tests;
- update comments that currently claim a live high-level regeneration consumer.

Expected scope: mostly `packages/core/src/bundle.ts` or a focused internal module plus core tests and exports. No new workspace package.

### Unit 2 — explicit local CLI consumer

- add the `index generate` command and generated CLI reference/help;
- add `--check`, `--force`, actor propagation, capped structured receipts, and local journey tests;
- mark newly initialized root stubs as generated only if the ownership decision is accepted;
- update README/skill references only enough to make the shipped command discoverable; generated command knowledge remains sourced from CLI reference.

Expected scope: one command module, command registration/reference, tests, and the small init-marker change. No sync, View, recipe, export, or event changes.

Do not combine this with the log-helper prune PR; that unit has a different claim and independent review.

## Adoption evidence and go/no-go criteria

Proceed only if at least one real journey is intended in the near term:

- a founder wants to browse a real bundle on GitHub/editor from `index.md`;
- a founder sends a bundle or installed recipe to another person/agent without live explanation and the index materially improves orientation;
- npm-first usage demonstrates that bundle-native navigation is needed before a skill is present.

The design is a **go** when:

- recursive completeness and hand-authored refusal can stay within the two units above;
- a real bundle's generated output is useful enough to keep rather than immediate noise;
- the generated diff is stable and compact;
- the command remains explicit and local-first.

It is a **no-go**—and the prune task should proceed—if safe ownership requires managed-section parsing, per-directory configuration, a new export system, automatic mutation hooks, or an event backbone before one useful bundle can be navigated.

## Decision for the sibling prune task

[`tasks/prune-regenerate-index-api`](../tasks/prune-regenerate-index-api.md) should be **rewritten after product approval**, not canceled and not executed as currently scoped.

Its revised claim should be:

> Replace the unused, unsafe whole-file `readIndex`/`regenerateIndex` API with a governed portable-index projection: prune `readIndex`, introduce a pure recursive planner, protect unmarked indexes, and add one explicit local CLI consumer in separately reviewed units.

Until that decision, leave the task `todo`. Do not wire the current helper into any command and do not delete it in the log-prune PR.

## Non-goals

- automatic writes after document mutation;
- generation from `sync`, `home`, session start, list, or any read path;
- bundle-wide transactional snapshots;
- an event journal, replay cursor, or event-backbone prerequisite;
- a new package;
- a general export/package system;
- replacing `list`, query, Views, or the bundle graph;
- storing indexes as concept docs or making them Kinds;
- forcing every bundle to use generated indexes;
- silently converting curated indexes;
- remote CLI generation in the first slice;
- managed generated regions inside hand-authored indexes without demand evidence.

## Final judgment

The feature is worth preserving and shaping because it advances one of AgentState's strongest differentiators: structured agent-managed knowledge that remains useful as ordinary portable text. The implementation should remain small because the product promise is small: "make this bundle navigable anywhere, on explicit request, without risking my curated files."

The decisive architecture move is not keeping the current high-level helper. It is separating deterministic rendering from governed ownership and making one explicit consumer prove the value. If that proof does not happen, prune the dormant API. If it does, `index.md` becomes a modest but meaningful bridge between AgentState's live structured system and the tool-independent Markdown world.

[supports distribution-neutral resources](../roadmap-items/distribution-neutral-resources.md)

[constrains change-surface simplification](../roadmap-items/change-surface-simplification.md)

[motivated by coherence drift audit](../tasks/coherence-drift.md)
