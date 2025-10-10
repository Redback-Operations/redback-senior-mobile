from __future__ import annotations

import os, json
from datetime import datetime, timedelta, date
import pandas as pd
import streamlit as st

# --- Safe import of local utils (works even if run from different cwd) ---
try:
    from utils.memory_store import add_memory, get_memories, weekly_summary, save_upload
except ModuleNotFoundError:
    import sys
    ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    from utils.memory_store import add_memory, get_memories, weekly_summary, save_upload

SHARED_DIR = "data/shared_photos"

def _big_title(text: str):
    st.markdown(
        f"<h2 style='color:#2E4A62; font-size:34px; margin-top:0'>{text}</h2>",
        unsafe_allow_html=True
    )

def _pill(text: str):
    st.markdown(
        "<span style='display:inline-block;background:#eaf3ff;color:#2E4A62;"
        "border-radius:16px;padding:6px 12px;margin:2px;font-size:14px;'>"
        f"{text}</span>",
        unsafe_allow_html=True
    )

def _parse_tag_string(raw: str) -> list[str]:
    if not raw:
        return []
    return [t.strip() for t in raw.split(",") if t.strip()]

def _safe_json_tags(val) -> list[str]:
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return []
    if isinstance(val, list):
        return [str(v).strip() for v in val if str(v).strip()]
    s = str(val).strip()
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [str(v).strip() for v in parsed if str(v).strip()]
    except Exception:
        pass
    return _parse_tag_string(s)

def memory_lane():
    st.markdown("----")
    _big_title("🖼️ Memory Lane")
    st.caption("Daily nudge to recall one happy memory — add a short note, a photo, or an audio clip.")

    # ---------- Create / Add memory ----------
    with st.container(border=True):
        st.markdown("### Today’s gentle nudge")
        st.write("What’s **one small good thing** from today? A smile, a song, a walk in the sun ☀️")
        st.write("Add a **title**, a short **story**, and (optional) **photo or audio**.")

        col1, col2 = st.columns([2, 1])  # keep compatible
        with col1:
            title = st.text_input("Title", placeholder="A sunny walk by the river")
            story = st.text_area(
                "Your story (1–4 lines)",
                height=100,
                placeholder="I walked with Stephen and we laughed at the ducks…"
            )
            raw_tags = st.text_input(
                "Tags (comma-separated)",
                placeholder="family, music, garden, friends, childhood, pets"
            )
            tags = _parse_tag_string(raw_tags)
        with col2:
            chosen_date = st.date_input("Date", value=date.today())
            photo = st.file_uploader("Photo (optional)", type=["jpg", "jpeg", "png", "webp"])
            audio = st.file_uploader("Audio (optional)", type=["mp3", "m4a", "wav", "ogg"])
            consent = st.checkbox("Allow sharing with carers/family", value=False)

        if st.button("Save Memory", type="primary", disabled=not (title and story), use_container_width=True):
            photo_path = save_upload(photo, "photos") if photo else None
            audio_path = save_upload(audio, "audio") if audio else None
            add_memory(
                title=title.strip(),
                story=story.strip(),
                tags=tags,
                date=datetime.combine(chosen_date, datetime.min.time()),
                photo_path=photo_path,
                audio_path=audio_path,
                shared_by=("User" if consent else None),
            )
            st.success("Saved! Beautiful memory added to your lane.")
            st.rerun()

    # ---------- Weekly summary ----------
    st.markdown("### 🌿 This Week’s Good Things")
    report = weekly_summary()
    cols = st.columns(4)
    cols[0].metric("Memories added", report.get("count", 0))
    cols[1].metric("With photos", report.get("with_photos", 0))
    cols[2].metric("With audio", report.get("with_audio", 0))
    cols[3].metric("Positivity mentions", report.get("positivity_hits", 0))

    top_tags = report.get("top_tags") or {}
    if top_tags:
        st.write("Top tags:")
        for k, v in top_tags.items():
            _pill(f"{k} · {v}")

    # ---------- Gallery ----------
    st.markdown("### 📚 Memory Gallery")
    df = report.get("rows", None)

    if df is None or df.empty:
        st.info("No memories yet. Add today’s first one above!")
    else:
        with st.expander("Filter memories"):
            q = st.text_input("Search title/story")
            date_from = st.date_input("From", value=(datetime.now() - timedelta(days=30)).date())
            date_to = st.date_input("To", value=datetime.now().date())

        if q:
            ql = q.strip().lower()
            df = df[
                df["title"].fillna("").str.lower().str.contains(ql, na=False)
                | df["story"].fillna("").str.lower().str.contains(ql, na=False)
            ]

        df = df[
            (pd.to_datetime(df["date"]) >= pd.to_datetime(date_from))
            & (pd.to_datetime(df["date"]) <= pd.to_datetime(date_to))
        ].sort_values("created_at", ascending=False, na_position="last")

        for _, row in df.iterrows():
            with st.container(border=True):
                d = pd.to_datetime(row.get("date")).date().isoformat() if row.get("date") is not pd.NaT else ""
                st.markdown(f"**{row.get('title','(untitled)')}** · _{d}_")
                st.write(row.get("story", ""))

                media_cols = st.columns(2)
                if pd.notna(row.get("photo_path")) and str(row.get("photo_path")).strip():
                    try:
                        media_cols[0].image(row["photo_path"], use_container_width=True)
                    except Exception:
                        pass
                if pd.notna(row.get("audio_path")) and str(row.get("audio_path")).strip():
                    try:
                        media_cols[1].audio(row["audio_path"])
                    except Exception:
                        pass

                tag_list = _safe_json_tags(row.get("tags"))
                if tag_list:
                    st.write("Tags:", " ".join([f"`{t}`" for t in tag_list]))
                if str(row.get("shared_by", "")).strip():
                    st.caption(f"Shared with consent by: {row['shared_by']}")

    # ---------- Family album suggestion ----------
    if os.path.isdir(SHARED_DIR):
        try:
            import glob, random
            images = []
            for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
                images.extend(glob.glob(os.path.join(SHARED_DIR, ext)))
            if images:
                st.markdown("### 👨‍👩‍👧 Family Album Suggestion")
                pick = random.choice(images)
                st.image(
                    pick,
                    caption="“Do you remember this day?” — Add a note above to save it as a memory.",
                    use_container_width=True
                )
        except Exception:
            pass

    # ---------- Export ----------
    try:
        export_df = get_memories()
        st.download_button(
            "Download memories (CSV)",
            data=export_df.to_csv(index=False).encode("utf-8"),
            file_name="memory_lane_export.csv",
            mime="text/csv",
            use_container_width=True
        )
    except Exception:
        pass
 