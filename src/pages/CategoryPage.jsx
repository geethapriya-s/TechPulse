import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import NewsFeed from '../components/NewsFeed';
import NewArticlesBanner from '../components/NewArticlesBanner';
import { getCategoryById } from '../constants/categories';
import { fetchCategoryArticles } from '../services/dataFetcher';
import { deduplicateArticles, mergeAndSort } from '../utils/helpers';
import './PageStyles.css';

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingArticles, setPendingArticles] = useState([]);
  const intervalRef = useRef(null);
  const category = getCategoryById(categoryId);
  const prevCategoryRef = useRef(categoryId);

  const loadArticles = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const data = await fetchCategoryArticles(categoryId);
      const unique = deduplicateArticles(data);

      if (isRefresh && articles.length > 0) {
        const newOnes = mergeAndSort(articles, unique);
        if (newOnes.length > 0) {
          setPendingArticles(prev => deduplicateArticles([...newOnes, ...prev]));
        }
      } else {
        setArticles(unique);
        setPendingArticles([]);
      }
    } catch (err) {
      console.error(`Failed to load ${categoryId}:`, err);
      if (!isRefresh) setError('Unable to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [categoryId, articles]);

  // Reset on category change
  useEffect(() => {
    if (prevCategoryRef.current !== categoryId) {
      setArticles([]);
      setPendingArticles([]);
      prevCategoryRef.current = categoryId;
    }
    loadArticles(false);
  }, [categoryId]);

  // Auto-refresh
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      loadArticles(true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [loadArticles]);

  const handleLoadPending = () => {
    setArticles(prev => deduplicateArticles([...pendingArticles, ...prev]));
    setPendingArticles([]);
  };

  if (!category) {
    return (
      <div className="page" id="category-not-found">
        <div className="page-header">
          <h1 className="page-title">Category not found</h1>
          <p className="page-subtitle">The category "{categoryId}" doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id={`category-page-${categoryId}`}>
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">{category.icon}</span>
          {category.label}
        </h1>
        <p className="page-subtitle">
          Latest {category.label.toLowerCase()} news from multiple sources
        </p>
      </div>

      <NewArticlesBanner count={pendingArticles.length} onLoad={handleLoadPending} />

      <NewsFeed
        articles={articles}
        loading={loading}
        error={error}
      />
    </div>
  );
}
