/**
 * PageFrame (tasks/ui-pages-spike): render one bundle page in a sandboxed iframe and broker its
 * bridge. The iframe is `sandbox="allow-scripts"` with NO `allow-same-origin`, so it runs at an
 * opaque origin — it cannot fetch the data API even if a token leaked, and its scripts talk to the
 * shell ONLY via postMessage. This component:
 *   1. Resolves the page's registry doc -> its `entry` blob key -> a minted nonce URL (the `src`),
 *      and its declared `access` capability (fail-closed via core's `resolveDeclaredAccess`; the legacy `bridge` spelling is no longer read).
 *   2. Listens for the page's postMessage requests, VALIDATING `event.source` is this iframe, and
 *      brokers v0 reads through {@link handleBridgeRequest}; `bundle-propose` may additionally
 *      prepare one v1 action for explicit confirmation in trusted shell chrome.
 *   3. Fans SSE doc changes into the subscribed page as bridge `change` events, and HOT-RELOADS the
 *      iframe (fresh nonce) when the page's own HTML blob changes.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { getDoc, listAllHeads, ApiError } from "../api/client.js";
import {
  cancelTrustedAction,
  commitTrustedAction,
  mintPageNonce,
  prepareTrustedAction,
  fetchConfig,
  fetchKinds,
  fetchEdges,
  invalidateKinds,
  resolvePageTarget,
  type ActionConfirmation,
} from "../api/pages.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import { handleBridgeRequest, changeMessage, type BridgeDeps } from "../pages/bridge.js";
import { parseRegisteredPage, type BridgeCapability } from "../pages/registry.js";
import { navigate } from "../routing.js";
import { setInterceptorStatus } from "../query/interceptor.js";
import { actionError, actionReply, parseActionBridgeMessage } from "../pages/actions.js";

const bridgeDeps: BridgeDeps = {
  config: fetchConfig,
  query: ({ type, prefix }) => listAllHeads({ type, prefix }),
  read: (docId) => getDoc(docId).then((r) => r.doc),
  kinds: fetchKinds,
  edges: fetchEdges,
  resolvePage: resolvePageTarget,
};

const ACTION_CONFIRMATION_ARM_MS = 500;

interface PendingAction {
  seq: number;
  requestId: string;
  approvalToken?: string;
  confirmation?: ActionConfirmation;
  inFlight: boolean;
}

function scalarLabel(value: string | number | boolean | null): string {
  return value === null ? "(not set)" : JSON.stringify(value);
}

export function PageFrame({ pageId }: { pageId: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const subscribedRef = useRef(false);
  // The framed page's ENFORCED capability, read by the bridge broker below (never trusting
  // anything the sandboxed page itself sends). Fail-closed: starts (and, on revoke, reverts to)
  // "none" so no in-flight bridge message is ever answered while no page is confirmed loaded.
  const bridgeCapabilityRef = useRef<BridgeCapability>("none");
  // A shell navigation consumes the currently framed document's right to navigate. Unlike the
  // async-load epoch below, this remains locked while that old iframe can still post messages.
  const navigationConsumedRef = useRef(false);
  // The generation owned by the currently keyed iframe DOM node. Ref assignment happens before
  // child scripts execute, so startup bridge requests are accepted; advancing loadSeq invalidates
  // the still-mounted old document immediately.
  const activeFrameSeqRef = useRef<number | null>(null);
  // Bumped on every (re)load trigger, revoke, and unmount — a resolution that finishes after a
  // newer one started (or after a revoke) must not clobber the newer state.
  const loadSeqRef = useRef(0);
  const launchIdRef = useRef<string | null>(null);
  const pendingActionRef = useRef<PendingAction | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [frameSeq, setFrameSeq] = useState<number | null>(null);
  const [entryKey, setEntryKey] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(pageId);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ActionConfirmation | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionArmed, setActionArmed] = useState(false);

  const discardPendingAction = useCallback(() => {
    const pending = pendingActionRef.current;
    pendingActionRef.current = null;
    setConfirmation(null);
    setActionBusy(false);
    setActionArmed(false);
    if (pending?.approvalToken) void cancelTrustedAction(pending.approvalToken).catch(() => {});
  }, []);

  // A hostile View controls when this dialog appears. Keep both predictable button targets inert
  // long enough that the click which triggered the proposal (or its immediate follow-up) cannot
  // become accidental confirmation in trusted shell chrome.
  useEffect(() => {
    if (!confirmation) {
      setActionArmed(false);
      return;
    }
    const timer = window.setTimeout(() => setActionArmed(true), ACTION_CONFIRMATION_ARM_MS);
    return () => window.clearTimeout(timer);
  }, [confirmation]);

  const ownFrame = useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;
    if (!node) return;
    if (frameSeq !== null && frameSeq === loadSeqRef.current) {
      activeFrameSeqRef.current = frameSeq;
      navigationConsumedRef.current = false;
    }
  }, [frameSeq]);

  // P1 (doc-lifecycle revocation): tear the frame down to an explicit terminal state — the
  // sandboxed iframe unmounts, so its bridge access ends WITH its registry doc, not after it.
  const revoke = useCallback((reason: string) => {
    discardPendingAction();
    loadSeqRef.current++;
    subscribedRef.current = false;
    bridgeCapabilityRef.current = "none";
    launchIdRef.current = null;
    setSrc(null);
    setFrameSeq(null);
    setEntryKey(null);
    setError(reason);
  }, [discardPendingAction]);

  /**
   * Resolve registry doc -> entry key -> nonce URL and (re)load the frame. The ONE path for
   * initial mount, registry-doc change (which may RETARGET `entry`), and blob hot-reload — so a
   * reload always re-reads what the doc currently declares and re-mints against the live registry.
   */
  const loadPage = useCallback(async () => {
    discardPendingAction();
    const seq = ++loadSeqRef.current;
    // Pre-revoke IMMEDIATELY, synchronously, before the async getDoc/mint round-trip below. This
    // is the ONE entry point every re-resolution path shares (mount, page switch, a live
    // registry-doc change, blob hot-reload, resync), so the OLD capability/subscription can never
    // survive past this line: a bridge request arriving during the async gap below is answered
    // fail-closed (denied), never under a grant this reload is already in the middle of revoking
    // — closes the window where a live `bundle-read` -> `none` edit left the stale grant standing
    // through the getDoc/mint round-trip (P1).
    subscribedRef.current = false;
    bridgeCapabilityRef.current = "none";
    launchIdRef.current = null;

    // getDoc is split from the mint below because ONLY its 403 is trip-worthy: `/v0/*` has no
    // other 403 source than this ui server's own session gate, so a 403 here is ALWAYS a dead
    // session (most commonly a stable-port restart minting a fresh secret out from under this
    // open tab's cookie) — imperative, not TanStack-managed, so `queryClient.ts`'s
    // `onQueryError` never sees it; trip the SAME global interceptor directly (see
    // `interceptor.ts`'s doc comment).
    let loaded: Awaited<ReturnType<typeof getDoc>>;
    try {
      loaded = await getDoc(pageId);
    } catch (e) {
      if (seq !== loadSeqRef.current) return;
      subscribedRef.current = false;
      bridgeCapabilityRef.current = "none";
      setSrc(null);
      setFrameSeq(null);
      setEntryKey(null);
      if (e instanceof ApiError && e.status === 403) setInterceptorStatus("session_expired");
      setError(e instanceof Error ? e.message : String(e));
      return;
    }

    try {
      const { doc } = loaded;
      const registered = parseRegisteredPage(pageId, doc.frontmatter);
      if (!registered) throw new Error(`page '${pageId}' is not a usable registered Page`);
      const minted = await mintPageNonce(pageId);
      if (seq !== loadSeqRef.current) return;
      subscribedRef.current = false;
      bridgeCapabilityRef.current = registered.bridge;
      launchIdRef.current = minted.launchId;
      setEntryKey(registered.entry);
      setTitle(registered.title);
      setError(null);
      setFrameSeq(seq);
      setSrc(minted.url);
    } catch (e) {
      if (seq !== loadSeqRef.current) return;
      subscribedRef.current = false;
      bridgeCapabilityRef.current = "none";
      launchIdRef.current = null;
      setSrc(null);
      setFrameSeq(null);
      setEntryKey(null);
      // mintPageNonce's 403 is NOT trip-worthy like getDoc's above: `/__page/mint` also 403s
      // (code FORBIDDEN) when this doc's `entry` is a confinement violation — outside `pages/`,
      // or not any Page doc's registered entry (server.ts's `handleMint`) — a malformed-DOC
      // problem, not a dead session. The launcher doesn't filter entries by prefix, so such a
      // doc is clickable; tripping the terminal recovery screen for it would brick the whole tab
      // with the WRONG advice over what's really just a dismissable per-view error.
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [discardPendingAction, pageId]);

  // Resolve registry doc -> entry key -> nonce URL on mount / page switch. The bridge-capability
  // reset now happens unconditionally at the TOP of loadPage itself (every re-resolution path
  // shares it), so this effect only owns the page-SWITCH UX: blank the frame immediately so a
  // newly-selected page never shows the outgoing page's stale content while it resolves.
  useEffect(() => {
    subscribedRef.current = false;
    setSrc(null);
    setFrameSeq(null);
    setError(null);
    void loadPage();
    return () => {
      discardPendingAction();
      loadSeqRef.current++;
    };
  }, [discardPendingAction, loadPage]);

  // Broker page->shell bridge requests. v0 remains read-only; v1 may only prepare a trusted,
  // human-confirmed action and never receives the launch id or approval token.
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      const frame = iframeRef.current;
      if (!frame || ev.source !== frame.contentWindow) return;
      if (activeFrameSeqRef.current !== loadSeqRef.current) return;
      // Capture the epoch AND the capability at RECEIPT — the request is decided under whatever
      // grant this iframe held the instant it asked. `handleBridgeRequest`'s dep calls are async,
      // so a slow reply must be FENCED against a LATER reload before it's delivered: the SAME
      // framed document can be replaced by reload/hot-reload/page-switch while that work is in
      // flight, so without this check a reply computed for the OLD page could cross the revoke
      // boundary (P1).
      const seq = loadSeqRef.current;
      const capability = bridgeCapabilityRef.current;

      const actionMessage = parseActionBridgeMessage(ev.data);
      if (actionMessage !== null) {
        const post = (reply: Record<string, unknown>): void => {
          if (seq === loadSeqRef.current && frame.contentWindow) frame.contentWindow.postMessage(reply, "*");
        };
        const raw = ev.data as { id?: unknown; requestId?: unknown };
        if (!actionMessage.ok) {
          if (typeof raw.requestId === "string") {
            post(actionReply(raw.requestId, { status: "rejected", action: "document.set-field", message: actionMessage.message }));
          } else {
            post(actionError(typeof raw.id === "string" ? raw.id : undefined, actionMessage.message));
          }
          return;
        }
        if (capability !== "bundle-propose") {
          if (actionMessage.message.type === "action.propose") {
            post(actionReply(actionMessage.message.requestId, {
              status: "rejected",
              action: "document.set-field",
              message: "this View does not declare access: bundle-propose",
            }));
          } else {
            post(actionError(actionMessage.message.id, "this View does not declare access: bundle-propose"));
          }
          return;
        }
        if (actionMessage.message.type === "read-versioned") {
          const readMessage = actionMessage.message;
          void getDoc(readMessage.docId).then(
            (result) => post({ bridge: "v1", id: readMessage.id, type: "read-versioned:result", result }),
            (error) => post(actionError(readMessage.id, error instanceof Error ? error.message : String(error))),
          );
          return;
        }

        const requestId = actionMessage.message.requestId;
        if (pendingActionRef.current) {
          post(actionReply(requestId, { status: "rejected", action: "document.set-field", message: "this frame already has a pending proposal" }));
          return;
        }
        const launchId = launchIdRef.current;
        if (!launchId) {
          post(actionReply(requestId, { status: "revoked", action: "document.set-field", message: "the frame launch is no longer current" }));
          return;
        }
        const pending: PendingAction = { seq, requestId, inFlight: true };
        pendingActionRef.current = pending;
        void prepareTrustedAction(launchId, actionMessage.message.action).then(
          (result) => {
            if (seq !== loadSeqRef.current || pendingActionRef.current !== pending) {
              if (result.status === "prepared") void cancelTrustedAction(result.approvalToken).catch(() => {});
              return;
            }
            if (result.status === "prepared") {
              pending.approvalToken = result.approvalToken;
              pending.confirmation = result.confirmation;
              pending.inFlight = false;
              setActionBusy(false);
              setActionArmed(false);
              setConfirmation(result.confirmation);
              return;
            }
            pendingActionRef.current = null;
            post(actionReply(requestId, result));
          },
          (error) => {
            if (seq !== loadSeqRef.current || pendingActionRef.current !== pending) return;
            pendingActionRef.current = null;
            post(actionReply(requestId, { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) }));
          },
        );
        return;
      }

      void handleBridgeRequest(ev.data, bridgeDeps, capability).then((outcome) => {
        if (seq !== loadSeqRef.current) return; // frame reloaded/revoked since receipt — drop it
        if (outcome.openPageId) {
          if (outcome.openPageId === pageId) return;
          if (navigationConsumedRef.current) return;
          // End this source generation before changing history. Concurrent outcomes captured
          // under it then fail the fence above and cannot navigate a second time.
          navigationConsumedRef.current = true;
          loadSeqRef.current++;
          discardPendingAction();
          subscribedRef.current = false;
          bridgeCapabilityRef.current = "none";
          launchIdRef.current = null;
          navigate({ view: "page", id: outcome.openPageId });
          return;
        }
        if (outcome.subscribed) subscribedRef.current = true;
        if (outcome.reply && frame.contentWindow) frame.contentWindow.postMessage(outcome.reply, "*");
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [discardPendingAction, pageId]);

  // Live: push doc changes to the subscribed page; REVOKE when this page's registry doc is
  // removed (P1 — an open frame must not keep reading through the bridge after its page is
  // deleted); re-resolve on a registry-doc change (which may retarget `entry`); hot-reload on
  // this page's own blob change.
  useEffect(() => {
    return subscribeToChanges((e) => {
      invalidateKinds([...e.docs.changed.map((c) => c.id), ...e.docs.removed]);
      const frame = iframeRef.current;
      if (subscribedRef.current && frame?.contentWindow && (e.docs.changed.length > 0 || e.docs.removed.length > 0)) {
        frame.contentWindow.postMessage(changeMessage(e.docs.changed, e.docs.removed), "*");
      }
      if (e.docs.removed.includes(pageId)) {
        revoke("This page's registry doc was removed from the bundle — the page has been closed.");
        return;
      }
      if (e.docs.changed.some((c) => c.id === pageId) || (entryKey !== null && e.blobs.changed.some((b) => b.key === entryKey))) {
        void loadPage();
      }
    });
  }, [entryKey, pageId, loadPage, revoke]);

  // P1 (connection resilience): the SSE stream carries NO replay — anything that changed during a
  // gap never arrives as a delta. On reconnect, re-resolve and RELOAD the frame outright: the page
  // re-queries on boot (full catch-up), a registry doc deleted during the gap lands in the revoked
  // state (getDoc fails), and a changed blob comes back as fresh bytes.
  useEffect(() => {
    return subscribeToResync(() => {
      invalidateKinds(); // anything may have changed during the gap, conventions included
      void loadPage();
    });
  }, [loadPage]);

  const settleConfirmation = useCallback(async (decision: "commit" | "cancel") => {
    const pending = pendingActionRef.current;
    if (!actionArmed || !pending?.approvalToken || pending.inFlight) return;
    pending.inFlight = true;
    setActionBusy(true);
    const seq = pending.seq;
    try {
      const result = decision === "commit"
        ? await commitTrustedAction(pending.approvalToken)
        : await cancelTrustedAction(pending.approvalToken);
      if (seq !== loadSeqRef.current || pendingActionRef.current !== pending) return;
      pendingActionRef.current = null;
      setConfirmation(null);
      setActionBusy(false);
      iframeRef.current?.contentWindow?.postMessage(actionReply(pending.requestId, result), "*");
    } catch (error) {
      if (seq !== loadSeqRef.current || pendingActionRef.current !== pending) return;
      pendingActionRef.current = null;
      setConfirmation(null);
      setActionBusy(false);
      iframeRef.current?.contentWindow?.postMessage(
        actionReply(pending.requestId, { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) }),
        "*",
      );
    }
  }, [actionArmed]);

  return (
    <div className="page-frame">
      <div className="page-frame-bar">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate({ view: "launcher" })}
        >
          ← Home
        </button>
        <span className="page-frame-title">{title}</span>
      </div>
      {error ? (
        <p className="view-status view-status-error">Could not open page: {error}</p>
      ) : src ? (
        // allow-scripts ONLY — no allow-same-origin: opaque origin, no data-API reach. And NO
        // referrer: the shell's URL (which carried ?token= before the scrub) must never reach the
        // untrusted page as document.referrer (tasks/ui-pages-spike P1).
        <iframe
          key={src}
          ref={ownFrame}
          className="page-frame-iframe"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          src={src}
          title={title}
        />
      ) : (
        <p className="view-status">Opening page…</p>
      )}
      {confirmation && (
        <div className="action-confirmation-backdrop" role="presentation">
          <section className="action-confirmation" role="dialog" aria-modal="true" aria-labelledby="action-confirmation-title">
            <p className="action-confirmation-eyebrow">AgentState confirmation</p>
            <h2 id="action-confirmation-title">Apply this bundle change?</h2>
            <p>
              View <code>{confirmation.source.registryId}</code> proposes changing <strong>{confirmation.target.title}</strong>.
            </p>
            <dl>
              <div><dt>Document</dt><dd><code>{confirmation.target.docId}</code></dd></div>
              <div><dt>Kind</dt><dd>{confirmation.target.kind}</dd></div>
              <div><dt>Field</dt><dd><code>{confirmation.field}</code></dd></div>
              <div><dt>Before</dt><dd><code>{scalarLabel(confirmation.before)}</code></dd></div>
              <div><dt>After</dt><dd><code>{scalarLabel(confirmation.after)}</code></dd></div>
              <div><dt>Actor</dt><dd><code>{confirmation.actor}</code></dd></div>
              <div><dt>Timestamp</dt><dd><code>{confirmation.timestamp}</code></dd></div>
            </dl>
            <p className="action-confirmation-note">The write is conditional on the exact document, View, HTML, and Kind versions shown to the shell.</p>
            <div className="action-confirmation-buttons">
              <button type="button" disabled={actionBusy || !actionArmed} onClick={() => void settleConfirmation("cancel")}>Cancel</button>
              <button type="button" className="action-apply" disabled={actionBusy || !actionArmed} onClick={() => void settleConfirmation("commit")}>
                {actionBusy ? "Applying…" : "Apply change"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
