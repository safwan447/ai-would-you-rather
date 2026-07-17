import type { Category, Difficulty, Dilemma } from "@/types/game";
import { createId } from "@/utils/game";

type DilemmaTemplate = Pick<Dilemma, "optionA" | "optionB">;

const dilemmas: Record<Category, DilemmaTemplate[]> = {
  random: [
    {
      optionA: "Have a pause button for awkward moments",
      optionB: "Have subtitles for every conversation"
    },
    {
      optionA: "Remember every dream perfectly",
      optionB: "Never forget why you entered a room"
    },
    {
      optionA: "Own a backpack that prints snacks",
      optionB: "Own shoes that always find shortcuts"
    },
    {
      optionA: "Speak every language except your own",
      optionB: "Understand every manual instantly"
    }
  ],
  funny: [
    {
      optionA: "Have dramatic theme music follow you everywhere",
      optionB: "Hear audience laughter after every mistake"
    },
    {
      optionA: "Only be able to whisper compliments",
      optionB: "Only be able to shout apologies"
    },
    {
      optionA: "Win every board game but sneeze confetti",
      optionB: "Lose every board game but get free fries"
    },
    {
      optionA: "Have your autocorrect write poetry",
      optionB: "Have your alarm clock negotiate with you"
    }
  ],
  science: [
    {
      optionA: "Explore the deepest ocean trench",
      optionB: "Walk through a simulated black hole"
    },
    {
      optionA: "See atoms with your eyes",
      optionB: "Hear radio waves as music"
    },
    {
      optionA: "Grow plants twice as fast",
      optionB: "Charge devices with body heat"
    },
    {
      optionA: "Teleport one object per day",
      optionB: "Freeze one cup of water instantly"
    }
  ],
  gaming: [
    {
      optionA: "Respawn once after a bad exam",
      optionB: "Use a save point before big decisions"
    },
    {
      optionA: "Have perfect aim in every game",
      optionB: "Always find the hidden quest"
    },
    {
      optionA: "Live in a cozy farming sim",
      optionB: "Pilot a spaceship in an RPG"
    },
    {
      optionA: "Unlock every cosmetic for free",
      optionB: "Get double XP in real life skills"
    }
  ],
  movies: [
    {
      optionA: "Direct one scene in your favorite film",
      optionB: "Rewrite the ending of one movie"
    },
    {
      optionA: "Hear the soundtrack before big moments",
      optionB: "See bloopers after every serious event"
    },
    {
      optionA: "Attend a premiere in any decade",
      optionB: "Visit one fictional movie set"
    },
    {
      optionA: "Have movie-trailer narration for your day",
      optionB: "Have cinematic lighting in every selfie"
    }
  ]
};

const difficultyTwists: Record<Difficulty, string[]> = {
  easy: ["for one weekend", "with no downside", "and share it with a friend"],
  medium: ["but only once a month", "while everyone knows", "with a tiny inconvenience"],
  hard: ["forever", "but lose the opposite ability", "with a strict time limit"]
};

export const getFallbackDilemma = (category: Category, difficulty: Difficulty): Dilemma => {
  const selectedCategory = category === "random" ? randomCategory() : category;
  const pool = dilemmas[selectedCategory];
  const template = pool[Math.floor(Math.random() * pool.length)];
  const twistPool = difficultyTwists[difficulty];
  const twist = twistPool[Math.floor(Math.random() * twistPool.length)];

  return {
    id: createId(),
    optionA: `${template.optionA} ${twist}`,
    optionB: `${template.optionB} ${twist}`,
    category,
    difficulty,
    createdAt: new Date().toISOString(),
    source: "fallback"
  };
};

const randomCategory = (): Exclude<Category, "random"> => {
  const pool: Exclude<Category, "random">[] = ["funny", "science", "gaming", "movies"];
  return pool[Math.floor(Math.random() * pool.length)];
};
