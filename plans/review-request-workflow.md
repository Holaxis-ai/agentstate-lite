---
type: Plan
title: Review Request workflow
actor: openai/codex
timestamp: '2026-07-12T02:28:01.865Z'
---
# Board-native Review Request workflow

Status: independently reviewed, implemented, and live-tested on 2026-07-12.

## Behavioral claim

One durable `Review Request` record can route a human decision through the shared bundle: a generic Page discovers the request and its evidence, a purpose-built content Page explains the architecture, and the reviewer records the outcome through an attributed agent or CLI update. The Page is a projection, never the workflow authority.

## Review Request Convention

```yaml
type: Convention
title: Review Request
governs: Review Request
path: review-requests/
links:
  reviews design: Design
  reviews task: Task
  reviews roadmap item: Roadmap Item
  explained by: Page
fields:
  required:
    - title
    - status
    - reviewer
    - requested_by
    - question
  optional:
    - decision_summary
    - decided_at
  values:
    status:
      - requested
      - in_review
      - changes_requested
      - approved
      - canceled
  terminal:
    status:
      - approved
      - canceled
sections:
  - Context
  - Requested decision
  - Acceptance criteria
  - Reviewer response
```

Relationship names are target-specific because the current typed vocabulary maps one exact link text to one target Kind. The generic Page groups whatever outbound relationship texts exist; it does not hardcode these names or any instance ids.

The Convention body carries human-readable definitions for every field, status, relationship, and body section today. It must not pretend the planned `fields.descriptions`, `link_descriptions`, or enum-description metadata already exists.

## Lifecycle and authority

```text
requested → in_review → approved
                      ↘ changes_requested → requested
requested / in_review / changes_requested → canceled
```

No transition engine is implied. The requester owns scope, evidence, resubmission, and cancellation. The named reviewer owns the response, `decision_summary`, and review outcome. The executing agent uses truthful actor attribution; `reviewer` and `requested_by` express human roles and do not create authorization. Version history provides provenance, not identity enforcement.

Operational moments:

1. Creation promotes an informal ask into shared durable coordination.
2. Opening the Review Page is the handoff.
3. The review is incomplete until the same record carries the persisted response and status.
4. `approved` and `canceled` are terminal; `changes_requested` remains open.
5. Brian's first use is the generative test before any workflow machinery is added.

## First request

Create `review-requests/kinds-and-descriptions-architecture`:

- title: `Review: Kinds, relationships, and self-describing domain models`
- status: `requested`
- reviewer: `Brian Derfer`
- requested_by: `Michael Collier`
- question: `Does this architecture correctly treat Kinds and relationship vocabulary as the stable domain model, documents and links as changing state, the CLI as the deterministic boundary, and descriptions as the right next semantic extension?`

Links:

- `reviews design`: `designs/self-describing-kinds`, `designs/portable-cognitive-ecosystems`
- `reviews roadmap item`: `roadmap-items/self-describing-domain-models`
- `reviews task`: `tasks/kind-field-descriptions`, `tasks/kind-relationship-descriptions`, `tasks/kind-enum-value-descriptions`, `tasks/kind-section-descriptions-examples`
- `explained by`: `pages-registry/architecture-kinds`

Its body asks Brian to judge the stable-model/changing-state split, relationship glue, CLI boundary, Page boundary, description sequence, missing semantic layers, and the accuracy of Current/Planned/Hypothesis labels.

## Architecture explainer Page

- Registry: `pages-registry/architecture-kinds`
- Blob: `pages/architecture-kinds.html`
- Capability: `bridge: none`

Self-contained, visual, and explicitly labels claims as `Current`, `Planned`, or `Hypothesis`. It covers:

- stable Kind conventions and relationship vocabulary over changing documents, values, links, and artifacts;
- the CLI as deterministic generic action boundary;
- one authority: recipes → Convention docs → one Kind registry → CLI/agents/Pages;
- ownership of Bundle, Kind, relationship, Recipe, CLI, Page, and Skill;
- values: open user-owned state, one semantic authority, local-first, human visibility, bounded trust, promotion out of founder memory, empirical growth;
- why descriptions matter and the capabilities they unlock;
- honest boundaries: descriptions are planned, Pages are read-only, recipe ecosystems and ordered events are not shipped, workflow automation is deferred.

It may hardcode only `pages-registry/reviews` in an `Open review request` navigation button because it is the purpose-built explainer for this review.

## Generic Review Page

- Registry: `pages-registry/reviews`
- Blob: `pages/reviews.html`
- Capability: `bridge: bundle-read`

It hardcodes only `type: Review Request`.

1. Call `Bridge.subscribe(onChange)` before any query and await its acknowledgement.
2. Immediately perform a full reload after the subscription acknowledgement. A change before registration is captured by that reload; a change after registration triggers `onChange`. Bridge v0 has no replay, so query-then-subscribe is forbidden.
3. Query all Review Requests and the open subset.
4. Select the first open request by default, otherwise the newest request; allow local selection.
5. Read the selected request and all outbound edges.
6. Read every unique target document.
7. Group evidence by exact edge text without hardcoded relationship names.
8. For a target of type Page, call `Bridge.openPage(targetId)`; never fetch or embed Page HTML.
9. For ordinary targets, safely render type, title, metadata, and escaped body.
10. Fully reload on every subscribed change.
11. Fence both bootstrap and change-driven asynchronous renders with a generation counter so a slower prior load cannot overwrite a newer selection or state.
12. Show persisted status and response plus instructions to respond through an agent or CLI; expose no fake approval or mutation control.

## Exact response path

The read-only Page does not record the decision. A reviewer or their agent uses one versioned update on the durable request:

1. Read the request and capture its `head_version`.
2. Preserve the existing `Context`, `Requested decision`, and `Acceptance criteria` body sections; fill `Reviewer response` in a complete body-only file.
3. Run one `doc update` setting `status`, `decision_summary`, `decided_at`, and `--body-file`, guarded by `--expected-version` and attributed with the executing agent's truthful `--actor`.
4. If CAS fails, reread, reconcile, and retry; never overwrite a concurrent scope/evidence change.
5. The UI subscription reloads the persisted state and response.

Example shape, with runtime values substituted from the read:

```sh
aslite doc update review-requests/<id> \
  --status approved \
  --decision_summary "<concise outcome>" \
  --decided_at "<ISO timestamp>" \
  --body-file <preserved-body-with-response.md> \
  --expected-version <head-version> \
  --actor <truthful-executing-identity>
```

Brian's real request remains `requested` until Brian actually reviews it. An agent must not set `--actor Brian` merely because Brian is the named reviewer. If Brian's own configured agent records the response, its own identity is truthful; if another participant transcribes a response, that participant remains the actor and the response states its human source.

## Verification

CLI/artifact:

- `kinds` discovers the exact Review Request contract.
- Missing required fields and invalid statuses are rejected in a disposable proof.
- The real request is created through `new "Review Request"` and typed `--link` arguments.
- `link show` proves every evidence edge and `status` adds no malformed Convention, unresolved evidence, or typed-link violations.
- Page registry documents and blobs resolve.
- Static inspection proves the generic Page contains no Brian name or request/artifact id.

Live browser on the real board:

1. Open the generic Page before the real request exists and verify its empty state.
2. Create the request while the Page remains open; subscription must surface it without refresh.
3. Verify roles, question, status, sections, and every linked artifact.
4. Open the dynamically discovered architecture Page.
5. Verify its distinct content and Current/Planned/Hypothesis labels.
6. Browser Back returns to the Review Page.
7. The explainer's button navigates back to Reviews.
8. Verify no approval/mutation control exists.
9. In a disposable copy of the bundle, use a deterministic mock bridge host that delays the `subscribe` acknowledgement, inserts a Review Request during that bootstrap window, then acknowledges. Verify the mandatory post-ack full reload renders the request; this proves the no-replay bootstrap race is closed rather than merely avoided by test timing.
10. In the disposable bundle, create a separate response-proof request, capture its version, preserve its existing body while filling `Reviewer response`, and atomically set its decided fields through the exact CAS command above. Verify the open UI live-refreshes to the decided state and response, earlier body sections remain byte-for-byte present, and `doc history` records the truthful QA actor. Do not mutate Brian's real request.

## Smallest cognitive-ecosystem buildlist

The Convention is the promoted coordination primitive; status and reviewer stabilize the handoff; existing Kind/link validation provides the deterministic substrate; independent artifact review plus CLI and browser probes verify primitive boundaries; the shared request routes human-agent coordination. Defer recipes, writable bridges, transition enforcement, identity authorization, polymorphic links, description implementation, migration/version machinery, and general automation until Brian's use produces evidence that they are needed.

## Implementation record

- Convention: `conventions/review-request`
- Generic Page: `pages-registry/reviews` → `pages/reviews.html`
- Architecture Page: `pages-registry/architecture-kinds` → `pages/architecture-kinds.html`
- First real request: `review-requests/kinds-and-descriptions-architecture`, left `requested` for Brian
- Design review: approved after closing the subscribe/bootstrap race and specifying a CAS-safe response path
- Artifact review: approved after adding full evidence bodies, null-prototype edge grouping, accessible dark-mode contrast, and trailing-only graph-footer elision
- Live board QA: empty state → subscribed request arrival without refresh; eight linked artifacts; full evidence disclosure; dynamic architecture navigation; browser Back/Forward; explainer navigation back to Reviews
- Disposable QA: delayed subscribe acknowledgement proof; adversarial `__proto__` relationship; escaped XSS payloads; missing/invalid Kind rejection; one attributed CAS response update with preserved context and live decided-state refresh

No AgentState source code changed. Brian's actual response is the next operational moment and the generative test for whether this primitive should later become a reusable recipe.
