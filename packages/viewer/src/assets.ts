/**
 * Client-side runtime for the OKF static visualizer, as inlinable strings.
 *
 * These mirror the OKF reference viewer's `static/viz.css` + `static/viz.js`
 * (okf/src/reference_agent/viewer): a Cytoscape.js force-directed graph colored
 * by `type`, a marked.js body panel, and a "Cited by" list computed by reversing
 * the embedded edge set at load time (backlinks are DERIVED, never stored).
 *
 * The runtime is written with plain string operations (no regex, no backslash
 * escapes) so it embeds cleanly and reads identically in the emitted HTML.
 *
 * DELIBERATE difference from the reference `viz.js`, which makes only absolute
 * `/...md` links clickable-internal: this runtime resolves BOTH relative and
 * absolute `.md` links for in-body navigation, matching our edge builder.
 *
 * SECURITY: a viz.html is a SHAREABLE artifact — the bundle it renders may come
 * from someone else, so its markdown bodies are untrusted input. Every render()
 * output from `window.marked` is passed through `window.DOMPurify.sanitize`
 * before it is assigned to `.innerHTML` (see `renderDetail`), and if DOMPurify
 * did not load, the runtime falls back to plain escaped text rather than ever
 * injecting unsanitized HTML. Defense against stored XSS in a shared bundle.
 */

/** Inlined at `/*__VIZ_CSS__*\/` in the template. */
export const VIZ_CSS = `
:root {
  --bg: #17181c;
  --panel: #202124;
  --edge: #5f6368;
  --text: #e8eaed;
  --muted: #9aa0a6;
  --accent: #8ab4f8;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  background: var(--bg);
  color: var(--text);
  font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #2b2c30;
  flex: 0 0 auto;
}
header .brand { font-weight: 700; letter-spacing: 0.02em; }
header #bundle-name { color: var(--muted); }
main { flex: 1 1 auto; display: flex; min-height: 0; }
#graph { flex: 1 1 60%; min-width: 0; background: radial-gradient(circle at 40% 30%, #1d1f24, var(--bg)); }
#detail {
  flex: 0 0 40%;
  max-width: 560px;
  overflow-y: auto;
  padding: 20px 24px;
  border-left: 1px solid #2b2c30;
  background: var(--panel);
}
#detail h1 { font-size: 20px; margin: 10px 0 2px; }
#detail h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-top: 24px; }
#detail .id { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; margin: 0 0 8px; }
#detail .desc { color: var(--text); }
#detail .chip { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 12px; color: #17181c; font-weight: 600; }
#detail .tags { margin: 8px 0; }
#detail .tag { display: inline-block; background: #2b2c30; color: var(--muted); border-radius: 6px; padding: 1px 7px; margin: 0 6px 6px 0; font-size: 12px; }
#detail .resource a, #detail a { color: var(--accent); }
#detail a.internal { border-bottom: 1px dotted var(--accent); text-decoration: none; }
#detail .body { margin-top: 16px; border-top: 1px solid #2b2c30; padding-top: 12px; }
#detail .body pre { background: #17181c; padding: 10px; border-radius: 6px; overflow-x: auto; }
#detail .body code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
#detail .backlinks ul { margin: 6px 0 0; padding-left: 18px; }
#detail .muted { color: var(--muted); }
`;

/** Inlined at `/*__VIZ_JS__*\/` in the template. Reads the embedded bundle from window.__BUNDLE__. */
export const VIZ_JS = `
(function () {
  var DATA = window.__BUNDLE__ || { name: "", nodes: [], edges: [], bodies: {} };
  var PALETTE = ["#4f8ef7", "#f7844f", "#4fce8b", "#c14ff7", "#f7d24f", "#f74f8b", "#4fd6f7", "#9b8cff"];

  var types = [];
  DATA.nodes.forEach(function (n) { if (types.indexOf(n.type) < 0) types.push(n.type); });
  types.sort();
  function colorFor(t) {
    var i = types.indexOf(t);
    return i < 0 ? "#9aa0a6" : PALETTE[i % PALETTE.length];
  }

  var byId = {};
  DATA.nodes.forEach(function (n) { byId[n.id] = n; });

  var backlinks = {};
  DATA.edges.forEach(function (e) {
    if (!backlinks[e.target]) backlinks[e.target] = [];
    backlinks[e.target].push(e.source);
  });

  function escapeHtml(s) {
    return String(s).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).split("'").join("&#39;");
  }

  function resolvePath(sourceId, href) {
    if (href.indexOf("://") >= 0) return null;
    var hashAt = href.indexOf("#");
    if (hashAt >= 0) href = href.slice(0, hashAt);
    if (href.slice(-3) !== ".md") return null;
    href = href.slice(0, -3);
    var parts;
    if (href.charAt(0) === "/") {
      parts = href.slice(1).split("/");
    } else {
      var base = sourceId.split("/");
      base.pop();
      parts = base.concat(href.split("/"));
    }
    var out = [];
    parts.forEach(function (p) {
      if (p === "" || p === ".") return;
      if (p === "..") { out.pop(); return; }
      out.push(p);
    });
    return out.join("/");
  }

  var elements = [];
  DATA.nodes.forEach(function (n) {
    var size = 26 + Math.min(60, Math.round((n.size || 0) / 40));
    elements.push({ data: { id: n.id, label: n.title || n.id, color: colorFor(n.type), size: size } });
  });
  DATA.edges.forEach(function (e, i) {
    elements.push({ data: { id: "edge-" + i, source: e.source, target: e.target } });
  });

  var cy = cytoscape({
    container: document.getElementById("graph"),
    elements: elements,
    style: [
      { selector: "node", style: {
        "background-color": "data(color)",
        "label": "data(label)",
        "width": "data(size)",
        "height": "data(size)",
        "font-size": 10,
        "color": "#e8eaed",
        "text-outline-color": "#17181c",
        "text-outline-width": 2,
        "text-valign": "bottom",
        "text-margin-y": 4
      } },
      { selector: "edge", style: {
        "width": 1.5,
        "line-color": "#5f6368",
        "target-arrow-color": "#5f6368",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "arrow-scale": 0.8
      } },
      { selector: "node.selected", style: { "border-width": 3, "border-color": "#e8eaed" } }
    ],
    layout: { name: "cose", animate: false, padding: 30 }
  });

  function renderDetail(id) {
    var panel = document.getElementById("detail");
    var n = byId[id];
    if (!n) { panel.innerHTML = '<p class="muted">Unknown concept: ' + escapeHtml(id) + "</p>"; return; }
    var h = "";
    h += '<span class="chip" style="background:' + colorFor(n.type) + '">' + escapeHtml(n.type) + "</span>";
    h += "<h1>" + escapeHtml(n.title || id) + "</h1>";
    h += '<p class="id">' + escapeHtml(id) + "</p>";
    if (n.description) h += '<p class="desc">' + escapeHtml(n.description) + "</p>";
    if (n.resource) h += '<p class="resource"><a href="' + escapeAttr(n.resource) + '" target="_blank" rel="noopener">' + escapeHtml(n.resource) + "</a></p>";
    if (n.tags && n.tags.length) {
      h += '<p class="tags">';
      n.tags.forEach(function (t) { h += '<span class="tag">' + escapeHtml(t) + "</span>"; });
      h += "</p>";
    }
    // Bundle bodies are untrusted (a shared viz.html renders someone else's markdown),
    // so marked.js output only ever reaches innerHTML through DOMPurify. If DOMPurify
    // failed to load (e.g. the CDN is blocked), fall back to plain escaped text rather
    // than ever assigning unsanitized HTML — safe-by-default, not safe-by-CDN-uptime.
    var rawBody = DATA.bodies[id] || "";
    var rendered;
    if (window.marked && window.marked.parse && window.DOMPurify && window.DOMPurify.sanitize) {
      rendered = window.DOMPurify.sanitize(window.marked.parse(rawBody));
    } else {
      rendered = escapeHtml(rawBody);
    }
    h += '<div class="body">' + rendered + "</div>";
    var bl = backlinks[id] || [];
    h += '<div class="backlinks"><h2>Cited by</h2>';
    if (!bl.length) {
      h += '<p class="muted">Nothing links here yet.</p>';
    } else {
      h += "<ul>";
      bl.forEach(function (s) {
        var sn = byId[s];
        h += '<li><a href="#" data-nav="' + escapeAttr(s) + '">' + escapeHtml((sn && sn.title) || s) + "</a></li>";
      });
      h += "</ul>";
    }
    h += "</div>";
    panel.innerHTML = h;

    var links = panel.querySelectorAll(".body a[href]");
    Array.prototype.forEach.call(links, function (a) {
      var target = resolvePath(id, a.getAttribute("href") || "");
      if (target && byId[target]) {
        a.setAttribute("data-nav", target);
        a.className = (a.className ? a.className + " " : "") + "internal";
      } else if ((a.getAttribute("href") || "").indexOf("://") >= 0) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
    });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-nav]"), function (a) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); navigate(a.getAttribute("data-nav")); });
    });
  }

  function navigate(id) {
    cy.nodes().removeClass("selected");
    var node = cy.getElementById(id);
    if (node && node.length) {
      node.addClass("selected");
      cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 1) }, { duration: 250 });
    }
    renderDetail(id);
    location.hash = encodeURIComponent(id);
  }

  cy.on("tap", "node", function (evt) { navigate(evt.target.id()); });

  var nameEl = document.getElementById("bundle-name");
  if (nameEl) nameEl.textContent = DATA.name;

  var initial = decodeURIComponent((location.hash || "").slice(1));
  if (initial && byId[initial]) navigate(initial);
  else if (DATA.nodes.length) renderDetail(DATA.nodes[0].id);
})();
`;
