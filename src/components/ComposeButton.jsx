import React from 'react';

export default function ComposeButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Compose new post (N)"
      onClick={onClick}
      className="fixed bottom-8 right-8 rounded-full p-4"
      style={{ background: '#4ecdc4', color: '#000', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
    >
      <span style={{ fontFamily: '"Inconsolata", monospace', fontSize: 20, fontWeight: 600 }}>*</span>
    </button>
  );
}

