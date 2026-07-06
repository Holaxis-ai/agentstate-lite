/**
 * App shell: mounts the ONE global interceptor gate (plans/ui-v1.md rev 3.2) in front of
 * whichever view the URL names. Only the Board view is built (the B2 vertical slice) — doc
 * detail / admin / graph are phase C; `routing.ts` already parses their `view` values so a
 * deep link to one doesn't crash, it just falls back to Board for now.
 */
import { useSyncExternalStore } from "react";
import { getRoute, subscribeToRoute } from "./routing.js";
import { useInterceptorStatus } from "./query/interceptor.js";
import { ReloginScreen } from "./views/ReloginScreen.js";
import { Board } from "./views/Board.js";

export function App() {
  const interceptorStatus = useInterceptorStatus();
  // getServerSnapshot === getSnapshot: this is a client-only SPA, never server-rendered.
  // route is read (and routing.ts is exercised) even though every view renders Board today —
  // this is the seam phase C's doc/admin/graph views switch on.
  const route = useSyncExternalStore(subscribeToRoute, getRoute, getRoute);
  void route;

  if (interceptorStatus !== "ok") return <ReloginScreen kind={interceptorStatus} />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>agentstate-lite</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}
