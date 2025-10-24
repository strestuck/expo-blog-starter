# App Flow Document

## Onboarding and Sign-In/Sign-Up

When a user installs and opens the app for the first time, they briefly see a splash screen displaying the app logo and a loading indicator. In this version of the blog reader there is no sign-up or sign-in process. Users are granted immediate access to the content without creating an account. If authentication is added later, a sign-in screen would replace the splash screen, offering email/password and social login methods, along with a link to recover forgotten passwords. For now, the app transitions directly from the splash screen into the main interface, allowing anyone to browse posts right away.

## Main Dashboard or Home Page

Once the splash screen fades, the user lands on the Home tab of the main interface. At the top is a header bar that displays the app name on the left and a language toggle on the right. Switching the language button cycles between English and Indonesian, instantly updating all text across the app. Below the header sits a featured-posts carousel, which automatically scrolls through highlighted articles. Under this carousel, the user finds a list of recent posts rendered in a vertically scrolling feed. At the bottom of the screen is a tab bar with two icons: Home and Categories. The Home tab remains active by default. Tapping the Categories icon moves the user to the Categories view. The header bar and language toggle persist as the user moves between tabs, ensuring consistent navigation and language control.

## Detailed Feature Flows and Page Transitions

When a user swipes or taps through the featured-posts carousel on the Home tab, they see larger previews of each post. Tapping on any post card navigates to the PostDetail screen. The PostDetail screen slides in from the right and displays the full post title, author information, date, and the article content rendered with an HTML layout component. A share button in the header lets the user open the system share sheet to share the post link outside the app. Pressing the back arrow in the header returns the user to the previous scroll position on the Home tab.

Switching to the Categories tab shows a vertical list of categories fetched from the WordPress API. Each category is presented with its name and the number of posts it contains. When the user taps a category entry, the app navigates to a CategoryPosts screen that displays a feed similar to the Home feed but filtered to that single category. Scrolling through that feed and tapping any post again opens the same PostDetail screen. Returning from the detail view brings the user back to the category feed in its previous scroll position, and pressing the back button on the category feed returns to the Categories list.

Throughout these flows, data is fetched live via an Axios-based service layer. Each screen triggers its API calls when it mounts, managing loading and error states internally. Navigation parameters carry identifiers such as `postId` or `categoryId` to ensure the correct data is requested on each screen.

## Settings and Account Management

While this app does not require personal account settings, it does provide a Settings screen to control language and theme preferences. From any tab, the user can tap a gear icon in the header to open the Settings screen. Here, the user finds options to select between English and Indonesian explicitly and to override the system theme mode between light and dark. Changing either option updates the app appearance and text instantly. Once the user taps the “Back” button in the header of Settings, they are returned to whichever screen they came from, with their newly selected preferences applied automatically.

## Error States and Alternate Paths

If the app fails to fetch data due to network problems or API errors, each screen displays a friendly error message in the center of the view. Below the message, a retry button appears. Tapping the retry button triggers the data-fetching function again. While retrying, a loading spinner replaces the button. If the retry succeeds, the content appears normally; if it fails again, the same error message and retry option are shown. If the user loses internet connectivity while on the PostDetail screen, they can press back to return to previously viewed content on Home or Categories. In offline scenarios, cached data remains visible if it was loaded earlier, allowing the user to continue reading already fetched posts.

## Conclusion and Overall App Journey

A typical user journey begins with launching the app, passing quickly through the splash screen into the Home tab. From Home, they can scroll highlighted posts, tap any article to read its full content, and share links. Alternately, they switch to the Categories tab to explore posts by topic, drilling down into category feeds before tapping into details. At any point, the user can open Settings to change the language or theme and then resume browsing. If an error occurs, the user sees a clear message and can retry fetching content. Without any barriers to entry, the app lets readers discover, filter, and read WordPress blog posts seamlessly until they close or background the application.