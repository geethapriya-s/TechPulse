async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`);
  return res.json();
}

function normalizeRedditPost(post) {
  const data = post.data || post;
  const hasImage = data.thumbnail && data.thumbnail.startsWith('http') && !data.thumbnail.includes('default') && !data.thumbnail.includes('self');
  const preview = data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&');

  return {
    id: `reddit-${data.id}`,
    title: data.title || '',
    description: data.selftext ? data.selftext.slice(0, 280) : '',
    url: data.url_overridden_by_dest || data.url || `https://reddit.com${data.permalink}`,
    image: preview || (hasImage ? data.thumbnail : null),
    source: 'Reddit',
    sourceIcon: '🔴',
    domain: data.domain || 'reddit.com',
    author: data.author || 'unknown',
    subreddit: data.subreddit || '',
    timestamp: data.created_utc ? new Date(data.created_utc * 1000).toISOString() : new Date().toISOString(),
    score: data.score || 0,
    comments: data.num_comments || 0,
    tags: data.link_flair_text ? [data.link_flair_text] : [],
    permalink: `https://reddit.com${data.permalink}`,
  };
}

export async function getSubredditPosts(subreddit = 'technology', sort = 'hot', limit = 25) {
  try {
    const data = await fetchJSON(
      `/api/reddit/r/${subreddit}/${sort}.json?limit=${limit}&raw_json=1`
    );
    const posts = data?.data?.children || [];
    return posts
      .filter(p => !p.data.stickied)
      .map(normalizeRedditPost);
  } catch (err) {
    console.warn(`Reddit fetch failed for r/${subreddit}:`, err);
    return [];
  }
}

export async function getMultipleSubreddits(subreddits, sort = 'hot', limitPerSub = 10) {
  const allPosts = await Promise.all(
    subreddits.map(sub => getSubredditPosts(sub, sort, limitPerSub))
  );
  return allPosts.flat().sort((a, b) => b.score - a.score);
}
