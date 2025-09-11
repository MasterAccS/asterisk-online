import React, { useMemo } from 'react';
import PostCard from '../components/PostCard';

function sortByNewest(a, b) { return b.createdAt - a.createdAt; }

export default function FeedView({ posts }) {
  const visiblePosts = useMemo(() => {
    return [...posts].sort(sortByNewest);
  }, [posts]);

  return (
    <main className="max-w-4xl mx-auto px-4 pt-32 pb-32">
      <header className="mb-6">
        <h1 className="text-2xl font-classic tracking-wider mb-2">Asterisk Online</h1>
        <div className="text-sm" style={{ opacity: 0.7 }}>Say more with less · Calm, focused notes</div>
      </header>

      {visiblePosts.length === 0 ? (
        <div className="text-center" style={{ opacity: 0.5 }}>No posts yet. Press N to compose your first post.</div>
      ) : (
        visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </main>
  );
}

