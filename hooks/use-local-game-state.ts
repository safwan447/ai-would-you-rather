"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChoiceRecord, StoredGameState } from "@/types/game";
import { defaultStats } from "@/utils/game";

const storageKey = "ai-would-you-rather-state";

const emptyState = (): StoredGameState => ({
  history: [],
  stats: defaultStats()
});

export function useLocalGameState() {
  const [state, setState] = useState<StoredGameState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredGameState;
        setState({
          history: Array.isArray(parsed.history) ? parsed.history : [],
          stats: {
            ...defaultStats(),
            ...parsed.stats,
            categoryCounts: {
              ...defaultStats().categoryCounts,
              ...parsed.stats?.categoryCounts
            }
          }
        });
      }
    } catch {
      setState(emptyState());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const addChoice = useCallback((record: ChoiceRecord) => {
    setState((current) => ({
      history: [record, ...current.history].slice(0, 200),
      stats: {
        ...current.stats,
        totalQuestions: current.stats.totalQuestions + 1,
        selectedA: current.stats.selectedA + (record.selectedSide === "A" ? 1 : 0),
        selectedB: current.stats.selectedB + (record.selectedSide === "B" ? 1 : 0),
        categoryCounts: {
          ...current.stats.categoryCounts,
          [record.dilemma.category]: current.stats.categoryCounts[record.dilemma.category] + 1
        }
      }
    }));
  }, []);

  const toggleFavorite = useCallback((recordId: string) => {
    setState((current) => ({
      ...current,
      history: current.history.map((item) =>
        item.id === recordId ? { ...item, favorite: !item.favorite } : item
      )
    }));
  }, []);

  const addGameSession = useCallback((durationSeconds: number) => {
    setState((current) => ({
      ...current,
      stats: {
        ...current.stats,
        gamesPlayed: current.stats.gamesPlayed + 1,
        totalSessionSeconds: current.stats.totalSessionSeconds + Math.max(0, durationSeconds)
      }
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(emptyState());
  }, []);

  const favorites = useMemo(
    () => state.history.filter((record) => record.favorite),
    [state.history]
  );

  return {
    hydrated,
    history: state.history,
    favorites,
    stats: state.stats,
    addChoice,
    toggleFavorite,
    addGameSession,
    clearHistory
  };
}
