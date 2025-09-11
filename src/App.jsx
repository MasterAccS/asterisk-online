import React, { useEffect, useMemo, useState } from 'react';
import FeedView from './pages/FeedView';
import ComposeButton from './components/ComposeButton';
import FocusComposer from './components/FocusComposer';

function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function seedPosts() {
  const now = Date.now();
  return [
    {
      id: makeId(),
      author: 'Asterisk',
      handle: '@aster',
      avatarUrl: '',
      text: 'Welcome to Asterisk Online. Say more with less. #hello',
      createdAt: now - 1000 * 60 * 3,
      reactions: { stars: 3, reposts: 0 },
      youStarred: false,
    },
    {
      id: makeId(),
      author: 'Skye',
      handle: '@skye',
      avatarUrl: '',
      text: 'Focus-first writing feels different. Press N anywhere to compose. *',
      createdAt: now - 1000 * 60 * 30,
      reactions: { stars: 1, reposts: 0 },
      youStarred: false,
    },
  ];
}

export default function App() {
  const [posts, setPosts] = useState(() => seedPosts());
  const [isComposerOpen, setComposerOpen] = useState(false);

  // Keyboard shortcut (N) to open composer
  useEffect(() => {
    const onKey = (e) => {
      if (!isComposerOpen && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'n') {
        setComposerOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isComposerOpen]);

  const handlePost = ({ text }) => {
    const post = {
      id: makeId(),
      author: 'You',
      handle: '@you',
      avatarUrl: '',
      text,
      createdAt: Date.now(),
      reactions: { stars: 0, reposts: 0 },
      youStarred: false,
    };
    setPosts((prev) => [post, ...prev]);
  };

  const handleStar = (id, starred) => {
    setPosts((prev) => prev.map(p => p.id === id ? {
      ...p,
      youStarred: starred,
      reactions: { ...p.reactions, stars: Math.max(0, (p.reactions?.stars || 0) + (starred ? 1 : -1)) }
    } : p));
  };

  return (
    <div>
      <FeedView posts={posts} onStar={handleStar} />
      <ComposeButton onClick={() => setComposerOpen(true)} />
      <FocusComposer isOpen={isComposerOpen} onClose={() => setComposerOpen(false)} onPost={handlePost} />
    </div>
  );
}

