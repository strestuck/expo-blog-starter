# Security Guidelines for Expo Blog Starter (WordPress Edition)

## Introduction
This document defines security best practices and design principles for the Expo Blog Starter adapted to a WordPress–powered React Native application. It aligns with Security by Design, Defense in Depth, and Least Privilege to ensure a robust, maintainable, and secure mobile blog client.

---

## 1. Authentication & Access Control

- **Use Secure Token-Based Authentication**
  - Leverage WordPress JWT or OAuth 2.0 plugin for user authentication.
  - Validate `exp` (expiration) and `iat` (issued at) claims in tokens.
  - Reject tokens with unsupported algorithms or missing signatures.

- **Secure Token Storage**
  - Store JWTs or access tokens in device-secure storage (SecureStore on iOS/Android, Keychain) instead of AsyncStorage.
  - Mark stored tokens as non-exportable and enforce OS-level encryption.

- **Session & Credential Management**
  - Implement idle and absolute session timeouts; force reauthentication when tokens expire.
  - Provide a clear logout function that revokes tokens and clears storage.
  - Use HTTP-only, Secure cookies only if you bridge via a WebView—not recommended for native flows.

- **Role-Based Access Control (RBAC)**
  - Define minimal scopes for token issuance (e.g., read-only for public content, elevated for admin).
  - Validate roles server-side on WordPress before returning protected resources.
  - Do not rely solely on client checks—always enforce permissions on the server.

---

## 2. Input Handling & Processing

- **Prevent Injection Attacks**
  - Sanitize HTML content fetched via WordPress before rendering in `react-native-render-html`.
  - Use a reputable sanitizer (e.g., DOMPurify or sanitize-html) on the server or in a trusted backend layer.

- **Safe Rendering of HTML**
  - Configure `react-native-render-html` with strict whitelists for tags and attributes.
  - Disable inline scripts and event handlers in rendered content.

- **Validate & Sanitize User Inputs**
  - If the app allows comment posting or form submissions, validate input length, type, and character sets.
  - Escape all inputs before sending to the API to prevent XSS or other injection vectors.

- **File Handling**
  - If supporting image uploads, restrict file types (JPEG, PNG), size limits, and scan for malware.
  - Generate randomized filenames and store files outside the public root in WordPress.

---

## 3. Data Protection & Privacy

- **Encrypt Data in Transit**
  - Enforce HTTPS (TLS 1.2+) for all `axios` calls to the WordPress REST API.
  - Validate TLS certificates; consider certificate pinning for production builds.

- **Encrypt Data at Rest**
  - Protect sensitive caches (e.g., offline article storage) using OS-level encrypted file storage.

- **Secret Management**
  - Do not hardcode API keys, client secrets, or tokens in code or configuration files.
  - Use Expo Config Plugins to inject secrets from environment variables or a secure secrets manager at build time.

- **Error & Log Handling**
  - Avoid logging sensitive data (tokens, PII, full URLs with query parameters).
  - Sanitize stack traces and disable debug logs in production.

- **Privacy Compliance**
  - Collect only necessary Personal Data (e.g., email for login).
  - Provide clear privacy notice if collecting analytics or crash reports (e.g., via Sentry).

---

## 4. API & Service Security

- **Rate Limiting & Throttling**
  - Implement client-side rate limiting for actions like login retries to slow brute-force attacks.
  - Encourage server-side rate limits on WordPress (via plugins or WAF).

- **Secure CORS & Origins (for Web Builds)**
  - If enabling web output, restrict allowed origins to your domain.
  - Deny credentialed requests from untrusted origins.

- **Minimal Data Exposure**
  - Fetch only required fields (`id`, `title`, `excerpt`) instead of full posts when listing articles.
  - Use WordPress REST API query parameters to limit fields and page sizes.

- **Appropriate HTTP Methods**
  - Use GET for reads, POST for new resources, PUT/PATCH for updates, DELETE for removals.
  - Reject side-effectful GET requests.

---

## 5. Mobile App Security Hygiene

- **Secure Storage vs. Local Storage**
  - Never store tokens or PII in insecure storage (e.g., AsyncStorage).
  - Use SecureStore or Keychain with `accessibleWhenUnlocked` policies.

- **Disable Debug & Developer Tools**
  - Remove or disable React Native dev menus and remote debugging in production builds.
  - Strip out console logs and Reactotron integrations before release.

- **Security Headers for Web Views**
  - If embedding WordPress web pages in a WebView, enforce `X-Frame-Options: DENY` and CSP.

- **Subresource Integrity (SRI)**
  - When loading third-party scripts (e.g., analytics), include SRI hashes.

---

## 6. Infrastructure & Configuration Management

- **Secure Build & Deployment**
  - Store build credentials (keystores, provisioning profiles) in a secure CI vault (e.g., GitHub Secrets).
  - Use EAS (Expo Application Services) with restricted roles.

- **Keep Dependencies & OS Updated**
  - Patch React Native, Expo SDK, and all native modules regularly.
  - Monitor CVEs for transitive dependencies via Dependabot or Snyk.

- **Network Ports & Services**
  - For any local development servers, bind to `localhost` only.
  - Disable unused features in WordPress (XML-RPC, REST endpoints not in use).

---

## 7. Dependency Management

- **Vet & Lock Dependencies**
  - Use `package-lock.json` or `yarn.lock` to ensure deterministic installs.
  - Audit dependencies with `npm audit` or `yarn audit` in CI pipelines.

- **Minimize Footprint**
  - Include only required packages (e.g., avoid large polyfills if targeting modern mobile OS versions).

- **Continuous Scanning**
  - Integrate a Software Composition Analysis (SCA) tool to detect new vulnerabilities.

---

## Conclusion
By adhering to these security guidelines, the Expo Blog Starter (WordPress Edition) will provide a resilient, privacy-respecting, and maintainable mobile application. Regular security reviews and automated scanning should be integrated into your development workflow to detect and remediate vulnerabilities early.