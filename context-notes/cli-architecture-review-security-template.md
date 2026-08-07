---
type: Context Note
title: CLI architecture review — security template proposal
actor: security-reviewer
timestamp: '2026-08-07T14:02:23.595Z'
---
# Summary

Phase 1 produced a reusable security rubric and a critique of the current architecture-review plan. It deliberately contains no packages/cli findings. The proximate goal is to make later security review complete, reproducible, and safe to hand off; this serves the ultimate goal by protecting the local-first, conflict-safe CLI boundary through reusable review scaffolding.

The template should force a reviewer to model assets, actors, trust boundaries, invariants, attack paths, and distribution artifacts before assigning findings. Every required domain must be marked reviewed, not applicable with a reason, or deferred with a stated blocker. Severity, confidence, and evidence are independent dimensions.

# Reusable security review contract

## Scope header

Record the exact source revision, build mode, artifact identity, package/runtime versions, supported deployment modes, reviewer, date, and exclusions. Separate source review from built/distributed artifact review. State whether probes used scratch data only, whether network access was disabled, and whether any environment limitations reduced assurance.

Inventory:

- assets: user content, credentials, authorization decisions, local configuration, executable hooks/views/plugins, bundle integrity/history, filesystem and git state, network endpoints, build/publish identity;
- actors: invoking user, same-user local process, untrusted bundle author/content, remote peer/server, browser origin/page, package/build contributor, dependency or registry attacker;
- trust boundaries: argv/stdin/environment/config, bundle and host filesystem, subprocesses, network/client-server, browser/iframe/postMessage, credential store, generated/build artifacts, package registry;
- privileged or irreversible sinks: file overwrite/delete, config installation, command execution, network request/listen, credential read/write, authorization grant, git mutation/publish, rendering executable content;
- security invariants: properties that must remain true across all supported paths and failure states.

For every externally influenced source and every privileged sink, trace source -> parse -> canonicalize -> validate -> authorize -> side effect -> output. Names such as safe, validated, or canonical are not evidence without the owning implementation and an adversarial check.

# Required coverage

## 1. Validation and canonicalization

Check type, syntax, semantics, size, encoding, Unicode/normalization, duplicate fields, ambiguous serialization, flag/argument boundaries, and error behavior. Verify canonicalization occurs once in the correct identity domain and before authorization or comparison. Test validate-before-decode, decode-after-validate, double decoding, case folding, separator aliases, and parser differentials.

## 2. Filesystem and path boundary

Check containment after canonical resolution; absolute paths, parent traversal, alternate separators/platform prefixes, symlink and hard-link behavior, pre-existing targets, special/reserved files, permissions, atomic replace/create, temporary-file placement, overwrite/delete refusal, and recovery after interruption. Treat lexical prefix checks as insufficient. Include swap races between check and use and root replacement.

## 3. Process boundary

Inventory every child process and executable-resolution path. Prefer argument-vector execution over shell interpretation. Check flag injection, metacharacters, inherited PATH/environment/cwd/file descriptors, loader/runtime selection, executable ownership, signals, timeouts, output bounds, exit-code handling, cleanup, and partial failure. Verify emitted command strings literally when users or agents are expected to execute them.

## 4. Network boundary

Check explicit activation, URL parsing and allowed schemes, userinfo, redirects, DNS/rebinding assumptions, proxy behavior, TLS/auth policy, bind address, Host/Origin/CORS/CSRF controls, per-run tokens, request/response/body limits, timeouts, cancellation, retry/replay semantics, and error redaction. For local servers, loopback binding alone is not a complete browser-origin security model.

## 5. Credentials and secrets

Trace creation, storage location, file/directory mode, scope, lookup precedence, transport, rotation/revocation, and deletion. Check argv, environment, config, logs, structured errors, debug output, crash files, child processes, URLs, and test fixtures for disclosure. Distinguish advisory actor labels from authentication credentials. No probe uses real credentials.

## 6. Authentication and authorization

Identify the authenticated principal and the authority owning each decision. Check default deny, resource/action scoping, confused deputy paths, cross-bundle/session/origin reuse, capability expansion, stale grants, approval binding to exact bytes and declared authority, revocation, and revalidation immediately before and after sensitive actions where state can change. Human confirmation is an authorization event only when its subject, action, target, and version are explicit.

## 7. TOCTOU and concurrency

For each check-then-act sequence, identify mutable state and the serialization primitive. Check CAS version binding, lock scope and ownership, multi-process behavior, bounded retry, ABA-like replacement, stale authorization, symlink swaps, crash leftovers, cancellation, partial completion, idempotent resume, and fail-open/fail-closed choices. Tests that exercise only one event-loop process do not establish cross-process safety.

## 8. Unsafe defaults and failure modes

Check offline/local-first behavior, explicit opt-in to network or publication, loopback-only listeners, refusal before destructive or ownership-changing operations, least authority, overwrite/create-only defaults, untrusted content handling, credential absence, malformed configuration, and degraded dependencies. Errors must not silently select a broader target, weaker authority, or destructive fallback.

## 9. Denial of service and resource bounds

Bound bytes, document/count/depth/cardinality, decompression ratio, archive/file expansion, Markdown/HTML/parser complexity, regular-expression behavior, subprocess and remote output, concurrent requests/jobs, queues, retries, history/list output, and watch/subscription lifetimes. Check slow peers, stalled children, cancellation, cleanup, backpressure, and whether limits apply before large allocation or parsing.

## 10. Supply chain and distribution

Review direct and transitive dependency purpose and pinning, lockfile integrity, lifecycle scripts, build tooling, generated and vendored artifacts, workspace-to-published-package boundaries, tarball allowlists, runtime dependency claims, bundled source maps/secrets, binary entrypoints, Node/runtime floor, version and manifest drift, release provenance, update checks, offline install/use, and rollback/revocation. Exercise the exact installable artifact, not only workspace source.

## 11. Disclosure handling

Before any finding is written to a public board, issue, PR, or review, triage whether it is exploitable by someone other than the victim and present on main. If yes, record only a redacted routing note publicly and move technical detail to the private security-advisory path. Disclosure routing depends on exploitability and release state, not on severity label. Redact secrets, tokens, live paths, and weaponizing detail from probe transcripts.

# Attack and evidence method

1. Build an entrypoint/boundary/sink matrix and mark each row reviewed, not applicable with rationale, or deferred with blocker.
2. State an attack hypothesis and the security invariant it tries to violate.
3. Trace reachability end to end, including alternate public surfaces that share the same contract.
4. Run bounded probes only in disposable scratch environments with synthetic data; never target production, real credentials, or third-party systems.
5. Record exact revision/artifact/environment, preconditions, inputs, expected secure behavior, observed behavior, cleanup, and limitations.
6. Probe both negative and positive controls so a passing test is known to exercise the intended boundary.
7. Record false positives and survived attacks; a survived attack narrows uncertainty but is not proof that a class is absent.
8. Recheck material findings after revision changes; evidence against another SHA is historical, not current.

# Finding and assurance conventions

## Finding record

Each finding must contain: ID and status; title; domain and violated invariant; affected revision/artifact/surfaces; asset; actor and prerequisites; trust boundary and entrypoint; attack hypothesis; complete causal trace; evidence mode and grade; expected versus observed behavior; impact and blast radius; severity with rationale; confidence with rationale; uncertainties and false-positive checks; recommendation; validation/regression strategy; and disclosure lane.

Statuses: candidate, confirmed, refuted, accepted risk, fixed pending validation, fixed/validated, or not applicable. Candidates are not conclusions.

## Evidence mode and grade

- Mode: reasoned, empirical, or hybrid.
- E0: pattern or hypothesis without an end-to-end trace. Keep as candidate only.
- E1: exact source/test/artifact references with a complete causal trace and explicit assumptions.
- E2: E1 plus a deterministic bounded reproduction, regression test, fault injection, or artifact-level probe with expected/observed results.
- E3: E2 independently reproduced or enforced by a stable automated gate on the exact revision/artifact.

All published findings require at least E1. Critical/high findings should reach E2 before final publication when a safe probe is possible; otherwise state why and preserve uncertainty. An E3 gate can prove only the states it exercises.

## Severity

Severity combines impact, attacker reach/exposure, required privileges and interaction, affected scope, persistence, and recoverability:

- critical: low-complexity compromise with broad catastrophic confidentiality, integrity, or availability impact, such as arbitrary code execution, broad credential compromise, or unrecoverable widespread destruction;
- high: substantial unauthorized access, boundary escape, destructive integrity loss, or credential compromise under feasible conditions;
- medium: meaningful but bounded impact, significant prerequisites/user interaction, unsafe default, or reliable denial of service in a supported mode;
- low: limited impact, difficult preconditions, or defense-in-depth weakness with a concrete security property at stake;
- informational: hardening or clarity issue without a demonstrated security impact.

Severity is not confidence. Do not lower severity merely because confidence is low; report both.

## Confidence

- high: end-to-end path is established with no material unknown, normally by E2/E3 or convergent independent evidence;
- medium: causal path is strong but one material assumption, environment, or reachability step remains unresolved;
- low: plausible hypothesis or partial trace with substantial uncertainty.

## Survived attack and false-positive records

A survived-attack record includes hypothesis, targeted boundary/invariant, exact scope, method, negative and positive controls, observed safe behavior, evidence grade, and residual coverage limits. A false-positive disposition cites the invalidated premise and evidence; it is not silently deleted because it teaches future reviewers which pattern was misleading.

# Critique of the current plan and acceptance criteria

Strengths: the workflow protects divergent independence, requires exact-draft review before freeze, freezes the rubric before package review, preserves disagreements, includes QA, and already requires false positives and survived attacks in the parent acceptance criteria.

Blocking gaps before template freeze:

1. Covers security is not measurable and names no mandatory domains or N/A rationale.
2. No required assets/actors/trust-boundary/data-flow/invariant artifact precedes findings.
3. No entrypoint-to-sink coverage matrix or completeness rule prevents selective review.
4. Severity, confidence, evidence mode/grade, candidate lifecycle, and finding schema are unspecified.
5. The target source revision and built/distributed artifact identity are not required.
6. Public-disclosure prohibition is a constraint but not an explicit pre-write triage gate.
7. QA verifies high/medium findings but sets no minimum evidence for every published finding and no safe-probe guardrails.
8. Authentication/authorization, TOCTOU, unsafe defaults, resource bounds, and distribution/supply-chain behavior are not explicit acceptance items.
9. No rule distinguishes unsupported/frozen surfaces, supported no-auth-by-design modes, and true security gaps.
10. No requirement tests the same security property across all public surfaces sharing a contract.

Proposed acceptance additions:

- Security template contains all required domains above; each is reviewed, N/A with rationale, or deferred with blocker.
- A threat model and entrypoint/boundary/sink matrix exist before findings.
- Exact source revision and exact built/distributed artifact are recorded.
- Every finding uses the mandatory schema, is at least E1, and separates severity from confidence.
- Critical/high findings receive a safe bounded E2 probe where feasible; exceptions are explicit.
- Disclosure triage occurs before any public persistence of technical detail.
- Survived attacks and refutations include controls and residual limits.
- Template approval blocks if a relevant high-risk boundary is deferred or a mandatory coverage row lacks evidence.
- Shared security contracts are checked through every public adapter or are proven to have one owning primitive plus agreement tests.

# Suggested phase-2 probes

After the template is approved, inventory argv/stdin/environment/config, bundle paths, git subprocesses, hook and skill installers, remote client/server, loopback UI, browser/View/MCP bridges, credentials, update checks, recipes/promoted HTML, generated assets, and npm artifacts. Probe path traversal and symlink swaps; PATH/environment/flag injection; URL/redirect/Host/Origin/token behavior; credential permission and redaction; exact-byte approval and stale-authorization races; cross-process CAS/lock/crash recovery; large or slow input/output and cancellation; and tarball allowlist/runtime-dependency/build-identity drift. These are hypotheses for later testing, not current findings.
