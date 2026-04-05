const SNAPI_BASE = 'https://api.spaceflightnewsapi.net/v4';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Spaceflight News API error: ${res.status}`);
  return res.json();
}

function normalizeSpaceArticle(article) {
  return {
    id: `space-${article.id}`,
    title: article.title || '',
    description: article.summary || '',
    url: article.url || '',
    image: article.image_url || null,
    source: 'Spaceflight News',
    sourceIcon: '🚀',
    domain: article.news_site || 'spaceflightnewsapi.net',
    author: article.news_site || 'Spaceflight News',
    timestamp: article.published_at || new Date().toISOString(),
    score: 0,
    comments: 0,
    tags: [],
  };
}

export async function getArticles(limit = 20, offset = 0) {
  const data = await fetchJSON(
    `${SNAPI_BASE}/articles/?limit=${limit}&offset=${offset}&ordering=-published_at`
  );
  return (data.results || []).map(normalizeSpaceArticle);
}

export async function searchArticles(query, limit = 20) {
  const data = await fetchJSON(
    `${SNAPI_BASE}/articles/?limit=${limit}&search=${encodeURIComponent(query)}&ordering=-published_at`
  );
  return (data.results || []).map(normalizeSpaceArticle);
}
