import { useRef, useState, useEffect } from 'react';
import { timeAgo } from '../utils/helpers';
import './TrendingBar.css';

export default function TrendingBar({ stories }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || stories.length === 0) return;

    let animId;
    let scrollPos = 0;

    const scroll = () => {
      if (!isPaused && el) {
        scrollPos += 0.5;
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, stories]);

  if (!stories || stories.length === 0) return null;

  // Duplicate for infinite scroll effect
  const displayStories = [...stories, ...stories];

  return (
    <div
      className="trending-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="trending-bar"
    >
      <div className="trending-label">
        <span className="trending-fire">🔥</span>
        <span>Trending</span>
      </div>
      <div className="trending-scroll" ref={scrollRef}>
        <div className="trending-track">
          {displayStories.map((story, i) => (
            <a
              key={`${story.id}-${i}`}
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="trending-item"
              title={story.title}
            >
              <span className="trending-rank">#{(i % stories.length) + 1}</span>
              <span className="trending-title">{story.title}</span>
              <span className="trending-meta">
                <span className="trending-source">{story.sourceIcon}</span>
                {story.score > 0 && <span>↑{story.score}</span>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
