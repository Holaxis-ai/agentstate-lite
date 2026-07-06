/**
 * The terminal screen for a tripped interceptor (plans/ui-v1.md rev 3.2): a 401 or 429 stops
 * every poll in the app and replaces the whole view — never a banner over stale data, since
 * stale task state under a dead session is actively misleading.
 */
import { useEffect, useState } from "react";
import type { InterceptorStatus } from "../query/interceptor.js";

interface UiConfig {
  mode: "dir" | "remote";
  remoteUrl: string | null;
}

/** Best-effort read of the ui server's own local (non-wire-protocol) bootstrap endpoint — see `packages/cli/src/ui/server.ts`'s `/__ui/config`. Never throws; falls back to `null` so this screen always renders something. */
function useUiConfig(): UiConfig | null {
  const [config, setConfig] = useState<UiConfig | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/__ui/config", { credentials: "same-origin" })
      .then((res) => (res.ok ? (res.json() as Promise<UiConfig>) : null))
      .then((c) => {
        if (!cancelled) setConfig(c);
      })
      .catch(() => {
        /* best-effort — the screen below has a sensible fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return config;
}

export function ReloginScreen({ kind }: { kind: Exclude<InterceptorStatus, "ok"> }) {
  const config = useUiConfig();
  const remoteUrl = config?.remoteUrl ?? "<url>";
  const command = `agentstate-lite login --remote ${remoteUrl} --api-key <key>`;

  if (kind === "rate_limited") {
    return (
      <div className="relogin-screen" role="alert">
        <h1>Rate limited</h1>
        <p>Too many requests reached the remote recently. Polling has stopped. Reload this page after a moment.</p>
      </div>
    );
  }

  return (
    <div className="relogin-screen" role="alert">
      <h1>Sign-in required</h1>
      <p>Your API key was rejected or has expired. Polling has stopped — re-authenticate from a terminal, then reload:</p>
      <pre><code>{command}</code></pre>
    </div>
  );
}
