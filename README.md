# Leavn - Bible Study PWA

A spiritually intelligent Bible Study Progressive Web App that guides users through one Bible chapter per day, starting with Genesis 1.

## Features

- **Progressive Web App**: Works offline and feels native on iOS devices
- **Daily Chapter Study**: Complete with summaries, key themes, spotlight verses, and reflection questions
- **Multi-perspective Commentary**: View content through different theological lenses
- **Accessibility Focus**: Support for dyslexia-friendly fonts, reduced motion, kids mode, and more
- **Freemium Model**: Free access to first 7 chapters + base summary with subscription options for full features

## Technical Stack

- React 18.3.0
- Vite 5.2.0
- vite-plugin-pwa for PWA capabilities
- Responsive design with accessibility as a primary concern
- Local storage for user preferences

## Project Structure

```
leavn/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── maskable-512.png
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DailyChapter.jsx
│   │   ├── DailyChapter.css
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── SettingsPanel.jsx
│   │   └── SettingsPanel.css
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd leavn
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Preview the production build:
   ```
   npm run preview
   ```

## PWA Features

### Offline Capability
The app is designed to work offline after the initial load, caching necessary resources.

### Home Screen Installation
Users can add the app to their home screen on iOS and Android for a native-like experience.

## Project Roadmap

### Phase 1 (Current)
- PWA foundation with core Bible study functionality
- Daily chapter view with summaries and study aids
- Settings for personalization and accessibility

### Phase 2 (Future)
- Integration with Capacitor for native iOS deployment
- Enhanced offline capabilities
- Audio narration features
- Advanced personalization based on user engagement

## Notes for Developers

- The icons in the public/icons directory are currently placeholders. Replace them with actual icons before production deployment.
- Translation and perspective files would be expanded in a production environment.
- For production, implement API endpoints or a more robust data storage solution for chapter content.

## Theological Approach

This app is designed to be theologically respectful while acknowledging diverse perspectives. When views diverge across traditions, the app notes multiple perspectives rather than presenting one as definitive.

## Accessibility

Accessibility is a core focus, with features including:
- OpenDyslexic and Lexend font options
- Large text mode
- Reduced motion option
- High contrast options
- Kids mode with simpler language and enhanced interactivity
