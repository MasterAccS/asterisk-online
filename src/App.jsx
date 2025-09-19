import React, { useEffect, useMemo, useState } from 'react';
import FeedView from './pages/FeedView';
import ComposeButton from './components/ComposeButton';
import FocusComposer from './components/FocusComposer';
import KeyboardHelp from './components/KeyboardHelp';

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
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      // Ignore shortcuts when composer or help is open
      if (isComposerOpen || isHelpOpen) return;
      
      // Ignore shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Ignore shortcuts with modifiers (except for specific cases)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setComposerOpen(true);
          break;
        case '?':
          e.preventDefault();
          setHelpOpen(true);
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isComposerOpen, isHelpOpen]);

  const handlePost = async ({ text, attachments }) => {
    const post = {
      id: makeId(),
      text,
      createdAt: Date.now(),
      attachments: attachments || [],
    };
    
    // Simulate network delay for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setPosts((prev) => [post, ...prev]);
    
    return post;
  };


  return (
    <div>
      <FeedView posts={posts} />
      <ComposeButton onClick={() => setComposerOpen(true)} />
      <FocusComposer 
        isOpen={isComposerOpen} 
        onClose={() => setComposerOpen(false)} 
        onPost={handlePost} 
      />
      <KeyboardHelp 
        isOpen={isHelpOpen} 
        onClose={() => setHelpOpen(false)} 
      />
    </div>
  );
}

