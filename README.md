# MindWeave - Mobile Mind Mapping Application

**Tagline:** "Weave Your Thoughts Into Clarity"

MindWeave is a premium mind mapping application for iOS built with React Native, featuring an intuitive gesture-driven interface, beautiful animations, and complete offline functionality.

## 📱 Features

### Core Features
- ✅ **Animated Splash Screen** - Physics-based logo assembly with particle effects
- ✅ **Mind Map Gallery** - Beautiful masonry grid layout with card previews
- ✅ **Interactive Canvas** - Pan, zoom, and rotate gestures for fluid navigation
- ✅ **Node System** - Create and customize nodes with rich styling options
- ✅ **Onboarding Flow** - Smooth first-time user experience
- ✅ **Theme System** - Light/dark mode with 8+ mind map color themes
- ✅ **Redux State Management** - Efficient global state with Redux Toolkit
- ✅ **Premium IAP Screen** - Beautiful subscription UI

### Premium Features
- 🔒 Unlimited Mind Maps (Free: 10 limit)
- ☁️ iCloud Sync
- 📤 Advanced Export (PDF, SVG, Markdown, JSON)
- 🎨 Custom Templates
- 👥 Collaboration (Real-time)
- 🎤 Voice Notes
- ✏️ Drawing Tools
- 📎 File Attachments
- 🎨 Premium Themes
- 🎯 Priority Support

## 🏗️ Architecture

### Tech Stack
- **Framework:** React Native 0.73.2
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation 6.x
- **Animations:** Reanimated 3.x + Skia
- **Gestures:** react-native-gesture-handler
- **Storage:** MMKV + AsyncStorage
- **IAP:** react-native-iap

### Project Structure
```
src/
├── assets/              # Images and animations
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── mindmap/        # Mind map specific components
│   ├── gestures/       # Gesture handlers
│   └── animations/     # Animation components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # Business logic services
├── store/              # Redux store and slices
├── models/             # TypeScript data models
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── theme/              # Theme system (colors, typography, spacing)
└── constants/          # App constants and config
```

## 🎨 Design System

### Color Palette
- **Primary:** Purple (#6B46C1), Blue (#3B82F6)
- **Secondary:** Green, Yellow, Red variants
- **8 Mind Map Themes:** Default, Ocean, Forest, Sunset, Monochrome, Pastel, Neon, Corporate

### Typography
- **Headings:** SF Pro Display (34pt - 18pt)
- **Body:** SF Pro Text (17pt - 13pt)
- **Monospace:** SF Mono

### Spacing Scale
- xs: 4pt, sm: 8pt, md: 12pt, lg: 16pt, xl: 24pt, 2xl: 32pt, 3xl: 48pt, 4xl: 64pt

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Xcode 15+ (for iOS development)
- CocoaPods
- React Native CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CardSnap-Pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS pods**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # iOS
   npm run ios
   # or
   yarn ios
   ```

### Development Scripts

```bash
npm start           # Start Metro bundler
npm run ios         # Run iOS app
npm run android     # Run Android app
npm test            # Run tests
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run typecheck   # Run TypeScript check
```

## 📦 Key Dependencies

```json
{
  "react-native": "0.73.2",
  "react-native-reanimated": "^3.6.1",
  "@shopify/react-native-skia": "^0.1.221",
  "react-native-gesture-handler": "^2.14.1",
  "@react-navigation/native": "^6.1.9",
  "@reduxjs/toolkit": "^2.0.1",
  "react-native-mmkv": "^2.11.0",
  "react-native-iap": "^12.10.7"
}
```

## 📱 Screens Implemented

### ✅ Completed Screens
1. **Splash Screen** - Animated logo assembly with skip functionality
2. **Onboarding Screen** - 4-slide introduction flow
3. **Home Screen** - Mind map gallery with FAB
4. **Mind Map Editor** - Interactive canvas with nodes
5. **Settings Screen** - User preferences
6. **Premium Screen** - IAP subscription UI
7. **Templates Screen** - Template browser
8. **Search Screen** - Global search interface

## 🎭 Animations

### Implemented
- Splash screen logo assembly
- Floating Action Button pulse effect
- Screen transitions
- Node interactions
- Canvas pan/zoom gestures

### Pending Advanced Animations
- Skia-based particle systems
- Bezier curve connections
- Radial context menu
- Multi-selection lasso
- Force-directed layout

## 🗂️ Data Models

### MindMap
- Properties: id, title, nodes, connections, settings, metadata
- Auto-save with debouncing
- Export/Import support

### Node
- Types: text, checklist, image, link, drawing, voice, file
- Rich styling options
- Hierarchical relationships

### Connection
- Styles: straight, curved, stepped, organic
- Arrow configurations
- Animation support

## 🔐 Premium Features (IAP)

### Subscription Tiers
- **Monthly:** $4.99/month
- **Annual:** $39.99/year (Best Value - Save 33%)
- **Lifetime:** $99.99 (One-time payment)

### Free Trial
- 7 days free trial
- Full premium access during trial
- Auto-renewable subscriptions

## 🛠️ Development Status

### Phase 1: Foundation ✅ (COMPLETED)
- [x] Project setup with TypeScript
- [x] Theme system implementation
- [x] Data models and Redux store
- [x] Navigation structure
- [x] Basic screens and components

### Phase 2: Core Features (IN PROGRESS)
- [x] Splash screen with animations
- [x] Home screen with mind map gallery
- [x] Mind Map Editor with canvas
- [x] Node rendering system
- [ ] Connection rendering with Bezier curves
- [ ] Node editing toolbar
- [ ] Multi-selection system
- [ ] Layout algorithms

### Phase 3: Advanced Features (PENDING)
- [ ] Skia-based advanced animations
- [ ] Search functionality
- [ ] Export/Share system
- [ ] IAP integration (react-native-iap)
- [ ] iCloud sync
- [ ] Undo/Redo system

### Phase 4: Polish & Release (PENDING)
- [ ] iOS app configuration (Info.plist, permissions)
- [ ] App icons and launch images
- [ ] Accessibility features
- [ ] Performance optimization
- [ ] Unit and integration tests
- [ ] App Store preparation

## 📝 Configuration Files

### TypeScript
- `tsconfig.json` - Strict mode with path aliases
- Path mapping for clean imports (@components, @screens, etc.)

### ESLint
- `.eslintrc.js` - React Native config with TypeScript support
- Prettier integration for consistent formatting

### Babel
- `babel.config.js` - Reanimated plugin configured
- Module resolver for path aliases

## 🎯 Performance Targets

- App launch time: <3s (cold start)
- Mind map load time: <1s (100 nodes)
- Animation frame rate: 60fps
- Memory usage: <200MB (typical use)

## 🧪 Testing

### Test Coverage Goals
- Utility functions: 100%
- Business logic: 90%
- Redux reducers: 100%
- Custom hooks: 80%

### Testing Frameworks
- Jest for unit tests
- React Native Testing Library for component tests
- Detox for E2E tests (planned)

## 📄 License

Proprietary - All rights reserved

## 👥 Contributors

Built with Claude Code following the comprehensive Software Design Document.

## 🔗 Links

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Skia](https://shopify.github.io/react-native-skia/)

---

**Version:** 1.0.0
**Last Updated:** October 2024
**Status:** Active Development
