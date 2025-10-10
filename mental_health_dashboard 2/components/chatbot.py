# components/chatbot.py
import streamlit as st
import openai
from utils.sanitizer import sanitize_input, detect_crisis

# --- Reusable hotline drawer ---
def show_hotlines(target=st.sidebar):
    target.markdown("### 🚨 Immediate Help")
    target.info(
        "If you’re in danger or thinking about self-harm, please seek help now."
    )
    # AU numbers (keep or localise as needed)
    target.markdown(
        """
- **Lifeline (24/7): 13 11 14**  
- **Beyond Blue: 1300 22 4636**  
- **Emergency: 000**

*If you are outside Australia:*  
- **Suicide & Crisis Lifeline (US): 988**  
- **Samaritans (UK/ROI): 116 123**
        """
    )
    target.warning("This assistant can’t provide medical advice.")

def chatbot_box(mood_score: int):
    # --- API key status ---
    openai.api_key = st.secrets.get("OPENAI_API_KEY")
    st.sidebar.markdown("## 🤖 Chat with Wellness Assistant")
    st.sidebar.write("🔐 Key loaded:", "✅" if openai.api_key else "❌ Not found")

    # --- Quick Emergency button (always visible) ---
    if "show_hotlines" not in st.session_state:
        st.session_state.show_hotlines = False

    if st.sidebar.button("🚨 Quick Emergency Help"):
        st.session_state.show_hotlines = True

    if st.session_state.show_hotlines:
        show_hotlines()

    # --- User input ---
    user_query = st.sidebar.text_input("Ask anything (e.g., Tips for better sleep)")

    if not user_query:
        return

    # --- Crisis detection (blocks model call & shows resources) ---
    if detect_crisis(user_query):
        st.sidebar.error("I’m really sorry you’re feeling this way. You deserve help right now.")
        show_hotlines()
        # Optional gentle nudge in main area too
        st.warning("If this is an emergency, please call your local emergency number immediately.")
        return  # Do NOT call the model in a crisis path

    # --- Normal path: sanitise & call model ---
    clean_input = sanitize_input(user_query)
    prompt = f"""
You are a friendly wellness assistant for elderly users.
Mood score: {mood_score}/100. User asked: "{clean_input}"

{'Be gentle and supportive.' if mood_score < 65 else 'Share a wellness tip.'}
Keep reply under 100 words.
"""

    try:
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        reply = res.choices[0].message["content"]
    except Exception:
        reply = "⚠️ Chatbot error: Check your OpenAI key or connection."

    st.sidebar.markdown("**Assistant Response:**")
    st.sidebar.success(reply)

    if mood_score < 65:
        st.sidebar.markdown("\n💡 *You seem a bit down today. Try calling a loved one or taking a short walk.*")
