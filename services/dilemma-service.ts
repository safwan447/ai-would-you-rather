import OpenAI from "openai";
import { getFallbackDilemma } from "@/lib/fallback-dilemmas";
import type { Category, Difficulty, Dilemma } from "@/types/game";
import { createId } from "@/utils/game";

type RawDilemma = {
  optionA?: unknown;
  optionB?: unknown;
};

type ValidRawDilemma = {
  optionA: string;
  optionB: string;
};

const allowedCategories = ["funny", "science", "gaming", "movies", "random"] as const;
const allowedDifficulties = ["easy", "medium", "hard"] as const;

export const normalizeCategory = (value: unknown): Category =>
  allowedCategories.includes(value as Category) ? (value as Category) : "random";

export const normalizeDifficulty = (value: unknown): Difficulty =>
  allowedDifficulties.includes(value as Difficulty) ? (value as Difficulty) : "medium";

export async function generateDilemma({
  category,
  difficulty,
  history = []
}: {
  category: Category;
  difficulty: Difficulty;
  history?: string[];
}): Promise<Dilemma> {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackDilemma(category, difficulty);
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = [
      "Generate one safe Would You Rather dilemma.",
      `Category: ${category}. Difficulty: ${difficulty}.`,
      "Style: concise, funny, creative, replayable, family-friendly.",
      "Avoid politics, religion, offensive content, NSFW, hate, graphic violence, and explanations.",
      "Return only valid JSON shaped exactly like:",
      "{\"optionA\":\"...\",\"optionB\":\"...\"}",
      history.length > 0
        ? `Avoid repeating these recent options: ${history.slice(-8).join(" | ")}`
        : "No previous history."
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a safe party game question generator. You only output strict JSON with optionA and optionB strings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.95,
      max_tokens: 120
    });

    const text = completion.choices[0]?.message.content;
    const parsed = text ? (JSON.parse(text) as RawDilemma) : null;

    if (!isValidRawDilemma(parsed)) {
      return getFallbackDilemma(category, difficulty);
    }

    return {
      id: createId(),
      optionA: parsed.optionA.trim(),
      optionB: parsed.optionB.trim(),
      category,
      difficulty,
      createdAt: new Date().toISOString(),
      source: "ai"
    };
  } catch (error) {
    console.error("OpenAI generation failed, using fallback dilemma.", error);
    return getFallbackDilemma(category, difficulty);
  }
}

const isValidRawDilemma = (value: RawDilemma | null): value is ValidRawDilemma => {
  return (
    Boolean(value) &&
    typeof value?.optionA === "string" &&
    typeof value?.optionB === "string" &&
    value.optionA.trim().length >= 4 &&
    value.optionB.trim().length >= 4
  );
};
