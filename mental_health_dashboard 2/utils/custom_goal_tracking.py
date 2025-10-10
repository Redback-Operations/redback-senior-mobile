import streamlit as st
import pandas as pd
import os

GOALS_FILE = "data/goals.csv"

# --- Load Goals ---
def load_goals():
    if os.path.exists(GOALS_FILE):
        return pd.read_csv(GOALS_FILE)
    else:
        return pd.DataFrame(columns=["goal", "target", "progress"])

# --- Save Goals ---
def save_goals(df):
    df.to_csv(GOALS_FILE, index=False)

# --- Show Goal Tracker ---
def show_goal_tracker():
    st.header("🎯 Custom Goal Tracking")

    # Load existing goals
    goals_df = load_goals()

    # --- Add New Goal ---
    with st.form("add_goal_form", clear_on_submit=True):
        goal_text = st.text_input("Enter a goal (e.g., Walk 3 times this week)")
        target_number = st.number_input("Target count", min_value=1, max_value=50, value=1)
        submitted = st.form_submit_button("Add Goal")

        if submitted and goal_text:
            new_goal = pd.DataFrame([[goal_text, target_number, 0]], columns=["goal", "target", "progress"])
            goals_df = pd.concat([goals_df, new_goal], ignore_index=True)
            save_goals(goals_df)
            st.success(f"Added new goal: {goal_text}")

    # --- Display & Update Goals ---
    if not goals_df.empty:
        st.subheader("Your Goals")

        for idx, row in goals_df.iterrows():
            st.write(f"**{row['goal']}** (Target: {row['target']})")

            # Progress Bar
            progress_value = int((row["progress"] / row["target"]) * 100)
            st.progress(progress_value)

            # Increment Button
            if st.button(f"✅ Mark progress for: {row['goal']}", key=f"progress_{idx}"):
                goals_df.at[idx, "progress"] = min(goals_df.at[idx, "progress"] + 1, row["target"])
                save_goals(goals_df)
                st.experimental_rerun()

    else:
        st.info("No goals added yet. Use the form above to create one.")
