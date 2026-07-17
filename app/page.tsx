import { Brain, Code2, HelpCircle, Play, Sparkles } from "lucide-react";
import { ArcadeLink } from "@/components/arcade-button";
import { RetroBackground } from "@/components/retro-background";

const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-username/ai-would-you-rather";

export default function HomePage() {
  return (
    <>
      <RetroBackground />
      <section className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-6xl content-center px-4 py-12 sm:px-6">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
            <Sparkles size={16} aria-hidden="true" />
            Samsung Innovation Campus Mini Project
          </div>
          <h1 className="font-pixel text-glow text-4xl leading-tight text-white sm:text-6xl lg:text-7xl">
            AI Would You Rather?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Endless AI-generated dilemmas that make choosing impossible.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ArcadeLink href="/game" icon={<Play size={18} />} className="min-w-32">
              Play
            </ArcadeLink>
            <ArcadeLink href="#how-it-works" variant="secondary" icon={<HelpCircle size={18} />}>
              How It Works
            </ArcadeLink>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-yellow-200/70 bg-yellow-300/15 px-4 py-3 text-sm font-bold text-yellow-50 shadow-[0_0_20px_rgba(255,230,0,0.2)] transition hover:-translate-y-0.5 hover:bg-yellow-300/25"
            >
              <Code2 size={18} aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-cyan-300/15 bg-slate-950/45 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              title: "Generate",
              body: "The API route asks OpenAI for safe JSON dilemmas, then falls back locally if no key is configured."
            },
            {
              title: "Choose",
              body: "Keyboard and touch controls make every round fast, animated, and accessible."
            },
            {
              title: "Track",
              body: "Local storage keeps history, favorites, categories, streaks, and exportable stats."
            }
          ].map((item) => (
            <article key={item.title} className="neon-card rounded-sm p-5">
              <Brain className="mb-4 text-pink-200" aria-hidden="true" />
              <h2 className="font-pixel mb-3 text-base text-cyan-100">{item.title}</h2>
              <p className="text-sm leading-6 text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
