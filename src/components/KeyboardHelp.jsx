import React, { useEffect } from 'react';

const shortcuts = [
  { key: 'N', description: 'Open composer' },
  { key: 'Esc', description: 'Close composer' },
  { key: 'Ctrl+Enter', description: 'Publish post', mac: '⌘+Enter' },
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'Tab', description: 'Navigate between elements' },
  { key: 'Space', description: 'Activate focused element' },
];

export default function KeyboardHelp({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when help opens
      setTimeout(() => {
        document.querySelector('.keyboard-help button')?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <>
      <div className="keyboard-help-overlay" onClick={onClose} />
      <div
        className="keyboard-help"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
      >
        <header className="mb-4">
          <h2 
            id="keyboard-help-title"
            className="text-lg font-semibold mb-2"
            style={{ color: '#00d4d4' }}
          >
            Keyboard Shortcuts
          </h2>
          <p className="text-sm" style={{ opacity: 0.7 }}>
            Navigate efficiently with these shortcuts
          </p>
        </header>

        <div className="space-y-3 mb-6">
          {shortcuts.map((shortcut) => (
            <div 
              key={shortcut.key}
              className="flex justify-between items-center"
            >
              <span className="text-sm">{shortcut.description}</span>
              <kbd>
                {isMac && shortcut.mac ? shortcut.mac : shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <footer className="flex justify-between items-center">
          <div className="text-xs" style={{ opacity: 0.6 }}>
            Press Esc to close
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full"
            style={{
              background: '#00d4d4',
              color: '#000',
              border: 'none',
              minHeight: '36px'
            }}
          >
            Close
          </button>
        </footer>
      </div>
    </>
  );
}