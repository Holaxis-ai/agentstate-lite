---
type: Context Note
title: 'Review record: access field rename, high-risk tier (2 rounds, exact SHAs)'
actor: claude-main-migrate
timestamp: '2026-07-24T14:32:42.977Z'
---
# Summary

Review record: bridge->access field rename (rounds 1+2, Codex, exact SHAs 850a5dc / fb848c5)

Recorded by the orchestrator on the reviewers' behalf (sandbox EPERM blocked their own board writes).

## Round 1 (850a5dc) — REQUEST CHANGES (incl. P1 prototype-inheritance capability widening)
VERDICT: REQUEST CHANGES

ultimate_goal: Preserve agentstate-lite as one coherent, local-first OKF knowledge system with one owning policy at each security boundary.

proximate_goal: Determine whether commit 850a5dc safely centralizes the transitional `bridge` -> `access` compatibility policy; review complete.

findings:

1. [P1] [EMPIRICAL + REASONED] The legacy fallback is not restricted to a declared own field, so prototype inheritance can widen an access-absent View to `bundle-read` or `bundle-propose`.

   `packages/core/src/page.ts:49` checks own-property presence for `access`, but its fallback is the ordinary property read `frontmatter.bridge`. On the exact reviewed source:

   - `resolveDeclaredAccess(Object.create({ bridge: "bundle-propose" }))` returned `"bundle-propose"` even though `Object.hasOwn(..., "bridge")` was false.
   - After setting `Object.prototype.bridge = "bundle-read"` in an isolated process, `resolveDeclaredAccess({})` returned `"bundle-read"`.

   This contradicts the pair's declared-field/fail-closed contract and turns a prototype-pollution condition or backend-supplied inherited property into a permission grant. Preserve the current `access` precedence, including null/empty fail-closed behavior, but require the legacy `bridge` fallback to be an own property too. Add a regression pin proving inherited/prototype-polluted `bridge` values resolve to `none`.

2. [P2] [EMPIRICAL] The ui-server suite does not exercise the new field through mint/serve/action currentness, and a legacy-only server mutation survives.

   The server fixtures still use `bridge:` only; the CLI's existing mint-and-serve View fixture declares neither field, so it exercises only the default `none` capability. I temporarily changed all three ui-server security call sites to discard `access` before calling the core resolver:

   - mint capability derivation;
   - nonce serve-time revalidation;
   - `launchIsCurrent` trusted-action revalidation.

   All 32 `@agentstate-lite/ui-server` tests still passed (exit 0). Thus the high-risk integration suite cannot detect a regression that makes the new author-facing field ineffective at the server boundary. Add an access-only end-to-end fixture that would fail under that mutation—cover mint, nonce serving/revalidation, and the `bundle-propose` action gate.

3. [P2] [EMPIRICAL] The change publishes a permanent compatibility promise that contradicts the recorded transitional migration decision.

   The commit subject says `legacy name accepted forever`, and its body says runtime honors `bridge` forever. The same newly added promise appears in `packages/core/src/page.ts:45` and in the canonical View convention/authoring sources and their generated copies (`honored forever`, `never need migrating`). The project record instead says: dual-read now, migrate known bundles in phase 2, then remove the fallback in phase 3.

   Amend the commit message and reword every permanence claim introduced by this commit to describe transitional compatibility. Regenerate the npm skill artifacts from their sources and re-run `check:skill`. This review intentionally does not fix the wording.

survived_attacks:

- Builder red-probe: changed `declaredAccessValue()` to prefer an own legacy `bridge`. The focused core resolver test failed (exit 1) on the both-fields precedence pin.
- Independent mutation: replaced `Object.hasOwn(frontmatter, "access")` with truthiness fallback. The focused core resolver test failed (exit 1) on present null `access` plus permissive legacy `bridge`.
- Both mutations were restored with patch reversal because this sandbox cannot create the linked worktree's parent-repository index lock for `git checkout --`. `git diff --exit-code` then confirmed byte identity to `HEAD`; the restored focused core resolver tests passed 4/4.

additional_evidence:

- PRESENT null/empty `access` semantics survived review. Real YAML `access:` parsed as an own null and resolved `none`; `access: ""` also resolved `none`; bridge-only YAML continued to resolve its legacy grant. This is a fail-closed availability downgrade, not a permission widening.
- Whole-tree field-read audit found no remaining direct source consumer outside `declaredAccessValue()`. Other `.bridge` occurrences are normalized internal capability fields, wire-protocol identifiers, tests, or HTML bridge clients. The old direct reads in the committed plugin bundle are in the bot-owned generated artifact that this PR is required not to modify; the merge bot must regenerate it.
- Old-convention probe: a `bridge`-required View convention plus a bridge-only View produced `kind_warnings: 0` and `conformance_debt: 0`.
- New-install probe: the current Review Workflow recipe installed `access` as required and `bridge` as optional with matching enums; `new View ... --access none` wrote an own `access` field and no `bridge`.
- Canonical convention/reference copies were byte-identical by SHA-256. `git diff --check` passed. No `plugins/` or `.claude-plugin/` file changed, and the commit message contains no attribution footer.

gates:

- `npm run build` — exit 0
- `npm run typecheck` — exit 0
- `npm test` — exit 0
- `npm run check:skill -w @holaxis/aslite` — exit 0

environment_note:

- The project bundle was not materialized in this detached review worktree. `aslite status` exited 6 (`NOT_FOUND`), and prescribed board provisioning was blocked by sandbox `EPERM` on `/Users/brian/.agentstate`. Orientation used the already-present local `board` ref read-only; no second bundle or task system was created.
- One post-restoration, non-gate ui-server re-run later received sandbox `EPERM` on `listen(127.0.0.1)` and exited 1 before assertions. The required exact-source root test gate had already exited 0, restoration was byte-verified, and non-socket restored-source tests passed.

## Round 2 (fb848c5) — APPROVE
VERDICT: APPROVE

round1_closure:

- [P1] inherited/prototype-polluted `bridge` or `access` grants capability: CLOSED — EMPIRICAL. Direct calls at `fb848c5` returned `none` for `Object.create({ bridge: "bundle-propose" })`, `Object.create({ access: "bundle-propose" })`, polluted `Object.prototype.bridge`, and polluted `Object.prototype.access`; `declaredAccessValue({})` stayed `undefined`. The prototype was clean afterward. The focused core test file passed 20/20.
- [P2] all three ui-server security call sites could discard `access` while tests stayed green: CLOSED — EMPIRICAL. Three independent discard-`access` mutations were applied and restored. Mint derivation made both access-only HTTP tests fail (2 failures); remote inline serve revalidation made only the remote test fail (1 failure); `launchIsCurrent` made only the dir-mode test fail (1 failure). The restored access-only file passed 2/2, and the full ui-server suite passed 34/34.
- [P2] legacy-field wording promised permanent support: CLOSED — EMPIRICAL/REASONED. `5d04732` changes only Markdown prose, generated prose/copies, the skill-render output string, and a source comment; it changes no runtime expression. Tree-wide searches found no forever/never-migrates claim about the legacy `bridge` field. Remaining matches concern the separate Page-to-View kind/prefix compatibility or unrelated uses of “forever.”

findings: []

residual_seam:

- ACCEPTABLE NOW — EMPIRICAL. Dir-mode nonce serving and the action gate intentionally share `launchIsCurrent`, while remote mode has an inline revalidation branch. Mutating only that inline branch to read legacy `bridge` made the remote access-only test fail while dir mode stayed green. A future legacy-only divergence in the inline branch is therefore caught; no additional test is required for this unit.

prototype_pollution_test_hygiene:

- EMPIRICAL. A scratch `node:test` file forced assertions to throw after assigning each polluted property. In the same process, subsequent tests observed `Object.prototype.bridge` and `Object.prototype.access` absent. The intentional probe exited 1 because of the forced failures, while its final cleanup assertion passed. The scratch file was deleted.

survived_attacks:

- Crafted inherited `bridge` and inherited `access` values did not grant capability.
- Polluted `Object.prototype.bridge` and `.access` did not grant capability and were cleaned in `finally`.
- Each of the three discard-`access` mutations was caught by at least one access-only real-HTTP test.
- The remote inline mutation was isolated from the shared `launchIsCurrent` path and was caught by the remote-specific test.
- After restoring all mutations: `git diff --exit-code` exited 0 and `git status --short` was empty.

gates:

- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 0
- `npm run check:skill -w @holaxis/aslite`: exit 0

goal_progress:

- Proximate goal complete: independently determine whether `fb848c5` closes the prior security, test-sensitivity, and wording findings without leaving an unguarded compatibility path.
- Ultimate-goal link: this prevents a capability-escalation regression from undermining agentstate-lite’s trustworthy local-first knowledge substrate.
- Project-bundle note was not written because this sandbox cannot chmod the required `/Users/brian/.agentstate` state directory; `aslite sync` failed with `EPERM`. Existing board state was read from the checked-out board worktree without creating a second bundle.
