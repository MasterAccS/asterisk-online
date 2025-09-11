import React from 'react';

const TABS = [
  { key: 'following', label: 'Following' },
  { key: 'latest', label: 'Latest' },
  { key: 'for_you', label: 'For You' }
];

export default function FeedTabs({ value, onChange }) {
  return (
    <div className="flex gap-4 mb-4" role="tablist" aria-label="Feed modes">
      {TABS.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.key)}
            className="px-4 py-2 rounded-full"
            style={{
              background: active ? '#4ecdc4' : '#0F0F0F',
              color: active ? '#000' : '#ddd',
              border: active ? 'none' : '1px solid #333'
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

