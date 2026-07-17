"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ArcadeButton, ArcadeLink } from "@/components/arcade-button";
import { ConfettiBurst } from "@/components/confetti-burst";
import { DilemmaCard } from "@/components/dilemma-card";
import { HistoryPanel } from "@/components/history-panel";
import { RetroBackground } from "@/components/retro-background";
import { SettingsPanel } from "@/components/settings-panel";
import { StatStrip } from "@/components/stat-strip";
import { useLocalGameState } from "@/hooks/use-local-game-state";
import { useSound } from "@/hooks/use-sound";
import type { ChoiceRecord, ChoiceSide, Dilemma, DilemmaResponse, GameSettings } from "@/types/game";
import { choiceText, createId } from "@/utils/game";

const defaultSettings: GameSettings = {
  difficulty: "medium",
  category: "random",
  rounds: 10,
  soundEnabled: true
};

const easterEggs = [
  "Critical choice detected.",
  "Arcade oracle recalibrating.",
  "Your future self is taking notes.",
  "High score energy increasing."
];

export default function GamePage() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [dilemma, setDilemma] = useState<Dilemma | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSide, setSelectedSide] = useState<ChoiceSide | null>(null);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState(easterEggs[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const sessionStartedAt = useRef<number | null>(null);
  const completedSession = useRef(false);
  const recentHistory = useRef<string[]>([]);

  const { history, addChoice, toggleFavorite, clearHistory, addGameSession } = useLocalGameState();
  const { play } = useSound(settings.soundEnabled);

  useEffect(() => {
    recentHistory.current = history
      .slice(0, 8)
      .flatMap((record) => [record.dilemma.optionA, record.dilemma.optionB]);
  }, [history]);

  const fetchDilemma = useCallback(async () => {
    setLoading(true);
    setSelectedSide(null);

    try {
      const response = await fetch("/api/dilemma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          difficulty: settings.difficulty,
          category: settings.category,
          history: recentHistory.current
        })
      });

      if (!response.ok) {
        throw new Error("Failed to load dilemma");
      }

      const data = (await response.json()) as DilemmaResponse;
      setDilemma(data.dilemma);
      setMessage(easterEggs[Math.floor(Math.random() * easterEggs.length)]);
    } finally {
      setLoading(false);
    }
  }, [settings.category, settings.difficulty]);

  useEffect(() => {
    sessionStartedAt.current = Date.now();
    void fetchDilemma();
  }, [fetchDilemma]);

  const handleSelect = useCallback((side: ChoiceSide) => {
    if (!dilemma || selectedSide || loading) {
      return;
    }

    const record: ChoiceRecord = {
      id: createId(),
      dilemma,
      selectedSide: side,
      selectedText: choiceText(dilemma, side),
      round,
      createdAt: new Date().toISOString(),
      favorite: false
    };

    addChoice(record);
    setSelectedSide(side);
    setStreak((value) => value + 1);
    play("select");

    if ((round % 10 === 0 || round === settings.rounds) && round > 0) {
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 1500);
      play("complete");
    }

    if (round >= settings.rounds && !completedSession.current) {
      completedSession.current = true;
      const startedAt = sessionStartedAt.current ?? Date.now();
      const duration = Math.round((Date.now() - startedAt) / 1000);
      addGameSession(duration);
    }

    window.setTimeout(() => {
      if (round < settings.rounds) {
        setRound((value) => value + 1);
        void fetchDilemma();
      }
    }, 900);
  }, [
    addChoice,
    addGameSession,
    dilemma,
    fetchDilemma,
    loading,
    play,
    round,
    selectedSide,
    settings.rounds
  ]);

  const handleSkip = useCallback(() => {
    play("skip");
    setStreak(0);
    void fetchDilemma();
  }, [fetchDilemma, play]);

  const handleCopy = async () => {
    if (!dilemma) {
      return;
    }

    await navigator.clipboard.writeText(`Would you rather ${dilemma.optionA} OR ${dilemma.optionB}?`);
    setMessage("Copied to clipboard.");
  };

  const handleShare = async () => {
    if (!dilemma) {
      return;
    }

    const text = `Would you rather ${dilemma.optionA} OR ${dilemma.optionB}?`;
    if (navigator.share) {
      await navigator.share({ title: "AI Would You Rather?", text });
    } else {
      await navigator.clipboard.writeText(text);
      setMessage("Share text copied.");
    }
  };

  const handleFavoriteCurrent = () => {
    const latestMatch = history.find((record) => record.dilemma.id === dilemma?.id);
    if (latestMatch) {
      toggleFavorite(latestMatch.id);
      setMessage("Favorite updated.");
    } else {
      setMessage("Choose a side first to save this dilemma.");
    }
  };

  const handlePlayAgain = () => {
    completedSession.current = false;
    sessionStartedAt.current = Date.now();
    setRound(1);
    setStreak(0);
    void fetchDilemma();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSelect("A");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSelect("B");
      }
      if (event.key === " ") {
        event.preventDefault();
        handleSkip();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        void fetchDilemma();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchDilemma, handleSelect, handleSkip]);

  return (
    <>
      <RetroBackground />
      <ConfettiBurst active={showConfetti} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <StatStrip questionCount={round} choicesMade={history.length} streak={streak} />
          <DilemmaCard
            dilemma={dilemma}
            loading={loading}
            selectedSide={selectedSide}
            onSelect={handleSelect}
            onSkip={handleSkip}
            onCopy={handleCopy}
            onShare={handleShare}
            onFavorite={handleFavoriteCurrent}
          />
          <div className="neon-card rounded-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-300">{message}</p>
              <div className="flex gap-2">
                <ArcadeButton variant="accent" onClick={handlePlayAgain} icon={<RotateCcw size={17} />}>
                  Play again
                </ArcadeButton>
                <ArcadeLink href="/stats" variant="secondary">
                  Stats
                </ArcadeLink>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Shortcuts: Left chooses A, Right chooses B, Space skips, Enter loads a new dilemma.
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <SettingsPanel settings={settings} onChange={setSettings} />
          <HistoryPanel history={history} onToggleFavorite={toggleFavorite} onClear={clearHistory} />
        </div>
      </div>
    </>
  );
}
