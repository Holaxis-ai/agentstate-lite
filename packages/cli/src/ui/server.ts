// CLI-owned adapter for the reusable loopback UI runtime. Generated asset bytes and bundle-name
// policy stay in this package; the listener/session/proxy/View/SSE mechanics live below it.
import {
  bootUiServer as bootUiServerRuntime,
  escapeHtml,
  pageError,
  type UiServerHandle,
  type UiServerOptions as RuntimeUiServerOptions,
} from "@agentstate-lite/ui-server";
import { deriveBundleDisplayName } from "../bundle-name.js";
import { serveEmbeddedUiAsset } from "./assets.js";

export { escapeHtml, pageError };
export type { UiServerHandle };

export type UiServerOptions = Omit<RuntimeUiServerOptions, "serveAsset" | "resolveBundleDisplayName">;

export function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  return bootUiServerRuntime({
    ...options,
    serveAsset: serveEmbeddedUiAsset,
    resolveBundleDisplayName: async (bundle) => (await deriveBundleDisplayName(bundle)).name,
  });
}
