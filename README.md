# Asterisk Online — Focused Note‑Taking

A minimalist note‑taking app with an invisible composer and clean PostCards. Social features have been removed; notes show only timestamp and text, in a wide, readable layout.

## ✨ Features
- Focus Composer (press `N` to open; `Esc` to close; `Ctrl/⌘+Enter` to post)
- Wide PostCards (max width ~ 4xl) for comfortable reading
- Timestamp + text only (no avatars, handles, reactions)
- Keyboard‑first, distraction‑free UI

Note: This demo stores notes in memory. Refreshing the page resets the feed. The composer draft is saved to localStorage while composing.

## 🚀 Getting Started

Requirements: Node.js ≥ 16.14

```bash
npm install
npm start
```

Build production assets:
```bash
npm run build
```

Run tests:
```bash
npm test -- --watchAll=false
```

## 🧱 Architecture
- `src/App.jsx` — app state (notes), seeds initial notes, wires composer + feed
- `src/components/FocusComposer.jsx` — centered, invisible input with helpful shortcuts
- `src/pages/FeedView.jsx` — sorts notes by `createdAt` (newest first), wide layout
- `src/components/PostCard.jsx` — timestamp and note text only

## 🗺 Roadmap (optional)
- Local persistence (e.g., IndexedDB) or export/import
- Basic search and filters
- Print/export friendly view

## 📝 License
MIT
