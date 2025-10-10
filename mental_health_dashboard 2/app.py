# app.py — clean ordering & imports

# --- Make local packages importable BEFORE any local imports ---
import os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# --- Third-party ---
import streamlit as st
import pandas as pd

# --- Local modules ---
from utils.data_loader import load_data
from utils.mood_logic import get_mood_zone
from components.dashboard import mood_summary
from components.mood_chart import mood_trend_chart
from components.support_mindfulness import support_section, mindfulness_gif
from components.chatbot import chatbot_box, show_hotlines
from components.game_mind_match import play_mind_match
from components.med_calendar import medication_calendar
from components.memory_lane import memory_lane
from components.sleep_activity_analytics import show_sleep_activity  # <-- now exists
# from components.heart_rate_indicator import show_heart_rate_indicator  # optional

# --- Streamlit config ---
st.set_page_config(page_title="ElderCare Wellness", layout="wide")

# --- Styles ---
st.markdown("""
<style>
    .main { background-color: #f5f5f5; font-family: 'Segoe UI', sans-serif; font-size: 18px; }
    h1, h2, h3, h4 { color: #2E4A62; }
    .stButton>button { background-color: #6c8caf; color: white; font-size: 18px; border-radius: 12px; }
</style>
""", unsafe_allow_html=True)

# --- Sidebar ---
with st.sidebar:
    st.header("Quick Actions")
    st.button("Add a Memory")

# --- Data ---
df = load_data().copy()
if "Date" in df.columns:
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

latest = df.iloc[-1]
zone = get_mood_zone(latest["MoodScore"])
MOOD_COLORS = {"good": "#A2D5AB", "moderate": "#FFF9C4", "low": "#EF9A9A"}
mood_color = MOOD_COLORS.get(zone, "#A2D5AB")

# --- Header ---
st.markdown("## <b>ElderCare Mental Wellness Dashboard</b>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    mood_summary(latest, df, mood_color)

with col2:
    st.markdown(
        "<div style='padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff'><h4>🛌️ Sleep & Movement</h4></div>",
        unsafe_allow_html=True
    )
    st.metric("Sleep (hrs)", f"{latest['SleepHours']} hrs")
    st.metric("Movement Score", f"{latest['MovementScore']} pts")
    st.metric("Medication", "✅ Taken" if latest["MedicationTaken"] == 1 else "⚠️ Missed")

# --- Tips ---
st.markdown("---")
st.subheader("🌞 Daily Wellness Tip")
if latest["SleepHours"] < 6.5:
    st.info("Try to get at least 7 hours of sleep. Good rest improves mood!")
elif latest["MovementScore"] < 40:
    st.info("A short walk or gentle stretch may help lift your energy.")
else:
    st.success("You're doing well today! Keep it up.")

# --- Trends ---
st.markdown("---")
mood_trend_chart(df)

# --- NEW: Sleep & Activity Analytics ---
st.markdown("---")
show_sleep_activity()

# --- Optional: Heart Rate indicator ---
# st.markdown("---")
# show_heart_rate_indicator()

# --- Support & Mindfulness ---
st.markdown("---")
st.subheader("🪘 Support & Mindfulness")
col3, col4 = st.columns(2)
with col3:
    support_section()
with col4:
    mindfulness_gif()

# --- Hotlines ---
if "show_hotlines" not in st.session_state:
    st.session_state.show_hotlines = False
em_col1, em_col2 = st.columns([1, 6])
with em_col1:
    if st.button("🚨 Emergency Help"):
        st.session_state.show_hotlines = True
with em_col2:
    if st.session_state.show_hotlines:
        show_hotlines(target=st)

# --- Chatbot ---
chatbot_box(latest["MoodScore"])

# --- Game ---
st.markdown("---")
play_mind_match()

# --- Medication calendar ---
st.markdown("---")
st.subheader("📅 Medication Adherence")
medication_calendar(df, date_col="Date", flag_col="MedicationTaken")

# --- Memory Lane ---
st.markdown("---")
memory_lane()
