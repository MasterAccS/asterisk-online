import React, { useEffect, useMemo, useRef, useState } from 'react';

const FONT_FAMILY = '"Inconsolata", "Inconsolata Nerd Font", monospace';
const MAX_CHARS = 560;

export default function FocusComposer({ isOpen, onClose, onPost }) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load & save draft
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('ao_draft');
      if (saved) setText(saved);
      setTimeout(() => {
        if (isMobile) {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

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
  const charCountClass = text.length < MAX_CHARS * 0.8 ? 'good' : 
                        text.length < MAX_CHARS * 0.9 ? 'warning' : 'danger';
  
  // Announce composer state changes to screen readers
  useEffect(() => {
    if (isOpen) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Composer opened. Start typing your post.';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [isOpen]);

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

  const handlePost = async () => {
    const trimmed = text.trim();
    if (!trimmed || overLimit || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onPost?.({ text: trimmed, attachments });
      
      // Success feedback
      const successAnnouncement = document.createElement('div');
      successAnnouncement.setAttribute('aria-live', 'polite');
      successAnnouncement.className = 'sr-only';
      successAnnouncement.textContent = 'Post published successfully!';
      document.body.appendChild(successAnnouncement);
      setTimeout(() => document.body.removeChild(successAnnouncement), 1000);
      
      setText('');
      setAttachments([]);
      localStorage.removeItem('ao_draft');
      onClose?.();
    } catch (error) {
      console.error('Failed to post:', error);
      // Error announcement
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Failed to publish post. Please try again.';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => document.body.removeChild(errorAnnouncement), 1000);
    } finally {
      setIsSubmitting(false);
    }
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
              <span className={`char-count ${charCountClass}`}>{text.length}</span>
              <span style={{ color: '#666' }}>/</span>
              <span style={{ color: '#666' }}>{MAX_CHARS}</span>
              {overLimit && (
                <span style={{ color: '#ef4444', marginLeft: 8, fontSize: '0.75rem' }}>
                  ({text.length - MAX_CHARS} over limit)
                </span>
              )}
            </div>
          </div>

          {/* Composer input section */}
          <div className="relative">
            {/* Display text with asterisk cursor (desktop only) */}
            {!isMobile && (
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
                    className="asterisk-cursor"
                    style={{
                      color: '#ffffff',
                      marginLeft: text ? 2 : 0,
                      fontFamily: FONT_FAMILY,
                      fontSize: 20,
                      fontWeight: 300
                    }}
                    aria-hidden="true"
                  >
                    *
                  </span>
                </div>
              </div>
            )}

            {/* Input field - visible textarea on mobile, invisible input on desktop */}
            {isMobile ? (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 100))}
                className="w-full resize-none bg-transparent border-none outline-none"
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 20,
                  fontWeight: 300,
                  color: '#fff',
                  minHeight: 56,
                  lineHeight: 1.4
                }}
                placeholder="Say more with less..."
                autoComplete="off"
                spellCheck="false"
                rows={3}
                aria-label="Compose your post"
              />
            ) : (
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
                aria-label="Compose your post"
              />
            )}
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
                disabled={!text.trim() || overLimit || isSubmitting}
                className="px-4 py-2 rounded-full"
                style={{
                  background: !text.trim() || overLimit || isSubmitting ? '#222' : '#00d4d4',
                  color: '#000',
                  border: 'none',
                  opacity: !text.trim() || overLimit || isSubmitting ? 0.6 : 1,
                  cursor: !text.trim() || overLimit || isSubmitting ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  minWidth: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={isSubmitting ? 'Publishing post...' : 'Publish post'}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="loading-spinner" style={{ 
                      width: 16, 
                      height: 16, 
                      border: '2px solid #666', 
                      borderTop: '2px solid #000', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></span>
                    Publishing...
                  </span>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

