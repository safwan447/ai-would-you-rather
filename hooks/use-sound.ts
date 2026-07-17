"use client";

export function useSound(enabled: boolean) {
  const play = (type: "select" | "skip" | "complete") => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const frequency = type === "select" ? 520 : type === "complete" ? 740 : 220;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = "square";
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  };

  return { play };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
