"use client";

import { useEffect, useState } from "react";

export function TypingText({ text, className = "" }: { text: string; className?: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [text]);

  return <span className={className}>{visibleText}</span>;
}
