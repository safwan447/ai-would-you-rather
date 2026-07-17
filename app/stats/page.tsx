"use client";

import Link from "next/link";
import { Download, Heart, Home, RotateCcw } from "lucide-react";
import { ArcadeButton } from "@/components/arcade-button";
import { RetroBackground } from "@/components/retro-background";
import { useLocalGameState } from "@/hooks/use-local-game-state";
import { exportHistoryFile, favoriteCategory, formatDuration, mostSelectedSide } from "@/utils/game";

export default function StatsPage() {
  const { history, favorites, stats, clearHistory } = useLocalGameState();
  const averageSession =
    stats.gamesPlayed > 0 ? Math.round(stats.totalSessionSeconds / stats.gamesPlayed) : 0;

  const cards = [
    { label: "Total questions", value: stats.totalQuestions },
    { label: "Favorite category", value: favoriteCategory(stats) },
    { label: "Most selected", value: mostSelectedSide(stats) },
    { label: "Games played", value: stats.gamesPlayed },
    { label: "Average session", value: formatDuration(averageSession) },
    { label: "Favorites", value: favorites.length }
  ];

  return (
    <>
      <RetroBackground />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-200">
              Player profile
            </p>
            <h1 className="font-pixel text-glow mt-2 text-3xl text-white sm:text-5xl">Statistics</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            <Home size={17} aria-hidden="true" />
            Home
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Game statistics">
          {cards.map((card) => (
            <article key={card.label} className="neon-card rounded-sm p-5">
              <p className="text-sm uppercase text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="neon-card rounded-sm p-5">
            <h2 className="font-pixel mb-4 text-base text-cyan-100">Favorite dilemmas</h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-slate-400">Saved dilemmas will appear here.</p>
            ) : (
              <div className="space-y-3">
                {favorites.map((record) => (
                  <article
                    key={record.id}
                    className="rounded-sm border border-yellow-200/20 bg-yellow-300/10 p-4"
                  >
                    <p className="mb-2 flex items-center gap-2 text-sm font-bold text-yellow-100">
                      <Heart size={16} aria-hidden="true" />
                      Option {record.selectedSide}
                    </p>
                    <p className="text-slate-100">{record.selectedText}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="neon-card rounded-sm p-5">
            <h2 className="font-pixel mb-4 text-base text-pink-100">Data controls</h2>
            <div className="space-y-3">
              <ArcadeButton
                variant="primary"
                className="w-full"
                onClick={() => exportHistoryFile(history)}
                disabled={history.length === 0}
                icon={<Download size={17} />}
              >
                Export history
              </ArcadeButton>
              <ArcadeButton
                variant="secondary"
                className="w-full"
                onClick={clearHistory}
                disabled={history.length === 0}
                icon={<RotateCcw size={17} />}
              >
                Reset data
              </ArcadeButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
