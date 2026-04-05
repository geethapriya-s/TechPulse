import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import './Header.css';

export default function Header({ onSearch }) {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (location.pathname.includes('/search')) {
      navigate('/');
    }
    onSearch('');
  };

  useEffect(() => {
    if (!location.pathname.includes('/search')) {
      setQuery('');
    }
  }, [location.pathname]);

  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              document.body.classList.toggle('sidebar-open');
            }}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }} id="logo-link">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">TechPulse</span>
          </a>
        </div>

        <form className={`search-form ${isSearchFocused ? 'focused' : ''}`} onSubmit={handleSubmit} id="search-form">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            placeholder="Search tech news..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            id="search-input"
          />
          {query && (
            <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search" id="search-clear-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </form>

        <div className="header-right">
          <button
            className="header-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            id="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>
          <button
            className="header-btn bookmark-btn"
            onClick={() => navigate('/bookmarks')}
            aria-label="View bookmarks"
            id="bookmarks-nav-btn"
            title="Bookmarks"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={location.pathname === '/bookmarks' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {bookmarks.length > 0 && (
              <span className="bookmark-badge">{bookmarks.length}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
