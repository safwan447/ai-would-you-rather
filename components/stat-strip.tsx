import { Flame, ListChecks, Trophy } from "lucide-react";

export function StatStrip({
  questionCount,
  choicesMade,
  streak
}: {
  questionCount: number;
  choicesMade: number;
  streak: number;
}) {
  const stats = [
    { label: "Round", value: questionCount, icon: ListChecks },
    { label: "Choices", value: choicesMade, icon: Trophy },
    { label: "Streak", value: streak, icon: Flame }
  ];

  return (
    <section className="grid grid-cols-3 gap-2" aria-label="Game status">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="neon-card rounded-sm p-3 text-center">
            <Icon className="mx-auto mb-1 text-cyan-200" size={18} aria-hidden="true" />
            <p className="text-lg font-black text-white">{item.value}</p>
            <p className="text-[0.68rem] uppercase text-slate-400">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}
