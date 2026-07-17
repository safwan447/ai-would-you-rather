export type Difficulty = "easy" | "medium" | "hard";

export type Category = "funny" | "science" | "gaming" | "movies" | "random";

export type ChoiceSide = "A" | "B";

export type Dilemma = {
  id: string;
  optionA: string;
  optionB: string;
  category: Category;
  difficulty: Difficulty;
  createdAt: string;
  source: "ai" | "fallback";
};

export type GameSettings = {
  difficulty: Difficulty;
  category: Category;
  rounds: number;
  soundEnabled: boolean;
};

export type ChoiceRecord = {
  id: string;
  dilemma: Dilemma;
  selectedSide: ChoiceSide;
  selectedText: string;
  round: number;
  createdAt: string;
  favorite: boolean;
};

export type GameStats = {
  totalQuestions: number;
  gamesPlayed: number;
  selectedA: number;
  selectedB: number;
  categoryCounts: Record<Category, number>;
  totalSessionSeconds: number;
};

export type StoredGameState = {
  history: ChoiceRecord[];
  stats: GameStats;
};

export type DilemmaRequest = {
  difficulty: Difficulty;
  category: Category;
  history?: string[];
};

export type DilemmaResponse = {
  dilemma: Dilemma;
};
