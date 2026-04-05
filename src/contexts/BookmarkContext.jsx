import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('techpulse-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('techpulse-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((article) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === article.id)) return prev;
      return [article, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((articleId) => {
    setBookmarks(prev => prev.filter(b => b.id !== articleId));
  }, []);

  const toggleBookmark = useCallback((article) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === article.id)) {
        return prev.filter(b => b.id !== article.id);
      }
      return [article, ...prev];
    });
  }, []);

  const isBookmarked = useCallback((articleId) => {
    return bookmarks.some(b => b.id === articleId);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
}
