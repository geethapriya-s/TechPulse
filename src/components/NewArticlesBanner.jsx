import './NewArticlesBanner.css';

export default function NewArticlesBanner({ count, onLoad }) {
  if (count <= 0) return null;

  return (
    <button className="new-articles-banner" onClick={onLoad} id="new-articles-banner">
      <span className="banner-bell">🔔</span>
      <span className="banner-text">
        {count} new article{count !== 1 ? 's' : ''} available
      </span>
      <span className="banner-action">Click to load ↑</span>
    </button>
  );
}
