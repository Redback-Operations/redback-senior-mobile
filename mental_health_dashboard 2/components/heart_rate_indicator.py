import streamlit as st
import random
import matplotlib.pyplot as plt

def show_heart_rate_indicator():
    st.subheader("❤️ Heart Rate & Stress Indicator")
    heart_rate = random.randint(55, 120)  # simulate for now

    if heart_rate < 70:
        status, color = "Calm", "green"
    elif heart_rate <= 90:
        status, color = "Moderate", "yellow"
    else:
        status, color = "High Stress", "red"

    st.write(f"Current Heart Rate: **{heart_rate} bpm** — Status: **{status}**")

    fig, ax = plt.subplots(figsize=(4, 2))
    ax.barh(0, 70, color="green", alpha=0.4)
    ax.barh(0, 20, left=70, color="yellow", alpha=0.4)
    ax.barh(0, 50, left=90, color="red", alpha=0.4)
    ax.axvline(heart_rate, color=color, linewidth=3)
    ax.set_xlim(50, 140); ax.set_yticks([]); ax.set_xlabel("Heart Rate (bpm)")
    ax.set_title("Stress Indicator")
    st.pyplot(fig)

    st.info("Simulated data. Connect Fitbit/Apple Health later.")
