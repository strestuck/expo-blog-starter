# Tech Stack Document

This document explains, in everyday language, the technology choices for the Expo Blog Starter project adapted to use a WordPress back end. It shows how each piece fits together, why it was chosen, and how it benefits the overall app.

## 1. Frontend Technologies

We build the user interface—the part people tap, swipe, and read—using the following tools:

- **Expo SDK (Version 52)**  
  A toolkit that makes it easy to build, run, and update your app on iOS, Android, and Web without juggling separate native projects.

- **React Native**  
  A framework for writing mobile apps with JavaScript/TypeScript, giving a near‐native look and feel on both iOS and Android.

- **TypeScript**  
  A typed version of JavaScript that catches errors early and makes code easier to understand and maintain.

- **React Navigation**  
  A library for moving between screens (e.g., Home → Article Detail). We use a programmatic stack navigator so we have full control over titles, headers, and navigation parameters.

- **Theming System**  
  - Custom **`ThemedText`** and **`ThemedView`** components automatically switch between light and dark mode.  
  - A single **`constants/Colors.ts`** file holds all color definitions, ensuring a consistent look across screens.
  
- **react-native-reanimated**  
  For smooth, high-performance animations (e.g., fading in the featured article carousel).

- **react-native-snap-carousel**  
  To display featured posts in a swipeable carousel on the home screen.

- **FlatList** & **ActivityIndicator**  
  Built-in React Native components for displaying long lists of posts and showing loading spinners.

- **react-native-render-html**  
  To display the rich HTML content of each WordPress post (formatting, images, links).

- **React Hooks (useState, useContext)**  
  For managing local component state (loading, error, data) and sharing simple state like the current theme or language choice.

- **react-i18next**  
  Enables multiple languages (English and Indonesian). A header button lets users switch languages instantly across the app.

- **Optional TanStack Query (react-query)** or **SWR**  
  For advanced data fetching, caching, and background updates (recommended as your app grows).

**Benefits**: These tools combine to deliver a responsive, theme-aware, multi-language interface that feels native, loads quickly, and adapts to user preferences.

## 2. Backend Technologies

All content (posts, categories) comes from your WordPress site using its REST API:

- **WordPress REST API**  
  A set of HTTP endpoints exposed by WordPress for fetching posts, categories, and more.

- **axios**  
  A promise-based HTTP client used in `src/api/index.ts` to talk to the WordPress API. If a request fails, we handle the error gracefully and let users retry.

- **TypeScript Interfaces**  
  We define **`Post`** and **`Category`** structures in `src/types.ts` so the code always knows what shape the data has.

**How it works together**:  
When the Home screen mounts, it calls `getPosts()` and `getCategories()` from `src/api/index.ts`. That code uses axios to fetch data, then returns typed objects to your UI components.

## 3. Infrastructure and Deployment

This section covers how we store our code, build the app, and deliver updates safely.

- **Version Control: Git & GitHub**  
  All source code lives in a Git repository hosted on GitHub. Every change is tracked, reviewed, and can be rolled back if needed.

- **Local Development: Expo CLI**  
  Developers use `expo start` to run the app on simulators or real devices. Code updates appear instantly thanks to Hot Reloading.

- **Continuous Integration (CI): GitHub Actions**  
  Automates tasks like linting, type‐checking, and running unit tests whenever code is pushed or a pull request is opened.

- **Build & Publishing: Expo Application Services (EAS)**  
  - **EAS Build** compiles native iOS and Android apps in the cloud—no local Xcode or Android Studio needed.  
  - **EAS Submit** can automatically upload builds to App Store Connect and Google Play.  
  - **Over-the-Air Updates (Expo Publish)** let you push JavaScript/asset updates without re-submitting to app stores.

**Benefits**: This setup ensures every code change is tested, apps are built consistently, and updates reach users quickly and reliably.

## 4. Third-Party Integrations

Beyond the main tools above, we integrate a few other services to extend the app’s capabilities:

- **WordPress**  
  Your existing content management system, hosting blog posts and serving them via its REST API.

- **i18next** / **react-i18next**  
  For translating all user‐facing text, supporting multiple languages and locale rules.

- **react-native-snap-carousel** & **react-native-render-html**  
  Specialized libraries for carousels and HTML content rendering.

- **Optional TanStack Query / SWR**  
  As mentioned, these can handle advanced data caching, background refresh, and offline support.

**Benefits**: These integrations save months of custom work—instead, we leverage proven libraries that focus on one thing and do it well.

## 5. Security and Performance Considerations

We take steps to keep user data safe and ensure the app runs smoothly:

- **Secure API Calls (HTTPS)**  
  All axios requests use HTTPS, protecting data in transit and preventing eavesdropping.

- **Error Handling & Retry**  
  Every screen watches for network errors. If something goes wrong, an easy “Retry” button appears so users can recover without restarting the app.

- **Data Caching**  
  With optional React Query or SWR, we can cache responses, reduce repeated network calls, and serve data instantly when possible.

- **Optimized Animations**  
  Using react-native-reanimated ensures animations run at 60fps, avoiding janky transitions.

- **Bundle Size Management**  
  Expo SDK and TypeScript help us include only what we need, keeping the download size reasonable.

- **Accessibility Best Practices**  
  We add labels and roles to UI elements so the app works well with screen readers and other assistive tools.

## 6. Conclusion and Overall Tech Stack Summary

Our choices reflect the goal of building a modern, easy-to-maintain, cross-platform blog app that hooks into WordPress while offering a polished user experience:

- We use **Expo** and **React Native** for fast cross-platform development.
- **TypeScript** brings clarity and safety to our code.
- **React Navigation** gives full control over screen flows.
- A **theming system** and **react-native-reanimated** ensure a visually appealing interface.
- **axios** and the **WordPress REST API** handle content delivery.
- **react-i18next** provides seamless internationalization.
- **GitHub Actions** and **Expo EAS** make building, testing, and deployment straightforward.
- **Security** and **performance** are baked in through HTTPS, error handling, caching, and optimized animations.

Together, these technologies form a cohesive, robust stack that lets you focus on writing great content and features, not wrestling with infrastructure. The modular structure also makes it easy to extend—whether you add new languages, connect to other APIs, or introduce more advanced caching down the road.