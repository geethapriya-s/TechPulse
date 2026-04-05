// Product Hunt doesn't have a free public API, so we use their frontend endpoint via Vite proxy
// This is a best-effort service that gracefully degrades if unavailable

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Product Hunt fetch error: ${res.status}`);
  return res.json();
}

function normalizeProductHuntPost(post) {
  return {
    id: `ph-${post.id || Math.random().toString(36).slice(2)}`,
    title: post.name || post.title || '',
    description: post.tagline || post.description || '',
    url: post.url || post.website || '',
    image: post.thumbnail?.url || post.image_url || null,
    source: 'Product Hunt',
    sourceIcon: '🔶',
    domain: 'producthunt.com',
    author: post.user?.name || 'Product Hunt',
    timestamp: post.created_at || post.day || new Date().toISOString(),
    score: post.votes_count || post.vote_count || 0,
    comments: post.comments_count || 0,
    tags: post.topics?.map(t => t.name) || [],
  };
}

// Fallback: generate curated Product Hunt-style entries from known sources
function getFallbackProducts() {
  return [
    {
      id: 'ph-fallback-1',
      title: 'Discover new products on Product Hunt',
      description: 'Visit Product Hunt to discover the latest tech products, apps, and tools made by makers around the world.',
      url: 'https://www.producthunt.com',
      image: null,
      source: 'Product Hunt',
      sourceIcon: '🔶',
      domain: 'producthunt.com',
      author: 'Product Hunt',
      timestamp: new Date().toISOString(),
      score: 0,
      comments: 0,
      tags: ['products', 'startups'],
    }
  ];
}

export async function getTodayProducts(limit = 15) {
  try {
    // Try fetching via proxy - this may or may not work depending on PH's response format
    const data = await fetchJSON(`/api/producthunt/frontend/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ posts(order: RANKING) { edges { node { id name tagline url thumbnail { url } votesCount commentsCount createdAt } } } }`
      })
    });

    if (data?.data?.posts?.edges) {
      return data.data.posts.edges
        .slice(0, limit)
        .map(e => normalizeProductHuntPost(e.node));
    }
    return getFallbackProducts();
  } catch {
    // Graceful fallback - PH data is supplementary, not critical
    return getFallbackProducts();
  }
}
