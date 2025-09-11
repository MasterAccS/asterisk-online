# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

"asterisk-online" is a minimalist text input interface called "[ a s t e r * s k ]" - a React-based journaling application with invisible UI elements, center-expanding text display, and cinematic animations. The app is built for distraction-free writing with a focus on typography and user experience.

## Development Commands

### Core Development
```bash
npm start          # Start development server on http://localhost:3000
npm run build      # Build production bundle
npm test           # Run React test runner (using craco)
```

### Package Management
```bash
npm install        # Install dependencies
npm ci             # Clean install for CI/production
```

### Build System
The project uses **Create React App (CRA)** with **CRACO** (Create React App Configuration Override) for custom webpack configuration. CRACO is used primarily to suppress webpack deprecation warnings.

## Architecture & Structure

### Core Components Architecture
- **AsterSkApp.jsx** - Main application component containing all core logic
- **GridOverlay.jsx** - Development tool for precise positioning (6x6 grid system)
- **index.js** - App entry point with React 18 StrictMode
- **index.css** - Comprehensive CSS with Tailwind-like utilities and custom animations

### Grid-Based Layout System
The app uses a precise 6x6 grid layout:
- **Fixed Input Bar**: Positioned at Grid Line 2 (16.7% from top), Column D (50% - center)
- **Journal Container**: Positioned at Grid Line 3 (33.3% from top), spans to bottom (66.7vh)
- **Grid Toggle**: Type `::grid`, `--grid`, or `/grid` to show positioning overlay (dev mode only)

### Key Features Implementation
1. **Invisible Input Field**: Completely transparent input that captures keystrokes
2. **Center-Expanding Text**: Text grows from the center asterisk cursor position
3. **Seamless Cursor**: Pulsing asterisk (*) cursor that moves with text
4. **Dramatic Animations**: 6-stage fadeInSlideDown animation for new entries
5. **Smart Timestamps**: 5-minute interval grouping with automatic date markers
6. **Gradient Fade Zones**: Top and bottom overlays for smooth scrolling transitions

### State Management Patterns
- Uses React hooks exclusively (useState, useRef, useEffect)
- Journal entries stored in reverse chronological order
- Time-based grouping logic with midnight detection
- Automatic text formatting with sentence breaking for long entries

### Typography & Styling
- **Primary Font**: Inconsolata Nerd Font (Google Fonts)
- **Input Text**: 20px, weight 300
- **Journal Text**: 16px, weight 300
- **Custom CSS**: Tailwind-like utilities with custom animations and accessibility features

## Special Commands & Interactions

### Text Input Behavior
- **Enter**: Save current text as journal entry
- **Ctrl+A**: Select visible text in input area
- **Grid Commands**: `::grid`, `--grid`, `/grid` toggle development grid overlay

### Automatic Features
- Midnight date markers for multi-day journaling
- 5-minute timestamp intervals to reduce clutter
- Sentence breaking for entries with 3+ paragraphs
- Smooth scroll with 600ms delay after entry submission

## Deployment Configuration

### Multi-Platform Ready
- **Netlify**: `netlify.toml` configured with SPA redirects and security headers
- **Vercel**: `vercel.json` configured with static build and caching
- **Genezio**: `genezio.yaml` configured for frontend deployment
- **Apache**: SPA routing configured for traditional hosting

### Build Requirements
- Node.js >= 16.14.0
- npm >= 8.0.0
- Modern browser with CSS keyframes support

## Development Guidelines

### File Editing Patterns
When modifying the core app logic, focus on these key areas:
- **AsterSkApp.jsx**: All main functionality, state management, and UI logic
- **index.css**: Animations, typography, and utility classes
- **GridOverlay.jsx**: Development positioning tool (production disabled)

### Grid System Development
The precise positioning system relies on:
- Fixed positioning with percentage-based coordinates
- Transform-based centering for pixel-perfect alignment
- Independent scrolling areas with overflow management

### Animation & Transition Guidelines
- Entry animations use 6-stage keyframes for cinematic effect
- Scroll behavior includes deliberate 600ms delay for dramatic effect
- All transitions support `prefers-reduced-motion` accessibility

### Browser Compatibility Notes
- Uses modern CSS features (CSS Grid, Flexbox, custom properties)
- Scrollbar hiding implemented cross-browser
- Text selection styling customized for consistent UX
- High contrast mode support included

## Testing & Quality

The project currently uses Create React App's default testing setup but has no custom tests implemented. When adding tests, focus on:
- Text input and submission behavior
- Grid positioning accuracy
- Animation and transition functionality
- Accessibility features

## Accessibility Features

- Screen reader support with semantic HTML
- Focus management for keyboard navigation  
- Custom text selection styling
- High contrast mode support
- Reduced motion preferences respected
- Proper focus indicators throughout the interface
