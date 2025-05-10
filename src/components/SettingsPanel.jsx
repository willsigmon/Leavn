import React from 'react';
import './SettingsPanel.css';

/**
 * SettingsPanel component for user preferences
 * @param {Object} props
 * @param {string} props.displayMode - Current display mode
 * @param {Function} props.setDisplayMode - Display mode setter
 * @param {string} props.perspective - Current theological perspective
 * @param {Function} props.setPerspective - Perspective setter
 * @param {string} props.fontPreference - Current font preference
 * @param {Function} props.setFontPreference - Font preference setter
 * @param {boolean} props.reducedMotion - Reduced motion preference
 * @param {Function} props.setReducedMotion - Reduced motion setter
 * @param {boolean} props.kidsMode - Kids mode toggle
 * @param {Function} props.setKidsMode - Kids mode setter
 * @param {Function} props.onClose - Handler for closing the panel
 */
function SettingsPanel({
  displayMode,
  setDisplayMode,
  perspective,
  setPerspective,
  fontPreference,
  setFontPreference,
  reducedMotion,
  setReducedMotion,
  kidsMode,
  setKidsMode,
  onClose
}) {
  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="settings-content">
          <section className="settings-section">
            <h3>Display Mode</h3>
            <div className="setting-options">
              <button 
                className={`setting-button ${displayMode === 'default' ? 'active' : ''}`}
                onClick={() => setDisplayMode('default')}
              >
                Standard
              </button>
              <button 
                className={`setting-button ${displayMode === 'gen-z' ? 'active' : ''}`}
                onClick={() => setDisplayMode('gen-z')}
              >
                Gen-Z
              </button>
              <button 
                className={`setting-button ${displayMode === 'dyslexia-friendly' ? 'active' : ''}`}
                onClick={() => setDisplayMode('dyslexia-friendly')}
              >
                Dyslexia-Friendly
              </button>
            </div>
          </section>
          
          <section className="settings-section">
            <h3>Theological Perspective</h3>
            <div className="setting-options">
              <button 
                className={`setting-button ${perspective === 'nondenominational' ? 'active' : ''}`}
                onClick={() => setPerspective('nondenominational')}
              >
                Nondenominational
              </button>
              <button 
                className={`setting-button ${perspective === 'evangelical' ? 'active' : ''}`}
                onClick={() => setPerspective('evangelical')}
              >
                Evangelical
              </button>
              <button 
                className={`setting-button ${perspective === 'catholic' ? 'active' : ''}`}
                onClick={() => setPerspective('catholic')}
              >
                Catholic
              </button>
              <button 
                className={`setting-button ${perspective === 'orthodox' ? 'active' : ''}`}
                onClick={() => setPerspective('orthodox')}
              >
                Orthodox
              </button>
            </div>
          </section>
          
          <section className="settings-section">
            <h3>Font & Text</h3>
            <div className="setting-options">
              <button 
                className={`setting-button ${fontPreference === 'default' ? 'active' : ''}`}
                onClick={() => setFontPreference('default')}
              >
                Default
              </button>
              <button 
                className={`setting-button ${fontPreference === 'large' ? 'active' : ''}`}
                onClick={() => setFontPreference('large')}
              >
                Large Text
              </button>
              <button 
                className={`setting-button ${fontPreference === 'dyslexic' ? 'active' : ''}`}
                onClick={() => setFontPreference('dyslexic')}
              >
                OpenDyslexic
              </button>
            </div>
          </section>
          
          <section className="settings-section toggles">
            <div className="toggle-setting">
              <label htmlFor="reduced-motion">Reduced Motion</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="reduced-motion" 
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </div>
            </div>
            
            <div className="toggle-setting">
              <label htmlFor="kids-mode">Kids Mode</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="kids-mode" 
                  checked={kidsMode}
                  onChange={(e) => setKidsMode(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </div>
            </div>
          </section>
        </div>
        
        <div className="settings-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
