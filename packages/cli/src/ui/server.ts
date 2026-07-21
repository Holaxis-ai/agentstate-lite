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
import { createSharingLoader, createWorkspacesLoader } from "./sharing.js";

export { escapeHtml, pageError };
export type { UiServerHandle };

export type UiServerOptions = Omit<
  RuntimeUiServerOptions,
  "serveAsset" | "resolveBundleDisplayName" | "loadSharingSummary" | "loadWorkspaces"
>;

export function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  // Dir mode injects the CLI's board-channel classification + catalog projection through the
  // runtime's consumer-owned seams (remote mode derives `hosted` in the runtime itself).
  const bundleRoot = options.mode === "dir" ? options.bundle?.root : undefined;
  return bootUiServerRuntime({
    ...options,
    serveAsset: serveEmbeddedUiAsset,
    resolveBundleDisplayName: async (bundle) => (await deriveBundleDisplayName(bundle)).name,
    ...(bundleRoot !== undefined
      ? { loadSharingSummary: createSharingLoader(bundleRoot), loadWorkspaces: createWorkspacesLoader(bundleRoot) }
      : {}),
  });
}
