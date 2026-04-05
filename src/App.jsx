import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import BookmarksPage from './pages/BookmarksPage';
import SearchPage from './pages/SearchPage';

function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate('/search');
    }
  };

  return (
    <div className="app-layout">
      <Header onSearch={handleSearch} />
      <Sidebar />
      <main className="main-content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage searchQuery="" />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/search" element={<SearchPage query={searchQuery} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <BookmarkProvider>
          <AppLayout />
        </BookmarkProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
