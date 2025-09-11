import React, { useMemo, useState } from 'react';
import FeedTabs from '../components/FeedTabs';
import PostCard from '../components/PostCard';

function sortByNewest(a, b) { return b.createdAt - a.createdAt; }

export default function FeedView({ posts, onStar }) {
  const [mode, setMode] = useState('following');

  const visiblePosts = useMemo(() => {
    const copy = [...posts];
    switch (mode) {
      case 'latest':
        return copy.sort(sortByNewest);
      case 'for_you':
        // Transparent simple scoring: boost posts with stars and recency
        return copy
          .map(p => ({ p, score: (p.reactions?.stars || 0) * 2 + (Date.now() - p.createdAt < 3600_000 ? 1 : 0) }))
          .sort((a, b) => b.score - a.score || sortByNewest(a.p, b.p))
          .map(x => x.p);
      case 'following':
      default:
        // For now, same as latest but we can filter by follow graph later
        return copy.sort(sortByNewest);
    }
  }, [posts, mode]);

  return (
    <main className="max-w-2xl mx-auto px-4 pt-32 pb-32">
      <header className="mb-6">
        <h1 className="text-2xl font-classic tracking-wider mb-2">Asterisk Online</h1>
        <div className="text-sm" style={{ opacity: 0.7 }}>Say more with less · Calm, focused micro-social</div>
      </header>

      <FeedTabs value={mode} onChange={setMode} />

      {visiblePosts.length === 0 ? (
        <div className="text-center" style={{ opacity: 0.5 }}>No posts yet. Press N to compose your first post.</div>
      ) : (
        visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onStar={onStar} />
        ))
      )}
    </main>
  );
}

