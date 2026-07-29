---
type: Context Note
title: Claude bridge diagnostic result at 77c84e4
actor: codex-pr177-followup
timestamp: '2026-07-29T23:16:41.334Z'
---
# Summary

Claude Desktop loaded the unique diagnostic resource and rendered the live Roadmap graph on the first invocation. The outer App reported `visibilityState=visible` at shell boot (43 ms), App connection start (43 ms), and connection completion (64 ms). The screenshot showed the exact diagnostic fingerprint, an active Expand control, and authoritative live graph counts: 20 Roadmap Items, 153 contains-edges, and 242 Tasks.

Server logs confirm the complete app-only path: resource read and model-visible `show_view` completed at 23:12:41; app-only tool calls began at 23:12:43; the initial burst completed; then one-second polling continued. This is the traffic absent from the earlier stalled launch under `ui://agentstate/view-host/v1.html`.

# Diagnostic conclusion

The initially-hidden hypothesis is not the cause of Brian's Claude Desktop field failure: the exact diagnostic outer shell was visible from its first executable instruction and the registered child established its bridge normally.

The evidence now points to stale host reuse under the mutable resource URI as the field cause:

- the earlier exact-server launch used the long-lived `ui://agentstate/view-host/v1.html` identity and stalled with no app-only call;
- MCP Apps hosts may preload/cache the UI resource named in tool metadata;
- byte-distinct outer shells had advertised that same identifier since the shell was introduced;
- the unique diagnostic identity forced the exact diagnostic shell to load and the bridge immediately worked;
- an earlier ChatGPT run had independently displayed text that existed only in older shell bytes under the same URI.

The diagnostic build also carried telemetry, so the final causal/acceptance isolation is the reviewed uninstrumented production build whose URI is derived from its exact HTML bytes. It must reproduce this first-load success in Claude before the bug task closes.

# Separate lifecycle finding

The browser investigation proved a different real defect: if an already-authorized durable payload is received while the outer document is already hidden and no post-mount hidden event occurs, current code executes the one-shot child, drops its bridge messages at the hidden gate, and has no suspension marker for visible recovery.

That ordering exactly reproduces the loading placeholders in a host-shaped harness, but this Claude trace proves it was not Brian's field ordering. It is tracked separately as `tasks/mcp-app-hidden-authorized-first-mount` and must not be described as the root cause of the stale-resource incident.

# Goals and status

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in supported MCP hosts.

Proximate goal: make each exact App shell discoverable under an immutable identity and independently close the proven hidden-first-mount lifecycle gap. This serves the ultimate goal by fixing the observed cache failure without discarding a distinct safety-relevant defect discovered during diagnosis.

Status: diagnostic gate passed; production implementation is ready for scope separation, independent review, QA, and exact-SHA Claude acceptance.

[tracks cache bug](../tasks/claude-desktop-durable-bridge-initialization.md)

[tracks lifecycle bug](../tasks/mcp-app-hidden-authorized-first-mount.md)

[probe provenance](claude-bridge-probe-provenance-77c84e4.md)
