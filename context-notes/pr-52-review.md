---
type: Context Note
title: 'PR #52 review'
actor: codex
timestamp: '2026-07-13T17:17:13.397Z'
---
# Summary

Independent review of PR #52 at exact head
`6e4c7bf07b6f918aae4cae48c585d71782ad98b8` against base
`c92497ae9d9761752a34f9dad9966666f73b5d93` found four actionable issues.
Verdict: changes requested.

## Findings

1. High: prototype-looking enum fields are accepted by the new parser but the
   enforcement boundary is not own-key safe. `validateAgainstKind` and
   `isTerminal` read `fm[field]`, and `new` assigns dynamic keys with ordinary
   bracket assignment. End-to-end reproduction: a declared required
   `__proto__` enum whose allowed value is `[object Object]` lets
   `new ... --__proto__ payload` report success while the persisted document
   contains no `__proto__` field.
2. Medium: `kind field remove` deletes required/optional/values and ordinary
   field descriptions but leaves `fields.value_descriptions.<field>`. The next
   registry load warns that the description field has no enum declaration; the
   stale guidance can reactivate if the enum is re-added.
3. Medium: `KindFields.valueDescriptions` is required in the exported
   TypeScript interface even though the feature is optional and runtime
   consumers already use `?? {}`. A pre-PR `KindConvention` literal fails with
   TS2741 after upgrading. The external package proof was edited to add an
   empty value solely to keep compiling, masking rather than testing additive
   compatibility.
4. Low: the new map-shape checks accept nested JS `Date` instances as maps
   because `isPlainObject` only excludes null and arrays. The repository's real
   YAML parser produces nested Dates for unquoted ISO values; both outer and
   per-field malformed `value_descriptions` date shapes are silently omitted
   with zero warnings, contrary to the PR's precise-warning contract.

## Recommendations

- Centralize own-property reads for required, enum, and terminal fields and use
  a prototype-safe setter for dynamic frontmatter keys. Add built-CLI tests for
  missing and explicitly supplied `__proto__`, `constructor`, and `toString`.
- Teach the existing `kind field` mutation to remove value descriptions when
  the field is removed and prune entries when `--values` removes enum members,
  while preserving malformed raw structures under the existing lenient policy.
- Make `valueDescriptions` optional in `KindFields`; parsed conventions may
  continue normalizing absence to `{}`.
- Require an actual record/map prototype for the new outer and inner maps, and
  add raw-YAML date-shape warning tests.

## Verification

- `npm run build`: passed.
- Focused core kinds: 44/44 passed.
- Focused CLI kinds/recipes/UI pages: 98/98 passed outside the sandbox.
- UI bridge: 34/34 passed.
- Full `npm run check`: exit 0, including package proof, skill check, and 14/14
  Playwright gate tests.
- Additional compatibility and malformed-YAML probes reproduced findings 3
  and 4. Built-CLI probes reproduced findings 1 and 2.

The first focused run used a bad shared `node_modules` symlink that resolved
workspace imports to `main`; those failures were discarded. Dependencies were
copied into the isolated worktree, the head was rebuilt, and every trusted test
result above comes from the corrected setup.

One reviewer also raised exact leading/trailing whitespace preservation. It was
not retained as a finding because trimming is the existing canonical behavior
for sibling guidance metadata and the PR tests explicitly encode it; exact text
preservation would need to be stated as a separate contract.
