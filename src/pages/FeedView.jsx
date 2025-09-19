import React, { useMemo } from 'react';
import PostCard from '../components/PostCard';

function sortByNewest(a, b) { return b.createdAt - a.createdAt; }

export default function FeedView({ posts }) {
  const visiblePosts = useMemo(() => {
    return [...posts].sort(sortByNewest);
  }, [posts]);

  return (
    <>
      {/* Skip navigation link */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      
      <main 
        id="main-content" 
        className="max-w-4xl mx-auto px-4 pt-32 pb-32"
        role="main"
      >
        <header className="mb-6">
          <h1 className="text-2xl font-classic tracking-wider mb-2">
            Asterisk Online
          </h1>
          <p className="text-sm" style={{ opacity: 0.7 }}>
            Say more with less · Calm, focused notes
          </p>
        </header>

        <section aria-label="Posts feed">
          {visiblePosts.length === 0 ? (
            <div 
              className="text-center" 
              style={{ opacity: 0.5, padding: '2rem' }}
              role="status"
              aria-live="polite"
            >
              <p>No posts yet.</p>
              <p>Press <kbd style={{ 
                background: '#1a1a1a', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontFamily: 'monospace' 
              }}>N</kbd> to compose your first post.</p>
            </div>
          ) : (
            <div aria-live="polite" aria-label={`${visiblePosts.length} posts`}>
              {visiblePosts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  aria-posinset={index + 1}
                  aria-setsize={visiblePosts.length}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

