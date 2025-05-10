import React from 'react';
import './Header.css';

/**
 * Header component for the Leavn app
 * @param {Object} props
 * @param {string} props.title - App title
 * @param {Function} props.onSettingsClick - Handler for settings button click
 * @param {boolean} props.offlineMode - Whether the app is in offline mode
 */
import { FaRegMoon, FaRegSun, FaLowVision, FaBookOpen } from 'react-icons/fa';

function Header({ title, offlineMode, reducedMotion, setReducedMotion, darkMode, setDarkMode, onOpenReader }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title">{title}</h1>
          <div className="header-controls">
            {/* Open Reader Button */}
            {onOpenReader && (
              <button
                className="header-reader-btn"
                title="Open Bible Reader"
                aria-label="Open Bible Reader"
                type="button"
                onClick={onOpenReader}
              >
                <FaBookOpen />
                <span className="btn-label">Open</span>
              </button>
            )}
            {/* Reduced Motion Icon Toggle */}
            <button
              className={`header-icon-toggle${reducedMotion ? ' active' : ''}`}
              title="Toggle Reduced Motion"
              aria-label="Toggle Reduced Motion"
              onClick={() => setReducedMotion(!reducedMotion)}
              type="button"
            >
              <FaLowVision />
            </button>
            {/* Dark Mode Icon Toggle */}
            {typeof darkMode !== 'undefined' && setDarkMode && (
              <button
                className={`header-icon-toggle${darkMode ? ' active' : ''}`}
                title="Toggle Dark Mode"
                aria-label="Toggle Dark Mode"
                onClick={() => setDarkMode(!darkMode)}
                type="button"
              >
                {darkMode ? <FaRegMoon /> : <FaRegSun />}
              </button>
            )}
            {offlineMode && (
              <span className="offline-badge" title="You're offline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1l22 22"></path>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <path d="M12 20h.01"></path>
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
