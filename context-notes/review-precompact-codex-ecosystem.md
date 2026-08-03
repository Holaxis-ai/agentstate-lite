---
type: Context Note
title: 'Cognitive-ecosystem review: multi-session pre-compaction handoffs'
actor: codex-precompact-ecosystem
timestamp: '2026-08-03T16:56:05.080Z'
---
# Summary

status: completed
verdict: fail

Ultimate goal: make agent work durable, conflict-safe, and human-visible across sessions in a plain-text local-first bundle.

Proximate goal: independently assess whether revision 2 makes pre-compaction handoffs survivable, legible, and low-intervention; this serves the ultimate goal by preventing context loss and wrong-session restoration at the exact boundary the product exists to protect.

Adoption reading: revision 2 is a credible Claude-Code-scoped prototype, but it is not yet an adoption-ready cognitive-ecosystem design. The exact-id fast path and guarded fallback are sound directions. The failure is in the remaining contract surface: critical invariants are split across global prose, two hook sketches, raw YAML, and agent judgment, while the handoff payload itself does not require enough information to guarantee a faithful or diagnosable restoration. "Fail" means revise before adoption, not reject the architecture.

# Issues

1. severity: high
   description: The handoff payload is not a sufficient session-boundary contract. The only governed body requirement is `# Summary`; the injected template asks for proximate goal, loaded skills, active task ids, current state, and next step, but not the reasoning/evidence behind decisions, constraints/non-goals, open questions/blockers, last completed action, confidence/assumptions, or an exact re-entry command. The fallback guard assumes concrete task/goal prose makes a wrong note detectably different. Two concurrent sessions can work on the same task with the same actor/machine/role and produce lookalike summaries; if only one candidate remains after a lost or colliding handoff, count=1 is not evidence that it belongs to the resumed transcript. Observable behavior: a resumed agent can answer "what/where/next" superficially while contradicting a prior constraint, or silently accept another session's plausible-looking note.
   location: `designs/pre-compact-multi-session`, decisions (b) and (e), the proposed write-side CLAUDE.md bullet, and the `# Summary` heredoc.
   principle_or_test: P02 representation; P04 what/where/next/blockers/how-to-act; P11 reasoning/constraints/open-questions survival; P12 semantic-error containment.
   smallest_proportionate_change: Make the hook scaffold a short fixed decision card: goal and task refs; last completed/current state; decisions with evidence or source links; constraints/non-goals; blockers/open questions; loaded skills; exact next action/command. Add non-secret session discriminators already available at the hook boundary (for example transcript-path hash, cwd/worktree/branch, and session start) and require the guard even for a single fallback candidate.

2. severity: high
   description: There is no single executable authority for the lifecycle. Required fields and semantics live in global prose; the bundle's actual Context Note convention allows only title/timestamp plus description/tags and `# Summary`; `promote` is used to bypass that validation; PreCompact and PostCompact duplicate the key algorithm; expiry filtering and candidate selection are agent-side; role and actor require manual substitution. Observable behavior: malformed handoffs still write successfully, the two hooks can drift, a newly resumed agent must reconstruct query/filter/delete policy from prose, and bundle-only consumers cannot discover or validate the contract. This cuts against the product's own claim that recipes declare structure and hooks own operational moments.
   location: `designs/pre-compact-multi-session`, decision (e), proposed global CLAUDE.md changes, proposed `pre-compact.sh` and `post-compact.sh`, and current `conventions/context-note`.
   principle_or_test: P01 reusable scaffolding; P03 semantic locality; P05 validated/retractable primitive; P07 discovery through use; P11 standardized handoff.
   smallest_proportionate_change: Centralize deterministic mechanics in one executable helper called by both hooks, and declare the artifact shape bundle-locally (a Session Handoff convention/recipe, or a validated Context Note extension plus reference). The helper may remain private to the hook pilot. A public `aslite handoff` verb is optional only if this equivalent single authority exists; as written, some helper-level tooling is not optional for low-intervention correctness.

3. severity: medium
   description: `role` and `actor` are not actionable identity inputs. The hook can infer sub-agent versus main from a non-empty `agent_id`, but cannot infer orchestrator; `role: orchestrator` therefore depends on memory or a human edit. The fallback query uses `actor=<me>`, but the design does not define the exact value when `AGENTSTATE_LITE_ACTOR` is absent; the no-id sketch falls back to `unknown`, which collapses sessions again. `machine` is actionable for the stated Claude host-local scope, and `session_id` is actionable only after the live payload/stability proof.
   location: decisions (a), (b), and (d), NEW-3, and proposed hook fallback.
   principle_or_test: P04 how-to-act; P06 legibility; P08 structural role differentiation; P11 verifiable current context.
   smallest_proportionate_change: Define one session-start designation channel consumed by the helper (for example a session-role environment value or session-id-to-role registration), require/resolve one actor value mechanically, store the resolved values, and print them in the post-compact context. Keep role advisory, but do not make correct discovery depend on an unstated manual edit.

4. severity: medium
   description: The cleanup story conflates expiry-as-filter with garbage collection, while immediate hard deletion removes the best forensic artifact. No mechanism in the design deletes abandoned expired notes; they stop winning fallback queries but remain in the bundle. Conversely, consume deletes the current bytes with no receipt or promotion check. The observed handoff `context-notes/pre-compact-main-6cc651d1` contains "open threads NOT yet captured elsewhere"; under the proposed lifecycle, restoring and immediately deleting such a note can erase unique reasoning and leaves no easy record of which note was restored or why a candidate was rejected.
   location: decision (c), especially "Notes ... are GC'd by expires" and delete-on-consume.
   principle_or_test: P05 knowledge ratchet; P06 traceability/debugging; P11 boundary survivability; P04 stale-state legibility.
   smallest_proportionate_change: Separate stop, consume, and physical GC. Retain a consumed note or compact receipt through a short diagnostic window with `consumed_at`, consumer/session, and outcome; delete only after unique content is linked/promoted and the window expires. Make the same helper perform bounded expired-note cleanup. If physical GC is deliberately omitted, call expiry a query stop-rule rather than GC.

5. severity: medium
   description: `id8` does not meet the review phase's collision-free criterion when a stable identifier exists. The first eight characters are only a 32-bit prefix, and the sketch slices rather than validates/sanitizes the source. The risk is small for one user's seven-day working set, but using the full UUID or a longer normalized digest has negligible operational cost and removes an avoidable invariant exception.
   location: decision (a) and both hook key computations.
   principle_or_test: P02 identity representation; P12 blast-radius containment; acceptance gate "collision-free behavior when a stable session id exists."
   smallest_proportionate_change: Use the full normalized session/agent UUID in the key, or a collision-resistant digest plus the full id in frontmatter; reject or safely encode path-unsafe identifiers.

6. severity: medium
   description: The load-bearing fast-path assumption remains unverified at the actual boundary. Command-level write/list/delete tests are useful but do not prove that main-session `session_id` is non-empty in both PreCompact and PostCompact, remains the same across compaction and fresh-process resume, or that the injected write completes before compaction. The design names this gap honestly, which is a strength, but adoption cannot treat it as a caveat after rollout.
   location: "The load-bearing assumption", "What I could NOT verify", and "What was tested".
   principle_or_test: P05 oracle before promotion; P07 real-use evidence; P11 boundary survivability.
   smallest_proportionate_change: Make a live, two-concurrent-main-session compaction/resume proof a pre-adoption gate; include one sub-agent case, missing/empty-id cases, duplicate PostCompact delivery, and a red probe that deliberately changes the id. Record the observed payload fields and outcome in the bundle.

7. severity: low
   description: The 20KB design lacks a top-level adoption card. A first-time operator must read the change history, assumption, decisions, and proposed changes to discover the current verdict, blocking proof, exact next action, and rollback boundary.
   location: top of `designs/pre-compact-multi-session`.
   principle_or_test: P04 progressive disclosure; P06 operator oversight.
   smallest_proportionate_change: Add a 10-line card: purpose, current status, fast path, degraded path, known blocker, required pre-adoption proof, next owner/action, non-goals, and rollback.

# Survived attacks

- The primary exact-id read is the right mechanism: when a stable session id exists, it removes recency guessing and isolates concurrent main and sub-agent sessions.
- Revision 2 correctly retracts rev 1's invalid generic write path and empirically proves raw `promote`, projected custom-field queries, and idempotent delete against the built CLI.
- The no-id case is no longer overclaimed. The design explicitly distinguishes wrong-restore protection from unavoidable handoff loss under same-actor/same-machine concurrency.
- Human choice when identity is genuinely unavailable is proportionate. The issue is not escalation itself; it is insufficient discriminators and manual query mechanics. Ambiguity should stop automation.
- Machine scoping is coherent for the explicitly Claude-Code-local transcript model, and Codex/OpenCode portability is correctly left unverified.
- The design reconsidered its framework after the rev-1 failure rather than patching the prior assumption. That is good P09 behavior.
- Links among task, design, research, skeptical review, and user-notice precedent make the decision trail discoverable.
- Deferring a new public CLI surface until a real compaction dogfood is proportionate. The public verb can remain deferred if one smaller executable helper owns the pilot invariants.

# Recommendation

recommendation: revise

Required before adoption:

1. Replace the free-form summary instruction with the bounded decision-card template and stronger session discriminators.
2. Create one executable lifecycle authority used by both hooks and one bundle-local declaration of the handoff shape. This can be a private hook helper for the pilot; it need not yet be a public `aslite handoff` command.
3. Mechanize actor and role resolution, use a full/normalized session identity, and make fallback output show concrete discriminators.
4. Replace immediate unrecorded deletion with a short-lived consume receipt/retention and real bounded cleanup, or explicitly narrow the claim if physical GC is deferred.
5. Run and record the live concurrent compaction/resume acceptance gate before Brian relies on the fast path.
6. Add the top-level adoption card.

After those changes, the design is likely suitable for a Claude-Code-scoped pilot. Codex/OpenCode should remain out of the supported claim until their session identity and transcript locality are empirically established.

# Confidence

confidence: high

The assessment is based on the complete revision-2 design, task, canonical research taxonomy/evidence, prior skeptical review, project core goal, current Context Note convention, related user-notice design, current global hook/CLAUDE instructions, and an observed real pre-compaction handoff. I did not modify code, the design, hooks, user-global files, or task status, and did not sync.

# Notes

Tensions:

- P06 legibility versus cleanup: delete-on-consume is operationally simple, but the cost of losing the only boundary trace is higher than retaining a short-lived receipt.
- P05 lock-in versus P07 discovery: a full public command is premature before the live hook proof, but a single private helper is the minimum safe pilot scaffold.
- P03 semantic locality versus operational timing: hooks correctly own the boundary event; the bundle should still own the artifact's declared shape and references.
- Reliability versus surface area: the cost of one small helper/template is lower than recurring agent/human reconstruction at every compaction, while a full new public subsystem is not yet proportionate.

Assumptions:

- Scope is the design's stated Claude Code path first; no portability guarantee is inferred.
- Advisory actor/role fields are coordination metadata, not security identity.
- A human-authored semantic summary is unavoidable; only its structure and mechanical metadata should be automated.
- The observed current handoff is evidence of likely payload richness, not proof every future agent will write one that rich without scaffolding.

Skill feedback: none. The cognitive-ecosystem skill's tests were applicable without ambiguity; the findings are defects or tensions in this design, not in the skill.

Exact bundle note id: `context-notes/review-precompact-codex-ecosystem`.

Progress: review complete; recommendation recorded; no implementation or synchronization performed.
