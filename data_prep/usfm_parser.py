"""
USFM Parser for Bible Ingest Pipeline
- Extracts book, chapter, verse, and text from USFM files.
- Stub: Basic parsing for demonstration, extensible for enrichment (summaries, themes, figures, tags).
"""
import re, pathlib

USFM_BOOKS = {
    # Add more mappings as needed
    'GEN': 'Genesis',
    'EXO': 'Exodus',
    'LEV': 'Leviticus',
    # ...
}

def parse_usfm(usfm_path):
    """
    Parse a USFM file and yield dicts: {book, chapter, verse, text, usfm_path}
    """
    book = None
    chapter = None
    with open(usfm_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith('\\id '):
                code = line.split()[1]
                book = USFM_BOOKS.get(code, code)
            elif line.startswith('\\c '):
                chapter = int(line.split()[1])
            elif line.startswith('\\v '):
                parts = line.split(' ', 2)
                if len(parts) == 3:
                    verse = int(parts[1])
                    text = parts[2].strip()
                    yield dict(book=book, chapter=chapter, verse=verse, text=text, usfm_path=str(usfm_path))

if __name__ == "__main__":
    # Demo usage
    for usfm_file in pathlib.Path("data_prep/raw").rglob("*.usfm"):
        for verse in parse_usfm(usfm_file):
            print(verse)
