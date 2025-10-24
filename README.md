# CardSnap Pro

A premium, offline-first business card scanning and contact management application for iOS.

## 📱 Features

- **Smart Card Scanning**: Capture business cards with your camera and extract contact information automatically
- **Offline-First**: Full functionality without internet connection
- **Advanced OCR**: On-device text recognition with high accuracy
- **Beautiful UI**: Gesture-driven interface with fluid animations powered by Reanimated and Skia
- **Organization**: Tags, collections, and smart filters for easy contact management
- **Export & Share**: Multiple export formats (vCard, CSV, PDF, QR codes)
- **Premium Features**: Unlimited scans, cloud backup, batch scanning, and more

## 🛠 Tech Stack

- **React Native 0.75+** - Cross-platform framework (iOS-focused)
- **TypeScript** - Type-safe development
- **React Native Reanimated 3.x** - High-performance animations
- **React Native Skia** - Advanced graphics and effects
- **React Native Vision Camera** - Professional camera integration
- **WatermelonDB** - Fast, reactive local database
- **React Navigation 7** - Navigation system

## 📋 Prerequisites

- Node.js >= 18
- Xcode 14+ (for iOS development)
- CocoaPods
- iOS 15.0+ deployment target

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CardSnap-Pro.git
cd CardSnap-Pro
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies:
```bash
cd ios
pod install
cd ..
```

### Running the App

#### iOS
```bash
npm run ios
```

Or open `ios/CardSnapPro.xcworkspace` in Xcode and run.

#### Development

Start Metro bundler:
```bash
npm start
```

## 📂 Project Structure

```
CardSnap-Pro/
├── src/
│   ├── screens/          # Screen components
│   │   ├── Splash/
│   │   ├── Home/
│   │   ├── Camera/
│   │   ├── Processing/
│   │   ├── EditContact/
│   │   ├── ContactDetail/
│   │   ├── Search/
│   │   ├── Settings/
│   │   ├── Organization/
│   │   └── IAP/
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── services/         # Business logic and services
│   │   ├── database/
│   │   ├── subscription/
│   │   └── theme/
│   ├── models/          # Data models
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── constants/       # Constants and theme
│   ├── types/           # TypeScript types
│   └── assets/          # Images, fonts, etc.
├── ios/                 # iOS native code
├── android/             # Android native code (future)
└── __tests__/          # Test files
```

## 🎨 Design Philosophy

CardSnap Pro follows a premium design philosophy with:
- **Fluid animations** for every interaction
- **Gesture-driven** interface for intuitive navigation
- **Physics-based** motion for natural feel
- **Attention to detail** in every pixel

## 🔧 Configuration

### Camera Permissions

Add to `ios/CardSnapPro/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>CardSnap Pro needs camera access to scan business cards</string>
```

### Contact Permissions (Optional)

```xml
<key>NSContactsUsageDescription</key>
<string>Access contacts to sync scanned cards</string>
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

## 📦 Building for Release

### iOS

1. Archive the app in Xcode
2. Upload to App Store Connect
3. Submit for review

## 🛣 Roadmap

### Phase 1 (Current)
- ✅ Core scanning functionality
- ✅ Contact management
- ✅ Basic organization (tags, collections)
- ✅ Export features
- ✅ In-app purchases

### Phase 2 (Planned)
- 🔄 iCloud sync
- 🔄 Batch scanning mode
- 🔄 Duplicate detection
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📱 iPad optimization
- 💻 macOS app
- ⌚ Apple Watch companion
- 🌐 Multiple languages

## 📄 License

Copyright © 2025 CardSnap Pro. All rights reserved.

## 🤝 Contributing

This is a proprietary project. Contributions are by invitation only.

## 📞 Support

For support, email support@cardsnapproapp.com

## 📚 Documentation

Full documentation available in `SDD.md` (Software Design Document).

---

Built with ❤️ using React Native
