# AI Would You Rather?

A retro arcade decision game built for a Samsung Innovation Campus mini project portfolio.

The reviewer feedback was that an endless "choose A or B" game felt vague, so the project now has a clear endpoint: each answer updates a preference profile, the next question adapts to the strongest signal, and the final screen recommends the player's favorite adventure world.

## Live Hosting

Primary hosting target: Streamlit Community Cloud.

Main app file:

```text
streamlit_app.py
```

## What The App Does

1. The player answers a "Would you rather..." question.
2. Each selected option adds points to traits such as explorer, creator, strategist, storyteller, and taste.
3. The next question is selected based on the current strongest trait.
4. After seven rounds, the game ends with a concrete result:
   - Favorite adventure world
   - Personality-style explanation
   - Recommended mini-project direction
   - Score chart
   - Downloadable JSON result

This makes the game feel like a guided recommender instead of an infinite random-question loop.

## Features

- Streamlit-ready app with `requirements.txt`.
- Clear seven-question endpoint.
- Adaptive question narrowing based on player choices.
- Final recommendation screen.
- Retro arcade styling with neon colors and dark theme.
- Clean centered layout with a progress bar, two choice buttons, final result, and optional details.
- No API key required for the Streamlit version.
- Previous Next.js version is still included in the repository for reference.

## Tech Stack

Primary:

- Python
- Streamlit

Previous web version:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Run Locally

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Streamlit app:

```bash
streamlit run streamlit_app.py
```

Open the local URL shown by Streamlit, usually:

```text
http://localhost:8501
```

## Deploy To Streamlit Community Cloud

1. Push this repository to GitHub.
2. Go to [Streamlit Community Cloud](https://share.streamlit.io/).
3. Create a new app from:

```text
safwan447/ai-would-you-rather
```

4. Set the main file path to:

```text
streamlit_app.py
```

5. Deploy.

Streamlit Cloud will install dependencies from `requirements.txt`.

## Folder Structure

```text
streamlit_app.py          Primary Streamlit app
requirements.txt          Streamlit Cloud dependencies
.streamlit/config.toml    Streamlit theme config
app/                      Previous Next.js App Router version
components/               Previous React components
hooks/                    Previous React hooks
lib/                      Fallback dilemma data
services/                 Previous OpenAI service
types/                    TypeScript types
utils/                    Game helpers
public/                   Static assets
```

## Future Improvements

- Add more result categories.
- Add a settings panel for quiz length.
- Add optional OpenAI-generated final messages.
- Add shareable result cards.
- Store aggregate stats across sessions.

## License

MIT License. You may use and adapt this project for learning, portfolio, and deployment purposes.
