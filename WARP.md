# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start development server | `npm start` |
| Build for production | `npm run build` |
| Run tests | `npm test` |
| Run tests (non-watch mode) | `npm test -- --watchAll=false` |
| Lint code | `npx eslint src/` |
| Format code | `npx prettier --write src/` |

## Project Architecture

Asterisk Online is a minimalist note-taking React app with a focus on distraction-free writing. The architecture centers around three main concepts:

### Core Components
- **App.jsx**: Main application state container that manages the posts array and composer visibility
- **FocusComposer**: Modal dialog for composing notes with keyboard shortcuts and invisible input field
- **FeedView**: Renders sorted posts in chronological order (newest first)  
- **PostCard**: Individual note display with timestamp formatting and hashtag/mention highlighting

### Data Flow
```
User Input (Keyboard: 'N') → App.setComposerOpen(true) → FocusComposer renders
FocusComposer.onPost() → App.handlePost() → App.setPosts([newPost, ...posts])
App.posts → FeedView → PostCard components
```

### Key Architectural Decisions
- **Client-side only**: No backend, notes stored in memory (lost on refresh)
- **Keyboard-first**: Primary interaction via 'N' key to open composer
- **Invisible input**: Visual text rendering separate from actual input field
- **Draft persistence**: Uses localStorage to save composer drafts during typing
- **Immutable updates**: Posts array updated immutably with spread syntax

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `N` | Open composer | Anywhere in app |
| `Esc` | Close composer | Composer open |
| `Ctrl/Cmd + Enter` | Post note | Composer open |

## File Structure

```
src/
├── App.jsx                    # Main app component with state management
├── index.js                   # React app entry point
├── index.css                  # Global styles
├── components/
│   ├── ComposeButton.jsx      # Floating compose button
│   ├── FocusComposer.jsx      # Modal composer with invisible input
│   └── PostCard.jsx           # Individual note display
├── pages/
│   └── FeedView.jsx           # Main feed layout and post sorting
└── __tests__/
    └── smoke.test.js          # Basic import/sanity tests
```

## Development Environment

- **Node.js**: ≥16.14.0 required
- **npm**: ≥8.0.0 required  
- **Build tool**: CRACO (Create React App Configuration Override)
- **Bundle size**: ~48KB JS + ~2.3KB CSS (gzipped)

## Testing

The project uses minimal testing with just smoke tests to ensure imports work:
- Test files in `src/__tests__/`
- Uses default React Testing Library setup
- Run single test: `npm test -- --testNamePattern="App module loads"`

## Deployment Options

The app is configured for multiple deployment targets:

### Netlify (Primary)
- Build command: `npm run build`
- Publish directory: `build`
- SPA routing configured via `netlify.toml`

### Vercel  
- Auto-detected build process
- SPA routing via `vercel.json`

### Genezio
- Configured in `genezio.yaml`
- Subdomain: `aster-sk`

## Unique Features

### Invisible Composer Input
The composer uses a unique pattern where the actual input field is invisible (`opacity: 0`) positioned over the visual text display. This allows for:
- Custom cursor rendering (asterisk character: `*`)
- Syntax highlighting of hashtags/mentions (`#` and `@` symbols)
- Precise visual control while maintaining native input behavior

### Text Highlighting Pattern
Both FocusComposer and PostCard use the same regex pattern to highlight hashtags and mentions:
```javascript
const regex = /([@#][A-Za-z0-9_]+)/g;
```

### Draft Persistence
- Drafts auto-saved to localStorage under key `ao_draft`
- Cleared on successful post or manual deletion
- Restored when reopening composer

## Configuration Details

### Character Limits
- Max characters: 560 (stored in `FocusComposer.jsx`)
- Over-limit posts disabled with visual warning

### Styling Constants
- Font family: `"Inconsolata", "Inconsolata Nerd Font", monospace`  
- Theme colors: Dark theme with `#4ecdc4` accent color
- Background: `#0A0A0A` for cards and modals

### Build Configuration
CRACO configuration handles webpack-dev-server deprecation warnings by converting deprecated middleware APIs to new format.