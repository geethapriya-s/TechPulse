import * as hackerNewsApi from '../services/hackerNewsApi';
import * as devtoApi from '../services/devtoApi';
import * as spaceNewsApi from '../services/spaceNewsApi';
import * as mastodonApi from '../services/mastodonApi';
import * as redditApi from '../services/redditApi';

// Category-to-fetcher mapping
const categoryFetchers = {
  trending: async () => {
    const [hn, reddit] = await Promise.allSettled([
      hackerNewsApi.getTopStories(25),
      redditApi.getSubredditPosts('technology', 'hot', 15),
    ]);
    return [
      ...(hn.status === 'fulfilled' ? hn.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ].sort((a, b) => b.score - a.score);
  },

  ai: async () => {
    const [devto, mastodon] = await Promise.allSettled([
      devtoApi.getArticlesByTags('ai,machinelearning,deeplearning', 1, 25),
      mastodonApi.getMultipleTagTimelines(['ai', 'machinelearning', 'llm'], 8),
    ]);
    return [
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(mastodon.status === 'fulfilled' ? mastodon.value : []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  gadgets: async () => {
    const [devto, reddit] = await Promise.allSettled([
      devtoApi.getArticlesByTags('hardware,iot,embedded,arduino,raspberrypi', 1, 20),
      redditApi.getSubredditPosts('gadgets', 'hot', 15),
    ]);
    return [
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  software: async () => {
    const [hn, devto] = await Promise.allSettled([
      hackerNewsApi.getShowStories(15),
      devtoApi.getArticlesByTags('webdev,programming,javascript,python,react', 1, 20),
    ]);
    return [
      ...(hn.status === 'fulfilled' ? hn.value : []),
      ...(devto.status === 'fulfilled' ? devto.value : []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  cybersecurity: async () => {
    const [devto, mastodon] = await Promise.allSettled([
      devtoApi.getArticlesByTags('security,cybersecurity,hacking,infosec', 1, 25),
      mastodonApi.getMultipleTagTimelines(['infosec', 'cybersecurity', 'security'], 8),
    ]);
    return [
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(mastodon.status === 'fulfilled' ? mastodon.value : []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  startups: async () => {
    const [hn, reddit] = await Promise.allSettled([
      hackerNewsApi.getTopStories(20),
      redditApi.getSubredditPosts('startups', 'hot', 10),
    ]);
    return [
      ...(hn.status === 'fulfilled' ? hn.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ].sort((a, b) => b.score - a.score);
  },

  gaming: async () => {
    const [devto, reddit] = await Promise.allSettled([
      devtoApi.getArticlesByTags('gaming,gamedev,unity,unrealengine', 1, 20),
      redditApi.getSubredditPosts('gaming', 'hot', 15),
    ]);
    return [
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  space: async () => {
    const articles = await spaceNewsApi.getArticles(30);
    return articles;
  },

  social: async () => {
    const posts = await mastodonApi.getMultipleTagTimelines(
      ['technology', 'programming', 'opensource', 'foss', 'linux', 'webdev'],
      10
    );
    return posts;
  },
};

export async function fetchCategoryArticles(categoryId) {
  const fetcher = categoryFetchers[categoryId];
  if (!fetcher) {
    console.warn(`No fetcher for category: ${categoryId}`);
    return [];
  }
  return fetcher();
}

export async function fetchHomeArticles() {
  return categoryFetchers.trending();
}

export async function searchAllSources(query) {
  const [devto, space, reddit, mastodon] = await Promise.allSettled([
    devtoApi.searchArticles(query, 1, 20),
    spaceNewsApi.searchArticles(query, 10),
    redditApi.getSubredditPosts(`search?q=${encodeURIComponent(query)}`, 'relevance', 10),
    mastodonApi.getTagTimeline(query.toLowerCase().replace(/\s+/g, ''), 15),
  ]);
  return [
    ...(devto.status === 'fulfilled' ? devto.value : []),
    ...(space.status === 'fulfilled' ? space.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(mastodon.status === 'fulfilled' ? mastodon.value : []),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
