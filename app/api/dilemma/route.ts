import { NextResponse } from "next/server";
import {
  generateDilemma,
  normalizeCategory,
  normalizeDifficulty
} from "@/services/dilemma-service";
import type { DilemmaRequest, DilemmaResponse } from "@/types/game";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<DilemmaRequest>;

  const dilemma = await generateDilemma({
    category: normalizeCategory(body.category),
    difficulty: normalizeDifficulty(body.difficulty),
    history: Array.isArray(body.history) ? body.history : []
  });

  return NextResponse.json<DilemmaResponse>({ dilemma });
}
