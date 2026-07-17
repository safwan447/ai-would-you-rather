"use client";

const colors = ["#00F5FF", "#FF3CAC", "#FFE600", "#F8FAFC"];

export function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 42 }, (_, index) => (
        <span
          key={index}
          className="confetti-piece absolute top-0 h-3 w-1.5 rounded-sm"
          style={{
            left: `${(index * 19) % 100}%`,
            background: colors[index % colors.length],
            animationDelay: `${(index % 9) * 0.05}s`
          }}
        />
      ))}
    </div>
  );
}
