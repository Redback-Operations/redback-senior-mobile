from __future__ import annotations

import os, uuid, json, shutil
from datetime import datetime, timedelta
import pandas as pd

MEMORY_DIR = "data/memories"
DB_CSV = os.path.join(MEMORY_DIR, "memories.csv")

os.makedirs(MEMORY_DIR, exist_ok=True)

SCHEMA = [
    "id", "date", "title", "story", "tags",
    "photo_path", "audio_path", "shared_by", "created_at"
]

def _init_db():
    if not os.path.exists(DB_CSV):
        pd.DataFrame(columns=SCHEMA).to_csv(DB_CSV, index=False)

def load_db() -> pd.DataFrame:
    _init_db()
    try:
        df = pd.read_csv(DB_CSV)
    except Exception:
        df = pd.DataFrame(columns=SCHEMA)
    # Coerce to datetime64[ns]
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    if "created_at" in df.columns:
        df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    # Ensure all expected columns exist
    for c in SCHEMA:
        if c not in df.columns:
            df[c] = pd.NA
    return df

def save_db(df: pd.DataFrame):
    df.to_csv(DB_CSV, index=False)

def _safe_name(s: str) -> str:
    return "".join(c for c in str(s) if c.isalnum() or c in ("-","_","."," ")).strip().replace(" ", "_")

def save_upload(uploaded_file, subdir: str) -> str | None:
    if not uploaded_file:
        return None
    folder = os.path.join(MEMORY_DIR, subdir)
    os.makedirs(folder, exist_ok=True)
    fname = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{_safe_name(uploaded_file.name)}"
    path = os.path.join(folder, fname)
    with open(path, "wb") as f:
        shutil.copyfileobj(uploaded_file, f)
    return path

def add_memory(
    title: str, story: str, tags: list[str] | None, date: datetime,
    photo_path: str | None, audio_path: str | None, shared_by: str | None = None
):
    df = load_db()
    entry = {
        "id": str(uuid.uuid4()),
        # Store as ISO string; will be parsed to Timestamp on load
        "date": pd.to_datetime(date, errors="coerce").date().isoformat(),
        "title": title.strip(),
        "story": story.strip(),
        "tags": json.dumps(tags or []),
        "photo_path": photo_path,
        "audio_path": audio_path,
        "shared_by": (shared_by or "").strip(),
        "created_at": datetime.now().isoformat()
    }
    df = pd.concat([df, pd.DataFrame([entry])], ignore_index=True)
    save_db(df)
    return entry

def get_memories(date_from=None, date_to=None):
    """Return filtered, newest-first memories. Uses datetime64 throughout."""
    df = load_db()
    dts = pd.to_datetime(df["date"], errors="coerce")

    if date_from is not None:
        start = pd.to_datetime(date_from)  # keep as Timestamp
        df = df[dts >= start]

    if date_to is not None:
        end = pd.to_datetime(date_to)
        df = df[dts <= end]

    # Sort by created_at (NaT-safe)
    if "created_at" in df.columns:
        df = df.sort_values("created_at", ascending=False, na_position="last")
    return df

def weekly_summary(end_date: datetime | None = None):
    end_dt = pd.to_datetime(end_date or datetime.now())
    start_dt = end_dt - timedelta(days=6)
    df = get_memories(start_dt, end_dt)

    count = len(df)
    with_photos = int(df["photo_path"].notna().sum()) if count else 0
    with_audio  = int(df["audio_path"].notna().sum()) if count else 0

    # Tiny positive word “hit” counter
    pos_words = {"happy","joy","proud","love","laugh","fun","sun","family","friend","music","dance","garden","walk"}
    pos_hits = 0
    for s in df["story"].fillna(""):
        txt = str(s).lower()
        pos_hits += sum(w in txt for w in pos_words)

    # Top tags
    all_tags = []
    for raw in df["tags"].fillna("[]"):
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                all_tags.extend([str(t).strip() for t in parsed if str(t).strip()])
        except Exception:
            pass
    top_tags = pd.Series(all_tags).value_counts().head(5).to_dict() if all_tags else {}

    return {
        "start": start_dt.date().isoformat(),
        "end": end_dt.date().isoformat(),
        "count": count,
        "with_photos": with_photos,
        "with_audio": with_audio,
        "positivity_hits": pos_hits,
        "top_tags": top_tags,
        "rows": df,
    }
