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
        "title": "Neon Space Expedition",
        "tagline": "You like wonder, movement, and big imaginative choices.",
        "project": "Build idea: an AI space-travel picker with planet cards and route choices.",
    },
    "creator": {
        "title": "Cozy Maker Studio",
        "tagline": "You prefer comfort, creativity, and personal expression.",
        "project": "Build idea: an AI mood-board game for rooms, outfits, or mini playlists.",
    },
    "strategist": {
        "title": "Retro Strategy Arcade",
        "tagline": "You enjoy trade-offs, progress, and choices with consequences.",
        "project": "Build idea: an AI decision-tree game with paths and unlockable endings.",
    },
    "storyteller": {
        "title": "Cinematic Story Portal",
        "tagline": "You are drawn to characters, plot twists, and emotional choices.",
        "project": "Build idea: an AI story quiz that turns choices into a movie-like ending.",
    },
    "taste": {
        "title": "Food and Travel Quest",
        "tagline": "You choose through places, flavors, and memorable experiences.",
        "project": "Build idea: an AI travel-food recommender for your ideal day out.",
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
            max-width: 900px;
            padding-top: 2rem;
            padding-bottom: 2rem;
        }
        [data-testid="stSidebar"], [data-testid="collapsedControl"] {
            display: none;
        }
        .arcade-card {
            border: 1px solid rgba(0, 245, 255, 0.45);
            background: rgba(15, 23, 42, 0.82);
            box-shadow: 0 0 22px rgba(0, 245, 255, 0.14), inset 0 0 20px rgba(255, 60, 172, 0.06);
            padding: 1rem 1.15rem;
            border-radius: 4px;
            margin-bottom: .85rem;
        }
        .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: .75rem;
        }
        .status-pill {
            border: 1px solid rgba(255, 230, 0, 0.4);
            color: #FFE600;
            padding: .4rem .65rem;
            border-radius: 999px;
            font-size: .78rem;
            font-weight: 800;
            white-space: nowrap;
        }
        .pixel {
            font-family: "Lucida Console", "Courier New", monospace;
            text-transform: uppercase;
            letter-spacing: 0;
        }
        .app-title {
            font-size: clamp(2rem, 6vw, 3.6rem);
            line-height: 1.05;
            margin: .15rem 0 .45rem;
        }
        .result-title {
            font-size: clamp(2rem, 6vw, 3.8rem);
            line-height: 1.05;
            margin: .25rem 0 .85rem;
        }
        .question-title {
            font-size: clamp(1.45rem, 4vw, 2.35rem);
            line-height: 1.18;
            margin: .2rem 0;
        }
        .muted {
            color: rgba(248, 250, 252, .72);
            margin: 0;
        }
        .neon-title {
            text-shadow: 0 0 8px rgba(0,245,255,.65), 0 0 18px rgba(255,60,172,.3);
        }
        .small-label {
            color: #FFE600;
            font-size: .72rem;
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
            min-height: 3.6rem;
            font-weight: 800;
            white-space: normal;
            transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .stButton > button:hover {
            transform: translateY(-2px);
            background: rgba(255, 60, 172, 0.16);
            border-color: rgba(255, 230, 0, 0.75);
            box-shadow: 0 0 24px rgba(255, 60, 172, 0.22);
        }
        @media (max-width: 700px) {
            .topbar {
                align-items: flex-start;
                flex-direction: column;
            }
            .status-pill {
                white-space: normal;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_header() -> None:
    st.markdown(
        """
        <div class="topbar">
            <div>
                <div class="small-label">Adaptive choice game</div>
                <h1 class="pixel neon-title app-title">AI Would You Rather?</h1>
                <p class="muted">Answer 7 choices. Get one final result.</p>
            </div>
        </div>
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
            <div class="topbar">
                <div class="small-label">Round {round_number} / {total_rounds}</div>
                <div class="status-pill">{TRAIT_LABELS[top_trait()]}</div>
            </div>
            <h2 class="pixel neon-title question-title">{question.prompt}</h2>
        </div>
        """,
        unsafe_allow_html=True,
    )

    left, right = st.columns(2)
    with left:
        if st.button(f"A. {question.option_a.label}", use_container_width=True):
            choose_option(question, "A", question.option_a)
            st.rerun()

    with right:
        if st.button(f"B. {question.option_b.label}", use_container_width=True):
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

    st.progress(1.0)
    st.markdown(
        f"""
        <div class="arcade-card">
            <div class="small-label">Your final result</div>
            <h1 class="pixel neon-title result-title">{result["title"]}</h1>
            <p style="font-size:1.08rem;margin-bottom:.65rem;">{result["tagline"]}</p>
            <p style="margin:0;"><strong>{result["project"]}</strong></p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    left, right = st.columns(2)
    with left:
        if st.button("Play again", use_container_width=True):
            reset_game()
            st.rerun()

    with right:
        st.download_button(
            "Download result",
            data=json.dumps(export_data, indent=2),
            file_name="ai-would-you-rather-result.json",
            mime="application/json",
            use_container_width=True,
        )

    with st.expander("Details"):
        st.caption("Trait score")
        st.bar_chart(scores)

        st.caption("Choice path")
        for item in st.session_state.history:
            st.write(f"Round {item['round']}: {item['selected_side']} - {item['selected_option']}")


def main() -> None:
    st.set_page_config(
        page_title="AI Would You Rather?",
        page_icon="?",
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    init_state()
    render_styles()
    render_header()

    if st.session_state.step >= len(QUESTIONS):
        render_result()
    else:
        render_question(get_next_question())


if __name__ == "__main__":
    main()
