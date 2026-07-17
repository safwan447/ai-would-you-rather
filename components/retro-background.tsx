"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const particles = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  duration: `${3 + (index % 6)}s`,
  color: index % 3 === 0 ? "#00F5FF" : index % 3 === 1 ? "#FF3CAC" : "#FFE600"
}));

export function RetroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle absolute size-1.5 rounded-full opacity-60"
          style={{
            left: particle.left,
            top: particle.top,
            background: particle.color,
            boxShadow: `0 0 18px ${particle.color}`,
            "--duration": particle.duration
          } as CSSProperties}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full border border-cyan-300/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.34, 0.16] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
