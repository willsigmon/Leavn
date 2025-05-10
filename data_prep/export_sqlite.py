"""
Dump bible_verses + vectors into bible.sqlite
and build a FAISS HNSW index for offline queries.
- Connects to Postgres (env: POSTGRES_URL)
- Dumps all bible_verses + vectors to SQLite (env: BIBLE_DB_PATH)
- Builds FAISS HNSW index (TODO)
"""
import os, psycopg2, sqlite3

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
SQLITE_PATH = os.getenv("BIBLE_DB_PATH", "artifacts/bible.sqlite")

# TODO: import faiss

def export_to_sqlite():
    pg = psycopg2.connect(POSTGRES_URL)
    sq = sqlite3.connect(SQLITE_PATH)
    with pg.cursor() as cur:
        cur.execute("SELECT id, bible, book, chapter, verse, text, vector FROM bible_verses;")
        rows = cur.fetchall()
    sq.execute("DROP TABLE IF EXISTS bible_verses;")
    sq.execute("""
    CREATE TABLE bible_verses (
        id INTEGER PRIMARY KEY,
        bible TEXT, book TEXT, chapter INTEGER, verse INTEGER, text TEXT, vector BLOB
    );
    """)
    sq.executemany(
        "INSERT INTO bible_verses (id, bible, book, chapter, verse, text, vector) VALUES (?, ?, ?, ?, ?, ?, ?);",
        rows
    )
    sq.commit()
    sq.close()
    pg.close()
    print(f"Exported {len(rows)} verses to {SQLITE_PATH}")
    # TODO: Build FAISS HNSW index with vectors

def main():
    export_to_sqlite()

if __name__ == "__main__":
    main()
