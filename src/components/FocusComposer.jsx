import React, { useEffect, useMemo, useRef, useState } from 'react';

const FONT_FAMILY = '"Inconsolata", "Inconsolata Nerd Font", monospace';
const MAX_CHARS = 560;

export default function FocusComposer({ isOpen, onClose, onPost }) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const inputRef = useRef(null);

  // Load & save draft
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('ao_draft');
      if (saved) setText(saved);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('ao_draft', text);
  }, [text]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        e.preventDefault();
        handlePost();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, text]);

  const overLimit = text.length > MAX_CHARS;

  const renderedText = useMemo(() => {
    if (!text) return null;
    const parts = [];
    const regex = /([@#][A-Za-z0-9_]+)/g;
    let lastIndex = 0;
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIndex) {
        parts.push(text.slice(lastIndex, m.index));
      }
      parts.push(
        <span key={`${m.index}`} style={{ color: '#4ecdc4' }}>
          {m[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  }, [text]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files]);
    }
    e.target.value = '';
  };

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed || overLimit) return;
    onPost?.({ text: trimmed, attachments });
    setText('');
    setAttachments([]);
    localStorage.removeItem('ao_draft');
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Focus composer"
      className="fixed inset-0"
      style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 2000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
        style={{ maxWidth: 720 }}
      >
        <div
          className="relative"
          style={{
            backgroundColor: '#0A0A0A',
            border: '1px solid #222',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm" style={{ opacity: 0.7 }}>
              Say more with less
            </div>
            <div className="text-sm" style={{ opacity: 0.7 }}>
              <span style={{ color: overLimit ? '#ff6b6b' : '#aaa' }}>{text.length}</span>
              <span style={{ color: '#666' }}>/</span>
              <span style={{ color: '#666' }}>{MAX_CHARS}</span>
            </div>
          </div>

          {/* Display text with asterisk cursor */}
          <div
            className="relative text-center"
            style={{
              minHeight: 56,
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 300,
              color: '#fff'
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) inputRef.current?.focus();
            }}
          >
            <div className="inline-flex items-baseline" style={{ maxWidth: '100%' }}>
              {text && (
                <span
                  className="transition-all ease-out"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {renderedText}
                </span>
              )}
              <span
                style={{
                  color: '#ffffff',
                  animation: 'pulse 1.5s infinite',
                  marginLeft: text ? 2 : 0,
                  fontFamily: FONT_FAMILY,
                  fontSize: 20,
                  fontWeight: 300
                }}
              >
                *
              </span>
            </div>

            {/* Invisible input */}
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 100))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                caretColor: 'transparent',
                color: 'transparent',
                fontSize: 1,
                fontFamily: 'monospace'
              }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {/* Attachments */}
          <div className="mt-2 mb-4">
            <label className="text-sm" style={{ opacity: 0.7 }}>
              Attachments (optional):
            </label>
            <div className="mt-1 flex gap-4 items-center">
              <button
                type="button"
                onClick={() => document.getElementById('ao_file_input')?.click()}
                className="px-3 py-1 rounded-full"
                style={{ border: '1px solid #333', background: '#111', color: '#ddd' }}
              >
                Add media
              </button>
              <input
                id="ao_file_input"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {attachments.length > 0 && (
                <div className="text-xs" style={{ opacity: 0.7 }}>
                  {attachments.length} file{attachments.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-xs" style={{ opacity: 0.6 }}>
              Esc to close • Ctrl/⌘+Enter to post
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full"
                style={{ border: '1px solid #333', background: '#0A0A0A', color: '#ddd' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePost}
                disabled={!text.trim() || overLimit}
                className="px-4 py-2 rounded-full"
                style={{
                  background: !text.trim() || overLimit ? '#222' : '#4ecdc4',
                  color: '#000',
                  border: 'none',
                  opacity: !text.trim() || overLimit ? 0.6 : 1,
                  cursor: !text.trim() || overLimit ? 'not-allowed' : 'pointer'
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

