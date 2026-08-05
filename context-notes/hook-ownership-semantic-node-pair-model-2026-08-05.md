---
type: Context Note
title: Hook ownership semantic Node-pair model after cf3b8ab review
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T23:40:09.584Z'
---
# Summary

The cf3b8ab whole-language review proves the repaired lexical envelope is closed, but exposes a second provenance layer: decoded tokens that are lexically canonical still do not prove that a Node launcher and package entry were generated together. The current generic absolute-Node fallback accepts an npm-shaped package under one prefix with Node under another, granting destructive ownership to a command no writer emits.

Ultimate goal: make agentstate-lite installable and self-orienting without ever claiming or deleting host configuration it did not generate.

Proximate goal: make semantic layout classification preserve the writer source and install-authority relationships after lexical provenance is proven. This serves the ultimate goal by requiring generated provenance at both the shell spelling and runtime/package pairing layers.

## Whole system

The hook writer first chooses a distribution layout: durable npm-package installation uses the resolved persistent npm authority, with the stable runtime at the same npm prefix as the absolute package entry; local-dev and marketplace layouts use their separately enumerated absolute runtime/package shapes. It then serializes that argv through the closed shell-token writer. Claude and Codex store the string, while OpenCode stores generated source derived from the same lifecycle policy.

The recognizer must therefore prove two independent facts in order: the raw shell string belongs to the exact current or historical lexical envelope, and the decoded argv belongs to one exact writer layout with all required relationships intact. Status, install reconciliation, deduplication, and uninstall share the resulting classifier. A semantic false positive is destructive across every host even when lexical parsing is perfect.

The failing counterexample pairs /opt/runtime-a/bin/node with /opt/npm-b/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs. Both tokens look individually plausible and the command is lexically canonical, but no npm writer can produce the cross-prefix pair. The stableNpmRuntimePair authority already owns the required same-prefix proof; the generic absolute-Node fallback bypasses it.

## Invariants and repair boundary

1. An npm-shaped package entry is current only when stableNpmRuntimePair proves the Node launcher and package entry derive from the same durable npm prefix.
2. The generic absolute-Node branch may recognize only the explicitly enumerated local-dev and marketplace layouts; it must never act as a fallback for an npm-shaped entry.
3. Local-dev, marketplace, npm current, and historical forms remain disjoint semantic alternatives after lexical validation. Failure of the relevant alternative returns unmanaged rather than falling through to a broader rule.
4. Cross-products of valid Node launchers and package entries from different authorities are foreign through pure classification and built Claude, Codex, and OpenCode status/install/uninstall, with byte-identical preservation.
5. Every current writer fixture and enumerated historical fixture remains recognized, so tightening semantic provenance does not strand configuration the product genuinely wrote.

The repair should change the owning classifier rather than add a special-case path comparison in uninstall. Review must re-run the mismatched-prefix counterexample across all consumers and confirm no broader fallback can reacquire it.

[diagnoses](../tasks/hook-compatibility-ownership.md)

[extends](hook-ownership-shell-system-model-2026-08-05.md)
