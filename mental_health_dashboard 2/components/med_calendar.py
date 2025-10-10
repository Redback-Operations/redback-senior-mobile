# components/med_calendar.py
import streamlit as st
import pandas as pd
import calendar
from datetime import date

def _month_year_defaults(df: pd.DataFrame, date_col: str):
    """Choose sensible defaults based on the latest date in your data."""
    latest = pd.to_datetime(df[date_col]).max()
    return int(latest.year), int(latest.month)

def _adherence_summary(df: pd.DataFrame, date_col: str, flag_col: str, year: int, month: int):
    mdf = df.copy()
    mdf[date_col] = pd.to_datetime(mdf[date_col])
    mdf = mdf[(mdf[date_col].dt.year == year) & (mdf[date_col].dt.month == month)]
    if mdf.empty:
        return 0, 0, 0, 0.0
    taken = int((mdf[flag_col] == 1).sum())
    missed = int((mdf[flag_col] == 0).sum())
    total = taken + missed
    adherence = (taken / total * 100.0) if total > 0 else 0.0
    return taken, missed, total, adherence

def medication_calendar(df: pd.DataFrame, date_col: str = "Date", flag_col: str = "MedicationTaken"):
    """
    Render a month calendar with a heatmap-like grid:
      - Green = Taken (1)
      - Red   = Missed (0)
      - Grey  = No record
    """
    if df is None or df.empty:
        st.info("No medication data available yet.")
        return

    # Ensure datetime
    d = df.copy()
    d[date_col] = pd.to_datetime(d[date_col])

    # Controls (default to the latest month in your data)
    years = sorted(d[date_col].dt.year.unique())
    def_year, def_month = _month_year_defaults(d, date_col)
    c1, c2, c3 = st.columns([1.2, 1.2, 4])
    with c1:
        year = st.selectbox("Year", years, index=years.index(def_year))
    with c2:
        months = list(range(1, 13))
        month = st.selectbox("Month", months, index=def_month - 1)

    # Filter to selected month
    md = d[(d[date_col].dt.year == year) & (d[date_col].dt.month == month)]

    # Build lookup dict: day -> status
    # status: "taken", "missed", or "none"
    day_status = {}
    for _, row in md.iterrows():
        day = int(row[date_col].day)
        status = "taken" if int(row[flag_col]) == 1 else "missed"
        day_status[day] = status

    # Calendar grid (weeks x weekdays)
    cal = calendar.Calendar(firstweekday=0)  # 0 = Monday, 6 = Sunday
    weeks = cal.monthdayscalendar(year, month)  # list of weeks; 0 means pad day

    # Summary
    taken, missed, total, adherence = _adherence_summary(d, date_col, flag_col, year, month)

    # Legend + Summary
    st.markdown("### 💊 Medication Adherence Calendar")
    l1, l2, l3, l4 = st.columns([1, 1, 1, 3])
    with l1:
        st.markdown('<div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;background:#A5D6A7;border-radius:4px;border:1px solid #6DAE73;"></div><span>Taken</span></div>', unsafe_allow_html=True)
    with l2:
        st.markdown('<div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;background:#EF9A9A;border-radius:4px;border:1px solid #C96C6C;"></div><span>Missed</span></div>', unsafe_allow_html=True)
    with l3:
        st.markdown('<div style="display:flex;align-items:center;gap:8px;"><div style="width:16px;height:16px;background:#E0E0E0;border-radius:4px;border:1px solid #BDBDBD;"></div><span>No data</span></div>', unsafe_allow_html=True)
    with l4:
        st.markdown(f"**Taken:** {taken}  •  **Missed:** {missed}  •  **Recorded days:** {total}  •  **Adherence:** {adherence:.0f}%")

    # Styles
    st.markdown("""
    <style>
      .mh-cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
      .mh-dayname { text-align:center; font-weight:600; color:#2E4A62; }
      .mh-cell {
        height: 64px; border-radius: 12px;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        font-size: 16px; border: 1px solid #E0E0E0;
      }
      .mh-cell small { font-size: 12px; opacity: 0.85; }
      .mh-none  { background:#F5F5F5; color:#757575; }
      .mh-taken { background:#A5D6A7; color:#1B5E20; border-color:#6DAE73; }
      .mh-missed{ background:#EF9A9A; color:#7F1D1D; border-color:#C96C6C; }
    </style>
    """, unsafe_allow_html=True)

    # Weekday headers
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    header_html = '<div class="mh-cal">' + ''.join([f'<div class="mh-dayname">{d}</div>' for d in day_names]) + '</div>'
    st.markdown(header_html, unsafe_allow_html=True)

    # Grid cells
    grid_html = '<div class="mh-cal">'
    for week in weeks:
        for day in week:
            if day == 0:
                # padding cell
                grid_html += f'<div class="mh-cell mh-none"><small>&nbsp;</small></div>'
            else:
                status = day_status.get(day, "none")
                cls = "mh-none" if status == "none" else ("mh-taken" if status == "taken" else "mh-missed")
                label = "Taken" if status == "taken" else ("Missed" if status == "missed" else "No data")
                grid_html += f'<div class="mh-cell {cls}"><div><strong>{day}</strong></div><small>{label}</small></div>'
    grid_html += '</div>'

    st.markdown(grid_html, unsafe_allow_html=True)
