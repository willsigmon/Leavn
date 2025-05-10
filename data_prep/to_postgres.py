"""
Parse USFM and bulk‑copy verses into Postgres (schema bible_verses).
- Connects to Postgres (env: POSTGRES_URL or default)
- Creates bible_verses table if missing
- Scans data_prep/raw/ for USFM files (TODO: parse logic)
- Bulk-inserts parsed verses
"""
import os, psycopg2, pathlib

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
RAW_DIR = pathlib.Path("data_prep/raw")

def ensure_table(conn):
    with conn.cursor() as cur:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS bible_verses (
            id SERIAL PRIMARY KEY,
            bible TEXT,
            book TEXT,
            chapter INTEGER,
            verse INTEGER,
            text TEXT,
            usfm_path TEXT
        );
        """)
        # Add unique constraint if missing
        try:
            cur.execute("""
            ALTER TABLE bible_verses
            ADD CONSTRAINT bible_verses_unique UNIQUE (bible, book, chapter, verse);
            """)
        except Exception as e:
            # Ignore if constraint already exists
            if 'already exists' not in str(e):
                raise
        conn.commit()

def parse_usfm_files():
    # Use XML parser for USFX and OSIS
    import sys
    sys.path.append(str(pathlib.Path(__file__).parent))
    from xml_parser import parse_usfx, parse_osis
    # Parse WEB (USFX)
    for usfx_file in RAW_DIR.glob("eng-web.usfx.xml"):
        for verse in parse_usfx(usfx_file):
            verse['bible'] = "WEB"
            verse['summary'] = None  # TODO: AI/manual
            verse['themes'] = None
            verse['figures'] = None
            verse['tags'] = None
            yield verse
    # Parse KJV (OSIS)
    for osis_file in RAW_DIR.glob("eng-kjv.osis.xml"):
        for verse in parse_osis(osis_file):
            verse['bible'] = "KJV"
            verse['summary'] = None
            verse['themes'] = None
            verse['figures'] = None
            verse['tags'] = None
            yield verse

def bulk_insert(conn, verses):
    with conn.cursor() as cur:
        cur.executemany(
            """
            INSERT INTO bible_verses (bible, book, chapter, verse, text, usfm_path)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (bible, book, chapter, verse) DO NOTHING;
            """,
            [
                (
                    v['bible'],
                    v['book'],
                    v['chapter'],
                    v['verse'],
                    v['text'],
                    v.get('usfm_path') or v.get('xml_path')
                )
                for v in verses
            ]
        )
        conn.commit()

def main():
    conn = psycopg2.connect(POSTGRES_URL)
    ensure_table(conn)
    print("Connected to Postgres and ensured table.")
    verses = list(parse_usfm_files())
    bulk_insert(conn, verses)
    print(f"Inserted {len(verses)} verses (stub)")
    conn.close()

if __name__ == "__main__":
    main()
