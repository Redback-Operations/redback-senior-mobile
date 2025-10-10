import streamlit as st
import pandas as pd
import os
from datetime import date
from nltk.sentiment.vader import SentimentIntensityAnalyzer

JOURNAL_FILE = "data/mood_journal.csv"

# --- Load Journal ---
def load_journal():
    if os.path.exists(JOURNAL_FILE):
        return pd.read_csv(JOURNAL_FILE, parse_dates=["date"])
    else:
        return pd.DataFrame(columns=["date", "entry", "sentiment", "score"])

# --- Save Journal ---
def save_journal(df):
    df.to_csv(JOURNAL_FILE, index=False)

# --- Sentiment Analysis ---
def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    score = sia.polarity_scores(text)["compound"]
    if score >= 0.05:
        return "Positive", score
    elif score <= -0.05:
        return "Negative", score
    else:
        return "Neutral", score

# --- Mood Journal Component ---
def show_mood_journal():
    st.header("📝 Mood Journal with Sentiment Analysis")

    # Load existing entries
    journal_df = load_journal()

    # --- Add New Entry ---
    with st.form("mood_entry_form", clear_on_submit=True):
        entry_text = st.text_area("How are you feeling today?", height=100)
        submitted = st.form_submit_button("Save Entry")

        if submitted and entry_text.strip():
            sentiment, score = analyze_sentiment(entry_text)
            new_entry = pd.DataFrame([[date.today(), entry_text, sentiment, score]],
                                     columns=["date", "entry", "sentiment", "score"])
            journal_df = pd.concat([journal_df, new_entry], ignore_index=True)
            save_journal(journal_df)
            st.success(f"Entry saved! Sentiment detected: {sentiment}")

    # --- Display Journal Entries ---
    if not journal_df.empty:
        st.subheader("Your Entries")
        st.dataframe(journal_df.sort_values("date", ascending=False).reset_index(drop=True))

        # --- Weekly Summary ---
        st.subheader("📊 Weekly Sentiment Summary")
        last_week = journal_df[journal_df["date"] >= pd.Timestamp.today() - pd.Timedelta(days=7)]
        if not last_week.empty:
            summary = last_week["sentiment"].value_counts()
            st.write(summary.to_frame("Days"))

            # Chart
            st.bar_chart(summary)
        else:
            st.info("No entries in the past 7 days.")
    else:
        st.info("No journal entries yet. Write your first one above!")
