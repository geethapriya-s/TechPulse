import { NavLink, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const closeMobileMenu = () => {
    document.body.classList.remove('sidebar-open');
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={closeMobileMenu} />
      <aside className="sidebar" id="main-sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Categories</div>
          <ul className="sidebar-list">
            {CATEGORIES.map(cat => (
              <li key={cat.id}>
                <NavLink
                  to={cat.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                  end={cat.path === '/'}
                  id={`nav-${cat.id}`}
                >
                  <span className="sidebar-icon">{cat.icon}</span>
                  <span className="sidebar-label">{cat.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-divider" />

          <div className="sidebar-section-label">Sources</div>
          <div className="sidebar-sources">
            <div className="source-tag">🟧 Hacker News</div>
            <div className="source-tag">🖥️ Dev.to</div>
            <div className="source-tag">🔴 Reddit</div>
            <div className="source-tag">🐘 Mastodon</div>
            <div className="source-tag">🚀 Spaceflight</div>
            <div className="source-tag">🔶 Product Hunt</div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Live data • Auto-refreshes every 5 min</p>
        </div>
      </aside>
    </>
  );
}
