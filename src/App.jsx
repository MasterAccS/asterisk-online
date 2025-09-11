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
      text: 'Welcome to Asterisk Online. Say more with less. #hello',
      createdAt: now - 1000 * 60 * 3,
    },
    {
      id: makeId(),
      text: 'Focus-first writing feels different. Press N anywhere to compose. *',
      createdAt: now - 1000 * 60 * 30,
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
      text,
      createdAt: Date.now(),
    };
    setPosts((prev) => [post, ...prev]);
  };


  return (
    <div>
      <FeedView posts={posts} />
      <ComposeButton onClick={() => setComposerOpen(true)} />
      <FocusComposer isOpen={isComposerOpen} onClose={() => setComposerOpen(false)} onPost={handlePost} />
    </div>
  );
}

