# AI Would You Rather?

A polished retro arcade web game that generates safe, creative "Would You Rather?" dilemmas with AI. Built for a Samsung Innovation Campus mini project portfolio using Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, and the OpenAI API.

## Features

- AI-generated dilemmas returned as strict JSON.
- Safe local fallback dilemmas when `OPENAI_API_KEY` is not configured.
- Retro arcade UI with CRT scan lines, neon cards, glow effects, particles, and animated controls.
- Difficulty, category, round count, and sound effect settings.
- Score tracking, current streak, question count, and choices made.
- Skip, copy, share, play again, keyboard shortcuts, and every-10-round confetti.
- Local storage history, favorites, statistics, and JSON history export.
- Responsive layout for desktop, tablet, and mobile.
- Accessible buttons, labels, keyboard navigation, and high contrast colors.

## Screenshots

Add screenshots after deployment:

- `docs/screenshots/home.png`
- `docs/screenshots/game.png`
- `docs/screenshots/stats.png`

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- OpenAI API
- Vercel-ready deployment

## Installation

```bash
pnpm install
```

## Environment Setup

Create a local environment file:

```bash
cp .env.example .env.local
```

Then add your OpenAI key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username/ai-would-you-rather
```

The API key is only used by the server route at `app/api/dilemma/route.ts` and is never exposed to the browser.

## Running Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Deploying to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add `OPENAI_API_KEY` in Vercel Project Settings under Environment Variables.
4. Deploy.

The app still works without the key because it uses local fallback dilemmas, but AI generation requires `OPENAI_API_KEY`.

## Folder Structure

```text
app/
  api/dilemma/       Server route for dilemma generation
  game/              Main playable game
  stats/             Local statistics dashboard
components/          Reusable UI components
hooks/               Local storage and sound hooks
lib/                 Fallback dilemma data
services/            OpenAI generation service
types/               Shared TypeScript types
utils/               Game helpers and export utilities
public/              Static assets
styles/              Reserved for extra style modules
```

## Future Improvements

- User accounts and cloud-synced history.
- Multiplayer voting rooms.
- Shareable daily challenge links.
- More AI categories and custom prompt themes.
- Real audio sprites and visualizer effects.
- Screenshot export for favorite dilemmas.

## License

MIT License. You may use and adapt this project for learning, portfolio, and deployment purposes.
