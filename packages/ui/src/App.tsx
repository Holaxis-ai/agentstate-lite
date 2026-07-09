/**
 * App shell: mounts the ONE global interceptor gate (plans/ui-v1.md rev 3.2) in front of whichever
 * view the URL names. The pages-spike (tasks/ui-pages-spike) makes the LAUNCHER the landing: it
 * lists the bundle's `type: Page` docs and frames the chosen one in a sandboxed iframe. The paused
 * Board view stays routable (`?view=board`); doc/admin/graph remain phase-C stubs that fall back to
 * the launcher rather than crash a deep link.
 */
import { useSyncExternalStore } from "react";
import { getRoute, subscribeToRoute, navigate } from "./routing.js";
import { useInterceptorStatus } from "./query/interceptor.js";
import { ReloginScreen } from "./views/ReloginScreen.js";
import { Board } from "./views/Board.js";
import { Launcher } from "./views/Launcher.js";
import { PageFrame } from "./views/PageFrame.js";

export function App() {
  const interceptorStatus = useInterceptorStatus();
  // getServerSnapshot === getSnapshot: this is a client-only SPA, never server-rendered.
  const route = useSyncExternalStore(subscribeToRoute, getRoute, getRoute);

  if (interceptorStatus !== "ok") return <ReloginScreen kind={interceptorStatus} />;

  let view;
  if (route.view === "board") view = <Board />;
  else if (route.view === "page" && route.id) view = <PageFrame pageId={route.id} />;
  else view = <Launcher />;

  return (
    <div className="app">
      <header className="app-header">
        <button type="button" className="app-title" onClick={() => navigate({ view: "launcher" })}>
          agentstate-lite
        </button>
      </header>
      <main>{view}</main>
    </div>
  );
}
