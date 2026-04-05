const MASTODON_BASE = 'https://mastodon.social/api/v1';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mastodon API error: ${res.status}`);
  return res.json();
}

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function extractLinks(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const anchors = div.querySelectorAll('a');
  const links = [];
  anchors.forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.includes('mastodon') && !href.startsWith('#')) {
      links.push(href);
    }
  });
  return links;
}

function normalizeMastodonPost(post) {
  const plainText = stripHTML(post.content || '');
  const links = extractLinks(post.content || '');
  const mediaImage = post.media_attachments?.find(m => m.type === 'image');

  return {
    id: `mastodon-${post.id}`,
    title: plainText.slice(0, 100) + (plainText.length > 100 ? '...' : ''),
    description: plainText.slice(0, 280),
    url: post.url || post.uri || '',
    image: mediaImage?.preview_url || post.card?.image || null,
    source: 'Mastodon',
    sourceIcon: '🐘',
    domain: 'mastodon.social',
    author: post.account?.display_name || post.account?.username || 'unknown',
    authorAvatar: post.account?.avatar || null,
    timestamp: post.created_at || new Date().toISOString(),
    score: (post.favourites_count || 0) + (post.reblogs_count || 0),
    comments: post.replies_count || 0,
    tags: post.tags?.map(t => t.name) || [],
    externalLinks: links,
    card: post.card ? {
      title: post.card.title,
      description: post.card.description,
      url: post.card.url,
      image: post.card.image,
    } : null,
  };
}

export async function getTagTimeline(tag, limit = 20) {
  const posts = await fetchJSON(
    `${MASTODON_BASE}/timelines/tag/${encodeURIComponent(tag)}?limit=${limit}`
  );
  return posts.map(normalizeMastodonPost);
}

export async function getMultipleTagTimelines(tags, limitPerTag = 10) {
  const allPosts = await Promise.all(
    tags.map(tag => getTagTimeline(tag, limitPerTag).catch(() => []))
  );
  const merged = allPosts.flat();
  // Deduplicate by id
  const seen = new Set();
  return merged.filter(post => {
    if (seen.has(post.id)) return false;
    seen.add(post.id);
    return true;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
