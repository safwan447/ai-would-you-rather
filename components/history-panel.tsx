"use client";

import { Heart, Trash2 } from "lucide-react";
import type { ChoiceRecord } from "@/types/game";
import { exportHistoryFile } from "@/utils/game";
import { ArcadeButton } from "./arcade-button";

export function HistoryPanel({
  history,
  onToggleFavorite,
  onClear
}: {
  history: ChoiceRecord[];
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="neon-card rounded-sm p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-pixel text-sm text-cyan-100">History</h2>
        <div className="flex gap-2">
          <ArcadeButton
            variant="ghost"
            className="px-3 py-2"
            onClick={() => exportHistoryFile(history)}
            disabled={history.length === 0}
          >
            Export
          </ArcadeButton>
          <button
            type="button"
            onClick={onClear}
            disabled={history.length === 0}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-pink-300/35 bg-pink-400/10 text-pink-100 transition hover:bg-pink-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Clear history"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-400">No choices yet. Start a round to fill the cabinet.</p>
      ) : (
        <div className="max-h-[28rem] space-y-3 overflow-auto pr-1">
          {history.slice(0, 12).map((record) => (
            <article key={record.id} className="rounded-sm border border-slate-100/10 bg-slate-950/45 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs uppercase text-slate-400">
                  Round {record.round} / {record.dilemma.category}
                </p>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(record.id)}
                  className={`inline-flex size-8 items-center justify-center rounded-sm border transition ${
                    record.favorite
                      ? "border-yellow-200 bg-yellow-300/20 text-yellow-100"
                      : "border-slate-300/25 text-slate-300 hover:bg-slate-100/10"
                  }`}
                  aria-label={record.favorite ? "Remove favorite" : "Add favorite"}
                >
                  <Heart size={15} aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-100">{record.selectedText}</p>
              <p className="mt-2 text-xs text-slate-500">
                Chose option {record.selectedSide} on {new Date(record.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
