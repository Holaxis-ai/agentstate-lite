---
type: Context Note
title: Hook ownership shell-system model after repeated interventions
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T21:15:31.469Z'
---
# Summary

After three repair rounds in the PR #207 hook-ownership area, the failure pattern is structural: the recognizer has been treating a shell command string as if decoded token text alone proved the argv that a host shell will execute. Unicode escapes, pathname globs, and brace expansion each exposed a different way that assumption fails. Another character-by-character blacklist patch would leave the model incomplete.

Ultimate goal: make agentstate-lite installable and self-orienting without ever claiming or deleting host configuration it did not generate.

Proximate goal: define one closed generated-command language whose writer and recognizer agree before the next repair. This serves the ultimate goal by making destructive uninstall authority a proof of generated provenance, not a resemblance heuristic.

## Whole system

### Components and interactions

1. `sessionStartHookCommand` is the writer for shell-string hosts. It converts an argv vector into a command string through `generatedShellArg`: tokens matching the explicit safe alphabet `[A-Za-z0-9_@%+=:,./-]+` are emitted unquoted; every other token is POSIX single-quoted through `shellArg`.
2. Claude and Codex store that string plus an exact host shape (location, matcher, type, ten-second timeout). OpenCode receives an argv-safe generated plugin but shares the same ownership lifecycle.
3. `tokenizeGeneratedHookCommand` is not a general shell parser. It must recognize only strings the writer or an explicitly enumerated historical writer could have emitted.
4. `classifyHookCommand` applies semantic layouts to those tokens: stable absolute Node/npm pairs are current; exact historical bare/direct/npx forms are stale or path-bound; everything else is unmanaged.
5. `classifyHookEntry` combines command provenance with the exact generated host shape.
6. Status, install reconciliation/deduplication, `hookNeedsUpdate`, and uninstall all consume that one classifier. A false negative is recoverable duplication/staleness; a false positive grants mutation authority and can delete a foreign command.
7. At execution time the host passes the stored string to a platform shell. Shell quote removal, expansion, splitting, and control syntax occur before the executable sees argv. The recognizer must therefore preserve enough lexical provenance to prove the executed argv equals the classified argv.

### Ordering and external state

- Install classifies existing host files before replacing/deduplicating owned entries.
- Uninstall classifies before filtering entries and rewriting settings. There is no later confirmation after shell interpretation; classifier correctness is the destructive boundary.
- External state is user-owned Claude/Codex JSON and OpenCode plugin content. Foreign or malformed state must survive byte-identically.
- Shell behavior differs across `/bin/sh`, Bash, and zsh. The generated language cannot depend on guessing which expansions happen to be enabled on one machine.

## Invariants

1. Writer output is always recognized under the exact intended host shape.
2. Recognized token text must equal the argv a supported host shell executes.
3. Only the writer's explicit unquoted alphabet may appear unquoted. This is an allowlist, not a growing blacklist: it excludes control/operators, substitutions, comments, pathname/brace/tilde/history expansion, future shell syntax, and ambiguous escapes by construction.
4. Values outside that alphabet are owned only when expressed through the exact supported quote grammar. Quoted literal `*`, `?`, brackets, braces, spaces, and Unicode remain literal and may be recognized when their decoded path matches an enumerated managed layout.
5. Exact token count, executable layout, subcommand, location, matcher, entry type, and timeout are all necessary; none alone proves ownership.
6. Any tokenizer uncertainty returns unmanaged. Mutation safety takes precedence over recognizing a hand-authored equivalent.

## Diagnostic conclusion and next repair

The writer already defines the closed unquoted alphabet in `generatedShellArg`. The recognizer should reuse or mirror that single exported predicate instead of accepting every character except an expanding blacklist. This structurally rejects `{}`, `*`, `?`, `[]`, `#`, `~`, `!`, and other unquoted shell-active or future-ambiguous characters while retaining exact quoted literals and the bare generated tokens.

The repair must add a taxonomy test, not only brace examples:

- every character outside the writer's unquoted alphabet is rejected when unquoted;
- representative shell-expansion families (parameter/command/arithmetic, operators/redirection, comments, pathname, brace, tilde/history, quotes/escapes) are foreign through pure classification and built uninstall;
- the same literal characters in exact supported single/double-quoted forms remain recognized only when the resulting tokens match an enumerated generated layout;
- a writer/recognizer property table proves every generated current and historical fixture round-trips;
- Claude/Codex settings containing each foreign class remain byte-identical with `changed:false`.

The architectural question for the repair team is: given this closed writer language and destructive lifecycle, can any stored string outside the exact writer/historical grammar still reach an owned classification after a supported shell transforms it? The next review should attack that whole question rather than ask only whether braces were added to a denylist.

[diagnoses](../tasks/hook-compatibility-ownership.md)
