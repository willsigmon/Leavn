/**
 * Bible API Service
 * 
 * This service handles fetching Bible content from external APIs.
 * It uses the ESV API (https://api.esv.org/) as the primary source,
 * with fallback options for when the API is unavailable.
 * 
 * For development/demo, it includes a minimal cache of chapter metadata
 * to avoid repeatedly hitting API rate limits.
 */

// In a production app, this would be stored in environment variables
const ESV_API_KEY = 'your-api-key-here'; // Replace with actual API key when available
const API_BASE_URL = 'https://api.esv.org/v3/passage/text/';

// Minimal cache for chapter metadata (not the full text)
// This helps reduce API calls for repetitive operations
const metadataCache = new Map();

/**
 * Fetch a Bible chapter from the ESV API
 * @param {string} reference - Bible reference (e.g., "Genesis 1", "John 3")
 * @returns {Promise<Object>} Chapter data including text, summary, and metadata
 */
export async function fetchChapter(reference) {
  try {
    // Check if chapter metadata is cached
    if (metadataCache.has(reference)) {
      console.log(`Using cached metadata for ${reference}`);
      return metadataCache.get(reference);
    }
    
    // For development/offline testing, simulate API response for Genesis 1
    // In production, we would remove this and always use the API
    if (navigator.onLine === false || reference.toLowerCase() === 'genesis 1') {
      return getFallbackChapter(reference);
    }
    
    // Construct API request
    const params = new URLSearchParams({
      q: reference,
      include_passage_references: 'false',
      include_verse_numbers: 'true',
      include_first_verse_numbers: 'true',
      include_footnotes: 'false',
      include_headings: 'true'
    });
    
    // Make API request
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        'Authorization': `Token ${ESV_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the API response into our app's format
    const chapterData = {
      id: reference.toLowerCase().replace(/\s+/g, '-'),
      title: reference,
      content: data.passages.join('\n'),
      // These would ideally come from the API, but for now we use fallbacks
      // In a real app, we might have a separate metadata API
      summary: generateSummary(reference),
      themes: generateThemes(reference),
      keyFigures: generateKeyFigures(reference),
      spotlightVerse: generateSpotlightVerse(reference),
      reflectionQuestion: generateReflectionQuestion(reference)
    };
    
    // Cache the chapter metadata
    metadataCache.set(reference, chapterData);
    
    return chapterData;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    // Fallback to local data if API fails
    return getFallbackChapter(reference);
  }
}

/**
 * Get a fallback chapter for development/offline mode
 * @param {string} reference - Bible reference
 * @returns {Object} Fallback chapter data
 */
function getFallbackChapter(reference) {
  // For simplicity, we only include Genesis 1 as a fallback
  // In a real app, we'd have a more comprehensive fallback system
  if (reference.toLowerCase() === 'genesis 1') {
    return {
      id: 'genesis-1',
      title: 'Genesis 1',
      content: `1 In the beginning God created the heavens and the earth. 
2 Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
3 And God said, "Let there be light," and there was light. 
4 God saw that the light was good, and he separated the light from the darkness. 
5 God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
[...abbreviated for brevity...]
31 God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.`,
      summary: 'God creates the universe, the earth, and all living things in six days, declaring all of His creation to be good. He creates humans in His own image, blesses them, and gives them dominion over all living things.',
      themes: ['Creation', 'God\'s power', 'Human purpose', 'Order from chaos'],
      keyFigures: ['God', 'Adam', 'Eve'],
      spotlightVerse: {
        reference: 'Genesis 1:27',
        text: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.'
      },
      reflectionQuestion: 'What does it mean to you that humans are created in God\'s image?',
      perspectives: {
        nondenominational: 'Genesis 1 reveals the goodness of God\'s creation. This chapter establishes the foundation for understanding our relationship with the Creator and our role as stewards of His creation.',
        evangelical: 'Genesis 1 reveals God\'s power and purpose in creation. The passage shows that God created everything with intentionality and order, establishing a foundation for understanding humanity\'s place in creation.',
        catholic: 'Genesis 1 teaches us about God as the ultimate creator. Catholic tradition emphasizes how this passage reveals God\'s goodness and wisdom, establishing the order and harmony of creation.',
        orthodox: 'Genesis 1 is understood as a theological declaration of God\'s sovereignty rather than a scientific account. Orthodox tradition emphasizes the ongoing relationship between Creator and creation.'
      }
    };
  }
  
  // Generic fallback for other chapters
  return {
    id: reference.toLowerCase().replace(/\s+/g, '-'),
    title: reference,
    content: `[Content for ${reference} is not available offline]`,
    summary: `Summary for ${reference} is not available offline`,
    themes: ['Faith', 'Wisdom', 'Providence'],
    keyFigures: ['Various biblical figures'],
    spotlightVerse: {
      reference: `${reference}:1`,
      text: 'Verse text unavailable offline'
    },
    reflectionQuestion: 'How does this passage deepen your understanding of God\'s character?'
  };
}

// Helper functions to generate chapter metadata
// In a real app, this would come from a separate API or database

function generateSummary(reference) {
  return `Summary for ${reference} (would come from API in production)`;
}

function generateThemes(reference) {
  return ['Faith', 'Wisdom', 'Providence'];
}

function generateKeyFigures(reference) {
  return ['Various biblical figures relevant to this passage'];
}

function generateSpotlightVerse(reference) {
  return {
    reference: `${reference}:1`,
    text: 'A key verse from this passage (would come from API in production)'
  };
}

function generateReflectionQuestion(reference) {
  return 'How does this passage deepen your understanding of God\'s character and plan?';
}

/**
 * Get a list of available Bible books
 * @returns {Promise<Array>} List of Bible books
 */
export async function fetchBibleBooks() {
  // In production, this would fetch from the API
  // For now, we return a static list
  return [
    { id: 'genesis', name: 'Genesis', chapters: 50 },
    { id: 'exodus', name: 'Exodus', chapters: 40 },
    { id: 'leviticus', name: 'Leviticus', chapters: 27 },
    // ...other books would be listed here
  ];
}

/**
 * Get next chapter reference
 * @param {string} reference - Current chapter reference
 * @returns {Promise<string|null>} Next chapter reference or null if at the end
 */
export async function getNextChapterReference(reference) {
  // This is a simplified version
  // In production, this would use a more sophisticated algorithm
  const [book, chapterStr] = reference.split(' ');
  const chapter = parseInt(chapterStr, 10);
  
  // For simplicity in demo, only handle Genesis
  if (book.toLowerCase() === 'genesis') {
    if (chapter < 50) {
      return `Genesis ${chapter + 1}`;
    } else {
      return 'Exodus 1';
    }
  }
  
  return null;
}

/**
 * Get previous chapter reference
 * @param {string} reference - Current chapter reference
 * @returns {Promise<string|null>} Previous chapter reference or null if at the beginning
 */
export async function getPreviousChapterReference(reference) {
  const [book, chapterStr] = reference.split(' ');
  const chapter = parseInt(chapterStr, 10);
  
  if (book.toLowerCase() === 'genesis') {
    if (chapter > 1) {
      return `Genesis ${chapter - 1}`;
    }
  } else if (book.toLowerCase() === 'exodus' && chapter === 1) {
    return 'Genesis 50';
  }
  
  return null;
}
