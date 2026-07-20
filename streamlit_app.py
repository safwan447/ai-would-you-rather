from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Literal

import streamlit as st


Trait = Literal["explorer", "creator", "strategist", "storyteller", "taste"]


@dataclass(frozen=True)
class Option:
    label: str
    description: str
    scores: Dict[Trait, int]


@dataclass(frozen=True)
class Question:
    id: str
    focus_trait: Trait
    prompt: str
    option_a: Option
    option_b: Option


TRAIT_LABELS: Dict[Trait, str] = {
    "explorer": "Cosmic Explorer",
    "creator": "Cozy Creator",
    "strategist": "Puzzle Strategist",
    "storyteller": "Story Dreamer",
    "taste": "Taste Hunter",
}


RESULTS: Dict[Trait, Dict[str, str]] = {
    "explorer": {
        "title": "Your favorite world is: The Neon Space Expedition",
        "tagline": "You like wonder, movement, big ideas, and questions that feel larger than daily life.",
        "project": "Best project match: an AI space-travel dilemma generator with planet cards and route choices.",
    },
    "creator": {
        "title": "Your favorite world is: The Cozy Maker Studio",
        "tagline": "You prefer comfort, expression, aesthetics, and choices that let you build something personal.",
        "project": "Best project match: an AI mood-board game that recommends rooms, outfits, or mini playlists.",
    },
    "strategist": {
        "title": "Your favorite world is: The Retro Strategy Arcade",
        "tagline": "You enjoy rules, trade-offs, progress, and decisions where every move changes the outcome.",
        "project": "Best project match: an AI decision-tree game with scores, paths, and unlockable endings.",
    },
    "storyteller": {
        "title": "Your favorite world is: The Cinematic Story Portal",
        "tagline": "You are drawn to characters, plot twists, imagination, and choices with emotional flavor.",
        "project": "Best project match: an AI story quiz that turns choices into a short movie-like ending.",
    },
    "taste": {
        "title": "Your favorite world is: The Food and Travel Quest",
        "tagline": "You choose through senses, places, novelty, and experiences you can imagine living.",
        "project": "Best project match: an AI travel-food recommender that discovers your ideal day out.",
    },
}


QUESTIONS: List[Question] = [
    Question(
        id="start",
        focus_trait="explorer",
        prompt="You win one impossible weekend. Would you rather...",
        option_a=Option(
            "Board a neon train to a floating city",
            "Pick the strange, cinematic journey.",
            {"explorer": 3, "storyteller": 1},
        ),
        option_b=Option(
            "Get a private arcade that designs games from your mood",
            "Pick the playful, personalized experience.",
            {"creator": 2, "strategist": 1},
        ),
    ),
    Question(
        id="comfort-or-risk",
        focus_trait="creator",
        prompt="Your next choice narrows the vibe. Would you rather...",
        option_a=Option(
            "Customize a tiny dream room that changes every hour",
            "A calm, expressive space built around you.",
            {"creator": 3, "taste": 1},
        ),
        option_b=Option(
            "Open a mystery door that appears once per year",
            "A bold unknown path with a story behind it.",
            {"explorer": 2, "storyteller": 2},
        ),
    ),
    Question(
        id="logic-or-feeling",
        focus_trait="strategist",
        prompt="The game notices how you decide. Would you rather...",
        option_a=Option(
            "See the hidden score behind every decision",
            "You want structure, progress, and clear consequences.",
            {"strategist": 3, "explorer": 1},
        ),
        option_b=Option(
            "Hear the soundtrack that matches every decision",
            "You follow mood, drama, and emotional timing.",
            {"storyteller": 2, "creator": 1, "taste": 1},
        ),
    ),
    Question(
        id="story-depth",
        focus_trait="storyteller",
        prompt="Your path is becoming more specific. Would you rather...",
        option_a=Option(
            "Rewrite the final scene of your favorite movie",
            "You like story control and meaningful endings.",
            {"storyteller": 3, "creator": 1},
        ),
        option_b=Option(
            "Unlock a secret level in real life for one day",
            "You like discovery with rules and rewards.",
            {"strategist": 2, "explorer": 2},
        ),
    ),
    Question(
        id="sensory-choice",
        focus_trait="taste",
        prompt="Now choose what would make the result feel real. Would you rather...",
        option_a=Option(
            "Taste one perfect dish from every country",
            "You care about sensory adventure and memorable moments.",
            {"taste": 3, "explorer": 1},
        ),
        option_b=Option(
            "Design a snack that changes flavor with your mood",
            "You care about playful invention and personal style.",
            {"creator": 2, "taste": 2},
        ),
    ),
    Question(
        id="pressure-test",
        focus_trait="strategist",
        prompt="Final pressure test. Would you rather...",
        option_a=Option(
            "Win a challenge by solving one perfect puzzle",
            "You trust focus, skill, and clever planning.",
            {"strategist": 3, "creator": 1},
        ),
        option_b=Option(
            "Win a challenge by taking one brave leap",
            "You trust instinct, curiosity, and momentum.",
            {"explorer": 2, "storyteller": 1, "taste": 1},
        ),
    ),
    Question(
        id="final-filter",
        focus_trait="storyteller",
        prompt="One last filter decides your favorite outcome. Would you rather...",
        option_a=Option(
            "Keep a scrapbook of the whole adventure",
            "You want memory, meaning, and a clear story.",
            {"storyteller": 2, "creator": 2},
        ),
        option_b=Option(
            "Turn the adventure into a leaderboard challenge",
            "You want goals, mastery, and replay value.",
            {"strategist": 3, "explorer": 1},
        ),
    ),
]


def init_state() -> None:
    if "step" not in st.session_state:
        st.session_state.step = 0
    if "scores" not in st.session_state:
        st.session_state.scores = {trait: 0 for trait in TRAIT_LABELS}
    if "history" not in st.session_state:
        st.session_state.history = []
    if "started_at" not in st.session_state:
        st.session_state.started_at = datetime.now().isoformat(timespec="seconds")


def reset_game() -> None:
    st.session_state.step = 0
    st.session_state.scores = {trait: 0 for trait in TRAIT_LABELS}
    st.session_state.history = []
    st.session_state.started_at = datetime.now().isoformat(timespec="seconds")


def choose_option(question: Question, side: Literal["A", "B"], option: Option) -> None:
    for trait, points in option.scores.items():
        st.session_state.scores[trait] += points

    st.session_state.history.append(
        {
            "round": st.session_state.step + 1,
            "question": question.prompt,
            "selected_side": side,
            "selected_option": option.label,
            "scores_after_choice": dict(st.session_state.scores),
        }
    )
    st.session_state.step += 1


def top_trait() -> Trait:
    scores: Dict[Trait, int] = st.session_state.scores
    return max(scores, key=lambda trait: (scores[trait], -list(TRAIT_LABELS).index(trait)))


def get_next_question() -> Question:
    asked_ids = {item["question"] for item in st.session_state.history}
    preferred_trait = top_trait()

    for question in QUESTIONS:
        if question.prompt not in asked_ids and question.focus_trait == preferred_trait:
            return question

    for question in QUESTIONS:
        if question.prompt not in asked_ids:
            return question

    return QUESTIONS[-1]


def render_styles() -> None:
    st.markdown(
        """
        <style>
        .stApp {
            background:
                radial-gradient(circle at top left, rgba(0, 245, 255, 0.16), transparent 32rem),
                radial-gradient(circle at bottom right, rgba(255, 60, 172, 0.18), transparent 32rem),
                linear-gradient(135deg, #0F172A 0%, #151133 48%, #0F172A 100%);
            color: #F8FAFC;
        }
        .main .block-container {
            max-width: 1050px;
            padding-top: 2rem;
        }
        .arcade-card {
            border: 1px solid rgba(0, 245, 255, 0.45);
            background: rgba(15, 23, 42, 0.82);
            box-shadow: 0 0 28px rgba(0, 245, 255, 0.18), inset 0 0 28px rgba(255, 60, 172, 0.08);
            padding: 1.25rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .pixel {
            font-family: "Lucida Console", "Courier New", monospace;
            text-transform: uppercase;
            letter-spacing: 0;
        }
        .neon-title {
            text-shadow: 0 0 10px rgba(0,245,255,.8), 0 0 26px rgba(255,60,172,.45);
        }
        .small-label {
            color: #FFE600;
            font-size: .78rem;
            text-transform: uppercase;
            font-weight: 800;
        }
        div[data-testid="stProgress"] > div > div {
            background: linear-gradient(90deg, #00F5FF, #FF3CAC, #FFE600);
        }
        .stButton > button {
            border-radius: 4px;
            border: 1px solid rgba(0, 245, 255, 0.55);
            background: rgba(0, 245, 255, 0.12);
            color: #F8FAFC;
            min-height: 4.25rem;
            font-weight: 800;
            transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .stButton > button:hover {
            transform: translateY(-2px);
            background: rgba(255, 60, 172, 0.16);
            border-color: rgba(255, 230, 0, 0.75);
            box-shadow: 0 0 24px rgba(255, 60, 172, 0.22);
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_question(question: Question) -> None:
    round_number = st.session_state.step + 1
    total_rounds = len(QUESTIONS)

    st.progress(st.session_state.step / total_rounds)
    st.markdown(
        f"""
        <div class="arcade-card">
            <div class="small-label">Round {round_number} of {total_rounds} | Current signal: {TRAIT_LABELS[top_trait()]}</div>
            <h2 class="pixel neon-title">Would you rather...</h2>
            <p style="font-size:1.25rem;font-weight:800;">{question.prompt}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    left, right = st.columns(2)
    with left:
        st.markdown(f"**A. {question.option_a.label}**")
        st.caption(question.option_a.description)
        if st.button("Choose A", use_container_width=True):
            choose_option(question, "A", question.option_a)
            st.rerun()

    with right:
        st.markdown(f"**B. {question.option_b.label}**")
        st.caption(question.option_b.description)
        if st.button("Choose B", use_container_width=True):
            choose_option(question, "B", question.option_b)
            st.rerun()


def render_result() -> None:
    winner = top_trait()
    result = RESULTS[winner]
    scores = st.session_state.scores
    export_data = {
        "result": result,
        "scores": scores,
        "history": st.session_state.history,
        "started_at": st.session_state.started_at,
        "finished_at": datetime.now().isoformat(timespec="seconds"),
    }

    st.balloons()
    st.progress(1.0)
    st.markdown(
        f"""
        <div class="arcade-card">
            <div class="small-label">Final recommendation</div>
            <h1 class="pixel neon-title">{result["title"]}</h1>
            <p style="font-size:1.1rem;">{result["tagline"]}</p>
            <p><strong>{result["project"]}</strong></p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.subheader("Why this result?")
    st.write(
        "Each answer added points to a preference profile. The next question used your strongest signal, "
        "so the quiz narrowed down instead of asking random questions forever."
    )

    st.bar_chart(scores)

    with st.expander("Your choice path"):
        for item in st.session_state.history:
            st.write(f"Round {item['round']}: {item['selected_side']} - {item['selected_option']}")

    st.download_button(
        "Download result JSON",
        data=json.dumps(export_data, indent=2),
        file_name="ai-would-you-rather-result.json",
        mime="application/json",
        use_container_width=True,
    )

    if st.button("Play again", use_container_width=True):
        reset_game()
        st.rerun()


def main() -> None:
    st.set_page_config(
        page_title="AI Would You Rather?",
        page_icon="?",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    init_state()
    render_styles()

    with st.sidebar:
        st.markdown("### AI Would You Rather?")
        st.write("A guided decision game that discovers your favorite adventure style.")
        st.metric("Questions", f"{min(st.session_state.step, len(QUESTIONS))}/{len(QUESTIONS)}")
        st.metric("Leading result", TRAIT_LABELS[top_trait()])
        if st.button("Restart", use_container_width=True):
            reset_game()
            st.rerun()

    st.markdown(
        """
        <div class="arcade-card">
            <div class="small-label">Retro decision engine</div>
            <h1 class="pixel neon-title">AI Would You Rather?</h1>
            <p style="font-size:1.15rem;">
                Answer a short chain of choices. Each answer narrows the next question, then the game
                ends with your favorite adventure world and a project-style recommendation.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.session_state.step >= len(QUESTIONS):
        render_result()
    else:
        render_question(get_next_question())


if __name__ == "__main__":
    main()
