"use client";

import { Volume2, VolumeX } from "lucide-react";
import type { Category, Difficulty, GameSettings } from "@/types/game";
import { categories } from "@/utils/game";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];
const rounds = [5, 10, 15, 20];

export function SettingsPanel({
  settings,
  onChange
}: {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
}) {
  return (
    <aside className="neon-card rounded-sm p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-pixel text-sm text-cyan-100">Settings</h2>
        <button
          type="button"
          onClick={() => onChange({ ...settings, soundEnabled: !settings.soundEnabled })}
          className="inline-flex size-10 items-center justify-center rounded-sm border border-yellow-200/40 bg-yellow-300/10 text-yellow-100 transition hover:bg-yellow-300/20"
          aria-label={settings.soundEnabled ? "Disable sound effects" : "Enable sound effects"}
        >
          {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <label className="mb-3 block text-sm font-semibold text-slate-200" htmlFor="difficulty">
        Difficulty
      </label>
      <select
        id="difficulty"
        value={settings.difficulty}
        onChange={(event) =>
          onChange({ ...settings, difficulty: event.target.value as Difficulty })
        }
        className="mb-5 w-full rounded-sm border border-cyan-300/40 bg-slate-950/75 px-3 py-3 text-slate-50"
      >
        {difficulties.map((difficulty) => (
          <option key={difficulty} value={difficulty}>
            {difficulty}
          </option>
        ))}
      </select>

      <label className="mb-3 block text-sm font-semibold text-slate-200" htmlFor="category">
        Category
      </label>
      <select
        id="category"
        value={settings.category}
        onChange={(event) => onChange({ ...settings, category: event.target.value as Category })}
        className="mb-5 w-full rounded-sm border border-pink-300/40 bg-slate-950/75 px-3 py-3 text-slate-50"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-200">Rounds</legend>
        <div className="grid grid-cols-4 gap-2">
          {rounds.map((roundCount) => (
            <button
              key={roundCount}
              type="button"
              onClick={() => onChange({ ...settings, rounds: roundCount })}
              className={`rounded-sm border px-2 py-2 text-sm font-bold transition ${
                settings.rounds === roundCount
                  ? "border-yellow-200 bg-yellow-300/20 text-yellow-50"
                  : "border-slate-300/25 bg-slate-950/45 text-slate-300 hover:bg-slate-100/10"
              }`}
            >
              {roundCount}
            </button>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
