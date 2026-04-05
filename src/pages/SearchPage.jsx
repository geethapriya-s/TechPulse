import { useState, useEffect, useCallback } from 'react';
import NewsFeed from '../components/NewsFeed';
import { searchAllSources } from '../services/dataFetcher';
import { deduplicateArticles } from '../utils/helpers';
import './PageStyles.css';

export default function SearchPage({ query }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doSearch = useCallback(async () => {
    if (!query || query.trim().length === 0) {
      setArticles([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await searchAllSources(query);
      setArticles(deduplicateArticles(data));
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  return (
    <div className="page" id="search-page">
      <div className="page-header">
        <h1 className="page-title">
          🔍 Search Results
        </h1>
        <p className="page-subtitle">
          {loading
            ? `Searching for "${query}"...`
            : `${articles.length} result${articles.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
      </div>

      <NewsFeed
        articles={articles}
        loading={loading}
        error={error}
      />
    </div>
  );
}
