/**
 * PageFrame (tasks/ui-pages-spike): render one bundle page in a sandboxed iframe and broker its
 * bridge. The iframe is `sandbox="allow-scripts"` with NO `allow-same-origin`, so it runs at an
 * opaque origin — it cannot fetch the data API even if a token leaked, and its scripts talk to the
 * shell ONLY via postMessage. This component:
 *   1. Resolves the page's registry doc -> its `entry` blob key -> a minted nonce URL (the `src`).
 *   2. Listens for the page's postMessage requests, VALIDATING `event.source` is this iframe, and
 *      brokers them read-only through {@link handleBridgeRequest}.
 *   3. Fans SSE doc changes into the subscribed page as bridge `change` events, and HOT-RELOADS the
 *      iframe (fresh nonce) when the page's own HTML blob changes.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { getDoc, listAllHeads } from "../api/client.js";
import { mintPageNonce, fetchConfig, fetchKinds, invalidateKinds } from "../api/pages.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import { handleBridgeRequest, changeMessage, type BridgeDeps } from "../pages/bridge.js";
import { navigate } from "../routing.js";

const bridgeDeps: BridgeDeps = {
  config: fetchConfig,
  query: ({ type, prefix }) => listAllHeads({ type, prefix }),
  read: (docId) => getDoc(docId).then((r) => r.doc),
  kinds: fetchKinds,
};

export function PageFrame({ pageId }: { pageId: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const subscribedRef = useRef(false);
  // Bumped on every (re)load trigger, revoke, and unmount — a resolution that finishes after a
  // newer one started (or after a revoke) must not clobber the newer state.
  const loadSeqRef = useRef(0);
  const [src, setSrc] = useState<string | null>(null);
  const [entryKey, setEntryKey] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(pageId);
  const [error, setError] = useState<string | null>(null);

  // P1 (doc-lifecycle revocation): tear the frame down to an explicit terminal state — the
  // sandboxed iframe unmounts, so its bridge access ends WITH its registry doc, not after it.
  const revoke = useCallback((reason: string) => {
    loadSeqRef.current++;
    subscribedRef.current = false;
    setSrc(null);
    setEntryKey(null);
    setError(reason);
  }, []);

  /**
   * Resolve registry doc -> entry key -> nonce URL and (re)load the frame. The ONE path for
   * initial mount, registry-doc change (which may RETARGET `entry`), and blob hot-reload — so a
   * reload always re-reads what the doc currently declares and re-mints against the live registry.
   */
  const loadPage = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    try {
      const { doc } = await getDoc(pageId);
      const entry = typeof doc.frontmatter.entry === "string" ? doc.frontmatter.entry : "";
      const pageTitle = typeof doc.frontmatter.title === "string" ? doc.frontmatter.title : pageId;
      if (!entry) throw new Error(`page '${pageId}' declares no 'entry' blob key`);
      const url = await mintPageNonce(entry);
      if (seq !== loadSeqRef.current) return;
      subscribedRef.current = false;
      setEntryKey(entry);
      setTitle(pageTitle);
      setError(null);
      setSrc(url);
    } catch (e) {
      if (seq !== loadSeqRef.current) return;
      subscribedRef.current = false;
      setSrc(null);
      setEntryKey(null);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [pageId]);

  // Resolve registry doc -> entry key -> nonce URL on mount / page switch.
  useEffect(() => {
    subscribedRef.current = false;
    setSrc(null);
    setError(null);
    void loadPage();
    return () => {
      loadSeqRef.current++;
    };
  }, [loadPage]);

  // Broker page->shell bridge requests (source-validated, read-only).
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      const frame = iframeRef.current;
      if (!frame || ev.source !== frame.contentWindow) return;
      void handleBridgeRequest(ev.data, bridgeDeps).then((outcome) => {
        if (outcome.subscribed) subscribedRef.current = true;
        if (outcome.reply && frame.contentWindow) frame.contentWindow.postMessage(outcome.reply, "*");
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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

  return (
    <div className="page-frame">
      <div className="page-frame-bar">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate({ view: "launcher" })}
        >
          ← Launcher
        </button>
        <span className="page-frame-title">{title}</span>
      </div>
      {error ? (
        <p className="view-status view-status-error">Could not open page: {error}</p>
      ) : src ? (
        // allow-scripts ONLY — no allow-same-origin: opaque origin, no data-API reach. And NO
        // referrer: the shell's URL (which carried ?token= before the scrub) must never reach the
        // untrusted page as document.referrer (tasks/ui-pages-spike P1).
        <iframe ref={iframeRef} className="page-frame-iframe" sandbox="allow-scripts" referrerPolicy="no-referrer" src={src} title={title} />
      ) : (
        <p className="view-status">Opening page…</p>
      )}
    </div>
  );
}
