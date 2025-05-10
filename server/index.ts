import express from 'express';
import Database from 'better-sqlite3';
import { z } from 'zod';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;
const dbPath = path.resolve(process.cwd(), 'artifacts/bible.sqlite');
const db = new Database(dbPath, { readonly: true });

// Zod schemas
const BookSchema = z.string().min(1).max(64);
const ChapterSchema = z.coerce.number().int().min(1).max(150);

// Helper: get all books
function getBooks() {
  const rows = db.prepare('SELECT DISTINCT book FROM bible_verses ORDER BY book').all();
  return rows.map(r => r.book);
}

// Helper: get chapters for a book
function getChapters(book: string) {
  const rows = db.prepare('SELECT DISTINCT chapter FROM bible_verses WHERE book = ? ORDER BY chapter').all(book);
  return rows.map(r => r.chapter);
}

// Helper: get verses for a book/chapter
function getVerses(book: string, chapter: number) {
  const rows = db.prepare('SELECT verse, text FROM bible_verses WHERE book = ? AND chapter = ? ORDER BY verse').all(book, chapter);
  return rows;
}

app.get('/api/bible/books', (_req, res) => {
  res.json({ books: getBooks() });
});

app.get('/api/bible/:book/chapters', (req, res) => {
  const parseBook = BookSchema.safeParse(req.params.book);
  if (!parseBook.success) return res.status(400).json({ error: 'Invalid book' });
  res.json({ chapters: getChapters(parseBook.data) });
});

app.get('/api/bible/:book/:chapter', (req, res) => {
  const parseBook = BookSchema.safeParse(req.params.book);
  const parseChapter = ChapterSchema.safeParse(req.params.chapter);
  if (!parseBook.success || !parseChapter.success) {
    return res.status(400).json({ error: 'Invalid book or chapter' });
  }
  res.json({ verses: getVerses(parseBook.data, parseChapter.data) });
});

app.listen(PORT, () => {
  console.log(`Bible API server running on http://localhost:${PORT}`);
});

// @ai-suggestion: This server is ready for future enrichment fields and AI endpoints.
