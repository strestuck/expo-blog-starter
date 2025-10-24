# Project Requirements Document (PRD)

## 1. Project Overview
This project is about building a cross-platform mobile blog app that fetches and displays content from a WordPress site. Starting from the Expo Blog Starter template (which includes theming, reusable components, and animations out of the box), we will replace the Firebase data layer with a WordPress REST API client. The app will run on iOS, Android, and web via Expo, giving readers a smooth, native-like experience to browse posts, view details, and explore categories.

Our core goal is to deliver a polished, user-friendly blog reader that supports light/dark themes, English and Indonesian languages, and reliable loading/error handling. Success means users can open the app, see a carousel of featured posts, scroll through recent articles, tap to read full content rendered directly from WordPress HTML, and switch languages instantly—all within acceptable load times and without confusing UX gaps.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)
- Home screen with:
  • Featured posts carousel using `react-native-snap-carousel`.
  • Recent posts list in a `FlatList`.
- Post detail screen:
  • Fetch full post via WordPress REST API (`/wp/v2/posts/{id}`).
  • Render HTML content with `react-native-render-html`.
- Categories screen:
  • Fetch and list categories (`/wp/v2/categories`).
  • Tap a category to see its posts.
- Internationalization (i18n) with English and Indonesian via `react-i18next`.
- Light and dark mode support using the starter’s `useThemeColor` hook and themed components.
- Loading and error states on every screen, with a retry button for failed API calls.
- Basic offline caching of the last-fetched data via TanStack Query (optional but recommended).

### Out-of-Scope (Phase 2+)
- User authentication or comment posting.
- Full-text search or advanced filtering.
- Push notifications or background sync.
- Rich media beyond inline images (e.g., video players, audio streaming).
- In-app purchases or payment integration.
- Analytics, A/B testing, or user tracking tools.

## 3. User Flow
When a user opens the app, they arrive at the **Home screen**. The top section shows a horizontally scrollable carousel of featured posts. Below it, they see a vertical list of recent posts with thumbnails and titles. While data is fetching, a spinner appears. If an error occurs, an error message and a “Retry” button are shown.

Tapping a post takes the user to the **Post Detail screen**. Here the full post title, date, author, and HTML-formatted content appear. The navigation header includes a back button and a language switcher icon. Users can change the app language on the fly, causing all text to update. From the main menu (hamburger or tab bar), they can open the **Categories screen**, select a category, and see a filtered list of posts.

## 4. Core Features
- **WordPress REST API Integration**: Axios-based client module (`src/api/index.ts`) with `getPosts`, `getPostById`, and `getCategories` functions.
- **Theming**: Light/dark mode via `useThemeColor`, `ThemedView`, `ThemedText` components.
- **Internationalization**: `react-i18next` setup in `src/i18n.ts` with English (`en`) and Indonesian (`id`) resources and language switcher.
- **Navigation**: Programmatic stack navigator in `src/navigation/AppNavigator.tsx` using React Navigation’s `NavigationContainer` and `createStackNavigator`.
- **Featured Carousel**: `react-native-snap-carousel` component on Home screen.
- **Content Rendering**: `react-native-render-html` to display post bodies securely.
- **Categories List**: Fetch and display categories, navigate to filtered post lists.
- **Loading & Error Handling**: Central pattern for showing `ActivityIndicator`, error views, and retry button.
- **Data Caching** (optional): TanStack Query for background refetching and caching.

## 5. Tech Stack & Tools
- **Framework**: Expo SDK 52 (cross-platform React Native environment).
- **Language**: TypeScript (typed JavaScript).
- **UI**: React Native with component-driven architecture.
- **Navigation**: React Navigation v6 (`@react-navigation/native`, `@react-navigation/stack`).
- **HTTP Client**: Axios for REST API calls.
- **Carousel**: `react-native-snap-carousel`.
- **HTML Rendering**: `react-native-render-html`.
- **i18n**: `react-i18next`.
- **State/Caching**: TanStack Query (optional) or built-in React hooks.
- **Theming**: Custom hooks (`useThemeColor`, `useColorScheme`) and themed components.
- **IDE & Plugins**: VS Code with Cursor or Windsurf for AI-assisted code completion (optional).

## 6. Non-Functional Requirements
- **Performance**: Home screen content should appear within 2 seconds on a 3G network. Carousel scroll and navigation transitions must run at 60 FPS.
- **Security**: All API calls over HTTPS. Sanitize HTML content to prevent XSS. No personal user data stored locally.
- **Usability**: Follow mobile accessibility best practices (WCAG AA). All tappable elements ≥44×44 points.
- **Reliability**: Show offline cache if no network. Retry logic with exponential backoff.
- **Maintainability**: Code organized in `src/` with clear folder structure. Reusable components and typed interfaces.

## 7. Constraints & Assumptions
- WordPress server must enable CORS for REST API endpoints.
- WordPress version 5.0+ with standard `wp/v2` namespace.
- Expo SDK 52 and React Navigation libraries are compatible and maintained.
- Users have intermittent network—offline caching assumed.
- No login or user accounts needed in v1, so Firebase auth is removed.
- Post HTML content uses simple tags supported by `react-native-render-html`.

## 8. Known Issues & Potential Pitfalls
- **Large HTML Posts**: Complex HTML (iframes, scripts) may not render well. Mitigation: strip unsupported tags server-side or limit to basic markup.
- **API Rate Limits**: High-traffic WordPress sites might throttle. Mitigation: implement caching, conditional `If-Modified-Since` headers.
- **Image Loading**: Large images can degrade performance. Mitigation: use `react-native-fast-image` or add placeholder resizing.
- **Language Toggle State**: Text length differences in Indonesian vs. English can break UI. Mitigation: test layouts on both languages and use flexible styles.
- **Version Drift**: Expo or React Navigation major upgrades may introduce breaking changes. Mitigation: lock to tested versions and plan regular maintenance.

---

This PRD serves as the single source of truth for the WordPress-powered Expo Blog app. It covers everything from core features, user journey, and technology choices to constraints and pitfalls. Subsequent documents (Tech Stack Details, Frontend Guidelines, Backend Structure) should reference these clear requirements to avoid ambiguity and ensure a smooth development process.