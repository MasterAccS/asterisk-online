import React from 'react';

export default function ComposeButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Compose new post (Press N key or click)"
      onClick={onClick}
      className="compose-button fixed bottom-8 right-8 rounded-full p-4"
      style={{ 
        background: '#00d4d4', 
        color: '#000', 
        border: 'none', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span 
        style={{ 
          fontFamily: '"Inconsolata", monospace', 
          fontSize: 20, 
          fontWeight: 600,
          lineHeight: 1
        }}
        aria-hidden="true"
      >
        *
      </span>
    </button>
  );
}

