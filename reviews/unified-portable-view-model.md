---
type: Review
title: 'Review: one portable View model'
actor: openai/codex-reviewer
timestamp: '2026-08-01T20:02:25.763Z'
---
# Verdict

**APPROVE THE DIRECTION; REVISE THE EXACT DESIGN BEFORE RATIFICATION.**

The governing product idea in [One portable View model](../designs/unified-portable-view-model.md)
is right: a durable `type: View` registration plus exact HTML entry is one bundle object, while
web and MCP are host adapters that invoke it. This is the cleanest continuation of the shared
registration, launch, bridge, and action authorities already shipped. Generated MCP presentation
should be named a preview, not an MCP-specific durable View.

The current exact draft should not yet replace the accepted roadmap/design authorities. Four
contract points need correction first, and the existing roadmap and task records need explicit
supersession rather than silent drift.

# Findings

## 1. The invariant is right, but “same trust decision” is too strong

The portable invariant should promise the same View ID, registry and entry bytes, requested
`access`, admission policy, bridge semantics, and **authorization subject**. It should not promise
that an approval decision itself travels across hosts, processes, machines, or future remote
principals. The security authority deliberately separates provenance from locally controlled
authorization. Current local web and MCP commands happen to inject the same bundle-scoped local
authorization store, but that is a local product policy, not a portable property of the View.

Likewise, portability does not mean every host supports every access level immediately. Current
MCP durable invocation accepts `bundle-read` only; durable `bundle-propose` remains unsupported.
A host may fail closed on an unsupported capability without creating a new View class. State the
invariant as semantic sameness where supported, plus explicit incompatibility otherwise.

## 2. Removing presentation-based eligibility is correct; removing all presentation guidance is not

`presentation: workspace | inline | adaptive` is not a security boundary. Using it as a hard
catalog eligibility gate makes one durable View artificially disappear depending on host and
conflicts with the proposed host-adapter model. A technically valid, access-supported View should
remain discoverable and invokable in MCP.

There is a real UX concern: a dense workspace dashboard can mount successfully yet be poor inline,
and an unfiltered 20-row catalog can bury useful Views. Preserve presentation intent only as an
optional advisory preference used for ranking, warnings, or initial display mode; never as a
compatibility class. Also reconcile “list every valid View” with a bounded catalog: report total
and truncation, and provide a deterministic continuation or bounded search once bundles can exceed
the first page. Otherwise the catalog still hides Views, just for a different reason.

This change does not widen data authority. Catalog results must still exclude invalid registrations
and Views whose `access` the invoking host cannot support.

## 3. Current dogfood proves a legibility failure, not yet the old promotion-ergonomics hypothesis

The observed cross-bundle agent failure is strong evidence that discovery and authoring guidance
are inadequate: the agent saw `show_view` but did not infer the durable two-object authoring path.
It does not by itself answer the prior design's two questions about repeated ephemeral-to-durable
conversion or deterministic conversion. It therefore cannot honestly be cited as having completed
the accepted roadmap's manual-promotion dogfood gate.

There is nevertheless a sound independent case for a create-only command: View is an executable
representation mechanism recognized by hosts, the blob/registry pair has a structural atomicity
hazard, and `artifact create` is precedent. If the founder explicitly accepts that mechanism-level
exception, record that decision and unblock `tasks/cli-view-create-verb` on that basis—not by
relabeling one discoverability incident as promotion dogfood.

Before implementation, update the old design from `bridge` to `access` and add current active-View
admission validation (size, UTF-8, content type, path grammar) through the same exported authority
used at launch. Preserve blob-first/create-only behavior, collision-safe naming, orphan reporting,
and runtime fail-close. Prefer one CLI noun family (`view list`, `view create`) unless there is a
specific reason to mix `views` with `view create`.

## 4. `render-document` belongs in the shared semantic contract, but not wholly in `view-runtime`

The need is real and already evidenced by copied View-local Markdown renderers and the generated
MCP-only `data-aslite-markdown` path. Both hosts should expose one authoritative document-rendering
semantic rather than teach View authors to ship `mdLite` repeatedly.

However, the exact boundary is underspecified. `view-runtime` currently owns bounded bridge
semantics and imports only Node plus core; `markdown-renderer` owns the bounded Markdown-to-React
security boundary. Making `view-runtime` import React/rendering code would violate the current
package boundary. Keep request validation, authorization, authoritative reread, version capture,
and reply bounds in `BridgeService`; keep Markdown parsing and closed construction in
`markdown-renderer`, supplied through a narrow host-neutral dependency or a separately designed
pure render-result layer.

Freeze the response before implementation: exact version, bounded/truncated status, inert safe
markup, and internal targets represented without raw navigable URLs. Decide how a View consumes
those target IDs without reintroducing unsafe `innerHTML` or a second link resolver. Because this
is a new data-bearing bridge reply, the statement that the security design is adopted “unchanged”
is inaccurate; its broker bounds and adversarial agreement table must be extended.

## 5. The proposal conflicts with accepted records and current implementation in specific ways

- `designs/mcp-durable-view-promotion-discovery`, `tasks/mcp-durable-view-catalog`, and the active
  conversational roadmap currently require `inline|adaptive` eligibility and manual dogfood before
  a compound create decision. The proposal reverses both decisions.
- `designs/view-create` and `tasks/cli-view-create-verb` still use retired `bridge` terminology and
  remain blocked on an explicit founder scope call.
- `tasks/ui-pages-bridge-v1` places Markdown/doc-drawer work in the UI. That work should be
  re-scoped, but shell UI remains responsible for drawer chrome while shared bridge/rendering
  authorities own data and safe document representation.
- Current `origin/main` has `BridgeService`, exact active launches, local authorization, durable
  `show_view({viewId})`, suspension recovery, and shared intrinsic sizing. It does not have
  `list_views`, a CLI View catalog/create command, or a durable `render-document` request.
- `BridgeService` already returns validated `openPageId`, but the MCP shell explicitly rejects it
  as outside the read-only proof. This is a host-adapter gap, not a second View model.
- Generated MCP Markdown currently calls the shared renderer inside MCP presentation
  materialization. Calling it “sugar over the same rendering authority” is a desired end state,
  not current behavior.
- Durable MCP currently supports only `bundle-read`; the design's governed-action parity language
  is therefore aspirational and should be presented as later capability-matrix work.

# Recommended sequence

1. Amend and ratify the invariant: one durable View identity/source/semantics and one trust
   **subject**, with host-local authorization decisions and explicit unsupported-capability failure.
   Update/supersede the conflicting roadmap, design, and task text in the same decision unit.
2. Build one server-side bounded catalog authority and project it through the web launcher, MCP
   `list_views`, and a coherent CLI `view list`. Keep presentation preference advisory; pin
   validity, supported access, count/truncation, ordering, and no-secret projections in agreement
   tests.
3. Rewrite the installed authoring guidance around “durable View” and “preview,” then repeat the
   fresh-agent cross-bundle journey. Separately record the founder decision on the mechanism-level
   `view create` exception. If accepted, implement the already-designed create-only command with
   `access` and current admission checks.
4. Design and security-review `render-document` as an additive shared bridge row, including its
   package seam, exact result schema, bounds, internal-target representation, and red tests. Then
   make generated `data-aslite-markdown` consume that same authority and retire copied parsers as
   each durable View adopts it.
5. Complete MCP `open-page` handling using new target launch/authorization, then add the cross-host
   agreement fixture. Do not treat source approval as target approval.
6. Address durable governed-action parity separately after the read/render/navigation contract is
   stable. Finish with a fresh-agent proof that creates one ID and invokes that exact ID in both
   hosts.

# Review basis

Reviewed proposal version:
`sha256:67d8861c8d35d4e08c42c7b42adaf285417f1b09b7c4c2345e0a0a6bf4f70a6e`.

Compared in full against the cited generative-View, durable promotion/discovery, shared-security,
and `view create` designs; the conversational roadmap; the catalog/create/UI-bridge tasks; and
relevant `origin/main` implementation in core, view-runtime, MCP App, shared Markdown renderer,
UI server, and CLI host wiring.
