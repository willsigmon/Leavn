/**
 * Sample Bible chapter data
 * In a production app, this would be fetched from an API or database
 */

// Import first set of Genesis chapters
import chapters1to3 from './genesis1to3';
// Import second set of Genesis chapters
import chapters4to7 from './genesis4to7';

// Combine all chapters into one array
export const chapters = [...chapters1to3, ...chapters4to7];

/**
 * Helper function to get a chapter by ID
 * @param {string} id - Chapter ID
 * @returns {Object|null} Chapter object or null if not found
 */
export function getChapterById(id) {
  return chapters.find(chapter => chapter.id === id) || null;
}

/**
 * Helper function to get a chapter by index
 * @param {number} index - Chapter index (0-based)
 * @returns {Object|null} Chapter object or null if index is out of bounds
 */
export function getChapterByIndex(index) {
  return index >= 0 && index < chapters.length ? chapters[index] : null;
}

/**
 * Get the next chapter after the given chapter ID
 * @param {string} currentId - Current chapter ID
 * @returns {Object|null} Next chapter object or null if current is the last
 */
export function getNextChapter(currentId) {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentId);
  return getChapterByIndex(currentIndex + 1);
}

/**
 * Get the previous chapter before the given chapter ID
 * @param {string} currentId - Current chapter ID
 * @returns {Object|null} Previous chapter object or null if current is the first
 */
export function getPreviousChapter(currentId) {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentId);
  return getChapterByIndex(currentIndex - 1);
}
