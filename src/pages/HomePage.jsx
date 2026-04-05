import { useState, useEffect, useRef, useCallback } from 'react';
import TrendingBar from '../components/TrendingBar';
import NewsFeed from '../components/NewsFeed';
import NewArticlesBanner from '../components/NewArticlesBanner';
import { fetchHomeArticles } from '../services/dataFetcher';
import { deduplicateArticles, mergeAndSort } from '../utils/helpers';
import './PageStyles.css';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function HomePage({ searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingArticles, setPendingArticles] = useState([]);
  const intervalRef = useRef(null);

  const loadArticles = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const data = await fetchHomeArticles();
      const unique = deduplicateArticles(data);

      if (isRefresh && articles.length > 0) {
        // Smart refresh: find genuinely new articles
        const newOnes = mergeAndSort(articles, unique);
        if (newOnes.length > 0) {
          setPendingArticles(prev => deduplicateArticles([...newOnes, ...prev]));
        }
      } else {
        setArticles(unique);
        setTrending(unique.slice(0, 15));
      }
    } catch (err) {
      console.error('Failed to load home articles:', err);
      if (!isRefresh) setError('Unable to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [articles]);

  useEffect(() => {
    loadArticles(false);
  }, []);

  // Auto-refresh
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      loadArticles(true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [loadArticles]);

  const handleLoadPending = () => {
    setArticles(prev => deduplicateArticles([...pendingArticles, ...prev]));
    setTrending(prev => {
      const combined = [...pendingArticles.slice(0, 5), ...prev];
      return deduplicateArticles(combined).slice(0, 15);
    });
    setPendingArticles([]);
  };

  // Filter by search if query exists
  const displayArticles = searchQuery
    ? articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  return (
    <div className="page" id="home-page">
      <TrendingBar stories={trending} />

      <div className="page-header">
        <h1 className="page-title">
          {searchQuery ? `Results for "${searchQuery}"` : '🔥 Trending Now'}
        </h1>
        <p className="page-subtitle">
          {searchQuery
            ? `${displayArticles.length} articles found`
            : 'Top stories from across the tech world'}
        </p>
      </div>

      <NewArticlesBanner count={pendingArticles.length} onLoad={handleLoadPending} />

      <NewsFeed
        articles={displayArticles}
        loading={loading}
        error={error}
      />
    </div>
  );
}
