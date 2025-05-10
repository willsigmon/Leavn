"""
Select verses without embeddings, call OpenAI text-embedding-3-small,
and upsert vectors into pgvector.
- Connects to Postgres (env: POSTGRES_URL)
- Finds bible_verses rows missing vector
- Calls OpenAI embedding API (TODO)
- Upserts vectors into pgvector column
"""
import os, psycopg2

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# TODO: Add pgvector extension and vector column if missing

def ensure_vector_column(conn):
    with conn.cursor() as cur:
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        cur.execute("""
        ALTER TABLE bible_verses
        ADD COLUMN IF NOT EXISTS vector vector(1536);
        """)
        conn.commit()

def get_verses_missing_vectors(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, text FROM bible_verses WHERE vector IS NULL LIMIT 10;")
        return cur.fetchall()

def embed_text(text):
    # TODO: Call OpenAI embedding API and return vector
    return [0.0]*1536  # Dummy vector

def upsert_vector(conn, verse_id, vector):
    with conn.cursor() as cur:
        cur.execute("UPDATE bible_verses SET vector = %s WHERE id = %s;", (vector, verse_id))
        conn.commit()

def main():
    conn = psycopg2.connect(POSTGRES_URL)
    ensure_vector_column(conn)
    verses = get_verses_missing_vectors(conn)
    for verse_id, text in verses:
        vector = embed_text(text)
        upsert_vector(conn, verse_id, vector)
        print(f"Embedded verse {verse_id}")
    conn.close()

if __name__ == "__main__":
    main()
