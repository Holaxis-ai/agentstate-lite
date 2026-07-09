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
import { useEffect, useRef, useState } from "react";
import { getDoc, listAllHeads } from "../api/client.js";
import { mintPageNonce, fetchConfig } from "../api/pages.js";
import { subscribeToChanges } from "../pages/pageEvents.js";
import { handleBridgeRequest, changeMessage, type BridgeDeps } from "../pages/bridge.js";
import { navigate } from "../routing.js";

const bridgeDeps: BridgeDeps = {
  config: fetchConfig,
  query: ({ type, prefix }) => listAllHeads({ type, prefix }),
  read: (docId) => getDoc(docId).then((r) => r.doc),
};

export function PageFrame({ pageId }: { pageId: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const subscribedRef = useRef(false);
  const [src, setSrc] = useState<string | null>(null);
  const [entryKey, setEntryKey] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(pageId);
  const [error, setError] = useState<string | null>(null);

  // Resolve registry doc -> entry key -> nonce URL.
  useEffect(() => {
    let cancelled = false;
    subscribedRef.current = false;
    setSrc(null);
    setError(null);
    void (async () => {
      try {
        const { doc } = await getDoc(pageId);
        const entry = typeof doc.frontmatter.entry === "string" ? doc.frontmatter.entry : "";
        const pageTitle = typeof doc.frontmatter.title === "string" ? doc.frontmatter.title : pageId;
        if (!entry) throw new Error(`page '${pageId}' declares no 'entry' blob key`);
        const url = await mintPageNonce(entry);
        if (cancelled) return;
        setEntryKey(entry);
        setTitle(pageTitle);
        setSrc(url);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageId]);

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

  // Live: push doc changes to the subscribed page; hot-reload on this page's own blob change.
  useEffect(() => {
    return subscribeToChanges((e) => {
      const frame = iframeRef.current;
      if (subscribedRef.current && frame?.contentWindow && (e.docs.changed.length > 0 || e.docs.removed.length > 0)) {
        frame.contentWindow.postMessage(changeMessage(e.docs.changed, e.docs.removed), "*");
      }
      if (entryKey && e.blobs.changed.some((b) => b.key === entryKey)) {
        void mintPageNonce(entryKey).then((url) => {
          subscribedRef.current = false;
          setSrc(url);
        });
      }
    });
  }, [entryKey]);

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
        <p className="board-status board-status-error">Could not open page: {error}</p>
      ) : src ? (
        // allow-scripts ONLY — no allow-same-origin: opaque origin, no data-API reach.
        <iframe ref={iframeRef} className="page-frame-iframe" sandbox="allow-scripts" src={src} title={title} />
      ) : (
        <p className="board-status">Opening page…</p>
      )}
    </div>
  );
}
