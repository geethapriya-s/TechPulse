import { useBookmarks } from '../contexts/BookmarkContext';
import NewsFeed from '../components/NewsFeed';
import './PageStyles.css';

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="page" id="bookmarks-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">🔖</span>
          Bookmarks
        </h1>
        <p className="page-subtitle">
          {bookmarks.length > 0
            ? `${bookmarks.length} saved article${bookmarks.length !== 1 ? 's' : ''}`
            : 'Articles you save will appear here'}
        </p>
      </div>

      <NewsFeed
        articles={bookmarks}
        loading={false}
        error={null}
      />
    </div>
  );
}
