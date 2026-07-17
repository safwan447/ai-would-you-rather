import type { Category, ChoiceRecord, ChoiceSide, Dilemma, GameStats } from "@/types/game";

export const categories: Category[] = ["random", "funny", "science", "gaming", "movies"];

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const defaultStats = (): GameStats => ({
  totalQuestions: 0,
  gamesPlayed: 0,
  selectedA: 0,
  selectedB: 0,
  categoryCounts: {
    funny: 0,
    science: 0,
    gaming: 0,
    movies: 0,
    random: 0
  },
  totalSessionSeconds: 0
});

export const choiceText = (dilemma: Dilemma, side: ChoiceSide) =>
  side === "A" ? dilemma.optionA : dilemma.optionB;

export const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0s";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

export const favoriteCategory = (stats: GameStats): Category | "None" => {
  const entries = Object.entries(stats.categoryCounts) as [Category, number][];
  const [category, count] = entries.sort((a, b) => b[1] - a[1])[0];
  return count > 0 ? category : "None";
};

export const mostSelectedSide = (stats: GameStats) => {
  if (stats.selectedA === stats.selectedB) {
    return "Tie";
  }

  return stats.selectedA > stats.selectedB ? "Option A" : "Option B";
};

export const exportHistoryFile = (history: ChoiceRecord[]) => {
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ai-would-you-rather-history-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};
