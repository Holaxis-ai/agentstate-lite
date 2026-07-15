#!/usr/bin/env bash
#
# demo.sh — set up a SCRATCH bundle you can try the bundle-pages UI on (tasks/ui-pages-spike).
#
# It copies THIS repo's own board into a throwaway directory (never writing spike content into the
# real .agentstate-lite board), applies the Page convention + two registry docs, promotes the two
# seed page blobs via the BUILT CLI, then prints the exact commands to launch the UI and to drive
# live updates from a second terminal. It does NOT launch the UI itself (that is a foreground
# server) — it prints the command for you to run.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
CLI="$REPO/packages/cli/dist/agentstate-lite.mjs"

if [ ! -f "$CLI" ]; then
  echo "The built CLI is missing: $CLI" >&2
  echo "Build it first from the repo root:  npm run build" >&2
  exit 1
fi

SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/aslite-pages-demo.XXXXXX")"
BUNDLE="$SCRATCH/bundle"
mkdir -p "$BUNDLE"
# Copy the repo's live board into the scratch bundle (contents, including dotfiles) — this is why
# the Roadmap page renders real content immediately: this repo's own board already carries Roadmap
# Item docs with `contains` links to real tasks.
cp -R "$REPO/.agentstate-lite/." "$BUNDLE/"

echo "Seeding scratch bundle: $BUNDLE"

# Install the bundle-native authoring reference with the convention, then the registry docs and
# page blobs. .md keys route through the doc engine; other keys are opaque blobs.
node "$CLI" promote "$HERE/references/page-authoring-v0.md" --doc-key references/page-authoring-v0.md --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/conventions/page.md"          --doc-key conventions/page.md            --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pages-registry/pulse.md"      --doc-key pages-registry/pulse.md        --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pages-registry/roadmap.md"    --doc-key pages-registry/roadmap.md      --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pages-registry/about.md"      --doc-key pages-registry/about.md        --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pulse.html"                   --doc-key pages/pulse.html               --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/roadmap.html"                 --doc-key pages/roadmap.html             --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/about.html"                   --doc-key pages/about.html               --dir "$BUNDLE" >/dev/null

# Discover a 'todo' task id to demo a live status change.
TASK_ID="$(node "$CLI" list --type Task --dir "$BUNDLE" --json \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const t=(j.docs||[]).find(d=>d.status==="todo");process.stdout.write(t?t.id:"")})')"
[ -n "$TASK_ID" ] || TASK_ID="tasks/<some-todo-task>"

echo
echo "Seeded 3 pages (pulse, roadmap, about) + the Page convention and authoring reference."
echo "──────────────────────────────────────────────────────────────────────────"
echo "1) Launch the UI (foreground; it prints a tokenized http://127.0.0.1:PORT URL to open):"
echo
echo "   node $CLI ui --dir $BUNDLE --open"
echo
echo "   The landing is the LAUNCHER (the ui command's one surface), grouped into 'Dashboards'"
echo "   (bridge: bundle-read) and 'Documents' (bridge: none): click 'Pulse — activity feed' or"
echo "   'Roadmap' to open a data page in a sandboxed iframe — Roadmap is the one that exercises"
echo "   the bridge's \`edges\` request, expanding an item to see its contained tasks and rollup"
echo "   bar. 'About this bundle' is a content page: same iframe, zero bridge access."
echo
echo "2) In a SECOND terminal, drive live updates against the SAME scratch bundle:"
echo
echo "   # move a task to done — watch a Roadmap item's rollup bar shift, and the row land fresh"
echo "   # in Pulse's feed (~1s):"
echo "   node $CLI doc update $TASK_ID --status done --dir $BUNDLE"
echo
echo "   # edit a page's HTML and save — watch the iframe HOT-RELOAD with the new bytes:"
echo "   printf '\\n<!-- edited %s -->\\n' \"\$(date)\" >> $BUNDLE/pages/pulse.html"
echo
echo "   # add a brand-new doc — watch it appear at the top of the Pulse feed:"
echo "   node $CLI new Task tasks/demo-live --title 'Live demo task' --status todo --dir $BUNDLE"
echo "──────────────────────────────────────────────────────────────────────────"
echo "Scratch bundle (safe to delete): $SCRATCH"
