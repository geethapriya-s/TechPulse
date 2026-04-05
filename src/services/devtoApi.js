const DEVTO_BASE = 'https://dev.to/api';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);
  return res.json();
}

function normalizeDevtoArticle(article) {
  return {
    id: `devto-${article.id}`,
    title: article.title || '',
    description: article.description || '',
    url: article.url || article.canonical_url || '',
    image: article.cover_image || article.social_image || null,
    source: 'Dev.to',
    sourceIcon: '🖥️',
    domain: 'dev.to',
    author: article.user?.name || article.user?.username || 'unknown',
    authorAvatar: article.user?.profile_image_90 || null,
    timestamp: article.published_at || article.created_at || new Date().toISOString(),
    score: article.public_reactions_count || 0,
    comments: article.comments_count || 0,
    readingTime: article.reading_time_minutes || null,
    tags: article.tag_list || [],
  };
}

export async function getArticlesByTag(tag, page = 1, perPage = 20) {
  const articles = await fetchJSON(
    `${DEVTO_BASE}/articles?tag=${tag}&page=${page}&per_page=${perPage}`
  );
  return articles.map(normalizeDevtoArticle);
}

export async function getArticlesByTags(tags, page = 1, perPage = 20) {
  const articles = await fetchJSON(
    `${DEVTO_BASE}/articles?tags=${tags}&page=${page}&per_page=${perPage}`
  );
  return articles.map(normalizeDevtoArticle);
}

export async function getLatestArticles(page = 1, perPage = 20) {
  const articles = await fetchJSON(
    `${DEVTO_BASE}/articles/latest?page=${page}&per_page=${perPage}`
  );
  return articles.map(normalizeDevtoArticle);
}

export async function searchArticles(query, page = 1, perPage = 20) {
  const articles = await fetchJSON(
    `${DEVTO_BASE}/articles?per_page=${perPage}&page=${page}&tag=${encodeURIComponent(query)}`
  );
  return articles.map(normalizeDevtoArticle);
}
