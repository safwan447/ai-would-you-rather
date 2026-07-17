import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Code2, LineChart, Play, Sparkles } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Would You Rather?",
  description: "A retro arcade AI-powered Would You Rather game."
};

export const viewport: Viewport = {
  themeColor: "#0F172A"
};

const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-username/ai-would-you-rather";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="crt-shell antialiased">
        <div className="pointer-events-none fixed inset-x-0 bottom-0 h-1/2 arcade-grid opacity-35" />
        <header className="sticky top-0 z-40 border-b border-cyan-300/20 bg-slate-950/72 backdrop-blur-xl">
          <nav
            className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
            aria-label="Primary navigation"
          >
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-50">
              <span className="grid size-9 place-items-center rounded-sm border border-cyan-300/60 bg-cyan-300/10 text-cyan-200 shadow-[0_0_18px_rgba(0,245,255,0.35)]">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <span className="font-pixel hidden sm:inline">AI Rather</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/game"
                className="inline-flex size-10 items-center justify-center rounded-sm border border-cyan-300/45 bg-cyan-300/10 text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/20"
                aria-label="Play"
              >
                <Play size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/stats"
                className="inline-flex size-10 items-center justify-center rounded-sm border border-pink-300/45 bg-pink-400/10 text-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-400/20"
                aria-label="Statistics"
              >
                <LineChart size={18} aria-hidden="true" />
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-sm border border-yellow-200/45 bg-yellow-300/10 text-yellow-100 transition hover:-translate-y-0.5 hover:bg-yellow-300/20"
                aria-label="GitHub repository"
              >
                <Code2 size={18} aria-hidden="true" />
              </a>
            </div>
          </nav>
        </header>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
