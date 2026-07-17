"use client";

import { motion } from "framer-motion";
import { Copy, Heart, Share2, SkipForward } from "lucide-react";
import { ArcadeButton } from "@/components/arcade-button";
import { TypingText } from "@/components/typing-text";
import type { ChoiceSide, Dilemma } from "@/types/game";

export function DilemmaCard({
  dilemma,
  loading,
  selectedSide,
  onSelect,
  onSkip,
  onCopy,
  onShare,
  onFavorite
}: {
  dilemma: Dilemma | null;
  loading: boolean;
  selectedSide: ChoiceSide | null;
  onSelect: (side: ChoiceSide) => void;
  onSkip: () => void;
  onCopy: () => void;
  onShare: () => void;
  onFavorite: () => void;
}) {
  return (
    <motion.section
      className="neon-card rounded-sm p-5 sm:p-7"
      animate={{ scale: selectedSide ? [1, 1.015, 1] : 1 }}
      transition={{ duration: 0.35 }}
      aria-live="polite"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-pink-200">
            Would you rather...
          </p>
          <h1 className="font-pixel text-xl leading-relaxed text-cyan-100 sm:text-2xl">
            {loading || !dilemma ? "Generating dilemma" : "Choose your side"}
          </h1>
        </div>
        <div className="retro-loader mt-2" aria-hidden="true" />
      </div>

      {loading || !dilemma ? (
        <div className="grid min-h-80 place-items-center text-center">
          <div>
            <div className="mx-auto mb-5 retro-loader" />
            <p className="font-pixel text-sm text-yellow-100">Booting AI arcade brain...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <OptionButton
            side="A"
            text={dilemma.optionA}
            selected={selectedSide === "A"}
            disabled={Boolean(selectedSide)}
            onSelect={onSelect}
          />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-cyan-300/30" />
            <span className="font-pixel text-sm text-yellow-100">OR</span>
            <span className="h-px flex-1 bg-pink-300/30" />
          </div>
          <OptionButton
            side="B"
            text={dilemma.optionB}
            selected={selectedSide === "B"}
            disabled={Boolean(selectedSide)}
            onSelect={onSelect}
          />

          <div className="flex flex-wrap gap-2 pt-3">
            <ArcadeButton variant="ghost" onClick={onSkip} icon={<SkipForward size={17} />}>
              Skip
            </ArcadeButton>
            <ArcadeButton variant="ghost" onClick={onCopy} icon={<Copy size={17} />}>
              Copy
            </ArcadeButton>
            <ArcadeButton variant="ghost" onClick={onShare} icon={<Share2 size={17} />}>
              Share
            </ArcadeButton>
            <ArcadeButton variant="ghost" onClick={onFavorite} icon={<Heart size={17} />}>
              Save
            </ArcadeButton>
          </div>
        </div>
      )}
    </motion.section>
  );
}

function OptionButton({
  side,
  text,
  selected,
  disabled,
  onSelect
}: {
  side: ChoiceSide;
  text: string;
  selected: boolean;
  disabled: boolean;
  onSelect: (side: ChoiceSide) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(side)}
      disabled={disabled}
      className={`min-h-32 w-full rounded-sm border p-5 text-left transition ${
        selected
          ? "border-yellow-200 bg-yellow-300/20 text-yellow-50 shadow-[0_0_30px_rgba(255,230,0,0.28)]"
          : "border-cyan-300/35 bg-slate-950/45 text-slate-50 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/12"
      }`}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      aria-label={`Choose option ${side}: ${text}`}
    >
      <span className="mb-3 inline-flex size-8 items-center justify-center rounded-sm border border-current font-pixel text-sm">
        {side}
      </span>
      <span className="block text-xl font-black leading-snug sm:text-2xl">
        <TypingText text={text} />
      </span>
    </motion.button>
  );
}
