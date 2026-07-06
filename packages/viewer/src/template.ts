/**
 * HTML skeleton for the single-file OKF visualizer.
 *
 * Mirrors the reference `templates/viz.html` string-substitution scheme
 * (okf/src/reference_agent/viewer/generator.py): the generator swaps the CSS,
 * JS, bundle name, and the ENTIRE bundle-as-JSON into placeholder tokens. The
 * result is ONE self-contained file — no backend, no data leaves the page.
 *
 * Self-contained for DATA; the runtime libraries (Cytoscape.js + marked +
 * DOMPurify) load from CDN, exactly as the reference viewer does. DOMPurify
 * sanitizes every marked.js render before it reaches innerHTML — a shared
 * viz.html embeds a bundle's markdown bodies verbatim, so unsanitized HTML in
 * a body would otherwise execute as stored XSS the moment the file is opened.
 * Inlining these for a truly offline single file is a documented later option
 * (see docs/VISION.md).
 */
import { VIZ_CSS, VIZ_JS } from "./assets.js";
import type { BundleData } from "./bundle.js";

const HTML_SKELETON = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>__BUNDLE_NAME__ · OKF bundle</title>
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"></script>
<style>/*__VIZ_CSS__*/</style>
</head>
<body>
<header><span class="brand">agentstate-lite</span><span id="bundle-name"></span></header>
<main>
<div id="graph"></div>
<aside id="detail"></aside>
</main>
<script>window.__BUNDLE__ = /*__BUNDLE_DATA__*/;</script>
<script>/*__VIZ_JS__*/</script>
</body>
</html>
`;

function escapeHtmlText(s: string): string {
  return s
    .split("&")
    .join("&amp;")
    .split("<")
    .join("&lt;")
    .split(">")
    .join("&gt;");
}

/** Serialize the payload for safe embedding inside a `<script>` element. */
function embedJson(data: BundleData): string {
  // Break any accidental "</script>" so the blob cannot close its own tag.
  return JSON.stringify(data).split("</").join("<\\/");
}

/**
 * Produce the complete self-contained HTML document for a bundle. Pure: every
 * substitution is a fixed-string swap (no regex, so `$` in the JSON payload is
 * never interpreted).
 */
export function renderTemplate(data: BundleData): string {
  return HTML_SKELETON.split("__BUNDLE_NAME__")
    .join(escapeHtmlText(data.name))
    .split("/*__VIZ_CSS__*/")
    .join(VIZ_CSS)
    .split("/*__BUNDLE_DATA__*/")
    .join(embedJson(data))
    .split("/*__VIZ_JS__*/")
    .join(VIZ_JS);
}
