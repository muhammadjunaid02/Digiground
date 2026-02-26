# Digiground 🏆

Digiground is a high-performance React Native application designed for sports fans. It provides real-time match listings, interactive filters, and live countdown timers for upcoming matches across various sports including Cricket, Soccer, and Basketball.

## 🚀 Key Features

- **Match List**: A smooth, infinite-scrolling list of upcoming matches.
- **Pixel-Perfect UI**: Designed for accuracy and responsiveness across all device sizes.
- **Advanced Filters**: Filter matches by sport-specific tournaments using a professional bottom-sheet modal.
- **Live Countdown**: Real-time accurate countdown timers for match start times.
- **Custom Date Picker**: Easily select specific dates to see upcoming matches.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v22.11.0 or higher)
- [Yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muhammadjunaid02/Digiground.git
   cd Digiground
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Android Setup:**
   - Ensure you have an Android emulator running or a physical device connected via ADB.
   - Run the application:
     ```bash
     yarn android
     ```

4. **iOS Setup (macOS only):**
   - Install CocoaPods:
     ```bash
     cd ios && pod install && cd ..
     ```
   - Run the application:
     ```bash
     yarn ios
     ```

---

## 🏗 Building for Production

### Android (Generate APK)
The project includes a GitHub Action that automatically builds the APK when you push to the `main` branch. 

To build manually:
```bash
cd android
./gradlew assembleRelease
```
The generated APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 📖 Usage Guide

### 1. Navigating the Match List
- The home screen displays matches for the current day.
- Scroll down to load more matches automatically (Infinite Scroll).

### 2. Using Filters
- Tap on the **Filters** button at the top left.
- A bottom sheet will appear with sports and tournaments.
- Select your desired tournaments and tap **Apply**.
- To reset, tap **Reset all** inside the filter modal or the "All" chip at the top.

### 3. Selecting a Custom Date
- Tap on the **Month/Year** (e.g., February 2026) in the header.
- Use the native date picker to select a specific date.
- Alternatively, swipe horizontally on the date bar to choose nearby dates.

---

## 🔧 Technical Details

- **Framework**: React Native
- **State Management**: Redux Toolkit (RTK Query) for API interactions.
- **Icons/Images**: Integrated with SmartB Media API.
- **Workflow**: Automated CI/CD using GitHub Actions for APK generation.

---

## 🤝 Support
For any issues, please open a GitHub issue or contact the development team. 🚀