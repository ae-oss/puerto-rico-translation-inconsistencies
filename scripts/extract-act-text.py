"""Extract page-ordered official English text for the public reader.

Usage: python scripts/extract-act-text.py
The source PDFs live in ignored tmp/pdfs/ and are linked in laws.json.
"""

import json
import re
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
FINDINGS = json.loads((ROOT / "src/data/findings.json").read_text())


def clean_act4(text):
    text = re.sub(r"^\s*\d+\s*\n", "", text, count=1)
    return re.sub(r"(?<=\w)-\n(?=\w)", "", text).strip()


def clean_archive_column(text):
    lines = text.splitlines()
    if lines:
        lines.pop(0)  # running title / date above the column
    while lines and re.fullmatch(r"\s*\d+\s*", lines[-1]):
        lines.pop()
    return "\n".join(lines).strip()


def extract_act80(path):
    result = []
    with pdfplumber.open(path) as pdf:
        for index, page in enumerate(pdf.pages):
            mid = page.width / 2
            left = clean_archive_column(page.crop((0, 0, mid, page.height)).extract_text() or "")
            right = clean_archive_column(page.crop((mid, 0, page.width, page.height)).extract_text() or "")
            if index == 0:
                # The earlier portion of this archive spread is Act 79.
                marker = "Labor—Discharge Without Just Cause; Compensation"
                right = right[right.index(marker):]
                text = right
            elif index == 2:
                # Section 8(a)'s sentence crosses the two-column gutter.
                text = left + right if left.endswith("confer-") else left + "\n" + right
            else:
                text = left + "\n" + right
            result.append({"page": index + 1, "text": re.sub(r"(?<=\w)-\n(?=\w)", "", text)})
    return result


def normalize_with_offsets(text):
    chars, offsets = [], []
    for i, char in enumerate(text):
        if char.isascii() and char.isalnum():
            chars.append(char.lower())
            offsets.append(i)
    return "".join(chars), offsets


def attach_findings(law_id, pages):
    for page in pages:
        page["findingIds"] = []
        page["highlights"] = []
    for finding in FINDINGS:
        if finding["lawId"] != law_id or not finding["published"]:
            continue
        english_source = next((s for s in finding["sources"] if "English" in s["label"]), None)
        match = re.search(r"PDF page (\d+)(?:[–-](\d+))?", english_source.get("note", "") if english_source else "")
        if not match:
            raise ValueError(f"Missing page citation: {finding['id']}")
        first = int(match.group(1))
        last = int(match.group(2) or first)
        relevant = [page for page in pages if first <= page["page"] <= last]
        for page in relevant:
            page["findingIds"].append(finding["id"])
        combined = "\n".join(page["text"] for page in relevant)
        normalized, offsets = normalize_with_offsets(combined)
        quote = "".join(part["text"] for part in finding["officialEnglish"])
        needle, _ = normalize_with_offsets(quote)
        found = normalized.find(needle)
        if found < 0:
            print(f"Highlight uses page marker only: {finding['id']}")
            continue
        start, end = offsets[found], offsets[found + len(needle) - 1] + 1
        cursor = 0
        for page in relevant:
            page_start, page_end = cursor, cursor + len(page["text"])
            if start < page_end and end > page_start:
                page["highlights"].append({
                    "start": max(0, start - page_start),
                    "end": min(len(page["text"]), end - page_start),
                    "findingId": finding["id"],
                })
            cursor = page_end + 1


with pdfplumber.open(ROOT / "tmp/pdfs/act4-english.pdf") as pdf:
    act4 = [{"page": i + 1, "text": clean_act4(page.extract_text() or "")}
            for i, page in enumerate(pdf.pages[:67])]
act80 = extract_act80(ROOT / "tmp/pdfs/act80-english.pdf")
with pdfplumber.open(ROOT / "tmp/pdfs/act180-english.pdf") as pdf:
    # PDF page 18 is the translator's certification, not legislation.
    act180 = [{"page": i + 1, "text": clean_act4(page.extract_text() or "")}
              for i, page in enumerate(pdf.pages[:17])]
with pdfplumber.open(ROOT / "tmp/pdfs/act427-english.pdf") as pdf:
    # PDF page 6 is a later translator's certification, not legislation.
    act427 = [{"page": i + 1, "text": clean_act4(page.extract_text() or "")}
              for i, page in enumerate(pdf.pages[:5])]
with pdfplumber.open(ROOT / "tmp/pdfs/act1-english.pdf") as pdf:
    # Targeted, noncontiguous original-Code context only; never label this full text.
    act1_pages = [81, 82, 83, 84, 85, 86, 123, 124, 430, 431]
    act1 = [{"page": number, "text": clean_act4(pdf.pages[number - 1].extract_text() or "")}
            for number in act1_pages]
act100 = json.loads((ROOT / "scripts/transcriptions/act100-english.json").read_text())
attach_findings("act-4-2017", act4)
attach_findings("act-80-1976", act80)
attach_findings("act-180-1998", act180)
attach_findings("act-100-1959", act100)
attach_findings("act-427-2000", act427)
attach_findings("act-1-2011", act1)
output = {"act-4-2017": act4, "act-80-1976": act80, "act-180-1998": act180,
          "act-100-1959": act100, "act-427-2000": act427, "act-1-2011": act1}
(ROOT / "src/data/act-texts.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
print(f"Saved {len(act4)} Act 4 pages, {len(act80)} Act 80 archive spreads, "
      f"{len(act180)} Act 180 pages, {len(act100)} Act 100 archive spreads, "
      f"{len(act427)} Act 427 pages, and {len(act1)} selected Act 1 pages")
