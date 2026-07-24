---
type: Context Note
title: 'Review record: migration receipt result sentence (2 rounds, exact SHAs)'
actor: codex-reviewer-receipt
timestamp: '2026-07-24T18:58:18.572Z'
---
# Summary

Review record: migration receipt verdict-sentence unit (2 rounds, Codex, exact SHAs ca1fdb9 / 1a65712). Recorded by the orchestrator.

## Round 1 (ca1fdb9) — REQUEST CHANGES, 1 P1 (32-row truth table)
VERDICT: REQUEST CHANGES

commit: ca1fdb94bab9dcb0d3912f2b00f2934b4a5c9879

findings:

- P1 EMPIRICAL — A warned/refused zero-action receipt can falsely lead with “nothing to
  migrate — no legacy names found” and suppress the warning count.

  `describeReceipt` returns from its no-action branch at
  `scripts/migrate-legacy-view-names.mjs:85-88`; the warning suffix is only added later at
  lines 90-91. I reproduced both dangerous forms through the actual CLI:

  - A customized prior-shipped View convention whose body was hand-edited still declared the
    legacy `bridge` field. Both modes returned
    `nothing to migrate — no legacy names found in 1 doc (all readable)`, although the receipt
    had `convention_swapped: skipped_customized`, `warnings: 1`, and legacy convention content
    remained. The warning says to rerun with `--overwrite-custom-conventions`, so the leading
    verdict answers the owner’s “do I need to run this?” question incorrectly.
  - A readable Page convention plus a current View convention and one unreadable Page-shaped
    document returned
    `nothing to migrate — no legacy names found in 2 docs (1 doc unreadable — see skipped_docs)`
    in both modes, although the readable Page convention was deliberately retained and the
    receipt had `warnings: 2`.

  This is the precise state the new field exists to make interpretable. Keep skip/refusal
  states out of action clauses, but do not use the clean “no legacy names found” verdict for a
  warned refusal. The leading sentence must surface the warning/refusal and avoid claiming a
  clean scan. Add dry/real pins for a warnings-only customized-convention skip and for a
  retained Page convention blocked by an unreadable document.

sentence_truth_table:

The main matrix crossed all reachable nonempty document-counter combinations with convention
swap/deletion independently. Legend: `T` = one type rename, `R` = one field rename, `D` = one
shadowed field drop; `R+D` and `T+R+D` use two changed docs. `swap` is an exact prior-shipped
View convention; `delete` is a current View convention plus one Page convention. Every row was
run through `node scripts/migrate-legacy-view-names.mjs --dir <fixture>` first with
`--dry-run`, then as a real run.

| Document counters | Convention actions | Dry-run result | Real-run result |
|---|---|---|---|
| none | none | nothing to migrate — no legacy names found in 0 docs (all readable) | nothing to migrate — no legacy names found in 0 docs (all readable) |
| none | swap | would swap the View convention | swapped the View convention |
| none | delete | would delete 1 Page convention | deleted 1 Page convention |
| none | swap + delete | would swap the View convention, delete 1 Page convention | swapped the View convention, deleted 1 Page convention |
| T | none | would migrate 1 doc (1 type rename) | migrated 1 doc (1 type rename) |
| T | swap | would migrate 1 doc (1 type rename), swap the View convention | migrated 1 doc (1 type rename), swapped the View convention |
| T | delete | would migrate 1 doc (1 type rename), delete 1 Page convention | migrated 1 doc (1 type rename), deleted 1 Page convention |
| T | swap + delete | would migrate 1 doc (1 type rename), swap the View convention, delete 1 Page convention | migrated 1 doc (1 type rename), swapped the View convention, deleted 1 Page convention |
| R | none | would migrate 1 doc (1 field rename) | migrated 1 doc (1 field rename) |
| R | swap | would migrate 1 doc (1 field rename), swap the View convention | migrated 1 doc (1 field rename), swapped the View convention |
| R | delete | would migrate 1 doc (1 field rename), delete 1 Page convention | migrated 1 doc (1 field rename), deleted 1 Page convention |
| R | swap + delete | would migrate 1 doc (1 field rename), swap the View convention, delete 1 Page convention | migrated 1 doc (1 field rename), swapped the View convention, deleted 1 Page convention |
| D | none | would migrate 1 doc (1 shadowed field drop) | migrated 1 doc (1 shadowed field drop) |
| D | swap | would migrate 1 doc (1 shadowed field drop), swap the View convention | migrated 1 doc (1 shadowed field drop), swapped the View convention |
| D | delete | would migrate 1 doc (1 shadowed field drop), delete 1 Page convention | migrated 1 doc (1 shadowed field drop), deleted 1 Page convention |
| D | swap + delete | would migrate 1 doc (1 shadowed field drop), swap the View convention, delete 1 Page convention | migrated 1 doc (1 shadowed field drop), swapped the View convention, deleted 1 Page convention |
| T+R | none | would migrate 1 doc (1 type rename, 1 field rename) | migrated 1 doc (1 type rename, 1 field rename) |
| T+R | swap | would migrate 1 doc (1 type rename, 1 field rename), swap the View convention | migrated 1 doc (1 type rename, 1 field rename), swapped the View convention |
| T+R | delete | would migrate 1 doc (1 type rename, 1 field rename), delete 1 Page convention | migrated 1 doc (1 type rename, 1 field rename), deleted 1 Page convention |
| T+R | swap + delete | would migrate 1 doc (1 type rename, 1 field rename), swap the View convention, delete 1 Page convention | migrated 1 doc (1 type rename, 1 field rename), swapped the View convention, deleted 1 Page convention |
| T+D | none | would migrate 1 doc (1 type rename, 1 shadowed field drop) | migrated 1 doc (1 type rename, 1 shadowed field drop) |
| T+D | swap | would migrate 1 doc (1 type rename, 1 shadowed field drop), swap the View convention | migrated 1 doc (1 type rename, 1 shadowed field drop), swapped the View convention |
| T+D | delete | would migrate 1 doc (1 type rename, 1 shadowed field drop), delete 1 Page convention | migrated 1 doc (1 type rename, 1 shadowed field drop), deleted 1 Page convention |
| T+D | swap + delete | would migrate 1 doc (1 type rename, 1 shadowed field drop), swap the View convention, delete 1 Page convention | migrated 1 doc (1 type rename, 1 shadowed field drop), swapped the View convention, deleted 1 Page convention |
| R+D | none | would migrate 2 docs (1 field rename, 1 shadowed field drop) | migrated 2 docs (1 field rename, 1 shadowed field drop) |
| R+D | swap | would migrate 2 docs (1 field rename, 1 shadowed field drop), swap the View convention | migrated 2 docs (1 field rename, 1 shadowed field drop), swapped the View convention |
| R+D | delete | would migrate 2 docs (1 field rename, 1 shadowed field drop), delete 1 Page convention | migrated 2 docs (1 field rename, 1 shadowed field drop), deleted 1 Page convention |
| R+D | swap + delete | would migrate 2 docs (1 field rename, 1 shadowed field drop), swap the View convention, delete 1 Page convention | migrated 2 docs (1 field rename, 1 shadowed field drop), swapped the View convention, deleted 1 Page convention |
| T+R+D | none | would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop) | migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop) |
| T+R+D | swap | would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swap the View convention | migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swapped the View convention |
| T+R+D | delete | would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), delete 1 Page convention | migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), deleted 1 Page convention |
| T+R+D | swap + delete | would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swap the View convention, delete 1 Page convention | migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swapped the View convention, deleted 1 Page convention |

Additional edge fixtures:

| Combination | Dry-run result | Real-run result |
|---|---|---|
| clean two-doc bundle | nothing to migrate — no legacy names found in 2 docs (all readable) | nothing to migrate — no legacy names found in 2 docs (all readable) |
| full stock fixture: 7 changed docs, T=4, R=3, D=1, swap, delete, warning=1 | would migrate 7 docs (4 type renames, 3 field renames, 1 shadowed field drop), swap the View convention, delete 1 Page convention; 1 warning | migrated 7 docs (4 type renames, 3 field renames, 1 shadowed field drop), swapped the View convention, deleted 1 Page convention; 1 warning |
| Page convention only; View convention absent | would create the View convention, delete 1 Page convention | created the View convention, deleted 1 Page convention |
| two Page conventions; current View convention | would delete 2 Page conventions | deleted 2 Page conventions |
| customized legacy View convention skipped; zero doc changes; warning=1 | nothing to migrate — no legacy names found in 1 doc (all readable) | nothing to migrate — no legacy names found in 1 doc (all readable) |
| customized legacy View convention overwritten explicitly | would swap the View convention | swapped the View convention; 1 warning |
| occupied `conventions/view`; zero doc changes; warning=1 | nothing to migrate — no legacy names found in 1 doc (all readable) | nothing to migrate — no legacy names found in 1 doc (all readable) |
| one clean readable doc + one unreadable Page-shaped doc | nothing to migrate — no legacy names found in 1 doc (1 doc unreadable — see skipped_docs) | nothing to migrate — no legacy names found in 1 doc (1 doc unreadable — see skipped_docs) |
| T+R+D work plus one unreadable Page-shaped doc | would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop); 1 warning | migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop); 1 warning |
| T+R work, convention swap, Page convention retained, one unreadable doc | would migrate 1 doc (1 type rename, 1 field rename), swap the View convention; 2 warnings | migrated 1 doc (1 type rename, 1 field rename), swapped the View convention; 2 warnings |
| current View convention + readable Page convention retained behind one unreadable doc | nothing to migrate — no legacy names found in 2 docs (1 doc unreadable — see skipped_docs) | nothing to migrate — no legacy names found in 2 docs (1 doc unreadable — see skipped_docs) |
| invalid bridge value; R=1; warning=1 | would migrate 1 doc (1 field rename); 1 warning | migrated 1 doc (1 field rename); 1 warning |

grammar_and_agreement:

- Every positive-action fixture used `would migrate/swap/create/delete` in dry-run and
  `migrated/swapped/created/deleted` in the real run.
- The tenseless nothing-case reads correctly as a state verdict and is appropriate in both
  modes; the defect is its truth predicate in warned/refused states, not its tense.
- `bridge_removed` without `bridge_renamed` produced exactly
  `would migrate 1 doc (1 shadowed field drop)` / its real past-tense counterpart.
- Work plus skipped docs did not repeat the unreadable-doc caveat, but every skip generates a
  warning, so the action sentence ended with `; 1 warning` (or `; 2 warnings` when the Page
  convention was retained). This remained truthful.
- Grep found one receipt-field construction:
  `return { result: describeReceipt(receipt), ...receipt }`. Other `result:` occurrences are
  internal `versionedMutation` outcomes, not receipt sentences. `describeReceipt` is the single
  source.
- Red probe: changed the `types_flipped` inclusion condition from `> 0` to `> 10`. The receipt
  result subset exited 1: the exact dry/real pin failed and the counter-agreement assertion
  failed. Restored the source exactly (`git diff --exit-code HEAD -- <script>` exited 0), then
  the same subset passed 4/4.

compat_and_conventions:

- Mechanically extracted `HEAD^:scripts/migrate-legacy-view-names.test.mjs`; its blob hash was
  `71ff660fe7e3f966c03b7e8464e9b811a59cb939`, exactly matching Git. Ran those unchanged tests
  against the current script blob `bf49803925b8ab103bd58782c9a6ce9c3554b162`: 10/10 passed,
  exit 0.
- The old test file is an exact 27,761-byte prefix of the current 32,946-byte file; all 5,185
  new bytes are appended.
- The commit changes exactly the migration script and its test file. No prior receipt key was
  renamed; the diff adds only the leading `result` field to the returned receipt.
- No co-author, generated-by-AI, or AI-attribution marker was added.
- Final isolated current migration suite: 14/14 passed, exit 0.

gates:

- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 130 (SIGINT after the unpiped gate remained live and silent for several
  minutes following sandbox-caused listener failures; real socket tests consistently failed
  with `listen EPERM: operation not permitted 127.0.0.1`, unrelated to this two-file diff)
- `npm run test:scripts`: exit 1 (all 14 migration tests passed; two unrelated packaging proofs
  failed because npm could not open `/Users/brian/.npm/_cacache/tmp/...` in this sandbox)

review_goal_progress:

The proximate goal was to determine whether every reachable migration receipt at `ca1fdb9`
truthfully tells the next operator what happened and whether action remains. Positive action
and grammar paths passed; warned/refused zero-action states did not, so the goal closes with a
request for changes.

## Round 2 (1a65712) — APPROVE, zero findings
VERDICT: APPROVE

commit: 1a6571283ba398539180a4368527b02a26dad4b4

closure: CLOSED

re-run evidence:

- Real CLI, both modes, customized legacy View convention skipped:
  - dry-run (exit 0): `no changes made, but attention needed — 1 warning: customized View convention skipped (re-run with --overwrite-custom-conventions)`
  - real (exit 0): `no changes made, but attention needed — 1 warning: customized View convention skipped (re-run with --overwrite-custom-conventions)`
  - Both receipts led with `result`, carried one warning, and did not contain `no legacy names found`.
- Real CLI, both modes, readable Page convention retained behind an unreadable doc:
  - dry-run (exit 0): `no changes made, but attention needed — 2 warnings: 1 Page convention retained (1 doc unreadable — see skipped_docs)`
  - real (exit 0): `no changes made, but attention needed — 2 warnings: 1 Page convention retained (1 doc unreadable — see skipped_docs)`
  - Both receipts led with `result`, carried two warnings, and did not contain `no legacy names found`.
- Truly clean, two-doc fixture remained byte-identical to Round 1 in both modes:
  `nothing to migrate — no legacy names found in 2 docs (all readable)`.
- Four sampled Round-1 action rows remained byte-identical:
  - convention swap only: `would swap the View convention` / `swapped the View convention`
  - one type rename: `would migrate 1 doc (1 type rename)` / `migrated 1 doc (1 type rename)`
  - field rename + shadowed drop: `would migrate 2 docs (1 field rename, 1 shadowed field drop)` / `migrated 2 docs (1 field rename, 1 shadowed field drop)`
  - mixed work + swap + delete: `would migrate 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swap the View convention, delete 1 Page convention` / `migrated 2 docs (1 type rename, 1 field rename, 1 shadowed field drop), swapped the View convention, deleted 1 Page convention`
- Edge probes:
  - WORK plus warning retained the action lead and suffix: `would migrate 1 doc (1 field rename); 1 warning` / `migrated 1 doc (1 field rename); 1 warning`.
  - Occupied `conventions/view`, zero action: both modes returned `no changes made, but attention needed — 1 warning: conventions/view occupied by a non-View-governing doc — left untouched`.
  - Extra retained-count probe: two Page conventions behind one unreadable doc produced three warning records and `no changes made, but attention needed — 3 warnings: 2 Page conventions retained (1 doc unreadable — see skipped_docs)` in both modes. The implementation derives `kept` by filtering `receipt.warnings`; no independent Page-convention tally was added.
- Red probe: restoring the parent’s unconditional clean-scan return made the direct migration suite exit 1 with 13 passes and exactly 2 failures:
  - `receipt result: unreadable docs surface in the zero-action verdict, not a clean-scan claim`
  - `receipt result: warned zero-action states never claim a clean scan (review P1)`
  All truly-clean and action tests remained green. After restoring the fix, `git diff --exit-code HEAD` exited 0 and `git status --short` was empty.

findings:

gates:

- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `node --test scripts/migrate-legacy-view-names.test.mjs`: exit 0 (15 passed, 0 failed)
- Requested-gate environmental failures: none
- Orientation-only environmental failure: `aslite sync` exited 1 because the sandbox denied `chmod '/Users/brian/.agentstate'` (`EPERM`). This did not affect the existing board’s read-only orientation, repository probes, or requested gates.
