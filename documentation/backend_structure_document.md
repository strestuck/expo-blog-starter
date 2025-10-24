# Backend Structure Document

This document provides a clear, step-by-step overview of the backend setup for the headless WordPress blog powering our Expo/React Native mobile app. You’ll find explanations of the architecture, databases, APIs, hosting, security, and more—all in plain, everyday language.

## 1. Backend Architecture

Our backend is built on a *headless* WordPress installation that serves content exclusively through a RESTful API. Here’s how it’s organized:

•  **WordPress Core (PHP + Plugins)**  
   - Acts as the content management system (CMS) and data source.  
   - Uses WordPress’s own MVC-style structure (models: database tables, views: admin screens, controllers: REST API endpoints).

•  **RESTful API Layer**  
   - Powered by the built-in WP REST API plus a JWT Authentication plugin for secure access.  
   - Exposes posts, pages, categories, users, media, and any custom data via clear HTTP endpoints.

•  **Decoupling / Headless Pattern**  
   - The front end lives in the Expo app; it never renders PHP templates.  
   - All data flows over JSON through fetch/axios calls.

How this supports our goals:

•  **Scalability**  
   - Web servers (PHP/Nginx) can be scaled horizontally behind a load balancer.  
   - Database is separated (AWS RDS), making it easy to upgrade, replicate, or shard.

•  **Maintainability**  
   - Clear separation between CMS (WordPress) and client (React Native).  
   - Configuration and custom code live in version control; updates are automated.

•  **Performance**  
   - Caching layers (Redis Object Cache and CDN) reduce load and accelerate API responses.  
   - Asset offloading (media to S3) keeps servers lean.

## 2. Database Management

We use a standard MySQL relational database to store all blog data:

•  **Type:** SQL (relational)  
•  **System:** Amazon RDS for MySQL (version 5.7+ or 8.0)  

Data is organized into WordPress’s conventional tables (posts, users, terms, etc.). Key practices:

•  **Normalized Schema** separates posts, categories, and user data to avoid duplication.  
•  **Backups & Replication** run daily automated snapshots and enable read replicas for reporting.  
•  **Security & Access Control**: The database sits in a private subnet; only the web servers (via an IAM role) can reach it.

## 3. Database Schema

Below is a human-readable summary of the main tables our app relies on. Following that is a simplified SQL definition.

### Human-Readable Table Descriptions

•  **wp_posts**  
   - Stores each blog item (posts, pages).  
   - Key fields: `ID`, `post_author`, `post_date`, `post_title`, `post_content`, `post_status`, `post_type`, `post_name` (slug).

•  **wp_terms**  
   - Holds category and tag names.  
   - Fields: `term_id`, `name`, `slug`, `taxonomy` (e.g., category, post_tag).

•  **wp_term_relationships**  
   - Maps posts to terms.  
   - Fields: `object_id` (post ID), `term_taxonomy_id` (from wp_terms).

•  **wp_users**  
   - User accounts for authors or administrators.  
   - Fields: `ID`, `user_login`, `user_email`, `user_registered`.

### Simplified SQL Schema (MySQL)

```sql
CREATE TABLE wp_posts (
  ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_author BIGINT UNSIGNED NOT NULL,
  post_date DATETIME NOT NULL,
  post_title TEXT NOT NULL,
  post_content LONGTEXT NOT NULL,
  post_status VARCHAR(20) NOT NULL,
  post_type VARCHAR(20) NOT NULL,
  post_name VARCHAR(200) NOT NULL,
  INDEX(post_type, post_status)
);

CREATE TABLE wp_terms (
  term_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  taxonomy VARCHAR(32) NOT NULL,
  UNIQUE KEY (slug, taxonomy)
);

CREATE TABLE wp_term_relationships (
  object_id BIGINT UNSIGNED NOT NULL,
  term_taxonomy_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (object_id, term_taxonomy_id)
);

CREATE TABLE wp_users (
  ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_login VARCHAR(60) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  user_registered DATETIME NOT NULL,
  UNIQUE KEY (user_login),
  UNIQUE KEY (user_email)
);
```

> Note: The real WordPress database contains many more tables for metadata, options, comments, etc. We’ve shown only the core tables used by our mobile app.

## 4. API Design and Endpoints

We rely on the WordPress REST API, which follows standard RESTful conventions. Below are the key endpoints:

•  **Retrieve all posts**  
   GET `/wp-json/wp/v2/posts`  
   - Params: `page`, `per_page`, `categories`, `search`  
   - Returns an array of post objects (id, title, excerpt, featured_media URL).

•  **Retrieve a single post**  
   GET `/wp-json/wp/v2/posts/{id}`  
   - Replace `{id}` with the post ID  
   - Returns full post content (HTML), author ID, date, and embedded media.

•  **Retrieve categories**  
   GET `/wp-json/wp/v2/categories`  
   - Params: `hide_empty`, `per_page`  
   - Returns id, name, slug, post_count.

•  **Authenticate user (optional)**  
   POST `/wp-json/jwt-auth/v1/token`  
   - Body: `username`, `password`  
   - Returns a JWT token for protected calls (e.g., posting comments).

•  **Filter by category**  
   GET `/wp-json/wp/v2/posts?categories={category_id}`  

•  **Search**  
   GET `/wp-json/wp/v2/posts?search={query}`

All responses are JSON. Our mobile app uses axios to wrap these calls, handle errors, and retry if necessary.

## 5. Hosting Solutions

We recommend a cloud-based setup on AWS for reliability and cost control:

•  **Web Servers:**  
   - EC2 instances (Auto Scaling Group) behind an Elastic Load Balancer (ALB).  
   - Each instance runs Nginx + PHP (FPM) with the WordPress code.

•  **Database:**  
   - Amazon RDS for MySQL with Multi-AZ deployment.  
   - Automated daily snapshots and point-in-time recovery.

•  **Media Storage:**  
   - WordPress Offload Media plugin to store images and videos in Amazon S3.  
   - CloudFront distribution fronts S3 for fast global delivery.

Benefits:

•  **Reliability:** Redundancy at every layer (multi-AZ DB, auto-scaled web tier).  
•  **Scalability:** Add more web nodes or increase DB instance size on demand.  
•  **Cost-effectiveness:** Pay-as-you-go pricing; turn off non-production servers at night.

## 6. Infrastructure Components

Here’s how our pieces fit together to speed up content delivery:

•  **Elastic Load Balancer (ALB)**  
   - Routes user requests across healthy EC2 instances.  
   - Performs health checks to avoid routing to unhealthy servers.

•  **Redis Object Cache**  
   - Caches frequent database queries (like recent posts) in memory.  
   - Reduces load on RDS and speeds up API response times.

•  **Amazon CloudFront (CDN)**  
   - Serves static assets (images, CSS, JS) from edge locations worldwide.  
   - Integrated with S3 for media offloading.

•  **Route 53 DNS**  
   - Provides a single, friendly domain.  
   - Health-checks and can fail over to standby regions.

•  **Auto Scaling**  
   - Scales EC2 count based on CPU or request rate thresholds.  
   - Ensures consistent performance under traffic spikes.

## 7. Security Measures

We apply multiple layers of defense to protect user data and content:

•  **Transport Security (HTTPS)**  
   - All endpoints are secured by TLS certificates (ACM + ALB).

•  **Authentication & Authorization**  
   - Public endpoints remain open for reading posts and categories.  
   - Protected actions (e.g., comments, user profile edits) require a JWT token from the `jwt-auth` plugin.

•  **Web Application Firewall (WAF)**  
   - AWS WAF rules block common threats (SQL injection, XSS).  
   - Rate limiting rules prevent brute-force attempts.

•  **Secure Server Configuration**  
   - Nginx is locked down with strict headers (HSTS, X-Frame-Options).  
   - PHP runs under a non-root user; file permissions follow the principle of least privilege.

•  **Database Security**  
   - RDS sits in a private subnet with no public IP.  
   - Access via IAM roles and security groups only from the web tier.

## 8. Monitoring and Maintenance

To keep everything running smoothly, we use:

•  **CloudWatch Metrics & Alarms**  
   - Tracks CPU, memory, disk I/O on EC2 and RDS.  
   - Triggers alerts (email or Slack) on threshold breaches.

•  **Centralized Logging**  
   - Nginx and PHP-FPM logs shipped to CloudWatch Logs or ELK Stack.  
   - Custom log patterns detect 5xx errors, slow queries.

•  **Application Performance Monitoring**  
   - New Relic (or Datadog) for end-to-end tracing of API calls.  
   - Dashboards show slow endpoints and error rates.

•  **Automated Backups & Patching**  
   - RDS daily snapshots and minor version auto-updates.  
   - EC2 instances receive regular OS security patches via AWS Systems Manager.

•  **Disaster Recovery**  
   - Standby DB in a second region.  
   - AMI snapshots of web servers stored cross-region.

## 9. Conclusion and Overall Backend Summary

Our backend is a robust, headless WordPress installation designed for modern mobile apps. Key takeaways:

•  **Clean Separation**  
   - WordPress handles content; Expo/React Native handles presentation.  
   - Communication happens over simple, well-documented REST endpoints.

•  **Scalable & Reliable**  
   - AWS services (EC2, RDS, S3, CloudFront) provide durability and on-demand growth.  
   - Auto scaling and multi-AZ deployments keep downtime to a minimum.

•  **Fast & Secure**  
   - Redis caching and CDN accelerate data delivery.  
   - TLS, WAF, JWT, and private networking guard against threats.

•  **Easy to Maintain**  
   - Infrastructure as code (CloudFormation/Terraform) can spin up the entire stack with a single command.  
   - Monitoring and backups are automated, ensuring we catch issues early.

By following this structure, any developer—regardless of background—can understand how the backend is built, how it stays fast and secure, and how to extend or troubleshoot it in the future.