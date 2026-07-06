/**
 * The Board view (plans/ui-v1.md rev 2 Views §1): docs of the board's kind (see
 * `../kinds/boardShape.ts` — never hardcoded here) bucketed into columns by its declared enum
 * field, with a CAS status-change control per card. The mutation is a full read -> mutate ->
 * `PUT If-Match` cycle (the rev-2 Views spec's exact shape) rather than a partial patch, because
 * the wire's `PUT` always replaces the whole `{frontmatter, body}` — omitting `body` would
 * silently erase the doc's description.
 *
 * A lost race (412) is rendered as a per-card recoverable state (REFRESH re-syncs the card from
 * the server and discards the attempted change; RETRY re-runs the SAME intended change against
 * the now-current version) — never a raw error, never a stuck spinner.
 *
 * Everywhere this component would otherwise hardcode the Task kind or its status enum, it reads
 * `BoardShape` instead — see `../kinds/boardShape.ts`'s module doc for why.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoc, listAllHeads, putDoc } from "../api/client.js";
import type { DocHead } from "../api/types.js";
import { classifyWriteError, type ConflictState } from "../query/conflict.js";
import { DEFAULT_BOARD_SHAPE, fetchBoardShape, humanizeEnumValue, type BoardShape } from "../kinds/boardShape.js";

type PendingConflict = ConflictState & { nextValue?: string };

function titleOf(doc: DocHead): string {
  const t = doc.frontmatter.title;
  return typeof t === "string" && t.trim() ? t : doc.id;
}

/** The doc's current value of the board's enum field, or `null` when absent/not one of `shape.values` (routed to the "unrecognized" bucket rather than dropped). */
function valueOf(doc: DocHead, shape: BoardShape): string | null {
  const v = doc.frontmatter[shape.enumField];
  return typeof v === "string" && shape.values.includes(v) ? v : null;
}

export function Board() {
  const queryClient = useQueryClient();

  // The board's kind/enum shape: derived from the bundle's own conventions/ docs when declared,
  // else the built-in Task default — never polled (a kind convention doesn't change at runtime).
  const shapeQuery = useQuery({ queryKey: ["board-shape"], queryFn: fetchBoardShape, refetchInterval: false });
  const shape = shapeQuery.data ?? DEFAULT_BOARD_SHAPE;

  const query = useQuery({
    queryKey: ["docs", shape.docType],
    queryFn: () => listAllHeads({ type: shape.docType }),
  });
  const [conflicts, setConflicts] = useState<Record<string, PendingConflict>>({});

  const changeValue = useMutation({
    mutationFn: async ({ id, nextValue }: { id: string; nextValue: string }) => {
      const { doc, version } = await getDoc(id);
      return putDoc(id, { frontmatter: { ...doc.frontmatter, [shape.enumField]: nextValue }, body: doc.body }, version);
    },
    onSuccess: (_result, { id }) => {
      setConflicts((prev) => {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
      void queryClient.invalidateQueries({ queryKey: ["docs", shape.docType] });
    },
    onError: (err, { id, nextValue }) => {
      const conflict = classifyWriteError(err);
      if (conflict.kind === "conflict") {
        setConflicts((prev) => ({ ...prev, [id]: { ...conflict, nextValue } }));
      }
      // A non-412 failure (network blip, etc.) is left to react-query's own error surface —
      // classifyWriteError intentionally only handles the recoverable CAS case.
    },
  });

  function refresh(id: string) {
    setConflicts((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    void queryClient.invalidateQueries({ queryKey: ["docs", shape.docType] });
  }

  function retry(id: string) {
    const pending = conflicts[id];
    if (!pending?.nextValue) return;
    changeValue.mutate({ id, nextValue: pending.nextValue });
  }

  if (query.isPending) return <p className="board-status">Loading…</p>;
  if (query.isError) return <p className="board-status board-status-error">Could not load docs: {(query.error as Error).message}</p>;

  const docs = query.data;
  const byValue = new Map<string, DocHead[]>(shape.values.map((v) => [v, []]));
  const unrecognized: DocHead[] = [];
  for (const doc of docs) {
    const value = valueOf(doc, shape);
    if (value) byValue.get(value)!.push(doc);
    else unrecognized.push(doc);
  }

  return (
    <div className="board">
      <div className="board-columns">
        {shape.values.map((value) => (
          <section key={value} className="board-column" aria-label={humanizeEnumValue(value)}>
            <h2>
              {humanizeEnumValue(value)} <span className="count">{byValue.get(value)!.length}</span>
            </h2>
            <div className="board-cards">
              {byValue.get(value)!.map((doc) => {
                const conflict = conflicts[doc.id];
                return (
                  <article key={doc.id} className="board-card" data-doc-id={doc.id}>
                    <h3>{titleOf(doc)}</h3>
                    <p className="board-card-id">{doc.id}</p>
                    <label>
                      Status
                      <select
                        value={value}
                        disabled={changeValue.isPending && changeValue.variables?.id === doc.id}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (shape.values.includes(next)) changeValue.mutate({ id: doc.id, nextValue: next });
                        }}
                      >
                        {shape.values.map((v) => (
                          <option key={v} value={v}>
                            {humanizeEnumValue(v)}
                          </option>
                        ))}
                      </select>
                    </label>
                    {conflict?.kind === "conflict" && (
                      <div className="board-conflict" role="alert" data-testid="conflict-banner">
                        <p>Someone else changed this first: {conflict.message}</p>
                        <button type="button" onClick={() => refresh(doc.id)}>
                          Refresh
                        </button>
                        <button type="button" onClick={() => retry(doc.id)}>
                          Retry
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      {unrecognized.length > 0 && (
        <section className="board-column board-column-unrecognized" aria-label="Unrecognized status">
          <h2>Unrecognized status ({unrecognized.length})</h2>
          <div className="board-cards">
            {unrecognized.map((doc) => (
              <article key={doc.id} className="board-card">
                <h3>{titleOf(doc)}</h3>
                <p className="board-card-id">
                  {doc.id} — {shape.enumField}: {String(doc.frontmatter[shape.enumField] ?? "(none)")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
