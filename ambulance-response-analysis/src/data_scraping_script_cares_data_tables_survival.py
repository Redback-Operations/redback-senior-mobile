import pdfplumber
import pandas as pd
from datetime import datetime
import argparse

# Argument Parser 
parser = argparse.ArgumentParser(description="Extract structured tables from a PDF file.")

# PDF file path argument
parser.add_argument("--pdf", required=True, help="Path to the PDF file")

# Page numbers (1-based, will be converted to 0-based internally)
parser.add_argument("--pages", required=True, nargs="+", type=int, help="1-based page numbers to extract")

# Headers for each page: allow multiple --headers flags, each with a list of column names
parser.add_argument(
    "--headers",
    required=True,
    nargs="+",
    action='append',
    help="List of headers for each page (pass one --headers per page, enclosed in quotes)"
)
args = parser.parse_args()

pdf_path = args.pdf
page_numbers = [p - 1 for p in args.pages]  # Convert 1-based page numbers to 0-based
all_headers = args.headers

# Validate header count matches page count
if len(all_headers) != len(page_numbers):
    raise ValueError("Number of --headers sets must match number of --pages.")


def extract_text_rows(page):
    """
    Extracts lines of text from the page based on y-coordinate positioning.
    Groups text words into rows based on vertical alignment.
    """
    words = page.extract_words(
        x_tolerance=2,
        y_tolerance=2,
        keep_blank_chars=True,
        use_text_flow=True
    )
    lines_by_y = {}
    for word in words:
        if 'top' in word and 'text' in word:
            y = round(word['top'], 1)
            lines_by_y.setdefault(y, []).append(word['text'])
    return [lines_by_y[y] for y in sorted(lines_by_y.keys())]


# Row Filtering - Filters out titles, footers, repeated headers, and irrelevant content. 

def is_valid_data_row(row):
    
    joined = " ".join(cell.lower().strip() for cell in row)
    
    # footnotes are the footers and banned fragments are the words to be ignored. if there is any word missing that is required, add it to the allow keywords.
    allow_keywords = [
        "utstein", "location of arrest", "arrest witnessed", "bystander cpr", 
        "cpr", "aed", "hypothermia", "neurological", "category", "initial arrest rhythm", "shockable"
    ]
    banned_fragments = [
        "survival to", "total n", "rosc", "cpc", "admission", "discharge",
        "sample ems", "page", "report", "cares", "data definitions"
    ]
    footnote_starts = ["inclusion criteria", "*bystander", "april"]

    if any(joined.startswith(f) for f in footnote_starts):
        return False
    if any(k in joined for k in banned_fragments):
        return False
    if any(k in joined for k in allow_keywords):
        return True
    if len([c for c in row if c.strip()]) <= 1:
        return False

    return True


# Main
timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")

with pdfplumber.open(pdf_path) as pdf:
    for idx, page_num in enumerate(page_numbers):
        headers = all_headers[idx]
        page = pdf.pages[page_num]

        # Extract raw rows from page
        raw_rows = extract_text_rows(page)

        # Pad shorter rows to match column count
        max_cols = len(headers)
        normalized = [r + [""] * (max_cols - len(r)) for r in raw_rows]

        # Filter for actual data rows
        filtered = [r for r in normalized if is_valid_data_row(r)]

        # Create DataFrame and write CSV
        df = pd.DataFrame(filtered, columns=headers)
        output_name = f"page_{page_num + 1}_cleaned_{timestamp}.csv"
        df.to_csv(output_name, index=False)
        print(f"Saved: {output_name}")

