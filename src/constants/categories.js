export const CATEGORIES = [
  {
    id: 'trending',
    label: 'Trending',
    icon: '🔥',
    path: '/',
  },
  {
    id: 'ai',
    label: 'AI & ML',
    icon: '🤖',
    path: '/category/ai',
  },
  {
    id: 'gadgets',
    label: 'Gadgets & Hardware',
    icon: '📱',
    path: '/category/gadgets',
  },
  {
    id: 'software',
    label: 'Software & Apps',
    icon: '💻',
    path: '/category/software',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    icon: '🔒',
    path: '/category/cybersecurity',
  },
  {
    id: 'startups',
    label: 'Startups & Business',
    icon: '🚀',
    path: '/category/startups',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    path: '/category/gaming',
  },
  {
    id: 'space',
    label: 'Space & Science',
    icon: '🛸',
    path: '/category/space',
  },
  {
    id: 'social',
    label: 'Social & Community',
    icon: '🐘',
    path: '/category/social',
  },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
