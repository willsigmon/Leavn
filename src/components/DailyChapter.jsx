import React, { useState } from 'react';
import './DailyChapter.css';

/**
 * DailyChapter component displays the current Bible chapter with summary and study aids
 * @param {Object} props
 * @param {Object} props.chapter - Chapter data object
 * @param {string} props.displayMode - Current display mode (default, gen-z, kids, etc.)
 * @param {string} props.perspective - Current theological perspective
 * @param {boolean} props.kidsMode - Whether kids mode is active
 */

const EVANGELICAL_DENOMS = [
  'Baptist', 'Methodist', 'Pentecostal', 'Lutheran', 'Presbyterian', 'Anglican', 'Non-denominational', 'Assemblies of God', 'Church of Christ', 'Reformed', 'Evangelical Free', 'Other'
];

function DailyChapter({ chapter, displayMode: initialDisplayMode, perspective: initialPerspective, kidsMode }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedFootnotes, setExpandedFootnotes] = useState({});
  const [displayMode, setDisplayMode] = useState(initialDisplayMode || 'default');
  const [fontPreference, setFontPreference] = useState('default');
  const [perspective, setPerspective] = useState(initialPerspective || 'nondenominational');
  const [evangelicalDenomination, setEvangelicalDenomination] = useState(EVANGELICAL_DENOMS[0]);

  if (!chapter) return <div>No chapter available</div>;

  // Toggle full chapter content
  const toggleFullContent = () => setShowFullContent(!showFullContent);

  // Toggle a footnote's expanded state
  const toggleFootnote = (id) => {
    setExpandedFootnotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Render the chapter summary based on display mode
  const renderSummary = () => {
    let summaryText = chapter.summary;
    
    if (displayMode === 'gen-z') {
      summaryText = `${chapter.summary} 🔥 Keep it real with this chapter!`;
    } else if (kidsMode) {
      summaryText = `God made everything! This story tells us about how God created our amazing world and all the animals and people in it.`;
    }
    
    return (
      <div className="chapter-summary">
        <h3>Summary</h3>
        <p>{summaryText}</p>
      </div>
    );
  };

  // Render key themes and figures
  const renderThemes = () => (
    <div className="themes-section">
      <div className="themes">
        <h3>Key Themes</h3>
        <ul className="theme-list">
          {chapter.themes.map((theme, index) => (
            <li key={`theme-${index}`} className="theme-item">{theme}</li>
          ))}
        </ul>
      </div>
      
      {chapter.keyFigures && (
        <div className="key-figures">
          <h3>Key Figures</h3>
          <ul className="figure-list">
            {chapter.keyFigures.map((figure, index) => (
              <li key={`figure-${index}`} className="figure-item">{figure}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Render spotlight verse and reflection question
  const renderSpotlight = () => (
    <div className="spotlight-section">
      <div className="spotlight-verse">
        <h3>Spotlight Verse</h3>
        <blockquote>
          <p>{chapter.spotlightVerse.text}</p>
          <footer>{chapter.spotlightVerse.reference}</footer>
        </blockquote>
      </div>
      
      <div className="reflection-question">
        <h3>Reflection</h3>
        <p>{chapter.reflectionQuestion}</p>
      </div>
    </div>
  );

  // Render AI-generated chapter image
  const [aiImageUrl, setAiImageUrl] = React.useState(null);
  const [aiImageLoading, setAiImageLoading] = React.useState(true);
  const [aiImageError, setAiImageError] = React.useState(null);
  React.useEffect(() => {
    let ignore = false;
    setAiImageLoading(true);
    setAiImageError(null);
    // Use prompt as localStorage key
    const cacheKey = `aiImageUrl:${chapter.imagePrompt}`;
    const cachedUrl = localStorage.getItem(cacheKey);
    if (cachedUrl) {
      setAiImageUrl(cachedUrl);
      setAiImageLoading(false);
      return () => { ignore = true; };
    }
    const fetchImage = async () => {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-qhMvT8pT2_d7ZxWwYdkQAgLNCDLNZCNKfkUsc0RDuCT3BlbkFJsQsERhnQ7_oDpmGZcWRORvF1O1dzeYp-n7dwXH70sA',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: chapter.imagePrompt,
            n: 1,
            size: '1792x1024',
          }),
        });
        const data = await response.json();
        console.log('OpenAI image API response:', data);
        if (!ignore && data.data && data.data[0] && data.data[0].url) {
          setAiImageUrl(data.data[0].url);
          setAiImageLoading(false);
          setAiImageError(null);
          try {
            localStorage.setItem(cacheKey, data.data[0].url);
          } catch (storageErr) {
            console.warn('Could not cache image in localStorage:', storageErr);
          }
        } else if (!ignore) {
          setAiImageLoading(false);
          setAiImageError(data.error ? data.error.message : 'No image returned');
        }
      } catch (err) {
        console.error('AI image fetch error:', err);
        if (!ignore) {
          setAiImageLoading(false);
          setAiImageError(err.message || 'Unknown error');
        }
      }
    };
    fetchImage();
    return () => { ignore = true; };
  }, [chapter.imagePrompt]);

  const renderImage = () => (
    <div className="chapter-image">
      {aiImageLoading ? (
        <div className="ai-image-skeleton" aria-label="Loading image..." />
      ) : aiImageUrl ? (
        <img
          src={aiImageUrl}
          alt={chapter.imagePrompt}
          className="ai-image-header"
        />
      ) : (
        <div className="ai-image-fallback">
          Image unavailable{aiImageError ? `: ${aiImageError}` : ''}
        </div>
      )}
    </div>
  );

  // Render perspective-based commentary
  const renderCommentary = () => {
    return (
      <div className="commentary">
        <h3>{perspective.charAt(0).toUpperCase() + perspective.slice(1)} Perspective</h3>
        <p>
          {chapter.perspectives && chapter.perspectives[perspective] 
            ? chapter.perspectives[perspective]
            : chapter.perspectives && chapter.perspectives.nondenominational
            ? chapter.perspectives.nondenominational
            : 'Commentary for this perspective is not available.'}
        </p>
      </div>
    );
  };

  // Render "Did You Know" contextual bubble
  const renderDidYouKnow = () => {
    if (!chapter.didYouKnow || chapter.didYouKnow.length === 0) return null;
    
    // For simplicity, we'll just show the first fact
    // In a full app, we could rotate through them or pick randomly
    const fact = chapter.didYouKnow[0];
    
    return (
      <div className="did-you-know">
        <h4>Did You Know?</h4>
        <p>{fact}</p>
        <button className="like-button" aria-label="Like this fact">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </button>
      </div>
    );
  };

  // Render "Remember When" callback to earlier passages
  const renderRememberWhen = () => {
    if (!chapter.rememberWhen) return null;
    
    return (
      <div className="remember-when">
        <h4>Remember When?</h4>
        <p>{chapter.rememberWhen.text}</p>
        <small>{chapter.rememberWhen.reference}</small>
      </div>
    );
  };

  // Tabs for different content sections
  const renderTabs = () => (
    <div className="chapter-tabs">
      <button 
        className={`tab ${activeTab === 'summary' ? 'active' : ''}`} 
        onClick={() => setActiveTab('summary')}
      >
        Summary
      </button>
      <button 
        className={`tab ${activeTab === 'themes' ? 'active' : ''}`} 
        onClick={() => setActiveTab('themes')}
      >
        Themes
      </button>
      <button 
        className={`tab ${activeTab === 'spotlight' ? 'active' : ''}`} 
        onClick={() => setActiveTab('spotlight')}
      >
        Spotlight
      </button>
      <button 
        className={`tab ${activeTab === 'commentary' ? 'active' : ''}`} 
        onClick={() => setActiveTab('commentary')}
      >
        Commentary
      </button>
    </div>
  );

  return (
    <div className={`daily-chapter ${kidsMode ? 'kids-mode' : ''}`}
      style={{ maxWidth: '1140px', margin: '2.5rem auto', padding: '2.5rem 2.5rem' }}>
      {/* Reading Style & Font Controls */}
      <div className="reading-controls" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <div className="header-segmented-group" role="group" aria-label="Reading Style">
          <button className={`header-segmented-btn${displayMode === 'default' ? ' active' : ''}`} onClick={() => setDisplayMode('default')}>Standard</button>
          <button className={`header-segmented-btn${displayMode === 'gen-z' ? ' active' : ''}`} onClick={() => setDisplayMode('gen-z')}>Gen-Z</button>
          <button className={`header-segmented-btn${displayMode === 'dyslexia-friendly' ? ' active' : ''}`} onClick={() => setDisplayMode('dyslexia-friendly')}>Dyslexia</button>
        </div>
        <div className="header-segmented-group" role="group" aria-label="Font Preference">
          <button className={`header-segmented-btn${fontPreference === 'default' ? ' active' : ''}`} onClick={() => setFontPreference('default')}>Default</button>
          <button className={`header-segmented-btn${fontPreference === 'large' ? ' active' : ''}`} onClick={() => setFontPreference('large')}>Large</button>
          <button className={`header-segmented-btn${fontPreference === 'dyslexic' ? ' active' : ''}`} onClick={() => setFontPreference('dyslexic')}>OpenDyslexic</button>
        </div>
      </div>

      {/* Dynamic Perspective Selector */}
      <div className="perspective-controls" style={{ marginBottom: '1.5rem' }}>
        <div className="header-segmented-group" role="group" aria-label="Perspective">
          <button className={`header-segmented-btn${perspective === 'nondenominational' ? ' active' : ''}`} onClick={() => setPerspective('nondenominational')}>Nondenominational</button>
          <button className={`header-segmented-btn${perspective === 'evangelical' ? ' active' : ''}`} onClick={() => setPerspective('evangelical')}>Evangelical</button>
          <button className={`header-segmented-btn${perspective === 'catholic' ? ' active' : ''}`} onClick={() => setPerspective('catholic')}>Catholic</button>
          <button className={`header-segmented-btn${perspective === 'orthodox' ? ' active' : ''}`} onClick={() => setPerspective('orthodox')}>Orthodox</button>
        </div>
        {perspective === 'evangelical' && (
          <div style={{ marginTop: '0.6rem' }}>
            <select
              className="evangelical-denom-select"
              value={evangelicalDenomination}
              onChange={e => setEvangelicalDenomination(e.target.value)}
              style={{ padding: '0.4rem 1.2rem', borderRadius: '1.2rem', border: '1.5px solid #4a6da7', marginLeft: '0.5rem', fontWeight: 600 }}
            >
              {EVANGELICAL_DENOMS.map(denom => (
                <option key={denom} value={denom}>{denom}</option>
              ))}
            </select>
            <span style={{ marginLeft: '0.7rem', fontWeight: 500, color: '#4a6da7' }}>
              {evangelicalDenomination}
            </span>
          </div>
        )}
      </div>
      <div className="chapter-header">
        <h2 className="chapter-title">{chapter.title}</h2>
        <button 
          className="content-toggle" 
          onClick={toggleFullContent}
          aria-label={showFullContent ? "Show summary" : "Show full chapter"}
        >
          {showFullContent ? "Show Summary" : "Read Full Chapter"}
        </button>
      </div>

      {renderImage()}

      {showFullContent ? (
        <div className="full-content">
          <p>{chapter.content}</p>
          <button 
            className="content-toggle" 
            onClick={toggleFullContent}
          >
            Show Summary
          </button>
        </div>
      ) : (
        <>
          <section className="section-block">{renderSummary()}</section>
          <section className="section-block">{renderThemes()}</section>
          <section className="section-block">{renderSpotlight()}</section>
          <section className="section-block">{renderCommentary()}</section>
          <div className="context-bubbles">
            {renderDidYouKnow()}
            {renderRememberWhen()}
          </div>
        </>
      )}


    </div>
  );
}

export default DailyChapter;
