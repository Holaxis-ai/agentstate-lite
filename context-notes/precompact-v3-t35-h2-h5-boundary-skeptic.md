---
type: Context Note
title: Revision 3 T3.5 H2-H5 boundary skeptic review
actor: codex-t35-h2-h5-skeptic
timestamp: '2026-08-04T18:10:54.992Z'
---
# Summary

Status: **complete**.

Verdict: **FAIL**.

Confidence: **0.98**.

`builder_task_eligible: false`

The option-1 direction remains plausible, and this boundary correctly removes the deliberately absent H1 action. The exact boundary is not yet safe to hand to a builder, however. A normal check/action race can make one of the new requester or fixture clients act after its foreground server has disappeared; the retained v5 premise is intentionally too narrow to cover every such new vector. The boundary also does not mechanically isolate H2 from controller-side action results, and its late-child protocol has no legal zero-survivor teardown when a new-PGID child fails to establish the record required for signaling. These are boundary defects, not implementation details that may be invented inside an 800-line script.

# Exact reviewed inputs

- Task claim input: `tasks/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:05dfeb5ac6ae2f77222098c7f64be988e909ea95b0193d183df8d7430758062b`; claimed by CAS as `codex-t35-h2-h5-skeptic`.
- Decision: `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`.
- Boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`.
- Retained v5 Research: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Retained v5 audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.
- Circuit breaker (current exact local version): `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker@sha256:2e450eec67f062100164259a34a575412031f45b31ecac14addacc42e4e7cd6e`.

# Isolation statement

This was an independent static falsification review. I did not read or communicate with the product/acceptance reviewer, execute tmux or any host probe, inspect live processes or retained private-root files, use Claude/auth/network actions, run tests, modify repository code, modify a Plan/parent task/shared handoff, or sync the board. The only mutations are my CAS task claim, this uniquely owned review note, and my terminal task update.

# Load-bearing adversarial traces

## A. Live validation does not prevent an absent-target action

1. Server A is the exact owned foreground process and its owned socket generation passes the required fresh PID/start/uid/PGID/comm/binary and lstat checks.
2. After that observation returns but before requester A, requester B, or a fixture client reaches its tmux action, the foreground server exits or crashes. Its direct-handle close event has not yet been delivered to the controller.
3. The released client therefore acts against an actually absent target even though the immediately preceding sampled precondition was exact-live.
4. The boundary's absolute rule—no fresh tmux vector whose target is absent—is now false. Classifying the resulting oracle FAIL does not undo the action.
5. E1 does not close this trace. The retained audit permits only the narrow observed late `-N ... new-session` and `-N ... kill-server` facts. The new read-only PID-query vector is not that exact retained vector, and the future H4 fixture vector is not immutable until a script exists. Treating all preregistered `-N` commands as covered would silently promote v5 beyond its audit.
6. The controller has no causal envelope over a hypothetical server created by such a new absent-target client; its original client handle is not ownership of a detached server. This recreates the containment class that triggered the circuit breaker.

Fresh validation is a sampled check, not a causal liveness lease. The repaired boundary must either provide an exact containment/non-daemonization argument for every new vector under this race, explicitly expand and review the retained premise, or weaken the impossible "target is live at action" claim into an honest sampled precondition with a separately safe race outcome. A builder cannot choose among those architectural meanings.

## B. H2 can receive the withheld result through the controller

1. The one script's controller necessarily receives the action child's exit/signal/close events and raw stdout/stderr in order to retain them.
2. The boundary restricts H2's formal argument and says the outputs are not used *by its classifier*, but it does not forbid the controller from branching on those bytes/statuses before choosing, scheduling, or serializing the observation transcript passed to H2.
3. A conforming-looking implementation can therefore pass one set/order of valid raw observations when output is expected and another when it is not. H2 sees only its allowed one argument, yet that argument encodes the withheld result.
4. JavaScript arity is also not authority isolation: a named function in the same script can read a closure/module/global holding action receipts unless the source contract forbids and statically checks that dataflow.

The boundary needs a fixed, result-independent observation schedule and a mechanically reviewable sealing/dataflow rule covering controller conditioning and closure/global access, while still allowing only the terminal events that are legitimate preconditions. This is necessary to make “discarded-result observability” falsifiable rather than a naming convention.

## C. A late new-PGID child can be detected but not legally contained

1. A pane begins creating its declared marked child near FENCE; the child is already a separate process/new PGID and is not a direct child of the controller.
2. The child must establish its create-only self record *before* checking the monotonic abort marker. Its record write stalls, is partial/malformed, or fails in a caught path, so the full signaling anchor never exists.
3. The controller closes/kills the pane creator and passive inventory later sees the child or its private-root token.
4. H5 correctly cannot return PASS, but the controller is also forbidden to signal this child: signaling requires the complete self record plus controller validation, and audit-only PID adoption is prohibited.
5. The abort marker cannot help while the child has not reached its post-record check. There is no controller-owned handle or parent-retained teardown contract that guarantees the child exits.

Thus the protocol can turn a primary failure into an unowned survivor/manual-cleanup dependency, which the boundary expressly bans. The repair needs a causal direct-handle teardown owner spanning child creation through record validation, or an equally explicit fail-closed record-writer mechanism that cannot leave an independently living child before it checks the fence.

## D. Static authoring still requires unreviewed scope policy

The required protected snapshot is defined as the “previously accepted Claude/Codex/OpenCode/AgentState/npm/handoff scope,” but no exact versioned path/bounds/schema artifact for that universe is an input to this boundary. The “exact feature worktree” is pinned by branch/SHA but not by an exact path or deterministic resolution rule. Consequently two builders can produce different protected universes and both claim compliance. Under the 800-line cap, this is precisely the kind of omitted policy a builder would have to invent silently. The boundary must pin the snapshot authority and resolution inputs, not merely require an output called exact.

# Attacks that the boundary did survive

- Requester B cannot be released before requester A's original handle close, both EOFs, and exact identity/group absence under the stated ordering.
- A changed or replacement socket generation is not adopted as process proof and cannot legally be unlinked as the owned generation; it makes H5 fail.
- Observation-helper timeout/error/malformed/multiple-row output cannot be converted into absence; the stated algebra makes it FAIL.
- H4's unsafe server-first primary finding is latched before containment, and fallback cleanup is not allowed to overwrite it.
- A registered server, pane, marked child, helper, PID, or PGID survivor cannot make H5 PASS under the stated terminal predicates.
- The decision and H5 text keep E1's audit limitations visible and prohibit claiming that passive H5 freshly reproves no-autostart.

# Required next gate

Revise the exact boundary to close traces A-C and pin the protected-snapshot/worktree authority. Then send the new exact version through fresh independent product/acceptance and adversarial review. Do not create a builder task from the reviewed version.

[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-skeptic.md)
