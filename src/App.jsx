import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyChapter from './components/DailyChapter';
import SettingsPanel from './components/SettingsPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  // --- HERO SECTION CONTENT ---
  const hero = {
    headline: "Leavn Bible Study",
    subheadline: "A new way to explore, search, and reflect on the Bible.",
    cta: "Start Exploring",
    ctaHref: "#main-content"
  };

  // User preferences
  const [reducedMotion, setReducedMotion] = useLocalStorage('reducedMotion', false);
  const [kidsMode, setKidsMode] = useLocalStorage('kidsMode', false);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', localStorage.getItem('darkMode') === 'true');
  const [offlineMode, setOfflineMode] = useLocalStorage('offlineMode', !navigator.onLine);
  const [showReader, setShowReader] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // App state
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load Genesis 1 chapter
  useEffect(() => {
    setLoading(true);
    
    // Genesis 1 data
    const genesis1 = {
      id: 'genesis-1',
      title: 'Genesis 1',
      content: `1 In the beginning God created the heavens and the earth. 
2 Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
3 And God said, "Let there be light," and there was light. 
4 God saw that the light was good, and he separated the light from the darkness. 
5 God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
6 And God said, "Let there be a vault between the waters to separate water from water." 
7 So God made the vault and separated the water under the vault from the water above it. And it was so. 
8 God called the vault "sky." And there was evening, and there was morning—the second day.
9 And God said, "Let the water under the sky be gathered to one place, and let dry ground appear." And it was so. 
10 God called the dry ground "land," and the gathered waters he called "seas." And God saw that it was good.
11 Then God said, "Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds." And it was so. 
12 The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good. 
13 And there was evening, and there was morning—the third day.
14 And God said, "Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years, 
15 and let them be lights in the vault of the sky to give light on the earth." And it was so. 
16 God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars. 
17 God set them in the vault of the sky to give light on the earth, 
18 to govern the day and the night, and to separate light from darkness. And God saw that it was good. 
19 And there was evening, and there was morning—the fourth day.
20 And God said, "Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky." 
21 So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good. 
22 God blessed them and said, "Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth." 
23 And there was evening, and there was morning—the fifth day.
24 And God said, "Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind." And it was so. 
25 God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.
26 Then God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground."
27 So God created mankind in his own image, in the image of God he created them; male and female he created them.
28 God blessed them and said to them, "Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground."
29 Then God said, "I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food. 
30 And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food." And it was so.
31 God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.`,
      summary: 'God creates the universe, the earth, and all living things in six days, declaring all of His creation to be good. He creates humans in His own image, blesses them, and gives them dominion over all living things.',
      themes: ['Creation', 'God\'s power', 'Human purpose', 'Order from chaos'],
      keyFigures: ['God', 'Adam', 'Eve'],
      spotlightVerse: {
        reference: 'Genesis 1:27',
        text: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.'
      },
      reflectionQuestion: 'What does it mean to you that humans are created in God\'s image?',
      imagePrompt: 'A divine light shining over newly created earth and sky in stained-glass style',
      perspectives: {
        nondenominational: 'Genesis 1 reveals the goodness of God\'s creation. This chapter establishes the foundation for understanding our relationship with the Creator and our role as stewards of His creation.',
        evangelical: 'Genesis 1 reveals God\'s power and purpose in creation. The passage shows that God created everything with intentionality and order, establishing a foundation for understanding humanity\'s place in creation.',
        catholic: 'Genesis 1 teaches us about God as the ultimate creator. Catholic tradition emphasizes how this passage reveals God\'s goodness and wisdom, establishing the order and harmony of creation.',
        orthodox: 'Genesis 1 is understood as a theological declaration of God\'s sovereignty rather than a scientific account. Orthodox tradition emphasizes the ongoing relationship between Creator and creation.'
      },
      didYouKnow: [
        'The Hebrew word for "create" (bara) in Genesis 1 is only ever used with God as the subject in the Bible, emphasizing that creation is a uniquely divine activity.',
        'The phrase "it was good" appears seven times in Genesis 1, with the seventh being "very good" - a pattern that highlights the completeness and perfection of God\'s creation.'
      ],
      rememberWhen: {
        reference: 'Psalm 104',
        text: 'As you read about creation, keep this passage in mind when you reach Psalm 104, which poetically celebrates God\'s creative work.'
      }
    };
    
    setCurrentChapter(genesis1);
    setLoading(false);
  }, []);

  // For now, we're only implementing Genesis 1
  // These navigation functions will be expanded later
  const navigateToNextChapter = () => {
    console.log('Next chapter functionality to be implemented');
    // We could navigate to Genesis 2 in the future
  };

  const navigateToPreviousChapter = () => {
    console.log('Previous chapter functionality to be implemented');
    // This would be null since Genesis 1 is the first chapter
  };

  // Toggle settings panel
  const toggleSettings = () => setShowSettings(prev => !prev);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Apply accessibility classes based on user preferences
  const getAccessibilityClasses = () => {
    let classes = '';
    
    if (fontPreference === 'dyslexic') classes += ' font-dyslexic';
    if (fontPreference === 'large') classes += ' font-large';
    if (reducedMotion) classes += ' reduced-motion';
    if (kidsMode) classes += ' kids-mode';
    
    return classes;
  };

  return (
    <div className={`app${darkMode ? ' dark-mode' : ''}${reducedMotion ? ' reduced-motion' : ''}${kidsMode ? ' kids-mode' : ''}`}>
      <Header 
        title="Leavn" 
        offlineMode={offlineMode}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenReader={() => setShowReader(true)}
      />

      {/* HERO SECTION - visually immersive, like pixelmator.com/apple.com/vision-pro */}
      {!showReader && (
        <>
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-headline">{hero.headline}</h1>
              <p className="hero-subheadline">{hero.subheadline}</p>
              <div className="hero-down-arrow">
                <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </section>
          {/* Scroll Indicator - Optional, can be restored if needed */}
          {/* Features Section */}
          <section className="features-section">
            <h2 className="features-title">How it works</h2>
            
            {/* Primary CTA - Can't miss button */}
            <div className="main-cta-container">
              <button className="main-cta-button" onClick={() => setShowReader(true)}>
                <span className="main-cta-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>
                </span>
                Open Bible Reader
              </button>
              <p className="main-cta-subtitle">Start exploring the Bible with our powerful study tools</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card" tabIndex="0" onClick={() => setShowReader(true)}>
                <div className="feature-icon" aria-hidden="true">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>
                </div>
                <div className="feature-label">Read</div>
                <div className="feature-desc">Enjoy a clean, focused reading experience</div>
              </div>
              
              <div className="feature-card" tabIndex="0" onClick={() => setShowReader(true)}>
                <div className="feature-icon" aria-hidden="true">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>
                <div className="feature-label">Search</div>
                <div className="feature-desc">Quickly find passages, words, and topics</div>
              </div>
              
              <div className="feature-card" tabIndex="0" onClick={() => setShowReader(true)}>
                <div className="feature-icon" aria-hidden="true">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>
                </div>
                <div className="feature-label">Reflect</div>
                <div className="feature-desc">Add notes and insights as you read</div>
              </div>
              
              <div className="feature-card" tabIndex="0" onClick={() => setShowReader(true)}>
                <div className="feature-icon" aria-hidden="true">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 11v6m-3-3h6M8 3h8l4 4v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7l4-4z"/></svg>
                </div>
                <div className="feature-label">Take Notes</div>
                <div className="feature-desc">Capture your thoughts and prayers</div>
              </div>
            </div>
            {/* Removed duplicate Open Bible button */}
            <p className="learn-more">Learn more about Leavn's features and how they can enhance your Bible study experience.</p>
          </section>
        </>
      )}

      {showReader && (
        <main id="main-content" className="content">
          <button className="exit-reader-btn" onClick={() => setShowReader(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
          {loading ? (
            <div className="loading">Loading today's chapter...</div>
          ) : (
            <>
              <div className="chapter-navigation">
                <button 
                  className="nav-button" 
                  onClick={navigateToPreviousChapter}
                  disabled={true}
                  aria-label="Previous chapter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  className="nav-button" 
                  onClick={navigateToNextChapter}
                  aria-label="Next chapter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
              <DailyChapter 
                chapter={currentChapter}
                kidsMode={kidsMode}
              />
            </>
          )}
        </main>
      )}

      {showSettings && (
        <SettingsPanel 
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          perspective={perspective}
          setPerspective={setPerspective}
          fontPreference={fontPreference}
          setFontPreference={setFontPreference}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          kidsMode={kidsMode}
          setKidsMode={setKidsMode}
          onClose={toggleSettings}
        />
      )}

      <div className={`offline-indicator ${offlineMode ? 'visible' : ''}`}>
        You're currently offline. Some features may be limited.
      </div>

      {/* Modern Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>Leavn</span> • <span className="footer-tagline">Bible Study</span>
          </div>
          <div className="footer-links">
            <a href="#main-content">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copyright">© 2025 Leavn • Made with care</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
