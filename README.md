# [ a s t e r * s k ]

Minimalist text input interface with invisible UI elements. Features center-expanding text display and seamless cursor integration for distraction-free writing.

## ✨ Key Features

- Invisible Input Field
- Center-Expanding Text
- High-Contrast Aesthetic
- Pulsing Asterisk Cursor
- Dramatic Entry Animations
- Smooth Scroll Delays
- Gradient Fade Zones
- Reverse Chronological Order
- Independent Scrolling
- Fixed Input Position
- Persistent Storage
- Custom Text Selection
- Cinematic Transitions
- Invisible Scrollbars

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### 🚀 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd aster-sk
```

2. Install dependencies:
```bash
cd my-react-app
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) and start journaling!


## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## 🎲 How to Use

1. **Start Writing**: Click anywhere or start typing - the invisible input field captures everything
2. **Watch Text Expand**: Your words appear and grow from the center asterisk cursor
3. **Press Enter**: Save your entry and watch it appear at the top with cinematic animation
4. **Keep Writing**: Add more entries - older ones get pushed down automatically
5. **Scroll to Explore**: Browse your journal history with smooth fade effects
6. **Select Text**: Use mouse or Ctrl+A to highlight text with custom styling

## 🏛 Architecture

### 🗺 Grid System
The app uses a 6x6 grid layout system:
- **Grid Line 2 (16.7%)**: Fixed input bar with asterisk cursor
- **Grid Lines 3-6 (33.3%-100%)**: Scrollable journaling container
- **80% Width**: Both areas use same width constraint (max 600px)

### 🔧 Core Components
- **EtchedTextApp.jsx** - Main app with invisible input and journal container
- **Isolated Scrolling** - Journal area scrolls independently from input
- **State Management** - React hooks for entries and UI state

### 🎨 Visual Effects
- **CSS Keyframes** - 6-stage fadeInSlideDown animation
- **Gradient Overlays** - Top/bottom fade zones with multi-step gradients
- **Smooth Scrolling** - Native browser smooth scroll with timing delays
- **Cross-browser** - Hidden scrollbars and consistent behavior

## 💬 Technical Specifications

### 🎨 Typography
- **Font**: Inconsolata Nerd Font (Google Fonts)
- **Input Size**: 20px, weight 300 (light)
- **Journal Size**: 16px, weight 300 (light)
- **Cursor**: Pulsing asterisk (*) with 1.5s animation

### 🎆 Animations
- **Entry Animation**: 1.0s fadeInSlideDown (6 keyframes)
- **Scroll Delay**: 600ms dramatic pause
- **Fade Zones**: 120px gradient overlays
- **Smooth Behavior**: Native browser smooth scrolling

### 📱 Browser Compatibility

- **Chrome 60+** - Full support
- **Firefox 55+** - Full support  
- **Safari 12+** - Full support
- **Edge 79+** - Full support

*Requires modern browser with CSS keyframes and smooth scroll support*

## 📝 License

MIT License - Feel free to use this for your own journaling adventures!
