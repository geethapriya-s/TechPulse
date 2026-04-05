import { useBookmarks } from '../contexts/BookmarkContext';
import { timeAgo, formatNumber } from '../utils/helpers';
import './NewsCard.css';

export default function NewsCard({ article }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  return (
    <article className={`news-card ${article.image ? 'has-image' : ''}`} id={`card-${article.id}`}>
      {article.image && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-image-link"
        >
          <div className="card-image">
            <img
              src={article.image}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        </a>
      )}

      <div className="card-body">
        <div className="card-meta">
          <span className="card-source">
            <span className="source-icon">{article.sourceIcon}</span>
            {article.source}
          </span>
          {article.domain && article.domain !== article.source?.toLowerCase() && (
            <span className="card-domain">{article.domain}</span>
          )}
          <span className="card-time">{timeAgo(article.timestamp)}</span>
        </div>

        <h3 className="card-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {article.description && (
          <p className="card-description">{article.description}</p>
        )}

        <div className="card-footer">
          <div className="card-stats">
            {article.score > 0 && (
              <span className="card-stat" title="Score">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
                {formatNumber(article.score)}
              </span>
            )}
            {article.comments > 0 && (
              <span className="card-stat" title="Comments">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {formatNumber(article.comments)}
              </span>
            )}
            {article.readingTime && (
              <span className="card-stat" title="Reading time">
                {article.readingTime} min read
              </span>
            )}
          </div>

          <button
            className={`bookmark-toggle ${bookmarked ? 'is-bookmarked' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBookmark(article); }}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            title={bookmarked ? 'Remove bookmark' : 'Save for later'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="card-tags">
            {article.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="card-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
