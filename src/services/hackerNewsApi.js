const HN_BASE = 'https://hacker-news.firebaseio.com/v0';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HN API error: ${res.status}`);
  return res.json();
}

export async function getItem(id) {
  return fetchJSON(`${HN_BASE}/item/${id}.json`);
}

async function getStoryIds(endpoint, limit = 30) {
  const ids = await fetchJSON(`${HN_BASE}/${endpoint}.json`);
  return ids.slice(0, limit);
}

async function getStories(endpoint, limit = 30) {
  const ids = await getStoryIds(endpoint, limit);
  const items = await Promise.all(ids.map(id => getItem(id)));
  return items
    .filter(item => item && item.type === 'story' && !item.dead && !item.deleted)
    .map(item => normalizeHNItem(item));
}

function normalizeHNItem(item) {
  const domain = item.url ? new URL(item.url).hostname.replace('www.', '') : 'news.ycombinator.com';
  return {
    id: `hn-${item.id}`,
    title: item.title || '',
    description: item.text ? stripHTML(item.text).slice(0, 200) : null,
    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    image: null,
    source: 'Hacker News',
    sourceIcon: '🟧',
    domain,
    author: item.by || 'unknown',
    timestamp: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
    score: item.score || 0,
    comments: item.descendants || 0,
    tags: [],
  };
}

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export async function getTopStories(limit = 30) {
  return getStories('topstories', limit);
}

export async function getNewStories(limit = 30) {
  return getStories('newstories', limit);
}

export async function getBestStories(limit = 30) {
  return getStories('beststories', limit);
}

export async function getShowStories(limit = 20) {
  return getStories('showstories', limit);
}

export async function getAskStories(limit = 20) {
  return getStories('askstories', limit);
}
