# DigiMatch - Match List Implementation

This project implements a React Native Match List screen with infinite scrolling, live countdown timers, and advanced filtering.

## 🚀 Key Features

- **Pixel-Perfect UI**: Premium card-based design with smooth shadows and consistent typography.
- **Infinite Scrolling**: Optimized data loading using RTK Query with automatic duplicate handling.
- **Live Timers**: Real-time countdowns for match starts, transitioning to a "LIVE" state.
- **Advanced Filtering**: A modern bottom-sheet filter allowing multi-selection of tournaments across sports.
- **Robust State Management**: Built on Redux Toolkit and RTK Query for efficient data fetching and caching.

## 🛠 Tech Stack

- **React Native** (Functional Components + Hooks)
- **TypeScript**
- **Redux Toolkit & RTK Query**
- **Axios** (Legacy client replaced by RTK Query)

## 📖 Assumptions & Decisions

1.  **RTK Query Transition**: I chose to unify the API layer using RTK Query. This provides better performance (built-in caching) and cleaner code compared to manual axios hooks.
2.  **Premium Aesthetics**: In the absence of original XD assets, I implemented a custom "premium" design system using balanced color palettes (Slate, Teal, Red) and elevation/shadows for a high-end feel.
3.  **Timezone Handling**: The app uses the device's local timezone automatically for the API and timers, ensuring accuracy across different regions.
4.  **Infinite Scroll Logic**: The list automatically fetches more data when 50% of the current list is scrolled, providing a seamless experience.

## 🏃 Running the App

1.  **Install Dependencies**:
    ```sh
    yarn install
    # or
    npm install
    ```
2.  **iOS Special Step**:
    ```sh
    cd ios && pod install && cd ..
    ```
3.  **Start the App**:
    ```sh
    yarn start
    # Then run:
    yarn android
    # or
    yarn ios
    ```

---

## 🎞 Implementation Walkthrough
For a detailed look at the changes and features, please refer to the `walkthrough.md` in the artifacts directory.
