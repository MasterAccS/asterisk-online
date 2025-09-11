import React, { useMemo, useState } from 'react';

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
      <span key={m.index} style={{ color: '#4ecdc4' }}>{m[1]}</span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function PostCard({ post, onStar }) {
  const [starred, setStarred] = useState(post.youStarred || false);
  const [stars, setStars] = useState(post.reactions?.stars || 0);
  const [reposts, setReposts] = useState(post.reactions?.reposts || 0);

  const timeAgo = useMemo(() => formatTimeAgo(post.createdAt), [post.createdAt]);

  return (
    <article
      className="p-4 mb-4 rounded-lg"
      style={{ border: '1px solid #1f2937', background: '#0A0A0A' }}
    >
      <div className="flex gap-4">
        <img
          src={post.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp&s=80'}
          alt="avatar"
          width={40}
          height={40}
          style={{ borderRadius: '50%' }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-sm" style={{ fontWeight: 600 }}>{post.author}</div>
            <div className="text-sm" style={{ opacity: 0.6 }}>{post.handle}</div>
            <div className="text-sm" style={{ opacity: 0.5 }}>· {timeAgo}</div>
          </div>
          <div className="text-base" style={{ whiteSpace: 'pre-wrap' }}>
            {renderText(post.text)}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 text-sm" style={{ opacity: 0.8 }}>
            <button
              type="button"
              onClick={() => {
                setStarred((s) => !s);
                setStars((n) => (starred ? Math.max(0, n - 1) : n + 1));
                onStar?.(post.id, !starred);
              }}
              className="px-3 py-1 rounded-full"
              style={{ border: '1px solid #333', background: '#0F0F0F', color: starred ? '#4ecdc4' : '#ddd' }}
            >
              * {stars}
            </button>
            <button
              type="button"
              onClick={() => setReposts((n) => n + 1)}
              className="px-3 py-1 rounded-full"
              style={{ border: '1px solid #333', background: '#0F0F0F', color: '#ddd' }}
            >
              Repost {reposts}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

