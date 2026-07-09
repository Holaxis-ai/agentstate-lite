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
# Copy the repo's live board into the scratch bundle (contents, including dotfiles).
cp -R "$REPO/.agentstate-lite/." "$BUNDLE/"

echo "Seeding scratch bundle: $BUNDLE"

# Convention first (so the registry docs validate against it), then the registry docs, then the
# page blobs. .md keys route through the doc engine; other keys are opaque blobs.
node "$CLI" promote "$HERE/conventions/page.md"               --doc-key conventions/page.md            --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pages-registry/activity-feed.md"   --doc-key pages-registry/activity-feed.md --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/pages-registry/board.md"           --doc-key pages-registry/board.md         --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/activity-feed.html"                --doc-key pages/activity-feed.html        --dir "$BUNDLE" >/dev/null
node "$CLI" promote "$HERE/board.html"                        --doc-key pages/board.html                --dir "$BUNDLE" >/dev/null

# Discover a 'todo' task id to demo a live status change.
TASK_ID="$(node "$CLI" list --type Task --dir "$BUNDLE" --json \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const t=(j.docs||[]).find(d=>d.status==="todo");process.stdout.write(t?t.id:"")})')"
[ -n "$TASK_ID" ] || TASK_ID="tasks/<some-todo-task>"

echo
echo "Seeded 2 pages (activity-feed, board) + the Page convention."
echo "──────────────────────────────────────────────────────────────────────────"
echo "1) Launch the UI (foreground; it prints a tokenized http://127.0.0.1:PORT URL to open):"
echo
echo "   node $CLI ui --dir $BUNDLE --open"
echo
echo "   The landing is the LAUNCHER: click 'Activity feed' or 'Board' to open a page in a"
echo "   sandboxed iframe. 'Board (built-in)' is the old React kanban, kept for comparison."
echo
echo "2) In a SECOND terminal, drive live updates against the SAME scratch bundle:"
echo
echo "   # move a task — watch the Board page slide the card to its new column (~1s):"
echo "   node $CLI doc update $TASK_ID --status in_progress --dir $BUNDLE"
echo
echo "   # edit a page's HTML and save — watch the iframe HOT-RELOAD with the new bytes:"
echo "   printf '\\n<!-- edited %s -->\\n' \"\$(date)\" >> $BUNDLE/pages/activity-feed.html"
echo
echo "   # add a brand-new doc — watch it appear at the top of the Activity feed:"
echo "   node $CLI new Task tasks/demo-live --title 'Live demo task' --status todo --dir $BUNDLE"
echo "──────────────────────────────────────────────────────────────────────────"
echo "Scratch bundle (safe to delete): $SCRATCH"
