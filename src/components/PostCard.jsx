import React, { useMemo } from 'react';

function formatTimeAgo(ts) {
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - ts) / 1000));
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function renderText(text) {
  const parts = [];
  const regex = /([@#][A-Za-z0-9_]+)/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(
      <span 
        key={m.index} 
        style={{ color: '#00d4d4' }}
        role="button"
        tabIndex="0"
        title={`Filter by ${m[1]}`}
      >
        {m[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function PostCard({ post }) {
  const timeAgo = useMemo(() => formatTimeAgo(post.createdAt), [post.createdAt]);
  const fullTimestamp = useMemo(() => new Date(post.createdAt).toLocaleString(), [post.createdAt]);

  return (
    <article
      className="post-card p-4 mb-4 rounded-lg"
      style={{ border: '1px solid #1f2937', background: '#0A0A0A' }}
      role="article"
      aria-labelledby={`post-${post.id}`}
    >
      <header>
        <time 
          className="text-sm" 
          style={{ opacity: 0.6, marginBottom: 8, display: 'block' }}
          dateTime={new Date(post.createdAt).toISOString()}
          title={fullTimestamp}
        >
          {timeAgo}
        </time>
      </header>
      <div 
        id={`post-${post.id}`}
        className="text-base" 
        style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
      >
        {renderText(post.text)}
      </div>
    </article>
  );
}

