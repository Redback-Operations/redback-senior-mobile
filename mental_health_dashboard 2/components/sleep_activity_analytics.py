# components/sleep_activity_analytics.py
import os
import pandas as pd
import matplotlib.pyplot as plt
import streamlit as st   # <-- this must be here!

DEFAULT_CSV = os.path.join("data", "sleep_activity.csv")


@st.cache_data
def load_sleep_activity_data(csv_path: str = DEFAULT_CSV) -> pd.DataFrame:
    """Load daily sleep/activity data. Creates a starter CSV if missing."""
    if not os.path.exists(csv_path):
        df_seed = pd.DataFrame({
            "date": pd.date_range("2025-09-01", periods=10, freq="D"),
            "sleep_hours": [7.5, 6.0, 8.2, 7.0, 6.8, 7.9, 7.2, 7.6, 8.1, 7.3],
            "steps": [6000, 3500, 7200, 5000, 4200, 8100, 6200, 7000, 8400, 6900],
        })
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        df_seed.to_csv(csv_path, index=False)

    df = pd.read_csv(csv_path, parse_dates=["date"])
    df = df.sort_values("date")
    return df


def show_sleep_activity():
    st.subheader("🛌 Sleep & Activity Analytics")

    df = load_sleep_activity_data()

    # Rolling averages
    df["sleep_avg_7d"] = df["sleep_hours"].rolling(7).mean()
    df["steps_avg_7d"] = df["steps"].rolling(7).mean()

    # Weekly highlights
    last7 = df.tail(7)
    avg_sleep = round(last7["sleep_hours"].mean(), 1)
    most_active = df.loc[df["steps"].idxmax()]
    longest_sleep = df.loc[df["sleep_hours"].idxmax()]

    c1, c2, c3 = st.columns(3)
    c1.metric("Avg sleep (last 7d)", f"{avg_sleep} hrs")
    c2.metric("Most active day", most_active["date"].strftime("%b %d"))
    c3.metric("Longest sleep", f"{longest_sleep['sleep_hours']} hrs")

    st.caption("Tip: Aim for 7–8 hours per night. Rolling averages smooth day-to-day changes.")

    # Sleep chart
    st.markdown("**📈 Sleep Trend**")
    fig, ax = plt.subplots(figsize=(5, 2.5))
    ax.plot(df["date"], df["sleep_hours"], marker="o", label="Daily Sleep")
    ax.plot(df["date"], df["sleep_avg_7d"], linestyle="--", label="7-Day Avg")
    ax.set_ylabel("Hours")
    ax.set_xlabel("Date")
    ax.legend()
    ax.tick_params(axis="x", rotation=45)
    fig.tight_layout()
    st.pyplot(fig, use_container_width=True)

    # Steps chart
    st.markdown("**🚶 Activity Trend**")
    fig2, ax2 = plt.subplots(figsize=(5, 2.5))
    ax2.plot(df["date"], df["steps"], marker="o", label="Daily Steps")
    ax2.plot(df["date"], df["steps_avg_7d"], linestyle="--", label="7-Day Avg")
    ax2.set_ylabel("Steps")
    ax2.set_xlabel("Date")
    ax2.legend()
    ax2.tick_params(axis="x", rotation=45)
    fig2.tight_layout()
    st.pyplot(fig2, use_container_width=True)
