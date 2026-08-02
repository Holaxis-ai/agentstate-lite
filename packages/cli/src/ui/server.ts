// CLI-owned adapter for the reusable loopback UI runtime. Generated asset bytes and bundle-name
// policy stay in this package; the listener/session/proxy/View/SSE mechanics live below it.
import {
  bootUiServer as bootUiServerRuntime,
  escapeHtml,
  pageError,
  type UiServerHandle,
  type UiServerOptions as RuntimeUiServerOptions,
} from "@agentstate-lite/ui-server";
import { renderDocumentToStaticHtml } from "@agentstate-lite/markdown-renderer/static";
import { deriveBundleDisplayName } from "../bundle-name.js";
import { serveEmbeddedUiAsset } from "./assets.js";
import { createSharingLoader, createWorkspacesLoader } from "./sharing.js";
import { LocalViewAuthorizationStore } from "./view-authorizations.js";

export { escapeHtml, pageError };
export type { UiServerHandle };

export type UiServerOptions = Omit<
  RuntimeUiServerOptions,
  "serveAsset" | "resolveBundleDisplayName" | "loadSharingSummary" | "loadWorkspaces" | "renderDocument"
>;

export function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  // Dir mode injects the CLI's board-channel classification + catalog projection through the
  // runtime's consumer-owned seams (remote mode derives `hosted` in the runtime itself).
  const bundleRoot = options.mode === "dir" ? options.bundle?.root : undefined;
  const bundleIdentity =
    options.mode === "dir"
      ? options.bundle?.root
      : options.remoteBase;
  return bootUiServerRuntime({
    ...options,
    ...(bundleIdentity
      ? { viewAuthorization: new LocalViewAuthorizationStore(bundleIdentity) }
      : {}),
    renderDocument: renderDocumentToStaticHtml,
    serveAsset: serveEmbeddedUiAsset,
    resolveBundleDisplayName: async (bundle) => (await deriveBundleDisplayName(bundle)).name,
    ...(bundleRoot !== undefined
      ? { loadSharingSummary: createSharingLoader(bundleRoot), loadWorkspaces: createWorkspacesLoader(bundleRoot) }
      : {}),
  });
}
