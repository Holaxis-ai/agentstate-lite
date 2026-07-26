// Generate every source module consumed by the self-contained CLI bundle. All bundle-producing
// entrypoints use this helper so the npm/dev build, committed-plugin writer, and drift checker
// cannot acquire different preparation requirements as new embedded surfaces are added.
import { buildMcpViewHtml } from "../../mcp-app/scripts/build-view.mjs";
import { embedUiAssets } from "./embed-ui-assets.mjs";

export async function prepareCliBundleInputs() {
  embedUiAssets();
  await buildMcpViewHtml();
}
