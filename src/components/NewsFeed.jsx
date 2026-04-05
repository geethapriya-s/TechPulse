import NewsCard from './NewsCard';
import './NewsFeed.css';

export default function NewsFeed({ articles, loading, error, onLoadMore, hasMore }) {
  if (error) {
    return (
      <div className="feed-message feed-error" id="feed-error">
        <span className="feed-message-icon">⚠️</span>
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="news-grid" id="news-grid-skeleton">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton-card-wrapper">
            <div className="skeleton" style={{ height: '140px', borderRadius: '10px 10px 0 0' }} />
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="skeleton" style={{ height: '12px', width: '40%' }} />
              <div className="skeleton" style={{ height: '16px', width: '90%' }} />
              <div className="skeleton" style={{ height: '16px', width: '70%' }} />
              <div className="skeleton" style={{ height: '12px', width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="feed-message" id="feed-empty">
        <span className="feed-message-icon">📭</span>
        <h3>No articles found</h3>
        <p>Try a different category or check back later.</p>
      </div>
    );
  }

  return (
    <div id="news-feed-container">
      <div className="news-grid" id="news-grid">
        {articles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {loading && articles.length > 0 && (
        <div className="feed-loading-more">
          <div className="spinner" />
          <span>Loading more articles...</span>
        </div>
      )}

      {onLoadMore && hasMore && !loading && (
        <div className="feed-load-more">
          <button className="load-more-btn" onClick={onLoadMore} id="load-more-btn">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
