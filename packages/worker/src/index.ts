/**
 * `@agentstate-lite/worker` — PRIVATE deployment package (never enters the CLI's esbuild
 * bundle). Exports {@link D1R2Backend}, a full `StorageBackend` over a Cloudflare D1
 * database (head index + history) and an R2 bucket (content-addressed object store).
 *
 * Stage-1 Unit 2b Part A: the backend a future CF Worker `fetch` handler mounts (Part B).
 * No fetch entry point lives here.
 */
export { D1R2Backend } from "./d1r2-backend.js";
export { r2KeyForVersion } from "./keys.js";
