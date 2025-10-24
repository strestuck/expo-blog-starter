# Frontend Guideline Document

This document outlines the architecture, design principles, and technologies used in our Expo-based React Native blog application. It is written in everyday language so that team members from all backgrounds can understand the setup, tools, and best practices for building and maintaining the app.

## 1. Frontend Architecture

Our frontend is built on top of Expo SDK 52 and React Native. Here’s how it’s structured:

- **Core Framework**: Expo SDK 52 provides the cross-platform foundation, handling native builds, asset management, and development tools.
- **UI Library**: React Native drives the user interface across iOS, Android, and Web.
- **Component-Driven Design**: We split the UI into small, reusable components (e.g., ThemedText, ThemedView, CarouselCard). Each component lives in the `components/` folder and focuses on one piece of UI.
- **API Layer**: All network calls live in `src/api/index.ts`, using an Axios instance to talk to the WordPress REST API. Functions like `getPosts()` and `getCategories()` return typed data.
- **Navigation**: We use React Navigation (Stack Navigator) in `src/navigation/AppNavigator.tsx`. This replaces file-based routing with explicit, programmatic control over screen flows, headers, and params.
- **Theming**: A light/dark theme system is powered by a `useThemeColor` hook and `constants/Colors.ts`. All components use theme-aware styles.

This architecture supports:

- **Scalability**: New screens, features, and components slot into folders like `screens/`, `api/`, `hooks/` without disrupting existing code.
- **Maintainability**: Small, focused modules and clear folder conventions make it easy to find and update pieces of the app.
- **Performance**: Lazy-loading of images and dynamic imports keep initial load small. Themed components avoid inline styles scattered across the codebase.

## 2. Design Principles

We follow these guiding principles to ensure a great user experience:

- **Usability**: Simple and familiar interface patterns—lists, carousels, and detail screens—make the app intuitive.
- **Accessibility**: All interactive elements include `accessibilityLabel` and `accessibilityRole`. Text sizes respect system settings, and color contrast meets WCAG 2.1 guidelines.
- **Responsiveness**: Flexible layouts (Flexbox) adapt to different screen sizes. The app also supports portrait and landscape orientations.
- **Consistency**: Reusable themed components ensure a uniform look-and-feel across screens and features.

In practice, this means:

- Buttons and touch targets meet minimum size standards.
- Focus states and color contrast are tested on both light and dark modes.
- Navigation patterns follow platform conventions (e.g., back button on Android).

## 3. Styling and Theming

### Styling Approach

- We use React Native’s built-in `StyleSheet` along with a theme hook (`useThemeColor`) to apply colors and spacing.
- CSS methodologies (like BEM) are replaced with a component-level approach: each component file has its own styles object, named clearly for the component’s parts.
- No external CSS frameworks are used—styles live with the component code for clarity.

### Theming and Color Palette

All colors reside in `constants/Colors.ts`. We support both light and dark modes:

Light theme:
- Background: #FFFFFF
- Text Primary: #000000
- Text Secondary: #555555
- Primary Accent: #3478F6
- Secondary Accent: #F68B34
- Surface (cards, panels): #F7F7F7

Dark theme:
- Background: #000000
- Text Primary: #FFFFFF
- Text Secondary: #CCCCCC
- Primary Accent: #3478F6
- Secondary Accent: #F68B34
- Surface: #1A1A1A

The app uses a **modern flat design** style: minimal shadows, crisp edges, and vibrant accent colors.

### Typography

We use the platform’s system fonts for performance and familiarity:
- iOS: San Francisco (system font)
- Android: Roboto (system font)

Font sizes follow a typographic scale:
- Heading 1: 28pt
- Heading 2: 22pt
- Body Text: 16pt
- Small Text: 14pt

## 4. Component Structure

We follow a component-based architecture:

- **Folder Organization**: `components/` contains all shared UI pieces. `screens/` holds high-level views built from those components.
- **Reusability**: Each component focuses on one responsibility (e.g., CarouselCard displays a post image and title). This encourages reuse across Home, Categories, and Detail screens.
- **Naming**: Files use PascalCase (e.g., `PostListItem.tsx`). Styles within each file use a `styles` object to avoid global collisions.

Benefits:
- Easier to test and maintain.
- Clear separation between data fetching (in screens) and UI rendering (in components).

## 5. State Management

We manage state primarily with React Hooks and lightweight libraries:

- **Local Component State**: `useState` and `useEffect` handle loading, data, and error states within screens.
- **Context API**: A `ThemeContext` and `I18nextProvider` wrap the app to share theme and language settings globally.
- **Data Fetching & Caching**: We recommend using TanStack Query (`react-query`) for posts and categories if the app grows. It handles caching, background refetching, and built-in retry logic.

This approach keeps state local when possible and shared only when necessary, reducing complexity.

## 6. Routing and Navigation

We use React Navigation’s stack navigator:

- **NavigationContainer**: Wraps the app entry point in `App.tsx`, managing navigation state.
- **createStackNavigator**: In `src/navigation/AppNavigator.tsx`, we declare screens:
  - HomeScreen
  - PostDetailScreen
  - CategoriesScreen
- **Params & Headers**: We pass `postId` when navigating to details. Custom header buttons (like the language switcher) are configured via screen options.
- **Deep Linking**: The navigator can be extended to support URLs if needed.

Benefits:
- Full control over transitions and headers.
- Easy to add modals and nested navigators in the future.

## 7. Performance Optimization

We employ several strategies to keep the app snappy:

- **Lazy Loading**: Screens and heavy dependencies (e.g., `react-native-render-html`) can be loaded only when needed via dynamic imports.
- **Code Splitting**: With Expo’s managed workflow, unused code isn’t bundled in production builds.
- **Asset Optimization**: Images are sized appropriately and served from optimized URLs. We preload critical assets on app launch if necessary.
- **Memoization**: Components that render lists or carousels use `React.memo` and `useCallback` to avoid unnecessary re-renders.
- **Animation Performance**: We use `react-native-reanimated` for smooth and native-driven animations.

## 8. Testing and Quality Assurance

We maintain high code quality with these practices:

- **Unit Tests**: Jest is our test runner. We mock Axios calls (e.g., with `axios-mock-adapter`) to test `getPosts` and `getCategories` functions.
- **Component Tests**: We use React Native Testing Library (`@testing-library/react-native`) to verify component rendering, user interactions, and accessibility props.
- **End-to-End Tests**: Detox is used for automated E2E tests on simulators, covering critical flows like login, fetching posts, and navigation.
- **Linting & Formatting**: ESLint with recommended React Native rules and Prettier keep code style consistent.
- **Continuous Integration**: On each PR, tests and lint checks run automatically to catch regressions early.

## 9. Conclusion and Overall Frontend Summary

This document described how our Expo and React Native blog app is put together:

- A **scalable architecture** with clear folders for components, screens, API, navigation, and hooks.
- **Design principles** that prioritize usability, accessibility, and consistency.
- A **modern flat style** with light/dark theming, system fonts, and a cohesive color palette.
- **Component-driven** development for maintainability and reuse.
- **Simple state management** with React Hooks, Context API, and optional TanStack Query for data.
- **Explicit navigation** using React Navigation’s stack system.
- **Performance improvements** through lazy loading, memoization, and optimized assets.
- **Robust testing** at unit, integration, and E2E levels.

By following these guidelines, any developer—regardless of experience level—can understand, extend, and maintain the frontend of this WordPress-powered blog application with confidence and clarity.